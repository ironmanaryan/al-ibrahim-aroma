import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getSession, hashPassword } from "@/lib/auth";
import { pushActivity } from "@/lib/activity";
import { updateDB } from "@/lib/store";
import { slugify } from "@/lib/utils";
import type { DB } from "@/lib/types";

export const runtime = "nodejs";

const MAP = {
  products: "products",
  journal: "journal",
  testimonials: "testimonials",
  team: "team",
  faqs: "faqs",
  leads: "leads",
  media: "media",
  users: "users",
  subscribers: "subscribers",
} as const;

type Resource = keyof typeof MAP;

const NOUN: Record<Resource, string> = {
  products: "product",
  journal: "journal post",
  testimonials: "testimonial",
  team: "team member",
  faqs: "FAQ",
  leads: "lead",
  media: "media item",
  users: "user",
  subscribers: "subscriber",
};

function isResource(value: string): value is Resource {
  return value in MAP;
}

function listFor(db: DB, resource: Resource): Record<string, unknown>[] {
  return ((db as unknown as Record<string, Record<string, unknown>[]>)[MAP[resource]] ?? []) as Record<
    string,
    unknown
  >[];
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ resource: string; id: string }> },
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  const { resource, id } = await params;
  if (!isResource(resource)) return NextResponse.json({ error: "Unknown resource" }, { status: 404 });
  if (resource === "users" && session.role !== "admin") {
    return NextResponse.json({ error: "Admins only" }, { status: 403 });
  }

  const body = (await req.json()) as Record<string, unknown>;
  const patch: Record<string, unknown> = { ...body };
  delete patch.id;
  delete patch.createdAt;

  if (resource === "users") {
    if (typeof patch.password === "string" && patch.password.length >= 8) {
      patch.passwordHash = hashPassword(patch.password);
    }
    delete patch.password;
  }
  if (resource === "products" && (patch.name || patch.slug)) {
    patch.slug = slugify(String(patch.slug || patch.name));
  }
  if (resource === "journal" && (patch.title || patch.slug)) {
    patch.slug = slugify(String(patch.slug || patch.title));
  }

  let updated: Record<string, unknown> | null = null;
  await updateDB((db) => {
    const list = listFor(db, resource);
    const index = list.findIndex((item) => item.id === id);
    if (index >= 0) {
      const row = { ...list[index], ...patch };
      list[index] = row;
      updated = row;
      const label = String(row.name ?? row.title ?? row.email ?? id);
      pushActivity(db, "admin", `Updated ${NOUN[resource]} · ${label}`, `By ${session.name}`, {
        resource,
        id,
      });
    }
  });

  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true, item: updated });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ resource: string; id: string }> },
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  if (session.role !== "admin") {
    return NextResponse.json({ error: "Admins only" }, { status: 403 });
  }
  const { resource, id } = await params;
  if (!isResource(resource)) return NextResponse.json({ error: "Unknown resource" }, { status: 404 });

  let removed = false;
  await updateDB((db) => {
    const list = listFor(db, resource);
    const index = list.findIndex((item) => item.id === id);
    if (index >= 0) {
      const row = list[index];
      const label = String(row.name ?? row.title ?? row.email ?? id);
      list.splice(index, 1);
      removed = true;
      pushActivity(db, "admin", `Deleted ${NOUN[resource]} · ${label}`, `By ${session.name}`, {
        resource,
        id,
      });
    }
  });

  if (!removed) return NextResponse.json({ error: "Not found" }, { status: 404 });
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true });
}
