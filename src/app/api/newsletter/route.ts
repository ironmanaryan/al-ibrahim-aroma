import { NextRequest } from "next/server";
import { updateDB } from "@/lib/store";
import { pushActivity } from "@/lib/activity";
import { uid } from "@/lib/utils";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { email } = (await req.json()) as { email?: string };
    const clean = String(email ?? "").trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(clean)) {
      return Response.json({ error: "Invalid email" }, { status: 400 });
    }
    await updateDB((db) => {
      if (!db.subscribers.some((s) => s.email === clean)) {
        db.subscribers.unshift({ id: uid("sub"), email: clean, createdAt: new Date().toISOString() });
        pushActivity(db, "newsletter", `New subscriber · ${clean}`);
      }
    });
    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "Could not subscribe" }, { status: 500 });
  }
}
