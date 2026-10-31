import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { getCollections, getFaqs, getJournal, getProducts, getSettings, getTestimonials } from "@/lib/content";
import { formatDate, formatINR } from "@/lib/utils";
import { productImage } from "@/lib/productImage";
import ProductExplorer from "@/components/ProductExplorer";
import ScentFinder from "@/components/ScentFinder";
import GiftBuilder from "@/components/GiftBuilder";
import Testimonials from "@/components/Testimonials";
import FaqAccordion from "@/components/FaqAccordion";
import NewsletterForm from "@/components/NewsletterForm";
import FragranceCarousel from "@/components/FragranceCarousel";
import PerfumeBottle from "@/components/PerfumeBottle";
import {
  ArrowRight,
  ArrowUpRight,
  Gift,
  Instagram,
  Leaf,
  Shield,
  Star,
  Truck,
} from "@/components/icons";

export const metadata: Metadata = {
  title: "Al Ibrahim Aroma — Attar House, Lucknow · since 1974",
  description:
    "Small-batch attars and parfums from Lucknow. Aged Cambodian oud, Taif rose, and the smell of the first rain on baked clay. Hand-blended, alcohol-free, shipped worldwide.",
  alternates: { canonical: "/" },
};

const collectionPhoto: Record<string, string> = {
  "oud-amber": "/images/bouquet-dark.jpg",
  "attar-oils": "/images/rose-still.jpg",
  "eau-de-parfum": "/images/petals.jpg",
  "home-ritual": "/images/dried-roses.jpg",
  gifting: "/images/atelier-cream.jpg",
  "single-origin-oud": "/images/atelier-gold.jpg",
};

const journalPhoto = ["/images/dried-roses.jpg", "/images/bouquet-dark.jpg", "/images/rose-still.jpg"];

