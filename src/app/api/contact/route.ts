import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";

const FORMSPREE_ID = process.env.NEXT_PUBLIC_FORMSPREE_ID || "";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { company, name, email, phone, plan, message } = body;

    if (!company || !name || !email || !message) {
      return NextResponse.json({ error: "必須項目が不足しています" }, { status: 400 });
    }

    const submission = {
      id: crypto.randomUUID(),
      company,
      name,
      email,
      phone: phone || "",
      plan: plan || "",
      message,
      submittedAt: new Date().toISOString(),
      read: false,
    };

    const [blobResult, formspreeRes] = await Promise.allSettled([
      put(`contacts/${submission.id}.json`, JSON.stringify(submission), {
        contentType: "application/json",
        access: "private",
      }),
      FORMSPREE_ID
        ? fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
            method: "POST",
            body: JSON.stringify(body),
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          })
        : Promise.resolve(null),
    ]);

    const saved = blobResult.status === "fulfilled";
    const forwarded =
      formspreeRes.status === "fulfilled" &&
      formspreeRes.value &&
      (formspreeRes.value as Response).ok !== false;

    return NextResponse.json({ ok: true, saved, forwarded });
  } catch {
    return NextResponse.json({ error: "送信に失敗しました" }, { status: 500 });
  }
}
