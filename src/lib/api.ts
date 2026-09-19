/**
 * Thin fetch wrapper for the OEMInventory backend (server/).
 *
 * Token tradeoff (documented per project instructions): the refresh token lives in a
 * secure httpOnly cookie set by the backend — JS never touches it. The short-lived access
 * token is kept in memory only (this module-level variable), not localStorage/sessionStorage,
 * to reduce XSS exposure. That means a hard page reload always starts with no access token;
 * `refreshSession()` (called once on app load) silently exchanges the httpOnly cookie for a
 * fresh access token so the session survives a refresh without ever persisting the token to
 * disk. If the refresh cookie itself is gone/expired, the user is simply signed out.
 */

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined) || 'http://localhost:4000';

let accessToken: string | null = null;

export function setAccessToken(token: string | null): void {
  accessToken = token;
}

export function getAccessToken(): string | null {
  return accessToken;
}

export class ApiRequestError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiRequestError';
  }
}

interface ApiEnvelope<T> {
  success: boolean;
  data?: T;
  error?: { statusCode: number; message: string | string[] };
}

let refreshPromise: Promise<boolean> | null = null;

async function tryRefresh(): Promise<boolean> {
  if (!refreshPromise) {
    refreshPromise = fetch(`${API_BASE_URL}/api/auth/refresh`, { method: 'POST', credentials: 'include' })
      .then(async (res) => {
        if (!res.ok) return false;
        const body = (await res.json()) as ApiEnvelope<{ accessToken: string }>;
        if (body.success && body.data?.accessToken) {
          accessToken = body.data.accessToken;
          return true;
        }
        return false;
      })
      .catch(() => false)
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

export async function refreshSession(): Promise<boolean> {
  return tryRefresh();
}

async function request<T>(path: string, options: RequestInit = {}, allowRetry = true): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...options.headers,
    },
  });

  if (res.status === 401 && allowRetry && !path.startsWith('/api/auth/')) {
    const refreshed = await tryRefresh();
    if (refreshed) {
      return request<T>(path, options, false);
    }
  }

  const body = (await res.json().catch(() => null)) as ApiEnvelope<T> | null;
  if (!res.ok || !body || body.success === false) {
    const rawMessage = body?.error?.message;
    const message = Array.isArray(rawMessage) ? rawMessage.join(', ') : rawMessage || `Request failed (${res.status})`;
    throw new ApiRequestError(res.status, message);
  }
  return body.data as T;
}

export const api = {
  get: <T>(path: string): Promise<T> => request<T>(path, { method: 'GET' }),
  post: <T>(path: string, body?: unknown): Promise<T> =>
    request<T>(path, { method: 'POST', body: body !== undefined ? JSON.stringify(body) : undefined }),
  patch: <T>(path: string, body?: unknown): Promise<T> =>
    request<T>(path, { method: 'PATCH', body: body !== undefined ? JSON.stringify(body) : undefined }),
};
