"use client";

import React from "react";
import Link from "next/link";
import { useThemeLanguageStore } from "@/store/useThemeLanguageStore";
import { useCurriculumProgressStore } from "@/store/useCurriculumProgressStore";
import { useAuthStore } from "@/store/useAuthStore";
import { getTranslations } from "@/lib/translations";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Map,
  Compass,
  Bookmark,
  CheckCircle2,
  Trophy,
  Trash2,
  ArrowRight,
} from "lucide-react";
import type { Lesson, Stage } from "@/types/curriculum";

interface LightNeoDashboardProps {
  totalLessons: number;
  completedCount: number;
  percentage: number;
  allLessons: Array<Lesson & { stageOrder: number; stageTitle: string; category?: string }>;
  categories: string[];
  resumeLesson: (Lesson & { stageOrder: number; stageTitle: string }) | null;
}

export function LightNeoDashboard({
  totalLessons,
  completedCount,
  percentage,
  allLessons,
  categories,
  resumeLesson,
}: LightNeoDashboardProps) {
  const { language } = useThemeLanguageStore();
  const t = getTranslations(language);
  const { user } = useAuthStore();
  const { bookmarkedLessons, toggleBookmark, completedLessons } = useCurriculumProgressStore();

  const bookmarkedItems = allLessons.filter((l) => bookmarkedLessons.includes(l.id));

  return (
    <div className="space-y-8">
      {/* Student Welcome Banner */}
      <div className="p-8 rounded-2xl border-2 border-black bg-white shadow-[6px_6px_0px_#121212] flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl border-2 border-black bg-[#FFD84D] text-[#121212] font-mono font-black text-xl shadow-[2.5px_2.5px_0px_#121212]">
            {(user?.name || "Pelajar").charAt(0).toUpperCase()}
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono font-black text-[#121212] bg-[#70B7FF] px-2 py-0.5 rounded border border-black shadow-[1.5px_1.5px_0px_#121212] uppercase tracking-wider">
                {t.dashboard.badge}
              </span>
              <Badge variant="outline" className="text-[10px] border-black">
                {percentage >= 100 ? "Fullstack Graduate" : "Active Learner"}
              </Badge>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-[#121212] tracking-tight">
              {t.dashboard.welcome}, {user?.name || "Pelajar Web"}!
            </h1>

            <p className="text-xs font-medium text-[#555555] mt-1">
              {user?.email || t.dashboard.guestNotice}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/roadmap">
            <Button size="sm" className="rounded-lg border-2 border-black bg-[#FFD84D] hover:bg-[#F5CB32] text-[#121212] font-black text-xs h-9 px-4 shadow-[2.5px_2.5px_0px_#121212] gap-2">
              <Compass className="h-4 w-4" />
              <span>{t.nav.roadmap}</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* 4 KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl border-2 border-black bg-white shadow-[4px_4px_0px_#121212] space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-[#555555]">
            <span>{t.dashboard.kpiProgress}</span>
            <Compass className="h-4 w-4 text-[#121212]" />
          </div>
          <div className="text-3xl font-black font-mono text-[#121212]">
            {percentage}%
          </div>
          <Progress value={percentage} className="h-2" />
        </div>

        <div className="p-5 rounded-xl border-2 border-black bg-white shadow-[4px_4px_0px_#121212] space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-[#555555]">
            <span>{t.dashboard.kpiCompleted}</span>
            <CheckCircle2 className="h-4 w-4 text-[#15803D]" />
          </div>
          <div className="text-3xl font-black font-mono text-[#15803D]">
            {completedCount} / {totalLessons}
          </div>
          <span className="text-[11px] font-bold text-[#555555] block">
            {totalLessons - completedCount} {t.dashboard.kpiRemaining}
          </span>
        </div>

        <div className="p-5 rounded-xl border-2 border-black bg-white shadow-[4px_4px_0px_#121212] space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-[#555555]">
            <span>{t.dashboard.kpiBookmarks}</span>
            <Bookmark className="h-4 w-4 text-[#0284C7]" />
          </div>
          <div className="text-3xl font-black font-mono text-[#0284C7]">
            {bookmarkedLessons.length}
          </div>
          <span className="text-[11px] font-bold text-[#555555] block">
            {t.dashboard.kpiBookmarkDesc}
          </span>
        </div>

        <div className="p-5 rounded-xl border-2 border-black bg-white shadow-[4px_4px_0px_#121212] space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-[#555555]">
            <span>{t.dashboard.kpiCert}</span>
            <Trophy className="h-4 w-4 text-[#D97706]" />
          </div>
          <div className="text-base font-black font-mono text-[#D97706] mt-1">
            {percentage >= 100 ? "Siap Diklaim 🎓" : `${100 - percentage}% Tersisa`}
          </div>
          <span className="text-[11px] font-bold text-[#555555] block">
            {t.dashboard.kpiCertReq}
          </span>
        </div>
      </div>

      {/* Resume Card */}
      {resumeLesson && (
        <div className="p-6 rounded-xl border-2 border-black bg-[#FFD84D]/30 shadow-[5px_5px_0px_#121212] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-[10px] bg-white border-2 border-black font-black text-[#121212] shadow-[1.5px_1.5px_0px_#121212]">
                {t.dashboard.resumeTitle}
              </Badge>
              <span className="text-xs font-bold text-[#555555]">
                {t.common.stage} {String(resumeLesson.stageOrder).padStart(2, "0")}: {resumeLesson.stageTitle}
              </span>
            </div>

            <h3 className="text-lg font-black text-[#121212]">
              {language === "en" && resumeLesson.titleEn ? resumeLesson.titleEn : resumeLesson.title}
            </h3>
            <p className="text-xs font-medium text-[#404040] max-w-xl">
              {language === "en" && resumeLesson.descriptionEn ? resumeLesson.descriptionEn : resumeLesson.description}
            </p>
          </div>

          <Link href={`/lessons/${resumeLesson.slug}`}>
            <Button size="sm" className="rounded-lg border-2 border-black bg-[#FFD84D] hover:bg-[#F5CB32] text-[#121212] font-black text-xs shadow-[3px_3px_0px_#121212] gap-2">
              <span>{t.dashboard.resumeButton}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      )}

      {/* Category Progress Breakdown */}
      <div className="space-y-4">
        <h2 className="text-lg font-black tracking-tight text-[#121212]">
          {t.dashboard.categoryProgress}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => {
            const categoryLessons = allLessons.filter((l) => l.category === category);
            const categoryDone = categoryLessons.filter((l) => completedLessons[l.id]?.completed).length;
            const catPercentage = Math.round((categoryDone / (categoryLessons.length || 1)) * 100);

            return (
              <Card key={category} className="p-5 border-2 border-black bg-white shadow-[3px_3px_0px_#121212]">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-black text-[#121212]">{category}</span>
                  <span className="font-mono font-bold text-[#555555]">
                    {categoryDone}/{categoryLessons.length} ({catPercentage}%)
                  </span>
                </div>
                <Progress value={catPercentage} className="h-2" />
              </Card>
            );
          })}
        </div>
      </div>

      {/* Bookmarked Lessons */}
      <div className="space-y-4">
        <h2 className="text-lg font-black tracking-tight text-[#121212]">
          {t.dashboard.bookmarkedTitle} ({bookmarkedItems.length})
        </h2>

        {bookmarkedItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {bookmarkedItems.map((item) => (
              <div
                key={item.id}
                className="flex flex-col justify-between p-4 rounded-lg border-2 border-black bg-white shadow-[3px_3px_0px_#121212] hover:bg-[#FFD84D]/20 transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] text-[#555555] mb-1.5 font-mono font-bold">
                    <span>{t.common.stage} {item.id.split("-")[0]}</span>
                    <span>{item.estimatedMinutes} {t.common.minutes}</span>
                  </div>
                  <h4 className="text-xs font-black text-[#121212]">
                    {language === "en" && item.titleEn ? item.titleEn : item.title}
                  </h4>
                  <p className="text-[11px] text-[#555555] mt-1 line-clamp-2 font-medium">
                    {language === "en" && item.descriptionEn ? item.descriptionEn : item.description}
                  </p>
                </div>

                <div className="mt-4 pt-2.5 border-t-2 border-black flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => toggleBookmark(item.id)}
                    className="text-xs font-bold text-[#555555] hover:text-rose-600 flex items-center gap-1 transition-colors"
                  >
                    <Trash2 className="h-3 w-3" />
                    <span>{t.common.delete}</span>
                  </button>

                  <Link
                    href={`/lessons/${item.slug}`}
                    className="text-xs font-black text-black underline decoration-[#FFD84D] decoration-2 flex items-center gap-1"
                  >
                    <span>{t.common.continue}</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 rounded-xl border-2 border-black bg-white shadow-[4px_4px_0px_#121212] text-center space-y-2">
            <Bookmark className="h-6 w-6 text-[#121212] mx-auto" />
            <p className="text-xs font-medium text-[#555555]">
              {t.dashboard.emptyBookmarks}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
