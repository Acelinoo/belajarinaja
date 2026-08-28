import { create } from "zustand";
import { persist } from "zustand/middleware";

type ThemeMode = "dark" | "light" | "system";
type Language = "id" | "en";

interface ThemeLanguageState {
  theme: ThemeMode;
  language: Language;
  setTheme: (theme: ThemeMode) => void;
  setLanguage: (language: Language) => void;
}

export const useThemeLanguageStore = create<ThemeLanguageState>()(
  persist(
    (set) => ({
      theme: "dark",
      language: "id",

      setTheme: (theme) => {
        set({ theme });
        if (typeof document !== "undefined") {
          const root = document.documentElement;
          if (theme === "dark") {
            root.classList.add("dark");
            root.classList.remove("light");
            root.setAttribute("data-theme", "dark");
          } else if (theme === "light") {
            root.classList.add("light");
            root.classList.remove("dark");
            root.setAttribute("data-theme", "light");
          } else {
            const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
            root.classList.toggle("dark", systemDark);
            root.classList.toggle("light", !systemDark);
            root.setAttribute("data-theme", systemDark ? "dark" : "light");
          }
        }
      },

      setLanguage: (language) => set({ language }),
    }),
    {
      name: "belajarinaja_preferences",
    }
  )
);
