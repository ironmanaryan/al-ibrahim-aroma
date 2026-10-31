"use client";

import { useEffect, useState } from "react";

export default function Preloader() {
  const [phase, setPhase] = useState<"hidden" | "shown" | "leaving">("hidden");

  useEffect(() => {
    try {
      if (sessionStorage.getItem("aia_visited")) return;
    } catch {
      return;
    }
    setPhase("shown");
    const leave = setTimeout(() => setPhase("leaving"), 1000);
    const done = setTimeout(() => {
      setPhase("hidden");
      try {
        sessionStorage.setItem("aia_visited", "1");
      } catch {
        /* ignore */
      }
    }, 1600);
    return () => {
      clearTimeout(leave);
      clearTimeout(done);
    };
  }, []);

  if (phase === "hidden") return null;

  return (
    <div className="preloader" data-done={phase === "leaving"} aria-hidden="true">
      <svg className="preloader__mark" viewBox="0 0 40 40" fill="none">
        <circle cx="20" cy="20" r="19" stroke="currentColor" strokeOpacity="0.55" />
        <path
          d="M20 7.5 27.5 32h-4.1l-1.5-5h-3.8l-1.5 5h-4.1L20 7.5Zm0 7.1-1.3 8.2h2.6L20 14.6Z"
          fill="currentColor"
        />
      </svg>
      <span className="preloader__name">Al Ibrahim</span>
      <span className="preloader__line">
        <i />
      </span>
      <span className="preloader__sub">Attar house · Lucknow</span>
    </div>
  );
}
