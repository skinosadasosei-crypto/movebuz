#!/usr/bin/env node

/**
 * 記事自動生成スクリプト
 *
 * 使い方:
 *   ANTHROPIC_API_KEY=sk-xxx node scripts/generate-article.mjs "YouTube サムネイル 作り方"
 *   ANTHROPIC_API_KEY=sk-xxx node scripts/generate-article.mjs --batch keywords.txt
 *
 * keywords.txt の形式（1行1キーワード）:
 *   YouTube サムネイル 作り方
 *   YouTube 収益化 条件
 */

import fs from "fs";
import path from "path";

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
if (!ANTHROPIC_API_KEY) {
  console.error("エラー: ANTHROPIC_API_KEY 環境変数を設定してください");
  console.error("例: ANTHROPIC_API_KEY=sk-xxx node scripts/generate-article.mjs \"キーワード\"");
  process.exit(1);
}

const CATEGORIES = [
  { slug: "youtube-basics", name: "YouTube運用の基礎", keywords: ["始め方", "基礎", "初心者", "開設", "設定"] },
  { slug: "video-production", name: "動画制作ノウハウ", keywords: ["制作", "撮影", "編集", "企画", "ネタ", "サムネイル", "台本"] },
  { slug: "channel-growth", name: "チャンネル成長戦略", keywords: ["再生数", "登録者", "伸ばす", "アルゴリズム", "SEO", "分析", "成長"] },
  { slug: "case-study", name: "成功事例", keywords: ["事例", "成功", "インタビュー", "実績"] },
  { slug: "outsourcing", name: "外注・運用代行", keywords: ["外注", "代行", "費用", "相場", "依頼", "委託"] },
];

function detectCategory(keyword) {
  const lower = keyword.toLowerCase();
  for (const cat of CATEGORIES) {
    if (cat.keywords.some((k) => lower.includes(k))) {
      return cat.slug;
    }
  }
  return "youtube-basics";
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

function buildPrompt(keyword) {
  const category = detectCategory(keyword);
  const categoryName = CATEGORIES.find((c) => c.slug === category)?.name ?? "";
  const today = new Date().toISOString().slice(0, 10);

  return `あなたはSEOに強いWebライターです。以下の条件で、企業のYouTube運用に関するブログ記事を作成してください。

## 条件
- ターゲットキーワード: 「${keyword}」
- カテゴリ: ${categoryName}
- メディア名: 動画のミカタ（YouTube運用代行サービスのオウンドメディア）
- トーン: カジュアルで親しみやすい。専門用語は噛み砕いて説明する
- 強み: 企画力とコスパの良さ（月30〜50万円で企画〜分析まで丸ごと対応）
- 文字数: 3000〜5000文字
- 読者: 中小企業の経営者、マーケティング担当者、個人事業主・士業

## 記事構成のルール
1. 冒頭: 読者の悩みや疑問を引用形式で提示し、共感を示す
2. 本文: H2見出しを4〜6個、H3見出しも適宜使い、読みやすく構成する
3. 具体的な数字やデータを入れて信頼性を高める
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
date: "${today}"
category: "${category}"
tags: ["関連タグ1", "関連タグ2", "関連タグ3", "関連タグ4"]
thumbnail: ""
---

(ここに記事本文をMarkdownで記述)`;
}

async function generateArticle(keyword) {
  console.log(`\n📝 キーワード: "${keyword}"`);
  console.log("   記事を生成中...");

  const prompt = buildPrompt(keyword);
  const content = await callClaude(prompt);

  const slug = generateSlug(keyword);
  const outputDir = path.join(process.cwd(), "content/articles");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  let filename = `${slug}.md`;
  let filepath = path.join(outputDir, filename);
  let counter = 1;
  while (fs.existsSync(filepath)) {
    filename = `${slug}-${counter}.md`;
    filepath = path.join(outputDir, filename);
    counter++;
  }

  fs.writeFileSync(filepath, content, "utf8");
  console.log(`   ✅ 保存完了: content/articles/${filename}`);
  return filename;
}

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log(`
📺 動画のミカタ - 記事自動生成ツール
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

使い方:
  node scripts/generate-article.mjs "キーワード"
  node scripts/generate-article.mjs --batch keywords.txt

例:
  node scripts/generate-article.mjs "YouTube サムネイル 作り方"
  node scripts/generate-article.mjs "YouTube 収益化 条件" "YouTube アナリティクス 使い方"

バッチモード (keywords.txt):
  YouTube サムネイル 作り方
  YouTube 収益化 条件
  YouTube ショート 活用法

※ 環境変数 ANTHROPIC_API_KEY が必要です
`);
    process.exit(0);
  }

  let keywords = [];

  if (args[0] === "--batch" && args[1]) {
    const batchFile = path.resolve(args[1]);
    if (!fs.existsSync(batchFile)) {
      console.error(`エラー: ファイルが見つかりません: ${batchFile}`);
      process.exit(1);
    }
    keywords = fs
      .readFileSync(batchFile, "utf8")
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l && !l.startsWith("#"));
  } else {
    keywords = args;
  }

  console.log(`\n🚀 ${keywords.length}件の記事を生成します\n`);

  const results = [];
  for (const keyword of keywords) {
    try {
      const filename = await generateArticle(keyword);
      results.push({ keyword, filename, success: true });
    } catch (err) {
      console.error(`   ❌ エラー: ${err.message}`);
      results.push({ keyword, error: err.message, success: false });
    }
  }

  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("📊 生成結果:");
  for (const r of results) {
    if (r.success) {
      console.log(`   ✅ ${r.keyword} → ${r.filename}`);
    } else {
      console.log(`   ❌ ${r.keyword} → ${r.error}`);
    }
  }
  console.log(`\n合計: ${results.filter((r) => r.success).length}/${results.length} 成功`);
}

main().catch((err) => {
  console.error("致命的エラー:", err);
  process.exit(1);
});
