"use client";

import { useEffect, useState } from "react";
import type { Product } from "@/lib/types";
import { formatINR } from "@/lib/utils";
import { useCart } from "./CartProvider";
import { Bag } from "./icons";

export default function StickyBuy({ product }: { product: Product }) {
  const { add } = useCart();
  const [visible, setVisible] = useState(false);
  const size = product.sizes[0];

  useEffect(() => {
    const buy = document.querySelector(".pdp__buy");
    if (!buy) return;
    const update = () => setVisible(buy.getBoundingClientRect().bottom < 0);
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  if (!visible) return null;

  return (
    <div className="sticky-buy">
      <div className="sticky-buy__info">
        <strong>{product.name}</strong>
        <span>
          {size.ml} ml · {formatINR(size.price)}
        </span>
      </div>
      <button
        className="btn btn--gold"
        onClick={() =>
          add({
            key: `${product.id}-${size.ml}`,
            productId: product.id,
            slug: product.slug,
            name: product.name,
            size: size.ml,
            price: size.price,
            qty: 1,
            art: product.art,
          })
        }
      >
        <Bag size={14} /> Add to bag
      </button>
    </div>
  );
}
