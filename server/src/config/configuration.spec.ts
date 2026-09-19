import { parseTrustProxy } from './configuration';

describe('parseTrustProxy', () => {
  it('defaults to false (forwarded headers ignored) when unset, empty or "false"', () => {
    expect(parseTrustProxy(undefined)).toBe(false);
    expect(parseTrustProxy('')).toBe(false);
    expect(parseTrustProxy('  false ')).toBe(false);
    expect(parseTrustProxy('0')).toBe(false);
  });

  it('refuses "true", which would trust every client-supplied X-Forwarded-For', () => {
    expect(() => parseTrustProxy('true')).toThrow(/every client-supplied/);
    expect(() => parseTrustProxy('TRUE')).toThrow();
  });

  it('accepts a hop count', () => {
    expect(parseTrustProxy('1')).toBe(1);
    expect(parseTrustProxy('2')).toBe(2);
  });

  it('accepts trusted proxy names / addresses / CIDRs', () => {
    expect(parseTrustProxy('loopback')).toBe('loopback');
    expect(parseTrustProxy('10.0.0.0/8, 192.168.1.5')).toBe('10.0.0.0/8, 192.168.1.5');
  });

  it('rejects garbage', () => {
    expect(() => parseTrustProxy('$(rm -rf)')).toThrow(/invalid/);
  });
});
