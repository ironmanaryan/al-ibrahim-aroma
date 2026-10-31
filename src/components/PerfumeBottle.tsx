type Variant = "noir" | "crimson" | "ivory";

const PALETTES: Record<
  Variant,
  {
    capA: string;
    capB: string;
    capLine: string;
    liquidA: string;
    liquidB: string;
    liquidC: string;
    label: string;
    labelInk: string;
    glow: string;
  }
> = {
  noir: {
    capA: "#3a3a3a",
    capB: "#0d0d0d",
    capLine: "rgba(245,242,237,0.22)",
    liquidA: "#050505",
    liquidB: "#171717",
    liquidC: "#2c2c2c",
    label: "#f5f2ed",
    labelInk: "#0b0b0b",
    glow: "rgba(245,242,237,0.18)",
  },
  crimson: {
    capA: "#f5f2ed",
    capB: "#cfc6ba",
    capLine: "rgba(11,11,11,0.18)",
    liquidA: "#3d060c",
    liquidB: "#8b0d1a",
    liquidC: "#c11426",
    label: "#f5f2ed",
    labelInk: "#0b0b0b",
    glow: "rgba(139,13,26,0.5)",
  },
  ivory: {
    capA: "#a3111f",
    capB: "#5d0810",
    capLine: "rgba(245,242,237,0.28)",
    liquidA: "#d8d0c4",
    liquidB: "#f5f2ed",
    liquidC: "#fffdf9",
    label: "#111111",
    labelInk: "#f5f2ed",
    glow: "rgba(245,242,237,0.4)",
  },
};

