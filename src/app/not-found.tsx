import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ページが見つかりません",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md mx-auto px-4 text-center">
        <p className="text-6xl font-bold ig-gradient-text mb-4">404</p>
        <h1 className="text-xl font-bold mb-3">ページが見つかりません</h1>
        <p className="text-muted text-sm mb-8">
          お探しのページは移動・削除されたか、URLが間違っている可能性があります。
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-block ig-gradient text-white font-semibold px-6 py-2.5 rounded-full hover:opacity-90 transition-opacity text-sm"
          >
            トップに戻る
          </Link>
          <Link
            href="/blog"
            className="inline-block border border-border text-foreground font-semibold px-6 py-2.5 rounded-full hover:bg-card transition-colors text-sm"
          >
            記事一覧を見る
          </Link>
        </div>
      </div>
    </div>
  );
}
