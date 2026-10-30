import Link from "next/link";
import { ArrowRight } from "@/components/icons";

export default function NotFound() {
  return (
    <section className="section" style={{ minHeight: "62svh", display: "grid", placeItems: "center" }}>
      <div className="container" style={{ textAlign: "center", display: "grid", gap: 18, justifyItems: "center" }}>
        <span className="eyebrow">404 · off the map</span>
        <h1 className="display" style={{ fontSize: "clamp(44px, 8vw, 92px)" }}>
          This scent has <em>drifted</em>
        </h1>
        <p className="lede" style={{ textAlign: "center" }}>
          The page you were looking for is not in the house. It may have sold out, moved, or never existed
          at all.
        </p>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center", marginTop: 6 }}>
          <Link href="/" className="btn btn--gold">
            Back to the house <ArrowRight size={14} />
          </Link>
          <Link href="/collections" className="btn btn--line">
            Browse fragrances
          </Link>
        </div>
      </div>
    </section>
  );
}
