"use client";

import Link from "next/link";
import { useCart } from "./CartProvider";
import BottleArt from "./BottleArt";
import { Bag, Close, Minus, Plus, Trash, Whatsapp } from "./icons";
import { formatINR, whatsappUrl } from "@/lib/utils";
import type { Settings } from "@/lib/types";

export default function CartDrawer({ settings }: { settings: Settings }) {
  const { isOpen, close, lines, subtotal, setQty, remove } = useCart();

  if (!isOpen) return null;

  const shippingLeft = Math.max(0, settings.freeShipping - subtotal);
  const orderText = lines.length
    ? `Hello Al Ibrahim Aroma, I would like to order:\n${lines
        .map((l) => `• ${l.name} — ${l.size}ml × ${l.qty} — ${formatINR(l.price * l.qty)}`)
        .join("\n")}\n\nSubtotal: ${formatINR(subtotal)}`
    : "Hello Al Ibrahim Aroma, I would like to know more about your fragrances.";

  return (
    <>
      <div className="overlay" onClick={close} aria-hidden="true" />
      <aside className="drawer" role="dialog" aria-label="Shopping bag">
        <div className="drawer__head">
          <div>
            <span className="eyebrow">Your selection</span>
            <h2 className="drawer__title">The Bag</h2>
          </div>
          <button className="icon-btn" onClick={close} aria-label="Close cart">
            <Close size={18} />
          </button>
        </div>

        <div className="drawer__body">
          {lines.length === 0 ? (
            <div className="cart-empty">
              <Bag size={30} />
              <p className="muted">Your bag is empty. The house is open — begin with a discovery set.</p>
              <Link href="/collections" className="btn btn--line btn--sm" onClick={close}>
                Browse the collection
              </Link>
            </div>
          ) : (
            lines.map((line) => (
              <div key={line.key} className="cart-line">
                <div className="cart-line__art">
                  <BottleArt {...line.art} />
                </div>
                <div>
                  <Link href={`/product/${line.slug}`} onClick={close} className="cart-line__name">
                    {line.name}
                  </Link>
                  <div className="cart-line__meta">{line.size} ml</div>
                  <div className="qty">
                    <button onClick={() => setQty(line.key, line.qty - 1)} aria-label="Decrease quantity">
                      <Minus size={12} />
                    </button>
                    <span>{line.qty}</span>
                    <button onClick={() => setQty(line.key, line.qty + 1)} aria-label="Increase quantity">
                      <Plus size={12} />
                    </button>
                  </div>
                </div>
                <div className="cart-line__price">
                  <span>{formatINR(line.price * line.qty)}</span>
                  <button
                    className="cart-line__remove"
                    onClick={() => remove(line.key)}
                    aria-label={`Remove ${line.name}`}
                  >
                    <Trash size={14} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {lines.length > 0 ? (
          <div className="drawer__foot">
            <div className="ship-note">
              {shippingLeft > 0 ? (
                <span>
                  Add {formatINR(shippingLeft)} more for <strong>complimentary shipping</strong>
                </span>
              ) : (
                <span>Complimentary shipping unlocked ✦</span>
              )}
              <div className="ship-note__bar">
                <i style={{ width: `${Math.min(100, (subtotal / settings.freeShipping) * 100)}%` }} />
              </div>
            </div>
            <div className="cart-summary">
              <div>
                <span>Subtotal</span>
                <span>{formatINR(subtotal)}</span>
              </div>
              <div className="total">
                <span>Total</span>
                <span>{formatINR(subtotal)}</span>
              </div>
            </div>
            <Link href="/checkout" className="btn btn--gold btn--block" onClick={close}>
              Proceed to checkout
            </Link>
            <a
              href={whatsappUrl(settings.whatsapp, orderText)}
              target="_blank"
              rel="noreferrer"
              className="btn btn--line btn--block"
            >
              <Whatsapp size={15} /> Reserve on WhatsApp
            </a>
            <p className="muted-2" style={{ fontSize: 10, textAlign: "center", letterSpacing: "0.06em" }}>
              Taxes included. Dispatch within 24 hours from Lucknow.
            </p>
          </div>
        ) : null}
      </aside>
    </>
  );
}
