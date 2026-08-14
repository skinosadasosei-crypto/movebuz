import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <Link href="/" className="ig-gradient-text text-lg font-bold">
              MOVeBUZ
            </Link>
            <p className="text-muted text-xs mt-3 leading-relaxed">
              企業のYouTube運用を成功に導く情報メディア。
              チャンネル開設から運用代行まで、動画マーケティングの全てをサポートします。
            </p>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">カテゴリー</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/blog?category=youtube-basics" className="text-foreground/70 hover:text-foreground transition-colors">YouTube運用の基礎</Link></li>
              <li><Link href="/blog?category=video-production" className="text-foreground/70 hover:text-foreground transition-colors">動画制作ノウハウ</Link></li>
              <li><Link href="/blog?category=channel-growth" className="text-foreground/70 hover:text-foreground transition-colors">チャンネル成長戦略</Link></li>
              <li><Link href="/blog?category=case-study" className="text-foreground/70 hover:text-foreground transition-colors">成功事例</Link></li>
              <li><Link href="/blog?category=outsourcing" className="text-foreground/70 hover:text-foreground transition-colors">外注・運用代行</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">リンク</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="text-foreground/70 hover:text-foreground transition-colors">サービス紹介</Link></li>
              <li><Link href="/contact" className="text-foreground/70 hover:text-foreground transition-colors">無料相談</Link></li>
              <li><a href="https://sosei-chiba.com/" target="_blank" rel="noopener noreferrer" className="text-foreground/70 hover:text-foreground transition-colors">運営会社</a></li>
            </ul>
            <Link
              href="/contact"
              className="inline-block ig-gradient text-white text-xs font-semibold px-5 py-2.5 rounded-full mt-4 hover:opacity-90 transition-opacity"
            >
              無料で相談する
            </Link>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-6 text-center text-xs text-muted">
          © {new Date().getFullYear()} MOVeBUZ
        </div>
      </div>
    </footer>
  );
}
