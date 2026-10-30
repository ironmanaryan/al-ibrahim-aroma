import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth";
import { pushActivity } from "@/lib/activity";
import { updateDB } from "@/lib/store";
import type { Settings } from "@/lib/types";

export const runtime = "nodejs";

const ALLOWED: (keyof Settings)[] = [
  "brandName",
  "tagline",
  "phone",
  "whatsapp",
  "email",
  "address",
  "hours",
  "instagram",
  "facebook",
  "youtube",
  "announcement",
  "heroKicker",
  "heroTitle",
  "heroSub",
  "freeShipping",
  "currency",
];

export async function PATCH(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Admins only" }, { status: 403 });
  }
  const body = (await req.json()) as Record<string, unknown>;
  const patch: Record<string, unknown> = {};
  for (const key of ALLOWED) {
    if (key in body) patch[key] = body[key];
  }
  if (typeof patch.freeShipping === "string") patch.freeShipping = Number(patch.freeShipping) || 0;

  await updateDB((db) => {
    db.settings = { ...db.settings, ...(patch as Partial<Settings>) };
    pushActivity(db, "admin", "Store settings updated", `By ${session.name}`, {
      fields: Object.keys(patch).join(", "),
    });
  });

  revalidatePath("/", "layout");

  return NextResponse.json({ ok: true });
}
