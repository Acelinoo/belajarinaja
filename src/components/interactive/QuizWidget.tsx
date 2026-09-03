"use client";

import { useState, useEffect } from "react";
import {
  CheckCircle2,
  XCircle,
  RotateCcw,
  Award,
  ArrowRight,
  CircleHelp,
  AlertTriangle,
  Sparkles,
  Star,
  Check,
} from "lucide-react";
import confetti from "canvas-confetti";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { InlineFormattedText } from "@/components/ui/markdown-renderer";
import { useCurriculumProgressStore } from "@/store/useCurriculumProgressStore";
import { useThemeLanguageStore } from "@/store/useThemeLanguageStore";
import { getTranslations } from "@/lib/translations";
import { NovaCharacter } from "@/components/fun/characters/NovaCharacter";

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

interface QuizWidgetProps {
  lessonId: string;
  lessonSlug?: string;
  quizzes: QuizQuestion[];
  onQuizPassed?: (score: number) => void;
}

export function QuizWidget({
  lessonId,
  lessonSlug,
  quizzes,
  onQuizPassed,
}: QuizWidgetProps) {
  const { completedLessons, saveQuizResult } = useCurriculumProgressStore();
  const { theme, language } = useThemeLanguageStore();
  const t = getTranslations(language);

  const existingProgress = completedLessons[lessonId];

  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState<number>(0);

  useEffect(() => {
    if (existingProgress && existingProgress.passed && existingProgress.score !== undefined) {
      setSubmitted(true);
      setScore(existingProgress.score);
      setCorrectCount(existingProgress.correctAnswers || Math.round((existingProgress.score / 100) * quizzes.length));
    }
  }, [lessonId, existingProgress, quizzes.length]);

  const handleSelect = (questionId: string, optionIndex: number) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleSubmit = () => {
    let currentCorrect = 0;
    quizzes.forEach((q) => {
      if (answers[q.id] === q.correctIndex) {
        currentCorrect++;
      }
    });

    const calculatedScore = Math.round((currentCorrect / quizzes.length) * 100);
    const isPassed = calculatedScore >= 80;

    setCorrectCount(currentCorrect);
    setScore(calculatedScore);
    setSubmitted(true);

    saveQuizResult({
      lessonId,
      lessonSlug,
      score: calculatedScore,
      correctAnswers: currentCorrect,
      totalQuestions: quizzes.length,
      passed: isPassed,
    });

    if (isPassed) {
      onQuizPassed?.(calculatedScore);

      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#2563EB", "#38BDF8", "#10B981", "#F59E0B"],
        });
      } catch (err) {
        // Safe fallback
      }
    }
  };

  const handleReset = () => {
    setAnswers({});
    setSubmitted(false);
    setScore(null);
    setCorrectCount(0);
  };

  const isAllAnswered = quizzes.every((q) => answers[q.id] !== undefined);
  const isPassed = (score ?? 0) >= 80;

  return (
    <div className="space-y-6">
      {/* Quiz Progress & Rules Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl border border-border bg-secondary/40 text-xs">
        <div className="flex items-center gap-3 text-center sm:text-left">
          {theme === "fun" ? (
            <NovaCharacter
              state={submitted && isPassed ? "celebrating" : submitted ? "confused" : "thinking"}
              className="w-10 h-10 shrink-0"
            />
          ) : (
            <div className="h-8 w-8 rounded-lg bg-card border border-border text-primary flex items-center justify-center font-bold">
              <CircleHelp className="h-4 w-4" />
            </div>
          )}

          <div className="space-y-0.5">
            <span className="font-bold text-foreground">
              {t.quiz.title} ({quizzes.length} {language === "en" ? "Questions" : "Soal"})
            </span>
            <p className="text-muted-foreground text-[11px]">
              {t.quiz.minPassRequirement}
            </p>
          </div>
        </div>

        {submitted && score !== null && (
          <Badge
            variant={isPassed ? "default" : "destructive"}
            className="text-xs font-bold px-3 py-1"
          >
            {isPassed
              ? (language === "en" ? "PASSED" : "LULUS")
              : (language === "en" ? "NOT PASSED" : "BELUM LULUS")}
            : {score}% ({correctCount}/{quizzes.length})
          </Badge>
        )}
      </div>

      {/* Passed Banner */}
      {submitted && score !== null && isPassed && (
        <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-800 dark:text-emerald-200 flex items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <div>
              <span className="font-bold block">
                {language === "en"
                  ? "Congratulations, you passed this lesson evaluation!"
                  : "Selamat, Anda Lulus Evaluasi Materi Ini!"}
              </span>
              <span className="text-[11px] opacity-90">
                {language === "en"
                  ? "The next lesson is now unlocked on the curriculum roadmap."
                  : "Materi berikutnya kini telah terbuka di peta kurikulum."}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Failed Banner */}
      {submitted && score !== null && !isPassed && (
        <div className="p-4 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-800 dark:text-rose-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="h-5 w-5 text-rose-600 dark:text-rose-400 shrink-0" />
            <div>
              <span className="font-bold block">
                {language === "en"
                  ? `Your Score: ${score}% (Below 80%)`
                  : `Skor Anda: ${score}% (Kurang dari 80%)`}
              </span>
              <span className="text-[11px] opacity-90">
                {language === "en"
                  ? "Review the concepts above and examine the explanation for each question below."
                  : "Pelajari kembali konsep di atas dan periksa pembahasan setiap soal di bawah ini."}
              </span>
            </div>
          </div>

          <Button
            size="sm"
            variant="outline"
            onClick={handleReset}
            className="h-8 text-xs font-bold rounded-md gap-1.5 shrink-0 border-rose-300 dark:border-rose-800"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>{language === "en" ? "Retry Quiz" : "Ulangi Quiz"}</span>
          </Button>
        </div>
      )}

      {/* Questions List */}
      <div className="space-y-6">
        {quizzes.map((quiz, qIdx) => {
          const userAnswer = answers[quiz.id];
          const isCorrect = userAnswer === quiz.correctIndex;

          return (
            <div
              key={quiz.id}
              className="p-5 sm:p-6 rounded-xl border border-border bg-card shadow-xs space-y-4"
            >
              <div className="flex items-center justify-between text-xs text-muted-foreground pb-2 border-b border-border">
                <span className="font-mono font-semibold">
                  {language === "en"
                    ? `QUESTION ${qIdx + 1} OF ${quizzes.length}`
                    : `SOAL ${qIdx + 1} DARI ${quizzes.length}`}
                </span>

                {submitted && (
                  isCorrect ? (
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>{language === "en" ? "Correct" : "Benar"}</span>
                    </span>
                  ) : (
                    <span className="text-rose-600 dark:text-rose-400 font-bold flex items-center gap-1">
                      <XCircle className="h-3.5 w-3.5" />
                      <span>{language === "en" ? "Incorrect" : "Salah"}</span>
                    </span>
                  )
                )}
              </div>

              <h3 className="text-xs sm:text-sm font-bold text-foreground leading-snug">
                <InlineFormattedText text={quiz.question} />
              </h3>

              {/* Options */}
              <div className="space-y-2">
                {quiz.options.map((option, optIdx) => {
                  const isSelected = userAnswer === optIdx;
                  let optionClass =
                    "border-border bg-card text-foreground hover:bg-secondary hover:border-primary/50";

                  if (submitted) {
                    if (optIdx === quiz.correctIndex) {
                      optionClass =
                        "border-emerald-500 bg-emerald-50 text-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-200 font-bold";
                    } else if (isSelected && !isCorrect) {
                      optionClass =
                        "border-rose-500 bg-rose-50 text-rose-900 dark:bg-rose-950/50 dark:text-rose-200";
                    } else {
                      optionClass = "border-border/60 bg-secondary/30 text-muted-foreground opacity-60";
                    }
                  } else if (isSelected) {
                    optionClass = "border-primary bg-primary/10 text-primary font-bold shadow-xs";
                  }

                  return (
                    <button
                      key={optIdx}
                      type="button"
                      disabled={submitted}
                      onClick={() => handleSelect(quiz.id, optIdx)}
                      className={`w-full text-left p-3 rounded-lg border text-xs transition-colors flex items-center justify-between gap-3 ${optionClass}`}
                    >
                      <div className="flex items-start gap-2.5">
                        <span className="font-mono font-bold shrink-0">
                          {String.fromCharCode(65 + optIdx)}.
                        </span>
                        <span>
                          <InlineFormattedText text={option} />
                        </span>
                      </div>

                      {submitted && optIdx === quiz.correctIndex && (
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      )}
                      {submitted && isSelected && !isCorrect && (
                        <XCircle className="h-4 w-4 text-rose-600 dark:text-rose-400 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Detailed Explanation */}
              {submitted && (
                <div className="p-3.5 rounded-lg border border-border bg-secondary/40 text-xs space-y-1">
                  <span className="font-bold text-foreground block">
                    {language === "en" ? "Answer Key Explanation:" : "Penjelasan Kunci Jawaban:"}
                  </span>
                  <p className="text-muted-foreground leading-relaxed">
                    <InlineFormattedText text={quiz.explanation} />
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Submit Evaluation Trigger */}
      {!submitted && (
        <Button
          size="lg"
          disabled={!isAllAnswered}
          onClick={handleSubmit}
          className="w-full h-11 text-xs font-bold rounded-md gap-2"
        >
          <span>
            {language === "en"
              ? `Submit & Evaluate Answers (${Object.keys(answers).length}/${quizzes.length} Answered)`
              : `Kirim & Evaluasi Jawaban (${Object.keys(answers).length}/${quizzes.length} Terjawab)`}
          </span>
          <ArrowRight className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
