import Link from "next/link";
import CTA from "@/components/CTA";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://movebuz.vercel.app";

const ogImage = `${siteUrl}/api/og`;

export const metadata = {
  title: "サービス紹介",
  description:
    "YouTube制作・運用代行サービスの詳細。企画から撮影・編集・分析まで、チャンネル運用を丸ごとサポートします。",
  alternates: {
    canonical: `${siteUrl}/about`,
  },
  openGraph: {
    title: "サービス紹介 | MOVeBUZ",
    description: "YouTube制作・運用代行サービスの詳細。企画から撮影・編集・分析まで、チャンネル運用を丸ごとサポートします。",
    url: `${siteUrl}/about`,
    images: [{ url: ogImage, width: 1200, height: 630, type: "image/png" }],
  },
  twitter: {
    card: "summary_large_image",
    images: [ogImage],
  },
};

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="py-20 md:py-28 relative overflow-hidden">
        <div className="absolute inset-0 ig-gradient opacity-5" />
        <div className="max-w-3xl mx-auto px-4 text-center relative">
          <div className="inline-block ig-gradient text-white text-xs font-semibold px-4 py-1.5 rounded-full mb-6">
            Service
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">
            YouTube運用代行
          </h1>
          <p className="text-muted text-base leading-relaxed">
            企画力 × コスパで、御社のチャンネルを成長させます
          </p>
        </div>
      </section>

      {/* Problem */}
      <section className="py-16 bg-card">
        <div className="max-w-3xl mx-auto px-4">
          <p className="text-center text-xs font-semibold text-muted uppercase tracking-widest mb-3">Problem</p>
          <h2 className="text-2xl font-bold text-center mb-10 tracking-tight">
            こんなお悩みありませんか？
          </h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              "YouTubeを始めたいけど、何から手をつけていいかわからない",
              "動画を投稿しているが、再生数が伸びない",
              "社内に動画制作のリソースがない",
              "外注したいが、費用が高すぎて手が出ない",
              "チャンネル登録者を効率的に増やしたい",
              "動画マーケティングのROIを改善したい",
            ].map((problem) => (
              <div
                key={problem}
                className="flex items-start gap-3 bg-background rounded-xl p-4"
              >
                <span className="text-primary text-sm shrink-0 mt-0.5">●</span>
                <p className="text-sm leading-relaxed">{problem}</p>
              </div>
            ))}
          </div>
          <p className="text-center mt-8">
            <span className="ig-gradient-text font-bold text-lg">MOVeBUZが解決します</span>
          </p>
        </div>
      </section>

      {/* Service flow */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4">
          <p className="text-center text-xs font-semibold text-muted uppercase tracking-widest mb-3">Flow</p>
          <h2 className="text-2xl font-bold text-center mb-10 tracking-tight">
            サービスの流れ
          </h2>
          <div className="space-y-4">
            {[
              {
                step: "01",
                title: "チャンネル戦略設計",
                desc: "ターゲット分析・競合調査を行い、勝てるチャンネルコンセプトを設計します。",
              },
              {
                step: "02",
                title: "企画・構成立案",
                desc: "検索ニーズとトレンドを分析し、再生数が伸びる動画テーマと構成を毎月ご提案します。",
              },
              {
                step: "03",
                title: "撮影・編集",
                desc: "プロの映像チームが撮影・編集を担当。テロップ・BGM・サムネイルまでトータルで制作します。",
              },
              {
                step: "04",
                title: "公開・SEO最適化",
                desc: "タイトル・説明文・タグを最適化し、YouTube検索で上位表示を狙います。",
              },
              {
                step: "05",
                title: "分析・改善レポート",
                desc: "毎月の再生数・CTR・視聴維持率などを分析し、次月の改善施策をご提案します。",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="flex gap-5 bg-card border border-border rounded-2xl p-5 hover:shadow-md transition-shadow"
              >
                <div className="w-10 h-10 rounded-full ig-gradient flex items-center justify-center text-white text-sm font-bold shrink-0">
                  {item.step}
                </div>
                <div>
                  <h3 className="font-semibold text-sm mb-1">{item.title}</h3>
                  <p className="text-xs text-muted leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 bg-card">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <p className="text-xs font-semibold text-muted uppercase tracking-widest mb-3">Pricing</p>
          <h2 className="text-2xl font-bold mb-4 tracking-tight">料金について</h2>
          <p className="text-muted text-sm leading-relaxed mb-8">
            お客様のチャンネル規模や目標に合わせて、
            <br className="hidden md:block" />
            最適なプランをご提案いたします。
          </p>
          <Link
            href="/contact"
            className="inline-block ig-gradient text-white font-semibold px-8 py-3.5 rounded-full hover:opacity-90 transition-opacity text-sm"
          >
            料金について相談する
          </Link>
        </div>
      </section>

      <CTA />
    </>
  );
}
