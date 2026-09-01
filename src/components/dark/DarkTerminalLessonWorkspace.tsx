"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MarkdownRenderer } from "@/components/ui/markdown-renderer";
import { InlineFormattedText } from "@/components/ui/inline-formatted-text";
import { QuizWidget } from "@/components/interactive/QuizWidget";
import { RealSandboxEngine } from "@/components/interactive/RealSandboxEngine";
import { getExerciseForLesson } from "@/data/lessonExercises";
import { useThemeLanguageStore } from "@/store/useThemeLanguageStore";
import { useCurriculumProgressStore } from "@/store/useCurriculumProgressStore";
import { getTranslations } from "@/lib/translations";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Terminal,
  Layers,
  Bookmark,
  CheckCircle2,
  Lock,
  ArrowRight,
  ArrowLeft,
  CircleHelp,
  Code2,
  BookOpen,
  Copy,
  Check,
  Activity,
} from "lucide-react";
import type { Lesson, Stage } from "@/types/curriculum";

interface DarkTerminalLessonWorkspaceProps {
  activeLesson: Lesson;
  activeStage: Stage;
  prevLessonItem: { lesson: Lesson; stage: Stage } | null;
  nextLessonItem: { lesson: Lesson; stage: Stage } | null;
}

export function DarkTerminalLessonWorkspace({
  activeLesson,
  activeStage,
  prevLessonItem,
  nextLessonItem,
}: DarkTerminalLessonWorkspaceProps) {
  const { language } = useThemeLanguageStore();
  const t = getTranslations(language);
  const { completedLessons, toggleBookmark, bookmarkedLessons } = useCurriculumProgressStore();

  const [activeTab, setActiveTab] = useState<"sandbox" | "quiz">("sandbox");
  const [copied, setCopied] = useState(false);

  const isCompleted = !!completedLessons[activeLesson.id]?.completed;
  const isBookmarked = bookmarkedLessons.includes(activeLesson.id);

  const lessonTitle = language === "en" && activeLesson.titleEn ? activeLesson.titleEn : activeLesson.title;
  const lessonDesc = language === "en" && activeLesson.descriptionEn ? activeLesson.descriptionEn : activeLesson.description;
  const stageTitle = language === "en" && activeStage.titleEn ? activeStage.titleEn : activeStage.titleId;

  const exercise = getExerciseForLesson(activeLesson.id, activeLesson.slug, lessonTitle);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 font-mono text-xs text-[#FFFFFF]">
      {/* Top Workspace Path Bar */}
      <div className="p-3 px-4 rounded border border-[#222222] bg-[#0A0A0A] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-[#888888]">
          <Link href="/roadmap" className="text-[#FFFFFF] hover:underline flex items-center gap-1">
            <Terminal className="h-3.5 w-3.5" />
            <span>KNOWLEDGE_TREE</span>
          </Link>
          <span>/</span>
          <span>STAGE_{String(activeStage.orderIndex).padStart(2, "0")}</span>
          <span>/</span>
          <span className="text-[#FFFFFF] truncate max-w-[200px]">{lessonTitle}</span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={() => toggleBookmark(activeLesson.id)}
            className={`h-7 text-xs font-mono rounded border border-[#222222] gap-1 px-3 ${
              isBookmarked ? "bg-[#171717] text-[#FFFFFF]" : "bg-[#050505] text-[#888888] hover:text-[#FFFFFF]"
            }`}
          >
            <Bookmark className={`h-3 w-3 ${isBookmarked ? "fill-[#FFFFFF] text-[#FFFFFF]" : ""}`} />
            <span>{isBookmarked ? "BOOKMARKED" : "BOOKMARK"}</span>
          </Button>

          {isCompleted ? (
            <span className="text-[10px] text-[#FFFFFF] px-2 py-0.5 rounded border border-[#333333] bg-[#111111] font-bold">
              [STATUS: EVALUATED_PASS]
            </span>
          ) : (
            <span className="text-[10px] text-[#888888] px-2 py-0.5 rounded border border-[#222222] bg-[#050505]">
              [STATUS: PENDING_EVAL]
            </span>
          )}
        </div>
      </div>

      {/* Dual-Pane Developer Code Lab */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Pane: Technical Documentation & Specifications (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          <div className="p-6 rounded border border-[#222222] bg-[#0A0A0A] space-y-3">
            <div className="flex items-center justify-between text-[#888888]">
              <span>MODULE_SPEC // {activeLesson.level.toUpperCase()}</span>
              <span>{activeLesson.estimatedMinutes} MIN ESTIMATED</span>
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-[#FFFFFF]">
              {lessonTitle}
            </h1>

            <p className="text-[#888888] leading-relaxed">
              {lessonDesc}
            </p>

            {/* Competency Criteria */}
            {activeLesson.learningObjectives && activeLesson.learningObjectives.length > 0 && (
              <div className="pt-3 border-t border-[#1A1A1A] space-y-1.5">
                <span className="text-[10px] text-[#666666] uppercase tracking-wider font-bold">
                  VERIFIED_COMPETENCIES:
                </span>
                <ul className="space-y-1 text-[#CCCCCC]">
                  {activeLesson.learningObjectives.map((obj, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-[#888888] font-bold">&gt;</span>
                      <span>{obj}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Documentation Body */}
          <div className="p-6 sm:p-8 rounded border border-[#222222] bg-[#0A0A0A] space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#1A1A1A] text-[#888888]">
              <span>TECHNICAL_DOCUMENTATION</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCopy(activeLesson.contentMd)}
                className="h-6 text-[10px] font-mono border-[#222222] bg-[#050505] text-[#888888] hover:text-[#FFFFFF]"
              >
                {copied ? <Check className="h-3 w-3 mr-1" /> : <Copy className="h-3 w-3 mr-1" />}
                {copied ? "COPIED" : "RAW_MD"}
              </Button>
            </div>

            <div className="max-w-[75ch] prose-invert text-xs leading-relaxed text-[#CCCCCC]">
              <MarkdownRenderer
                content={
                  language === "en" && activeLesson.contentMdEn
                    ? activeLesson.contentMdEn
                    : activeLesson.contentMd
                }
              />
            </div>

            {/* Antipatterns Warning */}
            {activeLesson.commonMistakes && activeLesson.commonMistakes.length > 0 && (
              <div className="p-4 rounded border border-[#333333] bg-[#050505] space-y-2">
                <span className="text-[11px] font-bold text-[#FFFFFF] block uppercase tracking-wider">
                  [WARNING] ANTIPATTERNS & KNOWN_PITFALLS:
                </span>
                <ul className="space-y-1 text-[#888888]">
                  {activeLesson.commonMistakes.map((mistake, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-[#FFFFFF]">&bull;</span>
                      <InlineFormattedText text={mistake} />
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Right Pane: Code Lab Execution & Debug Challenge (6 cols) */}
        <div className="lg:col-span-6 space-y-6 lg:sticky lg:top-16">
          <div className="p-6 rounded border border-[#222222] bg-[#0A0A0A] space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#1A1A1A] text-[#888888]">
              <span>DEVELOPER_CODE_LAB</span>
              <span className="text-[#FFFFFF]">STAGE_{activeStage.orderIndex}</span>
            </div>

            <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as "sandbox" | "quiz")} className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-[#050505] border border-[#222222] rounded p-0.5">
                <TabsTrigger
                  value="sandbox"
                  className="rounded text-xs uppercase font-mono data-[state=active]:bg-[#FFFFFF] data-[state=active]:text-[#000000] gap-1.5 h-7"
                >
                  <Code2 className="h-3 w-3" />
                  <span>CODE_SANDBOX</span>
                </TabsTrigger>
                <TabsTrigger
                  value="quiz"
                  className="rounded text-xs uppercase font-mono data-[state=active]:bg-[#FFFFFF] data-[state=active]:text-[#000000] gap-1.5 h-7"
                >
                  <CircleHelp className="h-3 w-3" />
                  <span>DEBUG_CHALLENGE ({activeLesson.quizzes.length})</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="sandbox" className="pt-3">
                <RealSandboxEngine
                  lessonId={activeLesson.id}
                  exercise={exercise}
                />
              </TabsContent>

              <TabsContent value="quiz" className="pt-3">
                <QuizWidget
                  lessonId={activeLesson.id}
                  lessonSlug={activeLesson.slug}
                  quizzes={activeLesson.quizzes}
                />
              </TabsContent>
            </Tabs>
          </div>

          {/* Navigation Matrix */}
          <div className="p-4 rounded border border-[#222222] bg-[#0A0A0A] flex items-center justify-between gap-3">
            {prevLessonItem ? (
              <Link href={`/lessons/${prevLessonItem.lesson.slug}`}>
                <Button variant="outline" size="sm" className="h-8 text-xs font-mono border-[#222222] bg-[#050505] text-[#CCCCCC] hover:text-[#FFFFFF] gap-1">
                  <ArrowLeft className="h-3 w-3" />
                  <span>PREV_NODE</span>
                </Button>
              </Link>
            ) : (
              <div />
            )}

            {nextLessonItem && (
              isCompleted ? (
                <Link href={`/lessons/${nextLessonItem.lesson.slug}`}>
                  <Button size="sm" className="h-8 text-xs font-mono bg-[#FFFFFF] hover:bg-[#E5E5E5] text-[#000000] font-black gap-1">
                    <span>NEXT_NODE</span>
                    <ArrowRight className="h-3 w-3" />
                  </Button>
                </Link>
              ) : (
                <Button size="sm" variant="outline" disabled className="h-8 text-xs font-mono border-[#1A1A1A] bg-[#050505] text-[#555555] gap-1 opacity-50">
                  <Lock className="h-3 w-3" />
                  <span>LOCKED (COMPLETE_QUIZ)</span>
                </Button>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
