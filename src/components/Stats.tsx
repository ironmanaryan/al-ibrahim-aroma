"use client";

import { useEffect, useRef, useState } from "react";

interface Stat {
  value: number;
  suffix?: string;
  prefix?: string;
  label: string;
  decimals?: number;
}

export default function Stats({ items }: { items: Stat[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div className="stats" ref={ref}>
      {items.map((item) => (
        <div className="stat" key={item.label}>
          <div className="stat__num">
            {item.prefix}
            <Counter to={item.value} run={shown} decimals={item.decimals} />
            {item.suffix ? <em>{item.suffix}</em> : null}
          </div>
          <div className="stat__label">{item.label}</div>
        </div>
      ))}
    </div>
  );
}

function Counter({ to, run, decimals = 0 }: { to: number; run: boolean; decimals?: number }) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!run) return;
    const duration = 1500;
    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(to * eased);
      if (p < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [run, to]);

  return <>{value.toFixed(decimals)}</>;
}
