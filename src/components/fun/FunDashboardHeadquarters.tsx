"use client";

import React from "react";
import Link from "next/link";
import { BotCompanionCharacter } from "@/components/fun/characters/BotCompanionCharacter";
import { VictoryAchievementCharacter } from "@/components/fun/characters/VictoryAchievementCharacter";
import { HelpGuideCharacter } from "@/components/fun/characters/HelpGuideCharacter";
import { useThemeLanguageStore } from "@/store/useThemeLanguageStore";
import { useCurriculumProgressStore } from "@/store/useCurriculumProgressStore";
import { useAuthStore } from "@/store/useAuthStore";
import { getTranslations } from "@/lib/translations";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Map,
  Star,
  CheckCircle2,
  Bookmark,
  Trophy,
  Compass,
  ArrowRight,
  Trash2,
} from "lucide-react";
import type { Lesson, Stage } from "@/types/curriculum";

interface FunDashboardHeadquartersProps {
  totalLessons: number;
  completedCount: number;
  percentage: number;
  allLessons: Array<Lesson & { stageOrder: number; stageTitle: string; category?: string }>;
  categories: string[];
  resumeLesson: (Lesson & { stageOrder: number; stageTitle: string }) | null;
}

export function FunDashboardHeadquarters({
  totalLessons,
  completedCount,
  percentage,
  allLessons,
  categories,
  resumeLesson,
}: FunDashboardHeadquartersProps) {
  const { language } = useThemeLanguageStore();
  const t = getTranslations(language);
  const { user } = useAuthStore();
  const { bookmarkedLessons, toggleBookmark } = useCurriculumProgressStore();

  const totalXP = completedCount * 30;
  const bookmarkedItems = allLessons.filter((l) => bookmarkedLessons.includes(l.id));

  return (
    <div className="space-y-8">
      {/* Player Adventure Headquarters Hero */}
      <div className="p-8 rounded-[36px] border-4 border-[#FED7AA] bg-white shadow-[0_20px_50px_rgba(255,155,84,0.12)] flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <BotCompanionCharacter
            className="w-28 h-28 shrink-0"
            expression="excited"
            speechBubbleText={language === "en" ? "Welcome to your HQ!" : "Selamat datang di markasmu!"}
          />
          <div className="space-y-2 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <span className="text-xs font-black text-[#D97706] bg-[#FFF8E7] px-3.5 py-1 rounded-full border border-[#FED7AA]">
                {t.dashboard.funPlayerLevel} {Math.floor(completedCount / 3) + 1}
              </span>
              <Badge className="bg-[#EBF8FF] text-[#0284C7] text-[10px] font-black rounded-full border border-[#5CC8FF]/40">
                🔥 3 Days Streak
              </Badge>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-[#243447] tracking-tight">
              {t.dashboard.welcome}, {user?.name || "Explorer"}! 👋
            </h1>
            <p className="text-xs text-[#64748B] font-medium">
              {user?.email || t.dashboard.guestNotice}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/roadmap">
            <Button size="lg" className="rounded-full font-black text-xs px-8 bg-[#FFD84D] hover:bg-[#FFC933] text-[#243447] shadow-[0_4px_16px_rgba(255,216,77,0.4)]">
              <Compass className="h-4 w-4 mr-2" />
              {t.nav.roadmap}
            </Button>
          </Link>
        </div>
      </div>

      {/* Gamified 4 KPI Metric Islands */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* XP Card */}
        <div className="p-6 rounded-[28px] border-2 border-[#FED7AA] bg-white shadow-[0_4px_15px_rgba(0,0,0,0.03)] space-y-2">
          <div className="flex items-center justify-between text-xs font-black text-[#D97706]">
            <span>Total XP</span>
            <Star className="h-4 w-4 fill-[#FFD84D] text-[#FFD84D]" />
          </div>
          <div className="text-3xl font-black text-[#243447]">
            {totalXP} XP
          </div>
          <div className="text-[11px] font-medium text-[#64748B]">
            +{completedCount * 30} XP earned from quizzes
          </div>
        </div>

        {/* Completed Quests */}
        <div className="p-6 rounded-[28px] border-2 border-[#86EFAC] bg-white shadow-[0_4px_15px_rgba(0,0,0,0.03)] space-y-2">
          <div className="flex items-center justify-between text-xs font-black text-[#15803D]">
            <span>{t.dashboard.kpiCompleted}</span>
            <CheckCircle2 className="h-4 w-4 text-[#16A34A]" />
          </div>
          <div className="text-3xl font-black text-[#15803D]">
            {completedCount} / {totalLessons}
          </div>
          <div className="text-[11px] font-medium text-[#64748B]">
            {totalLessons - completedCount} {t.dashboard.kpiRemaining}
          </div>
        </div>

        {/* Bookmarks */}
        <div className="p-6 rounded-[28px] border-2 border-[#5CC8FF]/50 bg-white shadow-[0_4px_15px_rgba(0,0,0,0.03)] space-y-2">
          <div className="flex items-center justify-between text-xs font-black text-[#0284C7]">
            <span>{t.dashboard.kpiBookmarks}</span>
            <Bookmark className="h-4 w-4 text-[#0284C7]" />
          </div>
          <div className="text-3xl font-black text-[#0284C7]">
            {bookmarkedLessons.length}
          </div>
          <div className="text-[11px] font-medium text-[#64748B]">
            {t.dashboard.kpiBookmarkDesc}
          </div>
        </div>

        {/* Certificate */}
        <div className="p-6 rounded-[28px] border-2 border-[#FED7AA] bg-white shadow-[0_4px_15px_rgba(0,0,0,0.03)] space-y-2">
          <div className="flex items-center justify-between text-xs font-black text-[#D97706]">
            <span>{t.dashboard.kpiCert}</span>
            <Trophy className="h-4 w-4 text-[#FF9F43]" />
          </div>
          <div className="text-2xl font-black text-[#243447]">
            {percentage >= 100 ? "Ready to Claim! 🎓" : `${100 - percentage}% Left`}
          </div>
          <div className="text-[11px] font-medium text-[#64748B]">
            {t.dashboard.kpiCertReq}
          </div>
        </div>
      </div>

      {/* Resume Quest Banner */}
      {resumeLesson && (
        <div className="p-7 rounded-[32px] border-2 border-[#FED7AA] bg-white shadow-[0_8px_25px_rgba(255,155,84,0.08)] flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <Badge className="bg-[#FFD84D] text-[#243447] text-[10px] font-black rounded-full px-2.5 py-0.5">
                {t.dashboard.funActiveQuest}
              </Badge>
              <span className="text-xs font-bold text-[#64748B]">
                {t.common.stage} {resumeLesson.stageOrder}: {resumeLesson.stageTitle}
              </span>
            </div>
            <h3 className="text-xl font-black text-[#243447]">
              {language === "en" && resumeLesson.titleEn ? resumeLesson.titleEn : resumeLesson.title}
            </h3>
            <p className="text-xs text-[#64748B] font-medium max-w-xl">
              {language === "en" && resumeLesson.descriptionEn ? resumeLesson.descriptionEn : resumeLesson.description}
            </p>
          </div>

          <Link href={`/lessons/${resumeLesson.slug}`} className="shrink-0">
            <Button className="rounded-full text-xs font-black px-8 bg-[#5CC8FF] hover:bg-[#4D96FF] text-[#243447] shadow-[0_4px_15px_rgba(92,200,255,0.35)]">
              {t.dashboard.funResumeQuest}
            </Button>
          </Link>
        </div>
      )}

      {/* Achievement Trophy Room with 5 Badges */}
      <div className="p-8 rounded-[36px] border-2 border-[#E2E8F0] bg-white space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
          <div className="flex items-center gap-3">
            <VictoryAchievementCharacter className="w-16 h-16 shrink-0" />
            <div>
              <h2 className="text-lg sm:text-xl font-black text-[#243447]">
                🏆 {t.dashboard.funBadgesTitle}
              </h2>
              <p className="text-xs text-[#64748B] font-medium">
                {completedCount >= 20 ? "All 5 badges unlocked!" : `${completedCount}/20 quests completed`}
              </p>
            </div>
          </div>
          <span className="text-xs font-black text-[#D97706] bg-[#FFF8E7] px-4 py-1.5 rounded-full border border-[#FED7AA] w-fit">
            {completedCount > 0 ? `${Math.min(5, Math.floor(completedCount / 4) + 1)}/5 Unlocked` : "0/5 Unlocked"}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {[
            { name: "First Step", icon: "🌱", req: "1 Quest", unlocked: completedCount >= 1 },
            { name: "HTML Apprentice", icon: "🧱", req: "3 Quests", unlocked: completedCount >= 3 },
            { name: "CSS Stylist", icon: "🎨", req: "6 Quests", unlocked: completedCount >= 6 },
            { name: "JS Sorcerer", icon: "⚡", req: "10 Quests", unlocked: completedCount >= 10 },
            { name: "Fullstack Master", icon: "👑", req: "20 Quests", unlocked: completedCount >= 20 },
          ].map((badge, i) => (
            <div
              key={i}
              className={`p-5 rounded-[24px] border-2 text-center space-y-2 transition-all ${
                badge.unlocked
                  ? "border-[#FED7AA] bg-[#FFF8E7] shadow-[0_4px_15px_rgba(255,155,84,0.1)] scale-105"
                  : "border-[#F1F5F9] bg-[#F8FAFC] opacity-40"
              }`}
            >
              <div className="text-3xl">{badge.icon}</div>
              <div className="text-xs font-black text-[#243447]">{badge.name}</div>
              <div className="text-[10px] font-bold text-[#64748B]">{badge.req}</div>
              <div className="text-[10px] font-black text-[#D97706] pt-1">
                {badge.unlocked ? "⭐ Unlocked" : "🔒 Locked"}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bookmarked Lessons Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-black text-[#243447]">
          📌 {t.dashboard.bookmarkedTitle} ({bookmarkedItems.length})
        </h2>

        {bookmarkedItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {bookmarkedItems.map((item) => (
              <div
                key={item.id}
                className="p-6 rounded-[28px] border-2 border-[#FED7AA] bg-white shadow-[0_4px_15px_rgba(0,0,0,0.03)] flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] text-[#64748B] mb-1 font-bold">
                    <span>{t.common.stage} {item.id.split("-")[0]}</span>
                    <span>{item.estimatedMinutes} {t.common.minutes}</span>
                  </div>
                  <h4 className="text-sm font-black text-[#243447]">
                    {language === "en" && item.titleEn ? item.titleEn : item.title}
                  </h4>
                  <p className="text-[11px] text-[#64748B] mt-1 line-clamp-2">
                    {language === "en" && item.descriptionEn ? item.descriptionEn : item.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#FED7AA] flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => toggleBookmark(item.id)}
                    className="text-xs font-bold text-[#FF6B6B] hover:underline flex items-center gap-1"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>{t.common.delete}</span>
                  </button>
                  <Link href={`/lessons/${item.slug}`}>
                    <Button size="sm" className="rounded-full bg-[#5CC8FF] text-[#243447] font-black text-xs h-7 px-4">
                      {t.common.continue}
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 rounded-[32px] border-2 border-[#FED7AA] bg-white text-center space-y-3 shadow-sm">
            <HelpGuideCharacter className="w-24 h-24 mx-auto" />
            <p className="text-xs font-medium text-[#64748B] max-w-sm mx-auto">
              {t.dashboard.emptyBookmarks}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
