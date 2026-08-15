"use client";

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from "recharts";
import ChartCard from "@/components/dashboard/ChartCard";
import {
  funnelSteps, conversionTypes, dailyMetrics,
} from "@/lib/dashboard/mock-data";
import type { FunnelStep, ConversionType } from "@/lib/dashboard/types";

/* ---------- icons per conversion type ---------- */
const typeIcons: Record<string, React.ReactNode> = {
  form_submit: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  ),
  phone_click: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  ),
  line_click: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  ),
  document_request: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  ),
  newsletter: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  ),
  cta_click: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 15l-2 5L9 9l11 4-5 2z" />
      <path d="M14.828 14.828L21 21" />
    </svg>
  ),
  external_booking: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
};

const typeColors: Record<string, { bg: string; icon: string }> = {
  form_submit: { bg: "var(--dash-blue-light)", icon: "var(--dash-blue)" },
  phone_click: { bg: "var(--dash-green-light)", icon: "var(--dash-green)" },
  line_click: { bg: "var(--dash-green-light)", icon: "var(--dash-green)" },
  document_request: { bg: "var(--dash-amber-light)", icon: "var(--dash-amber)" },
  newsletter: { bg: "var(--dash-purple-light)", icon: "var(--dash-purple)" },
  cta_click: { bg: "var(--dash-blue-light)", icon: "var(--dash-blue)" },
  external_booking: { bg: "var(--dash-amber-light)", icon: "var(--dash-amber)" },
};

/* ---------- Conversion Type Card ---------- */
function ConversionCard({ cv }: { cv: ConversionType }) {
  const color = typeColors[cv.type] ?? { bg: "var(--dash-blue-light)", icon: "var(--dash-blue)" };
  const icon = typeIcons[cv.type] ?? typeIcons.cta_click;
  const isPositive = cv.change >= 0;

  return (
    <div
      className="rounded-xl border p-4 flex items-start gap-3"
      style={{ background: "var(--dash-card)", borderColor: "var(--dash-border)" }}
    >
      <div
        className="shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
        style={{ background: color.bg, color: color.icon }}
      >
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs mb-1" style={{ color: "var(--dash-text-secondary)" }}>
          {cv.label}
        </p>
        <div className="flex items-end gap-2">
          <span className="text-xl font-bold" style={{ color: "var(--dash-text)" }}>
            {cv.count.toLocaleString()}
          </span>
          <span
            className="text-xs font-medium mb-0.5"
            style={{ color: isPositive ? "var(--dash-green)" : "var(--dash-red)" }}
          >
            {isPositive ? "+" : ""}
            {cv.change}%
          </span>
        </div>
      </div>
    </div>
  );
}

