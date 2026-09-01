"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MarkdownRenderer } from "@/components/ui/markdown-renderer";
import { InlineFormattedText } from "@/components/ui/inline-formatted-text";
import { BotCompanionCharacter } from "@/components/fun/characters/BotCompanionCharacter";
import { CodingCharacter } from "@/components/fun/characters/CodingCharacter";
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
  Star,
  Sparkles,
  AlertTriangle,
  BookMarked,
  Briefcase,
  FolderGit2,
  Copy,
  Check,
} from "lucide-react";
import type { Lesson, Stage } from "@/types/curriculum";

interface FunLessonRoomProps {
  activeLesson: Lesson;
  activeStage: Stage;
  prevLessonItem: { lesson: Lesson; stage: Stage } | null;
  nextLessonItem: { lesson: Lesson; stage: Stage } | null;
}

export function FunLessonRoom({
  activeLesson,
  activeStage,
  prevLessonItem,
  nextLessonItem,
}: FunLessonRoomProps) {
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
      {/* Top Floating Pill Breadcrumb */}
      <div className="p-3 px-5 rounded-full bg-white border-2 border-[#FED7AA] shadow-[0_4px_15px_rgba(255,155,84,0.1)] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-black text-[#243447]">
          <Link href="/roadmap" className="text-[#D97706] hover:underline flex items-center gap-1">
            <Map className="h-3.5 w-3.5" />
            <span>{t.nav.roadmap}</span>
          </Link>
          <span className="text-[#FED7AA]">•</span>
          <span className="text-[#64748B]">
            {t.common.stage} {String(activeStage.orderIndex).padStart(2, "0")}: {stageTitle}
          </span>
          <span className="text-[#FED7AA]">•</span>
          <span className="text-[#243447] truncate max-w-[200px]">{lessonTitle}</span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={() => toggleBookmark(activeLesson.id)}
            className={`h-7 text-xs font-black rounded-full border border-[#FED7AA] gap-1 px-3 ${
              isBookmarked ? "bg-[#FFF8E7] text-[#FF9F43]" : "bg-white text-[#64748B] hover:bg-[#FFF8E7]"
            }`}
          >
            <Bookmark className={`h-3.5 w-3.5 ${isBookmarked ? "fill-[#FF9F43] text-[#FF9F43]" : ""}`} />
            <span>{isBookmarked ? t.lesson.savedLesson : t.lesson.saveLesson}</span>
          </Button>

          {isCompleted ? (
            <Badge className="bg-[#DCFCE7] text-[#166534] border border-[#86EFAC] text-[11px] font-black rounded-full px-2.5 py-0.5 gap-1">
              <CheckCircle2 className="h-3.5 w-3.5 text-[#16A34A]" />
              <span>{t.common.completed}</span>
            </Badge>
          ) : (
            <Badge className="bg-[#FEF3C7] text-[#D97706] border border-[#FED7AA] text-[11px] font-black rounded-full px-2.5 py-0.5 gap-1">
              <Star className="h-3.5 w-3.5 fill-[#FFD84D] text-[#FFD84D]" />
              <span>+30 XP</span>
            </Badge>
          )}
        </div>
      </div>

      {/* 3-Column Learning Room Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Visual Character Companion (3 cols) */}
        <aside className="lg:col-span-3 space-y-4 lg:sticky lg:top-20">
          <div className="p-6 rounded-[28px] bg-white border-2 border-[#FED7AA] shadow-[0_10px_30px_rgba(255,155,84,0.08)] text-center space-y-4">
            <BotCompanionCharacter
              className="w-28 h-28 mx-auto"
              expression={isCompleted ? "excited" : "happy"}
              speechBubbleText={
                isCompleted
                  ? (language === "en" ? "Mission Mastered! ⭐" : "Misi Berhasil! ⭐")
                  : (language === "en" ? "Let's learn this quest!" : "Ayo pelajari materi ini!")
              }
            />

            <div className="space-y-1">
              <span className="text-[10px] font-black text-[#D97706] uppercase tracking-wider block">
                {t.dashboard.funPlayerLevel} • Quest Guide
              </span>
              <h4 className="text-sm font-black text-[#243447]">
                {activeLesson.level} Level
              </h4>
              <p className="text-xs text-[#64748B] font-medium">
                {activeLesson.estimatedMinutes} {t.common.minutes} {t.lesson.estTime}
              </p>
            </div>

            {/* Quick Quest Objectives */}
            {activeLesson.learningObjectives && activeLesson.learningObjectives.length > 0 && (
              <div className="pt-3 border-t border-[#FED7AA] text-left space-y-2">
                <span className="text-[11px] font-black text-[#243447] flex items-center gap-1">
                  <span>🎯</span>
                  <span>{t.lesson.targetObjectives}</span>
                </span>
                <ul className="space-y-1.5 text-xs text-[#64748B] font-medium">
                  {activeLesson.learningObjectives.map((obj, i) => (
                    <li key={i} className="flex items-start gap-1.5 leading-tight">
                      <span className="text-[#5CC8FF] font-black">•</span>
                      <span>{obj}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Pitfall Alert Card */}
          {activeLesson.commonMistakes && activeLesson.commonMistakes.length > 0 && (
            <div className="p-4 rounded-2xl bg-[#FFF1F2] border-2 border-[#FECDD3] space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-black text-[#BE123C]">
                <AlertTriangle className="h-4 w-4" />
                <span>{t.lesson.funPitfallAlert}</span>
              </div>
              <ul className="space-y-1 text-xs text-[#9F1239] font-medium">
                {activeLesson.commonMistakes.map((m, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span>⚠️</span>
                    <InlineFormattedText text={m} />
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>

        {/* Center Column: Quest Content Workspace (6 cols) */}
        <main className="lg:col-span-6 space-y-6">
          {/* Header Card */}
          <div className="p-6 sm:p-8 rounded-[32px] bg-white border-2 border-[#FED7AA] shadow-[0_10px_35px_rgba(255,155,84,0.08)] space-y-3">
            <div className="flex items-center gap-2">
              <Badge className="bg-[#FFF8E7] text-[#D97706] border border-[#FED7AA] text-xs font-black rounded-full">
                {t.common.stage} {activeStage.orderIndex}
              </Badge>
              <span className="text-xs font-bold text-[#64748B]">{activeStage.category}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-[#243447] tracking-tight">
              {lessonTitle}
            </h1>

            <p className="text-xs sm:text-sm font-medium text-[#64748B] leading-relaxed">
              {lessonDesc}
            </p>
          </div>

          {/* Interactive Learning Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 rounded-full bg-white border-2 border-[#FED7AA] p-1 shadow-sm">
              <TabsTrigger value="lesson" className="rounded-full text-xs font-black data-[state=active]:bg-[#FFD84D] data-[state=active]:text-[#243447] gap-1.5">
                <BookOpen className="h-3.5 w-3.5" />
                <span>{t.lesson.tabLesson}</span>
              </TabsTrigger>
              <TabsTrigger value="quiz" className="rounded-full text-xs font-black data-[state=active]:bg-[#FFD84D] data-[state=active]:text-[#243447] gap-1.5 relative">
                <CircleHelp className="h-3.5 w-3.5" />
                <span>{t.lesson.tabQuiz}</span>
                {!isCompleted && (
                  <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF6B6B] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#FF6B6B]"></span>
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="exercise" className="rounded-full text-xs font-black data-[state=active]:bg-[#FFD84D] data-[state=active]:text-[#243447] gap-1.5">
                <Code2 className="h-3.5 w-3.5" />
                <span>{t.lesson.tabExercise}</span>
              </TabsTrigger>
            </TabsList>

            {/* Tab 1: Lesson Text */}
            <TabsContent value="lesson" className="space-y-6 pt-2">
              <div className="p-6 sm:p-8 rounded-[32px] bg-white border-2 border-[#FED7AA] shadow-[0_10px_35px_rgba(255,155,84,0.06)] space-y-6">
                <div className="max-w-[75ch] prose-headings:text-[#243447] prose-p:text-[#475569]">
                  <MarkdownRenderer
                    content={
                      language === "en" && activeLesson.contentMdEn
                        ? activeLesson.contentMdEn
                        : activeLesson.contentMd
                    }
                  />
                </div>

                {/* Mini Boss Project Callout */}
                {activeLesson.miniProject && (
                  <div className="p-5 rounded-3xl bg-[#FFF8E7] border-2 border-[#FED7AA] space-y-2">
                    <div className="flex items-center gap-2 text-xs font-black text-[#243447]">
                      <FolderGit2 className="h-4 w-4 text-[#FF9F43]" />
                      <span><InlineFormattedText text={activeLesson.miniProject.title} /></span>
                    </div>
                    <p className="text-xs text-[#64748B] font-medium">
                      <InlineFormattedText text={activeLesson.miniProject.description} />
                    </p>
                    <div className="pt-2">
                      <span className="text-[11px] font-black text-[#243447] block mb-1">
                        {t.lesson.miniProjectDeliverables}
                      </span>
                      <ul className="space-y-1 text-xs font-medium text-[#64748B]">
                        {activeLesson.miniProject.deliverables.map((del, i) => (
                          <li key={i} className="flex items-center gap-1.5">
                            <CheckCircle2 className="h-3.5 w-3.5 text-[#16A34A]" />
                            <InlineFormattedText text={del} />
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* Actions bottom */}
                <div className="pt-4 border-t border-[#FED7AA] flex items-center justify-between gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopy(activeLesson.contentMd)}
                    className="rounded-full border-[#FED7AA] text-xs font-bold text-[#243447]"
                  >
                    {copied ? <Check className="h-3.5 w-3.5 mr-1 text-[#16A34A]" /> : <Copy className="h-3.5 w-3.5 mr-1" />}
                    {copied ? t.common.copied : t.lesson.copyAllContent}
                  </Button>

                  {isCompleted ? (
                    <span className="text-xs font-black text-[#16A34A] flex items-center gap-1 bg-[#DCFCE7] px-3 py-1.5 rounded-full border border-[#86EFAC]">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>{t.lesson.completedNotice}</span>
                    </span>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => setActiveTab("quiz")}
                      className="rounded-full bg-[#FFD84D] hover:bg-[#FFC933] text-[#243447] font-black text-xs px-5 shadow-[0_3px_10px_rgba(255,216,77,0.4)]"
                    >
                      <CircleHelp className="h-3.5 w-3.5 mr-1" />
                      <span>{t.lesson.startQuizAction}</span>
                      <ArrowRight className="h-3.5 w-3.5 ml-1" />
                    </Button>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Tab 2: Quiz Widget */}
            <TabsContent value="quiz" className="pt-2">
              <QuizWidget
                lessonId={activeLesson.id}
                lessonSlug={activeLesson.slug}
                quizzes={activeLesson.quizzes}
              />
            </TabsContent>

            {/* Tab 3: Coding Exercise */}
            <TabsContent value="exercise" className="pt-2">
              {activeLesson.exercise ? (
                <CodeExerciseSandbox
                  lessonId={activeLesson.id}
                  exercise={activeLesson.exercise}
                />
              ) : (
                <div className="p-8 rounded-[32px] bg-white border-2 border-[#FED7AA] text-center space-y-3 shadow-sm">
                  <BookOpen className="h-8 w-8 text-[#5CC8FF] mx-auto" />
                  <h4 className="text-sm font-black text-[#243447]">{t.lesson.theoryOnlyTitle}</h4>
                  <p className="text-xs text-[#64748B] font-medium max-w-sm mx-auto">{t.lesson.theoryOnlyDesc}</p>
                  <Button
                    size="sm"
                    onClick={() => setActiveTab("quiz")}
                    className="rounded-full bg-[#FFD84D] text-[#243447] font-black text-xs"
                  >
                    {t.lesson.openQuizTab}
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>

          {/* Bottom Stage Navigation */}
          <div className="pt-6 border-t-2 border-[#FED7AA] flex items-center justify-between gap-4">
            {prevLessonItem ? (
              <Link href={`/lessons/${prevLessonItem.lesson.slug}`}>
                <Button variant="outline" size="sm" className="rounded-full border-[#FED7AA] text-xs font-bold bg-white text-[#243447] gap-1.5">
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
                  <Button size="sm" className="rounded-full bg-[#FFD84D] hover:bg-[#FFC933] text-[#243447] font-black text-xs px-6 shadow-[0_3px_10px_rgba(255,216,77,0.4)] gap-1.5">
                    <span>{t.lesson.nextLesson}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              ) : (
                <Button size="sm" variant="outline" disabled className="rounded-full border-[#FED7AA] bg-[#FFF8E7] text-[#94A3B8] text-xs font-bold gap-1.5 opacity-60">
                  <Lock className="h-3.5 w-3.5" />
                  <span>{t.lesson.lockedNextLesson}</span>
                </Button>
              )
            )}
          </div>
        </main>

        {/* Right Column: Companion & Spellbook Runes (3 cols) */}
        <aside className="lg:col-span-3 space-y-4 lg:sticky lg:top-20">
          {/* Coding Companion Mini Card */}
          <div className="p-5 rounded-[28px] bg-white border-2 border-[#FED7AA] shadow-[0_10px_30px_rgba(255,155,84,0.08)] space-y-3">
            <CodingCharacter className="w-24 h-24 mx-auto" />
            <div className="text-center space-y-1">
              <span className="text-[10px] font-black text-[#0284C7] uppercase bg-[#EBF8FF] px-2.5 py-0.5 rounded-full border border-[#5CC8FF]/40">
                ⚡ {t.lesson.funSuperTip}
              </span>
              <p className="text-xs text-[#64748B] font-medium leading-relaxed pt-1">
                {activeLesson.whyMatters || (language === "en" ? "Practice coding to solidify your neural pathways!" : "Praktik koding langsung agar logika semakin tajam!")}
              </p>
            </div>
          </div>

          {/* Spellbook Key Terms Runes */}
          {activeLesson.keyTerms && activeLesson.keyTerms.length > 0 && (
            <div className="p-5 rounded-[28px] bg-white border-2 border-[#FED7AA] shadow-[0_10px_30px_rgba(255,155,84,0.08)] space-y-3">
              <div className="flex items-center gap-1.5 text-xs font-black text-[#243447]">
                <BookMarked className="h-4 w-4 text-[#FF9F43]" />
                <span>{t.lesson.keyTerms}</span>
              </div>

              <div className="space-y-2">
                {activeLesson.keyTerms.map((item, i) => (
                  <div key={i} className="p-2.5 rounded-2xl bg-[#FFF8E7] border border-[#FED7AA] text-xs space-y-0.5">
                    <span className="font-black text-[#243447] block">
                      <InlineFormattedText text={item.term} />
                    </span>
                    <span className="text-[11px] font-medium text-[#64748B] block leading-tight">
                      <InlineFormattedText text={item.definition} />
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Career Context */}
          {activeLesson.careerContext && (
            <div className="p-4 rounded-2xl bg-[#EBF8FF] border-2 border-[#5CC8FF]/40 space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-black text-[#0284C7]">
                <Briefcase className="h-3.5 w-3.5" />
                <span>{t.lesson.careerContext}</span>
              </div>
              <p className="text-xs font-medium text-[#0369A1] leading-relaxed">
                <InlineFormattedText text={activeLesson.careerContext} />
              </p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
