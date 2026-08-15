"use client";

import { useState, useMemo } from "react";
import ChartCard from "@/components/dashboard/ChartCard";
import { insights } from "@/lib/dashboard/mock-data";
import type { Insight } from "@/lib/dashboard/types";
import Link from "next/link";

/* ------------------------------------------------------------------ */
/* Constants                                                          */
/* ------------------------------------------------------------------ */

const TYPE_STYLES: Record<
  Insight["type"],
  { bg: string; border: string; icon: string }
> = {
  warning: {
    bg: "var(--dash-amber-light)",
    border: "var(--dash-amber)",
    icon: "var(--dash-amber)",
  },
  success: {
    bg: "var(--dash-green-light)",
    border: "var(--dash-green)",
    icon: "var(--dash-green)",
  },
  info: {
    bg: "var(--dash-blue-light)",
    border: "var(--dash-blue)",
    icon: "var(--dash-blue)",
  },
  danger: {
    bg: "var(--dash-red-light)",
    border: "var(--dash-red)",
    icon: "var(--dash-red)",
  },
};

const FILTER_OPTIONS = [
  "すべて",
  "CVR改善",
  "CV貢献",
  "CTR改善",
  "離脱率",
  "SEO",
  "ファネル",
] as const;

/* ------------------------------------------------------------------ */
/* Type Icon                                                          */
/* ------------------------------------------------------------------ */

function TypeIcon({
  type,
  color,
}: {
  type: Insight["type"];
  color: string;
}) {
  const cls = "w-5 h-5";
  switch (type) {
    case "warning":
      return (
        <svg
          className={cls}
          style={{ color }}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      );
    case "success":
      return (
        <svg
          className={cls}
          style={{ color }}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      );
    case "info":
      return (
        <svg
          className={cls}
          style={{ color }}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
      );
    case "danger":
      return (
        <svg
          className={cls}
          style={{ color }}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="15" y1="9" x2="9" y2="15" />
          <line x1="9" y1="9" x2="15" y2="15" />
        </svg>
      );
  }
}

/* ------------------------------------------------------------------ */
/* Insight Card                                                       */
/* ------------------------------------------------------------------ */

function InsightCard({ insight }: { insight: Insight }) {
  const s = TYPE_STYLES[insight.type];

  return (
    <div
      className="rounded-xl border-l-[4px] border p-5"
      style={{
        background: "var(--dash-card)",
        borderColor: "var(--dash-border)",
        borderLeftColor: s.border,
      }}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className="shrink-0 mt-0.5">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center"
            style={{ background: s.bg }}
          >
            <TypeIcon type={insight.type} color={s.icon} />
          </div>
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          {/* Category + Metric badges */}
          <div className="flex items-center gap-2 mb-1.5">
            <span
              className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded"
              style={{ background: s.bg, color: s.icon }}
            >
              {insight.category}
            </span>
            {insight.metric && (
              <span
                className="text-[10px] font-mono px-2 py-0.5 rounded"
                style={{
                  background: "#f1f5f9",
                  color: "var(--dash-text-secondary)",
                }}
              >
                {insight.metric}
              </span>
            )}
          </div>

          {/* Title */}
          <h4
            className="text-sm font-bold mb-1"
            style={{ color: "var(--dash-text)" }}
          >
            {insight.title}
          </h4>

          {/* Description */}
          <p
            className="text-xs leading-relaxed mb-3"
            style={{ color: "var(--dash-text-secondary)" }}
          >
            {insight.description}
          </p>

          {/* Action button */}
          {insight.actionLabel && (
            <Link
              href={
                insight.relatedPage
                  ? `/dashboard/articles/${insight.relatedPage.replace("/blog/", "")}`
                  : "#"
              }
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-opacity hover:opacity-80"
              style={{
                background: "var(--dash-blue)",
                color: "#ffffff",
              }}
            >
              {insight.actionLabel}
              <svg
                className="w-3 h-3"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page Component                                                     */
/* ------------------------------------------------------------------ */

export default function InsightsPage() {
  const [activeFilter, setActiveFilter] = useState("すべて");

  const filteredInsights = useMemo(() => {
    if (activeFilter === "すべて") return insights;
    return insights.filter((ins) => ins.category === activeFilter);
  }, [activeFilter]);

  return (
    <div className="space-y-6 max-w-[1400px]">
      {/* Summary bar */}
      <div
        className="rounded-xl border px-5 py-3 flex items-center justify-between"
        style={{
          background: "var(--dash-card)",
          borderColor: "var(--dash-border)",
        }}
      >
        <div className="flex items-center gap-2">
          <svg
            className="w-5 h-5"
            style={{ color: "var(--dash-amber)" }}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 18h6" />
            <path d="M10 22h4" />
            <path d="M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z" />
          </svg>
          <span
            className="text-sm font-semibold"
            style={{ color: "var(--dash-text)" }}
          >
            {filteredInsights.length}件の改善提案
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span
            className="text-[10px]"
            style={{ color: "var(--dash-text-muted)" }}
          >
            {insights.filter((i) => i.type === "danger").length}件 重要
          </span>
          <span
            className="w-2 h-2 rounded-full"
            style={{ background: "var(--dash-red)" }}
          />
        </div>
      </div>

      {/* Filter pills */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {FILTER_OPTIONS.map((opt) => {
          const isActive = activeFilter === opt;
          return (
            <button
              key={opt}
              onClick={() => setActiveFilter(opt)}
              className="px-3 py-1.5 rounded-full text-xs font-medium transition-colors"
              style={{
                background: isActive ? "var(--dash-blue)" : "transparent",
                color: isActive ? "#ffffff" : "var(--dash-text-secondary)",
                border: isActive
                  ? "1px solid var(--dash-blue)"
                  : "1px solid var(--dash-border)",
              }}
            >
              {opt}
            </button>
          );
        })}
      </div>

      {/* Insight cards */}
      <div className="space-y-3">
        {filteredInsights.map((insight) => (
          <InsightCard key={insight.id} insight={insight} />
        ))}
        {filteredInsights.length === 0 && (
          <div
            className="rounded-xl border p-8 text-center"
            style={{
              background: "var(--dash-card)",
              borderColor: "var(--dash-border)",
            }}
          >
            <p
              className="text-sm"
              style={{ color: "var(--dash-text-muted)" }}
            >
              該当する改善提案はありません
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
