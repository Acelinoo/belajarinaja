"use client";

import { useState, use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Copy,
  BookOpen,
  CircleHelp,
  Code2,
  CheckCircle2,
  Bookmark,
  ChevronRight,
  Target,
  Briefcase,
  AlertTriangle,
  BookMarked,
  FolderGit2,
  Info,
  Lock,
  Compass,
  Sparkles,
  Star,
  Flame,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { QuizWidget } from "@/components/interactive/QuizWidget";
import { CodeExerciseSandbox } from "@/components/interactive/CodeExerciseSandbox";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SearchCommandModal } from "@/components/common/SearchCommandModal";
import { MarkdownRenderer, InlineFormattedText } from "@/components/ui/markdown-renderer";
import { CURRICULUM_STAGES, LessonItem, StageItem } from "@/data/curriculum";
import { useGuestProgressStore } from "@/store/useGuestProgressStore";
import { useThemeLanguageStore } from "@/store/useThemeLanguageStore";
import { getTranslations } from "@/lib/translations";
import { QuizLightbulbIllustration } from "@/components/fun/illustrations/QuizLightbulbIllustration";

interface LessonPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function LessonDetailPage({ params }: LessonPageProps) {
  const { slug } = use(params);
  const { theme, language } = useThemeLanguageStore();
  const t = getTranslations(language);