const instagramFrames = [
  "/images/atelier-gold.jpg",
  "/images/rose-still.jpg",
  "/images/petals.jpg",
  "/images/atelier-night.jpg",
  "/images/dried-roses.jpg",
  "/images/bouquet-dark.jpg",
];

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
      <section className="hero hero--obsidian">
        <span className="hero__aura" aria-hidden="true" />
        <div className="container hero__stage">
          <div className="hero__copy">
            <span className="eyebrow">Attar house · Lucknow · since 1974</span>
            <h1 className="hero__title">
              {lines.map((line, i) => (
                <span key={line} style={{ display: "block" }}>
                  {i === lines.length - 1 ? <em>{line}</em> : line}
                </span>
              ))}
            </h1>
            <p className="hero__sub">{settings.heroSub}</p>
            <div className="hero__cta">
              <Link href="/collections" className="btn btn--gold">
                Explore the collection <ArrowRight size={14} />
              </Link>
              <a href="#find-your-scent" className="btn btn--line">
                Find your scent
              </a>
            </div>
            <div className="hero__foot">
              <span>
                <i className="hero__foot-dot" /> Alcohol-free attars
              </span>
              <span>
                <i className="hero__foot-dot" /> Blended by hand
              </span>
              <span>
                <i className="hero__foot-dot" /> 4.9 · 2,400 reviews
              </span>
              <span>
                <i className="hero__foot-dot" /> Shipped worldwide
              </span>
            </div>
          </div>

          <div className="hero__showcase">
            <div className="hero__card">
              <span className="hero__card-kicker">The house signature</span>
              <strong>Oud Al Malik</strong>
              <span className="hero__card-meta">Aged Cambodian oud · 50 ml</span>
              <span className="hero__card-price">{formatINR(signature.sizes[0].price)}</span>
            </div>
            <span className="hero__halo" aria-hidden="true" />
            <span className="hero__shine" aria-hidden="true" />
            <PerfumeBottle variant="crimson" className="hero__bottle" />
            <span className="hero__tag">Eau de parfum · composed in Lucknow</span>
          </div>
        </div>
        <span className="hero__scroll" aria-hidden="true">
          Scroll
        </span>
      </section>

      {/* ---------------------------------------------------- assurance */}
      <section className="section--tight">
        <div className="container">
          <div className="info-strip">
            <div>
              <Truck size={19} />
              <span>
                Complimentary shipping
                <br />
                <span className="muted-2">on orders above {formatINR(settings.freeShipping)}</span>
              </span>
            </div>
            <div>
              <Leaf size={19} />
              <span>
                Alcohol-free attars
                <br />
                <span className="muted-2">no phthalates, no fixatives</span>
              </span>
            </div>
            <div>
              <Gift size={19} />
              <span>
                Hand-wrapped in khadi
                <br />
                <span className="muted-2">wax seal &amp; written note</span>
              </span>
            </div>
            <div>
              <Shield size={19} />
              <span>
                Try before you commit
                <br />
                <span className="muted-2">₹950 discovery set, credited back</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- editions */}
      <FragranceCarousel />

      {/* ---------------------------------------------------- collections */}
      <section className="section">
        <div className="container">
          <div className="section__head">
            <div className="section__head-copy" data-reveal>
              <span className="eyebrow">The house collections</span>
              <h2 className="section__title">Six small worlds to enter slowly</h2>
              <p className="lede">
                Each collection is an accord, a season, a room. Nothing here is designed to be smelled
                from across a street.
              </p>
            </div>
            <Link href="/collections" className="link-underline" data-reveal>
              All fragrances <ArrowUpRight size={14} />
            </Link>
          </div>

          <div className="collection-grid">
            {collections.map((c) => (
              <Link
                key={c.id}
                href={`/collections/${c.slug}`}
                className="collection-card"
                data-reveal
                style={{ ["--accent" as string]: c.accent }}
              >
                <span className="collection-card__bg" aria-hidden="true">
                  <Image
                    src={collectionPhoto[c.slug] ?? "/images/petals.jpg"}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1080px) 50vw, 33vw"
                  />
                </span>
                <span className="collection-card__kicker">{c.kicker}</span>
                <h3 className="collection-card__title">{c.title}</h3>
                <p className="collection-card__desc">{c.description}</p>
                <span className="collection-card__cta">
                  Discover <ArrowRight size={13} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- products */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="section__head">
            <div className="section__head-copy" data-reveal>
              <span className="eyebrow">Signature &amp; bestsellers</span>
              <h2 className="section__title">The house favourites</h2>
            </div>
            <Link href="/collections" className="link-underline" data-reveal>
              View all 14 <ArrowUpRight size={14} />
            </Link>
          </div>
          <ProductExplorer products={featured.length >= 6 ? featured : products} mode="chips" limit={8} />
        </div>
      </section>

      {/* ---------------------------------------------------- notes */}
      <section className="section signature notes-band">
        <div className="container">
          <div className="signature__grid">
            <div className="signature__art" data-scale-in>
              <Image
                src={productImage(signature.slug, signature.family)}
                alt={signature.name}
                fill
                sizes="(max-width: 860px) 100vw, 45vw"
              />
              <span className="signature__plate">
                <span>No. 01</span>
                <strong>{signature.name}</strong>
                <small>{signature.longevity} on skin</small>
              </span>
            </div>
            <div data-reveal>
              <span className="eyebrow">Notes breakdown</span>
              <h2 className="display" style={{ margin: "14px 0 18px" }}>
                {signature.name}
              </h2>
              <p className="lede">{signature.story}</p>

              <div className="notes-cards">
                {[
                  { label: "Top", index: "01", items: signature.notes.top, note: "The opening, first twenty minutes" },
                  { label: "Heart", index: "02", items: signature.notes.heart, note: "The body, hours two to six" },
                  { label: "Base", index: "03", items: signature.notes.base, note: "What stays on skin and cloth" },
                ].map((group) => (
                  <div className="note-card" key={group.label}>
                    <span className="note-card__index">{group.index}</span>
                    <h4>{group.label}</h4>
                    <ul>
                      {group.items.map((n) => (
                        <li key={n}>{n}</li>
                      ))}
                    </ul>
                    <span className="note-card__note">{group.note}</span>
                  </div>
                ))}
              </div>

              <div
                style={{
                  display: "flex",
                  gap: 18,
                  flexWrap: "wrap",
                  alignItems: "center",
                  marginTop: 26,
                }}
              >
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

      {/* ---------------------------------------------------- craft */}
      <section className="section">
        <div className="container">
          <div className="split">
            <div className="split__media" data-scale-in>
              <Image
                src="/images/bouquet-dark.jpg"
                alt="Dried roses and dark foliage in the blending room"
                width={900}
                height={1100}
                sizes="(max-width: 860px) 100vw, 45vw"
              />
              <span className="split__caption">The blending room, morning light</span>
            </div>
            <div data-reveal>
              <span className="eyebrow">Four slow steps</span>
              <h2 className="section__title" style={{ marginTop: 14 }}>
                Precisely by nature
              </h2>
              <p className="lede" style={{ marginTop: 16 }}>
                We still distil in copper degs, seal them with clay, and let the fire decide the pace. A
                single batch of Mitti takes almost a month. There is no machine that does it faster without
                losing the point.
              </p>

              <div className="craft-list">
                {[
                  {
                    t: "Distillation",
                    d: "Deg and bhapka, the way Kannauj has done it for four centuries. Flowers, water, heat, patience.",
                  },
                  {
                    t: "Blending",
                    d: "Every accord is built by hand, by nose, in glass. Never a formula copied from a catalogue.",
                  },
                  {
                    t: "Maturation",
                    d: "The scent rests in sandalwood vats for eight to twelve weeks before it is allowed near a bottle.",
                  },
                  {
                    t: "Bottling",
                    d: "Filled, sealed, wrapped in khadi and stamped with wax, usually by the same two people.",
                  },
                ].map((step) => (
                  <div className="craft-step" key={step.t}>
                    <div>
                      <h4>{step.t}</h4>
                      <p>{step.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- scent quiz */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="section__head">
            <div className="section__head-copy" data-reveal>
              <span className="eyebrow">The scent quiz</span>
              <h2 className="section__title">Not sure where to begin?</h2>
              <p className="lede">
                Four questions, a minute of your time. We read your answers against the whole house and
                return the three closest compositions — not a random bestseller.
              </p>
            </div>
          </div>
          <ScentFinder products={products} />
        </div>
      </section>

      {/* ---------------------------------------------------- gift builder */}
      <section className="section" id="gift-builder" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="section__head">
            <div className="section__head-copy" data-reveal>
              <span className="eyebrow">The gift builder</span>
              <h2 className="section__title">A gift they will actually use</h2>
              <p className="lede">
                Choose two to four scents, add a brass plate or a written note, and watch the price build
                as you go. No hidden wrapping charges.
              </p>
            </div>
          </div>
          <GiftBuilder products={products} settings={settings} />
        </div>
      </section>

      {/* ---------------------------------------------------- reviews */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="section__head">
            <div className="section__head-copy" data-reveal>
              <span className="eyebrow">Worn &amp; reviewed</span>
              <h2 className="section__title">2,400 reviews, one theme</h2>
            </div>
            <div className="review-summary" data-reveal>
              <span className="review-summary__score">4.9</span>
              <span className="review-summary__meta">
                <span className="stars">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} size={12} />
                  ))}
                </span>
                <small>2,400 verified reviews · 98% would reorder</small>
              </span>
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
              <span className="eyebrow">The journal</span>
              <h2 className="section__title">On fragrance, ritual &amp; memory</h2>
            </div>
            <Link href="/journal" className="link-underline" data-reveal>
              All letters <ArrowUpRight size={14} />
            </Link>
          </div>
          <div className="journal-grid">
            {posts.slice(0, 3).map((post, index) => (
              <Link href={`/journal/${post.slug}`} className="post-card" key={post.id} data-reveal>
                <div className="post-card__media">
                  <Image
                    src={journalPhoto[index % journalPhoto.length]}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 100vw, 33vw"
                  />
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
          <div className="faq-layout">
            <div data-reveal>
              <span className="eyebrow">Questions</span>
              <h2 className="section__title" style={{ margin: "14px 0 18px" }}>
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

      {/* ---------------------------------------------------- newsletter */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="cta-band" data-reveal>
            <div style={{ position: "relative", zIndex: 2 }}>
              <span className="eyebrow">The letter</span>
              <h2 className="section__title" style={{ margin: "14px 0", maxWidth: "18ch" }}>
                Be first to the next distillation
              </h2>
              <p className="lede" style={{ maxWidth: "44ch" }}>
                Four or five letters a year. New batches, harvest notes, and the occasional early access
                before a scent sells out.
              </p>
              <div style={{ marginTop: 24, maxWidth: 460 }}>
                <NewsletterForm />
              </div>
            </div>
            <div className="cta-band__photo" aria-hidden="true">
              <Image src="/images/petals.jpg" alt="" fill sizes="(max-width: 860px) 100vw, 45vw" />
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- instagram */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="section__head">
            <div className="section__head-copy" data-reveal>
              <span className="eyebrow">@alibrahimaroma</span>
              <h2 className="section__title">The house, day by day</h2>
            </div>
            <a
              href={settings.instagram}
              target="_blank"
              rel="noreferrer"
              className="link-underline"
              data-reveal
            >
              Follow the atelier <Instagram size={14} />
            </a>
          </div>
          <div className="ig-grid">
            {instagramFrames.map((src, i) => (
              <a
                key={src}
                href={settings.instagram}
                target="_blank"
                rel="noreferrer"
                className="ig-tile"
                aria-label="View on Instagram"
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 33vw, 16vw"
                  loading={i > 2 ? "lazy" : undefined}
                />
                <span className="ig-tile__icon">
                  <Instagram size={20} />
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
