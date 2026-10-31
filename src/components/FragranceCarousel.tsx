"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { formatINR } from "@/lib/utils";
import PerfumeBottle from "./PerfumeBottle";
import { ArrowRight, ChevronLeft, ChevronRight } from "./icons";

type Edition = {
  id: string;
  label: string;
  edition: string;
  name: string;
  slug: string;
  price: number;
  variant: "noir" | "crimson" | "ivory";
  copy: string;
  tag: string;
  notes: { label: string; items: string }[];
};

const EDITIONS: Edition[] = [
  {
    id: "noir",
    label: "Black",
    edition: "Noir Édition",
    name: "Oud Al Malik",
    slug: "oud-al-malik",
    price: 3450,
    variant: "noir",
    copy: "Aged Cambodian oud laid over smoked amber and leather. The darkest composition in the house — composed to sit close, then open slowly across the evening.",
    tag: "Aged 7 years · 50 ml",
    notes: [
      { label: "Top", items: "Bergamot · Pink pepper · Saffron" },
      { label: "Heart", items: "Cambodian oud · Rose absolute · Incense" },
      { label: "Base", items: "Smoked amber · Sandalwood · Leather" },
    ],
  },
  {
    id: "crimson",
    label: "Crimson",
    edition: "Crimson Édition",
    name: "Rose Taifi",
    slug: "rose-taifi",
    price: 1890,
    variant: "crimson",
    copy: "Taif rose picked before sunrise, held in saffron and honey. A deep lacquer red in the bottle, a warm petal bloom on skin.",
    tag: "Harvest 2026 · 50 ml",
    notes: [
      { label: "Top", items: "Taif rose · Litchi · Green stem" },
      { label: "Heart", items: "Rose absolute · Saffron · Honey" },
      { label: "Base", items: "White musk · Cashmere wood" },
    ],
  },
  {
    id: "ivory",
    label: "Off-white",
    edition: "Ivory Édition",
    name: "Musk Al Haram",
    slug: "musk-al-haram",
    price: 1290,
    variant: "ivory",
    copy: "Orris butter and cotton flower over powdered amber. Quiet, clean and almost weightless — the scent of pressed linen in a cool room.",
    tag: "Alcohol-free · 50 ml",
    notes: [
      { label: "Top", items: "Orris butter · Aldehydes" },
      { label: "Heart", items: "White musk · Iris · Cotton flower" },
      { label: "Base", items: "Powdered amber · Sandalwood" },
    ],
  },
];

export default function FragranceCarousel() {
  const [index, setIndex] = useState(1);
  const touch = useRef<{ x: number; y: number } | null>(null);
  const edition = EDITIONS[index];

  const go = (dir: -1 | 1) =>
    setIndex((i) => (i + dir + EDITIONS.length) % EDITIONS.length);

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

  return (
    <section className="section editions" id="editions">
      <div className="container">
        <div className="editions__head">
          <div data-reveal>
            <span className="eyebrow">The editions</span>
            <h2 className="section__title">Three moods, one house</h2>
            <p className="lede">
              One composition, three finishes. Turn the bottle to move between black, crimson and
              off-white — each a different weight on skin.
            </p>
          </div>
          <div className="editions__nav" data-reveal>
            <span className="editions__count">
              0{index + 1} <i>/ 03</i>
            </span>
            <button className="editions__arrow" onClick={() => go(-1)} aria-label="Previous edition">
              <ChevronLeft size={16} />
            </button>
            <button className="editions__arrow" onClick={() => go(1)} aria-label="Next edition">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        <div
          className="editions__stage"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <div className="editions__visual" data-variant={edition.id} key={`visual-${edition.id}`}>
            <span className="editions__disc" aria-hidden="true" />
            <span className="editions__plinth" aria-hidden="true" />
            <PerfumeBottle variant={edition.variant} className="editions__bottle" />
            <span className="editions__tag">{edition.tag}</span>
          </div>

          <div className="editions__copy" key={`copy-${edition.id}`}>
            <span className="editions__edition">{edition.edition}</span>
            <h3 className="editions__name">{edition.name}</h3>
            <p className="editions__desc">{edition.copy}</p>

            <div className="editions__notes">
              {edition.notes.map((n) => (
                <div key={n.label}>
                  <span>{n.label}</span>
                  <p>{n.items}</p>
                </div>
              ))}
            </div>

            <div className="editions__foot">
              <span className="editions__price">
                {formatINR(edition.price)} <small>/ 50 ml</small>
              </span>
              <Link href={`/product/${edition.slug}`} className="btn btn--gold btn--sm">
                Discover <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </div>

        <div className="editions__tabs" role="tablist" aria-label="Fragrance editions">
          {EDITIONS.map((e, i) => (
            <button
              key={e.id}
              role="tab"
              aria-selected={i === index}
              data-on={i === index}
              onClick={() => setIndex(i)}
              className="editions__tab"
            >
              <span className="editions__swatch" data-swatch={e.id} aria-hidden="true" />
              <span>
                <strong>{e.label}</strong>
                <small>{e.edition}</small>
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
