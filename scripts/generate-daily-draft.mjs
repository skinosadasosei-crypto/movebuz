#!/usr/bin/env node

/**
 * 毎日の記事下書き生成スクリプト
 *
 * 前日に実行して下書きを生成 → 確認後に publish-draft.mjs で公開
 *
 * 使い方:
 *   ANTHROPIC_API_KEY=sk-xxx node scripts/generate-daily-draft.mjs
 *   ANTHROPIC_API_KEY=sk-xxx node scripts/generate-daily-draft.mjs "指定キーワード"
 */

import fs from "fs";
import path from "path";

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
if (!ANTHROPIC_API_KEY) {
  console.error("エラー: ANTHROPIC_API_KEY 環境変数を設定してください");
  process.exit(1);
}

const CATEGORIES = [
  { slug: "youtube-basics", name: "YouTube運用の基礎", keywords: ["始め方", "基礎", "初心者", "開設", "設定", "Studio", "アカウント", "概要欄", "エンドカード", "チャンネルアート"] },
  { slug: "video-production", name: "動画制作ノウハウ", keywords: ["制作", "撮影", "編集", "企画", "ネタ", "サムネイル", "台本", "テロップ", "BGM", "ショート", "照明", "構成"] },
  { slug: "channel-growth", name: "チャンネル成長戦略", keywords: ["再生数", "登録者", "伸ばす", "アルゴリズム", "SEO", "分析", "成長", "CTR", "維持率", "おすすめ", "アナリティクス"] },
  { slug: "case-study", name: "成功事例", keywords: ["事例", "成功", "インタビュー", "実績", "活用事例", "集客"] },
  { slug: "outsourcing", name: "外注・運用代行", keywords: ["外注", "代行", "費用", "相場", "依頼", "委託", "コンサル", "ROI", "KPI", "内製"] },
];

const KEYWORDS_FILE = path.join(process.cwd(), "scripts/daily-keywords.txt");
const DRAFTS_DIR = path.join(process.cwd(), "content/drafts");
const ARTICLES_DIR = path.join(process.cwd(), "content/articles");

function detectCategory(keyword) {
  const lower = keyword.toLowerCase();
  for (const cat of CATEGORIES) {
    if (cat.keywords.some((k) => lower.includes(k))) {
      return cat.slug;
    }
  }
  return "youtube-basics";
}

function getRecentCategories() {
  if (!fs.existsSync(ARTICLES_DIR)) return [];

  const files = fs.readdirSync(ARTICLES_DIR).filter((f) => f.endsWith(".md"));
  const articles = files
    .map((f) => {
      const content = fs.readFileSync(path.join(ARTICLES_DIR, f), "utf8");
      const dateMatch = content.match(/date:\s*"([^"]+)"/);
      const catMatch = content.match(/category:\s*"([^"]+)"/);
      return {
        date: dateMatch?.[1] || "",
        category: catMatch?.[1] || "",
      };
    })
    .sort((a, b) => b.date.localeCompare(a.date));

  return articles.slice(0, 5).map((a) => a.category);
}

function pickBalancedKeyword() {
  if (!fs.existsSync(KEYWORDS_FILE)) {
    console.error("エラー: daily-keywords.txt が見つかりません");
    process.exit(1);
  }

  const lines = fs.readFileSync(KEYWORDS_FILE, "utf8").split("\n");
  const available = lines
    .map((l, i) => ({ line: l.trim(), index: i }))
    .filter(({ line }) => line && !line.startsWith("#"));

  if (available.length === 0) {
    console.error("エラー: 使用可能なキーワードがありません。daily-keywords.txt にキーワードを追加してください");
    process.exit(1);
  }

  const recentCategories = getRecentCategories();
  const categoryCounts = {};
  for (const cat of recentCategories) {
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
  }

  const scored = available.map(({ line, index }) => {
    const category = detectCategory(line);
    const recentCount = categoryCounts[category] || 0;
    return { keyword: line, index, category, score: -recentCount };
  });

  scored.sort((a, b) => b.score - a.score);

  const leastUsedScore = scored[0].score;
  const candidates = scored.filter((s) => s.score === leastUsedScore);
  const picked = candidates[Math.floor(Math.random() * candidates.length)];

  // Mark as used
  lines[picked.index] = `# [済] ${lines[picked.index]}`;
  fs.writeFileSync(KEYWORDS_FILE, lines.join("\n"), "utf8");

  return picked.keyword;
}

function generateSlug(keyword) {
  const words = keyword
    .replace(/[　\s]+/g, " ")
    .trim()
    .split(" ")
    .map((w) => w.toLowerCase().replace(/[^a-z0-9぀-鿿]/g, ""));

  const romanized = words.map((w) => {
    if (/^[a-z0-9]+$/.test(w)) return w;
    return w.slice(0, 8);
  });

  const slug = romanized.join("-").replace(/-+/g, "-").slice(0, 60);
  return slug || `article-${Date.now()}`;
}

