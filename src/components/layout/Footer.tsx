"use client";

import Link from "next/link";
import { Terminal, Shield, Code, Heart, Sparkles, Map, Award, BookOpen } from "lucide-react";
import { useThemeLanguageStore } from "@/store/useThemeLanguageStore";
import { getTranslations } from "@/lib/translations";
import { NovaCharacter } from "@/components/fun/characters/NovaCharacter";

export function Footer() {
  const { theme, language } = useThemeLanguageStore();
  const t = getTranslations(language);

  // 1. FUN MODE: Story Journey Footer
  if (theme === "fun") {
    return (
      <footer className="mt-16 border-t-4 border-[#FED7AA] bg-white py-12 text-[#475569] text-xs">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b-2 border-[#FED7AA]/50">
            <div className="flex items-center gap-4">
              <NovaCharacter state="encouraging" className="w-14 h-14 shrink-0" />
              <div>
                <span className="font-black tracking-tight text-lg text-[#243447]">
                  Belajarin<span className="text-[#D97706] bg-[#FFF8E7] px-1.5 py-0.5 rounded-full border border-[#FED7AA] ml-1 text-sm">Aja</span>
                </span>
                <p className="text-xs text-[#64748B] font-medium max-w-md">
                  {t.footer.funTagline}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 text-xs font-black text-[#243447]">
              <Link href="/roadmap" className="px-4 py-2 rounded-full bg-[#FFF8E7] hover:bg-[#FFD84D]/30 border border-[#FED7AA] transition-colors">
                {t.nav.roadmap}
              </Link>
              <Link href="/glossary" className="px-4 py-2 rounded-full bg-[#FFF8E7] hover:bg-[#5CC8FF]/30 border border-[#FED7AA] transition-colors">
                {t.nav.glossary}
              </Link>
              <Link href="/dashboard" className="px-4 py-2 rounded-full bg-[#FFF8E7] hover:bg-[#45E0C0]/30 border border-[#FED7AA] transition-colors">
                {t.nav.dashboard}
              </Link>
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#94A3B8] font-bold">
            <div>
              &copy; 2026 BelajarinAja. {t.footer.allRights}
            </div>
            <div className="flex items-center gap-1.5 text-[#243447]">
              <span>Diciptakan untuk membawa pemula menjadi Web Developer handal ⭐</span>
            </div>
          </div>
        </div>
      </footer>
    );
  }

  // 2. DARK MODE: Monochrome Obsidian Command Center Telemetry Footer
  if (theme === "dark") {
    return (
      <footer className="mt-16 border-t border-[#222222] bg-[#050505] py-10 text-[#888888] text-xs font-mono">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-[#1A1A1A]">
            <div className="md:col-span-2 space-y-2">
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded border border-[#333333] bg-[#111111] text-[#FFFFFF] text-xs font-bold">
                  &gt;_
                </div>
                <span className="font-black text-sm text-[#FFFFFF] tracking-wider">
                  BELAJARINAJA // WORKSPACE_ROOT
                </span>
              </div>
              <p className="text-xs text-[#666666] leading-relaxed max-w-md">
                Structured 20-stage modern Web Development engineering path from browser primitives to production capstone.
              </p>
              <div className="text-[10px] text-[#888888] pt-1">
                STATUS: <span className="text-[#FFFFFF]">ONLINE_VERIFIED</span> • RUNTIME: <span className="text-[#FFFFFF]">NODE_EDGE</span>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] text-[#666666] font-bold uppercase tracking-wider block">
                KNOWLEDGE_TREE
              </span>
              <ul className="space-y-1 text-xs">
                <li><Link href="/roadmap" className="hover:text-[#FFFFFF]">01_WEB_PROTOCOLS</Link></li>
                <li><Link href="/roadmap" className="hover:text-[#FFFFFF]">02_HTML5_SEMANTICS</Link></li>
                <li><Link href="/roadmap" className="hover:text-[#FFFFFF]">03_CSS_FLEX_GRID</Link></li>
                <li><Link href="/roadmap" className="hover:text-[#FFFFFF]">04_JAVASCRIPT_RUNTIME</Link></li>
              </ul>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] text-[#666666] font-bold uppercase tracking-wider block">
                SYSTEM_NODES
              </span>
              <ul className="space-y-1 text-xs">
                <li><Link href="/dashboard" className="hover:text-[#FFFFFF]">USER_TELEMETRY</Link></li>
                <li><Link href="/glossary" className="hover:text-[#FFFFFF]">CLI_GLOSSARY</Link></li>
                <li><Link href="/certificates" className="hover:text-[#FFFFFF]">CRYPTO_SEAL</Link></li>
                <li><Link href="/settings" className="hover:text-[#FFFFFF]">CONFIG_PANEL</Link></li>
              </ul>
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#666666]">
            <div>
              &copy; 2026 BELAJARINAJA // OPEN_LEARNING_PROTOCOL
            </div>
            <div className="flex items-center gap-4 text-[#888888]">
              <span>STANDALONE_WORKSPACE</span>
              <span>100%_MONOCHROME_VERIFIED</span>
            </div>
          </div>
        </div>
      </footer>
    );
  }

  // 3. LIGHT MODE: Modern Neo-Brutalism Editorial Footer
  return (
    <footer className="mt-16 border-t-2 border-black bg-white py-12 text-[#121212] text-xs">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b-2 border-black">
          <div className="space-y-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded border-2 border-black bg-[#FFD84D] font-mono font-black text-xs shadow-[1.5px_1.5px_0px_#121212]">
                BA
              </div>
              <span className="font-black text-base text-[#121212]">BelajarinAja</span>
            </div>
            <p className="text-xs text-[#555555] max-w-md">
              {t.footer.tagline}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs font-black">
            <Link href="/roadmap" className="px-3.5 py-1.5 rounded-lg border-2 border-black bg-[#F7F4EA] hover:bg-[#FFD84D] shadow-[2px_2px_0px_#121212] transition-colors">
              {t.nav.roadmap}
            </Link>
            <Link href="/glossary" className="px-3.5 py-1.5 rounded-lg border-2 border-black bg-[#F7F4EA] hover:bg-[#70B7FF] shadow-[2px_2px_0px_#121212] transition-colors">
              {t.nav.glossary}
            </Link>
            <Link href="/dashboard" className="px-3.5 py-1.5 rounded-lg border-2 border-black bg-[#F7F4EA] hover:bg-[#7BE495] shadow-[2px_2px_0px_#121212] transition-colors">
              {t.nav.dashboard}
            </Link>
          </div>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#555555] font-bold">
          <div>
            &copy; 2026 BelajarinAja. {t.footer.allRights}
          </div>
          <div>
            <span>Platform Pembelajaran Web Development Modern</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
