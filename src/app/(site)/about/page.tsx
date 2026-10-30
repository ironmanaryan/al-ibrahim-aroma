import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getTeam } from "@/lib/content";
import { ArrowRight, Leaf, Shield, Sparkles } from "@/components/icons";
import Stats from "@/components/Stats";

export const metadata: Metadata = {
  title: "Our story",
  description:
    "Al Ibrahim Aroma is a third-generation attar house in Lucknow. Copper degs, clay seals, Taif rose and Cambodian oud — the slow way, since 1974.",
  alternates: { canonical: "/about" },
};

const TIMELINE = [
  {
    year: "1974",
    title: "A single shelf in Hazratganj",
    body: "Ibrahim Saheb begins bottling one attar — a white musk — for families in the old city. The shop is a counter, a set of glass vials, and a ledger.",
  },
  {
    year: "1989",
    title: "The first deg of our own",
    body: "A copper still is bought second-hand from a Kannauj distiller. Rose and jasmine are processed in-house for the first time, in the courtyard behind the shop.",
  },
  {
    year: "2004",
    title: "Oud, properly",
    body: "A trip to Assam and Cambodia establishes the agarwood supply that still defines the house. Oud Al Malik is blended privately for a family wedding; it never leaves the catalogue again.",
  },
  {
    year: "2016",
    title: "The second generation, and the third",
    body: "Imran and Ayesha take over the atelier. The recipes stay; the labels, the photography and the language around the scents are rebuilt from scratch.",
  },
  {
    year: "2026",
    title: "Twelve thousand bottles later",
    body: "Still hand-filled. Still sealed with wax. Still refusing to add fixatives to a petrichor that only lasts five hours, because the alternative is a lie.",
  },
];

export default async function AboutPage() {
  const team = await getTeam();

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <span>Our story</span>
          </div>
          <span className="eyebrow">The house · est. 1974</span>
          <h1 className="page-hero__title">
            Three generations, <em className="serif-italic">one obsession</em>
          </h1>
          <p className="lede" style={{ marginTop: 20 }}>
            We are a small fragrance house in Lucknow, making attars and parfums the way they were made
            before the industry learned to make them faster. Everything is blended by hand, in batches we
            can still smell.
          </p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 10 }}>
        <div className="container">
          <div className="split">
            <div className="split__media" data-scale-in>
              <Image
                src="/images/vintage-bottles.jpg"
                alt="A row of glass attar bottles catching warm light"
                width={900}
                height={1100}
                sizes="(max-width: 860px) 100vw, 45vw"
              />
              <span className="split__caption">The archive shelf · 1989 to now</span>
            </div>
            <div className="prose" data-reveal>
              <p>
                The shop began with one bottle. Ibrahim Saheb, a cloth merchant with a good nose, started
                bottling a white musk for weddings in the old city. He sold it from a single shelf in
                Hazratganj and kept a ledger of who wore what.
              </p>
              <p>
                Fifty-two years later, the ledger is still there. So is the rule he wrote on the first page:
                <strong> never sell a scent you would not wear yourself.</strong>
              </p>
              <h2>What we mean by “slow”</h2>
              <p>
                A batch of Mitti takes close to a month. Rose Taifi is distilled within forty-eight hours of
                the flowers being picked in Taif. Our oud rests for eleven weeks before it is allowed near a
                bottle. None of this is romantic — it is simply the only way we know to keep the top notes
                honest.
              </p>
              <blockquote>
                A perfume is not a product. It is a small, wearable piece of memory.
              </blockquote>
              <p>
                We do not add synthetic fixatives to extend a scent that is naturally short-lived. If Mitti
                lasts five hours, we say five hours on the label. You can decide whether that is worth it.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="section__head">
            <div className="section__head-copy">
              <span className="eyebrow">The long way round</span>
              <h2 className="section__title">A short history</h2>
            </div>
          </div>
          <div className="timeline">
            {TIMELINE.map((row) => (
              <div className="timeline__row" key={row.year}>
                <span className="timeline__year">{row.year}</span>
                <div className="timeline__body">
                  <h4>{row.title}</h4>
                  <p>{row.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <Stats
            items={[
              { value: 52, label: "Years at the same address" },
              { value: 3, label: "Generations of noses" },
              { value: 12400, suffix: "+", label: "Bottles filled by hand" },
              { value: 0, label: "Synthetic fixatives" },
            ]}
          />
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="section__head">
            <div className="section__head-copy">
              <span className="eyebrow">What we will not do</span>
              <h2 className="section__title">Three rules, kept badly by everyone else</h2>
            </div>
          </div>
          <div className="values-grid">
            {[
              {
                icon: <Leaf size={20} />,
                title: "No filler",
                body: "If a composition needs a molecule to smell like something, we would rather it smelled like nothing.",
              },
              {
                icon: <Shield size={20} />,
                title: "No exaggeration",
                body: "Longevity is printed honestly on every page. A five-hour petrichor is still worth wearing.",
              },
              {
                icon: <Sparkles size={20} />,
                title: "No batch without a nose",
                body: "Every single batch is checked by a human before it is bottled. No exceptions, no interns.",
              },
            ].map((v) => (
              <article className="value-card" key={v.title}>
                <span className="value-card__icon">{v.icon}</span>
                <h3 className="h3" style={{ fontSize: 24 }}>
                  {v.title}
                </h3>
                <p className="muted" style={{ fontSize: 13, lineHeight: 1.7 }}>
                  {v.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="section__head">
            <div className="section__head-copy">
              <span className="eyebrow">The people</span>
              <h2 className="section__title">Who blends, packs &amp; writes</h2>
            </div>
          </div>
          <div className="team-grid">
            {team.map((member) => (
              <article className="team-card" key={member.id}>
                <span className="avatar">{member.initials}</span>
                <h4>{member.name}</h4>
                <span>{member.role}</span>
                <p>{member.bio}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="cta-band">
            <div style={{ position: "relative", zIndex: 2 }}>
              <span className="eyebrow">Come by</span>
              <h2 className="section__title" style={{ margin: "16px 0 14px", maxWidth: "20ch" }}>
                The kettle is always <em className="serif-italic">on</em>
              </h2>
              <p className="lede" style={{ maxWidth: "44ch" }}>
                14 Hazratganj, Lucknow. Monday to Saturday, ten till seven. Ask for the Mitti — we will
                usually have a fresh batch open.
              </p>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 24 }}>
                <Link href="/contact" className="btn btn--gold">
                  Write to us <ArrowRight size={14} />
                </Link>
                <Link href="/collections" className="btn btn--line">
                  Browse the house
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
