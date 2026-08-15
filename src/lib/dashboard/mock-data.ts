import type {
  KPICard,
  DailyMetric,
  ArticleMetric,
  ArticleDetail,
  TrafficSource,
  UTMData,
  LandingPage,
  SEOKeyword,
  FunnelStep,
  ConversionType,
  UserJourney,
  FlowNode,
  FlowLink,
  Insight,
} from "./types";

export const kpiCards: KPICard[] = [
  {
    label: "ユーザー数",
    value: "12,430",
    previousValue: "10,534",
    change: 18.0,
    changeLabel: "前月比",
  },
  {
    label: "セッション数",
    value: "18,920",
    previousValue: "16,100",
    change: 17.5,
    changeLabel: "前月比",
  },
  {
    label: "PV数",
    value: "31,280",
    previousValue: "27,450",
    change: 13.9,
    changeLabel: "前月比",
  },
  {
    label: "問い合わせ数",
    value: "86",
    previousValue: "72",
    change: 19.4,
    changeLabel: "前月比",
  },
  {
    label: "問い合わせCVR",
    value: "0.69%",
    previousValue: "0.58%",
    change: 19.0,
    changeLabel: "前月比",
    format: "percent",
  },
  {
    label: "新規ユーザー率",
    value: "64.2%",
    previousValue: "61.8%",
    change: 3.9,
    changeLabel: "前月比",
    format: "percent",
  },
  {
    label: "リピーター率",
    value: "35.8%",
    previousValue: "38.2%",
    change: -6.3,
    changeLabel: "前月比",
    format: "percent",
  },
];

function generateDailyMetrics(): DailyMetric[] {
  const data: DailyMetric[] = [];
  const baseDate = new Date(2026, 6, 15);
  for (let i = 29; i >= 0; i--) {
    const d = new Date(baseDate);
    d.setDate(d.getDate() - i);
    const dayOfWeek = d.getDay();
    const weekendFactor = dayOfWeek === 0 || dayOfWeek === 6 ? 0.7 : 1;
    const trendFactor = 1 + (30 - i) * 0.008;
    const noise = 0.85 + Math.random() * 0.3;
    const users = Math.round(380 * weekendFactor * trendFactor * noise);
    const sessions = Math.round(users * (1.4 + Math.random() * 0.3));
    const pageviews = Math.round(sessions * (1.6 + Math.random() * 0.4));
    const inquiries = Math.round(users * 0.007 * (0.5 + Math.random()));
    data.push({
      date: `${d.getMonth() + 1}/${d.getDate()}`,
      users,
      sessions,
      pageviews,
      inquiries,
      cvr: Number(((inquiries / users) * 100).toFixed(2)),
    });
  }
  return data;
}

export const dailyMetrics: DailyMetric[] = generateDailyMetrics();

