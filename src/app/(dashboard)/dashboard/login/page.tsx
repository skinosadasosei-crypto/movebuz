"use client";

import { useActionState } from "react";
import { loginAction } from "./actions";

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, null);

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)" }}
    >
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg mx-auto mb-4"
            style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)" }}
          >
            M
          </div>
          <h1 className="text-xl font-bold text-white">MOVeBUZ Analytics</h1>
          <p className="text-sm text-slate-400 mt-1">管理画面にログイン</p>
        </div>

        <form
          action={formAction}
          className="rounded-2xl border p-6 space-y-5"
          style={{ background: "#1e293b", borderColor: "#334155" }}
        >
          <div>
            <label
              htmlFor="password"
              className="block text-xs font-medium text-slate-300 mb-1.5"
            >
              パスワード
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoFocus
              required
              className="w-full px-3.5 py-2.5 rounded-lg border text-sm text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-blue-500/40"
              style={{ background: "#0f172a", borderColor: "#334155" }}
              placeholder="パスワードを入力"
            />
          </div>

          {state?.error && (
            <p className="text-sm text-red-400 bg-red-400/10 rounded-lg px-3 py-2">
              {state.error}
            </p>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full py-2.5 rounded-lg text-sm font-semibold text-white transition-opacity disabled:opacity-50"
            style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)" }}
          >
            {isPending ? "ログイン中..." : "ログイン"}
          </button>
        </form>

        <p className="text-center text-xs text-slate-500 mt-6">
          &copy; 2026 MOVeBUZ. All rights reserved.
        </p>
      </div>
    </div>
  );
}