  // Flatten all lessons to calculate previous and next lessons
  const allLessonsWithStage: Array<{
    lesson: LessonItem;
    stage: StageItem;
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

  const [activeTab, setActiveTab] = useState<string>("lesson");
  const [copied, setCopied] = useState(false);
  const [showLockedDialog, setShowLockedDialog] = useState(false);

  const { completedLessons, toggleBookmark, bookmarkedLessons } =
    useGuestProgressStore();

  const isCompleted = Boolean(
    completedLessons[activeLesson.id]?.completed &&
      completedLessons[activeLesson.id]?.passed !== false
  );
  const isBookmarked = bookmarkedLessons.includes(activeLesson.id);

  // Route guard
  const isLessonAccessible = () => {
    if (currentIndex === 0 || activeLesson.prerequisites.length === 0) {
      return true;
    }
    return activeLesson.prerequisites.every((prereqSlug) => {
      const found = allLessonsWithStage.find((item) => item.lesson.slug === prereqSlug);
      if (found) {
        return (
          completedLessons[found.lesson.id]?.completed &&
          completedLessons[found.lesson.id]?.passed !== false
        );
      }
      return true;
    });
  };

  const getFirstUnmetPrereq = () => {
    for (const prereqSlug of activeLesson.prerequisites) {
      const found = allLessonsWithStage.find((item) => item.lesson.slug === prereqSlug);
      if (
        found &&
        (!completedLessons[found.lesson.id]?.completed ||
          completedLessons[found.lesson.id]?.passed === false)
      ) {
        return found.lesson;
      }
    }
    return prevLessonItem ? prevLessonItem.lesson : null;
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const lessonTitle = language === "en" && activeLesson.titleEn ? activeLesson.titleEn : activeLesson.title;
  const lessonDesc = language === "en" && activeLesson.descriptionEn ? activeLesson.descriptionEn : activeLesson.description;
  const stageTitle = language === "en" ? activeStage.titleEn : activeStage.titleId;

  // Direct URL Access Guard
  if (!isLessonAccessible()) {
    const unmetPrereq = getFirstUnmetPrereq();
    const unmetTitle = unmetPrereq ? (language === "en" && unmetPrereq.titleEn ? unmetPrereq.titleEn : unmetPrereq.title) : "";

    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <Navbar />
        <SearchCommandModal />

        <main className="flex-1 py-16 flex items-center justify-center">
          <div className="mx-auto max-w-lg px-4 text-center space-y-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400 mx-auto border border-amber-500/20">
              <Lock className="h-8 w-8" />
            </div>

            <div className="space-y-2">
              <Badge variant="outline" className="text-xs font-mono">
                {t.common.locked} • Mandatory Quiz Gate
              </Badge>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                {t.roadmap.prereqRequired}
              </h1>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {t.roadmap.prereqDesc}
              </p>
            </div>

            {unmetPrereq && (
              <div className="p-4 rounded-xl bg-card border border-border text-left space-y-1.5">
                <span className="text-[11px] font-mono text-muted-foreground uppercase">
                  {t.roadmap.prereqRequired}:
                </span>
                <div className="text-sm font-semibold text-primary">
                  {unmetTitle}
                </div>
                <p className="text-xs text-muted-foreground">
                  {language === "en" && unmetPrereq.descriptionEn ? unmetPrereq.descriptionEn : unmetPrereq.description}
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              {unmetPrereq ? (
                <Link href={`/lessons/${unmetPrereq.slug}`} className="w-full sm:w-auto">
                  <Button size="sm" className="w-full sm:w-auto gap-2 text-xs font-medium">
                    {t.lesson.startQuizAction}: {unmetTitle}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              ) : (
                <Link href="/roadmap" className="w-full sm:w-auto">
                  <Button size="sm" className="w-full sm:w-auto gap-2 text-xs font-medium">
                    <Compass className="h-3.5 w-3.5" />
                    {t.nav.roadmap}
                  </Button>
                </Link>
              )}

              <Link href="/roadmap" className="w-full sm:w-auto">
                <Button size="sm" variant="outline" className="w-full sm:w-auto text-xs">
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
    <div className={`min-h-screen flex flex-col ${theme === "fun" ? "bg-[#FFF8E7] text-[#243447]" : "bg-background text-foreground"}`}>
      <Navbar />
      <SearchCommandModal />

      {/* Breadcrumb Sub-Header */}
      <div className={`border-b-2 py-2.5 ${theme === "fun" ? "bg-white border-[#E2E8F0]" : "border-black bg-white dark:border-b dark:border-[#1C242D] dark:bg-[#05070A]"}`}>
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-1.5 text-xs text-neutral-700 dark:text-[#94A3B8] fun:text-[#64748B] overflow-x-auto font-bold dark:font-normal">
            <Link
              href="/roadmap"
              className="hover:text-foreground transition-colors shrink-0 underline decoration-[#FFD84D] decoration-2 dark:no-underline dark:hover:text-cyan-300 fun:text-[#5CC8FF]"
            >
              {t.nav.roadmap}
            </Link>
            <ChevronRight className="h-3 w-3 shrink-0 text-black dark:text-[#64748B] fun:text-[#94A3B8]" />
            <span className="truncate max-w-[150px] sm:max-w-none">
              {t.common.stage} {String(activeStage.orderIndex).padStart(2, "0")}: {stageTitle}
            </span>
            <ChevronRight className="h-3 w-3 shrink-0 text-black dark:text-[#64748B] fun:text-[#94A3B8]" />
            <span className="text-foreground font-black dark:font-medium dark:text-cyan-300 fun:text-[#243447] truncate max-w-[180px] sm:max-w-none">
              {lessonTitle}
            </span>
          </nav>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => toggleBookmark(activeLesson.id)}
              className={`h-7 text-xs font-bold gap-1.5 border-2 border-black bg-white text-[#121212] shadow-[2px_2px_0px_#121212] hover:bg-[#FFD84D] dark:border dark:border-[#1C242D] dark:bg-[#0F141A] dark:text-[#94A3B8] dark:hover:text-cyan-300 dark:shadow-none ${theme === "fun" ? "fun:border-2 fun:border-[#FED7AA] fun:rounded-full fun:bg-[#FFF8E7] fun:shadow-none" : ""}`}
            >
              <Bookmark
                className={`h-3.5 w-3.5 ${
                  isBookmarked ? "fill-black text-black dark:fill-cyan-400 dark:text-cyan-400 fun:fill-[#FF9F43] fun:text-[#FF9F43]" : ""
                }`}
              />
              <span className="hidden sm:inline">
                {isBookmarked ? t.lesson.savedLesson : t.lesson.saveLesson}
              </span>
            </Button>

            {isCompleted ? (
              <Badge variant="success" className="gap-1 text-[11px] h-6 fun:rounded-full fun:bg-[#DCFCE7] fun:text-[#166534]">
                <CheckCircle2 className="h-3 w-3" />
                {t.common.completed}
              </Badge>
            ) : (
              <Badge variant="warning" className="gap-1 text-[11px] h-6 fun:rounded-full fun:bg-[#FEF3C7] fun:text-[#D97706]">
                <Lock className="h-2.5 w-2.5" />
                {t.lesson.tabQuiz}
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Main Workspace */}
      <main className="flex-1 py-8">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-6">
          {/* Header */}
          <div className={`pb-6 border-b-2 space-y-2 ${theme === "fun" ? "border-[#E2E8F0]" : "border-black dark:border-b dark:border-[#1C242D]"}`}>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-[10px] dark:border-[#1C242D] dark:bg-[#0F141A] dark:text-cyan-300 fun:rounded-full fun:bg-[#FFF8E7] fun:border-[#FED7AA]">
                {activeLesson.level}
              </Badge>
              <span className="text-xs font-bold text-[#555555] dark:font-mono dark:text-[#8292A6] fun:text-[#64748B]">
                {t.lesson.estTime}: {activeLesson.estimatedMinutes} {t.common.minutes}
              </span>
              <span className="text-xs text-black dark:text-[#64748B]">•</span>
              <span className="text-xs font-black text-[#121212] bg-[#FFD84D] px-2 py-0.5 rounded border border-black dark:border dark:border-cyan-500/30 dark:bg-cyan-500/10 dark:text-cyan-300 dark:font-medium fun:rounded-full fun:bg-[#EBF8FF] fun:border-[#5CC8FF]/40 fun:text-[#0284C7]">
                {t.common.stage} {activeStage.orderIndex} ({activeStage.category})
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground fun:text-[#243447]">
              {lessonTitle}
            </h1>

            <p className="text-sm font-medium text-[#555555] dark:font-normal dark:text-[#8292A6] fun:text-[#64748B]">
              {lessonDesc}
            </p>
          </div>

          {/* Pedagogical Header Cards (Objectives & Why It Matters) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeLesson.learningObjectives &&
              activeLesson.learningObjectives.length > 0 && (
                <div className={`p-4 rounded-xl border-2 space-y-2 ${theme === "fun" ? "border-[#FED7AA] bg-white rounded-3xl shadow-[0_4px_15px_rgba(255,155,84,0.08)]" : "border-black bg-white shadow-[4px_4px_0px_#121212] dark:border dark:border-[#1C242D] dark:bg-[#090D12] dark:shadow-none"}`}>
                  <div className="flex items-center gap-2 text-xs font-black text-foreground fun:text-[#243447]">
                    <Target className="h-4 w-4 text-black dark:text-cyan-400 fun:text-[#FF9F43]" />
                    <span>{t.lesson.targetObjectives}</span>
                  </div>
                  <ul className="space-y-1 text-xs font-medium text-[#404040] dark:font-normal dark:text-[#8292A6] fun:text-[#64748B]">
                    {activeLesson.learningObjectives.map((obj, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-black dark:text-cyan-400 fun:text-[#5CC8FF] font-black">•</span>
                        <span>{obj}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

            {activeLesson.whyMatters && (
              <div className={`p-4 rounded-xl border-2 space-y-2 ${theme === "fun" ? "border-[#5CC8FF]/40 bg-white rounded-3xl shadow-[0_4px_15px_rgba(92,200,255,0.08)]" : "border-black bg-white shadow-[4px_4px_0px_#121212] dark:border dark:border-[#1C242D] dark:bg-[#090D12] dark:shadow-none"}`}>
                <div className="flex items-center gap-2 text-xs font-black text-foreground fun:text-[#243447]">
                  <Info className="h-4 w-4 text-amber-800 dark:text-amber-400 fun:text-[#5CC8FF]" />
                  <span>{t.lesson.whyItMatters}</span>
                </div>
                <p className="text-xs font-medium text-[#404040] dark:font-normal dark:text-[#8292A6] fun:text-[#64748B] leading-relaxed">
                  {activeLesson.whyMatters}
                </p>
              </div>
            )}
          </div>

          {/* Interactive Learning Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className={`grid w-full grid-cols-3 max-w-md mb-6 ${theme === "fun" ? "rounded-full bg-white border border-[#E2E8F0] p-1" : ""}`}>
              <TabsTrigger value="lesson" className={`gap-1.5 text-xs font-bold ${theme === "fun" ? "rounded-full" : ""}`}>
                <BookOpen className="h-3.5 w-3.5" />
                {t.lesson.tabLesson}
              </TabsTrigger>
              <TabsTrigger value="quiz" className={`gap-1.5 text-xs font-bold relative ${theme === "fun" ? "rounded-full" : ""}`}>
                <CircleHelp className="h-3.5 w-3.5" />
                {t.lesson.tabQuiz} ({activeLesson.quizzes.length})
                {!isCompleted && (
                  <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF6B6B] dark:bg-cyan-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#FF6B6B] dark:bg-cyan-400 border border-black dark:border-0"></span>
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="exercise" className={`gap-1.5 text-xs font-bold ${theme === "fun" ? "rounded-full" : ""}`}>
                <Code2 className="h-3.5 w-3.5" />
                {t.lesson.tabExercise}
              </TabsTrigger>
            </TabsList>

            {/* Tab 1: Lesson Content */}
            <TabsContent value="lesson" className="space-y-6">
              <div className={`p-6 sm:p-8 rounded-xl border-2 space-y-6 ${theme === "fun" ? "border-[#E2E8F0] bg-white rounded-3xl shadow-[0_10px_35px_rgba(0,0,0,0.03)]" : "border-black bg-white shadow-[6px_6px_0px_#121212] dark:border dark:border-[#1C242D] dark:bg-[#090D12] dark:shadow-none"}`}>
                <div className="max-w-[75ch]">
                  <MarkdownRenderer
                    content={
                      language === "en" && activeLesson.contentMdEn
                        ? activeLesson.contentMdEn
                        : activeLesson.contentMd
                    }
                  />
                </div>

                {/* Common Mistakes Section */}
                {activeLesson.commonMistakes &&
                  activeLesson.commonMistakes.length > 0 && (
                    <div className={`p-4 rounded-lg border-2 space-y-2 ${theme === "fun" ? "rounded-2xl border-[#FECDD3] bg-[#FFF1F2]" : "border-black bg-[#FF6B6B]/20 shadow-[3px_3px_0px_#121212] dark:bg-red-500/10 dark:border dark:border-red-500/30 dark:shadow-none"}`}>
                      <div className="flex items-center gap-2 text-xs font-black text-rose-900 dark:text-red-400">
                        <AlertTriangle className="h-4 w-4" />
                        <span>{t.lesson.commonMistakes}:</span>
                      </div>
                      <ul className="space-y-1 text-xs font-medium text-neutral-900 dark:font-normal dark:text-[#8292A6] fun:text-[#BE123C]">
                        {activeLesson.commonMistakes.map((mistake, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-rose-900 dark:text-red-400 font-bold">•</span>
                            <InlineFormattedText text={mistake} />
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                {/* Key Terms Section */}
                {activeLesson.keyTerms &&
                  activeLesson.keyTerms.length > 0 && (
                    <div className={`p-4 rounded-lg border-2 space-y-2 ${theme === "fun" ? "rounded-2xl border-[#FED7AA] bg-[#FFF8E7]" : "border-black bg-white shadow-[3px_3px_0px_#121212] dark:bg-[#090D12] dark:border dark:border-[#1C242D] dark:shadow-none"}`}>
                      <div className="flex items-center gap-2 text-xs font-black text-foreground fun:text-[#243447]">
                        <BookMarked className="h-4 w-4 text-black dark:text-cyan-400 fun:text-[#FF9F43]" />
                        <span>{t.lesson.keyTerms}:</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                        {activeLesson.keyTerms.map((term, i) => (
                          <div
                            key={i}
                            className={`p-2.5 rounded border-2 text-xs ${theme === "fun" ? "rounded-xl border-[#FED7AA] bg-white" : "border-black bg-[#F7F4EA] shadow-[1.5px_1.5px_0px_#121212] dark:border dark:border-[#1C242D] dark:bg-[#05070A] dark:shadow-none"}`}
                          >
                            <span className="font-black text-black dark:text-cyan-300 fun:text-[#243447] block">
                              <InlineFormattedText text={term.term} />
                            </span>
                            <span className="text-[#555555] dark:text-[#8292A6] fun:text-[#64748B] text-[11px] mt-0.5 block font-medium dark:font-normal">
                              <InlineFormattedText text={term.definition} />
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                {/* Career Context Section */}
                {activeLesson.careerContext && (
                  <div className={`p-4 rounded-lg border-2 space-y-1.5 ${theme === "fun" ? "rounded-2xl border-[#5CC8FF]/40 bg-[#EBF8FF]" : "border-black bg-[#70B7FF]/20 shadow-[3px_3px_0px_#121212] dark:bg-cyan-500/10 dark:border dark:border-cyan-500/30 dark:shadow-none"}`}>
                    <div className="flex items-center gap-2 text-xs font-black text-blue-950 dark:text-cyan-300 fun:text-[#0284C7]">
                      <Briefcase className="h-4 w-4" />
                      <span>{t.lesson.careerContext}:</span>
                    </div>
                    <p className="text-xs font-medium text-blue-950 dark:font-normal dark:text-[#8292A6] fun:text-[#0369A1] leading-relaxed">
                      <InlineFormattedText text={activeLesson.careerContext} />
                    </p>
                  </div>
                )}

                {/* Mini Project Callout */}
                {activeLesson.miniProject && (
                  <div className={`p-5 rounded-xl border-2 space-y-2 ${theme === "fun" ? "rounded-3xl border-[#FED7AA] bg-[#FFF8E7]" : "border-black bg-[#FFD84D]/30 shadow-[4px_4px_0px_#121212] dark:bg-cyan-500/10 dark:border dark:border-cyan-500/40 dark:shadow-none"}`}>
                    <div className="flex items-center gap-2 text-xs font-black text-black dark:text-cyan-300 fun:text-[#243447]">
                      <FolderGit2 className="h-4 w-4 fun:text-[#FF9F43]" />
                      <span><InlineFormattedText text={activeLesson.miniProject.title} /></span>
                    </div>
                    <p className="text-xs font-medium text-[#121212] dark:font-normal dark:text-[#CBD5E1] fun:text-[#64748B]">
                      <InlineFormattedText text={activeLesson.miniProject.description} />
                    </p>
                    <div className="pt-2">
                      <span className="text-[11px] font-black text-black dark:text-cyan-300 fun:text-[#243447] block mb-1">
                        {t.lesson.miniProjectDeliverables}
                      </span>
                      <ul className="space-y-1 text-xs font-medium text-neutral-800 dark:font-normal dark:text-[#8292A6] fun:text-[#64748B]">
                        {activeLesson.miniProject.deliverables.map((del, i) => (
                          <li key={i} className="flex items-center gap-1.5">
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-800 dark:text-emerald-400 fun:text-[#16A34A]" />
                            <InlineFormattedText text={del} />
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* Bottom Actions inside Tab 1 */}
                <div className={`mt-8 pt-6 border-t-2 flex flex-col sm:flex-row items-center justify-between gap-4 ${theme === "fun" ? "border-[#E2E8F0]" : "border-black dark:border-t dark:border-[#1C242D]"}`}>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopy(activeLesson.contentMd)}
                    className={`gap-2 text-xs font-bold w-full sm:w-auto ${theme === "fun" ? "rounded-full border-[#E2E8F0]" : "shadow-[2px_2px_0px_#121212] dark:border dark:border-[#1C242D] dark:bg-[#0F141A] dark:text-[#CBD5E1] dark:hover:text-cyan-300"}`}
                  >
                    {copied ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-800 dark:text-emerald-400" />
                        {t.common.copied}
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        {t.lesson.copyAllContent}
                      </>
                    )}
                  </Button>

                  {/* Mandatory Quiz Action */}
                  {isCompleted ? (
                    <div className={`flex items-center gap-2 text-xs font-black px-3.5 py-1.5 rounded-lg w-full sm:w-auto justify-center ${theme === "fun" ? "rounded-full bg-[#DCFCE7] text-[#166534] border border-[#86EFAC]" : "text-emerald-950 dark:text-emerald-300 bg-[#7BE495]/30 dark:bg-emerald-500/10 border-2 border-black dark:border-emerald-500/30 shadow-[2px_2px_0px_#121212] dark:shadow-none"}`}>
                      <CheckCircle2 className="h-4 w-4 text-emerald-800 dark:text-emerald-400 fun:text-[#16A34A]" />
                      <span>{t.lesson.completedNotice}</span>
                    </div>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => setActiveTab("quiz")}
                      className={`gap-2 text-xs font-black w-full sm:w-auto ${theme === "fun" ? "rounded-full bg-[#FFD84D] hover:bg-[#FFC933] text-[#243447] shadow-[0_4px_12px_rgba(255,216,77,0.4)]" : "shadow-[3px_3px_0px_#121212] dark:border dark:border-cyan-500/40 dark:bg-cyan-500/15 dark:text-cyan-300 dark:hover:bg-cyan-400 dark:hover:text-[#05070A] dark:shadow-none"}`}
                    >
                      <CircleHelp className="h-3.5 w-3.5" />
                      {t.lesson.startQuizAction}
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Tab 2: Quizzes Widget */}
            <TabsContent value="quiz" className="space-y-6">
              <QuizWidget
                lessonId={activeLesson.id}
                lessonSlug={activeLesson.slug}
                quizzes={activeLesson.quizzes}
              />
            </TabsContent>

            {/* Tab 3: Coding Exercise Sandbox */}
            <TabsContent value="exercise" className="space-y-6">
              {activeLesson.exercise ? (
                <CodeExerciseSandbox
                  lessonId={activeLesson.id}
                  exercise={activeLesson.exercise}
                />
              ) : (
                <div className={`p-8 text-center rounded-xl border-2 space-y-2 ${theme === "fun" ? "rounded-3xl border-[#FED7AA] bg-white shadow-[0_8px_25px_rgba(255,155,84,0.08)]" : "border-black bg-white shadow-[5px_5px_0px_#121212] dark:border dark:border-[#1C242D] dark:bg-[#090D12] dark:shadow-none"}`}>
                  <BookOpen className="h-6 w-6 text-black dark:text-cyan-400 fun:text-[#5CC8FF] mx-auto" />
                  <h4 className="text-sm font-black text-foreground fun:text-[#243447]">
                    {t.lesson.theoryOnlyTitle}
                  </h4>
                  <p className="text-xs font-medium text-[#555555] dark:font-normal dark:text-[#8292A6] fun:text-[#64748B] max-w-md mx-auto">
                    {t.lesson.theoryOnlyDesc}
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setActiveTab("quiz")}
                    className={`gap-2 text-xs font-bold mt-2 ${theme === "fun" ? "rounded-full border-[#FED7AA] text-[#243447]" : "shadow-[2px_2px_0px_#121212] dark:border dark:border-[#1C242D] dark:bg-[#0F141A] dark:text-[#CBD5E1] dark:hover:text-cyan-300"}`}
                  >
                    {t.lesson.openQuizTab}
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>

          {/* Previous / Next Lesson Navigation Footer */}
          <div className={`mt-12 pt-6 border-t-2 flex flex-col sm:flex-row items-center justify-between gap-4 ${theme === "fun" ? "border-[#E2E8F0]" : "border-black dark:border-t dark:border-[#1C242D]"}`}>
            {prevLessonItem ? (
              <Link
                href={`/lessons/${prevLessonItem.lesson.slug}`}
                className="w-full sm:w-auto"
              >
                <Button
                  variant="outline"
                  size="sm"
                  className={`w-full sm:w-auto gap-2 text-xs font-bold justify-start ${theme === "fun" ? "rounded-full border-[#E2E8F0] bg-white text-[#243447]" : "shadow-[3px_3px_0px_#121212] dark:border dark:border-[#1C242D] dark:bg-[#0F141A] dark:text-[#CBD5E1] dark:hover:text-cyan-300"}`}
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <div className="text-left">
                    <div className="text-[10px] text-[#555555] dark:text-[#8292A6] uppercase font-mono">
                      {t.lesson.prevLesson}
                    </div>
                    <div className="font-bold text-xs truncate max-w-[200px]">
                      {language === "en" && prevLessonItem.lesson.titleEn ? prevLessonItem.lesson.titleEn : prevLessonItem.lesson.title}
                    </div>
                  </div>
                </Button>
              </Link>
            ) : (
              <div />
            )}

            {nextLessonItem ? (
              isCompleted ? (
                <Link
                  href={`/lessons/${nextLessonItem.lesson.slug}`}
                  className="w-full sm:w-auto"
                >
                  <Button
                    size="sm"
                    className={`w-full sm:w-auto gap-2 text-xs justify-end font-black ${theme === "fun" ? "rounded-full bg-[#FFD84D] hover:bg-[#FFC933] text-[#243447] shadow-[0_4px_12px_rgba(255,216,77,0.4)]" : "shadow-[3px_3px_0px_#121212] dark:border dark:border-cyan-500/40 dark:bg-cyan-500/15 dark:text-cyan-300 dark:hover:bg-cyan-400 dark:hover:text-[#05070A] dark:shadow-none"}`}
                  >
                    <div className="text-right">
                      <div className="text-[10px] uppercase font-mono font-bold">
                        {t.lesson.nextLesson}
                      </div>
                      <div className="font-black text-xs truncate max-w-[200px]">
                        {language === "en" && nextLessonItem.lesson.titleEn ? nextLessonItem.lesson.titleEn : nextLessonItem.lesson.title}
                      </div>
                    </div>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowLockedDialog(true)}
                  className={`w-full sm:w-auto gap-2 text-xs justify-end border-2 ${theme === "fun" ? "rounded-full border-[#FED7AA] bg-[#FFF8E7] text-[#D97706]" : "border-neutral-400 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 shadow-[3px_3px_0px_#888888] dark:border dark:border-[#1C242D] dark:bg-[#090D12] dark:hover:bg-[#0F141A] dark:text-[#8292A6] dark:shadow-none"}`}
                >
                  <div className="text-right">
                    <div className="text-[10px] uppercase font-mono flex items-center justify-end gap-1 font-bold">
                      <Lock className="h-2.5 w-2.5" />
                      {t.common.locked}
                    </div>
                    <div className="font-bold text-xs truncate max-w-[200px] opacity-75">
                      {language === "en" && nextLessonItem.lesson.titleEn ? nextLessonItem.lesson.titleEn : nextLessonItem.lesson.title}
                    </div>
                  </div>
                  <Lock className="h-3.5 w-3.5 text-amber-900 dark:text-amber-400" />
                </Button>
              )
            ) : (
              <Link href="/dashboard">
                <Button size="sm" variant="outline" className={`text-xs font-bold gap-1.5 ${theme === "fun" ? "rounded-full border-[#FED7AA]" : "shadow-[2px_2px_0px_#121212] dark:border dark:border-[#1C242D] dark:bg-[#0F141A] dark:text-[#CBD5E1] dark:hover:text-cyan-300"}`}>
                  {t.hero.ctaDashboard}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </main>

      {/* Locked Next Lesson Modal Prompt */}
      <Dialog open={showLockedDialog} onOpenChange={setShowLockedDialog}>
        <DialogContent className={`max-w-md p-6 bg-white border-2 text-foreground ${theme === "fun" ? "border-[#FED7AA] rounded-3xl shadow-[0_20px_50px_rgba(255,155,84,0.15)]" : "border-black rounded-2xl shadow-[8px_8px_0px_#121212] dark:bg-[#090D12] dark:border dark:border-[#1C242D] dark:shadow-[0_25px_60px_rgba(0,0,0,0.9)]"}`}>
          <DialogHeader className="space-y-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg border-2 border-black bg-[#FFD84D] text-[#121212] shadow-[2px_2px_0px_#121212] mb-2 dark:border dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-400 dark:shadow-none fun:rounded-2xl fun:border-[#FED7AA]">
              <Lock className="h-6 w-6" />
            </div>
            <DialogTitle className="text-lg font-black text-foreground fun:text-[#243447]">
              {t.lesson.quizGateTitle}
            </DialogTitle>
            <DialogDescription className="text-xs font-medium text-[#555555] dark:font-normal dark:text-[#8292A6] fun:text-[#64748B] leading-relaxed">
              {t.lesson.quizGateDesc}
            </DialogDescription>
          </DialogHeader>

          <div className="pt-4 flex items-center justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowLockedDialog(false)}
              className={`text-xs font-bold ${theme === "fun" ? "rounded-full border-[#E2E8F0]" : "dark:border dark:border-[#1C242D] dark:bg-[#0F141A] dark:text-[#CBD5E1]"}`}
            >
              {t.common.close}
            </Button>
            <Button
              size="sm"
              onClick={() => {
                setShowLockedDialog(false);
                setActiveTab("quiz");
              }}
              className={`gap-1.5 text-xs font-black ${theme === "fun" ? "rounded-full bg-[#FFD84D] text-[#243447]" : "shadow-[2px_2px_0px_#121212] dark:border dark:border-cyan-500/40 dark:bg-cyan-500/15 dark:text-cyan-300 dark:hover:bg-cyan-400 dark:hover:text-[#05070A] dark:shadow-none"}`}
            >
              <CircleHelp className="h-3.5 w-3.5" />
              {t.lesson.takeQuizNow}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}

