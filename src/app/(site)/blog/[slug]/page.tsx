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
          <nav className="text-xs text-muted mb-8 flex items-center gap-1.5">
            <Link href="/" className="hover:text-primary transition-colors">
              ホーム
            </Link>
            <span className="text-muted/50">/</span>
            <Link href="/blog" className="hover:text-primary transition-colors">
              記事一覧
            </Link>
            <span className="text-muted/50">/</span>
            <span className="text-foreground truncate max-w-[200px]">{article.title}</span>
          </nav>

          {/* Header */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs ig-gradient text-white px-3 py-1 rounded-full font-medium">
                {categoryLabels[article.category] ?? article.category}
              </span>
              <time className="text-xs text-muted">{article.date}</time>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold leading-tight tracking-tight">
              {article.title}
            </h1>
            {article.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-4">
                {article.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] text-muted bg-card border border-border px-2.5 py-1 rounded-full"
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
          <div className="my-12 ig-gradient rounded-2xl p-8 text-center text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10" />
            <div className="relative">
              <p className="font-bold text-lg mb-2">
                YouTube運用でお悩みですか？
              </p>
              <p className="text-sm text-white/80 mb-5">
                企画力×コスパで、あなたのチャンネルを成長させます
              </p>
              <Link
                href="/contact"
                className="inline-block bg-white text-foreground font-semibold px-6 py-2.5 rounded-full hover:bg-white/90 transition-colors text-sm"
              >
                無料で相談してみる →
              </Link>
            </div>
          </div>
        </div>
      </article>

      {/* Related articles */}
      {relatedArticles.length > 0 && (
        <section className="py-12 bg-card">
          <div className="max-w-5xl mx-auto px-4">
            <p className="text-xs font-semibold text-muted uppercase tracking-widest mb-1">Related</p>
            <h2 className="text-xl font-bold mb-6 tracking-tight">関連記事</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {relatedArticles.map((a) => (
                <Link
                  key={a.slug}
                  href={`/blog/${a.slug}`}
                  className="bg-background border border-border rounded-2xl p-5 hover:shadow-md hover:-translate-y-0.5 transition-all"
                >
                  <h3 className="font-semibold text-sm leading-snug line-clamp-2 mb-2">
                    {a.title}
                  </h3>
                  <time className="text-[11px] text-muted block">
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