export const articleMetrics: ArticleMetric[] = [
  {
    slug: "youtube-management-cost-guide",
    title: "YouTube運用代行の費用相場は？料金プランの選び方を徹底比較",
    url: "/blog/youtube-management-cost-guide",
    publishedAt: "2026-04-10",
    pageviews: 5420,
    uniqueUsers: 4180,
    avgDuration: 245,
    scrollRate: 72,
    readRate: 48,
    exitRate: 34,
    ctaClicks: 186,
    ctaClickRate: 3.4,
    inquiries: 24,
    cvr: 0.44,
    category: "outsourcing",
  },
  {
    slug: "youtube-views-increase-tips",
    title: "企業YouTubeの再生数を伸ばす7つの施策｜今すぐ実践できるコツ",
    url: "/blog/youtube-views-increase-tips",
    publishedAt: "2026-04-07",
    pageviews: 4890,
    uniqueUsers: 3920,
    avgDuration: 198,
    scrollRate: 65,
    readRate: 42,
    exitRate: 38,
    ctaClicks: 142,
    ctaClickRate: 2.9,
    inquiries: 18,
    cvr: 0.37,
    category: "channel-growth",
  },
  {
    slug: "btob-youtube-content-ideas",
    title: "【BtoB向け】YouTube動画の企画ネタ30選｜すぐに使えるテーマ集",
    url: "/blog/btob-youtube-content-ideas",
    publishedAt: "2026-04-01",
    pageviews: 3980,
    uniqueUsers: 3210,
    avgDuration: 312,
    scrollRate: 78,
    readRate: 55,
    exitRate: 28,
    ctaClicks: 168,
    ctaClickRate: 4.2,
    inquiries: 22,
    cvr: 0.55,
    category: "video-production",
  },
  {
    slug: "youtube-video-editing-outsource",
    title: "YouTube動画編集を外注するには？費用・依頼先・注意点を解説",
    url: "/blog/youtube-video-editing-outsource",
    publishedAt: "2026-04-03",
    pageviews: 3240,
    uniqueUsers: 2680,
    avgDuration: 178,
    scrollRate: 58,
    readRate: 38,
    exitRate: 42,
    ctaClicks: 88,
    ctaClickRate: 2.7,
    inquiries: 12,
    cvr: 0.37,
    category: "outsourcing",
  },
  {
    slug: "youtube-business-start-guide",
    title: "【2026年最新】企業がYouTubeを始めるための完全ガイド",
    url: "/blog/youtube-business-start-guide",
    publishedAt: "2026-04-15",
    pageviews: 3180,
    uniqueUsers: 2540,
    avgDuration: 268,
    scrollRate: 70,
    readRate: 50,
    exitRate: 32,
    ctaClicks: 124,
    ctaClickRate: 3.9,
    inquiries: 8,
    cvr: 0.25,
    category: "youtube-basics",
  },
  {
    slug: "youtube-seo-success-smb",
    title: "中小企業のYouTube活用事例5選｜少ない予算でも成果を出すポイント",
    url: "/blog/youtube-seo-success-smb",
    publishedAt: "2026-08-15",
    pageviews: 1820,
    uniqueUsers: 1540,
    avgDuration: 290,
    scrollRate: 74,
    readRate: 52,
    exitRate: 30,
    ctaClicks: 82,
    ctaClickRate: 4.5,
    inquiries: 6,
    cvr: 0.33,
    category: "case-study",
  },
  {
    slug: "youtube-studio-beginner-guide",
    title: "YouTube Studio完全ガイド｜初心者が最初に覚えるべき5つの機能",
    url: "/blog/youtube-studio-beginner-guide",
    publishedAt: "2026-08-16",
    pageviews: 980,
    uniqueUsers: 840,
    avgDuration: 215,
    scrollRate: 62,
    readRate: 40,
    exitRate: 36,
    ctaClicks: 28,
    ctaClickRate: 2.9,
    inquiries: 2,
    cvr: 0.2,
    category: "youtube-basics",
  },
];

