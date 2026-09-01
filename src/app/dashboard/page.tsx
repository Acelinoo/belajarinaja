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
  Flame,
  Check,
  TrendingUp,
  Target,
  FileCode,
  Layers,
  Sparkle,
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

  // Next up item calculation
  const nextLessonIndex = allLessons.findIndex((l) => l.id === activeResumeLesson?.id);
  const isStageProjectTime =
    currentStageCompletedCount === currentStageLessons.length && currentStageCompletedCount > 0;

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
        completedAt: data.completedAt ? new Date(data.completedAt).toLocaleDateString(language === "en" ? "en-US" : "id-ID", {
          day: "numeric",
          month: "short",
          hour: "2-digit",
          minute: "2-digit",
        }) : "Baru saja",
        score: data.score || 100,
      };
    });

  // Milestone Achievements definition
  const milestones = [
    {
      id: "ms-html",
      title: "HTML5 Fundamentals",
      titleEn: "HTML5 Fundamentals",
      desc: "Anatomi dokumen, elemen semantik, form interaktif, dan data tabular.",
      descEn: "Document anatomy, semantic elements, interactive forms, and tabular data.",
      targetStage: 2,
      isCompleted: allLessons.filter((l) => l.stageOrder <= 2).every((l) => completedLessons[l.id]?.completed),
    },
    {
      id: "ms-css",
      title: "Modern CSS Architect",
      titleEn: "Modern CSS Architect",
      desc: "Box model, Flexbox 1D, CSS Grid 2D, custom properties, dan responsive design.",
      descEn: "Box model, Flexbox 1D, CSS Grid 2D, custom properties, and responsive design.",
      targetStage: 6,
      isCompleted: allLessons.filter((l) => l.stageOrder <= 6).every((l) => completedLessons[l.id]?.completed),
    },
    {
      id: "ms-js",
      title: "JavaScript Core & DOM Mastery",
      titleEn: "JavaScript Core & DOM Mastery",
      desc: "Tipe data, closures, event delegation, async/await, dan ES Modules.",
      descEn: "Data types, closures, event delegation, async/await, and ES Modules.",
      targetStage: 10,
      isCompleted: allLessons.filter((l) => l.stageOrder <= 10).every((l) => completedLessons[l.id]?.completed),
    },
    {
      id: "ms-react",
      title: "React & Next.js 15 Fullstack",
      titleEn: "React & Next.js 15 Fullstack",
      desc: "Component architecture, hooks, Server Actions, App Router, dan client/server state.",
      descEn: "Component architecture, hooks, Server Actions, App Router, and client/server state.",
      targetStage: 16,
      isCompleted: allLessons.filter((l) => l.stageOrder <= 16).every((l) => completedLessons[l.id]?.completed),
    },
    {
      id: "ms-prod",
      title: "Production Web Engineer",
      titleEn: "Production Web Engineer",
      desc: "PostgreSQL, Prisma ORM, OWASP security headers, performance & capstone deployment.",
      descEn: "PostgreSQL, Prisma ORM, OWASP security headers, performance & capstone deployment.",
      targetStage: 20,
      isCompleted: progressPercent >= 100,
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground transition-colors">
      <Navbar />
      <SearchCommandModal />

      <main className="flex-1 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl space-y-8">
          {/* Header Banner */}
          <div className="p-6 sm:p-8 rounded-2xl border border-border bg-card shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4 text-center md:text-left flex-col md:flex-row">
              {theme === "fun" ? (
                <NovaCharacter state="excited" className="w-16 h-16 shrink-0" />
              ) : (
                <div className="h-12 w-12 rounded-xl bg-secondary text-primary flex items-center justify-center font-bold">
                  <User className="h-6 w-6" />
                </div>
              )}

              <div className="space-y-1">
                <div className="flex items-center gap-2 justify-center md:justify-start">
                  <h1 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">
                    {t.dashboard.welcome}, {user?.name || "Pelajar Web"}!
                  </h1>
                  <Badge variant="outline" className="text-[10px] font-semibold text-primary border-primary/30">
                    {user?.accountStatus === "VERIFIED_STUDENT" ? "Pelajar Terverifikasi" : "Guest Mode"}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {user?.email || "Kemajuan tersimpan lokal di browser ini"} • Target: {user?.dailyGoalMinutes || 30} menit/hari
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <Link href="/settings">
                <Button variant="outline" size="sm" className="text-xs font-semibold rounded-md gap-1.5 border-border">
                  <Settings className="h-3.5 w-3.5" />
                  <span>Pengaturan</span>
                </Button>
              </Link>
              <Link href="/roadmap">
                <Button size="sm" className="text-xs font-bold rounded-md px-4 gap-1.5">
                  <Map className="h-3.5 w-3.5" />
                  <span>Peta Kurikulum</span>
                </Button>
              </Link>
            </div>
          </div>

          {/* =========================================================================
              1. PRIMARY SECTION: CONTINUE LEARNING / START LEARNING
             ========================================================================= */}
          <div className="p-6 sm:p-8 rounded-2xl border-2 border-primary/40 bg-card shadow-xs space-y-5">
            <div className="flex items-center justify-between text-xs pb-3 border-b border-border">
              <span className="font-bold text-primary tracking-wider flex items-center gap-1.5">
                <TrendingUp className="h-4 w-4" />
                {completedCount > 0 ? "LANJUTKAN BELAJAR" : "MULAI PERJALANAN BELAJAR"}
              </span>
              <span className="text-muted-foreground font-medium">
                Tahap {activeResumeLesson?.stageOrder} dari 20: {language === "en" ? activeResumeLesson?.stageTitleEn : activeResumeLesson?.stageTitle}
              </span>
            </div>

            <div className="space-y-1.5">
              <h2 className="text-lg sm:text-2xl font-black text-foreground tracking-tight">
                {language === "en" && activeResumeLesson?.titleEn
                  ? activeResumeLesson.titleEn
                  : activeResumeLesson?.title}
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-3xl">
                {language === "en" && activeResumeLesson?.descriptionEn
                  ? activeResumeLesson.descriptionEn
                  : activeResumeLesson?.description}
              </p>
            </div>

            <div className="pt-2 flex flex-wrap items-center justify-between gap-4 border-t border-border/60">
              <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
                <Badge variant="secondary" className="text-[11px] font-semibold gap-1">
                  <Clock className="h-3 w-3" />
                  {activeResumeLesson?.estimatedMinutes} Menit
                </Badge>
                <Badge variant="outline" className="text-[11px] uppercase font-semibold">
                  {activeResumeLesson?.level}
                </Badge>
              </div>

              <Link href={`/lessons/${activeResumeLesson?.slug || "pengenalan-web-dan-sejarah-singkat"}`}>
                <Button size="sm" className="text-xs font-bold rounded-md px-6 gap-2">
                  <span>{completedCount > 0 ? "Lanjutkan Materi" : "Mulai Materi Pertama"}</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>

          {/* =========================================================================
              2. LEARNING PROGRESS & CURRENT STAGE (2-COLUMN GRID)
             ========================================================================= */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Overall Progress Card */}
            <div className="p-6 rounded-2xl border border-border bg-card space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground font-bold tracking-wider uppercase flex items-center gap-1.5">
                  <Target className="h-4 w-4 text-primary" />
                  Kemajuan Total Kurikulum
                </span>
                <span className="text-lg font-extrabold text-primary">{progressPercent}%</span>
              </div>

              <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border text-center">
                <div className="p-2 rounded-lg bg-secondary/50">
                  <span className="text-[10px] text-muted-foreground block">Materi Selesai</span>
                  <span className="text-sm font-bold text-foreground">{completedCount} / {totalLessons}</span>
                </div>
                <div className="p-2 rounded-lg bg-secondary/50">
                  <span className="text-[10px] text-muted-foreground block">Tersimpan</span>
                  <span className="text-sm font-bold text-foreground">{bookmarkedLessons.length}</span>
                </div>
                <div className="p-2 rounded-lg bg-secondary/50">
                  <span className="text-[10px] text-muted-foreground block">Sertifikat</span>
                  <span className="text-sm font-bold text-foreground">{progressPercent >= 100 ? "Tersedia" : "Terkunci"}</span>
                </div>
              </div>
            </div>

            {/* Current Stage Card */}
            <div className="p-6 rounded-2xl border border-border bg-card space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground font-bold tracking-wider uppercase flex items-center gap-1.5">
                  <Layers className="h-4 w-4 text-primary" />
                  Tahap Berjalan: Tahap {currentStage.orderIndex}
                </span>
                <span className="text-xs font-bold text-foreground">{currentStageCompletedCount} / {currentStageLessons.length} Materi</span>
              </div>

              <div>
                <h3 className="text-sm font-extrabold text-foreground truncate">
                  {language === "en" ? currentStage.titleEn : currentStage.titleId}
                </h3>
                <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                  {currentStage.description}
                </p>
              </div>

              <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-500"
                  style={{ width: `${currentStagePercent}%` }}
                />
              </div>

              <div className="pt-1 flex items-center justify-between text-xs">
                <span className="text-[11px] text-muted-foreground font-medium">
                  {currentStagePercent}% selesai di tahap ini
                </span>
                <Link href="/roadmap">
                  <Button size="sm" variant="ghost" className="h-7 text-xs font-bold text-primary p-0 hover:underline">
                    Lihat Tahap Ini →
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* =========================================================================
              3. NEXT UP & RECENT ACTIVITY
             ========================================================================= */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Next Up Card */}
            <div className="p-6 rounded-2xl border border-border bg-card space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                <BookOpen className="h-4 w-4 text-primary" />
                <span>Langkah Selanjutnya (Next Up)</span>
              </div>

              {isStageProjectTime ? (
                <div className="p-4 rounded-xl border border-primary/30 bg-primary/5 space-y-2.5">
                  <Badge className="text-[10px] font-bold">Proyek Milestone Tahap</Badge>
                  <h4 className="text-sm font-bold text-foreground">
                    Proyek Penerapan: {currentStage.titleId}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Anda telah menyelesaikan seluruh materi teori. Saatnya menerapkan pemahaman Anda dalam proyek mandiri.
                  </p>
                  <Link href={`/lessons/${currentStageLessons[currentStageLessons.length - 1].slug}`}>
                    <Button size="sm" className="w-full text-xs font-bold rounded-md mt-1">
                      Mulai Proyek Milestone →
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="p-4 rounded-xl border border-border bg-secondary/40 space-y-2.5">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase block">
                    Materi Berikutnya
                  </span>
                  <h4 className="text-sm font-bold text-foreground">
                    {language === "en" && activeResumeLesson?.titleEn ? activeResumeLesson.titleEn : activeResumeLesson?.title}
                  </h4>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {language === "en" && activeResumeLesson?.descriptionEn ? activeResumeLesson.descriptionEn : activeResumeLesson?.description}
                  </p>
                  <Link href={`/lessons/${activeResumeLesson?.slug}`}>
                    <Button size="sm" className="w-full text-xs font-bold rounded-md mt-1 gap-1.5">
                      <span>Buka & Pelajari Materi</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Recent Activity Feed (Max 5 items) */}
            <div className="p-6 rounded-2xl border border-border bg-card space-y-4">
              <div className="flex items-center justify-between text-xs font-bold text-foreground">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  <span>Aktivitas Belajar Terbaru</span>
                </div>
                <span className="text-muted-foreground text-[10px]">Maks. 5 aktivitas</span>
              </div>

              {recentActivities.length > 0 ? (
                <div className="space-y-2.5">
                  {recentActivities.map((act) => (
                    <div
                      key={act.lessonId}
                      className="p-3 rounded-lg border border-border bg-secondary/30 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="space-y-0.5 truncate">
                        <span className="font-semibold text-foreground truncate block">
                          {act.title}
                        </span>
                        <span className="text-[10px] text-muted-foreground block">
                          {act.stageTitle} • {act.completedAt}
                        </span>
                      </div>
                      <Badge variant="outline" className="text-[10px] text-emerald-600 dark:text-emerald-400 border-emerald-500/30 shrink-0 gap-1">
                        <Check className="h-3 w-3" />
                        Lulus {act.score}%
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 rounded-xl border border-dashed border-border text-center space-y-2">
                  <p className="text-xs text-muted-foreground">
                    Belum ada aktivitas belajar. Mulai materi pertama Anda untuk melihat riwayat kemajuan di sini.
                  </p>
                  <Link href="/roadmap">
                    <Button size="sm" variant="outline" className="text-xs font-semibold rounded-md">
                      Buka Peta Materi
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* =========================================================================
              4. MILESTONE ACHIEVEMENTS
             ========================================================================= */}
          <div className="p-6 sm:p-8 rounded-2xl border border-border bg-card space-y-5">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="text-base font-extrabold text-foreground flex items-center gap-2">
                  <Award className="h-4 w-4 text-primary" />
                  <span>Pencapaian Tonggak Keahlian (Milestones)</span>
                </h3>
                <p className="text-xs text-muted-foreground">
                  Validasi kemampuan rekayasa web Anda di setiap tonggak kurikulum utama.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {milestones.map((ms) => (
                <div
                  key={ms.id}
                  className={`p-4 rounded-xl border transition-all ${
                    ms.isCompleted
                      ? "border-emerald-500/30 bg-emerald-50/20 dark:bg-emerald-950/10"
                      : "border-border bg-secondary/20"
                  } space-y-2`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-foreground">{language === "en" ? ms.titleEn : ms.title}</span>
                    {ms.isCompleted ? (
                      <Badge className="bg-emerald-600 text-white text-[9px] font-bold">
                        Selesai
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-[9px] text-muted-foreground">
                        Tahap 1–{ms.targetStage}
                      </Badge>
                    )}
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    {language === "en" ? ms.descEn : ms.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* =========================================================================
              5. BOOKMARKED LESSONS
             ========================================================================= */}
          {bookmarkedItems.length > 0 && (
            <div className="p-6 sm:p-8 rounded-2xl border border-border bg-card space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                <Bookmark className="h-4 w-4 text-primary" />
                <span>Materi yang Ditandai ({bookmarkedItems.length})</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {bookmarkedItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-lg border border-border bg-secondary/40 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-0.5 truncate">
                      <h4 className="font-semibold text-foreground truncate">
                        {item.title}
                      </h4>
                      <span className="text-[10px] text-muted-foreground">
                        Tahap {item.stageOrder}: {item.stageTitle}
                      </span>
                    </div>

                    <Link href={`/lessons/${item.slug}`}>
                      <Button size="sm" variant="ghost" className="h-7 text-xs font-bold px-2.5 text-primary hover:underline">
                        Buka →
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
