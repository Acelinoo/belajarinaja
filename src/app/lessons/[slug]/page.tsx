"use client";

import { use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SearchCommandModal } from "@/components/common/SearchCommandModal";
import { FunLessonRoom } from "@/components/fun/FunLessonRoom";
import { DarkTerminalLessonWorkspace } from "@/components/dark/DarkTerminalLessonWorkspace";
import { LightNeoLessonWorkspace } from "@/components/light/LightNeoLessonWorkspace";
import { CURRICULUM_STAGES } from "@/data/curriculum";
import { useCurriculumProgressStore } from "@/store/useCurriculumProgressStore";
import { useThemeLanguageStore } from "@/store/useThemeLanguageStore";
import { getTranslations } from "@/lib/translations";
import { Button } from "@/components/ui/button";
import { Lock, ArrowRight, Compass } from "lucide-react";
import type { Lesson, Stage } from "@/types/curriculum";

interface LessonPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function LessonDetailPage({ params }: LessonPageProps) {
  const { slug } = use(params);
  const { theme, language } = useThemeLanguageStore();
  const t = getTranslations(language);
  const { completedLessons, isLessonUnlocked } = useCurriculumProgressStore();

  // Flatten all lessons with stage context
  const allLessonsWithStage: Array<{
    lesson: Lesson;
    stage: Stage;
  }> = [];

  CURRICULUM_STAGES.forEach((stage) => {
    stage.lessons.forEach((lesson) => {
      allLessonsWithStage.push({ lesson, stage });
    });
  });

  const currentIndex = allLessonsWithStage.findIndex(
    (item) => item.lesson.slug === slug
  );

  if (currentIndex === -1) {
    notFound();
  }

  const { lesson: activeLesson, stage: activeStage } =
    allLessonsWithStage[currentIndex];
  const prevLessonItem =
    currentIndex > 0 ? allLessonsWithStage[currentIndex - 1] : null;
  const nextLessonItem =
    currentIndex < allLessonsWithStage.length - 1
      ? allLessonsWithStage[currentIndex + 1]
      : null;

  // Route guard: Check if lesson is unlocked
  const isUnlocked = isLessonUnlocked(activeLesson.id);

  if (!isUnlocked) {
    const firstPrereqSlug = activeLesson.prerequisites[0];
    const unmetPrereq = firstPrereqSlug
      ? allLessonsWithStage.find((item) => item.lesson.slug === firstPrereqSlug)?.lesson
      : prevLessonItem?.lesson;
    const unmetTitle = unmetPrereq
      ? (language === "en" && unmetPrereq.titleEn ? unmetPrereq.titleEn : unmetPrereq.title)
      : "";

    return (
      <div className={`min-h-screen flex flex-col ${
        theme === "fun"
          ? "bg-[#FFF8E7] text-[#243447]"
          : theme === "dark"
          ? "bg-[#050505] text-[#FFFFFF] font-mono"
          : "bg-[#F7F4EA] text-[#121212]"
      }`}>
        <Navbar />
        <SearchCommandModal />

        <main className="flex-1 py-16 flex items-center justify-center">
          <div className="mx-auto max-w-lg px-4 text-center space-y-6">
            <div className={`flex h-16 w-16 items-center justify-center rounded-2xl mx-auto border-2 ${
              theme === "fun"
                ? "border-[#FED7AA] bg-white text-[#D97706]"
                : theme === "dark"
                ? "border-[#333333] bg-[#111111] text-[#FFFFFF]"
                : "border-black bg-[#FFD84D] text-[#121212]"
            }`}>
              <Lock className="h-8 w-8" />
            </div>

            <div className="space-y-2">
              <h1 className="text-xl sm:text-2xl font-black">
                {t.roadmap.prereqRequired}
              </h1>
              <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed">
                {t.roadmap.prereqDesc}
              </p>
            </div>

            {unmetPrereq && (
              <div className={`p-4 rounded-xl text-left space-y-1.5 border-2 ${
                theme === "fun"
                  ? "bg-white border-[#FED7AA]"
                  : theme === "dark"
                  ? "bg-[#0A0A0A] border-[#222222]"
                  : "bg-white border-black"
              }`}>
                <span className="text-[11px] font-bold uppercase opacity-70">
                  {t.roadmap.prereqRequired}:
                </span>
                <div className="text-sm font-black">
                  {unmetTitle}
                </div>
              </div>
            )}

            <div className="flex items-center justify-center gap-3 pt-2">
              {unmetPrereq ? (
                <Link href={`/lessons/${unmetPrereq.slug}`}>
                  <Button size="sm" className="gap-2 text-xs font-bold">
                    <span>{t.lesson.startQuizAction}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              ) : (
                <Link href="/roadmap">
                  <Button size="sm" className="gap-2 text-xs font-bold">
                    <Compass className="h-3.5 w-3.5" />
                    <span>{t.nav.roadmap}</span>
                  </Button>
                </Link>
              )}

              <Link href="/roadmap">
                <Button size="sm" variant="outline" className="text-xs">
                  {t.common.back}
                </Button>
              </Link>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex flex-col ${
      theme === "fun"
        ? "bg-[#FFF8E7] text-[#243447]"
        : theme === "dark"
        ? "bg-[#050505] text-[#FFFFFF]"
        : "bg-[#F7F4EA] text-[#121212]"
    }`}>
      <Navbar />
      <SearchCommandModal />

      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {theme === "fun" ? (
            <FunLessonRoom
              activeLesson={activeLesson}
              activeStage={activeStage}
              prevLessonItem={prevLessonItem}
              nextLessonItem={nextLessonItem}
            />
          ) : theme === "dark" ? (
            <DarkTerminalLessonWorkspace
              activeLesson={activeLesson}
              activeStage={activeStage}
              prevLessonItem={prevLessonItem}
              nextLessonItem={nextLessonItem}
            />
          ) : (
            <LightNeoLessonWorkspace
              activeLesson={activeLesson}
              activeStage={activeStage}
              prevLessonItem={prevLessonItem}
              nextLessonItem={nextLessonItem}
            />
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
