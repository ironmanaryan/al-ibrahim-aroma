"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

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
    const payload = JSON.stringify({ path: pathname });
    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/track", new Blob([payload], { type: "application/json" }));
      return;
    }
    fetch("/api/track", { method: "POST", body: payload, keepalive: true }).catch(() => {});
  }, [pathname]);

  return null;
}
