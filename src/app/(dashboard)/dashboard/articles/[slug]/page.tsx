"use client";

import { use } from "react";
import Link from "next/link";

export default function ArticleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);

  return (
    <div className="space-y-6 max-w-[1400px]">
      <Link
        href="/dashboard/articles"
        className="inline-flex items-center gap-1 text-xs font-medium hover:underline"
        style={{ color: "var(--dash-blue)" }}
      >
        <svg
          className="w-3.5 h-3.5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>
        記事一覧に戻る
      </Link>
      <div
        className="rounded-xl border p-12 text-center"
        style={{
          background: "var(--dash-card)",
          borderColor: "var(--dash-border)",
        }}
      >
        <p
          className="text-sm font-medium mb-1"
          style={{ color: "var(--dash-text)" }}
        >
          {slug}
        </p>
        <p
          className="text-xs"
          style={{ color: "var(--dash-text-secondary)" }}
        >
          GA4のデータが蓄積されると、記事別の詳細分析が表示されます
        </p>
      </div>
    </div>
  );
}
