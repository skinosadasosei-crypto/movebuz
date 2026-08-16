"use client";

import { useState } from "react";
import Link from "next/link";
import DataTable from "@/components/dashboard/DataTable";
import type { ArticleMetric, SortField } from "@/lib/dashboard/types";

const sortButtons: { key: SortField; label: string }[] = [
  { key: "pageviews", label: "PV順" },
  { key: "inquiries", label: "CV順" },
  { key: "cvr", label: "CVR順" },
  { key: "avgDuration", label: "滞在時間順" },
  { key: "ctaClickRate", label: "CTAクリック率順" },
];

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

const articleMetrics: ArticleMetric[] = [];

export default function ArticlesPage() {
  const [sortField, setSortField] = useState<SortField>("pageviews");

  const totalPV = articleMetrics.reduce((sum, a) => sum + a.pageviews, 0);
  const totalInquiries = articleMetrics.reduce((sum, a) => sum + a.inquiries, 0);
  const avgCVR = articleMetrics.length > 0
    ? articleMetrics.reduce((sum, a) => sum + a.cvr, 0) / articleMetrics.length
    : 0;
  const avgCTARate = articleMetrics.length > 0
    ? articleMetrics.reduce((sum, a) => sum + a.ctaClickRate, 0) / articleMetrics.length
    : 0;

  const sorted = [...articleMetrics].sort((a, b) => {
    const aVal = a[sortField] as number;
    const bVal = b[sortField] as number;
    return bVal - aVal;
  });

  const kpis = [
    {
      label: "合計PV",
      value: totalPV.toLocaleString(),
      color: "var(--dash-blue)",
      bg: "var(--dash-blue-light)",
    },
    {
      label: "合計問い合わせ",
      value: `${totalInquiries}件`,
      color: "var(--dash-green)",
      bg: "var(--dash-green-light)",
    },
    {
      label: "平均CVR",
      value: `${avgCVR.toFixed(2)}%`,
      color: "var(--dash-purple)",
      bg: "#f5f3ff",
    },
    {
      label: "平均CTA率",
      value: `${avgCTARate.toFixed(1)}%`,
      color: "var(--dash-amber)",
      bg: "var(--dash-amber-light)",
    },
  ];

  const columns = [
    {
      key: "title",
      label: "記事タイトル",
      width: "260px",
      render: (r: ArticleMetric) => (
        <Link
          href={`/dashboard/articles/${r.slug}`}
          className="text-xs font-medium truncate block max-w-[260px] hover:underline"
          style={{ color: "var(--dash-blue)" }}
        >
          {r.title}
        </Link>
      ),
    },
    {
      key: "url",
      label: "URL",
      width: "180px",
      render: (r: ArticleMetric) => (
        <span
          className="text-[11px] truncate block max-w-[180px]"
          style={{ color: "var(--dash-text-muted)" }}
        >
          {r.url}
        </span>
      ),
    },
    {
      key: "publishedAt",
      label: "公開日",
      render: (r: ArticleMetric) => (
        <span className="text-xs" style={{ color: "var(--dash-text-secondary)" }}>
          {r.publishedAt}
        </span>
      ),
    },
    {
      key: "pageviews",
      label: "PV",
      sortable: true,
      align: "right" as const,
      render: (r: ArticleMetric) => r.pageviews.toLocaleString(),
    },
    {
      key: "uniqueUsers",
      label: "UU",
      sortable: true,
      align: "right" as const,
      render: (r: ArticleMetric) => r.uniqueUsers.toLocaleString(),
    },
    {
      key: "avgDuration",
      label: "平均滞在時間",
      sortable: true,
      align: "right" as const,
      render: (r: ArticleMetric) => formatDuration(r.avgDuration),
    },
    {
      key: "scrollRate",
      label: "スクロール率",
      sortable: true,
      align: "right" as const,
      render: (r: ArticleMetric) => `${r.scrollRate}%`,
    },
    {
      key: "readRate",
      label: "読了率",
      sortable: true,
      align: "right" as const,
      render: (r: ArticleMetric) => `${r.readRate}%`,
    },
    {
      key: "exitRate",
      label: "離脱率",
      sortable: true,
      align: "right" as const,
      render: (r: ArticleMetric) => (
        <span
          style={{
            color: r.exitRate >= 40 ? "var(--dash-red)" : "var(--dash-text)",
          }}
        >
          {r.exitRate}%
        </span>
      ),
    },
    {
      key: "ctaClicks",
      label: "CTAクリック数",
      sortable: true,
      align: "right" as const,
      render: (r: ArticleMetric) => r.ctaClicks.toLocaleString(),
    },
    {
      key: "ctaClickRate",
      label: "CTA率",
      sortable: true,
      align: "right" as const,
      render: (r: ArticleMetric) => `${r.ctaClickRate}%`,
    },
    {
      key: "inquiries",
      label: "問い合わせ",
      sortable: true,
      align: "right" as const,
    },
    {
      key: "cvr",
      label: "CVR",
      sortable: true,
      align: "right" as const,
      render: (r: ArticleMetric) => `${r.cvr}%`,
    },
  ];

  return (
    <div className="space-y-6 max-w-[1400px]">
      {/* KPI Summary Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {kpis.map((kpi) => (
          <div
            key={kpi.label}
            className="rounded-xl border p-4"
            style={{
              background: "var(--dash-card)",
              borderColor: "var(--dash-border)",
            }}
          >
            <p
              className="text-xs font-medium mb-1"
              style={{ color: "var(--dash-text-secondary)" }}
            >
              {kpi.label}
            </p>
            <p
              className="text-xl font-bold"
              style={{ color: kpi.color }}
            >
              {kpi.value}
            </p>
          </div>
        ))}
      </div>

      {/* Sort Buttons */}
      <div className="flex items-center gap-2 flex-wrap">
        <span
          className="text-xs font-medium mr-1"
          style={{ color: "var(--dash-text-secondary)" }}
        >
          並び替え:
        </span>
        {sortButtons.map((btn) => (
          <button
            key={btn.key}
            onClick={() => setSortField(btn.key)}
            className="text-xs px-3 py-1.5 rounded-lg border transition-colors"
            style={{
              background:
                sortField === btn.key
                  ? "var(--dash-blue)"
                  : "var(--dash-card)",
              color:
                sortField === btn.key ? "#ffffff" : "var(--dash-text-secondary)",
              borderColor:
                sortField === btn.key
                  ? "var(--dash-blue)"
                  : "var(--dash-border)",
            }}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* Articles Table */}
      <div
        className="rounded-xl border"
        style={{
          background: "var(--dash-card)",
          borderColor: "var(--dash-border)",
        }}
      >
        <div className="p-4 border-b" style={{ borderColor: "var(--dash-border)" }}>
          <h3
            className="text-sm font-semibold"
            style={{ color: "var(--dash-text)" }}
          >
            記事一覧
          </h3>
          <p
            className="text-xs mt-0.5"
            style={{ color: "var(--dash-text-muted)" }}
          >
            全{articleMetrics.length}記事
          </p>
        </div>
        <div className="p-2">
          {sorted.length > 0 ? (
            <DataTable
              columns={columns}
              data={sorted}
              defaultSortKey={sortField}
              defaultSortDir="desc"
            />
          ) : (
            <div className="flex items-center justify-center h-32">
              <p className="text-sm" style={{ color: "var(--dash-text-muted)" }}>
                GA4のデータが蓄積されると記事別の分析が表示されます
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
