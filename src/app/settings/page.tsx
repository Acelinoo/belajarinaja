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
          <Card className="border-border">
            <form onSubmit={handleSaveProfile}>
              <CardHeader>
                <CardTitle className="text-base font-semibold">
                  Informasi Akun
                </CardTitle>
                <CardDescription className="text-xs">
                  Nama lengkap yang tertera pada sertifikat kelulusan.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">
                    Nama Lengkap
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="pl-9 text-xs"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">
                    Alamat Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-9 text-xs"
                      required
                    />
                  </div>
                </div>
              </CardContent>

              <CardFooter className="flex items-center justify-between border-t border-border pt-4">
                {savedNotice ? (
                  <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                    <Check className="h-4 w-4" />
                    Perubahan berhasil disimpan!
                  </span>
                ) : (
                  <div />
                )}

                <Button type="submit" size="sm" className="gap-2 text-xs">
                  <Save className="h-3.5 w-3.5" />
                  Simpan Profil
                </Button>
              </CardFooter>
            </form>
          </Card>

          {/* Theme & Language Preferences */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-base font-semibold">
                Tampilan & Bahasa
              </CardTitle>
              <CardDescription className="text-xs">
                Sesuaikan preferensi antarmuka untuk kenyamanan belajar Anda.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b border-border/60">
                <div>
                  <span className="text-xs font-medium text-foreground block">
                    Mode Tema
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    Obsidian Dark (Default) atau Light Mode
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant={theme === "dark" ? "default" : "outline"}
                    onClick={() => setTheme("dark")}
                    className="text-xs h-8 gap-1.5"
                  >
                    <Moon className="h-3.5 w-3.5" />
                    Dark
                  </Button>
                  <Button
                    size="sm"
                    variant={theme === "light" ? "default" : "outline"}
                    onClick={() => setTheme("light")}
                    className="text-xs h-8 gap-1.5"
                  >
                    <Sun className="h-3.5 w-3.5" />
                    Light
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between py-2">
                <div>
                  <span className="text-xs font-medium text-foreground block">
                    Bahasa Materi
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    Bahasa Indonesia atau English
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant={language === "id" ? "default" : "outline"}
                    onClick={() => setLanguage("id")}
                    className="text-xs h-8"
                  >
                    Indonesia (ID)
                  </Button>
                  <Button
                    size="sm"
                    variant={language === "en" ? "default" : "outline"}
                    onClick={() => setLanguage("en")}
                    className="text-xs h-8"
                  >
                    English (EN)
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone: Reset Progress */}
          <Card className="border-rose-500/30 bg-rose-500/5">
            <CardHeader>
              <CardTitle className="text-base font-semibold text-rose-400 flex items-center gap-2">
                <ShieldAlert className="h-4 w-4" />
                Zona Berbahaya
              </CardTitle>
              <CardDescription className="text-xs">
                Tindakan di bawah ini akan menghapus seluruh data progress belajar di browser ini.
              </CardDescription>
            </CardHeader>

            <CardFooter className="flex items-center justify-between pt-2">
              <span className="text-xs text-muted-foreground">
                Total {Object.keys(completedLessons).length} materi terselesaikan
              </span>

              <Button
                variant="destructive"
                size="sm"
                onClick={handleClearData}
                className="gap-2 text-xs"
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
