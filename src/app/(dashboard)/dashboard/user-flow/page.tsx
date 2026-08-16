"use client";

export default function UserFlowPage() {
  return (
    <div className="space-y-6 max-w-[1400px]">
      <div>
        <h2
          className="text-lg font-bold"
          style={{ color: "var(--dash-text)" }}
        >
          ユーザー導線分析
        </h2>
        <p
          className="text-sm mt-0.5"
          style={{ color: "var(--dash-text-secondary)" }}
        >
          ユーザーフローとジャーニーの分析
        </p>
      </div>

      {/* Flow Diagram */}
      <div
        className="rounded-xl border p-5"
        style={{
          background: "var(--dash-card)",
          borderColor: "var(--dash-border)",
        }}
      >
        <div className="mb-3">
          <h3 className="text-sm font-semibold" style={{ color: "var(--dash-text)" }}>
            ユーザーフロー
          </h3>
          <p className="text-xs mt-0.5" style={{ color: "var(--dash-text-muted)" }}>
            流入元 → コンテンツ → 遷移先
          </p>
        </div>
        <div className="flex items-center justify-center h-32">
          <p className="text-sm" style={{ color: "var(--dash-text-muted)" }}>
            GA4のデータが蓄積されるとフロー図が表示されます
          </p>
        </div>
      </div>

      {/* User Journey */}
      <div
        className="rounded-xl border p-5"
        style={{
          background: "var(--dash-card)",
          borderColor: "var(--dash-border)",
        }}
      >
        <div className="mb-3">
          <h3 className="text-sm font-semibold" style={{ color: "var(--dash-text)" }}>
            ユーザージャーニー
          </h3>
          <p className="text-xs mt-0.5" style={{ color: "var(--dash-text-muted)" }}>
            0件
          </p>
        </div>
        <div className="flex items-center justify-center h-32">
          <p className="text-sm" style={{ color: "var(--dash-text-muted)" }}>
            GA4のデータが蓄積されるとジャーニー分析が表示されます
          </p>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { label: "トラッキング数", value: "0", color: "var(--dash-blue)" },
          { label: "CV数", value: "0", color: "var(--dash-green)" },
          { label: "CV前の平均閲覧数", value: "0ページ", color: "var(--dash-purple)" },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-xl border px-4 py-3 flex items-center gap-3"
            style={{
              background: "var(--dash-card)",
              borderColor: "var(--dash-border)",
            }}
          >
            <div
              className="w-1 h-8 rounded-full shrink-0"
              style={{ background: s.color }}
            />
            <div>
              <div
                className="text-[10px] font-semibold uppercase tracking-wider"
                style={{ color: "var(--dash-text-muted)" }}
              >
                {s.label}
              </div>
              <div
                className="text-lg font-bold tabular-nums"
                style={{ color: "var(--dash-text)" }}
              >
                {s.value}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
