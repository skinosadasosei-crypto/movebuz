import { NextResponse } from "next/server";
import { verifySession } from "@/lib/dashboard/auth";
import { getDraftArticles } from "@/lib/articles";

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_REPO = process.env.GITHUB_REPO || "skinosadasosei-crypto/movebuz";

async function githubApi(path: string, options?: RequestInit) {
  const res = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      Accept: "application/vnd.github.v3+json",
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });
  return res;
}

export async function GET() {
  const authed = await verifySession();
  if (!authed) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json({ drafts: getDraftArticles() });
}

export async function POST(req: Request) {
  const authed = await verifySession();
  if (!authed) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const slug = body.slug;
  if (typeof slug !== "string" || !slug) {
    return NextResponse.json({ error: "slug is required" }, { status: 400 });
  }

  if (!GITHUB_TOKEN) {
    return NextResponse.json(
      { error: "GITHUB_TOKEN が設定されていません。Vercel環境変数に追加してください。" },
      { status: 500 }
    );
  }

  try {
    const srcPath = `content/drafts/${slug}.md`;
    const getRes = await githubApi(srcPath);
    if (!getRes.ok) {
      return NextResponse.json({ error: "下書きが見つかりません" }, { status: 404 });
    }
    const srcData = await getRes.json();
    const content = Buffer.from(srcData.content, "base64").toString("utf8");

    const today = new Date().toISOString().slice(0, 10);
    const updatedContent = content.replace(/^date:\s*".*"/m, `date: "${today}"`);

    const destPath = `content/articles/${slug}.md`;
    const destCheckRes = await githubApi(destPath);
    if (destCheckRes.ok) {
      return NextResponse.json({ error: "同じスラッグの記事が既に存在します" }, { status: 400 });
    }

    const createRes = await githubApi(destPath, {
      method: "PUT",
      body: JSON.stringify({
        message: `記事公開: ${slug}`,
        content: Buffer.from(updatedContent).toString("base64"),
      }),
    });
    if (!createRes.ok) {
      const err = await createRes.json();
      return NextResponse.json({ error: `記事の作成に失敗: ${err.message}` }, { status: 500 });
    }

    const deleteRes = await githubApi(srcPath, {
      method: "DELETE",
      body: JSON.stringify({
        message: `下書き削除: ${slug}`,
        sha: srcData.sha,
      }),
    });
    if (!deleteRes.ok) {
      const err = await deleteRes.json();
      return NextResponse.json({ error: `下書きの削除に失敗: ${err.message}` }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: `公開処理でエラーが発生しました: ${String(e)}` }, { status: 500 });
  }
}
