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
        stageTitle: stage.titleId,
        stageOrder: stage.orderIndex,
        category: stage.category,
      }))
    );
  }, []);

  const filtered = useMemo(() => {
    return allLessons.filter((l) => {
      const matchesLevel =
        selectedLevel === "ALL" || l.level === selectedLevel;
      const matchesTech =
        !selectedTech ||
        l.title.toLowerCase().includes(selectedTech.toLowerCase()) ||
        l.description.toLowerCase().includes(selectedTech.toLowerCase()) ||
        l.contentMd.toLowerCase().includes(selectedTech.toLowerCase());
      const matchesQuery =
        !query.trim() ||
        l.title.toLowerCase().includes(query.toLowerCase()) ||
        l.description.toLowerCase().includes(query.toLowerCase()) ||
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
      <DialogContent className="max-w-2xl p-0 gap-0 overflow-hidden border-border bg-[#181A22] rounded-xl shadow-2xl">
        {/* Modal Header */}
        <DialogHeader className="p-4 pb-3 border-b border-border/80">
          <DialogTitle className="text-sm font-semibold flex items-center justify-between text-foreground">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-primary" />
              <span>Pencarian Modul & Filter Parametrik</span>
            </div>
            <Badge variant="outline" className="text-[10px] font-mono">
              {filtered.length} Materi Ditemukan
            </Badge>
          </DialogTitle>
        </DialogHeader>

        {/* Input Bar */}
        <div className="p-4 border-b border-border/60 bg-[#121318] space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari materi (contoh: flexbox, prisma, server action)..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-9 pr-8 text-xs bg-background/60 border-border"
              autoFocus
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Level Filter Chips */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[11px] text-muted-foreground font-mono mr-1">
              Level:
            </span>
            {["ALL", "BEGINNER", "INTERMEDIATE", "ADVANCED"].map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => setSelectedLevel(lvl)}
                className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors border ${
                  selectedLevel === lvl
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>

          {/* Technology Quick Chips */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] text-muted-foreground font-mono mr-1">
              Topik:
            </span>
            {TECH_TAGS.map((tech) => (
              <button
                key={tech}
                type="button"
                onClick={() =>
                  setSelectedTech(selectedTech === tech ? null : tech)
                }
                className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors border ${
                  selectedTech === tech
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {tech}
              </button>
            ))}
            {(selectedLevel !== "ALL" || selectedTech || query) && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-[10px] text-primary hover:underline ml-auto"
              >
                Reset Filter
              </button>
            )}
          </div>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1 bg-[#181A22]">
          {filtered.length > 0 ? (
            filtered.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelect(item.slug)}
                className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-[#121318] text-left transition-colors border border-transparent hover:border-border/80 group"
              >
                <div className="flex items-center gap-3">
                  <BookOpen className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                  <div>
                    <div className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors">
                      {item.title}
                    </div>
                    <div className="text-[11px] text-muted-foreground flex items-center gap-2 mt-0.5">
                      <span>Tahap {item.stageOrder}: {item.stageTitle}</span>
                      <span>•</span>
                      <span>{item.estimatedMinutes} menit</span>
                      <span>•</span>
                      <Badge variant="outline" className="text-[9px] px-1.5 py-0 h-4">
                        {item.level}
                      </Badge>
                    </div>
                  </div>
                </div>

                <ArrowRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            ))
          ) : (
            <div className="p-8 text-center text-xs text-muted-foreground space-y-2">
              <Search className="h-6 w-6 text-muted-foreground/40 mx-auto" />
              <p>
                Tidak ada materi yang sesuai dengan filter atau kata kunci &quot;{query}&quot;.
              </p>
            </div>
          )}
        </div>

        {/* Footer Shortcut Guide */}
        <div className="p-3 bg-[#121318] border-t border-border flex items-center justify-between text-[11px] text-muted-foreground font-mono">
          <span>Ketik ⌘K / Ctrl+K untuk membuka</span>
          <span>Tekan ESC untuk keluar</span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
