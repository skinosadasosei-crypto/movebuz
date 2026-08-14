import ArticleCard from "@/components/ArticleCard";
import CTA from "@/components/CTA";
import { getAllArticles, CATEGORIES } from "@/lib/articles";
import Link from "next/link";

export const metadata = {
  title: "記事一覧",
  description: "YouTube運用・動画マーケティングに関する最新記事の一覧です。",
};

export default async function BlogPage({
  searchParams,
}: PageProps<"/blog">) {
  const { category } = await searchParams;
  const allArticles = getAllArticles();
  const articles = category
    ? allArticles.filter((a) => a.category === category)
    : allArticles;

  const currentCategory = CATEGORIES.find((c) => c.slug === category);

  return (
    <>
      <section className="py-12">
        <div className="max-w-5xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-2">
            {currentCategory ? currentCategory.name : "記事一覧"}
          </h1>
          <p className="text-muted mb-8">
            {articles.length}件の記事があります
          </p>

          {/* Category filter */}
          <div className="flex flex-wrap gap-2 mb-10">
            <Link
              href="/blog"
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                !category
                  ? "bg-primary text-white"
                  : "bg-card border border-border hover:border-primary"
              }`}
            >
              すべて
            </Link>
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/blog?category=${cat.slug}`}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  category === cat.slug
                    ? "bg-primary text-white"
                    : "bg-card border border-border hover:border-primary"
                }`}
              >
                {cat.icon} {cat.name}
              </Link>
            ))}
          </div>

          {articles.length === 0 ? (
            <div className="text-center py-20 text-muted">
              <p className="text-lg mb-2">まだ記事がありません</p>
              <p className="text-sm">近日公開予定です。お楽しみに！</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
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
