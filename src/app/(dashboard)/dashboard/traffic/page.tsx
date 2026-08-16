"use client";

import { useState } from "react";
import ChartCard from "@/components/dashboard/ChartCard";
import DataTable from "@/components/dashboard/DataTable";
import type {
  TrafficSource,
  UTMData,
  LandingPage,
  SEOKeyword,
} from "@/lib/dashboard/types";

type Tab = "traffic" | "utm" | "seo";

const tabs: { key: Tab; label: string }[] = [
  { key: "traffic", label: "流入元分析" },
  { key: "utm", label: "UTM分析" },
  { key: "seo", label: "SEO分析" },
];

const trafficSources: TrafficSource[] = [];
const utmData: UTMData[] = [];
const landingPages: LandingPage[] = [];
const seoKeywords: SEOKeyword[] = [];

function EmptyState() {
  return (
    <div className="flex items-center justify-center h-32">
      <p className="text-sm" style={{ color: "var(--dash-text-muted)" }}>
        GA4のデータが蓄積されると分析が表示されます
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Tab 1 : 流入元分析                                                  */
/* ------------------------------------------------------------------ */

function TrafficSourceTab() {
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

  const landingColumns = [
    {
      key: "page",
      label: "ページ",
      width: "320px",
      render: (r: LandingPage) => (
        <span className="text-xs font-medium truncate block max-w-[320px]">
          {r.page}
        </span>
      ),
    },
    {
      key: "sessions",
      label: "セッション",
      sortable: true,
      align: "right" as const,
      render: (r: LandingPage) => r.sessions.toLocaleString(),
    },
    {
      key: "exitRate",
      label: "離脱率",
      sortable: true,
      align: "right" as const,
      render: (r: LandingPage) => `${r.exitRate}%`,
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
      render: (r: LandingPage) => `${r.cvr}%`,
    },
  ];

  if (trafficSources.length === 0) return <EmptyState />;

  return (
    <>
      <ChartCard title="流入元データ" subtitle="チャネル別詳細">
        <DataTable
          columns={trafficColumns}
          data={trafficSources as unknown as Record<string, unknown>[]}
          defaultSortKey="users"
        />
      </ChartCard>

      <ChartCard title="ランディングページ分析" subtitle="流入先ページ別">
        {landingPages.length > 0 ? (
          <DataTable
            columns={landingColumns}
            data={landingPages as unknown as Record<string, unknown>[]}
            defaultSortKey="sessions"
          />
        ) : (
          <EmptyState />
        )}
      </ChartCard>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Tab 2 : UTM分析                                                    */
/* ------------------------------------------------------------------ */

function UTMTab() {
  const utmColumns = [
    {
      key: "source",
      label: "source",
      sortable: true,
      render: (r: UTMData) => (
        <span className="text-xs font-medium">{r.source}</span>
      ),
    },
    {
      key: "medium",
      label: "medium",
      sortable: true,
      render: (r: UTMData) => (
        <span className="text-xs" style={{ color: "var(--dash-text-secondary)" }}>
          {r.medium}
        </span>
      ),
    },
    {
      key: "campaign",
      label: "campaign",
      sortable: true,
      render: (r: UTMData) => (
        <span
          className="text-xs font-mono truncate block max-w-[220px]"
          style={{ color: "var(--dash-text-secondary)" }}
        >
          {r.campaign}
        </span>
      ),
    },
    {
      key: "users",
      label: "ユーザー",
      sortable: true,
      align: "right" as const,
      render: (r: UTMData) => r.users.toLocaleString(),
    },
    {
      key: "sessions",
      label: "セッション",
      sortable: true,
      align: "right" as const,
      render: (r: UTMData) => r.sessions.toLocaleString(),
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
      render: (r: UTMData) => `${r.cvr}%`,
    },
  ];

  if (utmData.length === 0) return <EmptyState />;

  return (
    <ChartCard title="UTMパラメータ別データ" subtitle="キャンペーン別詳細">
      <DataTable
        columns={utmColumns}
        data={utmData as unknown as Record<string, unknown>[]}
        defaultSortKey="users"
      />
    </ChartCard>
  );
}

/* ------------------------------------------------------------------ */
/*  Tab 3 : SEO分析                                                    */
/* ------------------------------------------------------------------ */

function SEOTab() {
  if (seoKeywords.length === 0) return <EmptyState />;

  const totalClicks = seoKeywords.reduce((sum, k) => sum + k.clicks, 0);
  const avgCTR = seoKeywords.reduce((sum, k) => sum + k.ctr, 0) / seoKeywords.length;
  const avgPosition = seoKeywords.reduce((sum, k) => sum + k.avgPosition, 0) / seoKeywords.length;
  const totalCV = seoKeywords.reduce((sum, k) => sum + k.inquiries, 0);

  const kpis = [
    { label: "検索流入数", value: totalClicks.toLocaleString() },
    { label: "平均CTR", value: `${avgCTR.toFixed(1)}%` },
    { label: "平均順位", value: avgPosition.toFixed(1) },
    { label: "SEO経由CV数", value: String(totalCV) },
  ];

  const seoColumns = [
    {
      key: "keyword",
      label: "キーワード",
      width: "200px",
      render: (r: SEOKeyword) => (
        <span className="text-xs font-medium truncate block max-w-[200px]">
          {r.keyword}
        </span>
      ),
    },
    {
      key: "impressions",
      label: "表示回数",
      sortable: true,
      align: "right" as const,
      render: (r: SEOKeyword) => r.impressions.toLocaleString(),
    },
    {
      key: "clicks",
      label: "クリック数",
      sortable: true,
      align: "right" as const,
      render: (r: SEOKeyword) => r.clicks.toLocaleString(),
    },
    {
      key: "ctr",
      label: "CTR",
      sortable: true,
      align: "right" as const,
      render: (r: SEOKeyword) => `${r.ctr}%`,
    },
    {
      key: "avgPosition",
      label: "平均順位",
      sortable: true,
      align: "right" as const,
      render: (r: SEOKeyword) => r.avgPosition.toFixed(1),
    },
    {
      key: "landingPage",
      label: "LP",
      width: "200px",
      render: (r: SEOKeyword) => (
        <span
          className="text-xs truncate block max-w-[200px]"
          style={{ color: "var(--dash-text-secondary)" }}
        >
          {r.landingPage}
        </span>
      ),
    },
    {
      key: "inquiries",
      label: "CV数",
      sortable: true,
      align: "right" as const,
    },
    {
      key: "cvr",
      label: "CVR",
      sortable: true,
      align: "right" as const,
      render: (r: SEOKeyword) => `${r.cvr}%`,
    },
  ];

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {kpis.map((kpi) => (
          <div
            key={kpi.label}
            className="rounded-xl p-4 border"
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
              className="text-2xl font-bold tracking-tight"
              style={{ color: "var(--dash-text)" }}
            >
              {kpi.value}
            </p>
          </div>
        ))}
      </div>

      <ChartCard title="SEOキーワード分析" subtitle="検索パフォーマンス">
        <DataTable
          columns={seoColumns}
          data={seoKeywords as unknown as Record<string, unknown>[]}
          defaultSortKey="clicks"
        />
      </ChartCard>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Page Component                                                     */
/* ------------------------------------------------------------------ */

export default function TrafficPage() {
  const [activeTab, setActiveTab] = useState<Tab>("traffic");

  return (
    <div className="space-y-6 max-w-[1400px]">
      <div>
        <h2
          className="text-lg font-bold"
          style={{ color: "var(--dash-text)" }}
        >
          トラフィック分析
        </h2>
        <p
          className="text-sm mt-0.5"
          style={{ color: "var(--dash-text-secondary)" }}
        >
          流入元・UTM・SEOのパフォーマンスを分析
        </p>
      </div>

      <div
        className="inline-flex items-center gap-1 p-1 rounded-full"
        style={{ background: "var(--dash-border)" }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className="px-4 py-1.5 text-sm font-medium rounded-full transition-colors"
            style={{
              background:
                activeTab === tab.key ? "var(--dash-blue)" : "transparent",
              color:
                activeTab === tab.key ? "#ffffff" : "var(--dash-text-secondary)",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "traffic" && <TrafficSourceTab />}
      {activeTab === "utm" && <UTMTab />}
      {activeTab === "seo" && <SEOTab />}
    </div>
  );
}
