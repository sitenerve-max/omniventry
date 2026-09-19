import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { RoleName } from '@prisma/client';
import { AppConfig } from '../config/configuration';
import { PrismaService } from '../prisma/prisma.module';
import { AuthenticatedUser } from './guards';

interface AccessTokenPayload {
  sub: string;
  email: string;
  roles: RoleName[];
  customerId?: string;
  supplierId?: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<AppConfig>('app').jwtAccessSecret,
    });
  }

  /**
   * Besides the signature/expiry check, confirms the account still exists and is active, so
   * deactivating a user takes effect immediately rather than when their access token expires.
   * Cost: one primary-key lookup per authenticated request (cache it if this ever becomes hot).
   */
  async validate(payload: AccessTokenPayload): Promise<AuthenticatedUser> {
    const account = await this.prisma.user.findUnique({ where: { id: payload.sub }, select: { isActive: true } });
    if (!account || !account.isActive) {
      throw new UnauthorizedException('Account is not active');
    }
    return {
      userId: payload.sub,
      email: payload.email,
      roles: payload.roles,
      customerId: payload.customerId,
      supplierId: payload.supplierId,
    };
  }
}
