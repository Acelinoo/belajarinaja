"use client";

import { useState } from "react";
import Link from "next/link";
import { Award, Download, Check, Copy, CheckCircle2, Lock, Compass, ArrowRight, Trophy, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SearchCommandModal } from "@/components/common/SearchCommandModal";
import { CURRICULUM_STAGES } from "@/data/curriculum";
import { useAuthStore } from "@/store/useAuthStore";
import { useCurriculumProgressStore } from "@/store/useCurriculumProgressStore";
import { useThemeLanguageStore } from "@/store/useThemeLanguageStore";
import { getTranslations } from "@/lib/translations";
import { VictoryAchievementCharacter } from "@/components/fun/characters/VictoryAchievementCharacter";
import { GoldenTrophyIllustration } from "@/components/fun/illustrations/GoldenTrophyIllustration";

export default function CertificatePage() {
  const [copied, setCopied] = useState(false);
  const { user } = useAuthStore();
  const { completedLessons } = useCurriculumProgressStore();
  const { theme, language } = useThemeLanguageStore();
  const t = getTranslations(language);

  const totalLessons = CURRICULUM_STAGES.reduce(
    (acc, stage) => acc + stage.lessons.length,
    0
  );
  const completedCount = Object.values(completedLessons).filter(
    (k) => k?.completed && k?.passed !== false
  ).length;

  const isEligible = totalLessons > 0 && completedCount >= totalLessons;
  const progressPercentage = Math.round((completedCount / (totalLessons || 1)) * 100);

  const certificateCode = "CERT-BA-2026-W892K";
  const issueDate = new Date().toLocaleDateString(language === "en" ? "en-US" : "id-ID", {
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

  // 1. FUN MODE: Golden Trophy Celebration Hall
  if (theme === "fun") {
    return (
      <div className="min-h-screen bg-[#FFF8E7] text-[#243447] flex flex-col">
        <Navbar />
        <SearchCommandModal />

        <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b-2 border-[#FED7AA]">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#FED7AA] text-xs font-black text-[#D97706]">
                  <Trophy className="h-3.5 w-3.5" />
                  <span>{t.certificates.badge}</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-[#243447]">
                  {t.certificates.title}
                </h1>
              </div>

              {isEligible && (
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopyLink}
                    className="text-xs font-bold rounded-full border-[#FED7AA] bg-white text-[#243447]"
                  >
                    {copied ? <Check className="h-3.5 w-3.5 mr-1 text-[#16A34A]" /> : <Copy className="h-3.5 w-3.5 mr-1" />}
                    {copied ? t.common.copied : t.certificates.copyLink}
                  </Button>
                  <Button
                    size="sm"
                    onClick={handlePrint}
                    className="text-xs font-black rounded-full bg-[#FFD84D] hover:bg-[#FFC933] text-[#243447] shadow-[0_4px_12px_rgba(255,216,77,0.4)]"
                  >
                    <Download className="h-3.5 w-3.5 mr-1" />
                    {t.certificates.downloadPdf}
                  </Button>
                </div>
              )}
            </div>

            {!isEligible ? (
              <div className="p-8 sm:p-12 rounded-[36px] border-4 border-[#FED7AA] bg-white text-center space-y-6 shadow-[0_15px_40px_rgba(255,155,84,0.1)]">
                <VictoryAchievementCharacter className="w-32 h-32 mx-auto opacity-75" />
                <div className="space-y-2">
                  <h3 className="text-xl font-black text-[#243447]">
                    {t.certificates.lockedTitle}
                  </h3>
                  <p className="text-xs text-[#64748B] max-w-md mx-auto">
                    {t.certificates.lockedDesc}
                  </p>
                </div>

                <div className="max-w-xs mx-auto space-y-2">
                  <div className="flex items-center justify-between text-xs font-black text-[#243447]">
                    <span>{progressPercentage}% {t.certificates.progressTowards}</span>
                    <span className="text-[#D97706]">{completedCount}/{totalLessons}</span>
                  </div>
                  <Progress value={progressPercentage} className="h-3 rounded-full bg-[#FFF8E7]" />
                </div>

                <Link href="/roadmap">
                  <Button className="rounded-full font-black text-xs px-8 bg-[#FFD84D] hover:bg-[#FFC933] text-[#243447] shadow-[0_4px_16px_rgba(255,216,77,0.4)]">
                    <Compass className="h-4 w-4 mr-2" />
                    {t.certificates.continueRoadmap}
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="p-8 sm:p-12 rounded-[40px] border-4 border-[#FED7AA] bg-white shadow-[0_20px_50px_rgba(255,155,84,0.15)] text-center space-y-6">
                <GoldenTrophyIllustration className="w-24 h-24 mx-auto" />
                <div className="space-y-1">
                  <span className="text-xs font-black text-[#D97706] uppercase tracking-widest block">
                    ★ OFFICIAL CERTIFICATE OF COMPLETION ★
                  </span>
                  <h2 className="text-2xl sm:text-4xl font-black text-[#243447]">
                    {user?.name || "Fullstack Web Explorer"}
                  </h2>
                  <p className="text-xs text-[#64748B] max-w-lg mx-auto pt-2">
                    Has successfully mastered all 20 modules of the BelajarinAja curriculum with proven quiz competencies.
                  </p>
                </div>

                <div className="pt-4 border-t-2 border-[#FED7AA] flex items-center justify-between text-xs font-bold text-[#64748B]">
                  <span>Code: {certificateCode}</span>
                  <span>Issued: {issueDate}</span>
                </div>
              </div>
            )}
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  // 2. DARK MODE: Monochrome Cryptographic Seal (100% Monochrome)
  if (theme === "dark") {
    return (
      <div className="min-h-screen bg-[#050505] text-[#FFFFFF] font-mono flex flex-col">
        <Navbar />
        <SearchCommandModal />

        <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl space-y-8">
            <div className="p-6 rounded border border-[#222222] bg-[#0A0A0A] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="text-xs text-[#888888]">
                  CERT_AUTHORITY // VERIFICATION_NODE
                </div>
                <h1 className="text-xl sm:text-2xl font-black text-[#FFFFFF]">
                  CRYPTOGRAPHIC_DIPLOMA_VERIFIER
                </h1>
              </div>

              {isEligible && (
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopyLink}
                    className="text-xs font-mono border-[#333333] bg-[#050505] text-[#FFFFFF]"
                  >
                    {copied ? "COPIED_HASH" : "COPY_VERIFICATION_LINK"}
                  </Button>
                  <Button
                    size="sm"
                    onClick={handlePrint}
                    className="text-xs font-mono bg-[#FFFFFF] hover:bg-[#E5E5E5] text-[#000000] font-black"
                  >
                    PRINT_PDF
                  </Button>
                </div>
              )}
            </div>

            {!isEligible ? (
              <div className="p-8 rounded border border-[#222222] bg-[#0A0A0A] text-center space-y-6">
                <div className="flex h-14 w-14 items-center justify-center rounded border border-[#333333] bg-[#050505] mx-auto text-[#888888]">
                  <Lock className="h-6 w-6" />
                </div>

                <div className="space-y-1">
                  <h3 className="text-lg font-black text-[#FFFFFF]">
                    VERIFICATION_FAILED // MODULES_INCOMPLETE
                  </h3>
                  <p className="text-xs text-[#888888] max-w-md mx-auto">
                    Certificate seal requires 100% passing grade on all 20 curriculum stages.
                  </p>
                </div>

                <div className="max-w-xs mx-auto space-y-1 text-xs">
                  <div className="flex items-center justify-between text-[#888888]">
                    <span>STATUS_SYNC: {progressPercentage}%</span>
                    <span>{completedCount}/{totalLessons}</span>
                  </div>
                  <div className="h-2 w-full bg-[#111111] rounded overflow-hidden border border-[#222222]">
                    <div className="h-full bg-[#FFFFFF]" style={{ width: `${progressPercentage}%` }} />
                  </div>
                </div>

                <Link href="/roadmap">
                  <Button size="sm" className="font-mono text-xs bg-[#FFFFFF] text-[#000000] font-bold px-6">
                    CONTINUE_MODULES &rarr;
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="p-8 sm:p-12 rounded border border-[#333333] bg-[#0A0A0A] space-y-6 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded border border-[#333333] bg-[#111111] mx-auto text-[#FFFFFF]">
                  <Award className="h-8 w-8" />
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] text-[#666666] tracking-widest block uppercase">
                    [OFFICIAL_CERTIFICATE_OF_COMPLETION]
                  </span>
                  <h2 className="text-xl sm:text-3xl font-black text-[#FFFFFF]">
                    {user?.name || "STUDENT_ENGINEER"}
                  </h2>
                  <p className="text-xs text-[#888888] max-w-md mx-auto pt-2">
                    Verified completion of all 20 curriculum modules with verified passing quiz scores.
                  </p>
                </div>

                <div className="pt-4 border-t border-[#222222] flex items-center justify-between text-[11px] text-[#666666]">
                  <span>HASH: {certificateCode}</span>
                  <span>DATE: {issueDate}</span>
                </div>
              </div>
            )}
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  // 3. LIGHT MODE: Modern Neo-Brutalist Diploma
  return (
    <div className="min-h-screen bg-[#F7F4EA] text-[#121212] flex flex-col">
      <Navbar />
      <SearchCommandModal />

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl space-y-8">
          <div className="p-8 rounded-2xl border-2 border-black bg-white shadow-[6px_6px_0px_#121212] flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded border border-black bg-[#FFD84D] text-xs font-black shadow-[1.5px_1.5px_0px_#121212]">
                <Award className="h-3.5 w-3.5" />
                <span>{t.certificates.badge}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-[#121212]">
                {t.certificates.title}
              </h1>
            </div>

            {isEligible && (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyLink}
                  className="text-xs font-bold rounded-lg border-2 border-black bg-white shadow-[2px_2px_0px_#121212]"
                >
                  {copied ? <Check className="h-3.5 w-3.5 mr-1 text-[#15803D]" /> : <Copy className="h-3.5 w-3.5 mr-1" />}
                  {copied ? t.common.copied : t.certificates.copyLink}
                </Button>
                <Button
                  size="sm"
                  onClick={handlePrint}
                  className="text-xs font-black rounded-lg border-2 border-black bg-[#FFD84D] hover:bg-[#F5CB32] text-[#121212] shadow-[3px_3px_0px_#121212]"
                >
                  <Download className="h-3.5 w-3.5 mr-1" />
                  {t.certificates.downloadPdf}
                </Button>
              </div>
            )}
          </div>

          {!isEligible ? (
            <div className="p-8 sm:p-12 rounded-2xl border-2 border-black bg-white shadow-[6px_6px_0px_#121212] text-center space-y-6">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl border-2 border-black bg-[#F7F4EA] text-[#121212] mx-auto shadow-[2px_2px_0px_#121212]">
                <Lock className="h-7 w-7" />
              </div>

              <div className="space-y-1">
                <h3 className="text-xl font-black text-[#121212]">
                  {t.certificates.lockedTitle}
                </h3>
                <p className="text-xs text-[#555555] max-w-md mx-auto">
                  {t.certificates.lockedDesc}
                </p>
              </div>

              <div className="max-w-xs mx-auto space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span>{progressPercentage}% Selesai</span>
                  <span>{completedCount}/{totalLessons}</span>
                </div>
                <Progress value={progressPercentage} className="h-2.5" />
              </div>

              <Link href="/roadmap">
                <Button className="rounded-lg border-2 border-black bg-[#FFD84D] hover:bg-[#F5CB32] text-[#121212] font-black text-xs shadow-[3px_3px_0px_#121212] px-6">
                  <Compass className="h-4 w-4 mr-1.5" />
                  <span>{t.certificates.continueRoadmap}</span>
                </Button>
              </Link>
            </div>
          ) : (
            <div className="p-8 sm:p-12 rounded-2xl border-4 border-black bg-white shadow-[10px_10px_0px_#121212] text-center space-y-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-black bg-[#FFD84D] text-[#121212] mx-auto shadow-[3px_3px_0px_#121212]">
                <Award className="h-8 w-8" />
              </div>

              <div className="space-y-1">
                <span className="text-xs font-mono font-black uppercase text-[#555555] tracking-wider block">
                  SERTIFIKAT KELULUSAN RESMI
                </span>
                <h2 className="text-2xl sm:text-4xl font-black text-[#121212]">
                  {user?.name || "Pelajar Web Development"}
                </h2>
                <p className="text-xs text-[#555555] max-w-md mx-auto pt-2">
                  Telah berhasil menyelesaikan seluruh 20 modul kurikulum BelajarinAja dengan nilai kelulusan quiz terverifikasi.
                </p>
              </div>

              <div className="pt-4 border-t-2 border-black flex items-center justify-between text-xs font-mono font-bold text-[#555555]">
                <span>NO: {certificateCode}</span>
                <span>TANGGAL: {issueDate}</span>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
