"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Bookmark,
  CheckCircle2,
  Lock,
  ArrowRight,
  ArrowLeft,
  CircleHelp,
  Code2,
  BookOpen,
  ChevronDown,
  ChevronRight,
  Clock,
  Award,
  AlertTriangle,
  Menu,
  X,
  Copy,
  Check,
} from "lucide-react";
import { MarkdownRenderer } from "@/components/ui/markdown-renderer";
import { InlineFormattedText } from "@/components/ui/inline-formatted-text";
import { QuizWidget } from "@/components/interactive/QuizWidget";
import { RealSandboxEngine } from "@/components/interactive/RealSandboxEngine";
import { getExerciseForLesson } from "@/data/lessonExercises";
import { useThemeLanguageStore } from "@/store/useThemeLanguageStore";
import { useCurriculumProgressStore } from "@/store/useCurriculumProgressStore";
import { getTranslations } from "@/lib/translations";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CURRICULUM_STAGES } from "@/data/curriculum";
import { NovaCharacter } from "@/components/fun/characters/NovaCharacter";
import type { Lesson, Stage } from "@/types/curriculum";

interface UnifiedLessonWorkspaceProps {
  activeLesson: Lesson;
  activeStage: Stage;
  prevLessonItem: { lesson: Lesson; stage: Stage } | null;
  nextLessonItem: { lesson: Lesson; stage: Stage } | null;
}

