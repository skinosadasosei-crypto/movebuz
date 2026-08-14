#!/usr/bin/env node

/**
 * 下書き記事を公開するスクリプト
 *
 * 使い方:
 *   node scripts/publish-draft.mjs [ファイル名]
 *   node scripts/publish-draft.mjs              # drafts/ 内の最新ファイルを公開
 *   node scripts/publish-draft.mjs article.md   # 指定ファイルを公開
 */

import fs from "fs";
import path from "path";

const DRAFTS_DIR = path.join(process.cwd(), "content/drafts");
const ARTICLES_DIR = path.join(process.cwd(), "content/articles");

function main() {
  const args = process.argv.slice(2);

  if (!fs.existsSync(DRAFTS_DIR)) {
    console.error("エラー: content/drafts/ ディレクトリがありません");
    process.exit(1);
  }

  let filename;

  if (args[0]) {
    filename = args[0];
  } else {
    const files = fs.readdirSync(DRAFTS_DIR).filter((f) => f.endsWith(".md"));
    if (files.length === 0) {
      console.error("エラー: 公開待ちの下書きがありません");
      process.exit(1);
    }

    const sorted = files
      .map((f) => ({
        name: f,
        mtime: fs.statSync(path.join(DRAFTS_DIR, f)).mtime,
      }))
      .sort((a, b) => b.mtime - a.mtime);

    filename = sorted[0].name;
  }

  const draftPath = path.join(DRAFTS_DIR, filename);

  if (!fs.existsSync(draftPath)) {
    console.error(`エラー: 下書きが見つかりません: ${filename}`);
    process.exit(1);
  }

  if (!fs.existsSync(ARTICLES_DIR)) {
    fs.mkdirSync(ARTICLES_DIR, { recursive: true });
  }

  let destFilename = filename;
  let destPath = path.join(ARTICLES_DIR, destFilename);
  let counter = 1;
  while (fs.existsSync(destPath)) {
    const base = filename.replace(/\.md$/, "");
    destFilename = `${base}-${counter}.md`;
    destPath = path.join(ARTICLES_DIR, destFilename);
    counter++;
  }

  const content = fs.readFileSync(draftPath, "utf8");
  fs.writeFileSync(destPath, content, "utf8");
  fs.unlinkSync(draftPath);

  console.log(`\n✅ 記事を公開しました!`);
  console.log(`   content/articles/${destFilename}`);
  console.log(`\n💡 Vercelにデプロイ済みの場合、git push で自動的にサイトに反映されます`);
  console.log(`   git add content/articles/${destFilename}`);
  console.log(`   git commit -m "記事公開: ${destFilename}"`);
  console.log(`   git push\n`);
}

main();
