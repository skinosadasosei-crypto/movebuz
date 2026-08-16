"use client";

import { useState, useEffect, useCallback } from "react";

type Draft = {
  slug: string;
  title: string;
  description: string;
  date: string;
  category: string;
  tags: string[];
  faq: { question: string; answer: string }[];
};

const CATEGORY_LABELS: Record<string, { name: string; icon: string }> = {
  "youtube-basics": { name: "YouTube運用の基礎", icon: "📺" },
  "video-production": { name: "動画制作ノウハウ", icon: "🎬" },
  "channel-growth": { name: "チャンネル成長戦略", icon: "📈" },
  "case-study": { name: "成功事例", icon: "✅" },
  outsourcing: { name: "外注・運用代行", icon: "🤝" },
};

export default function DraftsPage() {
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchDrafts = useCallback(() => {
    setLoading(true);
    fetch("/api/dashboard/drafts")
      .then((r) => r.json())
      .then((data) => setDrafts(data.drafts ?? []))
      .catch(() => setDrafts([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchDrafts();
  }, [fetchDrafts]);

  async function handlePublish(slug: string, title: string) {
    if (!confirm(`「${title}」を公開しますか？\n公開日は本日の日付になります。`)) return;
    setPublishing(slug);
    setMessage(null);
    try {
      const res = await fetch("/api/dashboard/drafts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage({ type: "error", text: data.error ?? "公開に失敗しました" });
      } else {
        setMessage({ type: "success", text: `「${title}」を公開しました` });
        fetchDrafts();
      }
    } catch {
      setMessage({ type: "error", text: "通信エラーが発生しました" });
    } finally {
      setPublishing(null);
    }
  }

  const seoChecks = (draft: Draft) => {
    const checks = [];
    if (draft.faq && draft.faq.length > 0) checks.push({ ok: true, label: `FAQ ${draft.faq.length}件` });
    else checks.push({ ok: false, label: "FAQ未設定" });
    if (draft.description) checks.push({ ok: true, label: "description" });
    else checks.push({ ok: false, label: "description未設定" });
    if (draft.tags && draft.tags.length > 0) checks.push({ ok: true, label: `タグ ${draft.tags.length}件` });
    else checks.push({ ok: false, label: "タグ未設定" });
    if (draft.category && CATEGORY_LABELS[draft.category]) checks.push({ ok: true, label: "カテゴリ" });
    else checks.push({ ok: false, label: "カテゴリ未設定" });
    return checks;
  };

  return (
    <div className="space-y-6 max-w-[1000px]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold" style={{ color: "var(--dash-text)" }}>
            下書きストック
          </h2>
          <p className="text-xs mt-0.5" style={{ color: "var(--dash-text-muted)" }}>
            公開待ちの記事を管理します。公開すると本日の日付で掲載されます。
          </p>
        </div>
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold"
          style={{
            background: drafts.length >= 5 ? "var(--dash-green-light)" : "var(--dash-amber-light)",
            color: drafts.length >= 5 ? "var(--dash-green)" : "var(--dash-amber)",
          }}
        >
          <span>ストック {drafts.length}本</span>
          {drafts.length < 5 && <span>/ 目標5本</span>}
        </div>
      </div>

      {/* Message */}
      {message && (
        <div
          className="px-4 py-3 rounded-lg text-sm font-medium"
          style={{
            background: message.type === "success" ? "var(--dash-green-light)" : "#fef2f2",
            color: message.type === "success" ? "var(--dash-green)" : "var(--dash-red)",
          }}
        >
          {message.text}
        </div>
      )}

      {/* Stock bar */}
      {!loading && (
        <div
          className="rounded-xl border p-4"
          style={{ background: "var(--dash-card)", borderColor: "var(--dash-border)" }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium" style={{ color: "var(--dash-text-secondary)" }}>
              ストック状況
            </span>
            <span className="text-xs" style={{ color: "var(--dash-text-muted)" }}>
              {drafts.length} / 5本
            </span>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ background: "var(--dash-border)" }}>
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${Math.min((drafts.length / 5) * 100, 100)}%`,
                background: drafts.length >= 5
                  ? "var(--dash-green)"
                  : drafts.length >= 3
                    ? "var(--dash-amber)"
                    : "var(--dash-red)",
              }}
            />
          </div>
        </div>
      )}

      {/* Draft List */}
      {loading ? (
        <div className="flex items-center justify-center h-40">
          <p className="text-sm" style={{ color: "var(--dash-text-muted)" }}>読み込み中...</p>
        </div>
      ) : drafts.length === 0 ? (
        <div
          className="rounded-xl border p-8 text-center"
          style={{ background: "var(--dash-card)", borderColor: "var(--dash-border)" }}
        >
          <p className="text-sm font-medium" style={{ color: "var(--dash-text-secondary)" }}>
            下書き記事がありません
          </p>
          <p className="text-xs mt-1" style={{ color: "var(--dash-text-muted)" }}>
            content/drafts/ にMarkdownファイルを追加してください
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {drafts.map((draft) => {
            const cat = CATEGORY_LABELS[draft.category];
            const checks = seoChecks(draft);
            const allOk = checks.every((c) => c.ok);
            return (
              <div
                key={draft.slug}
                className="rounded-xl border p-5 transition-colors"
                style={{ background: "var(--dash-card)", borderColor: "var(--dash-border)" }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    {/* Category + scheduled date */}
                    <div className="flex items-center gap-2 mb-1.5">
                      {cat && (
                        <span
                          className="text-[11px] font-medium px-2 py-0.5 rounded-full"
                          style={{ background: "var(--dash-blue-light)", color: "var(--dash-blue)" }}
                        >
                          {cat.icon} {cat.name}
                        </span>
                      )}
                      <span className="text-[11px]" style={{ color: "var(--dash-text-muted)" }}>
                        予定日: {draft.date}
                      </span>
                    </div>

                    {/* Title */}
                    <h3
                      className="text-sm font-semibold truncate"
                      style={{ color: "var(--dash-text)" }}
                    >
                      {draft.title}
                    </h3>

                    {/* Description */}
                    <p
                      className="text-xs mt-1 line-clamp-2"
                      style={{ color: "var(--dash-text-muted)" }}
                    >
                      {draft.description}
                    </p>

                    {/* Tags */}
                    {draft.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {draft.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] px-1.5 py-0.5 rounded"
                            style={{ background: "var(--dash-border)", color: "var(--dash-text-secondary)" }}
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* SEO checks */}
                    <div className="flex items-center gap-2 mt-3">
                      {checks.map((check) => (
                        <span
                          key={check.label}
                          className="text-[10px] font-medium px-2 py-0.5 rounded-full flex items-center gap-1"
                          style={{
                            background: check.ok ? "var(--dash-green-light)" : "#fef2f2",
                            color: check.ok ? "var(--dash-green)" : "var(--dash-red)",
                          }}
                        >
                          {check.ok ? "✓" : "!"} {check.label}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Publish button */}
                  <button
                    onClick={() => handlePublish(draft.slug, draft.title)}
                    disabled={publishing === draft.slug || !allOk}
                    className="shrink-0 px-4 py-2 rounded-lg text-xs font-semibold text-white transition-opacity disabled:opacity-40"
                    style={{
                      background: allOk
                        ? "linear-gradient(135deg, #3b82f6, #8b5cf6)"
                        : "var(--dash-text-muted)",
                    }}
                    title={allOk ? "公開する" : "SEO対策が不足しています"}
                  >
                    {publishing === draft.slug ? "公開中..." : "公開する"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
