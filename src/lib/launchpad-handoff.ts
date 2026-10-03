/**
 * Launchpad OS handoff. The issuer signs
 * base64url(UTF-8 JSON) + "." + base64url(HMAC-SHA256 of that base64url string).
 * The HMAC key is the raw UTF-8 LAUNCHPAD_PASSWORD. This module only verifies
 * tokens and mints this app's session cookie. It never reads the secret into
 * the client bundle.
 */

export const HANDOFF_QUERY_PARAM = "launchpad_token";
export const SESSION_COOKIE = "helora_session";
export const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;

export type HandoffResult =
  | { action: "continue" }
  | {
      action: "redirect";
      location: string;
      sessionToken: string | null;
      secure: boolean;
    };

type TokenPayload = {
  typ?: unknown;
  aud?: unknown;
  exp?: unknown;
  nonce?: unknown;
};

export function readLaunchpadSecret(env: NodeJS.ProcessEnv): string | null {
  const value = env.LAUNCHPAD_PASSWORD;
  if (typeof value !== "string" || value.length === 0) return null;
  return value;
}

function firstHeader(value: string | null): string {
  if (!value) return "";
  return value.split(",")[0]?.trim() ?? "";
}

/** Host as URL.host would report it: lowercase, default ports removed. */
export function normalizeHost(value: string): string {
  const trimmed = value.trim().toLowerCase();
  if (!trimmed) return "";
  try {
    const url = new URL(trimmed.includes("://") ? trimmed : `https://${trimmed}`);
    return url.host.toLowerCase();
  } catch {
    return trimmed;
  }
}

/**
 * Audience is the host the browser called. On Vercel that is x-forwarded-host
 * (the public alias), which can differ from the deployment URL.
 */
export function requestAudience(
  url: URL,
  headers: { get(name: string): string | null },
): string {
  const forwarded = normalizeHost(firstHeader(headers.get("x-forwarded-host")));
  if (forwarded) return forwarded;
  const host = normalizeHost(firstHeader(headers.get("host")));
  if (host) return host;
  return normalizeHost(url.host);
}

export function publicRedirectUrl(
  url: URL,
  headers: { get(name: string): string | null },
  audience: string,
): { href: string; secure: boolean } {
  const clean = new URL(url.toString());
  clean.searchParams.delete(HANDOFF_QUERY_PARAM);
  clean.hash = "";
  const proto = firstHeader(headers.get("x-forwarded-proto")).toLowerCase();
  if (proto === "https" || proto === "http") {
    clean.protocol = `${proto}:`;
  }
  if (audience) clean.host = audience;
  return { href: clean.toString(), secure: clean.protocol === "https:" };
}

function bytesToBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
}

function base64UrlToBytes(value: string): Uint8Array {
  const normalized = value.replaceAll("-", "+").replaceAll("_", "/");
  const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

async function hmac(message: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(message),
  );
  return bytesToBase64Url(new Uint8Array(signature));
}

function safeEqual(a: string, b: string): boolean {
  const left = new TextEncoder().encode(a);
  const right = new TextEncoder().encode(b);
  const length = Math.max(left.length, right.length);
  let diff = left.length === right.length ? 0 : 1;
  for (let i = 0; i < length; i += 1) {
    diff |= (left[i] ?? 0) ^ (right[i] ?? 0);
  }
  return diff === 0;
}

export async function signToken(
  payload: Record<string, unknown>,
  secret: string,
): Promise<string> {
  const body = bytesToBase64Url(new TextEncoder().encode(JSON.stringify(payload)));
  const signature = await hmac(body, secret);
  return `${body}.${signature}`;
}

async function verifyToken(
  token: string,
  secret: string,
): Promise<TokenPayload | null> {
  if (typeof token !== "string") return null;
  const dot = token.indexOf(".");
  if (dot <= 0 || dot !== token.lastIndexOf(".")) return null;
  const body = token.slice(0, dot);
  const signature = token.slice(dot + 1);
  if (!body || !signature) return null;
  const expected = await hmac(body, secret);
  if (!safeEqual(signature, expected)) return null;
  try {
    const json = new TextDecoder().decode(base64UrlToBytes(body));
    const payload = JSON.parse(json) as unknown;
    if (!payload || typeof payload !== "object" || Array.isArray(payload)) return null;
    return payload as TokenPayload;
  } catch {
    return null;
  }
}

function expiryInFuture(exp: unknown, now: number): boolean {
  return typeof exp === "number" && Number.isFinite(exp) && exp * 1000 > now;
}

export async function verifyHandoffToken(
  token: string,
  secret: string,
  audienceHost: string,
  now: number,
): Promise<boolean> {
  const payload = await verifyToken(token, secret);
  if (!payload) return false;
  if (payload.typ !== "handoff") return false;
  if (typeof payload.aud !== "string" || payload.aud !== audienceHost) return false;
  return expiryInFuture(payload.exp, now);
}

export async function verifySessionToken(
  token: string,
  secret: string | null,
  now: number,
): Promise<boolean> {
  if (!secret) return false;
  const payload = await verifyToken(token, secret);
  if (!payload || payload.typ !== "session") return false;
  return expiryInFuture(payload.exp, now);
}

function randomNonce(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return [...bytes].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

/**
 * A present token always redirects to the same URL without launchpad_token.
 * Only a valid handoff mints helora_session. Anything else leaves cookies alone.
 */
export async function acceptHandoff(input: {
  token: string | null;
  secret: string | null;
  url: URL;
  headers: { get(name: string): string | null };
  now?: number;
}): Promise<HandoffResult> {
  if (!input.token) return { action: "continue" };

  const now = input.now ?? Date.now();
  const audience = requestAudience(input.url, input.headers);
  const { href, secure } = publicRedirectUrl(input.url, input.headers, audience);
  const secret = input.secret;
  const accepted =
    secret !== null &&
    audience.length > 0 &&
    (await verifyHandoffToken(input.token, secret, audience, now));

  if (!accepted) {
    return { action: "redirect", location: href, sessionToken: null, secure };
  }

  const sessionToken = await signToken(
    {
      typ: "session",
      exp: Math.floor(now / 1000) + SESSION_TTL_SECONDS,
      nonce: randomNonce(),
    },
    secret,
  );

  return { action: "redirect", location: href, sessionToken, secure };
}
