import { notFound } from "next/navigation";
import Link from "next/link";
import CTA from "@/components/CTA";
import { getArticleBySlug, getAllArticles } from "@/lib/articles";
import type { Metadata } from "next";

export async function generateStaticParams() {
  const articles = getAllArticles();
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata(
  props: PageProps<"/blog/[slug]">
): Promise<Metadata> {
  const { slug } = await props.params;
  const article = await getArticleBySlug(slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.description,
    openGraph: {
      title: article.title,
      description: article.description,
      type: "article",
      publishedTime: article.date,
    },
  };
}

export default async function ArticlePage(props: PageProps<"/blog/[slug]">) {
  const { slug } = await props.params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  const categoryLabels: Record<string, string> = {
    "youtube-basics": "YouTube運用の基礎",
    "video-production": "動画制作ノウハウ",
    "channel-growth": "チャンネル成長戦略",
    "case-study": "成功事例",
    "outsourcing": "外注・運用代行",
  };

  const relatedArticles = getAllArticles()
    .filter((a) => a.category === article.category && a.slug !== article.slug)
    .slice(0, 3);

  return (
    <>
      <article className="py-12">
        <div className="max-w-3xl mx-auto px-4">
          {/* Breadcrumb */}
          <nav className="text-sm text-muted mb-6 flex items-center gap-2">
            <Link href="/" className="hover:text-primary">
              ホーム
            </Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-primary">
              記事一覧
            </Link>
            <span>/</span>
            <span className="text-foreground">{article.title}</span>
          </nav>

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs bg-primary-light text-primary px-3 py-1 rounded-full font-medium">
                {categoryLabels[article.category] ?? article.category}
              </span>
              <time className="text-sm text-muted">{article.date}</time>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold leading-tight">
              {article.title}
            </h1>
            {article.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {article.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs text-muted border border-border px-2 py-1 rounded"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Content */}
          <div
            className="article-content"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          {/* In-article CTA */}
          <div className="my-12 bg-primary-light border border-primary/20 rounded-xl p-6 text-center">
            <p className="font-bold text-lg mb-2">
              YouTube運用でお悩みですか？
            </p>
            <p className="text-sm text-muted mb-4">
              企画力×コスパで、あなたのチャンネルを成長させます
            </p>
            <Link
              href="/contact"
              className="inline-block bg-primary text-white font-bold px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors"
            >
              無料で相談してみる →
            </Link>
          </div>
        </div>
      </article>

      {/* Related articles */}
      {relatedArticles.length > 0 && (
        <section className="py-12 bg-card">
          <div className="max-w-5xl mx-auto px-4">
            <h2 className="text-xl font-bold mb-6">関連記事</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedArticles.map((a) => (
                <Link
                  key={a.slug}
                  href={`/blog/${a.slug}`}
                  className="bg-white border border-border rounded-xl p-4 hover:shadow-md transition-shadow"
                >
                  <h3 className="font-bold leading-snug line-clamp-2 hover:text-primary">
                    {a.title}
                  </h3>
                  <time className="text-xs text-muted mt-2 block">
                    {a.date}
                  </time>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <CTA />
    </>
  );
}
