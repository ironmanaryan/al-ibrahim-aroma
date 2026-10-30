import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Al Ibrahim Aroma — Attar House, Lucknow";

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background: "#0b0b0b",
          color: "#f5f2ed",
          fontFamily: "serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 54,
              height: 54,
              borderRadius: 999,
              border: "1px solid rgba(245,242,237,0.35)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 30,
              color: "#f5f2ed",
            }}
          >
            A
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 22, letterSpacing: 8, textTransform: "uppercase" }}>Al Ibrahim</div>
            <div style={{ fontSize: 12, letterSpacing: 6, color: "#a8a29a", marginTop: 4 }}>
              AROMA · LUCKNOW · 1974
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ width: 90, height: 4, background: "#8b0d1a", marginBottom: 28 }} />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 82,
              lineHeight: 1.0,
              letterSpacing: -1,
              maxWidth: 900,
            }}
          >
            <span>Attar and parfum,</span>
            <span style={{ fontStyle: "italic" }}>blended by hand</span>
          </div>
          <div style={{ fontSize: 22, color: "#a8a29a", marginTop: 26, letterSpacing: 1 }}>
            Small-batch attars &amp; parfums · hand-blended in Lucknow
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "1px solid rgba(245,242,237,0.22)",
            paddingTop: 22,
            fontSize: 16,
            letterSpacing: 3,
            color: "#f5f2ed",
            textTransform: "uppercase",
          }}
        >
          <span>Oud · Rose · Mitti · Musk</span>
          <span>alibrahim.com</span>
        </div>
      </div>
    ),
    size,
  );
}
