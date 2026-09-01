"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Terminal,
  Layers,
  CheckCircle2,
  Lock,
  ArrowRight,
  Code2,
  BookOpen,
  Eye,
  FileCode,
  CornerDownRight,
  ShieldAlert,
  Activity,
  Folder,
  FolderOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCurriculumProgressStore } from "@/store/useCurriculumProgressStore";
import { useThemeLanguageStore } from "@/store/useThemeLanguageStore";
import { getTranslations } from "@/lib/translations";
import { CURRICULUM_STAGES } from "@/data/curriculum";
import type { StageItem, LessonItem } from "@/data/curriculum";

// Knowledge Tree Domains
const KNOWLEDGE_DOMAINS = [
  {
    domainKey: "CORE_FOUNDATION",
    label: "01 // WEB_PROTOCOLS & INTERNET",
    stageRange: [1, 2],
  },
  {
    domainKey: "MARKUP_ARCHITECTURE",
    label: "02 // HTML5_SEMANTIC & ACCESSIBILITY",
    stageRange: [3, 4],
  },
  {
    domainKey: "VISUAL_ENGINEERING",
    label: "03 // MODERN_CSS, FLEXBOX & GRID",
    stageRange: [5, 8],
  },
  {
    domainKey: "DYNAMIC_COMPUTATION",
    label: "04 // JAVASCRIPT_RUNTIME, DOM & ASYNC",
    stageRange: [9, 14],
  },
  {
    domainKey: "FULLSTACK_SYSTEMS",
    label: "05 // REACT_NEXTJS_PRISMA & DEVOPS",
    stageRange: [15, 20],
  },
];

