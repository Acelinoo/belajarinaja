"use client";

import React from "react";
import Link from "next/link";
import {
  Map,
  Compass,
  Bookmark,
  CheckCircle2,
  Clock,
  ArrowRight,
  BookOpen,
  User,
  ShieldCheck,
  Award,
  Settings,
  Check,
  Play,
  Layers,
  Sparkles,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SearchCommandModal } from "@/components/common/SearchCommandModal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CURRICULUM_STAGES } from "@/data/curriculum";
import { useCurriculumProgressStore } from "@/store/useCurriculumProgressStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useThemeLanguageStore } from "@/store/useThemeLanguageStore";
import { getTranslations } from "@/lib/translations";
import { NovaCharacter } from "@/components/fun/characters/NovaCharacter";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLightbulb, faCheck } from "@fortawesome/free-solid-svg-icons";
import { ActivityHeatmap } from "@/components/dashboard/ActivityHeatmap";
import { AchievementBadges } from "@/components/dashboard/AchievementBadges";

export default function DashboardPage() {
  const { theme, language } = useThemeLanguageStore();
  const t = getTranslations(language);
  const { user, isAuthenticated } = useAuthStore();
  const { completedLessons, bookmarkedLessons, loadUserProgress } = useCurriculumProgressStore();

  React.useEffect(() => {
    if (user?.email) {
      loadUserProgress(user.email);
    }

    const handleFocus = () => {
      if (user?.email) {
        loadUserProgress(user.email);
      }
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [user?.email, loadUserProgress]);

  // Flatten all lessons with stage metadata
  const allLessons = CURRICULUM_STAGES.flatMap((s) =>
    s.lessons.map((l) => ({
      ...l,
      stageId: s.id,
      stageOrder: s.orderIndex,
      stageTitle: s.titleId,
      stageTitleEn: s.titleEn,
      stageDescription: s.description,
    }))
  );

  const completedList = isAuthenticated
    ? Object.values(completedLessons).filter((item) => item?.completed)
    : [];
  const completedCount = completedList.length;
  const totalLessons = allLessons.length;
  const progressPercent = Math.min(100, Math.round((completedCount / (totalLessons || 1)) * 100));

  // Identify next recommended resume lesson
  const activeResumeLesson =
    allLessons.find((l) => !completedLessons[l.id]?.completed) || allLessons[allLessons.length - 1];

  // Identify current active stage
  const currentStage =
    CURRICULUM_STAGES.find((s) =>
      s.lessons.some((l) => !completedLessons[l.id]?.completed)
    ) || CURRICULUM_STAGES[0];

  const currentStageLessons = currentStage.lessons;
  const currentStageCompletedCount = isAuthenticated
    ? currentStageLessons.filter((l) => completedLessons[l.id]?.completed).length
    : 0;
  const currentStagePercent = Math.round(
    (currentStageCompletedCount / (currentStageLessons.length || 1)) * 100
  );

  // Bookmarked items
  const bookmarkedItems = isAuthenticated
    ? allLessons.filter((l) => bookmarkedLessons.includes(l.id))
    : [];

  // Recent activity list (sorted by completion timestamp, max 5)
  const recentActivities = isAuthenticated
    ? Object.entries(completedLessons)
        .filter(([_, data]) => data?.completed && data?.completedAt)
        .sort((a, b) => new Date(b[1].completedAt || 0).getTime() - new Date(a[1].completedAt || 0).getTime())
        .slice(0, 5)
        .map(([lessonId, data]) => {
          const lesson = allLessons.find((l) => l.id === lessonId);
          return {
            lessonId,
            title: language === "en" && lesson?.titleEn ? lesson.titleEn : (lesson?.title || "Materi Pembelajaran"),
            stageTitle: language === "en" && lesson?.stageTitleEn ? lesson.stageTitleEn : (lesson?.stageTitle || "Tahap Kurikulum"),
            slug: lesson?.slug || "",
            completedAt: data.completedAt ? new Date(data.completedAt).toLocaleDateString(language === "en" ? "en-US" : "id-ID", {
              day: "numeric",
              month: "short",
              hour: "2-digit",
              minute: "2-digit",
            }) : (language === "en" ? "Just now" : "Baru saja"),
          };
        })
    : [];

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground transition-colors">
      <Navbar />
      <SearchCommandModal />

      <main className="flex-1 py-6 sm:py-12 px-3 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl space-y-6 sm:space-y-8">
          {/* Header Greeting & Student Profile Badge */}
          <div className="p-4 sm:p-6 md:p-7 rounded-2xl border border-border bg-card shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sm:gap-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <img
                src={user?.avatarUrl || "https://api.dicebear.com/7.x/bottts/svg?seed=developer"}
                alt="Avatar"
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl border-2 border-primary/30 bg-secondary object-cover shrink-0 shadow-sm"
              />
              <div className="space-y-1 min-w-0">
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                  <h1 className="text-lg sm:text-2xl font-black text-foreground tracking-tight truncate">
                    {user?.name || (language === "en" ? "Web Student" : "Pelajar Web")}
                  </h1>
                  <span className="text-[11px] font-mono text-muted-foreground truncate">
                    @{user?.username || "developer"}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground max-w-lg line-clamp-2">
                  {user?.bio || (language === "en" ? "Web Development Learner at BelajarinAja" : "Web Development Enthusiast di BelajarinAja")}
                </p>
                <div className="flex items-center gap-2 sm:gap-3 pt-0.5 text-[10px] sm:text-[11px] font-mono text-muted-foreground flex-wrap">
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    <span>{language === "en" ? "VERIFIED" : "TERVERIFIKASI"}</span>
                  </span>
                  <span>•</span>
                  <span>
                    {language === "en"
                      ? `GOAL: ${user?.dailyGoalMinutes || 30} MINS/DAY`
                      : `TARGET: ${user?.dailyGoalMinutes || 30} MENIT/HARI`}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto self-stretch md:self-center shrink-0">
              <Link href="/settings" className="flex-1 md:flex-none">
                <Button variant="outline" size="sm" className="w-full md:w-auto text-xs font-semibold h-9 rounded-xl gap-1.5 cursor-pointer">
                  <Settings className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>{language === "en" ? "Edit Profile" : "Edit Profil"}</span>
                </Button>
              </Link>
              <Link href="/roadmap" className="flex-1 md:flex-none">
                <Button size="sm" className="w-full md:w-auto text-xs font-bold h-9 rounded-xl gap-1.5 cursor-pointer">
                  <Map className="h-3.5 w-3.5" />
                  <span>{language === "en" ? "Roadmap" : "Peta Roadmap"}</span>
                </Button>
              </Link>
            </div>
          </div>

          {/* PRIMARY CONTENT: CONTINUE LEARNING HERO */}
          {activeResumeLesson && (
            <div className="p-4 sm:p-6 md:p-8 rounded-2xl border-2 border-primary/40 bg-card shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sm:gap-6">
              <div className="space-y-2.5 sm:space-y-3 max-w-xl">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="default" className="text-[10px] font-bold uppercase tracking-wider bg-primary text-primary-foreground">
                    {language === "en" ? "Continue Learning" : "Lanjutkan Belajar"}
                  </Badge>
                  <span className="text-xs font-mono font-bold text-muted-foreground">
                    {language === "en" ? "Stage" : "Tahap"} {String(currentStage.orderIndex).padStart(2, "0")}:{" "}
                    {language === "en" && currentStage.titleEn ? currentStage.titleEn : currentStage.titleId}
                  </span>
                </div>

                <h2 className="text-lg sm:text-2xl font-bold text-foreground">
                  {language === "en" && activeResumeLesson.titleEn ? activeResumeLesson.titleEn : activeResumeLesson.title}
                </h2>

                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {language === "en" && activeResumeLesson.descriptionEn ? activeResumeLesson.descriptionEn : activeResumeLesson.description}
                </p>

                <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs text-muted-foreground font-medium pt-1">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-primary" />
                    {language === "en" ? "~15 mins study" : "~15 menit belajar"}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <BookOpen className="h-3.5 w-3.5 text-primary" />
                    {language === "en" ? "Interactive Sandbox Included" : "Termasuk Interactive Sandbox"}
                  </span>
                </div>
              </div>

              <div className="shrink-0 w-full md:w-auto">
                <Link href={`/lessons/${activeResumeLesson.slug}`}>
                  <Button size="lg" className="h-10 sm:h-11 px-6 text-xs sm:text-sm font-bold rounded-xl gap-2 w-full md:w-auto shadow-sm">
                    <Play className="h-4 w-4" />
                    <span>{language === "en" ? "Continue Lesson" : "Lanjutkan Materi"}</span>
                  </Button>
                </Link>
              </div>
            </div>
          )}

          {/* TWO COLUMN GRID: PROGRESS & STAGE SUMMARY */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left: Overall Progress */}
            <div className="p-4 sm:p-6 rounded-xl border border-border bg-card space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <span>{language === "en" ? "Global Curriculum Progress" : "Kemajuan Kurikulum Global"}</span>
                </h3>
                <span className="text-xs font-mono font-bold text-primary">
                  {progressPercent}%
                </span>
              </div>

              <div className="space-y-2">
                <div className="h-2 w-full bg-secondary rounded-full overflow-hidden border border-border">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground font-medium">
                  <span>
                    {language === "en"
                      ? `${completedCount} lessons completed`
                      : `${completedCount} materi diselesaikan`}
                  </span>
                  <span>
                    {language === "en"
                      ? `${totalLessons - completedCount} lessons remaining`
                      : `${totalLessons - completedCount} materi tersisa`}
                  </span>
                </div>
              </div>
              <div className="p-3 bg-secondary/50 rounded-lg border border-border/80 text-xs text-muted-foreground space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-foreground">
                  <FontAwesomeIcon icon={faLightbulb} className="h-3.5 w-3.5 text-amber-500" />
                  <span>{language === "en" ? "Learning Tip:" : "Tips Pembelajaran:"}</span>
                </div>
                <p className="leading-relaxed">
                  {language === "en"
                    ? "Complete at least 1 lesson per day and run code in the interactive sandbox to build long-term coding muscle memory."
                    : "Selesaikan minimal 1 materi setiap hari dan coba jalankan kode di interactive sandbox untuk melatih memori otot koding kamu."}
                </p>
              </div>
            </div>

            {/* Right: Active Stage Progress */}
            <div className="p-6 rounded-xl border border-border bg-card space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Layers className="h-4 w-4 text-primary" />
                  <span>
                    {language === "en" ? "Active Stage:" : "Tahap Aktif:"}{" "}
                    {language === "en" && currentStage.titleEn ? currentStage.titleEn : currentStage.titleId}
                  </span>
                </h3>
                <Badge variant="outline" className="text-[11px] font-mono">
                  {currentStageCompletedCount} / {currentStage.lessons.length}
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{language === "en" ? "Stage Completion" : "Kelulusan Tahap Ini"}</span>
                  <span className="font-mono font-bold text-foreground">
                    {Math.round((currentStageCompletedCount / currentStage.lessons.length) * 100)}%
                  </span>
                </div>
                <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-500"
                    style={{
                      width: `${(currentStageCompletedCount / currentStage.lessons.length) * 100}%`,
                    }}
                  />
                </div>
              </div>

              {/* Lesson checklist preview */}
              <div className="space-y-1.5 pt-1">
                {currentStage.lessons.map((lesson) => {
                  const done = !!completedLessons[lesson.id]?.completed;
                  return (
                    <Link
                      key={lesson.id}
                      href={`/lessons/${lesson.slug}`}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-secondary/60 text-xs transition-colors group"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        {done ? (
                          <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                        ) : (
                          <div className="h-4 w-4 rounded-full border border-border shrink-0" />
                        )}
                        <span
                          className={`truncate ${
                            done ? "text-muted-foreground line-through" : "text-foreground font-medium"
                          }`}
                        >
                          {language === "en" && lesson.titleEn ? lesson.titleEn : lesson.title}
                        </span>
                      </div>
                      <span className="text-[10px] text-muted-foreground group-hover:text-primary transition-colors shrink-0 ml-2">
                        {done
                          ? (language === "en" ? "Done" : "Selesai")
                          : (language === "en" ? "Start →" : "Mulai →")}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ACTIVITY HEATMAP (GITHUB-STYLE) */}
          <ActivityHeatmap completedLessons={completedLessons} />

          {/* ACHIEVEMENTS & BADGES */}
          <AchievementBadges completedLessons={completedLessons} />

          {/* TWO COLUMN GRID: BOOKMARKS & RECENT ACTIVITY */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Bookmarked Lessons */}
            <div className="p-6 rounded-xl border border-border bg-card space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Bookmark className="h-4 w-4 text-primary" />
                  <span>{language === "en" ? "Saved Bookmarks" : "Materi yang Disimpan"}</span>
                </h3>
                <span className="text-xs font-mono text-muted-foreground">
                  {bookmarkedItems.length} {language === "en" ? "Lessons" : "Materi"}
                </span>
              </div>

              {bookmarkedItems.length > 0 ? (
                <div className="space-y-1.5">
                  {bookmarkedItems.map((item) => (
                    <Link
                      key={item.id}
                      href={`/lessons/${item.slug}`}
                      className="flex items-center justify-between p-2.5 rounded-md bg-secondary/50 hover:bg-secondary border border-border text-xs transition-colors"
                    >
                      <div className="space-y-0.5 min-w-0">
                        <p className="font-bold text-foreground truncate">
                          {language === "en" && item.titleEn ? item.titleEn : item.title}
                        </p>
                        <p className="text-[10px] text-muted-foreground truncate">
                          {language === "en" && item.stageTitleEn ? item.stageTitleEn : item.stageTitle}
                        </p>
                      </div>
                      <ArrowRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center text-xs text-muted-foreground space-y-1">
                  <p className="font-semibold text-foreground">
                    {language === "en" ? "No bookmarked lessons yet." : "Belum ada materi yang disimpan."}
                  </p>
                  <p>
                    {language === "en"
                      ? "You can bookmark important lessons while reading."
                      : "Kamu dapat menandai materi penting dengan tombol bookmark saat membaca lesson."}
                  </p>
                </div>
              )}
            </div>

            {/* Recent Completed Activity */}
            <div className="p-6 rounded-xl border border-border bg-card space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  <span>{language === "en" ? "Recent Activity History" : "Riwayat Aktivitas Terakhir"}</span>
                </h3>
              </div>

              {recentActivities.length > 0 ? (
                <div className="space-y-2">
                  {recentActivities.map((act) => (
                    <div
                      key={act.lessonId}
                      className="flex items-center justify-between p-2.5 rounded-md border border-border text-xs"
                    >
                      <div className="space-y-0.5 min-w-0">
                        <p className="font-bold text-foreground truncate">{act.title}</p>
                        <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                          <FontAwesomeIcon icon={faCheck} className="h-3 w-3" />
                          <span>{language === "en" ? `Completed (${act.completedAt})` : `Selesai dipelajari (${act.completedAt})`}</span>
                        </p>
                      </div>
                      {act.slug && (
                        <Link href={`/lessons/${act.slug}`}>
                          <Button size="sm" variant="ghost" className="h-7 text-[11px] px-2 text-muted-foreground hover:text-foreground">
                            {language === "en" ? "Open" : "Buka"}
                          </Button>
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center text-xs text-muted-foreground space-y-1">
                  <p className="font-semibold text-foreground">
                    {language === "en" ? "No study activity recorded yet." : "Belum ada aktivitas koding."}
                  </p>
                  <p>
                    {language === "en"
                      ? "Start your first lesson to see your learning progress history here."
                      : "Mulai pelajari materi pertama untuk melihat riwayat kemajuan kamu di sini."}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}