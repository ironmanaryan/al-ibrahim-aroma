"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Role, User } from "@/lib/types";
import { adminApi } from "@/lib/adminClient";
import { AdminModal, Field } from "./ui";
import { Edit, Lock, Plus, Trash, Users } from "../icons";
import { useToast } from "../Toast";

type SafeUser = Omit<User, "passwordHash">;

interface Draft {
  id: string;
  name: string;
  email: string;
  role: Role;
  active: boolean;
  password: string;
}

const blank: Draft = {
  id: "",
  name: "",
  email: "",
  role: "moderator",
  active: true,
  password: "",
};

export default function UsersAdmin({
  initial,
  currentUserId,
}: {
  initial: SafeUser[];
  currentUserId: string;
}) {
  const router = useRouter();
  const { notify } = useToast();
  const [draft, setDraft] = useState<Draft | null>(null);
  const [saving, setSaving] = useState(false);

  function edit(user: SafeUser) {
    setDraft({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      active: user.active,
      password: "",
    });
  }

  async function save() {
    if (!draft) return;
    if (!draft.name.trim() || !draft.email.trim()) {
      notify("Name and email are required");
      return;
    }
    if (!draft.id && draft.password.length < 8) {
      notify("New accounts need an 8+ character password");
      return;
    }
    setSaving(true);
    try {
      if (draft.id) {
        const body: Record<string, unknown> = {
          name: draft.name,
          role: draft.role,
          active: draft.active,
        };
        if (draft.password.length >= 8) body.password = draft.password;
        await adminApi(`/api/admin/users/${draft.id}`, { method: "PATCH", body: JSON.stringify(body) });
        notify("Account updated");
      } else {
        await adminApi("/api/admin/users", { method: "POST", body: JSON.stringify(draft) });
        notify("Account created");
      }
      setDraft(null);
      router.refresh();
    } catch (err) {
      notify(err instanceof Error ? err.message : "Could not save");
    } finally {
      setSaving(false);
    }
  }

  async function remove(user: SafeUser) {
    if (user.id === currentUserId) {
      notify("You cannot delete the account you are signed in with");
      return;
    }
    if (!window.confirm(`Delete the account for ${user.name}?`)) return;
    try {
      await adminApi(`/api/admin/users/${user.id}`, { method: "DELETE" });
      notify("Account deleted");
      router.refresh();
    } catch (err) {
      notify(err instanceof Error ? err.message : "Could not delete");
    }
  }

  return (
    <>
      <div className="admin-page-head">
        <div>
          <h1>Users &amp; roles</h1>
          <p>
            Admins can manage everything, including people and settings. Moderators can edit products,
            journal, testimonials and the CRM — but never accounts.
          </p>
        </div>
        <div className="admin-actions">
          <button className="admin-btn admin-btn--gold" onClick={() => setDraft({ ...blank })}>
            <Plus size={14} /> New account
          </button>
        </div>
      </div>

      <div className="admin-grid admin-grid--2" style={{ marginBottom: 16 }}>
        <div className="admin-card">
          <div className="admin-card__head">
            <h3>Access model</h3>
            <span>RBAC</span>
          </div>
          <div style={{ display: "grid", gap: 14 }}>
            <div style={{ display: "flex", gap: 12 }}>
              <span
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: "50%",
                  display: "grid",
                  placeItems: "center",
                  background: "rgba(169,133,63,.12)",
                  color: "var(--a-gold)",
                  flex: "none",
                }}
              >
                <Lock size={14} />
              </span>
              <div>
                <strong style={{ fontSize: 12, fontWeight: 400 }}>Admin</strong>
                <p style={{ fontSize: 11, color: "var(--a-muted)", lineHeight: 1.7 }}>
                  Full control — content, CRM, settings, accounts and deletion rights.
                </p>
              </div>
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <span
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: "50%",
                  display: "grid",
                  placeItems: "center",
                  background: "rgba(30,90,120,.08)",
                  color: "#2f6b85",
                  flex: "none",
                }}
              >
                <Users size={14} />
              </span>
              <div>
                <strong style={{ fontSize: 12, fontWeight: 400 }}>Moderator</strong>
                <p style={{ fontSize: 11, color: "var(--a-muted)", lineHeight: 1.7 }}>
                  Editorial access. Can create and edit content and move leads, but cannot delete or
                  change the house settings.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="admin-card">
          <div className="admin-card__head">
            <h3>Accounts</h3>
            <span>{initial.length} people</span>
          </div>
          <div style={{ display: "grid", gap: 10 }}>
            {initial.map((user) => (
              <div
                key={user.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  paddingBottom: 10,
                  borderBottom: "1px solid var(--a-line)",
                }}
              >
                <span
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: "50%",
                    display: "grid",
                    placeItems: "center",
                    background: "var(--a-line)",
                    fontSize: 11,
                    color: "var(--a-ink)",
                    flex: "none",
                  }}
                >
                  {user.name.slice(0, 1)}
                </span>
                <div style={{ minWidth: 0 }}>
                  <strong style={{ display: "block", fontSize: 11.5, fontWeight: 400 }}>
                    {user.name}
                    {user.id === currentUserId ? (
                      <span style={{ color: "var(--a-gold)", fontSize: 9, marginLeft: 6 }}>you</span>
                    ) : null}
                  </strong>
                  <small style={{ fontSize: 10, color: "var(--a-muted)" }}>{user.email}</small>
                </div>
                <span
                  className="status-pill"
                  data-status={user.role === "admin" ? "closed" : "progress"}
                  style={{ marginLeft: "auto" }}
                >
                  {user.role}
                </span>
                <span
                  className="status-pill"
                  data-status={user.active ? "contacted" : "new"}
                >
                  {user.active ? "active" : "paused"}
                </span>
                <div style={{ display: "flex", gap: 4 }}>
                  <button
                    className="admin-btn admin-btn--ghost admin-btn--sm"
                    onClick={() => edit(user)}
                    aria-label={`Edit ${user.name}`}
                  >
                    <Edit size={11} />
                  </button>
                  <button
                    className="admin-btn admin-btn--danger admin-btn--sm"
                    onClick={() => remove(user)}
                    aria-label={`Delete ${user.name}`}
                    disabled={user.id === currentUserId}
                  >
                    <Trash size={11} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {draft ? (
        <AdminModal
          title={draft.id ? "Edit account" : "New account"}
          onClose={() => setDraft(null)}
          footer={
            <>
              <button className="admin-btn admin-btn--ghost" onClick={() => setDraft(null)}>
                Cancel
              </button>
              <button className="admin-btn admin-btn--gold" onClick={save} disabled={saving}>
                {saving ? "Saving…" : draft.id ? "Save changes" : "Create account"}
              </button>
            </>
          }
        >
          <div className="admin-form-grid">
            <Field label="Name" span>
              <input
                className="input"
                value={draft.name}
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              />
            </Field>
            <Field label="Email" span>
              <input
                className="input"
                type="email"
                value={draft.email}
                disabled={Boolean(draft.id)}
                onChange={(e) => setDraft({ ...draft, email: e.target.value })}
              />
            </Field>
            <Field label="Role">
              <select
                className="select"
                value={draft.role}
                onChange={(e) => setDraft({ ...draft, role: e.target.value as Role })}
              >
                <option value="moderator">Moderator</option>
                <option value="admin">Admin</option>
              </select>
            </Field>
            <Field label={draft.id ? "New password (optional)" : "Password"} hint="Minimum 8 characters.">
              <input
                className="input"
                type="password"
                value={draft.password}
                onChange={(e) => setDraft({ ...draft, password: e.target.value })}
                placeholder={draft.id ? "Leave blank to keep current" : "••••••••"}
              />
            </Field>
            <Field label="Access" span>
              <label className="admin-check">
                <input
                  type="checkbox"
                  checked={draft.active}
                  onChange={(e) => setDraft({ ...draft, active: e.target.checked })}
                />
                Account can sign in
              </label>
            </Field>
          </div>
        </AdminModal>
      ) : null}
    </>
  );
}
