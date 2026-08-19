import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://movebuz.vercel.app";
const ogImage = `${siteUrl}/api/og`;

export const metadata: Metadata = {
  title: "無料相談・お問い合わせ",
  description: "YouTube運用に関するご相談はお気軽にどうぞ。企画・撮影・編集・分析まで丸ごとサポートします。",
  alternates: {
    canonical: `${siteUrl}/contact`,
  },
  openGraph: {
    title: "無料相談・お問い合わせ | MOVeBUZ",
    description: "YouTube運用に関するご相談はお気軽にどうぞ。",
    url: `${siteUrl}/contact`,
    images: [{ url: ogImage, width: 1200, height: 630, type: "image/png" }],
  },
  twitter: {
    card: "summary_large_image",
    images: [ogImage],
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
