"use client";

import { useState } from "react";
import Link from "next/link";
import {
  User,
  Mail,
  Lock,
  Moon,
  Sun,
  Globe,
  Trash2,
  Save,
  Check,
  ShieldAlert,
  Sparkles,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SearchCommandModal } from "@/components/common/SearchCommandModal";
import { useUserAuthStore } from "@/store/useUserAuthStore";
import { useThemeLanguageStore } from "@/store/useThemeLanguageStore";
import { useGuestProgressStore } from "@/store/useGuestProgressStore";
import { getTranslations } from "@/lib/translations";

export default function SettingsPage() {
  const { user, setUser } = useUserAuthStore();
  const { theme, setTheme, language, setLanguage } = useThemeLanguageStore();
  const { clearGuestProgress, completedLessons } = useGuestProgressStore();
  const t = getTranslations(language);

  const [name, setName] = useState(user?.name || "Pelajar Web Development");
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
    <div className={`min-h-screen flex flex-col ${theme === "fun" ? "bg-[#FFF8E7] text-[#243447]" : "bg-background text-foreground"}`}>
      <Navbar />
      <SearchCommandModal />

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl space-y-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground fun:text-[#243447]">
              {t.settings.title}
            </h1>
            <p className="text-xs text-muted-foreground fun:text-[#64748B] mt-1 font-medium">
              {t.settings.subtitle}
            </p>
          </div>

          {/* Profile Form */}
          <Card className={`${theme === "fun" ? "border-2 border-[#FED7AA] bg-white rounded-3xl shadow-[0_10px_35px_rgba(255,155,84,0.08)]" : "border-2 border-black bg-white shadow-[6px_6px_0px_#121212] dark:border dark:border-[#1C242D] dark:bg-[#090D12] dark:shadow-none"}`}>
            <form onSubmit={handleSaveProfile}>
              <CardHeader>
                <CardTitle className="text-base font-black text-foreground fun:text-[#243447]">
                  {t.settings.accountInfo}
                </CardTitle>
                <CardDescription className="text-xs font-medium text-[#555555] dark:font-normal dark:text-[#8292A6] fun:text-[#64748B]">
                  {t.settings.accountDesc}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground fun:text-[#243447]">
                    {t.settings.fullName}
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 h-4 w-4 text-[#121212] dark:text-cyan-400 fun:text-[#5CC8FF]" />
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={`pl-9 text-xs bg-white ${theme === "fun" ? "rounded-full border-[#E2E8F0] text-[#243447]" : "dark:bg-[#05070A] dark:border-[#1C242D] dark:text-[#F1F5F9]"}`}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground fun:text-[#243447]">
                    {t.settings.emailAddress}
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-[#121212] dark:text-cyan-400 fun:text-[#5CC8FF]" />
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`pl-9 text-xs bg-white ${theme === "fun" ? "rounded-full border-[#E2E8F0] text-[#243447]" : "dark:bg-[#05070A] dark:border-[#1C242D] dark:text-[#F1F5F9]"}`}
                      required
                    />
                  </div>
                </div>
              </CardContent>

              <CardFooter className={`flex items-center justify-between border-t-2 pt-4 ${theme === "fun" ? "border-[#E2E8F0]" : "border-black dark:border-t dark:border-[#1C242D]"}`}>
                {savedNotice ? (
                  <span className="text-xs text-emerald-800 dark:text-emerald-400 fun:text-[#16A34A] font-bold flex items-center gap-1 font-mono">
                    <Check className="h-4 w-4" />
                    {t.settings.profileSaved}
                  </span>
                ) : (
                  <div />
                )}

                <Button
                  type="submit"
                  size="sm"
                  className={`gap-2 text-xs font-black ${theme === "fun" ? "rounded-full bg-[#FFD84D] hover:bg-[#FFC933] text-[#243447] shadow-[0_4px_12px_rgba(255,216,77,0.4)]" : "shadow-[3px_3px_0px_#121212] dark:border dark:border-cyan-500/40 dark:bg-cyan-500/15 dark:text-cyan-300 dark:hover:bg-cyan-400 dark:hover:text-[#05070A] dark:shadow-none"}`}
                >
                  <Save className="h-3.5 w-3.5" />
                  {t.settings.saveProfile}
                </Button>
              </CardFooter>
            </form>
          </Card>

          {/* Theme & Language Preferences */}
          <Card className={`${theme === "fun" ? "border-2 border-[#FED7AA] bg-white rounded-3xl shadow-[0_10px_35px_rgba(255,155,84,0.08)]" : "border-2 border-black bg-white shadow-[6px_6px_0px_#121212] dark:border dark:border-[#1C242D] dark:bg-[#090D12] dark:shadow-none"}`}>
            <CardHeader>
              <CardTitle className="text-base font-black text-foreground fun:text-[#243447]">
                {t.settings.appearanceAndLang}
              </CardTitle>
              <CardDescription className="text-xs font-medium text-[#555555] dark:font-normal dark:text-[#8292A6] fun:text-[#64748B]">
                {t.settings.appearanceDesc}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* 3 Theme Modes Switcher */}
              <div className={`flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b-2 gap-3 ${theme === "fun" ? "border-[#E2E8F0]" : "border-black dark:border-b dark:border-[#1C242D]"}`}>
                <div>
                  <span className="text-xs font-bold text-foreground fun:text-[#243447] block">
                    {t.settings.themeMode}
                  </span>
                  <span className="text-[11px] font-medium text-[#555555] dark:font-normal dark:text-[#8292A6] fun:text-[#64748B]">
                    Light (Neo-Brutalism), Dark (Obsidian), atau Fun (Playful World)
                  </span>
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                  <Button
                    size="sm"
                    variant={theme === "light" ? "default" : "outline"}
                    onClick={() => setTheme("light")}
                    className={`text-xs h-8 gap-1 font-bold ${theme === "fun" ? "rounded-full" : "shadow-[2px_2px_0px_#121212] dark:border dark:border-[#1C242D] dark:bg-[#0F141A] dark:text-[#CBD5E1]"}`}
                  >
                    <Sun className="h-3.5 w-3.5 text-[#FFD84D]" />
                    Light
                  </Button>
                  <Button
                    size="sm"
                    variant={theme === "dark" ? "default" : "outline"}
                    onClick={() => setTheme("dark")}
                    className={`text-xs h-8 gap-1 font-bold ${theme === "fun" ? "rounded-full" : "shadow-[2px_2px_0px_#121212] dark:border dark:border-cyan-500/40 dark:bg-cyan-500/15 dark:text-cyan-300"}`}
                  >
                    <Moon className="h-3.5 w-3.5 text-cyan-400" />
                    Dark
                  </Button>
                  <Button
                    size="sm"
                    variant={theme === "fun" ? "default" : "outline"}
                    onClick={() => setTheme("fun")}
                    className={`text-xs h-8 gap-1 font-bold ${theme === "fun" ? "rounded-full bg-[#5CC8FF] text-[#243447]" : "shadow-[2px_2px_0px_#121212] dark:border dark:border-[#1C242D] dark:bg-[#0F141A] dark:text-[#CBD5E1]"}`}
                  >
                    <Sparkles className="h-3.5 w-3.5 text-[#FF9F43]" />
                    Fun
                  </Button>
                </div>
              </div>

              {/* Language Switcher */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 gap-3">
                <div>
                  <span className="text-xs font-bold text-foreground fun:text-[#243447] block">
                    {t.settings.contentLang}
                  </span>
                  <span className="text-[11px] font-medium text-[#555555] dark:font-normal dark:text-[#8292A6] fun:text-[#64748B]">
                    Bahasa Indonesia atau English
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant={language === "id" ? "default" : "outline"}
                    onClick={() => setLanguage("id")}
                    className={`text-xs h-8 font-bold ${theme === "fun" ? "rounded-full bg-[#FFD84D] text-[#243447]" : "shadow-[2px_2px_0px_#121212] dark:border dark:border-cyan-500/40 dark:bg-cyan-500/15 dark:text-cyan-300"}`}
                  >
                    Indonesia (ID)
                  </Button>
                  <Button
                    size="sm"
                    variant={language === "en" ? "default" : "outline"}
                    onClick={() => setLanguage("en")}
                    className={`text-xs h-8 font-bold ${theme === "fun" ? "rounded-full" : "shadow-[2px_2px_0px_#121212] dark:border dark:border-[#1C242D] dark:bg-[#0F141A] dark:text-[#94A3B8]"}`}
                  >
                    English (EN)
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone: Reset Progress */}
          <Card className={`${theme === "fun" ? "border-2 border-[#FECDD3] bg-[#FFF1F2] rounded-3xl" : "border-2 border-black bg-[#FF6B6B]/20 shadow-[6px_6px_0px_#121212] dark:border dark:border-red-500/30 dark:bg-red-500/5 dark:shadow-none"}`}>
            <CardHeader>
              <CardTitle className="text-base font-black text-rose-950 dark:text-red-400 fun:text-[#BE123C] flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 text-rose-900 dark:text-red-400 fun:text-[#BE123C]" />
                {t.settings.dangerZone}
              </CardTitle>
              <CardDescription className="text-xs font-medium text-neutral-800 dark:font-normal dark:text-[#8292A6] fun:text-[#BE123C]/80">
                {t.settings.dangerDesc}
              </CardDescription>
            </CardHeader>

            <CardFooter className="flex items-center justify-between pt-2">
              <span className="text-xs font-bold text-neutral-800 dark:font-normal dark:text-[#8292A6] fun:text-[#BE123C]">
                Total {Object.keys(completedLessons).length} {t.roadmap.lessonsCount} {t.common.completed}
              </span>

              <Button
                variant="destructive"
                size="sm"
                onClick={handleClearData}
                className={`gap-2 text-xs font-black ${theme === "fun" ? "rounded-full" : "shadow-[3px_3px_0px_#121212] dark:border dark:border-red-500/40 dark:bg-red-500/20 dark:text-red-300 dark:hover:bg-red-500/30 dark:shadow-none"}`}
              >
                <Trash2 className="h-3.5 w-3.5" />
                {t.settings.resetAllProgress}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}

