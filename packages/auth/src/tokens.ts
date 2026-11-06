import { AuthTokenPair } from "@rajtantra/common-types";

const ACCESS_TOKEN_KEY = "rajtantra_access_token";
const REFRESH_TOKEN_KEY = "rajtantra_refresh_token";

/**
 * Persists JWT token pair into browser storage and domain cookies if available.
 */
export function setAuthTokens(tokens: AuthTokenPair): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);

    // Standard cookie for same-origin Next.js Edge Middleware
    document.cookie = `rajtantra_access_token=${tokens.accessToken}; Path=/; SameSite=Lax; max-age=${tokens.expiresIn}`;

    // Set fallback domain cookie for cross-subdomain SSO if on .rajtantra.in
    const hostname = window.location.hostname;
    const isApex = hostname.endsWith("rajtantra.in");
    const domainAttribute = isApex ? "; Domain=.rajtantra.in" : "";
    const secureAttribute = window.location.protocol === "https:" ? "; Secure" : "";

    document.cookie = `rajtantra_sso=${tokens.accessToken}; Path=/${domainAttribute}${secureAttribute}; SameSite=Lax; max-age=${tokens.expiresIn}`;
  } catch {
    // Non-blocking storage exception (e.g. private mode)
  }
}

/**
 * Retrieves the active access token.
 */
export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;

  try {
    const local = localStorage.getItem(ACCESS_TOKEN_KEY);
    if (local) return local;

    // Check SSO cookie
    const match = document.cookie.match(/(?:^|;\s*)rajtantra_sso=([^;]*)/);
    return match && match[1] ? decodeURIComponent(match[1]) : null;
  } catch {
    return null;
  }
}

/**
 * Retrieves the stored refresh token.
 */
export function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  } catch {
    return null;
  }
}

/**
 * Clears authentication tokens and revokes browser session state.
 */
export function clearAuthTokens(): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);

    // Clear cookies
    document.cookie = `rajtantra_access_token=; Path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;

    const hostname = window.location.hostname;
    const isApex = hostname.endsWith("rajtantra.in");
    const domainAttribute = isApex ? "; Domain=.rajtantra.in" : "";
    document.cookie = `rajtantra_sso=; Path=/${domainAttribute}; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  } catch {
    // Ignore storage errors on cleanup
  }
}
