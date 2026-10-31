"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import type { Collection, Product, Settings } from "@/lib/types";
import { formatINR } from "@/lib/utils";
import { useCart } from "./CartProvider";
import { Bag, ChevronDown, Close, Menu, Search, Whatsapp } from "./icons";
import ThemeToggle from "./ThemeToggle";
import Image from "next/image";
import { productImage } from "@/lib/productImage";

interface HeaderProps {
  settings: Settings;
  collections: Collection[];
  products: Pick<Product, "id" | "slug" | "name" | "category" | "family" | "price" | "art">[];
}

const links = [
  { href: "/collections", label: "Collections" },
  { href: "/journal", label: "Journal" },
  { href: "/about", label: "Our Story" },
  { href: "/contact", label: "Contact" },
];

export default function Header({ settings, collections, products }: HeaderProps) {
  const pathname = usePathname();
  const { count, open } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  const [search, setSearch] = useState(false);
  const [query, setQuery] = useState("");
  const [shopOpen, setShopOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenu(false);
    setSearch(false);
    setShopOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenu(false);
        setSearch(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return products
      .filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.family.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q),
      )
      .slice(0, 6);
  }, [query, products]);

  return (
    <>
      <header className={`header ${scrolled ? "header--solid" : ""}`}>
        <div className="container header__inner">
          <Link href="/" className="brand" aria-label={`${settings.brandName} home`}>
            <svg className="brand__mark" viewBox="0 0 40 40" fill="none" aria-hidden="true">
              <circle cx="20" cy="20" r="19" stroke="#8b0d1a" strokeOpacity="0.85" />
              <path d="M20 7.5 27.5 32h-4.1l-1.5-5h-3.8l-1.5 5h-4.1L20 7.5Zm0 7.1-1.3 8.2h2.6L20 14.6Z" fill="#c11426" />
            </svg>
            <span className="brand__text">
              <span className="brand__name">Al Ibrahim</span>
              <span className="brand__sub">Aroma · Lucknow</span>
            </span>
          </Link>

          <nav className="nav" aria-label="Primary">
            <div
              className="nav__drop"
              onMouseEnter={() => setShopOpen(true)}
              onMouseLeave={() => setShopOpen(false)}
            >
              <Link
                href="/collections"
                className="nav__link"
                data-active={pathname.startsWith("/collections") || pathname.startsWith("/product")}
              >
                Shop <ChevronDown size={12} />
              </Link>
              <div className="nav__panel" data-open={shopOpen}>
                <div className="nav__panel-inner">
                  <div className="nav__panel-list">
                    <span className="overline">By collection</span>
                    {collections.map((c) => (
                      <Link key={c.id} href={`/collections/${c.slug}`} className="nav__panel-link">
                        <span>{c.title}</span>
                        <small>{c.kicker}</small>
                      </Link>
                    ))}
                  </div>
                  <div className="nav__panel-feature">
                    <span className="overline">House signature</span>
                    <div className="nav__panel-art">
                      <Image
                        src={productImage("oud-al-malik", "Oud")}
                        alt="Oud Al Malik"
                        fill
                        sizes="200px"
                      />
                    </div>
                    <strong>Oud Al Malik</strong>
                    <span className="muted" style={{ fontSize: 11 }}>
                      Aged Cambodian oud · ₹3,450
                    </span>
                    <Link href="/product/oud-al-malik" className="link-underline">
                      Discover
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            {links.slice(1).map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="nav__link"
                data-active={pathname === l.href}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="header__actions">
            <ThemeToggle />
            <button
              className="icon-btn"
              aria-label="Search"
              onClick={() => setSearch(true)}
            >
              <Search size={18} />
            </button>
            <a
              className="icon-btn desk-only"
              href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, "")}`}
              target="_blank"
              rel="noreferrer"
              aria-label="Chat on WhatsApp"
            >
              <Whatsapp size={17} />
            </a>
            <button className="icon-btn cart-btn" aria-label="Open cart" onClick={open}>
              <Bag size={18} />
              {count > 0 ? <span className="cart-btn__count">{count}</span> : null}
            </button>
            <button
              className="icon-btn menu-toggle"
              aria-label="Open menu"
              onClick={() => setMenu(true)}
            >
              <Menu size={19} />
            </button>
          </div>
        </div>
      </header>

      {menu ? (
        <div className="mobile-nav">
          <div className="mobile-nav__head">
            <span className="brand__name" style={{ letterSpacing: "0.16em" }}>
              Al Ibrahim
            </span>
            <button className="icon-btn" aria-label="Close menu" onClick={() => setMenu(false)}>
              <Close size={20} />
            </button>
          </div>
          <div className="mobile-nav__links">
            {[{ href: "/collections", label: "Shop" }, ...links.slice(1)].map((l) => (
              <Link key={l.href} href={l.href} className="mobile-nav__link" onClick={() => setMenu(false)}>
                {l.label}
                <small>0{links.findIndex((x) => x.href === l.href) + 1}</small>
              </Link>
            ))}
            <Link href="/faq" className="mobile-nav__link" onClick={() => setMenu(false)}>
              FAQ <small>05</small>
            </Link>
          </div>
          <div className="mobile-nav__foot">
            <a
              className="btn btn--gold"
              href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, "")}`}
              target="_blank"
              rel="noreferrer"
            >
              <Whatsapp size={15} /> Order on WhatsApp
            </a>
            <span>{settings.address}</span>
            <span>{settings.hours}</span>
          </div>
        </div>
      ) : null}

      {search ? (
        <div className="search-layer" role="dialog" aria-label="Search">
          <div className="search-layer__head">
            <span className="eyebrow">Search the house</span>
            <button className="icon-btn" aria-label="Close search" onClick={() => setSearch(false)}>
              <Close size={20} />
            </button>
          </div>
          <div className="search-layer__field">
            <Search size={22} />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Try “oud”, “rose”, “attar”…"
              aria-label="Search products"
            />
          </div>
          <div className="search-layer__results">
            {query && results.length === 0 ? (
              <p className="muted">No compositions found. Try “oud”, “floral” or “home”.</p>
            ) : null}
            {!query ? (
              <div className="search-layer__hints">
                {["Oud", "Attar", "Rose", "Gifting", "Home"].map((hint) => (
                  <button key={hint} className="chip" onClick={() => setQuery(hint)}>
                    {hint}
                  </button>
                ))}
              </div>
            ) : null}
            {results.map((p) => (
              <Link key={p.id} href={`/product/${p.slug}`} className="search-result">
                <span className="search-result__art">
                  <Image src={productImage(p.slug, p.family)} alt="" fill sizes="40px" />
                </span>
                <span className="search-result__info">
                  <strong>{p.name}</strong>
                  <small>
                    {p.category} · {p.family}
                  </small>
                </span>
                <span className="search-result__price">{formatINR(p.price)}</span>
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </>
  );
}
