"use client";

import { useState } from "react";
import Link from "next/link";
import {
  User,
  Mail,
  Moon,
  Sun,
  Globe,
  Trash2,
  Save,
  Check,
  Settings,
  Sparkles,
  ShieldAlert,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SearchCommandModal } from "@/components/common/SearchCommandModal";
import { useAuthStore } from "@/store/useAuthStore";
import { useThemeLanguageStore } from "@/store/useThemeLanguageStore";
import { useCurriculumProgressStore } from "@/store/useCurriculumProgressStore";
import { getTranslations } from "@/lib/translations";
import { NovaCharacter } from "@/components/fun/characters/NovaCharacter";

export default function SettingsPage() {
  const { user, setUser } = useAuthStore();
  const { theme, setTheme, language, setLanguage } = useThemeLanguageStore();
  const { clearGuestProgress } = useCurriculumProgressStore();
  const t = getTranslations(language);

  const [name, setName] = useState(user?.name || "Pelajar Web");
  const [email, setEmail] = useState(user?.email || "student@belajarinaja.com");
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setUser({
      id: user?.id || "usr_saved_01",
      name,
      email,
      role: user?.role || "STUDENT",
    });
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2000);
  };

  const handleClearData = () => {
    if (confirm(t.settings.confirmReset)) {
      clearGuestProgress();
      alert("Seluruh data progress lokal telah dibersihkan.");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col transition-colors">
      <Navbar />
      <SearchCommandModal />

      <main className="flex-1 py-10 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl space-y-8">
          {/* Header Banner */}
          <div className="p-6 sm:p-8 rounded-2xl border border-border bg-card shadow-xs flex items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              {theme === "fun" ? (
                <NovaCharacter state="thinking" className="w-16 h-16 shrink-0" />
              ) : (
                <div className="h-12 w-12 rounded-xl bg-secondary text-primary flex items-center justify-center font-bold">
                  <Settings className="h-6 w-6" />
                </div>
              )}

              <div className="space-y-1">
                <span className="text-[10px] font-bold text-primary uppercase tracking-wider block">
                  PENGATURAN SISTEM
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                  {t.settings.title}
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  {t.settings.subtitle}
                </p>
              </div>
            </div>
          </div>

          {/* Profile Card */}
          <div className="p-6 sm:p-8 rounded-2xl border border-border bg-card shadow-xs space-y-6">
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <h2 className="text-base font-bold text-foreground">{t.settings.accountInfo}</h2>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">{t.settings.fullName}</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-9 h-10 text-xs rounded-md bg-card border-border"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">{t.settings.email}</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-9 h-10 text-xs rounded-md bg-card border-border"
                    required
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center gap-3">
                <Button type="submit" size="sm" className="text-xs font-bold rounded-md px-5 gap-1.5">
                  <Save className="h-3.5 w-3.5" />
                  <span>{t.settings.saveChanges}</span>
                </Button>
                {savedNotice && (
                  <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <Check className="h-3.5 w-3.5" />
                    <span>{t.settings.profileSaved}</span>
                  </span>
                )}
              </div>
            </form>
          </div>

          {/* Atmosphere & Preferences */}
          <div className="p-6 sm:p-8 rounded-2xl border border-border bg-card shadow-xs space-y-6">
            <h2 className="text-base font-bold text-foreground">Suasana Tampilan (Atmosphere)</h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: "light", label: "Light Mode", desc: "Calm & Editorial" },
                { id: "dark", label: "Dark Mode", desc: "Premium & Focused" },
                { id: "fun", label: "Fun Mode", desc: "Playful & Encouraging" },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setTheme(item.id as "light" | "dark" | "fun")}
                  className={`p-4 rounded-xl border text-left transition-colors space-y-1 ${
                    theme === item.id
                      ? "border-primary bg-secondary/80 font-bold"
                      : "border-border bg-card hover:bg-secondary/40"
                  }`}
                >
                  <div className="text-xs font-bold text-foreground">{item.label}</div>
                  <div className="text-[11px] text-muted-foreground">{item.desc}</div>
                </button>
              ))}
            </div>

            {/* Language Switch */}
            <div className="pt-4 border-t border-border flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-foreground">Bahasa Antarmuka</div>
                <div className="text-[11px] text-muted-foreground">Pilih Bahasa Indonesia atau English</div>
              </div>

              <div className="flex items-center gap-1.5">
                <Button
                  variant={language === "id" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setLanguage("id")}
                  className="h-8 text-xs font-bold rounded-md px-3"
                >
                  ID
                </Button>
                <Button
                  variant={language === "en" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setLanguage("en")}
                  className="h-8 text-xs font-bold rounded-md px-3"
                >
                  EN
                </Button>
              </div>
            </div>
          </div>

          {/* Reset Data Danger Zone */}
          <div className="p-6 rounded-2xl border border-destructive/30 bg-destructive/5 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-destructive">
              <ShieldAlert className="h-4 w-4" />
              <span>Zona Bahaya: Reset Data</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Menghapus seluruh progres quiz dan bookmark yang tersimpan di browser ini.
            </p>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleClearData}
              className="text-xs font-bold rounded-md h-8 px-4 gap-1.5"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>{t.settings.resetAllProgress}</span>
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