export function UnifiedLessonWorkspace({
  activeLesson,
  activeStage,
  prevLessonItem,
  nextLessonItem,
}: UnifiedLessonWorkspaceProps) {
  const { theme, language } = useThemeLanguageStore();
  const t = getTranslations(language);
  const { completedLessons, toggleBookmark, bookmarkedLessons, isLessonUnlocked } =
    useCurriculumProgressStore();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const isCompleted = !!completedLessons[activeLesson.id]?.completed;
  const isBookmarked = bookmarkedLessons.includes(activeLesson.id);

  const lessonTitle =
    language === "en" && activeLesson.titleEn ? activeLesson.titleEn : activeLesson.title;
  const lessonDesc =
    language === "en" && activeLesson.descriptionEn
      ? activeLesson.descriptionEn
      : activeLesson.description;
  const stageTitle =
    language === "en" && activeStage.titleEn ? activeStage.titleEn : activeStage.titleId;

  const exercise = getExerciseForLesson(activeLesson.id, activeLesson.slug, lessonTitle);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* =========================================================================
          1. LEFT CURRICULUM SIDEBAR (Desktop: 3 cols / Mobile: Drawer)
         ========================================================================= */}
      <aside className="hidden lg:block lg:col-span-3 sticky top-20 rounded-xl border border-border bg-card p-4 space-y-4 max-h-[calc(100vh-6rem)] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold text-primary uppercase tracking-wider block">
              DAFTAR KURIKULUM
            </span>
            <span className="text-xs font-bold text-foreground">
              Tahap {activeStage.orderIndex} dari 20
            </span>
          </div>
          <Link href="/roadmap" className="text-[11px] text-primary hover:underline font-semibold">
            Semua &rarr;
          </Link>
        </div>

        {/* Stages Tree */}
        <div className="space-y-3 text-xs">
          {CURRICULUM_STAGES.map((stage) => {
            const isCurrentStage = stage.id === activeStage.id;
            const stageLessons = stage.lessons;
            const completedCount = stageLessons.filter(
              (l) => completedLessons[l.id]?.completed
            ).length;
            const isStageComplete = completedCount === stageLessons.length && stageLessons.length > 0;

            return (
              <div key={stage.id} className="space-y-1">
                <div
                  className={`p-2 rounded-md font-bold flex items-center justify-between transition-colors ${
                    isCurrentStage
                      ? "bg-secondary text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <span className="truncate max-w-[170px]">
                    {stage.orderIndex}. {language === "en" && stage.titleEn ? stage.titleEn : stage.titleId}
                  </span>
                  {isStageComplete && (
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  )}
                </div>

                {/* Lessons in active/selected stage */}
                {isCurrentStage && (
                  <div className="pl-3 space-y-0.5 border-l border-border ml-2 my-1">
                    {stageLessons.map((l) => {
                      const isCurrentLesson = l.id === activeLesson.id;
                      const isDone = !!completedLessons[l.id]?.completed;
                      const isUnlocked = isLessonUnlocked(l.id);

                      return (
                        <Link
                          key={l.id}
                          href={isUnlocked ? `/lessons/${l.slug}` : "#"}
                          className={`p-2 rounded-md flex items-center justify-between text-[11px] transition-colors ${
                            isCurrentLesson
                              ? "bg-primary text-primary-foreground font-bold shadow-xs"
                              : isDone
                              ? "text-foreground hover:bg-secondary"
                              : isUnlocked
                              ? "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                              : "text-muted-foreground/40 cursor-not-allowed"
                          }`}
                        >
                          <span className="truncate max-w-[150px]">
                            {language === "en" && l.titleEn ? l.titleEn : l.title}
                          </span>

                          {isDone ? (
                            <Check className={`h-3 w-3 shrink-0 ${isCurrentLesson ? "text-primary-foreground" : "text-emerald-600 dark:text-emerald-400"}`} />
                          ) : !isUnlocked ? (
                            <Lock className="h-3 w-3 shrink-0 opacity-60" />
                          ) : null}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </aside>

      {/* =========================================================================
          2. MAIN LESSON ARTICLE & WORKSPACE (9 cols)
         ========================================================================= */}
      <main className="lg:col-span-9 space-y-8">
        {/* Top Breadcrumb & Utilities */}
        <div className="p-4 rounded-xl border border-border bg-card flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-muted-foreground flex-wrap">
            <Link href="/roadmap" className="hover:text-foreground hover:underline">
              Peta Kurikulum
            </Link>
            <span>/</span>
            <span>Tahap {activeStage.orderIndex}: {stageTitle}</span>
            <span>/</span>
            <span className="font-bold text-foreground truncate max-w-[220px]">
              {lessonTitle}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => toggleBookmark(activeLesson.id)}
              className={`h-8 text-xs font-semibold rounded-md gap-1.5 ${
                isBookmarked ? "bg-secondary text-primary border-primary/40" : ""
              }`}
            >
              <Bookmark className={`h-3.5 w-3.5 ${isBookmarked ? "fill-primary text-primary" : ""}`} />
              <span>{isBookmarked ? "Tersimpan" : "Simpan"}</span>
            </Button>

            {isCompleted && (
              <Badge className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 text-[11px] font-bold">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Lulus
              </Badge>
            )}
          </div>
        </div>

        {/* Lesson Header */}
        <div className="p-6 sm:p-8 rounded-2xl border border-border bg-card space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="text-[10px] font-mono font-bold">
              MODUL {String(activeStage.orderIndex).padStart(2, "0")}
            </Badge>
            <Badge variant="secondary" className="text-[10px] font-semibold">
              <Clock className="h-3 w-3 mr-1" />
              {activeLesson.estimatedMinutes} Menit
            </Badge>
            <Badge variant="secondary" className="text-[10px] font-semibold uppercase">
              {activeLesson.level}
            </Badge>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            {lessonTitle}
          </h1>

          <p className="text-sm text-muted-foreground leading-relaxed">
            {lessonDesc}
          </p>

          {/* Learning Objectives Checklist */}
          {activeLesson.learningObjectives && activeLesson.learningObjectives.length > 0 && (
            <div className="pt-4 border-t border-border space-y-2">
              <span className="text-[11px] font-bold text-foreground uppercase tracking-wider block">
                Target Capaian Pembelajaran:
              </span>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-muted-foreground">
                {activeLesson.learningObjectives.map((obj, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                    <span>{obj}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Rich Lesson Content Markdown */}
        <article className="p-6 sm:p-10 rounded-2xl border border-border bg-card space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-border text-xs text-muted-foreground">
            <span className="font-semibold text-foreground">Materi Pelajaran</span>
            <button
              type="button"
              onClick={() => handleCopy(activeLesson.contentMd)}
              className="hover:text-foreground flex items-center gap-1 transition-colors text-[11px]"
            >
              {copied ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
              <span>{copied ? "Tersalin" : "Salin Catatan"}</span>
            </button>
          </div>

          <div className="max-w-[75ch] text-xs sm:text-sm leading-relaxed text-foreground/90">
            <MarkdownRenderer
              content={
                language === "en" && activeLesson.contentMdEn
                  ? activeLesson.contentMdEn
                  : activeLesson.contentMd
              }
            />
          </div>
        </article>

        {/* =========================================================================
            MANDATORY REAL INTERACTIVE SANDBOX
           ========================================================================= */}
        <section className="p-6 sm:p-8 rounded-2xl border border-border bg-card space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <Code2 className="h-4 w-4 text-primary" />
                <h2 className="text-base font-bold text-foreground">
                  Laboratorium Praktik Interaktif
                </h2>
              </div>
              <p className="text-xs text-muted-foreground">
                Uji langsung kode untuk materi ini, modifikasi, dan amati output browser atau konsolnya secara instan.
              </p>
            </div>

            {theme === "fun" && (
              <NovaCharacter state="curious" className="w-10 h-10 shrink-0" />
            )}
          </div>

          <RealSandboxEngine
            lessonId={activeLesson.id}
            exercise={exercise}
          />
        </section>

        {/* Antipatterns & Common Mistakes Warning (if any) */}
        {activeLesson.commonMistakes && activeLesson.commonMistakes.length > 0 && (
          <div className="p-6 rounded-2xl border border-amber-500/30 bg-amber-500/5 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-700 dark:text-amber-300">
              <AlertTriangle className="h-4 w-4" />
              <span>Kesalahan Umum yang Sering Terjadi:</span>
            </div>
            <ul className="space-y-1.5 text-xs text-muted-foreground">
              {activeLesson.commonMistakes.map((mistake, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-amber-500 font-bold">&bull;</span>
                  <InlineFormattedText text={mistake} />
                </li>
              ))}
            </ul>
          </div>
        )}


        {/* Knowledge Evaluation Quiz Widget */}
        <section className="p-6 sm:p-8 rounded-2xl border border-border bg-card space-y-4">
          <div className="space-y-0.5 pb-3 border-b border-border">
            <div className="flex items-center gap-2">
              <CircleHelp className="h-4 w-4 text-primary" />
              <h2 className="text-base font-bold text-foreground">
                Uji Pemahaman ({activeLesson.quizzes.length} Soal)
              </h2>
            </div>
            <p className="text-xs text-muted-foreground">
              Selesaikan evaluasi pemahaman dengan skor minimal 80% untuk menandai materi ini telah lulus dan membuka materi berikutnya.
            </p>
          </div>

          <QuizWidget
            lessonId={activeLesson.id}
            lessonSlug={activeLesson.slug}
            quizzes={activeLesson.quizzes}
          />
        </section>

        {/* Previous / Next Lesson Navigation Footer */}
        <div className="p-4 rounded-xl border border-border bg-card flex items-center justify-between gap-4">
          {prevLessonItem ? (
            <Link href={`/lessons/${prevLessonItem.lesson.slug}`}>
              <Button variant="outline" size="sm" className="text-xs font-semibold rounded-md gap-1.5">
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Materi Sebelumnya</span>
              </Button>
            </Link>
          ) : (
            <div />
          )}

          {nextLessonItem && (
            isCompleted ? (
              <Link href={`/lessons/${nextLessonItem.lesson.slug}`}>
                <Button size="sm" className="text-xs font-bold rounded-md gap-1.5 px-5">
                  <span>Materi Berikutnya</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            ) : (
              <Button
                variant="outline"
                size="sm"
                disabled
                className="text-xs font-semibold rounded-md gap-1.5 opacity-60"
              >
                <Lock className="h-3.5 w-3.5" />
                <span>Selesaikan Quiz untuk Lanjut</span>
              </Button>
            )
          )}
        </div>
      </main>
    </div>
  );
}
