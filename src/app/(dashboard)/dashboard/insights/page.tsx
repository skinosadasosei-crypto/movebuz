"use client";

import { useState, useEffect } from "react";

interface OverviewData {
  users: number;
  sessions: number;
  pageviews: number;
  newUsers: number;
  bounceRate: number;
  avgSessionDuration: number;
}

interface PageRow {
  path: string;
  title: string;
  pageviews: number;
  users: number;
  avgDuration: number;
  bounceRate: number;
}

interface TrafficRow {
  channel: string;
  users: number;
  sessions: number;
  pageviews: number;
  color: string;
}

interface DeviceRow {
  device: string;
  sessions: number;
  percentage: number;
}

interface Insight {
  type: "warning" | "success" | "info" | "danger";
  title: string;
  description: string;
  metric?: string;
}

const typeStyles: Record<string, { bg: string; color: string; icon: string }> = {
  success: { bg: "var(--dash-green-light)", color: "var(--dash-green)", icon: "check" },
  info: { bg: "var(--dash-blue-light)", color: "var(--dash-blue)", icon: "info" },
  warning: { bg: "var(--dash-amber-light)", color: "var(--dash-amber)", icon: "alert" },
  danger: { bg: "#fef2f2", color: "var(--dash-red)", icon: "alert" },
};

const icons: Record<string, React.ReactNode> = {
  check: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  ),
  info: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  ),
  alert: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
};

function generateInsights(
  overview: OverviewData | null,
  pages: PageRow[],
  traffic: TrafficRow[],
  devices: DeviceRow[],
): Insight[] {
  const insights: Insight[] = [];
  if (!overview) return insights;

  if (overview.bounceRate >= 0.6) {
    insights.push({
      type: "danger",
      title: "サイト全体の直帰率が高い",
      description: `直帰率 ${(overview.bounceRate * 100).toFixed(1)}% — 60%を超えています。ランディングページの改善やCTAの追加を検討してください。`,
      metric: `${(overview.bounceRate * 100).toFixed(1)}%`,
    });
  } else if (overview.bounceRate <= 0.35) {
    insights.push({
      type: "success",
      title: "直帰率が良好",
      description: `直帰率 ${(overview.bounceRate * 100).toFixed(1)}% — ユーザーが複数ページを閲覧しています。`,
      metric: `${(overview.bounceRate * 100).toFixed(1)}%`,
    });
  }

  if (overview.avgSessionDuration < 60) {
    insights.push({
      type: "warning",
      title: "平均滞在時間が短い",
      description: `平均滞在 ${Math.round(overview.avgSessionDuration)}秒 — コンテンツの質や読みやすさを見直しましょう。`,
      metric: `${Math.round(overview.avgSessionDuration)}秒`,
    });
  } else if (overview.avgSessionDuration >= 180) {
    insights.push({
      type: "success",
      title: "平均滞在時間が良好",
      description: `平均滞在 ${Math.floor(overview.avgSessionDuration / 60)}分${Math.round(overview.avgSessionDuration % 60)}秒 — ユーザーがコンテンツをしっかり読んでいます。`,
    });
  }

  if (overview.users > 0) {
    const newUserRate = overview.newUsers / overview.users;
    if (newUserRate >= 0.85) {
      insights.push({
        type: "info",
        title: "新規ユーザー比率が高い",
        description: `新規率 ${(newUserRate * 100).toFixed(0)}% — 新規流入が多い一方、リピーター施策（メルマガ、SNSフォロー等）も検討を。`,
        metric: `${(newUserRate * 100).toFixed(0)}%`,
      });
    }
  }

  const highBounceBlog = pages
    .filter((p) => p.path.startsWith("/blog/") && p.pageviews >= 3 && p.bounceRate >= 0.7)
    .sort((a, b) => b.bounceRate - a.bounceRate);
  if (highBounceBlog.length > 0) {
    const worst = highBounceBlog[0];
    insights.push({
      type: "warning",
      title: `記事「${worst.title || worst.path}」の離脱率が高い`,
      description: `直帰率 ${(worst.bounceRate * 100).toFixed(0)}% — 記事内にCTAや関連記事リンクを追加して回遊性を改善しましょう。`,
      metric: `${(worst.bounceRate * 100).toFixed(0)}%`,
    });
  }

  const longDwellBlog = pages
    .filter((p) => p.path.startsWith("/blog/") && p.avgDuration >= 180)
    .sort((a, b) => b.avgDuration - a.avgDuration);
  if (longDwellBlog.length > 0) {
    insights.push({
      type: "success",
      title: `${longDwellBlog.length}本の記事が高い滞在時間を記録`,
      description: `「${longDwellBlog[0].title || longDwellBlog[0].path}」など — 読者に刺さるコンテンツです。類似テーマの記事を増やしましょう。`,
    });
  }

  const organicSearch = traffic.find((t) => t.channel === "Organic Search");
  const totalTrafficUsers = traffic.reduce((s, t) => s + t.users, 0);
  if (organicSearch && totalTrafficUsers > 0) {
    const organicPct = (organicSearch.users / totalTrafficUsers) * 100;
    if (organicPct < 20) {
      insights.push({
        type: "info",
        title: "オーガニック検索流入が少ない",
        description: `検索流入は全体の${organicPct.toFixed(0)}% — SEO対策（キーワード最適化、内部リンク構築）を強化しましょう。`,
        metric: `${organicPct.toFixed(0)}%`,
      });
    } else if (organicPct >= 50) {
      insights.push({
        type: "success",
        title: "オーガニック検索からの流入が安定",
        description: `検索流入は全体の${organicPct.toFixed(0)}% — SEO効果が出ています。`,
        metric: `${organicPct.toFixed(0)}%`,
      });
    }
  }

  const mobileDevice = devices.find((d) => d.device === "mobile");
  if (mobileDevice && mobileDevice.percentage >= 60) {
    insights.push({
      type: "info",
      title: "モバイルユーザーが多数",
      description: `モバイル比率 ${mobileDevice.percentage}% — モバイルファーストのUI/UX最適化を優先しましょう。`,
      metric: `${mobileDevice.percentage}%`,
    });
  }

  const contactPage = pages.find((p) => p.path.includes("/contact") || p.path.includes("/inquiry"));
  if (contactPage && contactPage.bounceRate >= 0.5) {
    insights.push({
      type: "danger",
      title: "お問い合わせページの離脱率が高い",
      description: `直帰率 ${(contactPage.bounceRate * 100).toFixed(0)}% — フォームの項目数削減や信頼性要素の追加を検討してください。`,
      metric: `${(contactPage.bounceRate * 100).toFixed(0)}%`,
    });
  }

  if (insights.length === 0) {
    insights.push({
      type: "info",
      title: "データ蓄積中",
      description: "GA4のデータが増えると、より具体的な改善提案が表示されます。",
    });
  }

  return insights;
}

