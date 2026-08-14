import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-foreground text-white mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 font-bold text-lg mb-4">
              <span className="text-xl">▶</span>
              <span>動画のミカタ</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              企業のYouTube運用を成功に導く情報メディア。
              チャンネル開設から運用代行まで、動画マーケティングの全てをサポートします。
            </p>
          </div>

          <div>
            <h3 className="font-bold mb-4">カテゴリー</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/blog?category=youtube-basics" className="hover:text-white transition-colors">YouTube運用の基礎</Link></li>
              <li><Link href="/blog?category=video-production" className="hover:text-white transition-colors">動画制作ノウハウ</Link></li>
              <li><Link href="/blog?category=channel-growth" className="hover:text-white transition-colors">チャンネル成長戦略</Link></li>
              <li><Link href="/blog?category=case-study" className="hover:text-white transition-colors">成功事例</Link></li>
              <li><Link href="/blog?category=outsourcing" className="hover:text-white transition-colors">外注・運用代行</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-4">サービス</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/about" className="hover:text-white transition-colors">サービス紹介</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">無料相談</Link></li>
            </ul>
            <div className="mt-6">
              <Link
                href="/contact"
                className="inline-block bg-accent text-foreground font-bold px-6 py-3 rounded-lg hover:bg-yellow-400 transition-colors text-sm"
              >
                まずは無料で相談する →
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} 動画のミカタ All rights reserved.
        </div>
      </div>
    </footer>
  );
}
