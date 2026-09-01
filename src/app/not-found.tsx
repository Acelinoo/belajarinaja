"use client";

import Link from "next/link";
import { Compass, ArrowLeft, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useThemeLanguageStore } from "@/store/useThemeLanguageStore";
import { getTranslations } from "@/lib/translations";
import { NovaCharacter } from "@/components/fun/characters/NovaCharacter";

export default function NotFound() {
  const { theme, language } = useThemeLanguageStore();
  const t = getTranslations(language);

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground transition-colors">
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-20 px-4">
        <div className="max-w-md w-full text-center space-y-6">
          {theme === "fun" ? (
            <NovaCharacter state="confused" className="w-24 h-24 mx-auto" />
          ) : (
            <div className="h-16 w-16 rounded-2xl bg-secondary text-primary flex items-center justify-center mx-auto border border-border">
              <ShieldAlert className="h-8 w-8" />
            </div>
          )}

          <div className="space-y-2">
            <span className="text-xs font-mono font-bold text-primary uppercase tracking-wider block">
              ERROR 404
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              {t.notFound.title}
            </h1>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-sm mx-auto">
              {t.notFound.desc}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link href="/roadmap" className="w-full sm:w-auto">
              <Button className="w-full text-xs font-bold rounded-md px-6 gap-1.5">
                <Compass className="h-4 w-4" />
                <span>{t.notFound.ctaRoadmap}</span>
              </Button>
            </Link>
            <Link href="/" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full text-xs font-semibold rounded-md px-5 gap-1.5">
                <ArrowLeft className="h-4 w-4" />
                <span>{t.notFound.ctaHome}</span>
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
