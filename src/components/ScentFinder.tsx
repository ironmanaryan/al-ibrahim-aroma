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
  {
    key: "finish",
    title: "What should it leave behind?",
    options: [
      { label: "A soft veil on skin", value: "soft", hint: "musk, powder, petals" },
      { label: "Warm resin and smoke", value: "resin", hint: "amber, oud, balsam" },
      { label: "Rain on hot stone", value: "green", hint: "vetiver, moss, mitti" },
      { label: "Something sweet & edible", value: "sweet", hint: "vanilla, saffron, rose" },
    ],
  },
];

const FINISH_BONUS: Record<string, string[]> = {
  soft: ["Musk", "Floral"],
  resin: ["Amber", "Oud"],
  green: ["Fresh", "Woody"],
  sweet: ["Amber", "Floral"],
};

export default function ScentFinder({ products }: { products: Product[] }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const result = useMemo(() => {
    if (step < QUESTIONS.length) return null;
    const targetIntensity = Number(answers.projection ?? 3);
    const bonus = FINISH_BONUS[answers.finish ?? ""] ?? [];
    const scored = products.map((p) => {
      let score = 0;
      if (p.family === answers.family) score += 6;
      if (answers.family === "Fresh" && p.family === "Woody") score += 3;
      if (answers.family === "Floral" && p.family === "Musk") score += 2;
      if (answers.moment === "occasion" && (p.family === "Oud" || p.family === "Amber")) score += 2;
      if (answers.moment === "daily" && (p.family === "Fresh" || p.family === "Musk")) score += 2;
      if (answers.moment === "evening" && (p.family === "Amber" || p.family === "Floral")) score += 1;
      if (answers.moment === "home" && p.category === "Home") score += 8;
      if (bonus.includes(p.family)) score += 3;
      score += Math.max(0, 3 - Math.abs(p.intensity - targetIntensity));
      if (p.bestseller) score += 1;
      return { p, score };
    });
    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, 3).map((s) => s.p);
  }, [answers, products, step]);

  function choose(key: string, value: string) {
    setAnswers((prev) => ({ ...prev, [key]: value }));
    setStep((s) => s + 1);
  }

  const question = QUESTIONS[step];
  const lead = result?.[0];

  return (
    <div className="finder" data-reveal id="find-your-scent">
      <div className="finder__grid">
        <div className="finder__panel">
          <div className="eyebrow">Find your scent · 4 questions</div>
          <div className="finder__progress" aria-hidden="true">
            {QUESTIONS.map((_, i) => (
              <i key={i} data-on={i <= Math.min(step, QUESTIONS.length - 1)} />
            ))}
          </div>

          {result ? (
            <div className="finder__result finder__result--multi">
              <span className="eyebrow">Your three closest matches</span>
              <div className="finder__results">
                {result.map((p, i) => (
                  <Link
                    key={p.id}
                    href={`/product/${p.slug}`}
                    className="finder__pick"
                    data-first={i === 0}
                  >
                    <span className="finder__pick-art">
                      <Image
                        src={productImage(p.slug, p.family)}
                        alt={p.name}
                        fill
                        sizes="(max-width: 640px) 90vw, 200px"
                      />
                    </span>
                    <small>
                      0{i + 1} · {p.family} {p.category}
                    </small>
                    <strong>{p.name}</strong>
                    <span>
                      {formatINR(p.price)} · {p.longevity}
                    </span>
                  </Link>
                ))}
              </div>
              <button
                className="link-underline"
                style={{
                  background: "none",
                  border: 0,
                  borderBottom: "1px solid",
                  padding: 0,
                  width: "fit-content",
                }}
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
              <span className="overline">
                Question {step + 1} of {QUESTIONS.length}
              </span>
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
                      <span
                        className="muted-2"
                        style={{
                          display: "block",
                          fontSize: 10,
                          letterSpacing: "0.1em",
                          marginTop: 2,
                        }}
                      >
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
                  style={{
                    background: "none",
                    border: 0,
                    borderBottom: "1px solid",
                    padding: 0,
                    width: "fit-content",
                  }}
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
            src={productImage(lead?.slug ?? "oud-al-malik", lead?.family)}
            alt={lead?.name ?? "Al Ibrahim Aroma"}
            fill
            sizes="(max-width: 860px) 100vw, 300px"
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
