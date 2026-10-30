import { SignJWT, jwtVerify } from "jose";
import type { Role } from "./types";

export const SESSION_COOKIE = "aia_session";

function secretKey() {
  const value =
    process.env.AUTH_SECRET ||
    "al-ibrahim-aroma-dev-secret-2026-change-me-in-production";
  return new TextEncoder().encode(value);
}

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export async function createSession(user: SessionUser): Promise<string> {
  return new SignJWT({ name: user.name, email: user.email, role: user.role })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.id)
    .setIssuedAt()
    .setIssuer("al-ibrahim-aroma")
    .setExpirationTime("7d")
    .sign(secretKey());
}

export async function readToken(token: string): Promise<SessionUser | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey(), {
      issuer: "al-ibrahim-aroma",
    });
    if (!payload.sub) return null;
    return {
      id: payload.sub,
      name: String(payload.name ?? ""),
      email: String(payload.email ?? ""),
      role: payload.role === "admin" ? "admin" : "moderator",
    };
  } catch {
    return null;
  }
}