export function DarkCommandRoadmap() {
  const { language } = useThemeLanguageStore();
  const t = getTranslations(language);
  const { completedLessons, isLessonUnlocked } = useCurriculumProgressStore();

  const [expandedDomains, setExpandedDomains] = useState<Record<string, boolean>>({
    CORE_FOUNDATION: true,
    MARKUP_ARCHITECTURE: true,
    VISUAL_ENGINEERING: true,
    DYNAMIC_COMPUTATION: true,
    FULLSTACK_SYSTEMS: true,
  });

  const [selectedLesson, setSelectedLesson] = useState<LessonItem | null>(null);

  const completedCount = Object.values(completedLessons).filter(
    (item) => item?.completed
  ).length;
  const totalLessons = 20;
  const progressPercent = Math.round((completedCount / totalLessons) * 100);

  const toggleDomain = (key: string) => {
    setExpandedDomains((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-6 font-mono text-xs text-[#FFFFFF]">
      {/* Dependency Matrix Header */}
      <div className="p-6 rounded border border-[#222222] bg-[#0A0A0A] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[#888888]">
              <Layers className="h-3.5 w-3.5 text-[#FFFFFF]" />
              <span className="text-[10px] tracking-widest uppercase">
                SYSTEM_KNOWLEDGE_GRAPH // DEPENDENCY_TREE
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-[#FFFFFF]">
              CURRICULUM_DEPENDENCY_MATRIX
            </h1>
            <p className="text-[#888888] leading-relaxed max-w-2xl">
              Knowledge progression architecture. Each node requires verified execution and passing quiz telemetry from upstream prerequisites before execution authorization.
            </p>
          </div>

          <div className="p-4 rounded border border-[#222222] bg-[#050505] space-y-1.5 min-w-[200px]">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-[#888888]">GLOBAL_COMPLETION</span>
              <span className="font-bold text-[#FFFFFF]">{progressPercent}%</span>
            </div>
            <div className="h-2 w-full bg-[#111111] rounded overflow-hidden border border-[#222222]">
              <div
                className="h-full bg-[#FFFFFF] transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[10px] text-[#666666]">
              <span>NODES_PASSED: {completedCount}</span>
              <span>TOTAL_GRAPH: {totalLessons}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Split-Screen Knowledge Dependency Explorer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Tree Column (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {KNOWLEDGE_DOMAINS.map((domain) => {
            const domainStages = CURRICULUM_STAGES.filter(
              (s) => s.orderIndex >= domain.stageRange[0] && s.orderIndex <= domain.stageRange[1]
            );
            const isExpanded = expandedDomains[domain.domainKey] ?? true;

            return (
              <div
                key={domain.domainKey}
                className="rounded border border-[#222222] bg-[#0A0A0A] overflow-hidden"
              >
                {/* Domain Branch Header */}
                <button
                  type="button"
                  onClick={() => toggleDomain(domain.domainKey)}
                  className="w-full px-4 py-3 bg-[#0D0D0D] border-b border-[#1A1A1A] flex items-center justify-between text-left hover:bg-[#141414] transition-colors"
                >
                  <div className="flex items-center gap-2">
                    {isExpanded ? (
                      <FolderOpen className="h-4 w-4 text-[#FFFFFF]" />
                    ) : (
                      <Folder className="h-4 w-4 text-[#888888]" />
                    )}
                    <span className="font-bold text-[#FFFFFF]">{domain.label}</span>
                  </div>
                  <span className="text-[10px] text-[#666666]">
                    [{domainStages.length} STAGES]
                  </span>
                </button>

                {/* Sub-Tree Nodes */}
                {isExpanded && (
                  <div className="p-4 space-y-3">
                    {domainStages.map((stage) => {
                      const stageTitle = language === "en" && stage.titleEn ? stage.titleEn : stage.titleId;

                      return (
                        <div key={stage.id} className="space-y-1 pl-2 border-l border-[#222222]">
                          <div className="flex items-center gap-2 text-[#888888] text-[11px] py-1">
                            <span className="text-[#555555]">├──</span>
                            <span className="text-[#CCCCCC] font-bold">
                              STAGE_{String(stage.orderIndex).padStart(2, "0")}: {stageTitle}
                            </span>
                          </div>

                          {/* Lessons inside stage */}
                          <div className="space-y-1 pl-6">
                            {stage.lessons.map((lesson) => {
                              const isCompleted = !!completedLessons[lesson.id]?.completed;
                              const isUnlocked = isLessonUnlocked(lesson.id);
                              const isSelected = selectedLesson?.id === lesson.id;

                              return (
                                <div
                                  key={lesson.id}
                                  className={`p-2.5 rounded border transition-all flex items-center justify-between gap-3 ${
                                    isSelected
                                      ? "border-[#FFFFFF] bg-[#171717]"
                                      : isCompleted
                                      ? "border-[#2E2E2E] bg-[#080808] hover:border-[#444444]"
                                      : isUnlocked
                                      ? "border-[#222222] bg-[#050505] hover:border-[#444444]"
                                      : "border-[#1A1A1A] bg-[#050505] opacity-50 cursor-not-allowed"
                                  }`}
                                >
                                  <button
                                    type="button"
                                    onClick={() => setSelectedLesson(lesson)}
                                    className="flex items-center gap-2 text-left flex-1"
                                  >
                                    <span className="text-[#555555]">│   └──</span>
                                    {isCompleted ? (
                                      <CheckCircle2 className="h-3.5 w-3.5 text-[#FFFFFF]" />
                                    ) : isUnlocked ? (
                                      <span className="inline-block w-3.5 h-3.5 rounded border border-[#FFFFFF] bg-transparent text-center text-[9px] font-bold">
                                        &gt;
                                      </span>
                                    ) : (
                                      <Lock className="h-3.5 w-3.5 text-[#666666]" />
                                    )}
                                    <span className="text-[#FAFAFA] font-bold text-xs truncate max-w-[280px]">
                                      {language === "en" && lesson.titleEn ? lesson.titleEn : lesson.title}
                                    </span>
                                  </button>

                                  <div className="flex items-center gap-2">
                                    <span className="text-[10px] text-[#666666]">
                                      {lesson.estimatedMinutes}m
                                    </span>
                                    {isUnlocked && (
                                      <Link href={`/lessons/${lesson.slug}`}>
                                        <Button
                                          size="sm"
                                          className="h-6 px-2.5 text-[10px] font-mono bg-[#FFFFFF] hover:bg-[#E5E5E5] text-[#000000] font-black rounded"
                                        >
                                          {isCompleted ? "REVIEW" : "EXECUTE"} &rarr;
                                        </Button>
                                      </Link>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Right Inspector Node Column (5 cols) */}
        <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-16">
          <div className="p-6 rounded border border-[#222222] bg-[#0A0A0A] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#1A1A1A]">
              <span className="text-[10px] text-[#888888] uppercase tracking-wider font-bold">
                [NODE_TELEMETRY_INSPECTOR]
              </span>
              <span className="text-[10px] text-[#FFFFFF]">
                {selectedLesson ? selectedLesson.level.toUpperCase() : "AWAITING_SELECTION"}
              </span>
            </div>

            {selectedLesson ? (
              <div className="space-y-4">
                <div className="space-y-1">
                  <h3 className="text-sm font-black text-[#FFFFFF]">
                    {language === "en" && selectedLesson.titleEn ? selectedLesson.titleEn : selectedLesson.title}
                  </h3>
                  <p className="text-xs text-[#888888] leading-relaxed">
                    {language === "en" && selectedLesson.descriptionEn
                      ? selectedLesson.descriptionEn
                      : selectedLesson.description}
                  </p>
                </div>

                {/* Prerequisites Trace */}
                <div className="p-3 rounded border border-[#222222] bg-[#050505] space-y-1 text-[11px]">
                  <span className="text-[#666666] block font-bold">UPSTREAM_DEPENDENCIES:</span>
                  {selectedLesson.prerequisites && selectedLesson.prerequisites.length > 0 ? (
                    <ul className="space-y-0.5 text-[#CCCCCC]">
                      {selectedLesson.prerequisites.map((p, i) => (
                        <li key={i}>&gt; {p}</li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-[#888888]">None (Root Entry Node)</span>
                  )}
                </div>

                {/* Key Objectives */}
                {selectedLesson.learningObjectives && selectedLesson.learningObjectives.length > 0 && (
                  <div className="space-y-1.5 text-[11px]">
                    <span className="text-[#666666] font-bold block">VERIFIED_CRITERIA:</span>
                    <ul className="space-y-1 text-[#CCCCCC]">
                      {selectedLesson.learningObjectives.map((obj, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-[#FFFFFF]">&bull;</span>
                          <span>{obj}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Execute Trigger */}
                <div className="pt-2">
                  <Link href={`/lessons/${selectedLesson.slug}`}>
                    <Button className="w-full h-9 font-mono text-xs bg-[#FFFFFF] hover:bg-[#E5E5E5] text-[#000000] font-black rounded gap-1.5">
                      <Terminal className="h-3.5 w-3.5" />
                      <span>OPEN_IN_CODE_LAB</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center space-y-2 text-[#888888]">
                <Terminal className="h-8 w-8 mx-auto text-[#444444]" />
                <p>Select any node on the left dependency tree to inspect its prerequisites and competencies.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
