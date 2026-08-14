"use client";

import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-card border-b border-border">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-1.5">
          <span className="ig-gradient-text text-xl font-bold tracking-tight">MOVeBUZ</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          <Link href="/blog" className="px-4 py-2 text-sm text-muted hover:text-foreground transition-colors rounded-lg hover:bg-background">
            記事一覧
          </Link>
          <Link href="/about" className="px-4 py-2 text-sm text-muted hover:text-foreground transition-colors rounded-lg hover:bg-background">
            サービス
          </Link>
          <Link
            href="/contact"
            className="ml-2 ig-gradient text-white text-sm font-semibold px-5 py-2 rounded-full hover:opacity-90 transition-opacity"
          >
            無料相談
          </Link>
        </nav>

        <button
          className="md:hidden p-2 text-muted hover:text-foreground transition-colors"
          onClick={() => setOpen(!open)}
          aria-label="メニュー"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            {open ? (
              <path d="M6 6l12 12M6 18L18 6" />
            ) : (
              <path d="M3 6h18M3 12h18M3 18h18" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <nav className="md:hidden border-t border-border bg-card px-4 py-3 flex flex-col gap-1">
          <Link href="/blog" className="px-3 py-2.5 text-sm rounded-lg hover:bg-background" onClick={() => setOpen(false)}>
            記事一覧
          </Link>
          <Link href="/about" className="px-3 py-2.5 text-sm rounded-lg hover:bg-background" onClick={() => setOpen(false)}>
            サービス
          </Link>
          <Link
            href="/contact"
            className="ig-gradient text-white text-sm font-semibold px-5 py-2.5 rounded-full text-center mt-1 hover:opacity-90"
            onClick={() => setOpen(false)}
          >
            無料相談
          </Link>
        </nav>
      )}
    </header>
  );
}
