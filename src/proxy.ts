import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

async function verifyToken(token: string, secret: string): Promise<boolean> {
  const lastDot = token.lastIndexOf(".");
  if (lastDot === -1) return false;
  const value = token.slice(0, lastDot);
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(value));
  const hex = Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return token === `${value}.${hex}`;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/dashboard/login") {
    const token = request.cookies.get("dash_session")?.value;
    const secret = process.env.DASHBOARD_SECRET;
    if (token && secret) {
      const valid = await verifyToken(token, secret);
      if (valid) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    }
    return NextResponse.next();
  }

  const token = request.cookies.get("dash_session")?.value;
  const secret = process.env.DASHBOARD_SECRET;

  if (!token || !secret) {
    return NextResponse.redirect(new URL("/dashboard/login", request.url));
  }

  const valid = await verifyToken(token, secret);
  if (!valid) {
    return NextResponse.redirect(new URL("/dashboard/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/dashboard/:path*",
};
