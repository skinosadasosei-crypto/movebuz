import type { Metadata } from "next";
import SoseiHeader from "@/components/SoseiHeader";

export const metadata: Metadata = {
  title: { absolute: "株式会社SOSEI | 地域共創型プロデュース・プロモーション支援" },
  description:
    "スポーツ・文化・食を起点に、企業とまちの共創をデザインする。地域活性化事業・プロモーション事業・営業支援を提供する株式会社SOSEI。",
  openGraph: {
    title: "株式会社SOSEI | 地域共創型プロデュース・プロモーション支援",
    description: "地域の熱量を、事業成果へ。企業とまちの共創をデザインする株式会社SOSEI。",
    url: "https://sosei-chiba.com",
    type: "website",
    locale: "ja_JP",
    siteName: "株式会社SOSEI",
  },
};

export default function SoseiLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SoseiHeader />
      <main className="flex-1">{children}</main>
      <footer className="bg-foreground text-white">
        <div className="max-w-5xl mx-auto px-4 py-12">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <span className="text-2xl font-bold tracking-tight">SOSEI</span>
              <p className="text-white/60 text-xs mt-3 leading-relaxed">
                地域の熱量を、事業成果へ。
                <br />
                企業とまちの"共創"をデザインする。
              </p>
            </div>
            <div>
              <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">事業内容</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#services" className="text-white/70 hover:text-white transition-colors">地域活性化事業</a></li>
                <li><a href="#services" className="text-white/70 hover:text-white transition-colors">プロモーション事業</a></li>
                <li><a href="#services" className="text-white/70 hover:text-white transition-colors">営業支援</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">お問い合わせ</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="mailto:skinosada.sosei@gmail.com" className="text-white/70 hover:text-white transition-colors">skinosada.sosei@gmail.com</a></li>
                <li><a href="tel:09010798514" className="text-white/70 hover:text-white transition-colors">090-1079-8514</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 mt-8 pt-6 text-center text-xs text-white/40">
            &copy; {new Date().getFullYear()} SOSEI Inc.
          </div>
        </div>
      </footer>
    </>
  );
}
