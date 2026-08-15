"use client";

import { useState, useMemo } from "react";
import ChartCard from "@/components/dashboard/ChartCard";
import { flowNodes, flowLinks, userJourneys } from "@/lib/dashboard/mock-data";
import type { FlowNode, FlowLink, UserJourney } from "@/lib/dashboard/types";

/* ------------------------------------------------------------------ */
/* Helpers                                                            */
/* ------------------------------------------------------------------ */

const SOURCE_IDS = ["organic", "direct", "social", "referral"];
const CONTENT_IDS = ["blog_cost", "blog_views", "blog_btob", "blog_other"];
const DEST_IDS = ["about", "service", "contact", "conversion", "exit"];

function nodeById(id: string): FlowNode | undefined {
  return flowNodes.find((n) => n.id === id);
}

function formatDuration(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

const COLUMN_COLORS: Record<string, string> = {
  organic: "var(--dash-blue)",
  direct: "var(--dash-purple)",
  social: "#ec4899",
  referral: "var(--dash-amber)",
  blog_cost: "var(--dash-blue)",
  blog_views: "var(--dash-green)",
  blog_btob: "var(--dash-purple)",
  blog_other: "var(--dash-text-muted)",
  about: "var(--dash-purple)",
  service: "var(--dash-blue)",
  contact: "var(--dash-amber)",
  conversion: "var(--dash-green)",
  exit: "var(--dash-red)",
};

/* ------------------------------------------------------------------ */
/* Flow Diagram                                                       */
/* ------------------------------------------------------------------ */

function FlowColumn({
  title,
  nodeIds,
}: {
  title: string;
  nodeIds: string[];
}) {
  return (
    <div className="flex flex-col gap-2 min-w-[140px] flex-1">
      <div
        className="text-[10px] font-semibold uppercase tracking-wider mb-1 text-center"
        style={{ color: "var(--dash-text-muted)" }}
      >
        {title}
      </div>
      {nodeIds.map((id) => {
        const node = nodeById(id);
        if (!node) return null;
        const color = COLUMN_COLORS[id] || "var(--dash-text-muted)";
        return (
          <div
            key={id}
            className="rounded-lg border px-3 py-2.5 flex items-center gap-2"
            style={{
              borderColor: "var(--dash-border)",
              background: "var(--dash-card)",
            }}
          >
            <div
              className="w-1 self-stretch rounded-full shrink-0"
              style={{ background: color }}
            />
            <div className="min-w-0 flex-1">
              <div
                className="text-xs font-medium truncate"
                style={{ color: "var(--dash-text)" }}
              >
                {node.label}
              </div>
              <div
                className="text-[11px] font-semibold tabular-nums"
                style={{ color }}
              >
                {node.value.toLocaleString()}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function FlowConnectors({
  fromIds,
  toIds,
}: {
  fromIds: string[];
  toIds: string[];
}) {
  const relevantLinks = flowLinks.filter(
    (l) => fromIds.includes(l.source) && toIds.includes(l.target)
  );
  const maxValue = Math.max(...relevantLinks.map((l) => l.value), 1);

  return (
    <div className="flex flex-col items-center justify-center gap-1 w-16 shrink-0">
      {relevantLinks.slice(0, 6).map((link, i) => {
        const ratio = link.value / maxValue;
        const height = Math.max(2, Math.round(ratio * 6));
        const opacity = 0.25 + ratio * 0.65;
        const color = COLUMN_COLORS[link.source] || "var(--dash-blue)";
        return (
          <div
            key={`${link.source}-${link.target}-${i}`}
            className="w-full rounded-full"
            style={{
              height: `${height}px`,
              background: color,
              opacity,
            }}
            title={`${nodeById(link.source)?.label} → ${nodeById(link.target)?.label}: ${link.value.toLocaleString()}`}
          />
        );
      })}
      <div
        className="text-[9px] mt-0.5 tabular-nums"
        style={{ color: "var(--dash-text-muted)" }}
      >
        {relevantLinks.reduce((s, l) => s + l.value, 0).toLocaleString()}
      </div>
    </div>
  );
}

function FlowDiagram() {
  return (
    <div className="flex items-stretch gap-0 overflow-x-auto pb-2">
      <FlowColumn title="流入元" nodeIds={SOURCE_IDS} />
      <FlowConnectors fromIds={SOURCE_IDS} toIds={CONTENT_IDS} />
      <FlowColumn title="コンテンツ" nodeIds={CONTENT_IDS} />
      <FlowConnectors fromIds={CONTENT_IDS} toIds={DEST_IDS} />
      <FlowColumn title="遷移先" nodeIds={DEST_IDS} />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Journey Card                                                       */
/* ------------------------------------------------------------------ */

function pageColor(url: string): { bg: string; border: string; text: string } {
  if (url === "/contact")
    return {
      bg: "var(--dash-blue-light)",
      border: "var(--dash-blue)",
      text: "var(--dash-blue)",
    };
  if (url.includes("about") || url.includes("service"))
    return {
      bg: "var(--dash-purple-light)",
      border: "var(--dash-purple)",
      text: "var(--dash-purple)",
    };
  return {
    bg: "#f8fafc",
    border: "var(--dash-border)",
    text: "var(--dash-text-secondary)",
  };
}

function SourceBadge({ source }: { source: string }) {
  let bg = "var(--dash-blue-light)";
  let color = "var(--dash-blue)";
  if (source.includes("Twitter") || source.includes("SNS")) {
    bg = "#f0f9ff";
    color = "#0ea5e9";
  } else if (source.includes("Facebook")) {
    bg = "#eff6ff";
    color = "#2563eb";
  } else if (source.includes("Instagram")) {
    bg = "var(--dash-purple-light)";
    color = "var(--dash-purple)";
  } else if (source.includes("Direct")) {
    bg = "#f8fafc";
    color = "var(--dash-text-secondary)";
  } else if (source.includes("Note")) {
    bg = "var(--dash-green-light)";
    color = "var(--dash-green)";
  }
  return (
    <span
      className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
      style={{ background: bg, color }}
    >
      {source}
    </span>
  );
}

function JourneyCard({ journey }: { journey: UserJourney }) {
  const pc = journey.converted
    ? { accent: "var(--dash-green)", accentLight: "var(--dash-green-light)" }
    : { accent: "var(--dash-border)", accentLight: "#f8fafc" };

  return (
    <div
      className="rounded-xl border p-4"
      style={{
        background: "var(--dash-card)",
        borderColor: "var(--dash-border)",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span
            className="text-xs font-mono font-medium"
            style={{ color: "var(--dash-text-secondary)" }}
          >
            {journey.anonymousId}
          </span>
          <SourceBadge source={journey.source} />
        </div>
        <div className="flex items-center gap-2">
          {journey.ctaClicked && (
            <span
              className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
              style={{
                background: "var(--dash-blue-light)",
                color: "var(--dash-blue)",
              }}
            >
              CTA
            </span>
          )}
          {journey.converted ? (
            <span
              className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
              style={{
                background: "var(--dash-green-light)",
                color: "var(--dash-green)",
              }}
            >
              CV
            </span>
          ) : (
            <span
              className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
              style={{
                background: "#f8fafc",
                color: "var(--dash-text-muted)",
              }}
            >
              未CV
            </span>
          )}
        </div>
      </div>

      {/* Page Timeline */}
      <div className="flex items-start gap-0 overflow-x-auto pb-1">
        {journey.pages.map((page, i) => {
          const colors = pageColor(page.url);
          const isLast = i === journey.pages.length - 1;
          const isContact = page.url === "/contact";
          return (
            <div key={i} className="flex items-center shrink-0">
              <div
                className="rounded-lg border px-2.5 py-1.5 min-w-[100px] max-w-[160px]"
                style={{
                  background: colors.bg,
                  borderColor: colors.border,
                }}
              >
                <div
                  className="text-[11px] font-medium truncate"
                  style={{
                    color: isContact ? colors.text : "var(--dash-text)",
                  }}
                >
                  {page.title}
                </div>
                <div
                  className="text-[10px] tabular-nums mt-0.5"
                  style={{ color: "var(--dash-text-muted)" }}
                >
                  {formatDuration(page.duration)}
                </div>
              </div>
              {!isLast && (
                <svg
                  className="w-5 h-5 shrink-0 mx-0.5"
                  viewBox="0 0 20 20"
                  fill="none"
                >
                  <path
                    d="M7 4l6 6-6 6"
                    stroke="var(--dash-text-muted)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity={0.5}
                  />
                </svg>
              )}
            </div>
          );
        })}
        {/* Conversion indicator */}
        {journey.converted && (
          <div className="flex items-center shrink-0">
            <svg
              className="w-5 h-5 shrink-0 mx-0.5"
              viewBox="0 0 20 20"
              fill="none"
            >
              <path
                d="M7 4l6 6-6 6"
                stroke="var(--dash-green)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div
              className="rounded-lg border px-2.5 py-1.5 min-w-[80px]"
              style={{
                background: "var(--dash-green-light)",
                borderColor: "var(--dash-green)",
              }}
            >
              <div
                className="text-[11px] font-semibold"
                style={{ color: "var(--dash-green)" }}
              >
                CV完了
              </div>
              <div
                className="text-[10px] tabular-nums mt-0.5"
                style={{ color: "var(--dash-text-muted)" }}
              >
                {journey.convertedAt}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Summary Stats                                                      */
/* ------------------------------------------------------------------ */

function SummaryStats({ journeys }: { journeys: UserJourney[] }) {
  const total = journeys.length;
  const cvJourneys = journeys.filter((j) => j.converted);
  const cvCount = cvJourneys.length;
  const avgPagesBeforeCV =
    cvCount > 0
      ? (cvJourneys.reduce((s, j) => s + j.pages.length, 0) / cvCount).toFixed(
          1
        )
      : "-";

  // Most common path: find most frequent landing page among CV users
  const pathCounts: Record<string, number> = {};
  cvJourneys.forEach((j) => {
    const path = j.pages.map((p) => p.title).join(" → ");
    pathCounts[path] = (pathCounts[path] || 0) + 1;
  });
  const commonPath =
    Object.entries(pathCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "-";

  const stats = [
    { label: "トラッキング数", value: String(total), color: "var(--dash-blue)" },
    { label: "CV数", value: String(cvCount), color: "var(--dash-green)" },
    {
      label: "CV前の平均閲覧数",
      value: `${avgPagesBeforeCV}ページ`,
      color: "var(--dash-purple)",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {stats.map((s) => (
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
      <div
        className="rounded-xl border px-4 py-3 sm:col-span-3"
        style={{
          background: "var(--dash-card)",
          borderColor: "var(--dash-border)",
        }}
      >
        <div
          className="text-[10px] font-semibold uppercase tracking-wider mb-1"
          style={{ color: "var(--dash-text-muted)" }}
        >
          最多CVパス
        </div>
        <div
          className="text-xs font-medium leading-relaxed"
          style={{ color: "var(--dash-text)" }}
        >
          {commonPath}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page Component                                                     */
/* ------------------------------------------------------------------ */

export default function UserFlowPage() {
  const [filter, setFilter] = useState<"all" | "cv">("all");

  const filteredJourneys = useMemo(
    () =>
      filter === "cv"
        ? userJourneys.filter((j) => j.converted)
        : userJourneys,
    [filter]
  );

  return (
    <div className="space-y-6 max-w-[1400px]">
      {/* Section 1: Flow Diagram */}
      <ChartCard
        title="ユーザーフロー"
        subtitle="流入元 → コンテンツ → 遷移先"
      >
        <FlowDiagram />
      </ChartCard>

      {/* Section 2: User Journey List */}
      <ChartCard title="ユーザージャーニー" subtitle={`${filteredJourneys.length}件`}>
        {/* Filter toggle */}
        <div className="flex items-center gap-1 mb-4">
          {(
            [
              { key: "all", label: "すべて" },
              { key: "cv", label: "CVした" },
            ] as const
          ).map((opt) => (
            <button
              key={opt.key}
              onClick={() => setFilter(opt.key)}
              className="px-3 py-1 rounded-full text-xs font-medium transition-colors"
              style={{
                background:
                  filter === opt.key
                    ? "var(--dash-blue)"
                    : "transparent",
                color:
                  filter === opt.key
                    ? "#ffffff"
                    : "var(--dash-text-secondary)",
                border:
                  filter === opt.key
                    ? "1px solid var(--dash-blue)"
                    : "1px solid var(--dash-border)",
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Journey Cards */}
        <div className="space-y-3">
          {filteredJourneys.map((journey) => (
            <JourneyCard key={journey.anonymousId} journey={journey} />
          ))}
        </div>
      </ChartCard>

      {/* Section 3: Summary Stats */}
      <ChartCard title="サマリー" subtitle="ジャーニー統計">
        <SummaryStats journeys={userJourneys} />
      </ChartCard>
    </div>
  );
}
