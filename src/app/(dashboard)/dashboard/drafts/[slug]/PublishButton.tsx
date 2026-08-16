"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PublishButton({ slug, title }: { slug: string; title: string }) {
  const [publishing, setPublishing] = useState(false);
  const router = useRouter();

  async function handlePublish() {
    if (!confirm(`「${title}」を公開しますか？\n公開日は本日の日付になります。`)) return;
    setPublishing(true);
    try {
      const res = await fetch("/api/dashboard/drafts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug }),
      });
      if (res.ok) {
        router.push("/dashboard/drafts");
      } else {
        const data = await res.json();
        alert(data.error ?? "公開に失敗しました");
      }
    } catch {
      alert("通信エラーが発生しました");
    } finally {
      setPublishing(false);
    }
  }

  return (
    <button
      onClick={handlePublish}
      disabled={publishing}
      className="px-4 py-2 rounded-lg text-xs font-semibold text-white transition-opacity disabled:opacity-50"
      style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)" }}
    >
      {publishing ? "公開中..." : "公開する"}
    </button>
  );
}
