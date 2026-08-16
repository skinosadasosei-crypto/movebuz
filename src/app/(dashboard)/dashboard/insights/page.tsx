"use client";

export default function InsightsPage() {
  return (
    <div className="space-y-6 max-w-[1400px]">
      <div>
        <h2
          className="text-lg font-bold"
          style={{ color: "var(--dash-text)" }}
        >
          改善提案
        </h2>
        <p
          className="text-sm mt-0.5"
          style={{ color: "var(--dash-text-secondary)" }}
        >
          データに基づく改善提案
        </p>
      </div>

      <div
        className="rounded-xl border p-12 text-center"
        style={{
          background: "var(--dash-card)",
          borderColor: "var(--dash-border)",
        }}
      >
        <svg
          className="w-12 h-12 mx-auto mb-3"
          style={{ color: "var(--dash-text-muted)" }}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M9 18h6" />
          <path d="M10 22h4" />
          <path d="M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z" />
        </svg>
        <p
          className="text-sm font-medium"
          style={{ color: "var(--dash-text)" }}
        >
          改善提案はまだありません
        </p>
        <p
          className="text-xs mt-1"
          style={{ color: "var(--dash-text-secondary)" }}
        >
          GA4のデータが蓄積されると、アクセス分析に基づく改善提案が自動的に表示されます
        </p>
      </div>
    </div>
  );
}
