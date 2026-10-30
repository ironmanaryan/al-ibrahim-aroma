"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Lead, LeadStatus } from "@/lib/types";
import { formatINR, timeAgo, whatsappUrl } from "@/lib/utils";
import { adminApi } from "@/lib/adminClient";
import { StatusPill } from "./ui";
import { Mail, Phone, Search, Trash, Whatsapp } from "../icons";
import { useToast } from "../Toast";

const TABS: { value: "all" | LeadStatus; label: string }[] = [
  { value: "all", label: "All" },
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "progress", label: "In progress" },
  { value: "closed", label: "Closed" },
];

export default function LeadsAdmin({ initial }: { initial: Lead[] }) {
  const router = useRouter();
  const { notify } = useToast();
  const [leads, setLeads] = useState(initial);
  const [tab, setTab] = useState<"all" | LeadStatus>("all");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(initial[0]?.id ?? "");
  const [notes, setNotes] = useState(initial[0]?.notes ?? "");
  const [saving, setSaving] = useState(false);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return leads.filter((l) => {
      if (tab !== "all" && l.status !== tab) return false;
      if (!q) return true;
      return (
        l.name.toLowerCase().includes(q) ||
        l.phone.includes(q) ||
        (l.email ?? "").toLowerCase().includes(q) ||
        (l.interest ?? "").toLowerCase().includes(q)
      );
    });
  }, [leads, tab, query]);

  const selected = leads.find((l) => l.id === selectedId) ?? rows[0] ?? null;

  function select(lead: Lead) {
    setSelectedId(lead.id);
    setNotes(lead.notes ?? "");
  }

  async function patch(id: string, body: Record<string, unknown>) {
    try {
      const data = await adminApi<{ item: Lead }>(`/api/admin/leads/${id}`, {
        method: "PATCH",
        body: JSON.stringify(body),
      });
      setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, ...data.item } : l)));
      notify("Lead updated");
    } catch (err) {
      notify(err instanceof Error ? err.message : "Could not update");
    }
  }

  async function saveNotes() {
    if (!selected) return;
    setSaving(true);
    await patch(selected.id, { notes });
    setSaving(false);
  }

  async function remove(lead: Lead) {
    if (!window.confirm(`Delete the enquiry from ${lead.name}?`)) return;
    try {
      await adminApi(`/api/admin/leads/${lead.id}`, { method: "DELETE" });
      setLeads((prev) => prev.filter((l) => l.id !== lead.id));
      setSelectedId("");
      notify("Lead deleted");
      router.refresh();
    } catch (err) {
      notify(err instanceof Error ? err.message : "Could not delete");
    }
  }

  return (
    <>
      <div className="admin-page-head">
        <div>
          <h1>Leads &amp; CRM</h1>
          <p>
            Every enquiry from the website, the cart and the WhatsApp buttons. Move each one through the
            pipeline and keep the notes where the next person can find them.
          </p>
        </div>
        <div className="admin-actions">
          <span className="admin-btn admin-btn--ghost" style={{ cursor: "default" }}>
            {leads.filter((l) => l.status === "new").length} waiting
          </span>
        </div>
      </div>

      <div className="admin-toolbar">
        <div className="admin-tabs">
          {TABS.map((t) => (
            <button
              key={t.value}
              className="admin-tab"
              data-active={tab === t.value}
              onClick={() => setTab(t.value)}
            >
              {t.label}
              <span style={{ opacity: 0.55, marginLeft: 5 }}>
                {t.value === "all" ? leads.length : leads.filter((l) => l.status === t.value).length}
              </span>
            </button>
          ))}
        </div>
        <label className="admin-search" style={{ marginLeft: "auto" }}>
          <Search size={15} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, phone, interest…"
            aria-label="Search leads"
          />
        </label>
      </div>

      <div className="lead-layout">
        <div className="lead-list">
          {rows.length === 0 ? (
            <div className="empty" style={{ background: "var(--a-card)", borderColor: "var(--a-line)" }}>
              <p>No leads in this view.</p>
            </div>
          ) : (
            rows.map((lead) => (
              <button
                key={lead.id}
                className="lead-row"
                data-active={selected?.id === lead.id}
                onClick={() => select(lead)}
              >
                <span>
                  <span className="lead-row__name">{lead.name}</span>
                  <span className="lead-row__meta">
                    <span>{lead.phone}</span>
                    <span>·</span>
                    <span>{lead.city ?? "—"}</span>
                    <span>·</span>
                    <span>{timeAgo(lead.createdAt)}</span>
                  </span>
                </span>
                <StatusPill status={lead.status} />
                <span className="lead-row__msg">
                  {lead.interest ? `${lead.interest} — ` : ""}
                  {lead.message ?? lead.type}
                </span>
              </button>
            ))
          )}
        </div>

        {selected ? (
          <aside className="admin-card lead-detail">
            <div className="admin-card__head">
              <div>
                <h3 style={{ fontSize: 24 }}>{selected.name}</h3>
                <span style={{ textTransform: "none", letterSpacing: 0 }}>
                  {selected.type} · {selected.source}
                </span>
              </div>
              <StatusPill status={selected.status} />
            </div>

            <div className="lead-detail__row">
              <span>Phone</span>
              <strong>{selected.phone}</strong>
            </div>
            {selected.email ? (
              <div className="lead-detail__row">
                <span>Email</span>
                <strong>{selected.email}</strong>
              </div>
            ) : null}
            <div className="lead-detail__row">
              <span>City</span>
              <strong>{selected.city ?? "—"}</strong>
            </div>
            <div className="lead-detail__row">
              <span>Interest</span>
              <strong>{selected.interest ?? "—"}</strong>
            </div>
            <div className="lead-detail__row">
              <span>Received</span>
              <strong>{new Date(selected.createdAt).toLocaleString("en-IN")}</strong>
            </div>

            {selected.message ? (
              <p
                style={{
                  fontSize: 12,
                  lineHeight: 1.7,
                  color: "var(--a-muted)",
                  padding: "14px 0",
                  borderBottom: "1px solid var(--a-line)",
                  whiteSpace: "pre-line",
                }}
              >
                {selected.message}
              </p>
            ) : null}

            {selected.items?.length ? (
              <div className="lead-items">
                {selected.items.map((item) => (
                  <div key={`${item.productId}-${item.size}`}>
                    <span>
                      {item.name} · {item.size}ml × {item.qty}
                    </span>
                    <span>{formatINR(item.price * item.qty)}</span>
                  </div>
                ))}
                <div style={{ borderTop: "1px solid var(--a-line)", paddingTop: 8, color: "var(--a-ink)" }}>
                  <span>Order total</span>
                  <span>{formatINR(selected.total ?? 0)}</span>
                </div>
              </div>
            ) : null}

            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", margin: "16px 0" }}>
              <a
                className="admin-btn admin-btn--gold admin-btn--sm"
                href={whatsappUrl(
                  selected.phone,
                  `Hello ${selected.name.split(" ")[0]}, this is Al Ibrahim Aroma. Thank you for your enquiry.`,
                )}
                target="_blank"
                rel="noreferrer"
              >
                <Whatsapp size={13} /> WhatsApp
              </a>
              <a className="admin-btn admin-btn--ghost admin-btn--sm" href={`tel:${selected.phone}`}>
                <Phone size={13} /> Call
              </a>
              {selected.email ? (
                <a className="admin-btn admin-btn--ghost admin-btn--sm" href={`mailto:${selected.email}`}>
                  <Mail size={13} /> Email
                </a>
              ) : null}
              <button
                className="admin-btn admin-btn--danger admin-btn--sm"
                onClick={() => remove(selected)}
                style={{ marginLeft: "auto" }}
              >
                <Trash size={13} />
              </button>
            </div>

            <div className="field">
              <label>Pipeline status</label>
              <select
                className="select"
                value={selected.status}
                onChange={(e) => patch(selected.id, { status: e.target.value })}
              >
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="progress">In progress</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            <div className="field" style={{ marginTop: 14 }}>
              <label>Internal notes</label>
              <textarea
                className="textarea"
                style={{ minHeight: 96 }}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Sample sent, follow up after Diwali…"
              />
            </div>
            <button
              className="admin-btn admin-btn--gold admin-btn--sm"
              style={{ marginTop: 10 }}
              onClick={saveNotes}
              disabled={saving}
            >
              {saving ? "Saving…" : "Save notes"}
            </button>
          </aside>
        ) : (
          <aside className="admin-card lead-detail">
            <p style={{ fontSize: 12, color: "var(--a-muted)" }}>Select an enquiry to see the details.</p>
          </aside>
        )}
      </div>
    </>
  );
}
