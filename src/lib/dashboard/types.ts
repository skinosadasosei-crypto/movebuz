export interface KPICard {
  label: string;
  value: string;
  previousValue: string;
  change: number;
  changeLabel: string;
  format?: "number" | "percent" | "decimal";
}

export interface DailyMetric {
  date: string;
  users: number;
  sessions: number;
  pageviews: number;
  inquiries: number;
  cvr: number;
}

export interface ArticleMetric {
  slug: string;
  title: string;
  url: string;
  publishedAt: string;
  pageviews: number;
  uniqueUsers: number;
  avgDuration: number;
  scrollRate: number;
  readRate: number;
  exitRate: number;
  ctaClicks: number;
  ctaClickRate: number;
  inquiries: number;
  cvr: number;
  category: string;
}

export interface ArticleDetail extends ArticleMetric {
  dailyAccess: { date: string; pv: number; users: number }[];
  trafficSources: TrafficSource[];
  deviceBreakdown: { device: string; percentage: number; sessions: number }[];
  nextPages: { page: string; count: number; percentage: number }[];
  exitPages: { page: string; count: number; percentage: number }[];
}

export interface TrafficSource {
  channel: string;
  users: number;
  sessions: number;
  pageviews: number;
  inquiries: number;
  cvr: number;
  color: string;
}

export interface UTMData {
  source: string;
  medium: string;
  campaign: string;
  users: number;
  sessions: number;
  inquiries: number;
  cvr: number;
}

export interface LandingPage {
  page: string;
  sessions: number;
  exitRate: number;
  inquiries: number;
  cvr: number;
}

export interface SEOKeyword {
  keyword: string;
  impressions: number;
  clicks: number;
  ctr: number;
  avgPosition: number;
  landingPage: string;
  inquiries: number;
  cvr: number;
}

export interface FunnelStep {
  label: string;
  users: number;
  rate: number;
  dropoff: number;
}

export interface ConversionType {
  type: string;
  label: string;
  count: number;
  change: number;
}

export interface UserJourney {
  anonymousId: string;
  source: string;
  landingPage: string;
  pages: { url: string; title: string; duration: number }[];
  ctaClicked: boolean;
  converted: boolean;
  convertedAt?: string;
}

export interface FlowNode {
  id: string;
  label: string;
  value: number;
}

export interface FlowLink {
  source: string;
  target: string;
  value: number;
}

export interface Insight {
  id: string;
  type: "warning" | "success" | "info" | "danger";
  category: string;
  title: string;
  description: string;
  metric?: string;
  actionLabel?: string;
  relatedPage?: string;
}

export interface FilterState {
  period: string;
  device: string;
  source: string;
  pageType: string;
}

export type SortField =
  | "pageviews"
  | "inquiries"
  | "cvr"
  | "avgDuration"
  | "ctaClickRate";
export type SortDirection = "asc" | "desc";
