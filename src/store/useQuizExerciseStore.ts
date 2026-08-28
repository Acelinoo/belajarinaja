import { create } from "zustand";

interface QuizSubmission {
  quizId: string;
  selectedOption: number;
}

interface QuizExerciseState {
  answers: Record<string, number>;
  activeTab: "lesson" | "practice" | "quiz";
  codeOutput: string;
  isEvaluating: boolean;
  setAnswer: (questionId: string, optionIndex: number) => void;
  setActiveTab: (tab: "lesson" | "practice" | "quiz") => void;
  setCodeOutput: (output: string) => void;
  setIsEvaluating: (status: boolean) => void;
  resetQuizState: () => void;
}

export const useQuizExerciseStore = create<QuizExerciseState>((set) => ({
  answers: {},
  activeTab: "lesson",
  codeOutput: "",
  isEvaluating: false,

  setAnswer: (questionId, optionIndex) =>
    set((state) => ({
      answers: {
        ...state.answers,
        [questionId]: optionIndex,
      },
    })),

  setActiveTab: (tab) => set({ activeTab: tab }),
  setCodeOutput: (output) => set({ codeOutput: output }),
  setIsEvaluating: (isEvaluating) => set({ isEvaluating }),
  resetQuizState: () => set({ answers: {}, codeOutput: "", isEvaluating: false }),
}));
