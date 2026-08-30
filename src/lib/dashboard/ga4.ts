import { BetaAnalyticsDataClient } from "@google-analytics/data";

function getClient(): BetaAnalyticsDataClient | null {
  const credentials = process.env.GA4_SERVICE_ACCOUNT_JSON;
  if (!credentials) return null;
  try {
    const parsed = JSON.parse(credentials);
    return new BetaAnalyticsDataClient({ credentials: parsed });
  } catch {
    return null;
  }
}

function getPropertyId(): string | null {
  return process.env.GA4_PROPERTY_ID || null;
}

export function isGA4Configured(): boolean {
  return !!getClient() && !!getPropertyId();
}

const excludeDashboardFilter = {
  notExpression: {
    filter: {
      fieldName: "pagePath",
      stringFilter: {
        matchType: "BEGINS_WITH" as const,
        value: "/dashboard",
      },
    },
  },
};

export async function fetchOverviewMetrics(days: number = 30) {
  const client = getClient();
  const propertyId = getPropertyId();
  if (!client || !propertyId) return null;

  const [response] = await client.runReport({
    property: `properties/${propertyId}`,
    dateRanges: [{ startDate: `${days}daysAgo`, endDate: "today" }],
    dimensionFilter: excludeDashboardFilter,
    metrics: [
      { name: "totalUsers" },
      { name: "sessions" },
      { name: "screenPageViews" },
      { name: "newUsers" },
      { name: "bounceRate" },
      { name: "averageSessionDuration" },
    ],
  });

  const row = response.rows?.[0];
  if (!row?.metricValues) return null;

  const vals = row.metricValues;
  return {
    users: Number(vals[0]?.value || 0),
    sessions: Number(vals[1]?.value || 0),
    pageviews: Number(vals[2]?.value || 0),
    newUsers: Number(vals[3]?.value || 0),
    bounceRate: Number(vals[4]?.value || 0),
    avgSessionDuration: Number(vals[5]?.value || 0),
  };
}

export async function fetchDailyMetrics(days: number = 30) {
  const client = getClient();
  const propertyId = getPropertyId();
  if (!client || !propertyId) return null;

  const [response] = await client.runReport({
    property: `properties/${propertyId}`,
    dateRanges: [{ startDate: `${days}daysAgo`, endDate: "today" }],
    dimensions: [{ name: "date" }],
    dimensionFilter: excludeDashboardFilter,
    metrics: [
      { name: "totalUsers" },
      { name: "sessions" },
      { name: "screenPageViews" },
    ],
    orderBys: [{ dimension: { dimensionName: "date" } }],
  });

  return (response.rows || []).map((row) => ({
    date: formatGADate(row.dimensionValues?.[0]?.value || ""),
    users: Number(row.metricValues?.[0]?.value || 0),
    sessions: Number(row.metricValues?.[1]?.value || 0),
    pv: Number(row.metricValues?.[2]?.value || 0),
  }));
}

export async function fetchTopPages(days: number = 30, limit: number = 20) {
  const client = getClient();
  const propertyId = getPropertyId();
  if (!client || !propertyId) return null;

  const [response] = await client.runReport({
    property: `properties/${propertyId}`,
    dateRanges: [{ startDate: `${days}daysAgo`, endDate: "today" }],
    dimensions: [{ name: "pagePath" }, { name: "pageTitle" }],
    dimensionFilter: excludeDashboardFilter,
    metrics: [
      { name: "screenPageViews" },
      { name: "totalUsers" },
      { name: "averageSessionDuration" },
      { name: "bounceRate" },
    ],
    orderBys: [
      { metric: { metricName: "screenPageViews" }, desc: true },
    ],
    limit,
  });

  return (response.rows || []).map((row) => ({
    path: row.dimensionValues?.[0]?.value || "",
    title: row.dimensionValues?.[1]?.value || "",
    pageviews: Number(row.metricValues?.[0]?.value || 0),
    users: Number(row.metricValues?.[1]?.value || 0),
    avgDuration: Number(row.metricValues?.[2]?.value || 0),
    bounceRate: Number(row.metricValues?.[3]?.value || 0),
  }));
}

