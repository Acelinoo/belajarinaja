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
  AlertTriangle,
  Info,
  Map,
  Sparkles,
  Star,
  Trophy,
  Flame,
  Award,
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
import { useThemeLanguageStore } from "@/store/useThemeLanguageStore";
import { getTranslations } from "@/lib/translations";
import { RocketAdventureIllustration } from "@/components/fun/illustrations/RocketAdventureIllustration";
import { GoldenTrophyIllustration } from "@/components/fun/illustrations/GoldenTrophyIllustration";

export default function RoadmapPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [lockedModalData, setLockedModalData] = useState<{
    lesson: LessonItem;
    unmetPrereqs: string[];
  } | null>(null);

  const { completedLessons } = useGuestProgressStore();
  const { theme, language } = useThemeLanguageStore();
  const t = getTranslations(language);

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
  const totalXP = completedCount * 30;

  // Helper to check if a lesson is unlocked
  const isLessonUnlocked = (lesson: LessonItem, stageIndex: number) => {
    if (stageIndex === 0 && lesson.prerequisites.length === 0) return true;
    if (lesson.prerequisites.length === 0) return true;

    return lesson.prerequisites.every((prereqSlug) => {
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
          names.push(language === "en" && found.titleEn ? found.titleEn : found.title);
        }
      }
    });
    return names;
  };

  const filteredStages = CURRICULUM_STAGES.filter((stage) => {
    const stageTitle = (language === "en" && stage.titleEn ? stage.titleEn : stage.titleId) || "";
    const stageDesc = (language === "en" && stage.descriptionEn ? stage.descriptionEn : stage.description) || "";
    const matchesCategory =
      selectedCategory === "ALL" || stage.category === selectedCategory;
    const matchesSearch =
      stageTitle.toLowerCase().includes(search.toLowerCase()) ||
      stageDesc.toLowerCase().includes(search.toLowerCase()) ||
      stage.lessons.some((l) => {
        const lessonTitle = (language === "en" && l.titleEn ? l.titleEn : l.title) || "";
        return lessonTitle.toLowerCase().includes(search.toLowerCase());
      });
    return matchesCategory && matchesSearch;
  });

  // FUN MODE: Playful Winding Adventure Journey Trail
  if (theme === "fun") {
    return (
      <div className="min-h-screen bg-[#FFF8E7] text-[#243447] flex flex-col">
        <Navbar />
        <SearchCommandModal />

        <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl space-y-8">
            {/* Fun Journey Header */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-8 rounded-3xl border-2 border-[#FED7AA] bg-white shadow-[0_15px_40px_rgba(255,155,84,0.1)]">
              <div className="flex items-center gap-5">
                <RocketAdventureIllustration className="w-20 h-20 shrink-0" />
                <div className="space-y-1 text-center sm:text-left">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF8E7] border border-[#FED7AA] text-xs font-black text-[#D97706]">
                    <Map className="h-3.5 w-3.5" />
                    <span>{t.roadmap.funBadge}</span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-black text-[#243447]">
                    {t.roadmap.funTitle}
                  </h1>
                  <p className="text-xs sm:text-sm font-medium text-[#64748B] max-w-xl">
                    {t.roadmap.funDescription}
                  </p>
                </div>
              </div>

              {/* Gamified XP Progress Card */}
              <div className="w-full md:w-64 p-5 rounded-2xl bg-[#FFF8E7] border border-[#FED7AA] text-center space-y-2 shrink-0">
                <div className="flex items-center justify-between text-xs font-black text-[#243447]">
                  <span>⭐ {totalXP} XP</span>
                  <span>{progressPercentage}% {t.common.completed}</span>
                </div>
                <div className="w-full bg-white h-3 rounded-full overflow-hidden border border-[#FED7AA]">
                  <div
                    className="bg-[#FFD84D] h-full rounded-full transition-all"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
                <div className="text-[11px] font-bold text-[#64748B]">
                  {completedCount} / {totalLessons} {t.roadmap.lessonsCount}
                </div>
              </div>
            </div>

            {/* Filter Chips */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#5CC8FF]" />
                <Input
                  placeholder={t.glossary.searchPlaceholder}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 text-xs bg-white rounded-full border-[#E2E8F0] text-[#243447]"
                />
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {["ALL", "Fundamentals", "Frontend", "Backend", "Fullstack & DevOps", "Portfolio"].map((cat) => (
                  <Button
                    key={cat}
                    size="sm"
                    onClick={() => setSelectedCategory(cat)}
                    className={`text-xs font-black rounded-full h-8 px-4 transition-all ${
                      selectedCategory === cat
                        ? "bg-[#5CC8FF] text-[#243447] shadow-[0_2px_8px_rgba(92,200,255,0.4)]"
                        : "bg-white text-[#64748B] border border-[#E2E8F0] hover:bg-[#FFF8E7]"
                    }`}
                  >
                    {cat === "ALL" ? t.common.all : cat}
                  </Button>
                ))}
              </div>
            </div>

            {/* Winding Adventure Journey Path */}
            <div className="space-y-8 relative">
              {filteredStages.map((stage, sIdx) => {
                const stageLessonsDone = stage.lessons.filter(
                  (l) => completedLessons[l.id]?.completed
                ).length;
                const isStageComplete =
                  stageLessonsDone === stage.lessons.length &&
                  stage.lessons.length > 0;

                const stageTitle = language === "en" ? stage.titleEn : stage.titleId;
                const stageDesc = language === "en" ? stage.descriptionEn : stage.description;

                return (
                  <div
                    key={stage.id}
                    className="p-6 rounded-3xl border-2 border-[#E2E8F0] bg-white shadow-[0_8px_30px_rgba(0,0,0,0.03)] space-y-5"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E2E8F0]">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#FFD84D] font-black text-sm text-[#243447] shadow-[0_2px_8px_rgba(255,216,77,0.4)]">
                          {stage.orderIndex}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h2 className="text-base font-black text-[#243447]">
                              {stageTitle}
                            </h2>
                            <Badge className="bg-[#FFF8E7] text-[#D97706] border border-[#FED7AA] text-[10px] font-black rounded-full">
                              {stage.category}
                            </Badge>
                          </div>
                          <p className="text-xs text-[#64748B] font-medium mt-0.5">
                            {stage.lessons.length} {t.roadmap.lessonsCount} • {stageLessonsDone}/{stage.lessons.length} {t.common.completed}
                          </p>
                        </div>
                      </div>

                      <div>
                        {isStageComplete ? (
                          <Badge className="bg-[#DCFCE7] text-[#166534] text-xs font-black rounded-full px-3 py-1">
                            🏆 {t.common.completed}
                          </Badge>
                        ) : (
                          <Badge className="bg-[#EBF8FF] text-[#0284C7] text-xs font-black rounded-full px-3 py-1">
                            ⭐ {stage.lessons.length * 30} XP
                          </Badge>
                        )}
                      </div>
                    </div>

                    <p className="text-xs text-[#64748B] font-medium leading-relaxed">
                      {stageDesc}
                    </p>

                    {/* Fun Lesson Quest Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                      {stage.lessons.map((lesson) => {
                        const isDone = completedLessons[lesson.id]?.completed;
                        const isUnlocked = isLessonUnlocked(lesson, sIdx);
                        const unmetPrereqs = getUnmetPrereqNames(lesson);
                        const lessonTitle = language === "en" && lesson.titleEn ? lesson.titleEn : lesson.title;

                        return isUnlocked ? (
                          <Link
                            key={lesson.id}
                            href={`/lessons/${lesson.slug}`}
                            className={`flex flex-col justify-between p-4 rounded-2xl border-2 transition-all group ${
                              isDone
                                ? "border-[#86EFAC] bg-[#F0FDF4] hover:shadow-[0_4px_15px_rgba(34,197,94,0.15)]"
                                : "border-[#E2E8F0] bg-white hover:border-[#5CC8FF] hover:bg-[#EBF8FF]"
                            }`}
                          >
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-[11px] font-black text-[#64748B]">
                                  {lesson.estimatedMinutes} {t.common.minutes}
                                </span>
                                <span className="text-xs">{isDone ? "⭐⭐⭐" : "⭐"}</span>
                              </div>
                              <div className="flex items-start gap-2">
                                {isDone ? (
                                  <CheckCircle2 className="h-4 w-4 text-[#16A34A] shrink-0 mt-0.5" />
                                ) : (
                                  <BookOpen className="h-4 w-4 text-[#5CC8FF] shrink-0 mt-0.5" />
                                )}
                                <h3 className="text-xs font-black text-[#243447] leading-snug">
                                  {lessonTitle}
                                </h3>
                              </div>
                            </div>

                            <div className="mt-3 pt-2 border-t border-[#E2E8F0] flex items-center justify-between text-[11px] font-black text-[#0284C7]">
                              <span>{isDone ? t.common.completed : t.common.start}</span>
                              <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                            </div>
                          </Link>
                        ) : (
                          <button
                            key={lesson.id}
                            type="button"
                            onClick={() => setLockedModalData({ lesson, unmetPrereqs })}
                            className="flex flex-col justify-between p-4 rounded-2xl border-2 border-[#F1F5F9] bg-[#F8FAFC] text-left opacity-70 hover:opacity-100 transition-opacity"
                          >
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-[11px] font-bold text-[#94A3B8]">
                                  {lesson.estimatedMinutes} {t.common.minutes}
                                </span>
                                <Badge className="bg-[#FEF3C7] text-[#D97706] text-[10px] font-black rounded-full">
                                  {t.common.locked}
                                </Badge>
                              </div>
                              <div className="flex items-start gap-2">
                                <Lock className="h-4 w-4 text-[#F59E0B] shrink-0 mt-0.5" />
                                <h3 className="text-xs font-bold text-[#64748B]">
                                  {lessonTitle}
                                </h3>
                              </div>
                            </div>
                            <div className="mt-3 pt-2 border-t border-[#E2E8F0] text-[11px] font-bold text-[#D97706]">
                              {t.roadmap.prereqRequired}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </main>

        {/* Locked Modal */}
        <Dialog open={!!lockedModalData} onOpenChange={(open) => !open && setLockedModalData(null)}>
          <DialogContent className="max-w-md bg-white border-2 border-[#FED7AA] rounded-3xl p-6 shadow-[0_20px_50px_rgba(255,155,84,0.15)]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-base font-black text-[#D97706]">
                <Lock className="h-5 w-5" />
                <span>{t.roadmap.prereqRequired}</span>
              </DialogTitle>
              <DialogDescription className="text-xs font-medium text-[#64748B] pt-1">
                {t.roadmap.prereqDesc}
              </DialogDescription>
            </DialogHeader>

            {lockedModalData && (
              <div className="space-y-4 py-2">
                <div className="p-4 rounded-2xl bg-[#FFF8E7] border border-[#FED7AA] space-y-1">
                  <div className="text-xs font-black text-[#243447]">
                    {language === "en" && lockedModalData.lesson.titleEn ? lockedModalData.lesson.titleEn : lockedModalData.lesson.title}
                  </div>
                  <div className="text-[11px] text-[#64748B]">
                    {language === "en" && lockedModalData.lesson.descriptionEn ? lockedModalData.lesson.descriptionEn : lockedModalData.lesson.description}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className="text-xs font-black text-[#243447]">
                    {t.roadmap.prereqRequired}:
                  </span>
                  <ul className="space-y-1 text-xs text-[#64748B] font-bold">
                    {lockedModalData.unmetPrereqs.map((prereqName, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-[#D97706]">
                        <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
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
                    className="text-xs font-black rounded-full"
                  >
                    {t.roadmap.closeDialog}
                  </Button>

                  <Link href={`/lessons/${lockedModalData.lesson.slug}`} onClick={() => setLockedModalData(null)}>
                    <Button size="sm" className="text-xs font-black rounded-full bg-[#FFD84D] hover:bg-[#FFC933] text-[#243447]">
                      <Unlock className="h-3.5 w-3.5 mr-1" />
                      {t.common.explore}
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

  // STANDARD LIGHT & DARK ROADMAP PAGE
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />
      <SearchCommandModal />

      {/* Main Roadmap Container */}
      <main className="flex-1 py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header Banner */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 pb-8 border-b-2 border-black dark:border-b dark:border-[#1C242D]">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono font-black text-[#121212] bg-[#FFD84D] px-2.5 py-1 rounded border border-black shadow-[2px_2px_0px_#121212] uppercase tracking-wider mb-3 w-fit dark:border dark:border-cyan-500/30 dark:bg-cyan-500/10 dark:text-cyan-300 dark:shadow-none">
                <Compass className="h-3.5 w-3.5 text-[#121212] dark:text-cyan-400" />
                <span>{theme === "dark" ? "TELEMETRY SEQUENCE • 20 STAGES" : `${t.roadmap.badge} • 20 ${t.common.stage}`}</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
                {t.roadmap.title}
              </h1>
              <p className="text-[#555555] dark:text-[#94A3B8] text-sm mt-1 max-w-2xl font-medium dark:font-normal">
                {t.roadmap.description}
              </p>
            </div>

            {/* Overall Progress Widget */}
            <div className="w-full md:w-72 p-4 rounded-xl border-2 border-black bg-white shadow-[4px_4px_0px_#121212] dark:border dark:border-[#1C242D] dark:bg-[#090D12] dark:shadow-none">
              <div className="flex items-center justify-between text-xs mb-1.5 font-bold dark:font-mono">
                <span className="text-foreground dark:text-[#94A3B8]">
                  {t.dashboard.kpiProgress}
                </span>
                <span className="font-mono font-black text-foreground dark:text-cyan-300">
                  {completedCount} / {totalLessons} ({progressPercentage}%)
                </span>
              </div>
              <Progress value={progressPercentage} className="h-3" />
            </div>
          </div>

          {/* Filter & Search Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#121212] dark:text-cyan-400" />
              <Input
                placeholder={t.glossary.searchPlaceholder}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 text-xs bg-white dark:bg-[#090D12] dark:border-[#1C242D] dark:text-[#F1F5F9]"
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
                  className={`text-xs font-bold whitespace-nowrap h-8 shadow-[2px_2px_0px_#121212] ${
                    selectedCategory === cat
                      ? "dark:border dark:border-cyan-500/40 dark:bg-cyan-500/15 dark:text-cyan-300 dark:shadow-[0_0_8px_rgba(34,211,238,0.2)]"
                      : "dark:border dark:border-[#1C242D] dark:bg-[#0F141A] dark:text-[#94A3B8] dark:hover:text-cyan-300 dark:shadow-none"
                  }`}
                >
                  {cat === "ALL" ? t.common.all : cat}
                </Button>
              ))}
            </div>
          </div>

          {/* Stages Roadmap Tree */}
          <div className="relative space-y-6">
            {/* Visual connector vertical spine on desktop */}
            <div className="hidden lg:block absolute left-8 top-8 bottom-8 w-1 bg-black dark:bg-[#1C242D] -z-0" />

            {filteredStages.map((stage, sIdx) => {
              const stageLessonsDone = stage.lessons.filter(
                (l) => completedLessons[l.id]?.completed
              ).length;
              const isStageComplete =
                stageLessonsDone === stage.lessons.length &&
                stage.lessons.length > 0;

              const stageTitle = language === "en" ? stage.titleEn : stage.titleId;
              const stageDesc = language === "en" ? stage.descriptionEn : stage.description;

              return (
                <SpotlightCard
                  key={stage.id}
                  className="relative z-10 border-2 border-black bg-white p-6 rounded-xl shadow-[5px_5px_0px_#121212] transition-all dark:border dark:border-[#1C242D] dark:bg-[#090D12] dark:shadow-none"
                >
                  {/* Stage Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b-2 border-black dark:border-b dark:border-[#1C242D]">
                    <div className="flex items-center gap-3.5">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-lg font-mono text-xs font-black border-2 border-black shadow-[2px_2px_0px_#121212] ${
                          isStageComplete
                            ? "bg-[#7BE495] text-[#121212] dark:border dark:border-emerald-500/40 dark:bg-emerald-500/10 dark:text-emerald-400 dark:shadow-none"
                            : "bg-[#FFD84D] text-[#121212] dark:border dark:border-cyan-500/30 dark:bg-cyan-500/10 dark:text-cyan-300 dark:shadow-none"
                        }`}
                      >
                        {String(stage.orderIndex).padStart(2, "0")}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="text-base sm:text-lg font-black tracking-tight text-foreground">
                            {stageTitle}
                          </h2>
                          <Badge variant="outline" className="text-[10px] dark:border-[#1C242D] dark:bg-[#0F141A] dark:text-[#94A3B8]">
                            {stage.category}
                          </Badge>
                        </div>
                        <span className="text-xs font-medium text-[#555555] dark:font-normal dark:text-[#8292A6]">
                          {stage.lessons.length} {t.roadmap.lessonsCount} • {stageLessonsDone}/{stage.lessons.length} {t.common.completed}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {isStageComplete ? (
                        <Badge variant="success" className="gap-1 text-xs">
                          <CheckCircle2 className="h-3 w-3" />
                          {t.common.completed}
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-xs font-mono dark:border-[#1C242D] dark:bg-[#0F141A] dark:text-cyan-300">
                          {stageLessonsDone > 0 ? t.common.inProgress : t.common.start}
                        </Badge>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-[#555555] dark:text-[#8292A6] mt-3 leading-relaxed font-medium dark:font-normal">
                    {stageDesc}
                  </p>

                  {/* Lessons Grid in this Stage */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 mt-5">
                    {stage.lessons.map((lesson) => {
                      const isDone = completedLessons[lesson.id]?.completed;
                      const isUnlocked = isLessonUnlocked(lesson, sIdx);
                      const unmetPrereqs = getUnmetPrereqNames(lesson);
                      const lessonTitle = language === "en" && lesson.titleEn ? lesson.titleEn : lesson.title;

                      return isUnlocked ? (
                        <Link
                          key={lesson.id}
                          href={`/lessons/${lesson.slug}`}
                          className="flex flex-col justify-between p-4 rounded-lg border-2 border-black bg-white hover:bg-[#FFD84D]/25 shadow-[3px_3px_0px_#121212] hover:shadow-[4px_4px_0px_#121212] hover:-translate-y-0.5 transition-all group dark:border dark:border-[#1C242D] dark:bg-[#05070A] dark:hover:border-cyan-500/40 dark:hover:bg-[#0F141A] dark:shadow-none dark:hover:translate-y-0"
                        >
                          <div>
                            <div className="flex items-center justify-between gap-2 mb-1.5">
                              <span className="text-[11px] font-mono font-bold text-[#555555] dark:font-normal dark:text-[#8292A6]">
                                {lesson.estimatedMinutes} {t.common.minutes}
                              </span>
                              <Badge variant="outline" className="text-[10px] dark:border-[#1C242D] dark:bg-[#090D12] dark:text-cyan-300">
                                {lesson.level}
                              </Badge>
                            </div>

                            <div className="flex items-start gap-2">
                              {isDone ? (
                                <CheckCircle2 className="h-4 w-4 text-emerald-800 dark:text-emerald-400 shrink-0 mt-0.5" />
                              ) : (
                                <BookOpen className="h-4 w-4 text-[#121212] dark:text-cyan-400 group-hover:text-black dark:group-hover:text-cyan-300 shrink-0 mt-0.5 transition-colors" />
                              )}
                              <h3 className="text-xs font-black text-foreground group-hover:text-black dark:group-hover:text-cyan-300 transition-colors leading-snug">
                                {lessonTitle}
                              </h3>
                            </div>
                          </div>

                          <div className="mt-3 pt-2 border-t-2 border-black dark:border-t dark:border-[#1C242D] flex items-center justify-between text-[11px] font-black text-black underline decoration-[#FFD84D] decoration-2 hover:text-primary dark:text-cyan-400 dark:no-underline dark:font-semibold">
                            <span>{isDone ? t.common.completed : t.common.start}</span>
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
                          className="flex flex-col justify-between p-4 rounded-lg border-2 border-neutral-400 bg-neutral-100 text-left shadow-[2px_2px_0px_#888888] hover:border-black hover:bg-neutral-200 hover:shadow-[3px_3px_0px_#121212] transition-all dark:border dark:border-[#1C242D]/40 dark:bg-[#05070A]/50 dark:shadow-none dark:opacity-60 dark:hover:opacity-100 dark:hover:border-amber-500/40"
                        >
                          <div>
                            <div className="flex items-center justify-between gap-2 mb-1.5">
                              <span className="text-[11px] font-mono font-bold text-neutral-600 dark:font-normal dark:text-[#8292A6]">
                                {lesson.estimatedMinutes} {t.common.minutes}
                              </span>
                              <Badge
                                variant="warning"
                                className="text-[10px]"
                              >
                                {t.common.locked}
                              </Badge>
                            </div>

                            <div className="flex items-start gap-2">
                              <Lock className="h-4 w-4 text-amber-800 dark:text-amber-400 shrink-0 mt-0.5" />
                              <h3 className="text-xs font-black text-neutral-800 dark:text-[#CBD5E1]/80 leading-snug">
                                {lessonTitle}
                              </h3>
                            </div>
                          </div>

                          <div className="mt-3 pt-2 border-t-2 border-neutral-300 dark:border-t dark:border-[#1C242D] flex items-center justify-between text-[11px] text-amber-900 dark:text-amber-400/90 font-mono font-bold">
                            <span>{t.roadmap.prereqRequired}</span>
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
        <DialogContent className="max-w-md bg-white border-2 border-black shadow-[8px_8px_0px_#121212] dark:bg-[#090D12] dark:border dark:border-[#1C242D] dark:shadow-[0_25px_60px_rgba(0,0,0,0.9)]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base font-black text-amber-800 dark:text-amber-400">
              <Lock className="h-4 w-4" />
              <span>{t.roadmap.prereqRequired}</span>
            </DialogTitle>
            <DialogDescription className="text-xs font-medium text-[#555555] dark:font-normal dark:text-[#8292A6] pt-1">
              {t.roadmap.prereqDesc}
            </DialogDescription>
          </DialogHeader>

          {lockedModalData && (
            <div className="space-y-4 py-2">
              <div className="p-3 rounded-lg bg-[#F7F4EA] border-2 border-black shadow-[2px_2px_0px_#121212] dark:border dark:border-[#1C242D] dark:bg-[#05070A] dark:shadow-none">
                <div className="text-xs font-black text-foreground mb-1">
                  {language === "en" && lockedModalData.lesson.titleEn ? lockedModalData.lesson.titleEn : lockedModalData.lesson.title}
                </div>
                <div className="text-[11px] text-[#555555] dark:text-[#8292A6] font-medium dark:font-normal">
                  {language === "en" && lockedModalData.lesson.descriptionEn ? lockedModalData.lesson.descriptionEn : lockedModalData.lesson.description}
                </div>
              </div>

              {lockedModalData.lesson.prerequisiteReason && (
                <div className="p-3 rounded-lg bg-[#FF9B54]/20 border-2 border-black shadow-[2px_2px_0px_#121212] text-xs text-[#121212] dark:border dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300 dark:shadow-none">
                  <div className="font-black mb-1 flex items-center gap-1.5 text-amber-900 dark:text-amber-400">
                    <Info className="h-3.5 w-3.5" />
                    <span>{t.lesson.whyItMatters}</span>
                  </div>
                  <p className="text-[11px] leading-relaxed font-medium dark:font-normal text-foreground/90 dark:text-[#CBD5E1]">
                    {lockedModalData.lesson.prerequisiteReason}
                  </p>
                </div>
              )}

              <div className="space-y-1.5">
                <span className="text-xs font-black text-foreground">
                  {t.roadmap.prereqRequired}:
                </span>
                <ul className="space-y-1 text-xs text-[#555555] dark:text-[#8292A6] font-medium dark:font-normal">
                  {lockedModalData.unmetPrereqs.map((prereqName, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <AlertTriangle className="h-3.5 w-3.5 text-amber-800 dark:text-amber-400 shrink-0" />
                      <span className="text-foreground">{prereqName}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-2 flex items-center justify-between gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setLockedModalData(null)}
                  className="text-xs font-bold"
                >
                  {t.roadmap.closeDialog}
                </Button>

                <Link
                  href={`/lessons/${lockedModalData.lesson.slug}`}
                  onClick={() => setLockedModalData(null)}
                >
                  <Button size="sm" variant="secondary" className="text-xs gap-1.5 font-bold">
                    <Unlock className="h-3.5 w-3.5" />
                    {t.common.explore}
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

