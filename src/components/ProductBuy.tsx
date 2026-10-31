"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Product, Settings } from "@/lib/types";
import { formatINR, whatsappUrl } from "@/lib/utils";
import { useCart } from "./CartProvider";
import { useToast } from "./Toast";
import { Bag, Box, Gift, Minus, Plus, Truck, Whatsapp } from "./icons";

export default function ProductBuy({
  product,
  settings,
}: {
  product: Product;
  settings: Settings;
}) {
  const { add, close } = useCart();
  const { notify } = useToast();
  const router = useRouter();
  const [sizeIndex, setSizeIndex] = useState(0);
  const [qty, setQty] = useState(1);
  const size = product.sizes[sizeIndex] ?? product.sizes[0];
  const lowStock = product.stock > 0 && product.stock < 15;

  function addToBag(thenCheckout = false) {
    add({
      key: `${product.id}-${size.ml}`,
      productId: product.id,
      slug: product.slug,
      name: product.name,
      size: size.ml,
      price: size.price,
      qty,
      art: product.art,
    });
    notify(`${product.name} added to your bag`);
    if (thenCheckout) {
      close();
      router.push("/checkout");
    }
  }

  const message = `Hello Al Ibrahim Aroma, I would like to order:\n${product.name} — ${size.ml}ml × ${qty} — ${formatINR(
    size.price * qty,
  )}\n\nPlease confirm availability and delivery.`;

  return (
    <div style={{ display: "grid", gap: 18 }}>
      <div className="pdp__price">
        {formatINR(size.price)}
        {size.compareAt ? <s>{formatINR(size.compareAt)}</s> : null}
        {size.compareAt ? (
          <span className="off">Save {formatINR(size.compareAt - size.price)}</span>
        ) : null}
      </div>
      <div>
        <span className="overline">Select size</span>
        <div className="pdp__sizes" style={{ marginTop: 10 }}>
          {product.sizes.map((s, i) => (
            <button
              key={s.ml}
              className="size-chip"
              data-on={i === sizeIndex}
              onClick={() => setSizeIndex(i)}
            >
              <strong>{s.ml} ml</strong>
              <span>{formatINR(s.price)}</span>
            </button>
          ))}
        </div>
      </div>

      {lowStock ? (
        <div className="low-stock">
          <span>Only {product.stock} left in this batch</span>
          <div className="low-stock__bar">
            <i style={{ width: `${Math.max(8, Math.min(100, (product.stock / 15) * 100))}%` }} />
          </div>
        </div>
      ) : null}

      <div className="pdp__buy">
        <div className="qty" style={{ marginTop: 0, minHeight: 48, padding: "0 6px" }}>
          <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease quantity">
            <Minus size={13} />
          </button>
          <span style={{ minWidth: 32 }}>{qty}</span>
          <button onClick={() => setQty((q) => Math.min(9, q + 1))} aria-label="Increase quantity">
            <Plus size={13} />
          </button>
        </div>
        <button className="btn btn--gold" onClick={() => addToBag()}>
          <Bag size={15} /> Add to bag · {formatINR(size.price * qty)}
        </button>
        <button className="btn btn--line" onClick={() => addToBag(true)}>
          Buy now
        </button>
        <a
          className="btn btn--line"
          href={whatsappUrl(settings.whatsapp, message)}
          target="_blank"
          rel="noreferrer"
        >
          <Whatsapp size={15} /> Order on WhatsApp
        </a>
      </div>

      <div className="payment-strip">
        <span>Secure payment</span>
        <span className="pay-badge">UPI</span>
        <span className="pay-badge">Visa</span>
        <span className="pay-badge">Mastercard</span>
        <span className="pay-badge">RuPay</span>
        <span className="pay-badge">COD</span>
        <span style={{ marginLeft: "auto", letterSpacing: "0.04em" }}>
          7-day returns on unopened bottles
        </span>
      </div>

      <div className="pdp__assure">
        <div>
          <Truck size={15} /> Dispatched within 24 hours from Lucknow
        </div>
        <div>
          <Gift size={15} /> Free 2ml discovery vial with every order
        </div>
        <div>
          <Box size={15} /> {product.stock > 0 ? `${product.stock} bottles in this batch` : "Waitlist open"}
        </div>
      </div>
    </div>
  );
}
