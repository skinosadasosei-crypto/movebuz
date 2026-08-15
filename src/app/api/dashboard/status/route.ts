import { NextResponse } from "next/server";
import { isGA4Configured } from "@/lib/dashboard/ga4";

export async function GET() {
  return NextResponse.json({
    ga4Configured: isGA4Configured(),
    ga4MeasurementId: process.env.NEXT_PUBLIC_GA_ID || null,
  });
}
