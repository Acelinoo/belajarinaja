"use client";

import React, { use, useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SearchCommandModal } from "@/components/common/SearchCommandModal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useThemeLanguageStore } from "@/store/useThemeLanguageStore";
import { useAuthStore } from "@/store/useAuthStore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCertificate,
  faShieldHalved,
  faCircleCheck,
  faPrint,
  faCopy,
  faCheck,
  faArrowLeft,
  faGraduationCap,
} from "@fortawesome/free-solid-svg-icons";
import { OfficialCertificateDocument } from "@/components/certificates/OfficialCertificateDocument";

interface PublicCertificatePageProps {
  params: Promise<{ code: string }>;
}

export default function PublicCertificatePage({ params }: PublicCertificatePageProps) {
  const resolvedParams = use(params);
  const certificateCode = decodeURIComponent(resolvedParams.code || "CERT-BA-2026-W892K");

  const [copied, setCopied] = useState(false);
  const { language } = useThemeLanguageStore();
  const { user } = useAuthStore();

  const issueDate = new Date().toLocaleDateString(
    language === "en" ? "en-US" : "id-ID",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  const studentName = user?.name || (language === "en" ? "Marchelino Kurniawan" : "Marchelino Kurniawan");
  const studentUsername = user?.username || "developer";

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

  const currentUrl =
    typeof window !== "undefined"
      ? window.location.href
      : `https://belajarinaja.vercel.app/certificates/${certificateCode}`;

  const shareText =
    language === "en"
      ? `I have successfully completed the 20-Stage Modern Web Development Curriculum at BelajarinAja! Verified Credential: ${certificateCode}`
      : `Saya telah berhasil menyelesaikan seluruh 20 Tahapan Kurikulum Modern Web Development di BelajarinAja! Kredensial Terverifikasi: ${certificateCode}`;

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
          {/* Top Back & Verification Banner */}
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

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
              <FontAwesomeIcon icon={faCircleCheck} className="h-3.5 w-3.5" />
              <span>
                {language === "en"
                  ? "Verified Official Credential"
                  : "Kredensial Resmi Terverifikasi"}
              </span>
            </div>
          </div>

          {/* Action Buttons Toolbar */}
          <div className="p-4 sm:p-5 rounded-2xl border border-border bg-card shadow-xs flex flex-wrap items-center justify-between gap-4 print:hidden">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <FontAwesomeIcon icon={faShieldHalved} className="h-4 w-4 text-primary" />
              <span className="font-mono font-bold text-foreground">
                {certificateCode}
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

          {/* Certificate Canvas Document (Matching Reference Specification) */}
          <div className="print:m-0">
            <OfficialCertificateDocument
              studentName={studentName}
              studentUsername={studentUsername}
              certificateCode={certificateCode}
              issueDate={issueDate}
              language={language}
              verificationUrl={currentUrl}
            />
          </div>
        </div>
      </main>

      <div className="print:hidden">
        <Footer />
      </div>
    </div>
  );
}