async function callClaude(prompt) {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4096,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`API Error ${response.status}: ${error}`);
  }

  const data = await response.json();
  return data.content[0].text;
}

function buildPrompt(keyword, publishDate) {
  const category = detectCategory(keyword);
  const categoryName = CATEGORIES.find((c) => c.slug === category)?.name ?? "";

  return `あなたはSEOに強いWebライターです。以下の条件で、企業のYouTube運用に関するブログ記事を作成してください。

## 条件
- ターゲットキーワード: 「${keyword}」
- カテゴリ: ${categoryName}
- メディア名: MOVeBUZ（YouTube運用代行サービスのオウンドメディア）
- トーン: カジュアルで親しみやすい。専門用語は噛み砕いて説明する
- 強み: 企画力とコスパの良さ（企画〜分析まで丸ごと対応）
- 注意: 具体的な料金・価格は記事中に記載しないこと
- 文字数: 3000〜5000文字
- 読者: 中小企業の経営者、マーケティング担当者、個人事業主・士業

## コンプライアンスルール（必ず守ること）
- 法律に抵触する可能性のある表現は絶対に避ける（景品表示法、薬機法、著作権法など）
- 「絶対に成果が出る」「必ず再生数が伸びる」「100%成功する」など断定的な表現は禁止
- 「〜が期待できます」「〜につながる可能性があります」「〜する傾向があります」のような表現を使う
- 他社・他者への誹謗中傷、批判的な比較は一切行わない
- 根拠のない数値やデータを捏造しない。出典が明確でない数値は「一般的に〜と言われています」のように表現する
- 誇大広告にあたる表現を避ける

## 記事構成のルール
1. 冒頭: 読者の悩みや疑問を引用形式で提示し、共感を示す
2. 本文: H2見出しを4〜6個、H3見出しも適宜使い、読みやすく構成する
3. 具体的な数字やデータを入れて信頼性を高める（ただし出典が不明な場合は断定しない）
4. 箇条書きや番号付きリストを活用して読みやすくする
5. 記事の最後に「まとめ」セクションを設ける
6. 記事中に自然な形で「YouTube運用代行」「プロに任せる」という選択肢に触れる（露骨な宣伝にしない）
7. blockquote（引用）を1〜2箇所入れてメリハリをつける
8. 重要なキーワードには **太字** を使用する

## 出力形式
以下のMarkdown形式で出力してください。フロントマター以外の余計な説明は不要です。

---
title: "【】SEOに強いタイトル（28〜45文字）"
description: "記事の要約（100〜160文字）"
date: "${publishDate}"
category: "${category}"
tags: ["関連タグ1", "関連タグ2", "関連タグ3", "関連タグ4"]
thumbnail: ""
---

(ここに記事本文をMarkdownで記述)`;
}

async function main() {
  const args = process.argv.slice(2);

  // Determine keyword
  let keyword;
  if (args.length > 0 && args[0] !== "--date") {
    keyword = args[0];
  } else {
    keyword = pickBalancedKeyword();
  }

  // Determine publish date (tomorrow by default)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const publishDate = tomorrow.toISOString().slice(0, 10);

  console.log(`\n📺 MOVeBUZ - 毎日の記事下書き生成`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`📝 キーワード: "${keyword}"`);
  console.log(`📅 公開予定日: ${publishDate}`);
  console.log(`📂 カテゴリ: ${CATEGORIES.find((c) => c.slug === detectCategory(keyword))?.name}`);
  console.log(`   生成中...\n`);

  const prompt = buildPrompt(keyword, publishDate);
  const content = await callClaude(prompt);

  // Save to drafts directory
  if (!fs.existsSync(DRAFTS_DIR)) {
    fs.mkdirSync(DRAFTS_DIR, { recursive: true });
  }

  const slug = generateSlug(keyword);
  const filename = `${slug}.md`;
  const filepath = path.join(DRAFTS_DIR, filename);

  fs.writeFileSync(filepath, content, "utf8");

  console.log(`✅ 下書きを保存しました: content/drafts/${filename}`);
  console.log(`\n📋 次のステップ:`);
  console.log(`   1. content/drafts/${filename} の内容を確認してください`);
  console.log(`   2. 問題なければ以下のコマンドで公開:`);
  console.log(`      node scripts/publish-draft.mjs ${filename}`);
  console.log(`   3. 修正が必要な場合はファイルを直接編集してから公開してください\n`);
}

main().catch((err) => {
  console.error("致命的エラー:", err);
  process.exit(1);
});
