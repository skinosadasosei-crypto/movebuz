import Link from "next/link";

export default function CTA() {
  return (
    <section className="bg-primary text-white py-16">
      <div className="max-w-3xl mx-auto px-4 text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">
          YouTube運用、プロに任せてみませんか？
        </h2>
        <p className="text-lg text-indigo-200 mb-8 leading-relaxed">
          企画から撮影・編集・分析まで、チャンネル運用を丸ごとサポート。
          <br className="hidden md:block" />
          まずはお気軽にご相談ください。
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/contact"
            className="bg-accent text-foreground font-bold px-8 py-4 rounded-lg hover:bg-yellow-400 transition-colors text-lg"
          >
            無料相談してみる
          </Link>
          <Link
            href="/about"
            className="border-2 border-white text-white font-bold px-8 py-4 rounded-lg hover:bg-white hover:text-primary transition-colors text-lg"
          >
            サービス詳細を見る
          </Link>
        </div>
        <p className="text-sm text-indigo-300 mt-4">
          ※ 無理な営業は一切ありません
        </p>
      </div>
    </section>
  );
}
