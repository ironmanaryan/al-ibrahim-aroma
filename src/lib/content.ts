import "server-only";
import { readDB } from "./store";
import type { Collection, JournalPost, Product, Settings } from "./types";

export async function getSettings(): Promise<Settings> {
  const db = await readDB();
  return db.settings;
}

export async function getProducts(options?: { includeHidden?: boolean }): Promise<Product[]> {
  const db = await readDB();
  return db.products
    .filter((p) => options?.includeHidden || p.published)
    .sort((a, b) => Number(b.bestseller) - Number(a.bestseller) || a.price - b.price);
}

export async function getProduct(slug: string): Promise<Product | undefined> {
  const db = await readDB();
  return db.products.find((p) => p.slug === slug);
}

export async function getCollections(): Promise<Collection[]> {
  const db = await readDB();
  return [...db.collections].sort((a, b) => a.order - b.order);
}

export async function getCollection(slug: string): Promise<Collection | undefined> {
  const db = await readDB();
  return db.collections.find((c) => c.slug === slug);
}

export async function productsInCollection(collection: Collection): Promise<Product[]> {
  const products = await getProducts();
  return products.filter((p) => {
    if (collection.filter.category && p.category !== collection.filter.category) return false;
    if (collection.filter.family && p.family !== collection.filter.family) return false;
    return true;
  });
}

export async function getJournal(options?: { includeHidden?: boolean }): Promise<JournalPost[]> {
  const db = await readDB();
  return db.journal
    .filter((p) => options?.includeHidden || p.published)
    .sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt));
}

export async function getPost(slug: string): Promise<JournalPost | undefined> {
  const db = await readDB();
  return db.journal.find((p) => p.slug === slug);
}

export async function getTestimonials() {
  const db = await readDB();
  return db.testimonials;
}

export async function getTeam() {
  const db = await readDB();
  return db.team;
}

export async function getFaqs() {
  const db = await readDB();
  return db.faqs;
}
