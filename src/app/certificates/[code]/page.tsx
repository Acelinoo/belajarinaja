"use client";

import React, { use, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SearchCommandModal } from "@/components/common/SearchCommandModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useThemeLanguageStore } from "@/store/useThemeLanguageStore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShieldHalved,
  faCircleCheck,
  faPrint,
  faCopy,
  faCheck,
  faArrowLeft,
  faCircleExclamation,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { OfficialCertificateDocument } from "@/components/certificates/OfficialCertificateDocument";
import { IssuedCertificate } from "@/lib/certificateService";

interface PublicCertificatePageProps {
  params: Promise<{ code: string }>;
}

export default function PublicCertificatePage({ params }: PublicCertificatePageProps) {
  const router = useRouter();
  const resolvedParams = use(params);
  const rawCode = resolvedParams.code || "";
  const certificateCode = decodeURIComponent(rawCode).trim().toUpperCase();

  const [loading, setLoading] = useState(true);
  const [certificate, setCertificate] = useState<IssuedCertificate | null>(null);
  const [searchCode, setSearchCode] = useState("");
  const [copied, setCopied] = useState(false);
  const { language } = useThemeLanguageStore();

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    fetch(`/api/v1/certificates/${encodeURIComponent(certificateCode)}`)
      .then((res) => res.json())
      .then((data) => {
        if (!isMounted) return;
        if (data.valid && data.certificate) {
          setCertificate(data.certificate);
        } else {
          setCertificate(null);
        }
      })
      .catch((err) => {
        console.warn("[Verify Certificate] Fetch error:", err);
        if (isMounted) setCertificate(null);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [certificateCode]);

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const handleSearchAnother = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = searchCode.trim().toUpperCase();
    if (clean) {
      router.push(`/certificates/${encodeURIComponent(clean)}`);
    }
  };

  const currentUrl =
    typeof window !== "undefined"
      ? window.location.href
      : `https://belajarinaja.vercel.app/certificates/${certificateCode}`;

  const shareText =
    language === "en"
      ? `Verified Academic Credential of ${certificate?.studentName || "Graduate"} (${certificateCode}) for Fullstack Web Development at BelajarinAja!`
      : `Kredensial Akademik Terverifikasi ${certificate?.studentName || "Lulusan"} (${certificateCode}) pada program Fullstack Web Development BelajarinAja!`;

  const shareLinkedIn = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
    currentUrl
  )}`;

  const shareTwitter = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    shareText
  )}&url=${encodeURIComponent(currentUrl)}`;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col transition-colors print:bg-white print:text-black">
      <div className="print:hidden">
        <Navbar />
        <SearchCommandModal />
      </div>

      <main className="flex-1 py-10 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl space-y-8">
          {/* Top Navigation */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 print:hidden">
            <Link
              href="/certificates"
              className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
            >
              <FontAwesomeIcon icon={faArrowLeft} className="h-3.5 w-3.5" />
              <span>
                {language === "en" ? "Back to Certificates" : "Kembali ke Sertifikasi"}
              </span>
            </Link>

            {!loading && (
              <div
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold border ${
                  certificate
                    ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                    : "bg-rose-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400"
                }`}
              >
                <FontAwesomeIcon
                  icon={certificate ? faCircleCheck : faCircleExclamation}
                  className="h-3.5 w-3.5"
                />
                <span>
                  {certificate
                    ? language === "en"
                      ? "Verified Official Credential"
                      : "Kredensial Resmi Terverifikasi"
                    : language === "en"
                    ? "Unregistered / Invalid Credential"
                    : "Kredensial Tidak Terdaftar / Tidak Sah"}
                </span>
              </div>
            )}
          </div>

          {/* LOADING STATE */}
          {loading && (
            <div className="p-16 rounded-3xl border border-border bg-card text-center space-y-4 shadow-sm">
              <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs font-semibold text-muted-foreground font-mono">
                {language === "en"
                  ? "Verifying academic credential signature..."
                  : "Memverifikasi tanda tangan kredensial akademik..."}
              </p>
            </div>
          )}

          {/* INVALID / NOT FOUND CREDENTIAL */}
          {!loading && !certificate && (
            <div className="p-8 sm:p-14 rounded-3xl border border-border bg-card text-center space-y-6 shadow-sm">
              <div className="h-16 w-16 rounded-2xl bg-rose-500/10 text-rose-600 flex items-center justify-center mx-auto border border-rose-500/20">
                <FontAwesomeIcon icon={faCircleExclamation} className="h-8 w-8" />
              </div>

              <div className="space-y-2 max-w-lg mx-auto">
                <Badge variant="outline" className="font-mono text-xs px-3 py-1 text-rose-600 border-rose-300">
                  {certificateCode}
                </Badge>
                <h1 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">
                  {language === "en"
                    ? "Certificate Not Found or Unregistered"
                    : "Sertifikat Tidak Ditemukan atau Belum Terdaftar"}
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {language === "en"
                    ? `The credential code "${certificateCode}" is not registered in the BelajarinAja Academic Accreditation Database. This certificate may not have been issued yet or the serial number is incorrect.`
                    : `Nomor seri sertifikat "${certificateCode}" tidak terdaftar dalam basis data resmi BelajarinAja Academic System. Sertifikat ini mungkin belum pernah diterbitkan atau nomor seri yang dimasukkan keliru.`}
                </p>
              </div>

              {/* Search Another Code */}
              <form onSubmit={handleSearchAnother} className="max-w-md mx-auto pt-2">
                <div className="flex gap-2">
                  <Input
                    value={searchCode}
                    onChange={(e) => setSearchCode(e.target.value)}
                    placeholder="Contoh: CERT-BA-2026-W892K"
                    className="h-10 text-xs font-mono uppercase bg-background"
                  />
                  <Button type="submit" size="sm" className="h-10 px-4 text-xs font-bold gap-1.5 shrink-0">
                    <FontAwesomeIcon icon={faSearch} className="h-3 w-3" />
                    <span>{language === "en" ? "Verify" : "Periksa"}</span>
                  </Button>
                </div>
              </form>

              <div className="pt-4 border-t border-border/70 flex flex-wrap justify-center gap-3">
                <Link href="/roadmap">
                  <Button variant="outline" size="sm" className="text-xs font-semibold">
                    {language === "en" ? "Explore Web Curriculum" : "Jelajahi Kurikulum Web"}
                  </Button>
                </Link>
                <Link href="/certificates">
                  <Button size="sm" className="text-xs font-bold">
                    {language === "en" ? "My Certificates" : "Halaman Sertifikasi Saya"}
                  </Button>
                </Link>
              </div>
            </div>
          )}

          {/* VALID VERIFIED CREDENTIAL PRESENTATION */}
          {!loading && certificate && (
            <>
              {/* Action Buttons Toolbar */}
              <div className="p-4 sm:p-5 rounded-2xl border border-border bg-card shadow-xs flex flex-wrap items-center justify-between gap-4 print:hidden">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <FontAwesomeIcon icon={faShieldHalved} className="h-4 w-4 text-primary" />
                  <span className="font-mono font-bold text-foreground">
                    {certificate.certificateCode}
                  </span>
                  <span className="text-[10px] text-emerald-600 font-semibold ml-2">
                    (Resmi Terdaftar)
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {/* Copy URL */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopyLink}
                    className="text-xs font-semibold rounded-md gap-1.5"
                  >
                    <FontAwesomeIcon
                      icon={copied ? faCheck : faCopy}
                      className={`h-3.5 w-3.5 ${copied ? "text-emerald-500" : ""}`}
                    />
                    <span>
                      {copied
                        ? language === "en"
                          ? "Link Copied!"
                          : "Tautan Tersalin!"
                        : language === "en"
                        ? "Copy Link"
                        : "Salin Tautan"}
                    </span>
                  </Button>

                  {/* Share to LinkedIn */}
                  <a
                    href={shareLinkedIn}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md bg-[#0A66C2] text-white hover:bg-[#084e96] transition-colors"
                  >
                    <span>LinkedIn</span>
                  </a>

                  {/* Share to X */}
                  <a
                    href={shareTwitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md bg-black text-white dark:bg-white dark:text-black hover:opacity-80 transition-opacity"
                  >
                    <span>X / Twitter</span>
                  </a>

                  {/* Print / Download */}
                  <Button
                    size="sm"
                    onClick={handlePrint}
                    className="text-xs font-bold rounded-md gap-1.5"
                  >
                    <FontAwesomeIcon icon={faPrint} className="h-3.5 w-3.5" />
                    <span>{language === "en" ? "Print / PDF" : "Cetak / PDF"}</span>
                  </Button>
                </div>
              </div>

              {/* Formal Academic Certificate Document */}
              <div className="print:m-0">
                <OfficialCertificateDocument
                  studentName={certificate.studentName}
                  studentUsername={certificate.studentUsername}
                  certificateCode={certificate.certificateCode}
                  issueDate={certificate.issueDate}
                  language={language}
                  verificationUrl={currentUrl}
                />
              </div>
            </>
          )}
        </div>
      </main>

      <div className="print:hidden">
        <Footer />
      </div>
    </div>
  );
}
