import { NextRequest } from "next/server";
import { updateDB } from "@/lib/store";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { path?: unknown };
    const path = typeof body.path === "string" ? body.path.slice(0, 120) : "/";
    const key = new Date().toISOString().slice(0, 10);
    await updateDB((db) => {
      db.analytics.visits += 1;
      db.analytics.byDay[key] = (db.analytics.byDay[key] ?? 0) + 1;
      db.analytics.byPath[path] = (db.analytics.byPath[path] ?? 0) + 1;
    });
    return Response.json({ ok: true });
  } catch {
    return Response.json({ ok: false }, { status: 400 });
  }
}
