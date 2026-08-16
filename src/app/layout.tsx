import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const notoSansJP = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "MOVeBUZ | YouTube運用・動画マーケティングの専門メディア",
    template: "%s | MOVeBUZ",
  },
  description:
    "企業のYouTube運用を成功に導く情報メディア。チャンネル開設から運用代行まで、動画マーケティングのノウハウを発信します。",
  openGraph: {
    type: "website",
    locale: "ja_JP",
    siteName: "MOVeBUZ",
  },
};

const gaId = process.env.NEXT_PUBLIC_GA_ID;
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://movebuz.vercel.app";

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "MOVeBUZ",
  url: siteUrl,
  description: "企業のYouTube運用を成功に導く情報メディア。チャンネル開設から運用代行まで、動画マーケティングのノウハウを発信します。",
  logo: `${siteUrl}/icon.svg`,
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "MOVeBUZ",
  url: siteUrl,
  description: "企業のYouTube運用を成功に導く情報メディア",
  publisher: { "@type": "Organization", name: "MOVeBUZ" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ja" className={`${notoSansJP.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        {gaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${gaId}');`}
            </Script>
          </>
        )}
        {children}
      </body>
    </html>
  );
}
