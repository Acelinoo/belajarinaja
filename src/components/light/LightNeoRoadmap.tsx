"use client";

import React from "react";
import Link from "next/link";
import { useThemeLanguageStore } from "@/store/useThemeLanguageStore";
import { useCurriculumProgressStore } from "@/store/useCurriculumProgressStore";
import { getTranslations } from "@/lib/translations";
import { CURRICULUM_STAGES } from "@/data/curriculum";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Map,
  CheckCircle2,
  Lock,
  ArrowRight,
  Search,
  BookOpen,
  Check,
} from "lucide-react";
import type { Stage, Lesson } from "@/types/curriculum";

interface LightNeoRoadmapProps {
  search: string;
  setSearch: (s: string) => void;
  selectedCategory: string;
  setSelectedCategory: (c: string) => void;
  categories: string[];
}

export function LightNeoRoadmap({
  search,
  setSearch,
  selectedCategory,
  setSelectedCategory,
  categories,
}: LightNeoRoadmapProps) {
  const { language } = useThemeLanguageStore();
  const t = getTranslations(language);
  const { completedLessons, isLessonUnlocked } = useCurriculumProgressStore();

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
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="p-8 rounded-2xl border-2 border-black bg-white shadow-[6px_6px_0px_#121212] flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-black text-[#121212] bg-[#FFD84D] px-2.5 py-1 rounded border border-black shadow-[2px_2px_0px_#121212] uppercase tracking-wider">
              {t.hero.badge}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-[#121212] tracking-tight">
            {t.roadmap.title}
          </h1>

          <p className="text-xs sm:text-sm font-medium text-[#555555] max-w-2xl leading-relaxed">
            {t.roadmap.subtitle}
          </p>
        </div>

        <div className="p-4 rounded-xl border-2 border-black bg-[#F7F4EA] shadow-[3px_3px_0px_#121212] text-center space-y-1 shrink-0">
          <span className="text-[10px] font-black uppercase text-[#555555]">PROGRES BELAJAR</span>
          <div className="text-2xl font-black font-mono text-[#121212]">
            {completedCount} / {totalLessons}
          </div>
          <span className="text-xs font-bold text-[#15803D] block">
            {Math.round((completedCount / (totalLessons || 1)) * 100)}% Terselesaikan
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-black border-2 border-black transition-all ${
                selectedCategory === cat
                  ? "bg-[#FFD84D] text-[#121212] shadow-[2.5px_2.5px_0px_#121212]"
                  : "bg-white text-[#555555] hover:bg-[#F7F4EA] hover:text-[#121212]"
              }`}
            >
              {cat === "ALL" ? t.common.all : cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#121212]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t.glossary.searchPlaceholder}
            className="w-full pl-10 pr-4 py-2 text-xs font-bold rounded-lg border-2 border-black bg-white text-[#121212] placeholder:text-[#888888] focus:outline-none shadow-[2px_2px_0px_#121212]"
          />
        </div>
      </div>

      {/* 20-Stage Neo-Brutalist Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredStages.map((stage) => {
          const stageTitle = language === "en" && stage.titleEn ? stage.titleEn : stage.titleId;
          const stageDesc = language === "en" && stage.descriptionEn ? stage.descriptionEn : stage.description;
          const stageLessonsDone = stage.lessons.filter((l) => completedLessons[l.id]?.completed).length;
          const isStageDone = stageLessonsDone === stage.lessons.length && stage.lessons.length > 0;
          const isFirstUnlocked = stage.lessons.length > 0 && isLessonUnlocked(stage.lessons[0].id);

          return (
            <div
              key={stage.id}
              className={`p-6 rounded-2xl border-2 border-black bg-white shadow-[5px_5px_0px_#121212] flex flex-col justify-between space-y-4 ${
                !isFirstUnlocked ? "opacity-75 bg-neutral-50" : ""
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded border-2 border-black bg-[#FFD84D] font-mono font-black text-xs shadow-[1.5px_1.5px_0px_#121212]">
                      {String(stage.orderIndex).padStart(2, "0")}
                    </span>
                    <span className="text-xs font-bold text-[#555555] uppercase">
                      {stage.category}
                    </span>
                  </div>

                  {isStageDone ? (
                    <span className="text-xs font-black text-[#15803D] bg-[#7BE495]/40 px-2 py-0.5 rounded border border-black shadow-[1px_1px_0px_#121212] flex items-center gap-1">
                      <Check className="h-3 w-3" />
                      LULUS
                    </span>
                  ) : isFirstUnlocked ? (
                    <span className="text-xs font-black text-[#121212] bg-[#70B7FF]/40 px-2 py-0.5 rounded border border-black shadow-[1px_1px_0px_#121212]">
                      TERBUKA
                    </span>
                  ) : (
                    <span className="text-xs font-bold text-[#666666] flex items-center gap-1">
                      <Lock className="h-3 w-3" />
                      TERKUNCI
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-black text-[#121212] tracking-tight">
                  {stageTitle}
                </h3>

                <p className="text-xs font-medium text-[#404040] leading-relaxed line-clamp-2">
                  {stageDesc}
                </p>
              </div>

              {/* Lessons List Inside Stage */}
              <div className="space-y-1.5 pt-3 border-t-2 border-black">
                <div className="flex items-center justify-between text-xs font-bold text-[#555555] mb-1">
                  <span>{stage.lessons.length} {t.roadmap.lessonsCount}</span>
                  <span>{stageLessonsDone}/{stage.lessons.length} {t.common.completed}</span>
                </div>

                {stage.lessons.map((lesson) => {
                  const lTitle = language === "en" && lesson.titleEn ? lesson.titleEn : lesson.title;
                  const isDone = !!completedLessons[lesson.id]?.completed;
                  const unlocked = isLessonUnlocked(lesson.id);

                  return (
                    <Link
                      key={lesson.id}
                      href={`/lessons/${lesson.slug}`}
                      className={`p-2 rounded border-2 border-black text-xs font-bold flex items-center justify-between transition-all ${
                        isDone
                          ? "bg-[#7BE495]/20 hover:bg-[#7BE495]/35"
                          : unlocked
                          ? "bg-[#F7F4EA] hover:bg-[#FFD84D]/30"
                          : "bg-neutral-100 text-[#888888] pointer-events-none opacity-60"
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        {isDone ? (
                          <CheckCircle2 className="h-3.5 w-3.5 text-[#15803D] shrink-0" />
                        ) : unlocked ? (
                          <BookOpen className="h-3.5 w-3.5 text-[#121212] shrink-0" />
                        ) : (
                          <Lock className="h-3.5 w-3.5 text-[#888888] shrink-0" />
                        )}
                        <span className="truncate">{lTitle}</span>
                      </div>

                      <span className="text-[11px] font-mono text-[#555555] shrink-0 ml-2">
                        {lesson.estimatedMinutes}m
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