/* ---------- Funnel Step ---------- */
function FunnelChart({ steps }: { steps: FunnelStep[] }) {
  const maxUsers = steps[0].users;
  const funnelColors = [
    "#3b82f6",
    "#6366f1",
    "#7c3aed",
    "#8b5cf6",
    "#a855f7",
    "#9333ea",
  ];

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
            {/* Transition indicator between steps */}
            {i > 0 && (
              <div className="flex items-center py-1.5 pl-2">
                <div className="flex items-center gap-2 text-[11px]">
                  <span style={{ color: "var(--dash-text-muted)" }}>
                    &#8595;
                  </span>
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

            {/* Funnel bar row */}
            <div className="flex items-center gap-3">
              {/* Label */}
              <div
                className="shrink-0 text-xs font-medium text-right"
                style={{ width: 130, color: "var(--dash-text)" }}
              >
                {step.label}
              </div>

              {/* Bar */}
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

              {/* Percentage */}
              <div
                className="shrink-0 text-xs text-right"
                style={{ width: 80, color: "var(--dash-text-secondary)" }}
              >
                <span className="font-semibold" style={{ color: "var(--dash-text)" }}>
                  {step.rate}%
                </span>
                <span className="ml-1">of total</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ---------- Main Page ---------- */
export default function ConversionsPage() {
  const totalConversions = conversionTypes.reduce((sum, cv) => sum + cv.count, 0);

  return (
    <div className="space-y-6 max-w-[1400px]">
      {/* Page Header */}
      <div>
        <h2 className="text-lg font-bold" style={{ color: "var(--dash-text)" }}>
          コンバージョン分析
        </h2>
        <p className="text-xs mt-0.5" style={{ color: "var(--dash-text-secondary)" }}>
          CV種別ごとの件数推移とファネル分析
        </p>
      </div>

      {/* Section 1: Conversion Type Summary */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
        {/* Total card */}
        <div
          className="rounded-xl border p-4 col-span-2 md:col-span-3 xl:col-span-1"
          style={{ background: "var(--dash-blue-light)", borderColor: "var(--dash-blue)" }}
        >
          <p className="text-xs font-medium mb-1" style={{ color: "var(--dash-blue)" }}>
            合計コンバージョン
          </p>
          <span className="text-2xl font-bold" style={{ color: "var(--dash-text)" }}>
            {totalConversions.toLocaleString()}
          </span>
        </div>

        {conversionTypes.map((cv) => (
          <ConversionCard key={cv.type} cv={cv} />
        ))}
      </div>

      {/* Section 2: Funnel Visualization */}
      <ChartCard
        title="コンバージョンファネル"
        subtitle="サイト訪問 → 問い合わせ完了"
      >
        <FunnelChart steps={funnelSteps} />
      </ChartCard>

      {/* Section 3: CV Trend Chart */}
      <ChartCard title="問い合わせ数推移" subtitle="過去30日">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={dailyMetrics}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 10, fill: "#94a3b8" }}
              tickLine={false}
              axisLine={false}
              interval={4}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#94a3b8" }}
              tickLine={false}
              axisLine={false}
              width={30}
            />
            <Tooltip
              contentStyle={{
                fontSize: 12,
                borderRadius: 8,
                border: "1px solid #e2e8f0",
              }}
            />
            <Bar
              dataKey="inquiries"
              name="問い合わせ"
              fill="#3b82f6"
              radius={[3, 3, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Section 4: Conversion by Type Table */}
      <ChartCard title="CV種別一覧" subtitle="前月比">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr
                className="border-b"
                style={{ borderColor: "var(--dash-border)" }}
              >
                <th
                  className="text-left py-2.5 px-3 font-semibold"
                  style={{ color: "var(--dash-text-secondary)" }}
                >
                  CV種別
                </th>
                <th
                  className="text-right py-2.5 px-3 font-semibold"
                  style={{ color: "var(--dash-text-secondary)" }}
                >
                  件数
                </th>
                <th
                  className="text-right py-2.5 px-3 font-semibold"
                  style={{ color: "var(--dash-text-secondary)" }}
                >
                  前月比
                </th>
                <th
                  className="text-right py-2.5 px-3 font-semibold"
                  style={{ color: "var(--dash-text-secondary)" }}
                >
                  構成比
                </th>
              </tr>
            </thead>
            <tbody>
              {conversionTypes.map((cv) => {
                const isPositive = cv.change >= 0;
                const share = ((cv.count / totalConversions) * 100).toFixed(1);
                return (
                  <tr
                    key={cv.type}
                    className="border-b last:border-b-0"
                    style={{ borderColor: "var(--dash-border)" }}
                  >
                    <td className="py-2.5 px-3">
                      <span
                        className="font-medium"
                        style={{ color: "var(--dash-text)" }}
                      >
                        {cv.label}
                      </span>
                    </td>
                    <td
                      className="text-right py-2.5 px-3 font-semibold"
                      style={{ color: "var(--dash-text)" }}
                    >
                      {cv.count.toLocaleString()}
                    </td>
                    <td className="text-right py-2.5 px-3">
                      <span
                        className="inline-flex items-center gap-0.5 font-medium"
                        style={{
                          color: isPositive
                            ? "var(--dash-green)"
                            : "var(--dash-red)",
                        }}
                      >
                        {isPositive ? (
                          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <polyline points="18 15 12 9 6 15" />
                          </svg>
                        ) : (
                          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <polyline points="6 9 12 15 18 9" />
                          </svg>
                        )}
                        {Math.abs(cv.change)}%
                      </span>
                    </td>
                    <td
                      className="text-right py-2.5 px-3"
                      style={{ color: "var(--dash-text-secondary)" }}
                    >
                      {share}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </ChartCard>
    </div>
  );
}
