"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import type { SessionUser } from "@/lib/session";
import {
  ArrowUpRight,
  Box,
  Close,
  FileText,
  Grid,
  ImageIcon,
  LogOut,
  Menu,
  Quote,
  Settings,
  Users,
} from "../icons";

const LINKS = [
  { href: "/admin", label: "Dashboard", icon: Grid, exact: true },
  { href: "/admin/products", label: "Products", icon: Box },
  { href: "/admin/leads", label: "Leads & CRM", icon: Users },
  { href: "/admin/journal", label: "Journal", icon: FileText },
  { href: "/admin/testimonials", label: "Testimonials", icon: Quote },
  { href: "/admin/media", label: "Media", icon: ImageIcon },
  { href: "/admin/settings", label: "Settings", icon: Settings },
  { href: "/admin/users", label: "Users", icon: Users, adminOnly: true },
];

export default function AdminShell({
  user,
  children,
}: {
  user: SessionUser;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  const nav = (
    <nav className="admin-nav">
      {LINKS.filter((l) => !l.adminOnly || user.role === "admin").map((link) => {
        const active = link.exact ? pathname === link.href : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className="admin-nav__link"
            data-active={active}
            onClick={() => setOpen(false)}
          >
            <link.icon size={16} />
            {link.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="admin">
      <aside className="admin-side" data-open={open}>
        <div className="admin-side__head">
          <Link href="/admin" className="admin-brand">
            <svg viewBox="0 0 40 40" fill="none" aria-hidden="true" width="30" height="30">
              <circle cx="20" cy="20" r="19" stroke="#c8a96a" strokeOpacity="0.6" />
              <path d="M20 7.5 27.5 32h-4.1l-1.5-5h-3.8l-1.5 5h-4.1L20 7.5Zm0 7.1-1.3 8.2h2.6L20 14.6Z" fill="#e7d3a3" />
            </svg>
            <span>
              <strong>Al Ibrahim</strong>
              <small>Control room</small>
            </span>
          </Link>
          <button className="admin-side__close" onClick={() => setOpen(false)} aria-label="Close menu">
            <Close size={18} />
          </button>
        </div>
        {nav}
        <div className="admin-side__foot">
          <Link href="/" target="_blank" className="admin-nav__link">
            <ArrowUpRight size={15} /> View website
          </Link>
          <div className="admin-user">
            <span className="admin-user__avatar">{user.name.slice(0, 1)}</span>
            <div>
              <strong>{user.name}</strong>
              <small>{user.role}</small>
            </div>
            <button onClick={logout} aria-label="Sign out" title="Sign out">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {open ? <div className="admin-scrim" onClick={() => setOpen(false)} /> : null}

      <div className="admin-main">
        <header className="admin-top">
          <button className="admin-menu" onClick={() => setOpen(true)} aria-label="Open menu">
            <Menu size={19} />
          </button>
          <span className="admin-top__crumb">
            Al Ibrahim Aroma <span>/</span>{" "}
            {LINKS.find((l) => (l.exact ? pathname === l.href : pathname.startsWith(l.href)))?.label ??
              "Admin"}
          </span>
          <div className="admin-top__right">
            <span className="admin-live">
              <i /> Live
            </span>
            <Link href="/" target="_blank" className="admin-btn admin-btn--ghost">
              <ArrowUpRight size={13} /> View site
            </Link>
          </div>
        </header>
        <div className="admin-content">{children}</div>
      </div>
    </div>
  );
}
