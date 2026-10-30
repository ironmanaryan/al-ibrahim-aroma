import Link from "next/link";
import { getSession } from "@/lib/auth";
import { readDB } from "@/lib/store";
import { formatINR, timeAgo } from "@/lib/utils";
import { AreaChart, BarList } from "@/components/admin/Charts";
import { StatusPill } from "@/components/admin/ui";
import { ArrowUpRight, Bag, Box, FileText, Plus, TrendingUp, Users } from "@/components/icons";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const db = await readDB();
  const session = await getSession();
  const firstName = (session?.name ?? db.users[0]?.name ?? "Imran").split(" ")[0];
  const analytics = db.analytics;

  const dayEntries = Object.entries(analytics.byDay).sort(([a], [b]) => a.localeCompare(b));
  const recentDays = dayEntries.slice(-14);
  const points = recentDays.map(([day, value]) => ({ label: day.slice(5), value }));

  const last7 = dayEntries.slice(-7).reduce((n, [, v]) => n + v, 0);
  const prev7 = dayEntries.slice(-14, -7).reduce((n, [, v]) => n + v, 0);
  const delta = prev7 > 0 ? Math.round(((last7 - prev7) / prev7) * 100) : 0;

  const leads = db.leads;
  const newLeads = leads.filter((l) => l.status === "new").length;
  const orders = leads.filter((l) => l.type === "order");
  const revenue = orders.reduce((n, l) => n + (l.total ?? 0), 0);

  const statuses = ["new", "contacted", "progress", "closed"] as const;
  const statusBars = statuses.map((s) => ({
    label: s === "progress" ? "In progress" : s[0].toUpperCase() + s.slice(1),
    value: leads.filter((l) => l.status === s).length,
  }));

  const topPaths = Object.entries(analytics.byPath)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([label, value]) => ({ label: label === "/" ? "Home" : label.replace("/product/", ""), value }));

  const lowStock = [...db.products]
    .filter((p) => p.published)
    .sort((a, b) => a.stock - b.stock)
    .slice(0, 4);

  const recentLeads = leads.slice(0, 6);

  return (
    <>
      <div className="admin-page-head">
        <div>
          <h1>Good evening, {firstName}</h1>
          <p>
            Here is the house today — visits, enquiries and the batches that need refilling. Everything
            updates as people browse.
          </p>
        </div>
        <div className="admin-actions">
          <Link href="/admin/orders" className="admin-btn admin-btn--ghost">
            <Bag size={14} /> Orders
          </Link>
          <Link href="/admin/products" className="admin-btn admin-btn--ghost">
            <Plus size={14} /> New product
          </Link>
          <Link href="/admin/leads" className="admin-btn admin-btn--gold">
            Open CRM <ArrowUpRight size={14} />
          </Link>
        </div>
      </div>

      <div className="admin-kpis">
        <div className="kpi">
          <span className="kpi__label">Visits · 30 days</span>
          <span className="kpi__value">{analytics.visits.toLocaleString("en-IN")}</span>
          <span className="kpi__delta" data-down={delta < 0}>
            <TrendingUp size={12} /> {delta >= 0 ? "+" : ""}
            {delta}% vs last week
          </span>
        </div>
        <div className="kpi">
          <span className="kpi__label">Open enquiries</span>
          <span className="kpi__value">{newLeads}</span>
          <span className="kpi__delta">
            <Users size={12} /> {leads.length} total in CRM
          </span>
        </div>
        <div className="kpi">
          <span className="kpi__label">Orders reserved</span>
          <span className="kpi__value">{orders.length}</span>
          <span className="kpi__delta">
            <Box size={12} /> {db.products.length} products live
          </span>
        </div>
        <div className="kpi">
          <span className="kpi__label">Order value</span>
          <span className="kpi__value" style={{ fontSize: 28 }}>
            {formatINR(revenue)}
          </span>
          <span className="kpi__delta">
            <TrendingUp size={12} /> avg{" "}
            {orders.length ? formatINR(Math.round(revenue / orders.length)) : formatINR(0)}
          </span>
        </div>
      </div>

      <div className="admin-grid admin-grid--2" style={{ marginBottom: 16 }}>
        <div className="admin-card">
          <div className="admin-card__head">
            <h3>Traffic, last 14 days</h3>
            <span>Page views · aggregate</span>
          </div>
          <AreaChart points={points} />
          <div className="chart-legend" style={{ marginTop: 10 }}>
            <span>
              <i style={{ background: "#a9853f" }} /> Visits
            </span>
            <span>Peak {Math.max(...points.map((p) => p.value), 0).toLocaleString("en-IN")}</span>
            <span>{analytics.visits.toLocaleString("en-IN")} this month</span>
          </div>
        </div>

        <div className="admin-card">
          <div className="admin-card__head">
            <h3>Pipeline</h3>
            <span>{leads.length} leads</span>
          </div>
          <BarList items={statusBars} />
          <div style={{ marginTop: 20 }}>
            <div className="admin-card__head">
              <h3 style={{ fontSize: 15 }}>Events</h3>
              <span>all time</span>
            </div>
            <BarList
              items={[
                { label: "WhatsApp", value: analytics.events.whatsapp },
                { label: "Orders", value: analytics.events.orders },
                { label: "Enquiries", value: analytics.events.leads },
              ]}
            />
          </div>
        </div>
      </div>

      <div className="admin-card" style={{ marginBottom: 16 }}>
        <div className="admin-card__head">
          <h3>Latest enquiries</h3>
          <Link href="/admin/leads" className="admin-btn admin-btn--ghost admin-btn--sm">
            View all <ArrowUpRight size={12} />
          </Link>
        </div>
        <div className="table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Interest</th>
                <th>Status</th>
                <th>Value</th>
                <th>Received</th>
              </tr>
            </thead>
            <tbody>
              {recentLeads.map((lead) => (
                <tr key={lead.id}>
                  <td>
                    <div className="admin-table__name">
                      <strong>{lead.name}</strong>
                      <small>
                        {lead.city ?? "—"} · {lead.phone}
                      </small>
                    </div>
                  </td>
                  <td style={{ color: "var(--a-muted)" }}>
                    {lead.interest ?? lead.type}
                  </td>
                  <td>
                    <StatusPill status={lead.status} />
                  </td>
                  <td>{lead.total ? formatINR(lead.total) : "—"}</td>
                  <td style={{ color: "var(--a-muted)" }}>{timeAgo(lead.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="admin-card" style={{ marginBottom: 16 }}>
        <div className="admin-card__head">
          <h3>Live activity</h3>
          <Link href="/admin/activity" className="admin-btn admin-btn--ghost admin-btn--sm">
            All activity <ArrowUpRight size={12} />
          </Link>
        </div>
        {db.activity.length === 0 ? (
          <p style={{ fontSize: 11.5, color: "var(--a-muted)", margin: 0 }}>
            No activity yet. Orders, enquiries, newsletter sign-ups and sign-ins will appear here.
          </p>
        ) : (
          <div className="activity-feed activity-feed--compact">
            {db.activity.slice(0, 8).map((event) => (
              <div key={event.id} className="activity-item">
                <span className="activity-dot activity-dot--sm" data-kind={event.kind} />
                <span>
                  <span className="activity-item__title">{event.title}</span>
                  {event.detail ? (
                    <span className="activity-item__detail">{event.detail}</span>
                  ) : null}
                </span>
                <time
                  className="activity-item__time"
                  dateTime={event.at}
                  title={new Date(event.at).toLocaleString("en-IN")}
                >
                  {timeAgo(event.at)}
                </time>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="admin-grid admin-grid--3">
        <div className="admin-card">
          <div className="admin-card__head">
            <h3>Most visited</h3>
            <span>30 days</span>
          </div>
          <BarList items={topPaths} />
        </div>

        <div className="admin-card">
          <div className="admin-card__head">
            <h3>Batch health</h3>
            <span>low stock</span>
          </div>
          <div style={{ display: "grid", gap: 12 }}>
            {lowStock.map((p) => (
              <div
                key={p.id}
                style={{ display: "flex", justifyContent: "space-between", gap: 10, fontSize: 11.5 }}
              >
                <span>
                  {p.name}
                  <br />
                  <span style={{ color: "var(--a-muted)", fontSize: 10 }}>{p.category}</span>
                </span>
                <span
                  style={{
                    color: p.stock < 25 ? "var(--a-red)" : "var(--a-muted)",
                    whiteSpace: "nowrap",
                  }}
                >
                  {p.stock} left
                </span>
              </div>
            ))}
          </div>
          <Link
            href="/admin/products"
            className="admin-btn admin-btn--ghost admin-btn--sm"
            style={{ marginTop: 16 }}
          >
            Manage stock
          </Link>
        </div>

        <div className="admin-card">
          <div className="admin-card__head">
            <h3>Letters list</h3>
            <span>{db.subscribers.length} subscribers</span>
          </div>
          {db.subscribers.length === 0 ? (
            <p style={{ fontSize: 11.5, color: "var(--a-muted)", lineHeight: 1.6 }}>
              No subscribers yet. The footer newsletter form writes here.
            </p>
          ) : (
            <div style={{ display: "grid", gap: 8 }}>
              {db.subscribers.slice(0, 5).map((s) => (
                <div key={s.id} style={{ fontSize: 11.5, color: "var(--a-muted)" }}>
                  {s.email}
                </div>
              ))}
            </div>
          )}
          <div style={{ display: "flex", gap: 6, marginTop: 16 }}>
            <Link href="/admin/journal" className="admin-btn admin-btn--ghost admin-btn--sm">
              <FileText size={12} /> Write
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