export default function PerfumeBottle({
  variant = "crimson",
  className,
}: {
  variant?: Variant;
  className?: string;
}) {
  const p = PALETTES[variant];
  const id = `bottle-${variant}`;

  return (
    <svg
      className={`bottle ${className ?? ""}`}
      viewBox="0 0 280 480"
      role="img"
      aria-label={`Perfume flacon, ${variant} edition`}
      fill="none"
    >
      <defs>
        <linearGradient id={`${id}-cap`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={p.capA} />
          <stop offset="52%" stopColor={p.capB} />
          <stop offset="100%" stopColor={p.capA} />
        </linearGradient>
        <linearGradient id={`${id}-liquid`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={p.liquidA} />
          <stop offset="48%" stopColor={p.liquidB} />
          <stop offset="100%" stopColor={p.liquidC} />
        </linearGradient>
        <linearGradient id={`${id}-glass`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="rgba(255,255,255,0.28)" />
          <stop offset="34%" stopColor="rgba(255,255,255,0.04)" />
          <stop offset="72%" stopColor="rgba(255,255,255,0.12)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0.02)" />
        </linearGradient>
        <linearGradient id={`${id}-sheen`} x1="0" y1="0" x2="1" y2="0.4">
          <stop offset="0%" stopColor="rgba(255,255,255,0)" />
          <stop offset="45%" stopColor="rgba(255,255,255,0.34)" />
          <stop offset="60%" stopColor="rgba(255,255,255,0)" />
        </linearGradient>
        <clipPath id={`${id}-clip`}>
          <path d="M62 214c0-27 19-48 46-48h64c27 0 46 21 46 48v170c0 27-19 48-46 48H108c-27 0-46-21-46-48V214Z" />
        </clipPath>
        <filter id={`${id}-soft`} x="-40%" y="-20%" width="180%" height="150%">
          <feGaussianBlur stdDeviation="14" />
        </filter>
      </defs>

      <ellipse
        cx="140"
        cy="432"
        rx="104"
        ry="18"
        fill={p.glow}
        opacity="0.55"
        filter={`url(#${id}-soft)`}
      />

      {/* cap */}
      <g>
        <rect x="98" y="26" width="84" height="104" rx="12" fill={`url(#${id}-cap)`} />
        <rect
          x="98"
          y="26"
          width="84"
          height="104"
          rx="12"
          stroke={p.capLine}
          strokeWidth="1"
        />
        <rect x="108" y="38" width="10" height="80" rx="5" fill="rgba(255,255,255,0.18)" />
        <path d="M98 104h84" stroke="rgba(255,255,255,0.16)" strokeWidth="1" />
      </g>

      {/* collar */}
      <rect x="116" y="126" width="48" height="30" rx="5" fill={`url(#${id}-cap)`} />
      <rect x="116" y="126" width="48" height="30" rx="5" stroke={p.capLine} strokeWidth="1" />
      <rect x="124" y="152" width="32" height="22" rx="3" fill="#141414" opacity="0.5" />

      {/* bottle body */}
      <path
        d="M62 214c0-27 19-48 46-48h64c27 0 46 21 46 48v170c0 27-19 48-46 48H108c-27 0-46-21-46-48V214Z"
        fill={`url(#${id}-glass)`}
        stroke="rgba(255,255,255,0.22)"
        strokeWidth="1.2"
      />

      {/* liquid */}
      <g clipPath={`url(#${id}-clip)`}>
        <rect x="60" y="250" width="160" height="188" fill={`url(#${id}-liquid)`} />
        <path
          d="M60 252c26-12 42 8 68 2s38-16 62-4 28 8 32 6v16H60v-20Z"
          fill={p.liquidC}
          opacity="0.35"
        />
        <ellipse cx="140" cy="256" rx="82" ry="10" fill="rgba(255,255,255,0.16)" />
      </g>

      {/* gloss + sheen */}
      <path
        d="M76 212c0-18 13-33 31-33h18v262H108c-18 0-32-15-32-33V212Z"
        fill="rgba(255,255,255,0.1)"
      />
      <path
        d="M196 200c9 8 14 18 14 30v154c0 16-8 29-20 36 22-4 30-20 30-40V230c0-14-9-25-24-30Z"
        fill="rgba(0,0,0,0.18)"
      />
      <rect
        className="bottle__sheen"
        x="52"
        y="120"
        width="48"
        height="330"
        fill={`url(#${id}-sheen)`}
        opacity="0.6"
        transform="rotate(10 76 285)"
      />

      {/* label */}
      <g>
        <rect x="98" y="300" width="84" height="104" rx="2" fill={p.label} />
        <rect x="98" y="300" width="84" height="104" rx="2" stroke="rgba(0,0,0,0.12)" />
        <text
          x="140"
          y="330"
          textAnchor="middle"
          fill={p.labelInk}
          fontFamily="Syne, sans-serif"
          fontSize="9"
          fontWeight="700"
          letterSpacing="2.2"
        >
          AL IBRAHIM
        </text>
        <path d="M124 340h32" stroke={p.labelInk} strokeOpacity="0.4" strokeWidth="1" />
        <text
          x="140"
          y="360"
          textAnchor="middle"
          fill={p.labelInk}
          fontFamily="Plus Jakarta Sans, sans-serif"
          fontSize="6.4"
          letterSpacing="1.8"
          opacity="0.72"
        >
          EAU DE PARFUM
        </text>
        <text
          x="140"
          y="384"
          textAnchor="middle"
          fill={p.labelInk}
          fontFamily="Syne, sans-serif"
          fontSize="13"
          letterSpacing="1"
        >
          N° 01
        </text>
        <text
          x="140"
          y="396"
          textAnchor="middle"
          fill={p.labelInk}
          fontFamily="Plus Jakarta Sans, sans-serif"
          fontSize="5.6"
          letterSpacing="1.4"
          opacity="0.6"
        >
          LUCKNOW · INDIA
        </text>
      </g>

      {/* base shadow */}
      <path
        d="M62 384v-170c0-27 19-48 46-48h64c27 0 46 21 46 48v170"
        stroke="rgba(0,0,0,0.28)"
        strokeWidth="10"
        opacity="0.35"
        filter={`url(#${id}-soft)`}
      />
    </svg>
  );
}
