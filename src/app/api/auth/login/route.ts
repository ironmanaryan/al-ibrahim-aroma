import { NextRequest, NextResponse } from "next/server";
import { readDB, updateDB } from "@/lib/store";
import { createSession, sessionCookieOptions, verifyPassword } from "@/lib/auth";
import { SESSION_COOKIE } from "@/lib/session";

export const runtime = "nodejs";

const attempts = new Map<string, { count: number; at: number }>();

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  const now = Date.now();
  const record = attempts.get(ip);
  if (record && now - record.at < 10 * 60 * 1000 && record.count >= 8) {
    return NextResponse.json(
      { error: "Too many attempts. Try again in ten minutes." },
      { status: 429 },
    );
  }

  try {
    const { email, password } = (await req.json()) as { email?: string; password?: string };
    const clean = String(email ?? "").trim().toLowerCase();
    const pass = String(password ?? "");
    if (!clean || !pass) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }

    const db = await readDB();
    const user = db.users.find((u) => u.email.toLowerCase() === clean && u.active);
    if (!user || !verifyPassword(pass, user.passwordHash)) {
      attempts.set(ip, {
        count: (record && now - record.at < 10 * 60 * 1000 ? record.count : 0) + 1,
        at: now,
      });
      return NextResponse.json({ error: "Those details do not match." }, { status: 401 });
    }

    attempts.delete(ip);
    await updateDB((next) => {
      const found = next.users.find((u) => u.id === user.id);
      if (found) found.lastLogin = new Date().toISOString();
    });

    const token = await createSession({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });

    const res = NextResponse.json({
      ok: true,
      user: { name: user.name, email: user.email, role: user.role },
    });
    res.cookies.set(SESSION_COOKIE, token, sessionCookieOptions);
    return res;
  } catch {
    return NextResponse.json({ error: "Sign in failed." }, { status: 500 });
  }
}
