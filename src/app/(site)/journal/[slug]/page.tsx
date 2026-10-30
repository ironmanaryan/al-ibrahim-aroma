import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getJournal, getPost } from "@/lib/content";
import { formatDate } from "@/lib/utils";
import { ArrowRight, Clock } from "@/components/icons";

export async function generateStaticParams() {
  const posts = await getJournal();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Journal" };
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/journal/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      publishedTime: post.publishedAt,
      authors: [post.author],
    },
  };
}

function inline(text: string) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong key={i}>{part.slice(2, -2)}</strong>
    ) : (
      <span key={i}>{part}</span>
    ),
  );
}

function renderBody(body: string) {
  return body.split(/\n\n+/).map((block, i) => {
    const trimmed = block.trim();
    if (trimmed.startsWith("## ")) {
      return <h2 key={i}>{trimmed.replace(/^##\s+/, "")}</h2>;
    }
    if (trimmed.startsWith("> ")) {
      return <blockquote key={i}>{trimmed.replace(/^>\s+/, "")}</blockquote>;
    }
    return <p key={i}>{inline(trimmed)}</p>;
  });
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();
  const all = await getJournal();
  const more = all.filter((p) => p.id !== post.id).slice(0, 2);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    author: { "@type": "Person", name: post.author },
    publisher: { "@type": "Organization", name: "Al Ibrahim Aroma" },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <article>
        <header className="page-hero" style={{ paddingBottom: 26 }}>
          <div className="container" style={{ maxWidth: 880 }}>
            <div className="breadcrumb">
              <Link href="/">Home</Link>
              <span>/</span>
              <Link href="/journal">Journal</Link>
              <span>/</span>
              <span>{post.category}</span>
            </div>
            <span className="eyebrow">{post.category}</span>
            <h1 className="page-hero__title" style={{ maxWidth: "22ch", fontSize: "clamp(36px, 5.4vw, 68px)" }}>
              {post.title}
            </h1>
            <div className="post-card__meta" style={{ marginTop: 22 }}>
              <span>{formatDate(post.publishedAt)}</span>
              <span>·</span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                <Clock size={11} /> {post.readTime} min
              </span>
              <span>·</span>
              <span>{post.author}</span>
            </div>
          </div>
        </header>

        <div className="container" style={{ maxWidth: 880 }}>
          <div className="post-cover">
            <span>{post.category === "Craft" ? "❖" : post.category === "Guides" ? "✦" : "✺"}</span>
          </div>
          <div className="prose" style={{ margin: "clamp(30px, 5vw, 56px) auto" }}>
            {renderBody(post.body)}
          </div>
          <div className="post-foot">
            <span className="overline">Written by {post.author}</span>
            <Link href="/journal" className="link-underline">
              Back to the journal
            </Link>
          </div>
        </div>
      </article>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="section__head">
            <div className="section__head-copy">
              <span className="eyebrow">Keep reading</span>
              <h2 className="section__title">More from the atelier</h2>
            </div>
          </div>
          <div className="journal-grid">
            {more.map((p) => (
              <Link href={`/journal/${p.slug}`} className="post-card" key={p.id}>
                <div className="post-card__media">
                  <span>✦</span>
                </div>
                <div className="post-card__body">
                  <div className="post-card__meta">
                    <span>{p.category}</span>
                    <span>·</span>
                    <span>{p.readTime} min</span>
                  </div>
                  <h3 className="post-card__title">{p.title}</h3>
                  <p className="post-card__excerpt">{p.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
