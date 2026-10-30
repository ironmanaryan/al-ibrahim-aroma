"use client";

import { Fragment, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Lead, LeadStatus } from "@/lib/types";
import { formatINR, timeAgo, whatsappUrl } from "@/lib/utils";
import { adminApi } from "@/lib/adminClient";
import { StatusPill } from "./ui";
import { Bag, ChevronDown, Search, Whatsapp } from "../icons";
import { useToast } from "../Toast";

const TABS: { value: "all" | LeadStatus; label: string }[] = [
  { value: "all", label: "All orders" },
  { value: "new", label: "New" },
  { value: "contacted", label: "Confirmed" },
  { value: "progress", label: "Packing" },
  { value: "closed", label: "Delivered" },
];

export default function OrdersAdmin({ initial }: { initial: Lead[] }) {
  const router = useRouter();
  const { notify } = useToast();
  const [orders, setOrders] = useState(initial);
  const [tab, setTab] = useState<"all" | LeadStatus>("all");
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState("");

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return orders.filter((o) => {
      if (tab !== "all" && o.status !== tab) return false;
      if (!q) return true;
      return (
        o.name.toLowerCase().includes(q) ||
        o.phone.includes(q) ||
        (o.city ?? "").toLowerCase().includes(q) ||
        o.id.toLowerCase().includes(q)
      );
    });
  }, [orders, tab, query]);

  const revenue = orders.reduce((n, o) => n + (o.total ?? 0), 0);
  const awaiting = orders.filter((o) => o.status !== "closed").length;
  const closed = orders.filter((o) => o.status === "closed").length;

  async function patch(id: string, body: Record<string, unknown>) {
    try {
      const data = await adminApi<{ item: Lead }>(`/api/admin/leads/${id}`, {
        method: "PATCH",
        body: JSON.stringify(body),
      });
      setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, ...data.item } : o)));
      notify("Order updated");
      router.refresh();
    } catch (err) {
      notify(err instanceof Error ? err.message : "Could not update");
    }
  }

  return (
    <>
      <div className="admin-page-head">
        <div>
          <h1>Orders</h1>
          <p>
            Every checkout from the website lands here first. Confirm the order, move it through packing,
            and keep the customer&apos;s details one click away.
          </p>
        </div>
        <div className="admin-actions">
          <span className="admin-btn admin-btn--ghost" style={{ cursor: "default" }}>
            <Bag size={14} /> {awaiting} to action
          </span>
        </div>
      </div>

      <div className="order-stats">
        <div className="order-stat">
          <span>Orders</span>
          <strong>{orders.length}</strong>
          <small>all time</small>
        </div>
        <div className="order-stat">
          <span>Order value</span>
          <strong>{formatINR(revenue)}</strong>
          <small>reserved, not captured</small>
        </div>
        <div className="order-stat">
          <span>To action</span>
          <strong>{awaiting}</strong>
          <small>new · confirmed · packing</small>
        </div>
        <div className="order-stat">
          <span>Delivered</span>
          <strong>{closed}</strong>
          <small>closed orders</small>
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
                {t.value === "all" ? orders.length : orders.filter((o) => o.status === t.value).length}
              </span>
            </button>
          ))}
        </div>
        <label className="admin-search" style={{ marginLeft: "auto" }}>
          <Search size={15} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, phone, city, ref…"
            aria-label="Search orders"
          />
        </label>
      </div>

      {rows.length === 0 ? (
        <div className="admin-card">
          <p style={{ fontSize: 12, color: "var(--a-muted)", margin: 0 }}>
            No orders in this view yet. Place a test order from the website checkout to see it appear here
            instantly.
          </p>
        </div>
      ) : (
        <div className="table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Ref</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Received</th>
                <th aria-label="Actions" />
              </tr>
            </thead>
            <tbody>
              {rows.map((order) => {
                const open = openId === order.id;
                const itemCount = order.items?.reduce((n, i) => n + i.qty, 0) ?? 0;
                return (
                  <Fragment key={order.id}>
                    <tr data-open={open}>
                      <td>
                        <span className="order-ref">{order.id.replace(/^l_/, "#").toUpperCase()}</span>
                      </td>
                      <td>
                        <div className="admin-table__name">
                          <strong>{order.name}</strong>
                          <small>
                            {order.phone}
                            {order.city ? ` · ${order.city}` : ""}
                          </small>
                        </div>
                      </td>
                      <td style={{ color: "var(--a-muted)" }}>
                        {itemCount} item{itemCount === 1 ? "" : "s"}
                      </td>
                      <td style={{ fontWeight: 600 }}>{formatINR(order.total ?? 0)}</td>
                      <td>
                        <select
                          className="select select--sm"
                          value={order.status}
                          onChange={(e) => patch(order.id, { status: e.target.value })}
                          aria-label={`Status for ${order.name}`}
                        >
                          <option value="new">New</option>
                          <option value="contacted">Confirmed</option>
                          <option value="progress">Packing</option>
                          <option value="closed">Delivered</option>
                        </select>
                      </td>
                      <td style={{ color: "var(--a-muted)", whiteSpace: "nowrap" }}>
                        {timeAgo(order.createdAt)}
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <button
                          className="admin-btn admin-btn--ghost admin-btn--sm"
                          onClick={() => setOpenId(open ? "" : order.id)}
                          aria-expanded={open}
                        >
                          {open ? "Hide" : "View"}
                          <ChevronDown
                            size={12}
                            style={{ transform: open ? "rotate(180deg)" : undefined }}
                          />
                        </button>
                      </td>
                    </tr>
                    {open ? (
                      <tr className="order-detail-row">
                        <td colSpan={7}>
                          <div className="order-detail">
                            <div>
                              <span className="order-detail__label">Deliver to</span>
                              <p>
                                {order.name}
                                <br />
                                {order.phone}
                                {order.email ? (
                                  <>
                                    <br />
                                    {order.email}
                                  </>
                                ) : null}
                                {order.message ? (
                                  <>
                                    <br />
                                    {order.message}
                                  </>
                                ) : null}
                              </p>
                            </div>
                            <div>
                              <span className="order-detail__label">Items</span>
                              <div className="order-detail__items">
                                {(order.items ?? []).map((item) => (
                                  <div key={`${item.productId}-${item.size}`}>
                                    <span>
                                      {item.name} · {item.size}ml × {item.qty}
                                    </span>
                                    <span>{formatINR(item.price * item.qty)}</span>
                                  </div>
                                ))}
                                {!order.items?.length ? <span>No line items recorded.</span> : null}
                              </div>
                            </div>
                            <div>
                              <span className="order-detail__label">Next step</span>
                              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                                <a
                                  className="admin-btn admin-btn--gold admin-btn--sm"
                                  href={whatsappUrl(
                                    order.phone,
                                    `Hello ${order.name.split(" ")[0]}, this is Al Ibrahim Aroma. We have your order ${order.id.replace(/^l_/, "#").toUpperCase()} for ${formatINR(order.total ?? 0)}. Shall we confirm the delivery details?`,
                                  )}
                                  target="_blank"
                                  rel="noreferrer"
                                >
                                  <Whatsapp size={13} /> WhatsApp
                                </a>
                                <a
                                  className="admin-btn admin-btn--ghost admin-btn--sm"
                                  href={`tel:${order.phone}`}
                                >
                                  Call
                                </a>
                              </div>
                              <div style={{ marginTop: 10 }}>
                                <StatusPill status={order.status} />
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ) : null}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
