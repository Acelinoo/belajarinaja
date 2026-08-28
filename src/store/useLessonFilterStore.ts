import { create } from "zustand";

interface LessonFilterState {
  searchQuery: string;
  selectedLevel: "ALL" | "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  selectedCategory: string | null;
  setSearchQuery: (query: string) => void;
  setSelectedLevel: (level: "ALL" | "BEGINNER" | "INTERMEDIATE" | "ADVANCED") => void;
  setSelectedCategory: (category: string | null) => void;
  resetFilters: () => void;
}

export const useLessonFilterStore = create<LessonFilterState>((set) => ({
  searchQuery: "",
  selectedLevel: "ALL",
  selectedCategory: null,

  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedLevel: (level) => set({ selectedLevel: level }),
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  resetFilters: () =>
    set({
      searchQuery: "",
      selectedLevel: "ALL",
      selectedCategory: null,
    }),
}));
