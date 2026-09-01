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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SearchCommandModal } from "@/components/common/SearchCommandModal";
import { CURRICULUM_STAGES } from "@/data/curriculum";
import { useThemeLanguageStore } from "@/store/useThemeLanguageStore";
import { getTranslations } from "@/lib/translations";
import { BotCompanionCharacter } from "@/components/fun/characters/BotCompanionCharacter";
import { CodingCharacter } from "@/components/fun/characters/CodingCharacter";
import { VictoryAchievementCharacter } from "@/components/fun/characters/VictoryAchievementCharacter";
import { RoadmapExplorerCharacter } from "@/components/fun/characters/RoadmapExplorerCharacter";
import { RocketAdventureIllustration } from "@/components/fun/illustrations/RocketAdventureIllustration";

export default function HomePage() {
  const [activeSnippetIndex, setActiveSnippetIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const { theme, language } = useThemeLanguageStore();
  const t = getTranslations(language);

  const snippets = [
    {
      tab: "1. HTML5 Semantic",
      code: `<article class="lesson-card">\n  <h2>${language === "en" ? "Learn Web From Zero" : "Belajar Web Dari Nol"}</h2>\n  <p>${language === "en" ? "Start without login, master fullstack." : "Mulai tanpa login, bertahap hingga mahir."}</p>\n  <button class="btn-start">${language === "en" ? "Start Quest" : "Mulai Belajar"}</button>\n</article>`,
      output: language === "en" ? "Web Architecture Ready\nDOM Tree: Semantic Element Mounted\n[ Button: Start Quest ]" : "Belajar Web Dari Nol\nMulai tanpa login, bertahap hingga mahir.\n[ Tombol: Mulai Belajar ]",
    },
    {
      tab: "2. CSS Flexbox",
      code: `.roadmap-grid {\n  display: flex;\n  flex-direction: column;\n  gap: 16px;\n  background: #121318;\n  border-radius: 8px;\n}`,
      output: "/* CSS Box Model Ready */\nLayout: Flexbox Column\nGap: 16px | Surface: #121318",
    },
    {
      tab: "3. React Component",
      code: `export function LessonTracker() {\n  const [done, setDone] = useState(false);\n  return (\n    <button onClick={() => setDone(true)}>\n      {done ? "Completed ✅" : "Mark as Done"}\n    </button>\n  );\n}`,
      output: "Component Rendered: <LessonTracker />\nState: { done: false }\nEvent Handler: Attached",
    },
  ];

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const totalLessonsCount = CURRICULUM_STAGES.reduce(
    (acc, stage) => acc + stage.lessons.length,
    0
  );

  // =========================================================================
  // 1. FUN MODE: Playful Adventure Hub Layout
  // =========================================================================
  if (theme === "fun") {
    return (
      <div className="flex min-h-screen flex-col bg-[#FFF8E7] text-[#243447]">
        <Navbar />
        <SearchCommandModal />

        <main className="flex-1">
          {/* Fun Hero Section */}
          <section className="relative overflow-hidden py-12 sm:py-20 px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-6xl">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
                {/* Left Text Box */}
                <div className="flex-1 text-center lg:text-left space-y-6">
                  <div className="inline-flex items-center gap-2 rounded-full border-2 border-[#FED7AA] bg-[#FFF3D6] px-4 py-1.5 text-xs font-black text-[#D97706] shadow-[0_2px_8px_rgba(255,216,77,0.3)]">
                    <Sparkles className="h-4 w-4 text-[#FF9F43]" />
                    <span>{t.hero.funBadge}</span>
                  </div>

                  <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-[#243447] leading-tight">
                    {t.hero.funGreeting}
                  </h1>

                  <p className="text-base sm:text-lg font-medium text-[#475569] leading-relaxed max-w-xl mx-auto lg:mx-0">
                    {t.hero.funDescription}
                  </p>

                  <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                    <Link href="/roadmap">
                      <Button
                        size="lg"
                        className="rounded-full bg-[#FFD84D] hover:bg-[#FFC933] text-[#243447] font-black text-sm px-8 py-6 shadow-[0_6px_20px_rgba(255,216,77,0.45)] gap-2 hover:scale-105 transition-all"
                      >
                        <Compass className="h-5 w-5 text-[#243447]" />
                        <span>{t.hero.ctaFunStart}</span>
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>

                    <Link href="/glossary">
                      <Button
                        variant="outline"
                        size="lg"
                        className="rounded-full border-2 border-[#FED7AA] bg-white text-[#243447] font-black text-sm px-6 py-6 hover:bg-[#FFF8E7]"
                      >
                        <BookOpen className="h-4 w-4 mr-2 text-[#5CC8FF]" />
                        <span>{t.hero.ctaFunGlossary}</span>
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* Right Interactive Vector Illustration */}
                <div className="flex-1 flex justify-center items-center relative">
                  <div className="relative p-6 rounded-[36px] bg-white border-4 border-[#FED7AA] shadow-[0_20px_50px_rgba(255,155,84,0.15)] flex flex-col items-center">
                    <RocketAdventureIllustration className="w-56 h-56 sm:w-64 sm:h-64" />
                    <BotCompanionCharacter
                      className="w-20 h-20 -mt-6"
                      expression="excited"
                      speechBubbleText={language === "en" ? "Let's code together!" : "Ayo koding bersama!"}
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 5 Adventure World Continents Section */}
          <section className="py-14 px-4 sm:px-6 lg:px-8 border-t-2 border-[#FED7AA]/60 bg-white/60">
            <div className="mx-auto max-w-6xl space-y-8">
              <div className="text-center space-y-2">
                <Badge className="bg-[#FFF8E7] text-[#D97706] border border-[#FED7AA] font-black text-xs rounded-full px-3 py-1">
                  5 ADVENTURE CONTINENTS
                </Badge>
                <h2 className="text-2xl sm:text-3xl font-black text-[#243447]">
                  {language === "en" ? "Explore the Web Odyssey Realms" : "Jelajahi 5 Benua Petualangan Web"}
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    title: "Web Foundation Island",
                    titleId: "Pulau Dasar Web",
                    desc: "HTTP, DNS, Browser engines, semantic HTML structure.",
                    descId: "HTTP, DNS, Engine browser, dan struktur semantik HTML.",
                    icon: "🏝️",
                    badge: "Stages 1-4",
                    color: "border-[#FED7AA] bg-[#FFF8E7]",
                  },
                  {
                    title: "Frontend Styling Valley",
                    titleId: "Lembah Gaya Frontend",
                    desc: "Modern CSS, Flexbox, Grid, Responsive Design & UI systems.",
                    descId: "CSS modern, Flexbox, Grid, Desain responsif, & sistem UI.",
                    icon: "🎨",
                    badge: "Stages 5-8",
                    color: "border-[#5CC8FF]/40 bg-[#EBF8FF]",
                  },
                  {
                    title: "JavaScript Sorcery Forest",
                    titleId: "Hutan Mantra JavaScript",
                    desc: "DOM manipulation, async JS, TypeScript typing & APIs.",
                    descId: "Manipulasi DOM, async JS, pengetikan TypeScript, & API.",
                    icon: "⚡",
                    badge: "Stages 9-12",
                    color: "border-[#86EFAC] bg-[#F0FDF4]",
                  },
                  {
                    title: "Fullstack React Fortress",
                    titleId: "Benteng Fullstack React",
                    desc: "React hooks, Next.js App Router, SSR, Server Actions.",
                    descId: "React hooks, Next.js App Router, SSR, Server Actions.",
                    icon: "🏰",
                    badge: "Stages 13-16",
                    color: "border-[#FED7AA] bg-[#FFF8E7]",
                  },
                  {
                    title: "Backend & Database Kingdom",
                    titleId: "Kerajaan Backend & Database",
                    desc: "PostgreSQL, Prisma ORM, Auth, Web Security & Production Capstone.",
                    descId: "PostgreSQL, Prisma ORM, Auth, Keamanan Web & Capstone.",
                    icon: "👑",
                    badge: "Stages 17-20",
                    color: "border-[#5CC8FF]/40 bg-[#EBF8FF]",
                  },
                ].map((realm, idx) => (
                  <div
                    key={idx}
                    className={`p-6 rounded-[28px] border-2 ${realm.color} shadow-[0_8px_25px_rgba(0,0,0,0.03)] space-y-3 flex flex-col justify-between hover:-translate-y-1 transition-transform`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-3xl">{realm.icon}</span>
                        <Badge className="bg-white text-[#243447] border border-[#FED7AA] text-[10px] font-black rounded-full">
                          {realm.badge}
                        </Badge>
                      </div>
                      <h3 className="text-lg font-black text-[#243447]">
                        {language === "en" ? realm.title : realm.titleId}
                      </h3>
                      <p className="text-xs text-[#64748B] font-medium leading-relaxed">
                        {language === "en" ? realm.desc : realm.descId}
                      </p>
                    </div>

                    <Link href="/roadmap">
                      <Button size="sm" className="w-full rounded-full bg-white hover:bg-[#FFF8E7] text-[#243447] font-black text-xs border border-[#FED7AA] mt-2">
                        {language === "en" ? "Enter Realm" : "Masuki Benua"} &rarr;
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    );
  }

  // =========================================================================
  // 2. DARK MODE: Monochrome Obsidian Command Center Dashboard
  // =========================================================================
  if (theme === "dark") {
    return (
      <div className="flex min-h-screen flex-col bg-[#050505] text-[#FFFFFF] font-mono">
        <Navbar />
        <SearchCommandModal />

        <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl space-y-8">
            {/* Terminal Command Console Header */}
            <div className="p-6 sm:p-8 rounded border border-[#222222] bg-[#0A0A0A] space-y-6">
              <div className="flex items-center gap-2 text-xs text-[#888888]">
                <Terminal className="h-4 w-4 text-[#FFFFFF]" />
                <span className="text-[#FFFFFF] font-bold">SYSTEM_INIT // ARCHITECTURE_NODE</span>
                <span>•</span>
                <span>CURRICULUM_STAGES: 20</span>
              </div>

              <div className="space-y-2">
                <h1 className="text-2xl sm:text-4xl font-black text-[#FFFFFF] tracking-tight">
                  WEB_DEVELOPMENT // STRUCTURED_CURRICULUM
                </h1>
                <p className="text-xs sm:text-sm text-[#888888] max-w-2xl leading-relaxed">
                  20-stage rigorous engineering path from browser primitives and DOM mechanics to distributed PostgreSQL architecture and production security.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link href="/roadmap">
                  <Button className="h-9 text-xs font-mono bg-[#FFFFFF] hover:bg-[#E5E5E5] text-[#000000] font-black px-6 gap-2 rounded">
                    <Terminal className="h-3.5 w-3.5" />
                    <span>LAUNCH_ROADMAP</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>

                <Link href="/glossary">
                  <Button variant="outline" className="h-9 text-xs font-mono border-[#222222] bg-[#050505] text-[#CCCCCC] hover:text-[#FFFFFF] px-6 rounded">
                    <span>CLI_GLOSSARY</span>
                  </Button>
                </Link>
              </div>
            </div>

            {/* 4 Technical Telemetry Data Nodes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "MODULES_TOTAL", val: "20 STAGES", sub: "100% comprehensive" },
                { label: "VERIFICATION_ENGINE", val: "PASS GRADE 80%", sub: "Automated quiz gate" },
                { label: "STORAGE_SUBSYSTEM", val: "GUEST / SYNC", sub: "Local first persistence" },
                { label: "CERTIFICATE_AUTHORITY", val: "VERIFIED HASH", sub: "Cryptographic seal" },
              ].map((item, i) => (
                <div key={i} className="p-4 rounded border border-[#222222] bg-[#0A0A0A] space-y-1">
                  <span className="text-[10px] text-[#666666] block">{item.label}</span>
                  <div className="text-lg font-bold text-[#FFFFFF]">{item.val}</div>
                  <div className="text-[10px] text-[#888888]">{item.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  // =========================================================================
  // 3. LIGHT MODE: Modern Neo-Brutalist Editorial Paper Landing Page
  // =========================================================================
  return (
    <div className="flex min-h-screen flex-col bg-[#F7F4EA] text-[#121212]">
      <Navbar />
      <SearchCommandModal />

      <main className="flex-1">
        {/* Editorial Hero Section */}
        <section className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Column: Hero Copy */}
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm border-2 border-black bg-[#FFD84D] text-xs font-black font-mono shadow-[2px_2px_0px_#121212] uppercase">
                  <span>★</span>
                  <span>{t.hero.badge}</span>
                </div>

                <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight text-[#121212]">
                  {t.hero.titlePrefix}{" "}
                  <span className="bg-[#FFD84D] px-2 py-0.5 rounded-sm border-2 border-black shadow-[3px_3px_0px_#121212] inline-block mt-1">
                    {t.hero.titleHighlight}
                  </span>
                </h1>

                <p className="text-sm sm:text-base font-medium text-[#404040] leading-relaxed max-w-xl">
                  {t.hero.description}
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                  <Link href="/roadmap" className="w-full sm:w-auto">
                    <Button
                      size="lg"
                      className="w-full sm:w-auto rounded-lg border-2 border-black bg-[#FFD84D] hover:bg-[#F5CB32] text-[#121212] font-black text-xs sm:text-sm px-6 h-12 shadow-[4px_4px_0px_#121212] gap-2 hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_#121212] transition-all"
                    >
                      <Compass className="h-4 w-4" />
                      <span>{t.hero.ctaRoadmap}</span>
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>

                  <Link href="/glossary" className="w-full sm:w-auto">
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full sm:w-auto rounded-lg border-2 border-black bg-white text-[#121212] font-bold text-xs sm:text-sm px-6 h-12 shadow-[3px_3px_0px_#121212]"
                    >
                      <BookOpen className="h-4 w-4 mr-2" />
                      <span>{t.hero.ctaGlossary}</span>
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Right Column: Interactive Code Sandbox Card */}
              <div className="lg:col-span-5">
                <div className="rounded-2xl border-4 border-black bg-white shadow-[8px_8px_0px_#121212] overflow-hidden">
                  {/* Card Title Bar */}
                  <div className="bg-[#FFD84D] border-b-2 border-black px-4 py-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <div className="h-3 w-3 rounded-full border border-black bg-[#FF6B6B]" />
                      <div className="h-3 w-3 rounded-full border border-black bg-white" />
                      <div className="h-3 w-3 rounded-full border border-black bg-[#7BE495]" />
                    </div>
                    <span className="font-mono text-xs font-black uppercase text-[#121212]">
                      interactive_sandbox.ts
                    </span>
                  </div>

                  {/* Snippet Tabs */}
                  <div className="flex border-b-2 border-black bg-[#F7F4EA] text-xs font-black">
                    {snippets.map((snip, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setActiveSnippetIndex(idx)}
                        className={`flex-1 py-2 px-3 border-r-2 border-black last:border-r-0 transition-colors ${
                          activeSnippetIndex === idx
                            ? "bg-white text-[#121212]"
                            : "bg-[#EAE4D5] text-[#555555] hover:bg-[#F7F4EA]"
                        }`}
                      >
                        {snip.tab}
                      </button>
                    ))}
                  </div>

                  {/* Code Editor Body */}
                  <div className="p-4 bg-[#121212] text-white font-mono text-xs overflow-x-auto">
                    <pre className="text-[#A1A1AA]">
                      <code>{snippets[activeSnippetIndex].code}</code>
                    </pre>
                  </div>

                  {/* Output Terminal */}
                  <div className="p-3 bg-[#1E1E1E] border-t-2 border-black text-[#7BE495] font-mono text-[11px]">
                    <div className="text-[10px] text-[#888888] mb-1">TERMINAL OUTPUT:</div>
                    <pre className="whitespace-pre-wrap">{snippets[activeSnippetIndex].output}</pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
