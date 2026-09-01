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
  Compass,
  Bookmark,
  CheckCircle2,
  Lock,
  ArrowRight,
  ArrowLeft,
  CircleHelp,
  Code2,
  BookOpen,
  Sparkles,
  Star,
  Zap,
} from "lucide-react";
import { NovaCharacter } from "./characters/NovaCharacter";
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

  const [activeTab, setActiveTab] = useState<"story" | "experiment" | "quiz">("story");

  const isCompleted = !!completedLessons[activeLesson.id]?.completed;
  const isBookmarked = bookmarkedLessons.includes(activeLesson.id);

  const lessonTitle = language === "en" && activeLesson.titleEn ? activeLesson.titleEn : activeLesson.title;
  const lessonDesc = language === "en" && activeLesson.descriptionEn ? activeLesson.descriptionEn : activeLesson.description;
  const stageTitle = language === "en" && activeStage.titleEn ? activeStage.titleEn : activeStage.titleId;

  const exercise = getExerciseForLesson(activeLesson.id, activeLesson.slug, lessonTitle);

  return (
    <div className="space-y-8">
      {/* Top Story Header & Adventure Navigator */}
      <div className="p-4 sm:p-6 rounded-[32px] border-2 border-[#FED7AA] bg-white shadow-[0_10px_30px_rgba(255,155,84,0.08)] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/roadmap" className="flex items-center gap-1.5 text-xs font-black text-[#D97706] hover:underline">
            <Compass className="h-4 w-4" />
            <span>Peta Petualangan</span>
          </Link>
          <span className="text-[#FED7AA] font-black">/</span>
          <span className="text-xs font-bold text-[#64748B]">Tahap {activeStage.orderIndex}: {stageTitle}</span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => toggleBookmark(activeLesson.id)}
            className={`rounded-full text-xs font-black h-8 px-4 border-[#FED7AA] gap-1.5 ${
              isBookmarked ? "bg-[#FFF8E7] text-[#D97706]" : "bg-white text-[#64748B]"
            }`}
          >
            <Bookmark className={`h-3.5 w-3.5 ${isBookmarked ? "fill-[#D97706] text-[#D97706]" : ""}`} />
            <span>{isBookmarked ? "Tersimpan" : "Simpan Misi"}</span>
          </Button>

          {isCompleted && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ECFDF5] border border-[#A7F3D0] text-[11px] font-black text-[#059669]">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Misi Selesai</span>
            </div>
          )}
        </div>
      </div>

      {/* 3-Step Journey Navigation Tabs */}
      <div className="flex justify-center">
        <div className="inline-flex p-1.5 rounded-full border-2 border-[#FED7AA] bg-white shadow-sm gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("story")}
            className={`px-5 py-2 rounded-full text-xs font-black transition-all flex items-center gap-2 ${
              activeTab === "story"
                ? "bg-[#FFD84D] text-[#243447] shadow-[0_2px_10px_rgba(255,216,77,0.4)]"
                : "text-[#64748B] hover:text-[#243447]"
            }`}
          >
            <BookOpen className="h-4 w-4 text-[#D97706]" />
            <span>1. Kisah & Materi</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("experiment")}
            className={`px-5 py-2 rounded-full text-xs font-black transition-all flex items-center gap-2 ${
              activeTab === "experiment"
                ? "bg-[#5CC8FF] text-[#243447] shadow-[0_2px_10px_rgba(92,200,255,0.4)]"
                : "text-[#64748B] hover:text-[#243447]"
            }`}
          >
            <Code2 className="h-4 w-4 text-[#0284C7]" />
            <span>2. Laboratorium Koding</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("quiz")}
            className={`px-5 py-2 rounded-full text-xs font-black transition-all flex items-center gap-2 ${
              activeTab === "quiz"
                ? "bg-[#45E0C0] text-[#243447] shadow-[0_2px_10px_rgba(69,224,192,0.4)]"
                : "text-[#64748B] hover:text-[#243447]"
            }`}
          >
            <CircleHelp className="h-4 w-4 text-[#059669]" />
            <span>3. Uji Pemahaman ({activeLesson.quizzes.length})</span>
          </button>
        </div>
      </div>

      {/* Main Content Pane */}
      <div className="max-w-4xl mx-auto space-y-6">
        {activeTab === "story" && (
          <div className="space-y-6 animate-in fade-in">
            {/* Story Hook Banner */}
            <div className="p-8 rounded-[36px] border-3 border-[#FED7AA] bg-gradient-to-b from-[#FFF8E7] to-white shadow-[0_15px_40px_rgba(255,155,84,0.08)] flex flex-col sm:flex-row items-center gap-6">
              <NovaCharacter state="curious" className="w-24 h-24 shrink-0" />
              <div className="space-y-2 text-center sm:text-left flex-1">
                <span className="text-[10px] font-black text-[#D97706] bg-white px-3 py-1 rounded-full border border-[#FED7AA] inline-block">
                  📜 KISAH PETUALANGAN #{activeLesson.slug}
                </span>
                <h1 className="text-2xl sm:text-3xl font-black text-[#243447] leading-tight">
                  {lessonTitle}
                </h1>
                <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed font-medium">
                  {lessonDesc}
                </p>
              </div>
            </div>

            {/* Markdown Text Scene */}
            <div className="p-8 sm:p-10 rounded-[36px] border-2 border-[#FED7AA] bg-white shadow-[0_10px_35px_rgba(255,155,84,0.05)] space-y-6">
              <MarkdownRenderer
                content={
                  language === "en" && activeLesson.contentMdEn
                    ? activeLesson.contentMdEn
                    : activeLesson.contentMd
                }
              />
            </div>

            {/* Call to Experiment Action */}
            <div className="p-6 rounded-[28px] border-2 border-[#5CC8FF] bg-[#F0F9FF] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <NovaCharacter state="excited" className="w-14 h-14 shrink-0" />
                <div>
                  <h4 className="text-sm font-black text-[#0369A1]">Siap Menguji Mantra Koding?</h4>
                  <p className="text-xs text-[#0284C7] font-medium">Buka Laboratorium untuk mempraktikkan materi ini secara nyata!</p>
                </div>
              </div>

              <Button
                onClick={() => setActiveTab("experiment")}
                className="rounded-full bg-[#5CC8FF] hover:bg-[#45B8F0] text-[#243447] font-black text-xs h-10 px-6 shadow-[0_3px_12px_rgba(92,200,255,0.35)]"
              >
                <span>Buka Laboratorium</span>
                <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            </div>
          </div>
        )}

        {activeTab === "experiment" && (
          <div className="animate-in fade-in space-y-6">
            <RealSandboxEngine
              lessonId={activeLesson.id}
              exercise={exercise}
            />

            <div className="flex justify-end">
              <Button
                onClick={() => setActiveTab("quiz")}
                className="rounded-full bg-[#45E0C0] hover:bg-[#34D399] text-[#243447] font-black text-xs h-10 px-6 gap-1.5"
              >
                <span>Lanjut ke Quiz Evaluasi</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {activeTab === "quiz" && (
          <div className="animate-in fade-in space-y-6">
            <QuizWidget
              lessonId={activeLesson.id}
              lessonSlug={activeLesson.slug}
              quizzes={activeLesson.quizzes}
            />
          </div>
        )}

        {/* Navigation Between Chapters */}
        <div className="pt-4 flex items-center justify-between gap-4">
          {prevLessonItem ? (
            <Link href={`/lessons/${prevLessonItem.lesson.slug}`}>
              <Button
                variant="outline"
                className="rounded-full border-[#FED7AA] bg-white text-[#64748B] hover:text-[#243447] font-black text-xs h-10 px-5 gap-1.5"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Misi Sebelumnya</span>
              </Button>
            </Link>
          ) : (
            <div />
          )}

          {nextLessonItem && (
            isCompleted ? (
              <Link href={`/lessons/${nextLessonItem.lesson.slug}`}>
                <Button className="rounded-full bg-[#FFD84D] hover:bg-[#FFC933] text-[#243447] font-black text-xs h-10 px-6 shadow-[0_4px_16px_rgba(255,216,77,0.4)] gap-1.5">
                  <span>Misi Berikutnya</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            ) : (
              <Button
                disabled
                variant="outline"
                className="rounded-full border-[#E2E8F0] bg-white text-[#94A3B8] font-bold text-xs h-10 px-5 opacity-60 gap-1.5"
              >
                <Lock className="h-3.5 w-3.5" />
                <span>Misi Berikutnya (Selesaikan Quiz)</span>
              </Button>
            )
          )}
        </div>
      </div>
    </div>
  );
}
