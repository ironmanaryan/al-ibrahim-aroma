"use client";

import { useState } from "react";
import type { Product } from "@/lib/types";
import BottleArt from "./BottleArt";

export default function ProductGallery({ product }: { product: Product }) {
  const [slide, setSlide] = useState(0);

  const slides = [
    { key: "bottle", label: "The flacon", art: product.art },
    { key: "packaging", label: "The packaging", art: { ...product.art, variant: "coffret" as const } },
    { key: "mini", label: "The 9ml travel", art: { ...product.art, variant: "vial" as const } },
  ];

  return (
    <div className="pdp__gallery">
      <div
        className="pdp__stage"
        style={{ ["--tint" as string]: `${product.art.liquid}33` }}
      >
        <BottleArt {...slides[slide].art} title={product.name} />
        <span className="pdp__stage-label">
          0{slide + 1} / 0{slides.length} · {slides[slide].label}
        </span>
      </div>
      <div className="pdp__thumbs">
        {slides.map((s, i) => (
          <button
            key={s.key}
            className="pdp__thumb"
            data-on={slide === i}
            onClick={() => setSlide(i)}
            aria-label={s.label}
          >
            <BottleArt {...s.art} />
          </button>
        ))}
        <div className="pdp__thumb" aria-hidden="true" style={{ opacity: 0.45 }}>
          <span style={{ fontSize: 8, letterSpacing: "0.14em", textAlign: "center", color: "var(--muted-2)" }}>
            HAND
            <br />
            WRAPPED
          </span>
        </div>
      </div>
    </div>
  );
}
