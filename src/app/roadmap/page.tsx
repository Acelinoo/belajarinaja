"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Compass,
  CheckCircle2,
  Lock,
  Unlock,
  ArrowRight,
  Search,
  BookOpen,
  AlertCircle,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SearchCommandModal } from "@/components/common/SearchCommandModal";
import { CURRICULUM_STAGES, LessonItem, StageItem } from "@/data/curriculum";
import { useGuestProgressStore } from "@/store/useGuestProgressStore";

export default function RoadmapPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [lockedModalData, setLockedModalData] = useState<{
    lesson: LessonItem;
    unmetPrereqs: string[];
  } | null>(null);

  const { completedLessons } = useGuestProgressStore();

  const totalLessons = CURRICULUM_STAGES.reduce(
    (acc, stage) => acc + stage.lessons.length,
    0
  );
  const completedCount = Object.keys(completedLessons).filter(
    (k) => completedLessons[k]?.completed
  ).length;
  const progressPercentage = Math.round(
    (completedCount / (totalLessons || 1)) * 100
  );

  // Helper to check if a lesson is unlocked
  const isLessonUnlocked = (lesson: LessonItem, stageIndex: number) => {
    if (stageIndex === 0 && lesson.prerequisites.length === 0) return true;
    if (lesson.prerequisites.length === 0) return true;

    // Check if all prerequisites are completed
    return lesson.prerequisites.every((prereqSlug) => {
      // Find lesson id by slug
      for (const st of CURRICULUM_STAGES) {
        const found = st.lessons.find((l) => l.slug === prereqSlug);
        if (found) {
          return completedLessons[found.id]?.completed;
        }
      }
      return true;
    });
  };

  const getUnmetPrereqNames = (lesson: LessonItem) => {
    const names: string[] = [];
    lesson.prerequisites.forEach((prereqSlug) => {
      for (const st of CURRICULUM_STAGES) {
        const found = st.lessons.find((l) => l.slug === prereqSlug);
        if (found && !completedLessons[found.id]?.completed) {
          names.push(found.title);
        }
      }
    });
    return names;
  };

  const filteredStages = CURRICULUM_STAGES.filter((stage) => {
    const matchesCategory =
      selectedCategory === "ALL" || stage.category === selectedCategory;
    const matchesSearch =
      stage.titleId.toLowerCase().includes(search.toLowerCase()) ||
      stage.description.toLowerCase().includes(search.toLowerCase()) ||
      stage.lessons.some((l) =>
        l.title.toLowerCase().includes(search.toLowerCase())
      );
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />
      <SearchCommandModal />

      {/* Main Roadmap Container */}
      <main className="flex-1 py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header Banner */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 pb-8 border-b border-border">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-primary uppercase tracking-wider mb-2">
                <Compass className="h-3.5 w-3.5" />
                <span>Curriculum Roadmap Engine • 20 Stages</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
                Roadmap Web Developer Dari Nol
              </h1>
              <p className="text-muted-foreground text-sm mt-1 max-w-2xl">
                Alur belajar terstruktur dengan pemetaan prasyarat otomatis. Mulai dari konsep dasar komputer hingga pembuatan portofolio siap kerja.
              </p>
            </div>

            {/* Overall Progress Widget */}
            <div className="w-full md:w-72 p-4 rounded-xl border border-border bg-card">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-muted-foreground font-medium">
                  Progress Kurikulum
                </span>
                <span className="font-mono font-bold text-foreground">
                  {completedCount} / {totalLessons} Selesai ({progressPercentage}%)
                </span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </div>
          </div>

          {/* Filter & Search Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari materi atau topik..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 text-xs bg-card border-border"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
              {[
                "ALL",
                "Fundamentals",
                "Frontend",
                "Backend",
                "Fullstack & DevOps",
                "Portfolio",
              ].map((cat) => (
                <Button
                  key={cat}
                  variant={selectedCategory === cat ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(cat)}
                  className="text-xs whitespace-nowrap h-8"
                >
                  {cat === "ALL" ? "Semua 20 Tahap" : cat}
                </Button>
              ))}
            </div>
          </div>

          {/* Stages Roadmap Tree */}
          <div className="relative space-y-6">
            {/* Visual connector vertical spine on desktop */}
            <div className="hidden lg:block absolute left-8 top-8 bottom-8 w-0.5 bg-border/60 -z-0" />

            {filteredStages.map((stage, sIdx) => {
              const stageLessonsDone = stage.lessons.filter(
                (l) => completedLessons[l.id]?.completed
              ).length;
              const isStageComplete =
                stageLessonsDone === stage.lessons.length &&
                stage.lessons.length > 0;

              return (
                <SpotlightCard
                  key={stage.id}
                  className="relative z-10 border-border p-6 rounded-xl transition-all"
                >
                  {/* Stage Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border/80">
                    <div className="flex items-center gap-3.5">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-lg font-mono text-xs font-bold ${
                          isStageComplete
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                            : "bg-secondary text-foreground border border-border"
                        }`}
                      >
                        {String(stage.orderIndex).padStart(2, "0")}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="text-base sm:text-lg font-semibold tracking-tight">
                            {stage.titleId}
                          </h2>
                          <Badge variant="outline" className="text-[10px]">
                            {stage.category}
                          </Badge>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {stage.lessons.length} Modul Pelajaran • {stageLessonsDone}/{stage.lessons.length} Selesai
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {isStageComplete ? (
                        <Badge variant="success" className="gap-1 text-xs">
                          <CheckCircle2 className="h-3 w-3" />
                          Tahap Selesai
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-xs font-mono">
                          {stageLessonsDone > 0 ? "Sedang Berjalan" : "Tersedia"}
                        </Badge>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
                    {stage.description}
                  </p>

                  {/* Lessons Grid in this Stage */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 mt-5">
                    {stage.lessons.map((lesson) => {
                      const isDone = completedLessons[lesson.id]?.completed;
                      const isUnlocked = isLessonUnlocked(lesson, sIdx);
                      const unmetPrereqs = getUnmetPrereqNames(lesson);

                      return isUnlocked ? (
                        <Link
                          key={lesson.id}
                          href={`/lessons/${lesson.slug}`}
                          className="flex flex-col justify-between p-4 rounded-lg border border-border/80 hover:border-primary/60 bg-background/60 hover:bg-card transition-all group"
                        >
                          <div>
                            <div className="flex items-center justify-between gap-2 mb-1.5">
                              <span className="text-[11px] font-mono text-muted-foreground">
                                {lesson.estimatedMinutes} menit
                              </span>
                              <Badge variant="outline" className="text-[10px]">
                                {lesson.level}
                              </Badge>
                            </div>

                            <div className="flex items-start gap-2">
                              {isDone ? (
                                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                              ) : (
                                <BookOpen className="h-4 w-4 text-muted-foreground group-hover:text-primary shrink-0 mt-0.5 transition-colors" />
                              )}
                              <h3 className="text-xs font-semibold group-hover:text-primary transition-colors leading-snug">
                                {lesson.title}
                              </h3>
                            </div>
                          </div>

                          <div className="mt-3 pt-2 border-t border-border/40 flex items-center justify-between text-[11px] text-primary">
                            <span>{isDone ? "Pelajari Ulang" : "Buka Materi"}</span>
                            <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                          </div>
                        </Link>
                      ) : (
                        <button
                          key={lesson.id}
                          type="button"
                          onClick={() =>
                            setLockedModalData({ lesson, unmetPrereqs })
                          }
                          className="flex flex-col justify-between p-4 rounded-lg border border-border/40 bg-card/30 text-left opacity-75 hover:opacity-100 transition-opacity"
                        >
                          <div>
                            <div className="flex items-center justify-between gap-2 mb-1.5">
                              <span className="text-[11px] font-mono text-muted-foreground">
                                {lesson.estimatedMinutes} menit
                              </span>
                              <Badge
                                variant="outline"
                                className="text-[10px] text-amber-400 border-amber-500/30"
                              >
                                Terkunci
                              </Badge>
                            </div>

                            <div className="flex items-start gap-2">
                              <Lock className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                              <h3 className="text-xs font-semibold text-foreground/80 leading-snug">
                                {lesson.title}
                              </h3>
                            </div>
                          </div>

                          <div className="mt-3 pt-2 border-t border-border/40 flex items-center justify-between text-[11px] text-amber-400/90 font-mono">
                            <span>Prasyarat Belum Selesai</span>
                            <Info className="h-3 w-3" />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </SpotlightCard>
              );
            })}
          </div>
        </div>
      </main>

      {/* Prerequisite Detail Dialog */}
      <Dialog
        open={!!lockedModalData}
        onOpenChange={(open) => !open && setLockedModalData(null)}
      >
        <DialogContent className="max-w-md bg-[#181A22] border-border">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base text-amber-400">
              <Lock className="h-4 w-4" />
              <span>Materi Ini Masih Terkunci</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground pt-1">
              Untuk mendapatkan pemahaman maksimal, selesaikan modul prasyarat berikut terlebih dahulu:
            </DialogDescription>
          </DialogHeader>

          {lockedModalData && (
            <div className="space-y-4 py-2">
              <div className="p-3 rounded-lg bg-card border border-border">
                <div className="text-xs font-semibold text-foreground mb-1">
                  {lockedModalData.lesson.title}
                </div>
                <div className="text-[11px] text-muted-foreground">
                  {lockedModalData.lesson.description}
                </div>
              </div>

              {lockedModalData.lesson.prerequisiteReason && (
                <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300">
                  <div className="font-semibold mb-1 flex items-center gap-1.5">
                    <Info className="h-3.5 w-3.5 text-amber-400" />
                    <span>Mengapa Prasyarat Ini Penting?</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-foreground/90">
                    {lockedModalData.lesson.prerequisiteReason}
                  </p>
                </div>
              )}

              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-foreground">
                  Modul Prasyarat yang Harus Diselesaikan:
                </span>
                <ul className="space-y-1 text-xs text-muted-foreground">
                  {lockedModalData.unmetPrereqs.map((prereqName, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <AlertCircle className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                      <span>{prereqName}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-2 flex items-center justify-between gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setLockedModalData(null)}
                  className="text-xs"
                >
                  Tutup
                </Button>

                <Link
                  href={`/lessons/${lockedModalData.lesson.slug}`}
                  onClick={() => setLockedModalData(null)}
                >
                  <Button size="sm" variant="secondary" className="text-xs gap-1.5">
                    <Unlock className="h-3.5 w-3.5" />
                    Buka Paksa (Mode Bebas)
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
