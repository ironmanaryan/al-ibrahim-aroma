"use client";

import Link from "next/link";
import { useState } from "react";
import type { Settings } from "@/lib/types";
import { formatINR, whatsappUrl } from "@/lib/utils";
import { useCart } from "./CartProvider";
import Image from "next/image";
import { productImage } from "@/lib/productImage";
import { ArrowRight, Check, Gift, Whatsapp } from "./icons";

interface Details {
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  pincode: string;
  note: string;
  gift: boolean;
}

const initial: Details = {
  name: "",
  phone: "",
  email: "",
  address: "",
  city: "",
  pincode: "",
  note: "",
  gift: true,
};

export default function CheckoutClient({ settings }: { settings: Settings }) {
  const { lines, subtotal, clear, ready } = useCart();
  const [details, setDetails] = useState<Details>(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [reference, setReference] = useState("");

  const shipping = subtotal >= settings.freeShipping || subtotal === 0 ? 0 : 79;
  const total = subtotal + shipping;

  function set<K extends keyof Details>(key: K, value: Details[K]) {
    setDetails((d) => ({ ...d, [key]: value }));
    setErrors((e) => ({ ...e, [key]: "" }));
  }

  function validate() {
    const next: Record<string, string> = {};
    if (details.name.trim().length < 2) next.name = "Please enter your full name.";
    if (!/^[0-9+\s-]{10,16}$/.test(details.phone.trim())) next.phone = "A valid phone number is needed for delivery.";
    if (details.email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(details.email)) next.email = "That email looks off.";
    if (details.address.trim().length < 8) next.address = "Please add a full delivery address.";
    if (details.city.trim().length < 2) next.city = "City is required.";
    if (!/^[0-9]{5,6}$/.test(details.pincode.trim())) next.pincode = "Enter a 5–6 digit PIN code.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  const orderMessage = `Hello Al Ibrahim Aroma, I would like to place an order:\n${lines
    .map((l) => `• ${l.name} ${l.size}ml × ${l.qty} — ${formatINR(l.price * l.qty)}`)
    .join("\n")}\n\nShipping: ${shipping === 0 ? "Complimentary" : formatINR(shipping)}\nTotal: ${formatINR(
    total,
  )}\n\nName: ${details.name}\nPhone: ${details.phone}\nAddress: ${details.address}, ${details.city} ${details.pincode}`;

  async function submit() {
    if (!validate()) return;
    setState("loading");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: details.name,
          phone: details.phone,
          email: details.email,
          city: details.city,
          type: "order",
          interest: `${lines.length} item${lines.length === 1 ? "" : "s"}`,
          message: `${details.gift ? "[Gift wrap requested]\n" : ""}Address: ${details.address}, ${details.city} ${details.pincode}\n${
            details.note ? `Note: ${details.note}` : ""
          }`,
          items: lines.map((l) => ({
            productId: l.productId,
            name: l.name,
            size: l.size,
            price: l.price,
            qty: l.qty,
          })),
          total,
          source: "checkout",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error("failed");
      setReference(data.id ?? "");
      setState("done");
      clear();
    } catch {
      setState("error");
    }
  }

  if (!ready) return <div className="empty">Opening your bag…</div>;

  if (state === "done") {
    return (
      <div className="checkout-done">
        <div className="success__mark">
          <Check size={26} />
        </div>
        <h2 className="h2">Order reserved</h2>
        <p className="lede" style={{ maxWidth: "46ch" }}>
          Thank you, {details.name.split(" ")[0]}. Your order is with the atelier and we will confirm stock
          and shipping on WhatsApp shortly. No payment has been taken.
        </p>
        {reference ? <span className="overline">Reference {reference}</span> : null}
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center", marginTop: 8 }}>
          <a
            className="btn btn--gold"
            href={whatsappUrl(settings.whatsapp, orderMessage)}
            target="_blank"
            rel="noreferrer"
          >
            <Whatsapp size={15} /> Confirm on WhatsApp
          </a>
          <Link href="/collections" className="btn btn--line">
            Keep browsing
          </Link>
        </div>
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="empty" style={{ marginTop: 30 }}>
        <p>Your bag is empty.</p>
        <Link href="/collections" className="btn btn--gold btn--sm">
          Browse the house <ArrowRight size={13} />
        </Link>
      </div>
    );
  }

  return (
    <div className="checkout">
      <div className="checkout__form">
        <div className="form-shell">
          <span className="eyebrow">Delivery details</span>
          <div className="form-grid" style={{ marginTop: 20 }}>
            <div className="field" data-invalid={Boolean(errors.name)}>
              <label htmlFor="co-name">Full name *</label>
              <input
                id="co-name"
                className="input"
                value={details.name}
                onChange={(e) => set("name", e.target.value)}
                autoComplete="name"
                placeholder="Ayesha Khan"
              />
              {errors.name ? <span className="field__error">{errors.name}</span> : null}
            </div>
            <div className="field" data-invalid={Boolean(errors.phone)}>
              <label htmlFor="co-phone">Phone / WhatsApp *</label>
              <input
                id="co-phone"
                className="input"
                value={details.phone}
                onChange={(e) => set("phone", e.target.value)}
                inputMode="tel"
                autoComplete="tel"
                placeholder="+91 98765 43210"
              />
              {errors.phone ? <span className="field__error">{errors.phone}</span> : null}
            </div>
            <div className="field span-2" data-invalid={Boolean(errors.email)}>
              <label htmlFor="co-email">Email</label>
              <input
                id="co-email"
                className="input"
                type="email"
                value={details.email}
                onChange={(e) => set("email", e.target.value)}
                autoComplete="email"
                placeholder="you@example.com"
              />
              {errors.email ? <span className="field__error">{errors.email}</span> : null}
            </div>
            <div className="field span-2" data-invalid={Boolean(errors.address)}>
              <label htmlFor="co-address">Delivery address *</label>
              <textarea
                id="co-address"
                className="textarea"
                style={{ minHeight: 84 }}
                value={details.address}
                onChange={(e) => set("address", e.target.value)}
                autoComplete="street-address"
                placeholder="House / flat, street, landmark"
              />
              {errors.address ? <span className="field__error">{errors.address}</span> : null}
            </div>
            <div className="field" data-invalid={Boolean(errors.city)}>
              <label htmlFor="co-city">City *</label>
              <input
                id="co-city"
                className="input"
                value={details.city}
                onChange={(e) => set("city", e.target.value)}
                autoComplete="address-level2"
                placeholder="Lucknow"
              />
              {errors.city ? <span className="field__error">{errors.city}</span> : null}
            </div>
            <div className="field" data-invalid={Boolean(errors.pincode)}>
              <label htmlFor="co-pin">PIN code *</label>
              <input
                id="co-pin"
                className="input"
                value={details.pincode}
                onChange={(e) => set("pincode", e.target.value)}
                inputMode="numeric"
                autoComplete="postal-code"
                placeholder="226001"
              />
              {errors.pincode ? <span className="field__error">{errors.pincode}</span> : null}
            </div>
            <div className="field span-2">
              <label htmlFor="co-note">Note for the atelier</label>
              <textarea
                id="co-note"
                className="textarea"
                style={{ minHeight: 78 }}
                value={details.note}
                onChange={(e) => set("note", e.target.value)}
                placeholder="A message for the handwritten card, delivery instructions…"
              />
            </div>
          </div>

          <label className="check" style={{ marginTop: 16 }}>
            <input type="checkbox" checked={details.gift} onChange={(e) => set("gift", e.target.checked)} />
            <span>
              <Gift size={12} style={{ display: "inline", verticalAlign: "-1px", color: "var(--gold)" }} />{" "}
              Wrap this order in khadi with a wax seal and a handwritten card — complimentary.
            </span>
          </label>

          {state === "error" ? (
            <p className="field__error" style={{ marginTop: 12 }}>
              We could not save the order. Please try again, or send it directly on WhatsApp.
            </p>
          ) : null}

          <button
            className="btn btn--gold btn--block"
            style={{ marginTop: 20 }}
            onClick={submit}
            disabled={state === "loading"}
          >
            {state === "loading" ? "Reserving…" : `Reserve order · ${formatINR(total)}`}
            <ArrowRight size={14} />
          </button>
          <p className="muted-2" style={{ fontSize: 10.5, marginTop: 10, lineHeight: 1.6 }}>
            No payment is taken now. We confirm stock on WhatsApp and send a secure payment link. Prices
            include taxes.
          </p>
        </div>
      </div>

      <aside className="checkout__summary">
        <span className="eyebrow">Your bag</span>
        <div className="checkout__lines">
          {lines.map((l) => (
            <div className="cart-line" key={l.key} style={{ gridTemplateColumns: "56px 1fr auto" }}>
              <div className="cart-line__art">
                <Image src={productImage(l.slug)} alt={l.name} fill sizes="56px" />
              </div>
              <div>
                <span className="cart-line__name">{l.name}</span>
                <div className="cart-line__meta">
                  {l.size} ml × {l.qty}
                </div>
              </div>
              <span style={{ fontSize: 12.5 }}>{formatINR(l.price * l.qty)}</span>
            </div>
          ))}
        </div>
        <div className="cart-summary" style={{ marginTop: 16 }}>
          <div>
            <span>Subtotal</span>
            <span>{formatINR(subtotal)}</span>
          </div>
          <div>
            <span>Shipping</span>
            <span>{shipping === 0 ? "Complimentary" : formatINR(shipping)}</span>
          </div>
          <div className="total">
            <span>Total</span>
            <span>{formatINR(total)}</span>
          </div>
        </div>
        <a
          className="btn btn--line btn--block"
          style={{ marginTop: 14 }}
          href={whatsappUrl(settings.whatsapp, orderMessage)}
          target="_blank"
          rel="noreferrer"
        >
          <Whatsapp size={15} /> Order on WhatsApp instead
        </a>
      </aside>
    </div>
  );
}
