import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CURRICULUM_STAGES } from "@/data/curriculum";
import { useUserAuthStore } from "./useUserAuthStore";
import { useModalStore } from "./useModalStore";

export interface GuestLessonProgress {
  lessonId: string;
  lessonSlug?: string;
  completed: boolean;
  quizStarted?: boolean;
  quizCompleted?: boolean;
  score?: number;
  correctAnswers?: number;
  totalQuestions?: number;
  passed?: boolean;
  attempts?: number;
  completedAt?: string;
  quizScore?: number;
  lastCodeAttempt?: string;
}

interface SaveQuizResultPayload {
  lessonId: string;
  lessonSlug?: string;
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  passed: boolean;
}

interface GuestProgressState {
  completedLessons: Record<string, GuestLessonProgress>;
  currentLessonSlug: string | null;
  bookmarkedLessons: string[];
  saveQuizResult: (payload: SaveQuizResultPayload) => void;
  saveCodeAttempt: (lessonId: string, code: string) => void;
  toggleBookmark: (lessonId: string) => void;
  setCurrentLesson: (slug: string) => void;
  clearGuestProgress: () => void;
  isLessonPassed: (lessonId: string) => boolean;
  isLessonUnlocked: (lessonId: string) => boolean;
}

export const useGuestProgressStore = create<GuestProgressState>()(
  persist(
    (set, get) => ({
      completedLessons: {},
      currentLessonSlug: null,
      bookmarkedLessons: [],

      saveQuizResult: ({
        lessonId,
        lessonSlug,
        score,
        correctAnswers,
        totalQuestions,
        passed,
      }) => {
        // Tamu tanpa akun tidak bisa menyimpan progres materi
        const { isAuthenticated } = useUserAuthStore.getState();
        if (!isAuthenticated) {
          useModalStore.getState().openLoginModal();
          return;
        }

        set((state) => {
          const prev = state.completedLessons[lessonId];
          const prevAttempts = prev?.attempts ?? 0;
          const isNowPassed = passed || prev?.passed === true;

          return {
            completedLessons: {
              ...state.completedLessons,
              [lessonId]: {
                ...prev,
                lessonId,
                lessonSlug: lessonSlug ?? prev?.lessonSlug,
                quizStarted: true,
                quizCompleted: true,
                score: Math.max(score, prev?.score ?? 0),
                quizScore: Math.max(score, prev?.quizScore ?? 0),
                correctAnswers,
                totalQuestions,
                passed: isNowPassed,
                completed: isNowPassed,
                attempts: prevAttempts + 1,
                completedAt: isNowPassed
                  ? prev?.completedAt || new Date().toISOString()
                  : prev?.completedAt,
              },
            },
          };
        });
      },

      saveCodeAttempt: (lessonId, code) =>
        set((state) => ({
          completedLessons: {
            ...state.completedLessons,
            [lessonId]: {
              ...(state.completedLessons[lessonId] || {
                lessonId,
                completed: false,
                passed: false,
                quizCompleted: false,
                score: 0,
                attempts: 0,
              }),
              lastCodeAttempt: code,
            },
          },
        })),

      toggleBookmark: (lessonId) => {
        const { isAuthenticated } = useUserAuthStore.getState();
        if (!isAuthenticated) {
          useModalStore.getState().openLoginModal();
          return;
        }
        set((state) => ({
          bookmarkedLessons: state.bookmarkedLessons.includes(lessonId)
            ? state.bookmarkedLessons.filter((id) => id !== lessonId)
            : [...state.bookmarkedLessons, lessonId],
        }));
      },

      setCurrentLesson: (slug) => set({ currentLessonSlug: slug }),

      clearGuestProgress: () =>
        set({
          completedLessons: {},
          currentLessonSlug: null,
          bookmarkedLessons: [],
        }),

      isLessonPassed: (lessonId) => {
        const { isAuthenticated } = useUserAuthStore.getState();
        if (!isAuthenticated) return false;
        const item = get().completedLessons[lessonId];
        return !!(item && item.completed && item.passed !== false);
      },

      isLessonUnlocked: (lessonId) => {
        // Flatten lessons
        const allLessons = CURRICULUM_STAGES.flatMap((s) => s.lessons);
        const index = allLessons.findIndex((l) => l.id === lessonId);
        if (index <= 0) return true; // Stage 1 / Lesson 1 is always unlocked

        // Jika tidak login, tidak bisa lanjut materi (semua materi lanjutan terkunci)
        const { isAuthenticated } = useUserAuthStore.getState();
        if (!isAuthenticated) {
          return false;
        }

        const lesson = allLessons[index];
        if (!lesson || !lesson.prerequisites || lesson.prerequisites.length === 0) {
          // If no specific prereqs, check previous lesson
          const prevLesson = allLessons[index - 1];
          return !prevLesson || !!get().completedLessons[prevLesson.id]?.completed;
        }

        return lesson.prerequisites.every((prereqSlug) => {
          const prereqLesson = allLessons.find((l) => l.slug === prereqSlug);
          return !prereqLesson || !!get().completedLessons[prereqLesson.id]?.completed;
        });
      },
    }),
    {
      name: "belajarinaja_guest_progress",
    }
  )
);

export const useCurriculumProgressStore = useGuestProgressStore;
