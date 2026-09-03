"use client";

import React from "react";
import { Moon, Sun, Palette, Globe } from "lucide-react";
import { useThemeLanguageStore } from "@/store/useThemeLanguageStore";

export function ThemeLanguageSwitcher() {
  const { theme, setTheme, language, setLanguage } = useThemeLanguageStore();

  const toggleLanguage = () => {
    setLanguage(language === "id" ? "en" : "id");
  };

  const cycleTheme = () => {
    if (theme === "light") setTheme("dark");
    else if (theme === "dark") setTheme("fun");
    else setTheme("light");
  };

  return (
    <div className="flex items-center gap-1.5 font-sans">
      {/* Language Switcher Button */}
      <button
        type="button"
        onClick={toggleLanguage}
        className="h-8 px-2 sm:px-2.5 rounded-md text-xs font-bold flex items-center gap-1 bg-secondary text-foreground hover:bg-secondary/80 border border-border transition-colors cursor-pointer"
        title={language === "id" ? "Ganti ke English (EN)" : "Switch to Bahasa Indonesia (ID)"}
        aria-label="Switch Language"
      >
        <Globe className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="font-mono text-[11px]">{language.toUpperCase()}</span>
      </button>

      {/* Mobile Single Theme Cycle Button (< 640px) */}
      <button
        type="button"
        onClick={cycleTheme}
        className="sm:hidden h-8 w-8 rounded-md flex items-center justify-center bg-secondary text-foreground hover:bg-secondary/80 border border-border transition-colors cursor-pointer"
        title="Ganti Tema (Terang / Gelap / Ceria)"
        aria-label="Ganti Tema Suasana"
      >
        {theme === "light" && <Sun className="h-3.5 w-3.5 text-amber-500" />}
        {theme === "dark" && <Moon className="h-3.5 w-3.5 text-sky-400" />}
        {theme === "fun" && <Palette className="h-3.5 w-3.5 text-purple-400" />}
      </button>

      {/* Desktop 3-Atmosphere Segmented Selector (>= 640px) */}
      <div className="hidden sm:flex items-center p-0.5 rounded-md bg-secondary border border-border">
        <button
          type="button"
          onClick={() => setTheme("light")}
          className={`h-7 w-7 rounded flex items-center justify-center transition-all cursor-pointer ${
            theme === "light"
              ? "bg-card text-foreground font-bold shadow-xs border border-border"
              : "text-muted-foreground hover:text-foreground"
          }`}
          title="Mode 1: Terang (Clean & Editorial)"
          aria-label="Mode Terang"
        >
          <Sun className="h-3.5 w-3.5" />
        </button>

        <button
          type="button"
          onClick={() => setTheme("dark")}
          className={`h-7 w-7 rounded flex items-center justify-center transition-all cursor-pointer ${
            theme === "dark"
              ? "bg-card text-foreground font-bold shadow-xs border border-border"
              : "text-muted-foreground hover:text-foreground"
          }`}
          title="Mode 2: Gelap (Tenang & Fokus)"
          aria-label="Mode Gelap"
        >
          <Moon className="h-3.5 w-3.5" />
        </button>

        <button
          type="button"
          onClick={() => setTheme("fun")}
          className={`h-7 w-7 rounded flex items-center justify-center transition-all cursor-pointer ${
            theme === "fun"
              ? "bg-card text-foreground font-bold shadow-xs border border-border"
              : "text-muted-foreground hover:text-foreground"
          }`}
          title="Mode 3: Ceria (Hangat & Interaktif)"
          aria-label="Mode Ceria"
        >
          <Palette className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}