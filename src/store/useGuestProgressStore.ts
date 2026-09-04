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
  loadUserProgress: (userKey: string) => void;
  isLessonPassed: (lessonId: string) => boolean;
  isLessonUnlocked: (lessonId: string) => boolean;
}

export const useGuestProgressStore = create<GuestProgressState>()(
  persist(
    (set, get) => ({
      completedLessons: {},
      currentLessonSlug: null,
      bookmarkedLessons: [],

      loadUserProgress: (userKey: string) => {
        if (typeof window === "undefined" || !userKey) return;
        
        // 1. Baca cache lokal terlebih dahulu untuk render instan
        let localCompleted: Record<string, GuestLessonProgress> = {};
        let localBookmarks: string[] = [];
        try {
          const raw = localStorage.getItem(`belajarinaja_user_progress_${userKey}`);
          if (raw) {
            const parsed = JSON.parse(raw);
            localCompleted = parsed.completedLessons || {};
            localBookmarks = Array.isArray(parsed.bookmarkedLessons) ? parsed.bookmarkedLessons : [];
            set((state) => ({
              completedLessons: { ...localCompleted },
              bookmarkedLessons: localBookmarks.length > 0 ? localBookmarks : state.bookmarkedLessons,
              currentLessonSlug: parsed.currentLessonSlug ?? state.currentLessonSlug,
            }));
          }
        } catch (e) {
          console.error("Error loading user progress from localStorage:", e);
        }

        // 2. Sinkronkan dengan Cloud Database jika ada email pengguna
        if (userKey.includes("@")) {
          fetch(`/api/v1/progress?email=${encodeURIComponent(userKey)}&_t=${Date.now()}`, {
            cache: "no-store",
            headers: { "Cache-Control": "no-cache" },
          })
            .then((res) => res.json())
            .then((data) => {
              if (data.success && data.completedLessons) {
                set((state) => {
                  // Merge: gabungkan materi lokal dan cloud
                  const mergedLessons: Record<string, GuestLessonProgress> = {
                    ...state.completedLessons,
                  };

                  // Tambahkan data dari cloud
                  for (const [id, cloudItem] of Object.entries(data.completedLessons as Record<string, GuestLessonProgress>)) {
                    const localItem = mergedLessons[id];
                    mergedLessons[id] = {
                      ...localItem,
                      ...cloudItem,
                      completed: cloudItem.completed || localItem?.completed || false,
                      passed: cloudItem.passed || localItem?.passed || false,
                      score: Math.max(cloudItem.score ?? 0, localItem?.score ?? 0),
                      quizScore: Math.max(cloudItem.quizScore ?? 0, localItem?.quizScore ?? 0),
                    };
                  }

                  const mergedBookmarks = Array.from(
                    new Set([...state.bookmarkedLessons, ...(data.bookmarkedLessons || [])])
                  );

                  // Update localStorage dengan data terbaru yang sudah digabung
                  try {
                    localStorage.setItem(
                      `belajarinaja_user_progress_${userKey}`,
                      JSON.stringify({
                        completedLessons: mergedLessons,
                        bookmarkedLessons: mergedBookmarks,
                        currentLessonSlug: state.currentLessonSlug,
                      })
                    );
                  } catch (e) {}

                  // Periksa apakah ada materi lokal yang belum tersimpan di cloud (misal dikerjakan offline atau sebelum db aktif)
                  const cloudLessonIds = Object.keys(data.completedLessons);
                  const unuploadedLocalLessons = Object.values(mergedLessons).filter(
                    (item) => item.completed && !cloudLessonIds.includes(item.lessonId)
                  );

                  if (unuploadedLocalLessons.length > 0) {
                    fetch("/api/v1/progress/sync", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        email: userKey,
                        guestProgress: unuploadedLocalLessons,
                        bookmarkedLessons: mergedBookmarks,
                      }),
                    }).catch((syncErr) => console.warn("[ProgressSync] Auto-upload error:", syncErr));
                  }

                  return {
                    completedLessons: mergedLessons,
                    bookmarkedLessons: mergedBookmarks,
                  };
                });
              }
            })
            .catch((err) => console.warn("[ProgressStore] Cloud sync fetch warning:", err));
        }
      },

      saveQuizResult: ({
        lessonId,
        lessonSlug,
        score,
        correctAnswers,
        totalQuestions,
        passed,
      }) => {
        // Tamu tanpa akun tidak bisa menyimpan progres materi
        const { isAuthenticated, user } = useUserAuthStore.getState();
        if (!isAuthenticated) {
          useModalStore.getState().openLoginModal();
          return;
        }

        set((state) => {
          const prev = state.completedLessons[lessonId];
          const prevAttempts = prev?.attempts ?? 0;
          const isNowPassed = passed || prev?.passed === true;

          const updatedLessons = {
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
          };

          // Simpan permanen ke storage profil user yang sedang login
          if (user) {
            const userKey = user.email || user.id;
            if (typeof window !== "undefined" && userKey) {
              localStorage.setItem(
                `belajarinaja_user_progress_${userKey}`,
                JSON.stringify({
                  completedLessons: updatedLessons,
                  bookmarkedLessons: state.bookmarkedLessons,
                  currentLessonSlug: state.currentLessonSlug,
                })
              );
            }

            // Simpan langsung ke Cloud Database PostgreSQL
            if (user.email && isNowPassed) {
              fetch("/api/v1/progress", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  email: user.email,
                  lessonId,
                  lessonSlug,
                  score,
                  quizScore: score,
                  correctAnswers,
                  totalQuestions,
                  passed: isNowPassed,
                  completedAt: new Date().toISOString(),
                }),
              }).catch((err) =>
                console.warn("[ProgressStore] Cloud DB persist error:", err)
              );
            }
          }

          return {
            completedLessons: updatedLessons,
          };
        });
      },

      saveCodeAttempt: (lessonId, code) =>
        set((state) => {
          const updatedLessons = {
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
          };

          const { user } = useUserAuthStore.getState();
          if (user) {
            const userKey = user.email || user.id;
            if (typeof window !== "undefined" && userKey) {
              localStorage.setItem(
                `belajarinaja_user_progress_${userKey}`,
                JSON.stringify({
                  completedLessons: updatedLessons,
                  bookmarkedLessons: state.bookmarkedLessons,
                  currentLessonSlug: state.currentLessonSlug,
                })
              );
            }
          }

          return { completedLessons: updatedLessons };
        }),

      toggleBookmark: (lessonId) => {
        const { isAuthenticated, user } = useUserAuthStore.getState();
        if (!isAuthenticated) {
          useModalStore.getState().openLoginModal();
          return;
        }
        set((state) => {
          const updatedBookmarks = state.bookmarkedLessons.includes(lessonId)
            ? state.bookmarkedLessons.filter((id) => id !== lessonId)
            : [...state.bookmarkedLessons, lessonId];

          if (user) {
            const userKey = user.email || user.id;
            if (typeof window !== "undefined" && userKey) {
              localStorage.setItem(
                `belajarinaja_user_progress_${userKey}`,
                JSON.stringify({
                  completedLessons: state.completedLessons,
                  bookmarkedLessons: updatedBookmarks,
                  currentLessonSlug: state.currentLessonSlug,
                })
              );
            }
          }

          return { bookmarkedLessons: updatedBookmarks };
        });
      },

      setCurrentLesson: (slug) =>
        set((state) => {
          const { user } = useUserAuthStore.getState();
          if (user) {
            const userKey = user.email || user.id;
            if (typeof window !== "undefined" && userKey) {
              localStorage.setItem(
                `belajarinaja_user_progress_${userKey}`,
                JSON.stringify({
                  completedLessons: state.completedLessons,
                  bookmarkedLessons: state.bookmarkedLessons,
                  currentLessonSlug: slug,
                })
              );
            }
          }
          return { currentLessonSlug: slug };
        }),

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
      onRehydrateStorage: () => (state) => {
        if (typeof window !== "undefined" && state) {
          try {
            const rawAuth = localStorage.getItem("belajarinaja_auth_session");
            if (rawAuth) {
              const auth = JSON.parse(rawAuth);
              const userKey = auth.state?.user?.email || auth.state?.user?.id;
              if (userKey) {
                state.loadUserProgress(userKey);
              }
            }
          } catch (e) {}
        }
      },
    }
  )
);

export const useCurriculumProgressStore = useGuestProgressStore;
