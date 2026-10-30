import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { pushActivity } from "@/lib/activity";
import { readDB, updateDB } from "@/lib/store";
import { uid } from "@/lib/utils";
import type { MediaItem } from "@/lib/types";

export const runtime = "nodejs";

const MAX_BYTES = 2_500_000;

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  const db = await readDB();
  return NextResponse.json(db.media);
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  try {
    const form = await req.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file received" }, { status: 400 });
    }
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Only image files are allowed" }, { status: 400 });
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: "Image must be under 2.5 MB" }, { status: 413 });
    }
    const buffer = Buffer.from(await file.arrayBuffer());
    const item: MediaItem = {
      id: uid("m"),
      name: file.name.slice(0, 120),
      url: `data:${file.type};base64,${buffer.toString("base64")}`,
      size: file.size,
      createdAt: new Date().toISOString(),
    };
    await updateDB((db) => {
      db.media.unshift(item);
      pushActivity(db, "admin", `Media uploaded · ${item.name}`, `By ${session.name}`, {
        id: item.id,
        size: item.size,
      });
    });
    return NextResponse.json({ ok: true, item }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
