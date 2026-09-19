import { HttpException, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { hashPassword } from '../common/password';

const appConfig = {
  jwtAccessSecret: 'test-access-secret-not-real',
  jwtRefreshSecret: 'test-refresh-secret-not-real',
  accessTokenTtl: '15m',
  refreshTokenTtl: '7d',
  loginMaxFailuresPerEmail: 3,
  loginMaxFailuresPerIp: 50,
  loginFailureWindowSeconds: 900,
};

function makeService(prismaOverrides: Record<string, unknown> = {}) {
  const prisma = {
    refreshToken: { findFirst: jest.fn(), updateMany: jest.fn(), create: jest.fn().mockResolvedValue({}) },
    user: { findUnique: jest.fn() },
    ...prismaOverrides,
  };
  const jwt = { sign: jest.fn().mockReturnValue('signed.jwt.token') };
  const config = { getOrThrow: jest.fn().mockReturnValue(appConfig) };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const service = new AuthService(prisma as any, jwt as any, config as any);
  return { service, prisma, jwt };
}

const storedToken = (isActive: boolean) => ({
  id: 'tok-1',
  user: { id: 'user-1', email: 'u@e2e.invalid', isActive, roles: [{ role: { name: 'CUSTOMER' } }], customerUser: null, supplierUser: null },
});

describe('AuthService.refresh', () => {
  it('rejects a deactivated user and revokes all of that user\'s refresh tokens (regression)', async () => {
    const { service, prisma, jwt } = makeService();
    prisma.refreshToken.findFirst.mockResolvedValue(storedToken(false));

    await expect(service.refresh('raw-token')).rejects.toBeInstanceOf(UnauthorizedException);

    expect(prisma.refreshToken.updateMany).toHaveBeenCalledWith({
      where: { userId: 'user-1', revokedAt: null },
      data: { revokedAt: expect.any(Date) },
    });
    expect(jwt.sign).not.toHaveBeenCalled();
    expect(prisma.refreshToken.create).not.toHaveBeenCalled();
  });

  it('rotates the token for an active user (old token consumed, new pair issued)', async () => {
    const { service, prisma } = makeService();
    prisma.refreshToken.findFirst.mockResolvedValue(storedToken(true));
    prisma.refreshToken.updateMany.mockResolvedValue({ count: 1 });

    const tokens = await service.refresh('raw-token');

    expect(tokens.accessToken).toBe('signed.jwt.token');
    expect(prisma.refreshToken.updateMany).toHaveBeenCalledWith({
      where: { id: 'tok-1', revokedAt: null },
      data: { revokedAt: expect.any(Date) },
    });
    expect(prisma.refreshToken.create).toHaveBeenCalledTimes(1);
  });

  it('rejects when a concurrent request already consumed the token', async () => {
    const { service, prisma, jwt } = makeService();
    prisma.refreshToken.findFirst.mockResolvedValue(storedToken(true));
    prisma.refreshToken.updateMany.mockResolvedValue({ count: 0 });

    await expect(service.refresh('raw-token')).rejects.toBeInstanceOf(UnauthorizedException);
    expect(jwt.sign).not.toHaveBeenCalled();
  });
});

describe('AuthService.login rate limiting', () => {
  it('returns the same 401 for unknown email and wrong password, then a generic 429 after the limit', async () => {
    const realHash = await hashPassword('Correct-Horse-9');
    const { service, prisma } = makeService();
    prisma.user.findUnique.mockImplementation(async ({ where }: { where: { email: string } }) =>
      where.email === 'known@e2e.invalid'
        ? { id: 'u1', email: where.email, passwordHash: realHash, isActive: true, roles: [], customerUser: null, supplierUser: null }
        : null,
    );

    const messages: string[] = [];
    for (const email of ['known@e2e.invalid', 'ghost@e2e.invalid']) {
      const err = await service.login({ email, password: 'wrong-password' }, '9.9.9.9').catch((e) => e);
      expect(err).toBeInstanceOf(UnauthorizedException);
      messages.push(err.message);
    }
    expect(messages[0]).toBe(messages[1]);

    // exhaust the per-(ip,email) budget for both an existing and a non-existing email
    const blocked: string[] = [];
    for (const email of ['known@e2e.invalid', 'ghost@e2e.invalid']) {
      for (let i = 0; i < 2; i++) await service.login({ email, password: 'wrong-password' }, '9.9.9.9').catch(() => undefined);
      const err = await service.login({ email, password: 'wrong-password' }, '9.9.9.9').catch((e) => e);
      expect(err).toBeInstanceOf(HttpException);
      expect((err as HttpException).getStatus()).toBe(429);
      blocked.push(err.message);
    }
    expect(blocked[0]).toBe(blocked[1]);
  });

  it('a deactivated user cannot log in and gets the same generic 401', async () => {
    const realHash = await hashPassword('Correct-Horse-9');
    const { service, prisma } = makeService();
    prisma.user.findUnique.mockResolvedValue({ id: 'u2', email: 'off@e2e.invalid', passwordHash: realHash, isActive: false, roles: [], customerUser: null, supplierUser: null });
    const err = await service.login({ email: 'off@e2e.invalid', password: 'Correct-Horse-9' }, '8.8.8.8').catch((e) => e);
    expect(err).toBeInstanceOf(UnauthorizedException);
    expect(err.message).toBe('Invalid email or password');
  });
});
