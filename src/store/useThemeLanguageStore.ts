import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ThemeMode = "light" | "dark" | "fun";
export type Language = "id" | "en";

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
          root.classList.remove("light", "dark", "fun");
          root.classList.add(theme);
          root.setAttribute("data-theme", theme);
        }
      },

      setLanguage: (language) => set({ language }),
    }),
    {
      name: "belajarinaja_preferences",
      onRehydrateStorage: () => (state) => {
        if (state && typeof document !== "undefined") {
          const root = document.documentElement;
          root.classList.remove("light", "dark", "fun");
          root.classList.add(state.theme);
          root.setAttribute("data-theme", state.theme);
        }
      },
    }
  )
);
