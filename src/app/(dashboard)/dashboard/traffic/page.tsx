"use client";

import { useState, useEffect } from "react";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar,
  XAxis, YAxis, CartesianGrid,
} from "recharts";
import ChartCard from "@/components/dashboard/ChartCard";
import DataTable from "@/components/dashboard/DataTable";

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

interface DeviceRow {
  device: string;
  sessions: number;
  percentage: number;
}

const COLORS = ["#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981", "#6366f1", "#94a3b8"];

const deviceLabels: Record<string, string> = {
  desktop: "PC",
  mobile: "モバイル",
  tablet: "タブレット",
};

function formatDuration(s: number) {
  return `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, "0")}`;
}

export default function TrafficPage() {
  const [traffic, setTraffic] = useState<TrafficRow[]>([]);
  const [pages, setPages] = useState<PageRow[]>([]);
  const [devices, setDevices] = useState<DeviceRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/dashboard/analytics?type=traffic").then((r) => r.json()),
      fetch("/api/dashboard/analytics?type=pages").then((r) => r.json()),
      fetch("/api/dashboard/analytics?type=devices").then((r) => r.json()),
    ])
      .then(([tr, pg, dv]) => {
        if (tr.data) setTraffic(tr.data);
        if (pg.data) setPages(pg.data);
        if (dv.data) setDevices(dv.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const totalUsers = traffic.reduce((s, t) => s + t.users, 0);
  const totalSessions = traffic.reduce((s, t) => s + t.sessions, 0);
  const totalPV = traffic.reduce((s, t) => s + t.pageviews, 0);

  const landingPages = pages.slice(0, 10);

  const trafficColumns = [
    {
      key: "channel", label: "チャネル",
      render: (r: TrafficRow) => (
        <span className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: r.color }} />
          <span className="text-xs font-medium">{r.channel}</span>
        </span>
      ),
    },
    { key: "users", label: "ユーザー", sortable: true, align: "right" as const, render: (r: TrafficRow) => r.users.toLocaleString() },
    { key: "sessions", label: "セッション", sortable: true, align: "right" as const, render: (r: TrafficRow) => r.sessions.toLocaleString() },
    { key: "pageviews", label: "PV", sortable: true, align: "right" as const, render: (r: TrafficRow) => r.pageviews.toLocaleString() },
    {
      key: "share", label: "構成比", align: "right" as const,
      render: (r: TrafficRow) => totalUsers > 0 ? `${((r.users / totalUsers) * 100).toFixed(1)}%` : "—",
    },
  ];

  const landingColumns = [
    {
      key: "path", label: "ランディングページ", width: "320px",
      render: (r: PageRow) => (
        <span className="text-xs font-medium truncate block max-w-[320px]">{r.title || r.path}</span>
      ),
    },
    { key: "pageviews", label: "PV", sortable: true, align: "right" as const, render: (r: PageRow) => r.pageviews.toLocaleString() },
    { key: "users", label: "UU", sortable: true, align: "right" as const, render: (r: PageRow) => r.users.toLocaleString() },
    { key: "avgDuration", label: "平均滞在", sortable: true, align: "right" as const, render: (r: PageRow) => formatDuration(r.avgDuration) },
    {
      key: "bounceRate", label: "直帰率", sortable: true, align: "right" as const,
      render: (r: PageRow) => (
        <span style={{ color: r.bounceRate >= 0.4 ? "var(--dash-red)" : "var(--dash-text)" }}>
          {(r.bounceRate * 100).toFixed(1)}%
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6 max-w-[1400px]">
      <div>
        <h2 className="text-lg font-bold" style={{ color: "var(--dash-text)" }}>トラフィック分析</h2>
        <p className="text-sm mt-0.5" style={{ color: "var(--dash-text-secondary)" }}>
          流入元・ランディングページ・デバイスのパフォーマンスを分析
        </p>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "合計ユーザー", value: totalUsers.toLocaleString(), color: "var(--dash-blue)" },
          { label: "合計セッション", value: totalSessions.toLocaleString(), color: "var(--dash-purple)" },
          { label: "合計PV", value: totalPV.toLocaleString(), color: "var(--dash-green)" },
        ].map((k) => (
          <div key={k.label} className="rounded-xl border p-4" style={{ background: "var(--dash-card)", borderColor: "var(--dash-border)" }}>
            <p className="text-xs font-medium mb-1" style={{ color: "var(--dash-text-secondary)" }}>{k.label}</p>
            <p className="text-xl font-bold" style={{ color: k.color }}>{loading ? "—" : k.value}</p>
          </div>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40">
          <p className="text-sm" style={{ color: "var(--dash-text-muted)" }}>読み込み中...</p>
        </div>
      ) : traffic.length === 0 ? (
        <div className="rounded-xl border p-12 text-center" style={{ background: "var(--dash-card)", borderColor: "var(--dash-border)" }}>
          <p className="text-sm" style={{ color: "var(--dash-text-muted)" }}>GA4のデータが蓄積されると分析が表示されます</p>
        </div>
      ) : (
        <>
          {/* Traffic Sources */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
            <ChartCard title="流入元構成比" className="xl:col-span-1">
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie data={traffic} dataKey="users" nameKey="channel" cx="50%" cy="50%" outerRadius={90} innerRadius={55} paddingAngle={2}>
                    {traffic.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid #e2e8f0" }} formatter={(v) => typeof v === "number" ? v.toLocaleString() : v} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-1.5 mt-2">
                {traffic.map((t, i) => (
                  <div key={t.channel} className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                      <span style={{ color: "var(--dash-text-secondary)" }}>{t.channel}</span>
                    </span>
                    <span className="font-medium" style={{ color: "var(--dash-text)" }}>{t.users.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </ChartCard>

            <ChartCard title="流入元データ" subtitle="チャネル別詳細" className="xl:col-span-2">
              <DataTable columns={trafficColumns} data={traffic as unknown as Record<string, unknown>[]} defaultSortKey="users" />
            </ChartCard>
          </div>

          {/* Device Breakdown */}
          {devices.length > 0 && (
            <ChartCard title="デバイス別アクセス">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={devices} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 11, fill: "#94a3b8" }} tickLine={false} axisLine={false} />
                    <YAxis
                      type="category" dataKey="device" tick={{ fontSize: 12, fill: "#64748b" }} tickLine={false} axisLine={false} width={80}
                      tickFormatter={(v) => deviceLabels[v] || v}
                    />
                    <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e2e8f0" }} />
                    <Bar dataKey="sessions" name="セッション" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
                <div className="space-y-3">
                  {devices.map((d, i) => (
                    <div key={d.device}>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-medium" style={{ color: "var(--dash-text)" }}>{deviceLabels[d.device] || d.device}</span>
                        <span style={{ color: "var(--dash-text-secondary)" }}>{d.percentage}% ({d.sessions.toLocaleString()})</span>
                      </div>
                      <div className="h-2 rounded-full overflow-hidden" style={{ background: "var(--dash-border)" }}>
                        <div className="h-full rounded-full" style={{ width: `${d.percentage}%`, background: COLORS[i % COLORS.length] }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </ChartCard>
          )}

          {/* Landing Pages */}
          <ChartCard title="ランディングページ分析" subtitle="流入先ページ別 TOP10">
            {landingPages.length > 0 ? (
              <DataTable columns={landingColumns} data={landingPages as unknown as Record<string, unknown>[]} defaultSortKey="pageviews" />
            ) : (
              <div className="flex items-center justify-center h-32">
                <p className="text-sm" style={{ color: "var(--dash-text-muted)" }}>データがありません</p>
              </div>
            )}
          </ChartCard>
        </>
      )}
    </div>
  );
}
