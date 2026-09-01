"use client";

import { useState } from "react";
import Link from "next/link";
import { BookOpen, Search, ArrowRight, Compass, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SearchCommandModal } from "@/components/common/SearchCommandModal";
import { GLOSSARY_TERMS, GlossaryItem } from "@/data/glossary";
import { useThemeLanguageStore } from "@/store/useThemeLanguageStore";
import { getTranslations } from "@/lib/translations";
import { NovaCharacter } from "@/components/fun/characters/NovaCharacter";

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

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col transition-colors">
      <Navbar />
      <SearchCommandModal />

      <main className="flex-1 py-10 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl space-y-10">
          {/* Header Banner */}
          <div className="p-6 sm:p-10 rounded-2xl border border-border bg-card shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4 text-center sm:text-left flex-col sm:flex-row">
              {theme === "fun" ? (
                <NovaCharacter state="curious" className="w-16 h-16 shrink-0" />
              ) : (
                <div className="h-12 w-12 rounded-xl bg-secondary text-primary flex items-center justify-center font-bold">
                  <BookOpen className="h-6 w-6" />
                </div>
              )}

              <div className="space-y-1">
                <span className="text-[10px] font-bold text-primary uppercase tracking-wider block">
                  KAMUS TEKNIS WEB
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                  {t.glossary.title}
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground max-w-xl">
                  {t.glossary.description}
                </p>
              </div>
            </div>

            <Link href="/roadmap">
              <Button size="sm" variant="outline" className="text-xs font-semibold rounded-md px-4">
                <Compass className="h-4 w-4 mr-1.5" />
                <span>{t.nav.roadmap}</span>
              </Button>
            </Link>
          </div>

          {/* Search & Filter Controls */}
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder={t.glossary.searchPlaceholder}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-9 h-10 text-xs rounded-md bg-card border-border"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-colors border ${
                    selectedCategory === cat
                      ? "bg-primary text-primary-foreground border-primary font-bold shadow-xs"
                      : "bg-card text-muted-foreground border-border hover:text-foreground hover:bg-secondary"
                  }`}
                >
                  {cat === "ALL" ? (language === "en" ? "All Terms" : "Semua Istilah") : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Terms Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTerms.length > 0 ? (
              filteredTerms.map((item: GlossaryItem, idx: number) => (
                <div
                  key={idx}
                  className="p-6 rounded-xl border border-border bg-card shadow-xs flex flex-col justify-between space-y-4 hover:border-primary/40 transition-colors"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <Badge variant="outline" className="text-[10px] font-mono">
                        {item.category}
                      </Badge>
                    </div>

                    <h3 className="text-base font-bold text-foreground">
                      {item.term}
                    </h3>

                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {language === "en" ? item.definitionEn : item.definitionId}
                    </p>

                    {(item.exampleId || item.exampleEn) && (
                      <div className="p-2.5 rounded-md bg-secondary/60 font-mono text-[11px] text-foreground overflow-x-auto">
                        <span className="text-[10px] text-muted-foreground block mb-1 font-sans font-semibold">Contoh Sintaks:</span>
                        <code>{language === "en" && item.exampleEn ? item.exampleEn : item.exampleId}</code>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-2 py-12 text-center rounded-xl border border-border bg-card space-y-2 text-muted-foreground">
                <BookOpen className="h-8 w-8 mx-auto opacity-50" />
                <h4 className="text-sm font-bold text-foreground">
                  {language === "en" ? "No Terms Found" : "Istilah Tidak Ditemukan"}
                </h4>
                <p className="text-xs">
                  {language === "en"
                    ? "Try searching with different keywords or select another category."
                    : "Coba cari dengan kata kunci lain atau pilih kategori berbeda."}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
