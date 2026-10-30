"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Testimonial } from "@/lib/types";
import { adminApi } from "@/lib/adminClient";
import { AdminModal, Field } from "./ui";
import { Edit, Plus, Search, Star, Trash } from "../icons";
import { useToast } from "../Toast";

const blank: Testimonial = {
  id: "",
  name: "",
  city: "",
  rating: 5,
  quote: "",
  product: "",
  videoUrl: "",
  featured: true,
};

export default function TestimonialsAdmin({ initial }: { initial: Testimonial[] }) {
  const router = useRouter();
  const { notify } = useToast();
  const [query, setQuery] = useState("");
  const [draft, setDraft] = useState<Testimonial | null>(null);
  const [saving, setSaving] = useState(false);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return initial;
    return initial.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.city.toLowerCase().includes(q) ||
        t.quote.toLowerCase().includes(q),
    );
  }, [initial, query]);

  function set<K extends keyof Testimonial>(key: K, value: Testimonial[K]) {
    setDraft((d) => (d ? { ...d, [key]: value } : d));
  }

  async function save() {
    if (!draft) return;
    if (!draft.name.trim() || !draft.quote.trim()) {
      notify("A testimonial needs a name and a quote");
      return;
    }
    setSaving(true);
    try {
      if (draft.id) {
        await adminApi(`/api/admin/testimonials/${draft.id}`, {
          method: "PATCH",
          body: JSON.stringify(draft),
        });
        notify("Testimonial updated");
      } else {
        await adminApi("/api/admin/testimonials", { method: "POST", body: JSON.stringify(draft) });
        notify("Testimonial added");
      }
      setDraft(null);
      router.refresh();
    } catch (err) {
      notify(err instanceof Error ? err.message : "Could not save");
    } finally {
      setSaving(false);
    }
  }

  async function remove(item: Testimonial) {
    if (!window.confirm(`Delete the testimonial from ${item.name}?`)) return;
    try {
      await adminApi(`/api/admin/testimonials/${item.id}`, { method: "DELETE" });
      notify("Testimonial deleted");
      router.refresh();
    } catch (err) {
      notify(err instanceof Error ? err.message : "Could not delete");
    }
  }

  return (
    <>
      <div className="admin-page-head">
        <div>
          <h1>Testimonials</h1>
          <p>
            Words from the people who wear the house. Featured quotes appear in the carousel on the home
            page and on product pages.
          </p>
        </div>
        <div className="admin-actions">
          <button className="admin-btn admin-btn--gold" onClick={() => setDraft({ ...blank })}>
            <Plus size={14} /> Add testimonial
          </button>
        </div>
      </div>

      <div className="admin-toolbar">
        <label className="admin-search">
          <Search size={15} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, city or quote…"
            aria-label="Search testimonials"
          />
        </label>
        <span style={{ fontSize: 11, color: "var(--a-muted)", marginLeft: "auto" }}>
          {initial.filter((t) => t.featured).length} featured · {initial.length} total
        </span>
      </div>

      <div className="table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Guest</th>
              <th>Quote</th>
              <th>Product</th>
              <th>Rating</th>
              <th>Status</th>
              <th style={{ textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((item) => (
              <tr key={item.id}>
                <td>
                  <div className="admin-table__name">
                    <strong>{item.name}</strong>
                    <small>{item.city}</small>
                  </div>
                </td>
                <td style={{ maxWidth: 360 }}>
                  <span
                    style={{
                      display: "block",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      color: "var(--a-muted)",
                    }}
                  >
                    {item.quote}
                  </span>
                </td>
                <td style={{ color: "var(--a-muted)" }}>{item.product || "—"}</td>
                <td>
                  <span style={{ display: "inline-flex", gap: 2, color: "var(--a-gold)" }}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={11} />
                    ))}
                  </span>
                </td>
                <td>
                  <span className="status-pill" data-status={item.featured ? "closed" : "new"}>
                    {item.featured ? "Featured" : "Hidden"}
                  </span>
                </td>
                <td>
                  <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
                    <button
                      className="admin-btn admin-btn--ghost admin-btn--sm"
                      onClick={() => setDraft({ ...item })}
                    >
                      <Edit size={12} /> Edit
                    </button>
                    <button
                      className="admin-btn admin-btn--danger admin-btn--sm"
                      onClick={() => remove(item)}
                      aria-label={`Delete testimonial from ${item.name}`}
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
          title={draft.id ? "Edit testimonial" : "New testimonial"}
          onClose={() => setDraft(null)}
          footer={
            <>
              <button className="admin-btn admin-btn--ghost" onClick={() => setDraft(null)}>
                Cancel
              </button>
              <button className="admin-btn admin-btn--gold" onClick={save} disabled={saving}>
                {saving ? "Saving…" : draft.id ? "Save changes" : "Add testimonial"}
              </button>
            </>
          }
        >
          <div className="admin-form-grid">
            <Field label="Guest name">
              <input className="input" value={draft.name} onChange={(e) => set("name", e.target.value)} />
            </Field>
            <Field label="City">
              <input className="input" value={draft.city} onChange={(e) => set("city", e.target.value)} />
            </Field>
            <Field label="Quote" span>
              <textarea
                className="textarea"
                style={{ minHeight: 110 }}
                value={draft.quote}
                onChange={(e) => set("quote", e.target.value)}
              />
            </Field>
            <Field label="Product worn">
              <input
                className="input"
                value={draft.product ?? ""}
                onChange={(e) => set("product", e.target.value)}
                placeholder="Oud Al Malik"
              />
            </Field>
            <Field label="Rating">
              <select
                className="select"
                value={draft.rating}
                onChange={(e) => set("rating", Number(e.target.value))}
              >
                {[5, 4, 3, 2, 1].map((r) => (
                  <option key={r} value={r}>
                    {r} star{r === 1 ? "" : "s"}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Video URL (optional)" span hint="A short review clip, mp4 or embed link.">
              <input
                className="input"
                value={draft.videoUrl ?? ""}
                onChange={(e) => set("videoUrl", e.target.value)}
              />
            </Field>
            <Field label="Visibility" span>
              <label className="admin-check">
                <input
                  type="checkbox"
                  checked={draft.featured}
                  onChange={(e) => set("featured", e.target.checked)}
                />
                Feature this quote on the website
              </label>
            </Field>
          </div>
        </AdminModal>
      ) : null}
    </>
  );
}
