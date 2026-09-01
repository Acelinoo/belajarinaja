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
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Map,
  Bookmark,
  CheckCircle2,
  Lock,
  ArrowRight,
  ArrowLeft,
  CircleHelp,
  Code2,
  BookOpen,
  AlertTriangle,
  BookMarked,
  Briefcase,
  FolderGit2,
  Copy,
  Check,
} from "lucide-react";
import type { Lesson, Stage } from "@/types/curriculum";

interface LightNeoLessonWorkspaceProps {
  activeLesson: Lesson;
  activeStage: Stage;
  prevLessonItem: { lesson: Lesson; stage: Stage } | null;
  nextLessonItem: { lesson: Lesson; stage: Stage } | null;
}

export function LightNeoLessonWorkspace({
  activeLesson,
  activeStage,
  prevLessonItem,
  nextLessonItem,
}: LightNeoLessonWorkspaceProps) {
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
    <div className="space-y-6">
      {/* Top Editorial Breadcrumb */}
      <div className="flex items-center justify-between gap-3 pb-4 border-b-2 border-black text-xs font-bold">
        <div className="flex items-center gap-2">
          <Link href="/roadmap" className="hover:underline flex items-center gap-1">
            <Map className="h-3.5 w-3.5" />
            <span>{t.nav.roadmap}</span>
          </Link>
          <span>/</span>
          <span>{t.common.stage} {String(activeStage.orderIndex).padStart(2, "0")}: {stageTitle}</span>
          <span>/</span>
          <span className="font-black truncate max-w-[200px]">{lessonTitle}</span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={() => toggleBookmark(activeLesson.id)}
            className={`h-8 text-xs font-black rounded-lg border-2 border-black gap-1.5 shadow-[2px_2px_0px_#121212] ${
              isBookmarked ? "bg-[#FFD84D] text-[#121212]" : "bg-white text-[#121212] hover:bg-[#F7F4EA]"
            }`}
          >
            <Bookmark className={`h-3.5 w-3.5 ${isBookmarked ? "fill-black text-black" : ""}`} />
            <span>{isBookmarked ? t.lesson.savedLesson : t.lesson.saveLesson}</span>
          </Button>

          {isCompleted && (
            <span className="px-2.5 py-1 rounded-lg border-2 border-black bg-[#7BE495] text-xs font-black shadow-[2px_2px_0px_#121212] flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>{t.common.completed}</span>
            </span>
          )}
        </div>
      </div>

      {/* Main Editorial Workspace */}
      <div className="space-y-6">
        {/* Title Header Card */}
        <div className="p-6 sm:p-8 rounded-2xl border-2 border-black bg-white shadow-[6px_6px_0px_#121212] space-y-3">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded border border-black bg-[#FFD84D] text-xs font-black font-mono shadow-[1.5px_1.5px_0px_#121212]">
              {activeLesson.level.toUpperCase()}
            </span>
            <span className="text-xs font-bold text-[#555555]">
              {t.lesson.estTime}: {activeLesson.estimatedMinutes} {t.common.minutes}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-[#121212] tracking-tight">
            {lessonTitle}
          </h1>

          <p className="text-xs sm:text-sm font-medium text-[#404040] leading-relaxed">
            {lessonDesc}
          </p>

          {/* Objectives Card */}
          {activeLesson.learningObjectives && activeLesson.learningObjectives.length > 0 && (
            <div className="pt-4 border-t-2 border-black grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border-2 border-black bg-[#F7F4EA] shadow-[3px_3px_0px_#121212] space-y-1.5">
                <span className="text-xs font-black text-[#121212] block uppercase tracking-wider">
                  {t.lesson.targetObjectives}
                </span>
                <ul className="space-y-1 text-xs font-medium text-[#404040]">
                  {activeLesson.learningObjectives.map((obj, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="font-black text-[#121212]">&bull;</span>
                      <span>{obj}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {activeLesson.whyMatters && (
                <div className="p-4 rounded-xl border-2 border-black bg-[#70B7FF]/20 shadow-[3px_3px_0px_#121212] space-y-1.5">
                  <span className="text-xs font-black text-[#121212] block uppercase tracking-wider">
                    {t.lesson.whyItMatters}
                  </span>
                  <p className="text-xs font-medium text-[#404040] leading-relaxed">
                    {activeLesson.whyMatters}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Tab System */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 max-w-md border-2 border-black rounded-lg p-0.5 bg-white shadow-[3px_3px_0px_#121212]">
            <TabsTrigger value="lesson" className="rounded text-xs font-black data-[state=active]:bg-[#FFD84D] data-[state=active]:text-[#121212] gap-1.5">
              <BookOpen className="h-3.5 w-3.5" />
              <span>{t.lesson.tabLesson}</span>
            </TabsTrigger>
            <TabsTrigger value="quiz" className="rounded text-xs font-black data-[state=active]:bg-[#FFD84D] data-[state=active]:text-[#121212] gap-1.5">
              <CircleHelp className="h-3.5 w-3.5" />
              <span>{t.lesson.tabQuiz}</span>
            </TabsTrigger>
            <TabsTrigger value="exercise" className="rounded text-xs font-black data-[state=active]:bg-[#FFD84D] data-[state=active]:text-[#121212] gap-1.5">
              <Code2 className="h-3.5 w-3.5" />
              <span>{t.lesson.tabExercise}</span>
            </TabsTrigger>
          </TabsList>

          {/* Lesson Content Tab */}
          <TabsContent value="lesson" className="space-y-6 pt-4">
            <div className="p-6 sm:p-8 rounded-2xl border-2 border-black bg-white shadow-[6px_6px_0px_#121212] space-y-6">
              <div className="max-w-[75ch] prose prose-headings:font-black prose-headings:text-[#121212]">
                <MarkdownRenderer
                  content={
                    language === "en" && activeLesson.contentMdEn
                      ? activeLesson.contentMdEn
                      : activeLesson.contentMd
                  }
                />
              </div>

              {/* Pitfalls Callout */}
              {activeLesson.commonMistakes && activeLesson.commonMistakes.length > 0 && (
                <div className="p-4 rounded-xl border-2 border-black bg-[#FF6B6B]/20 shadow-[3px_3px_0px_#121212] space-y-2">
                  <div className="flex items-center gap-2 text-xs font-black text-[#121212]">
                    <AlertTriangle className="h-4 w-4" />
                    <span>{t.lesson.commonMistakes}</span>
                  </div>
                  <ul className="space-y-1 text-xs font-medium text-[#121212]">
                    {activeLesson.commonMistakes.map((m, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="font-black">&bull;</span>
                        <InlineFormattedText text={m} />
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Key Terms */}
              {activeLesson.keyTerms && activeLesson.keyTerms.length > 0 && (
                <div className="p-4 rounded-xl border-2 border-black bg-[#F7F4EA] shadow-[3px_3px_0px_#121212] space-y-2">
                  <div className="flex items-center gap-2 text-xs font-black text-[#121212]">
                    <BookMarked className="h-4 w-4" />
                    <span>{t.lesson.keyTerms}</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    {activeLesson.keyTerms.map((term, i) => (
                      <div key={i} className="p-2.5 rounded border-2 border-black bg-white shadow-[1.5px_1.5px_0px_#121212] text-xs">
                        <span className="font-black text-[#121212] block">
                          <InlineFormattedText text={term.term} />
                        </span>
                        <span className="text-[11px] text-[#555555] mt-0.5 block">
                          <InlineFormattedText text={term.definition} />
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Mini Project */}
              {activeLesson.miniProject && (
                <div className="p-5 rounded-xl border-2 border-black bg-[#FFD84D]/30 shadow-[4px_4px_0px_#121212] space-y-2">
                  <div className="flex items-center gap-2 text-xs font-black text-[#121212]">
                    <FolderGit2 className="h-4 w-4" />
                    <span><InlineFormattedText text={activeLesson.miniProject.title} /></span>
                  </div>
                  <p className="text-xs font-medium text-[#121212]">
                    <InlineFormattedText text={activeLesson.miniProject.description} />
                  </p>
                  <div className="pt-2">
                    <span className="text-[11px] font-black text-[#121212] block mb-1">
                      {t.lesson.miniProjectDeliverables}
                    </span>
                    <ul className="space-y-1 text-xs font-medium text-[#121212]">
                      {activeLesson.miniProject.deliverables.map((del, i) => (
                        <li key={i} className="flex items-center gap-1.5">
                          <CheckCircle2 className="h-3.5 w-3.5 text-[#15803D]" />
                          <InlineFormattedText text={del} />
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Bottom Actions */}
              <div className="pt-4 border-t-2 border-black flex items-center justify-between gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopy(activeLesson.contentMd)}
                  className="rounded-lg border-2 border-black bg-white text-xs font-bold shadow-[2px_2px_0px_#121212]"
                >
                  {copied ? <Check className="h-3.5 w-3.5 mr-1" /> : <Copy className="h-3.5 w-3.5 mr-1" />}
                  {copied ? t.common.copied : t.lesson.copyAllContent}
                </Button>

                <Button
                  size="sm"
                  onClick={() => setActiveTab("quiz")}
                  className="rounded-lg border-2 border-black bg-[#FFD84D] hover:bg-[#F5CB32] text-[#121212] font-black text-xs shadow-[3px_3px_0px_#121212] gap-1.5"
                >
                  <CircleHelp className="h-3.5 w-3.5" />
                  <span>{t.lesson.startQuizAction}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Quiz Tab */}
          <TabsContent value="quiz" className="pt-4">
            <QuizWidget
              lessonId={activeLesson.id}
              lessonSlug={activeLesson.slug}
              quizzes={activeLesson.quizzes}
            />
          </TabsContent>

          {/* Exercise Tab */}
          <TabsContent value="exercise" className="pt-4">
            {activeLesson.exercise ? (
              <CodeExerciseSandbox
                lessonId={activeLesson.id}
                exercise={activeLesson.exercise}
              />
            ) : (
              <div className="p-8 text-center rounded-2xl border-2 border-black bg-white shadow-[5px_5px_0px_#121212] space-y-2">
                <BookOpen className="h-6 w-6 text-[#121212] mx-auto" />
                <h4 className="text-sm font-black text-[#121212]">{t.lesson.theoryOnlyTitle}</h4>
                <p className="text-xs font-medium text-[#555555] max-w-md mx-auto">{t.lesson.theoryOnlyDesc}</p>
                <Button
                  size="sm"
                  onClick={() => setActiveTab("quiz")}
                  className="rounded-lg border-2 border-black bg-[#FFD84D] text-[#121212] font-black text-xs shadow-[2px_2px_0px_#121212] mt-2"
                >
                  {t.lesson.openQuizTab}
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Footer Navigation */}
        <div className="pt-6 border-t-2 border-black flex items-center justify-between gap-4">
          {prevLessonItem ? (
            <Link href={`/lessons/${prevLessonItem.lesson.slug}`}>
              <Button variant="outline" size="sm" className="rounded-lg border-2 border-black bg-white text-xs font-bold shadow-[3px_3px_0px_#121212] gap-1.5">
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>{t.lesson.prevLesson}</span>
              </Button>
            </Link>
          ) : (
            <div />
          )}

          {nextLessonItem && (
            isCompleted ? (
              <Link href={`/lessons/${nextLessonItem.lesson.slug}`}>
                <Button size="sm" className="rounded-lg border-2 border-black bg-[#FFD84D] hover:bg-[#F5CB32] text-[#121212] font-black text-xs shadow-[3px_3px_0px_#121212] gap-1.5 px-6">
                  <span>{t.lesson.nextLesson}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            ) : (
              <Button size="sm" variant="outline" disabled className="rounded-lg border-2 border-neutral-300 bg-neutral-100 text-[#888888] text-xs font-bold gap-1.5 opacity-60">
                <Lock className="h-3.5 w-3.5" />
                <span>{t.lesson.lockedNextLesson}</span>
              </Button>
            )
          )}
        </div>
      </div>
    </div>
  );
}
