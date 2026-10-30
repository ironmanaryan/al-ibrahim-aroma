"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function MotionProvider() {
  const pathname = usePathname();

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    let ctx: { revert: () => void } | undefined;
    let cancelled = false;

    (async () => {
      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
          const delay = Number(el.dataset.delay ?? 0);
          gsap.from(el, {
            opacity: 0,
            y: 34,
            duration: 1.05,
            delay,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 90%", once: true },
          });
        });

        gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
          const speed = Number(el.dataset.parallax ?? 0.12);
          gsap.to(el, {
            yPercent: speed * 100,
            ease: "none",
            scrollTrigger: {
              trigger: el.parentElement ?? el,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.6,
            },
          });
        });

        gsap.utils.toArray<HTMLElement>("[data-scale-in]").forEach((el) => {
          gsap.from(el, {
            scale: 1.08,
            opacity: 0.4,
            duration: 1.4,
            ease: "power2.out",
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
          });
        });
      });

      ScrollTrigger.refresh();
    })();

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, [pathname]);

  return null;
}
