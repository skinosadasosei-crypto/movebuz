import { ImageResponse } from "next/og";
import { getArticleBySlug } from "@/lib/articles";
import { type NextRequest } from "next/server";

export const runtime = "nodejs";

const categoryLabels: Record<string, string> = {
  "youtube-basics": "YouTube運用の基礎",
  "video-production": "動画制作ノウハウ",
  "channel-growth": "チャンネル成長戦略",
  "case-study": "成功事例",
  "outsourcing": "外注・運用代行",
};

export async function GET(
  _req: NextRequest,
  props: { params: Promise<{ slug: string }> }
) {
  const { slug } = await props.params;
  const article = await getArticleBySlug(slug);
  const title = article?.title ?? slug;
  const category = article?.category ?? "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "60px 80px",
          background: "linear-gradient(135deg, #1d4ed8 0%, #0ea5e9 100%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {categoryLabels[category] && (
            <div
              style={{
                display: "flex",
                fontSize: 20,
                background: "rgba(255,255,255,0.2)",
                padding: "8px 20px",
                borderRadius: "20px",
                alignSelf: "flex-start",
              }}
            >
              {categoryLabels[category]}
            </div>
          )}
          <div
            style={{
              fontSize: title.length > 30 ? 40 : 48,
              fontWeight: 700,
              lineHeight: 1.3,
              maxWidth: "90%",
            }}
          >
            {title}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          <div
            style={{ fontSize: 32, fontWeight: 700, letterSpacing: "0.05em" }}
          >
            MOVeBUZ
          </div>
          <div style={{ fontSize: 16, opacity: 0.8 }}>
            YouTube運用・動画マーケティングの専門メディア
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
