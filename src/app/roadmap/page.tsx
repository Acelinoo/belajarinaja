"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Map,
  Compass,
  CheckCircle2,
  Lock,
  ArrowRight,
  BookOpen,
  Search,
  Check,
  Sparkles,
  Layers,
  ChevronRight,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SearchCommandModal } from "@/components/common/SearchCommandModal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { CURRICULUM_STAGES } from "@/data/curriculum";
import { useThemeLanguageStore } from "@/store/useThemeLanguageStore";
import { useCurriculumProgressStore } from "@/store/useCurriculumProgressStore";
import { useAuthStore } from "@/store/useAuthStore";
import { getTranslations } from "@/lib/translations";
import { NovaCharacter } from "@/components/fun/characters/NovaCharacter";
import { ChapterIntroductionModal } from "@/components/fun/ChapterIntroductionModal";
import type { StageItem } from "@/data/curriculum";

const TRACKS = [
  { id: "ALL", label: "Semua Tahap", labelEn: "All Stages" },
  { id: "foundations", label: "01. Foundations", labelEn: "01. Foundations", range: [1, 2] },
  { id: "html", label: "02. HTML5 Semantik", labelEn: "02. Semantic HTML5", range: [3, 4] },
  { id: "css", label: "03. Modern CSS", labelEn: "03. Modern CSS", range: [5, 8] },
  { id: "js", label: "04. JavaScript & DOM", labelEn: "04. JavaScript & DOM", range: [9, 14] },
  { id: "fullstack", label: "05. React & Fullstack", labelEn: "05. React & Fullstack", range: [15, 20] },
];

