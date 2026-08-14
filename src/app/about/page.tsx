import Link from "next/link";
import CTA from "@/components/CTA";

export const metadata = {
  title: "サービス紹介",
  description:
    "YouTube制作・運用代行サービスの詳細。企画から撮影・編集・分析まで、チャンネル運用を丸ごとサポートします。",
};

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary to-primary-dark text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            YouTube運用代行サービス
          </h1>
          <p className="text-indigo-200 text-lg">
            企画力 × コスパで、御社のチャンネルを成長させます
          </p>
        </div>
      </section>

      {/* Problem */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-10">
            こんなお悩みありませんか？
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              "YouTubeを始めたいけど、何から手をつけていいかわからない",
              "動画を投稿しているが、再生数が伸びない",
              "社内に動画制作のリソースがない",
              "外注したいが、費用が高すぎて手が出ない",
              "チャンネル登録者を効率的に増やしたい",
              "動画マーケティングのROIを改善したい",
            ].map((problem) => (
              <div
                key={problem}
                className="flex items-start gap-3 bg-red-50 border border-red-100 rounded-xl p-4"
              >
                <span className="text-red-500 text-lg shrink-0">✕</span>
                <p className="text-sm">{problem}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-primary font-bold text-lg mt-8">
            ↓ そのお悩み、動画のミカタが解決します！
          </p>
        </div>
      </section>

      {/* Service */}
      <section className="py-16 bg-card">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-10">
            サービス内容
          </h2>
          <div className="space-y-6">
            {[
              {
                step: "01",
                title: "チャンネル戦略設計",
                desc: "ターゲット分析・競合調査を行い、勝てるチャンネルコンセプトを設計します。",
              },
              {
                step: "02",
                title: "企画・構成立案",
                desc: "検索ニーズとトレンドを分析し、再生数が伸びる動画テーマと構成を毎月ご提案します。",
              },
              {
                step: "03",
                title: "撮影・編集",
                desc: "プロの映像チームが撮影・編集を担当。テロップ・BGM・サムネイルまでトータルで制作します。",
              },
              {
                step: "04",
                title: "公開・SEO最適化",
                desc: "タイトル・説明文・タグを最適化し、YouTube検索で上位表示を狙います。",
              },
              {
                step: "05",
                title: "分析・改善レポート",
                desc: "毎月の再生数・CTR・視聴維持率などを分析し、次月の改善施策をご提案します。",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="flex gap-6 bg-white border border-border rounded-xl p-6"
              >
                <div className="text-3xl font-bold text-primary shrink-0">
                  {item.step}
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">{item.title}</h3>
                  <p className="text-sm text-muted leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-10">料金プラン</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: "ライトプラン",
                price: "月30万円〜",
                features: [
                  "月4本の動画制作",
                  "企画・構成サポート",
                  "サムネイル制作",
                  "月次レポート",
                ],
                recommended: false,
              },
              {
                name: "スタンダードプラン",
                price: "月40万円〜",
                features: [
                  "月6本の動画制作",
                  "企画・構成立案",
                  "サムネイル制作",
                  "SEO最適化",
                  "月次レポート＋改善提案",
                  "ショート動画対応",
                ],
                recommended: true,
              },
              {
                name: "プレミアムプラン",
                price: "月50万円〜",
                features: [
                  "月8本の動画制作",
                  "戦略設計〜改善まで全対応",
                  "専任ディレクター",
                  "週次レポート",
                  "広告運用サポート",
                  "ライブ配信対応",
                ],
                recommended: false,
              },
            ].map((plan) => (
              <div
                key={plan.name}
                className={`rounded-xl p-6 border-2 ${
                  plan.recommended
                    ? "border-primary bg-primary-light"
                    : "border-border bg-white"
                }`}
              >
                {plan.recommended && (
                  <div className="text-xs bg-primary text-white px-3 py-1 rounded-full inline-block font-medium mb-3">
                    おすすめ
                  </div>
                )}
                <h3 className="font-bold text-lg">{plan.name}</h3>
                <p className="text-2xl font-bold text-primary mt-2 mb-4">
                  {plan.price}
                </p>
                <ul className="space-y-2">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <span className="text-primary shrink-0">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/contact"
                  className={`block text-center mt-6 px-4 py-3 rounded-lg font-bold text-sm transition-colors ${
                    plan.recommended
                      ? "bg-primary text-white hover:bg-primary-dark"
                      : "border border-primary text-primary hover:bg-primary-light"
                  }`}
                >
                  このプランで相談する
                </Link>
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-muted mt-6">
            ※ 価格は税別です。ご要望に応じてカスタマイズも可能です。
          </p>
        </div>
      </section>

      <CTA />
    </>
  );
}
