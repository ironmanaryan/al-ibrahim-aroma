"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { JournalPost } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { adminApi } from "@/lib/adminClient";
import { AdminModal, Field } from "./ui";
import { Edit, Plus, Search, Trash } from "../icons";
import { useToast } from "../Toast";

const CATEGORIES = ["Guides", "Craft", "Journal"];

const blank: JournalPost = {
  id: "",
  slug: "",
  title: "",
  excerpt: "",
  category: "Journal",
  author: "Ayesha Ibrahim",
  readTime: 4,
  publishedAt: new Date().toISOString(),
  published: true,
  body: "",
};

export default function JournalAdmin({ initial }: { initial: JournalPost[] }) {
  const router = useRouter();
  const { notify } = useToast();
  const [query, setQuery] = useState("");
  const [draft, setDraft] = useState<JournalPost | null>(null);
  const [saving, setSaving] = useState(false);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return initial;
    return initial.filter((p) => p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
  }, [initial, query]);

  function set<K extends keyof JournalPost>(key: K, value: JournalPost[K]) {
    setDraft((d) => (d ? { ...d, [key]: value } : d));
  }

  async function save() {
    if (!draft) return;
    if (!draft.title.trim() || !draft.body.trim()) {
      notify("A letter needs a title and a body");
      return;
    }
    setSaving(true);
    try {
      if (draft.id) {
        await adminApi(`/api/admin/journal/${draft.id}`, {
          method: "PATCH",
          body: JSON.stringify(draft),
        });
        notify("Letter updated");
      } else {
        await adminApi("/api/admin/journal", { method: "POST", body: JSON.stringify(draft) });
        notify("Letter published");
      }
      setDraft(null);
      router.refresh();
    } catch (err) {
      notify(err instanceof Error ? err.message : "Could not save");
    } finally {
      setSaving(false);
    }
  }

  async function remove(post: JournalPost) {
    if (!window.confirm(`Delete “${post.title}”?`)) return;
    try {
      await adminApi(`/api/admin/journal/${post.id}`, { method: "DELETE" });
      notify("Letter deleted");
      router.refresh();
    } catch (err) {
      notify(err instanceof Error ? err.message : "Could not delete");
    }
  }

  return (
    <>
      <div className="admin-page-head">
        <div>
          <h1>Journal</h1>
          <p>
            Harvest notes, guides and house arguments. Markdown-lite: use <code>## Heading</code> for a
            subhead and <code>&gt; quote</code> for a pull quote.
          </p>
        </div>
        <div className="admin-actions">
          <button className="admin-btn admin-btn--gold" onClick={() => setDraft({ ...blank })}>
            <Plus size={14} /> New letter
          </button>
        </div>
      </div>

      <div className="admin-toolbar">
        <label className="admin-search">
          <Search size={15} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search letters…"
            aria-label="Search letters"
          />
        </label>
        <span style={{ fontSize: 11, color: "var(--a-muted)", marginLeft: "auto" }}>
          {initial.filter((p) => p.published).length} published · {initial.length} total
        </span>
      </div>

      <div className="table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Author</th>
              <th>Published</th>
              <th>Status</th>
              <th style={{ textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((post) => (
              <tr key={post.id}>
                <td>
                  <div className="admin-table__name">
                    <strong>{post.title}</strong>
                    <small>{post.readTime} min read</small>
                  </div>
                </td>
                <td style={{ color: "var(--a-muted)" }}>{post.category}</td>
                <td style={{ color: "var(--a-muted)" }}>{post.author}</td>
                <td style={{ color: "var(--a-muted)" }}>{formatDate(post.publishedAt)}</td>
                <td>
                  <span className="status-pill" data-status={post.published ? "closed" : "new"}>
                    {post.published ? "Live" : "Draft"}
                  </span>
                </td>
                <td>
                  <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
                    <button
                      className="admin-btn admin-btn--ghost admin-btn--sm"
                      onClick={() => setDraft({ ...post })}
                    >
                      <Edit size={12} /> Edit
                    </button>
                    <button
                      className="admin-btn admin-btn--danger admin-btn--sm"
                      onClick={() => remove(post)}
                      aria-label={`Delete ${post.title}`}
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
          title={draft.id ? "Edit letter" : "New letter"}
          onClose={() => setDraft(null)}
          wide
          footer={
            <>
              <button className="admin-btn admin-btn--ghost" onClick={() => setDraft(null)}>
                Cancel
              </button>
              <button className="admin-btn admin-btn--gold" onClick={save} disabled={saving}>
                {saving ? "Saving…" : draft.id ? "Save changes" : "Publish letter"}
              </button>
            </>
          }
        >
          <div className="admin-form-grid">
            <Field label="Title" span>
              <input className="input" value={draft.title} onChange={(e) => set("title", e.target.value)} />
            </Field>
            <Field label="Category">
              <select className="select" value={draft.category} onChange={(e) => set("category", e.target.value)}>
                {CATEGORIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </Field>
            <Field label="Author">
              <input className="input" value={draft.author} onChange={(e) => set("author", e.target.value)} />
            </Field>
            <Field label="Excerpt" span>
              <textarea
                className="textarea"
                style={{ minHeight: 70 }}
                value={draft.excerpt}
                onChange={(e) => set("excerpt", e.target.value)}
              />
            </Field>
            <Field label="Body" span hint="Blank line between paragraphs. ## for a heading, > for a quote.">
              <textarea
                className="textarea"
                style={{ minHeight: 260, fontFamily: "ui-monospace, monospace", fontSize: 12 }}
                value={draft.body}
                onChange={(e) => set("body", e.target.value)}
              />
            </Field>
            <Field label="Publish date">
              <input
                className="input"
                type="date"
                value={draft.publishedAt.slice(0, 10)}
                onChange={(e) => set("publishedAt", new Date(e.target.value).toISOString())}
              />
            </Field>
            <Field label="Visibility">
              <label className="admin-check" style={{ minHeight: 40 }}>
                <input
                  type="checkbox"
                  checked={draft.published}
                  onChange={(e) => set("published", e.target.checked)}
                />
                Published on the website
              </label>
            </Field>
          </div>
        </AdminModal>
      ) : null}
    </>
  );
}