export function getArticleDetail(slug: string): ArticleDetail | null {
  const article = articleMetrics.find((a) => a.slug === slug);
  if (!article) return null;
  const dailyAccess = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date(2026, 6, 15);
    d.setDate(d.getDate() - i);
    const noise = 0.6 + Math.random() * 0.8;
    const pv = Math.round((article.pageviews / 30) * noise);
    dailyAccess.push({
      date: `${d.getMonth() + 1}/${d.getDate()}`,
      pv,
      users: Math.round(pv * 0.78),
    });
  }
  return {
    ...article,
    dailyAccess,
    trafficSources: [
      { channel: "Organic Search", users: Math.round(article.uniqueUsers * 0.48), sessions: Math.round(article.uniqueUsers * 0.52), pageviews: Math.round(article.pageviews * 0.5), inquiries: Math.round(article.inquiries * 0.55), cvr: 0.42, color: "#3b82f6" },
      { channel: "Direct", users: Math.round(article.uniqueUsers * 0.22), sessions: Math.round(article.uniqueUsers * 0.24), pageviews: Math.round(article.pageviews * 0.22), inquiries: Math.round(article.inquiries * 0.2), cvr: 0.35, color: "#8b5cf6" },
      { channel: "Social", users: Math.round(article.uniqueUsers * 0.18), sessions: Math.round(article.uniqueUsers * 0.16), pageviews: Math.round(article.pageviews * 0.16), inquiries: Math.round(article.inquiries * 0.15), cvr: 0.28, color: "#ec4899" },
      { channel: "Referral", users: Math.round(article.uniqueUsers * 0.12), sessions: Math.round(article.uniqueUsers * 0.08), pageviews: Math.round(article.pageviews * 0.12), inquiries: Math.round(article.inquiries * 0.1), cvr: 0.22, color: "#f59e0b" },
    ],
    deviceBreakdown: [
      { device: "Mobile", percentage: 62, sessions: Math.round(article.uniqueUsers * 0.62) },
      { device: "Desktop", percentage: 32, sessions: Math.round(article.uniqueUsers * 0.32) },
      { device: "Tablet", percentage: 6, sessions: Math.round(article.uniqueUsers * 0.06) },
    ],
    nextPages: [
      { page: "/contact", count: Math.round(article.inquiries * 1.4), percentage: 18 },
      { page: "/blog/youtube-management-cost-guide", count: Math.round(article.pageviews * 0.08), percentage: 12 },
      { page: "/about", count: Math.round(article.pageviews * 0.06), percentage: 8 },
      { page: "/blog/youtube-views-increase-tips", count: Math.round(article.pageviews * 0.05), percentage: 6 },
    ],
    exitPages: [
      { page: "(離脱)", count: Math.round(article.pageviews * article.exitRate / 100), percentage: article.exitRate },
      { page: "外部サイト", count: Math.round(article.pageviews * 0.08), percentage: 8 },
    ],
  };
}

export const trafficSources: TrafficSource[] = [
  { channel: "Organic Search", users: 5960, sessions: 8540, pageviews: 14820, inquiries: 42, cvr: 0.7, color: "#3b82f6" },
  { channel: "Direct", users: 2740, sessions: 3810, pageviews: 6280, inquiries: 18, cvr: 0.66, color: "#8b5cf6" },
  { channel: "Social", users: 1990, sessions: 2680, pageviews: 4520, inquiries: 12, cvr: 0.6, color: "#ec4899" },
  { channel: "Referral", users: 1120, sessions: 1540, pageviews: 2860, inquiries: 8, cvr: 0.71, color: "#f59e0b" },
  { channel: "Paid Search", users: 420, sessions: 580, pageviews: 1480, inquiries: 4, cvr: 0.95, color: "#10b981" },
  { channel: "Email", users: 200, sessions: 320, pageviews: 680, inquiries: 2, cvr: 1.0, color: "#6366f1" },
];

export const utmData: UTMData[] = [
  { source: "google", medium: "cpc", campaign: "youtube_management_2026", users: 320, sessions: 440, inquiries: 3, cvr: 0.94 },
  { source: "facebook", medium: "social", campaign: "blog_share_jul", users: 680, sessions: 820, inquiries: 4, cvr: 0.59 },
  { source: "twitter", medium: "social", campaign: "blog_share_jul", users: 540, sessions: 640, inquiries: 3, cvr: 0.56 },
  { source: "newsletter", medium: "email", campaign: "weekly_digest_w28", users: 120, sessions: 180, inquiries: 1, cvr: 0.83 },
  { source: "google", medium: "cpc", campaign: "btob_youtube_2026", users: 100, sessions: 140, inquiries: 1, cvr: 1.0 },
  { source: "instagram", medium: "social", campaign: "reel_promo", users: 440, sessions: 520, inquiries: 2, cvr: 0.45 },
  { source: "note", medium: "referral", campaign: "(not set)", users: 380, sessions: 420, inquiries: 3, cvr: 0.79 },
  { source: "newsletter", medium: "email", campaign: "weekly_digest_w29", users: 80, sessions: 140, inquiries: 1, cvr: 1.25 },
];

