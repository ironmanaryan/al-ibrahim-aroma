import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getJournal } from "@/lib/content";
import { formatDate } from "@/lib/utils";
import NewsletterForm from "@/components/NewsletterForm";
import { ArrowRight } from "@/components/icons";

const postPhoto = (index: number) =>
  [
    "/images/dried-roses.jpg",
    "/images/bouquet-dark.jpg",
    "/images/rose-still.jpg",
    "/images/petals.jpg",
    "/images/atelier-cream.jpg",
    "/images/atelier-night.jpg",
  ][index % 6];

export const metadata: Metadata = {
  title: "Journal",
  description:
    "Notes on attar, oud, harvests and the quiet craft of wearing fragrance — written from the Al Ibrahim Aroma atelier in Lucknow.",
  alternates: { canonical: "/journal" },
};

export default async function JournalPage() {
  const posts = await getJournal();
  const [lead, ...rest] = posts;

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <span>Journal</span>
          </div>
          <span className="eyebrow">Notes from the atelier</span>
          <h1 className="page-hero__title">
            On fragrance, <em className="serif-italic">ritual</em> &amp; memory
          </h1>
          <p className="lede" style={{ marginTop: 20 }}>
            Harvest notes, the occasional argument about longevity, and instructions for wearing attar
            properly. Written by the people who blend it.
          </p>
        </div>
      </section>

      {lead ? (
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="container">
            <Link href={`/journal/${lead.slug}`} className="post-feature">
              <div className="post-feature__media">
                <Image src={postPhoto(0)} alt="" fill sizes="(max-width: 860px) 100vw, 50vw" priority />
                <div className="post-feature__tag">{lead.category}</div>
              </div>
              <div className="post-feature__body">
                <div className="post-card__meta">
                  <span>{formatDate(lead.publishedAt)}</span>
                  <span>·</span>
                  <span>{lead.readTime} min read</span>
                  <span>·</span>
                  <span>{lead.author}</span>
                </div>
                <h2 className="h2">{lead.title}</h2>
                <p className="lede">{lead.excerpt}</p>
                <span className="link-underline" style={{ marginTop: 8 }}>
                  Read the letter <ArrowRight size={14} />
                </span>
              </div>
            </Link>
          </div>
        </section>
      ) : null}

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="journal-grid">
            {rest.map((post, index) => (
              <Link href={`/journal/${post.slug}`} className="post-card" key={post.id}>
                <div className="post-card__media">
                  <Image
                    src={postPhoto(index + 1)}
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

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="cta-band">
            <div style={{ position: "relative", zIndex: 2 }}>
              <span className="eyebrow">One letter a month</span>
              <h2 className="section__title" style={{ margin: "16px 0 14px", maxWidth: "20ch" }}>
                The next distillation, <em className="serif-italic">first</em>
              </h2>
              <p className="lede" style={{ maxWidth: "44ch" }}>
                Harvest notes, new batches and early access. No noise, no daily discounts.
              </p>
              <div style={{ marginTop: 24, maxWidth: 460 }}>
                <NewsletterForm />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
