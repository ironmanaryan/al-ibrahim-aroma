import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getSession, hashPassword } from "@/lib/auth";
import { pushActivity } from "@/lib/activity";
import { readDB, updateDB } from "@/lib/store";
import { readingTime, slugify, uid } from "@/lib/utils";
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

function listFor(db: DB, resource: Resource): unknown[] {
  return (db as unknown as Record<string, unknown[]>)[MAP[resource]] ?? [];
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ resource: string }> },
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  const { resource } = await params;
  if (!isResource(resource)) return NextResponse.json({ error: "Unknown resource" }, { status: 404 });

  const db = await readDB();
  const list = listFor(db, resource);
  if (resource === "users") {
    return NextResponse.json(
      list.map((u) => {
        const user = u as Record<string, unknown>;
        return { ...user, passwordHash: undefined };
      }),
    );
  }
  return NextResponse.json(list);
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ resource: string }> },
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  const { resource } = await params;
  if (!isResource(resource)) return NextResponse.json({ error: "Unknown resource" }, { status: 404 });
  if (resource === "leads" || resource === "subscribers") {
    return NextResponse.json({ error: "Read only" }, { status: 403 });
  }
  if (resource === "users" && session.role !== "admin") {
    return NextResponse.json({ error: "Admins only" }, { status: 403 });
  }

  const body = (await req.json()) as Record<string, unknown>;
  const now = new Date().toISOString();
  const item: Record<string, unknown> = { ...body };

  if (resource === "users") {
    const email = String(body.email ?? "").trim().toLowerCase();
    const password = String(body.password ?? "");
    if (!email || password.length < 8) {
      return NextResponse.json({ error: "Email and an 8+ character password are required." }, { status: 400 });
    }
    const db = await readDB();
    if (db.users.some((u) => u.email.toLowerCase() === email)) {
      return NextResponse.json({ error: "That email already has an account." }, { status: 409 });
    }
    item.id = uid("u");
    item.email = email;
    item.name = String(body.name ?? "New user");
    item.role = body.role === "admin" ? "admin" : "moderator";
    item.active = body.active !== false;
    item.passwordHash = hashPassword(password);
    item.createdAt = now;
    delete item.password;
  } else {
    item.id = uid(resource.slice(0, 3));
    item.createdAt = now;
  }

  if (resource === "products") {
    item.slug = slugify(String(body.slug || body.name || "fragrance"));
    item.price = Number(body.price ?? 0);
    item.published = body.published !== false;
    item.sizes = Array.isArray(body.sizes) && body.sizes.length ? body.sizes : [{ ml: 50, price: item.price }];
    item.notes = body.notes ?? { top: [], heart: [], base: [] };
    item.rating = Number(body.rating ?? 5);
    item.reviewCount = Number(body.reviewCount ?? 0);
    item.stock = Number(body.stock ?? 0);
    item.intensity = Number(body.intensity ?? 3);
    item.featured = Boolean(body.featured);
    item.bestseller = Boolean(body.bestseller);
    item.art = body.art ?? { variant: "flacon", liquid: "#b07b2e", label: "#12100d", cap: "gold" };
    item.category = body.category ?? "Perfume";
    item.family = body.family ?? "Oud";
    item.longevity = body.longevity ?? "6–8 hours";
    item.sillage = body.sillage ?? "Moderate";
  }

  if (resource === "journal") {
    item.slug = slugify(String(body.slug || body.title || "letter"));
    item.publishedAt = body.publishedAt || now;
    item.readTime = readingTime(String(body.body ?? ""));
    item.published = body.published !== false;
    item.author = body.author || session.name;
    item.category = body.category || "Journal";
  }

  await updateDB((db) => {
    listFor(db, resource).unshift(item);
    const label = String(item.name ?? item.title ?? item.email ?? item.id);
    pushActivity(db, "admin", `Created ${NOUN[resource]} · ${label}`, `By ${session.name}`, {
      resource,
      id: String(item.id),
    });
  });

  revalidatePath("/", "layout");

  return NextResponse.json({ ok: true, item }, { status: 201 });
}