export const landingPages: LandingPage[] = [
  { page: "/blog/youtube-management-cost-guide", sessions: 3240, exitRate: 12, inquiries: 18, cvr: 0.56 },
  { page: "/blog/youtube-views-increase-tips", sessions: 2680, exitRate: 15, inquiries: 12, cvr: 0.45 },
  { page: "/blog/btob-youtube-content-ideas", sessions: 2140, exitRate: 10, inquiries: 14, cvr: 0.65 },
  { page: "/", sessions: 1860, exitRate: 22, inquiries: 8, cvr: 0.43 },
  { page: "/blog/youtube-video-editing-outsource", sessions: 1420, exitRate: 18, inquiries: 6, cvr: 0.42 },
  { page: "/blog/youtube-business-start-guide", sessions: 1180, exitRate: 14, inquiries: 4, cvr: 0.34 },
  { page: "/about", sessions: 680, exitRate: 28, inquiries: 2, cvr: 0.29 },
  { page: "/contact", sessions: 420, exitRate: 8, inquiries: 12, cvr: 2.86 },
];

export const seoKeywords: SEOKeyword[] = [
  { keyword: "YouTube 運用代行 費用", impressions: 12400, clicks: 1860, ctr: 15.0, avgPosition: 3.2, landingPage: "/blog/youtube-management-cost-guide", inquiries: 14, cvr: 0.75 },
  { keyword: "YouTube 再生数 伸ばす 企業", impressions: 8900, clicks: 1240, ctr: 13.9, avgPosition: 4.1, landingPage: "/blog/youtube-views-increase-tips", inquiries: 8, cvr: 0.65 },
  { keyword: "BtoB YouTube 企画", impressions: 6200, clicks: 980, ctr: 15.8, avgPosition: 2.8, landingPage: "/blog/btob-youtube-content-ideas", inquiries: 10, cvr: 1.02 },
  { keyword: "YouTube 動画編集 外注", impressions: 9800, clicks: 1120, ctr: 11.4, avgPosition: 5.4, landingPage: "/blog/youtube-video-editing-outsource", inquiries: 6, cvr: 0.54 },
  { keyword: "企業 YouTube 始め方", impressions: 7400, clicks: 890, ctr: 12.0, avgPosition: 4.8, landingPage: "/blog/youtube-business-start-guide", inquiries: 4, cvr: 0.45 },
  { keyword: "YouTube 運用代行", impressions: 15200, clicks: 2140, ctr: 14.1, avgPosition: 3.6, landingPage: "/blog/youtube-management-cost-guide", inquiries: 12, cvr: 0.56 },
  { keyword: "中小企業 YouTube 事例", impressions: 4800, clicks: 620, ctr: 12.9, avgPosition: 5.2, landingPage: "/blog/youtube-seo-success-smb", inquiries: 4, cvr: 0.65 },
  { keyword: "YouTube Studio 使い方", impressions: 11200, clicks: 480, ctr: 4.3, avgPosition: 12.4, landingPage: "/blog/youtube-studio-beginner-guide", inquiries: 1, cvr: 0.21 },
  { keyword: "YouTube サムネイル 作り方", impressions: 18600, clicks: 320, ctr: 1.7, avgPosition: 18.6, landingPage: "/blog/youtube-thumbnail-design-tips", inquiries: 0, cvr: 0 },
  { keyword: "YouTube アルゴリズム 仕組み", impressions: 14200, clicks: 280, ctr: 2.0, avgPosition: 15.8, landingPage: "/blog/youtube-algorithm-guide", inquiries: 0, cvr: 0 },
];

