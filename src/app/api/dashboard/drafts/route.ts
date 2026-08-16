import { NextResponse } from "next/server";
import { verifySession } from "@/lib/dashboard/auth";
import { getDraftArticles, publishDraft } from "@/lib/articles";

export async function GET() {
  const authed = await verifySession();
  if (!authed) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json({ drafts: getDraftArticles() });
}

export async function POST(req: Request) {
  const authed = await verifySession();
  if (!authed) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const slug = body.slug;
  if (typeof slug !== "string" || !slug) {
    return NextResponse.json({ error: "slug is required" }, { status: 400 });
  }

  const result = publishDraft(slug);
  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
  return NextResponse.json({ success: true });
}
