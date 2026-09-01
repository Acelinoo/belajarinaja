"use client";

import { useMemo } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SearchCommandModal } from "@/components/common/SearchCommandModal";
import { FunDashboardHeadquarters } from "@/components/fun/FunDashboardHeadquarters";
import { DarkTelemetryDashboard } from "@/components/dark/DarkTelemetryDashboard";
import { LightNeoDashboard } from "@/components/light/LightNeoDashboard";
import { CURRICULUM_STAGES } from "@/data/curriculum";
import { useCurriculumProgressStore } from "@/store/useCurriculumProgressStore";
import { useThemeLanguageStore } from "@/store/useThemeLanguageStore";
import type { Lesson } from "@/types/curriculum";

export default function DashboardPage() {
  const { theme } = useThemeLanguageStore();
  const { completedLessons } = useCurriculumProgressStore();

  const allLessons = useMemo(() => {
    const lessons: Array<Lesson & { stageOrder: number; stageTitle: string; category: string }> = [];
    CURRICULUM_STAGES.forEach((stage) => {
      stage.lessons.forEach((lesson) => {
        lessons.push({
          ...lesson,
          stageOrder: stage.orderIndex,
          stageTitle: stage.titleId,
          category: stage.category,
        });
      });
    });
    return lessons;
  }, []);

  const totalLessons = allLessons.length;
  const completedCount = useMemo(() => {
    return Object.values(completedLessons).filter((item) => item.completed).length;
  }, [completedLessons]);

  const percentage = Math.round((completedCount / (totalLessons || 1)) * 100);

  const categories = useMemo(() => {
    return Array.from(new Set(allLessons.map((l) => l.category)));
  }, [allLessons]);

  const resumeLesson = useMemo(() => {
    return allLessons.find((l) => !completedLessons[l.id]?.completed) || null;
  }, [allLessons, completedLessons]);

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

      <main className="flex-1 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {theme === "fun" ? (
            <FunDashboardHeadquarters
              totalLessons={totalLessons}
              completedCount={completedCount}
              percentage={percentage}
              allLessons={allLessons}
              categories={categories}
              resumeLesson={resumeLesson}
            />
          ) : theme === "dark" ? (
            <DarkTelemetryDashboard
              totalLessons={totalLessons}
              completedCount={completedCount}
              percentage={percentage}
              allLessons={allLessons}
              categories={categories}
              resumeLesson={resumeLesson}
            />
          ) : (
            <LightNeoDashboard
              totalLessons={totalLessons}
              completedCount={completedCount}
              percentage={percentage}
              allLessons={allLessons}
              categories={categories}
              resumeLesson={resumeLesson}
            />
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
