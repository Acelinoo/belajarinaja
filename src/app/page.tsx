"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Compass,
  Layers,
  Code2,
  Cpu,
  Globe,
  Layout,
  Terminal,
  ShieldCheck,
  Check,
  Play,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SearchCommandModal } from "@/components/common/SearchCommandModal";
import { CURRICULUM_STAGES } from "@/data/curriculum";
import { useThemeLanguageStore } from "@/store/useThemeLanguageStore";
import { useCurriculumProgressStore } from "@/store/useCurriculumProgressStore";
import { getTranslations } from "@/lib/translations";

export default function HomePage() {
  const { theme, language } = useThemeLanguageStore();
  const t = getTranslations(language);
  const { completedLessons } = useCurriculumProgressStore();

  const [activeCodeTab, setActiveCodeTab] = useState<"html" | "css" | "js">("html");

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
      code: `<article class="hero-card">
  <h1>BelajarinAja</h1>
  <p>Kurikulum Web Development 20 Tahap dari Nol.</p>
  <a href="/roadmap" class="cta-link">Mulai Belajar</a>
</article>`,
      previewHtml: `<div style="font-family: system-ui, -apple-system, sans-serif; padding: 24px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; max-width: 320px; box-shadow: 0 4px 12px rgba(0,0,0,0.04);">
  <span style="font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #0284c7; display: block; margin-bottom: 6px;">Tahap 01</span>
  <h3 style="margin: 0 0 8px; color: #0f172a; font-size: 17px; font-weight: 800; letter-spacing: -0.02em;">BelajarinAja</h3>
  <p style="margin: 0 0 16px; color: #64748b; font-size: 12px; line-height: 1.5;">Kurikulum Web Development 20 Tahap dari Nol.</p>
  <button style="background: #0284c7; color: #ffffff; border: none; padding: 8px 16px; border-radius: 8px; font-size: 12px; font-weight: 700; cursor: pointer;">Mulai Belajar</button>
</div>`,
    },
    css: {
      code: `.editorial-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  background: var(--color-bg-surface);
  border: 1px solid var(--color-border);
  padding: 2.5rem;
}`,
      previewHtml: `<div style="font-family: system-ui, sans-serif; display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; background: #ffffff; padding: 16px; border: 1px solid #e2e8f0; border-radius: 12px; max-width: 340px;">
  <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 12px; border-radius: 8px; text-align: center; font-size: 11px; font-weight: 700; color: #0f172a;">HTML5</div>
  <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 12px; border-radius: 8px; text-align: center; font-size: 11px; font-weight: 700; color: #0f172a;">CSS Grid</div>
  <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 12px; border-radius: 8px; text-align: center; font-size: 11px; font-weight: 700; color: #0f172a;">JavaScript</div>
</div>`,
    },
    js: {
      code: `async function syncProgress(userId, stageId) {
  const res = await fetch("/api/v1/progress/sync", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, stageId, completed: true })
  });
  return await res.json();
}`,
      previewHtml: `<div style="font-family: monospace; background: #090a0c; color: #38bdf8; padding: 16px; border-radius: 10px; font-size: 12px; max-width: 340px; line-height: 1.6; border: 1px solid #222634;">
  <div style="color: #64748b; font-size: 10px; margin-bottom: 6px;">// Console Output</div>
  <div style="color: #4ade80;">[OK] Progress synced to PostgreSQL</div>
  <div style="color: #94a3b8; font-size: 11px; margin-top: 4px;">&gt; { stage: "01", status: "COMPLETED" }</div>
</div>`,
    },
  };

  const curriculumPhases = [
    {
      num: "01",
      title: language === "en" ? "Web Foundations & Protocol" : "Pondasi Web & Protokol",
      desc: language === "en"
        ? "Internet anatomy, browser rendering engines, HTTP/HTTPS lifecycle, DNS resolution, and industrial semantic HTML5 standards."
        : "Anatomi internet, cara kerja browser engine, request HTTP/HTTPS, DNS lookup, serta struktur semantik HTML5 yang standar industri.",
      topics: language === "en"
        ? ["HTTP/HTTPS & DNS", "Semantic HTML5", "Accessibility (a11y)", "Heading Hierarchy"]
        : ["HTTP/HTTPS & DNS", "HTML5 Semantik", "Aksesibilitas (a11y)", "Heading Hierarchy"],
      icon: Globe,
    },
    {
      num: "02",
      title: language === "en" ? "Modern Styling & CSS Architecture" : "Styling Modern & Arsitektur CSS",
      desc: language === "en"
        ? "Build pixel-perfect responsive layouts with Flexbox, CSS Grid, Box Model, Design Tokens, and Tailwind CSS."
        : "Menyusun tata letak responsif pixel-perfect dengan Flexbox, CSS Grid, Box Model, Design Tokens, dan utility styling Tailwind CSS.",
      topics: ["Flexbox & Grid", "Fluid Responsive", "Design Tokens", "Tailwind CSS v4"],
      icon: Layout,
    },
    {
      num: "03",
      title: language === "en" ? "JavaScript Engine & DOM Interactivity" : "JavaScript Engine & Interaktivitas DOM",
      desc: language === "en"
        ? "Master JS runtime execution, event loops, real-time DOM manipulation, closures, asynchronous Promises, and modern Fetch APIs."
        : "Memahami eksekusi runtime JS, event loop, manipulasi DOM real-time, closures, penanganan Promise asinkron, dan Fetch API modern.",
      topics: ["Event Loop & Scopes", "DOM Manipulation", "Promises & Async/Await", "Fetch REST API"],
      icon: Cpu,
    },
    {
      num: "04",
      title: language === "en" ? "React, Next.js & Fullstack Database" : "React, Next.js & Fullstack Database",
      desc: language === "en"
        ? "Engineer React component architecture, client/server state, Next.js 15 App Router Server Components, and PostgreSQL database integration."
        : "Membangun arsitektur komponen React, state management, Server Components, App Router Next.js 15, dan integrasi database PostgreSQL.",
      topics: ["Component Architecture", "Zustand & Context", "Next.js 15 App Router", "Prisma & PostgreSQL"],
      icon: Layers,
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground selection:bg-primary/30 transition-colors">
      <Navbar />
      <SearchCommandModal />

      <main className="flex-1">
        {/* =========================================================================
            1. DRAMATIC EDITORIAL HERO SECTION (Inspired by Gambar 2)
           ========================================================================= */}
        <section className="relative pt-8 pb-16 sm:pt-12 sm:pb-24 border-b border-border/70 overflow-hidden">
          {/* Subtle Ambient Background Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[900px] h-[400px] bg-primary/10 rounded-full blur-3xl -z-10 pointer-events-none" />

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Top Editorial Index Meta */}
            <div className="flex items-center justify-between border-b border-border/80 pb-3 mb-8 sm:mb-12 text-[11px] font-mono uppercase tracking-widest text-muted-foreground">
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-primary" />
                <span>
                  {language === "en"
                    ? "20-STAGE WEB DEVELOPMENT CURRICULUM"
                    : "KURIKULUM 20 TAHAP WEB DEVELOPMENT"}
                </span>
              </span>
              <span className="hidden sm:inline">
                {language === "en" ? "VERSION 2.0 • FREE ACCESS" : "VERSI 2.0 • AKSES GRATIS"}
              </span>
              <span>INDONESIA / EN</span>
            </div>

            {/* Central Dramatic Composition: "BELAJARIN" [Hero Developer Image] "AJA" */}
            <div className="relative flex flex-col items-center justify-center my-4 sm:my-8">
              <div className="w-full grid grid-cols-1 lg:grid-cols-12 items-center gap-6 sm:gap-8">
                {/* Left Typography Column: BELAJARIN */}
                <div className="lg:col-span-4 text-center lg:text-right">
                  <h1 className="text-5xl sm:text-7xl xl:text-8xl 2xl:text-9xl font-serif font-light tracking-tighter text-foreground uppercase select-none leading-none">
                    Belajarin
                  </h1>
                  <span className="block text-xs font-mono tracking-widest uppercase text-muted-foreground mt-2">
                    {language === "en" ? "[ FOUNDATIONS TO FULLSTACK ]" : "[ PONDASI HINGGA FULLSTACK ]"}
                  </span>
                </div>

                {/* Center Visual Art Canvas: Developer Image (Gambar 1) */}
                <div className="lg:col-span-4 flex justify-center relative my-4 lg:my-0">
                  {/* Portrait Frame */}
                  <div className="relative w-64 sm:w-80 aspect-square rounded-2xl overflow-hidden border border-border bg-card shadow-2xl group transition-all duration-300 hover:scale-[1.02]">
                    <img
                      src="/hero-developer.png"
                      alt="Developer BelajarinAja coding with modern IDE"
                      className="w-full h-full object-cover object-center"
                    />

                    {/* Subtle Overlay Gradient for Dark/Light Harmony */}
                    <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent pointer-events-none" />
                  </div>

                  {/* Overlapping Floating Editorial Leaflet */}
                  <div className="absolute -bottom-5 -left-2 sm:-left-6 p-3 sm:p-4 rounded-xl border border-border bg-card/95 backdrop-blur-md shadow-xl max-w-[190px] sm:max-w-[210px] hidden sm:block">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-primary font-bold block mb-1">
                      {language === "en" ? "HANDS-ON CODING" : "KODING MANDIRI"}
                    </span>
                    <p className="text-[11px] text-foreground font-medium leading-snug">
                      {language === "en"
                        ? "Interactive browser sandboxes embedded directly in every lesson."
                        : "Praktik langsung dengan sandbox interaktif di setiap akhir materi."}
                    </p>
                    <div className="mt-2 pt-2 border-t border-border flex items-center justify-between text-[9px] font-mono text-muted-foreground">
                      <span>{language === "en" ? "20 STAGES" : "20 TAHAP"}</span>
                      <span>100% REAL</span>
                    </div>
                  </div>

                  {/* Overlapping Quick Stats Badge on Right */}
                  <div className="absolute -top-3 -right-2 sm:-right-6 p-2.5 sm:p-3 rounded-xl border border-border bg-card/95 backdrop-blur-md shadow-xl text-left hidden sm:block">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground block">
                      {language === "en" ? "STUDY PROGRESS" : "STATUS PROGRESS"}
                    </span>
                    <span className="text-sm font-black text-foreground font-mono block mt-0.5">
                      {completedCount > 0
                        ? `${progressPercentage}% ${language === "en" ? "PASSED" : "LULUS"}`
                        : language === "en"
                        ? "READY TO START"
                        : "SIAP DIMULAI"}
                    </span>
                  </div>
                </div>

                {/* Right Typography Column: AJA */}
                <div className="lg:col-span-4 text-center lg:text-left">
                  <h2 className="text-5xl sm:text-7xl xl:text-8xl 2xl:text-9xl font-serif font-black tracking-tighter text-foreground uppercase select-none leading-none">
                    Aja<span className="text-primary font-serif font-black">.</span>
                  </h2>
                  <span className="block text-xs font-mono tracking-widest uppercase text-muted-foreground mt-2">
                    {language === "en" ? "[ PRAGMATIC • REAL WORLD PRACTICE ]" : "[ TANPA RIBET • PRAKTIK NYATA ]"}
                  </span>
                </div>
              </div>
            </div>

            {/* Editorial Thesis Statement & Action Bar */}
            <div className="mt-12 sm:mt-16 pt-8 border-t border-border/80 grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
              {/* Mission Statement */}
              <div className="lg:col-span-7 space-y-3 text-left">
                <span className="text-xs font-mono uppercase tracking-widest text-primary font-bold block">
                  {language === "en" ? "LEARNING MANIFESTO" : "MANIFIESTO PEMBELAJARAN"}
                </span>
                <p className="text-base sm:text-lg text-foreground font-normal leading-relaxed max-w-2xl">
                  {language === "en"
                    ? "A comprehensive 20-stage structured curriculum for aspiring engineers to master Web Development end-to-end. Starting from internet protocol fundamentals, semantic HTML5, responsive CSS, functional JavaScript, up to React, Next.js 15, and database architecture."
                    : "Platform kurikulum terstruktur untuk pemula yang ingin menguasai Web Development secara tuntas. Dimulai dari fundamental protokol internet, semantik HTML5, CSS responsif, JavaScript fungsional, hingga ekosistem React, Next.js 15, dan arsitektur database."}
                </p>
              </div>

              {/* Action Buttons & Counter */}
              <div className="lg:col-span-5 flex flex-col sm:flex-row items-stretch sm:items-center justify-start lg:justify-end gap-3.5">
                <Link
                  href={activeResumeLesson ? `/lessons/${activeResumeLesson.slug}` : "/roadmap"}
                  className="flex-1 sm:flex-none"
                >
                  <Button
                    size="lg"
                    className="h-12 px-7 text-xs sm:text-sm font-bold rounded-xl gap-2 w-full shadow-sm hover:-translate-y-0.5 transition-transform cursor-pointer"
                  >
                    <span>
                      {completedCount > 0
                        ? language === "en"
                          ? "Continue Active Stage"
                          : "Lanjutkan Tahap Aktif"
                        : language === "en"
                        ? "Start Stage 01 (Free)"
                        : "Mulai Tahap 01 (Gratis)"}
                    </span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>

                <Link href="/roadmap" className="flex-1 sm:flex-none">
                  <Button
                    variant="outline"
                    size="lg"
                    className="h-12 px-6 text-xs sm:text-sm font-semibold rounded-xl gap-2 w-full border-border bg-card hover:bg-secondary transition-colors cursor-pointer"
                  >
                    <span>{language === "en" ? "20-Stage Roadmap" : "Peta 20 Tahap"}</span>
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Minimalist Line Scroll Indicator */}
            <div className="flex flex-col items-center justify-center pt-14 text-muted-foreground">
              <span className="text-[10px] font-mono tracking-widest uppercase mb-2">
                {language === "en" ? "SCROLL DOWN" : "GULIR KE BAWAH"}
              </span>
              <div className="w-5 h-9 rounded-full border border-border flex items-start justify-center p-1">
                <span className="w-1 h-2 bg-primary rounded-full animate-bounce" />
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            2. CURRICULUM GALLERY: 4 MAJOR TRACKS (Editorial Exhibition)
           ========================================================================= */}
        <section className="py-16 sm:py-24 border-b border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
            {/* Section Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border pb-6">
              <div className="space-y-1 text-left">
                <span className="text-xs font-mono uppercase tracking-widest text-primary font-bold block">
                  {language === "en" ? "LEARNING PATHWAYS" : "PETA JALUR BELAJAR"}
                </span>
                <h2 className="text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight">
                  {language === "en" ? "Four Pillars of Modern Web Curriculum" : "Empat Pilar Kurikulum Industri"}
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground max-w-md text-left md:text-right">
                {language === "en"
                  ? "Each stage is structured sequentially without cognitive jumps so beginners genuinely grasp the logic behind code."
                  : "Setiap tahapan dirancang berurutan tanpa lompatan konsep agar pemula memahami logika di balik kode."}
              </p>
            </div>

            {/* 4 Track Cards (No Pill Badges, Pure Editorial Architecture) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {curriculumPhases.map((phase) => {
                const IconComponent = phase.icon;
                return (
                  <div
                    key={phase.num}
                    className="p-6 sm:p-7 rounded-2xl border border-border bg-card shadow-xs flex flex-col justify-between space-y-6 hover:border-primary/50 transition-all group"
                  >
                    <div className="space-y-4">
                      {/* Top Index & Icon */}
                      <div className="flex items-center justify-between pb-3 border-b border-border/70">
                        <span className="font-mono text-2xl font-black text-foreground tracking-tight">
                          {phase.num}
                        </span>
                        <div className="h-9 w-9 rounded-xl bg-secondary text-foreground flex items-center justify-center border border-border group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                          <IconComponent className="h-4 w-4" />
                        </div>
                      </div>

                      <h3 className="text-base font-bold text-foreground tracking-tight leading-snug">
                        {phase.title}
                      </h3>

                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {phase.desc}
                      </p>
                    </div>

                    {/* Topic Checklist */}
                    <div className="space-y-2 pt-4 border-t border-border/70">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground block">
                        {language === "en" ? "KEY TOPICS:" : "FOKUS MATERI:"}
                      </span>
                      <ul className="space-y-1.5 text-xs text-foreground font-medium">
                        {phase.topics.map((t, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <span className="w-1 h-1 bg-primary shrink-0" />
                            <span>{t}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* View Full Roadmap Link */}
            <div className="text-center pt-4">
              <Link
                href="/roadmap"
                className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-primary hover:underline group"
              >
                <span>
                  {language === "en"
                    ? "Explore Full 20 Stages & Curriculum Syllabus"
                    : "Lihat Seluruh 20 Tahap & Silabus Pembelajaran"}
                </span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </section>

        {/* =========================================================================
            3. INTERACTIVE PLAYGROUND / SANDBOX EXPERIENCE
           ========================================================================= */}
        <section className="py-16 sm:py-24 border-b border-border bg-card/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
            {/* Section Header */}
            <div className="max-w-2xl space-y-2 text-left">
              <span className="text-xs font-mono uppercase tracking-widest text-primary font-bold block">
                {language === "en" ? "HANDS-ON LEARNING METHOD" : "METODE PRAKTIK LANGSUNG"}
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight">
                {language === "en" ? "Code, Run, and Test in Browser" : "Koding, Jalankan, dan Uji di Tempat"}
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {language === "en"
                  ? "Every curriculum lesson is equipped with an in-browser sandbox engine executing HTML, CSS, and JavaScript real-time without complex local tooling."
                  : "Setiap materi kurikulum dilengkapi editor kode browser yang mengeksekusi HTML, CSS, dan JavaScript secara real-time tanpa perlu konfigurasi lokal yang rumit."}
              </p>
            </div>

            {/* Interactive Code Editor Preview */}
            <div className="rounded-2xl border border-border bg-card shadow-lg overflow-hidden grid grid-cols-1 lg:grid-cols-12">
              {/* Left: Code Editor Window */}
              <div className="lg:col-span-7 flex flex-col border-b lg:border-b-0 lg:border-r border-border bg-background/70">
                {/* Editor Tab Header */}
                <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-secondary/40">
                  <div className="flex items-center gap-1.5 font-mono text-xs">
                    {(["html", "css", "js"] as const).map((tab) => (
                      <button
                        key={tab}
                        type="button"
                        onClick={() => setActiveCodeTab(tab)}
                        className={`px-3 py-1 rounded-md transition-colors uppercase font-bold cursor-pointer ${
                          activeCodeTab === tab
                            ? "bg-card text-foreground shadow-xs border border-border"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>

                  <span className="text-[11px] font-mono text-muted-foreground hidden sm:inline">
                    Interactive Workspace
                  </span>
                </div>

                {/* Editor Content Area */}
                <div className="p-4 sm:p-6 font-mono text-xs sm:text-sm leading-relaxed overflow-x-auto text-foreground flex-1">
                  <pre className="whitespace-pre-wrap selection:bg-primary/20">
                    <code>{codeSnippets[activeCodeTab].code}</code>
                  </pre>
                </div>

                {/* Editor Footer */}
                <div className="px-4 py-2.5 border-t border-border bg-secondary/30 flex items-center justify-between text-[11px] font-mono text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Terminal className="h-3.5 w-3.5 text-primary" />
                    <span>Auto-evaluation engine ready</span>
                  </span>
                  <span>UTF-8</span>
                </div>
              </div>

              {/* Right: Live Preview Panel */}
              <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between bg-card">
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-border">
                    <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground font-bold">
                      {language === "en" ? "LIVE RENDER OUTPUT" : "HASIL LIVE RENDER"}
                    </span>
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  </div>

                  <div
                    className="p-4 rounded-xl border border-border bg-secondary/30 flex items-center justify-center min-h-[220px]"
                    dangerouslySetInnerHTML={{ __html: codeSnippets[activeCodeTab].previewHtml }}
                  />
                </div>

                <div className="pt-6 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
                  <span>{language === "en" ? "Evaluation passing score: 80%" : "Passing score evaluasi: 80%"}</span>
                  <Link href="/roadmap" className="font-bold text-primary hover:underline">
                    {language === "en" ? "Try Exercises →" : "Coba Latihan →"}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            4. MANIFESTO & SYSTEM ARCHITECTURE
           ========================================================================= */}
        <section className="py-16 sm:py-24 border-b border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="p-7 rounded-2xl border border-border bg-card space-y-4 text-left">
                <div className="text-xs font-mono font-bold text-primary uppercase tracking-widest">
                  {language === "en" ? "[ 01 / ADVANTAGE ]" : "[ 01 / KEUNGGULAN ]"}
                </div>
                <h3 className="text-lg font-bold text-foreground">
                  {language === "en" ? "Distraction-Free & Pure Focus" : "Bebas Distraksi & Fokus Materi"}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {language === "en"
                    ? "No tedious, hours-long videos that cause fatigue. All lessons are delivered in an interactive editorial text format that is concise, clear, and insight-dense."
                    : "Tidak ada video panjang berjam-jam yang membuat mengantuk. Seluruh materi disajikan dalam format teks editorial interaktif yang ringkas dan padat wawasan."}
                </p>
              </div>

              {/* Feature 2 */}
              <div className="p-7 rounded-2xl border border-border bg-card space-y-4 text-left">
                <div className="text-xs font-mono font-bold text-primary uppercase tracking-widest">
                  {language === "en" ? "[ 02 / SYNCHRONIZATION ]" : "[ 02 / SINKRONISASI ]"}
                </div>
                <h3 className="text-lg font-bold text-foreground">
                  {language === "en" ? "Automatic Cloud Sync" : "Progres Tersimpan Otomatis"}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {language === "en"
                    ? "Sign in seamlessly using your Google or GitHub account to sync all your milestones and progress across multiple devices."
                    : "Dapat mulai belajar langsung tanpa login sebagai tamu. Cukup hubungkan akun Google atau GitHub kapan saja untuk menyinkronkan seluruh pencapaian ke cloud."}
                </p>
              </div>

              {/* Feature 3 */}
              <div className="p-7 rounded-2xl border border-border bg-card space-y-4 text-left">
                <div className="text-xs font-mono font-bold text-primary uppercase tracking-widest">
                  {language === "en" ? "[ 03 / CREDENTIALS ]" : "[ 03 / KREDENSIAL ]"}
                </div>
                <h3 className="text-lg font-bold text-foreground">
                  {language === "en" ? "Verified Official Certificate" : "Sertifikat Kelulusan Resmi"}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {language === "en"
                    ? "Complete all 20 stages and pass evaluation quizzes to receive a verified digital certificate with a unique credential code for your CV and LinkedIn."
                    : "Selesaikan ke-20 tahapan dan lulus ujian evaluasi untuk menerbitkan sertifikat digital terverifikasi dengan kode unik yang dapat dicantumkan di CV atau LinkedIn."}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            5. FINAL EDITORIAL INVITATION (CALL TO ACTION)
           ========================================================================= */}
        <section className="py-20 sm:py-32 text-center relative overflow-hidden">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="space-y-3">
              <span className="text-xs font-mono uppercase tracking-widest text-primary font-bold block">
                {language === "en" ? "FIRST STEP" : "LANGKAH PERTAMA"}
              </span>
              <h2 className="text-4xl sm:text-6xl font-serif font-black tracking-tight text-foreground uppercase leading-tight">
                {language === "en" ? "Start Coding Today." : "Mulai Koding Hari Ini."}
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
                {language === "en"
                  ? "Join our community of modern web development learners. 20 structured stages await you, from browser foundations to fullstack engineering."
                  : "Bergabunglah bersama komunitas pembelajar web development. 20 tahap terstruktur menanti Anda dari browser dasar hingga fullstack engineer."}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <Link href={activeResumeLesson ? `/lessons/${activeResumeLesson.slug}` : "/roadmap"}>
                <Button size="lg" className="h-12 px-8 text-xs sm:text-sm font-bold rounded-xl gap-2 shadow-md">
                  <span>{language === "en" ? "Start Learning Now" : "Mulai Belajar Sekarang"}</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/glossary">
                <Button variant="outline" size="lg" className="h-12 px-7 text-xs sm:text-sm font-semibold rounded-xl border-border bg-card hover:bg-secondary">
                  <span>{language === "en" ? "Explore Web Glossary" : "Buka Glosarium Web"}</span>
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}