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

export default function SettingsPage() {
  const { user, setUser } = useUserAuthStore();
  const { theme, setTheme, language, setLanguage } = useThemeLanguageStore();
  const { clearGuestProgress, completedLessons } = useGuestProgressStore();

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
    if (
      confirm(
        "Apakah Anda yakin ingin mereset seluruh data progress belajar di browser ini?"
      )
    ) {
      clearGuestProgress();
      alert("Seluruh data progress lokal telah dibersihkan.");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />
      <SearchCommandModal />

      <main className="flex-1 py-10">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Pengaturan Profil & Preferensi
            </h1>
            <p className="text-xs text-muted-foreground mt-1">
              Kelola informasi profil, preferensi tema, bahasa, dan data pembelajaran Anda.
            </p>
          </div>

          {/* Profile Form */}
          <Card className="border-2 border-black bg-white shadow-[6px_6px_0px_#121212] dark:border dark:border-[#1C242D] dark:bg-[#090D12] dark:shadow-none">
            <form onSubmit={handleSaveProfile}>
              <CardHeader>
                <CardTitle className="text-base font-black">
                  Informasi Akun
                </CardTitle>
                <CardDescription className="text-xs font-medium text-[#555555] dark:font-normal dark:text-[#8292A6]">
                  Nama lengkap yang tertera pada sertifikat kelulusan.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground">
                    Nama Lengkap
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 h-4 w-4 text-[#121212] dark:text-cyan-400" />
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="pl-9 text-xs bg-white dark:bg-[#05070A] dark:border-[#1C242D] dark:text-[#F1F5F9]"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground">
                    Alamat Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-[#121212] dark:text-cyan-400" />
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-9 text-xs bg-white dark:bg-[#05070A] dark:border-[#1C242D] dark:text-[#F1F5F9]"
                      required
                    />
                  </div>
                </div>
              </CardContent>

              <CardFooter className="flex items-center justify-between border-t-2 border-black dark:border-t dark:border-[#1C242D] pt-4">
                {savedNotice ? (
                  <span className="text-xs text-emerald-800 dark:text-emerald-400 font-bold flex items-center gap-1 font-mono">
                    <Check className="h-4 w-4" />
                    Perubahan berhasil disimpan!
                  </span>
                ) : (
                  <div />
                )}

                <Button type="submit" size="sm" className="gap-2 text-xs font-black shadow-[3px_3px_0px_#121212] dark:border dark:border-cyan-500/40 dark:bg-cyan-500/15 dark:text-cyan-300 dark:hover:bg-cyan-400 dark:hover:text-[#05070A] dark:shadow-none">
                  <Save className="h-3.5 w-3.5" />
                  Simpan Profil
                </Button>
              </CardFooter>
            </form>
          </Card>

          {/* Theme & Language Preferences */}
          <Card className="border-2 border-black bg-white shadow-[6px_6px_0px_#121212] dark:border dark:border-[#1C242D] dark:bg-[#090D12] dark:shadow-none">
            <CardHeader>
              <CardTitle className="text-base font-black">
                Tampilan & Bahasa
              </CardTitle>
              <CardDescription className="text-xs font-medium text-[#555555] dark:font-normal dark:text-[#8292A6]">
                Sesuaikan preferensi antarmuka untuk kenyamanan belajar Anda.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b-2 border-black dark:border-b dark:border-[#1C242D]">
                <div>
                  <span className="text-xs font-bold text-foreground block">
                    Mode Tema
                  </span>
                  <span className="text-[11px] font-medium text-[#555555] dark:font-normal dark:text-[#8292A6]">
                    Neo-Brutalism Light atau Obsidian Command Center
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant={theme === "dark" ? "default" : "outline"}
                    onClick={() => setTheme("dark")}
                    className={`text-xs h-8 gap-1.5 font-bold shadow-[2px_2px_0px_#121212] ${
                      theme === "dark"
                        ? "dark:border dark:border-cyan-500/40 dark:bg-cyan-500/15 dark:text-cyan-300 dark:shadow-[0_0_8px_rgba(34,211,238,0.2)]"
                        : "dark:border dark:border-[#1C242D] dark:bg-[#0F141A] dark:text-[#94A3B8] dark:shadow-none"
                    }`}
                  >
                    <Moon className="h-3.5 w-3.5" />
                    Dark
                  </Button>
                  <Button
                    size="sm"
                    variant={theme === "light" ? "default" : "outline"}
                    onClick={() => setTheme("light")}
                    className={`text-xs h-8 gap-1.5 font-bold shadow-[2px_2px_0px_#121212] ${
                      theme === "light"
                        ? "dark:border dark:border-cyan-500/40 dark:bg-cyan-500/15 dark:text-cyan-300"
                        : "dark:border dark:border-[#1C242D] dark:bg-[#0F141A] dark:text-[#94A3B8] dark:shadow-none"
                    }`}
                  >
                    <Sun className="h-3.5 w-3.5" />
                    Light
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between py-2">
                <div>
                  <span className="text-xs font-bold text-foreground block">
                    Bahasa Materi
                  </span>
                  <span className="text-[11px] font-medium text-[#555555] dark:font-normal dark:text-[#8292A6]">
                    Bahasa Indonesia atau English
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant={language === "id" ? "default" : "outline"}
                    onClick={() => setLanguage("id")}
                    className={`text-xs h-8 font-bold shadow-[2px_2px_0px_#121212] ${
                      language === "id"
                        ? "dark:border dark:border-cyan-500/40 dark:bg-cyan-500/15 dark:text-cyan-300 dark:shadow-[0_0_8px_rgba(34,211,238,0.2)]"
                        : "dark:border dark:border-[#1C242D] dark:bg-[#0F141A] dark:text-[#94A3B8] dark:shadow-none"
                    }`}
                  >
                    Indonesia (ID)
                  </Button>
                  <Button
                    size="sm"
                    variant={language === "en" ? "default" : "outline"}
                    onClick={() => setLanguage("en")}
                    className={`text-xs h-8 font-bold shadow-[2px_2px_0px_#121212] ${
                      language === "en"
                        ? "dark:border dark:border-cyan-500/40 dark:bg-cyan-500/15 dark:text-cyan-300 dark:shadow-[0_0_8px_rgba(34,211,238,0.2)]"
                        : "dark:border dark:border-[#1C242D] dark:bg-[#0F141A] dark:text-[#94A3B8] dark:shadow-none"
                    }`}
                  >
                    English (EN)
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone: Reset Progress */}
          <Card className="border-2 border-black bg-[#FF6B6B]/20 shadow-[6px_6px_0px_#121212] dark:border dark:border-red-500/30 dark:bg-red-500/5 dark:shadow-none">
            <CardHeader>
              <CardTitle className="text-base font-black text-rose-950 dark:text-red-400 flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 text-rose-900 dark:text-red-400" />
                Zona Berbahaya
              </CardTitle>
              <CardDescription className="text-xs font-medium text-neutral-800 dark:font-normal dark:text-[#8292A6]">
                Tindakan di bawah ini akan menghapus seluruh data progress belajar di browser ini.
              </CardDescription>
            </CardHeader>

            <CardFooter className="flex items-center justify-between pt-2">
              <span className="text-xs font-bold text-neutral-800 dark:font-normal dark:text-[#8292A6]">
                Total {Object.keys(completedLessons).length} materi terselesaikan
              </span>

              <Button
                variant="destructive"
                size="sm"
                onClick={handleClearData}
                className="gap-2 text-xs font-black shadow-[3px_3px_0px_#121212] dark:border dark:border-red-500/40 dark:bg-red-500/20 dark:text-red-300 dark:hover:bg-red-500/30 dark:shadow-none"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Reset Semua Progress
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
