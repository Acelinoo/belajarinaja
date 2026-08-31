"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Code2,
  Compass,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  Layers,
  Terminal,
  ShieldCheck,
  Zap,
  Play,
  Copy,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MagnetButton } from "@/components/ui/magnet-button";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { GridPattern } from "@/components/ui/grid-pattern";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SearchCommandModal } from "@/components/common/SearchCommandModal";
import { CURRICULUM_STAGES } from "@/data/curriculum";

export default function HomePage() {
  const [activeSnippetIndex, setActiveSnippetIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  const snippets = [
    {
      tab: "1. HTML Structure",
      code: `<article class="lesson-card">\n  <h2>Belajar Web Dari Nol</h2>\n  <p>Mulai tanpa login, bertahap hingga mahir.</p>\n  <button class="btn-start">Mulai Belajar</button>\n</article>`,
      output: "Belajar Web Dari Nol\nMulai tanpa login, bertahap hingga mahir.\n[ Tombol: Mulai Belajar ]",
    },
    {
      tab: "2. CSS Flexbox",
      code: `.roadmap-grid {\n  display: flex;\n  flex-direction: column;\n  gap: 16px;\n  background: #121318;\n  border-radius: 8px;\n}`,
      output: "/* CSS Box Model Ready */\nLayout: Flexbox Column\nGap: 16px | Surface: #121318",
    },
    {
      tab: "3. React Component",
      code: `export function LessonTracker() {\n  const [done, setDone] = useState(false);\n  return (\n    <button onClick={() => setDone(true)}>\n      {done ? "Terselesaikan ✅" : "Tandai Selesai"}\n    </button>\n  );\n}`,
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

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Navbar />
      <SearchCommandModal />

      <main className="flex-1">
        {/* Hero Section with React Bits Background Grid */}
        <section className="relative overflow-hidden border-b-2 border-black py-20 sm:py-28 bg-[#F7F4EA] dark:border-b dark:border-[#1C242D] dark:bg-[#05070A]">
          <GridPattern
            width={40}
            height={40}
            squares={[
              [2, 3],
              [4, 1],
              [8, 2],
              [12, 4],
              [16, 2],
            ]}
          />

          <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 rounded-md border-2 border-black bg-[#FFD84D] px-4 py-1.5 text-xs font-black text-[#121212] shadow-[3px_3px_0px_#121212] mb-6 dark:rounded-full dark:border dark:border-cyan-500/30 dark:bg-cyan-500/10 dark:text-cyan-300 dark:font-mono dark:shadow-[0_0_12px_rgba(34,211,238,0.15)]">
                <Terminal className="h-3.5 w-3.5 text-[#121212] dark:text-cyan-400" />
                <span>Roadmap Web Developer Dari Nol — 20 Tahap & {totalLessonsCount} Modul Pembelajaran</span>
              </div>

              <h1 className="text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl text-balance text-foreground">
                Kuasai Web Development Dari Dasar Hingga Siap Kerja
              </h1>

              <p className="mt-6 max-w-2xl mx-auto text-base sm:text-lg font-medium text-[#404040] dark:font-normal dark:text-[#94A3B8] text-pretty">
                Alur belajar terstruktur dari konsep dasar komputer hingga pembuatan aplikasi fullstack modern.
                Mulai belajar langsung sebagai <strong className="font-extrabold text-foreground underline decoration-[#FFD84D] dark:decoration-cyan-400 decoration-4">Guest tanpa rintangan login</strong>.
              </p>

              <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                <Link href="/roadmap">
                  <MagnetButton size="lg" className="gap-2 font-black px-6 border-2 border-black bg-[#FFD84D] text-[#121212] shadow-[4px_4px_0px_#121212] hover:bg-[#F5CB32] dark:border dark:border-cyan-500/40 dark:bg-cyan-500/15 dark:text-cyan-300 dark:hover:bg-cyan-400 dark:hover:text-[#05070A] dark:shadow-[0_0_20px_rgba(34,211,238,0.25)] dark:font-semibold">
                    <Compass className="h-4 w-4" />
                    Mulai Belajar Tanpa Login
                    <ArrowRight className="h-4 w-4" />
                  </MagnetButton>
                </Link>
                <Link href="#roadmap">
                  <Button size="lg" variant="outline" className="gap-2 font-black border-2 border-black bg-white text-black shadow-[4px_4px_0px_#121212] hover:bg-[#EAE4D5] dark:border dark:border-[#1C242D] dark:bg-[#0F141A] dark:text-[#CBD5E1] dark:hover:border-cyan-500/40 dark:hover:text-cyan-300 dark:shadow-none dark:font-medium">
                    <Layers className="h-4 w-4" />
                    Jelajahi 20 Tahap ({totalLessonsCount} Modul)
                  </Button>
                </Link>
              </div>

              {/* Quick Metrics */}
              <div className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-4 max-w-4xl mx-auto pt-10 border-t-2 border-black dark:border-t dark:border-[#1C242D]">
                <div className="p-4 rounded-xl bg-white border-2 border-black shadow-[4px_4px_0px_#121212] dark:border dark:border-[#1C242D] dark:bg-[#090D12] dark:shadow-none dark:rounded-lg">
                  <div className="text-3xl font-black font-mono text-foreground dark:text-cyan-300">20</div>
                  <div className="text-xs font-bold text-[#555555] dark:font-normal dark:text-[#8292A6] mt-1">Tahap Kurikulum</div>
                </div>
                <div className="p-4 rounded-xl bg-white border-2 border-black shadow-[4px_4px_0px_#121212] dark:border dark:border-[#1C242D] dark:bg-[#090D12] dark:shadow-none dark:rounded-lg">
                  <div className="text-3xl font-black font-mono text-emerald-800 dark:text-emerald-400">{totalLessonsCount}</div>
                  <div className="text-xs font-bold text-[#555555] dark:font-normal dark:text-[#8292A6] mt-1">Modul Pembelajaran</div>
                </div>
                <div className="p-4 rounded-xl bg-white border-2 border-black shadow-[4px_4px_0px_#121212] dark:border dark:border-[#1C242D] dark:bg-[#090D12] dark:shadow-none dark:rounded-lg">
                  <div className="text-3xl font-black font-mono text-blue-800 dark:text-[#38BDF8]">6</div>
                  <div className="text-xs font-bold text-[#555555] dark:font-normal dark:text-[#8292A6] mt-1">Milestone Proyek</div>
                </div>
                <div className="p-4 rounded-xl bg-white border-2 border-black shadow-[4px_4px_0px_#121212] dark:border dark:border-[#1C242D] dark:bg-[#090D12] dark:shadow-none dark:rounded-lg">
                  <div className="text-3xl font-black font-mono text-foreground dark:text-[#F1F5F9]">Dual</div>
                  <div className="text-xs font-bold text-[#555555] dark:font-normal dark:text-[#8292A6] mt-1">Bahasa (ID / EN)</div>
                </div>
              </div>
            </div>

            {/* Interactive Live Code Sandbox Preview on Hero */}
            <div className="mt-14 max-w-4xl mx-auto rounded-xl border-2 border-black bg-white shadow-[8px_8px_0px_#121212] overflow-hidden dark:border dark:border-[#1C242D] dark:bg-[#090D12] dark:shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
              <div className="flex items-center justify-between px-4 py-3 border-b-2 border-black bg-[#EAE4D5] dark:border-b dark:border-[#1C242D] dark:bg-[#090D12]">
                <div className="flex items-center gap-2">
                  <div className="h-3.5 w-3.5 rounded-full border border-black bg-[#FF6B6B] dark:border-0 dark:bg-red-500/80" />
                  <div className="h-3.5 w-3.5 rounded-full border border-black bg-[#FFD84D] dark:border-0 dark:bg-amber-500/80" />
                  <div className="h-3.5 w-3.5 rounded-full border border-black bg-[#7BE495] dark:border-0 dark:bg-emerald-500/80" />
                  <span className="text-xs font-mono font-bold text-[#121212] dark:text-[#94A3B8] ml-2">
                    interactive-demo.js
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  {snippets.map((snip, idx) => (
                    <button
                      key={snip.tab}
                      type="button"
                      onClick={() => setActiveSnippetIndex(idx)}
                      className={`px-2.5 py-1 text-xs rounded transition-all font-mono font-bold ${
                        activeSnippetIndex === idx
                          ? "bg-[#FFD84D] text-[#121212] border-2 border-black shadow-[1.5px_1.5px_0px_#121212] dark:bg-cyan-500/15 dark:text-cyan-300 dark:border dark:border-cyan-500/40 dark:shadow-none"
                          : "text-[#555555] hover:text-black dark:text-[#8292A6] dark:hover:text-cyan-300"
                      }`}
                    >
                      {snip.tab}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 divide-y-2 md:divide-y-0 md:divide-x-2 divide-black dark:divide-[#1C242D]">
                {/* Code View */}
                <div className="p-4 bg-[#121212] relative dark:bg-[#05070A]">
                  <pre className="font-mono text-xs text-emerald-400 dark:text-cyan-300 overflow-x-auto leading-relaxed">
                    <code>{snippets[activeSnippetIndex].code}</code>
                  </pre>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleCopy(snippets[activeSnippetIndex].code)}
                    className="absolute top-3 right-3 h-7 px-2.5 text-[11px] font-bold border-2 border-black bg-[#FFD84D] text-[#121212] shadow-[2px_2px_0px_#000000] hover:bg-[#F5CB32] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none dark:border dark:border-[#1C242D] dark:bg-[#0F141A] dark:text-[#94A3B8] dark:hover:text-cyan-300 dark:hover:bg-[#151B22] dark:shadow-none"
                  >
                    {copied ? (
                      <>
                        <Check className="h-3 w-3 text-emerald-800 dark:text-emerald-400" />
                        Tersalin
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3 text-black dark:text-[#94A3B8]" />
                        Salin
                      </>
                    )}
                  </Button>
                </div>

                {/* Simulated Output */}
                <div className="p-4 bg-white flex flex-col justify-between dark:bg-[#090D12]">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#121212] font-mono mb-2 dark:text-[#94A3B8] dark:font-normal">
                      <Play className="h-3.5 w-3.5 text-primary dark:text-cyan-400" />
                      <span>Simulasi Eksekusi di Browser</span>
                    </div>
                    <div className="p-3 rounded-lg bg-[#F7F4EA] border-2 border-black font-mono text-xs whitespace-pre-line text-[#121212] font-medium shadow-[2px_2px_0px_#121212] dark:bg-[#05070A] dark:border dark:border-[#1C242D] dark:text-cyan-300 dark:shadow-none dark:font-mono">
                      {snippets[activeSnippetIndex].output}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t-2 border-black dark:border-t dark:border-[#1C242D] flex items-center justify-between text-xs font-bold text-[#555555] dark:font-normal dark:text-[#8292A6]">
                    <span>Evaluasi Otomatis Sandbox</span>
                    <span className="text-emerald-800 dark:text-emerald-400 font-mono">Status: Ready</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Roadmap Preview Section with Spotlight Cards */}
        <section id="roadmap" className="py-20 bg-background">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
              <div>
                <span className="text-xs font-mono font-black text-[#121212] bg-[#FFD84D] px-2 py-0.5 rounded border border-black dark:border dark:border-cyan-500/30 dark:bg-cyan-500/10 dark:text-cyan-300 uppercase tracking-wider">
                  Alur Pembelajaran
                </span>
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight mt-2 text-foreground">
                  20 Tahapan Roadmap Terarah
                </h2>
                <p className="text-[#555555] dark:text-[#94A3B8] text-sm mt-2 max-w-xl font-medium dark:font-normal">
                  Setiap materi memiliki prasyarat yang jelas, materi berbentuk teks ringkas 5–15 menit, dan latihan kode interaktif.
                </p>
              </div>

              <Link href="/roadmap">
                <Button variant="outline" size="sm" className="gap-2 font-bold shadow-[2px_2px_0px_#121212]">
                  Buka Roadmap Lengkap ({totalLessonsCount} Modul)
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {CURRICULUM_STAGES.slice(0, 12).map((stage) => {
                const firstLesson = stage.lessons[0];
                return (
                  <SpotlightCard key={stage.id} className="group">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-xs font-black text-[#121212] bg-[#FFD84D] px-2 py-0.5 rounded border border-black dark:border dark:border-cyan-500/30 dark:bg-cyan-500/10 dark:text-cyan-300">
                        Tahap {String(stage.orderIndex).padStart(2, "0")}
                      </span>
                      <Badge variant="outline" className="text-[10px]">
                        {stage.category}
                      </Badge>
                    </div>
                    <h3 className="text-base font-black group-hover:text-primary dark:group-hover:text-cyan-300 transition-colors text-foreground">
                      {stage.titleId}
                    </h3>
                    <p className="text-xs text-[#555555] dark:text-[#8292A6] mt-1.5 leading-relaxed line-clamp-2 font-medium dark:font-normal">
                      {stage.description}
                    </p>

                    <div className="mt-4 pt-3 border-t-2 border-black dark:border-t dark:border-[#1C242D] flex items-center justify-between">
                      <span className="text-[11px] text-[#555555] dark:text-[#8292A6] font-mono font-bold dark:font-normal">
                        {stage.lessons.length} Modul Pembelajaran
                      </span>
                      {firstLesson && (
                        <Link
                          href={`/lessons/${firstLesson.slug}`}
                          className="inline-flex items-center text-xs font-black text-black underline decoration-[#FFD84D] decoration-2 hover:text-primary gap-1 dark:text-cyan-400 dark:no-underline dark:hover:underline"
                        >
                          Mulai Tahap Ini
                          <ArrowRight className="h-3 w-3" />
                        </Link>
                      )}
                    </div>
                  </SpotlightCard>
                );
              })}
            </div>
          </div>
        </section>

        {/* Feature Grid */}
        <section id="fitur" className="py-20 border-t-2 border-black dark:border-t dark:border-[#1C242D]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-xs font-mono font-black text-[#121212] bg-[#70B7FF] px-2 py-0.5 rounded border border-black dark:border dark:border-cyan-500/30 dark:bg-cyan-500/10 dark:text-cyan-300 uppercase tracking-wider">
                Pengalaman Belajar
              </span>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight mt-2 text-foreground">
                Fokus Belajar Tanpa Hambatan
              </h2>
              <p className="text-[#555555] dark:text-[#94A3B8] text-sm mt-2 font-medium dark:font-normal">
                Didesain khusus untuk pemula yang ingin memahami konsep web development secara praktis.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <SpotlightCard className="p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg border-2 border-black bg-[#FFD84D] text-[#121212] shadow-[2px_2px_0px_#121212] mb-4 dark:border dark:border-cyan-500/40 dark:bg-cyan-500/10 dark:text-cyan-300 dark:shadow-none">
                  <Code2 className="h-6 w-6" />
                </div>
                <h3 className="text-base font-black mb-2 text-foreground">Interactive Code Viewer</h3>
                <p className="text-xs text-[#555555] dark:text-[#8292A6] leading-relaxed font-medium dark:font-normal">
                  Penyorotan sintaks kode modern dengan fitur instant copy dan contoh kode yang dapat langsung dipraktikkan.
                </p>
              </SpotlightCard>

              <SpotlightCard className="p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg border-2 border-black bg-[#70B7FF] text-[#121212] shadow-[2px_2px_0px_#121212] mb-4 dark:border dark:border-cyan-500/40 dark:bg-cyan-500/10 dark:text-cyan-300 dark:shadow-none">
                  <Zap className="h-6 w-6" />
                </div>
                <h3 className="text-base font-black mb-2 text-foreground">Zero-Barrier Guest Learning</h3>
                <p className="text-xs text-[#555555] dark:text-[#8292A6] leading-relaxed font-medium dark:font-normal">
                  Mulai membaca materi dan mencoba latihan seketika. Progress tersimpan di browser dan dapat dimigrasikan saat membuat akun.
                </p>
              </SpotlightCard>

              <SpotlightCard className="p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg border-2 border-black bg-[#7BE495] text-[#121212] shadow-[2px_2px_0px_#121212] mb-4 dark:border dark:border-cyan-500/40 dark:bg-cyan-500/10 dark:text-cyan-300 dark:shadow-none">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <h3 className="text-base font-black mb-2 text-foreground">Sertifikat Kelulusan Resmi</h3>
                <p className="text-xs text-[#555555] dark:text-[#8292A6] leading-relaxed font-medium dark:font-normal">
                  Dapatkan sertifikat digital dengan kode verifikasi unik setelah menyelesaikan alur modul dan portfolio project.
                </p>
              </SpotlightCard>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
