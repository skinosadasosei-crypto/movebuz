"use client";

import { useState } from "react";

export default function ContactPage() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  if (status === "sent") {
    return (
      <section className="py-24">
        <div className="max-w-md mx-auto px-4 text-center">
          <div className="w-16 h-16 rounded-full ig-gradient flex items-center justify-center text-2xl mx-auto mb-6">
            ✉️
          </div>
          <h1 className="text-xl font-bold mb-3">
            お問い合わせありがとうございます
          </h1>
          <p className="text-muted text-sm mb-8">
            内容を確認の上、2営業日以内にご連絡いたします。
          </p>
          <a
            href="/"
            className="inline-block border border-border text-foreground font-semibold px-6 py-2.5 rounded-full hover:bg-card transition-colors text-sm"
          >
            トップに戻る
          </a>
        </div>
      </section>
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");

    const form = e.currentTarget;
    const data = new FormData(form);
    const body = {
      company: data.get("company"),
      name: data.get("name"),
      email: data.get("email"),
      phone: data.get("phone"),
      plan: data.get("plan"),
      message: data.get("message"),
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        setStatus("sent");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <section className="py-16">
      <div className="max-w-lg mx-auto px-4">
        <div className="text-center mb-10">
          <div className="inline-block ig-gradient text-white text-xs font-semibold px-4 py-1.5 rounded-full mb-4">
            Contact
          </div>
          <h1 className="text-2xl font-bold mb-2 tracking-tight">無料相談・お問い合わせ</h1>
          <p className="text-muted text-sm">
            YouTube運用に関するご相談はお気軽にどうぞ。
          </p>
        </div>

        {status === "error" && (
          <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl mb-6">
            送信に失敗しました。時間をおいて再度お試しください。
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-medium text-muted mb-1.5">
              会社名 <span className="text-primary">*</span>
            </label>
            <input
              type="text"
              name="company"
              required
              className="w-full bg-card border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              placeholder="株式会社○○"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-muted mb-1.5">
              お名前 <span className="text-primary">*</span>
            </label>
            <input
              type="text"
              name="name"
              required
              className="w-full bg-card border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              placeholder="山田 太郎"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-muted mb-1.5">
              メールアドレス <span className="text-primary">*</span>
            </label>
            <input
              type="email"
              name="email"
              required
              className="w-full bg-card border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              placeholder="info@example.com"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-muted mb-1.5">
              電話番号
            </label>
            <input
              type="tel"
              name="phone"
              className="w-full bg-card border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              placeholder="03-1234-5678"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-muted mb-1.5">
              ご興味のあるサービス
            </label>
            <select
              name="plan"
              className="w-full bg-card border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
            >
              <option value="">選択してください</option>
              <option value="YouTube運用代行">YouTube運用代行</option>
              <option value="動画制作のみ">動画制作のみ</option>
              <option value="コンサルティング">コンサルティング</option>
              <option value="その他">その他・まだ決まっていない</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-muted mb-1.5">
              お問い合わせ内容 <span className="text-primary">*</span>
            </label>
            <textarea
              name="message"
              required
              rows={4}
              className="w-full bg-card border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all resize-none"
              placeholder="YouTube運用について相談したいことをご記入ください"
            />
          </div>

          <button
            type="submit"
            disabled={status === "sending"}
            className="w-full ig-gradient text-white font-semibold py-3.5 rounded-full hover:opacity-90 transition-opacity text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === "sending" ? "送信中..." : "無料で相談する"}
          </button>

          <p className="text-[11px] text-muted text-center">
            ※ 無理な営業は一切行いません。送信いただいた情報はお問い合わせへの回答にのみ使用します。
          </p>
        </form>
      </div>
    </section>
  );
}
