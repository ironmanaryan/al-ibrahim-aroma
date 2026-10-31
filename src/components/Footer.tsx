import Link from "next/link";
import type { Collection, Settings } from "@/lib/types";
import NewsletterForm from "./NewsletterForm";
import { Facebook, Instagram, Mail, MapPin, Phone, Whatsapp, Youtube } from "./icons";

export default function Footer({
  settings,
  collections,
}: {
  settings: Settings;
  collections: Collection[];
}) {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          <div className="footer__brand">
            <Link href="/" className="brand">
              <svg className="brand__mark" viewBox="0 0 40 40" fill="none" aria-hidden="true">
                <circle cx="20" cy="20" r="19" stroke="#f5f2ed" strokeOpacity="0.5" />
                <path d="M20 7.5 27.5 32h-4.1l-1.5-5h-3.8l-1.5 5h-4.1L20 7.5Zm0 7.1-1.3 8.2h2.6L20 14.6Z" fill="#f5f2ed" />
              </svg>
              <span className="brand__text">
                <span className="brand__name">Al Ibrahim</span>
                <span className="brand__sub">Aroma · Lucknow</span>
              </span>
            </Link>
            <p className="muted" style={{ fontSize: 13, lineHeight: 1.75, maxWidth: "34ch" }}>
              A small attar house in Lucknow, distilling flowers, clay and oud the slow way since 1974.
              Everything is blended by hand, in batches we can still smell.
            </p>
            <div className="footer__socials">
              <a href={settings.instagram} target="_blank" rel="noreferrer" aria-label="Instagram">
                <Instagram size={16} />
              </a>
              <a href={settings.facebook} target="_blank" rel="noreferrer" aria-label="Facebook">
                <Facebook size={16} />
              </a>
              <a href={settings.youtube} target="_blank" rel="noreferrer" aria-label="YouTube">
                <Youtube size={16} />
              </a>
              <a
                href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noreferrer"
                aria-label="WhatsApp"
              >
                <Whatsapp size={16} />
              </a>
            </div>
          </div>

          <div className="footer__col">
            <h4>Shop</h4>
            <ul>
              {collections.map((c) => (
                <li key={c.id}>
                  <Link href={`/collections/${c.slug}`}>{c.title}</Link>
                </li>
              ))}
              <li>
                <Link href="/collections">All fragrances</Link>
              </li>
            </ul>
          </div>

          <div className="footer__col">
            <h4>The House</h4>
            <ul>
              <li>
                <Link href="/about">Our story</Link>
              </li>
              <li>
                <Link href="/journal">Journal</Link>
              </li>
              <li>
                <Link href="/faq">FAQ</Link>
              </li>
              <li>
                <Link href="/contact">Contact &amp; bulk orders</Link>
              </li>
              <li>
                <Link href="/policies/shipping">Shipping &amp; returns</Link>
              </li>
              <li>
                <Link href="/admin">Admin panel</Link>
              </li>
            </ul>
          </div>

          <div className="footer__col">
            <h4>Visit &amp; write</h4>
            <ul style={{ gap: 14 }}>
              <li style={{ display: "flex", gap: 10 }}>
                <MapPin size={15} style={{ color: "var(--gold)", flex: "none", marginTop: 2 }} />
                <span>{settings.address}</span>
              </li>
              <li style={{ display: "flex", gap: 10 }}>
                <Phone size={15} style={{ color: "var(--gold)", flex: "none", marginTop: 2 }} />
                <a href={`tel:${settings.phone.replace(/\s/g, "")}`}>{settings.phone}</a>
              </li>
              <li style={{ display: "flex", gap: 10 }}>
                <Mail size={15} style={{ color: "var(--gold)", flex: "none", marginTop: 2 }} />
                <a href={`mailto:${settings.email}`}>{settings.email}</a>
              </li>
            </ul>
            <div style={{ marginTop: 20 }}>
              <h4>Letters from the atelier</h4>
              <NewsletterForm compact />
            </div>
          </div>
        </div>

        <div className="footer__bottom">
          <span>
            © {year} {settings.brandName}. All rights reserved.
          </span>
          <div className="footer__bottom-links">
            <Link href="/policies/privacy">Privacy</Link>
            <Link href="/policies/terms">Terms</Link>
            <Link href="/policies/shipping">Shipping</Link>
            <Link href="/policies/returns">Returns</Link>
          </div>
          <span className="muted-2">Hand-blended in Lucknow, India · Photography via Unsplash</span>
        </div>
      </div>
    </footer>
  );
}
