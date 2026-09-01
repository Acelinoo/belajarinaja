"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useThemeLanguageStore } from "@/store/useThemeLanguageStore";
import { useCurriculumProgressStore } from "@/store/useCurriculumProgressStore";
import { getTranslations } from "@/lib/translations";
import { CURRICULUM_STAGES } from "@/data/curriculum";
import { Button } from "@/components/ui/button";
import {
  Terminal,
  Map,
  CheckCircle2,
  Lock,
  ArrowRight,
  Search,
  Activity,
  Layers,
  Clock,
  Shield,
} from "lucide-react";
import type { Stage, Lesson } from "@/types/curriculum";

interface DarkCommandRoadmapProps {
  search: string;
  setSearch: (s: string) => void;
  selectedCategory: string;
  setSelectedCategory: (c: string) => void;
  categories: string[];
}

export function DarkCommandRoadmap({
  search,
  setSearch,
  selectedCategory,
  setSelectedCategory,
  categories,
}: DarkCommandRoadmapProps) {
  const { language } = useThemeLanguageStore();
  const t = getTranslations(language);
  const { completedLessons, isLessonUnlocked } = useCurriculumProgressStore();

  const [selectedStageId, setSelectedStageId] = useState<string>(CURRICULUM_STAGES[0]?.id || "stage-01");

  const completedCount = Object.values(completedLessons).filter(
    (item) => item.completed
  ).length;
  const percentage = Math.round((completedCount / 20) * 100);

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

  const activeStage = CURRICULUM_STAGES.find((s) => s.id === selectedStageId) || CURRICULUM_STAGES[0];
  const activeStageTitle = language === "en" && activeStage?.titleEn ? activeStage.titleEn : activeStage?.titleId;
  const activeStageDesc = language === "en" && activeStage?.descriptionEn ? activeStage.descriptionEn : activeStage?.description;

  return (
    <div className="space-y-6 font-mono">
      {/* Top Telemetry Header Bar */}
      <div className="p-6 rounded border border-[#222222] bg-[#0A0A0A] space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#1A1A1A]">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-[#888888]">
              <Terminal className="h-3.5 w-3.5 text-[#FFFFFF]" />
              <span className="font-bold text-[#FFFFFF]">CURRICULUM_MATRIX // STAGES_01_TO_20</span>
              <span>•</span>
              <span>{percentage}% COMPLETE</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-[#FFFFFF] tracking-tight">
              {t.roadmap.title}
            </h1>
          </div>

          <div className="flex items-center gap-2 text-xs text-[#888888]">
            <span className="p-2 rounded bg-[#111111] border border-[#222222]">
              TOTAL_MODULES: <strong className="text-[#FFFFFF]">20</strong>
            </span>
            <span className="p-2 rounded bg-[#111111] border border-[#222222]">
              PASSED: <strong className="text-[#FFFFFF]">{completedCount}</strong>
            </span>
          </div>
        </div>

        {/* Filter & Search Matrix */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded text-xs uppercase tracking-wider border transition-all ${
                  selectedCategory === cat
                    ? "border-[#FFFFFF] bg-[#FFFFFF] text-[#000000] font-black"
                    : "border-[#222222] bg-[#0A0A0A] text-[#888888] hover:text-[#FFFFFF] hover:border-[#333333]"
                }`}
              >
                {cat === "ALL" ? "ALL_TRACKS" : cat}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#666666]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="SEARCH_MODULE..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#050505] border border-[#222222] text-[#FFFFFF] placeholder:text-[#555555] focus:outline-none focus:border-[#FFFFFF] rounded"
            />
          </div>
        </div>
      </div>

      {/* Split-Panel Command Architecture */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Panel: High Density Stage Index List (5 cols) */}
        <div className="lg:col-span-5 rounded border border-[#222222] bg-[#0A0A0A] p-2 space-y-1 max-h-[720px] overflow-y-auto">
          <div className="p-2 text-[10px] text-[#666666] uppercase tracking-wider font-bold border-b border-[#1A1A1A] flex items-center justify-between">
            <span>INDEX // STAGE_ID</span>
            <span>STATUS</span>
          </div>

          {filteredStages.map((stage) => {
            const sTitle = language === "en" && stage.titleEn ? stage.titleEn : stage.titleId;
            const stageLessonsDone = stage.lessons.filter((l) => completedLessons[l.id]?.completed).length;
            const isStageDone = stageLessonsDone === stage.lessons.length && stage.lessons.length > 0;
            const isFirstUnlocked = stage.lessons.length > 0 && isLessonUnlocked(stage.lessons[0].id);
            const isSelected = stage.id === selectedStageId;

            return (
              <button
                key={stage.id}
                type="button"
                onClick={() => setSelectedStageId(stage.id)}
                className={`w-full p-2.5 rounded border text-left text-xs transition-all flex items-center justify-between gap-2 ${
                  isSelected
                    ? "border-[#FFFFFF] bg-[#171717] text-[#FFFFFF]"
                    : "border-transparent text-[#888888] hover:bg-[#111111] hover:text-[#CCCCCC]"
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <span className="text-[10px] font-bold text-[#666666] shrink-0">
                    [{String(stage.orderIndex).padStart(2, "0")}]
                  </span>
                  <span className="truncate font-bold">{sTitle}</span>
                </div>

                <div className="shrink-0 text-[10px] font-mono">
                  {isStageDone ? (
                    <span className="text-[#FFFFFF]">[SYNCED]</span>
                  ) : isFirstUnlocked ? (
                    <span className="text-[#CCCCCC]">[ACTIVE]</span>
                  ) : (
                    <span className="text-[#555555]">[LOCKED]</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Panel: Selected Module Inspector & Execution Telemetry (7 cols) */}
        {activeStage && (
          <div className="lg:col-span-7 rounded border border-[#222222] bg-[#0A0A0A] p-6 space-y-6">
            <div className="space-y-2 pb-4 border-b border-[#1A1A1A]">
              <div className="flex items-center justify-between text-xs text-[#888888]">
                <span>MODULE_INSPECTOR // STAGE_{String(activeStage.orderIndex).padStart(2, "0")}</span>
                <span className="text-[#FFFFFF] uppercase">{activeStage.category}</span>
              </div>

              <h2 className="text-xl font-black text-[#FFFFFF]">
                {activeStageTitle}
              </h2>

              <p className="text-xs text-[#888888] leading-relaxed">
                {activeStageDesc}
              </p>
            </div>

            {/* Stage Modules Sequence */}
            <div className="space-y-3">
              <span className="text-xs text-[#888888] font-bold uppercase tracking-wider block">
                EXECUTION_SEQUENCE ({activeStage.lessons.length} MODULES)
              </span>

              <div className="space-y-2">
                {activeStage.lessons.map((lesson, idx) => {
                  const lTitle = language === "en" && lesson.titleEn ? lesson.titleEn : lesson.title;
                  const isDone = !!completedLessons[lesson.id]?.completed;
                  const isUnlocked = isLessonUnlocked(lesson.id);

                  return (
                    <div
                      key={lesson.id}
                      className={`p-3.5 rounded border flex items-center justify-between gap-3 text-xs transition-colors ${
                        isDone
                          ? "border-[#333333] bg-[#111111] text-[#FFFFFF]"
                          : isUnlocked
                          ? "border-[#222222] bg-[#050505] text-[#CCCCCC]"
                          : "border-[#1A1A1A] bg-[#050505] text-[#555555]"
                      }`}
                    >
                      <div className="flex items-center gap-3 truncate">
                        <span className="text-[10px] text-[#666666]">
                          {String(idx + 1).padStart(2, "0")}.
                        </span>
                        <div className="truncate">
                          <div className="font-bold text-[#FFFFFF] truncate">{lTitle}</div>
                          <div className="text-[10px] text-[#666666]">{lesson.estimatedMinutes} MIN • {lesson.level}</div>
                        </div>
                      </div>

                      <div className="shrink-0">
                        {isDone ? (
                          <Link href={`/lessons/${lesson.slug}`}>
                            <Button size="sm" className="h-7 text-xs bg-[#171717] hover:bg-[#222222] text-[#FFFFFF] border border-[#333333] font-mono">
                              RE_INSPECT
                            </Button>
                          </Link>
                        ) : isUnlocked ? (
                          <Link href={`/lessons/${lesson.slug}`}>
                            <Button size="sm" className="h-7 text-xs bg-[#FFFFFF] hover:bg-[#E5E5E5] text-[#000000] font-black font-mono gap-1">
                              <span>EXECUTE</span>
                              <ArrowRight className="h-3 w-3" />
                            </Button>
                          </Link>
                        ) : (
                          <div className="flex items-center gap-1 text-[#555555] text-[10px]">
                            <Lock className="h-3 w-3" />
                            <span>LOCKED</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
