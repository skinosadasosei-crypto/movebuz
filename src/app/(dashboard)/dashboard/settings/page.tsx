"use client";

import { useState, useEffect } from "react";
import ChartCard from "@/components/dashboard/ChartCard";

interface ConnectionStatus {
  ga4Configured: boolean;
  ga4MeasurementId: string | null;
}

export default function SettingsPage() {
  const [status, setStatus] = useState<ConnectionStatus | null>(null);

  useEffect(() => {
    fetch("/api/dashboard/status")
      .then((r) => r.json())
      .then(setStatus)
      .catch(() => setStatus({ ga4Configured: false, ga4MeasurementId: null }));
  }, []);

  const steps = [
    {
      num: 1,
      title: "Google Analytics 4 プロパティを作成",
      description: "Google Analytics にアクセスし、新しいGA4プロパティを作成します。",
      link: "https://analytics.google.com/",
      linkLabel: "Google Analytics を開く",
      done: !!status?.ga4MeasurementId,
    },
    {
      num: 2,
      title: "測定IDをVercel環境変数に追加",
      description:
        "GA4の管理画面からデータストリームの測定ID（G-XXXXXXXX）を取得し、Vercelの環境変数 NEXT_PUBLIC_GA_ID に設定します。",
      code: "vercel env add NEXT_PUBLIC_GA_ID production",
      done: !!status?.ga4MeasurementId,
    },
    {
      num: 3,
      title: "Google Cloud サービスアカウントを作成",
      description:
        "GA4 Data API を利用するため、Google Cloud Console でサービスアカウントを作成し、JSON鍵をダウンロードします。GA4プロパティの「閲覧者」権限を付与してください。",
      link: "https://console.cloud.google.com/apis/credentials",
      linkLabel: "Google Cloud Console を開く",
      done: status?.ga4Configured || false,
    },
    {
      num: 4,
      title: "サービスアカウントJSONをVercelに設定",
      description:
        "ダウンロードしたJSON鍵の内容をVercel環境変数 GA4_SERVICE_ACCOUNT_JSON に設定し、GA4プロパティID を GA4_PROPERTY_ID に設定します。",
      code: 'vercel env add GA4_SERVICE_ACCOUNT_JSON production\nvercel env add GA4_PROPERTY_ID production',
      done: status?.ga4Configured || false,
    },
    {
      num: 5,
      title: "再デプロイ",
      description:
        "環境変数を設定後、再デプロイすることでダッシュボードに実データが表示されます。",
      code: "vercel --prod",
      done: false,
    },
  ];

  return (
    <div className="space-y-6 max-w-[900px]">
      <div>
        <h2
          className="text-lg font-bold mb-1"
          style={{ color: "var(--dash-text)" }}
        >
          セットアップ
        </h2>
        <p
          className="text-sm"
          style={{ color: "var(--dash-text-secondary)" }}
        >
          ダッシュボードを実データで利用するための設定手順です。
        </p>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div
          className="rounded-xl border p-4 flex items-center gap-3"
          style={{
            background: "var(--dash-card)",
            borderColor: "var(--dash-border)",
          }}
        >
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
            style={{
              background: status?.ga4MeasurementId
                ? "var(--dash-green-light)"
                : "var(--dash-amber-light)",
            }}
          >
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke={
                status?.ga4MeasurementId
                  ? "var(--dash-green)"
                  : "var(--dash-amber)"
              }
              strokeWidth="2"
            >
              {status?.ga4MeasurementId ? (
                <polyline points="20 6 9 17 4 12" />
              ) : (
                <>
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </>
              )}
            </svg>
          </div>
          <div>
            <p
              className="text-xs font-medium"
              style={{ color: "var(--dash-text-secondary)" }}
            >
              GA4 トラッキング
            </p>
            <p
              className="text-sm font-semibold"
              style={{
                color: status?.ga4MeasurementId
                  ? "var(--dash-green)"
                  : "var(--dash-amber)",
              }}
            >
              {status?.ga4MeasurementId
                ? `有効 (${status.ga4MeasurementId})`
                : "未設定"}
            </p>
          </div>
        </div>

        <div
          className="rounded-xl border p-4 flex items-center gap-3"
          style={{
            background: "var(--dash-card)",
            borderColor: "var(--dash-border)",
          }}
        >
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
            style={{
              background: status?.ga4Configured
                ? "var(--dash-green-light)"
                : "var(--dash-amber-light)",
            }}
          >
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke={
                status?.ga4Configured
                  ? "var(--dash-green)"
                  : "var(--dash-amber)"
              }
              strokeWidth="2"
            >
              {status?.ga4Configured ? (
                <polyline points="20 6 9 17 4 12" />
              ) : (
                <>
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </>
              )}
            </svg>
          </div>
          <div>
            <p
              className="text-xs font-medium"
              style={{ color: "var(--dash-text-secondary)" }}
            >
              GA4 Data API
            </p>
            <p
              className="text-sm font-semibold"
              style={{
                color: status?.ga4Configured
                  ? "var(--dash-green)"
                  : "var(--dash-amber)",
              }}
            >
              {status?.ga4Configured ? "接続済み" : "未接続"}
            </p>
          </div>
        </div>
      </div>

      {/* Setup Steps */}
      <ChartCard title="セットアップ手順" subtitle="上から順に実施してください">
        <div className="space-y-6">
          {steps.map((step) => (
            <div key={step.num} className="flex gap-4">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold"
                style={{
                  background: step.done
                    ? "var(--dash-green)"
                    : "var(--dash-blue)",
                  color: "#fff",
                }}
              >
                {step.done ? "✓" : step.num}
              </div>
              <div className="flex-1 min-w-0">
                <h4
                  className="text-sm font-semibold mb-1"
                  style={{
                    color: step.done
                      ? "var(--dash-text-muted)"
                      : "var(--dash-text)",
                    textDecoration: step.done ? "line-through" : "none",
                  }}
                >
                  {step.title}
                </h4>
                <p
                  className="text-xs leading-relaxed mb-2"
                  style={{ color: "var(--dash-text-secondary)" }}
                >
                  {step.description}
                </p>
                {step.code && (
                  <pre
                    className="text-[11px] rounded-lg px-3 py-2 overflow-x-auto"
                    style={{
                      background: "#0f172a",
                      color: "#e2e8f0",
                    }}
                  >
                    {step.code}
                  </pre>
                )}
                {step.link && (
                  <a
                    href={step.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-medium mt-2 hover:underline"
                    style={{ color: "var(--dash-blue)" }}
                  >
                    {step.linkLabel}
                    <svg
                      className="w-3 h-3"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </ChartCard>

      {/* Data Mode Info */}
      <ChartCard title="データモードについて">
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <span
              className="text-[11px] font-semibold px-2 py-0.5 rounded-full shrink-0"
              style={{
                background: "var(--dash-amber-light)",
                color: "var(--dash-amber)",
              }}
            >
              デモ
            </span>
            <p
              className="text-xs"
              style={{ color: "var(--dash-text-secondary)" }}
            >
              GA4 Data API未接続時はサンプルデータが表示されます。ダッシュボードの操作感を確認できますが、実際のサイトデータではありません。
            </p>
          </div>
          <div className="flex items-start gap-3">
            <span
              className="text-[11px] font-semibold px-2 py-0.5 rounded-full shrink-0"
              style={{
                background: "var(--dash-green-light)",
                color: "var(--dash-green)",
              }}
            >
              実データ
            </span>
            <p
              className="text-xs"
              style={{ color: "var(--dash-text-secondary)" }}
            >
              GA4 Data API接続後は、Google Analyticsの実データがリアルタイムで表示されます。
            </p>
          </div>
        </div>
      </ChartCard>
    </div>
  );
}
