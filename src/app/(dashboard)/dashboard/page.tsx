"use client";

import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from "recharts";
import KPICard from "@/components/dashboard/KPICard";
import ChartCard from "@/components/dashboard/ChartCard";
import DataTable from "@/components/dashboard/DataTable";
import {
  kpiCards, dailyMetrics, articleMetrics, trafficSources, insights,
} from "@/lib/dashboard/mock-data";
import type { ArticleMetric, TrafficSource, Insight } from "@/lib/dashboard/types";
import Link from "next/link";

const COLORS = ["#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981", "#6366f1"];

function InsightCard({ insight }: { insight: Insight }) {
  const styles: Record<string, { bg: string; border: string; icon: string }> = {
    warning: { bg: "var(--dash-amber-light)", border: "#fbbf24", icon: "var(--dash-amber)" },
    success: { bg: "var(--dash-green-light)", border: "#34d399", icon: "var(--dash-green)" },
    info: { bg: "var(--dash-blue-light)", border: "#60a5fa", icon: "var(--dash-blue)" },
    danger: { bg: "var(--dash-red-light)", border: "#f87171", icon: "var(--dash-red)" },
  };
  const s = styles[insight.type];
  return (
    <div className="rounded-lg p-3.5 border-l-[3px] flex items-start gap-3" style={{ background: s.bg, borderLeftColor: s.border }}>
      <div className="shrink-0 mt-0.5">
        {insight.type === "warning" && <svg className="w-4 h-4" style={{ color: s.icon }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>}
        {insight.type === "success" && <svg className="w-4 h-4" style={{ color: s.icon }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>}
        {insight.type === "info" && <svg className="w-4 h-4" style={{ color: s.icon }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>}
        {insight.type === "danger" && <svg className="w-4 h-4" style={{ color: s.icon }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: s.icon }}>{insight.category}</span>
          {insight.metric && <span className="text-[10px] font-mono px-1.5 py-0.5 rounded" style={{ background: "white", color: "var(--dash-text-secondary)" }}>{insight.metric}</span>}
        </div>
        <p className="text-xs font-semibold mb-0.5" style={{ color: "var(--dash-text)" }}>{insight.title}</p>
        <p className="text-xs leading-relaxed" style={{ color: "var(--dash-text-secondary)" }}>{insight.description}</p>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const articleColumns = [
    { key: "title", label: "記事タイトル", width: "280px", render: (r: ArticleMetric) => <span className="text-xs font-medium truncate block max-w-[280px]">{r.title}</span> },
    { key: "pageviews", label: "PV", sortable: true, align: "right" as const, render: (r: ArticleMetric) => r.pageviews.toLocaleString() },
    { key: "uniqueUsers", label: "UU", sortable: true, align: "right" as const, render: (r: ArticleMetric) => r.uniqueUsers.toLocaleString() },
    { key: "avgDuration", label: "平均滞在", sortable: true, align: "right" as const, render: (r: ArticleMetric) => `${Math.floor(r.avgDuration / 60)}:${String(r.avgDuration % 60).padStart(2, "0")}` },
    { key: "inquiries", label: "問い合わせ", sortable: true, align: "right" as const },
    { key: "cvr", label: "CVR", sortable: true, align: "right" as const, render: (r: ArticleMetric) => `${r.cvr}%` },
  ];

  const trafficColumns = [
    { key: "channel", label: "チャネル", render: (r: TrafficSource) => (
      <span className="flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: r.color }} />
        <span className="text-xs font-medium">{r.channel}</span>
      </span>
    )},
    { key: "users", label: "ユーザー", sortable: true, align: "right" as const, render: (r: TrafficSource) => r.users.toLocaleString() },
    { key: "sessions", label: "セッション", sortable: true, align: "right" as const, render: (r: TrafficSource) => r.sessions.toLocaleString() },
    { key: "inquiries", label: "問い合わせ", sortable: true, align: "right" as const },
    { key: "cvr", label: "CVR", sortable: true, align: "right" as const, render: (r: TrafficSource) => `${r.cvr}%` },
  ];

  const cvContribArticles = [...articleMetrics].sort((a, b) => b.inquiries - a.inquiries).slice(0, 5);
  const cvContribColumns = [
    { key: "title", label: "記事名", width: "260px", render: (r: ArticleMetric) => <span className="text-xs font-medium truncate block max-w-[260px]">{r.title}</span> },
    { key: "pageviews", label: "PV", sortable: true, align: "right" as const, render: (r: ArticleMetric) => r.pageviews.toLocaleString() },
    { key: "inquiries", label: "問い合わせ", sortable: true, align: "right" as const },
    { key: "cvr", label: "CVR", sortable: true, align: "right" as const, render: (r: ArticleMetric) => `${r.cvr}%` },
    { key: "ctaClickRate", label: "CTA率", sortable: true, align: "right" as const, render: (r: ArticleMetric) => `${r.ctaClickRate}%` },
  ];

  return (
    <div className="space-y-6 max-w-[1400px]">
      {/* Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {insights.slice(0, 3).map((ins) => (
          <InsightCard key={ins.id} insight={ins} />
        ))}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-7 gap-3">
        {kpiCards.map((card) => (
          <KPICard key={card.label} card={card} />
        ))}
      </div>

      {/* Access Trend + Inquiry Trend */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <ChartCard title="アクセス推移" subtitle="過去30日" className="xl:col-span-2">
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={dailyMetrics}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#94a3b8" }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} tickLine={false} axisLine={false} width={45} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e2e8f0" }} />
              <Line type="monotone" dataKey="users" name="ユーザー" stroke="#3b82f6" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="sessions" name="セッション" stroke="#8b5cf6" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="pageviews" name="PV" stroke="#10b981" strokeWidth={2} dot={false} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="問い合わせ推移" subtitle="過去30日">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={dailyMetrics}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#94a3b8" }} tickLine={false} axisLine={false} interval={4} />
              <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} tickLine={false} axisLine={false} width={30} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e2e8f0" }} />
              <Bar dataKey="inquiries" name="問い合わせ" fill="#3b82f6" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Popular Articles + Traffic Sources */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <ChartCard title="人気記事ランキング" subtitle="問い合わせ貢献順" className="xl:col-span-2">
          <DataTable
            columns={articleColumns}
            data={articleMetrics}
            defaultSortKey="pageviews"
          />
        </ChartCard>

        <div className="space-y-4">
          <ChartCard title="流入元">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={trafficSources} dataKey="users" nameKey="channel" cx="50%" cy="50%" outerRadius={80} innerRadius={50} paddingAngle={2}>
                  {trafficSources.map((_, i) => (
                    <Cell key={i} fill={COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid #e2e8f0" }} formatter={(v) => typeof v === "number" ? v.toLocaleString() : v} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-1.5 mt-2">
              {trafficSources.map((s, i) => (
                <div key={s.channel} className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ background: COLORS[i] }} />
                    <span style={{ color: "var(--dash-text-secondary)" }}>{s.channel}</span>
                  </span>
                  <span className="font-medium" style={{ color: "var(--dash-text)" }}>{s.users.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </ChartCard>

          <ChartCard title="流入元別CVR">
            <DataTable columns={trafficColumns} data={trafficSources} defaultSortKey="cvr" />
          </ChartCard>
        </div>
      </div>

      {/* CV Contributing Articles */}
      <ChartCard title="コンバージョン貢献記事" subtitle="問い合わせ件数順 TOP5">
        <DataTable columns={cvContribColumns} data={cvContribArticles} defaultSortKey="inquiries" />
      </ChartCard>

      {/* More Insights */}
      <ChartCard title="改善提案">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {insights.slice(3).map((ins) => (
            <InsightCard key={ins.id} insight={ins} />
          ))}
        </div>
        <div className="mt-3 text-right">
          <Link href="/dashboard/insights" className="text-xs font-medium" style={{ color: "var(--dash-blue)" }}>
            すべての改善提案を見る →
          </Link>
        </div>
      </ChartCard>
    </div>
  );
}
