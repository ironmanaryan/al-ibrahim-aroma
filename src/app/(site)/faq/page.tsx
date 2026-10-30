import type { Metadata } from "next";
import Link from "next/link";
import { getFaqs, getSettings } from "@/lib/content";
import FaqAccordion from "@/components/FaqAccordion";
import { Whatsapp } from "@/components/icons";
import { whatsappUrl } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Frequently asked questions",
  description:
    "Shipping, returns, alcohol-free attars, discovery sets and bulk orders — answered plainly by Al Ibrahim Aroma.",
  alternates: { canonical: "/faq" },
};

export default async function FaqPage() {
  const [faqs, settings] = await Promise.all([getFaqs(), getSettings()]);
  const groups = Array.from(new Set(faqs.map((f) => f.group)));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <span>FAQ</span>
          </div>
          <span className="eyebrow">Need help?</span>
          <h1 className="page-hero__title">
            Asked often, <em className="serif-italic">answered honestly</em>
          </h1>
          <p className="lede" style={{ marginTop: 20 }}>
            Everything about shipping, returns, attar and bulk orders. If your question is not here, the
            WhatsApp button is the fastest way to a human.
          </p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="faq-layout">
            <aside className="faq-aside">
              <span className="overline">On this page</span>
              {groups.map((g) => (
                <a key={g} href={`#${g.toLowerCase()}`} className="faq-aside__link">
                  {g}
                </a>
              ))}
              <a
                className="btn btn--gold btn--sm"
                style={{ marginTop: 14 }}
                href={whatsappUrl(settings.whatsapp, "Hello, I have a question about an order.")}
                target="_blank"
                rel="noreferrer"
              >
                <Whatsapp size={14} /> Ask us directly
              </a>
            </aside>

            <div>
              {groups.map((group) => (
                <div key={group} id={group.toLowerCase()} style={{ marginBottom: 40 }}>
                  <div className="section__head" style={{ marginBottom: 14 }}>
                    <div className="section__head-copy">
                      <span className="eyebrow">{group}</span>
                    </div>
                  </div>
                  <FaqAccordion items={faqs.filter((f) => f.group === group)} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
