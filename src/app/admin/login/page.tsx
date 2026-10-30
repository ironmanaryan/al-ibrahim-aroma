"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight, Lock } from "@/components/icons";
import "../admin.css";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@alibrahim.com");
  const [password, setPassword] = useState("AlIbrahim@2026");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Sign in failed");
      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign in failed");
      setLoading(false);
    }
  }

  return (
    <div className="login">
      <div className="login__art" aria-hidden="true">
        <div className="login__glow" />
        <svg viewBox="0 0 320 460" className="login__bottle">
          <defs>
            <linearGradient id="lg" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#ffffff" stopOpacity="0.3" />
              <stop offset="0.6" stopColor="#ffffff" stopOpacity="0.05" />
              <stop offset="1" stopColor="#ffffff" stopOpacity="0.18" />
            </linearGradient>
            <linearGradient id="ll" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#c9973f" />
              <stop offset="1" stopColor="#5d3a12" />
            </linearGradient>
          </defs>
          <rect x="130" y="44" width="60" height="82" rx="8" fill="#c8a96a" opacity="0.85" />
          <rect x="138" y="118" width="44" height="46" rx="5" fill="url(#lg)" />
          <path
            d="M96 170h128c10 0 18 8 18 18v130c0 22-18 40-40 40h-84c-22 0-40-18-40-40V188c0-10 8-18 18-18Z"
            fill="url(#lg)"
            stroke="#ffffff"
            strokeOpacity="0.22"
          />
          <path d="M78 214h164v150H78z" fill="url(#ll)" opacity="0.85" clipPath="url(#c)" />
          <clipPath id="c">
            <path d="M96 170h128c10 0 18 8 18 18v130c0 22-18 40-40 40h-84c-22 0-40-18-40-40V188c0-10 8-18 18-18Z" />
          </clipPath>
        </svg>
      </div>

      <div className="login__panel">
        <div className="login__brand">
          <svg viewBox="0 0 40 40" fill="none" width="34" height="34" aria-hidden="true">
            <circle cx="20" cy="20" r="19" stroke="#c8a96a" strokeOpacity="0.6" />
            <path d="M20 7.5 27.5 32h-4.1l-1.5-5h-3.8l-1.5 5h-4.1L20 7.5Zm0 7.1-1.3 8.2h2.6L20 14.6Z" fill="#e7d3a3" />
          </svg>
          <div>
            <strong>Al Ibrahim Aroma</strong>
            <small>Control room</small>
          </div>
        </div>

        <h1>Welcome back</h1>
        <p className="login__sub">
          Sign in to manage the storefront, the journal and every enquiry that comes in.
        </p>

        <form onSubmit={submit} className="login__form">
          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              className="input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
              required
            />
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              className="input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>
          {error ? <p className="field__error">{error}</p> : null}
          <button className="admin-btn admin-btn--gold" type="submit" disabled={loading}>
            <Lock size={14} /> {loading ? "Signing in…" : "Sign in"}
            <ArrowRight size={14} />
          </button>
        </form>

        <div className="login__hint">
          <span className="overline">Demo accounts</span>
          <p>
            <strong>Admin</strong> · admin@alibrahim.com / AlIbrahim@2026
            <br />
            <strong>Moderator</strong> · editor@alibrahim.com / Editor@2026
          </p>
        </div>
        <p className="login__note">
          Protected by JWT sessions, hashed passwords and role-based access. Change these credentials in
          Settings → Users before going live.
        </p>
      </div>
    </div>
  );
}
