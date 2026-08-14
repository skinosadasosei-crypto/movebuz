"use client";

import { useState } from "react";

const FORMSPREE_ID = process.env.NEXT_PUBLIC_FORMSPREE_ID || "";

export default function ContactPage() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  if (status === "sent") {
    return (
      <section className="py-20">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="text-5xl mb-6">✉️</div>
          <h1 className="text-2xl font-bold mb-4">
            お問い合わせありがとうございます
          </h1>
          <p className="text-muted mb-8">
            内容を確認の上、2営業日以内にご連絡いたします。
          </p>
          <a
            href="/"
            className="inline-block bg-primary text-white px-6 py-3 rounded-lg font-bold hover:bg-primary-dark transition-colors"
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

    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
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
    <section className="py-12">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-2">無料相談・お問い合わせ</h1>
        <p className="text-muted mb-8">
          YouTube運用に関するご質問やご相談は、下記フォームよりお気軽にどうぞ。
          <br />
          ※ 無理な営業は一切行いません。
        </p>

        {status === "error" && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            送信に失敗しました。時間をおいて再度お試しください。
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              会社名 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="company"
              required
              className="w-full border border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="株式会社○○"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              お名前 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              required
              className="w-full border border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="山田 太郎"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              メールアドレス <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              required
              className="w-full border border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="info@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              電話番号
            </label>
            <input
              type="tel"
              name="phone"
              className="w-full border border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="03-1234-5678"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              ご興味のあるプラン
            </label>
            <select
              name="plan"
              className="w-full border border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">選択してください</option>
              <option value="ライトプラン（月30万円〜）">ライトプラン（月30万円〜）</option>
              <option value="スタンダードプラン（月40万円〜）">スタンダードプラン（月40万円〜）</option>
              <option value="プレミアムプラン（月50万円〜）">プレミアムプラン（月50万円〜）</option>
              <option value="カスタムプラン">カスタムプラン</option>
              <option value="まだ決まっていない">まだ決まっていない</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              お問い合わせ内容 <span className="text-red-500">*</span>
            </label>
            <textarea
              name="message"
              required
              rows={5}
              className="w-full border border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="YouTube運用について相談したいことをご記入ください"
            />
          </div>

          <button
            type="submit"
            disabled={status === "sending"}
            className="w-full bg-primary text-white font-bold py-4 rounded-lg hover:bg-primary-dark transition-colors text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === "sending" ? "送信中..." : "無料で相談する"}
          </button>

          <p className="text-xs text-muted text-center">
            送信いただいた情報は、お問い合わせへの回答にのみ使用いたします。
          </p>
        </form>
      </div>
    </section>
  );
}
