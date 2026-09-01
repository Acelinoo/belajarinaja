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
  ShieldAlert,
  Settings,
  Sparkles,
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
import { BotCompanionCharacter } from "@/components/fun/characters/BotCompanionCharacter";

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

  // 1. FUN MODE: Explorer Headquarters Preferences
  if (theme === "fun") {
    return (
      <div className="min-h-screen bg-[#FFF8E7] text-[#243447] flex flex-col">
        <Navbar />
        <SearchCommandModal />

        <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl space-y-8">
            <div className="p-8 rounded-[36px] border-4 border-[#FED7AA] bg-white shadow-[0_15px_40px_rgba(255,155,84,0.1)] flex items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <BotCompanionCharacter className="w-20 h-20 shrink-0" />
                <div className="space-y-1">
                  <span className="text-[10px] font-black text-[#D97706] bg-[#FFF8E7] px-3 py-1 rounded-full border border-[#FED7AA] uppercase">
                    ⚙️ {t.settings.title}
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-black text-[#243447]">
                    {t.settings.title}
                  </h1>
                  <p className="text-xs text-[#64748B] font-medium">
                    {t.settings.subtitle}
                  </p>
                </div>
              </div>
            </div>

            {/* Profile Card */}
            <div className="p-8 rounded-[32px] border-2 border-[#FED7AA] bg-white shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-6">
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <h3 className="text-base font-black text-[#243447]">{t.settings.accountInfo}</h3>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#243447]">{t.settings.fullName}</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#5CC8FF]" />
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 text-xs font-bold rounded-full border-2 border-[#FED7AA] bg-white text-[#243447] focus:outline-none focus:border-[#5CC8FF]"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#243447]">{t.settings.email}</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#FF9F43]" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 text-xs font-bold rounded-full border-2 border-[#FED7AA] bg-white text-[#243447] focus:outline-none focus:border-[#5CC8FF]"
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="rounded-full bg-[#FFD84D] hover:bg-[#FFC933] text-[#243447] font-black text-xs px-8 shadow-[0_3px_10px_rgba(255,216,77,0.4)]"
                >
                  {savedNotice ? (
                    <span className="flex items-center gap-1.5 text-[#16A34A]">
                      <Check className="h-4 w-4" />
                      {t.settings.profileSaved}
                    </span>
                  ) : (
                    <span>{t.settings.saveChanges}</span>
                  )}
                </Button>
              </form>
            </div>

            {/* Theme & Language Selectors */}
            <div className="p-8 rounded-[32px] border-2 border-[#FED7AA] bg-white shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-6">
              <h3 className="text-base font-black text-[#243447]">{t.settings.appearanceAndLang}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#64748B] uppercase">{t.settings.theme}</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "light", label: "Light", icon: "☀️" },
                      { id: "dark", label: "Dark", icon: "🌙" },
                      { id: "fun", label: "Fun", icon: "🚀" },
                    ].map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setTheme(m.id as any)}
                        className={`p-3 rounded-2xl border-2 text-xs font-black transition-all ${
                          theme === m.id
                            ? "border-[#FED7AA] bg-[#FFD84D] text-[#243447] shadow-sm scale-105"
                            : "border-[#E2E8F0] bg-white text-[#64748B]"
                        }`}
                      >
                        <div>{m.icon}</div>
                        <div className="mt-1">{m.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#64748B] uppercase">{t.settings.language}</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: "id", label: "Bahasa ID", flag: "🇮🇩" },
                      { id: "en", label: "English", flag: "🇬🇧" },
                    ].map((l) => (
                      <button
                        key={l.id}
                        type="button"
                        onClick={() => setLanguage(l.id as any)}
                        className={`p-3 rounded-2xl border-2 text-xs font-black transition-all ${
                          language === l.id
                            ? "border-[#FED7AA] bg-[#5CC8FF] text-[#243447] shadow-sm scale-105"
                            : "border-[#E2E8F0] bg-white text-[#64748B]"
                        }`}
                      >
                        <div>{l.flag}</div>
                        <div className="mt-1">{l.label}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="p-6 rounded-[32px] border-2 border-[#FECDD3] bg-[#FFF1F2] space-y-3">
              <div className="flex items-center gap-2 text-xs font-black text-[#BE123C]">
                <ShieldAlert className="h-4 w-4" />
                <span>{t.settings.dangerZone}</span>
              </div>
              <p className="text-xs text-[#9F1239]">
                {t.settings.dangerDesc}
              </p>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleClearData}
                className="rounded-full text-xs font-black bg-[#FF6B6B] hover:bg-[#EE5A5A] text-white"
              >
                <Trash2 className="h-3.5 w-3.5 mr-1" />
                <span>{t.settings.resetAllProgress}</span>
              </Button>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  // 2. DARK MODE: Monochrome System Configuration Console (100% Monochrome)
  if (theme === "dark") {
    return (
      <div className="min-h-screen bg-[#050505] text-[#FFFFFF] font-mono flex flex-col">
        <Navbar />
        <SearchCommandModal />

        <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl space-y-6">
            <div className="p-6 rounded border border-[#222222] bg-[#0A0A0A] space-y-1">
              <div className="text-xs text-[#888888]">SYSTEM_CONFIG // PREFERENCES_CONSOLE</div>
              <h1 className="text-xl sm:text-2xl font-black text-[#FFFFFF]">
                ENVIRONMENT_SETTINGS
              </h1>
            </div>

            {/* Profile Config */}
            <div className="p-6 rounded border border-[#222222] bg-[#0A0A0A] space-y-4">
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <span className="text-xs text-[#888888] font-bold uppercase tracking-wider block">
                  IDENTITY_NODE
                </span>

                <div className="space-y-1">
                  <label className="text-xs text-[#CCCCCC]">USER_ALIAS</label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-[#050505] border border-[#222222] text-[#FFFFFF] rounded focus:outline-none focus:border-[#FFFFFF]"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-[#CCCCCC]">COMM_EMAIL</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-[#050505] border border-[#222222] text-[#FFFFFF] rounded focus:outline-none focus:border-[#FFFFFF]"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  size="sm"
                  className="h-8 text-xs font-mono bg-[#FFFFFF] hover:bg-[#E5E5E5] text-[#000000] font-black"
                >
                  {savedNotice ? "PROFILE_UPDATED" : "COMMIT_CHANGES"}
                </Button>
              </form>
            </div>

            {/* Theme & Language Matrix */}
            <div className="p-6 rounded border border-[#222222] bg-[#0A0A0A] space-y-4">
              <span className="text-xs text-[#888888] font-bold uppercase tracking-wider block">
                SYSTEM_LOCALIZATION
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] text-[#666666] uppercase">THEME_MODE</label>
                  <div className="grid grid-cols-3 gap-2">
                    {["light", "dark", "fun"].map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setTheme(m as any)}
                        className={`p-2 text-xs uppercase rounded border font-mono ${
                          theme === m
                            ? "border-[#FFFFFF] bg-[#FFFFFF] text-[#000000] font-bold"
                            : "border-[#222222] bg-[#050505] text-[#888888]"
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] text-[#666666] uppercase">LANGUAGE_CODE</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: "id", label: "ID / INDO" },
                      { id: "en", label: "EN / INTL" },
                    ].map((l) => (
                      <button
                        key={l.id}
                        type="button"
                        onClick={() => setLanguage(l.id as any)}
                        className={`p-2 text-xs uppercase rounded border font-mono ${
                          language === l.id
                            ? "border-[#FFFFFF] bg-[#FFFFFF] text-[#000000] font-bold"
                            : "border-[#222222] bg-[#050505] text-[#888888]"
                        }`}
                      >
                        {l.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Storage Wipe */}
            <div className="p-5 rounded border border-[#333333] bg-[#0A0A0A] space-y-2">
              <span className="text-xs font-bold text-[#FFFFFF] block">[DANGER_ZONE] PURGE_LOCAL_DATA</span>
              <p className="text-xs text-[#888888]">
                Wipe all cached quiz scores, bookmarks, and guest session states.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearData}
                className="h-8 text-xs font-mono border-[#444444] bg-[#111111] text-[#FFFFFF] hover:bg-[#222222]"
              >
                PURGE_ALL_DATA
              </Button>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  // 3. LIGHT MODE: Modern Neo-Brutalist Form Card
  return (
    <div className="min-h-screen bg-[#F7F4EA] text-[#121212] flex flex-col">
      <Navbar />
      <SearchCommandModal />

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl space-y-8">
          <div className="p-8 rounded-2xl border-2 border-black bg-white shadow-[6px_6px_0px_#121212] space-y-1">
            <h1 className="text-2xl sm:text-3xl font-black text-[#121212]">
              {t.settings.title}
            </h1>
            <p className="text-xs text-[#555555] font-medium">
              {t.settings.subtitle}
            </p>
          </div>

          {/* Profile Form */}
          <div className="p-8 rounded-2xl border-2 border-black bg-white shadow-[6px_6px_0px_#121212] space-y-6">
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <h3 className="text-base font-black text-[#121212]">{t.settings.accountInfo}</h3>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#121212]">{t.settings.fullName}</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#121212]" />
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 text-xs font-bold rounded-lg border-2 border-black bg-white text-[#121212] shadow-[2px_2px_0px_#121212] focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#121212]">{t.settings.email}</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#121212]" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 text-xs font-bold rounded-lg border-2 border-black bg-white text-[#121212] shadow-[2px_2px_0px_#121212] focus:outline-none"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="rounded-lg border-2 border-black bg-[#FFD84D] hover:bg-[#F5CB32] text-[#121212] font-black text-xs shadow-[3px_3px_0px_#121212] px-6"
              >
                {savedNotice ? t.settings.profileSaved : t.settings.saveChanges}
              </Button>
            </form>
          </div>

          {/* Theme & Language */}
          <div className="p-8 rounded-2xl border-2 border-black bg-white shadow-[6px_6px_0px_#121212] space-y-6">
            <h3 className="text-base font-black text-[#121212]">{t.settings.appearanceAndLang}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#555555] uppercase">{t.settings.theme}</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "light", label: "Light" },
                    { id: "dark", label: "Dark" },
                    { id: "fun", label: "Fun" },
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setTheme(m.id as any)}
                      className={`p-2.5 rounded-lg border-2 border-black text-xs font-black transition-all ${
                        theme === m.id
                          ? "bg-[#FFD84D] shadow-[2px_2px_0px_#121212]"
                          : "bg-white text-[#555555]"
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-[#555555] uppercase">{t.settings.language}</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: "id", label: "Bahasa ID" },
                    { id: "en", label: "English" },
                  ].map((l) => (
                    <button
                      key={l.id}
                      type="button"
                      onClick={() => setLanguage(l.id as any)}
                      className={`p-2.5 rounded-lg border-2 border-black text-xs font-black transition-all ${
                        language === l.id
                          ? "bg-[#70B7FF] shadow-[2px_2px_0px_#121212]"
                          : "bg-white text-[#555555]"
                      }`}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="p-6 rounded-2xl border-2 border-black bg-[#FF6B6B]/20 shadow-[4px_4px_0px_#121212] space-y-3">
            <div className="flex items-center gap-2 text-xs font-black text-[#121212]">
              <ShieldAlert className="h-4 w-4" />
              <span>{t.settings.dangerZone}</span>
            </div>
            <p className="text-xs text-[#121212] font-medium">
              {t.settings.dangerDesc}
            </p>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleClearData}
              className="rounded-lg border-2 border-black bg-[#FF6B6B] hover:bg-[#EE5A5A] text-[#121212] font-black text-xs shadow-[2px_2px_0px_#121212]"
            >
              <Trash2 className="h-3.5 w-3.5 mr-1" />
              <span>{t.settings.resetAllProgress}</span>
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