export const funnelSteps: FunnelStep[] = [
  { label: "サイト訪問", users: 12430, rate: 100, dropoff: 0 },
  { label: "サービスページ閲覧", users: 3240, rate: 26.1, dropoff: 73.9 },
  { label: "問い合わせページ到達", users: 620, rate: 19.1, dropoff: 80.9 },
  { label: "フォーム入力開始", users: 248, rate: 40.0, dropoff: 60.0 },
  { label: "フォーム送信", users: 102, rate: 41.1, dropoff: 58.9 },
  { label: "問い合わせ完了", users: 86, rate: 84.3, dropoff: 15.7 },
];

export const conversionTypes: ConversionType[] = [
  { type: "form_submit", label: "問い合わせフォーム", count: 86, change: 19.4 },
  { type: "phone_click", label: "電話クリック", count: 42, change: 12.0 },
  { type: "line_click", label: "LINEクリック", count: 38, change: 26.7 },
  { type: "document_request", label: "資料請求", count: 24, change: -8.3 },
  { type: "newsletter", label: "メルマガ登録", count: 156, change: 32.1 },
  { type: "cta_click", label: "CTAクリック", count: 818, change: 14.8 },
  { type: "external_booking", label: "外部予約サイト遷移", count: 12, change: 50.0 },
];

export const userJourneys: UserJourney[] = [
  {
    anonymousId: "usr_a1b2c3",
    source: "Google検索",
    landingPage: "/blog/youtube-management-cost-guide",
    pages: [
      { url: "/blog/youtube-management-cost-guide", title: "YouTube運用代行の費用相場は？", duration: 312 },
      { url: "/blog/btob-youtube-content-ideas", title: "【BtoB向け】YouTube企画ネタ30選", duration: 245 },
      { url: "/about", title: "会社概要", duration: 68 },
      { url: "/contact", title: "お問い合わせ", duration: 180 },
    ],
    ctaClicked: true,
    converted: true,
    convertedAt: "2026-07-12 14:32",
  },
  {
    anonymousId: "usr_d4e5f6",
    source: "Twitter",
    landingPage: "/blog/youtube-views-increase-tips",
    pages: [
      { url: "/blog/youtube-views-increase-tips", title: "再生数を伸ばす7つの施策", duration: 198 },
      { url: "/blog/youtube-management-cost-guide", title: "YouTube運用代行の費用相場は？", duration: 280 },
      { url: "/contact", title: "お問い合わせ", duration: 145 },
    ],
    ctaClicked: true,
    converted: true,
    convertedAt: "2026-07-10 09:15",
  },
  {
    anonymousId: "usr_g7h8i9",
    source: "Google検索",
    landingPage: "/blog/btob-youtube-content-ideas",
    pages: [
      { url: "/blog/btob-youtube-content-ideas", title: "【BtoB向け】YouTube企画ネタ30選", duration: 420 },
      { url: "/blog/youtube-video-editing-outsource", title: "動画編集を外注するには？", duration: 156 },
      { url: "/blog/youtube-management-cost-guide", title: "YouTube運用代行の費用相場は？", duration: 340 },
      { url: "/about", title: "会社概要", duration: 52 },
      { url: "/contact", title: "お問い合わせ", duration: 210 },
    ],
    ctaClicked: true,
    converted: true,
    convertedAt: "2026-07-08 16:48",
  },
  {
    anonymousId: "usr_j1k2l3",
    source: "Direct",
    landingPage: "/",
    pages: [
      { url: "/", title: "トップページ", duration: 45 },
      { url: "/blog/youtube-seo-success-smb", title: "中小企業のYouTube活用事例5選", duration: 380 },
      { url: "/contact", title: "お問い合わせ", duration: 160 },
    ],
    ctaClicked: false,
    converted: true,
    convertedAt: "2026-07-14 11:22",
  },
  {
    anonymousId: "usr_m4n5o6",
    source: "Facebook",
    landingPage: "/blog/youtube-business-start-guide",
    pages: [
      { url: "/blog/youtube-business-start-guide", title: "企業がYouTubeを始めるための完全ガイド", duration: 268 },
      { url: "/blog/youtube-management-cost-guide", title: "YouTube運用代行の費用相場は？", duration: 195 },
      { url: "/contact", title: "お問い合わせ", duration: 120 },
    ],
    ctaClicked: true,
    converted: true,
    convertedAt: "2026-07-11 13:05",
  },
  {
    anonymousId: "usr_p7q8r9",
    source: "Google検索",
    landingPage: "/blog/youtube-views-increase-tips",
    pages: [
      { url: "/blog/youtube-views-increase-tips", title: "再生数を伸ばす7つの施策", duration: 142 },
    ],
    ctaClicked: false,
    converted: false,
  },
  {
    anonymousId: "usr_s1t2u3",
    source: "Note",
    landingPage: "/blog/btob-youtube-content-ideas",
    pages: [
      { url: "/blog/btob-youtube-content-ideas", title: "【BtoB向け】YouTube企画ネタ30選", duration: 356 },
      { url: "/blog/youtube-views-increase-tips", title: "再生数を伸ばす7つの施策", duration: 210 },
      { url: "/about", title: "会社概要", duration: 88 },
      { url: "/contact", title: "お問い合わせ", duration: 195 },
    ],
    ctaClicked: true,
    converted: true,
    convertedAt: "2026-07-13 10:38",
  },
  {
    anonymousId: "usr_v4w5x6",
    source: "Instagram",
    landingPage: "/blog/youtube-seo-success-smb",
    pages: [
      { url: "/blog/youtube-seo-success-smb", title: "中小企業のYouTube活用事例5選", duration: 290 },
      { url: "/blog/youtube-management-cost-guide", title: "YouTube運用代行の費用相場は？", duration: 220 },
    ],
    ctaClicked: false,
    converted: false,
  },
];

