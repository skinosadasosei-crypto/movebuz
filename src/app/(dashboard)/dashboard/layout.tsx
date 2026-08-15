"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAction } from "./login/actions";
import "./dashboard.css";

const navItems = [
  { href: "/dashboard", label: "ダッシュボード", icon: "grid" },
  { href: "/dashboard/articles", label: "記事・ページ分析", icon: "file-text" },
  { href: "/dashboard/traffic", label: "流入分析", icon: "arrow-down-left" },
  { href: "/dashboard/conversions", label: "コンバージョン分析", icon: "target" },
  { href: "/dashboard/user-flow", label: "ユーザー導線分析", icon: "git-branch" },
  { href: "/dashboard/insights", label: "改善提案", icon: "lightbulb" },
];

function NavIcon({ name, className }: { name: string; className?: string }) {
  const icons: Record<string, React.ReactNode> = {
    grid: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
    "file-text": (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" />
      </svg>
    ),
    "arrow-down-left": (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="17" y1="7" x2="7" y2="17" /><polyline points="17 17 7 17 7 7" />
      </svg>
    ),
    target: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" />
      </svg>
    ),
    "git-branch": (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="6" y1="3" x2="6" y2="15" /><circle cx="18" cy="6" r="3" /><circle cx="6" cy="18" r="3" /><path d="M18 9a9 9 0 0 1-9 9" />
      </svg>
    ),
    lightbulb: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 18h6" /><path d="M10 22h4" /><path d="M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z" />
      </svg>
    ),
  };
  return <>{icons[name]}</>;
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [period, setPeriod] = useState("past30");

  if (pathname === "/dashboard/login") {
    return <>{children}</>;
  }

  return (
        <div className="flex h-screen" style={{ background: "var(--dash-bg)" }}>
          {sidebarOpen && (
            <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
          )}
          <aside
            className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-200 lg:relative lg:translate-x-0 ${
              sidebarOpen ? "translate-x-0" : "-translate-x-full"
            }`}
            style={{ background: "var(--dash-sidebar)" }}
          >
            <div className="flex h-14 items-center gap-2 px-5 border-b border-white/10">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white font-bold text-sm" style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)" }}>
                M
              </div>
              <span className="text-white font-semibold text-sm tracking-wide">MOVeBUZ Analytics</span>
            </div>
            <nav className="mt-2 px-3 space-y-0.5">
              {navItems.map((item) => {
                const isActive = item.href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors"
                    style={{
                      color: isActive ? "#ffffff" : "#94a3b8",
                      background: isActive ? "var(--dash-sidebar-active)" : "transparent",
                    }}
                    onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = "var(--dash-sidebar-hover)"; }}
                    onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
                  >
                    <NavIcon name={item.icon} className="w-[18px] h-[18px]" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10 space-y-2">
              <Link href="/" className="flex items-center gap-2 text-xs text-slate-400 hover:text-slate-200 transition-colors">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
                サイトに戻る
              </Link>
              <form action={logoutAction}>
                <button type="submit" className="flex items-center gap-2 text-xs text-slate-400 hover:text-red-400 transition-colors w-full">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
                  ログアウト
                </button>
              </form>
            </div>
          </aside>

          <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
            <header className="h-14 flex items-center justify-between px-4 lg:px-6 border-b shrink-0" style={{ background: "var(--dash-card)", borderColor: "var(--dash-border)" }}>
              <div className="flex items-center gap-3">
                <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-1.5 rounded-md hover:bg-slate-100">
                  <svg className="w-5 h-5 text-slate-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
                </button>
                <h1 className="text-sm font-semibold" style={{ color: "var(--dash-text)" }}>
                  {navItems.find((n) => n.href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(n.href))?.label || "ダッシュボード"}
                </h1>
              </div>
              <div className="flex items-center gap-3">
                <select
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  className="text-xs rounded-lg border px-3 py-1.5 outline-none focus:ring-2 focus:ring-blue-500/20"
                  style={{ borderColor: "var(--dash-border)", color: "var(--dash-text)" }}
                >
                  <option value="today">今日</option>
                  <option value="yesterday">昨日</option>
                  <option value="past7">過去7日</option>
                  <option value="past30">過去30日</option>
                  <option value="thisMonth">今月</option>
                  <option value="lastMonth">先月</option>
                  <option value="custom">カスタム</option>
                </select>
                <select className="text-xs rounded-lg border px-3 py-1.5 outline-none focus:ring-2 focus:ring-blue-500/20" style={{ borderColor: "var(--dash-border)", color: "var(--dash-text)" }}>
                  <option>すべてのデバイス</option>
                  <option>PC</option>
                  <option>Mobile</option>
                  <option>Tablet</option>
                </select>
                <select className="text-xs rounded-lg border px-3 py-1.5 outline-none hidden md:block" style={{ borderColor: "var(--dash-border)", color: "var(--dash-text)" }}>
                  <option>すべての流入元</option>
                  <option>Organic</option>
                  <option>Direct</option>
                  <option>Social</option>
                  <option>Referral</option>
                  <option>Paid</option>
                  <option>Email</option>
                </select>
              </div>
            </header>

            <main className="flex-1 overflow-y-auto p-4 lg:p-6">
              {children}
            </main>
          </div>
        </div>
  );
}
