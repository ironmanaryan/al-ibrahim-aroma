"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { ArtVariant, CapStyle, Product } from "@/lib/types";
import { formatINR } from "@/lib/utils";
import { adminApi } from "@/lib/adminClient";
import { AdminModal, Field } from "./ui";
import BottleArt from "../BottleArt";
import { Edit, Plus, Search, Trash } from "../icons";
import { useToast } from "../Toast";

const CATEGORIES = ["Perfume", "Attar", "Home", "Gifting", "Discovery"];
const FAMILIES = ["Oud", "Amber", "Floral", "Musk", "Fresh", "Woody"];
const VARIANTS: ArtVariant[] = ["flacon", "attar", "diffuser", "coffret", "vial"];
const CAPS: CapStyle[] = ["gold", "black", "wood", "ivory"];

const blank: Product = {
  id: "",
  slug: "",
  name: "",
  subtitle: "",
  category: "Perfume",
  family: "Oud",
  price: 0,
  sizes: [{ ml: 50, price: 0 }],
  notes: { top: [], heart: [], base: [] },
  description: "",
  story: "",
  intensity: 3,
  longevity: "6–8 hours",
  sillage: "Moderate",
  rating: 5,
  reviewCount: 0,
  stock: 0,
  featured: false,
  bestseller: false,
  published: true,
  art: { variant: "flacon", liquid: "#b07b2e", label: "#12100d", cap: "gold" },
  createdAt: new Date().toISOString(),
};

