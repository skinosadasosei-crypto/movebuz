import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
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

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ja" className={`${notoSansJP.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
