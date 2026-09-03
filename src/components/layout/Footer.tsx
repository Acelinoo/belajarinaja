"use client";

import Link from "next/link";
import { BookOpen, Map, Award, Compass, ShieldCheck } from "lucide-react";
import { useThemeLanguageStore } from "@/store/useThemeLanguageStore";
import { getTranslations } from "@/lib/translations";
import { NovaCharacter } from "@/components/fun/characters/NovaCharacter";

export function Footer() {
  const { theme, language } = useThemeLanguageStore();
  const t = getTranslations(language);

  return (
    <footer className="mt-16 border-t border-border bg-card/60 py-12 text-muted-foreground text-xs transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-border">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <img
                src="/logo.png"
                alt="Logo BelajarinAja"
                className="h-8 w-8 rounded-lg object-contain dark:invert"
              />
              <span className="font-bold text-sm text-foreground tracking-tight">
                Belajarin<span className="text-primary font-black">Aja</span>
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-md">
              {language === "en"
                ? "Structured 20-stage modern Web Development curriculum from browser fundamentals and semantic HTML to fullstack React, Next.js 15, and database architecture."
                : "Platform kurikulum Web Development modern 20 tahap: dari fundamental web, HTML5 semantik, CSS responsif, JavaScript, hingga React, Next.js 15, dan PostgreSQL."}
            </p>
          </div>

          {/* Nav Tracks */}
          <div className="space-y-2.5">
            <span className="text-xs font-bold text-foreground uppercase tracking-wider block">
              {t.nav.roadmap}
            </span>
            <ul className="space-y-1.5 text-xs text-muted-foreground">
              <li><Link href="/roadmap" className="hover:text-foreground transition-colors">01. Web Foundations</Link></li>
              <li><Link href="/roadmap" className="hover:text-foreground transition-colors">02. HTML5 & Modern CSS</Link></li>
              <li><Link href="/roadmap" className="hover:text-foreground transition-colors">03. JavaScript & DOM</Link></li>
              <li><Link href="/roadmap" className="hover:text-foreground transition-colors">04. React & Fullstack</Link></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="space-y-2.5">
            <span className="text-xs font-bold text-foreground uppercase tracking-wider block">
              {language === "en" ? "Ecosystem" : "Ekosistem"}
            </span>
            <ul className="space-y-1.5 text-xs text-muted-foreground">
              <li><Link href="/glossary" className="hover:text-foreground transition-colors">{t.nav.glossary}</Link></li>
              <li><Link href="/certificates" className="hover:text-foreground transition-colors">{t.nav.certificates}</Link></li>
              <li><Link href="/dashboard" className="hover:text-foreground transition-colors">{t.nav.dashboard}</Link></li>
              <li><Link href="/settings" className="hover:text-foreground transition-colors">{t.nav.settings}</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright & author attribution */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <div className="flex flex-wrap items-center gap-1.5">
            <span>&copy; 2026 BelajarinAja.</span>
            <span>•</span>
            <span>
              {language === "en" ? "Crafted by" : "Website ini dibuat oleh"}{" "}
              <a
                href="https://www.acelino.my.id"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-foreground hover:text-primary underline underline-offset-4 decoration-primary/50 hover:decoration-primary transition-colors cursor-pointer"
              >
                Acelino
              </a>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-3.5 w-3.5 text-primary" />
            <span>
              {language === "en"
                ? "Structured Modern Web Learning Platform"
                : "Platform Pembelajaran Web Terstruktur"}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
