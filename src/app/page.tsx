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
        <section className="relative overflow-hidden border-b border-border/70 py-20 sm:py-28 bg-[#090A0C]">
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
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-xs text-muted-foreground mb-6">
                <Terminal className="h-3.5 w-3.5 text-primary" />
                <span>Roadmap Web Developer Dari Nol — 20 Tahap & {totalLessonsCount} Modul Pembelajaran</span>
              </div>

              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl text-balance">
                Kuasai Web Development Dari Dasar Hingga Siap Kerja
              </h1>

              <p className="mt-6 max-w-2xl mx-auto text-base sm:text-lg text-muted-foreground text-pretty">
                Alur belajar terstruktur dari konsep dasar komputer hingga pembuatan aplikasi fullstack modern.
                Mulai belajar langsung sebagai <strong className="text-foreground">Guest tanpa wajib login</strong>.
              </p>

              <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                <Link href="/roadmap">
                  <MagnetButton size="lg" className="gap-2 font-medium px-6 shadow-lg shadow-primary/20">
                    <Compass className="h-4 w-4" />
                    Mulai Belajar Tanpa Login
                    <ArrowRight className="h-4 w-4" />
                  </MagnetButton>
                </Link>
                <Link href="#roadmap">
                  <Button size="lg" variant="outline" className="gap-2">
                    <Layers className="h-4 w-4" />
                    Jelajahi 20 Tahap ({totalLessonsCount} Modul)
                  </Button>
                </Link>
              </div>

              {/* Quick Metrics */}
              <div className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-4 max-w-4xl mx-auto pt-10 border-t border-border/40">
                <div className="p-4 rounded-lg bg-card/60 border border-border/60">
                  <div className="text-2xl font-bold font-mono text-foreground">20</div>
                  <div className="text-xs text-muted-foreground mt-1">Tahap Kurikulum</div>
                </div>
                <div className="p-4 rounded-lg bg-card/60 border border-border/60">
                  <div className="text-2xl font-bold font-mono text-emerald-400">{totalLessonsCount}</div>
                  <div className="text-xs text-muted-foreground mt-1">Modul Pembelajaran</div>
                </div>
                <div className="p-4 rounded-lg bg-card/60 border border-border/60">
                  <div className="text-2xl font-bold font-mono text-primary">6</div>
                  <div className="text-xs text-muted-foreground mt-1">Milestone Proyek</div>
                </div>
                <div className="p-4 rounded-lg bg-card/60 border border-border/60">
                  <div className="text-2xl font-bold font-mono text-foreground">Dual</div>
                  <div className="text-xs text-muted-foreground mt-1">Bahasa (ID / EN)</div>
                </div>
              </div>
            </div>

            {/* Interactive Live Code Sandbox Preview on Hero */}
            <div className="mt-14 max-w-4xl mx-auto rounded-xl border border-border bg-[#121318] shadow-2xl overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-[#0E0F12]">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-rose-500/80" />
                  <div className="h-3 w-3 rounded-full bg-amber-500/80" />
                  <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
                  <span className="text-xs font-mono text-muted-foreground ml-2">
                    interactive-demo.js
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  {snippets.map((snip, idx) => (
                    <button
                      key={snip.tab}
                      type="button"
                      onClick={() => setActiveSnippetIndex(idx)}
                      className={`px-2.5 py-1 text-xs rounded transition-colors font-mono ${
                        activeSnippetIndex === idx
                          ? "bg-secondary text-primary font-semibold"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {snip.tab}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border">
                {/* Code View */}
                <div className="p-4 bg-[#060708] relative">
                  <pre className="font-mono text-xs text-emerald-400 overflow-x-auto leading-relaxed">
                    <code>{snippets[activeSnippetIndex].code}</code>
                  </pre>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleCopy(snippets[activeSnippetIndex].code)}
                    className="absolute top-3 right-3 h-7 px-2 text-[11px] gap-1 text-muted-foreground hover:text-foreground"
                  >
                    {copied ? (
                      <>
                        <Check className="h-3 w-3 text-emerald-400" />
                        Tersalin
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" />
                        Salin
                      </>
                    )}
                  </Button>
                </div>

                {/* Simulated Output */}
                <div className="p-4 bg-[#121318] flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono mb-2">
                      <Play className="h-3.5 w-3.5 text-primary" />
                      <span>Simulasi Eksekusi di Browser</span>
                    </div>
                    <div className="p-3 rounded bg-card border border-border font-mono text-xs whitespace-pre-line text-foreground">
                      {snippets[activeSnippetIndex].output}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
                    <span>Evaluasi Otomatis Sandbox</span>
                    <span className="text-emerald-400 font-mono">Status: Ready</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Roadmap Preview Section with Spotlight Cards */}
        <section id="roadmap" className="py-20 bg-background/50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
              <div>
                <span className="text-xs font-mono font-medium text-primary uppercase tracking-wider">
                  Alur Pembelajaran
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mt-1">
                  20 Tahapan Roadmap Terarah
                </h2>
                <p className="text-muted-foreground text-sm mt-2 max-w-xl">
                  Setiap materi memiliki prasyarat yang jelas, materi berbentuk teks ringkas 5–15 menit, dan latihan kode interaktif.
                </p>
              </div>

              <Link href="/roadmap">
                <Button variant="outline" size="sm" className="gap-2">
                  Buka Roadmap Lengkap ({totalLessonsCount} Modul)
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {CURRICULUM_STAGES.slice(0, 12).map((stage) => {
                const firstLesson = stage.lessons[0];
                return (
                  <SpotlightCard key={stage.id} className="border-border group">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-xs font-semibold text-primary">
                        Tahap {String(stage.orderIndex).padStart(2, "0")}
                      </span>
                      <Badge variant="outline" className="text-[10px]">
                        {stage.category}
                      </Badge>
                    </div>
                    <h3 className="text-base font-semibold group-hover:text-primary transition-colors">
                      {stage.titleId}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed line-clamp-2">
                      {stage.description}
                    </p>

                    <div className="mt-4 pt-3 border-t border-border/80 flex items-center justify-between">
                      <span className="text-[11px] text-muted-foreground font-mono">
                        {stage.lessons.length} Modul Pembelajaran
                      </span>
                      {firstLesson && (
                        <Link
                          href={`/lessons/${firstLesson.slug}`}
                          className="inline-flex items-center text-xs font-medium text-primary gap-1 hover:underline"
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
        <section id="fitur" className="py-20 border-t border-border/60">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-xs font-mono font-medium text-primary uppercase tracking-wider">
                Pengalaman Belajar
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mt-1">
                Fokus Belajar Tanpa Hambatan
              </h2>
              <p className="text-muted-foreground text-sm mt-2">
                Didesain khusus untuk pemula yang ingin memahami konsep web development secara praktis.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <SpotlightCard className="p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary mb-4">
                  <Code2 className="h-5 w-5" />
                </div>
                <h3 className="text-base font-semibold mb-2">Interactive Code Viewer</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Penyorotan sintaks kode modern dengan fitur instant copy dan contoh kode yang dapat langsung dipraktikkan.
                </p>
              </SpotlightCard>

              <SpotlightCard className="p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary mb-4">
                  <Zap className="h-5 w-5" />
                </div>
                <h3 className="text-base font-semibold mb-2">Zero-Barrier Guest Learning</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Mulai membaca materi dan mencoba latihan seketika. Progress tersimpan di browser dan dapat dimigrasikan saat membuat akun.
                </p>
              </SpotlightCard>

              <SpotlightCard className="p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary mb-4">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <h3 className="text-base font-semibold mb-2">Sertifikat Kelulusan Resmi</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
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
