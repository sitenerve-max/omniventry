import { ConflictException, HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto';
import { RoleName } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.module';
import { AppConfig } from '../config/configuration';
import { hashPassword, verifyPassword } from '../common/password';
import { AuthenticatedUser } from './guards';
import { LoginDto, RegisterCustomerDto, RegisterSupplierDto } from './dto';
import { LoginAttemptLimiter } from './login-attempt-limiter';

interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface SessionUser extends AuthenticatedUser {
  name: string;
}

@Injectable()
export class AuthService {
  private readonly limiter: LoginAttemptLimiter;
  private dummyHash?: Promise<string>;

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {
    const app = this.config.getOrThrow<AppConfig>('app');
    this.limiter = new LoginAttemptLimiter({
      maxFailuresPerEmail: app.loginMaxFailuresPerEmail,
      maxFailuresPerIp: app.loginMaxFailuresPerIp,
      windowMs: app.loginFailureWindowSeconds * 1000,
    });
  }

  private getDummyHash(): Promise<string> {
    this.dummyHash ??= hashPassword(crypto.randomUUID());
    return this.dummyHash;
  }

  async registerCustomer(dto: RegisterCustomerDto): Promise<TokenPair> {
    await this.assertEmailAvailable(dto.email);
    const passwordHash = await hashPassword(dto.password);

    const user = await this.prisma.$transaction(async (tx) => {
      const role = await tx.role.upsert({
        where: { name: RoleName.CUSTOMER },
        create: { name: RoleName.CUSTOMER },
        update: {},
      });
      const customer = await tx.customer.create({
        data: { companyName: dto.companyName, gstNumber: dto.gstNumber, isVerified: false },
      });
      return tx.user.create({
        data: {
          email: dto.email.toLowerCase(),
          passwordHash,
          name: dto.name,
          phone: dto.phone,
          roles: { create: { roleId: role.id } },
          customerUser: { create: { customerId: customer.id } },
        },
        include: { roles: { include: { role: true } }, customerUser: true },
      });
    });

    return this.issueTokens({
      userId: user.id,
      email: user.email,
      roles: user.roles.map((r) => r.role.name),
      customerId: user.customerUser?.customerId,
    });
  }

  async registerSupplier(dto: RegisterSupplierDto): Promise<TokenPair> {
    await this.assertEmailAvailable(dto.email);
    const passwordHash = await hashPassword(dto.password);

    const user = await this.prisma.$transaction(async (tx) => {
      const role = await tx.role.upsert({
        where: { name: RoleName.SUPPLIER },
        create: { name: RoleName.SUPPLIER },
        update: {},
      });
      const supplier = await tx.supplier.create({
        data: {
          companyName: dto.companyName,
          gstNumber: dto.gstNumber,
          city: dto.city,
          state: dto.state,
          isVerified: false,
        },
      });
      return tx.user.create({
        data: {
          email: dto.email.toLowerCase(),
          passwordHash,
          name: dto.name,
          phone: dto.phone,
          roles: { create: { roleId: role.id } },
          supplierUser: { create: { supplierId: supplier.id } },
        },
        include: { roles: { include: { role: true } }, supplierUser: true },
      });
    });

    return this.issueTokens({
      userId: user.id,
      email: user.email,
      roles: user.roles.map((r) => r.role.name),
      supplierId: user.supplierUser?.supplierId,
    });
  }

  async login(dto: LoginDto, ip = 'unknown'): Promise<TokenPair> {
    const email = dto.email.toLowerCase();
    if (this.limiter.isBlocked(ip, email)) {
      // Same response whether or not the account exists.
      throw new HttpException('Too many login attempts. Please try again later.', HttpStatus.TOO_MANY_REQUESTS);
    }
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { roles: { include: { role: true } }, customerUser: true, supplierUser: true },
    });
    // Always run one bcrypt comparison (against a dummy hash when the user is missing) so response
    // time does not reveal whether the email is registered.
    const valid = await verifyPassword(dto.password, user?.passwordHash ?? (await this.getDummyHash()));
    if (!user || !user.isActive || !valid) {
      this.limiter.recordFailure(ip, email);
      throw new UnauthorizedException('Invalid email or password');
    }
    this.limiter.reset(ip, email);
    return this.issueTokens({
      userId: user.id,
      email: user.email,
      roles: user.roles.map((r) => r.role.name),
      customerId: user.customerUser?.customerId,
      supplierId: user.supplierUser?.supplierId,
    });
  }

  /** Rotates the refresh token: the presented token is revoked and a new pair is issued. */
  async refresh(rawRefreshToken: string): Promise<TokenPair> {
    const tokenHash = this.hashToken(rawRefreshToken);
    const stored = await this.prisma.refreshToken.findFirst({
      where: { tokenHash, revokedAt: null, expiresAt: { gt: new Date() } },
      include: {
        user: { include: { roles: { include: { role: true } }, customerUser: true, supplierUser: true } },
      },
    });
    if (!stored) {
      throw new UnauthorizedException('Refresh token is invalid or expired');
    }
    const { user } = stored;
    if (!user.isActive) {
      // Deactivated account: kill every session it still holds and refuse to issue new tokens.
      await this.prisma.refreshToken.updateMany({
        where: { userId: user.id, revokedAt: null },
        data: { revokedAt: new Date() },
      });
      throw new UnauthorizedException('Refresh token is invalid or expired');
    }
    // Atomic rotation: only one concurrent request can consume this refresh token.
    const claimed = await this.prisma.refreshToken.updateMany({
      where: { id: stored.id, revokedAt: null },
      data: { revokedAt: new Date() },
    });
    if (claimed.count !== 1) {
      throw new UnauthorizedException('Refresh token is invalid or expired');
    }

    return this.issueTokens({
      userId: user.id,
      email: user.email,
      roles: user.roles.map((r) => r.role.name),
      customerId: user.customerUser?.customerId,
      supplierId: user.supplierUser?.supplierId,
    });
  }

  async logout(rawRefreshToken: string): Promise<void> {
    const tokenHash = this.hashToken(rawRefreshToken);
    await this.prisma.refreshToken.updateMany({
      where: { tokenHash, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }

  async me(userId: string): Promise<SessionUser> {
    const user = await this.prisma.user.findUniqueOrThrow({
      where: { id: userId },
      include: { roles: { include: { role: true } }, customerUser: true, supplierUser: true },
    });
    return {
      userId: user.id,
      email: user.email,
      name: user.name,
      roles: user.roles.map((r) => r.role.name),
      customerId: user.customerUser?.customerId,
      supplierId: user.supplierUser?.supplierId,
    };
  }

  private async assertEmailAvailable(email: string): Promise<void> {
    const existing = await this.prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (existing) {
      throw new ConflictException('An account with this email already exists');
    }
  }

  private async issueTokens(user: AuthenticatedUser): Promise<TokenPair> {
    const { jwtAccessSecret, jwtRefreshSecret, accessTokenTtl, refreshTokenTtl } =
      this.config.getOrThrow<AppConfig>('app');

    const accessToken = this.jwt.sign(
      { sub: user.userId, email: user.email, roles: user.roles, customerId: user.customerId, supplierId: user.supplierId },
      { secret: jwtAccessSecret, expiresIn: accessTokenTtl },
    );
    const refreshToken = this.jwt.sign(
      { sub: user.userId, jti: crypto.randomUUID() },
      { secret: jwtRefreshSecret, expiresIn: refreshTokenTtl },
    );

    await this.prisma.refreshToken.create({
      data: {
        userId: user.userId,
        tokenHash: this.hashToken(refreshToken),
        expiresAt: addDuration(new Date(), refreshTokenTtl),
      },
    });

    return { accessToken, refreshToken };
  }

  private hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }
}

/** Parses simple "15m" / "7d" / "1h" durations used for JWT_*_TTL. */
function addDuration(base: Date, duration: string): Date {
  const match = /^(\d+)([smhd])$/.exec(duration);
  if (!match) {
    throw new Error(`Unsupported duration format: ${duration}`);
  }
  const amount = parseInt(match[1], 10);
  const unitMs = { s: 1000, m: 60_000, h: 3_600_000, d: 86_400_000 }[match[2] as 's' | 'm' | 'h' | 'd'];
  return new Date(base.getTime() + amount * unitMs);
}
