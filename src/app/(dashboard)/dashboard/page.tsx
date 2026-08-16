"use client";

import { useState, useEffect } from "react";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from "recharts";
import KPICard from "@/components/dashboard/KPICard";
import ChartCard from "@/components/dashboard/ChartCard";
import DataTable from "@/components/dashboard/DataTable";
import {
  kpiCards as mockKpiCards, dailyMetrics as mockDailyMetrics,
  articleMetrics as mockArticleMetrics, trafficSources as mockTrafficSources,
  insights,
} from "@/lib/dashboard/mock-data";
import type { KPICard as KPICardType, ArticleMetric, TrafficSource, Insight } from "@/lib/dashboard/types";
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

interface GAOverview {
  users: number;
  sessions: number;
  pageviews: number;
  newUsers: number;
  bounceRate: number;
  avgSessionDuration: number;
}

interface GADaily {
  date: string;
  users: number;
  sessions: number;
  pv: number;
}

interface GATraffic {
  channel: string;
  users: number;
  sessions: number;
  pageviews: number;
  color: string;
}

interface GAPage {
  path: string;
  title: string;
  pageviews: number;
  users: number;
  avgDuration: number;
  bounceRate: number;
}

export default function DashboardPage() {
  const [dataMode, setDataMode] = useState<"loading" | "demo" | "collecting" | "live">("loading");
  const [overview, setOverview] = useState<GAOverview | null>(null);
  const [daily, setDaily] = useState<GADaily[] | null>(null);
  const [traffic, setTraffic] = useState<GATraffic[] | null>(null);
  const [pages, setPages] = useState<GAPage[] | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/dashboard/analytics?type=overview").then((r) => r.json()),
      fetch("/api/dashboard/analytics?type=daily").then((r) => r.json()),
      fetch("/api/dashboard/analytics?type=traffic").then((r) => r.json()),
      fetch("/api/dashboard/analytics?type=pages").then((r) => r.json()),
    ]).then(([ov, dl, tr, pg]) => {
      if (!ov.configured) {
        setDataMode("demo");
        return;
      }
      const hasData = ov.data && ov.data.users > 0;
      if (hasData) {
        setDataMode("live");
        setOverview(ov.data);
      } else {
        setDataMode("collecting");
      }
      if (dl.data && dl.data.length > 0) setDaily(dl.data);
      if (tr.data && tr.data.length > 0) setTraffic(tr.data);
      if (pg.data && pg.data.length > 0) setPages(pg.data);
    }).catch(() => setDataMode("demo"));
  }, []);

  const isDemo = dataMode === "demo" || dataMode === "collecting";

  const kpiData: KPICardType[] = !isDemo && overview
    ? [
        { label: "ユーザー数", value: overview.users.toLocaleString(), previousValue: "", change: 0, changeLabel: "過去30日" },
        { label: "セッション数", value: overview.sessions.toLocaleString(), previousValue: "", change: 0, changeLabel: "過去30日" },
        { label: "PV数", value: overview.pageviews.toLocaleString(), previousValue: "", change: 0, changeLabel: "過去30日" },
        { label: "新規ユーザー", value: overview.newUsers.toLocaleString(), previousValue: "", change: 0, changeLabel: "過去30日" },
        { label: "直帰率", value: `${(overview.bounceRate * 100).toFixed(1)}%`, previousValue: "", change: 0, changeLabel: "過去30日" },
        { label: "平均滞在時間", value: `${Math.floor(overview.avgSessionDuration / 60)}:${String(Math.floor(overview.avgSessionDuration % 60)).padStart(2, "0")}`, previousValue: "", change: 0, changeLabel: "過去30日" },
      ]
    : mockKpiCards;

  const dailyData = !isDemo && daily && daily.length > 0
    ? daily.map((d) => ({ date: d.date, users: d.users, sessions: d.sessions, pageviews: d.pv }))
    : mockDailyMetrics;

  const trafficData: TrafficSource[] = !isDemo && traffic && traffic.length > 0
    ? traffic.map((t) => ({
        channel: t.channel,
        users: t.users,
        sessions: t.sessions,
        pageviews: t.pageviews,
        inquiries: 0,
        cvr: 0,
        color: t.color,
      }))
    : mockTrafficSources;

  const pageData = !isDemo && pages && pages.length > 0
    ? pages.map((p): ArticleMetric => ({
        slug: p.path,
        title: p.title || p.path,
        url: p.path,
        publishedAt: "",
        pageviews: p.pageviews,
        uniqueUsers: p.users,
        avgDuration: Math.round(p.avgDuration),
        scrollRate: 0,
        readRate: 0,
        exitRate: Math.round(p.bounceRate * 100),
        ctaClicks: 0,
        ctaClickRate: 0,
        inquiries: 0,
        cvr: 0,
        category: "",
      }))
    : mockArticleMetrics;

  const articleColumns = [
    { key: "title", label: "ページ", width: "280px", render: (r: ArticleMetric) => <span className="text-xs font-medium truncate block max-w-[280px]">{r.title}</span> },
    { key: "pageviews", label: "PV", sortable: true, align: "right" as const, render: (r: ArticleMetric) => r.pageviews.toLocaleString() },
    { key: "uniqueUsers", label: "UU", sortable: true, align: "right" as const, render: (r: ArticleMetric) => r.uniqueUsers.toLocaleString() },
    { key: "avgDuration", label: "平均滞在", sortable: true, align: "right" as const, render: (r: ArticleMetric) => `${Math.floor(r.avgDuration / 60)}:${String(r.avgDuration % 60).padStart(2, "0")}` },
    ...(!isDemo ? [
      { key: "exitRate", label: "直帰率", sortable: true, align: "right" as const, render: (r: ArticleMetric) => `${r.exitRate}%` },
    ] : [
      { key: "inquiries", label: "問い合わせ", sortable: true, align: "right" as const },
      { key: "cvr", label: "CVR", sortable: true, align: "right" as const, render: (r: ArticleMetric) => `${r.cvr}%` },
    ]),
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
    ...(!isDemo ? [] : [
      { key: "inquiries", label: "問い合わせ", sortable: true, align: "right" as const },
      { key: "cvr", label: "CVR", sortable: true, align: "right" as const, render: (r: TrafficSource) => `${r.cvr}%` },
    ]),
  ];

  return (
    <div className="space-y-6 max-w-[1400px]">
      {dataMode === "collecting" && (
        <div className="rounded-lg p-4 border flex items-start gap-3" style={{ background: "var(--dash-blue-light)", borderColor: "#60a5fa" }}>
          <svg className="w-5 h-5 shrink-0 mt-0.5" style={{ color: "var(--dash-blue)" }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
          <div>
            <p className="text-sm font-semibold" style={{ color: "var(--dash-text)" }}>GA4 接続済み — データ収集中</p>
            <p className="text-xs mt-1" style={{ color: "var(--dash-text-secondary)" }}>
              Google Analyticsとの接続は完了しています。データの反映には通常24〜48時間かかります。
              それまではデモデータを表示しています。サイトへのアクセスがあれば、自動的に実データに切り替わります。
            </p>
          </div>
        </div>
      )}

      {/* Insights (mock only - needs manual analysis) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {insights.slice(0, 3).map((ins) => (
          <InsightCard key={ins.id} insight={ins} />
        ))}
      </div>

      {/* KPI Cards */}
      <div className={`grid grid-cols-2 gap-3 ${isDemo ? "md:grid-cols-4 xl:grid-cols-7" : "md:grid-cols-3 xl:grid-cols-6"}`}>
        {kpiData.map((card) => (
          <KPICard key={card.label} card={card} />
        ))}
      </div>

      {/* Access Trend */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <ChartCard title="アクセス推移" subtitle="過去30日" className="xl:col-span-2">
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={dailyData}>
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

        <ChartCard title={isDemo ? "問い合わせ推移" : "日別PV"} subtitle="過去30日">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#94a3b8" }} tickLine={false} axisLine={false} interval={4} />
              <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} tickLine={false} axisLine={false} width={30} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e2e8f0" }} />
              <Bar dataKey={isDemo ? "inquiries" : "pageviews"} name={isDemo ? "問い合わせ" : "PV"} fill="#3b82f6" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Popular Pages + Traffic Sources */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <ChartCard title={isDemo ? "人気記事ランキング" : "ページ別アクセス"} subtitle={isDemo ? "問い合わせ貢献順" : "PV順"} className="xl:col-span-2">
          <DataTable
            columns={articleColumns}
            data={pageData}
            defaultSortKey="pageviews"
          />
        </ChartCard>

        <div className="space-y-4">
          <ChartCard title="流入元">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={trafficData} dataKey="users" nameKey="channel" cx="50%" cy="50%" outerRadius={80} innerRadius={50} paddingAngle={2}>
                  {trafficData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid #e2e8f0" }} formatter={(v) => typeof v === "number" ? v.toLocaleString() : v} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-1.5 mt-2">
              {trafficData.map((s, i) => (
                <div key={s.channel} className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                    <span style={{ color: "var(--dash-text-secondary)" }}>{s.channel}</span>
                  </span>
                  <span className="font-medium" style={{ color: "var(--dash-text)" }}>{s.users.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </ChartCard>

          <ChartCard title="流入元別詳細">
            <DataTable columns={trafficColumns} data={trafficData} defaultSortKey="users" />
          </ChartCard>
        </div>
      </div>

      {/* Insights */}
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
