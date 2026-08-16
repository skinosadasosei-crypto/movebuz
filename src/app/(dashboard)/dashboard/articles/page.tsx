"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import DataTable from "@/components/dashboard/DataTable";
import type { SortField } from "@/lib/dashboard/types";

interface PageMetric {
  path: string;
  title: string;
  pageviews: number;
  users: number;
  avgDuration: number;
  bounceRate: number;
}

const sortButtons: { key: SortField; label: string }[] = [
  { key: "pageviews", label: "PV順" },
  { key: "avgDuration", label: "滞在時間順" },
];

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

export default function ArticlesPage() {
  const [sortField, setSortField] = useState<SortField>("pageviews");
  const [pages, setPages] = useState<PageMetric[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard/analytics?type=pages&limit=50")
      .then((r) => r.json())
      .then((res) => {
        if (res.data && res.data.length > 0) setPages(res.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const blogPages = pages.filter((p) => p.path.startsWith("/blog/"));
  const allPages = pages;

  const totalPV = allPages.reduce((sum, a) => sum + a.pageviews, 0);
  const totalUU = allPages.reduce((sum, a) => sum + a.users, 0);
  const avgBounce = allPages.length > 0
    ? allPages.reduce((sum, a) => sum + a.bounceRate, 0) / allPages.length
    : 0;
  const avgDuration = allPages.length > 0
    ? allPages.reduce((sum, a) => sum + a.avgDuration, 0) / allPages.length
    : 0;

  const kpis = [
    { label: "合計PV", value: totalPV.toLocaleString(), color: "var(--dash-blue)", bg: "var(--dash-blue-light)" },
    { label: "合計UU", value: totalUU.toLocaleString(), color: "var(--dash-green)", bg: "var(--dash-green-light)" },
    { label: "平均直帰率", value: `${(avgBounce * 100).toFixed(1)}%`, color: "var(--dash-purple)", bg: "#f5f3ff" },
    { label: "平均滞在時間", value: formatDuration(avgDuration), color: "var(--dash-amber)", bg: "var(--dash-amber-light)" },
  ];

  const sorted = [...(sortField === "pageviews" ? allPages : allPages)].sort((a, b) => {
    if (sortField === "avgDuration") return b.avgDuration - a.avgDuration;
    return b.pageviews - a.pageviews;
  });

  const columns = [
    {
      key: "title",
      label: "ページ",
      width: "320px",
      render: (r: PageMetric) => (
        <a
          href={r.path}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-medium truncate block max-w-[320px] hover:underline"
          style={{ color: "var(--dash-blue)" }}
        >
          {r.title || r.path}
        </a>
      ),
    },
    {
      key: "path",
      label: "パス",
      width: "180px",
      render: (r: PageMetric) => (
        <span className="text-[11px] truncate block max-w-[180px]" style={{ color: "var(--dash-text-muted)" }}>
          {r.path}
        </span>
      ),
    },
    {
      key: "pageviews",
      label: "PV",
      sortable: true,
      align: "right" as const,
      render: (r: PageMetric) => r.pageviews.toLocaleString(),
    },
    {
      key: "users",
      label: "UU",
      sortable: true,
      align: "right" as const,
      render: (r: PageMetric) => r.users.toLocaleString(),
    },
    {
      key: "avgDuration",
      label: "平均滞在時間",
      sortable: true,
      align: "right" as const,
      render: (r: PageMetric) => formatDuration(r.avgDuration),
    },
    {
      key: "bounceRate",
      label: "直帰率",
      sortable: true,
      align: "right" as const,
      render: (r: PageMetric) => (
        <span style={{ color: r.bounceRate >= 0.4 ? "var(--dash-red)" : "var(--dash-text)" }}>
          {(r.bounceRate * 100).toFixed(1)}%
        </span>
      ),
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
            style={{ background: "var(--dash-card)", borderColor: "var(--dash-border)" }}
          >
            <p className="text-xs font-medium mb-1" style={{ color: "var(--dash-text-secondary)" }}>
              {kpi.label}
            </p>
            <p className="text-xl font-bold" style={{ color: kpi.color }}>
              {loading ? "—" : kpi.value}
            </p>
          </div>
        ))}
      </div>

      {/* Sort Buttons */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs font-medium mr-1" style={{ color: "var(--dash-text-secondary)" }}>
          並び替え:
        </span>
        {sortButtons.map((btn) => (
          <button
            key={btn.key}
            onClick={() => setSortField(btn.key)}
            className="text-xs px-3 py-1.5 rounded-lg border transition-colors"
            style={{
              background: sortField === btn.key ? "var(--dash-blue)" : "var(--dash-card)",
              color: sortField === btn.key ? "#ffffff" : "var(--dash-text-secondary)",
              borderColor: sortField === btn.key ? "var(--dash-blue)" : "var(--dash-border)",
            }}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* Blog Articles */}
      <div
        className="rounded-xl border"
        style={{ background: "var(--dash-card)", borderColor: "var(--dash-border)" }}
      >
        <div className="p-4 border-b" style={{ borderColor: "var(--dash-border)" }}>
          <h3 className="text-sm font-semibold" style={{ color: "var(--dash-text)" }}>
            記事ページ
          </h3>
          <p className="text-xs mt-0.5" style={{ color: "var(--dash-text-muted)" }}>
            /blog/ 配下のページ — {blogPages.length}件
          </p>
        </div>
        <div className="p-2">
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <p className="text-sm" style={{ color: "var(--dash-text-muted)" }}>読み込み中...</p>
            </div>
          ) : blogPages.length > 0 ? (
            <DataTable
              columns={columns}
              data={blogPages.sort((a, b) => sortField === "avgDuration" ? b.avgDuration - a.avgDuration : b.pageviews - a.pageviews)}
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

      {/* All Pages */}
      <div
        className="rounded-xl border"
        style={{ background: "var(--dash-card)", borderColor: "var(--dash-border)" }}
      >
        <div className="p-4 border-b" style={{ borderColor: "var(--dash-border)" }}>
          <h3 className="text-sm font-semibold" style={{ color: "var(--dash-text)" }}>
            全ページ
          </h3>
          <p className="text-xs mt-0.5" style={{ color: "var(--dash-text-muted)" }}>
            全{sorted.length}ページ
          </p>
        </div>
        <div className="p-2">
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <p className="text-sm" style={{ color: "var(--dash-text-muted)" }}>読み込み中...</p>
            </div>
          ) : sorted.length > 0 ? (
            <DataTable columns={columns} data={sorted} defaultSortKey={sortField} defaultSortDir="desc" />
          ) : (
            <div className="flex items-center justify-center h-32">
              <p className="text-sm" style={{ color: "var(--dash-text-muted)" }}>
                GA4のデータが蓄積されるとページ分析が表示されます
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
