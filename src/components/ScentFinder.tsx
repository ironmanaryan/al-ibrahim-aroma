"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Product } from "@/lib/types";
import { formatINR } from "@/lib/utils";
import Image from "next/image";
import { productImage } from "@/lib/productImage";
import { ArrowRight, Sparkles } from "./icons";

const QUESTIONS = [
  {
    key: "moment",
    title: "When does the scent live?",
    options: [
      { label: "Everyday, quietly", value: "daily", hint: "office, errands, skin-close" },
      { label: "Evenings & dinners", value: "evening", hint: "warm, a little louder" },
      { label: "Weddings & occasions", value: "occasion", hint: "oud, rose, amber" },
      { label: "At home, as ritual", value: "home", hint: "bakhoor, room mists" },
    ],
  },
  {
    key: "family",
    title: "Which smells pull you in?",
    options: [
      { label: "Wet earth after rain", value: "Fresh", hint: "petrichor, vetiver, moss" },
      { label: "Roses and white flowers", value: "Floral", hint: "Taif rose, jasmine" },
      { label: "Oud, smoke and resin", value: "Oud", hint: "agarwood, incense" },
      { label: "Clean skin and linen", value: "Musk", hint: "white musk, iris" },
      { label: "Amber and vanilla", value: "Amber", hint: "labdanum, benzoin" },
    ],
  },
  {
    key: "projection",
    title: "How close should it sit?",
    options: [
      { label: "Only for me", value: "2", hint: "skin-close, intimate" },
      { label: "A handshake away", value: "3", hint: "moderate, polite" },
      { label: "Across the room", value: "5", hint: "a trail, unmissable" },
    ],
  },
];

export default function ScentFinder({ products }: { products: Product[] }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const result = useMemo(() => {
    if (step < QUESTIONS.length) return null;
    const targetIntensity = Number(answers.projection ?? 3);
    const scored = products.map((p) => {
      let score = 0;
      if (p.family === answers.family) score += 6;
      if (answers.family === "Fresh" && p.family === "Woody") score += 3;
      if (answers.family === "Floral" && p.family === "Musk") score += 2;
      if (answers.moment === "occasion" && (p.family === "Oud" || p.family === "Amber")) score += 2;
      if (answers.moment === "daily" && (p.family === "Fresh" || p.family === "Musk")) score += 2;
      if (answers.moment === "evening" && (p.family === "Amber" || p.family === "Floral")) score += 1;
      if (answers.moment === "home" && p.category === "Home") score += 8;
      score += Math.max(0, 3 - Math.abs(p.intensity - targetIntensity));
      if (p.bestseller) score += 1;
      return { p, score };
    });
    scored.sort((a, b) => b.score - a.score);
    return scored[0]?.p ?? products[0];
  }, [answers, products, step]);

  function choose(key: string, value: string) {
    setAnswers((prev) => ({ ...prev, [key]: value }));
    setStep((s) => s + 1);
  }

  const question = QUESTIONS[step];

  return (
    <div className="finder" data-reveal>
      <div className="finder__grid">
        <div className="finder__panel">
          <div className="eyebrow">Find your scent · 3 questions</div>
          <div className="finder__progress" aria-hidden="true">
            {QUESTIONS.map((_, i) => (
              <i key={i} data-on={i <= Math.min(step, QUESTIONS.length - 1)} />
            ))}
          </div>

          {result ? (
            <div className="finder__result">
              <span className="eyebrow">Your composition</span>
              <h3 className="h2" style={{ fontSize: 36 }}>
                {result.name}
              </h3>
              <p className="muted" style={{ fontSize: 13, lineHeight: 1.7 }}>
                {result.subtitle}. {result.longevity} on skin, {result.sillage.toLowerCase()} sillage.
              </p>
              <div className="finder__result-art">
                <Image
                  src={productImage(result.slug, result.family)}
                  alt={result.name}
                  fill
                  sizes="180px"
                />
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                <Link href={`/product/${result.slug}`} className="btn btn--gold">
                  Discover {result.name} <ArrowRight size={14} />
                </Link>
                <span className="muted-2" style={{ fontSize: 12 }}>
                  {formatINR(result.price)}
                </span>
              </div>
              <button
                className="link-underline"
                style={{ background: "none", border: 0, borderBottom: "1px solid", padding: 0 }}
                onClick={() => {
                  setAnswers({});
                  setStep(0);
                }}
              >
                Start again
              </button>
            </div>
          ) : (
            <>
              <h3 className="finder__q">{question.title}</h3>
              <div className="finder__options">
                {question.options.map((o) => (
                  <button
                    key={o.value}
                    className="finder__option"
                    onClick={() => choose(question.key, o.value)}
                  >
                    <span>
                      {o.label}
                      <span className="muted-2" style={{ display: "block", fontSize: 10, letterSpacing: "0.1em", marginTop: 2 }}>
                        {o.hint}
                      </span>
                    </span>
                    <ArrowRight size={14} />
                  </button>
                ))}
              </div>
              {step > 0 ? (
                <button
                  className="link-underline"
                  style={{ background: "none", border: 0, borderBottom: "1px solid", padding: 0, width: "fit-content" }}
                  onClick={() => setStep((s) => Math.max(0, s - 1))}
                >
                  Back
                </button>
              ) : null}
            </>
          )}
        </div>

        <div className="finder__aside">
          <Image
            src={productImage(result?.slug ?? "oud-al-malik", result?.family)}
            alt={result?.name ?? "Al Ibrahim Aroma"}
            fill
            sizes="(max-width: 860px) 50vw, 300px"
          />
          <div className="finder__aside-note">
            <Sparkles size={13} />
            <span>Matched from {products.length} compositions in the house</span>
          </div>
        </div>
      </div>
    </div>
  );
}