export async function fetchTrafficSources(days: number = 30) {
  const client = getClient();
  const propertyId = getPropertyId();
  if (!client || !propertyId) return null;

  const [response] = await client.runReport({
    property: `properties/${propertyId}`,
    dateRanges: [{ startDate: `${days}daysAgo`, endDate: "today" }],
    dimensionFilter: excludeDashboardFilter,
    dimensions: [{ name: "sessionDefaultChannelGroup" }],
    metrics: [
      { name: "totalUsers" },
      { name: "sessions" },
      { name: "screenPageViews" },
    ],
    orderBys: [{ metric: { metricName: "totalUsers" }, desc: true }],
  });

  const colors: Record<string, string> = {
    "Organic Search": "#3b82f6",
    Direct: "#8b5cf6",
    Social: "#f59e0b",
    Referral: "#10b981",
    "Paid Search": "#ef4444",
    Email: "#06b6d4",
    "(Other)": "#94a3b8",
  };

  return (response.rows || []).map((row) => {
    const channel = row.dimensionValues?.[0]?.value || "(Other)";
    return {
      channel,
      users: Number(row.metricValues?.[0]?.value || 0),
      sessions: Number(row.metricValues?.[1]?.value || 0),
      pageviews: Number(row.metricValues?.[2]?.value || 0),
      color: colors[channel] || "#94a3b8",
    };
  });
}

export async function fetchDeviceBreakdown(days: number = 30) {
  const client = getClient();
  const propertyId = getPropertyId();
  if (!client || !propertyId) return null;

  const [response] = await client.runReport({
    property: `properties/${propertyId}`,
    dateRanges: [{ startDate: `${days}daysAgo`, endDate: "today" }],
    dimensionFilter: excludeDashboardFilter,
    dimensions: [{ name: "deviceCategory" }],
    metrics: [{ name: "sessions" }],
    orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
  });

  const total = (response.rows || []).reduce(
    (sum, row) => sum + Number(row.metricValues?.[0]?.value || 0),
    0
  );

  return (response.rows || []).map((row) => {
    const sessions = Number(row.metricValues?.[0]?.value || 0);
    return {
      device: row.dimensionValues?.[0]?.value || "unknown",
      sessions,
      percentage: total > 0 ? Math.round((sessions / total) * 100) : 0,
    };
  });
}

export async function fetchHourlyMetrics(days: number = 30) {
  const client = getClient();
  const propertyId = getPropertyId();
  if (!client || !propertyId) return null;

  const [response] = await client.runReport({
    property: `properties/${propertyId}`,
    dateRanges: [{ startDate: `${days}daysAgo`, endDate: "today" }],
    dimensionFilter: excludeDashboardFilter,
    dimensions: [{ name: "hour" }],
    metrics: [
      { name: "totalUsers" },
      { name: "sessions" },
      { name: "screenPageViews" },
    ],
    orderBys: [{ dimension: { dimensionName: "hour" } }],
  });

  const hours = Array.from({ length: 24 }, (_, i) => ({
    hour: i,
    users: 0,
    sessions: 0,
    pageviews: 0,
  }));

  for (const row of response.rows || []) {
    const h = Number(row.dimensionValues?.[0]?.value || 0);
    if (h >= 0 && h < 24) {
      hours[h].users = Number(row.metricValues?.[0]?.value || 0);
      hours[h].sessions = Number(row.metricValues?.[1]?.value || 0);
      hours[h].pageviews = Number(row.metricValues?.[2]?.value || 0);
    }
  }

  return hours;
}

export async function fetchUserDemographics(days: number = 30) {
  const client = getClient();
  const propertyId = getPropertyId();
  if (!client || !propertyId) return null;

  const [ageRes] = await client.runReport({
    property: `properties/${propertyId}`,
    dateRanges: [{ startDate: `${days}daysAgo`, endDate: "today" }],
    dimensions: [{ name: "userAgeBracket" }],
    metrics: [{ name: "totalUsers" }],
    orderBys: [{ dimension: { dimensionName: "userAgeBracket" } }],
  });

  const [genderRes] = await client.runReport({
    property: `properties/${propertyId}`,
    dateRanges: [{ startDate: `${days}daysAgo`, endDate: "today" }],
    dimensions: [{ name: "userGender" }],
    metrics: [{ name: "totalUsers" }],
    orderBys: [{ metric: { metricName: "totalUsers" }, desc: true }],
  });

  const age = (ageRes.rows || []).map((row) => ({
    bracket: row.dimensionValues?.[0]?.value || "unknown",
    users: Number(row.metricValues?.[0]?.value || 0),
  }));

  const gender = (genderRes.rows || []).map((row) => ({
    gender: row.dimensionValues?.[0]?.value || "unknown",
    users: Number(row.metricValues?.[0]?.value || 0),
  }));

  return { age, gender };
}

function formatGADate(dateStr: string): string {
  if (dateStr.length !== 8) return dateStr;
  return `${dateStr.slice(4, 6)}/${dateStr.slice(6, 8)}`;
}
