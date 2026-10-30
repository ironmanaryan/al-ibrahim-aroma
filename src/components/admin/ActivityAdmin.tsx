"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { ActivityEvent, ActivityKind } from "@/lib/types";
import { timeAgo } from "@/lib/utils";
import {
  Bag,
  Clock,
  Mail,
  Search,
  Settings,
  Users,
  Whatsapp,
} from "../icons";

const TABS: { value: "all" | ActivityKind; label: string }[] = [
  { value: "all", label: "Everything" },
  { value: "order", label: "Orders" },
  { value: "lead", label: "Enquiries" },
  { value: "newsletter", label: "Newsletter" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "admin", label: "Admin" },
  { value: "auth", label: "Sign-ins" },
];

const ICONS: Record<ActivityKind, typeof Bag> = {
  order: Bag,
  lead: Users,
  newsletter: Mail,
  whatsapp: Whatsapp,
  admin: Settings,
  auth: Users,
  system: Clock,
};

export default function ActivityAdmin({ initial }: { initial: ActivityEvent[] }) {
  const router = useRouter();
  const [events, setEvents] = useState(initial);
  const [tab, setTab] = useState<"all" | ActivityKind>("all");
  const [query, setQuery] = useState("");

  useEffect(() => {
    setEvents(initial);
  }, [initial]);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return events.filter((e) => {
      if (tab !== "all" && e.kind !== tab) return false;
      if (!q) return true;
      return (
        e.title.toLowerCase().includes(q) ||
        (e.detail ?? "").toLowerCase().includes(q) ||
        JSON.stringify(e.meta ?? {}).toLowerCase().includes(q)
      );
    });
  }, [events, tab, query]);

  return (
    <>
      <div className="admin-page-head">
        <div>
          <h1>Activity</h1>
          <p>
            One running record of the house — orders, enquiries, newsletter sign-ups, WhatsApp taps,
            sign-ins and every admin change. Newest first.
          </p>
        </div>
        <div className="admin-actions">
          <button className="admin-btn admin-btn--ghost" onClick={() => router.refresh()}>
            <Clock size={14} /> Refresh
          </button>
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
                {t.value === "all" ? events.length : events.filter((e) => e.kind === t.value).length}
              </span>
            </button>
          ))}
        </div>
        <label className="admin-search" style={{ marginLeft: "auto" }}>
          <Search size={15} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search activity…"
            aria-label="Search activity"
          />
        </label>
      </div>

      <div className="admin-card">
        {rows.length === 0 ? (
          <p style={{ fontSize: 12, color: "var(--a-muted)", margin: 0 }}>
            Nothing here yet. Activity appears the moment someone orders, enquires or signs in.
          </p>
        ) : (
          <div className="activity-feed">
            {rows.map((event) => {
              const Icon = ICONS[event.kind] ?? Clock;
              return (
                <div key={event.id} className="activity-item">
                  <span className="activity-dot" data-kind={event.kind}>
                    <Icon size={14} />
                  </span>
                  <span>
                    <span className="activity-item__title">{event.title}</span>
                    {event.detail ? (
                      <span className="activity-item__detail">{event.detail}</span>
                    ) : null}
                    {event.meta ? (
                      <span className="activity-meta">
                        {Object.entries(event.meta)
                          .slice(0, 4)
                          .map(([k, v]) => (
                            <span key={k}>
                              {k}: {String(v)}
                            </span>
                          ))}
                      </span>
                    ) : null}
                  </span>
                  <time
                    className="activity-item__time"
                    title={new Date(event.at).toLocaleString("en-IN")}
                    dateTime={event.at}
                  >
                    {timeAgo(event.at)}
                  </time>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
