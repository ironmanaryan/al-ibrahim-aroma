import type { Metadata } from "next";
import { getCollections, getProducts } from "@/lib/content";
import ProductExplorer from "@/components/ProductExplorer";
import Link from "next/link";
import { ArrowRight } from "@/components/icons";

export const metadata: Metadata = {
  title: "All fragrances",
  description:
    "Browse every composition in the house — oud and amber parfums, alcohol-free attars, home fragrances, coffrets and discovery sets.",
  alternates: { canonical: "/collections" },
};

export default async function CollectionsPage() {
  const [products, collections] = await Promise.all([getProducts(), getCollections()]);

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <span>Collections</span>
          </div>
          <span className="eyebrow">The full house</span>
          <h1 className="page-hero__title">
            Every composition, <em className="serif-italic">in one place</em>
          </h1>
          <p className="lede" style={{ marginTop: 20 }}>
            Fourteen scents across five collections. Filter by family or price — or start with the
            Discovery Set if you would rather smell before you decide.
          </p>
          <div className="pill-row" style={{ marginTop: 24 }}>
            {collections.map((c) => (
              <Link key={c.id} href={`/collections/${c.slug}`} className="chip">
                {c.title} <ArrowRight size={11} />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <ProductExplorer products={products} mode="sidebar" />
        </div>
      </section>
    </>
  );
}
