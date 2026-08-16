import { notFound } from "next/navigation";
import Link from "next/link";
import { getDraftBySlug } from "@/lib/articles";
import PublishButton from "./PublishButton";

const categoryLabels: Record<string, string> = {
  "youtube-basics": "YouTube運用の基礎",
  "video-production": "動画制作ノウハウ",
  "channel-growth": "チャンネル成長戦略",
  "case-study": "成功事例",
  outsourcing: "外注・運用代行",
};

export default async function DraftPreviewPage(
  props: { params: Promise<{ slug: string }> }
) {
  const { slug } = await props.params;
  const draft = await getDraftBySlug(slug);
  if (!draft) notFound();

  return (
    <div className="max-w-[1000px] space-y-4">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard/drafts"
          className="text-xs flex items-center gap-1 hover:opacity-70 transition-opacity"
          style={{ color: "var(--dash-blue)" }}
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="15 18 9 12 15 6" /></svg>
          下書き一覧に戻る
        </Link>
        <PublishButton slug={slug} title={draft.title} />
      </div>

      {/* Draft banner */}
      <div
        className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-medium"
        style={{ background: "var(--dash-amber-light)", color: "var(--dash-amber)" }}
      >
        <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
        下書きプレビュー — この記事はまだ公開されていません
      </div>

      {/* Article preview */}
      <div
        className="rounded-xl border overflow-hidden"
        style={{ background: "var(--dash-card)", borderColor: "var(--dash-border)" }}
      >
        {/* Article header */}
        <div className="p-6 border-b" style={{ borderColor: "var(--dash-border)" }}>
          <div className="flex items-center gap-3 mb-3">
            <span
              className="text-[11px] font-medium px-2.5 py-1 rounded-full text-white"
              style={{ background: "linear-gradient(135deg, #f97316, #ec4899)" }}
            >
              {categoryLabels[draft.category] ?? draft.category}
            </span>
            <span className="text-xs" style={{ color: "var(--dash-text-muted)" }}>
              予定日: {draft.date}
            </span>
          </div>
          <h1 className="text-xl font-bold leading-tight" style={{ color: "var(--dash-text)" }}>
            {draft.title}
          </h1>
          <p className="text-sm mt-2" style={{ color: "var(--dash-text-muted)" }}>
            {draft.description}
          </p>
          {draft.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {draft.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[11px] px-2 py-0.5 rounded-full"
                  style={{ background: "var(--dash-border)", color: "var(--dash-text-secondary)" }}
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Article body */}
        <div className="p-6">
          <div
            className="draft-article-content"
            dangerouslySetInnerHTML={{ __html: draft.content }}
          />
        </div>

        {/* FAQ section */}
        {draft.faq.length > 0 && (
          <div className="px-6 pb-6">
            <h2 className="text-lg font-bold mb-4" style={{ color: "var(--dash-text)" }}>
              よくある質問（FAQ）
            </h2>
            <div className="space-y-3">
              {draft.faq.map((item, i) => (
                <div
                  key={i}
                  className="rounded-lg border p-4"
                  style={{ borderColor: "var(--dash-border)" }}
                >
                  <div className="flex gap-2 mb-2">
                    <span className="text-xs font-bold shrink-0" style={{ color: "var(--dash-blue)" }}>Q</span>
                    <p className="text-sm font-semibold" style={{ color: "var(--dash-text)" }}>{item.question}</p>
                  </div>
                  <div className="flex gap-2 ml-0.5">
                    <span className="text-xs font-bold shrink-0" style={{ color: "var(--dash-text-muted)" }}>A</span>
                    <p className="text-sm" style={{ color: "var(--dash-text-secondary)" }}>{item.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`
        .draft-article-content {
          color: var(--dash-text);
          font-size: 14px;
          line-height: 1.8;
        }
        .draft-article-content h2 {
          font-size: 1.25rem;
          font-weight: 700;
          margin-top: 2rem;
          margin-bottom: 0.75rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid var(--dash-border);
          color: var(--dash-text);
        }
        .draft-article-content h3 {
          font-size: 1.05rem;
          font-weight: 600;
          margin-top: 1.5rem;
          margin-bottom: 0.5rem;
          color: var(--dash-text);
        }
        .draft-article-content p {
          margin-bottom: 1rem;
        }
        .draft-article-content ul, .draft-article-content ol {
          margin-bottom: 1rem;
          padding-left: 1.5rem;
        }
        .draft-article-content li {
          margin-bottom: 0.35rem;
        }
        .draft-article-content strong {
          color: var(--dash-text);
          font-weight: 600;
        }
        .draft-article-content blockquote {
          border-left: 3px solid var(--dash-blue);
          padding: 0.75rem 1rem;
          margin: 1rem 0;
          border-radius: 0 0.5rem 0.5rem 0;
          background: var(--dash-blue-light);
          color: var(--dash-text-secondary);
        }
        .draft-article-content a {
          color: var(--dash-blue);
          text-decoration: underline;
        }
        .draft-article-content img {
          max-width: 100%;
          border-radius: 0.5rem;
          margin: 1rem 0;
        }
        .draft-article-content table {
          width: 100%;
          border-collapse: collapse;
          margin: 1rem 0;
          font-size: 13px;
        }
        .draft-article-content th, .draft-article-content td {
          border: 1px solid var(--dash-border);
          padding: 0.5rem 0.75rem;
          text-align: left;
        }
        .draft-article-content th {
          background: var(--dash-border);
          font-weight: 600;
        }
      `}</style>
    </div>
  );
}
