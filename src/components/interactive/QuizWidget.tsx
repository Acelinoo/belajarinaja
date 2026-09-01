"use client";

import { useState, useEffect } from "react";
import { CheckCircle2, XCircle, RotateCcw, Award, ArrowRight, CircleHelp, AlertTriangle, Sparkles, Star, Terminal } from "lucide-react";
import confetti from "canvas-confetti";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { InlineFormattedText } from "@/components/ui/markdown-renderer";
import { useCurriculumProgressStore } from "@/store/useCurriculumProgressStore";
import { useThemeLanguageStore } from "@/store/useThemeLanguageStore";
import { getTranslations } from "@/lib/translations";
import { QuizThinkingCharacter } from "@/components/fun/characters/QuizThinkingCharacter";
import { VictoryAchievementCharacter } from "@/components/fun/characters/VictoryAchievementCharacter";

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
          particleCount: 90,
          spread: 80,
          origin: { y: 0.6 },
          colors: theme === "dark"
            ? ["#FFFFFF", "#CCCCCC", "#888888", "#555555"]
            : ["#FFD84D", "#5CC8FF", "#45E0C0", "#FF9F43", "#FF6B6B"],
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

  // =========================================================================
  // 1. FUN MODE: Playful Mini Challenge
  // =========================================================================
  if (theme === "fun") {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 rounded-[28px] border-2 border-[#FED7AA] bg-white shadow-[0_10px_30px_rgba(255,155,84,0.08)]">
          <div className="flex items-center gap-4">
            <QuizThinkingCharacter className="w-16 h-16 shrink-0" />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-[#243447]">
                  {t.quiz.funTitle}
                </h3>
                <Badge className="bg-[#FFF8E7] text-[#D97706] border border-[#FED7AA] text-[10px] font-black rounded-full">
                  ⭐ +30 XP
                </Badge>
              </div>
              <p className="text-xs font-medium text-[#64748B] mt-0.5">
                {t.quiz.funSubtitle}
              </p>
            </div>
          </div>

          {submitted && score !== null && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#EBF8FF] border border-[#5CC8FF]/40 text-xs font-black text-[#0284C7]">
              <span>{isPassed ? "⭐⭐⭐" : "⭐"}</span>
              <span>{score}% ({correctCount}/{quizzes.length} {t.common.passed})</span>
            </div>
          )}
        </div>

        {/* Celebration */}
        {submitted && score !== null && isPassed && (
          <div className="flex flex-col sm:flex-row items-center gap-5 p-6 rounded-[28px] bg-[#F0FDF4] border-2 border-[#86EFAC] text-[#166534]">
            <VictoryAchievementCharacter className="w-20 h-20 shrink-0" />
            <div className="space-y-1 text-center sm:text-left">
              <h4 className="text-sm font-black text-[#15803D] flex items-center justify-center sm:justify-start gap-1.5">
                <Sparkles className="h-4 w-4 text-[#EAB308]" />
                {t.quiz.funVictoryTitle}
              </h4>
              <p className="text-xs font-medium text-[#166534]">
                {t.quiz.funVictorySubtitle}
              </p>
            </div>
          </div>
        )}

        {/* Failed Notice */}
        {submitted && score !== null && !isPassed && (
          <div className="p-6 rounded-[28px] bg-[#FFF1F2] border-2 border-[#FECDD3] text-[#9F1239] space-y-3">
            <div className="flex items-center gap-2 font-black text-[#BE123C]">
              <AlertTriangle className="h-5 w-5" />
              <span>{t.quiz.failedScore} {score}%</span>
            </div>
            <p className="text-xs font-medium text-[#9F1239] leading-relaxed">
              {t.quiz.failedMessage}
            </p>
            <div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
                className="gap-2 text-xs font-black rounded-full border-2 border-[#FECDD3] bg-white text-[#BE123C] hover:bg-[#FFF1F2]"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                {t.quiz.retryQuiz}
              </Button>
            </div>
          </div>
        )}

        {/* Questions */}
        <div className="space-y-5">
          {quizzes.map((quiz, qIdx) => {
            const userAnswer = answers[quiz.id];
            const isCorrect = userAnswer === quiz.correctIndex;

            return (
              <div
                key={quiz.id}
                className="p-6 rounded-[28px] border-2 border-[#FED7AA] bg-white shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-4"
              >
                <span className="text-[11px] font-black text-[#243447] bg-[#FFF8E7] px-3 py-1 rounded-full border border-[#FED7AA] inline-block">
                  {t.quiz.questionOf} {qIdx + 1} {t.quiz.from} {quizzes.length}
                </span>

                <h4 className="text-sm sm:text-base font-black text-[#243447] leading-snug">
                  <InlineFormattedText text={quiz.question} />
                </h4>

                <div className="space-y-2.5">
                  {quiz.options.map((option, optIdx) => {
                    const isSelected = userAnswer === optIdx;
                    let style = "border-2 border-[#E2E8F0] bg-white text-[#243447] hover:border-[#5CC8FF] hover:bg-[#EBF8FF]";

                    if (submitted) {
                      if (optIdx === quiz.correctIndex) {
                        style = "border-2 border-[#86EFAC] bg-[#DCFCE7] text-[#166534] font-black";
                      } else if (isSelected && !isCorrect) {
                        style = "border-2 border-[#FECDD3] bg-[#FFE4E6] text-[#9F1239] font-black";
                      } else {
                        style = "border-2 border-[#F1F5F9] bg-[#F8FAFC] text-[#94A3B8] opacity-50";
                      }
                    } else if (isSelected) {
                      style = "border-2 border-[#5CC8FF] bg-[#EBF8FF] text-[#0284C7] font-black shadow-[0_2px_10px_rgba(92,200,255,0.25)]";
                    }

                    return (
                      <button
                        key={optIdx}
                        type="button"
                        disabled={submitted}
                        onClick={() => handleSelect(quiz.id, optIdx)}
                        className={`w-full text-left p-4 rounded-2xl text-xs sm:text-sm transition-all flex items-center justify-between ${style}`}
                      >
                        <span className="font-bold">
                          <InlineFormattedText text={option} />
                        </span>
                        {submitted && optIdx === quiz.correctIndex && (
                          <CheckCircle2 className="h-4 w-4 text-[#16A34A] shrink-0 ml-2" />
                        )}
                        {submitted && isSelected && !isCorrect && (
                          <XCircle className="h-4 w-4 text-[#E11D48] shrink-0 ml-2" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {submitted && (
                  <div className="p-4 rounded-2xl bg-[#FFF8E7] text-xs text-[#243447] border border-[#FED7AA] space-y-1">
                    <div className="font-black text-[#D97706] flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>{t.quiz.explanation}</span>
                    </div>
                    <div className="text-[#475569] font-medium leading-relaxed">
                      <InlineFormattedText text={quiz.explanation} />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Submit */}
        {!submitted && (
          <Button
            size="lg"
            disabled={!isAllAnswered}
            onClick={handleSubmit}
            className="w-full rounded-full bg-[#FFD84D] hover:bg-[#FFC933] text-[#243447] font-black text-xs h-12 shadow-[0_4px_16px_rgba(255,216,77,0.45)]"
          >
            <span>{t.quiz.checkAnswers}</span>
            <ArrowRight className="h-4 w-4 ml-1.5" />
          </Button>
        )}
      </div>
    );
  }

  // =========================================================================
  // 2. DARK MODE: Monochrome Terminal Evaluator (100% Monochrome)
  // =========================================================================
  if (theme === "dark") {
    return (
      <div className="space-y-4 font-mono">
        <div className="p-4 rounded border border-[#222222] bg-[#0A0A0A] space-y-1">
          <div className="flex items-center justify-between text-xs text-[#888888]">
            <span className="text-[#FFFFFF] font-bold">[COMPILER_EVALUATOR]</span>
            <span>PASS_GRADE: 80%</span>
          </div>
          <p className="text-xs text-[#666666]">
            Answer all {quizzes.length} concept verification queries to commit progress.
          </p>
        </div>

        {/* Results */}
        {submitted && score !== null && (
          <div className={`p-4 rounded border ${isPassed ? "border-[#FFFFFF] bg-[#111111] text-[#FFFFFF]" : "border-[#444444] bg-[#0A0A0A] text-[#CCCCCC]"} space-y-2`}>
            <div className="flex items-center justify-between text-xs font-bold">
              <span>{isPassed ? "[STATUS: EVALUATION_PASS]" : "[STATUS: EVALUATION_FAIL]"}</span>
              <span>SCORE: {score}%</span>
            </div>
            <p className="text-xs text-[#888888]">
              {isPassed ? "All critical architecture objectives verified." : "Review technical docs and retry."}
            </p>
            {!isPassed && (
              <Button size="sm" onClick={handleReset} className="h-7 text-xs font-mono border border-[#333333] bg-[#050505] text-[#FFFFFF]">
                RETRY_EVALUATION
              </Button>
            )}
          </div>
        )}

        {/* Questions */}
        <div className="space-y-4">
          {quizzes.map((quiz, qIdx) => {
            const userAnswer = answers[quiz.id];
            const isCorrect = userAnswer === quiz.correctIndex;

            return (
              <div key={quiz.id} className="p-4 rounded border border-[#222222] bg-[#0A0A0A] space-y-3">
                <span className="text-[10px] text-[#666666] uppercase block">
                  QUERY_{String(qIdx + 1).padStart(2, "0")} / {String(quizzes.length).padStart(2, "0")}
                </span>

                <h4 className="text-xs font-bold text-[#FFFFFF]">
                  <InlineFormattedText text={quiz.question} />
                </h4>

                <div className="space-y-1.5">
                  {quiz.options.map((option, optIdx) => {
                    const isSelected = userAnswer === optIdx;
                    let border = "border-[#222222] bg-[#050505] text-[#CCCCCC]";

                    if (submitted) {
                      if (optIdx === quiz.correctIndex) {
                        border = "border-[#FFFFFF] bg-[#171717] text-[#FFFFFF] font-bold";
                      } else if (isSelected && !isCorrect) {
                        border = "border-[#444444] bg-[#111111] text-[#777777] line-through";
                      } else {
                        border = "border-[#1A1A1A] bg-[#050505] text-[#444444]";
                      }
                    } else if (isSelected) {
                      border = "border-[#FFFFFF] bg-[#171717] text-[#FFFFFF] font-bold";
                    }

                    return (
                      <button
                        key={optIdx}
                        type="button"
                        disabled={submitted}
                        onClick={() => handleSelect(quiz.id, optIdx)}
                        className={`w-full text-left p-2.5 rounded border text-xs flex items-center justify-between ${border}`}
                      >
                        <span>
                          [{String.fromCharCode(65 + optIdx)}] <InlineFormattedText text={option} />
                        </span>
                        {submitted && optIdx === quiz.correctIndex && <span>[PASS]</span>}
                      </button>
                    );
                  })}
                </div>

                {submitted && (
                  <div className="p-3 rounded border border-[#1A1A1A] bg-[#050505] text-[11px] text-[#888888]">
                    <span className="text-[#FFFFFF] font-bold block mb-0.5">EXPLANATION:</span>
                    <InlineFormattedText text={quiz.explanation} />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {!submitted && (
          <Button
            disabled={!isAllAnswered}
            onClick={handleSubmit}
            className="w-full font-mono text-xs bg-[#FFFFFF] hover:bg-[#E5E5E5] text-[#000000] font-bold h-9 rounded"
          >
            RUN_EVALUATOR &rarr;
          </Button>
        )}
      </div>
    );
  }

  // =========================================================================
  // 3. LIGHT MODE: Modern Neo-Brutalist Quiz Widget
  // =========================================================================
  return (
    <div className="space-y-6">
      <div className="p-6 rounded-xl border-2 border-black bg-white shadow-[5px_5px_0px_#121212] space-y-1">
        <div className="flex items-center justify-between text-xs font-bold text-[#555555]">
          <span>{t.quiz.title}</span>
          <span>{t.quiz.minPassRequirement}</span>
        </div>
        <p className="text-xs text-[#555555]">
          {t.quiz.subtitle}
        </p>
      </div>

      {submitted && score !== null && (
        <div className={`p-6 rounded-xl border-2 border-black shadow-[4px_4px_0px_#121212] ${
          isPassed ? "bg-[#7BE495]/40 text-[#121212]" : "bg-[#FF6B6B]/20 text-[#121212]"
        } space-y-2`}>
          <div className="text-base font-black">
            {isPassed ? `${t.quiz.passedScore} ${score}%` : `${t.quiz.failedScore} ${score}%`}
          </div>
          <p className="text-xs">
            {isPassed ? t.quiz.congratsMessage : t.quiz.failedMessage}
          </p>
          {!isPassed && (
            <Button size="sm" onClick={handleReset} className="rounded-lg border-2 border-black bg-white text-[#121212] font-black text-xs shadow-[2px_2px_0px_#121212] mt-2">
              <RotateCcw className="h-3.5 w-3.5 mr-1" />
              <span>{t.quiz.retryQuiz}</span>
            </Button>
          )}
        </div>
      )}

      {/* Questions */}
      <div className="space-y-4">
        {quizzes.map((quiz, qIdx) => {
          const userAnswer = answers[quiz.id];
          const isCorrect = userAnswer === quiz.correctIndex;

          return (
            <div key={quiz.id} className="p-6 rounded-xl border-2 border-black bg-white shadow-[4px_4px_0px_#121212] space-y-3">
              <span className="text-xs font-bold text-[#555555]">
                {t.quiz.questionOf} {qIdx + 1} {t.quiz.from} {quizzes.length}
              </span>

              <h4 className="text-sm font-black text-[#121212]">
                <InlineFormattedText text={quiz.question} />
              </h4>

              <div className="space-y-2">
                {quiz.options.map((option, optIdx) => {
                  const isSelected = userAnswer === optIdx;
                  let style = "border-2 border-black bg-white text-[#121212] hover:bg-[#F7F4EA]";

                  if (submitted) {
                    if (optIdx === quiz.correctIndex) {
                      style = "border-2 border-black bg-[#7BE495] text-[#121212] font-black shadow-[2px_2px_0px_#121212]";
                    } else if (isSelected && !isCorrect) {
                      style = "border-2 border-black bg-[#FF6B6B] text-[#121212] font-bold";
                    } else {
                      style = "border-2 border-neutral-300 bg-neutral-100 text-[#888888] opacity-50";
                    }
                  } else if (isSelected) {
                    style = "border-2 border-black bg-[#FFD84D] text-[#121212] font-black shadow-[2px_2px_0px_#121212]";
                  }

                  return (
                    <button
                      key={optIdx}
                      type="button"
                      disabled={submitted}
                      onClick={() => handleSelect(quiz.id, optIdx)}
                      className={`w-full text-left p-3 rounded-lg text-xs font-bold transition-all flex items-center justify-between ${style}`}
                    >
                      <span>
                        {String.fromCharCode(65 + optIdx)}. <InlineFormattedText text={option} />
                      </span>
                      {submitted && optIdx === quiz.correctIndex && <CheckCircle2 className="h-4 w-4 text-[#15803D]" />}
                    </button>
                  );
                })}
              </div>

              {submitted && (
                <div className="p-3 rounded border-2 border-black bg-[#F7F4EA] text-xs text-[#121212] space-y-0.5">
                  <span className="font-black block">{t.quiz.explanation}</span>
                  <InlineFormattedText text={quiz.explanation} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {!submitted && (
        <Button
          disabled={!isAllAnswered}
          onClick={handleSubmit}
          className="w-full rounded-lg border-2 border-black bg-[#FFD84D] hover:bg-[#F5CB32] text-[#121212] font-black text-xs h-11 shadow-[4px_4px_0px_#121212]"
        >
          <span>{t.quiz.checkAnswers}</span>
        </Button>
      )}
    </div>
  );
}
