"use client";

import Link from "next/link";
import {
  Compass,
  CheckCircle2,
  Bookmark,
  Award,
  BookOpen,
  ArrowRight,
  Flame,
  Clock,
  Code2,
  Trash2,
  Layers,
  Trophy,
  ExternalLink,
  Sparkles,
  Star,
  Target,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SearchCommandModal } from "@/components/common/SearchCommandModal";
import { CURRICULUM_STAGES } from "@/data/curriculum";
import { useUserAuthStore } from "@/store/useUserAuthStore";
import { useGuestProgressStore } from "@/store/useGuestProgressStore";
import { useThemeLanguageStore } from "@/store/useThemeLanguageStore";
import { getTranslations } from "@/lib/translations";
import { GoldenTrophyIllustration } from "@/components/fun/illustrations/GoldenTrophyIllustration";
import { EmptyBookmarksIllustration } from "@/components/fun/illustrations/EmptyStateIllustrations";

export default function DashboardPage() {
  const { user } = useUserAuthStore();
  const { completedLessons, bookmarkedLessons, toggleBookmark } =
    useGuestProgressStore();
  const { theme, language } = useThemeLanguageStore();
  const t = getTranslations(language);

  const allLessons = CURRICULUM_STAGES.flatMap((stage) =>
    stage.lessons.map((lesson) => ({
      ...lesson,
      stageTitle: language === "en" ? stage.titleEn : stage.titleId,
      stageOrder: stage.orderIndex,
      category: stage.category,
    }))
  );

  const totalLessons = allLessons.length;
  const completedCount = Object.keys(completedLessons).filter(
    (k) => completedLessons[k]?.completed
  ).length;

  const percentage = Math.round((completedCount / (totalLessons || 1)) * 100);
  const totalXP = completedCount * 30;

  // Find last active or next recommended lesson
  const firstUncompleted = allLessons.find(
    (l) => !completedLessons[l.id]?.completed
  );
  const resumeLesson = firstUncompleted || allLessons[0];

  // Bookmarked lessons detail
  const bookmarkedItems = allLessons.filter((l) =>
    bookmarkedLessons.includes(l.id)
  );

  const categories = [
    "Fundamentals",
    "Frontend",
    "Backend",
    "Fullstack & DevOps",
    "Portfolio",
  ] as const;

  // FUN MODE: Player Adventure Headquarters & Trophy Room
  if (theme === "fun") {
    return (
      <div className="min-h-screen bg-[#FFF8E7] text-[#243447] flex flex-col">
        <Navbar />
        <SearchCommandModal />

        <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl space-y-8">
            {/* Player Adventure Card */}
            <div className="p-8 rounded-3xl border-2 border-[#FED7AA] bg-white shadow-[0_15px_40px_rgba(255,155,84,0.1)] flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-5">
                <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-[#FFD84D] text-2xl font-black text-[#243447] shadow-[0_4px_15px_rgba(255,216,77,0.5)]">
                  🚀
                </div>
                <div className="space-y-1 text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <span className="text-xs font-black text-[#D97706] bg-[#FFF8E7] px-3 py-0.5 rounded-full border border-[#FED7AA]">
                      {t.dashboard.funPlayerLevel} {Math.floor(completedCount / 3) + 1}
                    </span>
                    <Badge className="bg-[#EBF8FF] text-[#0284C7] text-[10px] font-black rounded-full">
                      🔥 3 Days Streak
                    </Badge>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-black text-[#243447]">
                    {t.dashboard.welcome}, {user?.name || "Explorer"}! 👋
                  </h1>
                  <p className="text-xs text-[#64748B] font-medium">
                    {user?.email || t.dashboard.guestNotice}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Link href="/roadmap">
                  <Button size="lg" className="rounded-full font-black text-xs px-6 bg-[#FFD84D] hover:bg-[#FFC933] text-[#243447] shadow-[0_4px_12px_rgba(255,216,77,0.4)]">
                    <Compass className="h-4 w-4 mr-1.5" />
                    {t.nav.roadmap}
                  </Button>
                </Link>
              </div>
            </div>

            {/* Gamified 4 KPI Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-3xl border-2 border-[#FED7AA] bg-white shadow-[0_4px_15px_rgba(0,0,0,0.03)] space-y-2">
                <div className="flex items-center justify-between text-xs font-black text-[#D97706]">
                  <span>Total XP</span>
                  <Star className="h-4 w-4 fill-[#FFD84D] text-[#FFD84D]" />
                </div>
                <div className="text-3xl font-black text-[#243447]">
                  {totalXP} XP
                </div>
                <div className="text-[11px] font-medium text-[#64748B]">
                  +{completedCount * 30} XP dari kuis
                </div>
              </div>

              <div className="p-5 rounded-3xl border-2 border-[#86EFAC] bg-white shadow-[0_4px_15px_rgba(0,0,0,0.03)] space-y-2">
                <div className="flex items-center justify-between text-xs font-black text-[#15803D]">
                  <span>{t.dashboard.kpiCompleted}</span>
                  <CheckCircle2 className="h-4 w-4 text-[#16A34A]" />
                </div>
                <div className="text-3xl font-black text-[#15803D]">
                  {completedCount} / {totalLessons}
                </div>
                <div className="text-[11px] font-medium text-[#64748B]">
                  {totalLessons - completedCount} {t.dashboard.kpiRemaining}
                </div>
              </div>

              <div className="p-5 rounded-3xl border-2 border-[#5CC8FF]/40 bg-white shadow-[0_4px_15px_rgba(0,0,0,0.03)] space-y-2">
                <div className="flex items-center justify-between text-xs font-black text-[#0284C7]">
                  <span>{t.dashboard.kpiBookmarks}</span>
                  <Bookmark className="h-4 w-4 text-[#0284C7]" />
                </div>
                <div className="text-3xl font-black text-[#0284C7]">
                  {bookmarkedLessons.length}
                </div>
                <div className="text-[11px] font-medium text-[#64748B]">
                  {t.dashboard.kpiBookmarkDesc}
                </div>
              </div>

              <div className="p-5 rounded-3xl border-2 border-[#FED7AA] bg-white shadow-[0_4px_15px_rgba(0,0,0,0.03)] space-y-2">
                <div className="flex items-center justify-between text-xs font-black text-[#D97706]">
                  <span>{t.dashboard.kpiCert}</span>
                  <Trophy className="h-4 w-4 text-[#FF9F43]" />
                </div>
                <div className="text-2xl font-black text-[#243447]">
                  {percentage >= 100 ? "Siap Klaim! 🎓" : `${100 - percentage}% Tersisa`}
                </div>
                <div className="text-[11px] font-medium text-[#64748B]">
                  {t.dashboard.kpiCertReq}
                </div>
              </div>
            </div>

            {/* Resume Quest Banner */}
            {resumeLesson && (
              <div className="p-6 rounded-3xl border-2 border-[#FED7AA] bg-white shadow-[0_8px_25px_rgba(255,155,84,0.08)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-[#FFD84D] text-[#243447] text-[10px] font-black rounded-full">
                      {t.dashboard.funActiveQuest}
                    </Badge>
                    <span className="text-xs font-bold text-[#64748B]">
                      {t.common.stage} {resumeLesson.stageOrder}: {resumeLesson.stageTitle}
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-[#243447]">
                    {language === "en" && resumeLesson.titleEn ? resumeLesson.titleEn : resumeLesson.title}
                  </h3>
                  <p className="text-xs text-[#64748B] font-medium max-w-xl">
                    {language === "en" && resumeLesson.descriptionEn ? resumeLesson.descriptionEn : resumeLesson.description}
                  </p>
                </div>

                <Link href={`/lessons/${resumeLesson.slug}`}>
                  <Button className="rounded-full text-xs font-black px-6 bg-[#5CC8FF] hover:bg-[#4D96FF] text-[#243447]">
                    {t.dashboard.funResumeQuest}
                  </Button>
                </Link>
              </div>
            )}

            {/* Badges Shelf */}
            <div className="p-6 rounded-3xl border-2 border-[#E2E8F0] bg-white space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-black text-[#243447]">
                  🏆 {t.dashboard.funBadgesTitle}
                </h2>
                <span className="text-xs font-bold text-[#64748B]">
                  {completedCount > 0 ? "1/5 Terbuka" : "0/5 Terbuka"}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {[
                  { name: "Langkah Pertama", icon: "🌱", unlocked: completedCount >= 1 },
                  { name: "HTML Master", icon: "🧱", unlocked: completedCount >= 3 },
                  { name: "CSS Stylist", icon: "🎨", unlocked: completedCount >= 6 },
                  { name: "JS Wizard", icon: "⚡", unlocked: completedCount >= 10 },
                  { name: "Fullstack Hero", icon: "👑", unlocked: completedCount >= 20 },
                ].map((badge, i) => (
                  <div
                    key={i}
                    className={`p-4 rounded-2xl border-2 text-center space-y-1.5 transition-all ${
                      badge.unlocked
                        ? "border-[#FED7AA] bg-[#FFF8E7]"
                        : "border-[#F1F5F9] bg-[#F8FAFC] opacity-50"
                    }`}
                  >
                    <div className="text-2xl">{badge.icon}</div>
                    <div className="text-xs font-black text-[#243447]">{badge.name}</div>
                    <div className="text-[10px] font-bold text-[#64748B]">
                      {badge.unlocked ? "⭐ Terbuka" : "🔒 Terkunci"}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bookmarked Lessons Section */}
            <div className="space-y-4">
              <h2 className="text-base font-black text-[#243447]">
                📌 {t.dashboard.bookmarkedTitle} ({bookmarkedItems.length})
              </h2>

              {bookmarkedItems.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {bookmarkedItems.map((item) => (
                    <div
                      key={item.id}
                      className="p-5 rounded-3xl border-2 border-[#FED7AA] bg-white shadow-[0_4px_15px_rgba(0,0,0,0.03)] flex flex-col justify-between space-y-3"
                    >
                      <div>
                        <div className="flex items-center justify-between text-[11px] text-[#64748B] mb-1 font-bold">
                          <span>{t.common.stage} {item.stageOrder}</span>
                          <span>{item.estimatedMinutes} {t.common.minutes}</span>
                        </div>
                        <h4 className="text-xs font-black text-[#243447]">
                          {language === "en" && item.titleEn ? item.titleEn : item.title}
                        </h4>
                        <p className="text-[11px] text-[#64748B] mt-1 line-clamp-2">
                          {language === "en" && item.descriptionEn ? item.descriptionEn : item.description}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-[#E2E8F0] flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => toggleBookmark(item.id)}
                          className="text-xs font-bold text-[#FF6B6B] hover:underline flex items-center gap-1"
                        >
                          <Trash2 className="h-3 w-3" />
                          <span>{t.common.delete}</span>
                        </button>
                        <Link href={`/lessons/${item.slug}`}>
                          <Button size="sm" className="h-7 text-xs font-black rounded-full bg-[#5CC8FF] text-[#243447]">
                            {t.common.continue}
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 rounded-3xl border-2 border-[#FED7AA] bg-white text-center space-y-3">
                  <EmptyBookmarksIllustration className="w-24 h-24 mx-auto" />
                  <p className="text-xs font-medium text-[#64748B] max-w-sm mx-auto">
                    {t.dashboard.emptyBookmarks}
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  // STANDARD LIGHT & DARK DASHBOARD
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />
      <SearchCommandModal />

      <main className="flex-1 py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Welcome Profile Banner */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 sm:p-8 rounded-xl border-2 border-black bg-white shadow-[6px_6px_0px_#121212] dark:border dark:border-[#1C242D] dark:bg-[#090D12] dark:shadow-none">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl border-2 border-black bg-[#FFD84D] text-[#121212] font-mono font-black text-xl shadow-[2.5px_2.5px_0px_#121212] dark:border dark:border-cyan-500/40 dark:bg-cyan-500/10 dark:text-cyan-300 dark:shadow-none">
                {(user?.name || "Pelajar").charAt(0).toUpperCase()}
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono font-black text-[#121212] bg-[#70B7FF] px-2 py-0.5 rounded border border-black shadow-[1.5px_1.5px_0px_#121212] uppercase tracking-wider dark:border dark:border-cyan-500/30 dark:bg-cyan-500/10 dark:text-cyan-300 dark:shadow-none">
                    {theme === "dark" ? "TELEMETRY DASHBOARD" : "Student Dashboard"}
                  </span>
                  <Badge variant="outline" className="text-[10px] dark:border-[#1C242D] dark:bg-[#0F141A] dark:text-[#94A3B8]">
                    {percentage >= 100 ? "Fullstack Graduate" : "Active Learner"}
                  </Badge>
                </div>

                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
                  {t.dashboard.welcome}, {user?.name || "Pelajar Web Development"}!
                </h1>

                <p className="text-xs font-medium text-[#555555] dark:font-normal dark:text-[#8292A6] mt-1">
                  {user?.email || t.dashboard.guestNotice}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/roadmap">
                <Button size="sm" variant="outline" className="text-xs font-bold gap-2 shadow-[2px_2px_0px_#121212] dark:border dark:border-[#1C242D] dark:bg-[#0F141A] dark:text-[#CBD5E1] dark:hover:text-cyan-300">
                  <Compass className="h-3.5 w-3.5" />
                  {t.nav.roadmap}
                </Button>
              </Link>
            </div>
          </div>

          {/* KPI Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <SpotlightCard className="p-5 border-2 border-black bg-white shadow-[4px_4px_0px_#121212] dark:border dark:border-[#1C242D] dark:bg-[#090D12] dark:shadow-none">
              <div className="flex items-center justify-between text-neutral-700 dark:text-[#8292A6] mb-2 text-xs font-bold dark:font-mono">
                <span>{t.dashboard.kpiProgress}</span>
                <Compass className="h-4 w-4 text-primary dark:text-cyan-400" />
              </div>
              <div className="text-3xl font-black font-mono text-foreground dark:text-cyan-300">
                {percentage}%
              </div>
              <Progress value={percentage} className="mt-3 h-2" />
            </SpotlightCard>

            <SpotlightCard className="p-5 border-2 border-black bg-white shadow-[4px_4px_0px_#121212] dark:border dark:border-[#1C242D] dark:bg-[#090D12] dark:shadow-none">
              <div className="flex items-center justify-between text-neutral-700 dark:text-[#8292A6] mb-2 text-xs font-bold dark:font-mono">
                <span>{t.dashboard.kpiCompleted}</span>
                <CheckCircle2 className="h-4 w-4 text-emerald-800 dark:text-emerald-400" />
              </div>
              <div className="text-3xl font-black font-mono text-emerald-800 dark:text-emerald-400">
                {completedCount} / {totalLessons}
              </div>
              <span className="text-[11px] font-bold text-[#555555] dark:font-normal dark:text-[#8292A6] mt-1 block">
                {totalLessons - completedCount} {t.dashboard.kpiRemaining}
              </span>
            </SpotlightCard>

            <SpotlightCard className="p-5 border-2 border-black bg-white shadow-[4px_4px_0px_#121212] dark:border dark:border-[#1C242D] dark:bg-[#090D12] dark:shadow-none">
              <div className="flex items-center justify-between text-neutral-700 dark:text-[#8292A6] mb-2 text-xs font-bold dark:font-mono">
                <span>{t.dashboard.kpiBookmarks}</span>
                <Bookmark className="h-4 w-4 text-blue-800 dark:text-[#38BDF8]" />
              </div>
              <div className="text-3xl font-black font-mono text-blue-800 dark:text-[#38BDF8]">
                {bookmarkedLessons.length}
              </div>
              <span className="text-[11px] font-bold text-[#555555] dark:font-normal dark:text-[#8292A6] mt-1 block">
                {t.dashboard.kpiBookmarkDesc}
              </span>
            </SpotlightCard>

            <SpotlightCard className="p-5 border-2 border-black bg-white shadow-[4px_4px_0px_#121212] dark:border dark:border-[#1C242D] dark:bg-[#090D12] dark:shadow-none">
              <div className="flex items-center justify-between text-neutral-700 dark:text-[#8292A6] mb-2 text-xs font-bold dark:font-mono">
                <span>{t.dashboard.kpiCert}</span>
                <Trophy className="h-4 w-4 text-amber-800 dark:text-amber-400" />
              </div>
              <div className="text-base font-black font-mono text-amber-900 dark:text-amber-300 mt-1">
                {percentage >= 100 ? "Siap Diklaim 🎓" : `${100 - percentage}% Tersisa`}
              </div>
              <span className="text-[11px] font-bold text-[#555555] dark:font-normal dark:text-[#8292A6] mt-1 block">
                {t.dashboard.kpiCertReq}
              </span>
            </SpotlightCard>
          </div>

          {/* Resume Last Active Lesson Card */}
          {resumeLesson && (
            <div className="p-6 rounded-xl border-2 border-black bg-[#FFD84D]/30 shadow-[5px_5px_0px_#121212] flex flex-col sm:flex-row sm:items-center justify-between gap-4 dark:border dark:border-cyan-500/30 dark:bg-[#090D12] dark:shadow-none">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-[10px] bg-white border-2 border-black font-black text-[#121212] shadow-[1.5px_1.5px_0px_#121212] dark:border dark:border-cyan-500/40 dark:bg-cyan-500/10 dark:text-cyan-300 dark:shadow-none">
                    {t.dashboard.resumeTitle}
                  </Badge>
                  <span className="text-xs font-bold text-[#555555] dark:font-mono dark:text-[#8292A6]">
                    {t.common.stage} {String(resumeLesson.stageOrder).padStart(2, "0")}: {resumeLesson.stageTitle}
                  </span>
                </div>

                <h3 className="text-lg font-black text-foreground">
                  {language === "en" && resumeLesson.titleEn ? resumeLesson.titleEn : resumeLesson.title}
                </h3>
                <p className="text-xs font-medium text-[#404040] dark:font-normal dark:text-[#8292A6] max-w-xl">
                  {language === "en" && resumeLesson.descriptionEn ? resumeLesson.descriptionEn : resumeLesson.description}
                </p>
              </div>

              <Link href={`/lessons/${resumeLesson.slug}`}>
                <Button size="sm" className="gap-2 text-xs font-black px-4 h-9 shadow-[3px_3px_0px_#121212] dark:border dark:border-cyan-500/40 dark:bg-cyan-500/15 dark:text-cyan-300 dark:hover:bg-cyan-400 dark:hover:text-[#05070A] dark:shadow-none">
                  {t.dashboard.resumeButton}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>
          )}

          {/* Category Progress Breakdown */}
          <div className="space-y-4">
            <h2 className="text-lg font-black tracking-tight text-foreground">
              {t.dashboard.categoryProgress}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((category) => {
                const categoryLessons = allLessons.filter(
                  (l) => l.category === category
                );
                const categoryDone = categoryLessons.filter(
                  (l) => completedLessons[l.id]?.completed
                ).length;
                const catPercentage = Math.round(
                  (categoryDone / (categoryLessons.length || 1)) * 100
                );

                return (
                  <Card key={category} className="p-5 border-2 border-black bg-white shadow-[3px_3px_0px_#121212] dark:border dark:border-[#1C242D] dark:bg-[#090D12] dark:shadow-none">
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="font-black text-foreground">
                        {category}
                      </span>
                      <span className="font-mono font-bold text-[#555555] dark:font-normal dark:text-[#8292A6]">
                        {categoryDone}/{categoryLessons.length} ({catPercentage}%)
                      </span>
                    </div>
                    <Progress value={catPercentage} className="h-2" />
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Bookmarked Lessons Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black tracking-tight text-foreground">
                {t.dashboard.bookmarkedTitle} ({bookmarkedItems.length})
              </h2>
            </div>

            {bookmarkedItems.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {bookmarkedItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col justify-between p-4 rounded-lg border-2 border-black bg-white shadow-[3px_3px_0px_#121212] hover:bg-[#FFD84D]/25 transition-all group dark:border dark:border-[#1C242D] dark:bg-[#05070A] dark:hover:border-cyan-500/30 dark:hover:bg-[#0F141A] dark:shadow-none"
                  >
                    <div>
                      <div className="flex items-center justify-between text-[11px] text-[#555555] dark:text-[#8292A6] mb-1.5 font-mono font-bold dark:font-normal">
                        <span>{t.common.stage} {item.stageOrder}</span>
                        <span>{item.estimatedMinutes} {t.common.minutes}</span>
                      </div>
                      <h4 className="text-xs font-black text-foreground group-hover:text-black dark:group-hover:text-cyan-300 transition-colors">
                        {language === "en" && item.titleEn ? item.titleEn : item.title}
                      </h4>
                      <p className="text-[11px] text-[#555555] dark:text-[#8292A6] mt-1 line-clamp-2 font-medium dark:font-normal">
                        {language === "en" && item.descriptionEn ? item.descriptionEn : item.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-2.5 border-t-2 border-black dark:border-t dark:border-[#1C242D] flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => toggleBookmark(item.id)}
                        className="text-xs font-bold text-[#555555] hover:text-rose-600 flex items-center gap-1 transition-colors dark:text-[#8292A6] dark:hover:text-red-400"
                      >
                        <Trash2 className="h-3 w-3" />
                        <span>{t.common.delete}</span>
                      </button>

                      <Link
                        href={`/lessons/${item.slug}`}
                        className="text-xs font-black text-black underline decoration-[#FFD84D] decoration-2 hover:text-primary flex items-center gap-1 dark:text-cyan-400 dark:no-underline dark:font-semibold dark:hover:underline"
                      >
                        <span>{t.common.continue}</span>
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 rounded-xl border-2 border-black bg-white shadow-[4px_4px_0px_#121212] text-center space-y-2 dark:border dark:border-[#1C242D] dark:bg-[#090D12] dark:shadow-none">
                <Bookmark className="h-6 w-6 text-[#121212] dark:text-cyan-400 mx-auto" />
                <p className="text-xs font-medium text-[#555555] dark:font-normal dark:text-[#8292A6]">
                  {t.dashboard.emptyBookmarks}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

