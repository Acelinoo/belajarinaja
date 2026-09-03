"use client";

import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { OAuthButtons } from "@/components/auth/OAuthButtons";
import { useCurriculumProgressStore } from "@/store/useCurriculumProgressStore";
import { useThemeLanguageStore } from "@/store/useThemeLanguageStore";
import { getTranslations } from "@/lib/translations";

export default function AuthLoginPage() {
  const { completedLessons } = useCurriculumProgressStore();
  const { language } = useThemeLanguageStore();
  const t = getTranslations(language);

  const guestCount = Object.keys(completedLessons).length;

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 sm:p-6 bg-background text-foreground transition-colors">
      <div className="w-full max-w-md space-y-5">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>{t.auth.backHome}</span>
        </Link>

        <div className="p-8 sm:p-10 rounded-2xl border border-border bg-card shadow-xl space-y-6">
          {/* Logo & Header */}
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="group">
              <img
                src="/logo.png"
                alt="Logo BelajarinAja"
                className="w-20 h-20 rounded-2xl object-cover shadow-lg ring-1 ring-border transition-transform group-hover:scale-105"
              />
            </div>

            <div className="space-y-1">
              <h1 className="text-2xl font-black text-foreground tracking-tight">
                Masuk ke Belajarin<span className="text-primary font-black">Aja</span>
              </h1>
              <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                Mulai belajar Web Development terstruktur dari nol dan simpan seluruh progres belajarmu di cloud.
              </p>
            </div>
          </div>

          {/* Guest Sync Notice */}
          {guestCount > 0 && (
            <div className="rounded-xl border border-border bg-secondary/60 p-3.5 text-xs flex items-center gap-3 shadow-xs">
              <ShieldCheck className="h-5 w-5 text-primary shrink-0" />
              <div>
                <span className="font-bold text-foreground block">
                  {guestCount} materi telah kamu selesaikan!
                </span>
                <p className="text-muted-foreground text-[11px] mt-0.5">
                  Masuk sekarang untuk menyinkronkan progres belajarmu secara otomatis.
                </p>
              </div>
            </div>
          )}

          {/* OAuth Login Buttons (Google & GitHub) */}
          <div className="space-y-4 pt-2">
            <OAuthButtons redirectTo="/dashboard" showDivider={false} />

            <div className="pt-3 border-t border-border/70 text-center">
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Platform belajar 100% gratis tanpa biaya tersembunyi. Data profil kamu aman dan hanya digunakan untuk identitas sertifikat kelulusan.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
