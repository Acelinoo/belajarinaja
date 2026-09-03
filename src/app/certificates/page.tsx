"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Award,
  Download,
  Check,
  Copy,
  Lock,
  ArrowRight,
  ShieldCheck,
  LogIn,
} from "lucide-react";
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
  const [userCertCode, setUserCertCode] = useState<string | null>(null);
  const [userIssueDate, setUserIssueDate] = useState<string | null>(null);

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

  // If user completed 100% or is founder account, issue/fetch unique certificate
  useEffect(() => {
    if (!isAuthenticated || !user) return;

    // Check if user is founder
    if (user.email === "marchelino@belajarinaja.com" || user.username === "acelino") {
      setUserCertCode("CERT-BA-2026-W892K");
      setUserIssueDate("17 Desember 2025");
      return;
    }

    if (isEligible) {
      fetch("/api/v1/certificates/issue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          studentName: user.name,
          studentUsername: user.username,
          studentEmail: user.email,
          completedLessonsCount: completedCount,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.certificate) {
            setUserCertCode(data.certificate.certificateCode);
            setUserIssueDate(data.certificate.issueDate);
          }
        })
        .catch((e) => console.warn("[Certificate] Issue sync warning:", e));
    }
  }, [isAuthenticated, user, isEligible, completedCount]);

  const activeCertCode = userCertCode || (isEligible ? "CERT-BA-PENDING" : "CERT-BA-2026-W892K");
  const activeIssueDate =
    userIssueDate ||
    new Date().toLocaleDateString(language === "en" ? "en-US" : "id-ID", {
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
      `${origin}/certificates/${activeCertCode}`
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
              <Link href={`/certificates/${activeCertCode}`}>
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

          {/* GUEST WARNING STATE */}
          {!isAuthenticated && (
            <div className="p-6 sm:p-8 rounded-2xl border border-amber-500/30 bg-amber-500/10 text-center space-y-4">
              <div className="max-w-md mx-auto space-y-2">
                <h3 className="text-base font-bold text-amber-900 dark:text-amber-200">
                  {language === "en" ? "Account Required for Certification" : "Diperlukan Akun untuk Memperoleh Sertifikat"}
                </h3>
                <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
                  {language === "en"
                    ? "Official certificates are permanently bound and registered to verified student accounts. Please sign in to track your progress and claim your official credential upon graduation."
                    : "Sertifikat resmi diterbitkan dan didaftarkan secara permanen atas nama akun pelajar terverifikasi. Masuk sekarang agar progres belajarmu tersimpan dan siap diklaim saat lulus."}
                </p>
              </div>

              <Link href="/auth/login">
                <Button size="sm" className="text-xs font-bold gap-2 px-6">
                  <LogIn className="h-3.5 w-3.5" />
                  <span>{language === "en" ? "Sign In to Save Progress" : "Masuk / Buat Akun"}</span>
                </Button>
              </Link>
            </div>
          )}

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
                      : (language === "en" ? "Preview Official Certificate" : "Pratinjau Format Sertifikat")}
                  </span>
                </Button>
              </div>

              {showPreview && (
                <div className="pt-6 space-y-3">
                  <div className="p-3 bg-secondary/70 border border-border text-foreground rounded-lg text-xs font-medium text-center">
                    {language === "en"
                      ? "Sample Preview: This is the official academic format that will be issued and uniquely registered under your name upon completing all 116 lessons."
                      : "Format Pratinjau Contoh: Seperti inilah dokumen ijazah akademik resmi yang akan diterbitkan dan didaftarkan dengan nomor seri unik atas nama Anda setelah menyelesaikan seluruh 116 materi."}
                  </div>
                  <OfficialCertificateDocument
                    studentName={user?.name || "Nama Pelajar"}
                    studentUsername={user?.username || "username"}
                    certificateCode="BA-2026-CONTOH-PREVIEW"
                    issueDate={activeIssueDate}
                    language={language}
                    verificationUrl="https://belajarinaja.vercel.app/certificates"
                  />
                </div>
              )}
            </div>
          ) : (
            /* Eligible Issued Real Certificate Presentation */
            <div className="space-y-4">
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 rounded-2xl text-xs font-semibold flex items-center justify-between">
                <span>
                  ✓ {language === "en" ? "Curriculum 100% Completed. Official Certificate Registered!" : "Kurikulum 100% Selesai. Sertifikat Resmi Berhasil Didaftarkan!"}
                </span>
                <span className="font-mono">{activeCertCode}</span>
              </div>
              <OfficialCertificateDocument
                studentName={user?.name || "Lulusan BelajarinAja"}
                studentUsername={user?.username || "graduate"}
                certificateCode={activeCertCode}
                issueDate={activeIssueDate}
                language={language}
                verificationUrl={
                  typeof window !== "undefined"
                    ? `${window.location.origin}/certificates/${activeCertCode}`
                    : `https://belajarinaja.vercel.app/certificates/${activeCertCode}`
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
