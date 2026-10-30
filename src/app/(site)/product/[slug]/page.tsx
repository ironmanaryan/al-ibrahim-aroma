import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProduct, getProducts, getSettings, getTestimonials } from "@/lib/content";
import { formatINR } from "@/lib/utils";
import BottleArt from "@/components/BottleArt";
import ProductBuy from "@/components/ProductBuy";
import ProductGallery from "@/components/ProductGallery";
import ProductCard from "@/components/ProductCard";
import Accordion from "@/components/Accordion";
import { Stars } from "@/components/ProductCard";
import { Gift, Leaf, Shield, Star, Truck } from "@/components/icons";

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

            <div className="specs">
              <div>
                <span>Longevity</span>
                <strong style={{ fontSize: 15 }}>{product.longevity}</strong>
              </div>
              <div>
                <span>Sillage</span>
                <strong style={{ fontSize: 15 }}>{product.sillage}</strong>
              </div>
              <div>
                <span>Intensity</span>
                <span className="intensity" style={{ marginTop: 6 }}>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <i key={i} data-on={i <= product.intensity} />
                  ))}
                </span>
              </div>
            </div>

            <Accordion
              items={[
                {
                  title: "The composition",
                  content: (
                    <div className="notes" style={{ border: 0 }}>
                      <div className="note-col" style={{ padding: "0 16px 0 0" }}>
                        <h4>Top</h4>
                        <ul>
                          {product.notes.top.map((n) => (
                            <li key={n}>{n}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="note-col" style={{ padding: "0 16px" }}>
                        <h4>Heart</h4>
                        <ul>
                          {product.notes.heart.map((n) => (
                            <li key={n}>{n}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="note-col" style={{ padding: "0 0 0 16px" }}>
                        <h4>Base</h4>
                        <ul>
                          {product.notes.base.map((n) => (
                            <li key={n}>{n}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
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
                  title: "Shipping & care",
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
                  <p className="quote-card__text">“{r.quote}”</p>
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
              <span className="eyebrow">You may also like</span>
              <h2 className="section__title">Compositions nearby</h2>
            </div>
            <Link href="/collections" className="link-underline">
              All fragrances
            </Link>
          </div>
          <div className="product-grid">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      <div style={{ display: "none" }}>
        <BottleArt {...product.art} />
      </div>
    </>
  );
}
