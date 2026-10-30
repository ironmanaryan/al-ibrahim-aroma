"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Settings } from "@/lib/types";
import { adminApi } from "@/lib/adminClient";
import { Field } from "./ui";
import { Check } from "../icons";
import { useToast } from "../Toast";

export default function SettingsAdmin({ initial }: { initial: Settings }) {
  const router = useRouter();
  const { notify } = useToast();
  const [form, setForm] = useState<Settings>(initial);
  const [saving, setSaving] = useState(false);

  function set<K extends keyof Settings>(key: K, value: Settings[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function save() {
    setSaving(true);
    try {
      await adminApi("/api/admin/settings", { method: "PATCH", body: JSON.stringify(form) });
      notify("Settings saved");
      router.refresh();
    } catch (err) {
      notify(err instanceof Error ? err.message : "Could not save settings");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <div className="admin-page-head">
        <div>
          <h1>Settings</h1>
          <p>
            Contact details, the announcement ribbon and the words at the top of the home page. Changes go
            live across the site the moment you save.
          </p>
        </div>
        <div className="admin-actions">
          <button className="admin-btn admin-btn--gold" onClick={save} disabled={saving}>
            <Check size={14} /> {saving ? "Saving…" : "Save settings"}
          </button>
        </div>
      </div>

      <div className="admin-grid admin-grid--2">
        <div className="admin-card">
          <div className="admin-card__head">
            <h3>The house</h3>
            <span>identity</span>
          </div>
          <div className="admin-form-grid">
            <Field label="Brand name" span>
              <input
                className="input"
                value={form.brandName}
                onChange={(e) => set("brandName", e.target.value)}
              />
            </Field>
            <Field label="Tagline" span>
              <input className="input" value={form.tagline} onChange={(e) => set("tagline", e.target.value)} />
            </Field>
            <Field label="Currency symbol">
              <input
                className="input"
                value={form.currency}
                onChange={(e) => set("currency", e.target.value)}
              />
            </Field>
            <Field label="Free shipping over (₹)">
              <input
                className="input"
                type="number"
                value={form.freeShipping}
                onChange={(e) => set("freeShipping", Number(e.target.value))}
              />
            </Field>
          </div>
        </div>

        <div className="admin-card">
          <div className="admin-card__head">
            <h3>Contact</h3>
            <span>public details</span>
          </div>
          <div className="admin-form-grid">
            <Field label="Phone">
              <input className="input" value={form.phone} onChange={(e) => set("phone", e.target.value)} />
            </Field>
            <Field label="WhatsApp number" hint="Digits only, with country code. Used by the floating button.">
              <input
                className="input"
                value={form.whatsapp}
                onChange={(e) => set("whatsapp", e.target.value)}
              />
            </Field>
            <Field label="Email" span>
              <input className="input" value={form.email} onChange={(e) => set("email", e.target.value)} />
            </Field>
            <Field label="Address" span>
              <textarea
                className="textarea"
                style={{ minHeight: 76 }}
                value={form.address}
                onChange={(e) => set("address", e.target.value)}
              />
            </Field>
            <Field label="Hours" span>
              <input className="input" value={form.hours} onChange={(e) => set("hours", e.target.value)} />
            </Field>
          </div>
        </div>

        <div className="admin-card">
          <div className="admin-card__head">
            <h3>Hero</h3>
            <span>home page</span>
          </div>
          <div className="admin-form-grid">
            <Field label="Kicker" span>
              <input
                className="input"
                value={form.heroKicker}
                onChange={(e) => set("heroKicker", e.target.value)}
              />
            </Field>
            <Field
              label="Headline"
              span
              hint="Use | to mark where the line breaks. e.g. “Wear the|memory.”"
            >
              <textarea
                className="textarea"
                style={{ minHeight: 80 }}
                value={form.heroTitle}
                onChange={(e) => set("heroTitle", e.target.value)}
              />
            </Field>
            <Field label="Sub-headline" span>
              <textarea
                className="textarea"
                style={{ minHeight: 80 }}
                value={form.heroSub}
                onChange={(e) => set("heroSub", e.target.value)}
              />
            </Field>
          </div>
        </div>

        <div className="admin-card">
          <div className="admin-card__head">
            <h3>Announcements</h3>
            <span>ribbon</span>
          </div>
          <Field label="One message per line">
            <textarea
              className="textarea"
              style={{ minHeight: 120 }}
              value={form.announcement.join("\n")}
              onChange={(e) =>
                set(
                  "announcement",
                  e.target.value.split("\n").map((l) => l.trim()).filter(Boolean),
                )
              }
            />
          </Field>
        </div>

        <div className="admin-card">
          <div className="admin-card__head">
            <h3>Social</h3>
            <span>links</span>
          </div>
          <div className="admin-form-grid">
            <Field label="Instagram" span>
              <input
                className="input"
                value={form.instagram}
                onChange={(e) => set("instagram", e.target.value)}
              />
            </Field>
            <Field label="Facebook" span>
              <input
                className="input"
                value={form.facebook}
                onChange={(e) => set("facebook", e.target.value)}
              />
            </Field>
            <Field label="YouTube" span>
              <input
                className="input"
                value={form.youtube}
                onChange={(e) => set("youtube", e.target.value)}
              />
            </Field>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 18 }}>
        <button className="admin-btn admin-btn--gold" onClick={save} disabled={saving}>
          <Check size={14} /> {saving ? "Saving…" : "Save settings"}
        </button>
      </div>
    </>
  );
}
