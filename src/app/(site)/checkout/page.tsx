import type { Metadata } from "next";
import { getSettings } from "@/lib/content";
import CheckoutClient from "@/components/CheckoutClient";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Reserve your fragrance — pay on confirmation, or complete the order on WhatsApp.",
  robots: { index: false, follow: false },
};

export default async function CheckoutPage() {
  const settings = await getSettings();
  return (
    <section className="section">
      <div className="container">
        <div className="checkout-head">
          <span className="eyebrow">Almost yours</span>
          <h1 className="page-hero__title" style={{ fontSize: "clamp(36px, 5vw, 60px)", marginTop: 12 }}>
            Checkout
          </h1>
          <p className="lede" style={{ marginTop: 14 }}>
            No payment is taken on this page. We confirm stock and shipping on WhatsApp, then send a secure
            payment link — the way a small house should.
          </p>
        </div>
        <CheckoutClient settings={settings} />
      </div>
    </section>
  );
}
