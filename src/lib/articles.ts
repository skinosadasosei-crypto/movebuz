import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

const articlesDirectory = path.join(process.cwd(), "content/articles");

export type FAQItem = {
  question: string;
  answer: string;
};

export type Article = {
  slug: string;
  title: string;
  description: string;
  date: string;
  category: string;
  tags: string[];
  thumbnail: string;
  faq: FAQItem[];
  content: string;
};

export type ArticleMeta = Omit<Article, "content">;

export function getAllArticles(): ArticleMeta[] {
  if (!fs.existsSync(articlesDirectory)) return [];
  const filenames = fs.readdirSync(articlesDirectory);
  const articles = filenames
    .filter((name) => name.endsWith(".md"))
    .map((filename) => {
      const slug = filename.replace(/\.md$/, "");
      const filePath = path.join(articlesDirectory, filename);
      const fileContents = fs.readFileSync(filePath, "utf8");
      const { data } = matter(fileContents);
      return {
        slug,
        title: data.title ?? "",
        description: data.description ?? "",
        date: data.date ?? "",
        category: data.category ?? "",
        tags: data.tags ?? [],
        thumbnail: data.thumbnail ?? "/images/default-thumb.svg",
        faq: data.faq ?? [],
      };
    });
  return articles.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export async function getArticleBySlug(
  slug: string
): Promise<Article | null> {
  const filePath = path.join(articlesDirectory, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;

  const fileContents = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(fileContents);
  const processedContent = await remark().use(html).process(content);

  return {
    slug,
    title: data.title ?? "",
    description: data.description ?? "",
    date: data.date ?? "",
    category: data.category ?? "",
    tags: data.tags ?? [],
    thumbnail: data.thumbnail ?? "/images/default-thumb.svg",
    faq: data.faq ?? [],
    content: processedContent.toString(),
  };
}

export function getArticlesByCategory(category: string): ArticleMeta[] {
  return getAllArticles().filter((a) => a.category === category);
}

export const CATEGORIES = [
  { slug: "youtube-basics", name: "YouTube運用の基礎", icon: "📺" },
  { slug: "video-production", name: "動画制作ノウハウ", icon: "🎬" },
  { slug: "channel-growth", name: "チャンネル成長戦略", icon: "📈" },
  { slug: "case-study", name: "成功事例", icon: "✅" },
  { slug: "outsourcing", name: "外注・運用代行", icon: "🤝" },
] as const;
