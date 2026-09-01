"use client";

import { Moon, Sun, Palette, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useThemeLanguageStore, ThemeMode } from "@/store/useThemeLanguageStore";

export function ThemeLanguageSwitcher() {
  const { theme, setTheme, language, setLanguage } = useThemeLanguageStore();

  const toggleLanguage = () => {
    setLanguage(language === "id" ? "en" : "id");
  };

  return (
    <div className="flex items-center gap-1.5 font-mono">
      {/* Language Switcher Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleLanguage}
        className="h-8 px-2.5 text-xs font-bold gap-1 border-2 border-black bg-white text-[#121212] shadow-[2px_2px_0px_#121212] hover:bg-[#FFD84D] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none dark:border-[#222222] dark:bg-[#0A0A0A] dark:text-[#CCCCCC] dark:hover:text-[#FFFFFF] dark:hover:border-[#444444] dark:shadow-none fun:border-2 fun:border-[#FED7AA] fun:bg-white fun:text-[#243447] fun:rounded-full fun:shadow-sm fun:hover:bg-[#FFF8E7]"
        title={language === "id" ? "Ganti ke English (EN)" : "Switch to Bahasa Indonesia (ID)"}
        aria-label="Switch Language"
      >
        <Globe className="h-3.5 w-3.5" />
        <span>{language.toUpperCase()}</span>
      </Button>

      {/* 3-Mode Theme Selector Buttons */}
      <div className="flex items-center rounded-lg p-0.5 border-2 border-black bg-white shadow-[2px_2px_0px_#121212] dark:border-[#222222] dark:bg-[#0A0A0A] dark:shadow-none fun:border-2 fun:border-[#FED7AA] fun:bg-white fun:rounded-full fun:shadow-sm">
        <button
          type="button"
          onClick={() => setTheme("light")}
          className={`h-7 w-7 rounded flex items-center justify-center transition-all ${
            theme === "light"
              ? "bg-[#FFD84D] text-[#121212] font-black border border-black shadow-[1px_1px_0px_#121212]"
              : "text-[#555555] hover:text-black dark:text-[#666666]"
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
              ? "bg-[#FFFFFF] text-[#000000] font-black shadow-sm"
              : "text-[#555555] hover:text-black dark:text-[#666666] dark:hover:text-[#FFFFFF]"
          } fun:rounded-full`}
          title="Mode 2: Dark (Monochrome Obsidian Command Center)"
          aria-label="Select Dark Mode"
        >
          <Moon className="h-3.5 w-3.5" />
        </button>

        <button
          type="button"
          onClick={() => setTheme("fun")}
          className={`h-7 w-7 rounded flex items-center justify-center transition-all ${
            theme === "fun"
              ? "bg-[#FFD84D] text-[#243447] font-black shadow-sm"
              : "text-[#555555] hover:text-black dark:text-[#666666] dark:hover:text-[#FFFFFF]"
          } fun:rounded-full`}
          title="Mode 3: Fun (Playful Learning World)"
          aria-label="Select Fun Mode"
        >
          <Palette className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
