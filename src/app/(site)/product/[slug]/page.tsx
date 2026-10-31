import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProduct, getProducts, getSettings, getTestimonials } from "@/lib/content";
import { formatINR } from "@/lib/utils";
import ProductBuy from "@/components/ProductBuy";
import ProductGallery from "@/components/ProductGallery";
import ProductCard from "@/components/ProductCard";
import Accordion from "@/components/Accordion";
import PincodeCheck from "@/components/PincodeCheck";
import StickyBuy from "@/components/StickyBuy";
import RecentlyViewed from "@/components/RecentlyViewed";
import { Stars } from "@/components/ProductCard";
import { Gift, Leaf, Shield, Sparkles, Star, Truck } from "@/components/icons";

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return { title: "Fragrance" };
  return {
    title: `${product.name} — ${product.family} ${product.category}`,
    description: product.description,
    alternates: { canonical: `/product/${product.slug}` },
    openGraph: {
      title: `${product.name} · Al Ibrahim Aroma`,
      description: product.description,
      type: "website",
    },
  };
}

function longevityPercent(longevity: string) {
  const hours = Number(longevity.match(/\d+/)?.[0] ?? 8);
  return Math.max(18, Math.min(100, Math.round((hours / 12) * 100)));
}

function sillagePercent(sillage: string) {
  const key = sillage.toLowerCase();
  if (key.includes("room") || key.includes("strong")) return 92;
  if (key.includes("moderate")) return 64;
  if (key.includes("soft") || key.includes("intimate")) return 38;
  return 58;
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [product, settings, all, testimonials] = await Promise.all([
    getProduct(slug),
    getSettings(),
    getProducts(),
    getTestimonials(),
  ]);
  if (!product) notFound();

  const related = all
    .filter((p) => p.id !== product.id && (p.family === product.family || p.category === product.category))
    .slice(0, 4);
  const reviews = testimonials.filter((t) => t.product === product.name).slice(0, 2);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    brand: { "@type": "Brand", name: settings.brandName },
    category: `${product.family} ${product.category}`,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: product.reviewCount,
    },
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "INR",
      lowPrice: Math.min(...product.sizes.map((s) => s.price)),
      highPrice: Math.max(...product.sizes.map((s) => s.price)),
      availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      seller: { "@type": "Organization", name: settings.brandName },
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="container">
        <div className="breadcrumb" style={{ paddingTop: 26 }}>
          <Link href="/">Home</Link>
          <span>/</span>
          <Link href="/collections">Collections</Link>
          <span>/</span>
          <Link href={`/collections?family=${product.family}`}>{product.family}</Link>
          <span>/</span>
          <span>{product.name}</span>
        </div>

        <div className="pdp">
          <ProductGallery product={product} />

          <div className="pdp__info">
            <div className="card__meta">
              <span>
                {product.family} · {product.category}
              </span>
              <Stars rating={product.rating} count={product.reviewCount} />
            </div>
            <h1 className="pdp__title">{product.name}</h1>
            <p className="pdp__sub">{product.subtitle}</p>

            <ProductBuy product={product} settings={settings} />

            <div className="notes-pyramid" data-reveal>
              <div className="note-tier" data-tier="top">
                <span className="note-tier__icon">
                  <Sparkles size={16} />
                </span>
                <span className="note-tier__label">
                  <strong>Top notes</strong>
                  <span>The opening, first 20 minutes</span>
                </span>
                <span className="note-tier__tags">
                  {product.notes.top.map((n) => (
                    <span key={n}>{n}</span>
                  ))}
                </span>
              </div>
              <div className="note-tier" data-tier="heart">
                <span className="note-tier__icon">
                  <Leaf size={16} />
                </span>
                <span className="note-tier__label">
                  <strong>Heart notes</strong>
                  <span>The body, hours two to five</span>
                </span>
                <span className="note-tier__tags">
                  {product.notes.heart.map((n) => (
                    <span key={n}>{n}</span>
                  ))}
                </span>
              </div>
              <div className="note-tier" data-tier="base">
                <span className="note-tier__icon">
                  <Shield size={16} />
                </span>
                <span className="note-tier__label">
                  <strong>Base notes</strong>
                  <span>What stays on skin and cloth</span>
                </span>
                <span className="note-tier__tags">
                  {product.notes.base.map((n) => (
                    <span key={n}>{n}</span>
                  ))}
                </span>
              </div>
            </div>

            <div className="meters" data-reveal>
              <div className="meter__row">
                <div className="meter__head">
                  <span>Longevity</span>
                  <strong>{product.longevity}</strong>
                </div>
                <div className="meter__track">
                  <i className="meter__fill" style={{ width: `${longevityPercent(product.longevity)}%` }} />
                </div>
              </div>
              <div className="meter__row">
                <div className="meter__head">
                  <span>Sillage</span>
                  <strong>{product.sillage}</strong>
                </div>
                <div className="meter__track">
                  <i className="meter__fill" style={{ width: `${sillagePercent(product.sillage)}%` }} />
                </div>
              </div>
              <div className="meter__row">
                <div className="meter__head">
                  <span>Intensity</span>
                  <strong>{product.intensity} / 5</strong>
                </div>
                <div className="meter__track">
                  <i className="meter__fill" style={{ width: `${(product.intensity / 5) * 100}%` }} />
                </div>
              </div>
            </div>

            <Accordion
              items={[
                {
                  title: "Ingredients",
                  content: (
                    <p>
                      {product.notes.top.join(", ")} at the open; {product.notes.heart.join(", ")} through
                      the heart; {product.notes.base.join(", ")} at the base. Natural absolutes and
                      essential oils in a base of perfumer&rsquo;s alcohol or sandalwood oil for attars —
                      no phthalates, no synthetic fixatives, nothing to make it shout.
                    </p>
                  ),
                },
                { title: "The story", content: <p>{product.story}</p> },
                {
                  title: "How to wear it",
                  content: (
                    <p>
                      Two sprays on pulse points — wrists, the base of the throat — and one across the
                      shoulders. Do not rub. For attar, use a single drop and let your skin warm it. Store
                      away from sunlight; a cupboard is better than a bathroom shelf.
                    </p>
                  ),
                },
                {
                  title: "Shipping & returns",
                  content: (
                    <p>
                      Dispatched within 24 hours from Lucknow. Free shipping above{" "}
                      {formatINR(settings.freeShipping)}. Unopened bottles may be returned within 7 days;
                      opened fragrance cannot be resold, which is why we recommend the Discovery Set first.
                    </p>
                  ),
                },
              ]}
            />

            <PincodeCheck />

            <div className="pdp__assure" style={{ borderBottom: 0 }}>
              <div>
                <Leaf size={15} /> Natural absolutes, no phthalates
              </div>
              <div>
                <Gift size={15} /> Hand-wrapped in khadi with a wax seal
              </div>
              <div>
                <Truck size={15} /> Free shipping above {formatINR(settings.freeShipping)}
              </div>
              <div>
                <Shield size={15} /> 7-day returns on unopened bottles
              </div>
            </div>
          </div>
        </div>
      </div>

      {reviews.length ? (
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="container">
            <div className="section__head">
              <div className="section__head-copy">
                <span className="eyebrow">Worn &amp; reviewed</span>
                <h2 className="section__title">What people say about {product.name}</h2>
              </div>
              <span className="badge">
                <Star size={10} /> {product.rating} · {product.reviewCount} reviews
              </span>
            </div>
            <div className="quotes">
              {reviews.map((r) => (
                <article className="quote-card" key={r.id}>
                  <p className="quote-card__text">&ldquo;{r.quote}&rdquo;</p>
                  <div className="quote-card__who">
                    <span className="avatar">{r.name.slice(0, 1)}</span>
                    <div>
                      <strong>{r.name}</strong>
                      <span>{r.city}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="section__head">
            <div className="section__head-copy">
              <span className="eyebrow">Pairs well with</span>
              <h2 className="section__title">Compositions nearby</h2>
            </div>
            <Link href="/collections" className="link-underline">
              All fragrances
            </Link>
          </div>
          <div className="scroll-x">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      <RecentlyViewed products={all} current={product.slug} />
      <StickyBuy product={product} />
    </>
  );
}
