"use server";

import { redirect } from "next/navigation";
import { createSession, deleteSession, checkPassword } from "@/lib/dashboard/auth";

export async function loginAction(
  _prev: { error: string } | null,
  formData: FormData
): Promise<{ error: string } | null> {
  const password = formData.get("password");
  if (typeof password !== "string" || !password) {
    return { error: "パスワードを入力してください" };
  }

  if (!checkPassword(password)) {
    return { error: "パスワードが正しくありません" };
  }

  await createSession();
  redirect("/dashboard");
}

export async function logoutAction(): Promise<void> {
  await deleteSession();
  redirect("/dashboard/login");
}
