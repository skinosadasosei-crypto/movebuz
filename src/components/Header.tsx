"use client";

import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-border">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary">
          <span className="text-2xl">▶</span>
          <span>動画のミカタ</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="/blog" className="hover:text-primary transition-colors">
            記事一覧
          </Link>
          <Link href="/about" className="hover:text-primary transition-colors">
            サービス紹介
          </Link>
          <Link
            href="/contact"
            className="bg-primary text-white px-5 py-2.5 rounded-lg hover:bg-primary-dark transition-colors"
          >
            無料相談する
          </Link>
        </nav>

        <button
          className="md:hidden p-2"
          onClick={() => setOpen(!open)}
          aria-label="メニュー"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? (
              <path d="M6 6l12 12M6 18L18 6" />
            ) : (
              <path d="M3 6h18M3 12h18M3 18h18" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <nav className="md:hidden border-t border-border bg-white px-4 py-4 flex flex-col gap-4">
          <Link href="/blog" className="hover:text-primary" onClick={() => setOpen(false)}>
            記事一覧
          </Link>
          <Link href="/about" className="hover:text-primary" onClick={() => setOpen(false)}>
            サービス紹介
          </Link>
          <Link
            href="/contact"
            className="bg-primary text-white px-5 py-2.5 rounded-lg text-center hover:bg-primary-dark"
            onClick={() => setOpen(false)}
          >
            無料相談する
          </Link>
        </nav>
      )}
    </header>
  );
}
