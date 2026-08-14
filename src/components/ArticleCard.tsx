import Link from "next/link";
import type { ArticleMeta } from "@/lib/articles";

export default function ArticleCard({ article }: { article: ArticleMeta }) {
  const categoryLabels: Record<string, string> = {
    "youtube-basics": "YouTube運用の基礎",
    "video-production": "動画制作ノウハウ",
    "channel-growth": "チャンネル成長戦略",
    "case-study": "成功事例",
    "outsourcing": "外注・運用代行",
  };

  return (
    <Link href={`/blog/${article.slug}`} className="group block">
      <article className="bg-white border border-border rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
        <div className="aspect-[16/9] bg-primary-light flex items-center justify-center text-4xl">
          {article.category === "youtube-basics" && "📺"}
          {article.category === "video-production" && "🎬"}
          {article.category === "channel-growth" && "📈"}
          {article.category === "case-study" && "✅"}
          {article.category === "outsourcing" && "🤝"}
        </div>
        <div className="p-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs bg-primary-light text-primary px-2.5 py-1 rounded-full font-medium">
              {categoryLabels[article.category] ?? article.category}
            </span>
            <time className="text-xs text-muted">{article.date}</time>
          </div>
          <h3 className="font-bold text-lg leading-snug group-hover:text-primary transition-colors line-clamp-2">
            {article.title}
          </h3>
          <p className="text-sm text-muted mt-2 line-clamp-2">
            {article.description}
          </p>
        </div>
      </article>
    </Link>
  );
}
