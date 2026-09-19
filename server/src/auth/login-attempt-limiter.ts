export interface LoginLimiterOptions {
  /** Max failed attempts for one (ip, email) pair inside the window. */
  maxFailuresPerEmail: number;
  /** Max failed attempts from one IP (any email) inside the window. */
  maxFailuresPerIp: number;
  windowMs: number;
}

const MAX_TRACKED_KEYS = 10_000;

/**
 * In-memory failed-login limiter, keyed per (ip, email) and per ip.
 *
 * Deliberately simple and suited to a single local/dev process: state is lost on restart and is
 * not shared across instances. A multi-instance deployment needs a shared store (e.g. Redis).
 * Failures are recorded identically for existing and non-existing emails, so the limiter never
 * reveals whether an account exists.
 */
export class LoginAttemptLimiter {
  private readonly failures = new Map<string, number[]>();

  constructor(
    private readonly options: LoginLimiterOptions,
    private readonly now: () => number = Date.now,
  ) {}

  private static emailKey(ip: string, email: string): string {
    return `e|${ip}|${email.trim().toLowerCase()}`;
  }

  private static ipKey(ip: string): string {
    return `i|${ip}`;
  }

  private recent(key: string): number[] {
    const cutoff = this.now() - this.options.windowMs;
    const list = (this.failures.get(key) ?? []).filter((t) => t > cutoff);
    if (list.length > 0) {
      this.failures.set(key, list);
    } else {
      this.failures.delete(key);
    }
    return list;
  }

  isBlocked(ip: string, email: string): boolean {
    return (
      this.recent(LoginAttemptLimiter.emailKey(ip, email)).length >= this.options.maxFailuresPerEmail ||
      this.recent(LoginAttemptLimiter.ipKey(ip)).length >= this.options.maxFailuresPerIp
    );
  }

  recordFailure(ip: string, email: string): void {
    if (this.failures.size >= MAX_TRACKED_KEYS) {
      // Bound memory: drop the oldest tracked key rather than growing without limit.
      const oldest = this.failures.keys().next().value;
      if (oldest !== undefined) this.failures.delete(oldest);
    }
    for (const key of [LoginAttemptLimiter.emailKey(ip, email), LoginAttemptLimiter.ipKey(ip)]) {
      const list = this.recent(key);
      list.push(this.now());
      this.failures.set(key, list);
    }
  }

  /** A successful login clears the (ip, email) counter, but not the per-IP counter. */
  reset(ip: string, email: string): void {
    this.failures.delete(LoginAttemptLimiter.emailKey(ip, email));
  }
}
