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

const getStoredTheme = (): ThemeMode => {
  if (typeof window === "undefined") return "dark";
  try {
    const raw = localStorage.getItem("belajarinaja_preferences");
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed?.state?.theme) return parsed.state.theme;
    }
  } catch {}
  return "dark";
};

const getStoredLanguage = (): Language => {
  if (typeof window === "undefined") return "id";
  try {
    const raw = localStorage.getItem("belajarinaja_preferences");
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed?.state?.language) return parsed.state.language;
    }
  } catch {}
  return "id";
};

const applyThemeToDocument = (theme: ThemeMode) => {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.classList.remove("light", "dark", "fun");
  root.classList.add(theme);
  root.setAttribute("data-theme", theme);
};

export const useThemeLanguageStore = create<ThemeLanguageState>()(
  persist(
    (set) => ({
      theme: getStoredTheme(),
      language: getStoredLanguage(),

      setTheme: (theme) => {
        set({ theme });
        applyThemeToDocument(theme);
      },

      setLanguage: (language) => set({ language }),
    }),
    {
      name: "belajarinaja_preferences",
      onRehydrateStorage: () => (state) => {
        if (state?.theme) {
          applyThemeToDocument(state.theme);
        }
      },
    }
  )
);
