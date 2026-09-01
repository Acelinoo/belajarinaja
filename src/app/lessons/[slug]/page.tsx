"use client";

import { use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SearchCommandModal } from "@/components/common/SearchCommandModal";
import { UnifiedLessonWorkspace } from "@/components/lesson/UnifiedLessonWorkspace";
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
  const { language } = useThemeLanguageStore();
  const t = getTranslations(language);
  const { isLessonUnlocked } = useCurriculumProgressStore();

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
      <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors">
        <Navbar />
        <SearchCommandModal />

        <main className="flex-1 py-16 flex items-center justify-center">
          <div className="mx-auto max-w-lg px-4 text-center space-y-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl mx-auto border border-border bg-secondary text-primary">
              <Lock className="h-8 w-8" />
            </div>

            <div className="space-y-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-foreground">
                {t.roadmap.prereqRequired}
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {language === "en"
                  ? `You must complete the prerequisite lesson "${unmetTitle}" with an 80% passing grade to unlock this stage.`
                  : `Anda harus menyelesaikan materi prasyarat "${unmetTitle}" dengan nilai kelulusan 80% terlebih dahulu untuk membuka materi ini.`}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              {unmetPrereq && (
                <Link href={`/lessons/${unmetPrereq.slug}`}>
                  <Button className="h-10 text-xs font-bold rounded-md px-5 gap-1.5">
                    <span>Selesaikan "{unmetTitle}"</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              )}

              <Link href="/roadmap">
                <Button variant="outline" className="h-10 text-xs font-semibold rounded-md px-5">
                  <Compass className="h-3.5 w-3.5 mr-1" />
                  <span>{t.nav.roadmap}</span>
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
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors">
      <Navbar />
      <SearchCommandModal />

      <main className="flex-1 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <UnifiedLessonWorkspace
            activeLesson={activeLesson}
            activeStage={activeStage}
            prevLessonItem={prevLessonItem}
            nextLessonItem={nextLessonItem}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
