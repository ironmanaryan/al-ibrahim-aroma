"use client";

import Image from "next/image";
import { useState } from "react";
import type { Product } from "@/lib/types";
import { productGallery } from "@/lib/productImage";

export default function ProductGallery({ product }: { product: Product }) {
  const [slide, setSlide] = useState(0);
  const slides = productGallery(product.slug, product.family);
  const current = slides[slide] ?? slides[0];

  return (
    <div className="pdp__gallery">
      <div className="pdp__stage">
        <Image
          src={current.src}
          alt={`${product.name} — ${current.label}`}
          fill
          priority
          sizes="(max-width: 1080px) 100vw, 45vw"
        />
        <span className="pdp__stage-label">
          0{slide + 1} / 0{slides.length} · {current.label}
        </span>
      </div>
      <div className="pdp__thumbs">
        {slides.map((s, i) => (
          <button
            key={s.label}
            className="pdp__thumb"
            data-on={slide === i}
            onClick={() => setSlide(i)}
            aria-label={s.label}
          >
            <Image src={s.src} alt="" fill sizes="80px" />
          </button>
        ))}
      </div>
    </div>
  );
}
