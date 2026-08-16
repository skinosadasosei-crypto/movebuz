"use client";

import { useState, useEffect } from "react";
import ChartCard from "@/components/dashboard/ChartCard";

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

interface FunnelStep {
  label: string;
  users: number;
  rate: number;
}

const funnelColors = [
  "#3b82f6", "#6366f1", "#7c3aed", "#8b5cf6", "#a855f7",
];

function FunnelChart({ steps }: { steps: FunnelStep[] }) {
  if (steps.length === 0) return null;
  const maxUsers = steps[0].users;

  return (
    <div className="space-y-0">
      {steps.map((step, i) => {
        const widthPct = Math.max((step.users / maxUsers) * 100, 12);
        const prevStep = i > 0 ? steps[i - 1] : null;
        const transitionRate = prevStep
          ? ((step.users / prevStep.users) * 100).toFixed(1)
          : null;
        const dropoffRate = prevStep
          ? (((prevStep.users - step.users) / prevStep.users) * 100).toFixed(1)
          : null;

        return (
          <div key={step.label}>
            {i > 0 && (
              <div className="flex items-center py-1.5 pl-2">
                <div className="flex items-center gap-2 text-[11px]">
                  <span style={{ color: "var(--dash-text-muted)" }}>&#8595;</span>
                  <span style={{ color: "var(--dash-text-secondary)" }}>
                    遷移率{" "}
                    <span className="font-semibold" style={{ color: "var(--dash-blue)" }}>
                      {transitionRate}%
                    </span>
                  </span>
                  <span style={{ color: "var(--dash-text-muted)" }}>|</span>
                  <span style={{ color: "var(--dash-text-secondary)" }}>
                    離脱率{" "}
                    <span className="font-semibold" style={{ color: "var(--dash-red)" }}>
                      {dropoffRate}%
                    </span>
                  </span>
                </div>
              </div>
            )}
            <div className="flex items-center gap-3">
              <div
                className="shrink-0 text-xs font-medium text-right"
                style={{ width: 140, color: "var(--dash-text)" }}
              >
                {step.label}
              </div>
              <div className="flex-1 relative">
                <div
                  className="h-9 rounded-md flex items-center justify-end pr-3 transition-all"
                  style={{
                    width: `${widthPct}%`,
                    background: funnelColors[i] ?? funnelColors[funnelColors.length - 1],
                    minWidth: 60,
                  }}
                >
                  <span className="text-xs font-bold text-white">
                    {step.users.toLocaleString()}
                  </span>
                </div>
              </div>
              <div
                className="shrink-0 text-xs text-right"
                style={{ width: 80, color: "var(--dash-text-secondary)" }}
              >
                <span className="font-semibold" style={{ color: "var(--dash-text)" }}>
                  {step.rate}%
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function ConversionsPage() {
  const [overview, setOverview] = useState<OverviewData | null>(null);
  const [pages, setPages] = useState<PageRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/dashboard/analytics?type=overview").then((r) => r.json()),
      fetch("/api/dashboard/analytics?type=pages&limit=50").then((r) => r.json()),
    ])
      .then(([ov, pg]) => {
        if (ov.data) setOverview(ov.data);
        if (pg.data) setPages(pg.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const contactPage = pages.find(
    (p) => p.path.includes("/contact") || p.path.includes("/inquiry")
  );
  const blogPages = pages.filter((p) => p.path.startsWith("/blog/"));
  const totalBlogPV = blogPages.reduce((s, p) => s + p.pageviews, 0);

  const funnelSteps: FunnelStep[] = [];
  if (overview) {
    const totalSessions = overview.sessions;
    funnelSteps.push({
      label: "サイト訪問",
      users: totalSessions,
      rate: 100,
    });

    const contentViewers = Math.round(totalSessions * (1 - overview.bounceRate));
    funnelSteps.push({
      label: "コンテンツ閲覧",
      users: contentViewers,
      rate: totalSessions > 0 ? Math.round((contentViewers / totalSessions) * 100) : 0,
    });

    if (totalBlogPV > 0) {
      const blogViewers = blogPages.reduce((s, p) => s + p.users, 0);
      funnelSteps.push({
        label: "記事閲覧",
        users: blogViewers,
        rate: totalSessions > 0 ? Math.round((blogViewers / totalSessions) * 100) : 0,
      });
    }

    if (contactPage) {
      funnelSteps.push({
        label: "お問い合わせ閲覧",
        users: contactPage.users,
        rate: totalSessions > 0 ? Math.round((contactPage.users / totalSessions) * 100) : 0,
      });
    }
  }

  const topEntryPages = pages
    .filter((p) => p.path.startsWith("/blog/"))
    .sort((a, b) => b.users - a.users)
    .slice(0, 5);

  const highBouncePages = pages
    .filter((p) => p.pageviews >= 5 && p.bounceRate >= 0.5)
    .sort((a, b) => b.bounceRate - a.bounceRate)
    .slice(0, 5);

  return (
    <div className="space-y-6 max-w-[1400px]">
      <div>
        <h2 className="text-lg font-bold" style={{ color: "var(--dash-text)" }}>
          コンバージョン分析
        </h2>
        <p className="text-xs mt-0.5" style={{ color: "var(--dash-text-secondary)" }}>
          サイト訪問からお問い合わせまでのファネル分析
        </p>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "セッション数", value: overview?.sessions ?? 0, color: "var(--dash-blue)" },
          { label: "直帰率", value: overview ? `${(overview.bounceRate * 100).toFixed(1)}%` : "—", color: "var(--dash-purple)" },
          { label: "お問い合わせページPV", value: contactPage?.pageviews ?? 0, color: "var(--dash-green)" },
          { label: "お問い合わせページUU", value: contactPage?.users ?? 0, color: "var(--dash-amber)" },
        ].map((k) => (
          <div key={k.label} className="rounded-xl border p-4" style={{ background: "var(--dash-card)", borderColor: "var(--dash-border)" }}>
            <p className="text-xs font-medium mb-1" style={{ color: "var(--dash-text-secondary)" }}>{k.label}</p>
            <p className="text-xl font-bold" style={{ color: typeof k.color === "string" ? k.color : "var(--dash-text)" }}>
              {loading ? "—" : typeof k.value === "number" ? k.value.toLocaleString() : k.value}
            </p>
          </div>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40">
          <p className="text-sm" style={{ color: "var(--dash-text-muted)" }}>読み込み中...</p>
        </div>
      ) : !overview ? (
        <div className="rounded-xl border p-12 text-center" style={{ background: "var(--dash-card)", borderColor: "var(--dash-border)" }}>
          <p className="text-sm" style={{ color: "var(--dash-text-muted)" }}>GA4のデータが蓄積されるとファネル分析が表示されます</p>
        </div>
      ) : (
        <>
          {/* Funnel */}
          <ChartCard title="コンバージョンファネル" subtitle="サイト訪問 → お問い合わせ">
            {funnelSteps.length > 0 ? (
              <FunnelChart steps={funnelSteps} />
            ) : (
              <div className="flex items-center justify-center h-32">
                <p className="text-sm" style={{ color: "var(--dash-text-muted)" }}>データが不足しています</p>
              </div>
            )}
          </ChartCard>

          {/* Top entry pages → contact */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ChartCard title="記事別 流入ユーザー数 TOP5" subtitle="お問い合わせ導線の起点">
              {topEntryPages.length > 0 ? (
                <div className="space-y-2">
                  {topEntryPages.map((p, i) => (
                    <div key={p.path} className="flex items-center gap-3">
                      <span className="text-xs font-bold w-5 text-center" style={{ color: "var(--dash-blue)" }}>{i + 1}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium truncate" style={{ color: "var(--dash-text)" }}>{p.title || p.path}</p>
                        <p className="text-[11px] truncate" style={{ color: "var(--dash-text-muted)" }}>{p.path}</p>
                      </div>
                      <span className="text-xs font-semibold shrink-0" style={{ color: "var(--dash-text)" }}>{p.users.toLocaleString()} UU</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-24">
                  <p className="text-xs" style={{ color: "var(--dash-text-muted)" }}>記事データなし</p>
                </div>
              )}
            </ChartCard>

            <ChartCard title="高離脱率ページ" subtitle="直帰率50%以上">
              {highBouncePages.length > 0 ? (
                <div className="space-y-2">
                  {highBouncePages.map((p) => (
                    <div key={p.path} className="flex items-center gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium truncate" style={{ color: "var(--dash-text)" }}>{p.title || p.path}</p>
                      </div>
                      <span className="text-xs font-semibold shrink-0" style={{ color: "var(--dash-red)" }}>
                        {(p.bounceRate * 100).toFixed(1)}%
                      </span>
                      <span className="text-[11px] shrink-0" style={{ color: "var(--dash-text-muted)" }}>
                        {p.pageviews} PV
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-24">
                  <p className="text-xs" style={{ color: "var(--dash-text-muted)" }}>高離脱率ページなし</p>
                </div>
              )}
            </ChartCard>
          </div>
        </>
      )}
    </div>
  );
}
