import { notFound } from "next/navigation";
import Link from "next/link";
import ArticleCard from "@/components/ArticleCard";
import CTA from "@/components/CTA";
import { getArticlesByCategoryWithGitHub, CATEGORIES } from "@/lib/articles";
import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://movebuz.vercel.app";

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ category: c.slug }));
}

export async function generateMetadata(
  props: { params: Promise<{ category: string }> }
): Promise<Metadata> {
  const { category } = await props.params;
  const cat = CATEGORIES.find((c) => c.slug === category);
  if (!cat) return {};
  return {
    title: `${cat.name}の記事一覧`,
    description: `${cat.name}に関するYouTube運用・動画マーケティングの記事一覧です。`,
    alternates: {
      canonical: `${siteUrl}/blog/category/${category}`,
    },
  };
}

export default async function CategoryPage(
  props: { params: Promise<{ category: string }> }
) {
  const { category } = await props.params;
  const cat = CATEGORIES.find((c) => c.slug === category);
  if (!cat) notFound();

  const articles = await getArticlesByCategoryWithGitHub(category);

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "ホーム", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "記事一覧", item: `${siteUrl}/blog` },
      { "@type": "ListItem", position: 3, name: cat.name, item: `${siteUrl}/blog/category/${category}` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <section className="py-12">
        <div className="max-w-5xl mx-auto px-4">
          <nav className="text-xs text-muted mb-8 flex items-center gap-1.5">
            <Link href="/" className="hover:text-primary transition-colors">ホーム</Link>
            <span className="text-muted/50">/</span>
            <Link href="/blog" className="hover:text-primary transition-colors">記事一覧</Link>
            <span className="text-muted/50">/</span>
            <span className="text-foreground">{cat.name}</span>
          </nav>

          <div className="mb-10">
            <p className="text-xs font-semibold text-muted uppercase tracking-widest mb-2">
              Category
            </p>
            <h1 className="text-2xl font-bold tracking-tight">
              {cat.icon} {cat.name}
            </h1>
            <p className="text-muted text-sm mt-1">{articles.length}件の記事</p>
          </div>

          <div className="flex flex-wrap gap-2 mb-10">
            <Link
              href="/blog"
              className="px-4 py-2 rounded-full text-xs font-medium bg-card border border-border hover:border-primary/40 transition-all"
            >
              すべて
            </Link>
            {CATEGORIES.map((c) => (
              <Link
                key={c.slug}
                href={`/blog/category/${c.slug}`}
                className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
                  c.slug === category
                    ? "ig-gradient text-white"
                    : "bg-card border border-border hover:border-primary/40"
                }`}
              >
                {c.icon} {c.name}
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
