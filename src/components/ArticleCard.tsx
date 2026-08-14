import Link from "next/link";
import type { ArticleMeta } from "@/lib/articles";

const categoryConfig: Record<string, { label: string; emoji: string; color: string }> = {
  "youtube-basics": { label: "YouTube基礎", emoji: "📺", color: "bg-blue-50 text-blue-600" },
  "video-production": { label: "制作ノウハウ", emoji: "🎬", color: "bg-purple-50 text-purple-600" },
  "channel-growth": { label: "成長戦略", emoji: "📈", color: "bg-green-50 text-green-600" },
  "case-study": { label: "成功事例", emoji: "✅", color: "bg-amber-50 text-amber-600" },
  "outsourcing": { label: "運用代行", emoji: "🤝", color: "bg-pink-50 text-pink-600" },
};

export default function ArticleCard({ article }: { article: ArticleMeta }) {
  const cat = categoryConfig[article.category] ?? { label: article.category, emoji: "📄", color: "bg-gray-50 text-gray-600" };

  return (
    <Link href={`/blog/${article.slug}`} className="group block">
      <article className="bg-card rounded-2xl overflow-hidden border border-border hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5">
        <div className="aspect-[16/9] ig-gradient flex items-center justify-center">
          <span className="text-5xl opacity-90">{cat.emoji}</span>
        </div>
        <div className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-medium ${cat.color}`}>
              {cat.label}
            </span>
            <time className="text-[11px] text-muted">{article.date}</time>
          </div>
          <h3 className="font-semibold text-[15px] leading-snug group-hover:text-primary transition-colors line-clamp-2">
            {article.title}
          </h3>
          <p className="text-xs text-muted mt-2 line-clamp-2 leading-relaxed">
            {article.description}
          </p>
        </div>
      </article>
    </Link>
  );
}
