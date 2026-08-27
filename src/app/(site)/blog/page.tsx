import ArticleCard from "@/components/ArticleCard";
import CTA from "@/components/CTA";
import { getAllArticlesWithGitHub, CATEGORIES } from "@/lib/articles";
import Link from "next/link";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://movebuz.vercel.app";

const ogImage = `${siteUrl}/api/og`;

export const metadata = {
  title: "記事一覧 | YouTube運用・動画マーケティング",
  description: "企業のYouTube運用に役立つ記事一覧。チャンネル開設・動画制作・アルゴリズム攻略・外注費用の相場まで、動画マーケティングの実践ノウハウをまとめています。",
  alternates: {
    canonical: `${siteUrl}/blog`,
  },
  openGraph: {
    title: "記事一覧 | MOVeBUZ",
    description: "企業のYouTube運用に役立つ記事一覧。チャンネル開設・動画制作・アルゴリズム攻略・外注費用の相場まで、動画マーケティングの実践ノウハウをまとめています。",
    url: `${siteUrl}/blog`,
    images: [{ url: ogImage, width: 1200, height: 630, type: "image/png" }],
  },
  twitter: {
    card: "summary_large_image",
    images: [ogImage],
  },
};

export default async function BlogPage({
  searchParams,
}: PageProps<"/blog">) {
  const { category } = await searchParams;
  const allArticles = await getAllArticlesWithGitHub();
  const articles = category
    ? allArticles.filter((a) => a.category === category)
    : allArticles;

  const currentCategory = CATEGORIES.find((c) => c.slug === category);

  return (
    <>
      <section className="py-12">
        <div className="max-w-5xl mx-auto px-4">
          <div className="mb-10">
            <p className="text-xs font-semibold text-muted uppercase tracking-widest mb-2">Blog</p>
            <h1 className="text-2xl font-bold tracking-tight">
              {currentCategory ? currentCategory.name : "記事一覧"}
            </h1>
            <p className="text-muted text-sm mt-1">
              {articles.length}件の記事
            </p>
          </div>

          {/* Category filter */}
          <div className="flex flex-wrap gap-2 mb-10">
            <Link
              href="/blog"
              className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
                !category
                  ? "ig-gradient text-white"
                  : "bg-card border border-border hover:border-primary/40"
              }`}
            >
              すべて
            </Link>
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/blog/category/${cat.slug}`}
                className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
                  category === cat.slug
                    ? "ig-gradient text-white"
                    : "bg-card border border-border hover:border-primary/40"
                }`}
              >
                {cat.icon} {cat.name}
              </Link>
            ))}
          </div>

          {articles.length === 0 ? (
            <div className="text-center py-20 text-muted">
              <p className="text-base mb-2">まだ記事がありません</p>
              <p className="text-sm">近日公開予定です。</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-5">
              {articles.map((article) => (
                <ArticleCard key={article.slug} article={article} />
              ))}
            </div>
          )}
        </div>
      </section>

      <CTA />
    </>
  );
}
