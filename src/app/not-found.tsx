import Link from "next/link";
import { ArrowRight } from "@/components/icons";

export default function NotFound() {
  return (
    <section className="nf">
      <header className="nf__top">
        <Link href="/" className="brand" aria-label="Al Ibrahim Aroma home">
          <svg className="brand__mark" viewBox="0 0 40 40" fill="none" aria-hidden="true">
            <circle cx="20" cy="20" r="19" stroke="#c9a24b" strokeOpacity="0.65" />
            <path
              d="M20 7.5 27.5 32h-4.1l-1.5-5h-3.8l-1.5 5h-4.1L20 7.5Zm0 7.1-1.3 8.2h2.6L20 14.6Z"
              fill="#c9a24b"
            />
          </svg>
          <span className="brand__text">
            <span className="brand__name">Al Ibrahim</span>
            <span className="brand__sub">Aroma · Lucknow</span>
          </span>
        </Link>
        <nav className="nf__nav" aria-label="Quick links">
          <Link href="/collections">Collections</Link>
          <Link href="/journal">Journal</Link>
          <Link href="/contact">Contact</Link>
        </nav>
      </header>

      <div className="nf__body">
        <span className="eyebrow">404 · off the map</span>
        <h1 className="display nf__title">
          This scent has <em>evaporated</em>
        </h1>
        <p className="lede">
          The page you were looking for is not in the house. It may have sold out, moved, or never
          existed at all.
        </p>
        <div className="nf__actions">
          <Link href="/" className="btn btn--gold">
            Back to the house <ArrowRight size={14} />
          </Link>
          <Link href="/collections" className="btn btn--line">
            Browse fragrances
          </Link>
        </div>
      </div>

      <footer className="nf__foot">
        <span>14 Hazratganj, Lucknow · since 1974</span>
        <span>Hand-blended, bottled by hand</span>
      </footer>
    </section>
  );
}
