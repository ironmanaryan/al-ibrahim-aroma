import Link from "next/link";
import type { Collection, Settings } from "@/lib/types";
import NewsletterForm from "./NewsletterForm";
import { Facebook, Instagram, Mail, MapPin, Whatsapp, Youtube } from "./icons";

export default function Footer({
  settings,
  collections,
}: {
  settings: Settings;
  collections: Collection[];
}) {
  const year = new Date().getFullYear();
  return (
    <footer className="footer footer--minimal">
      <div className="container">
        <div className="footer__top">
          <div className="footer__brand">
            <Link href="/" className="brand" aria-label={`${settings.brandName} home`}>
              <svg className="brand__mark" viewBox="0 0 40 40" fill="none" aria-hidden="true">
                <circle cx="20" cy="20" r="19" stroke="#8b0d1a" strokeOpacity="0.8" />
                <path d="M20 7.5 27.5 32h-4.1l-1.5-5h-3.8l-1.5 5h-4.1L20 7.5Zm0 7.1-1.3 8.2h2.6L20 14.6Z" fill="#c11426" />
              </svg>
              <span className="brand__text">
                <span className="brand__name">Al Ibrahim</span>
                <span className="brand__sub">Aroma · Lucknow</span>
              </span>
            </Link>
            <p>
              A small attar house distilling flowers, clay and oud the slow way since 1974. Blended by
              hand, in batches we can still smell.
            </p>
            <div className="footer__socials">
              <a href={settings.instagram} target="_blank" rel="noreferrer" aria-label="Instagram">
                <Instagram size={15} />
              </a>
              <a href={settings.facebook} target="_blank" rel="noreferrer" aria-label="Facebook">
                <Facebook size={15} />
              </a>
              <a href={settings.youtube} target="_blank" rel="noreferrer" aria-label="YouTube">
                <Youtube size={15} />
              </a>
              <a
                href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noreferrer"
                aria-label="WhatsApp"
              >
                <Whatsapp size={15} />
              </a>
            </div>
          </div>

          <div className="footer__news">
            <span className="overline">Letters from the atelier</span>
            <h4>Four or five letters a year. No noise.</h4>
            <NewsletterForm compact />
          </div>
        </div>

        <div className="footer__middle">
          <nav className="footer__links" aria-label="Footer">
            <Link href="/collections">All fragrances</Link>
            {collections.slice(0, 2).map((c) => (
              <Link key={c.id} href={`/collections/${c.slug}`}>
                {c.title}
              </Link>
            ))}
            <Link href="/about">Our story</Link>
            <Link href="/journal">Journal</Link>
            <Link href="/contact">Contact</Link>
            <Link href="/track">Track order</Link>
            <Link href="/faq">FAQ</Link>
          </nav>

          <div className="footer__meta">
            <span>
              <MapPin size={14} /> {settings.address}
            </span>
            <a href={`mailto:${settings.email}`}>
              <Mail size={14} /> {settings.email}
            </a>
            <div className="footer__pay" aria-label="Payment methods">
              <span>UPI</span>
              <span>Visa</span>
              <span>Mastercard</span>
              <span>RuPay</span>
              <span>COD</span>
            </div>
          </div>
        </div>

        <div className="footer__bottom">
          <span>
            © {year} {settings.brandName}
          </span>
          <div className="footer__bottom-links">
            <Link href="/policies/privacy">Privacy</Link>
            <Link href="/policies/terms">Terms</Link>
            <Link href="/policies/shipping">Shipping</Link>
            <Link href="/policies/returns">Returns</Link>
          </div>
          <span className="muted-2">Hand-blended in Lucknow · Photography via Pexels</span>
        </div>
      </div>
    </footer>
  );
}
