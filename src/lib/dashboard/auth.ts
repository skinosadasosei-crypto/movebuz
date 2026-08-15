import { cookies } from "next/headers";

const COOKIE_NAME = "dash_session";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

async function sign(value: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(value)
  );
  const hex = Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return `${value}.${hex}`;
}

async function verify(token: string, secret: string): Promise<boolean> {
  const lastDot = token.lastIndexOf(".");
  if (lastDot === -1) return false;
  const value = token.slice(0, lastDot);
  const expected = await sign(value, secret);
  return token === expected;
}

function getSecret(): string {
  const secret = process.env.DASHBOARD_SECRET;
  if (!secret) throw new Error("DASHBOARD_SECRET is not set");
  return secret;
}

export async function createSession(): Promise<void> {
  const payload = `authenticated:${Date.now()}`;
  const token = await sign(payload, getSecret());
  const jar = await cookies();
  jar.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function verifySession(): Promise<boolean> {
  const jar = await cookies();
  const token = jar.get(COOKIE_NAME)?.value;
  if (!token) return false;
  try {
    return await verify(token, getSecret());
  } catch {
    return false;
  }
}

export async function deleteSession(): Promise<void> {
  const jar = await cookies();
  jar.delete(COOKIE_NAME);
}

export function checkPassword(password: string): boolean {
  const expected = process.env.DASHBOARD_PASSWORD;
  if (!expected) throw new Error("DASHBOARD_PASSWORD is not set");
  return password === expected;
}
