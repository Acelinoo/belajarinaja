"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Search, BookOpen, ArrowRight, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CURRICULUM_STAGES } from "@/data/curriculum";
import { useModalStore } from "@/store/useModalStore";
import { useThemeLanguageStore } from "@/store/useThemeLanguageStore";
import { getTranslations } from "@/lib/translations";

const TECH_TAGS = [
  "HTML",
  "CSS",
  "JavaScript",
  "TypeScript",
  "React",
  "Next.js",
  "Node.js",
  "PostgreSQL",
  "Prisma",
  "Tailwind",
  "Git",
  "Security",
];

export function SearchCommandModal() {
  const router = useRouter();
  const { isSearchOpen, closeSearch, toggleSearch } = useModalStore();
  const { language } = useThemeLanguageStore();
  const t = getTranslations(language);

  const [query, setQuery] = useState("");
  const [selectedLevel, setSelectedLevel] = useState<string>("ALL");
  const [selectedTech, setSelectedTech] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        toggleSearch();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleSearch]);

  const allLessons = useMemo(() => {
    return CURRICULUM_STAGES.flatMap((stage) =>
      stage.lessons.map((lesson) => ({
        ...lesson,
        stageTitle: language === "en" ? stage.titleEn : stage.titleId,
        stageOrder: stage.orderIndex,
        category: stage.category,
        displayTitle: language === "en" && lesson.titleEn ? lesson.titleEn : lesson.title,
        displayDesc: language === "en" && lesson.descriptionEn ? lesson.descriptionEn : lesson.description,
      }))
    );
  }, [language]);

  const filtered = useMemo(() => {
    return allLessons.filter((l) => {
      const matchesLevel =
        selectedLevel === "ALL" || l.level === selectedLevel;
      const matchesTech =
        !selectedTech ||
        l.displayTitle.toLowerCase().includes(selectedTech.toLowerCase()) ||
        l.displayDesc.toLowerCase().includes(selectedTech.toLowerCase()) ||
        l.contentMd.toLowerCase().includes(selectedTech.toLowerCase());
      const matchesQuery =
        !query.trim() ||
        l.displayTitle.toLowerCase().includes(query.toLowerCase()) ||
        l.displayDesc.toLowerCase().includes(query.toLowerCase()) ||
        l.category.toLowerCase().includes(query.toLowerCase()) ||
        l.stageTitle.toLowerCase().includes(query.toLowerCase());

      return matchesLevel && matchesTech && matchesQuery;
    });
  }, [allLessons, query, selectedLevel, selectedTech]);

  const handleSelect = (slug: string) => {
    closeSearch();
    setQuery("");
    setSelectedTech(null);
    router.push(`/lessons/${slug}`);
  };

  const handleResetFilters = () => {
    setQuery("");
    setSelectedLevel("ALL");
    setSelectedTech(null);
  };

  return (
    <Dialog open={isSearchOpen} onOpenChange={closeSearch}>
      <DialogContent className="max-w-2xl p-0 gap-0 overflow-hidden border-2 border-black bg-white rounded-xl shadow-[8px_8px_0px_#121212] dark:border dark:border-[#1C242D] dark:bg-[#090D12] dark:shadow-[0_25px_60px_rgba(0,0,0,0.9)] fun:border-2 fun:border-[#E2E8F0] fun:rounded-2xl fun:shadow-[0_20px_60px_rgba(0,0,0,0.15)]">
        {/* Modal Header */}
        <DialogHeader className="p-4 pb-3 border-b-2 border-black bg-[#F7F4EA] dark:border-b dark:border-[#1C242D] dark:bg-[#05070A] fun:border-b-2 fun:border-[#E2E8F0] fun:bg-[#FFF8E7]">
          <DialogTitle className="text-sm font-black flex items-center justify-between text-foreground">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-primary dark:text-cyan-400 fun:text-[#5CC8FF]" />
              <span>{t.glossary.searchPlaceholder.split(" (")[0]}</span>
            </div>
            <Badge variant="outline" className="text-[10px] font-mono font-bold dark:border-[#1C242D] dark:bg-[#0F141A] dark:text-cyan-300 fun:rounded-full fun:border-[#E2E8F0] fun:bg-white">
              {filtered.length} {t.roadmap.lessonsCount}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        {/* Input Bar */}
        <div className="p-4 border-b-2 border-black bg-white dark:border-b dark:border-[#1C242D] dark:bg-[#090D12] fun:border-b-2 fun:border-[#E2E8F0] space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#121212] dark:text-cyan-400 fun:text-[#5CC8FF]" />
            <Input
              placeholder={t.glossary.searchPlaceholder}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-9 pr-8 text-xs bg-white dark:bg-[#05070A] dark:border-[#1C242D] dark:text-[#F1F5F9] fun:rounded-xl fun:border-[#E2E8F0]"
              autoFocus
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute right-3 top-2.5 text-[#121212] hover:text-black dark:text-[#94A3B8] dark:hover:text-cyan-300"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Level Filter Chips */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[11px] font-bold text-foreground dark:font-mono dark:text-[#64748B] font-mono mr-1">
              Level:
            </span>
            {["ALL", "BEGINNER", "INTERMEDIATE", "ADVANCED"].map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => setSelectedLevel(lvl)}
                className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold transition-all ${
                  selectedLevel === lvl
                    ? "bg-[#FFD84D] text-[#121212] border-2 border-black shadow-[2px_2px_0px_#121212] dark:bg-cyan-500/15 dark:text-cyan-300 dark:border dark:border-cyan-500/40 dark:shadow-[0_0_8px_rgba(34,211,238,0.2)] fun:bg-[#5CC8FF] fun:text-[#243447] fun:border-0 fun:rounded-full"
                    : "bg-white border-2 border-black text-[#121212] shadow-[1px_1px_0px_#121212] hover:bg-[#EAE4D5] dark:bg-[#0F141A] dark:border dark:border-[#1C242D] dark:text-[#94A3B8] dark:shadow-none dark:hover:border-[#26313C] fun:border-[#E2E8F0] fun:rounded-full fun:shadow-none"
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>

          {/* Technology Quick Chips */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-bold text-foreground dark:font-mono dark:text-[#64748B] font-mono mr-1">
              {t.common.filter}:
            </span>
            {TECH_TAGS.map((tech) => (
              <button
                key={tech}
                type="button"
                onClick={() =>
                  setSelectedTech(selectedTech === tech ? null : tech)
                }
                className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold transition-all ${
                  selectedTech === tech
                    ? "bg-[#70B7FF] text-[#121212] border-2 border-black shadow-[2px_2px_0px_#121212] dark:bg-cyan-500/15 dark:text-cyan-300 dark:border dark:border-cyan-500/40 dark:shadow-[0_0_8px_rgba(34,211,238,0.2)] fun:bg-[#FFD84D] fun:text-[#243447] fun:border-0 fun:rounded-full"
                    : "bg-white border-2 border-black text-[#121212] shadow-[1px_1px_0px_#121212] hover:bg-[#EAE4D5] dark:bg-[#0F141A] dark:border dark:border-[#1C242D] dark:text-[#94A3B8] dark:shadow-none dark:hover:border-[#26313C] fun:border-[#E2E8F0] fun:rounded-full fun:shadow-none"
                }`}
              >
                {tech}
              </button>
            ))}
            {(selectedLevel !== "ALL" || selectedTech || query) && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-[10px] font-bold text-black underline hover:text-primary ml-auto dark:text-cyan-400 dark:no-underline dark:hover:underline fun:text-[#FF6B6B]"
              >
                Reset Filter
              </button>
            )}
          </div>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1.5 bg-white dark:bg-[#090D12]">
          {filtered.length > 0 ? (
            filtered.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelect(item.slug)}
                className="w-full flex items-center justify-between p-3 rounded-lg border-2 border-transparent hover:border-black hover:bg-[#FFD84D]/25 hover:shadow-[3px_3px_0px_#121212] text-left transition-all group dark:border dark:border-transparent dark:hover:border-cyan-500/30 dark:hover:bg-[#0F141A] dark:hover:shadow-none fun:rounded-xl fun:hover:bg-[#FFF8E7] fun:hover:border-[#FED7AA]"
              >
                <div className="flex items-center gap-3">
                  <BookOpen className="h-4 w-4 text-[#121212] dark:text-cyan-400 fun:text-[#5CC8FF] shrink-0" />
                  <div>
                    <div className="text-xs font-bold text-foreground group-hover:text-black dark:group-hover:text-cyan-300 transition-colors">
                      {item.displayTitle}
                    </div>
                    <div className="text-[11px] text-[#555555] dark:text-[#8292A6] flex items-center gap-2 mt-0.5 font-medium dark:font-normal">
                      <span>{t.common.stage} {item.stageOrder}: {item.stageTitle}</span>
                      <span>•</span>
                      <span>{item.estimatedMinutes} {t.common.minutes}</span>
                      <span>•</span>
                      <Badge variant="outline" className="text-[9px] px-1.5 py-0 h-4 dark:border-[#1C242D] dark:bg-[#05070A] dark:text-cyan-300 fun:rounded-full">
                        {item.level}
                      </Badge>
                    </div>
                  </div>
                </div>

                <ArrowRight className="h-3.5 w-3.5 text-[#121212] dark:text-cyan-400 fun:text-[#5CC8FF] opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            ))
          ) : (
            <div className="p-8 text-center text-xs text-muted-foreground dark:text-[#64748B] space-y-2">
              <Search className="h-6 w-6 text-muted-foreground/40 dark:text-[#334155] mx-auto" />
              <p>
                Tidak ada materi yang sesuai dengan filter atau kata kunci &quot;{query}&quot;.
              </p>
            </div>
          )}
        </div>

        {/* Footer Shortcut Guide */}
        <div className="p-3 bg-[#F7F4EA] border-t-2 border-black dark:bg-[#05070A] dark:border-t dark:border-[#1C242D] fun:bg-[#FFF8E7] fun:border-t-2 fun:border-[#E2E8F0] flex items-center justify-between text-[11px] font-bold text-[#555555] dark:font-normal dark:text-[#64748B] font-mono">
          <span>⌘K / Ctrl+K</span>
          <span>ESC</span>
        </div>
      </DialogContent>
    </Dialog>
  );
}

