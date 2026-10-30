"use client";

import Link from "next/link";
import { useState } from "react";
import type { Product } from "@/lib/types";
import { formatINR } from "@/lib/utils";
import Image from "next/image";
import { productImage } from "@/lib/productImage";
import { ArrowRight, Bag, Close, Eye, Star } from "./icons";
import { useCart } from "./CartProvider";
import { useToast } from "./Toast";

export function Stars({ rating, count }: { rating: number; count?: number }) {
  return (
    <span className="stars" aria-label={`${rating} out of 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} size={11} style={{ opacity: i <= Math.round(rating) ? 1 : 0.25 }} />
      ))}
      {typeof count === "number" ? <span>({count})</span> : null}
    </span>
  );
}

export default function ProductCard({
  product,
  onQuickView,
}: {
  product: Product;
  onQuickView?: (product: Product) => void;
}) {
  const { add } = useCart();
  const { notify } = useToast();
  const size = product.sizes[0];

  function addToBag() {
    add({
      key: `${product.id}-${size.ml}`,
      productId: product.id,
      slug: product.slug,
      name: product.name,
      size: size.ml,
      price: size.price,
      qty: 1,
      art: product.art,
    });
    notify(`${product.name} added to your bag`);
  }

  return (
    <article className="card" data-reveal>
      <div className="card__media" style={{ ["--tint" as string]: `${product.art.liquid}33` }}>
        {product.badge ? <span className="badge card__badge">{product.badge}</span> : null}
        <Image
          className="card__photo"
          src={productImage(product.slug, product.family)}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1080px) 33vw, 25vw"
        />
        <Link href={`/product/${product.slug}`} aria-label={product.name} className="card__link" />
        <div className="card__quick">
          {onQuickView ? (
            <button className="btn" onClick={() => onQuickView(product)}>
              <Eye size={13} /> Quick view
            </button>
          ) : null}
          <button className="btn" onClick={addToBag}>
            <Bag size={13} /> Add
          </button>
        </div>
      </div>
      <div className="card__body">
        <div className="card__meta">
          <span>{product.family}</span>
          <span>{product.category}</span>
        </div>
        <Link href={`/product/${product.slug}`}>
          <h3 className="card__name">{product.name}</h3>
        </Link>
        <p className="card__sub">{product.subtitle}</p>
        <div className="card__foot">
          <span className="card__price">
            {formatINR(product.price)}
            {product.compareAt ? <s>{formatINR(product.compareAt)}</s> : null}
          </span>
          <Stars rating={product.rating} />
        </div>
      </div>
    </article>
  );
}

export function QuickView({
  product,
  onClose,
}: {
  product: Product;
  onClose: () => void;
}) {
  const { add } = useCart();
  const { notify } = useToast();
  const [sizeIndex, setSizeIndex] = useState(0);
  const size = product.sizes[sizeIndex] ?? product.sizes[0];

  return (
    <div className="modal" onClick={onClose} role="dialog" aria-label={`${product.name} quick view`}>
      <div className="modal__panel" onClick={(e) => e.stopPropagation()}>
        <button className="modal__close" onClick={onClose} aria-label="Close quick view">
          <Close size={18} />
        </button>
        <div className="quickview__art">
          <Image
            src={productImage(product.slug, product.family)}
            alt={product.name}
            fill
            sizes="(max-width: 860px) 100vw, 40vw"
          />
        </div>
        <div className="quickview__body">
          <div className="card__meta">
            <span>
              {product.family} · {product.category}
            </span>
            <Stars rating={product.rating} count={product.reviewCount} />
          </div>
          <h2 className="h3" style={{ fontSize: 34 }}>
            {product.name}
          </h2>
          <p className="muted" style={{ fontSize: 13, lineHeight: 1.7 }}>
            {product.description}
          </p>
          <div className="quickview__notes">
            {[...product.notes.top, ...product.notes.heart, ...product.notes.base].slice(0, 6).map((n) => (
              <span key={n}>{n}</span>
            ))}
          </div>
          <div className="pdp__sizes">
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
          <div className="pdp__price">{formatINR(size.price)}</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button
              className="btn btn--gold"
              style={{ flex: 1 }}
              onClick={() => {
                add({
                  key: `${product.id}-${size.ml}`,
                  productId: product.id,
                  slug: product.slug,
                  name: product.name,
                  size: size.ml,
                  price: size.price,
                  qty: 1,
                  art: product.art,
                });
                notify(`${product.name} added to your bag`);
                onClose();
              }}
            >
              <Bag size={14} /> Add to bag
            </button>
            <Link href={`/product/${product.slug}`} className="btn btn--line" onClick={onClose}>
              Full details <ArrowRight size={14} />
            </Link>
          </div>
          <p className="muted-2" style={{ fontSize: 10.5, letterSpacing: "0.05em" }}>
            {product.longevity} · {product.sillage} sillage · Complimentary sample with every order
          </p>
        </div>
      </div>
    </div>
  );
}
