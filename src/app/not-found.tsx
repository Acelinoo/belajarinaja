"use client";

import Link from "next/link";
import { Compass, ArrowLeft, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useThemeLanguageStore } from "@/store/useThemeLanguageStore";
import { getTranslations } from "@/lib/translations";
import { HelpGuideCharacter } from "@/components/fun/characters/HelpGuideCharacter";

export default function NotFound() {
  const { theme, language } = useThemeLanguageStore();
  const t = getTranslations(language);

  // 1. FUN MODE: Lost Space Explorer
  if (theme === "fun") {
    return (
      <div className="flex min-h-screen flex-col bg-[#FFF8E7] text-[#243447]">
        <Navbar />
        <main className="flex-1 flex items-center justify-center py-20 px-4">
          <div className="max-w-md w-full text-center space-y-6">
            <HelpGuideCharacter
              className="w-36 h-36 mx-auto"
              speechBubbleText={language === "en" ? "Oops! Lost in orbit?" : "Ups! Tersesat di orbit?"}
            />

            <div className="space-y-2">
              <span className="text-xs font-black text-[#D97706] bg-white px-3.5 py-1 rounded-full border border-[#FED7AA]">
                {t.notFound.funBadge}
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-[#243447]">
                {t.notFound.title}
              </h1>
              <p className="text-xs text-[#64748B] font-medium max-w-sm mx-auto">
                {t.notFound.desc}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link href="/roadmap" className="w-full sm:w-auto">
                <Button className="w-full rounded-full bg-[#FFD84D] hover:bg-[#FFC933] text-[#243447] font-black text-xs px-6 shadow-[0_4px_12px_rgba(255,216,77,0.4)]">
                  <Compass className="h-4 w-4 mr-1.5" />
                  <span>{t.notFound.ctaRoadmap}</span>
                </Button>
              </Link>
              <Link href="/" className="w-full sm:w-auto">
                <Button variant="outline" className="w-full rounded-full border-[#FED7AA] bg-white text-[#243447] font-bold text-xs">
                  <ArrowLeft className="h-4 w-4 mr-1.5" />
                  <span>{t.notFound.ctaHome}</span>
                </Button>
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // 2. DARK MODE: Monochrome Terminal Traceback (100% Monochrome)
  if (theme === "dark") {
    return (
      <div className="flex min-h-screen flex-col bg-[#050505] text-[#FFFFFF] font-mono">
        <Navbar />
        <main className="flex-1 flex items-center justify-center py-20 px-4">
          <div className="max-w-md w-full text-center space-y-6">
            <div className="p-4 rounded border border-[#333333] bg-[#0A0A0A] inline-block font-mono text-2xl font-black text-[#FFFFFF]">
              [ERROR_404_ROUTE_NOT_FOUND]
            </div>

            <div className="space-y-1">
              <h1 className="text-lg font-black text-[#FFFFFF]">
                URL_NOT_LOCATED // INVALID_ROUTER_PATH
              </h1>
              <p className="text-xs text-[#888888]">
                Requested route does not match any compiled endpoints in this deployment.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <Link href="/roadmap">
                <Button size="sm" className="font-mono text-xs bg-[#FFFFFF] hover:bg-[#E5E5E5] text-[#000000] font-bold">
                  LAUNCH_ROADMAP &rarr;
                </Button>
              </Link>
              <Link href="/">
                <Button size="sm" variant="outline" className="font-mono text-xs border-[#222222] bg-[#050505] text-[#CCCCCC]">
                  RETURN_ROOT
                </Button>
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // 3. LIGHT MODE: Modern Neo-Brutalism Block Stamp
  return (
    <div className="flex min-h-screen flex-col bg-[#F7F4EA] text-[#121212]">
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-20 px-4">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-xl border-2 border-black bg-[#FFD84D] text-[#121212] font-mono text-2xl font-black shadow-[4px_4px_0px_#121212]">
            404
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-black tracking-tight text-[#121212]">
              {t.notFound.title}
            </h1>
            <p className="text-xs font-medium text-[#555555]">
              {t.notFound.desc}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link href="/roadmap" className="w-full sm:w-auto">
              <Button className="w-full rounded-lg border-2 border-black bg-[#FFD84D] hover:bg-[#F5CB32] text-[#121212] font-black text-xs shadow-[3px_3px_0px_#121212] gap-1.5">
                <Compass className="h-4 w-4" />
                <span>{t.notFound.ctaRoadmap}</span>
              </Button>
            </Link>
            <Link href="/" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full rounded-lg border-2 border-black bg-white text-[#121212] font-bold text-xs shadow-[2px_2px_0px_#121212]">
                <ArrowLeft className="h-4 w-4" />
                <span>{t.notFound.ctaHome}</span>
              </Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
