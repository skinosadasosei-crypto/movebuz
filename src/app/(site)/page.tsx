import type { Metadata } from "next";
import Link from "next/link";
import ArticleCard from "@/components/ArticleCard";
import CTA from "@/components/CTA";
import { getAllArticlesWithGitHub, CATEGORIES } from "@/lib/articles";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://movebuz.vercel.app";

const ogImage = `${siteUrl}/api/og`;

export const metadata: Metadata = {
  title: { absolute: "MOVeBUZ | YouTube運用・動画マーケティングの専門メディア" },
  description: "企業のYouTube運用・動画マーケティングを支援する専門メディア。チャンネル戦略から撮影・編集・分析まで、プロのノウハウを発信します。",
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    title: "MOVeBUZ | YouTube運用・動画マーケティングの専門メディア",
    description: "企業のYouTube運用・動画マーケティングを支援する専門メディア。",
    url: siteUrl,
    images: [{ url: ogImage, width: 1200, height: 630, type: "image/png" }],
  },
  twitter: {
    card: "summary_large_image",
    images: [ogImage],
  },
};

export default async function Home() {
  const articles = await getAllArticlesWithGitHub();
  const latestArticles = articles.slice(0, 6);

  return (
    <>
      {/* Hero */}
      <section className="py-20 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 ig-gradient opacity-5" />
        <div className="max-w-4xl mx-auto px-4 text-center relative">
          <div className="inline-block ig-gradient text-white text-xs font-semibold px-4 py-1.5 rounded-full mb-6">
            YouTube運用・動画マーケティングの専門メディア
          </div>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-5 tracking-tight">
            企業の動画活用を、
            <br />
            <span className="ig-gradient-text">もっとカンタンに。</span>
          </h1>
          <p className="text-muted text-base md:text-lg mb-10 max-w-xl mx-auto leading-relaxed">
            「YouTubeを始めたいけど何から手をつければ…」
            <br className="hidden md:block" />
            そんな悩みに、企画力とコスパで応えるプロがお答えします。
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/blog"
              className="border border-border text-foreground font-semibold px-7 py-3.5 rounded-full hover:bg-card transition-colors text-sm"
            >
              記事を読む
            </Link>
            <Link
              href="/contact"
              className="ig-gradient text-white font-semibold px-7 py-3.5 rounded-full hover:opacity-90 transition-opacity text-sm"
            >
              無料で相談する
            </Link>
          </div>
        </div>
      </section>

      {/* Strengths */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <p className="text-center text-xs font-semibold text-muted uppercase tracking-widest mb-3">Why MOVeBUZ?</p>
          <h2 className="text-2xl font-bold text-center mb-10 tracking-tight">
            選ばれる<span className="ig-gradient-text">3つの理由</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                icon: "💡",
                title: "バズる企画力",
                desc: "視聴者のニーズを分析し、再生数が伸びる企画をご提案。トレンドを押さえた構成でチャンネルの成長を加速させます。",
              },
              {
                icon: "💰",
                title: "コスパの良さ",
                desc: "企画・撮影・編集・分析まで丸ごと対応。社内にチームを持つより圧倒的にリーズナブルです。",
              },
              {
                icon: "📊",
                title: "データドリブン運用",
                desc: "再生数・CTR・視聴維持率などのデータを毎月レポート。数字に基づいた改善提案で着実に成果を出します。",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-card rounded-2xl p-6 border border-border hover:shadow-md transition-shadow"
              >
                <div className="w-10 h-10 rounded-full ig-gradient flex items-center justify-center text-lg mb-4">
                  {item.icon}
                </div>
                <h3 className="font-semibold text-sm mb-2">{item.title}</h3>
                <p className="text-xs text-muted leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-card">
        <div className="max-w-4xl mx-auto px-4">
          <p className="text-center text-xs font-semibold text-muted uppercase tracking-widest mb-3">Categories</p>
          <h2 className="text-2xl font-bold text-center mb-10 tracking-tight">
            カテゴリーから探す
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/blog?category=${cat.slug}`}
                className="flex items-center gap-2 bg-background border border-border rounded-full px-5 py-2.5 hover:border-primary/40 hover:shadow-sm transition-all text-sm"
              >
                <span>{cat.icon}</span>
                <span className="font-medium text-xs">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Articles */}
      {latestArticles.length > 0 && (
        <section className="py-16">
          <div className="max-w-5xl mx-auto px-4">
            <div className="flex items-center justify-between mb-10">
              <div>
                <p className="text-xs font-semibold text-muted uppercase tracking-widest mb-1">Latest</p>
                <h2 className="text-2xl font-bold tracking-tight">最新の記事</h2>
              </div>
              <Link
                href="/blog"
                className="text-primary font-semibold text-xs hover:opacity-70 transition-opacity"
              >
                すべて見る →
              </Link>
            </div>
            <div className="grid md:grid-cols-3 gap-5">
              {latestArticles.map((article) => (
                <ArticleCard key={article.slug} article={article} />
              ))}
            </div>
          </div>
        </section>
      )}

      <CTA />
    </>
  );
}
