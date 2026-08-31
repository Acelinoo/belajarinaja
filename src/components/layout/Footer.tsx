"use client";

import Link from "next/link";
import { Terminal, Shield, Code, Heart, Sparkles, Map, Award, BookOpen } from "lucide-react";
import { useThemeLanguageStore } from "@/store/useThemeLanguageStore";
import { getTranslations } from "@/lib/translations";

export function Footer() {
  const { theme, language } = useThemeLanguageStore();
  const t = getTranslations(language);

  // FUN MODE FOOTER
  if (theme === "fun") {
    return (
      <footer className="mt-16 border-t-2 border-[#E2E8F0] bg-white py-12 text-[#475569] text-xs">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b-2 border-[#E2E8F0]">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FFD84D] text-[#243447] text-lg font-black shadow-[0_4px_10px_rgba(255,216,77,0.4)]">
                🚀
              </div>
              <div>
                <span className="font-black tracking-tight text-base text-[#243447]">
                  Belajarin<span className="text-[#FF6B6B]">Aja</span>
                </span>
                <p className="text-[11px] text-[#64748B] font-medium">
                  {t.footer.funTagline}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-[#243447]">
              <Link href="/roadmap" className="px-3 py-1.5 rounded-full bg-[#FFF8E7] hover:bg-[#FFD84D]/30 transition-colors">
                {t.nav.roadmap}
              </Link>
              <Link href="/glossary" className="px-3 py-1.5 rounded-full bg-[#EBF8FF] hover:bg-[#5CC8FF]/30 transition-colors">
                {t.nav.glossary}
              </Link>
              <Link href="/dashboard" className="px-3 py-1.5 rounded-full bg-[#F0FDF4] hover:bg-[#5EDC81]/30 transition-colors">
                {t.nav.dashboard}
              </Link>
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#94A3B8]">
            <div>
              © 2026 BelajarinAja. {t.footer.allRights}
            </div>
            <div className="flex items-center gap-1 font-bold text-[#243447]">
              <span>Made for joyful learning ⭐</span>
            </div>
          </div>
        </div>
      </footer>
    );
  }

  // STANDARD LIGHT & DARK FOOTER
  return (
    <footer className="border-t-2 border-black bg-white dark:border-t dark:border-[#1C242D] dark:bg-[#05070A] py-12 text-[#404040] dark:text-[#94A3B8] text-xs">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4 lg:grid-cols-5">
          {/* Col 1: Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded border-2 border-black bg-[#FFD84D] text-[#121212] font-mono font-black text-xs shadow-[2px_2px_0px_#121212] dark:border dark:border-cyan-500/40 dark:bg-cyan-500/10 dark:text-cyan-300 dark:shadow-none">
                BA
              </div>
              <span className="font-black tracking-tight text-foreground text-sm">
                Belajarin<span className="text-[#121212] dark:text-cyan-400 bg-[#FFD84D] dark:bg-transparent px-1 rounded-sm border border-black dark:border-0 ml-0.5">Aja</span>
              </span>
            </div>
            <p className="text-xs leading-relaxed max-w-sm font-medium dark:font-normal dark:text-[#8292A6]">
              {t.footer.tagline}
            </p>
            <div className="flex items-center gap-2 pt-2 text-[11px] font-bold dark:font-mono">
              <span className="inline-block h-2.5 w-2.5 border border-black rounded-none bg-[#7BE495] dark:rounded-full dark:border-0 dark:bg-emerald-400 dark:shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
              <span className="text-foreground dark:text-[#CBD5E1]">{t.footer.systemOnline}</span>
            </div>
          </div>

          {/* Col 2: Kurikulum */}
          <div className="space-y-2.5">
            <h4 className="font-black text-foreground text-xs uppercase font-mono tracking-wider dark:text-cyan-400">
              {t.nav.roadmap}
            </h4>
            <ul className="space-y-1.5 font-medium dark:font-normal">
              <li>
                <Link href="/roadmap" className="hover:text-foreground hover:underline transition-colors dark:hover:text-cyan-300 dark:no-underline">
                  Web Fundamentals
                </Link>
              </li>
              <li>
                <Link href="/roadmap" className="hover:text-foreground hover:underline transition-colors dark:hover:text-cyan-300 dark:no-underline">
                  HTML5 & Modern CSS
                </Link>
              </li>
              <li>
                <Link href="/roadmap" className="hover:text-foreground hover:underline transition-colors dark:hover:text-cyan-300 dark:no-underline">
                  JavaScript & TypeScript
                </Link>
              </li>
              <li>
                <Link href="/roadmap" className="hover:text-foreground hover:underline transition-colors dark:hover:text-cyan-300 dark:no-underline">
                  React & Next.js 15
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Fitur Belajar */}
          <div className="space-y-2.5">
            <h4 className="font-black text-foreground text-xs uppercase font-mono tracking-wider dark:text-cyan-400">
              {t.footer.quickLinks}
            </h4>
            <ul className="space-y-1.5 font-medium dark:font-normal">
              <li>
                <Link href="/dashboard" className="hover:text-foreground hover:underline transition-colors dark:hover:text-cyan-300 dark:no-underline">
                  {t.nav.dashboard}
                </Link>
              </li>
              <li>
                <Link href="/roadmap" className="hover:text-foreground hover:underline transition-colors dark:hover:text-cyan-300 dark:no-underline">
                  {t.hero.ctaRoadmap}
                </Link>
              </li>
              <li>
                <Link href="/glossary" className="hover:text-foreground hover:underline transition-colors dark:hover:text-cyan-300 dark:no-underline">
                  {t.nav.glossary}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Akun & Bantuan */}
          <div className="space-y-2.5">
            <h4 className="font-black text-foreground text-xs uppercase font-mono tracking-wider dark:text-cyan-400">
              {t.auth.loginTitle}
            </h4>
            <ul className="space-y-1.5 font-medium dark:font-normal">
              <li>
                <Link href="/auth/login" className="hover:text-foreground hover:underline transition-colors dark:hover:text-cyan-300 dark:no-underline">
                  {t.auth.submitLogin}
                </Link>
              </li>
              <li>
                <Link href="/certificates" className="hover:text-foreground hover:underline transition-colors dark:hover:text-cyan-300 dark:no-underline">
                  {t.certificates.title}
                </Link>
              </li>
              <li>
                <Link href="/settings" className="hover:text-foreground hover:underline transition-colors dark:hover:text-cyan-300 dark:no-underline">
                  {t.nav.settings}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom divider */}
        <div className="mt-10 pt-6 border-t-2 border-black dark:border-t dark:border-[#1C242D] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-medium dark:font-normal">
          <div className="dark:text-[#64748B]">
            © 2026 BelajarinAja. {t.footer.allRights}
          </div>
          <div className="flex items-center gap-4">
            <Link href="/roadmap" className="hover:text-foreground hover:underline dark:hover:text-cyan-300 dark:no-underline">
              {t.nav.roadmap}
            </Link>
            <Link href="/glossary" className="hover:text-foreground hover:underline dark:hover:text-cyan-300 dark:no-underline">
              {t.nav.glossary}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

