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
  Sparkles,
  Map,
  Award,
  Terminal,
  ShieldCheck,
  Check,
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
      code: `<article class="profile-card">
  <h2>Halo, Web Developer!</h2>
  <p>Mulai perjalanan belajarmu dari nol.</p>
  <button class="btn-action">Mulai Petualangan</button>
</article>`,
      previewHtml: `<div style="font-family: system-ui, sans-serif; padding: 20px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; max-width: 320px;">
  <h3 style="margin: 0 0 8px; color: #0f172a; font-size: 16px; font-weight: 700;">Halo, Web Developer!</h3>
  <p style="margin: 0 0 16px; color: #64748b; font-size: 13px;">Mulai perjalanan belajarmu dari nol.</p>
  <button style="background: #2563eb; color: #ffffff; border: none; padding: 8px 16px; border-radius: 6px; font-size: 12px; font-weight: 600; cursor: pointer;">Mulai Petualangan</button>
</div>`,
    },
    css: {
      code: `.container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  background: #ffffff;
  border-radius: 8px;
}`,
      previewHtml: `<div style="font-family: system-ui, sans-serif; display: flex; align-items: center; justify-content: space-between; gap: 12px; background: #ffffff; padding: 14px; border: 1px solid #e2e8f0; border-radius: 8px; max-width: 340px;">
  <div style="font-size: 13px; font-weight: 600; color: #0f172a;">Flexbox Item 1</div>
  <div style="font-size: 11px; background: #e0f2fe; color: #0284c7; padding: 4px 8px; border-radius: 4px; font-weight: 600;">Active</div>
</div>`,
    },
    js: {
      code: `function calculateProgress(completed, total) {
  const percentage = (completed / total) * 100;
  return \`Progress: \${Math.round(percentage)}%\`;
}

console.log(calculateProgress(12, 20));
// Output: "Progress: 60%"`,
      previewHtml: `<div style="font-family: monospace; background: #0f172a; color: #38bdf8; padding: 14px; border-radius: 8px; font-size: 12px; max-width: 340px;">
  <div style="color: #94a3b8; font-size: 10px; margin-bottom: 4px;">// JavaScript Console Output</div>
  <div>&gt; "Progress: 60%"</div>
</div>`,
    },
  };

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground transition-colors">
      <Navbar />
      <SearchCommandModal />

      <main className="flex-1 py-10 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl space-y-16">
          {/* =========================================================================
              1. HERO SECTION
             ========================================================================= */}
          <section className="relative p-6 sm:p-12 rounded-2xl border border-border bg-card shadow-sm space-y-8 overflow-hidden">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
              {/* Left Hero Text */}
              <div className="space-y-4 text-center lg:text-left max-w-xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-secondary text-xs font-semibold text-foreground border border-border">
                  <BookOpen className="h-3.5 w-3.5 text-primary" />
                  <span>KURIKULUM WEB DEVELOPMENT TERSTRUKTUR 2026</span>
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
                  Kuasai Web Development Modern dari Nol hingga Mahir.
                </h1>

                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  Belajar coding web dengan kurikulum terstruktur 20 tahap: fundamental internet, HTML5 semantik, CSS modern, JavaScript, React, Next.js 15, dan PostgreSQL dilengkapi interactive sandbox di setiap materi.
                </p>

                {/* Resume / Start Learning Callout */}
                <div className="pt-2 flex flex-col sm:flex-row items-center gap-3 justify-center lg:justify-start">
                  <Link href={`/lessons/${activeResumeLesson?.slug || "pengenalan-web-dan-sejarah-singkat"}`}>
                    <Button size="lg" className="h-11 px-6 text-xs sm:text-sm font-bold gap-2 rounded-md">
                      <span>{completedCount > 0 ? "Lanjutkan Belajar" : "Mulai Belajar Sekarang"}</span>
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>

                  <Link href="/roadmap">
                    <Button variant="outline" size="lg" className="h-11 px-6 text-xs sm:text-sm font-semibold rounded-md">
                      <span>Lihat Peta Kurikulum</span>
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Right Hero Companion Card */}
              <div className="w-full lg:max-w-md p-6 rounded-xl border border-border bg-secondary/50 space-y-4">
                {theme === "fun" ? (
                  <div className="flex items-center gap-4">
                    <NovaCharacter state="excited" className="w-16 h-16 shrink-0" />
                    <div className="space-y-1">
                      <div className="text-xs font-bold text-primary uppercase">Pemandu Belajar NOVA</div>
                      <p className="text-xs text-muted-foreground font-medium">
                        "Siap membantumu mempraktikkan kode di laboratorium interaktif!"
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between text-xs text-muted-foreground pb-2 border-b border-border">
                    <span className="font-semibold text-foreground">STATUS PEMBELAJARAN</span>
                    <span>{progressPercentage}% Selesai</span>
                  </div>
                )}

                <div className="space-y-2">
                  <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
                    Materi Terakhir Anda:
                  </span>
                  <div className="text-sm font-bold text-foreground">
                    {language === "en" && activeResumeLesson?.titleEn
                      ? activeResumeLesson.titleEn
                      : activeResumeLesson?.title}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Tahap {activeResumeLesson?.stageOrder}: {activeResumeLesson?.stageTitle}
                  </div>
                </div>

                <div className="h-2 w-full bg-background rounded-full border border-border overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-500 rounded-full"
                    style={{ width: `${Math.max(progressPercentage, 5)}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
                  <span>{completedCount} dari {totalLessons} materi selesai</span>
                  <Link href="/dashboard" className="text-primary hover:underline font-semibold">
                    Markas &rarr;
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* =========================================================================
              2. STRUCTURED 5 LEARNING TRACKS
             ========================================================================= */}
          <section className="space-y-6">
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-xs font-bold text-primary uppercase tracking-wider">
                ALUR KURIKULUM
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                5 Rumpun Kompetensi Menuju Fullstack
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl">
                Setiap tahap dirancang bertahap agar Anda memahami konsep fundamental sebelum beralih ke framework modern.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[
                {
                  order: "01",
                  title: "Fondasi Web & Internet",
                  titleEn: "Web & Internet Foundations",
                  desc: "HTTP, DNS, browser rendering engine, struktur request-response.",
                  stages: "Tahap 1 - 2",
                },
                {
                  order: "02",
                  title: "HTML5 Semantik & Aksesibilitas",
                  titleEn: "Semantic HTML5 & Accessibility",
                  desc: "Tag semantik, formulir, multimedia, struktur dokumen ramah SEO.",
                  stages: "Tahap 3 - 4",
                },
                {
                  order: "03",
                  title: "Modern CSS, Flexbox & Grid",
                  titleEn: "Modern CSS, Flexbox & Grid",
                  desc: "Box model, Flexbox, CSS Grid, media queries, dan UI layout responsif.",
                  stages: "Tahap 5 - 8",
                },
                {
                  order: "04",
                  title: "JavaScript Runtime & DOM",
                  titleEn: "JavaScript Runtime & DOM",
                  desc: "Logika pemrograman, manipulasi DOM, Event handling, Promise & Async.",
                  stages: "Tahap 9 - 14",
                },
                {
                  order: "05",
                  title: "React, Next.js & Fullstack",
                  titleEn: "React, Next.js & Fullstack",
                  desc: "React Hooks, Next.js 15 App Router, PostgreSQL, Prisma, & Capstone.",
                  stages: "Tahap 15 - 20",
                },
              ].map((track) => (
                <div
                  key={track.order}
                  className="p-6 rounded-xl border border-border bg-card shadow-xs flex flex-col justify-between space-y-4 hover:border-primary/50 transition-colors"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono font-bold text-primary">{track.order}</span>
                      <Badge variant="outline" className="text-[10px] font-semibold">
                        {track.stages}
                      </Badge>
                    </div>

                    <h3 className="text-base font-bold text-foreground">
                      {language === "en" ? track.titleEn : track.title}
                    </h3>

                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {track.desc}
                    </p>
                  </div>

                  <Link href="/roadmap">
                    <Button variant="ghost" size="sm" className="w-full text-xs font-semibold justify-between px-0 hover:bg-transparent text-primary hover:underline">
                      <span>Buka Materi</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </section>

          {/* =========================================================================
              3. INTERACTIVE CODE PRACTICE PREVIEW DEMO
             ========================================================================= */}
          <section className="p-6 sm:p-10 rounded-2xl border border-border bg-card space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-xs font-bold text-primary uppercase tracking-wider">
                  INTERACTIVE PRACTICE
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-foreground">
                  Belajar dengan Praktik Langsung di Setiap Materi
                </h2>
                <p className="text-xs text-muted-foreground">
                  Tulis kode, jalankan langsung, dan lihat hasilnya secara real-time.
                </p>
              </div>

              {/* Language Code Tabs */}
              <div className="flex items-center gap-1 p-1 rounded-lg bg-secondary border border-border self-start">
                {(["html", "css", "js"] as const).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveCodeTab(tab)}
                    className={`px-3 py-1 rounded text-xs font-semibold uppercase transition-colors ${
                      activeCodeTab === tab
                        ? "bg-card text-foreground shadow-xs font-bold"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Split Editor and Preview Showcase */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
              {/* Code Editor Pane */}
              <div className="lg:col-span-7 rounded-xl border border-border bg-secondary/80 p-4 font-mono text-xs text-foreground overflow-x-auto">
                <div className="flex items-center justify-between pb-3 border-b border-border text-[11px] text-muted-foreground mb-3">
                  <span>editor.snippet.{activeCodeTab}</span>
                  <span>Read-Only Preview</span>
                </div>
                <pre className="leading-relaxed whitespace-pre-wrap">
                  {codeSnippets[activeCodeTab].code}
                </pre>
              </div>

              {/* Output Pane */}
              <div className="lg:col-span-5 rounded-xl border border-border bg-card p-4 flex flex-col justify-between">
                <div>
                  <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider pb-2 border-b border-border mb-4">
                    Live Output Preview
                  </div>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: codeSnippets[activeCodeTab].previewHtml,
                    }}
                  />
                </div>

                <div className="pt-4 mt-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Real Browser Sandbox</span>
                  </span>

                  <Link href={`/lessons/${activeResumeLesson?.slug || "pengenalan-web-dan-sejarah-singkat"}`}>
                    <Button size="sm" className="h-8 text-xs font-semibold px-4">
                      Coba di Lesson &rarr;
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* =========================================================================
              4. HOW LEARNING WORKS
             ========================================================================= */}
          <section className="space-y-6">
            <div className="text-center max-w-2xl mx-auto space-y-1">
              <span className="text-xs font-bold text-primary uppercase tracking-wider">
                METODE BELAJAR
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground">
                4 Langkah Menguasai Setiap Materi
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  step: "1",
                  title: "Pahami Konsep",
                  desc: "Penjelasan ringkas, ilustratif, dan berfokus pada logika rekayasa perangkat lunak.",
                },
                {
                  step: "2",
                  title: "Eksperimen di Sandbox",
                  desc: "Tulis dan modifikasi kode langsung di dalam browser tanpa perlu setup yang rumit.",
                },
                {
                  step: "3",
                  title: "Uji Pemahaman",
                  desc: "Selesaikan quiz diagnostik dan latihan praktis dengan passing grade 80%.",
                },
                {
                  step: "4",
                  title: "Raih Sertifikat",
                  desc: "Selesaikan seluruh 20 tahap kurikulum untuk menerbitkan sertifikat kelulusan terverifikasi.",
                },
              ].map((item) => (
                <div
                  key={item.step}
                  className="p-5 rounded-xl border border-border bg-card space-y-2"
                >
                  <div className="h-7 w-7 rounded-lg bg-secondary text-primary flex items-center justify-center font-bold text-xs border border-border">
                    {item.step}
                  </div>
                  <h3 className="text-sm font-bold text-foreground">{item.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
