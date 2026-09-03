"use client";

import { useState } from "react";
import Link from "next/link";
import { Award, Download, Check, Copy, CheckCircle2, Lock, Compass, ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SearchCommandModal } from "@/components/common/SearchCommandModal";
import { CURRICULUM_STAGES } from "@/data/curriculum";
import { useAuthStore } from "@/store/useAuthStore";
import { useCurriculumProgressStore } from "@/store/useCurriculumProgressStore";
import { useThemeLanguageStore } from "@/store/useThemeLanguageStore";
import { getTranslations } from "@/lib/translations";
import { NovaCharacter } from "@/components/fun/characters/NovaCharacter";
import { OfficialCertificateDocument } from "@/components/certificates/OfficialCertificateDocument";

export default function CertificatePage() {
  const [copied, setCopied] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const { user, isAuthenticated } = useAuthStore();
  const { completedLessons } = useCurriculumProgressStore();
  const { theme, language } = useThemeLanguageStore();
  const t = getTranslations(language);

  const totalLessons = CURRICULUM_STAGES.reduce(
    (acc, stage) => acc + stage.lessons.length,
    0
  );
  const completedCount = isAuthenticated
    ? Object.values(completedLessons).filter((k) => k?.completed && k?.passed !== false).length
    : 0;

  const isEligible = totalLessons > 0 && completedCount >= totalLessons;
  const progressPercentage = Math.round((completedCount / (totalLessons || 1)) * 100);

  const certificateCode = "CERT-BA-2026-W892K";
  const issueDate = new Date().toLocaleDateString(language === "en" ? "en-US" : "id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const handleCopyLink = () => {
    const origin =
      typeof window !== "undefined"
        ? window.location.origin
        : "https://belajarinaja.vercel.app";
    navigator.clipboard.writeText(
      `${origin}/certificates/${certificateCode}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col transition-colors">
      <Navbar />
      <SearchCommandModal />

      <main className="flex-1 py-10 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl space-y-8">
          {/* Header */}
          <div className="p-6 sm:p-8 rounded-2xl border border-border bg-card shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4 text-center sm:text-left flex-col sm:flex-row">
              {theme === "fun" ? (
                <NovaCharacter state={isEligible ? "celebrating" : "encouraging"} className="w-16 h-16 shrink-0" />
              ) : (
                <div className="h-12 w-12 rounded-xl bg-secondary text-primary flex items-center justify-center font-bold">
                  <Award className="h-6 w-6" />
                </div>
              )}

              <div className="space-y-1">
                <span className="text-[10px] font-bold text-primary uppercase tracking-wider block">
                  {language === "en" ? "GRADUATION CERTIFICATION" : "SERTIFIKASI KELULUSAN"}
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                  {t.certificates.title}
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  {t.certificates.lockedDesc}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Link href={`/certificates/${certificateCode}`}>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs font-semibold rounded-md gap-1"
                >
                  <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                  <span>
                    {language === "en" ? "Public Credential" : "Verifikasi Publik"}
                  </span>
                </Button>
              </Link>

              {isEligible && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopyLink}
                    className="text-xs font-semibold rounded-md"
                  >
                    {copied ? <Check className="h-3.5 w-3.5 mr-1 text-emerald-600" /> : <Copy className="h-3.5 w-3.5 mr-1" />}
                    {copied ? t.common.copied : t.certificates.copyLink}
                  </Button>
                  <Button
                    size="sm"
                    onClick={handlePrint}
                    className="text-xs font-bold rounded-md"
                  >
                    <Download className="h-3.5 w-3.5 mr-1" />
                    {t.certificates.downloadPdf}
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Not Eligible Progress State */}
          {!isEligible ? (
            <div className="p-8 sm:p-12 rounded-2xl border border-border bg-card shadow-xs text-center space-y-6">
              <div className="h-14 w-14 rounded-2xl bg-secondary text-muted-foreground flex items-center justify-center mx-auto border border-border">
                <Lock className="h-7 w-7" />
              </div>

              <div className="space-y-2 max-w-md mx-auto">
                <h3 className="text-lg font-bold text-foreground">
                  {t.certificates.lockedTitle}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {t.certificates.lockedDesc}
                </p>
              </div>

              <div className="max-w-md mx-auto space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-foreground">
                  <span>{language === "en" ? "Graduation Progress" : "Progres Kelulusan"}</span>
                  <span>{progressPercentage}%</span>
                </div>
                <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-500"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
                <div className="text-[11px] text-muted-foreground">
                  {language === "en"
                    ? `${completedCount} of ${totalLessons} lessons completed`
                    : `${completedCount} dari ${totalLessons} materi terselesaikan`}
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <Link href="/roadmap">
                  <Button className="text-xs font-bold rounded-md px-6 gap-1.5">
                    <span>{language === "en" ? "Continue Curriculum Roadmap" : "Lanjutkan Peta Kurikulum"}</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowPreview(!showPreview)}
                  className="text-xs font-semibold rounded-md gap-1.5"
                >
                  <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                  <span>
                    {showPreview
                      ? (language === "en" ? "Hide Certificate Preview" : "Tutup Pratinjau")
                      : (language === "en" ? "Preview Official Certificate" : "Pratinjau Sertifikat Resmi")}
                  </span>
                </Button>
              </div>

              {showPreview && (
                <div className="pt-6 space-y-3">
                  <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 rounded-lg text-xs font-medium text-center">
                    {language === "en"
                      ? "Preview Mode: This is how your accredited certificate will look upon completing all curriculum stages."
                      : "Mode Pratinjau: Seperti inilah sertifikat kelulusan akreditasi resmi kamu setelah menyelesaikan seluruh tahap kurikulum."}
                  </div>
                  <OfficialCertificateDocument
                    studentName={user?.name || "Marchelino Kurniawan"}
                    studentUsername={user?.username || "developer"}
                    certificateCode={certificateCode}
                    issueDate={issueDate}
                    language={language}
                    verificationUrl={
                      typeof window !== "undefined"
                        ? `${window.location.origin}/certificates/${certificateCode}`
                        : `https://belajarinaja.vercel.app/certificates/${certificateCode}`
                    }
                  />
                </div>
              )}
            </div>
          ) : (
            /* Eligible Issued Certificate Presentation */
            <div className="space-y-4">
              <OfficialCertificateDocument
                studentName={user?.name || "Marchelino Kurniawan"}
                studentUsername={user?.username || "developer"}
                certificateCode={certificateCode}
                issueDate={issueDate}
                language={language}
                verificationUrl={
                  typeof window !== "undefined"
                    ? `${window.location.origin}/certificates/${certificateCode}`
                    : `https://belajarinaja.vercel.app/certificates/${certificateCode}`
                }
              />
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
