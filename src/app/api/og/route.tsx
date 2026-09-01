import { ImageResponse } from "next/og";

export const runtime = "nodejs";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "60px 80px",
          background: "linear-gradient(135deg, #1d4ed8 0%, #0ea5e9 100%)",
          color: "white",
          fontFamily: "sans-serif",
          gap: "24px",
        }}
      >
        <div style={{ fontSize: 72, fontWeight: 700, letterSpacing: "0.05em" }}>
          MOVeBUZ
        </div>
        <div style={{ fontSize: 28, opacity: 0.9 }}>
          YouTube運用・動画マーケティングの専門メディア
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
