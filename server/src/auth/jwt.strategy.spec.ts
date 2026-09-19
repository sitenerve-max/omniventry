import { UnauthorizedException } from '@nestjs/common';
import { JwtStrategy } from './jwt.strategy';

const config = { getOrThrow: () => ({ jwtAccessSecret: 'test-access-secret-not-real' }) };
const payload = { sub: 'user-1', email: 'u@e2e.invalid', roles: ['CUSTOMER' as const], customerId: 'cust-1' };

function make(account: { isActive: boolean } | null) {
  const prisma = { user: { findUnique: jest.fn().mockResolvedValue(account) } };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return { strategy: new JwtStrategy(config as any, prisma as any), prisma };
}

describe('JwtStrategy.validate', () => {
  it('accepts a valid token for an active user and exposes the request user', async () => {
    const { strategy, prisma } = make({ isActive: true });
    await expect(strategy.validate(payload)).resolves.toMatchObject({ userId: 'user-1', roles: ['CUSTOMER'], customerId: 'cust-1' });
    expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { id: 'user-1' }, select: { isActive: true } });
  });

  it('rejects an already-issued token once the user is deactivated (regression)', async () => {
    const { strategy } = make({ isActive: false });
    await expect(strategy.validate(payload)).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('rejects a token for a user that no longer exists', async () => {
    const { strategy } = make(null);
    await expect(strategy.validate(payload)).rejects.toBeInstanceOf(UnauthorizedException);
  });
});
