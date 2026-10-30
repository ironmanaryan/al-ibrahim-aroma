import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCollection, getCollections, productsInCollection } from "@/lib/content";
import ProductExplorer from "@/components/ProductExplorer";
import BottleArt from "@/components/BottleArt";
import type { ArtVariant } from "@/lib/types";

export async function generateStaticParams() {
  const collections = await getCollections();
  return collections.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const collection = await getCollection(slug);
  if (!collection) return { title: "Collection" };
  return {
    title: collection.title,
    description: collection.description,
    alternates: { canonical: `/collections/${collection.slug}` },
    openGraph: {
      title: `${collection.title} · Al Ibrahim Aroma`,
      description: collection.description,
    },
  };
}

function variantFor(category?: string): ArtVariant {
  if (category === "Attar") return "attar";
  if (category === "Home") return "diffuser";
  if (category === "Gifting") return "coffret";
  if (category === "Discovery") return "vial";
  return "flacon";
}

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const collection = await getCollection(slug);
  if (!collection) notFound();
  const products = await productsInCollection(collection);
  const all = await getCollections();

  return (
    <>
      <section className="page-hero" style={{ paddingBottom: 30 }}>
        <div className="container">
          <div className="breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <Link href="/collections">Collections</Link>
            <span>/</span>
            <span>{collection.title}</span>
          </div>
          <div className="collection-hero">
            <div>
              <span className="eyebrow">{collection.kicker}</span>
              <h1 className="page-hero__title" style={{ maxWidth: "16ch" }}>
                {collection.title}
              </h1>
              <p className="lede" style={{ marginTop: 18 }}>
                {collection.description}
              </p>
              <p className="muted-2" style={{ marginTop: 16, fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase" }}>
                {products.length} compositions
              </p>
            </div>
            <div className="collection-hero__art" style={{ ["--accent" as string]: collection.accent }}>
              <div className="collection-hero__glow" aria-hidden="true" />
              <BottleArt
                variant={variantFor(collection.filter.category)}
                liquid={products[0]?.art.liquid ?? collection.accent}
                label={products[0]?.art.label ?? "#12100d"}
                cap={products[0]?.art.cap ?? "gold"}
                title={collection.title}
              />
            </div>
          </div>

          <div className="pill-row" style={{ marginTop: 26 }}>
            {all.map((c) => (
              <Link
                key={c.id}
                href={`/collections/${c.slug}`}
                className="chip"
                data-active={c.slug === collection.slug}
              >
                {c.title}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 20 }}>
        <div className="container">
          <ProductExplorer products={products} mode="chips" initialCategory="All" />
        </div>
      </section>
    </>
  );
}
