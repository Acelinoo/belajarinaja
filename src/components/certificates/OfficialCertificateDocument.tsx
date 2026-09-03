"use client";

import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShieldHalved,
  faCircleCheck,
  faAward,
} from "@fortawesome/free-solid-svg-icons";

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
    <div className="relative w-full max-w-4xl mx-auto bg-white text-[#0f172a] shadow-2xl rounded-2xl overflow-hidden border border-slate-200 print:border-none print:shadow-none print:rounded-none print:max-w-none print:w-full select-none">
      {/* Background Decorative Tech Circuits / Watermark */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.035] overflow-hidden">
        <svg
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1000 700"
          fill="none"
          stroke="#0f172a"
          strokeWidth="1.5"
        >
          {/* Circuit Lines */}
          <path d="M 0 100 H 200 L 250 150 H 450" />
          <path d="M 1000 120 H 800 L 750 170 H 600" />
          <path d="M 50 600 H 220 L 280 540 H 480" />
          <path d="M 950 580 H 780 L 720 520 H 550" />
          <circle cx="200" cy="100" r="4" fill="#0f172a" />
          <circle cx="450" cy="150" r="4" fill="#0f172a" />
          <circle cx="800" cy="120" r="4" fill="#0f172a" />
          <circle cx="280" cy="540" r="4" fill="#0f172a" />
          <circle cx="720" cy="520" r="4" fill="#0f172a" />
        </svg>
      </div>

      {/* Main Inner Container */}
      <div className="relative p-6 sm:p-12 lg:p-14 flex flex-col justify-between min-h-[580px] sm:min-h-[640px]">
        {/* TOP HEADER: 3 COLUMNS */}
        <div className="flex items-center justify-between gap-4 pb-6 border-b border-slate-100">
          {/* Left: Ministry / Accreditation Emblem */}
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center p-1.5 shadow-xs">
              <img
                src="/logo.png"
                alt="BelajarinAja Emblem"
                className="h-full w-full object-contain"
              />
            </div>
            <div className="hidden sm:block text-left">
              <span className="text-[10px] font-bold text-slate-800 uppercase tracking-wider block leading-tight">
                Academic Board
              </span>
              <span className="text-[9px] text-slate-500 font-medium block">
                Web Engineering System
              </span>
            </div>
          </div>

          {/* Center: Main Platform Logo */}
          <div className="text-center flex flex-col items-center">
            <div className="flex items-center gap-2">
              <span className="font-black text-xl sm:text-2xl tracking-tight text-slate-900">
                Belajarin<span className="text-primary font-black">Aja</span>
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-primary/10 text-primary border border-primary/20">
                PRO
              </span>
            </div>
            <span className="text-[9px] font-bold text-slate-400 tracking-[0.2em] uppercase mt-0.5 font-mono">
              Kurikulum Web Development Terstruktur
            </span>
          </div>

          {/* Right: Partner / Accreditation Seal */}
          <div className="flex items-center gap-2.5 text-right">
            <div className="hidden sm:block">
              <span className="text-[10px] font-bold text-slate-800 uppercase tracking-wider block leading-tight">
                Verified Credential
              </span>
              <span className="text-[9px] font-mono text-emerald-600 font-semibold block">
                Official ISO-Grade Standard
              </span>
            </div>
            <div className="h-11 w-11 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center shadow-xs">
              <FontAwesomeIcon icon={faShieldHalved} className="h-5 w-5" />
            </div>
          </div>
        </div>

        {/* CENTER CONTENT WITH TECHNICAL CIRCULAR ARC */}
        <div className="relative my-4 sm:my-6 text-center flex flex-col items-center justify-center">
          {/* Circular Tech HUD Graphic (Matching Reference Image) */}
          <div className="relative w-48 h-48 sm:w-64 sm:h-64 flex items-center justify-center mb-1">
            <svg
              className="absolute inset-0 w-full h-full animate-spin-slow pointer-events-none"
              viewBox="0 0 200 200"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Outer dashed track */}
              <circle
                cx="100"
                cy="100"
                r="88"
                stroke="#cbd5e1"
                strokeWidth="1.5"
                strokeDasharray="4 6"
              />
              {/* Tech arc blue segment */}
              <path
                d="M 30 100 A 70 70 0 0 1 170 100"
                stroke="#0284c7"
                strokeWidth="8"
                strokeLinecap="round"
              />
              {/* Secondary accent arc */}
              <path
                d="M 50 100 A 50 50 0 0 1 150 100"
                stroke="#38bdf8"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              {/* Golden accent blocks */}
              <rect x="92" y="16" width="16" height="6" rx="2" fill="#f59e0b" />
              <circle cx="100" cy="40" r="3" fill="#0284c7" />
              <circle cx="60" cy="55" r="2.5" fill="#94a3b8" />
              <circle cx="140" cy="55" r="2.5" fill="#94a3b8" />
            </svg>

            {/* Title Over The Arc */}
            <div className="relative z-10 px-4 text-center mt-2">
              <span className="text-[11px] sm:text-xs font-bold text-sky-700 tracking-[0.25em] uppercase block font-mono">
                {language === "en" ? "TRAINING" : "PELATIHAN"}
              </span>
              <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-[#0f3b70] uppercase leading-none mt-1">
                {language === "en" ? "CERTIFICATE" : "SERTIFIKAT"}
              </h2>
              <span className="text-[10px] font-semibold text-slate-500 tracking-wider uppercase block mt-1">
                OF COMPLETION
              </span>
            </div>
          </div>

          {/* Student Name */}
          <div className="space-y-1 mt-1 max-w-xl">
            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight capitalize sm:uppercase">
              {studentName}
            </h1>
            <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-sky-600 to-transparent mx-auto my-2" />
          </div>

          {/* Course & Accreditation Paragraph */}
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed mt-2 font-normal">
            {language === "en" ? (
              <>
                has successfully completed the comprehensive training in{" "}
                <strong className="font-extrabold text-slate-900 uppercase">
                  Modern Fullstack Web Development
                </strong>{" "}
                curriculum under BelajarinAja Academic Training Program{" "}
                <span className="font-mono font-semibold text-slate-800">
                  (DSTP-2026-Batch-01)
                </span>
                , covering Semantic HTML5, CSS3 Architecture, Flexbox & Grid,
                JavaScript Runtime Engine, Asynchronous Architecture, React,
                Next.js 15, PostgreSQL & Production Capstones with verified
                passing grade.
              </>
            ) : (
              <>
                telah berhasil menyelesaikan seluruh pelatihan komprehensif pada kurikulum{" "}
                <strong className="font-extrabold text-slate-900 uppercase">
                  Modern Fullstack Web Development
                </strong>{" "}
                di bawah Program Pelatihan Akademik BelajarinAja{" "}
                <span className="font-mono font-semibold text-slate-800">
                  (DSTP-2026-Batch-01)
                </span>
                , menguasai HTML5 Semantik, Arsitektur CSS3, Flexbox & Grid, Engine
                JavaScript, Logika Asinkronus, React, Next.js 15, PostgreSQL, dan
                Proyek Produksi dengan nilai kelulusan terverifikasi.
              </>
            )}
          </p>
        </div>

        {/* SIGNATURES & INSTITUTION LOGO ROW */}
        <div className="pt-6 border-t border-slate-100 grid grid-cols-3 items-end gap-4">
          {/* Left: Signature 1 */}
          <div className="text-center flex flex-col items-center">
            {/* Realistic Digital Cursive Signature SVG */}
            <svg
              className="h-10 w-28 text-slate-800"
              viewBox="0 0 120 40"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M 10 28 C 25 10, 30 35, 45 15 C 55 5, 60 30, 75 18 C 85 10, 95 25, 110 12" />
            </svg>
            <div className="w-32 border-b border-slate-300 mt-1 mb-1" />
            <span className="text-[10px] font-bold text-slate-800 block">
              Marchelino Kurniawan
            </span>
            <span className="text-[9px] text-slate-500 block">
              Founder & Lead Instructor
            </span>
          </div>

          {/* Center: Official Seal / Verified Stamp */}
          <div className="flex flex-col items-center justify-center">
            <div className="h-14 w-14 rounded-full border-2 border-dashed border-sky-600/60 bg-sky-50 flex flex-col items-center justify-center text-center p-1 shadow-inner">
              <FontAwesomeIcon
                icon={faCircleCheck}
                className="h-4 w-4 text-sky-600 mb-0.5"
              />
              <span className="text-[7px] font-black uppercase tracking-tighter text-sky-900 leading-tight">
                VERIFIED
              </span>
              <span className="text-[6px] font-mono text-sky-700">ACADEMIC</span>
            </div>
          </div>

          {/* Right: Signature 2 */}
          <div className="text-center flex flex-col items-center">
            {/* Realistic Digital Cursive Signature SVG */}
            <svg
              className="h-10 w-28 text-slate-800"
              viewBox="0 0 120 40"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M 15 20 C 30 5, 35 32, 50 18 C 65 8, 70 30, 85 15 C 95 28, 105 10, 115 16" />
            </svg>
            <div className="w-32 border-b border-slate-300 mt-1 mb-1" />
            <span className="text-[10px] font-bold text-slate-800 block">
              Academic Council
            </span>
            <span className="text-[9px] text-slate-500 block">
              Head of Technology & Board
            </span>
          </div>
        </div>
      </div>

      {/* DISTINCTIVE BOTTOM ORANGE STRIP (Matching Reference Image) */}
      <div className="bg-[#f97316] text-white px-4 sm:px-8 py-2.5 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10.5px] font-semibold tracking-tight print:bg-[#f97316] print:text-white">
        {/* Left: Issue Date */}
        <div>
          <span>Issue Date : </span>
          <span className="font-mono font-bold">{issueDate}</span>
        </div>

        {/* Center: Online Verification URL */}
        <div className="text-center truncate max-w-sm sm:max-w-md">
          <span className="opacity-95">
            This document may be verified online at:{" "}
          </span>
          <a
            href={verificationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-white/90 font-mono font-bold"
          >
            {verificationUrl}
          </a>
        </div>

        {/* Right: Certificate ID */}
        <div>
          <span>Certificate ID: </span>
          <span className="font-mono font-bold uppercase tracking-wider">
            {certificateCode}
          </span>
        </div>
      </div>
    </div>
  );
}
