"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import type { Product } from "@/lib/types";
import { formatINR } from "@/lib/utils";
import { productImage } from "@/lib/productImage";

const KEY = "aia_recent_v1";

export default function RecentlyViewed({
  products,
  current,
}: {
  products: Product[];
  current: string;
}) {
  const [items, setItems] = useState<Product[]>([]);

  useEffect(() => {
    let stored: string[] = [];
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) stored = parsed.filter((s) => typeof s === "string");
      }
    } catch {
      /* ignore */
    }

    const next = [current, ...stored.filter((s) => s !== current)].slice(0, 8);
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }

    setItems(
      next
        .filter((s) => s !== current)
        .map((s) => products.find((p) => p.slug === s))
        .filter((p): p is Product => Boolean(p))
        .slice(0, 5),
    );
  }, [current, products]);

  if (!items.length) return null;

  return (
    <section className="section" style={{ paddingTop: 0 }}>
      <div className="container">
        <div className="section__head">
          <div className="section__head-copy">
            <span className="eyebrow">Where you left off</span>
            <h2 className="section__title">Recently viewed</h2>
          </div>
        </div>
        <div className="scroll-x">
          {items.map((p) => (
            <Link key={p.id} href={`/product/${p.slug}`} className="recent-card">
              <span className="recent-card__art">
                <Image
                  src={productImage(p.slug, p.family)}
                  alt={p.name}
                  fill
                  sizes="(max-width: 640px) 70vw, 230px"
                />
              </span>
              <strong>{p.name}</strong>
              <span className="muted-2" style={{ fontSize: 11 }}>
                {p.family} · {formatINR(p.price)}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