export default function RoadmapPage() {
  const { theme, language } = useThemeLanguageStore();
  const t = getTranslations(language);
  const { completedLessons, isLessonUnlocked } = useCurriculumProgressStore();
  const { isAuthenticated } = useAuthStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTrack, setSelectedTrack] = useState("ALL");
  const [selectedStageForBriefing, setSelectedStageForBriefing] = useState<StageItem | null>(null);

  const totalLessons = CURRICULUM_STAGES.reduce(
    (acc, stage) => acc + stage.lessons.length,
    0
  );
  const completedCount = isAuthenticated
    ? Object.values(completedLessons).filter((item) => item?.completed).length
    : 0;
  const progressPercent = Math.min(100, Math.round((completedCount / (totalLessons || 1)) * 100));

  // Filter stages based on track and search
  const filteredStages = CURRICULUM_STAGES.filter((stage) => {
    // Track filter
    if (selectedTrack !== "ALL") {
      const activeTrackObj = TRACKS.find((tr) => tr.id === selectedTrack);
      if (activeTrackObj?.range) {
        if (stage.orderIndex < activeTrackObj.range[0] || stage.orderIndex > activeTrackObj.range[1]) {
          return false;
        }
      }
    }

    // Search query filter
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      const title = (stage.titleId || "").toLowerCase();
      const titleEn = (stage.titleEn || "").toLowerCase();
      const desc = (stage.description || "").toLowerCase();
      const matchesLessons = stage.lessons.some(
        (l) => l.title.toLowerCase().includes(q) || (l.titleEn && l.titleEn.toLowerCase().includes(q))
      );
      return title.includes(q) || titleEn.includes(q) || desc.includes(q) || matchesLessons;
    }

    return true;
  });

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground transition-colors">
      <Navbar />
      <SearchCommandModal />

      <main className="flex-1 py-6 sm:py-12 px-3 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl space-y-6 sm:space-y-8">
          {/* Header Banner */}
          <div className="p-4 sm:p-6 md:p-8 rounded-2xl border border-border bg-card shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sm:gap-6">
            <div className="space-y-2 max-w-xl">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-secondary text-xs font-semibold text-foreground border border-border">
                <Map className="h-3.5 w-3.5 text-primary" />
                <span>
                  {language === "en" ? "20-STAGE CURRICULUM ROADMAP" : "PETA KURIKULUM 20 TAHAP"}
                </span>
              </div>
              <h1 className="text-xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                {language === "en" ? "Web Developer Learning Roadmap" : "Peta Perjalanan Web Developer"}
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {language === "en"
                  ? "Structured step-by-step roadmap from zero to industry-ready mastery. Complete each stage to unlock subsequent lessons."
                  : "Panduan terstruktur dari nol hingga mahir. Selesaikan setiap tahapan secara bertahap untuk membuka materi berikutnya."}
              </p>
            </div>

            {/* Overall Progress Meter */}
            <div className="p-4 rounded-xl border border-border bg-secondary/50 min-w-[200px] w-full md:w-auto space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-foreground">
                <span>{language === "en" ? "Curriculum Progress" : "Progres Kurikulum"}</span>
                <span className="font-mono">{progressPercent}%</span>
              </div>
              <div className="h-2 w-full bg-background rounded-full border border-border overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <div className="text-[11px] text-muted-foreground font-medium">
                {language === "en"
                  ? `${completedCount} of ${totalLessons} lessons completed`
                  : `${completedCount} dari ${totalLessons} materi terselesaikan`}
              </div>
            </div>
          </div>

          {/* Search & Track Filter Controls */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder={
                    language === "en"
                      ? "Search coding lessons (HTML, CSS, Flexbox, DOM, React)..."
                      : "Cari materi koding (HTML, CSS, Flexbox, DOM, React)..."
                  }
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-10 text-xs rounded-xl bg-card border-border"
                />
              </div>

              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSearchQuery("")}
                  className="text-xs text-muted-foreground h-10 w-full sm:w-auto"
                >
                  {language === "en" ? "Reset" : "Reset"}
                </Button>
              )}
            </div>

            {/* Track filter pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar touch-pan-x flex-nowrap">
              {TRACKS.map((track) => (
                <button
                  key={track.id}
                  type="button"
                  onClick={() => setSelectedTrack(track.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors border cursor-pointer shrink-0 ${
                    selectedTrack === track.id
                      ? "bg-primary text-primary-foreground border-primary font-bold shadow-xs"
                      : "bg-card text-muted-foreground border-border hover:text-foreground hover:bg-secondary"
                  }`}
                >
                  {language === "en" ? track.labelEn : track.label}
                </button>
              ))}
            </div>
          </div>

          {/* Stages List (Learning Journey Timeline) */}
          <div className="space-y-4">
            {filteredStages.map((stage) => {
              const stageLessons = stage.lessons;
              const completedInStage = stageLessons.filter(
                (l) => completedLessons[l.id]?.completed
              ).length;
              const isStageComplete = completedInStage === stageLessons.length && stageLessons.length > 0;
              const isStageAccessible = stageLessons.some((l) => isLessonUnlocked(l.id));
              const firstLesson = stageLessons[0];

              const stageTitle = language === "en" && stage.titleEn ? stage.titleEn : stage.titleId;
              const stageDesc = language === "en" && stage.descriptionEn ? stage.descriptionEn : stage.description;

              return (
                <div
                  key={stage.id}
                  className={`p-5 sm:p-6 rounded-xl border transition-colors ${
                    isStageComplete
                      ? "border-emerald-500/30 bg-card"
                      : isStageAccessible
                      ? "border-border bg-card hover:border-primary/40 shadow-xs"
                      : "border-border/60 bg-secondary/30 opacity-75"
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="space-y-2 max-w-2xl">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-[10px] font-mono font-bold">
                          {language === "en" ? "Stage" : "Tahap"} {String(stage.orderIndex).padStart(2, "0")}
                        </Badge>

                        {isStageComplete ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            <span>
                              {language === "en"
                                ? `Done (${completedInStage}/${stageLessons.length})`
                                : `Selesai (${completedInStage}/${stageLessons.length})`}
                            </span>
                          </span>
                        ) : isStageAccessible ? (
                          <span className="text-[11px] font-semibold text-primary">
                            {language === "en"
                              ? `${completedInStage}/${stageLessons.length} Lessons Done`
                              : `${completedInStage}/${stageLessons.length} Materi Selesai`}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground font-medium">
                            <Lock className="h-3 w-3" />
                            <span>{language === "en" ? "Locked" : "Terkunci"}</span>
                          </span>
                        )}
                      </div>

                      <h3 className="text-base font-bold text-foreground">
                        {stageTitle}
                      </h3>

                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {stageDesc}
                      </p>

                      {/* Lesson checklist items */}
                      <div className="pt-2 flex flex-wrap gap-2">
                        {stageLessons.map((lesson) => {
                          const isDone = !!completedLessons[lesson.id]?.completed;
                          return (
                            <Link
                              key={lesson.id}
                              href={`/lessons/${lesson.slug}`}
                              className={`text-[11px] px-2.5 py-1 rounded-md border flex items-center gap-1.5 transition-colors ${
                                isDone
                                  ? "bg-secondary text-foreground border-border font-medium"
                                  : isStageAccessible
                                  ? "bg-card text-muted-foreground border-border hover:text-foreground hover:border-primary/50"
                                  : "bg-secondary/40 text-muted-foreground/60 border-transparent cursor-not-allowed pointer-events-none"
                              }`}
                            >
                              {isDone ? (
                                <Check className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                              ) : (
                                <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/50" />
                              )}
                              <span>{language === "en" && lesson.titleEn ? lesson.titleEn : lesson.title}</span>
                            </Link>
                          );
                        })}
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2 self-start md:self-center shrink-0 pt-2 md:pt-0">
                      {isStageAccessible ? (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedStageForBriefing(stage)}
                            className="text-xs font-semibold h-8 px-3 rounded-md"
                          >
                            <BookOpen className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                            <span>{language === "en" ? "Overview" : "Ikhtisar"}</span>
                          </Button>

                          {firstLesson && (
                            <Link href={`/lessons/${firstLesson.slug}`}>
                              <Button size="sm" className="text-xs font-bold h-8 px-3 rounded-md gap-1">
                                <span>
                                  {isStageComplete
                                    ? (language === "en" ? "Review Stage" : "Pelajari Ulang")
                                    : (language === "en" ? "Start Stage" : "Mulai Tahap")}
                                </span>
                                <ArrowRight className="h-3 w-3" />
                              </Button>
                            </Link>
                          )}
                        </>
                      ) : (
                        <div className="text-[11px] text-muted-foreground font-medium px-3 py-1.5 rounded bg-secondary/60 border border-border flex items-center gap-1.5">
                          <Lock className="h-3 w-3" />
                          <span>{language === "en" ? "Complete previous stage" : "Selesaikan tahap sebelumnya"}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* Chapter Overview Modal */}
      {selectedStageForBriefing && (
        <ChapterIntroductionModal
          stage={selectedStageForBriefing}
          isOpen={!!selectedStageForBriefing}
          onClose={() => setSelectedStageForBriefing(null)}
        />
      )}

      <Footer />
    </div>
  );
}