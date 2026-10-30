"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

function beacon(payload: Record<string, unknown>) {
  const body = JSON.stringify(payload);
  if (navigator.sendBeacon) {
    navigator.sendBeacon("/api/track", new Blob([body], { type: "application/json" }));
    return;
  }
  fetch("/api/track", { method: "POST", body, keepalive: true }).catch(() => {});
}

export default function Analytics() {
  const pathname = usePathname();

  useEffect(() => {
    const key = `aia_seen_${pathname}`;
    try {
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, "1");
    } catch {
      /* ignore */
    }
    beacon({ path: pathname });
  }, [pathname]);

  useEffect(() => {
    function onClick(event: MouseEvent) {
      const target = event.target as HTMLElement | null;
      const link = target?.closest?.('a[href*="wa.me"]');
      if (!link) return;
      beacon({ event: "whatsapp", path: window.location.pathname });
    }
    document.addEventListener("click", onClick, { capture: true, passive: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  return null;
}
