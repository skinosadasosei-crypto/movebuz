"use client";

import { useState, useEffect } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";
import ChartCard from "@/components/dashboard/ChartCard";

interface HourlyRow {
  hour: number;
  users: number;
  sessions: number;
  pageviews: number;
}

interface AgeRow {
  bracket: string;
  users: number;
}

interface GenderRow {
  gender: string;
  users: number;
}

const COLORS = ["#3b82f6", "#ec4899", "#8b5cf6", "#f59e0b", "#10b981", "#6366f1"];

const genderLabels: Record<string, string> = {
  male: "男性",
  female: "女性",
  unknown: "不明",
};

const genderColors: Record<string, string> = {
  male: "#3b82f6",
  female: "#ec4899",
  unknown: "#94a3b8",
};

const ageLabels: Record<string, string> = {
  "18-24": "18-24歳",
  "25-34": "25-34歳",
  "35-44": "35-44歳",
  "45-54": "45-54歳",
  "55-64": "55-64歳",
  "65+": "65歳以上",
  unknown: "不明",
};

export default function AudiencePage() {
  const [hourly, setHourly] = useState<HourlyRow[]>([]);
  const [age, setAge] = useState<AgeRow[]>([]);
  const [gender, setGender] = useState<GenderRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/dashboard/analytics?type=hourly").then((r) => r.json()),
      fetch("/api/dashboard/analytics?type=demographics").then((r) => r.json()),
    ])
      .then(([hr, demo]) => {
        if (hr.data) setHourly(hr.data);
        if (demo.data) {
          setAge(demo.data.age || []);
          setGender(demo.data.gender || []);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const peakHour = hourly.reduce((max, h) => h.sessions > max.sessions ? h : max, { hour: 0, sessions: 0, users: 0, pageviews: 0 });
  const totalHourlySessions = hourly.reduce((s, h) => s + h.sessions, 0);
  const totalGenderUsers = gender.reduce((s, g) => s + g.users, 0);
  const totalAgeUsers = age.reduce((s, a) => s + a.users, 0);

  const timeBlocks = [
    { label: "早朝 (5-8時)", range: [5, 8] },
    { label: "午前 (9-12時)", range: [9, 12] },
    { label: "午後 (13-17時)", range: [13, 17] },
    { label: "夜間 (18-22時)", range: [18, 22] },
    { label: "深夜 (23-4時)", range: [23, 28] },
  ].map((b) => {
    const sessions = hourly
      .filter((h) => {
        const hr = h.hour;
        if (b.range[1] > 23) return hr >= b.range[0] || hr <= b.range[1] - 24;
        return hr >= b.range[0] && hr <= b.range[1];
      })
      .reduce((s, h) => s + h.sessions, 0);
    return { ...b, sessions, pct: totalHourlySessions > 0 ? (sessions / totalHourlySessions * 100) : 0 };
  });

  return (
    <div className="space-y-6 max-w-[1400px]">
      <div>
        <h2 className="text-lg font-bold" style={{ color: "var(--dash-text)" }}>ユーザー属性分析</h2>
        <p className="text-sm mt-0.5" style={{ color: "var(--dash-text-secondary)" }}>
          訪問時間帯・年代・性別によるユーザー分析
        </p>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "ピーク時間帯", value: loading ? "—" : `${peakHour.hour}:00`, color: "var(--dash-blue)" },
          { label: "ピーク時セッション", value: loading ? "—" : peakHour.sessions.toLocaleString(), color: "var(--dash-purple)" },
          { label: "属性取得ユーザー", value: loading ? "—" : totalAgeUsers.toLocaleString(), color: "var(--dash-green)" },
          { label: "合計セッション", value: loading ? "—" : totalHourlySessions.toLocaleString(), color: "var(--dash-amber)" },
        ].map((k) => (
          <div key={k.label} className="rounded-xl border p-4" style={{ background: "var(--dash-card)", borderColor: "var(--dash-border)" }}>
            <p className="text-xs font-medium mb-1" style={{ color: "var(--dash-text-secondary)" }}>{k.label}</p>
            <p className="text-xl font-bold" style={{ color: k.color }}>{k.value}</p>
          </div>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40">
          <p className="text-sm" style={{ color: "var(--dash-text-muted)" }}>読み込み中...</p>
        </div>
      ) : hourly.length === 0 && age.length === 0 ? (
        <div className="rounded-xl border p-12 text-center" style={{ background: "var(--dash-card)", borderColor: "var(--dash-border)" }}>
          <p className="text-sm" style={{ color: "var(--dash-text-muted)" }}>GA4のデータが蓄積されると分析が表示されます</p>
        </div>
      ) : (
        <>
          {/* Hourly Chart */}
          <ChartCard title="時間帯別アクセス" subtitle="過去30日の時間別セッション数">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={hourly} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis
                  dataKey="hour"
                  tick={{ fontSize: 11, fill: "#94a3b8" }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `${v}時`}
                />
                <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e2e8f0" }}
                  labelFormatter={(v) => `${v}:00 - ${v}:59`}
                  formatter={(value: number, name: string) => {
                    const labels: Record<string, string> = { sessions: "セッション", users: "ユーザー", pageviews: "PV" };
                    return [value.toLocaleString(), labels[name] || name];
                  }}
                />
                <Bar dataKey="sessions" name="sessions" fill="#3b82f6" radius={[3, 3, 0, 0]} />
                <Bar dataKey="pageviews" name="pageviews" fill="#e2e8f0" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Time Blocks */}
          <ChartCard title="時間帯ブロック別" subtitle="セッション構成比">
            <div className="space-y-2">
              {timeBlocks.map((b) => (
                <div key={b.label} className="flex items-center gap-3">
                  <span className="text-xs font-medium shrink-0" style={{ width: 120, color: "var(--dash-text)" }}>{b.label}</span>
                  <div className="flex-1 h-6 rounded-md overflow-hidden" style={{ background: "var(--dash-border)" }}>
                    <div
                      className="h-full rounded-md flex items-center pl-2"
                      style={{ width: `${Math.max(b.pct, 2)}%`, background: "#3b82f6" }}
                    >
                      {b.pct >= 10 && (
                        <span className="text-[10px] font-bold text-white">{b.sessions}</span>
                      )}
                    </div>
                  </div>
                  <span className="text-xs font-semibold shrink-0" style={{ width: 50, textAlign: "right", color: "var(--dash-text-secondary)" }}>
                    {b.pct.toFixed(1)}%
                  </span>
                </div>
              ))}
            </div>
          </ChartCard>

          {/* Demographics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Gender */}
            <ChartCard title="性別構成">
              {gender.length > 0 && totalGenderUsers > 0 ? (
                <div className="flex items-center gap-6">
                  <ResponsiveContainer width="50%" height={180}>
                    <PieChart>
                      <Pie data={gender} dataKey="users" nameKey="gender" cx="50%" cy="50%" outerRadius={70} innerRadius={40} paddingAngle={2}>
                        {gender.map((g) => <Cell key={g.gender} fill={genderColors[g.gender] || "#94a3b8"} />)}
                      </Pie>
                      <Tooltip
                        contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e2e8f0" }}
                        formatter={(v: number, name: string) => [v.toLocaleString(), genderLabels[name] || name]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-2">
                    {gender.map((g) => (
                      <div key={g.gender} className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full shrink-0" style={{ background: genderColors[g.gender] || "#94a3b8" }} />
                        <span className="text-xs" style={{ color: "var(--dash-text-secondary)" }}>
                          {genderLabels[g.gender] || g.gender}
                        </span>
                        <span className="text-xs font-bold" style={{ color: "var(--dash-text)" }}>
                          {g.users} ({totalGenderUsers > 0 ? ((g.users / totalGenderUsers) * 100).toFixed(0) : 0}%)
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-32">
                  <p className="text-xs" style={{ color: "var(--dash-text-muted)" }}>
                    GA4で「デモグラフィック レポート」を有効にすると表示されます
                  </p>
                </div>
              )}
            </ChartCard>

            {/* Age */}
            <ChartCard title="年代別構成">
              {age.length > 0 && totalAgeUsers > 0 ? (
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={age} layout="vertical" margin={{ top: 0, right: 10, left: 10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 11, fill: "#94a3b8" }} tickLine={false} axisLine={false} />
                    <YAxis
                      type="category"
                      dataKey="bracket"
                      tick={{ fontSize: 11, fill: "#64748b" }}
                      tickLine={false}
                      axisLine={false}
                      width={65}
                      tickFormatter={(v) => ageLabels[v] || v}
                    />
                    <Tooltip
                      contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e2e8f0" }}
                      formatter={(v: number) => [v.toLocaleString(), "ユーザー"]}
                      labelFormatter={(v) => ageLabels[v] || v}
                    />
                    <Bar dataKey="users" fill="#8b5cf6" radius={[0, 4, 4, 0]}>
                      {age.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-32">
                  <p className="text-xs" style={{ color: "var(--dash-text-muted)" }}>
                    GA4で「デモグラフィック レポート」を有効にすると表示されます
                  </p>
                </div>
              )}
            </ChartCard>
          </div>
        </>
      )}
    </div>
  );
}
