"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/types";
import { formatINR, initials } from "@/lib/utils";
import { productImage } from "@/lib/productImage";
import { useCart } from "./CartProvider";
import { useToast } from "./Toast";
import { ArrowRight, Bag, Check, Lock, LogOut, MapPin, Plus } from "./icons";

type User = { name: string; email: string };
type Tab = "orders" | "addresses" | "wishlist";
type Address = { id: string; label: string; name: string; line: string; city: string; phone: string };

const ORDERS = [
  {
    id: "AIA-2419",
    date: "22 Oct 2026",
    status: "In transit",
    tone: "transit",
    items: "Oud Al Malik 50 ml · Mitti 9 ml",
    total: 7290,
    eta: "Expected 27 Oct",
    progress: 66,
  },
  {
    id: "AIA-2207",
    date: "3 Sep 2026",
    status: "Delivered",
    tone: "done",
    items: "Rose Taifi 50 ml",
    total: 3450,
    eta: "Delivered 5 Sep",
    progress: 100,
  },
];

const KEY = "aia_account_v1";

export default function AccountClient({ products }: { products: Product[] }) {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [tab, setTab] = useState<Tab>("orders");
  const [wishlist, setWishlist] = useState<Product[]>(() => products.slice(0, 3));
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: "addr_home",
      label: "Home",
      name: "Ayesha Ibrahim",
      line: "14 Hazratganj, near the old post office",
      city: "Lucknow, Uttar Pradesh 226001",
      phone: "+91 98390 22014",
    },
  ]);
  const [showAddress, setShowAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({ line: "", city: "", pincode: "" });

  const { add } = useCart();
  const { notify } = useToast();

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setUser(JSON.parse(raw) as User);
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  function submitAuth(event: React.FormEvent) {
    event.preventDefault();
    if (mode === "signup" && name.trim().length < 2) {
      setAuthError("Tell us what to call you.");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setAuthError("That email does not look complete.");
      return;
    }
    if (password.length < 6) {
      setAuthError("Use at least six characters.");
      return;
    }
    const displayName =
      mode === "signup"
        ? name.trim()
        : email
            .split("@")[0]
            .replace(/[._-]+/g, " ")
            .replace(/\b\w/g, (c) => c.toUpperCase());
    const next = { name: displayName, email: email.trim() };
    setUser(next);
    setAuthError("");
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
    notify(`Welcome, ${displayName.split(" ")[0]}`);
  }

  function signOut() {
    setUser(null);
    setPassword("");
    try {
      localStorage.removeItem(KEY);
    } catch {
      /* ignore */
    }
  }

  function addAddress(event: React.FormEvent) {
    event.preventDefault();
    if (newAddress.line.trim().length < 4 || newAddress.city.trim().length < 2) return;
    setAddresses((current) => [
      ...current,
      {
        id: `addr_${Date.now()}`,
        label: current.length === 0 ? "Home" : "Studio",
        name: user?.name ?? "Guest",
        line: newAddress.line.trim(),
        city: `${newAddress.city.trim()}${newAddress.pincode ? ` ${newAddress.pincode.trim()}` : ""}`,
        phone: "+91 98390 22014",
      },
    ]);
    setNewAddress({ line: "", city: "", pincode: "" });
    setShowAddress(false);
    notify("Address saved");
  }

  function addWishlistToBag(product: Product) {
    const size = product.sizes[0];
    add({
      key: `${product.id}-${size.ml}`,
      productId: product.id,
      slug: product.slug,
      name: product.name,
      size: size.ml,
      price: size.price,
      qty: 1,
      art: product.art,
    });
    notify(`${product.name} added to your bag`);
  }

  if (!ready) {
    return (
      <div className="account-shell account-shell--loading">
        <span className="skeleton" style={{ height: 520 }} />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="account-shell">
        <div className="account-aside">
          <Image src="/images/atelier-gold.jpg" alt="" fill sizes="(max-width: 860px) 100vw, 45vw" />
          <div className="account-aside__body">
            <span className="eyebrow">The private room</span>
            <h2>
              Keep your <em className="serif-italic">ritual</em> in one place.
            </h2>
            <p>
              Orders, addresses and the compositions you save — kept quietly, in one place, with no
              newsletters you did not ask for.
            </p>
            <blockquote>
              A perfume is not a product. It is a small, wearable piece of memory.
            </blockquote>
          </div>
        </div>

        <div className="auth-card">
          <div className="auth-switch" role="tablist" aria-label="Sign in or create an account">
            <button
              type="button"
              role="tab"
              aria-selected={mode === "signin"}
              data-active={mode === "signin"}
              onClick={() => {
                setMode("signin");
                setAuthError("");
              }}
            >
              Sign in
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === "signup"}
              data-active={mode === "signup"}
              onClick={() => {
                setMode("signup");
                setAuthError("");
              }}
            >
              Create account
            </button>
          </div>

          <form className="auth-form" onSubmit={submitAuth} noValidate>
            {mode === "signup" ? (
              <label className="track-field">
                <span>Your name</span>
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ayesha Ibrahim" />
              </label>
            ) : null}
            <label className="track-field">
              <span>Email address</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
              />
            </label>
            <label className="track-field">
              <span>Password</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least six characters"
                autoComplete={mode === "signup" ? "new-password" : "current-password"}
              />
            </label>
            {authError ? <p className="track-error">{authError}</p> : null}
            <button className="btn btn--gold">
              {mode === "signin" ? "Enter the house" : "Create my account"} <ArrowRight size={14} />
            </button>
            <p className="auth-note">
              <Lock size={12} /> Preview account — details stay in this browser only.
            </p>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="account-dash">
      <header className="account-head">
        <span className="account-avatar">{initials(user.name)}</span>
        <div className="account-head__id">
          <span className="overline">Signed in as</span>
          <h2>{user.name}</h2>
          <p>{user.email}</p>
        </div>
        <button type="button" className="btn btn--line btn--sm" onClick={signOut}>
          <LogOut size={13} /> Sign out
        </button>
      </header>

      <nav className="account-tabs" role="tablist" aria-label="Account sections">
        {(
          [
            ["orders", "Orders"],
            ["addresses", "Addresses"],
            ["wishlist", "Wishlist"],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={tab === key}
            data-active={tab === key}
            onClick={() => setTab(key)}
          >
            {label}
          </button>
        ))}
      </nav>

      {tab === "orders" ? (
        <div className="account-panel">
          {ORDERS.map((order) => (
            <article className="order-row" key={order.id}>
              <div className="order-row__top">
                <div>
                  <strong>#{order.id}</strong>
                  <span>
                    {order.date} · {order.items}
                  </span>
                </div>
                <span className="order-status" data-tone={order.tone}>
                  {order.status}
                </span>
              </div>
              <div className="order-row__bar" aria-hidden="true">
                <i style={{ width: `${order.progress}%` }} />
              </div>
              <div className="order-row__foot">
                <span>
                  {order.eta} · {formatINR(order.total)}
                </span>
                <Link href="/track" className="link-underline">
                  {order.tone === "done" ? "View again" : "Track order"} <ArrowRight size={12} />
                </Link>
              </div>
            </article>
          ))}
          <p className="account-hint">
            Orders can be placed without an account. Accounts are simply for keeping the paperwork in one
            place.
          </p>
        </div>
      ) : null}

      {tab === "addresses" ? (
        <div className="account-panel">
          <div className="address-grid">
            {addresses.map((address, index) => (
              <article className="address-card" key={address.id}>
                <span className="address-card__top">
                  <MapPin size={14} /> {address.label}
                  {index === 0 ? <em>Default</em> : null}
                </span>
                <strong>{address.name}</strong>
                <p>
                  {address.line}
                  <br />
                  {address.city}
                </p>
                <span className="address-card__phone">{address.phone}</span>
              </article>
            ))}
          </div>

          {showAddress ? (
            <form className="address-form" onSubmit={addAddress}>
              <label className="track-field">
                <span>Street &amp; building</span>
                <input
                  value={newAddress.line}
                  onChange={(e) => setNewAddress({ ...newAddress, line: e.target.value })}
                  placeholder="Flat, building, street"
                />
              </label>
              <div className="track-form__grid">
                <label className="track-field">
                  <span>City</span>
                  <input
                    value={newAddress.city}
                    onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                    placeholder="Lucknow"
                  />
                </label>
                <label className="track-field">
                  <span>Pincode</span>
                  <input
                    value={newAddress.pincode}
                    onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
                    placeholder="226001"
                    inputMode="numeric"
                  />
                </label>
              </div>
              <div className="address-form__actions">
                <button className="btn btn--gold btn--sm">
                  <Check size={13} /> Save address
                </button>
                <button
                  type="button"
                  className="btn btn--line btn--sm"
                  onClick={() => setShowAddress(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <button
              type="button"
              className="btn btn--line btn--sm"
              onClick={() => setShowAddress(true)}
              style={{ justifySelf: "start" }}
            >
              <Plus size={13} /> Add another address
            </button>
          )}
        </div>
      ) : null}

      {tab === "wishlist" ? (
        <div className="account-panel">
          {wishlist.length ? (
            <div className="wishlist-list">
              {wishlist.map((product) => (
                <article className="wishlist-item" key={product.id}>
                  <Link href={`/product/${product.slug}`} className="wishlist-item__art">
                    <Image
                      src={productImage(product.slug, product.family)}
                      alt={product.name}
                      width={98}
                      height={122}
                      sizes="98px"
                    />
                  </Link>
                  <div className="wishlist-item__body">
                    <span className="overline">
                      {product.family} · {product.category}
                    </span>
                    <Link href={`/product/${product.slug}`}>{product.name}</Link>
                    <span>{product.subtitle}</span>
                    <strong>{formatINR(product.price)}</strong>
                  </div>
                  <div className="wishlist-item__actions">
                    <button
                      type="button"
                      className="btn btn--gold btn--sm"
                      onClick={() => addWishlistToBag(product)}
                    >
                      <Bag size={13} /> Add to bag
                    </button>
                    <button
                      type="button"
                      className="link-underline"
                      onClick={() => setWishlist((current) => current.filter((p) => p.id !== product.id))}
                    >
                      Remove
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="account-empty">
              <p>Nothing saved yet. Keep a composition here until the next harvest.</p>
              <Link href="/collections" className="btn btn--gold btn--sm">
                Browse the house <ArrowRight size={13} />
              </Link>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
