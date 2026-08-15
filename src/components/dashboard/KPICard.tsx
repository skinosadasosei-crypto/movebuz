"use client";

import type { KPICard as KPICardType } from "@/lib/dashboard/types";

export default function KPICard({ card }: { card: KPICardType }) {
  const isPositive = card.change >= 0;
  return (
    <div
      className="rounded-xl p-4 border"
      style={{ background: "var(--dash-card)", borderColor: "var(--dash-border)" }}
    >
      <p className="text-xs font-medium mb-1" style={{ color: "var(--dash-text-secondary)" }}>
        {card.label}
      </p>
      <p className="text-2xl font-bold tracking-tight" style={{ color: "var(--dash-text)" }}>
        {card.value}
      </p>
      <div className="flex items-center gap-1.5 mt-2">
        <span
          className="inline-flex items-center gap-0.5 text-xs font-medium px-1.5 py-0.5 rounded"
          style={{
            color: isPositive ? "var(--dash-green)" : "var(--dash-red)",
            background: isPositive ? "var(--dash-green-light)" : "var(--dash-red-light)",
          }}
        >
          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            {isPositive ? (
              <polyline points="18 15 12 9 6 15" />
            ) : (
              <polyline points="6 9 12 15 18 9" />
            )}
          </svg>
          {Math.abs(card.change).toFixed(1)}%
        </span>
        <span className="text-xs" style={{ color: "var(--dash-text-muted)" }}>
          {card.changeLabel}
        </span>
      </div>
    </div>
  );
}
