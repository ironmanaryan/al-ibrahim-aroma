import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { getCollections, getFaqs, getJournal, getProducts, getSettings, getTestimonials } from "@/lib/content";
import { formatDate, formatINR } from "@/lib/utils";
import BottleArt from "@/components/BottleArt";
import Marquee from "@/components/Marquee";
import ProductExplorer from "@/components/ProductExplorer";
import ScentFinder from "@/components/ScentFinder";
import GiftBuilder from "@/components/GiftBuilder";
import Stats from "@/components/Stats";
import Testimonials from "@/components/Testimonials";
import FaqAccordion from "@/components/FaqAccordion";
import NewsletterForm from "@/components/NewsletterForm";
import { ArrowRight, ArrowUpRight, Gift, Leaf, Shield, Sparkles, Star, Truck } from "@/components/icons";
import type { ArtVariant, Collection } from "@/lib/types";

export const metadata: Metadata = {
  title: "Al Ibrahim Aroma — Attar House, Lucknow · since 1974",
  description:
    "Small-batch attars and parfums from Lucknow. Aged Cambodian oud, Taif rose, and the smell of the first rain on baked clay. Hand-blended, alcohol-free, shipped worldwide.",
  alternates: { canonical: "/" },
};

function variantFor(collection: Collection): ArtVariant {
  if (collection.filter.category === "Attar") return "attar";
  if (collection.filter.category === "Home") return "diffuser";
  if (collection.filter.category === "Gifting") return "coffret";
  return "flacon";
}

