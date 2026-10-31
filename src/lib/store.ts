import { promises as fs } from "node:fs";
import path from "node:path";
import { hashPassword } from "./auth";
import { buildSeed } from "./seed";
import { remapPaletteV5 } from "./palette-migrate";
import type { DB } from "./types";

const KEY = "alibrahim:db:v1";
const SEED_VERSION = 6;

type Cache = { db: DB; at: number };
const globalForStore = globalThis as unknown as { __aiaCache?: Cache };

function kv() {
  const url =
    process.env.UPSTASH_REDIS_REST_URL ||
    process.env.KV_REST_API_URL ||
    "";
  const token =
    process.env.UPSTASH_REDIS_REST_TOKEN ||
    process.env.KV_REST_API_TOKEN ||
    "";
  if (!url || !token) return null;
  return { url: url.replace(/\/$/, ""), token };
}

function dataDir() {
  if (process.env.DATA_DIR) return process.env.DATA_DIR;
  if (process.env.VERCEL) return path.join("/tmp", "alibrahim-aroma");
  return path.join(process.cwd(), ".data");
}

function filePath() {
  return path.join(dataDir(), "db.json");
}

async function fileRead(): Promise<DB | null> {
  try {
    const raw = await fs.readFile(filePath(), "utf8");
    return JSON.parse(raw) as DB;
  } catch {
    return null;
  }
}

async function fileWrite(db: DB) {
  const dir = dataDir();
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(filePath(), JSON.stringify(db, null, 2), "utf8");
}

async function kvRead(): Promise<DB | null> {
  const cfg = kv();
  if (!cfg) return null;
  try {
    const res = await fetch(`${cfg.url}/get/${encodeURIComponent(KEY)}`, {
      headers: { Authorization: `Bearer ${cfg.token}` },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const json = (await res.json()) as { result?: string | null };
    if (!json.result) return null;
    return JSON.parse(json.result) as DB;
  } catch {
    return null;
  }
}

async function kvWrite(db: DB) {
  const cfg = kv();
  if (!cfg) return false;
  try {
    const res = await fetch(`${cfg.url}/set/${encodeURIComponent(KEY)}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${cfg.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(db),
    });
    return res.ok;
  } catch {
    return false;
  }
}

function migrate(db: DB): DB {
  if (
    (db.seedVersion ?? 0) >= SEED_VERSION &&
    db.products?.length &&
    db.collections?.length &&
    db.journal?.length &&
    db.users?.length &&
    db.settings &&
    db.analytics &&
    db.subscribers &&
    db.activity
  ) {
    return db;
  }
  const seed = buildSeed(hashPassword);
  const merged: DB = {
    ...seed,
    ...db,
    settings: { ...seed.settings, ...db.settings },
    analytics: { ...seed.analytics, ...db.analytics },
  };
  if (!merged.products?.length) merged.products = seed.products;
  if (!merged.collections?.length) merged.collections = seed.collections;
  if (!merged.users?.length) merged.users = seed.users;
  if (!merged.subscribers) merged.subscribers = [];
  if (!merged.activity) merged.activity = seed.activity ?? [];
  if ((db.seedVersion ?? 0) < 6) remapPaletteV5(merged);
  if ((db.seedVersion ?? 0) < SEED_VERSION) {
    const have = new Set(merged.products.map((p) => p.slug));
    merged.products = [...merged.products, ...seed.products.filter((p) => !have.has(p.slug))];
    const havePosts = new Set(merged.journal.map((p) => p.slug));
    merged.journal = [...merged.journal, ...seed.journal.filter((p) => !havePosts.has(p.slug))];
    const haveCollections = new Set(merged.collections.map((c) => c.slug));
    merged.collections = [
      ...merged.collections,
      ...seed.collections.filter((c) => !haveCollections.has(c.slug)),
    ];
    const haveTestimonials = new Set(merged.testimonials.map((t) => t.id));
    merged.testimonials = [
      ...merged.testimonials,
      ...seed.testimonials.filter((t) => !haveTestimonials.has(t.id)),
    ];
    merged.seedVersion = SEED_VERSION;
  }
  return merged;
}

export async function readDB(): Promise<DB> {
  const cached = globalForStore.__aiaCache;
  if (cached && Date.now() - cached.at < 1500) return cached.db;

  let db = await kvRead();
  if (!db) db = await fileRead();
  if (!db) {
    db = buildSeed(hashPassword);
    await writeDB(db);
    return db;
  }
  const migrated = migrate(db);
  globalForStore.__aiaCache = { db: migrated, at: Date.now() };
  return migrated;
}

export async function writeDB(db: DB): Promise<void> {
  globalForStore.__aiaCache = { db, at: Date.now() };
  const wrote = await kvWrite(db);
  if (!wrote) {
    try {
      await fileWrite(db);
    } catch {
      // read-only filesystem on some hosts — data stays in memory for the instance
    }
  }
}

export async function updateDB(mutator: (db: DB) => void): Promise<DB> {
  const db = await readDB();
  mutator(db);
  await writeDB(db);
  return db;
}

export function invalidateCache() {
  globalForStore.__aiaCache = undefined;
}
