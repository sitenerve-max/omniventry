import { LoginAttemptLimiter } from './login-attempt-limiter';

describe('LoginAttemptLimiter', () => {
  const opts = { maxFailuresPerEmail: 3, maxFailuresPerIp: 5, windowMs: 1000 };
  let clock = 0;
  const make = () => new LoginAttemptLimiter(opts, () => clock);

  beforeEach(() => {
    clock = 10_000;
  });

  it('blocks an (ip, email) pair after the per-email limit, case-insensitively', () => {
    const limiter = make();
    for (let i = 0; i < 3; i++) limiter.recordFailure('1.1.1.1', 'A@x.test');
    expect(limiter.isBlocked('1.1.1.1', 'a@x.test')).toBe(true);
  });

  it('does not block a different email from the same ip below the ip limit', () => {
    const limiter = make();
    for (let i = 0; i < 3; i++) limiter.recordFailure('1.1.1.1', 'a@x.test');
    expect(limiter.isBlocked('1.1.1.1', 'b@x.test')).toBe(false);
  });

  it('blocks a whole ip once its total failures reach the ip limit', () => {
    const limiter = make();
    for (let i = 0; i < 5; i++) limiter.recordFailure('2.2.2.2', `user${i}@x.test`);
    expect(limiter.isBlocked('2.2.2.2', 'fresh@x.test')).toBe(true);
    expect(limiter.isBlocked('3.3.3.3', 'fresh@x.test')).toBe(false);
  });

  it('expires failures after the window', () => {
    const limiter = make();
    for (let i = 0; i < 3; i++) limiter.recordFailure('1.1.1.1', 'a@x.test');
    clock += 1001;
    expect(limiter.isBlocked('1.1.1.1', 'a@x.test')).toBe(false);
  });

  it('a successful login clears the (ip, email) counter', () => {
    const limiter = make();
    limiter.recordFailure('1.1.1.1', 'a@x.test');
    limiter.recordFailure('1.1.1.1', 'a@x.test');
    limiter.reset('1.1.1.1', 'a@x.test');
    limiter.recordFailure('1.1.1.1', 'a@x.test');
    expect(limiter.isBlocked('1.1.1.1', 'a@x.test')).toBe(false);
  });
});
