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
  HelpCircle,
  Code,
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

interface LessonPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function LessonDetailPage({ params }: LessonPageProps) {
  const { slug } = use(params);
  const { language } = useThemeLanguageStore();

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

  // Helper to check if this lesson's prerequisites are met (Route Guard)
  const isLessonAccessible = () => {
    // Lesson 1 is always accessible
    if (currentIndex === 0 || activeLesson.prerequisites.length === 0) {
      return true;
    }
    // Check prerequisites
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

  // Direct URL Access Guard: If current lesson is locked, show barrier screen
  if (!isLessonAccessible()) {
    const unmetPrereq = getFirstUnmetPrereq();

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
                Akses Terkunci • Mandatory Quiz Gate
              </Badge>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                Materi Belum Tersedia
              </h1>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Anda belum dapat membuka materi <strong className="text-foreground">&quot;{activeLesson.title}&quot;</strong> karena belum menyelesaikan quiz evaluasi pada materi prasyarat.
              </p>
            </div>

            {unmetPrereq && (
              <div className="p-4 rounded-xl bg-card border border-border text-left space-y-1.5">
                <span className="text-[11px] font-mono text-muted-foreground uppercase">
                  Prasyarat yang Belum Selesai:
                </span>
                <div className="text-sm font-semibold text-primary">
                  {unmetPrereq.title}
                </div>
                <p className="text-xs text-muted-foreground">
                  {unmetPrereq.description}
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              {unmetPrereq ? (
                <Link href={`/lessons/${unmetPrereq.slug}`} className="w-full sm:w-auto">
                  <Button size="sm" className="w-full sm:w-auto gap-2 text-xs font-medium">
                    Kerjakan Quiz: {unmetPrereq.title}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              ) : (
                <Link href="/roadmap" className="w-full sm:w-auto">
                  <Button size="sm" className="w-full sm:w-auto gap-2 text-xs font-medium">
                    <Compass className="h-3.5 w-3.5" />
                    Buka Roadmap
                  </Button>
                </Link>
              )}

              <Link href="/roadmap" className="w-full sm:w-auto">
                <Button size="sm" variant="outline" className="w-full sm:w-auto text-xs">
                  Kembali ke Roadmap
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
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />
      <SearchCommandModal />

      {/* Breadcrumb Sub-Header */}
      <div className="border-b-2 border-black bg-white py-2.5 dark:border-border/80 dark:bg-card/40">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-1.5 text-xs text-neutral-700 dark:text-muted-foreground overflow-x-auto font-bold dark:font-normal">
            <Link
              href="/roadmap"
              className="hover:text-foreground transition-colors shrink-0 underline decoration-[#FFD84D] decoration-2 dark:no-underline"
            >
              Roadmap
            </Link>
            <ChevronRight className="h-3 w-3 shrink-0 text-black dark:text-muted-foreground" />
            <span className="truncate max-w-[150px] sm:max-w-none">
              Tahap {String(activeStage.orderIndex).padStart(2, "0")}:{" "}
              {language === "en" ? activeStage.titleEn : activeStage.titleId}
            </span>
            <ChevronRight className="h-3 w-3 shrink-0 text-black dark:text-muted-foreground" />
            <span className="text-foreground font-black dark:font-medium truncate max-w-[180px] sm:max-w-none">
              {language === "en" && activeLesson.titleEn
                ? activeLesson.titleEn
                : activeLesson.title}
            </span>
          </nav>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => toggleBookmark(activeLesson.id)}
              className="h-7 text-xs font-bold gap-1.5 border-2 border-black bg-white text-[#121212] shadow-[2px_2px_0px_#121212] hover:bg-[#FFD84D] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none dark:border-transparent dark:bg-transparent dark:text-muted-foreground dark:hover:text-foreground dark:shadow-none"
            >
              <Bookmark
                className={`h-3.5 w-3.5 ${
                  isBookmarked ? "fill-black text-black dark:fill-primary dark:text-primary" : ""
                }`}
              />
              <span className="hidden sm:inline">
                {isBookmarked ? "Tersimpan" : "Simpan"}
              </span>
            </Button>

            {isCompleted ? (
              <Badge variant="success" className="gap-1 text-[11px] h-6">
                <CheckCircle2 className="h-3 w-3" />
                Lulus & Selesai
              </Badge>
            ) : (
              <Badge variant="warning" className="gap-1 text-[11px] h-6">
                <Lock className="h-2.5 w-2.5" />
                Quiz Wajib
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Main Workspace */}
      <main className="flex-1 py-8">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-6">
          {/* Header */}
          <div className="pb-6 border-b-2 border-black dark:border-border space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-[10px]">
                {activeLesson.level}
              </Badge>
              <span className="text-xs font-bold text-[#555555] dark:font-normal dark:text-muted-foreground">
                Estimasi {activeLesson.estimatedMinutes} menit belajar
              </span>
              <span className="text-xs text-black dark:text-muted-foreground">•</span>
              <span className="text-xs font-black text-[#121212] bg-[#FFD84D] px-2 py-0.5 rounded border border-black dark:border-0 dark:bg-transparent dark:text-primary dark:font-medium dark:p-0">
                Tahap {activeStage.orderIndex} ({activeStage.category})
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
              {language === "en" && activeLesson.titleEn
                ? activeLesson.titleEn
                : activeLesson.title}
            </h1>

            <p className="text-sm font-medium text-[#555555] dark:font-normal dark:text-muted-foreground">
              {language === "en" && activeLesson.descriptionEn
                ? activeLesson.descriptionEn
                : activeLesson.description}
            </p>
          </div>

          {/* Pedagogical Header Cards (Objectives & Why It Matters) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeLesson.learningObjectives &&
              activeLesson.learningObjectives.length > 0 && (
                <div className="p-4 rounded-xl border-2 border-black bg-white shadow-[4px_4px_0px_#121212] space-y-2 dark:border-border dark:bg-card/60 dark:shadow-none">
                  <div className="flex items-center gap-2 text-xs font-black text-foreground">
                    <Target className="h-4 w-4 text-black dark:text-primary" />
                    <span>Target Pembelajaran:</span>
                  </div>
                  <ul className="space-y-1 text-xs font-medium text-[#404040] dark:font-normal dark:text-muted-foreground">
                    {activeLesson.learningObjectives.map((obj, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-black dark:text-primary font-black">•</span>
                        <span>{obj}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

            {activeLesson.whyMatters && (
              <div className="p-4 rounded-xl border-2 border-black bg-white shadow-[4px_4px_0px_#121212] space-y-2 dark:border-border dark:bg-card/60 dark:shadow-none">
                <div className="flex items-center gap-2 text-xs font-black text-foreground">
                  <Info className="h-4 w-4 text-amber-800 dark:text-amber-400" />
                  <span>Mengapa Materi Ini Penting?</span>
                </div>
                <p className="text-xs font-medium text-[#404040] dark:font-normal dark:text-muted-foreground leading-relaxed">
                  {activeLesson.whyMatters}
                </p>
              </div>
            )}
          </div>

          {/* Interactive Learning Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 max-w-md mb-6">
              <TabsTrigger value="lesson" className="gap-1.5 text-xs font-bold">
                <BookOpen className="h-3.5 w-3.5" />
                Materi Teks
              </TabsTrigger>
              <TabsTrigger value="quiz" className="gap-1.5 text-xs font-bold relative">
                <HelpCircle className="h-3.5 w-3.5" />
                Quiz ({activeLesson.quizzes.length})
                {!isCompleted && (
                  <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF6B6B] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#FF6B6B] border border-black"></span>
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="exercise" className="gap-1.5 text-xs font-bold">
                <Code className="h-3.5 w-3.5" />
                Latihan Kode
              </TabsTrigger>
            </TabsList>

            {/* Tab 1: Lesson Content */}
            <TabsContent value="lesson" className="space-y-6">
              <div className="p-6 sm:p-8 rounded-xl border-2 border-black bg-white shadow-[6px_6px_0px_#121212] space-y-6 dark:border-border dark:bg-card dark:shadow-none">
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
                    <div className="p-4 rounded-lg bg-[#FF6B6B]/20 border-2 border-black shadow-[3px_3px_0px_#121212] space-y-2 dark:bg-rose-500/10 dark:border-rose-500/30 dark:shadow-none">
                      <div className="flex items-center gap-2 text-xs font-black text-rose-900 dark:text-rose-400">
                        <AlertTriangle className="h-4 w-4" />
                        <span>Kesalahan yang Sering Dilakukan Pemula:</span>
                      </div>
                      <ul className="space-y-1 text-xs font-medium text-neutral-900 dark:font-normal dark:text-muted-foreground">
                        {activeLesson.commonMistakes.map((mistake, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-rose-900 dark:text-rose-400 font-bold">•</span>
                            <InlineFormattedText text={mistake} />
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                {/* Key Terms Section */}
                {activeLesson.keyTerms &&
                  activeLesson.keyTerms.length > 0 && (
                    <div className="p-4 rounded-lg bg-white border-2 border-black shadow-[3px_3px_0px_#121212] space-y-2 dark:bg-card dark:border-border dark:shadow-none">
                      <div className="flex items-center gap-2 text-xs font-black text-foreground">
                        <BookMarked className="h-4 w-4 text-black dark:text-primary" />
                        <span>Istilah Kunci (Key Terms):</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                        {activeLesson.keyTerms.map((term, i) => (
                          <div
                            key={i}
                            className="p-2.5 rounded border-2 border-black bg-[#F7F4EA] text-xs shadow-[1.5px_1.5px_0px_#121212] dark:border-border/60 dark:bg-background/50 dark:shadow-none"
                          >
                            <span className="font-black text-black dark:text-primary block">
                              <InlineFormattedText text={term.term} />
                            </span>
                            <span className="text-[#555555] dark:text-muted-foreground text-[11px] mt-0.5 block font-medium dark:font-normal">
                              <InlineFormattedText text={term.definition} />
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                {/* Career Context Section */}
                {activeLesson.careerContext && (
                  <div className="p-4 rounded-lg bg-[#70B7FF]/20 border-2 border-black shadow-[3px_3px_0px_#121212] space-y-1.5 dark:bg-[#121318] dark:border-primary/30 dark:shadow-none">
                    <div className="flex items-center gap-2 text-xs font-black text-blue-950 dark:text-primary">
                      <Briefcase className="h-4 w-4" />
                      <span>Digunakan di Dunia Kerja:</span>
                    </div>
                    <p className="text-xs font-medium text-blue-950 dark:font-normal dark:text-muted-foreground leading-relaxed">
                      <InlineFormattedText text={activeLesson.careerContext} />
                    </p>
                  </div>
                )}

                {/* Mini Project Callout */}
                {activeLesson.miniProject && (
                  <div className="p-5 rounded-xl bg-[#FFD84D]/30 border-2 border-black shadow-[4px_4px_0px_#121212] space-y-2 dark:bg-gradient-to-r dark:from-primary/10 dark:to-indigo-500/10 dark:border-primary/40 dark:shadow-none">
                    <div className="flex items-center gap-2 text-xs font-black text-black dark:text-primary">
                      <FolderGit2 className="h-4 w-4" />
                      <span><InlineFormattedText text={activeLesson.miniProject.title} /></span>
                    </div>
                    <p className="text-xs font-medium text-[#121212] dark:font-normal dark:text-foreground">
                      <InlineFormattedText text={activeLesson.miniProject.description} />
                    </p>
                    <div className="pt-2">
                      <span className="text-[11px] font-black text-black dark:text-muted-foreground block mb-1">
                        Target Hasil (Deliverables):
                      </span>
                      <ul className="space-y-1 text-xs font-medium text-neutral-800 dark:font-normal dark:text-muted-foreground">
                        {activeLesson.miniProject.deliverables.map((del, i) => (
                          <li key={i} className="flex items-center gap-1.5">
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-800 dark:text-emerald-400" />
                            <InlineFormattedText text={del} />
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* Bottom Actions inside Tab 1 */}
                <div className="mt-8 pt-6 border-t-2 border-black dark:border-border flex flex-col sm:flex-row items-center justify-between gap-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopy(activeLesson.contentMd)}
                    className="gap-2 text-xs font-bold w-full sm:w-auto shadow-[2px_2px_0px_#121212]"
                  >
                    {copied ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-800 dark:text-emerald-400" />
                        Tersalin!
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        Salin Seluruh Materi
                      </>
                    )}
                  </Button>

                  {/* Mandatory Quiz Action (Replaces manual completion button) */}
                  {isCompleted ? (
                    <div className="flex items-center gap-2 text-xs text-emerald-950 dark:text-emerald-400 font-black bg-[#7BE495]/30 dark:bg-emerald-500/10 border-2 border-black dark:border-emerald-500/30 px-3.5 py-1.5 rounded-lg w-full sm:w-auto justify-center shadow-[2px_2px_0px_#121212] dark:shadow-none">
                      <CheckCircle2 className="h-4 w-4 text-emerald-800 dark:text-emerald-400" />
                      <span>Materi Selesai (Quiz Lulus)</span>
                    </div>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => setActiveTab("quiz")}
                      className="gap-2 text-xs font-black w-full sm:w-auto shadow-[3px_3px_0px_#121212]"
                    >
                      <HelpCircle className="h-3.5 w-3.5" />
                      Kerjakan Quiz Evaluasi
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
                <div className="p-8 text-center rounded-xl border-2 border-black bg-white shadow-[5px_5px_0px_#121212] space-y-2 dark:border-border dark:bg-card dark:shadow-none">
                  <BookOpen className="h-6 w-6 text-black dark:text-muted-foreground/50 mx-auto" />
                  <h4 className="text-sm font-black text-foreground">
                    Modul Teori & Pemahaman Arsitektur
                  </h4>
                  <p className="text-xs font-medium text-[#555555] dark:font-normal dark:text-muted-foreground max-w-md mx-auto">
                    Materi ini berfokus pada pemahaman konseptual dan arsitektur sistem. Selesaikan quiz evaluasi di tab Quiz untuk menyelesaikan materi.
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setActiveTab("quiz")}
                    className="gap-2 text-xs font-bold mt-2 shadow-[2px_2px_0px_#121212]"
                  >
                    Buka Quiz Evaluasi
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>

          {/* Previous / Next Lesson Navigation Footer */}
          <div className="mt-12 pt-6 border-t-2 border-black dark:border-border flex flex-col sm:flex-row items-center justify-between gap-4">
            {prevLessonItem ? (
              <Link
                href={`/lessons/${prevLessonItem.lesson.slug}`}
                className="w-full sm:w-auto"
              >
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full sm:w-auto gap-2 text-xs font-bold justify-start shadow-[3px_3px_0px_#121212]"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <div className="text-left">
                    <div className="text-[10px] text-[#555555] dark:text-muted-foreground uppercase font-mono">
                      Materi Sebelumnya
                    </div>
                    <div className="font-bold text-xs truncate max-w-[200px]">
                      {prevLessonItem.lesson.title}
                    </div>
                  </div>
                </Button>
              </Link>
            ) : (
              <div />
            )}

            {nextLessonItem ? (
              isCompleted ? (
                /* Unlocked Next Lesson Button */
                <Link
                  href={`/lessons/${nextLessonItem.lesson.slug}`}
                  className="w-full sm:w-auto"
                >
                  <Button
                    size="sm"
                    className="w-full sm:w-auto gap-2 text-xs justify-end font-black shadow-[3px_3px_0px_#121212]"
                  >
                    <div className="text-right">
                      <div className="text-[10px] text-[#121212] dark:text-primary-foreground/80 uppercase font-mono font-bold">
                        Materi Selanjutnya
                      </div>
                      <div className="font-black text-xs truncate max-w-[200px]">
                        {nextLessonItem.lesson.title}
                      </div>
                    </div>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              ) : (
                /* Locked Next Lesson Button */
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowLockedDialog(true)}
                  className="w-full sm:w-auto gap-2 text-xs justify-end border-2 border-neutral-400 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 shadow-[3px_3px_0px_#888888] dark:border-border/80 dark:bg-card/60 dark:hover:bg-card dark:text-muted-foreground dark:shadow-none"
                >
                  <div className="text-right">
                    <div className="text-[10px] text-amber-900 dark:text-amber-400 uppercase font-mono flex items-center justify-end gap-1 font-bold">
                      <Lock className="h-2.5 w-2.5" />
                      Materi Terkunci
                    </div>
                    <div className="font-bold text-xs truncate max-w-[200px] opacity-75">
                      {nextLessonItem.lesson.title}
                    </div>
                  </div>
                  <Lock className="h-3.5 w-3.5 text-amber-900 dark:text-amber-400" />
                </Button>
              )
            ) : (
              <Link href="/dashboard">
                <Button size="sm" variant="outline" className="text-xs font-bold gap-1.5 shadow-[2px_2px_0px_#121212]">
                  Kembali ke Dashboard
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </main>

      {/* Locked Next Lesson Modal Prompt */}
      <Dialog open={showLockedDialog} onOpenChange={setShowLockedDialog}>
        <DialogContent className="max-w-md p-6 bg-white border-2 border-black text-foreground rounded-2xl shadow-[8px_8px_0px_#121212] dark:bg-[#181A22] dark:border-border dark:shadow-2xl">
          <DialogHeader className="space-y-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg border-2 border-black bg-[#FFD84D] text-[#121212] shadow-[2px_2px_0px_#121212] mb-2 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-400 dark:shadow-none">
              <Lock className="h-6 w-6" />
            </div>
            <DialogTitle className="text-lg font-black text-foreground">
              Quiz Belum Selesai
            </DialogTitle>
            <DialogDescription className="text-xs font-medium text-[#555555] dark:font-normal dark:text-muted-foreground leading-relaxed">
              Anda wajib menyelesaikan quiz pada materi <strong className="text-foreground font-black">&quot;{activeLesson.title}&quot;</strong> dengan nilai minimal <strong className="text-foreground font-black">80%</strong> terlebih dahulu untuk membuka materi berikutnya.
            </DialogDescription>
          </DialogHeader>

          <div className="pt-4 flex items-center justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowLockedDialog(false)}
              className="text-xs font-bold"
            >
              Tutup
            </Button>
            <Button
              size="sm"
              onClick={() => {
                setShowLockedDialog(false);
                setActiveTab("quiz");
              }}
              className="gap-1.5 text-xs font-black shadow-[2px_2px_0px_#121212]"
            >
              <HelpCircle className="h-3.5 w-3.5" />
              Kerjakan Quiz Sekarang
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