export default async function HomePage() {
  const [settings, products, collections, testimonials, posts, faqs] = await Promise.all([
    getSettings(),
    getProducts(),
    getCollections(),
    getTestimonials(),
    getJournal(),
    getFaqs(),
  ]);

  const signature = products.find((p) => p.slug === "oud-al-malik") ?? products[0];
  const lines = settings.heroTitle.split("|");
  const featured = products.filter((p) => p.featured).slice(0, 8);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Store",
    name: settings.brandName,
    description: settings.tagline,
    image: "/opengraph-image",
    telephone: settings.phone,
    email: settings.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: settings.address,
      addressLocality: "Lucknow",
      addressRegion: "Uttar Pradesh",
      addressCountry: "IN",
    },
    priceRange: "₹₹",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://al-ibrahim-aroma.vercel.app",
    sameAs: [settings.instagram, settings.facebook, settings.youtube].filter(Boolean),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* ---------------------------------------------------- hero */}
      <section className="hero">
        <div className="hero__bg" aria-hidden="true">
          <span className="smoke smoke--a" />
          <span className="smoke smoke--b" />
        </div>
        <div className="container hero__grid">
          <div className="hero__copy">
            <span className="eyebrow">{settings.heroKicker}</span>
            <h1 className="hero__title">
              {lines.map((line, i) => (
                <span key={line} className={i > 0 ? "hero__title-em" : undefined}>
                  {line}
                </span>
              ))}
            </h1>
            <p className="hero__sub">{settings.heroSub}</p>
            <div className="hero__cta">
              <Link href="/collections" className="btn btn--gold">
                Explore the collection <ArrowRight size={14} />
              </Link>
              <a href="#find-your-scent" className="btn btn--line">
                <Sparkles size={14} /> Find your scent
              </a>
            </div>
            <div className="hero__meta">
              <div>
                <strong>1974</strong>
                <span>House founded</span>
              </div>
              <div>
                <strong>52</strong>
                <span>Compositions</span>
              </div>
              <div>
                <strong>12,400+</strong>
                <span>Bottles sent</span>
              </div>
              <div>
                <strong>4.9 ★</strong>
                <span>Across 2,400 reviews</span>
              </div>
            </div>
          </div>

          <div className="hero__art">
            <div className="bottle-stage">
              <div className="bottle-stage__glow" />
              <div className="bottle-stage__ring" aria-hidden="true">
                <i />
              </div>
              <BottleArt
                variant="flacon"
                liquid="#8a5a1f"
                label="#12100d"
                cap="gold"
                title="Oud Al Malik — Al Ibrahim Aroma"
              />
            </div>
            <div className="hero__chip hero__chip--a">
              <Sparkles size={12} /> Aged 11 weeks
            </div>
            <div className="hero__chip hero__chip--b">
              <Star size={11} /> 4.9 · 2,400 reviews
            </div>
          </div>
        </div>
        <div className="hero__scroll" aria-hidden="true">
          Scroll <span />
        </div>
      </section>

      <Marquee
        words={[
          "Cambodian Oud",
          "Taif Rose",
          "First Rain",
          "Kannauj Attar",
          "Kashmiri Saffron",
          "White Musk",
          "Haitian Vetiver",
          "Bakhoor",
        ]}
      />

      {/* ---------------------------------------------------- assurance */}
      <section className="section--tight">
        <div className="container">
          <div className="info-strip">
            <div>
              <Truck size={18} />
              <span>
                Complimentary shipping
                <br />
                <span className="muted-2" style={{ fontSize: 10 }}>
                  on orders above {formatINR(settings.freeShipping)}
                </span>
              </span>
            </div>
            <div>
              <Leaf size={18} />
              <span>
                Alcohol-free attars
                <br />
                <span className="muted-2" style={{ fontSize: 10 }}>
                  no phthalates, no fixatives
                </span>
              </span>
            </div>
            <div>
              <Gift size={18} />
              <span>
                Hand-wrapped in khadi
                <br />
                <span className="muted-2" style={{ fontSize: 10 }}>
                  wax seal &amp; written note
                </span>
              </span>
            </div>
            <div>
              <Shield size={18} />
              <span>
                Try before you commit
                <br />
                <span className="muted-2" style={{ fontSize: 10 }}>
                  ₹950 discovery set, credited back
                </span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- collections */}
      <section className="section">
        <div className="container">
          <div className="section__head">
            <div className="section__head-copy" data-reveal>
              <span className="eyebrow">The house</span>
              <h2 className="section__title">
                Five ways to <em className="serif-italic">smell like</em> a memory
              </h2>
              <p className="lede">
                Each collection is a small world — an accord, a season, a room. Enter slowly. Nothing here
                is designed to be smelled from across a street.
              </p>
            </div>
            <Link href="/collections" className="link-underline" data-reveal>
              All fragrances <ArrowUpRight size={14} />
            </Link>
          </div>

          <div className="collection-grid">
            {collections.map((c) => {
              const product = products.find(
                (p) =>
                  (c.filter.category && p.category === c.filter.category) ||
                  (c.filter.family && p.family === c.filter.family),
              );
              return (
                <Link
                  key={c.id}
                  href={`/collections/${c.slug}`}
                  className="collection-card"
                  data-reveal
                  style={{ ["--accent" as string]: c.accent }}
                >
                  <span className="collection-card__bg" aria-hidden="true" />
                  <span className="collection-card__bottle" aria-hidden="true">
                    <BottleArt
                      variant={variantFor(c)}
                      liquid={product?.art.liquid ?? c.accent}
                      label={product?.art.label ?? "#12100d"}
                      cap={product?.art.cap ?? "gold"}
                    />
                  </span>
                  <span className="collection-card__kicker">{c.kicker}</span>
                  <h3 className="collection-card__title">{c.title}</h3>
                  <p className="collection-card__desc">{c.description}</p>
                  <span className="collection-card__cta">
                    Discover <ArrowRight size={13} />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- products */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="section__head">
            <div className="section__head-copy" data-reveal>
              <span className="eyebrow">Most reordered</span>
              <h2 className="section__title">The house favourites</h2>
            </div>
            <Link href="/collections" className="link-underline" data-reveal>
              View all 14 <ArrowUpRight size={14} />
            </Link>
          </div>
          <ProductExplorer products={featured.length >= 6 ? featured : products} mode="chips" limit={8} />
        </div>
      </section>

      {/* ---------------------------------------------------- craft */}
      <section className="section">
        <div className="container">
          <div className="split">
            <div className="split__media" data-scale-in>
              <Image
                src="/images/atelier-gold.jpg"
                alt="A hand-blown flacon resting in fabric, lit by a single warm light"
                width={900}
                height={1100}
                sizes="(max-width: 860px) 100vw, 45vw"
              />
              <span className="split__caption">The atelier · Hazratganj, Lucknow</span>
            </div>
            <div data-reveal>
              <span className="eyebrow">Slow by choice</span>
              <h2 className="section__title" style={{ marginTop: 16 }}>
                Precisely <em className="serif-italic">by nature</em>
              </h2>
              <p className="lede" style={{ marginTop: 16 }}>
                We still distil in copper degs, seal them with clay, and let the fire decide the pace. A
                single batch of Mitti takes almost a month. There is no machine that does it faster without
                losing the point.
              </p>

              <div className="craft-list">
                {[
                  {
                    n: "01",
                    t: "Distillation",
                    d: "Deg and bhapka, the way Kannauj has done it for four centuries. Flowers, water, heat, patience.",
                  },
                  {
                    n: "02",
                    t: "Blending",
                    d: "Every accord is built by hand, by nose, in glass. Never a formula copied from a catalogue.",
                  },
                  {
                    n: "03",
                    t: "Maturation",
                    d: "The scent rests in sandalwood vats for eight to twelve weeks before it is allowed near a bottle.",
                  },
                  {
                    n: "04",
                    t: "Bottling",
                    d: "Filled, sealed, wrapped in khadi and stamped with wax — usually by the same two people.",
                  },
                ].map((step) => (
                  <div className="craft-step" key={step.n}>
                    <span className="craft-step__num">{step.n}</span>
                    <div>
                      <h4>{step.t}</h4>
                      <p>{step.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{ marginTop: "clamp(40px, 6vw, 80px)" }}>
            <Stats
              items={[
                { value: 1974, label: "The house opens" },
                { value: 52, suffix: "+", label: "Compositions" },
                { value: 12400, suffix: "+", label: "Bottles sent" },
                { value: 4.9, decimals: 1, suffix: " ★", label: "Average rating" },
              ]}
            />
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- finder */}
      <section className="section" id="find-your-scent" style={{ paddingTop: 0 }}>
        <div className="container">
          <ScentFinder products={products} />
        </div>
      </section>

      {/* ---------------------------------------------------- signature */}
      <section className="section signature">
        <div className="container">
          <div className="signature__grid">
            <div className="signature__art" data-parallax="0.06">
              <div className="signature__halo" aria-hidden="true" />
              <BottleArt {...signature.art} title={signature.name} />
            </div>
            <div data-reveal>
              <span className="eyebrow">Signature composition</span>
              <h2 className="display" style={{ margin: "16px 0 18px", fontSize: "clamp(38px, 5vw, 66px)" }}>
                {signature.name}
              </h2>
              <p className="lede">{signature.story}</p>

              <div className="notes" style={{ marginTop: 28 }}>
                <div className="note-col">
                  <h4>Top</h4>
                  <ul>
                    {signature.notes.top.map((n) => (
                      <li key={n}>{n}</li>
                    ))}
                  </ul>
                </div>
                <div className="note-col">
                  <h4>Heart</h4>
                  <ul>
                    {signature.notes.heart.map((n) => (
                      <li key={n}>{n}</li>
                    ))}
                  </ul>
                </div>
                <div className="note-col">
                  <h4>Base</h4>
                  <ul>
                    {signature.notes.base.map((n) => (
                      <li key={n}>{n}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div style={{ display: "flex", gap: 18, flexWrap: "wrap", alignItems: "center", marginTop: 26 }}>
                <Link href={`/product/${signature.slug}`} className="btn btn--gold">
                  Experience the scent <ArrowRight size={14} />
                </Link>
                <span className="muted-2" style={{ fontSize: 12 }}>
                  From {formatINR(signature.sizes[0].price)} · {signature.longevity} on skin
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- gift builder */}
      <section className="section" id="gift-builder">
        <div className="container">
          <div className="section__head">
            <div className="section__head-copy" data-reveal>
              <span className="eyebrow">Build a coffret</span>
              <h2 className="section__title">
                A gift they will <em className="serif-italic">actually</em> use
              </h2>
              <p className="lede">
                Choose two to four scents, add a brass plate or a written note, and watch the price build
                as you go. No hidden wrapping charges.
              </p>
            </div>
          </div>
          <GiftBuilder products={products} settings={settings} />
        </div>
      </section>

      {/* ---------------------------------------------------- testimonials */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="section__head">
            <div className="section__head-copy" data-reveal>
              <span className="eyebrow">Words from those who wore it</span>
              <h2 className="section__title">
                2,400 reviews. <em className="serif-italic">One theme.</em>
              </h2>
            </div>
            <div className="pill-row" data-reveal>
              <span className="badge">
                <Star size={10} /> 4.9 average
              </span>
              <span className="badge">98% would reorder</span>
            </div>
          </div>
          <Testimonials items={testimonials} />
        </div>
      </section>

      {/* ---------------------------------------------------- journal */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="section__head">
            <div className="section__head-copy" data-reveal>
              <span className="eyebrow">From the journal</span>
              <h2 className="section__title">On fragrance, ritual &amp; memory</h2>
            </div>
            <Link href="/journal" className="link-underline" data-reveal>
              All letters <ArrowUpRight size={14} />
            </Link>
          </div>
          <div className="journal-grid">
            {posts.slice(0, 3).map((post) => (
              <Link href={`/journal/${post.slug}`} className="post-card" key={post.id} data-reveal>
                <div className="post-card__media">
                  <span>{post.category === "Craft" ? "❖" : post.category === "Guides" ? "✦" : "✺"}</span>
                </div>
                <div className="post-card__body">
                  <div className="post-card__meta">
                    <span>{post.category}</span>
                    <span>·</span>
                    <span>{formatDate(post.publishedAt)}</span>
                    <span>·</span>
                    <span>{post.readTime} min</span>
                  </div>
                  <h3 className="post-card__title">{post.title}</h3>
                  <p className="post-card__excerpt">{post.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- faq */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="split" style={{ alignItems: "start" }}>
            <div data-reveal>
              <span className="eyebrow">Need help?</span>
              <h2 className="section__title" style={{ margin: "16px 0 18px" }}>
                Frequently asked, honestly answered
              </h2>
              <p className="lede">
                If your question is not here, message us on WhatsApp — a person replies, usually within the
                hour.
              </p>
              <Link href="/faq" className="link-underline" style={{ marginTop: 22 }}>
                All questions <ArrowUpRight size={14} />
              </Link>
            </div>
            <FaqAccordion items={faqs.slice(0, 5)} />
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- cta */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="cta-band" data-reveal>
            <div style={{ position: "relative", zIndex: 2 }}>
              <span className="eyebrow">Letters from the atelier</span>
              <h2 className="section__title" style={{ margin: "16px 0 14px", maxWidth: "18ch" }}>
                Be first to the next <em className="serif-italic">distillation</em>
              </h2>
              <p className="lede" style={{ maxWidth: "44ch" }}>
                Four or five letters a year. New batches, harvest notes, and the occasional early access
                before a scent sells out.
              </p>
              <div style={{ marginTop: 24, maxWidth: 460 }}>
                <NewsletterForm />
              </div>
            </div>
            <div className="cta-band__bottle" aria-hidden="true">
              <BottleArt variant="attar" liquid="#9c4a44" label="#efe3cd" cap="gold" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
