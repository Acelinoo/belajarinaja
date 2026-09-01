"use client";

import Link from "next/link";
import { Terminal, Shield, Code, Heart, Sparkles, Map, Award, BookOpen } from "lucide-react";
import { useThemeLanguageStore } from "@/store/useThemeLanguageStore";
import { getTranslations } from "@/lib/translations";
import { BotCompanionCharacter } from "@/components/fun/characters/BotCompanionCharacter";

export function Footer() {
  const { theme, language } = useThemeLanguageStore();
  const t = getTranslations(language);

  // 1. FUN MODE: Playful Adventure Footer
  if (theme === "fun") {
    return (
      <footer className="mt-16 border-t-4 border-[#FED7AA] bg-white py-12 text-[#475569] text-xs">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b-2 border-[#FED7AA]/50">
            <div className="flex items-center gap-4">
              <BotCompanionCharacter className="w-14 h-14 shrink-0" />
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
              <Link href="/glossary" className="px-4 py-2 rounded-full bg-[#EBF8FF] hover:bg-[#5CC8FF]/30 border border-[#5CC8FF]/40 transition-colors">
                {t.nav.glossary}
              </Link>
              <Link href="/dashboard" className="px-4 py-2 rounded-full bg-[#F0FDF4] hover:bg-[#5EDC81]/30 border border-[#86EFAC] transition-colors">
                {t.nav.dashboard}
              </Link>
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#94A3B8] font-bold">
            <div>
              &copy; 2026 BelajarinAja. {t.footer.allRights}
            </div>
            <div className="flex items-center gap-1.5 text-[#243447]">
              <span>Made with joy for future web masters ⭐</span>
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
                  <Terminal className="h-3 w-3" />
                </div>
                <span className="font-black text-sm text-[#FFFFFF] tracking-wider">
                  BELAJARINAJA // COMMAND_NODE
                </span>
              </div>
              <p className="text-xs text-[#666666] leading-relaxed max-w-md">
                Structured 20-stage modern Web Development platform from web fundamentals to production capstone.
              </p>
              <div className="text-[10px] text-[#888888] pt-1">
                SYSTEM_STATUS: <span className="text-[#FFFFFF]">ONLINE_VERIFIED</span> • RUNTIME: <span className="text-[#FFFFFF]">NODE_EDGE</span>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] text-[#666666] font-bold uppercase tracking-wider block">
                CURRICULUM_INDEX
              </span>
              <ul className="space-y-1 text-xs">
                <li><Link href="/roadmap" className="hover:text-[#FFFFFF]">01_WEB_FUNDAMENTALS</Link></li>
                <li><Link href="/roadmap" className="hover:text-[#FFFFFF]">02_HTML_AND_CSS</Link></li>
                <li><Link href="/roadmap" className="hover:text-[#FFFFFF]">03_JAVASCRIPT_TS</Link></li>
                <li><Link href="/roadmap" className="hover:text-[#FFFFFF]">04_REACT_NEXTJS</Link></li>
              </ul>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] text-[#666666] font-bold uppercase tracking-wider block">
                TELEMETRY_LINKS
              </span>
              <ul className="space-y-1 text-xs">
                <li><Link href="/dashboard" className="hover:text-[#FFFFFF]">USER_TELEMETRY</Link></li>
                <li><Link href="/glossary" className="hover:text-[#FFFFFF]">CMD_GLOSSARY</Link></li>
                <li><Link href="/certificates" className="hover:text-[#FFFFFF]">CERT_VERIFICATION</Link></li>
                <li><Link href="/settings" className="hover:text-[#FFFFFF]">SYSTEM_CONFIG</Link></li>
              </ul>
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#555555]">
            <div>&copy; 2026 BELAJARINAJA. ALL_RIGHTS_RESERVED.</div>
            <div>STRICT_MONOCHROME_COMMAND_CENTER // ZERO_COLORS</div>
          </div>
        </div>
      </footer>
    );
  }

  // 3. LIGHT MODE: Modern Neo-Brutalist Editorial Paper Footer
  return (
    <footer className="mt-16 border-t-2 border-black bg-white py-12 text-[#404040] text-xs">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b-2 border-black">
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded border-2 border-black bg-[#FFD84D] text-[#121212] font-mono font-black text-xs shadow-[2px_2px_0px_#121212]">
                BA
              </div>
              <span className="font-black tracking-tight text-sm text-[#121212]">
                Belajarin<span className="bg-[#FFD84D] px-1 rounded border border-black ml-1 text-xs">Aja</span>
              </span>
            </div>
            <p className="text-xs leading-relaxed max-w-sm font-medium text-[#555555]">
              {t.footer.tagline}
            </p>
            <div className="flex items-center gap-2 pt-2 text-[11px] font-bold">
              <span className="inline-block h-2.5 w-2.5 border border-black bg-[#7BE495]"></span>
              <span className="text-[#121212]">{t.footer.systemOnline}</span>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-black text-[#121212] text-xs uppercase font-mono tracking-wider">
              {t.nav.roadmap}
            </h4>
            <ul className="space-y-1.5 font-medium text-[#555555]">
              <li><Link href="/roadmap" className="hover:text-[#121212] hover:underline">Web Fundamentals</Link></li>
              <li><Link href="/roadmap" className="hover:text-[#121212] hover:underline">HTML5 &amp; Modern CSS</Link></li>
              <li><Link href="/roadmap" className="hover:text-[#121212] hover:underline">JavaScript &amp; TypeScript</Link></li>
              <li><Link href="/roadmap" className="hover:text-[#121212] hover:underline">React &amp; Next.js 15</Link></li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-black text-[#121212] text-xs uppercase font-mono tracking-wider">
              {t.footer.quickLinks}
            </h4>
            <ul className="space-y-1.5 font-medium text-[#555555]">
              <li><Link href="/glossary" className="hover:text-[#121212] hover:underline">{t.nav.glossary}</Link></li>
              <li><Link href="/dashboard" className="hover:text-[#121212] hover:underline">{t.nav.dashboard}</Link></li>
              <li><Link href="/certificates" className="hover:text-[#121212] hover:underline">{t.certificates.title}</Link></li>
              <li><Link href="/settings" className="hover:text-[#121212] hover:underline">{t.nav.settings}</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] font-bold text-[#555555]">
          <div>&copy; 2026 BelajarinAja. {t.footer.allRights}</div>
          <div>Architected &amp; Built with Neo-Brutalism Design System</div>
        </div>
      </div>
    </footer>
  );
}
