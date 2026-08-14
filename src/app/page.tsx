import Link from "next/link";
import ArticleCard from "@/components/ArticleCard";
import CTA from "@/components/CTA";
import { getAllArticles, CATEGORIES } from "@/lib/articles";

export default function Home() {
  const articles = getAllArticles();
  const latestArticles = articles.slice(0, 6);

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary to-primary-dark text-white py-20 md:py-28">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <p className="text-indigo-200 font-medium mb-4 text-sm tracking-wide">
            YouTube運用・動画マーケティングの専門メディア
          </p>
          <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-6">
            企業の動画活用を、
            <br />
            もっとカンタンに。
          </h1>
          <p className="text-lg text-indigo-200 mb-8 max-w-2xl mx-auto leading-relaxed">
            「YouTubeを始めたいけど何から手をつければ…」そんな悩みに、
            企画力とコスパで応える運用代行のプロがお答えします。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/blog"
              className="bg-white text-primary font-bold px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors text-lg"
            >
              記事を読む
            </Link>
            <Link
              href="/contact"
              className="bg-accent text-foreground font-bold px-8 py-4 rounded-lg hover:bg-yellow-400 transition-colors text-lg"
            >
              無料相談する
            </Link>
          </div>
        </div>
      </section>

      {/* Strengths */}
      <section className="py-16 bg-card">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-10">
            選ばれる3つの理由
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: "💡",
                title: "バズる企画力",
                desc: "視聴者のニーズを分析し、再生数が伸びる企画をご提案。トレンドを押さえた構成で、チャンネルの成長を加速させます。",
              },
              {
                icon: "💰",
                title: "コスパの良さ",
                desc: "月30万円〜で企画・撮影・編集・分析まで丸ごと対応。社内にチームを持つより圧倒的にリーズナブルです。",
              },
              {
                icon: "📊",
                title: "データドリブン運用",
                desc: "再生数・CTR・視聴維持率などのデータを毎月レポート。数字に基づいた改善提案で、着実に成果を出します。",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-white rounded-xl p-6 border border-border"
              >
                <div className="text-3xl mb-4">{item.icon}</div>
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-muted leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-10">
            カテゴリーから探す
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/blog?category=${cat.slug}`}
                className="bg-white border border-border rounded-xl p-4 text-center hover:border-primary hover:shadow-md transition-all"
              >
                <div className="text-2xl mb-2">{cat.icon}</div>
                <div className="text-sm font-medium">{cat.name}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Articles */}
      {latestArticles.length > 0 && (
        <section className="py-16 bg-card">
          <div className="max-w-5xl mx-auto px-4">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-2xl font-bold">最新の記事</h2>
              <Link
                href="/blog"
                className="text-primary font-medium text-sm hover:underline"
              >
                すべて見る →
              </Link>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {latestArticles.map((article) => (
                <ArticleCard key={article.slug} article={article} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <CTA />
    </>
  );
}
