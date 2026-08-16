"use client";

import { useState, useEffect } from "react";
import ChartCard from "@/components/dashboard/ChartCard";

interface TrafficRow {
  channel: string;
  users: number;
  sessions: number;
  pageviews: number;
  color: string;
}

interface PageRow {
  path: string;
  title: string;
  pageviews: number;
  users: number;
  avgDuration: number;
  bounceRate: number;
}

interface OverviewData {
  users: number;
  sessions: number;
  pageviews: number;
  newUsers: number;
  bounceRate: number;
  avgSessionDuration: number;
}

function formatDuration(s: number) {
  return `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, "0")}`;
}

export default function UserFlowPage() {
  const [traffic, setTraffic] = useState<TrafficRow[]>([]);
  const [pages, setPages] = useState<PageRow[]>([]);
  const [overview, setOverview] = useState<OverviewData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/dashboard/analytics?type=traffic").then((r) => r.json()),
      fetch("/api/dashboard/analytics?type=pages&limit=50").then((r) => r.json()),
      fetch("/api/dashboard/analytics?type=overview").then((r) => r.json()),
    ])
      .then(([tr, pg, ov]) => {
        if (tr.data) setTraffic(tr.data);
        if (pg.data) setPages(pg.data);
        if (ov.data) setOverview(ov.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const totalTrafficUsers = traffic.reduce((s, t) => s + t.users, 0);
  const blogPages = pages.filter((p) => p.path.startsWith("/blog/")).sort((a, b) => b.pageviews - a.pageviews);
  const topPages = pages.sort((a, b) => b.pageviews - a.pageviews).slice(0, 8);
  const contactPage = pages.find((p) => p.path.includes("/contact") || p.path.includes("/inquiry"));
  const avgPagesPerSession = overview && overview.sessions > 0 ? (overview.pageviews / overview.sessions).toFixed(1) : "—";

  return (
    <div className="space-y-6 max-w-[1400px]">
      <div>
        <h2 className="text-lg font-bold" style={{ color: "var(--dash-text)" }}>
          ユーザー導線分析
        </h2>
        <p className="text-sm mt-0.5" style={{ color: "var(--dash-text-secondary)" }}>
          ユーザーの流入経路からコンテンツ閲覧までの導線を分析
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { label: "合計ユーザー", value: overview?.users.toLocaleString() ?? "—", color: "var(--dash-blue)" },
          { label: "お問い合わせ閲覧", value: contactPage ? `${contactPage.users} UU` : "—", color: "var(--dash-green)" },
          { label: "平均閲覧ページ数", value: `${avgPagesPerSession} ページ`, color: "var(--dash-purple)" },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-xl border px-4 py-3 flex items-center gap-3"
            style={{ background: "var(--dash-card)", borderColor: "var(--dash-border)" }}
          >
            <div className="w-1 h-8 rounded-full shrink-0" style={{ background: s.color }} />
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--dash-text-muted)" }}>
                {s.label}
              </div>
              <div className="text-lg font-bold tabular-nums" style={{ color: "var(--dash-text)" }}>
                {loading ? "—" : s.value}
              </div>
            </div>
          </div>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40">
          <p className="text-sm" style={{ color: "var(--dash-text-muted)" }}>読み込み中...</p>
        </div>
      ) : traffic.length === 0 && pages.length === 0 ? (
        <div className="rounded-xl border p-12 text-center" style={{ background: "var(--dash-card)", borderColor: "var(--dash-border)" }}>
          <p className="text-sm" style={{ color: "var(--dash-text-muted)" }}>GA4のデータが蓄積されるとフロー分析が表示されます</p>
        </div>
      ) : (
        <>
          {/* Flow Diagram */}
          <ChartCard title="ユーザーフロー" subtitle="流入元 → コンテンツ → 遷移先">
            <div className="flex items-start gap-2 overflow-x-auto pb-2">
              {/* Column 1: Traffic Sources */}
              <div className="shrink-0" style={{ width: 180 }}>
                <p className="text-[10px] font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--dash-text-muted)" }}>
                  流入元
                </p>
                <div className="space-y-1.5">
                  {traffic.slice(0, 6).map((t) => {
                    const pct = totalTrafficUsers > 0 ? (t.users / totalTrafficUsers) * 100 : 0;
                    return (
                      <div key={t.channel} className="rounded-lg p-2 border" style={{ borderColor: "var(--dash-border)" }}>
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="w-2 h-2 rounded-full shrink-0" style={{ background: t.color }} />
                          <span className="text-[11px] font-medium truncate" style={{ color: "var(--dash-text)" }}>{t.channel}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "var(--dash-border)" }}>
                            <div className="h-full rounded-full" style={{ width: `${pct}%`, background: t.color }} />
                          </div>
                          <span className="text-[10px] font-medium shrink-0" style={{ color: "var(--dash-text-secondary)" }}>
                            {t.users}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Arrow */}
              <div className="shrink-0 flex items-center self-center pt-6">
                <svg width="30" height="20" viewBox="0 0 30 20" fill="none">
                  <path d="M0 10h22m0 0l-6-6m6 6l-6 6" stroke="var(--dash-text-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>

              {/* Column 2: Top Pages */}
              <div className="shrink-0" style={{ width: 260 }}>
                <p className="text-[10px] font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--dash-text-muted)" }}>
                  閲覧ページ
                </p>
                <div className="space-y-1.5">
                  {topPages.slice(0, 6).map((p) => (
                    <div key={p.path} className="rounded-lg p-2 border" style={{ borderColor: "var(--dash-border)" }}>
                      <p className="text-[11px] font-medium truncate mb-0.5" style={{ color: "var(--dash-text)" }}>
                        {p.title || p.path}
                      </p>
                      <div className="flex items-center gap-2 text-[10px]" style={{ color: "var(--dash-text-muted)" }}>
                        <span>{p.pageviews} PV</span>
                        <span>|</span>
                        <span>{formatDuration(p.avgDuration)}</span>
                        <span>|</span>
                        <span style={{ color: p.bounceRate >= 0.4 ? "var(--dash-red)" : undefined }}>
                          離脱 {(p.bounceRate * 100).toFixed(0)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Arrow */}
              <div className="shrink-0 flex items-center self-center pt-6">
                <svg width="30" height="20" viewBox="0 0 30 20" fill="none">
                  <path d="M0 10h22m0 0l-6-6m6 6l-6 6" stroke="var(--dash-text-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>

              {/* Column 3: Goals */}
              <div className="shrink-0" style={{ width: 160 }}>
                <p className="text-[10px] font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--dash-text-muted)" }}>
                  ゴール
                </p>
                <div className="space-y-1.5">
                  {contactPage ? (
                    <div className="rounded-lg p-3 border" style={{ borderColor: "var(--dash-green)", background: "var(--dash-green-light)" }}>
                      <p className="text-[11px] font-semibold mb-1" style={{ color: "var(--dash-green)" }}>お問い合わせ</p>
                      <p className="text-lg font-bold" style={{ color: "var(--dash-text)" }}>{contactPage.users} UU</p>
                      <p className="text-[10px]" style={{ color: "var(--dash-text-muted)" }}>{contactPage.pageviews} PV</p>
                    </div>
                  ) : (
                    <div className="rounded-lg p-3 border" style={{ borderColor: "var(--dash-border)" }}>
                      <p className="text-[11px] font-medium" style={{ color: "var(--dash-text-muted)" }}>お問い合わせページ未検出</p>
                    </div>
                  )}
                  <div className="rounded-lg p-3 border" style={{ borderColor: "var(--dash-border)" }}>
                    <p className="text-[11px] font-semibold mb-1" style={{ color: "var(--dash-text-secondary)" }}>離脱</p>
                    <p className="text-lg font-bold" style={{ color: "var(--dash-text)" }}>
                      {overview ? (overview.bounceRate * 100).toFixed(1) : "—"}%
                    </p>
                    <p className="text-[10px]" style={{ color: "var(--dash-text-muted)" }}>サイト全体の直帰率</p>
                  </div>
                </div>
              </div>
            </div>
          </ChartCard>

          {/* Blog article performance */}
          {blogPages.length > 0 && (
            <ChartCard title="記事別ユーザー導線" subtitle="記事からの滞在時間と離脱率">
              <div className="space-y-2">
                {blogPages.slice(0, 10).map((p, i) => (
                  <div key={p.path} className="flex items-center gap-3 py-1.5" style={{ borderBottom: i < Math.min(blogPages.length, 10) - 1 ? "1px solid var(--dash-border)" : undefined }}>
                    <span className="text-xs font-bold w-5 text-center shrink-0" style={{ color: "var(--dash-blue)" }}>{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate" style={{ color: "var(--dash-text)" }}>{p.title || p.path}</p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0 text-[11px]">
                      <span style={{ color: "var(--dash-text-secondary)" }}>{p.users} UU</span>
                      <span style={{ color: "var(--dash-text-muted)" }}>{formatDuration(p.avgDuration)}</span>
                      <span style={{ color: p.bounceRate >= 0.5 ? "var(--dash-red)" : "var(--dash-text-secondary)" }}>
                        離脱 {(p.bounceRate * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </ChartCard>
          )}
        </>
      )}
    </div>
  );
}
