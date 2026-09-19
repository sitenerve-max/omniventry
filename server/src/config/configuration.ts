/** Express `trust proxy` value: false (default), a hop count, or a list of trusted proxy names/IPs/CIDRs. */
export type TrustProxySetting = false | number | string;

/**
 * Parses TRUST_PROXY. Deliberately rejects "true": that makes Express trust every client-supplied
 * X-Forwarded-For header, letting anyone spoof their IP and bypass IP-based limits.
 */
export function parseTrustProxy(raw: string | undefined): TrustProxySetting {
  const value = (raw ?? '').trim();
  if (value === '' || value.toLowerCase() === 'false') return false;
  if (value.toLowerCase() === 'true') {
    throw new Error(
      'TRUST_PROXY=true would trust every client-supplied X-Forwarded-For header. ' +
        'Use a hop count (e.g. 1) or a list of trusted proxy IPs/CIDRs/names (e.g. loopback, 10.0.0.0/8).',
    );
  }
  if (/^\d+$/.test(value)) {
    const hops = parseInt(value, 10);
    return hops > 0 ? hops : false;
  }
  if (!/^[A-Za-z0-9.:,/_\-\s]+$/.test(value)) {
    throw new Error(`TRUST_PROXY has an invalid value: "${value}"`);
  }
  return value;
}

export interface AppConfig {
  nodeEnv: string;
  port: number;
  frontendOrigin: string;
  databaseUrl: string;
  jwtAccessSecret: string;
  jwtRefreshSecret: string;
  accessTokenTtl: string;
  refreshTokenTtl: string;
  loginMaxFailuresPerEmail: number;
  loginMaxFailuresPerIp: number;
  loginFailureWindowSeconds: number;
  trustProxy: TrustProxySetting;
}

export default (): { app: AppConfig } => ({
  app: {
    nodeEnv: process.env.NODE_ENV ?? 'development',
    port: parseInt(process.env.PORT ?? '4000', 10),
    frontendOrigin: process.env.FRONTEND_ORIGIN ?? 'http://localhost:3000',
    databaseUrl: required('DATABASE_URL'),
    jwtAccessSecret: required('JWT_ACCESS_SECRET'),
    jwtRefreshSecret: required('JWT_REFRESH_SECRET'),
    accessTokenTtl: process.env.ACCESS_TOKEN_TTL ?? '15m',
    refreshTokenTtl: process.env.REFRESH_TOKEN_TTL ?? '7d',
    loginMaxFailuresPerEmail: positiveInt('LOGIN_MAX_FAILURES_PER_EMAIL', 5),
    loginMaxFailuresPerIp: positiveInt('LOGIN_MAX_FAILURES_PER_IP', 50),
    loginFailureWindowSeconds: positiveInt('LOGIN_FAILURE_WINDOW_SECONDS', 900),
    trustProxy: parseTrustProxy(process.env.TRUST_PROXY),
  },
});

function positiveInt(name: string, fallback: number): number {
  const parsed = parseInt(process.env[name] ?? '', 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}
