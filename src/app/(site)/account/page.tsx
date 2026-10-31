import type { Metadata } from "next";
import Link from "next/link";
import { getProducts } from "@/lib/content";
import AccountClient from "@/components/AccountClient";

export const metadata: Metadata = {
  title: "Your account",
  description: "Orders, addresses and saved compositions — kept in one quiet place.",
  alternates: { canonical: "/account" },
  robots: { index: false, follow: true },
};

export default async function AccountPage() {
  const products = await getProducts();

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <span>Your account</span>
          </div>
          <span className="eyebrow">The private room</span>
          <h1 className="page-hero__title">
            Your <em className="serif-italic">account</em>
          </h1>
          <p className="lede" style={{ marginTop: 20 }}>
            Orders, addresses and the compositions you have set aside. No noise, no daily offers — just the
            paperwork of the house.
          </p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 10 }}>
        <div className="container">
          <AccountClient products={products.slice(0, 3)} />
        </div>
      </section>
    </>
  );
}
