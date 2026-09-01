"use client";

import { useState } from "react";

export default function SoseiHeader() {
  const [open, setOpen] = useState(false);

  const links = [
    { href: "#about", label: "私たちについて" },
    { href: "#strengths", label: "強み" },
    { href: "#services", label: "事業内容" },
    { href: "#company", label: "会社概要" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-border">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2">
          <span className="ig-gradient-text text-2xl font-bold tracking-tight">SOSEI</span>
        </a>

        <nav className="hidden md:flex items-center gap-1">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="px-4 py-2 text-sm text-muted hover:text-foreground transition-colors rounded-lg hover:bg-background"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#contact"
            className="ml-2 ig-gradient text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:opacity-90 transition-opacity"
          >
            相談する（無料）
          </a>
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
        <nav className="md:hidden border-t border-border bg-white px-4 py-3 flex flex-col gap-1">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="px-3 py-2.5 text-sm rounded-lg hover:bg-background"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <a
            href="#contact"
            className="ig-gradient text-white text-sm font-semibold px-5 py-2.5 rounded-full text-center mt-1 hover:opacity-90"
            onClick={() => setOpen(false)}
          >
            相談する（無料）
          </a>
        </nav>
      )}
    </header>
  );
}
