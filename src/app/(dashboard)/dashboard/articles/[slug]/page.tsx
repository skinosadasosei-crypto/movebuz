"use client";

import { use } from "react";
import Link from "next/link";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import ChartCard from "@/components/dashboard/ChartCard";
import DataTable from "@/components/dashboard/DataTable";
import { getArticleDetail } from "@/lib/dashboard/mock-data";
import type { TrafficSource } from "@/lib/dashboard/types";

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

const DEVICE_COLORS = ["#3b82f6", "#8b5cf6", "#f59e0b"];

export default function ArticleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const article = getArticleDetail(slug);

  if (!article) {
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
            className="text-sm font-medium"
            style={{ color: "var(--dash-text-secondary)" }}
          >
            記事が見つかりません
          </p>
        </div>
      </div>
    );
  }

  const kpis = [
    {
      label: "PV",
      value: article.pageviews.toLocaleString(),
      color: "var(--dash-blue)",
    },
    {
      label: "UU",
      value: article.uniqueUsers.toLocaleString(),
      color: "var(--dash-blue)",
    },
    {
      label: "平均滞在時間",
      value: formatDuration(article.avgDuration),
      color: "var(--dash-purple)",
    },
    {
      label: "スクロール率",
      value: `${article.scrollRate}%`,
      color: "var(--dash-purple)",
    },
    {
      label: "読了率",
      value: `${article.readRate}%`,
      color: "var(--dash-green)",
    },
    {
      label: "離脱率",
      value: `${article.exitRate}%`,
      color: article.exitRate >= 40 ? "var(--dash-red)" : "var(--dash-amber)",
    },
    {
      label: "CTAクリック数",
      value: article.ctaClicks.toLocaleString(),
      color: "var(--dash-amber)",
    },
    {
      label: "CTA率",
      value: `${article.ctaClickRate}%`,
      color: "var(--dash-amber)",
    },
    {
      label: "問い合わせ",
      value: `${article.inquiries}件`,
      color: "var(--dash-green)",
    },
    {
      label: "CVR",
      value: `${article.cvr}%`,
      color: "var(--dash-green)",
    },
  ];

  const categoryLabels: Record<string, string> = {
    outsourcing: "外注・代行",
    "channel-growth": "チャンネル成長",
    "video-production": "動画制作",
    "youtube-basics": "YouTube基礎",
    "case-study": "事例紹介",
  };

  const trafficColumns = [
    {
      key: "channel",
      label: "チャネル",
      render: (r: TrafficSource) => (
        <span className="flex items-center gap-2">
          <span
            className="w-2.5 h-2.5 rounded-full shrink-0"
            style={{ background: r.color }}
          />
          <span className="text-xs font-medium">{r.channel}</span>
        </span>
      ),
    },
    {
      key: "users",
      label: "ユーザー",
      sortable: true,
      align: "right" as const,
      render: (r: TrafficSource) => r.users.toLocaleString(),
    },
    {
      key: "sessions",
      label: "セッション",
      sortable: true,
      align: "right" as const,
      render: (r: TrafficSource) => r.sessions.toLocaleString(),
    },
    {
      key: "pageviews",
      label: "PV",
      sortable: true,
      align: "right" as const,
      render: (r: TrafficSource) => r.pageviews.toLocaleString(),
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
      render: (r: TrafficSource) => `${r.cvr}%`,
    },
  ];

  const nextPageColumns = [
    {
      key: "page",
      label: "ページ",
      render: (r: { page: string; count: number; percentage: number }) => (
        <span className="text-xs" style={{ color: "var(--dash-text)" }}>
          {r.page}
        </span>
      ),
    },
    {
      key: "count",
      label: "遷移数",
      sortable: true,
      align: "right" as const,
    },
    {
      key: "percentage",
      label: "割合",
      sortable: true,
      align: "right" as const,
      render: (r: { page: string; count: number; percentage: number }) =>
        `${r.percentage}%`,
    },
  ];

  const exitPageColumns = [
    {
      key: "page",
      label: "ページ",
      render: (r: { page: string; count: number; percentage: number }) => (
        <span className="text-xs" style={{ color: "var(--dash-text)" }}>
          {r.page}
        </span>
      ),
    },
    {
      key: "count",
      label: "離脱数",
      sortable: true,
      align: "right" as const,
    },
    {
      key: "percentage",
      label: "割合",
      sortable: true,
      align: "right" as const,
      render: (r: { page: string; count: number; percentage: number }) =>
        `${r.percentage}%`,
    },
  ];

  return (
    <div className="space-y-6 max-w-[1400px]">
      {/* Back Link */}
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

      {/* Article Header */}
      <div
        className="rounded-xl border p-5"
        style={{
          background: "var(--dash-card)",
          borderColor: "var(--dash-border)",
        }}
      >
        <h2
          className="text-base font-bold mb-2"
          style={{ color: "var(--dash-text)" }}
        >
          {article.title}
        </h2>
        <div className="flex items-center gap-3 flex-wrap">
          <span
            className="text-xs"
            style={{ color: "var(--dash-text-muted)" }}
          >
            {article.url}
          </span>
          <span
            className="text-xs"
            style={{ color: "var(--dash-text-secondary)" }}
          >
            公開日: {article.publishedAt}
          </span>
          <span
            className="text-[11px] font-medium px-2 py-0.5 rounded-full"
            style={{
              background: "var(--dash-blue-light)",
              color: "var(--dash-blue)",
            }}
          >
            {categoryLabels[article.category] || article.category}
          </span>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {kpis.map((kpi) => (
          <div
            key={kpi.label}
            className="rounded-xl border p-3.5"
            style={{
              background: "var(--dash-card)",
              borderColor: "var(--dash-border)",
            }}
          >
            <p
              className="text-[11px] font-medium mb-1"
              style={{ color: "var(--dash-text-secondary)" }}
            >
              {kpi.label}
            </p>
            <p className="text-lg font-bold" style={{ color: kpi.color }}>
              {kpi.value}
            </p>
          </div>
        ))}
      </div>

      {/* Daily Access Chart */}
      <ChartCard title="日別アクセス推移" subtitle="過去30日">
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={article.dailyAccess}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: "#94a3b8" }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#94a3b8" }}
              tickLine={false}
              axisLine={false}
              width={45}
            />
            <Tooltip
              contentStyle={{
                fontSize: 12,
                borderRadius: 8,
                border: "1px solid #e2e8f0",
              }}
            />
            <Line
              type="monotone"
              dataKey="pv"
              name="PV"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="users"
              name="ユーザー"
              stroke="#8b5cf6"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Traffic Sources + Device Breakdown */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <ChartCard
          title="流入元別データ"
          subtitle="チャネル別"
          className="xl:col-span-2"
        >
          <DataTable
            columns={trafficColumns}
            data={article.trafficSources as unknown as Record<string, unknown>[]}
            defaultSortKey="users"
          />
        </ChartCard>

        <ChartCard title="デバイス内訳">
          <div className="space-y-4">
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={article.deviceBreakdown}
                  dataKey="percentage"
                  nameKey="device"
                  cx="50%"
                  cy="50%"
                  outerRadius={70}
                  innerRadius={45}
                  paddingAngle={2}
                >
                  {article.deviceBreakdown.map((_, i) => (
                    <Cell key={i} fill={DEVICE_COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    fontSize: 11,
                    borderRadius: 8,
                    border: "1px solid #e2e8f0",
                  }}
                  formatter={(v) => typeof v === "number" ? `${v}%` : v}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2.5">
              {article.deviceBreakdown.map((d, i) => (
                <div key={d.device}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ background: DEVICE_COLORS[i] }}
                      />
                      <span
                        className="text-xs font-medium"
                        style={{ color: "var(--dash-text)" }}
                      >
                        {d.device}
                      </span>
                    </span>
                    <span
                      className="text-xs font-medium"
                      style={{ color: "var(--dash-text)" }}
                    >
                      {d.percentage}%
                    </span>
                  </div>
                  <div
                    className="w-full h-2 rounded-full overflow-hidden"
                    style={{ background: "#f1f5f9" }}
                  >
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${d.percentage}%`,
                        background: DEVICE_COLORS[i],
                      }}
                    />
                  </div>
                  <p
                    className="text-[11px] mt-0.5"
                    style={{ color: "var(--dash-text-muted)" }}
                  >
                    {d.sessions.toLocaleString()} セッション
                  </p>
                </div>
              ))}
            </div>
          </div>
        </ChartCard>
      </div>

      {/* Next Pages + Exit Pages */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <ChartCard title="遷移先ページ" subtitle="この記事からの遷移先">
          <DataTable
            columns={nextPageColumns}
            data={
              article.nextPages as unknown as Record<string, unknown>[]
            }
            defaultSortKey="count"
          />
        </ChartCard>

        <ChartCard title="離脱ページ" subtitle="離脱が発生するポイント">
          <DataTable
            columns={exitPageColumns}
            data={
              article.exitPages as unknown as Record<string, unknown>[]
            }
            defaultSortKey="count"
          />
        </ChartCard>
      </div>
    </div>
  );
}
