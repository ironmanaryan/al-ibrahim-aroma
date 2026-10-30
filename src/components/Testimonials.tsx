"use client";

import { useRef } from "react";
import type { Testimonial } from "@/lib/types";
import { ChevronLeft, ChevronRight, Quote, Star } from "./icons";
import { initials } from "@/lib/utils";

export default function Testimonials({ items }: { items: Testimonial[] }) {
  const trackRef = useRef<HTMLDivElement>(null);

  function scroll(dir: -1 | 1) {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.min(el.clientWidth * 0.85, 640), behavior: "smooth" });
  }

  return (
    <div className="quotes-wrap">
      <div className="quotes-scroll" ref={trackRef}>
        {items.map((t) => (
          <article className="quote-card" key={t.id}>
            <Quote size={20} style={{ color: "var(--gold)", opacity: 0.6 }} />
            <div className="stars">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} size={11} style={{ opacity: i <= t.rating ? 1 : 0.22 }} />
              ))}
            </div>
            <p className="quote-card__text">“{t.quote}”</p>
            <div className="quote-card__who">
              <span className="avatar">{initials(t.name)}</span>
              <div>
                <strong>{t.name}</strong>
                <span>
                  {t.city}
                  {t.product ? ` · ${t.product}` : ""}
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>
      <div className="quotes-nav">
        <button className="icon-btn" onClick={() => scroll(-1)} aria-label="Previous testimonials">
          <ChevronLeft size={17} />
        </button>
        <button className="icon-btn" onClick={() => scroll(1)} aria-label="Next testimonials">
          <ChevronRight size={17} />
        </button>
      </div>
    </div>
  );
}
