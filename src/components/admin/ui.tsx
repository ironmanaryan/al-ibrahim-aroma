"use client";

import { Close } from "../icons";

export function AdminModal({
  title,
  onClose,
  children,
  footer,
  wide,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <div className="admin-modal" onClick={onClose} role="dialog" aria-label={title}>
      <div
        className="admin-modal__panel"
        style={wide ? { width: "min(980px, 100%)" } : undefined}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="admin-modal__head">
          <h3>{title}</h3>
          <button onClick={onClose} aria-label="Close">
            <Close size={19} />
          </button>
        </div>
        <div className="admin-modal__body">{children}</div>
        {footer ? <div className="admin-modal__foot">{footer}</div> : null}
      </div>
    </div>
  );
}

export function Field({
  label,
  children,
  span,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  span?: boolean;
  hint?: string;
}) {
  return (
    <div className={`field ${span ? "span-2" : ""}`}>
      <label>{label}</label>
      {children}
      {hint ? <span style={{ fontSize: 10, color: "var(--a-muted)" }}>{hint}</span> : null}
    </div>
  );
}

export function StatusPill({ status }: { status: string }) {
  const labels: Record<string, string> = {
    new: "New",
    contacted: "Contacted",
    progress: "In progress",
    closed: "Closed",
  };
  return (
    <span className="status-pill" data-status={status}>
      {labels[status] ?? status}
    </span>
  );
}

export function EmptyState({ text }: { text: string }) {
  return (
    <div className="empty" style={{ background: "var(--a-card)", borderColor: "var(--a-line)", color: "var(--a-muted)" }}>
      <p>{text}</p>
    </div>
  );
}
