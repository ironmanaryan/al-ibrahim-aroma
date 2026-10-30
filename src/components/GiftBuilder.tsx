"use client";

import { useMemo, useState } from "react";
import type { Product, Settings } from "@/lib/types";
import { formatINR, whatsappUrl } from "@/lib/utils";
import { Check, Gift, Minus, Plus, Whatsapp } from "./icons";
import BottleArt from "./BottleArt";

const ADDONS = [
  { id: "engrave", label: "Engraved brass plate", price: 249 },
  { id: "wrap", label: "Khadi wrap + wax seal", price: 149 },
  { id: "note", label: "Handwritten note", price: 0 },
  { id: "vial", label: "Extra 2ml discovery vial", price: 99 },
];

export default function GiftBuilder({
  products,
  settings,
}: {
  products: Product[];
  settings: Settings;
}) {
  const options = useMemo(
    () => products.filter((p) => p.category === "Attar" || p.category === "Perfume").slice(0, 6),
    [products],
  );
  const [picked, setPicked] = useState<string[]>([options[0]?.id, options[1]?.id].filter(Boolean) as string[]);
  const [addons, setAddons] = useState<string[]>(["wrap", "note"]);

  const chosen = options.filter((p) => picked.includes(p.id));
  const addonTotal = ADDONS.filter((a) => addons.includes(a.id)).reduce((n, a) => n + a.price, 0);
  const scentsTotal = chosen.reduce((n, p) => n + p.sizes[0].price, 0);
  const total = scentsTotal + addonTotal;
  const complete = chosen.length >= 2 && chosen.length <= 4;

  const message = `Hello Al Ibrahim Aroma, I have built a gift set:\n${chosen
    .map((p) => `• ${p.name} (${p.sizes[0].ml}ml) — ${formatINR(p.sizes[0].price)}`)
    .join("\n")}\n${ADDONS.filter((a) => addons.includes(a.id))
    .map((a) => `• ${a.label}${a.price ? ` — ${formatINR(a.price)}` : ""}`)
    .join("\n")}\n\nEstimated total: ${formatINR(total)}`;

  function toggle(id: string) {
    setPicked((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 4) return prev;
      return [...prev, id];
    });
  }

  return (
    <div className="builder" data-reveal>
      <div className="builder__box">
        <div className="builder__group">
          <div className="builder__label">
            <strong>1 · Choose your scents</strong>
            <span>{chosen.length} of 4 selected · minimum 2</span>
          </div>
          <div className="builder__options">
            {options.map((p) => {
              const on = picked.includes(p.id);
              return (
                <button
                  key={p.id}
                  className="builder__opt"
                  data-on={on}
                  onClick={() => toggle(p.id)}
                  aria-pressed={on}
                >
                  {on ? <Check size={12} /> : <Plus size={12} />}
                  {p.name}
                  <small>{formatINR(p.sizes[0].price)}</small>
                </button>
              );
            })}
          </div>
        </div>

        <div className="builder__group">
          <div className="builder__label">
            <strong>2 · Finish the box</strong>
            <span>optional</span>
          </div>
          <div className="builder__options">
            {ADDONS.map((a) => {
              const on = addons.includes(a.id);
              return (
                <button
                  key={a.id}
                  className="builder__opt"
                  data-on={on}
                  onClick={() =>
                    setAddons((prev) => (on ? prev.filter((x) => x !== a.id) : [...prev, a.id]))
                  }
                  aria-pressed={on}
                >
                  {on ? <Check size={12} /> : <Plus size={12} />}
                  {a.label}
                  <small>{a.price ? formatINR(a.price) : "included"}</small>
                </button>
              );
            })}
          </div>
        </div>

        <div className="builder__group">
          <div className="builder__label">
            <strong>3 · How it arrives</strong>
            <span>packed by hand in Lucknow</span>
          </div>
          <p className="muted" style={{ fontSize: 12.5, lineHeight: 1.75 }}>
            Every coffret is lined with khadi, sealed with wax and finished with a card written in ink. If
            you tell us what to say, we will write it for you.
          </p>
        </div>
      </div>

      <aside className="builder__summary">
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Gift size={18} style={{ color: "var(--gold)" }} />
          <span className="eyebrow eyebrow--plain">Your coffret</span>
        </div>
        <div className="builder__lines">
          {chosen.length === 0 ? (
            <div className="builder__line">
              <span className="muted-2">Select at least two scents</span>
            </div>
          ) : (
            chosen.map((p) => (
              <div className="builder__line" key={p.id}>
                <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ width: 22, height: 30 }}>
                    <BottleArt {...p.art} />
                  </span>
                  {p.name}
                  <button
                    onClick={() => toggle(p.id)}
                    aria-label={`Remove ${p.name}`}
                    style={{ color: "var(--muted-2)", display: "inline-flex" }}
                  >
                    <Minus size={12} />
                  </button>
                </span>
                <span>{formatINR(p.sizes[0].price)}</span>
              </div>
            ))
          )}
          {ADDONS.filter((a) => addons.includes(a.id)).map((a) => (
            <div className="builder__line" key={a.id}>
              <span>{a.label}</span>
              <span>{a.price ? formatINR(a.price) : "—"}</span>
            </div>
          ))}
        </div>
        <div className="builder__total">
          <span>{formatINR(total)}</span>
          <small>estimate</small>
        </div>
        <p className="muted-2" style={{ fontSize: 10.5, margin: "8px 0 16px", lineHeight: 1.6 }}>
          Final price confirmed on WhatsApp. Bulk and wedding orders from 50 coffrets.
        </p>
        <a
          className="btn btn--gold btn--block"
          href={whatsappUrl(settings.whatsapp, message)}
          target="_blank"
          rel="noreferrer"
          aria-disabled={!complete}
          style={!complete ? { opacity: 0.5, pointerEvents: "none" } : undefined}
        >
          <Whatsapp size={15} /> Reserve this coffret
        </a>
        <div style={{ marginTop: 10 }}>
          <a className="btn btn--line btn--block" href="/contact?interest=gifting">
            Ask about wedding orders
          </a>
        </div>
      </aside>
    </div>
  );
}
