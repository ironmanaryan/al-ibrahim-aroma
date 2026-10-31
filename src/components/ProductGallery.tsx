"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { Product } from "@/lib/types";
import { productGallery } from "@/lib/productImage";
import { ChevronLeft, ChevronRight, Close, Eye } from "./icons";

export default function ProductGallery({ product }: { product: Product }) {
  const [slide, setSlide] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const [mounted, setMounted] = useState(false);
  const touch = useRef<{ x: number; y: number } | null>(null);
  const slides = productGallery(product.slug, product.family);
  const current = slides[slide] ?? slides[0];

  useEffect(() => setMounted(true), []);

  const go = (dir: -1 | 1) => setSlide((s) => (s + dir + slides.length) % slides.length);

  function track(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--zx", `${((e.clientX - rect.left) / rect.width) * 100}%`);
    e.currentTarget.style.setProperty("--zy", `${((e.clientY - rect.top) / rect.height) * 100}%`);
  }

  function onTouchStart(e: React.TouchEvent) {
    const t = e.touches[0];
    touch.current = { x: t.clientX, y: t.clientY };
  }

  function onTouchEnd(e: React.TouchEvent) {
    if (!touch.current) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touch.current.x;
    const dy = t.clientY - touch.current.y;
    if (Math.abs(dx) > 44 && Math.abs(dx) > Math.abs(dy)) go(dx < 0 ? 1 : -1);
    touch.current = null;
  }

  useEffect(() => {
    if (!lightbox) return;
    document.body.classList.add("no-scroll");
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(false);
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.classList.remove("no-scroll");
      window.removeEventListener("keydown", onKey);
    };
  }, [lightbox]);

  return (
    <div className="pdp__gallery">
      <div
        className="pdp__stage"
        onMouseMove={track}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        onClick={() => setLightbox(true)}
        role="button"
        tabIndex={0}
        aria-label={`${product.name} — open full screen`}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setLightbox(true);
          }
        }}
      >
        <Image
          src={current.src}
          alt={`${product.name} — ${current.label}`}
          fill
          priority
          sizes="(max-width: 1080px) 100vw, 45vw"
        />
        <span className="pdp__zoom-hint">
          <Eye size={12} /> Zoom
        </span>
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
      <span className="pdp__swipe-hint">Swipe for the next frame</span>

      {mounted && lightbox
        ? createPortal(
            <div
              className="lightbox"
              role="dialog"
              aria-label={`${product.name} gallery`}
              onClick={() => setLightbox(false)}
            >
              <div className="lightbox__frame" onClick={(e) => e.stopPropagation()}>
                <Image
                  src={current.src}
                  alt={`${product.name} — ${current.label}`}
                  fill
                  sizes="100vw"
                />
                <button
                  className="lightbox__close"
                  onClick={() => setLightbox(false)}
                  aria-label="Close gallery"
                >
                  <Close size={18} />
                </button>
                <button
                  className="lightbox__close"
                  style={{ top: "auto", bottom: 16, right: "auto", left: 16 }}
                  onClick={() => go(-1)}
                  aria-label="Previous frame"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  className="lightbox__close"
                  style={{ top: "auto", bottom: 16, right: 16 }}
                  onClick={() => go(1)}
                  aria-label="Next frame"
                >
                  <ChevronRight size={18} />
                </button>
                <span className="lightbox__count">
                  0{slide + 1} / 0{slides.length} · {current.label}
                </span>
              </div>
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}
