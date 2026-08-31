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
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b-2 border-black dark:border-b dark:border-[#1C242D]">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono font-black text-[#121212] bg-[#FFD84D] px-2.5 py-1 rounded border border-black shadow-[2px_2px_0px_#121212] uppercase tracking-wider mb-2 w-fit dark:border dark:border-cyan-500/30 dark:bg-cyan-500/10 dark:text-cyan-300 dark:shadow-none">
                <Award className="h-4 w-4 text-[#121212] dark:text-cyan-400" />
                <span>Verifikasi Sertifikat Digital</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
                Sertifikat Kelulusan Kurikulum
              </h1>
            </div>

            {isEligible ? (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyLink}
                  className="text-xs font-bold gap-1.5 shadow-[2px_2px_0px_#121212] dark:border dark:border-[#1C242D] dark:bg-[#0F141A] dark:text-[#CBD5E1] dark:hover:text-cyan-300"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-800 dark:text-emerald-400" />
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
                  className="text-xs font-black gap-1.5 shadow-[3px_3px_0px_#121212] dark:border dark:border-cyan-500/40 dark:bg-cyan-500/15 dark:text-cyan-300 dark:hover:bg-cyan-400 dark:hover:text-[#05070A] dark:shadow-none"
                >
                  <Download className="h-3.5 w-3.5" />
                  Cetak / Unduh PDF
                </Button>
              </div>
            ) : (
              <Link href="/roadmap">
                <Button size="sm" className="text-xs font-bold gap-1.5 shadow-[2px_2px_0px_#121212] dark:border dark:border-[#1C242D] dark:bg-[#0F141A] dark:text-[#CBD5E1] dark:hover:text-cyan-300">
                  <Compass className="h-3.5 w-3.5" />
                  Lanjutkan Belajar di Roadmap
                </Button>
              </Link>
            )}
          </div>

          {!isEligible ? (
            /* Locked Certificate State */
            <div className="p-8 sm:p-12 rounded-2xl border-2 border-black bg-white text-center space-y-6 shadow-[6px_6px_0px_#121212] dark:border dark:border-[#1C242D] dark:bg-[#090D12] dark:shadow-none">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-black bg-[#FFD84D] text-[#121212] mx-auto shadow-[3px_3px_0px_#121212] dark:border dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-400 dark:shadow-none">
                <Lock className="h-8 w-8" />
              </div>

              <div className="space-y-2 max-w-md mx-auto">
                <h2 className="text-xl font-black text-foreground">
                  Sertifikat Masih Terkunci
                </h2>
                <p className="text-xs font-medium text-[#555555] dark:font-normal dark:text-[#8292A6] leading-relaxed">
                  Untuk mengklaim dan menerbitkan Sertifikat Resmi Fullstack Web Developer, Anda wajib menyelesaikan seluruh <strong className="text-foreground font-black">{totalLessons} materi</strong> dan lulus seluruh quiz evaluasi (skor minimal 80%).
                </p>
              </div>

              <div className="max-w-md mx-auto p-4 rounded-xl bg-[#F7F4EA] border-2 border-black space-y-2 text-left shadow-[3px_3px_0px_#121212] dark:bg-[#05070A] dark:border dark:border-[#1C242D] dark:shadow-none">
                <div className="flex items-center justify-between text-xs font-bold dark:font-normal">
                  <span className="text-neutral-700 dark:text-[#8292A6]">Progres Kelulusan Materi & Quiz:</span>
                  <span className="font-mono font-black text-black dark:text-cyan-300">
                    {completedCount} / {totalLessons} ({progressPercentage}%)
                  </span>
                </div>
                <Progress value={progressPercentage} className="h-2.5" />
              </div>

              <Link href="/roadmap">
                <Button size="sm" className="gap-2 text-xs font-black shadow-[3px_3px_0px_#121212] dark:border dark:border-cyan-500/40 dark:bg-cyan-500/15 dark:text-cyan-300 dark:hover:bg-cyan-400 dark:hover:text-[#05070A] dark:shadow-none">
                  Buka Roadmap 20 Tahap
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>
          ) : (
            /* Certificate Frame Preview */
            <div className="relative rounded-2xl border-4 border-black bg-white p-8 sm:p-12 shadow-[12px_12px_0px_#121212] overflow-hidden dark:border dark:border-cyan-500/40 dark:bg-[#090D12] dark:shadow-[0_20px_50px_rgba(0,0,0,0.9)] print:border-black print:bg-white print:text-black">
              {/* Background watermarks */}
              <div className="absolute right-6 top-6 opacity-5 pointer-events-none">
                <Award className="h-64 w-64 text-black dark:text-cyan-400" />
              </div>

              <div className="relative z-10 text-center space-y-6">
                {/* Brand Emblem */}
                <div className="flex items-center justify-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg border-2 border-black bg-[#FFD84D] text-[#121212] font-mono font-black text-base shadow-[2px_2px_0px_#121212] dark:border dark:border-cyan-500/40 dark:bg-cyan-500/10 dark:text-cyan-300 dark:shadow-none">
                    BA
                  </div>
                  <span className="font-black tracking-tight text-lg text-foreground">
                    Belajarin<span className="text-[#121212] dark:text-cyan-400 bg-[#FFD84D] dark:bg-transparent px-1 rounded-sm border border-black dark:border-0 ml-0.5">Aja</span>
                  </span>
                </div>

                <div>
                  <div className="text-xs uppercase font-mono tracking-widest text-[#121212] bg-[#70B7FF] px-3 py-0.5 rounded border border-black inline-block font-black shadow-[1.5px_1.5px_0px_#121212] dark:border dark:border-cyan-500/30 dark:bg-cyan-500/10 dark:text-cyan-300 dark:shadow-none">
                    Sertifikat Kelulusan Resmi
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black tracking-tight mt-2 text-foreground">
                    Certificate of Fullstack Web Development
                  </h2>
                </div>

                <div className="py-2">
                  <p className="text-xs font-bold text-[#555555] dark:font-normal dark:text-[#8292A6]">
                    Sertifikat ini dengan bangga dianugerahkan kepada:
                  </p>
                  <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground underline decoration-[#FFD84D] dark:decoration-cyan-400 decoration-4 underline-offset-8 mt-2">
                    {user?.name || "Marchelino Kurniawan"}
                  </h3>
                </div>

                <p className="max-w-xl mx-auto text-xs font-medium text-[#404040] dark:font-normal dark:text-[#8292A6] leading-relaxed">
                  Telah berhasil menyelesaikan seluruh 20 tahapan kurikulum Web Development terstruktur, mencakup Web Fundamentals, HTML5 Semantic, Modern CSS, JavaScript, TypeScript, React, Next.js 16, PostgreSQL & Prisma ORM, Keamanan Web, dan Final Portfolio Capstone.
                </p>

                {/* Certificate Metadata Grid */}
                <div className="pt-6 border-t-2 border-black dark:border-t dark:border-[#1C242D] grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
                  <div className="p-3 rounded-lg bg-[#F7F4EA] border-2 border-black shadow-[2px_2px_0px_#121212] dark:bg-[#05070A] dark:border dark:border-[#1C242D] dark:shadow-none">
                    <span className="text-[10px] text-[#555555] dark:text-[#8292A6] uppercase font-mono block font-bold">
                      ID Sertifikat
                    </span>
                    <span className="text-xs font-mono font-black text-black dark:text-cyan-300">
                      {certificateCode}
                    </span>
                  </div>

                  <div className="p-3 rounded-lg bg-[#F7F4EA] border-2 border-black shadow-[2px_2px_0px_#121212] dark:bg-[#05070A] dark:border dark:border-[#1C242D] dark:shadow-none">
                    <span className="text-[10px] text-[#555555] dark:text-[#8292A6] uppercase font-mono block font-bold">
                      Tanggal Penerbitan
                    </span>
                    <span className="text-xs font-bold text-foreground">
                      {issueDate}
                    </span>
                  </div>

                  <div className="p-3 rounded-lg bg-[#F7F4EA] border-2 border-black shadow-[2px_2px_0px_#121212] dark:bg-[#05070A] dark:border dark:border-[#1C242D] dark:shadow-none flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-[#555555] dark:text-[#8292A6] uppercase font-mono block font-bold">
                        Status Verifikasi
                      </span>
                      <span className="text-xs font-black text-emerald-800 dark:text-emerald-400 flex items-center gap-1">
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
