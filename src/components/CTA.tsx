import Link from "next/link";

export default function CTA() {
  return (
    <section className="py-20">
      <div className="max-w-3xl mx-auto px-4">
        <div className="ig-gradient rounded-3xl p-10 md:p-14 text-center text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10" />
          <div className="relative">
            <h2 className="text-2xl md:text-3xl font-bold mb-3 leading-tight">
              YouTube運用、
              <br className="md:hidden" />
              プロに任せてみませんか？
            </h2>
            <p className="text-white/80 text-sm md:text-base mb-8 leading-relaxed">
              企画から撮影・編集・分析まで、チャンネル運用を丸ごとサポート。
              <br className="hidden md:block" />
              まずはお気軽にご相談ください。
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/contact"
                className="bg-white text-foreground font-semibold px-7 py-3 rounded-full hover:bg-white/90 transition-colors text-sm"
              >
                無料で相談してみる
              </Link>
              <Link
                href="/about"
                className="border border-white/50 text-white font-semibold px-7 py-3 rounded-full hover:bg-white/10 transition-colors text-sm"
              >
                サービス詳細を見る
              </Link>
            </div>
            <p className="text-[11px] text-white/50 mt-4">
              ※ 無理な営業は一切ありません
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
