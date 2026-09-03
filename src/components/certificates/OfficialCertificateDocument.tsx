"use client";

import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCertificate, faShieldHalved } from "@fortawesome/free-solid-svg-icons";

interface OfficialCertificateDocumentProps {
  studentName: string;
  studentUsername?: string;
  certificateCode: string;
  issueDate: string;
  language?: "id" | "en";
  verificationUrl?: string;
}

export function OfficialCertificateDocument({
  studentName,
  studentUsername = "developer",
  certificateCode = "CERT-BA-2026-W892K",
  issueDate,
  language = "id",
  verificationUrl = "https://belajarinaja.vercel.app/certificates/CERT-BA-2026-W892K",
}: OfficialCertificateDocumentProps) {
  return (
    <div className="relative w-full max-w-4xl mx-auto bg-[#FCFBF8] text-[#1e293b] shadow-2xl rounded-xl overflow-hidden border border-slate-300 print:border-none print:shadow-none print:rounded-none print:max-w-none print:w-full select-none">
      {/* OUTER ELEGANT DIPLOMA DOUBLE BORDER */}
      <div className="p-3 sm:p-5">
        <div className="relative border-2 border-[#1e293b] p-6 sm:p-12 lg:p-14 bg-[#FFFFFF] flex flex-col justify-between min-h-[580px] sm:min-h-[660px]">
          {/* INNER FINE GOLD BORDER */}
          <div className="absolute inset-2 sm:inset-3 border border-[#c5a059]/70 pointer-events-none" />

          {/* CORNER ORNAMENTS (4 CORNERS) */}
          {/* Top-Left */}
          <svg
            className="absolute top-2 left-2 sm:top-3 sm:left-3 w-7 h-7 text-[#c5a059] pointer-events-none"
            viewBox="0 0 40 40"
            fill="currentColor"
          >
            <path d="M 0 0 L 25 0 C 15 10, 10 15, 0 25 Z" />
            <rect x="0" y="0" width="40" height="2" />
            <rect x="0" y="0" width="2" height="40" />
            <circle cx="8" cy="8" r="2.5" />
          </svg>
          {/* Top-Right */}
          <svg
            className="absolute top-2 right-2 sm:top-3 sm:right-3 w-7 h-7 text-[#c5a059] pointer-events-none"
            viewBox="0 0 40 40"
            fill="currentColor"
          >
            <path d="M 40 0 L 15 0 C 25 10, 30 15, 40 25 Z" />
            <rect x="0" y="0" width="40" height="2" />
            <rect x="38" y="0" width="2" height="40" />
            <circle cx="32" cy="8" r="2.5" />
          </svg>
          {/* Bottom-Left */}
          <svg
            className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 w-7 h-7 text-[#c5a059] pointer-events-none"
            viewBox="0 0 40 40"
            fill="currentColor"
          >
            <path d="M 0 40 L 25 40 C 15 30, 10 25, 0 15 Z" />
            <rect x="0" y="38" width="40" height="2" />
            <rect x="0" y="0" width="2" height="40" />
            <circle cx="8" cy="32" r="2.5" />
          </svg>
          {/* Bottom-Right */}
          <svg
            className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 w-7 h-7 text-[#c5a059] pointer-events-none"
            viewBox="0 0 40 40"
            fill="currentColor"
          >
            <path d="M 40 40 L 15 40 C 25 30, 30 25, 40 15 Z" />
            <rect x="0" y="38" width="40" height="2" />
            <rect x="38" y="0" width="2" height="40" />
            <circle cx="32" cy="32" r="2.5" />
          </svg>

          {/* BACKGROUND ACADEMIC WATERMARK */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03]">
            <img
              src="/logo.png"
              alt="Watermark"
              className="w-80 h-80 object-contain"
            />
          </div>

          {/* 1. TOP INSTITUTIONAL HEADER */}
          <div className="relative text-center space-y-2 pb-5 border-b border-slate-200/80">
            <div className="flex items-center justify-center gap-3">
              <img
                src="/logo.png"
                alt="BelajarinAja Emblem"
                className="h-11 w-11 object-contain"
              />
              <div className="text-left">
                <span className="font-serif font-bold text-lg sm:text-xl tracking-wide text-[#0f172a] block leading-tight">
                  BELAJARINAJA
                </span>
                <span className="text-[10px] font-mono tracking-[0.2em] text-[#64748b] uppercase block">
                  ACADEMIC SYSTEM OF SOFTWARE ENGINEERING
                </span>
              </div>
            </div>
            <p className="text-[10px] tracking-[0.25em] text-[#c5a059] uppercase font-serif font-semibold">
              DEWAN AKREDITASI & STANDARISASI KOMPETENSI REKAYASA WEB
            </p>
          </div>

          {/* 2. MAIN TITLE SECTION */}
          <div className="relative text-center space-y-3 my-4">
            <h1 className="font-serif text-2xl sm:text-4xl font-bold tracking-[0.18em] text-[#0f172a] uppercase">
              {language === "en" ? "Certificate of Completion" : "Sertifikat Kelulusan"}
            </h1>

            {/* Ornamental Divider */}
            <div className="flex items-center justify-center gap-3">
              <div className="w-16 sm:w-28 h-px bg-gradient-to-r from-transparent to-[#c5a059]" />
              <div className="w-2 h-2 rotate-45 bg-[#c5a059]" />
              <div className="w-16 sm:w-28 h-px bg-gradient-to-l from-transparent to-[#c5a059]" />
            </div>

            <p className="font-serif italic text-xs sm:text-sm text-[#475569]">
              {language === "en"
                ? "This credential is proudly conferred upon:"
                : "Dengan bangga dan penuh kehormatan dianugerahkan kepada:"}
            </p>
          </div>

          {/* 3. RECIPIENT NAME */}
          <div className="relative text-center space-y-2 my-2">
            <div className="font-serif text-2xl sm:text-4xl lg:text-5xl font-bold text-[#0f172a] tracking-wide capitalize sm:uppercase">
              {studentName}
            </div>
            <div className="w-48 sm:w-72 h-0.5 bg-[#c5a059] mx-auto opacity-80" />
            <span className="text-[11px] font-mono text-[#64748b] block">
              Student ID: @{studentUsername}
            </span>
          </div>

          {/* 4. FORMAL CITATION / COURSE DETAILS */}
          <div className="relative text-center max-w-2xl mx-auto space-y-2 my-3">
            <p className="text-xs sm:text-[13px] leading-relaxed text-[#334155] font-serif">
              {language === "en" ? (
                <>
                  In recognition of verified academic excellence and successful completion of
                  the 20-stage industrial curriculum in:
                </>
              ) : (
                <>
                  Atas keberhasilan dan dedikasi tinggi dalam menyelesaikan serta menguasai seluruh 20
                  tahap kurikulum profesional berstandar industri pada:
                </>
              )}
            </p>

            <h2 className="font-serif font-extrabold text-base sm:text-lg tracking-wider text-[#0f172a] uppercase py-1">
              Modern Fullstack Web Development & Software Engineering
            </h2>

            <p className="text-[11px] sm:text-xs leading-relaxed text-[#64748b] font-normal">
              {language === "en" ? (
                <>
                  Covering Semantic HTML5 Standards, Modern CSS Architecture, Flexbox & Grid,
                  JavaScript Core Runtime, Asynchronous Logic, React, Next.js 15, PostgreSQL & Relational
                  Database Architecture, with verified passing evaluation (≥ 80% passing grade).
                </>
              ) : (
                <>
                  Meliputi Standar HTML5 Semantik, Arsitektur CSS Modern, Tata Letak Flexbox & Grid,
                  Engine JavaScript, Logika Asinkronus, Ekosistem React, Next.js 15, serta Basis Data
                  Relasional PostgreSQL dengan kelulusan evaluasi terverifikasi (passing grade ≥ 80%).
                </>
              )}
            </p>
          </div>

          {/* 5. FORMAL DIGITAL SIGNATURES (CLEAN 2-COLUMN LAYOUT) */}
          <div className="relative pt-8 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-8 max-w-2xl mx-auto w-full px-4 sm:px-12 my-2">
            {/* Left Digital Signature: Founder */}
            <div className="text-center flex flex-col items-center">
              <svg
                className="h-11 w-32 text-[#0f172a]"
                viewBox="0 0 120 40"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M 10 28 C 25 10, 30 35, 45 15 C 55 5, 60 30, 75 18 C 85 10, 95 25, 110 12" />
              </svg>
              <div className="w-36 border-b border-[#0f172a] mt-1 mb-1.5" />
              <span className="font-serif font-bold text-xs sm:text-sm text-[#0f172a] block">
                Marchelino Kurniawan
              </span>
              <span className="text-[10px] font-sans text-[#64748b] block">
                Founder & Fullstack Specialist
              </span>
              <span className="text-[8.5px] font-mono text-emerald-600 font-semibold mt-0.5 tracking-wider uppercase block">
                ✓ Digitally Signed & Authenticated
              </span>
            </div>

            {/* Right Digital Signature: Academic Council */}
            <div className="text-center flex flex-col items-center">
              <svg
                className="h-11 w-32 text-[#0f172a]"
                viewBox="0 0 120 40"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M 15 20 C 30 5, 35 32, 50 18 C 65 8, 70 30, 85 15 C 95 28, 105 10, 115 16" />
              </svg>
              <div className="w-36 border-b border-[#0f172a] mt-1 mb-1.5" />
              <span className="font-serif font-bold text-xs sm:text-sm text-[#0f172a] block">
                Dewan Kurikulum Akademik
              </span>
              <span className="text-[10px] font-sans text-[#64748b] block">
                Head of Academic Evaluation
              </span>
              <span className="text-[8.5px] font-mono text-emerald-600 font-semibold mt-0.5 tracking-wider uppercase block">
                ✓ Digitally Signed & Authenticated
              </span>
            </div>
          </div>

          {/* 6. FORMAL FOOTNOTE METADATA */}
          <div className="relative pt-4 border-t border-slate-200 text-[10px] font-mono text-[#64748b] flex flex-col sm:flex-row items-center justify-between gap-2">
            <div>
              <span className="font-sans font-semibold text-[#334155]">
                {language === "en" ? "Issue Date: " : "Tanggal Terbit: "}
              </span>
              <span className="text-[#0f172a] font-bold">{issueDate}</span>
            </div>

            <div className="text-center truncate max-w-xs sm:max-w-md">
              <span className="font-sans">
                {language === "en" ? "Verification: " : "Verifikasi: "}
              </span>
              <a
                href={verificationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 text-[#0f172a] font-bold hover:text-primary"
              >
                {verificationUrl}
              </a>
            </div>

            <div>
              <span className="font-sans font-semibold text-[#334155]">
                {language === "en" ? "Credential ID: " : "No. Sertifikat: "}
              </span>
              <span className="text-[#0f172a] font-bold uppercase">
                {certificateCode}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
