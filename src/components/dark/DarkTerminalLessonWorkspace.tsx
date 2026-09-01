"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MarkdownRenderer } from "@/components/ui/markdown-renderer";
import { InlineFormattedText } from "@/components/ui/inline-formatted-text";
import { QuizWidget } from "@/components/interactive/QuizWidget";
import { CodeExerciseSandbox } from "@/components/interactive/CodeExerciseSandbox";
import { useThemeLanguageStore } from "@/store/useThemeLanguageStore";
import { useCurriculumProgressStore } from "@/store/useCurriculumProgressStore";
import { getTranslations } from "@/lib/translations";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Terminal,
  Map,
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
  Layers,
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

  const [activeTab, setActiveTab] = useState("lesson");
  const [copied, setCopied] = useState(false);

  const isCompleted = !!completedLessons[activeLesson.id]?.completed;
  const isBookmarked = bookmarkedLessons.includes(activeLesson.id);

  const lessonTitle = language === "en" && activeLesson.titleEn ? activeLesson.titleEn : activeLesson.title;
  const lessonDesc = language === "en" && activeLesson.descriptionEn ? activeLesson.descriptionEn : activeLesson.description;
  const stageTitle = language === "en" && activeStage.titleEn ? activeStage.titleEn : activeStage.titleId;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 font-mono">
      {/* Top Terminal Breadcrumb & Status Bar */}
      <div className="p-3 px-4 rounded border border-[#222222] bg-[#0A0A0A] flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-[#888888]">
          <Link href="/roadmap" className="text-[#FFFFFF] hover:underline flex items-center gap-1">
            <Terminal className="h-3.5 w-3.5" />
            <span>ROADMAP</span>
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
              [STATUS: PENDING_QUIZ]
            </span>
          )}
        </div>
      </div>

      {/* Dual-Pane Developer Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Pane: Technical Documentation (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 rounded border border-[#222222] bg-[#0A0A0A] space-y-3">
            <div className="flex items-center justify-between text-xs text-[#888888]">
              <span>MODULE_SPEC // {activeLesson.level.toUpperCase()}</span>
              <span>{activeLesson.estimatedMinutes} MIN ESTIMATED</span>
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-[#FFFFFF]">
              {lessonTitle}
            </h1>

            <p className="text-xs text-[#888888] leading-relaxed">
              {lessonDesc}
            </p>

            {/* Technical Objective Checklist */}
            {activeLesson.learningObjectives && activeLesson.learningObjectives.length > 0 && (
              <div className="pt-3 border-t border-[#1A1A1A] space-y-1.5">
                <span className="text-[10px] text-[#666666] uppercase tracking-wider font-bold">
                  VERIFIED_COMPETENCIES:
                </span>
                <ul className="space-y-1 text-xs text-[#CCCCCC]">
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
            <div className="flex items-center justify-between pb-3 border-b border-[#1A1A1A] text-xs text-[#888888]">
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

            {/* Common Pitfalls Section */}
            {activeLesson.commonMistakes && activeLesson.commonMistakes.length > 0 && (
              <div className="p-4 rounded border border-[#333333] bg-[#050505] space-y-2">
                <span className="text-[11px] font-bold text-[#FFFFFF] block uppercase tracking-wider">
                  [WARNING] ANTIPATTERNS & KNOWN_PITFALLS:
                </span>
                <ul className="space-y-1 text-xs text-[#888888]">
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

        {/* Right Pane: Interactive Execution & Evaluator (5 cols) */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-20">
          <div className="p-6 rounded border border-[#222222] bg-[#0A0A0A] space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#1A1A1A] text-xs text-[#888888]">
              <span>INTERACTIVE_EVALUATOR</span>
              <span className="text-[#FFFFFF]">STAGE_{activeStage.orderIndex}</span>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-[#050505] border border-[#222222] rounded p-0.5">
                <TabsTrigger value="quiz" className="rounded text-xs uppercase font-mono data-[state=active]:bg-[#FFFFFF] data-[state=active]:text-[#000000] gap-1.5 h-7">
                  <CircleHelp className="h-3 w-3" />
                  <span>QUIZ ({activeLesson.quizzes.length})</span>
                </TabsTrigger>
                <TabsTrigger value="exercise" className="rounded text-xs uppercase font-mono data-[state=active]:bg-[#FFFFFF] data-[state=active]:text-[#000000] gap-1.5 h-7">
                  <Code2 className="h-3 w-3" />
                  <span>SANDBOX</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="quiz" className="pt-3">
                <QuizWidget
                  lessonId={activeLesson.id}
                  lessonSlug={activeLesson.slug}
                  quizzes={activeLesson.quizzes}
                />
              </TabsContent>

              <TabsContent value="exercise" className="pt-3">
                {activeLesson.exercise ? (
                  <CodeExerciseSandbox
                    lessonId={activeLesson.id}
                    exercise={activeLesson.exercise}
                  />
                ) : (
                  <div className="p-6 rounded border border-[#222222] bg-[#050505] text-center space-y-2 text-xs text-[#888888]">
                    <div className="font-bold text-[#FFFFFF]">THEORETICAL_MODULE</div>
                    <p>No sandbox runner required for this architectural lesson. Complete quiz to verify.</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Navigation Controls */}
          <div className="p-4 rounded border border-[#222222] bg-[#0A0A0A] flex items-center justify-between gap-3 text-xs">
            {prevLessonItem ? (
              <Link href={`/lessons/${prevLessonItem.lesson.slug}`}>
                <Button variant="outline" size="sm" className="h-8 text-xs font-mono border-[#222222] bg-[#050505] text-[#CCCCCC] hover:text-[#FFFFFF] gap-1">
                  <ArrowLeft className="h-3 w-3" />
                  <span>PREV</span>
                </Button>
              </Link>
            ) : (
              <div />
            )}

            {nextLessonItem && (
              isCompleted ? (
                <Link href={`/lessons/${nextLessonItem.lesson.slug}`}>
                  <Button size="sm" className="h-8 text-xs font-mono bg-[#FFFFFF] hover:bg-[#E5E5E5] text-[#000000] font-black gap-1">
                    <span>NEXT_MODULE</span>
                    <ArrowRight className="h-3 w-3" />
                  </Button>
                </Link>
              ) : (
                <Button size="sm" variant="outline" disabled className="h-8 text-xs font-mono border-[#1A1A1A] bg-[#050505] text-[#555555] gap-1 opacity-50">
                  <Lock className="h-3 w-3" />
                  <span>LOCKED</span>
                </Button>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
