"use client";

import { Moon, Sun, Sparkles, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useThemeLanguageStore, ThemeMode } from "@/store/useThemeLanguageStore";

export function ThemeLanguageSwitcher() {
  const { theme, setTheme, language, setLanguage } = useThemeLanguageStore();

  const cycleTheme = () => {
    if (theme === "light") setTheme("dark");
    else if (theme === "dark") setTheme("fun");
    else setTheme("light");
  };

  const toggleLanguage = () => {
    setLanguage(language === "id" ? "en" : "id");
  };

  return (
    <div className="flex items-center gap-1.5">
      {/* Language Switcher Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleLanguage}
        className="h-8 px-2.5 text-xs font-mono font-bold gap-1 border-2 border-black bg-white text-[#121212] shadow-[2px_2px_0px_#121212] hover:bg-[#FFD84D] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none dark:border dark:border-[#1C242D] dark:bg-[#0F141A] dark:text-[#94A3B8] dark:hover:text-cyan-300 dark:hover:border-cyan-500/40 dark:shadow-none fun:border-2 fun:border-[#E2E8F0] fun:bg-white fun:text-[#243447] fun:rounded-full fun:shadow-[0_2px_8px_rgba(0,0,0,0.04)] fun:hover:bg-[#FFF8E7]"
        title={language === "id" ? "Ganti ke English (EN)" : "Switch to Bahasa Indonesia (ID)"}
        aria-label="Switch Language"
      >
        <Globe className="h-3.5 w-3.5" />
        <span>{language.toUpperCase()}</span>
      </Button>

      {/* 3-Mode Theme Selector Buttons */}
      <div className="flex items-center rounded-lg p-0.5 border-2 border-black bg-white shadow-[2px_2px_0px_#121212] dark:border dark:border-[#1C242D] dark:bg-[#090D12] dark:shadow-none fun:border-2 fun:border-[#E2E8F0] fun:bg-white fun:rounded-full fun:shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
        <button
          type="button"
          onClick={() => setTheme("light")}
          className={`h-7 w-7 rounded flex items-center justify-center transition-all ${
            theme === "light"
              ? "bg-[#FFD84D] text-[#121212] font-black border border-black dark:border-0"
              : "text-[#555555] hover:text-black dark:text-[#64748B]"
          } fun:rounded-full`}
          title="Mode 1: Light (Modern Neo-Brutalism)"
          aria-label="Select Light Mode"
        >
          <Sun className="h-3.5 w-3.5" />
        </button>

        <button
          type="button"
          onClick={() => setTheme("dark")}
          className={`h-7 w-7 rounded flex items-center justify-center transition-all ${
            theme === "dark"
              ? "bg-[#0F141A] text-cyan-300 border border-cyan-500/40 shadow-[0_0_8px_rgba(34,211,238,0.25)]"
              : "text-[#555555] hover:text-black dark:text-[#64748B] dark:hover:text-cyan-300"
          } fun:rounded-full`}
          title="Mode 2: Dark (Obsidian Command Center)"
          aria-label="Select Dark Mode"
        >
          <Moon className="h-3.5 w-3.5" />
        </button>

        <button
          type="button"
          onClick={() => setTheme("fun")}
          className={`h-7 w-7 rounded flex items-center justify-center transition-all ${
            theme === "fun"
              ? "bg-[#5CC8FF] text-[#243447] font-black shadow-[0_2px_6px_rgba(92,200,255,0.4)]"
              : "text-[#555555] hover:text-black dark:text-[#64748B] dark:hover:text-cyan-300"
          } fun:rounded-full`}
          title="Mode 3: Fun (Playful Learning World)"
          aria-label="Select Fun Mode"
        >
          <Sparkles className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

