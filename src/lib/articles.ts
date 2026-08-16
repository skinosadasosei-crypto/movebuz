import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

const articlesDirectory = path.join(process.cwd(), "content/articles");
const draftsDirectory = path.join(process.cwd(), "content/drafts");

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_REPO = process.env.GITHUB_REPO || "skinosadasosei-crypto/movebuz";

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

function parseMarkdown(slug: string, fileContents: string): ArticleMeta {
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
}

async function parseMarkdownWithContent(slug: string, fileContents: string): Promise<Article> {
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

async function githubFetchFile(filePath: string): Promise<string | null> {
  if (!GITHUB_TOKEN) return null;
  try {
    const res = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/contents/${filePath}`,
      {
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          Accept: "application/vnd.github.v3+json",
        },
        next: { revalidate: 60 },
      }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return Buffer.from(data.content, "base64").toString("utf8");
  } catch {
    return null;
  }
}

async function githubListFiles(dir: string): Promise<string[]> {
  if (!GITHUB_TOKEN) return [];
  try {
    const res = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/contents/${dir}`,
      {
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          Accept: "application/vnd.github.v3+json",
        },
        next: { revalidate: 60 },
      }
    );
    if (!res.ok) return [];
    const data = await res.json();
    if (!Array.isArray(data)) return [];
    return data
      .filter((f: { name: string }) => f.name.endsWith(".md"))
      .map((f: { name: string }) => f.name);
  } catch {
    return [];
  }
}

function getLocalArticles(): ArticleMeta[] {
  if (!fs.existsSync(articlesDirectory)) return [];
  return fs.readdirSync(articlesDirectory)
    .filter((name) => name.endsWith(".md"))
    .map((filename) => {
      const slug = filename.replace(/\.md$/, "");
      const filePath = path.join(articlesDirectory, filename);
      const fileContents = fs.readFileSync(filePath, "utf8");
      return parseMarkdown(slug, fileContents);
    });
}

export function getAllArticles(): ArticleMeta[] {
  const articles = getLocalArticles();
  return articles.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export async function getAllArticlesWithGitHub(): Promise<ArticleMeta[]> {
  const ghFiles = await githubListFiles("content/articles");
  if (ghFiles.length === 0) return getAllArticles();

  const ghSlugs = ghFiles.map((f) => f.replace(/\.md$/, ""));
  const articles: ArticleMeta[] = [];
  for (const slug of ghSlugs) {
    const localPath = path.join(articlesDirectory, `${slug}.md`);
    if (fs.existsSync(localPath)) {
      const fileContents = fs.readFileSync(localPath, "utf8");
      articles.push(parseMarkdown(slug, fileContents));
    } else {
      const content = await githubFetchFile(`content/articles/${slug}.md`);
      if (content) articles.push(parseMarkdown(slug, content));
    }
  }

  return articles.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export async function getArticleBySlug(
  slug: string
): Promise<Article | null> {
  const filePath = path.join(articlesDirectory, `${slug}.md`);
  if (fs.existsSync(filePath)) {
    const fileContents = fs.readFileSync(filePath, "utf8");
    return parseMarkdownWithContent(slug, fileContents);
  }

  const ghContent = await githubFetchFile(`content/articles/${slug}.md`);
  if (ghContent) return parseMarkdownWithContent(slug, ghContent);

  return null;
}

export function getArticlesByCategory(category: string): ArticleMeta[] {
  return getAllArticles().filter((a) => a.category === category);
}

export async function getArticlesByCategoryWithGitHub(category: string): Promise<ArticleMeta[]> {
  const all = await getAllArticlesWithGitHub();
  return all.filter((a) => a.category === category);
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
      return parseMarkdown(slug, fileContents);
    });
  return drafts.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
}

export async function getDraftBySlug(slug: string): Promise<Article | null> {
  const ghContent = await githubFetchFile(`content/drafts/${slug}.md`);
  if (ghContent) return parseMarkdownWithContent(slug, ghContent);

  const filePath = path.join(draftsDirectory, `${slug}.md`);
  if (fs.existsSync(filePath)) {
    const fileContents = fs.readFileSync(filePath, "utf8");
    return parseMarkdownWithContent(slug, fileContents);
  }

  return null;
}

export async function getDraftArticlesWithGitHub(): Promise<ArticleMeta[]> {
  const ghFiles = await githubListFiles("content/drafts");
  const ghSlugs = new Set(ghFiles.map((f) => f.replace(/\.md$/, "")));

  const drafts: ArticleMeta[] = [];
  for (const slug of ghSlugs) {
    const localPath = path.join(draftsDirectory, `${slug}.md`);
    if (fs.existsSync(localPath)) {
      const fileContents = fs.readFileSync(localPath, "utf8");
      drafts.push(parseMarkdown(slug, fileContents));
    } else {
      const content = await githubFetchFile(`content/drafts/${slug}.md`);
      if (content) drafts.push(parseMarkdown(slug, content));
    }
  }

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
