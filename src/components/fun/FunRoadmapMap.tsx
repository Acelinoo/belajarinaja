"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChapterIntroductionModal } from "@/components/fun/ChapterIntroductionModal";
import { RoadmapExplorerCharacter } from "@/components/fun/characters/RoadmapExplorerCharacter";
import { BotCompanionCharacter } from "@/components/fun/characters/BotCompanionCharacter";
import { useThemeLanguageStore } from "@/store/useThemeLanguageStore";
import { useCurriculumProgressStore } from "@/store/useCurriculumProgressStore";
import { getTranslations } from "@/lib/translations";
import { CURRICULUM_STAGES } from "@/data/curriculum";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Map,
  Star,
  CheckCircle2,
  Lock,
  Compass,
  ArrowRight,
  Sparkles,
  Search,
} from "lucide-react";
import type { Stage } from "@/types/curriculum";

interface FunRoadmapMapProps {
  search: string;
  setSearch: (s: string) => void;
  selectedCategory: string;
  setSelectedCategory: (c: string) => void;
  categories: string[];
}

export function FunRoadmapMap({
  search,
  setSearch,
  selectedCategory,
  setSelectedCategory,
  categories,
}: FunRoadmapMapProps) {
  const { language } = useThemeLanguageStore();
  const t = getTranslations(language);
  const { completedLessons, isLessonUnlocked } = useCurriculumProgressStore();

  const [introModalStage, setIntroModalStage] = useState<Stage | null>(null);

  const completedCount = Object.values(completedLessons).filter(
    (item) => item.completed
  ).length;

  const totalLessons = CURRICULUM_STAGES.reduce(
    (acc, stage) => acc + stage.lessons.length,
    0
  );

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

  return (
    <div className="space-y-10">
      {/* Chapter Introduction Modal */}
      <ChapterIntroductionModal
        stage={introModalStage}
        isOpen={!!introModalStage}
        onClose={() => setIntroModalStage(null)}
        completedLessonsCount={completedCount}
      />

      {/* Fun Hero Adventure Banner */}
      <div className="p-8 rounded-[36px] border-4 border-[#FED7AA] bg-white shadow-[0_20px_50px_rgba(255,155,84,0.12)] flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <RoadmapExplorerCharacter
            className="w-32 h-32 shrink-0"
            speechBubbleText={language === "en" ? "Let's explore the 20 stages!" : "Ayo taklukkan 20 bab koding!"}
          />

          <div className="space-y-2 text-center sm:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FFF8E7] border border-[#FED7AA] text-xs font-black text-[#D97706]">
              <Sparkles className="h-3.5 w-3.5" />
              <span>{language === "en" ? "MAP OF THE WEB ODYSSEY" : "PETA DUNIA PETUALANGAN WEB"}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-[#243447] tracking-tight">
              {t.roadmap.title}
            </h1>
            <p className="text-xs sm:text-sm font-medium text-[#64748B] max-w-xl leading-relaxed">
              {t.roadmap.subtitle}
            </p>
          </div>
        </div>

        {/* Level & XP Box */}
        <div className="p-4 rounded-3xl bg-[#FFF8E7] border-2 border-[#FED7AA] text-center space-y-1.5 shrink-0 min-w-[180px]">
          <span className="text-[10px] font-black text-[#D97706] uppercase tracking-wider block">
            {t.dashboard.funPlayerLevel} {Math.floor(completedCount / 3) + 1}
          </span>
          <div className="text-2xl font-black text-[#243447]">
            {completedCount} / {totalLessons} {t.roadmap.lessonsCount}
          </div>
          <div className="flex items-center justify-center gap-1 text-xs font-black text-[#16A34A]">
            <Star className="h-3.5 w-3.5 fill-[#FFD84D] text-[#FFD84D]" />
            <span>+{completedCount * 30} XP Earned</span>
          </div>
        </div>
      </div>

      {/* Search & Category Filter Pills */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-black transition-all ${
                selectedCategory === cat
                  ? "bg-[#FFD84D] text-[#243447] shadow-[0_4px_12px_rgba(255,216,77,0.4)] scale-105"
                  : "bg-white text-[#64748B] border border-[#FED7AA] hover:bg-[#FFF8E7] hover:text-[#243447]"
              }`}
            >
              {cat === "ALL" ? t.common.all : cat}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#FF9F43]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t.glossary.searchPlaceholder}
            className="w-full pl-10 pr-4 py-2 text-xs font-bold rounded-full border-2 border-[#FED7AA] bg-white text-[#243447] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#5CC8FF] shadow-sm"
          />
        </div>
      </div>

      {/* Adventure Journey Trail: Winding Milestones */}
      <div className="relative space-y-8 py-4">
        {/* Floating Clouds Background Elements */}
        <div className="absolute top-10 left-4 text-4xl opacity-40 select-none pointer-events-none">☁️</div>
        <div className="absolute top-64 right-6 text-4xl opacity-40 select-none pointer-events-none">☁️</div>
        <div className="absolute top-[600px] left-8 text-4xl opacity-40 select-none pointer-events-none">☁️</div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
          {filteredStages.map((stage, index) => {
            const stageTitle = language === "en" && stage.titleEn ? stage.titleEn : stage.titleId;
            const stageDesc = language === "en" && stage.descriptionEn ? stage.descriptionEn : stage.description;
            const stageLessonsDone = stage.lessons.filter((l) => completedLessons[l.id]?.completed).length;
            const isStageDone = stageLessonsDone === stage.lessons.length && stage.lessons.length > 0;
            const isFirstUnlocked = stage.lessons.length > 0 && isLessonUnlocked(stage.lessons[0].id);

            return (
              <div
                key={stage.id}
                className={`p-6 sm:p-7 rounded-[32px] border-4 transition-all relative flex flex-col justify-between space-y-4 ${
                  isStageDone
                    ? "bg-white border-[#86EFAC] shadow-[0_12px_35px_rgba(134,239,172,0.25)]"
                    : isFirstUnlocked
                    ? "bg-white border-[#FED7AA] shadow-[0_15px_40px_rgba(255,155,84,0.12)] hover:-translate-y-1 hover:border-[#5CC8FF]"
                    : "bg-[#F8FAFC] border-[#E2E8F0] opacity-70"
                }`}
              >
                {/* Island Header & Badge */}
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-[#FFF8E7] text-[#D97706] border border-[#FED7AA] font-black text-[10px] rounded-full">
                        {t.common.stage} {String(stage.orderIndex).padStart(2, "0")}
                      </Badge>
                      <span className="text-[10px] font-bold text-[#64748B] uppercase">
                        {stage.category}
                      </span>
                    </div>

                    <h3 className="text-lg sm:text-xl font-black text-[#243447] tracking-tight">
                      {stageTitle}
                    </h3>
                  </div>

                  {/* Stage Completion Mascot Indicator */}
                  <div className="shrink-0">
                    {isStageDone ? (
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#DCFCE7] border-2 border-[#86EFAC] text-xl text-[#16A34A] shadow-sm">
                        ⭐
                      </div>
                    ) : isFirstUnlocked ? (
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFF8E7] border-2 border-[#FED7AA] text-xl shadow-sm animate-pulse">
                        🧭
                      </div>
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F1F5F9] border-2 border-[#CBD5E1] text-lg text-[#94A3B8]">
                        <Lock className="h-5 w-5" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Narrative Summary */}
                <p className="text-xs font-medium text-[#64748B] leading-relaxed line-clamp-2">
                  {stageDesc}
                </p>

                {/* Lessons Mini Route List inside Stage */}
                <div className="space-y-2 pt-2 border-t border-[#FED7AA]/50">
                  <div className="flex items-center justify-between text-[11px] font-black text-[#243447]">
                    <span>{stage.lessons.length} {t.roadmap.lessonsCount}</span>
                    <span className="text-[#D97706]">{stageLessonsDone}/{stage.lessons.length} {t.common.completed}</span>
                  </div>

                  <div className="grid grid-cols-1 gap-1.5">
                    {stage.lessons.map((lesson) => {
                      const lTitle = language === "en" && lesson.titleEn ? lesson.titleEn : lesson.title;
                      const done = !!completedLessons[lesson.id]?.completed;
                      const unlocked = isLessonUnlocked(lesson.id);

                      return (
                        <Link
                          key={lesson.id}
                          href={`/lessons/${lesson.slug}`}
                          className={`p-2 rounded-xl text-xs font-bold flex items-center justify-between transition-colors ${
                            done
                              ? "bg-[#F0FDF4] text-[#15803D] hover:bg-[#DCFCE7]"
                              : unlocked
                              ? "bg-[#FFF8E7] text-[#243447] hover:bg-[#FFF0D4]"
                              : "bg-[#F1F5F9] text-[#94A3B8] pointer-events-none"
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            {done ? (
                              <CheckCircle2 className="h-3.5 w-3.5 text-[#16A34A] shrink-0" />
                            ) : unlocked ? (
                              <span className="h-2 w-2 rounded-full bg-[#5CC8FF] shrink-0" />
                            ) : (
                              <Lock className="h-3 w-3 text-[#94A3B8] shrink-0" />
                            )}
                            <span className="truncate">{lTitle}</span>
                          </div>
                          <span className="text-[10px] text-[#64748B] shrink-0 ml-2">
                            {lesson.estimatedMinutes} {t.common.minutes}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </div>

                {/* Chapter Introduction CTA */}
                <div className="pt-2">
                  <Button
                    onClick={() => setIntroModalStage(stage)}
                    className="w-full rounded-full bg-[#FFD84D] hover:bg-[#FFC933] text-[#243447] font-black text-xs h-9 shadow-[0_3px_10px_rgba(255,216,77,0.35)] gap-1.5"
                  >
                    <span>{language === "en" ? "EXPLORE CHAPTER BRIEF" : "BUKA PANDUAN BAB"}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
