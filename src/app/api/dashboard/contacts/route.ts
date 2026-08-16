import { NextRequest, NextResponse } from "next/server";
import { list, del, get, put } from "@vercel/blob";

async function readBlob(url: string): Promise<Record<string, unknown> | null> {
  try {
    const result = await get(url, { access: "private" });
    if (!result?.stream) return null;
    const reader = result.stream.getReader();
    const chunks: Uint8Array[] = [];
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
    }
    const text = Buffer.concat(chunks).toString();
    return JSON.parse(text);
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  try {
    const cursor = req.nextUrl.searchParams.get("cursor") || undefined;
    const result = await list({
      prefix: "contacts/",
      limit: 50,
      cursor,
    });

    const submissions = await Promise.all(
      result.blobs.map((blob) => readBlob(blob.url))
    );

    const valid = submissions
      .filter(Boolean)
      .sort(
        (a, b) =>
          new Date((b as { submittedAt: string }).submittedAt).getTime() -
          new Date((a as { submittedAt: string }).submittedAt).getTime()
      );

    return NextResponse.json({
      submissions: valid,
      hasMore: result.hasMore,
      cursor: result.cursor,
    });
  } catch {
    return NextResponse.json({ submissions: [], hasMore: false });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    const result = await list({ prefix: `contacts/${id}` });
    if (result.blobs.length > 0) {
      await del(result.blobs[0].url);
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "削除に失敗しました" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { id } = await req.json();
    const result = await list({ prefix: `contacts/${id}` });
    if (result.blobs.length > 0) {
      const data = await readBlob(result.blobs[0].url);
      if (data) {
        data.read = true;
        await del(result.blobs[0].url);
        await put(`contacts/${id}.json`, JSON.stringify(data), {
          contentType: "application/json",
          access: "private",
        });
      }
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "更新に失敗しました" }, { status: 500 });
  }
}
