"use client";

import { useState } from "react";
import Link from "next/link";
import { Award, Download, Check, Copy, CheckCircle2, Lock, Compass, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SearchCommandModal } from "@/components/common/SearchCommandModal";
import { CURRICULUM_STAGES } from "@/data/curriculum";
import { useUserAuthStore } from "@/store/useUserAuthStore";
import { useGuestProgressStore } from "@/store/useGuestProgressStore";

export default function CertificatePage() {
  const [copied, setCopied] = useState(false);
  const { user } = useUserAuthStore();
  const { completedLessons } = useGuestProgressStore();

  const totalLessons = CURRICULUM_STAGES.reduce(
    (acc, stage) => acc + stage.lessons.length,
    0
  );
  const completedCount = Object.keys(completedLessons).filter(
    (k) => completedLessons[k]?.completed && completedLessons[k]?.passed !== false
  ).length;

  const isEligible = totalLessons > 0 && completedCount >= totalLessons;
  const progressPercentage = Math.round((completedCount / (totalLessons || 1)) * 100);

  const certificateCode = "CERT-BA-2026-W892K";
  const issueDate = new Date().toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const handleCopyLink = () => {
    navigator.clipboard.writeText(
      `https://belajarinaja.com/certificates/${certificateCode}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />
      <SearchCommandModal />

      <main className="flex-1 py-10">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-primary uppercase tracking-wider mb-1">
                <Award className="h-4 w-4" />
                <span>Verifikasi Sertifikat Digital</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                Sertifikat Kelulusan Kurikulum
              </h1>
            </div>

            {isEligible ? (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyLink}
                  className="text-xs gap-1.5"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                      Tautan Tersalin
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      Salin URL Verifikasi
                    </>
                  )}
                </Button>

                <Button
                  size="sm"
                  onClick={handlePrint}
                  className="text-xs gap-1.5 font-medium"
                >
                  <Download className="h-3.5 w-3.5" />
                  Cetak / Unduh PDF
                </Button>
              </div>
            ) : (
              <Link href="/roadmap">
                <Button size="sm" className="text-xs gap-1.5">
                  <Compass className="h-3.5 w-3.5" />
                  Lanjutkan Belajar di Roadmap
                </Button>
              </Link>
            )}
          </div>

          {!isEligible ? (
            /* Locked Certificate State */
            <div className="p-8 sm:p-12 rounded-2xl border border-border bg-card text-center space-y-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400 mx-auto border border-amber-500/20">
                <Lock className="h-8 w-8" />
              </div>

              <div className="space-y-2 max-w-md mx-auto">
                <h2 className="text-xl font-bold text-foreground">
                  Sertifikat Masih Terkunci
                </h2>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Untuk mengklaim dan menerbitkan Sertifikat Resmi Fullstack Web Developer, Anda wajib menyelesaikan seluruh <strong className="text-foreground">{totalLessons} materi</strong> dan lulus seluruh quiz evaluasi (skor minimal 80%).
                </p>
              </div>

              <div className="max-w-md mx-auto p-4 rounded-xl bg-background/60 border border-border space-y-2 text-left">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Progres Kelulusan Materi & Quiz:</span>
                  <span className="font-mono font-semibold text-primary">
                    {completedCount} / {totalLessons} ({progressPercentage}%)
                  </span>
                </div>
                <Progress value={progressPercentage} className="h-2" />
              </div>

              <Link href="/roadmap">
                <Button size="sm" className="gap-2 text-xs font-medium">
                  Buka Roadmap 20 Tahap
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>
          ) : (
            /* Certificate Frame Preview */
            <div className="relative rounded-2xl border-2 border-primary/40 bg-gradient-to-b from-[#121318] to-[#0E0F12] p-8 sm:p-12 shadow-2xl overflow-hidden print:border-black print:bg-white print:text-black">
              {/* Background watermarks */}
              <div className="absolute right-6 top-6 opacity-5 pointer-events-none">
                <Award className="h-64 w-64 text-primary" />
              </div>

              <div className="relative z-10 text-center space-y-6">
                {/* Brand Emblem */}
                <div className="flex items-center justify-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground font-mono font-bold text-base">
                    BA
                  </div>
                  <span className="font-bold tracking-tight text-lg text-foreground">
                    Belajarin<span className="text-primary">Aja</span>
                  </span>
                </div>

                <div>
                  <div className="text-xs uppercase font-mono tracking-widest text-primary font-semibold">
                    Sertifikat Kelulusan Resmi
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-serif tracking-tight mt-2 text-foreground">
                    Certificate of Fullstack Web Development
                  </h2>
                </div>

                <div className="py-2">
                  <p className="text-xs text-muted-foreground">
                    Sertifikat ini dengan bangga dianugerahkan kepada:
                  </p>
                  <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground underline decoration-primary/40 underline-offset-8 mt-2">
                    {user?.name || "Marchelino Kurniawan"}
                  </h3>
                </div>

                <p className="max-w-xl mx-auto text-xs text-muted-foreground leading-relaxed">
                  Telah berhasil menyelesaikan seluruh 20 tahapan kurikulum Web Development terstruktur, mencakup Web Fundamentals, HTML5 Semantic, Modern CSS, JavaScript, TypeScript, React, Next.js 16, PostgreSQL & Prisma ORM, Keamanan Web, dan Final Portfolio Capstone.
                </p>

                {/* Certificate Metadata Grid */}
                <div className="pt-6 border-t border-border/60 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
                  <div className="p-3 rounded-lg bg-card/60 border border-border/60">
                    <span className="text-[10px] text-muted-foreground uppercase font-mono block">
                      ID Sertifikat
                    </span>
                    <span className="text-xs font-mono font-bold text-primary">
                      {certificateCode}
                    </span>
                  </div>

                  <div className="p-3 rounded-lg bg-card/60 border border-border/60">
                    <span className="text-[10px] text-muted-foreground uppercase font-mono block">
                      Tanggal Penerbitan
                    </span>
                    <span className="text-xs font-medium text-foreground">
                      {issueDate}
                    </span>
                  </div>

                  <div className="p-3 rounded-lg bg-card/60 border border-border/60 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-muted-foreground uppercase font-mono block">
                        Status Verifikasi
                      </span>
                      <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Terverifikasi Asli
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
