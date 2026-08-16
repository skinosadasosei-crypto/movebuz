"use client";

import { useState, useEffect, useCallback } from "react";

interface Submission {
  id: string;
  company: string;
  name: string;
  email: string;
  phone: string;
  plan: string;
  message: string;
  submittedAt: string;
  read: boolean;
}

export default function ContactsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Submission | null>(null);

  const fetchSubmissions = useCallback(async () => {
    try {
      const res = await fetch("/api/dashboard/contacts");
      const data = await res.json();
      setSubmissions(data.submissions || []);
    } catch {
      setSubmissions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  async function markAsRead(id: string) {
    await fetch("/api/dashboard/contacts", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setSubmissions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, read: true } : s))
    );
  }

  async function handleDelete(id: string) {
    if (!confirm("この問い合わせを削除しますか？")) return;
    await fetch("/api/dashboard/contacts", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setSubmissions((prev) => prev.filter((s) => s.id !== id));
    if (selected?.id === id) setSelected(null);
  }

  function openDetail(s: Submission) {
    setSelected(s);
    if (!s.read) markAsRead(s.id);
  }

  const unreadCount = submissions.filter((s) => !s.read).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-sm" style={{ color: "var(--dash-text-secondary)" }}>読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-bold" style={{ color: "var(--dash-text)" }}>受信ボックス</h2>
          {unreadCount > 0 && (
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: "var(--dash-red-light)", color: "var(--dash-red)" }}>
              {unreadCount}件 未読
            </span>
          )}
        </div>
        <button
          onClick={fetchSubmissions}
          className="text-xs px-3 py-1.5 rounded-lg border hover:opacity-80 transition-opacity"
          style={{ borderColor: "var(--dash-border)", color: "var(--dash-text-secondary)" }}
        >
          更新
        </button>
      </div>

      {submissions.length === 0 ? (
        <div className="rounded-xl border p-12 text-center" style={{ background: "var(--dash-card)", borderColor: "var(--dash-border)" }}>
          <svg className="w-12 h-12 mx-auto mb-3" style={{ color: "var(--dash-text-secondary)" }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,13 2,6" />
          </svg>
          <p className="text-sm font-medium" style={{ color: "var(--dash-text)" }}>問い合わせはまだありません</p>
          <p className="text-xs mt-1" style={{ color: "var(--dash-text-secondary)" }}>
            サイトのお問い合わせフォームから送信された内容がここに表示されます
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          {/* List */}
          <div className="xl:col-span-1 rounded-xl border overflow-hidden" style={{ background: "var(--dash-card)", borderColor: "var(--dash-border)" }}>
            <div className="divide-y" style={{ borderColor: "var(--dash-border)" }}>
              {submissions.map((s) => (
                <button
                  key={s.id}
                  onClick={() => openDetail(s)}
                  className="w-full text-left px-4 py-3 hover:opacity-80 transition-opacity"
                  style={{
                    background: selected?.id === s.id ? "var(--dash-blue-light)" : !s.read ? "rgba(59, 130, 246, 0.03)" : "transparent",
                    borderColor: "var(--dash-border)",
                  }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="flex items-center gap-1.5">
                      {!s.read && <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />}
                      <span className="text-xs font-semibold truncate max-w-[160px]" style={{ color: "var(--dash-text)" }}>
                        {s.company}
                      </span>
                    </span>
                    <span className="text-[10px] shrink-0" style={{ color: "var(--dash-text-secondary)" }}>
                      {formatDate(s.submittedAt)}
                    </span>
                  </div>
                  <p className="text-[11px] mb-0.5" style={{ color: "var(--dash-text-secondary)" }}>
                    {s.name} &lt;{s.email}&gt;
                  </p>
                  <p className="text-xs truncate" style={{ color: "var(--dash-text-secondary)" }}>
                    {s.message}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Detail */}
          <div className="xl:col-span-2 rounded-xl border" style={{ background: "var(--dash-card)", borderColor: "var(--dash-border)" }}>
            {selected ? (
              <div className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-base font-bold" style={{ color: "var(--dash-text)" }}>{selected.company}</h3>
                    <p className="text-xs mt-0.5" style={{ color: "var(--dash-text-secondary)" }}>
                      {formatDateTime(selected.submittedAt)}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(selected.id)}
                    className="text-xs px-2.5 py-1 rounded-lg border hover:opacity-80 transition-opacity"
                    style={{ borderColor: "var(--dash-border)", color: "var(--dash-red)" }}
                  >
                    削除
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-5">
                  <InfoField label="お名前" value={selected.name} />
                  <InfoField label="メールアドレス" value={selected.email} link={`mailto:${selected.email}`} />
                  <InfoField label="電話番号" value={selected.phone || "—"} />
                  <InfoField label="ご興味のあるサービス" value={selected.plan || "未選択"} />
                </div>

                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: "var(--dash-text-secondary)" }}>
                    お問い合わせ内容
                  </p>
                  <div
                    className="rounded-lg p-3 text-sm leading-relaxed whitespace-pre-wrap"
                    style={{ background: "var(--dash-bg)", color: "var(--dash-text)" }}
                  >
                    {selected.message}
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <a
                    href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(selected.email)}&su=${encodeURIComponent("【MOVeBUZ】お問い合わせの件")}&body=${encodeURIComponent(`${selected.name} 様\n\nお問い合わせいただきありがとうございます。\n\n`)}&authuser=${encodeURIComponent("skinosada.sosei@gmail.com")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-lg text-white hover:opacity-90 transition-opacity"
                    style={{ background: "var(--dash-blue)" }}
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                    Gmailで返信
                  </a>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-64">
                <p className="text-sm" style={{ color: "var(--dash-text-secondary)" }}>
                  左のリストから問い合わせを選択してください
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function InfoField({ label, value, link }: { label: string; value: string; link?: string }) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-wider mb-0.5" style={{ color: "var(--dash-text-secondary)" }}>
        {label}
      </p>
      {link ? (
        <a href={link} className="text-sm font-medium hover:underline" style={{ color: "var(--dash-blue)" }}>
          {value}
        </a>
      ) : (
        <p className="text-sm font-medium" style={{ color: "var(--dash-text)" }}>{value}</p>
      )}
    </div>
  );
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

function formatDateTime(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()} ${d.getHours()}:${String(d.getMinutes()).padStart(2, "0")}`;
}
