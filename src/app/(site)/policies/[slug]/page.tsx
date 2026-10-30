import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

const PAGES: Record<string, { title: string; kicker: string; body: string[] }> = {
  shipping: {
    title: "Shipping & delivery",
    kicker: "Policies",
    body: [
      "Orders are packed by hand and dispatched from Lucknow within 24 hours of being confirmed, Monday to Saturday. You will receive a tracking link on WhatsApp and email as soon as the parcel leaves the atelier.",
      "## Within India",
      "Metro cities usually receive within 2–4 working days. The rest of India takes 4–7 working days. Shipping is complimentary on orders above ₹999; below that, a flat ₹79 is charged at checkout.",
      "## International",
      "We ship to the UAE, UK, US, Canada, Singapore and Australia. International shipping is calculated at checkout and takes 7–14 working days. Import duties and local taxes are the responsibility of the buyer.",
      "## Packaging",
      "Every order is wrapped in khadi and sealed with wax. Glass is cushioned in recycled pulp, never plastic. If a bottle arrives damaged, send us a photograph within 48 hours and we will replace it.",
      "## Delays",
      "Monsoon, festival weeks and harvest season can add a day or two. If something is delayed beyond a week we will tell you before you have to ask.",
    ],
  },
  returns: {
    title: "Returns & exchanges",
    kicker: "Policies",
    body: [
      "Fragrance is intimate, and opened bottles cannot be resold. So we keep the policy simple and honest.",
      "## Unopened bottles",
      "Unopened, sealed bottles may be returned within 7 days of delivery for a full refund or exchange. Write to hello@alibrahim.com with your order number and we will arrange a pickup.",
      "## Opened bottles",
      "We cannot accept opened fragrance. This is exactly why the Discovery Set exists — five 2ml vials for ₹950, fully credited against your first full-size order.",
      "## Damaged or incorrect",
      "If a bottle arrives damaged, or we sent the wrong scent, tell us within 48 hours with a photograph. We replace it at our cost, no questions.",
      "## Refund timing",
      "Refunds are processed to the original payment method within 5–7 working days of the parcel reaching us.",
    ],
  },
  privacy: {
    title: "Privacy policy",
    kicker: "Policies",
    body: [
      "We collect the minimum needed to send you a parcel and answer your questions: your name, phone number, email, delivery address and order history.",
      "## What we never do",
      "We do not sell, rent or trade your details. We do not run third-party advertising pixels on this site. We do not add you to a mailing list unless you ask us to.",
      "## Analytics",
      "We count page visits in aggregate — no cookies, no fingerprinting, no personal identifiers. It tells us which compositions people look at, and nothing about who they are.",
      "## Your rights",
      "Write to hello@alibrahim.com to see, correct or delete the data we hold about you. We will action it within 7 days.",
      "## Payments",
      "Card and UPI details are handled by our payment partner and never touch our servers. We only see a confirmation that payment succeeded.",
    ],
  },
  terms: {
    title: "Terms of service",
    kicker: "Policies",
    body: [
      "By ordering from Al Ibrahim Aroma you agree to the terms below. They are written in plain language on purpose.",
      "## Products",
      "Fragrance is a natural product. Small variation in colour and scent between batches is normal and not a defect. Photographs and illustrations on this site are representative, not exact.",
      "## Pricing",
      "All prices are in Indian Rupees and include applicable taxes. We may change prices at any time, but never after an order is confirmed.",
      "## Availability",
      "Small batches sell out. If an item becomes unavailable after you order, we will offer a replacement, a credit, or a full refund — your choice.",
      "## Intellectual property",
      "The name Al Ibrahim Aroma, the label designs, photography and copy on this site belong to the house. Please do not reproduce them without asking.",
      "## Contact",
      "Questions about these terms: hello@alibrahim.com.",
    ],
  },
};

export async function generateStaticParams() {
  return Object.keys(PAGES).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = PAGES[slug];
  return {
    title: page?.title ?? "Policies",
    description: page ? page.body[0] : "Al Ibrahim Aroma policies.",
    alternates: { canonical: `/policies/${slug}` },
  };
}

export default async function PolicyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = PAGES[slug];
  if (!page) notFound();

  return (
    <>
      <section className="page-hero">
        <div className="container" style={{ maxWidth: 820 }}>
          <div className="breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <span>{page.kicker}</span>
            <span>/</span>
            <span>{page.title}</span>
          </div>
          <span className="eyebrow">{page.kicker}</span>
          <h1 className="page-hero__title" style={{ maxWidth: "20ch" }}>
            {page.title}
          </h1>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 10 }}>
        <div className="container" style={{ maxWidth: 820 }}>
          <div className="prose">
            {page.body.map((block, i) =>
              block.startsWith("## ") ? (
                <h2 key={i}>{block.replace(/^##\s+/, "")}</h2>
              ) : (
                <p key={i}>{block}</p>
              ),
            )}
          </div>
          <div className="post-foot" style={{ marginTop: 40 }}>
            <span className="overline">Last updated · October 2026</span>
            <Link href="/contact" className="link-underline">
              Ask a question
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
