import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

const signika = localFont({
  src: [{ path: "./fonts/signika-latin.woff2", weight: "300 700", style: "normal" }],
  variable: "--font-signika",
  display: "swap",
  fallback: ["Signika", "system-ui", "sans-serif"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://al-ibrahim-aroma.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Al Ibrahim Aroma — Attar House, Lucknow · since 1974",
    template: "%s · Al Ibrahim Aroma",
  },
  description:
    "Small-batch attars and parfums from Lucknow. Aged oud, Taif rose, and the scent of the first rain on baked clay. Hand-blended since 1974.",
  keywords: [
    "attar",
    "oud perfume",
    "Indian attar",
    "Lucknow perfume",
    "Al Ibrahim Aroma",
    "Taif rose attar",
    "petrichor perfume",
    "luxury fragrance India",
  ],
  authors: [{ name: "Al Ibrahim Aroma" }],
  creator: "Al Ibrahim Aroma",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteUrl,
    siteName: "Al Ibrahim Aroma",
    title: "Al Ibrahim Aroma — Attar House, Lucknow",
    description:
      "Aged oud, Taif rose, and the smell of the first rain on baked clay. Small-batch attars and parfums, hand-blended in Lucknow since 1974.",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Al Ibrahim Aroma" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Al Ibrahim Aroma — Attar House, Lucknow",
    description:
      "Small-batch attars and parfums, hand-blended in Lucknow since 1974.",
    images: ["/opengraph-image"],
  },
  robots: { index: true, follow: true },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/icon.svg" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#0b0b0b",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={signika.variable}>
      <body>
        <div className="grain" aria-hidden="true" />
        <div className="ambient" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
