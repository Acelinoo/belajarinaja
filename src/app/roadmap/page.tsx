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
import { getTranslations } from "@/lib/translations";
import { NovaCharacter } from "@/components/fun/characters/NovaCharacter";
import { ChapterIntroductionModal } from "@/components/fun/ChapterIntroductionModal";
import type { StageItem } from "@/data/curriculum";

const TRACKS = [
  { id: "ALL", label: "Semua Tahap", labelEn: "All Stages" },
  { id: "foundations", label: "Web Foundations", labelEn: "Web Foundations", range: [1, 2] },
  { id: "html", label: "HTML5 Semantik", labelEn: "Semantic HTML5", range: [3, 4] },
  { id: "css", label: "Modern CSS", labelEn: "Modern CSS", range: [5, 8] },
  { id: "js", label: "JavaScript & DOM", labelEn: "JavaScript & DOM", range: [9, 14] },
  { id: "fullstack", label: "React & Fullstack", labelEn: "React & Fullstack", range: [15, 20] },
];

export default function RoadmapPage() {
  const { theme, language } = useThemeLanguageStore();
  const t = getTranslations(language);
  const { completedLessons, isLessonUnlocked } = useCurriculumProgressStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTrack, setSelectedTrack] = useState("ALL");
  const [selectedStageForBriefing, setSelectedStageForBriefing] = useState<StageItem | null>(null);

  const completedCount = Object.values(completedLessons).filter(
    (item) => item?.completed
  ).length;
  const totalLessons = 20;
  const progressPercent = Math.round((completedCount / totalLessons) * 100);

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

      <main className="flex-1 py-10 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl space-y-10">
          {/* Header Banner */}
          <div className="p-6 sm:p-10 rounded-2xl border border-border bg-card shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left max-w-xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-secondary text-xs font-semibold text-foreground border border-border">
                <Map className="h-3.5 w-3.5 text-primary" />
                <span>KURIKULUM BERTAHAP</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight">
                Peta Pembelajaran Web Developer
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                20 tahapan terstruktur dari konsep dasar web hingga pembuatan aplikasi fullstack modern dengan React, Next.js 15, dan PostgreSQL.
              </p>
            </div>

            {/* Overall Progress Meter */}
            <div className="p-5 rounded-xl border border-border bg-secondary/50 min-w-[240px] space-y-2 text-center md:text-left">
              <div className="flex items-center justify-between text-xs font-bold text-foreground">
                <span>Kemajuan Kurikulum</span>
                <span>{progressPercent}%</span>
              </div>
              <div className="h-2 w-full bg-background rounded-full border border-border overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <div className="text-[11px] text-muted-foreground">
                {completedCount} dari {totalLessons} materi terselesaikan
              </div>
            </div>
          </div>

          {/* Search & Track Filter Controls */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Cari materi koding (HTML, CSS, Flexbox, DOM, React)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-10 text-xs rounded-md bg-card border-border"
                />
              </div>

              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSearchQuery("")}
                  className="text-xs text-muted-foreground h-10"
                >
                  Reset
                </Button>
              )}
            </div>

            {/* Track filter pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {TRACKS.map((track) => (
                <button
                  key={track.id}
                  type="button"
                  onClick={() => setSelectedTrack(track.id)}
                  className={`px-3.5 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-colors border ${
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

          {/* Stages List */}
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
                  className={`p-6 rounded-xl border transition-colors ${
                    isStageComplete
                      ? "border-emerald-500/30 bg-card"
                      : isStageAccessible
                      ? "border-border bg-card hover:border-primary/40"
                      : "border-border/60 bg-secondary/30 opacity-70"
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-2 max-w-2xl">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-[10px] font-mono font-bold">
                          Tahap {String(stage.orderIndex).padStart(2, "0")}
                        </Badge>

                        {isStageComplete ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            <span>Selesai ({completedInStage}/{stageLessons.length})</span>
                          </span>
                        ) : isStageAccessible ? (
                          <span className="text-[11px] font-semibold text-primary">
                            {completedInStage}/{stageLessons.length} Materi Selesai
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                            <Lock className="h-3 w-3" />
                            <span>Terkunci</span>
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
                                  : "bg-secondary/40 text-muted-foreground/60 border-transparent cursor-not-allowed"
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
                    <div className="flex items-center gap-2 self-start md:self-center shrink-0">
                      {isStageAccessible ? (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedStageForBriefing(stage)}
                            className="text-xs font-semibold h-9 px-4 rounded-md"
                          >
                            <BookOpen className="h-3.5 w-3.5 mr-1" />
                            <span>Ikhtisar</span>
                          </Button>

                          {firstLesson && (
                            <Link href={`/lessons/${firstLesson.slug}`}>
                              <Button size="sm" className="text-xs font-bold h-9 px-4 rounded-md gap-1">
                                <span>{isStageComplete ? "Pelajari Ulang" : "Mulai Tahap"}</span>
                                <ArrowRight className="h-3.5 w-3.5" />
                              </Button>
                            </Link>
                          )}
                        </>
                      ) : (
                        <div className="text-xs text-muted-foreground font-medium px-3 py-1.5 rounded bg-secondary/60 border border-border">
                          Selesaikan tahap sebelumnya
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
