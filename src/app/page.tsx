"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Code2,
  Compass,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  Terminal,
  ShieldCheck,
  Play,
  Copy,
  Check,
  Sparkles,
  Map,
  Trophy,
  Star,
  Award,
  Activity,
  Layers,
  Zap,
  Clock,
  ChevronRight,
  Flame,
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

  const [copied, setCopied] = useState(false);

  // Determine user's active resume lesson
  const allLessons = CURRICULUM_STAGES.flatMap((s) =>
    s.lessons.map((l) => ({ ...l, stageOrder: s.orderIndex, stageTitle: s.titleId }))
  );

  const completedCount = Object.values(completedLessons).filter((k) => k?.completed).length;
  const totalLessons = allLessons.length;
  const progressPercentage = Math.round((completedCount / (totalLessons || 1)) * 100);

  const activeResumeLesson =
    allLessons.find((l) => !completedLessons[l.id]?.completed) || allLessons[0];

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  // =========================================================================
  // 1. FUN MODE: THE STORY-DRIVEN JOURNEY HOME (with NOVA)
  // =========================================================================
  if (theme === "fun") {
    return (
      <div className="flex min-h-screen flex-col bg-[#FFF8E7] text-[#243447]">
        <Navbar />
        <SearchCommandModal />

        <main className="flex-1 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl space-y-12">
            {/* Story Welcome Hero */}
            <section className="relative p-8 sm:p-12 rounded-[40px] border-4 border-[#FED7AA] bg-gradient-to-b from-[#FFF8E7] via-white to-white shadow-[0_20px_50px_rgba(255,155,84,0.12)] overflow-hidden">
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="space-y-4 text-center md:text-left max-w-xl">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFF8E7] border-2 border-[#FED7AA] shadow-[0_2px_8px_rgba(255,216,77,0.3)]">
                    <Sparkles className="h-4 w-4 text-[#FF9F43]" />
                    <span className="text-xs font-black text-[#D97706] uppercase tracking-wider">
                      SELAMAT DATANG DI DUNIA KODING
                    </span>
                  </div>

                  <h1 className="text-3xl sm:text-5xl font-black text-[#243447] tracking-tight leading-tight">
                    {language === "en" ? "Good day, Web Explorer." : "Selamat Berpetualang, Calon Web Developer!"}
                  </h1>

                  <p className="text-sm sm:text-base font-medium text-[#64748B] leading-relaxed">
                    {language === "en"
                      ? "Your quest to become a skilled Fullstack Developer continues. Master modules, test spells in the interactive lab, and build real websites."
                      : "Misi petualanganmu menjadi Fullstack Web Developer dimulai di sini. Taklukkan 20 pulau koding, coba mantra di laboratorium interaktif, dan kumpulkan bintang kelulusan!"}
                  </p>

                  {/* Active Exploration Callout */}
                  <div className="p-5 rounded-3xl border-2 border-[#5CC8FF] bg-[#F0F9FF] flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-left space-y-1">
                      <span className="text-[10px] font-black text-[#0284C7] uppercase tracking-widest block">
                        MISI AKTIF HARI INI:
                      </span>
                      <div className="text-sm font-black text-[#0369A1]">
                        {language === "en" && activeResumeLesson?.titleEn
                          ? activeResumeLesson.titleEn
                          : activeResumeLesson?.title}
                      </div>
                      <div className="text-xs text-[#0284C7] font-medium">
                        Tahap {activeResumeLesson?.stageOrder}: {activeResumeLesson?.stageTitle}
                      </div>
                    </div>

                    <Link href={`/lessons/${activeResumeLesson?.slug || "pengenalan-web-dan-sejarah-singkat"}`}>
                      <Button className="rounded-full bg-[#FFD84D] hover:bg-[#FFC933] text-[#243447] font-black text-xs h-11 px-6 shadow-[0_4px_16px_rgba(255,216,77,0.4)] gap-2">
                        <span>Lanjutkan Petualangan</span>
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* NOVA Guide Animation */}
                <div className="flex flex-col items-center p-6 rounded-[36px] border-3 border-[#FED7AA] bg-[#FFF8E7] text-center max-w-xs shadow-[0_10px_30px_rgba(255,155,84,0.12)]">
                  <NovaCharacter
                    state="excited"
                    className="w-28 h-28 mb-3"
                    speechText="Aku siap menemanimu menulis kode hari ini!"
                  />
                  <h3 className="text-sm font-black text-[#243447]">Pemandu Pribadimu: NOVA</h3>
                  <p className="text-[11px] text-[#64748B] font-medium mt-1">
                    Memberikan petunjuk cerdas saat kamu buntu di laboratorium koding.
                  </p>
                </div>
              </div>
            </section>

            {/* Your Journey Continents Section */}
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-black text-[#D97706] uppercase tracking-wider block">
                    🗺️ ALUR PETUALANGAN
                  </span>
                  <h2 className="text-2xl font-black text-[#243447]">
                    5 Benua yang Akan Kamu Taklukkan
                  </h2>
                </div>

                <Link href="/roadmap">
                  <Button variant="outline" className="rounded-full border-[#FED7AA] bg-white text-[#D97706] font-black text-xs h-9 px-4">
                    <span>Buka Peta Lengkap</span>
                    <ArrowRight className="h-3.5 w-3.5 ml-1" />
                  </Button>
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {[
                  {
                    title: "Kepulauan Fondasi Web",
                    titleEn: "Web Foundation Island",
                    desc: "HTTP, DNS, browser engine, dan tiga pilar web.",
                    descEn: "HTTP, DNS, browser engines, and web pillars.",
                    badge: "Tahap 1-2",
                    icon: "⛵",
                  },
                  {
                    title: "Lembah Semantik HTML",
                    titleEn: "HTML Valley & Blueprints",
                    desc: "Tag semantik, form input, dan hierarki dokumen ramah SEO.",
                    descEn: "Semantic tags, accessible forms, and SEO layout.",
                    badge: "Tahap 3-4",
                    icon: "🏛️",
                  },
                  {
                    title: "Kota Estetika CSS",
                    titleEn: "CSS City of Styles",
                    desc: "Flexbox, Grid, box-model, animasi, dan layout responsif.",
                    descEn: "Flexbox, Grid, box-model, and fluid responsive UI.",
                    badge: "Tahap 5-8",
                    icon: "🎨",
                  },
                  {
                    title: "Hutan Logika JavaScript",
                    titleEn: "JavaScript Forest of Logic",
                    desc: "DOM manipulation, event handling, async/await, & API fetch.",
                    descEn: "DOM manipulation, event handling, and async logic.",
                    badge: "Tahap 9-14",
                    icon: "⚡",
                  },
                  {
                    title: "Benteng Fullstack & React",
                    titleEn: "Fullstack Citadel & Beyond",
                    desc: "React Hooks, Next.js 15, PostgreSQL, Prisma, & Capstone.",
                    descEn: "React, Next.js 15, PostgreSQL, Prisma, & Capstone.",
                    badge: "Tahap 15-20",
                    icon: "🏰",
                  },
                ].map((realm, idx) => (
                  <div
                    key={idx}
                    className="p-6 rounded-[32px] border-2 border-[#FED7AA] bg-white shadow-[0_8px_25px_rgba(255,155,84,0.06)] flex flex-col justify-between space-y-4 hover:-translate-y-1 transition-transform"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-2xl">{realm.icon}</span>
                        <span className="text-[10px] font-black text-[#D97706] bg-[#FFF8E7] px-2.5 py-0.5 rounded-full border border-[#FED7AA]">
                          {realm.badge}
                        </span>
                      </div>
                      <h3 className="text-base font-black text-[#243447]">
                        {language === "en" ? realm.titleEn : realm.title}
                      </h3>
                      <p className="text-xs text-[#64748B] font-medium leading-relaxed">
                        {language === "en" ? realm.descEn : realm.desc}
                      </p>
                    </div>

                    <Link href="/roadmap">
                      <Button size="sm" className="w-full rounded-full bg-[#FFF8E7] hover:bg-[#FFE8B8] text-[#243447] font-black text-xs border border-[#FED7AA]">
                        <span>Jelajahi Benua</span> &rarr;
                      </Button>
                    </Link>
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

  // =========================================================================
  // 2. DARK MODE: THE DEVELOPER TERMINAL WORKSPACE HOME (100% Monochrome)
  // =========================================================================
  if (theme === "dark") {
    return (
      <div className="flex min-h-screen flex-col bg-[#050505] text-[#FFFFFF] font-mono">
        <Navbar />
        <SearchCommandModal />

        <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl space-y-8">
            {/* Developer Workspace Header */}
            <div className="p-6 sm:p-8 rounded border border-[#222222] bg-[#0A0A0A] space-y-6">
              <div className="flex items-center justify-between text-xs text-[#888888]">
                <div className="flex items-center gap-2">
                  <Terminal className="h-4 w-4 text-[#FFFFFF]" />
                  <span className="text-[#FFFFFF] font-bold">WORKSPACE // ACTIVE_SESSION</span>
                </div>
                <span>NODE_ENV: PRODUCTION</span>
              </div>

              {/* Prominent CONTINUE LEARNING Buffer */}
              <div className="p-6 rounded border border-[#333333] bg-[#050505] space-y-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#888888] uppercase tracking-widest font-bold">
                    &gt; CONTINUE LEARNING
                  </span>
                  <span className="text-[#FFFFFF]">STAGE_{String(activeResumeLesson?.stageOrder || 1).padStart(2, "0")}</span>
                </div>

                <div className="space-y-1">
                  <h1 className="text-xl sm:text-2xl font-black text-[#FFFFFF]">
                    {language === "en" && activeResumeLesson?.titleEn
                      ? activeResumeLesson.titleEn
                      : activeResumeLesson?.title}
                  </h1>
                  <p className="text-xs text-[#888888] leading-relaxed max-w-xl">
                    {language === "en" && activeResumeLesson?.descriptionEn
                      ? activeResumeLesson.descriptionEn
                      : activeResumeLesson?.description}
                  </p>
                </div>

                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <Link href={`/lessons/${activeResumeLesson?.slug || "pengenalan-web-dan-sejarah-singkat"}`}>
                    <Button className="h-9 text-xs font-mono bg-[#FFFFFF] hover:bg-[#E5E5E5] text-[#000000] font-black rounded px-6 gap-2">
                      <Terminal className="h-3.5 w-3.5" />
                      <span>OPEN_IN_CODE_LAB</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </Link>

                  <Link href="/roadmap">
                    <Button variant="outline" className="h-9 text-xs font-mono border-[#222222] bg-[#050505] text-[#CCCCCC] hover:text-[#FFFFFF] rounded px-5">
                      <span>INSPECT_DEPENDENCY_TREE</span>
                    </Button>
                  </Link>
                </div>
              </div>

              {/* CURRENT PATH Progress Pipeline Visualizer */}
              <div className="p-4 rounded border border-[#222222] bg-[#050505] space-y-3">
                <span className="text-[10px] text-[#666666] tracking-widest uppercase font-bold block">
                  SYSTEM_EXECUTION_PIPELINE:
                </span>

                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="px-3 py-1 rounded border border-[#333333] bg-[#111111] text-[#FFFFFF] font-bold">
                    1. WEB_PROTOCOLS
                  </span>
                  <span className="text-[#555555]">&rarr;</span>
                  <span className="px-3 py-1 rounded border border-[#333333] bg-[#111111] text-[#FFFFFF] font-bold">
                    2. HTML5_SEMANTICS
                  </span>
                  <span className="text-[#555555]">&rarr;</span>
                  <span className="px-3 py-1 rounded border border-[#333333] bg-[#111111] text-[#FFFFFF] font-bold">
                    3. CSS_GRID_FLEX
                  </span>
                  <span className="text-[#555555]">&rarr;</span>
                  <span className="px-3 py-1 rounded border border-[#FFFFFF] bg-[#FFFFFF] text-[#000000] font-black">
                    4. JAVASCRIPT_RUNTIME [YOU]
                  </span>
                  <span className="text-[#555555]">&rarr;</span>
                  <span className="px-3 py-1 rounded border border-[#222222] bg-[#050505] text-[#666666]">
                    5. REACT_FULLSTACK
                  </span>
                </div>
              </div>
            </div>

            {/* Technical Specifications Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 rounded border border-[#222222] bg-[#0A0A0A] space-y-2">
                <span className="text-[10px] text-[#666666] block">01 // EXECUTION_ENGINE</span>
                <h3 className="text-sm font-bold text-[#FFFFFF]">Real In-Browser Sandbox</h3>
                <p className="text-xs text-[#888888]">
                  Zero mockups. Code executes natively in browser-safe runtime with live DOM rendering and stdout capture.
                </p>
              </div>

              <div className="p-5 rounded border border-[#222222] bg-[#0A0A0A] space-y-2">
                <span className="text-[10px] text-[#666666] block">02 // EVALUATION_GATE</span>
                <h3 className="text-sm font-bold text-[#FFFFFF]">Automated Debug Quizzes</h3>
                <p className="text-xs text-[#888888]">
                  Passing grade of 80% enforced across all 20 modules to unlock downstream architectural nodes.
                </p>
              </div>

              <div className="p-5 rounded border border-[#222222] bg-[#0A0A0A] space-y-2">
                <span className="text-[10px] text-[#666666] block">03 // CERTIFICATE_SEAL</span>
                <h3 className="text-sm font-bold text-[#FFFFFF]">Cryptographic Verification</h3>
                <p className="text-xs text-[#888888]">
                  Graduation diploma with verifiable hash issued upon 100% completion of the curriculum.
                </p>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  // =========================================================================
  // 3. LIGHT MODE: MODERN NEO-BRUTALIST EDITORIAL LEARNING PLATFORM
  // =========================================================================
  return (
    <div className="flex min-h-screen flex-col bg-[#F7F4EA] text-[#121212]">
      <Navbar />
      <SearchCommandModal />

      <main className="flex-1 py-10 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl space-y-12">
          {/* Editorial Hero Banner */}
          <section className="p-8 sm:p-12 rounded-3xl border-2 border-black bg-white shadow-[8px_8px_0px_#121212] space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-md border-2 border-black bg-[#FFD84D] text-xs font-black shadow-[2px_2px_0px_#121212]">
              <BookOpen className="h-4 w-4" />
              <span>KURIKULUM WEB DEVELOPMENT TERSTRUKTUR 2026</span>
            </div>

            <div className="space-y-3 max-w-3xl">
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-[#121212] leading-tight">
                Kuasai Web Development Modern dari Nol hingga Mahir.
              </h1>
              <p className="text-sm sm:text-base text-[#555555] leading-relaxed">
                Platform pembelajaran rekayasa perangkat lunak web komprehensif 20 tahap: dari fundamental HTML5/CSS3, JavaScript, TypeScript, React, Next.js 15, PostgreSQL & Prisma, hingga Capstone Project produksi.
              </p>
            </div>

            {/* Callout Resume Card */}
            <div className="p-6 rounded-2xl border-2 border-black bg-[#F7F4EA] shadow-[4px_4px_0px_#121212] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-xs font-mono font-black uppercase text-[#555555]">
                  Materi Terakhir Anda:
                </span>
                <h3 className="text-base font-black text-[#121212]">
                  {language === "en" && activeResumeLesson?.titleEn
                    ? activeResumeLesson.titleEn
                    : activeResumeLesson?.title}
                </h3>
                <span className="text-xs text-[#555555]">
                  Tahap {activeResumeLesson?.stageOrder}: {activeResumeLesson?.stageTitle}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <Link href={`/lessons/${activeResumeLesson?.slug || "pengenalan-web-dan-sejarah-singkat"}`}>
                  <Button className="rounded-lg border-2 border-black bg-[#FFD84D] hover:bg-[#F5CB32] text-[#121212] font-black text-xs h-10 px-6 shadow-[3px_3px_0px_#121212] gap-1.5">
                    <span>Lanjutkan Belajar</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/roadmap">
                  <Button variant="outline" className="rounded-lg border-2 border-black bg-white text-[#121212] font-black text-xs h-10 px-5 shadow-[3px_3px_0px_#121212]">
                    <span>Buka Roadmap</span>
                  </Button>
                </Link>
              </div>
            </div>
          </section>

          {/* Curriculum Tracks Breakdown */}
          <section className="space-y-6">
            <div className="space-y-1">
              <h2 className="text-2xl font-black text-[#121212]">20 Tahapan Alur Pembelajaran</h2>
              <p className="text-xs text-[#555555]">Disusun sistematis untuk membimbing Anda dari nol hingga siap kerja di industri.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl border-2 border-black bg-white shadow-[6px_6px_0px_#121212] space-y-2">
                <span className="text-xs font-mono font-black text-[#555555] block">BAGIAN 01</span>
                <h3 className="text-base font-black text-[#121212]">Fondasi & Frontend Dasar</h3>
                <p className="text-xs text-[#555555] leading-relaxed">
                  Arsitektur internet, HTML5 semantik, CSS box model, Flexbox, Grid layout, dan responsivitas modern.
                </p>
              </div>

              <div className="p-6 rounded-2xl border-2 border-black bg-white shadow-[6px_6px_0px_#121212] space-y-2">
                <span className="text-xs font-mono font-black text-[#555555] block">BAGIAN 02</span>
                <h3 className="text-base font-black text-[#121212]">JavaScript, DOM & Async</h3>
                <p className="text-xs text-[#555555] leading-relaxed">
                  Struktur data, manipulasi DOM, event handling, Promise, async/await, API integration, dan TypeScript.
                </p>
              </div>

              <div className="p-6 rounded-2xl border-2 border-black bg-white shadow-[6px_6px_0px_#121212] space-y-2">
                <span className="text-xs font-mono font-black text-[#555555] block">BAGIAN 03</span>
                <h3 className="text-base font-black text-[#121212]">React, Next.js & Fullstack</h3>
                <p className="text-xs text-[#555555] leading-relaxed">
                  Komponen React, Next.js 15 App Router, PostgreSQL, Prisma ORM, Keamanan Web, dan Capstone Project.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
