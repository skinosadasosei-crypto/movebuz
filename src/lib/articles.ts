import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

const articlesDirectory = path.join(process.cwd(), "content/articles");
const draftsDirectory = path.join(process.cwd(), "content/drafts");

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

export function getDraftArticles(): ArticleMeta[] {
  if (!fs.existsSync(draftsDirectory)) return [];
  const filenames = fs.readdirSync(draftsDirectory);
  const drafts = filenames
    .filter((name) => name.endsWith(".md"))
    .map((filename) => {
      const slug = filename.replace(/\.md$/, "");
      const filePath = path.join(draftsDirectory, filename);
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
  return drafts.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
}

export function publishDraft(slug: string): { success: boolean; error?: string } {
  const srcPath = path.join(draftsDirectory, `${slug}.md`);
  if (!fs.existsSync(srcPath)) return { success: false, error: "下書きが見つかりません" };

  const destPath = path.join(articlesDirectory, `${slug}.md`);
  if (fs.existsSync(destPath)) return { success: false, error: "同じスラッグの記事が既に存在します" };

  let fileContents = fs.readFileSync(srcPath, "utf8");
  const today = new Date().toISOString().slice(0, 10);
  fileContents = fileContents.replace(/^date:\s*".*"/m, `date: "${today}"`);

  if (!fs.existsSync(articlesDirectory)) fs.mkdirSync(articlesDirectory, { recursive: true });
  fs.writeFileSync(destPath, fileContents, "utf8");
  fs.unlinkSync(srcPath);
  return { success: true };
}

export const CATEGORIES = [
  { slug: "youtube-basics", name: "YouTube運用の基礎", icon: "📺" },
  { slug: "video-production", name: "動画制作ノウハウ", icon: "🎬" },
  { slug: "channel-growth", name: "チャンネル成長戦略", icon: "📈" },
  { slug: "case-study", name: "成功事例", icon: "✅" },
  { slug: "outsourcing", name: "外注・運用代行", icon: "🤝" },
] as const;
