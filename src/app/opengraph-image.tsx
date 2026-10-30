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
          background:
            "radial-gradient(900px 600px at 78% 12%, #20453c 0%, #183630 45%, #0e211c 100%)",
          color: "#e3dac9",
          fontFamily: "serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 54,
              height: 54,
              borderRadius: 999,
              border: "1px solid #e5c690",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 30,
              color: "#f0d8a8",
            }}
          >
            A
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 22, letterSpacing: 8, textTransform: "uppercase" }}>Al Ibrahim</div>
            <div style={{ fontSize: 12, letterSpacing: 6, color: "#e5c690", marginTop: 4 }}>
              AROMA · LUCKNOW · 1974
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ width: 90, height: 1, background: "#e5c690", marginBottom: 28 }} />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 78,
              lineHeight: 1.02,
              letterSpacing: -1,
              maxWidth: 880,
            }}
          >
            <span>The scent of a memory</span>
            <span style={{ fontStyle: "italic", color: "#f0d8a8" }}>you can wear</span>
          </div>
          <div style={{ fontSize: 22, color: "#b9ab93", marginTop: 26, letterSpacing: 1 }}>
            Small-batch attars &amp; parfums · hand-blended in Lucknow
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "1px solid rgba(200,169,106,0.35)",
            paddingTop: 22,
            fontSize: 16,
            letterSpacing: 3,
            color: "#e5c690",
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