export const flowNodes: FlowNode[] = [
  { id: "organic", label: "Google検索", value: 5960 },
  { id: "direct", label: "Direct", value: 2740 },
  { id: "social", label: "SNS", value: 1990 },
  { id: "referral", label: "Referral", value: 1120 },
  { id: "blog_cost", label: "費用相場記事", value: 5420 },
  { id: "blog_views", label: "再生数記事", value: 4890 },
  { id: "blog_btob", label: "BtoB企画記事", value: 3980 },
  { id: "blog_other", label: "その他記事", value: 4120 },
  { id: "about", label: "会社概要", value: 1840 },
  { id: "service", label: "サービス", value: 3240 },
  { id: "contact", label: "問い合わせ", value: 620 },
  { id: "conversion", label: "CV完了", value: 86 },
  { id: "exit", label: "離脱", value: 8200 },
];

export const flowLinks: FlowLink[] = [
  { source: "organic", target: "blog_cost", value: 2400 },
  { source: "organic", target: "blog_views", value: 1800 },
  { source: "organic", target: "blog_btob", value: 1200 },
  { source: "organic", target: "blog_other", value: 560 },
  { source: "direct", target: "blog_cost", value: 800 },
  { source: "direct", target: "about", value: 640 },
  { source: "direct", target: "service", value: 520 },
  { source: "direct", target: "blog_other", value: 780 },
  { source: "social", target: "blog_views", value: 680 },
  { source: "social", target: "blog_btob", value: 540 },
  { source: "social", target: "blog_other", value: 770 },
  { source: "referral", target: "blog_btob", value: 480 },
  { source: "referral", target: "blog_cost", value: 340 },
  { source: "referral", target: "blog_other", value: 300 },
  { source: "blog_cost", target: "service", value: 1200 },
  { source: "blog_cost", target: "about", value: 420 },
  { source: "blog_cost", target: "contact", value: 280 },
  { source: "blog_cost", target: "exit", value: 3520 },
  { source: "blog_views", target: "blog_cost", value: 680 },
  { source: "blog_views", target: "service", value: 540 },
  { source: "blog_views", target: "contact", value: 160 },
  { source: "blog_views", target: "exit", value: 2830 },
  { source: "blog_btob", target: "blog_cost", value: 520 },
  { source: "blog_btob", target: "service", value: 480 },
  { source: "blog_btob", target: "contact", value: 120 },
  { source: "blog_btob", target: "exit", value: 1640 },
  { source: "blog_other", target: "exit", value: 2210 },
  { source: "blog_other", target: "service", value: 500 },
  { source: "blog_other", target: "contact", value: 60 },
  { source: "service", target: "contact", value: 820 },
  { source: "service", target: "exit", value: 1680 },
  { source: "about", target: "contact", value: 340 },
  { source: "about", target: "exit", value: 860 },
  { source: "contact", target: "conversion", value: 86 },
  { source: "contact", target: "exit", value: 534 },
];

