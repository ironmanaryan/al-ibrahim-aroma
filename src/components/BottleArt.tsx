import type { ArtVariant, CapStyle } from "@/lib/types";

interface BottleArtProps {
  variant?: ArtVariant;
  liquid?: string;
  label?: string;
  cap?: CapStyle;
  className?: string;
  title?: string;
}

function shade(hex: string, amount: number): string {
  const clean = hex.replace("#", "");
  const full =
    clean.length === 3
      ? clean
          .split("")
          .map((c) => c + c)
          .join("")
      : clean;
  const num = parseInt(full || "b07b2e", 16);
  const r = Math.min(255, Math.max(0, ((num >> 16) & 255) + amount));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 255) + amount));
  const b = Math.min(255, Math.max(0, (num & 255) + amount));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}

const capColors: Record<CapStyle, { a: string; b: string; c: string }> = {
  gold: { a: "#f0dba8", b: "#cfc8bb", c: "#7a5f2c" },
  black: { a: "#4a4640", b: "#191714", c: "#050505" },
  wood: { a: "#a97c4c", b: "#6d4a28", c: "#33200f" },
  ivory: { a: "#fbf4e6", b: "#ddcdb2", c: "#a38f6f" },
};

export default function BottleArt({
  variant = "flacon",
  liquid = "#b07b2e",
  label = "#12100d",
  cap = "gold",
  className,
  title = "Al Ibrahim Aroma bottle",
}: BottleArtProps) {
  const uid = `${variant}-${liquid.replace("#", "")}-${label.replace("#", "")}-${cap}`;
  const light = shade(liquid, 42);
  const dark = shade(liquid, -38);
  const capTone = capColors[cap] ?? capColors.gold;
  const labelLight = shade(label, 18);
  const isDarkLabel = ["#12100d", "#4a1f1a", "#1e2b23"].includes(label.toLowerCase());

  return (
    <svg
      viewBox="0 0 320 460"
      className={className}
      role="img"
      aria-label={title}
      style={{ overflow: "visible" }}
    >
      <defs>
        <linearGradient id={`glass-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.34" />
          <stop offset="0.28" stopColor="#ffffff" stopOpacity="0.07" />
          <stop offset="0.62" stopColor="#ffffff" stopOpacity="0.03" />
          <stop offset="0.86" stopColor="#ffffff" stopOpacity="0.22" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0.05" />
        </linearGradient>
        <linearGradient id={`liquid-${uid}`} x1="0.1" y1="0" x2="0.9" y2="1">
          <stop offset="0" stopColor={light} />
          <stop offset="0.45" stopColor={liquid} />
          <stop offset="1" stopColor={dark} />
        </linearGradient>
        <linearGradient id={`cap-${uid}`} x1="0" y1="0" x2="1" y2="0.6">
          <stop offset="0" stopColor={capTone.c} />
          <stop offset="0.22" stopColor={capTone.b} />
          <stop offset="0.44" stopColor={capTone.a} />
          <stop offset="0.62" stopColor={capTone.b} />
          <stop offset="1" stopColor={capTone.c} />
        </linearGradient>
        <linearGradient id={`label-${uid}`} x1="0" y1="0" x2="0.7" y2="1">
          <stop offset="0" stopColor={labelLight} />
          <stop offset="1" stopColor={label} />
        </linearGradient>
        <radialGradient id={`glow-${uid}`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor={light} stopOpacity="0.5" />
          <stop offset="1" stopColor={light} stopOpacity="0" />
        </radialGradient>
        <filter id={`blur-${uid}`} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="16" />
        </filter>
        <clipPath id={`body-${uid}`}>
          {variant === "attar" ? (
            <path d="M104 196h112c8 0 14 6 14 14v92c0 26-20 46-46 46h-48c-26 0-46-20-46-46v-92c0-8 6-14 14-14Z" />
          ) : variant === "diffuser" ? (
            <path d="M112 176h96v170c0 10-8 18-18 18h-60c-10 0-18-8-18-18V176Z" />
          ) : variant === "coffret" ? (
            <rect x="62" y="220" width="196" height="150" rx="6" />
          ) : variant === "vial" ? (
            <rect x="124" y="196" width="72" height="180" rx="10" />
          ) : (
            <path d="M96 170h128c10 0 18 8 18 18v130c0 22-18 40-40 40h-84c-22 0-40-18-40-40V188c0-10 8-18 18-18Z" />
          )}
        </clipPath>
      </defs>

      {/* ambient glow */}
      <ellipse cx="160" cy="300" rx="130" ry="150" fill={`url(#glow-${uid})`} opacity="0.55" />

      {/* ground shadow */}
      <ellipse cx="160" cy="424" rx="98" ry="14" fill="#000" opacity="0.45" filter={`url(#blur-${uid})`} />

      {variant === "flacon" && (
        <g>
          {/* neck */}
          <rect x="138" y="118" width="44" height="46" rx="5" fill={`url(#glass-${uid})`} stroke="#ffffff" strokeOpacity="0.18" />
          {/* cap */}
          <rect x="130" y="44" width="60" height="82" rx="8" fill={`url(#cap-${uid})`} />
          <rect x="136" y="52" width="48" height="66" rx="4" fill="none" stroke="#000" strokeOpacity="0.16" />
          <rect x="134" y="112" width="52" height="10" rx="3" fill={`url(#cap-${uid})`} />
          {/* body */}
          <path
            d="M96 170h128c10 0 18 8 18 18v130c0 22-18 40-40 40h-84c-22 0-40-18-40-40V188c0-10 8-18 18-18Z"
            fill={`url(#glass-${uid})`}
            stroke="#ffffff"
            strokeOpacity="0.22"
            strokeWidth="1.2"
          />
          {/* liquid */}
          <g clipPath={`url(#body-${uid})`}>
            <rect x="70" y="214" width="180" height="180" fill={`url(#liquid-${uid})`} opacity="0.92" />
            <ellipse cx="160" cy="214" rx="96" ry="12" fill={light} opacity="0.55" />
            <rect x="70" y="214" width="180" height="4" fill="#fff" opacity="0.28" />
            <rect x="88" y="230" width="16" height="130" rx="8" fill="#fff" opacity="0.12" />
            <rect x="228" y="248" width="8" height="100" rx="4" fill="#fff" opacity="0.1" />
          </g>
          {/* label */}
          <rect x="112" y="256" width="96" height="86" rx="3" fill={`url(#label-${uid})`} />
          <rect x="117" y="261" width="86" height="76" rx="2" fill="none" stroke={isDarkLabel ? "#cfc8bb" : "#12100d"} strokeOpacity="0.45" />
          <text
            x="160"
            y="286"
            textAnchor="middle"
            fill={isDarkLabel ? "#f5f2ed" : "#12100d"}
            style={{ fontFamily: "var(--font-display), serif", fontSize: "11px", letterSpacing: "2.2px" }}
          >
            AL IBRAHIM
          </text>
          <text
            x="160"
            y="303"
            textAnchor="middle"
            fill={isDarkLabel ? "#f5f2ed" : "#12100d"}
            style={{ fontFamily: "var(--font-display), serif", fontSize: "7px", letterSpacing: "3.4px", opacity: 0.85 }}
          >
            AROMA · LUCKNOW
          </text>
          <line x1="136" y1="313" x2="184" y2="313" stroke={isDarkLabel ? "#cfc8bb" : "#12100d"} strokeOpacity="0.4" />
          <text
            x="160"
            y="330"
            textAnchor="middle"
            fill={isDarkLabel ? "#f5f2ed" : "#12100d"}
            style={{ fontFamily: "var(--font-sans), sans-serif", fontSize: "6px", letterSpacing: "2px", opacity: 0.8 }}
          >
            EAU DE PARFUM
          </text>
          {/* glass highlights */}
          <path d="M100 176h22v176h-12c-8 0-14-6-14-14V188c0-6 2-9 4-12Z" fill="#fff" opacity="0.16" />
          <path d="M232 186v168c0 4-1 7-3 10h5c8 0 12-6 12-14V188c0-6-5-12-12-14Z" fill="#fff" opacity="0.1" />
        </g>
      )}

      {variant === "attar" && (
        <g>
          <rect x="140" y="150" width="40" height="52" rx="4" fill={`url(#glass-${uid})`} stroke="#fff" strokeOpacity="0.18" />
          {/* ornate gold cap */}
          <path d="M132 78h56l6 14v46l-6 12h-56l-6-12V92l6-14Z" fill={`url(#cap-${uid})`} />
          <rect x="138" y="90" width="44" height="48" rx="2" fill="none" stroke="#000" strokeOpacity="0.18" />
          <circle cx="160" cy="64" r="14" fill={`url(#cap-${uid})`} />
          <circle cx="160" cy="64" r="7" fill="#000" opacity="0.18" />
          {/* faceted body */}
          <path
            d="M104 196h112c8 0 14 6 14 14v92c0 26-20 46-46 46h-48c-26 0-46-20-46-46v-92c0-8 6-14 14-14Z"
            fill={`url(#glass-${uid})`}
            stroke="#fff"
            strokeOpacity="0.2"
          />
          <g clipPath={`url(#body-${uid})`}>
            <rect x="90" y="238" width="140" height="140" fill={`url(#liquid-${uid})`} opacity="0.9" />
            <ellipse cx="160" cy="238" rx="68" ry="9" fill={light} opacity="0.5" />
            <rect x="90" y="238" width="140" height="3" fill="#fff" opacity="0.3" />
          </g>
          {/* facets */}
          <path d="M104 200h18v144h-8c-16-10-24-28-24-48v-82c0-8 6-14 14-14Z" fill="#fff" opacity="0.14" />
          <path d="M216 200h-16v144h6c16-10 24-28 24-48v-82c0-8-6-14-14-14Z" fill="#fff" opacity="0.09" />
          <rect x="128" y="262" width="64" height="58" rx="2" fill={`url(#label-${uid})`} />
          <rect x="132" y="266" width="56" height="50" rx="1" fill="none" stroke={isDarkLabel ? "#cfc8bb" : "#12100d"} strokeOpacity="0.45" />
          <text
            x="160"
            y="286"
            textAnchor="middle"
            fill={isDarkLabel ? "#f5f2ed" : "#12100d"}
            style={{ fontFamily: "var(--font-display), serif", fontSize: "9px", letterSpacing: "1.8px" }}
          >
            AL IBRAHIM
          </text>
          <line x1="142" y1="294" x2="178" y2="294" stroke={isDarkLabel ? "#cfc8bb" : "#12100d"} strokeOpacity="0.4" />
          <text
            x="160"
            y="306"
            textAnchor="middle"
            fill={isDarkLabel ? "#f5f2ed" : "#12100d"}
            style={{ fontFamily: "var(--font-sans), sans-serif", fontSize: "5.5px", letterSpacing: "1.6px", opacity: 0.85 }}
          >
            ATTAR · 12 ML
          </text>
        </g>
      )}

      {variant === "diffuser" && (
        <g>
          {/* reeds */}
          {[0, 1, 2, 3, 4].map((i) => (
            <line
              key={i}
              x1={150 + i * 5}
              y1="186"
              x2={128 + i * 17}
              y2="46"
              stroke="#8a6b42"
              strokeWidth="2.4"
              strokeLinecap="round"
              opacity={0.85 - i * 0.06}
            />
          ))}
          <rect x="140" y="140" width="40" height="44" rx="4" fill={`url(#glass-${uid})`} stroke="#fff" strokeOpacity="0.16" />
          <rect x="132" y="112" width="56" height="34" rx="6" fill={`url(#cap-${uid})`} />
          <path d="M112 176h96v170c0 10-8 18-18 18h-60c-10 0-18-8-18-18V176Z" fill={`url(#glass-${uid})`} stroke="#fff" strokeOpacity="0.2" />
          <g clipPath={`url(#body-${uid})`}>
            <rect x="104" y="232" width="112" height="150" fill={`url(#liquid-${uid})`} opacity="0.85" />
            <ellipse cx="160" cy="232" rx="52" ry="8" fill={light} opacity="0.45" />
          </g>
          <rect x="128" y="266" width="64" height="66" rx="2" fill={`url(#label-${uid})`} />
          <text
            x="160"
            y="290"
            textAnchor="middle"
            fill={isDarkLabel ? "#f5f2ed" : "#12100d"}
            style={{ fontFamily: "var(--font-display), serif", fontSize: "9px", letterSpacing: "1.6px" }}
          >
            AL IBRAHIM
          </text>
          <line x1="140" y1="299" x2="180" y2="299" stroke={isDarkLabel ? "#cfc8bb" : "#12100d"} strokeOpacity="0.4" />
          <text
            x="160"
            y="312"
            textAnchor="middle"
            fill={isDarkLabel ? "#f5f2ed" : "#12100d"}
            style={{ fontFamily: "var(--font-sans), sans-serif", fontSize: "5.5px", letterSpacing: "1.5px", opacity: 0.85 }}
          >
            HOME FRAGRANCE
          </text>
          <path d="M116 180h12v176h-6c-6 0-10-6-10-12V184c0-2 2-4 4-4Z" fill="#fff" opacity="0.16" />
        </g>
      )}

      {variant === "coffret" && (
        <g>
          <rect x="62" y="220" width="196" height="150" rx="6" fill={`url(#label-${uid})`} stroke="#cfc8bb" strokeOpacity="0.5" />
          <rect x="72" y="230" width="176" height="130" rx="3" fill="none" stroke="#cfc8bb" strokeOpacity="0.35" />
          <text
            x="160"
            y="272"
            textAnchor="middle"
            fill="#f5f2ed"
            style={{ fontFamily: "var(--font-display), serif", fontSize: "15px", letterSpacing: "3.5px" }}
          >
            AL IBRAHIM
          </text>
          <text
            x="160"
            y="290"
            textAnchor="middle"
            fill="#cfc8bb"
            style={{ fontFamily: "var(--font-sans), sans-serif", fontSize: "6px", letterSpacing: "3px" }}
          >
            AROMA · LUCKNOW
          </text>
          <path d="M118 306h84" stroke="#cfc8bb" strokeOpacity="0.5" />
          <text
            x="160"
            y="326"
            textAnchor="middle"
            fill="#f5f2ed"
            style={{ fontFamily: "var(--font-display), serif", fontSize: "8px", letterSpacing: "2px", opacity: 0.9 }}
          >
            THE GILDED COFFRET
          </text>
          {/* vials peeking from the top */}
          <rect x="98" y="150" width="46" height="90" rx="6" fill={`url(#liquid-${uid})`} opacity="0.9" />
          <rect x="98" y="150" width="46" height="90" rx="6" fill={`url(#glass-${uid})`} stroke="#fff" strokeOpacity="0.25" />
          <rect x="108" y="128" width="26" height="26" rx="3" fill={`url(#cap-${uid})`} />
          <rect x="176" y="150" width="46" height="90" rx="6" fill={`url(#liquid-${uid})`} opacity="0.75" />
          <rect x="176" y="150" width="46" height="90" rx="6" fill={`url(#glass-${uid})`} stroke="#fff" strokeOpacity="0.25" />
          <rect x="186" y="128" width="26" height="26" rx="3" fill={`url(#cap-${uid})`} />
          <rect x="106" y="166" width="10" height="60" rx="5" fill="#fff" opacity="0.16" />
          <rect x="184" y="166" width="10" height="60" rx="5" fill="#fff" opacity="0.14" />
        </g>
      )}

      {variant === "vial" && (
        <g>
          <rect x="124" y="196" width="72" height="180" rx="10" fill={`url(#glass-${uid})`} stroke="#fff" strokeOpacity="0.24" />
          <g clipPath={`url(#body-${uid})`}>
            <rect x="118" y="250" width="84" height="130" fill={`url(#liquid-${uid})`} opacity="0.9" />
            <ellipse cx="160" cy="250" rx="36" ry="6" fill={light} opacity="0.5" />
          </g>
          <rect x="142" y="168" width="36" height="32" rx="4" fill={`url(#cap-${uid})`} />
          <rect x="136" y="122" width="48" height="52" rx="6" fill={`url(#cap-${uid})`} />
          <rect x="142" y="130" width="36" height="36" rx="3" fill="none" stroke="#000" strokeOpacity="0.15" />
          <rect x="132" y="228" width="56" height="104" rx="2" fill={`url(#label-${uid})`} />
          <text
            x="160"
            y="256"
            textAnchor="middle"
            fill={isDarkLabel ? "#f5f2ed" : "#12100d"}
            style={{ fontFamily: "var(--font-display), serif", fontSize: "8.5px", letterSpacing: "1.4px" }}
          >
            AL IBRAHIM
          </text>
          <line x1="142" y1="264" x2="178" y2="264" stroke={isDarkLabel ? "#cfc8bb" : "#12100d"} strokeOpacity="0.4" />
          <text
            x="160"
            y="277"
            textAnchor="middle"
            fill={isDarkLabel ? "#f5f2ed" : "#12100d"}
            style={{ fontFamily: "var(--font-sans), sans-serif", fontSize: "5px", letterSpacing: "1.2px", opacity: 0.85 }}
          >
            DISCOVERY · 2 ML
          </text>
          <rect x="132" y="200" width="10" height="150" rx="5" fill="#fff" opacity="0.14" />
        </g>
      )}
    </svg>
  );
}