export default function ProductsAdmin({ initial }: { initial: Product[] }) {
  const router = useRouter();
  const { notify } = useToast();
  const [query, setQuery] = useState("");
  const [draft, setDraft] = useState<Product | null>(null);
  const [saving, setSaving] = useState(false);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return initial;
    return initial.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.family.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q),
    );
  }, [initial, query]);

  function set<K extends keyof Product>(key: K, value: Product[K]) {
    setDraft((d) => (d ? { ...d, [key]: value } : d));
  }

  function updateSize(index: number, patch: Partial<Product["sizes"][number]>) {
    setDraft((d) => {
      if (!d) return d;
      const sizes = d.sizes.map((s, i) => (i === index ? { ...s, ...patch } : s));
      return { ...d, sizes };
    });
  }

  async function save() {
    if (!draft) return;
    if (!draft.name.trim()) {
      notify("A product needs a name");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...draft,
        price: draft.sizes[0]?.price ?? draft.price,
        sizes: draft.sizes.filter((s) => s.ml > 0 && s.price > 0),
      };
      if (draft.id) {
        await adminApi(`/api/admin/products/${draft.id}`, {
          method: "PATCH",
          body: JSON.stringify(payload),
        });
        notify("Product updated");
      } else {
        await adminApi("/api/admin/products", { method: "POST", body: JSON.stringify(payload) });
        notify("Product created");
      }
      setDraft(null);
      router.refresh();
    } catch (err) {
      notify(err instanceof Error ? err.message : "Could not save");
    } finally {
      setSaving(false);
    }
  }

  async function remove(product: Product) {
    if (!window.confirm(`Delete “${product.name}”? This cannot be undone.`)) return;
    try {
      await adminApi(`/api/admin/products/${product.id}`, { method: "DELETE" });
      notify("Product deleted");
      router.refresh();
    } catch (err) {
      notify(err instanceof Error ? err.message : "Could not delete");
    }
  }

  return (
    <>
      <div className="admin-page-head">
        <div>
          <h1>Products</h1>
          <p>
            Every composition in the house — pricing, sizes, notes and stock. Changes appear on the
            storefront immediately.
          </p>
        </div>
        <div className="admin-actions">
          <button className="admin-btn admin-btn--gold" onClick={() => setDraft({ ...blank })}>
            <Plus size={14} /> Add product
          </button>
        </div>
      </div>

      <div className="admin-toolbar">
        <label className="admin-search">
          <Search size={15} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, family or category…"
            aria-label="Search products"
          />
        </label>
        <span style={{ fontSize: 11, color: "var(--a-muted)", marginLeft: "auto" }}>
          {rows.length} of {initial.length} products
        </span>
      </div>

      <div className="table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Family</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Status</th>
              <th style={{ textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((p) => (
              <tr key={p.id}>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ width: 30, height: 40, flex: "none" }}>
                      <BottleArt {...p.art} />
                    </span>
                    <div className="admin-table__name">
                      <strong>{p.name}</strong>
                      <small>
                        {p.category} · {p.sizes.map((s) => `${s.ml}ml`).join(" / ")}
                      </small>
                    </div>
                  </div>
                </td>
                <td style={{ color: "var(--a-muted)" }}>{p.family}</td>
                <td>{formatINR(p.price)}</td>
                <td>
                  <span style={{ color: p.stock < 25 ? "var(--a-red)" : "var(--a-ink)" }}>{p.stock}</span>
                </td>
                <td>
                  <span className="status-pill" data-status={p.published ? "closed" : "new"}>
                    {p.published ? "Live" : "Draft"}
                  </span>
                </td>
                <td>
                  <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
                    <button
                      className="admin-btn admin-btn--ghost admin-btn--sm"
                      onClick={() => setDraft({ ...p })}
                      aria-label={`Edit ${p.name}`}
                    >
                      <Edit size={12} /> Edit
                    </button>
                    <button
                      className="admin-btn admin-btn--danger admin-btn--sm"
                      onClick={() => remove(p)}
                      aria-label={`Delete ${p.name}`}
                    >
                      <Trash size={12} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {draft ? (
        <AdminModal
          title={draft.id ? `Edit ${draft.name}` : "New product"}
          onClose={() => setDraft(null)}
          wide
          footer={
            <>
              <button className="admin-btn admin-btn--ghost" onClick={() => setDraft(null)}>
                Cancel
              </button>
              <button className="admin-btn admin-btn--gold" onClick={save} disabled={saving}>
                {saving ? "Saving…" : draft.id ? "Save changes" : "Create product"}
              </button>
            </>
          }
        >
          <div className="admin-form-grid">
            <Field label="Name" span>
              <input
                className="input"
                value={draft.name}
                onChange={(e) => set("name", e.target.value)}
                placeholder="Oud Al Malik"
              />
            </Field>
            <Field label="Subtitle" span>
              <input
                className="input"
                value={draft.subtitle}
                onChange={(e) => set("subtitle", e.target.value)}
                placeholder="Cambodian oud, rose absolute, smoked amber"
              />
            </Field>
            <Field label="Category">
              <select
                className="select"
                value={draft.category}
                onChange={(e) => set("category", e.target.value as Product["category"])}
              >
                {CATEGORIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </Field>
            <Field label="Scent family">
              <select className="select" value={draft.family} onChange={(e) => set("family", e.target.value as Product["family"])}>
                {FAMILIES.map((f) => (
                  <option key={f}>{f}</option>
                ))}
              </select>
            </Field>

            <Field label="Sizes (ml · price · compare-at)" span>
              <div style={{ display: "grid", gap: 8 }}>
                {draft.sizes.map((size, i) => (
                  <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto", gap: 8 }}>
                    <input
                      className="input"
                      type="number"
                      value={size.ml}
                      onChange={(e) => updateSize(i, { ml: Number(e.target.value) })}
                      placeholder="ml"
                      aria-label="Size in ml"
                    />
                    <input
                      className="input"
                      type="number"
                      value={size.price}
                      onChange={(e) => updateSize(i, { price: Number(e.target.value) })}
                      placeholder="Price"
                      aria-label="Price"
                    />
                    <input
                      className="input"
                      type="number"
                      value={size.compareAt ?? ""}
                      onChange={(e) =>
                        updateSize(i, { compareAt: e.target.value ? Number(e.target.value) : undefined })
                      }
                      placeholder="Compare at"
                      aria-label="Compare at price"
                    />
                    <button
                      className="admin-btn admin-btn--ghost"
                      onClick={() =>
                        setDraft((d) =>
                          d ? { ...d, sizes: d.sizes.filter((_, index) => index !== i) } : d,
                        )
                      }
                      aria-label="Remove size"
                    >
                      <Trash size={13} />
                    </button>
                  </div>
                ))}
                <button
                  className="admin-btn admin-btn--ghost admin-btn--sm"
                  onClick={() =>
                    setDraft((d) =>
                      d ? { ...d, sizes: [...d.sizes, { ml: 9, price: d.price }] } : d,
                    )
                  }
                  style={{ justifySelf: "start" }}
                >
                  <Plus size={12} /> Add size
                </button>
              </div>
            </Field>

            <Field label="Top notes (comma separated)">
              <input
                className="input"
                value={draft.notes.top.join(", ")}
                onChange={(e) =>
                  set("notes", { ...draft.notes, top: e.target.value.split(",").map((n) => n.trim()).filter(Boolean) })
                }
              />
            </Field>
            <Field label="Heart notes">
              <input
                className="input"
                value={draft.notes.heart.join(", ")}
                onChange={(e) =>
                  set("notes", { ...draft.notes, heart: e.target.value.split(",").map((n) => n.trim()).filter(Boolean) })
                }
              />
            </Field>
            <Field label="Base notes" span>
              <input
                className="input"
                value={draft.notes.base.join(", ")}
                onChange={(e) =>
                  set("notes", { ...draft.notes, base: e.target.value.split(",").map((n) => n.trim()).filter(Boolean) })
                }
              />
            </Field>

            <Field label="Description" span>
              <textarea
                className="textarea"
                value={draft.description}
                onChange={(e) => set("description", e.target.value)}
              />
            </Field>
            <Field label="Story" span>
              <textarea className="textarea" value={draft.story} onChange={(e) => set("story", e.target.value)} />
            </Field>

            <Field label="Longevity">
              <input
                className="input"
                value={draft.longevity}
                onChange={(e) => set("longevity", e.target.value)}
                placeholder="10–12 hours"
              />
            </Field>
            <Field label="Sillage">
              <select className="select" value={draft.sillage} onChange={(e) => set("sillage", e.target.value)}>
                {["Intimate", "Moderate", "Strong", "Heavy"].map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </Field>
            <Field label="Intensity (1–5)">
              <input
                className="input"
                type="number"
                min={1}
                max={5}
                value={draft.intensity}
                onChange={(e) => set("intensity", Number(e.target.value))}
              />
            </Field>
            <Field label="Stock">
              <input
                className="input"
                type="number"
                value={draft.stock}
                onChange={(e) => set("stock", Number(e.target.value))}
              />
            </Field>
            <Field label="Rating">
              <input
                className="input"
                type="number"
                step="0.1"
                min={0}
                max={5}
                value={draft.rating}
                onChange={(e) => set("rating", Number(e.target.value))}
              />
            </Field>
            <Field label="Review count">
              <input
                className="input"
                type="number"
                value={draft.reviewCount}
                onChange={(e) => set("reviewCount", Number(e.target.value))}
              />
            </Field>
            <Field label="Badge">
              <input
                className="input"
                value={draft.badge ?? ""}
                onChange={(e) => set("badge", e.target.value || undefined)}
                placeholder="Signature"
              />
            </Field>

            <Field label="Bottle shape">
              <select
                className="select"
                value={draft.art.variant}
                onChange={(e) => set("art", { ...draft.art, variant: e.target.value as ArtVariant })}
              >
                {VARIANTS.map((v) => (
                  <option key={v}>{v}</option>
                ))}
              </select>
            </Field>
            <Field label="Cap">
              <select
                className="select"
                value={draft.art.cap}
                onChange={(e) => set("art", { ...draft.art, cap: e.target.value as CapStyle })}
              >
                {CAPS.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </Field>
            <Field label="Liquid colour">
              <input
                className="input"
                type="color"
                value={draft.art.liquid}
                onChange={(e) => set("art", { ...draft.art, liquid: e.target.value })}
              />
            </Field>
            <Field label="Label colour">
              <input
                className="input"
                type="color"
                value={draft.art.label}
                onChange={(e) => set("art", { ...draft.art, label: e.target.value })}
              />
            </Field>

            <Field label="Flags" span>
              <div style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>
                <label className="admin-check">
                  <input
                    type="checkbox"
                    checked={draft.published}
                    onChange={(e) => set("published", e.target.checked)}
                  />
                  Published
                </label>
                <label className="admin-check">
                  <input
                    type="checkbox"
                    checked={draft.featured}
                    onChange={(e) => set("featured", e.target.checked)}
                  />
                  Featured on home
                </label>
                <label className="admin-check">
                  <input
                    type="checkbox"
                    checked={draft.bestseller}
                    onChange={(e) => set("bestseller", e.target.checked)}
                  />
                  Bestseller
                </label>
              </div>
            </Field>

            <div className="span-2" style={{ display: "flex", alignItems: "center", gap: 20, paddingTop: 6 }}>
              <div style={{ width: 64 }}>
                <BottleArt {...draft.art} />
              </div>
              <span style={{ fontSize: 11, color: "var(--a-muted)", lineHeight: 1.6 }}>
                Live preview of the generated bottle art. No photography needed — every flacon is drawn
                from these four values.
              </span>
            </div>
          </div>
        </AdminModal>
      ) : null}
    </>
  );
}