export default function InsightsPage() {
  const [overview, setOverview] = useState<OverviewData | null>(null);
  const [pages, setPages] = useState<PageRow[]>([]);
  const [traffic, setTraffic] = useState<TrafficRow[]>([]);
  const [devices, setDevices] = useState<DeviceRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/dashboard/analytics?type=overview").then((r) => r.json()),
      fetch("/api/dashboard/analytics?type=pages&limit=50").then((r) => r.json()),
      fetch("/api/dashboard/analytics?type=traffic").then((r) => r.json()),
      fetch("/api/dashboard/analytics?type=devices").then((r) => r.json()),
    ])
      .then(([ov, pg, tr, dv]) => {
        if (ov.data) setOverview(ov.data);
        if (pg.data) setPages(pg.data);
        if (tr.data) setTraffic(tr.data);
        if (dv.data) setDevices(dv.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const insights = generateInsights(overview, pages, traffic, devices);
  const dangerCount = insights.filter((i) => i.type === "danger").length;
  const warningCount = insights.filter((i) => i.type === "warning").length;
  const successCount = insights.filter((i) => i.type === "success").length;

  return (
    <div className="space-y-6 max-w-[1400px]">
      <div>
        <h2 className="text-lg font-bold" style={{ color: "var(--dash-text)" }}>
          改善提案
        </h2>
        <p className="text-sm mt-0.5" style={{ color: "var(--dash-text-secondary)" }}>
          GA4データに基づく自動改善提案
        </p>
      </div>

      {/* Summary */}
      {!loading && insights.length > 0 && (
        <div className="flex items-center gap-3">
          {dangerCount > 0 && (
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: "#fef2f2", color: "var(--dash-red)" }}>
              要対応 {dangerCount}件
            </span>
          )}
          {warningCount > 0 && (
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: "var(--dash-amber-light)", color: "var(--dash-amber)" }}>
              注意 {warningCount}件
            </span>
          )}
          {successCount > 0 && (
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: "var(--dash-green-light)", color: "var(--dash-green)" }}>
              良好 {successCount}件
            </span>
          )}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-40">
          <p className="text-sm" style={{ color: "var(--dash-text-muted)" }}>分析中...</p>
        </div>
      ) : insights.length === 0 ? (
        <div className="rounded-xl border p-12 text-center" style={{ background: "var(--dash-card)", borderColor: "var(--dash-border)" }}>
          <svg className="w-12 h-12 mx-auto mb-3" style={{ color: "var(--dash-text-muted)" }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18h6" /><path d="M10 22h4" /><path d="M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z" />
          </svg>
          <p className="text-sm font-medium" style={{ color: "var(--dash-text)" }}>改善提案はまだありません</p>
          <p className="text-xs mt-1" style={{ color: "var(--dash-text-secondary)" }}>GA4のデータが蓄積されると改善提案が自動生成されます</p>
        </div>
      ) : (
        <div className="space-y-3">
          {insights.map((insight, i) => {
            const style = typeStyles[insight.type];
            const icon = icons[style.icon];
            return (
              <div
                key={i}
                className="rounded-xl border p-4 flex items-start gap-3"
                style={{ background: "var(--dash-card)", borderColor: "var(--dash-border)" }}
              >
                <div
                  className="shrink-0 w-9 h-9 rounded-lg flex items-center justify-center"
                  style={{ background: style.bg, color: style.color }}
                >
                  {icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="text-sm font-semibold" style={{ color: "var(--dash-text)" }}>
                      {insight.title}
                    </h3>
                    {insight.metric && (
                      <span className="text-xs font-bold px-1.5 py-0.5 rounded" style={{ background: style.bg, color: style.color }}>
                        {insight.metric}
                      </span>
                    )}
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: "var(--dash-text-secondary)" }}>
                    {insight.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
