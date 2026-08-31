"use client";

import { useState } from "react";
import Link from "next/link";
import { BookMarked, Search, ArrowRight, Compass, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SearchCommandModal } from "@/components/common/SearchCommandModal";
import { GLOSSARY_TERMS, GlossaryItem } from "@/data/glossary";
import { useThemeLanguageStore } from "@/store/useThemeLanguageStore";

export default function GlossaryPage() {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const { language } = useThemeLanguageStore();

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
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />
      <SearchCommandModal />

      <main className="flex-1 py-10">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b-2 border-black dark:border-border">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono font-black text-[#121212] bg-[#FFD84D] px-2.5 py-1 rounded border border-black shadow-[2px_2px_0px_#121212] uppercase tracking-wider mb-2 w-fit dark:border-0 dark:bg-transparent dark:text-primary dark:shadow-none dark:p-0">
                <BookMarked className="h-4 w-4 text-[#121212] dark:text-primary" />
                <span>Kamus & Glosarium Web Developer</span>
              </div>
              <h1 className="text-3xl font-black tracking-tight text-foreground">
                Glosarium Istilah Web Development
              </h1>
              <p className="text-xs font-medium text-[#555555] dark:font-normal dark:text-muted-foreground mt-1 max-w-2xl">
                Definisi sederhana dan contoh konkret istilah teknis yang paling sering digunakan dalam dunia industri rekayasa perangkat lunak web.
              </p>
            </div>

            <Link href="/roadmap">
              <Button size="sm" variant="outline" className="text-xs font-bold gap-1.5 shadow-[2px_2px_0px_#121212]">
                <Compass className="h-3.5 w-3.5" />
                Buka Roadmap
              </Button>
            </Link>
          </div>

          {/* Search & Category Filter */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#121212] dark:text-muted-foreground" />
              <Input
                placeholder="Cari istilah (contoh: DOM, API, Prisma)..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-9 text-xs bg-white dark:bg-card"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
              {categories.map((cat) => (
                <Button
                  key={cat}
                  size="sm"
                  variant={selectedCategory === cat ? "default" : "outline"}
                  onClick={() => setSelectedCategory(cat)}
                  className="text-xs font-bold h-8 whitespace-nowrap shadow-[2px_2px_0px_#121212] dark:font-medium"
                >
                  {cat === "ALL" ? "Semua Istilah" : cat}
                </Button>
              ))}
            </div>
          </div>

          {/* Terms Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTerms.map((item, index) => (
              <Card
                key={index}
                className="p-5 border-2 border-black bg-white shadow-[4px_4px_0px_#121212] hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_#121212] transition-all space-y-2 flex flex-col justify-between dark:border-border dark:bg-card dark:shadow-none dark:hover:translate-y-0"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h2 className="text-sm font-black text-foreground">
                      {item.term}
                    </h2>
                    <Badge variant="outline" className="text-[10px]">
                      {item.category}
                    </Badge>
                  </div>

                  <p className="text-xs font-medium text-[#555555] dark:font-normal dark:text-muted-foreground leading-relaxed">
                    {language === "en" ? item.definitionEn : item.definitionId}
                  </p>
                </div>

                {(item.exampleId || item.exampleEn) && (
                  <div className="mt-2 pt-2 border-t-2 border-black text-[11px] font-mono text-emerald-950 bg-[#7BE495]/25 border-2 p-2.5 rounded-lg shadow-[1.5px_1.5px_0px_#121212] dark:border-0 dark:border-t dark:border-border/60 dark:bg-[#060708] dark:text-emerald-400 dark:shadow-none">
                    <span className="text-black dark:text-muted-foreground block text-[10px] uppercase font-sans font-bold">
                      Contoh Penggunaan:
                    </span>
                    <code className="font-bold dark:font-normal">
                      {language === "en" && item.exampleEn
                        ? item.exampleEn
                        : item.exampleId}
                    </code>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