export const insights: Insight[] = [
  {
    id: "ins_1",
    type: "warning",
    category: "CVR改善",
    title: "PV多・CVR低の記事",
    description: "「企業YouTubeの再生数を伸ばす7つの施策」は月間4,890PVありますが、CVRは0.37%と平均以下です。CTA配置の見直しを推奨します。",
    metric: "CVR 0.37%",
    actionLabel: "記事を分析",
    relatedPage: "/blog/youtube-views-increase-tips",
  },
  {
    id: "ins_2",
    type: "success",
    category: "CV貢献",
    title: "CV貢献度1位の記事",
    description: "「YouTube運用代行の費用相場は？」はPVでは1位、問い合わせ貢献数も24件で1位。CTAクリック率3.4%も高水準です。",
    metric: "問い合わせ 24件",
    relatedPage: "/blog/youtube-management-cost-guide",
  },
  {
    id: "ins_3",
    type: "info",
    category: "CTR改善",
    title: "CTAクリック率が低いページ",
    description: "「YouTube動画編集を外注するには？」のCTAクリック率は2.7%で、平均3.4%を下回っています。CTAの文言やデザインの改善が効果的です。",
    metric: "CTA率 2.7%",
    actionLabel: "記事を分析",
    relatedPage: "/blog/youtube-video-editing-outsource",
  },
  {
    id: "ins_4",
    type: "success",
    category: "CVR改善",
    title: "高CVR記事の発見",
    description: "「BtoB向けYouTube企画ネタ30選」はCVR 0.55%でサイト内最高。CTAクリック率4.2%、読了率55%も高水準です。この構成を他記事に展開することを推奨します。",
    metric: "CVR 0.55%",
    relatedPage: "/blog/btob-youtube-content-ideas",
  },
  {
    id: "ins_5",
    type: "danger",
    category: "離脱率",
    title: "離脱率が高いページ",
    description: "「YouTube動画編集を外注するには？」の離脱率は42%で、平均34%を大きく上回っています。コンテンツ改善または内部リンクの追加を検討してください。",
    metric: "離脱率 42%",
    actionLabel: "記事を分析",
    relatedPage: "/blog/youtube-video-editing-outsource",
  },
  {
    id: "ins_6",
    type: "info",
    category: "SEO",
    title: "検索順位の改善余地",
    description: "「YouTube Studio 使い方」は月間11,200回表示されていますが、平均順位12.4位でCTR 4.3%。上位表示できればクリック数の大幅増加が見込めます。",
    metric: "平均順位 12.4位",
    relatedPage: "/blog/youtube-studio-beginner-guide",
  },
  {
    id: "ins_7",
    type: "warning",
    category: "ファネル",
    title: "ファネル離脱ポイント",
    description: "サイト訪問→サービスページ閲覧の遷移率が26.1%と低い。ブログ記事からサービスページへの導線強化が有効です。",
    metric: "遷移率 26.1%",
  },
];
