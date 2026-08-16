"use client";

import ChartCard from "@/components/dashboard/ChartCard";
import type { FunnelStep, ConversionType } from "@/lib/dashboard/types";

const funnelSteps: FunnelStep[] = [];
const conversionTypes: ConversionType[] = [];

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
};

const typeColors: Record<string, { bg: string; icon: string }> = {
  form_submit: { bg: "var(--dash-blue-light)", icon: "var(--dash-blue)" },
};

/* ---------- Conversion Type Card ---------- */
function ConversionCard({ cv }: { cv: ConversionType }) {
  const color = typeColors[cv.type] ?? { bg: "var(--dash-blue-light)", icon: "var(--dash-blue)" };
  const icon = typeIcons[cv.type] ?? typeIcons.form_submit;
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

/* ---------- Funnel Chart ---------- */
function FunnelChart({ steps }: { steps: FunnelStep[] }) {
  if (steps.length === 0) return null;
  const maxUsers = steps[0].users;
  const funnelColors = [
    "#3b82f6", "#6366f1", "#7c3aed", "#8b5cf6", "#a855f7", "#9333ea",
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
                style={{ width: 130, color: "var(--dash-text)" }}
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
      <div>
        <h2 className="text-lg font-bold" style={{ color: "var(--dash-text)" }}>
          コンバージョン分析
        </h2>
        <p className="text-xs mt-0.5" style={{ color: "var(--dash-text-secondary)" }}>
          CV種別ごとの件数推移とファネル分析
        </p>
      </div>

      {/* Total Card */}
      <div
        className="rounded-xl border p-4"
        style={{ background: "var(--dash-blue-light)", borderColor: "var(--dash-blue)" }}
      >
        <p className="text-xs font-medium mb-1" style={{ color: "var(--dash-blue)" }}>
          合計コンバージョン
        </p>
        <span className="text-2xl font-bold" style={{ color: "var(--dash-text)" }}>
          {totalConversions.toLocaleString()}
        </span>
      </div>

      {conversionTypes.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
          {conversionTypes.map((cv) => (
            <ConversionCard key={cv.type} cv={cv} />
          ))}
        </div>
      )}

      {/* Funnel */}
      <ChartCard
        title="コンバージョンファネル"
        subtitle="サイト訪問 → 問い合わせ完了"
      >
        {funnelSteps.length > 0 ? (
          <FunnelChart steps={funnelSteps} />
        ) : (
          <div className="flex items-center justify-center h-32">
            <p className="text-sm" style={{ color: "var(--dash-text-muted)" }}>
              GA4のデータが蓄積されるとファネル分析が表示されます
            </p>
          </div>
        )}
      </ChartCard>

      {/* CV Trend */}
      <ChartCard title="問い合わせ数推移" subtitle="過去30日">
        <div className="flex items-center justify-center h-32">
          <p className="text-sm" style={{ color: "var(--dash-text-muted)" }}>
            データがありません
          </p>
        </div>
      </ChartCard>

      {/* CV Type Table */}
      {conversionTypes.length > 0 && (
        <ChartCard title="CV種別一覧" subtitle="前月比">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b" style={{ borderColor: "var(--dash-border)" }}>
                  <th className="text-left py-2.5 px-3 font-semibold" style={{ color: "var(--dash-text-secondary)" }}>CV種別</th>
                  <th className="text-right py-2.5 px-3 font-semibold" style={{ color: "var(--dash-text-secondary)" }}>件数</th>
                  <th className="text-right py-2.5 px-3 font-semibold" style={{ color: "var(--dash-text-secondary)" }}>前月比</th>
                  <th className="text-right py-2.5 px-3 font-semibold" style={{ color: "var(--dash-text-secondary)" }}>構成比</th>
                </tr>
              </thead>
              <tbody>
                {conversionTypes.map((cv) => {
                  const isPositive = cv.change >= 0;
                  const share = totalConversions > 0 ? ((cv.count / totalConversions) * 100).toFixed(1) : "0.0";
                  return (
                    <tr key={cv.type} className="border-b last:border-b-0" style={{ borderColor: "var(--dash-border)" }}>
                      <td className="py-2.5 px-3"><span className="font-medium" style={{ color: "var(--dash-text)" }}>{cv.label}</span></td>
                      <td className="text-right py-2.5 px-3 font-semibold" style={{ color: "var(--dash-text)" }}>{cv.count.toLocaleString()}</td>
                      <td className="text-right py-2.5 px-3">
                        <span className="inline-flex items-center gap-0.5 font-medium" style={{ color: isPositive ? "var(--dash-green)" : "var(--dash-red)" }}>
                          {Math.abs(cv.change)}%
                        </span>
                      </td>
                      <td className="text-right py-2.5 px-3" style={{ color: "var(--dash-text-secondary)" }}>{share}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </ChartCard>
      )}
    </div>
  );
}
