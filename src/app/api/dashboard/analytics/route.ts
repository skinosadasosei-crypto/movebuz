import { NextResponse } from "next/server";
import {
  isGA4Configured,
  fetchOverviewMetrics,
  fetchDailyMetrics,
  fetchTopPages,
  fetchTrafficSources,
  fetchDeviceBreakdown,
  fetchHourlyMetrics,
  fetchUserDemographics,
} from "@/lib/dashboard/ga4";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const days = Number(searchParams.get("days") || "30");
  const type = searchParams.get("type") || "overview";

  if (!isGA4Configured()) {
    return NextResponse.json({ configured: false, data: null });
  }

  try {
    let data;
    switch (type) {
      case "overview":
        data = await fetchOverviewMetrics(days);
        break;
      case "daily":
        data = await fetchDailyMetrics(days);
        break;
      case "pages":
        data = await fetchTopPages(days);
        break;
      case "traffic":
        data = await fetchTrafficSources(days);
        break;
      case "devices":
        data = await fetchDeviceBreakdown(days);
        break;
      case "hourly":
        data = await fetchHourlyMetrics(days);
        break;
      case "demographics":
        data = await fetchUserDemographics(days);
        break;
      default:
        return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }
    return NextResponse.json({ configured: true, data });
  } catch (error) {
    console.error(`GA4 API error (type=${type}):`, error);
    const message = error instanceof Error ? error.message : "Unknown error";
    const isDemoError = type === "demographics" && message.includes("userAgeBracket");
    return NextResponse.json(
      {
        configured: true,
        data: null,
        error: isDemoError
          ? "デモグラフィックデータの取得に失敗しました。GA4で「Googleシグナル」が有効になっているか確認してください。"
          : `データ取得エラー: ${message}`,
      },
      { status: 500 }
    );
  }
}
