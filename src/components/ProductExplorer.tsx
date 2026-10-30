"use client";

import { useMemo, useState } from "react";
import type { Product } from "@/lib/types";
import { formatINR } from "@/lib/utils";
import ProductCard, { QuickView } from "./ProductCard";
import { Filter } from "./icons";

const SORTS = [
  { value: "featured", label: "House order" },
  { value: "price-asc", label: "Price · low to high" },
  { value: "price-desc", label: "Price · high to low" },
  { value: "rating", label: "Most loved" },
];

export default function ProductExplorer({
  products,
  mode = "chips",
  limit,
  initialCategory = "All",
}: {
  products: Product[];
  mode?: "chips" | "sidebar";
  limit?: number;
  initialCategory?: string;
}) {
  const [category, setCategory] = useState(initialCategory);
  const [family, setFamily] = useState("All");
  const [sort, setSort] = useState("featured");
  const [maxPrice, setMaxPrice] = useState(4000);
  const [quick, setQuick] = useState<Product | null>(null);

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(products.map((p) => p.category)))],
    [products],
  );
  const families = useMemo(
    () => ["All", ...Array.from(new Set(products.map((p) => p.family)))],
    [products],
  );

  const filtered = useMemo(() => {
    let list = products.filter((p) => {
      if (category !== "All" && p.category !== category) return false;
      if (family !== "All" && p.family !== family) return false;
      if (mode === "sidebar" && p.price > maxPrice) return false;
      return true;
    });
    if (sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
    if (sort === "rating") list = [...list].sort((a, b) => b.rating - a.rating);
    if (limit) list = list.slice(0, limit);
    return list;
  }, [products, category, family, sort, maxPrice, limit, mode]);

  return (
    <>
      {mode === "chips" ? (
        <div className="explorer-bar">
          <div className="filters">
            {categories.map((c) => (
              <button
                key={c}
                className="chip"
                data-active={category === c}
                onClick={() => setCategory(c)}
              >
                {c === "All" ? "All fragrances" : c}
              </button>
            ))}
          </div>
          <div className="explorer-bar__right">
            <label className="sort-select">
              <Filter size={13} />
              <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort products">
                {SORTS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
      ) : null}

      <div className={mode === "sidebar" ? "catalog" : ""}>
        {mode === "sidebar" ? (
          <aside className="filters-panel" aria-label="Filters">
            <div className="filter-group">
              <h4>Category</h4>
              <div className="filters">
                {categories.map((c) => (
                  <button
                    key={c}
                    className="chip"
                    data-active={category === c}
                    onClick={() => setCategory(c)}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
            <div className="filter-group">
              <h4>Scent family</h4>
              <div className="filters">
                {families.map((f) => (
                  <button
                    key={f}
                    className="chip"
                    data-active={family === f}
                    onClick={() => setFamily(f)}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
            <div className="filter-group">
              <h4>Up to {formatINR(maxPrice)}</h4>
              <input
                className="range"
                type="range"
                min={500}
                max={4000}
                step={50}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                aria-label="Maximum price"
              />
            </div>
            <div className="filter-group">
              <h4>Sort</h4>
              <select
                className="select"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                aria-label="Sort products"
              >
                {SORTS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
            <button
              className="btn btn--line btn--sm"
              onClick={() => {
                setCategory("All");
                setFamily("All");
                setMaxPrice(4000);
                setSort("featured");
              }}
            >
              Reset filters
            </button>
          </aside>
        ) : null}

        <div>
          {mode === "sidebar" ? (
            <div className="catalog__head">
              <span className="catalog__count">
                {filtered.length} composition{filtered.length === 1 ? "" : "s"}
              </span>
              <span className="catalog__count">
                {category !== "All" ? category : "All"} · {family !== "All" ? family : "All families"}
              </span>
            </div>
          ) : null}

          {filtered.length === 0 ? (
            <div className="empty">
              <p>Nothing in this corner of the house yet.</p>
              <button
                className="btn btn--line btn--sm"
                onClick={() => {
                  setCategory("All");
                  setFamily("All");
                  setMaxPrice(4000);
                }}
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="product-grid">
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} onQuickView={setQuick} />
              ))}
            </div>
          )}
        </div>
      </div>

      {quick ? <QuickView product={quick} onClose={() => setQuick(null)} /> : null}
    </>
  );
}
