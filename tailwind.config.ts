import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  corePlugins: { preflight: false },
  theme: {
    extend: {
      colors: {
        ink: "#0B0B0B",
        "ink-2": "#0F0F0F",
        "ink-3": "#121212",
        crimson: "#8B0D1A",
        "crimson-2": "#A3111F",
        "crimson-3": "#5D0810",
        "crimson-soft": "#E0A3A3",
        ivory: "#F5F2ED",
        "ivory-dim": "#E6E1D8",
      },
      fontFamily: {
        display: ["var(--font-syne)", "Syne", "system-ui", "sans-serif"],
        sans: ["var(--font-jakarta)", "Plus Jakarta Sans", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        luxe: "0.28em",
        wide2: "0.18em",
      },
      maxWidth: {
        "8xl": "88rem",
      },
      transitionTimingFunction: {
        luxe: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      keyframes: {
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        slowZoom: {
          from: { transform: "scale(1)" },
          to: { transform: "scale(1.09)" },
        },
        pulseGold: {
          "0%": { boxShadow: "0 0 0 0 rgba(139,13,26,0.45)" },
          "70%": { boxShadow: "0 0 0 20px rgba(139,13,26,0)" },
          "100%": { boxShadow: "0 0 0 0 rgba(139,13,26,0)" },
        },
        fadeUp: {
          from: { opacity: "0", transform: "translateY(18px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        marquee: "marquee 42s linear infinite",
        shimmer: "shimmer 2.4s ease-in-out infinite",
        "slow-zoom": "slowZoom 24s ease-out infinite alternate",
        "pulse-gold": "pulseGold 2.8s ease-out infinite",
        "fade-up": "fadeUp 0.8s cubic-bezier(0.22, 1, 0.36, 1) both",
      },
    },
  },
  plugins: [],
};

export default config;
