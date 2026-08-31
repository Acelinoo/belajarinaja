"use client";

import { Moon, Sun, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useThemeLanguageStore } from "@/store/useThemeLanguageStore";

export function ThemeLanguageSwitcher() {
  const { theme, setTheme, language, setLanguage } = useThemeLanguageStore();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const toggleLanguage = () => {
    setLanguage(language === "id" ? "en" : "id");
  };

  return (
    <div className="flex items-center gap-1.5">
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleLanguage}
        className="h-8 px-2.5 text-xs font-mono font-bold gap-1 border-2 border-black bg-white text-[#121212] shadow-[2px_2px_0px_#121212] hover:bg-[#FFD84D] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none dark:border-transparent dark:bg-transparent dark:text-muted-foreground dark:hover:text-foreground dark:shadow-none dark:hover:bg-accent"
        title="Ganti Bahasa (ID / EN)"
      >
        <Globe className="h-3.5 w-3.5" />
        <span>{language.toUpperCase()}</span>
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={toggleTheme}
        className="h-8 w-8 p-0 border-2 border-black bg-[#FFD84D] text-[#121212] shadow-[2px_2px_0px_#121212] hover:bg-[#F5CB32] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none dark:border-transparent dark:bg-transparent dark:text-muted-foreground dark:hover:text-foreground dark:shadow-none dark:hover:bg-accent"
        title={theme === "dark" ? "Beralih ke Light Mode (Neo-Brutalism)" : "Beralih ke Dark Mode (Obsidian)"}
      >
        {theme === "dark" ? (
          <Sun className="h-4 w-4" />
        ) : (
          <Moon className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
}
