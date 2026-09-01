export default function SoseiHome() {
  return (
    <>
      {/* Hero */}
      <section className="py-24 md:py-36 relative overflow-hidden">
        <div className="absolute inset-0 ig-gradient opacity-[0.04]" />
        <div className="max-w-4xl mx-auto px-4 text-center relative">
          <div className="inline-block ig-gradient text-white text-xs font-semibold px-4 py-1.5 rounded-full mb-6 tracking-wide">
            地域活性 &times; 産学官連携
          </div>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-5 tracking-tight">
            地域の熱量を、
            <br />
            <span className="ig-gradient-text">事業成果へ。</span>
          </h1>
          <p className="text-muted text-base md:text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
            スポーツ・文化・食を起点に、企業とまちの&ldquo;共創&rdquo;をデザインする。
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="#services"
              className="border border-border text-foreground font-semibold px-7 py-3.5 rounded-full hover:bg-card transition-colors text-sm"
            >
              事業内容を見る
            </a>
            <a
              href="#company"
              className="border border-border text-foreground font-semibold px-7 py-3.5 rounded-full hover:bg-card transition-colors text-sm"
            >
              会社概要
            </a>
            <a
              href="#contact"
              className="ig-gradient text-white font-semibold px-7 py-3.5 rounded-full hover:opacity-90 transition-opacity text-sm"
            >
              相談する（無料）
            </a>
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-16 bg-card scroll-mt-16">
        <div className="max-w-3xl mx-auto px-4">
          <p className="text-center text-xs font-semibold text-muted uppercase tracking-widest mb-3">About</p>
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 tracking-tight">私たちについて</h2>
          <div className="text-center mb-10">
            <p className="ig-gradient-text text-lg font-bold mb-4">
              SOSEI（創成）＝「ゼロから、価値を立ち上げる」。
            </p>
            <p className="text-muted text-sm leading-relaxed max-w-xl mx-auto">
              地域には、まだ言語化されていない資源があります。人、文化、食、スポーツ、産業。
              私たちはそれらを&ldquo;企画&rdquo;に変え、&ldquo;発信&rdquo;に落とし込み、&ldquo;継続できる仕組み&rdquo;として実装します。
            </p>
          </div>
          <p className="text-muted text-sm leading-relaxed text-center max-w-xl mx-auto">
            株式会社SOSEIは、地域の魅力を磨き上げ、伝わる形に整え、成果につながる導線までつくる
            「地域共創型プロデュース／プロモーション支援」を行っています。
          </p>
        </div>
      </section>

      {/* Mission / Vision */}
      <section className="py-16 scroll-mt-16">
        <div className="max-w-4xl mx-auto px-4">
          <p className="text-center text-xs font-semibold text-muted uppercase tracking-widest mb-3">Mission / Vision</p>
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 tracking-tight">ミッション／ビジョン</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-card rounded-2xl p-8 border border-border">
              <div className="w-10 h-10 rounded-full ig-gradient flex items-center justify-center text-white text-sm font-bold mb-4">M</div>
              <h3 className="font-bold text-base mb-3">地域の誇りと豊かさを、次の世代へ。</h3>
              <p className="text-muted text-sm leading-relaxed">
                企業・行政・学校・地域団体が、同じ方向を向いて進める「共創の場」をつくり、地域の価値を育てます。
              </p>
            </div>
            <div className="bg-card rounded-2xl p-8 border border-border">
              <div className="w-10 h-10 rounded-full ig-gradient flex items-center justify-center text-white text-sm font-bold mb-4">V</div>
              <h3 className="font-bold text-base mb-3">挑戦が循環する地域をつくる。</h3>
              <p className="text-muted text-sm leading-relaxed">
                若者の挑戦、企業の成長、地域の賑わいがつながり、応援と成果が循環する仕組みを実現します。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Strengths */}
      <section id="strengths" className="py-16 bg-card scroll-mt-16">
        <div className="max-w-4xl mx-auto px-4">
          <p className="text-center text-xs font-semibold text-muted uppercase tracking-widest mb-3">Strengths</p>
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-4 tracking-tight">
            SOSEIが<span className="ig-gradient-text">大切にすること</span>
          </h2>
          <p className="text-center text-muted text-sm mb-10 max-w-xl mx-auto leading-relaxed">
            &ldquo;地域の魅力を再発見し、新たな価値を創造する&rdquo;という方向性のもと、
            参加者が誇りを持てる場づくりと、継続する関係設計を重視します。
          </p>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                num: "01",
                title: '企画だけで終わらせない。\n"成果の導線"まで設計',
                desc: "認知 → 共感 → 参加 → リード獲得 → 収益化まで、打ち手を一貫して設計します。",
              },
              {
                num: "02",
                title: '地域×企業の"間"に立てる、\nプロデュース力',
                desc: "行政文脈・地域文脈・企業成果のバランスを取り、合意形成と実行を前に進めます。",
              },
              {
                num: "03",
                title: "現場に強い。運営・制作・\n広報までワンストップ",
                desc: "イベント運営、SNS/動画、クリエイティブ制作、営業支援まで一気通貫で伴走します。",
              },
            ].map((item) => (
              <div
                key={item.num}
                className="bg-background rounded-2xl p-6 border border-border hover:shadow-md transition-shadow"
              >
                <div className="ig-gradient-text text-3xl font-bold mb-4">{item.num}</div>
                <h3 className="font-semibold text-sm mb-3 whitespace-pre-line leading-snug">{item.title}</h3>
                <p className="text-xs text-muted leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-16 scroll-mt-16">
        <div className="max-w-4xl mx-auto px-4">
          <p className="text-center text-xs font-semibold text-muted uppercase tracking-widest mb-3">Service</p>
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 tracking-tight">事業内容</h2>
          <div className="space-y-6">
            {[
              {
                num: "1",
                title: "地域活性化事業",
                desc: "地域資源を活かしたイベント／プロジェクト企画、官民連携、学生・若者参画設計、協賛獲得支援まで対応します。",
                items: [
                  "地域イベントの企画・運営",
                  "官民連携・後援取得の設計",
                  "協賛メニュー設計／スポンサー提案資料作成",
                  "学生・地域団体との共創プログラム構築",
                ],
              },
              {
                num: "2",
                title: "プロモーション事業（SNS／動画／コンテンツ）",
                desc: "「伝わる設計」を起点に、SNSや動画を“成果につなぐ運用”として構築します。",
                items: [
                  "SNS運用設計（投稿設計・企画・撮影・編集・運用）",
                  "YouTubeチャンネル企画／制作／運用",
                  "採用動画・企業PR動画制作",
                  "企画書・提案書・LPなどの制作",
                ],
              },
              {
                num: "3",
                title: "営業支援",
                desc: "価値の言語化から提案資料、商談導線、アライアンス開拓まで、営業活動を仕組み化します。",
                items: [
                  "事業価値の整理（強み・提供価値・ターゲット）",
                  "提案資料／営業トーク設計",
                  "パートナー開拓・アライアンス設計",
                  "リード獲得施策の設計",
                ],
              },
            ].map((service) => (
              <div key={service.num} className="bg-card rounded-2xl border border-border p-8 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 rounded-xl ig-gradient flex items-center justify-center text-white text-lg font-bold shrink-0">
                    {service.num}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-base mb-2">{service.title}</h3>
                    <p className="text-muted text-sm leading-relaxed mb-4">{service.desc}</p>
                    <ul className="space-y-1.5">
                      {service.items.map((item) => (
                        <li key={item} className="text-sm text-foreground/80 flex items-start gap-2">
                          <span className="ig-gradient-text mt-1 shrink-0">&#9656;</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Representative Message */}
      <section className="py-16 bg-card scroll-mt-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <p className="text-xs font-semibold text-muted uppercase tracking-widest mb-3">Message</p>
          <h2 className="text-2xl md:text-3xl font-bold mb-8 tracking-tight">代表メッセージ</h2>
          <div className="bg-background rounded-2xl border border-border p-8 md:p-10">
            <p className="text-sm leading-[2] text-foreground/80 text-left">
              地域には、まだ知られていない魅力があります。
              <br />
              そして、その魅力を&ldquo;伝わる形&rdquo;に整え、関わる人が増え、成果が生まれたとき、地域の未来は動き出します。
            </p>
            <p className="text-sm leading-[2] text-foreground/80 mt-4 text-left">
              株式会社SOSEIは、企画・発信・運営・営業の実行力で、地域と企業の挑戦を前に進めます。
            </p>
            <p className="text-sm text-muted mt-6 text-left">
              まずはお気軽にご相談ください。
            </p>
          </div>
        </div>
      </section>

      {/* Company */}
      <section id="company" className="py-16 scroll-mt-16">
        <div className="max-w-3xl mx-auto px-4">
          <p className="text-center text-xs font-semibold text-muted uppercase tracking-widest mb-3">Company</p>
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 tracking-tight">会社概要</h2>
          <div className="bg-card rounded-2xl border border-border overflow-hidden">
            <table className="w-full text-sm">
              <tbody>
                {[
                  { label: "会社名", value: "株式会社SOSEI" },
                  { label: "事業内容", value: "地域活性化事業／プロモーション事業／営業支援" },
                  { label: "所在地", value: "〒260-0042 千葉県千葉市中央区椿森5-5-13\nウィザースレジデンス千葉椿森712" },
                  { label: "設立", value: "令和7年9月22日" },
                  { label: "連絡先", value: "090-1079-8514", href: "tel:09010798514" },
                  { label: "メール", value: "skinosada.sosei@gmail.com", href: "mailto:skinosada.sosei@gmail.com" },
                ].map((row, i) => (
                  <tr key={row.label} className={i > 0 ? "border-t border-border" : ""}>
                    <td className="px-6 py-4 font-semibold text-muted w-32 align-top bg-background/50">
                      {row.label}
                    </td>
                    <td className="px-6 py-4 whitespace-pre-line">
                      {row.href ? (
                        <a href={row.href} className="text-primary hover:underline">{row.value}</a>
                      ) : (
                        row.value
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section id="contact" className="py-20 scroll-mt-16">
        <div className="max-w-3xl mx-auto px-4">
          <div className="ig-gradient rounded-3xl p-10 md:p-14 text-center text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10" />
            <div className="relative">
              <p className="text-xs font-semibold text-white/60 uppercase tracking-widest mb-3">Contact</p>
              <h2 className="text-2xl md:text-3xl font-bold mb-4 leading-tight">
                お問い合わせ
              </h2>
              <p className="text-white/80 text-sm md:text-base mb-8 leading-relaxed max-w-lg mx-auto">
                プロジェクトのご相談・協賛のご相談・制作のご相談など、まずはお気軽にご連絡ください。
                <br className="hidden md:block" />
                「何から整理すればいいか分からない」段階でも大丈夫です。
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href="mailto:skinosada.sosei@gmail.com"
                  className="bg-white text-foreground font-semibold px-7 py-3 rounded-full hover:bg-white/90 transition-colors text-sm"
                >
                  メールで相談する
                </a>
                <a
                  href="tel:09010798514"
                  className="border border-white/50 text-white font-semibold px-7 py-3 rounded-full hover:bg-white/10 transition-colors text-sm"
                >
                  電話する：090-1079-8514
                </a>
              </div>
              <p className="text-[11px] text-white/50 mt-4">
                目的と現状を伺い、最短ルートをご提案します
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
