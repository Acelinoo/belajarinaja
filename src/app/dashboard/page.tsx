"use client";

import React from "react";
import Link from "next/link";
import {
  Map,
  Compass,
  Bookmark,
  CheckCircle2,
  Clock,
  ArrowRight,
  BookOpen,
  User,
  ShieldCheck,
  Award,
  Settings,
  Check,
  Play,
  Layers,
  Sparkles,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SearchCommandModal } from "@/components/common/SearchCommandModal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CURRICULUM_STAGES } from "@/data/curriculum";
import { useCurriculumProgressStore } from "@/store/useCurriculumProgressStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useThemeLanguageStore } from "@/store/useThemeLanguageStore";
import { getTranslations } from "@/lib/translations";
import { NovaCharacter } from "@/components/fun/characters/NovaCharacter";

export default function DashboardPage() {
  const { theme, language } = useThemeLanguageStore();
  const t = getTranslations(language);
  const { user, isAuthenticated } = useAuthStore();
  const { completedLessons, bookmarkedLessons } = useCurriculumProgressStore();

  // Flatten all lessons with stage metadata
  const allLessons = CURRICULUM_STAGES.flatMap((s) =>
    s.lessons.map((l) => ({
      ...l,
      stageId: s.id,
      stageOrder: s.orderIndex,
      stageTitle: s.titleId,
      stageTitleEn: s.titleEn,
      stageDescription: s.description,
    }))
  );

  const completedList = Object.values(completedLessons).filter((item) => item?.completed);
  const completedCount = completedList.length;
  const totalLessons = allLessons.length;
  const progressPercent = Math.min(100, Math.round((completedCount / (totalLessons || 1)) * 100));

  // Identify next recommended resume lesson
  const activeResumeLesson =
    allLessons.find((l) => !completedLessons[l.id]?.completed) || allLessons[allLessons.length - 1];

  // Identify current active stage
  const currentStage =
    CURRICULUM_STAGES.find((s) =>
      s.lessons.some((l) => !completedLessons[l.id]?.completed)
    ) || CURRICULUM_STAGES[0];

  const currentStageLessons = currentStage.lessons;
  const currentStageCompletedCount = currentStageLessons.filter(
    (l) => completedLessons[l.id]?.completed
  ).length;
  const currentStagePercent = Math.round(
    (currentStageCompletedCount / (currentStageLessons.length || 1)) * 100
  );

  // Bookmarked items
  const bookmarkedItems = allLessons.filter((l) => bookmarkedLessons.includes(l.id));

  // Recent activity list (sorted by completion timestamp, max 5)
  const recentActivities = Object.entries(completedLessons)
    .filter(([_, data]) => data?.completed && data?.completedAt)
    .sort((a, b) => new Date(b[1].completedAt || 0).getTime() - new Date(a[1].completedAt || 0).getTime())
    .slice(0, 5)
    .map(([lessonId, data]) => {
      const lesson = allLessons.find((l) => l.id === lessonId);
      return {
        lessonId,
        title: lesson?.title || "Materi Pembelajaran",
        stageTitle: lesson?.stageTitle || "Tahap Kurikulum",
        slug: lesson?.slug || "",
        completedAt: data.completedAt ? new Date(data.completedAt).toLocaleDateString(language === "en" ? "en-US" : "id-ID", {
          day: "numeric",
          month: "short",
          hour: "2-digit",
          minute: "2-digit",
        }) : "Baru saja",
      };
    });

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground transition-colors">
      <Navbar />
      <SearchCommandModal />

      <main className="flex-1 py-10 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl space-y-8">
          {/* Header Greeting */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-primary" />
                <span className="text-xs font-mono font-semibold text-muted-foreground uppercase">
                  DASHBOARD PEMBELAJARAN
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                Halo, {isAuthenticated && user?.name ? user.name : "Web Developer"}!
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Pantau kemajuan kurikulum dan lanjutkan materi koding kamu dari posisi terakhir.
              </p>
            </div>

            <Link href="/roadmap">
              <Button variant="outline" size="sm" className="text-xs font-semibold h-9 gap-1.5 self-start sm:self-center">
                <Map className="h-3.5 w-3.5 text-primary" />
                <span>Buka Seluruh Roadmap</span>
              </Button>
            </Link>
          </div>

          {/* PRIMARY CONTENT: CONTINUE LEARNING HERO */}
          {activeResumeLesson && (
            <div className="p-6 sm:p-8 rounded-2xl border-2 border-primary/40 bg-card shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-3 max-w-xl">
                <div className="flex items-center gap-2">
                  <Badge variant="default" className="text-[10px] font-bold uppercase tracking-wider bg-primary text-primary-foreground">
                    Lanjutkan Belajar
                  </Badge>
                  <span className="text-xs font-mono font-bold text-muted-foreground">
                    Tahap {String(currentStage.orderIndex).padStart(2, "0")}: {currentStage.titleId}
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                  {language === "en" && activeResumeLesson.titleEn ? activeResumeLesson.titleEn : activeResumeLesson.title}
                </h2>

                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {language === "en" && activeResumeLesson.descriptionEn ? activeResumeLesson.descriptionEn : activeResumeLesson.description}
                </p>

                <div className="flex items-center gap-4 text-xs text-muted-foreground font-medium pt-1">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-primary" />
                    ~15 menit belajar
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <BookOpen className="h-3.5 w-3.5 text-primary" />
                    Termasuk Interactive Sandbox
                  </span>
                </div>
              </div>

              <div className="shrink-0 w-full md:w-auto">
                <Link href={`/lessons/${activeResumeLesson.slug}`}>
                  <Button size="lg" className="h-11 px-6 text-xs sm:text-sm font-bold rounded-md gap-2 w-full md:w-auto shadow-sm">
                    <Play className="h-4 w-4" />
                    <span>Lanjutkan Materi</span>
                  </Button>
                </Link>
              </div>
            </div>
          )}

          {/* TWO COLUMN GRID: PROGRESS & STAGE SUMMARY */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left: Overall Progress */}
            <div className="p-6 rounded-xl border border-border bg-card space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <span>Kemajuan Kurikulum Global</span>
                </h3>
                <span className="text-xs font-mono font-bold text-primary">
                  {progressPercent}%
                </span>
              </div>

              <div className="space-y-2">
                <div className="h-2 w-full bg-secondary rounded-full overflow-hidden border border-border">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground font-medium">
                  <span>{completedCount} materi diselesaikan</span>
                  <span>{totalLessons - completedCount} materi tersisa</span>
                </div>
              </div>

              <div className="p-3 bg-secondary/50 rounded-lg border border-border/80 text-xs text-muted-foreground space-y-1">
                <p className="font-semibold text-foreground">💡 Tips Pembelajaran:</p>
                <p className="leading-relaxed">
                  Selesaikan minimal 1 materi setiap hari dan coba jalankan kode di interactive sandbox untuk melatih memori otot koding kamu.
                </p>
              </div>
            </div>

            {/* Right: Active Stage Progress */}
            <div className="p-6 rounded-xl border border-border bg-card space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Layers className="h-4 w-4 text-primary" />
                  <span>Tahap Aktif: {currentStage.titleId}</span>
                </h3>
                <span className="text-xs font-mono font-bold text-muted-foreground">
                  {currentStageCompletedCount}/{currentStageLessons.length}
                </span>
              </div>

              <div className="space-y-1.5">
                {currentStageLessons.map((l) => {
                  const isDone = !!completedLessons[l.id]?.completed;
                  return (
                    <Link
                      key={l.id}
                      href={`/lessons/${l.slug}`}
                      className="flex items-center justify-between p-2 rounded-md hover:bg-secondary border border-transparent hover:border-border text-xs transition-colors"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        {isDone ? (
                          <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        ) : (
                          <span className="h-2 w-2 rounded-full bg-muted-foreground/40 shrink-0" />
                        )}
                        <span className={`truncate ${isDone ? "line-through text-muted-foreground" : "font-semibold text-foreground"}`}>
                          {l.title}
                        </span>
                      </div>
                      <span className="text-[10px] text-muted-foreground shrink-0 font-mono">
                        {isDone ? "Selesai" : "Mulai →"}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          {/* TWO COLUMN GRID: BOOKMARKS & RECENT ACTIVITY */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Bookmarked Lessons */}
            <div className="p-6 rounded-xl border border-border bg-card space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Bookmark className="h-4 w-4 text-primary" />
                  <span>Materi yang Disimpan</span>
                </h3>
                <span className="text-xs font-mono text-muted-foreground">
                  {bookmarkedItems.length} Materi
                </span>
              </div>

              {bookmarkedItems.length > 0 ? (
                <div className="space-y-1.5">
                  {bookmarkedItems.map((item) => (
                    <Link
                      key={item.id}
                      href={`/lessons/${item.slug}`}
                      className="flex items-center justify-between p-2.5 rounded-md bg-secondary/50 hover:bg-secondary border border-border text-xs transition-colors"
                    >
                      <div className="space-y-0.5 min-w-0">
                        <p className="font-bold text-foreground truncate">{item.title}</p>
                        <p className="text-[10px] text-muted-foreground truncate">{item.stageTitle}</p>
                      </div>
                      <ArrowRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center text-xs text-muted-foreground space-y-1">
                  <p className="font-semibold text-foreground">Belum ada materi yang disimpan.</p>
                  <p>Kamu dapat menandai materi penting dengan tombol bookmark saat membaca lesson.</p>
                </div>
              )}
            </div>

            {/* Recent Completed Activity */}
            <div className="p-6 rounded-xl border border-border bg-card space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  <span>Riwayat Aktivitas Terakhir</span>
                </h3>
              </div>

              {recentActivities.length > 0 ? (
                <div className="space-y-2">
                  {recentActivities.map((act) => (
                    <div
                      key={act.lessonId}
                      className="flex items-center justify-between p-2.5 rounded-md border border-border text-xs"
                    >
                      <div className="space-y-0.5 min-w-0">
                        <p className="font-bold text-foreground truncate">{act.title}</p>
                        <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                          ✓ Selesai dipelajari ({act.completedAt})
                        </p>
                      </div>
                      {act.slug && (
                        <Link href={`/lessons/${act.slug}`}>
                          <Button size="sm" variant="ghost" className="h-7 text-[11px] px-2 text-muted-foreground hover:text-foreground">
                            Buka
                          </Button>
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center text-xs text-muted-foreground space-y-1">
                  <p className="font-semibold text-foreground">Belum ada aktivitas koding.</p>
                  <p>Mulai pelajari materi pertama untuk melihat riwayat kemajuan kamu di sini.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}