"use client";

import { useState } from "react";
import Link from "next/link";
import { BookMarked, Search, ArrowRight, Compass, Filter, BookOpen, Terminal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SearchCommandModal } from "@/components/common/SearchCommandModal";
import { GLOSSARY_TERMS, GlossaryItem } from "@/data/glossary";
import { useThemeLanguageStore } from "@/store/useThemeLanguageStore";
import { getTranslations } from "@/lib/translations";
import { BotCompanionCharacter } from "@/components/fun/characters/BotCompanionCharacter";

export default function GlossaryPage() {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const { theme, language } = useThemeLanguageStore();
  const t = getTranslations(language);

  const categories = [
    "ALL",
    "Web Basics",
    "Frontend",
    "Backend",
    "Database & DevOps",
  ];

  const filteredTerms = GLOSSARY_TERMS.filter((item) => {
    const matchesCategory =
      selectedCategory === "ALL" || item.category === selectedCategory;
    const matchesQuery =
      item.term.toLowerCase().includes(query.toLowerCase()) ||
      item.definitionId.toLowerCase().includes(query.toLowerCase()) ||
      item.definitionEn.toLowerCase().includes(query.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  // 1. FUN MODE: Coder's Pocket Spellbook
  if (theme === "fun") {
    return (
      <div className="min-h-screen bg-[#FFF8E7] text-[#243447] flex flex-col">
        <Navbar />
        <SearchCommandModal />

        <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl space-y-8">
            <div className="p-8 rounded-[36px] border-4 border-[#FED7AA] bg-white shadow-[0_15px_40px_rgba(255,155,84,0.1)] flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-5">
                <BotCompanionCharacter
                  className="w-20 h-20 shrink-0"
                  expression="happy"
                  speechBubbleText={language === "en" ? "Pocket Spellbook!" : "Buku Mantra Koding!"}
                />
                <div className="space-y-1 text-center sm:text-left">
                  <span className="text-[10px] font-black text-[#D97706] bg-[#FFF8E7] px-3 py-1 rounded-full border border-[#FED7AA] uppercase">
                    📖 {t.glossary.funBadge}
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-black text-[#243447]">
                    {t.glossary.funTitle}
                  </h1>
                  <p className="text-xs text-[#64748B] font-medium max-w-xl">
                    {t.glossary.funDescription}
                  </p>
                </div>
              </div>

              <Link href="/roadmap">
                <Button size="sm" className="rounded-full text-xs font-black px-6 bg-[#FFD84D] hover:bg-[#FFC933] text-[#243447] shadow-[0_4px_12px_rgba(255,216,77,0.4)]">
                  <Compass className="h-4 w-4 mr-1.5" />
                  {t.nav.roadmap}
                </Button>
              </Link>
            </div>

            {/* Search & Category Pills */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#FF9F43]" />
                <input
                  type="text"
                  placeholder={t.glossary.searchPlaceholder}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-xs font-bold rounded-full border-2 border-[#FED7AA] bg-white text-[#243447] focus:outline-none focus:border-[#5CC8FF]"
                />
              </div>

              <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-1.5 rounded-full text-xs font-black transition-all ${
                      selectedCategory === cat
                        ? "bg-[#FFD84D] text-[#243447] shadow-[0_3px_10px_rgba(255,216,77,0.4)]"
                        : "bg-white text-[#64748B] border border-[#FED7AA] hover:bg-[#FFF8E7]"
                    }`}
                  >
                    {cat === "ALL" ? t.common.all : cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Terms Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredTerms.map((term) => (
                <div
                  key={term.term}
                  className="p-6 rounded-[28px] border-2 border-[#FED7AA] bg-white shadow-[0_4px_15px_rgba(0,0,0,0.03)] space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-black text-base text-[#243447]">{term.term}</span>
                    <Badge className="bg-[#FFF8E7] text-[#D97706] border border-[#FED7AA] text-[10px] font-black rounded-full">
                      {term.category}
                    </Badge>
                  </div>
                  <p className="text-xs text-[#64748B] font-medium leading-relaxed">
                    {language === "en" ? term.definitionEn : term.definitionId}
                  </p>
                  {(language === "en" && term.exampleEn ? term.exampleEn : term.exampleId) && (
                    <div className="p-3 rounded-2xl bg-[#FFF8E7] border border-[#FED7AA] font-mono text-[11px] text-[#D97706] overflow-x-auto">
                      <code>{language === "en" && term.exampleEn ? term.exampleEn : term.exampleId}</code>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  // 2. DARK MODE: Monochrome Command Line Dictionary (100% Monochrome)
  if (theme === "dark") {
    return (
      <div className="min-h-screen bg-[#050505] text-[#FFFFFF] font-mono flex flex-col">
        <Navbar />
        <SearchCommandModal />

        <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl space-y-6">
            <div className="p-6 rounded border border-[#222222] bg-[#0A0A0A] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="text-xs text-[#888888]">
                  DICTIONARY_INDEX // TERMINAL_LOOKUP
                </div>
                <h1 className="text-xl sm:text-2xl font-black text-[#FFFFFF]">
                  TECHNICAL_GLOSSARY_REGISTRY
                </h1>
              </div>

              <Link href="/roadmap">
                <Button size="sm" className="font-mono text-xs bg-[#FFFFFF] hover:bg-[#E5E5E5] text-[#000000] font-black h-8 px-4">
                  RETURN_ROADMAP
                </Button>
              </Link>
            </div>

            {/* Filter Matrix */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#666666]" />
                <input
                  type="text"
                  placeholder="QUERY_TERM..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#050505] border border-[#222222] text-[#FFFFFF] placeholder:text-[#555555] rounded focus:outline-none focus:border-[#FFFFFF]"
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1 rounded text-xs uppercase border transition-all ${
                      selectedCategory === cat
                        ? "border-[#FFFFFF] bg-[#FFFFFF] text-[#000000] font-black"
                        : "border-[#222222] bg-[#0A0A0A] text-[#888888] hover:text-[#FFFFFF]"
                    }`}
                  >
                    {cat === "ALL" ? "ALL" : cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Terms List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filteredTerms.map((term) => (
                <div
                  key={term.term}
                  className="p-5 rounded border border-[#222222] bg-[#0A0A0A] space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-black text-sm text-[#FFFFFF]">{term.term}</span>
                    <span className="text-[10px] text-[#888888] uppercase px-2 py-0.5 rounded border border-[#333333] bg-[#111111]">
                      {term.category}
                    </span>
                  </div>
                  <p className="text-xs text-[#888888] leading-relaxed">
                    {language === "en" ? term.definitionEn : term.definitionId}
                  </p>
                  {(language === "en" && term.exampleEn ? term.exampleEn : term.exampleId) && (
                    <div className="p-2.5 rounded bg-[#050505] border border-[#1A1A1A] text-[11px] text-[#CCCCCC] overflow-x-auto">
                      <code>{language === "en" && term.exampleEn ? term.exampleEn : term.exampleId}</code>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  // 3. LIGHT MODE: Modern Neo-Brutalist Encyclopedia
  return (
    <div className="min-h-screen bg-[#F7F4EA] text-[#121212] flex flex-col">
      <Navbar />
      <SearchCommandModal />

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl space-y-8">
          <div className="p-8 rounded-2xl border-2 border-black bg-white shadow-[6px_6px_0px_#121212] flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded border border-black bg-[#FFD84D] text-xs font-black shadow-[1.5px_1.5px_0px_#121212]">
                <BookOpen className="h-3.5 w-3.5" />
                <span>{t.glossary.badge}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-[#121212]">
                {t.glossary.title}
              </h1>
              <p className="text-xs text-[#555555] max-w-xl">
                {t.glossary.description}
              </p>
            </div>

            <Link href="/roadmap">
              <Button size="sm" className="rounded-lg border-2 border-black bg-[#FFD84D] hover:bg-[#F5CB32] text-[#121212] font-black text-xs shadow-[2.5px_2.5px_0px_#121212] px-4">
                <Compass className="h-4 w-4 mr-1.5" />
                <span>{t.nav.roadmap}</span>
              </Button>
            </Link>
          </div>

          {/* Search & Categories */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#121212]" />
              <input
                type="text"
                placeholder={t.glossary.searchPlaceholder}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs font-bold rounded-lg border-2 border-black bg-white text-[#121212] shadow-[2px_2px_0px_#121212] focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-black border-2 border-black transition-all ${
                    selectedCategory === cat
                      ? "bg-[#FFD84D] text-[#121212] shadow-[2px_2px_0px_#121212]"
                      : "bg-white text-[#555555] hover:bg-[#F7F4EA]"
                  }`}
                >
                  {cat === "ALL" ? t.common.all : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Terms Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredTerms.map((term) => (
              <div
                key={term.term}
                className="p-6 rounded-xl border-2 border-black bg-white shadow-[4px_4px_0px_#121212] space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-black text-sm text-[#121212]">{term.term}</span>
                  <span className="text-[10px] font-bold text-[#121212] bg-[#70B7FF]/30 px-2 py-0.5 rounded border border-black">
                    {term.category}
                  </span>
                </div>
                <p className="text-xs text-[#404040] leading-relaxed">
                  {language === "en" ? term.definitionEn : term.definitionId}
                </p>
                {(language === "en" && term.exampleEn ? term.exampleEn : term.exampleId) && (
                  <div className="p-2.5 rounded border-2 border-black bg-[#F7F4EA] font-mono text-[11px] text-[#121212] overflow-x-auto">
                    <code>{language === "en" && term.exampleEn ? term.exampleEn : term.exampleId}</code>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
