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

export default function DashboardPage() {
  const { user } = useUserAuthStore();
  const { completedLessons, bookmarkedLessons, toggleBookmark } =
    useGuestProgressStore();

  const allLessons = CURRICULUM_STAGES.flatMap((stage) =>
    stage.lessons.map((lesson) => ({
      ...lesson,
      stageTitle: stage.titleId,
      stageOrder: stage.orderIndex,
      category: stage.category,
    }))
  );

  const totalLessons = allLessons.length;
  const completedCount = Object.keys(completedLessons).filter(
    (k) => completedLessons[k]?.completed
  ).length;

  const percentage = Math.round((completedCount / (totalLessons || 1)) * 100);

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
                    Student Dashboard
                  </span>
                  <Badge variant="outline" className="text-[10px] dark:border-[#1C242D] dark:bg-[#0F141A] dark:text-[#94A3B8]">
                    {percentage >= 100 ? "Fullstack Graduate" : "Active Learner"}
                  </Badge>
                </div>

                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
                  Selamat Datang, {user?.name || "Pelajar Web Development"}!
                </h1>

                <p className="text-xs font-medium text-[#555555] dark:font-normal dark:text-[#8292A6] mt-1">
                  {user?.email || "Mode Guest (Progress tersimpan lokal di browser ini)"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/roadmap">
                <Button size="sm" variant="outline" className="text-xs font-bold gap-2 shadow-[2px_2px_0px_#121212] dark:border dark:border-[#1C242D] dark:bg-[#0F141A] dark:text-[#CBD5E1] dark:hover:text-cyan-300">
                  <Compass className="h-3.5 w-3.5" />
                  Buka Roadmap
                </Button>
              </Link>
            </div>
          </div>

          {/* KPI Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <SpotlightCard className="p-5 border-2 border-black bg-white shadow-[4px_4px_0px_#121212] dark:border dark:border-[#1C242D] dark:bg-[#090D12] dark:shadow-none">
              <div className="flex items-center justify-between text-neutral-700 dark:text-[#8292A6] mb-2 text-xs font-bold dark:font-mono">
                <span>Progress Keseluruhan</span>
                <Compass className="h-4 w-4 text-primary dark:text-cyan-400" />
              </div>
              <div className="text-3xl font-black font-mono text-foreground dark:text-cyan-300">
                {percentage}%
              </div>
              <Progress value={percentage} className="mt-3 h-2" />
            </SpotlightCard>

            <SpotlightCard className="p-5 border-2 border-black bg-white shadow-[4px_4px_0px_#121212] dark:border dark:border-[#1C242D] dark:bg-[#090D12] dark:shadow-none">
              <div className="flex items-center justify-between text-neutral-700 dark:text-[#8292A6] mb-2 text-xs font-bold dark:font-mono">
                <span>Materi Diselesaikan</span>
                <CheckCircle2 className="h-4 w-4 text-emerald-800 dark:text-emerald-400" />
              </div>
              <div className="text-3xl font-black font-mono text-emerald-800 dark:text-emerald-400">
                {completedCount} / {totalLessons}
              </div>
              <span className="text-[11px] font-bold text-[#555555] dark:font-normal dark:text-[#8292A6] mt-1 block">
                {totalLessons - completedCount} materi tersisa
              </span>
            </SpotlightCard>

            <SpotlightCard className="p-5 border-2 border-black bg-white shadow-[4px_4px_0px_#121212] dark:border dark:border-[#1C242D] dark:bg-[#090D12] dark:shadow-none">
              <div className="flex items-center justify-between text-neutral-700 dark:text-[#8292A6] mb-2 text-xs font-bold dark:font-mono">
                <span>Materi Disimpan</span>
                <Bookmark className="h-4 w-4 text-blue-800 dark:text-[#38BDF8]" />
              </div>
              <div className="text-3xl font-black font-mono text-blue-800 dark:text-[#38BDF8]">
                {bookmarkedLessons.length}
              </div>
              <span className="text-[11px] font-bold text-[#555555] dark:font-normal dark:text-[#8292A6] mt-1 block">
                Tersimpan di bookmark
              </span>
            </SpotlightCard>

            <SpotlightCard className="p-5 border-2 border-black bg-white shadow-[4px_4px_0px_#121212] dark:border dark:border-[#1C242D] dark:bg-[#090D12] dark:shadow-none">
              <div className="flex items-center justify-between text-neutral-700 dark:text-[#8292A6] mb-2 text-xs font-bold dark:font-mono">
                <span>Klaim Sertifikat</span>
                <Trophy className="h-4 w-4 text-amber-800 dark:text-amber-400" />
              </div>
              <div className="text-base font-black font-mono text-amber-900 dark:text-amber-300 mt-1">
                {percentage >= 100 ? "Siap Diklaim 🎓" : `${100 - percentage}% Tersisa`}
              </div>
              <span className="text-[11px] font-bold text-[#555555] dark:font-normal dark:text-[#8292A6] mt-1 block">
                Selesaikan 20 tahap
              </span>
            </SpotlightCard>
          </div>

          {/* Resume Last Active Lesson Card */}
          {resumeLesson && (
            <div className="p-6 rounded-xl border-2 border-black bg-[#FFD84D]/30 shadow-[5px_5px_0px_#121212] flex flex-col sm:flex-row sm:items-center justify-between gap-4 dark:border dark:border-cyan-500/30 dark:bg-[#090D12] dark:shadow-none">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-[10px] bg-white border-2 border-black font-black text-[#121212] shadow-[1.5px_1.5px_0px_#121212] dark:border dark:border-cyan-500/40 dark:bg-cyan-500/10 dark:text-cyan-300 dark:shadow-none">
                    Lanjutkan Belajar
                  </Badge>
                  <span className="text-xs font-bold text-[#555555] dark:font-mono dark:text-[#8292A6]">
                    Tahap {String(resumeLesson.stageOrder).padStart(2, "0")}: {resumeLesson.stageTitle}
                  </span>
                </div>

                <h3 className="text-lg font-black text-foreground">
                  {resumeLesson.title}
                </h3>
                <p className="text-xs font-medium text-[#404040] dark:font-normal dark:text-[#8292A6] max-w-xl">
                  {resumeLesson.description}
                </p>
              </div>

              <Link href={`/lessons/${resumeLesson.slug}`}>
                <Button size="sm" className="gap-2 text-xs font-black px-4 h-9 shadow-[3px_3px_0px_#121212] dark:border dark:border-cyan-500/40 dark:bg-cyan-500/15 dark:text-cyan-300 dark:hover:bg-cyan-400 dark:hover:text-[#05070A] dark:shadow-none">
                  Buka Materi Terakhir
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>
          )}

          {/* Category Progress Breakdown */}
          <div className="space-y-4">
            <h2 className="text-lg font-black tracking-tight text-foreground">
              Progress Per Bagian Kurikulum
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
                Materi yang Disimpan ({bookmarkedItems.length})
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
                        <span>Tahap {item.stageOrder}</span>
                        <span>{item.estimatedMinutes} mnt</span>
                      </div>
                      <h4 className="text-xs font-black text-foreground group-hover:text-black dark:group-hover:text-cyan-300 transition-colors">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-[#555555] dark:text-[#8292A6] mt-1 line-clamp-2 font-medium dark:font-normal">
                        {item.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-2.5 border-t-2 border-black dark:border-t dark:border-[#1C242D] flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => toggleBookmark(item.id)}
                        className="text-xs font-bold text-[#555555] hover:text-rose-600 flex items-center gap-1 transition-colors dark:text-[#8292A6] dark:hover:text-red-400"
                      >
                        <Trash2 className="h-3 w-3" />
                        <span>Hapus</span>
                      </button>

                      <Link
                        href={`/lessons/${item.slug}`}
                        className="text-xs font-black text-black underline decoration-[#FFD84D] decoration-2 hover:text-primary flex items-center gap-1 dark:text-cyan-400 dark:no-underline dark:font-semibold dark:hover:underline"
                      >
                        <span>Buka</span>
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
                  Belum ada materi yang disimpan. Klik tombol &quot;Simpan&quot; di halaman pelajaran untuk menyimpannya di sini.
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
