"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Code2,
  Compass,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  Play,
  Layers,
  Map,
  Award,
  Terminal,
  ShieldCheck,
  Check,
  Zap,
  Layout,
  Cpu,
  Globe,
  Sparkles,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SearchCommandModal } from "@/components/common/SearchCommandModal";
import { CURRICULUM_STAGES } from "@/data/curriculum";
import { useThemeLanguageStore } from "@/store/useThemeLanguageStore";
import { useCurriculumProgressStore } from "@/store/useCurriculumProgressStore";
import { getTranslations } from "@/lib/translations";
import { NovaCharacter } from "@/components/fun/characters/NovaCharacter";

export default function HomePage() {
  const { theme, language } = useThemeLanguageStore();
  const t = getTranslations(language);
  const { completedLessons } = useCurriculumProgressStore();

  const [activeCodeTab, setActiveCodeTab] = useState<"html" | "css" | "js">("html");

  // Determine user's active resume lesson
  const allLessons = CURRICULUM_STAGES.flatMap((s) =>
    s.lessons.map((l) => ({ ...l, stageOrder: s.orderIndex, stageTitle: s.titleId }))
  );

  const completedCount = Object.values(completedLessons).filter((k) => k?.completed).length;
  const totalLessons = allLessons.length;
  const progressPercentage = Math.round((completedCount / (totalLessons || 1)) * 100);

  const activeResumeLesson =
    allLessons.find((l) => !completedLessons[l.id]?.completed) || allLessons[0];

  const codeSnippets = {
    html: {
      code: `<article class="card">
  <h2>Halo, Web Developer!</h2>
  <p>Belajar HTML5 semantik dan struktur web modern.</p>
  <button class="btn-primary">Mulai Belajar</button>
</article>`,
      previewHtml: `<div style="font-family: system-ui, -apple-system, sans-serif; padding: 20px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; max-width: 320px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
  <h3 style="margin: 0 0 6px; color: #0f172a; font-size: 15px; font-weight: 700;">Halo, Web Developer!</h3>
  <p style="margin: 0 0 14px; color: #475569; font-size: 12px; line-height: 1.4;">Belajar HTML5 semantik dan struktur web modern.</p>
  <button style="background: #2563eb; color: #ffffff; border: none; padding: 6px 14px; border-radius: 6px; font-size: 11px; font-weight: 600; cursor: pointer;">Mulai Belajar</button>
</div>`,
    },
    css: {
      code: `.container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 16px;
}`,
      previewHtml: `<div style="font-family: system-ui, sans-serif; display: flex; align-items: center; justify-content: space-between; gap: 12px; background: #ffffff; padding: 14px; border: 1px solid #e2e8f0; border-radius: 8px; max-width: 340px;">
  <div style="font-size: 13px; font-weight: 600; color: #0f172a;">Flexbox Item 1</div>
  <div style="font-size: 11px; background: #e0f2fe; color: #0284c7; padding: 4px 8px; border-radius: 4px; font-weight: 600;">Aktif</div>
</div>`,
    },
    js: {
      code: `function calculateProgress(completed, total) {
  const percentage = (completed / total) * 100;
  return \`Progress: \${Math.round(percentage)}%\`;
}

console.log(calculateProgress(12, 20));
// Output: "Progress: 60%"`,
      previewHtml: `<div style="font-family: monospace; background: #0f172a; color: #38bdf8; padding: 14px; border-radius: 8px; font-size: 12px; max-width: 340px; line-height: 1.5;">
  <div style="color: #94a3b8; font-size: 10px; margin-bottom: 4px;">// Console Output</div>
  <div>&gt; "Progress: 60%"</div>
</div>`,
    },
  };

  const learningPillars = [
    {
      step: "01",
      title: "Web Foundations & Protokol",
      desc: "Memahami bagaimana internet, browser, DNS, request-response HTTP, dan DOM bekerja di balik layar.",
      icon: Globe,
      color: "text-blue-500",
    },
    {
      step: "02",
      title: "HTML5 Semantik & Modern CSS",
      desc: "Menyusun struktur web yang aksesibel dan membangun layout responsif dengan Flexbox, CSS Grid, dan Variabel.",
      icon: Layout,
      color: "text-emerald-500",
    },
    {
      step: "03",
      title: "JavaScript & DOM Interaktivitas",
      desc: "Menguasai logika pemrograman, fungsi, array, objek, manipulasi DOM real-time, event listener, dan async/fetch API.",
      icon: Cpu,
      color: "text-amber-500",
    },
    {
      step: "04",
      title: "React, Next.js & Fullstack MVP",
      desc: "Membangun antarmuka berbasis komponen modern, manajemen state, App Router, integrasi backend API, dan database PostgreSQL.",
      icon: Layers,
      color: "text-purple-500",
    },
  ];

  const learningSteps = [
    {
      num: "1",
      title: "Teori Ringkas & Terfokus",
      desc: "Setiap materi disusun to-the-point tanpa penjelasan bertele-tele, dilengkapi analogi jelas dan contoh kode.",
    },
    {
      num: "2",
      title: "Interactive Coding Sandbox",
      desc: "Langsung praktik menulis kode di browser. Eksekusi nyata dengan live preview dan JavaScript console.",
    },
    {
      num: "3",
      title: "Validasi & Umpan Balik Edukatif",
      desc: "Sistem memvalidasi solusi secara otomatis dan memberikan petunjuk mendidik jika ada kesalahan logika.",
    },
    {
      num: "4",
      title: "Klaim Sertifikat Pencapaian",
      desc: "Kumpulkan bukti kompetensi setiap menyelesaikan milestone tahapan kurikulum sebagai modal portofolio.",
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground transition-colors">
      <Navbar />
      <SearchCommandModal />

      <main className="flex-1 py-10 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl space-y-20">
          {/* =========================================================================
              1. HERO SECTION
             ========================================================================= */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-secondary text-foreground text-xs font-semibold border border-border">
                <span className="h-2 w-2 rounded-full bg-primary" />
                <span>Kurikulum Web Development 20 Tahap</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-extrabold text-foreground tracking-tight leading-[1.15]">
                Belajar Web Development Modern Secara{" "}
                <span className="text-primary">Terstruktur & Praktik Nyata.</span>
              </h1>

              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-xl">
                Kuasai konsep fundamental web, HTML5 semantik, CSS responsif, JavaScript logika, hingga ekosistem React & Next.js dengan latihan koding interaktif di setiap materi.
              </p>

              {/* Resume / Start CTA */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                <Link href={activeResumeLesson ? `/lessons/${activeResumeLesson.slug}` : "/roadmap"}>
                  <Button size="lg" className="h-11 text-xs sm:text-sm font-bold rounded-md px-6 gap-2 w-full sm:w-auto shadow-sm">
                    <span>{completedCount > 0 ? "Lanjutkan Belajar" : "Mulai Belajar Gratis (Tahap 01)"}</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>

                <Link href="/roadmap">
                  <Button variant="outline" size="lg" className="h-11 text-xs sm:text-sm font-semibold rounded-md px-6 gap-2 w-full sm:w-auto">
                    <Map className="h-4 w-4 text-muted-foreground" />
                    <span>Lihat Peta Roadmap</span>
                  </Button>
                </Link>
              </div>

              {/* Quick Info Badges */}
              <div className="pt-3 flex flex-wrap items-center gap-4 text-xs text-muted-foreground font-medium border-t border-border">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                  20 Tahapan Kurikulum
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <Code2 className="h-3.5 w-3.5 text-primary" />
                  Sandbox Koding Nyata
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <Award className="h-3.5 w-3.5 text-primary" />
                  Sertifikat Kompetensi
                </span>
              </div>
            </div>

            {/* Right Hero Code Sandbox Visual Preview */}
            <div className="lg:col-span-5">
              <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden space-y-0">
                {/* Editor Top Bar */}
                <div className="flex items-center justify-between px-4 py-2.5 bg-secondary/80 border-b border-border text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
                    <span className="ml-2 font-mono text-[11px] text-muted-foreground font-bold">
                      sandbox.preview.{activeCodeTab}
                    </span>
                  </div>

                  {/* Tabs */}
                  <div className="flex items-center gap-1">
                    {(["html", "css", "js"] as const).map((tab) => (
                      <button
                        key={tab}
                        type="button"
                        onClick={() => setActiveCodeTab(tab)}
                        className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold transition-colors ${
                          activeCodeTab === tab
                            ? "bg-primary text-primary-foreground font-extrabold"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Code Window */}
                <div className="p-4 bg-[#0B0F17] text-[#F8FAFC] font-mono text-xs overflow-x-auto leading-relaxed border-b border-border">
                  <pre>{codeSnippets[activeCodeTab].code}</pre>
                </div>

                {/* Live Output Section */}
                <div className="p-4 bg-secondary/40 space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-mono font-bold text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Play className="h-3 w-3 text-primary" />
                      LIVE RESULT OUTPUT
                    </span>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-sans font-semibold">
                      ✓ Real-time Execution
                    </span>
                  </div>

                  <div
                    className="p-2 rounded bg-card border border-border flex items-center justify-center min-h-[90px]"
                    dangerouslySetInnerHTML={{ __html: codeSnippets[activeCodeTab].previewHtml }}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* =========================================================================
              2. LEARNING PATHS (4 PILLARS)
             ========================================================================= */}
          <section className="space-y-6">
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-xs font-bold font-mono text-primary uppercase tracking-wider block">
                JALUR PEMBELAJARAN
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                4 Pilar Penguasaan Web Developer
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Dirancang dari fundamental awal agar kamu memiliki pemahaman arsitektur yang kokoh.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {learningPillars.map((pillar) => {
                const Icon = pillar.icon;
                return (
                  <div
                    key={pillar.step}
                    className="p-5 rounded-xl border border-border bg-card hover:border-primary/50 transition-colors space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-extrabold text-muted-foreground">
                          {pillar.step}
                        </span>
                        <Icon className={`h-5 w-5 ${pillar.color}`} />
                      </div>
                      <h3 className="text-sm font-bold text-foreground">
                        {pillar.title}
                      </h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {pillar.desc}
                      </p>
                    </div>

                    <Link href="/roadmap" className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1 pt-2">
                      <span>Jelajahi Tahap</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                );
              })}
            </div>
          </section>

          {/* =========================================================================
              3. HOW LEARNING WORKS (4-STEP WORKFLOW)
             ========================================================================= */}
          <section className="p-6 sm:p-10 rounded-2xl border border-border bg-card space-y-8">
            <div className="space-y-1 text-center max-w-xl mx-auto">
              <span className="text-xs font-bold font-mono text-primary uppercase tracking-wider block">
                METODOLOGI BELAJAR
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                Bagaimana Cara Belajar di BelajarinAja?
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Bukan sekadar menonton video pasif. BelajarinAja mengutamakan *learning-by-doing* aktif.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {learningSteps.map((step) => (
                <div key={step.num} className="space-y-2 p-4 rounded-xl bg-secondary/50 border border-border/80">
                  <div className="h-8 w-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold text-xs font-mono">
                    {step.num}
                  </div>
                  <h3 className="text-sm font-bold text-foreground pt-1">
                    {step.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* =========================================================================
              4. CURRICULUM HIGHLIGHTS (20 STAGES OVERVIEW)
             ========================================================================= */}
          <section className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
              <div className="space-y-1">
                <span className="text-xs font-bold font-mono text-primary uppercase tracking-wider block">
                  KURIKULUM LENGKAP
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                  20 Tahapan Materi Web Developer
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Struktur teratur yang memandu kamu dari baris kode pertama hingga rilis aplikasi web.
                </p>
              </div>

              <Link href="/roadmap">
                <Button variant="outline" size="sm" className="text-xs font-semibold rounded-md gap-1.5 h-9">
                  <span>Lihat Seluruh 20 Tahap</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {CURRICULUM_STAGES.slice(0, 6).map((stage) => {
                const firstLesson = stage.lessons[0];
                return (
                  <div
                    key={stage.id}
                    className="p-4 rounded-xl border border-border bg-card hover:border-primary/40 transition-colors space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-[10px] font-mono font-bold">
                          Tahap {String(stage.orderIndex).padStart(2, "0")}
                        </Badge>
                        <span className="text-[11px] text-muted-foreground font-mono">
                          {stage.lessons.length} Materi
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-foreground">
                        {language === "en" && stage.titleEn ? stage.titleEn : stage.titleId}
                      </h3>
                      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                        {language === "en" && stage.descriptionEn ? stage.descriptionEn : stage.description}
                      </p>
                    </div>

                    {firstLesson && (
                      <Link href={`/lessons/${firstLesson.slug}`} className="pt-2">
                        <Button size="sm" variant="secondary" className="w-full text-xs font-semibold h-8 justify-between">
                          <span>Mulai Materi</span>
                          <ArrowRight className="h-3 w-3 text-muted-foreground" />
                        </Button>
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* =========================================================================
              5. CALL TO ACTION (START NOW)
             ========================================================================= */}
          <section className="p-8 sm:p-12 rounded-2xl border border-border bg-card text-center space-y-6 shadow-sm">
            <div className="space-y-2 max-w-xl mx-auto">
              <h2 className="text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight">
                Siap Memulai Langkah Menjadi Web Developer?
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Akses seluruh 20 tahapan kurikulum, editor kode interaktif, dan sertifikat kompetensi tanpa dipungut biaya.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href={activeResumeLesson ? `/lessons/${activeResumeLesson.slug}` : "/roadmap"}>
                <Button size="lg" className="h-11 text-xs sm:text-sm font-bold rounded-md px-8 gap-2 shadow-sm">
                  <span>Mulai Tahap 01 Sekarang</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>

              <Link href="/roadmap">
                <Button variant="outline" size="lg" className="h-11 text-xs sm:text-sm font-semibold rounded-md px-6">
                  <span>Pelajari Roadmap</span>
                </Button>
              </Link>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}