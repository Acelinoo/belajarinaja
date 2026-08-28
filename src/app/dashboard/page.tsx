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
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 sm:p-8 rounded-xl border border-border bg-[#121318]">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/20 text-primary font-mono font-bold text-xl border border-primary/40">
                {(user?.name || "Pelajar").charAt(0).toUpperCase()}
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono text-primary uppercase tracking-wider">
                    Student Dashboard
                  </span>
                  <Badge variant="outline" className="text-[10px]">
                    {percentage >= 100 ? "Fullstack Graduate" : "Active Learner"}
                  </Badge>
                </div>

                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                  Selamat Datang, {user?.name || "Pelajar Web Development"}!
                </h1>

                <p className="text-xs text-muted-foreground mt-1">
                  {user?.email || "Mode Guest (Progress tersimpan lokal di browser ini)"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/roadmap">
                <Button size="sm" variant="outline" className="text-xs gap-2">
                  <Compass className="h-3.5 w-3.5" />
                  Buka Roadmap
                </Button>
              </Link>
            </div>
          </div>

          {/* KPI Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <SpotlightCard className="p-5 border-border">
              <div className="flex items-center justify-between text-muted-foreground mb-2 text-xs">
                <span>Progress Keseluruhan</span>
                <Compass className="h-4 w-4 text-primary" />
              </div>
              <div className="text-3xl font-bold font-mono text-foreground">
                {percentage}%
              </div>
              <Progress value={percentage} className="mt-3 h-1.5" />
            </SpotlightCard>

            <SpotlightCard className="p-5 border-border">
              <div className="flex items-center justify-between text-muted-foreground mb-2 text-xs">
                <span>Materi Diselesaikan</span>
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              </div>
              <div className="text-3xl font-bold font-mono text-foreground">
                {completedCount} / {totalLessons}
              </div>
              <span className="text-[11px] text-muted-foreground mt-1 block">
                {totalLessons - completedCount} materi tersisa
              </span>
            </SpotlightCard>

            <SpotlightCard className="p-5 border-border">
              <div className="flex items-center justify-between text-muted-foreground mb-2 text-xs">
                <span>Materi Disimpan</span>
                <Bookmark className="h-4 w-4 text-indigo-400" />
              </div>
              <div className="text-3xl font-bold font-mono text-foreground">
                {bookmarkedLessons.length}
              </div>
              <span className="text-[11px] text-muted-foreground mt-1 block">
                Tersimpan di bookmark
              </span>
            </SpotlightCard>

            <SpotlightCard className="p-5 border-border">
              <div className="flex items-center justify-between text-muted-foreground mb-2 text-xs">
                <span>Klaim Sertifikat</span>
                <Trophy className="h-4 w-4 text-amber-400" />
              </div>
              <div className="text-base font-bold font-mono text-foreground mt-1">
                {percentage >= 100 ? "Siap Diklaim 🎓" : `${100 - percentage}% Tersisa`}
              </div>
              <span className="text-[11px] text-muted-foreground mt-1 block">
                Selesaikan 20 tahap
              </span>
            </SpotlightCard>
          </div>

          {/* Resume Last Active Lesson Card */}
          {resumeLesson && (
            <div className="p-6 rounded-xl border border-primary/30 bg-[#121318] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-[10px] text-primary border-primary/30">
                    Lanjutkan Belajar
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    Tahap {String(resumeLesson.stageOrder).padStart(2, "0")}: {resumeLesson.stageTitle}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-foreground">
                  {resumeLesson.title}
                </h3>
                <p className="text-xs text-muted-foreground max-w-xl">
                  {resumeLesson.description}
                </p>
              </div>

              <Link href={`/lessons/${resumeLesson.slug}`}>
                <Button size="sm" className="gap-2 text-xs font-medium px-4 h-9">
                  Buka Materi Terakhir
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>
          )}

          {/* Category Progress Breakdown */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold tracking-tight text-foreground">
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
                  <Card key={category} className="p-5 border-border bg-card">
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="font-semibold text-foreground">
                        {category}
                      </span>
                      <span className="font-mono text-muted-foreground">
                        {categoryDone}/{categoryLessons.length} ({catPercentage}%)
                      </span>
                    </div>
                    <Progress value={catPercentage} className="h-1.5" />
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Bookmarked Lessons Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold tracking-tight text-foreground">
                Materi yang Disimpan ({bookmarkedItems.length})
              </h2>
            </div>

            {bookmarkedItems.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {bookmarkedItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col justify-between p-4 rounded-lg border border-border bg-card hover:border-primary/50 transition-colors group"
                  >
                    <div>
                      <div className="flex items-center justify-between text-[11px] text-muted-foreground mb-1.5 font-mono">
                        <span>Tahap {item.stageOrder}</span>
                        <span>{item.estimatedMinutes} mnt</span>
                      </div>
                      <h4 className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-muted-foreground mt-1 line-clamp-2">
                        {item.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-2.5 border-t border-border/80 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => toggleBookmark(item.id)}
                        className="text-xs text-muted-foreground hover:text-rose-400 flex items-center gap-1 transition-colors"
                      >
                        <Trash2 className="h-3 w-3" />
                        <span>Hapus</span>
                      </button>

                      <Link
                        href={`/lessons/${item.slug}`}
                        className="text-xs text-primary font-medium flex items-center gap-1 hover:underline"
                      >
                        <span>Buka</span>
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 rounded-lg border border-border bg-card text-center space-y-2">
                <Bookmark className="h-6 w-6 text-muted-foreground mx-auto" />
                <p className="text-xs text-muted-foreground">
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
