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

  const allLessons = CURRICULUM_STAGES.flatMap((s) =>
    s.lessons.map((l) => ({
      ...l,
      stageOrder: s.orderIndex,
      stageTitle: s.titleId,
      stageTitleEn: s.titleEn,
    }))
  );

  const completedCount = Object.values(completedLessons).filter(
    (item) => item?.completed
  ).length;
  const totalLessons = allLessons.length;
  const progressPercent = Math.round((completedCount / (totalLessons || 1)) * 100);

  // Identify next recommended resume lesson
  const activeResumeLesson =
    allLessons.find((l) => !completedLessons[l.id]?.completed) || allLessons[0];

  const bookmarkedItems = allLessons.filter((l) =>
    bookmarkedLessons.includes(l.id)
  );

  const completedItems = allLessons.filter(
    (l) => completedLessons[l.id]?.completed
  );

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground transition-colors">
      <Navbar />
      <SearchCommandModal />

      <main className="flex-1 py-10 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl space-y-10">
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
                <h1 className="text-xl sm:text-2xl font-extrabold text-foreground">
                  {t.dashboard.welcome}, {user?.name || "Pelajar Web"}!
                </h1>
                <p className="text-xs text-muted-foreground">
                  {user?.email || "Kemajuan tersimpan lokal di browser ini"}
                </p>
              </div>
            </div>

            <Link href="/roadmap">
              <Button size="sm" className="text-xs font-bold rounded-md px-4 gap-1.5">
                <Map className="h-3.5 w-3.5" />
                <span>Buka Peta Kurikulum</span>
              </Button>
            </Link>
          </div>

          {/* =========================================================================
              1. PRIORITY: WHAT SHOULD I LEARN NEXT?
             ========================================================================= */}
          <div className="p-6 sm:p-8 rounded-2xl border border-border bg-card space-y-4">
            <div className="flex items-center justify-between text-xs pb-2 border-b border-border">
              <span className="font-bold text-primary uppercase tracking-wider">
                LANJUTKAN BELAJAR
              </span>
              <span className="text-muted-foreground">
                Tahap {activeResumeLesson?.stageOrder} dari 20
              </span>
            </div>

            <div className="space-y-1">
              <h2 className="text-lg sm:text-xl font-bold text-foreground">
                {language === "en" && activeResumeLesson?.titleEn
                  ? activeResumeLesson.titleEn
                  : activeResumeLesson?.title}
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {language === "en" && activeResumeLesson?.descriptionEn
                  ? activeResumeLesson.descriptionEn
                  : activeResumeLesson?.description}
              </p>
            </div>

            <div className="pt-2 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Badge variant="secondary" className="text-[10px]">
                  <Clock className="h-3 w-3 mr-1" />
                  {activeResumeLesson?.estimatedMinutes} Menit
                </Badge>
                <Badge variant="outline" className="text-[10px] uppercase">
                  {activeResumeLesson?.level}
                </Badge>
              </div>

              <Link href={`/lessons/${activeResumeLesson?.slug || "pengenalan-web-dan-sejarah-singkat"}`}>
                <Button size="sm" className="text-xs font-bold rounded-md px-5 gap-1.5">
                  <span>Buka Materi</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>
          </div>

          {/* =========================================================================
              2. PROGRESS SUMMARY METRICS
             ========================================================================= */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-xl border border-border bg-card space-y-2">
              <span className="text-xs text-muted-foreground font-medium block">
                Kemajuan Kurikulum
              </span>
              <div className="text-2xl font-extrabold text-foreground">
                {progressPercent}%
              </div>
              <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <p className="text-[11px] text-muted-foreground">
                {completedCount} dari {totalLessons} materi terselesaikan
              </p>
            </div>

            <div className="p-5 rounded-xl border border-border bg-card space-y-2">
              <span className="text-xs text-muted-foreground font-medium block">
                Materi Tersimpan
              </span>
              <div className="text-2xl font-extrabold text-foreground">
                {bookmarkedLessons.length}
              </div>
              <p className="text-[11px] text-muted-foreground">
                Materi yang Anda tandai untuk dipelajari kembali
              </p>
            </div>

            <div className="p-5 rounded-xl border border-border bg-card space-y-2">
              <span className="text-xs text-muted-foreground font-medium block">
                Sertifikat Kelulusan
              </span>
              <div className="text-2xl font-extrabold text-foreground">
                {progressPercent >= 100 ? "Tersedia" : "Terkunci"}
              </div>
              <p className="text-[11px] text-muted-foreground">
                {progressPercent >= 100
                  ? "Klaim sertifikat Anda di menu Sertifikat"
                  : "Selesaikan 100% materi untuk menerbitkan"}
              </p>
            </div>
          </div>

          {/* =========================================================================
              3. BOOKMARKED & COMPLETED LESSONS
             ========================================================================= */}
          {bookmarkedItems.length > 0 && (
            <div className="p-6 rounded-2xl border border-border bg-card space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                <Bookmark className="h-4 w-4 text-primary" />
                <span>Materi Tersimpan ({bookmarkedItems.length})</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {bookmarkedItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-lg border border-border bg-secondary/50 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-0.5 max-w-[240px]">
                      <h4 className="font-semibold text-foreground truncate">
                        {item.title}
                      </h4>
                      <span className="text-[10px] text-muted-foreground">
                        Tahap {item.stageOrder}: {item.stageTitle}
                      </span>
                    </div>

                    <Link href={`/lessons/${item.slug}`}>
                      <Button size="sm" variant="ghost" className="h-7 text-xs font-semibold px-2.5 text-primary hover:underline">
                        Buka
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
