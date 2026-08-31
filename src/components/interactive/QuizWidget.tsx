"use client";

import { useState, useEffect } from "react";
import { CheckCircle2, XCircle, RotateCcw, Award, ArrowRight, CircleHelp, AlertTriangle, Sparkles, Star } from "lucide-react";
import confetti from "canvas-confetti";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { InlineFormattedText } from "@/components/ui/markdown-renderer";
import { useGuestProgressStore } from "@/store/useGuestProgressStore";
import { useThemeLanguageStore } from "@/store/useThemeLanguageStore";
import { getTranslations } from "@/lib/translations";
import { QuizLightbulbIllustration } from "@/components/fun/illustrations/QuizLightbulbIllustration";
import { GoldenTrophyIllustration } from "@/components/fun/illustrations/GoldenTrophyIllustration";

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
  const { completedLessons, saveQuizResult } = useGuestProgressStore();
  const { theme, language } = useThemeLanguageStore();
  const t = getTranslations(language);

  const existingProgress = completedLessons[lessonId];

  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState<number>(0);

  // Initialize from persisted state if already completed
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

    // Save to global progress store
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
          colors: theme === "dark" ? ["#22D3EE", "#10B981", "#38BDF8"] : ["#FFD84D", "#5CC8FF", "#45E0C0", "#FF9F43", "#FF6B6B"],
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

  // FUN MODE: Playful Gamified Challenge Layout
  if (theme === "fun") {
    return (
      <div className="space-y-6">
        {/* Fun Challenge Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 rounded-3xl border-2 border-[#E2E8F0] bg-white shadow-[0_10px_30px_rgba(255,155,84,0.08)]">
          <div className="flex items-center gap-4">
            <QuizLightbulbIllustration className="w-16 h-16 shrink-0" />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-[#243447]">
                  {t.quiz.funTitle}
                </h3>
                <Badge className="bg-[#FFF8E7] text-[#FF9F43] border border-[#FED7AA] text-[10px] font-black rounded-full">
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

        {/* Fun Result Celebration if Passed */}
        {submitted && score !== null && isPassed && (
          <div className="flex flex-col sm:flex-row items-center gap-5 p-6 rounded-3xl bg-[#F0FDF4] border-2 border-[#86EFAC] text-[#166534]">
            <GoldenTrophyIllustration className="w-20 h-20 shrink-0" />
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

        {/* Fun Retry Alert if Failed */}
        {submitted && score !== null && !isPassed && (
          <div className="p-6 rounded-3xl bg-[#FFF1F2] border-2 border-[#FECDD3] text-[#9F1239] space-y-3">
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

        {/* Questions Cards */}
        <div className="space-y-5">
          {quizzes.map((quiz, qIdx) => {
            const userAnswer = answers[quiz.id];
            const isCorrect = userAnswer === quiz.correctIndex;

            return (
              <div
                key={quiz.id}
                className="p-6 rounded-3xl border-2 border-[#E2E8F0] bg-white shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-4"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black text-[#243447] bg-[#FFF8E7] px-3 py-1 rounded-full border border-[#FED7AA]">
                    {t.quiz.questionOf} {qIdx + 1} {t.quiz.from} {quizzes.length}
                  </span>
                </div>

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

        {/* Fun Action Footer */}
        <div className="p-5 rounded-3xl bg-white border-2 border-[#E2E8F0] shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col sm:flex-row items-center justify-between gap-4">
          {submitted ? (
            <>
              <div className="text-xs font-bold text-[#243447]">
                {isPassed ? (
                  <span className="text-[#16A34A] font-black flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4" />
                    {t.quiz.congratsMessage}
                  </span>
                ) : (
                  <span className="text-[#E11D48] font-black flex items-center gap-1.5">
                    <XCircle className="h-4 w-4" />
                    {t.quiz.failedMessage}
                  </span>
                )}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
                className="gap-2 text-xs font-black rounded-full border-2 border-[#E2E8F0] hover:bg-[#FFF8E7] text-[#243447]"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                {t.quiz.retryQuiz}
              </Button>
            </>
          ) : (
            <>
              <div className="text-xs font-bold text-[#64748B]">
                {isAllAnswered
                  ? "Semua pertanyaan selesai! Siap evaluasi skor?"
                  : `Dijawab: ${Object.keys(answers).length} dari ${quizzes.length} soal`}
              </div>

              <Button
                onClick={handleSubmit}
                disabled={!isAllAnswered}
                className="gap-2 text-xs font-black rounded-full px-6 bg-[#FFD84D] hover:bg-[#FFC933] text-[#243447] shadow-[0_4px_12px_rgba(255,216,77,0.4)]"
              >
                {t.quiz.checkAnswers}
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </>
          )}
        </div>
      </div>
    );
  }

  // STANDARD LIGHT (Neo-Brutalist) & DARK (Obsidian) QUIZ WIDGET
  return (
    <div className="space-y-6">
      {/* Quiz Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border-2 border-black bg-white shadow-[4px_4px_0px_#121212] dark:border dark:border-[#1C242D] dark:bg-[#090D12] dark:shadow-none">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg border-2 border-black bg-[#FFD84D] text-[#121212] font-black shadow-[2px_2px_0px_#121212] shrink-0 dark:border dark:border-cyan-500/30 dark:rounded-xl dark:bg-cyan-500/10 dark:text-cyan-300 dark:shadow-none">
            <CircleHelp className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-black text-foreground">
              {t.quiz.title}
            </h3>
            <p className="text-xs font-medium text-[#555555] dark:font-normal dark:text-[#8292A6]">
              {quizzes.length} {t.roadmap.quizzesCount} • {t.quiz.minPassRequirement}
            </p>
          </div>
        </div>

        {submitted && score !== null && (
          <Badge
            variant={isPassed ? "success" : "destructive"}
            className="text-xs font-mono font-bold px-3 py-1.5 self-start sm:self-auto"
          >
            {t.dashboard.kpiProgress}: {score}% ({correctCount}/{quizzes.length}) • {isPassed ? t.common.passed.toUpperCase() : t.common.failed.toUpperCase()}
          </Badge>
        )}
      </div>

      {/* Result Alert if Failed */}
      {submitted && score !== null && !isPassed && (
        <div className="p-4 rounded-lg bg-[#FF6B6B]/20 border-2 border-black text-[#121212] shadow-[4px_4px_0px_#121212] text-xs sm:text-sm space-y-2 dark:bg-red-500/10 dark:border dark:border-red-500/30 dark:text-red-200 dark:shadow-none">
          <div className="flex items-center gap-2 font-black text-rose-800 dark:text-red-400">
            <AlertTriangle className="h-4 w-4" />
            <span>{t.quiz.failedScore} {score}%</span>
          </div>
          <p className="leading-relaxed font-medium text-neutral-900 dark:font-normal dark:text-[#94A3B8]">
            {t.quiz.failedMessage}
          </p>
          <div className="pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="gap-2 text-xs font-bold border-2 border-black bg-white text-black shadow-[2px_2px_0px_#121212] hover:bg-[#EAE4D5] dark:border dark:border-red-500/40 dark:bg-[#0F141A] dark:hover:bg-red-500/20 dark:text-red-300 dark:shadow-none dark:font-medium"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              {t.quiz.retryQuiz}
            </Button>
          </div>
        </div>
      )}

      {/* Result Alert if Passed */}
      {submitted && score !== null && isPassed && (
        <div className="p-4 rounded-lg bg-[#7BE495]/30 border-2 border-black text-[#121212] shadow-[4px_4px_0px_#121212] text-xs sm:text-sm space-y-1.5 dark:bg-emerald-500/10 dark:border dark:border-emerald-500/30 dark:text-emerald-200 dark:shadow-none">
          <div className="flex items-center gap-2 font-black text-emerald-900 dark:text-emerald-400">
            <CheckCircle2 className="h-4 w-4" />
            <span>{t.quiz.passedScore} {score}%</span>
          </div>
          <p className="text-xs font-medium text-neutral-900 dark:font-normal dark:text-[#94A3B8] leading-relaxed">
            {t.quiz.congratsMessage}
          </p>
        </div>
      )}

      {/* Questions List */}
      <div className="space-y-5">
        {quizzes.map((quiz, qIdx) => {
          const userAnswer = answers[quiz.id];
          const isCorrect = userAnswer === quiz.correctIndex;

          return (
            <div
              key={quiz.id}
              className="p-6 rounded-xl border-2 border-black bg-white shadow-[5px_5px_0px_#121212] space-y-4 dark:border dark:border-[#1C242D] dark:bg-[#090D12] dark:shadow-none"
            >
              <div>
                <span className="text-[11px] font-mono font-bold text-[#121212] bg-[#FFD84D] px-2 py-0.5 rounded border border-black dark:border dark:border-cyan-500/30 dark:bg-cyan-500/10 dark:text-cyan-300">
                  {t.quiz.questionOf} {qIdx + 1} {t.quiz.from} {quizzes.length}
                </span>
                <h4 className="text-sm sm:text-base font-black mt-2 text-foreground leading-snug">
                  <InlineFormattedText text={quiz.question} />
                </h4>
              </div>

              <div className="space-y-2">
                {quiz.options.map((option, optIdx) => {
                  const isSelected = userAnswer === optIdx;
                  let style =
                    "border-2 border-black bg-white text-foreground hover:bg-[#EAE4D5] shadow-[2px_2px_0px_#121212] dark:border dark:border-[#1C242D] dark:bg-[#05070A] dark:text-[#CBD5E1] dark:hover:border-cyan-500/40 dark:hover:bg-[#0F141A] dark:shadow-none";

                  if (submitted) {
                    if (optIdx === quiz.correctIndex) {
                      style =
                        "border-2 border-black bg-[#7BE495] text-[#121212] font-black shadow-[3px_3px_0px_#121212] dark:border dark:border-emerald-500/60 dark:bg-emerald-500/15 dark:text-emerald-300 dark:font-medium dark:shadow-[0_0_12px_rgba(16,185,129,0.15)]";
                    } else if (isSelected && !isCorrect) {
                      style =
                        "border-2 border-black bg-[#FF6B6B]/40 text-[#121212] font-black shadow-[3px_3px_0px_#121212] dark:border dark:border-red-500/60 dark:bg-red-500/15 dark:text-red-300 dark:shadow-[0_0_12px_rgba(239,68,68,0.15)]";
                    } else {
                      style = "border-2 border-neutral-300 bg-neutral-100 text-neutral-400 opacity-60 dark:border-[#1C242D]/40 dark:bg-[#05070A]/40 dark:text-[#475569] dark:opacity-40";
                    }
                  } else if (isSelected) {
                    style =
                      "border-2 border-black bg-[#FFD84D] text-[#121212] font-black shadow-[3px_3px_0px_#121212] -translate-y-0.5 dark:border dark:border-cyan-400 dark:bg-cyan-500/15 dark:text-cyan-200 dark:font-medium dark:shadow-[0_0_15px_rgba(34,211,238,0.15)] dark:translate-y-0";
                  }

                  return (
                    <button
                      key={optIdx}
                      type="button"
                      disabled={submitted}
                      onClick={() => handleSelect(quiz.id, optIdx)}
                      className={`w-full text-left p-3.5 rounded-lg text-xs sm:text-sm transition-all flex items-center justify-between ${style}`}
                    >
                      <span className="font-medium dark:font-normal">
                        <InlineFormattedText text={option} />
                      </span>
                      {submitted && optIdx === quiz.correctIndex && (
                        <CheckCircle2 className="h-4 w-4 text-emerald-800 dark:text-emerald-400 shrink-0 ml-2" />
                      )}
                      {submitted && isSelected && !isCorrect && (
                        <XCircle className="h-4 w-4 text-rose-800 dark:text-red-400 shrink-0 ml-2" />
                      )}
                    </button>
                  );
                })}
              </div>

              {submitted && (
                <div className="p-3.5 rounded-lg bg-[#EAE4D5] text-xs text-[#121212] border-2 border-black shadow-[2px_2px_0px_#121212] space-y-1 font-medium dark:border dark:border-[#1C242D] dark:bg-[#05070A] dark:text-[#94A3B8] dark:shadow-none dark:font-normal">
                  <div className="flex items-center gap-1.5 font-bold text-foreground">
                    {isCorrect ? (
                      <span className="text-emerald-800 dark:text-emerald-400 flex items-center gap-1 font-black">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Jawaban Benar
                      </span>
                    ) : (
                      <span className="text-rose-800 dark:text-red-400 flex items-center gap-1 font-black">
                        <XCircle className="h-3.5 w-3.5" /> Jawaban Belum Tepat
                      </span>
                    )}
                  </div>
                  <div>
                    <strong className="text-foreground dark:text-[#F1F5F9] font-black">{t.quiz.explanation}</strong>{" "}
                    <InlineFormattedText text={quiz.explanation} />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Action Footer */}
      <div className="p-4 rounded-xl bg-white border-2 border-black shadow-[4px_4px_0px_#121212] flex flex-col sm:flex-row items-center justify-between gap-4 dark:bg-[#090D12] dark:border dark:border-[#1C242D] dark:shadow-none">
        {submitted ? (
          <>
            <div className="text-xs font-bold text-foreground dark:font-normal dark:text-muted-foreground">
              {isPassed ? (
                <span className="text-emerald-800 dark:text-emerald-400 font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4" />
                  {t.quiz.congratsMessage}
                </span>
              ) : (
                <span className="text-rose-800 dark:text-rose-400 font-bold flex items-center gap-1.5">
                  <XCircle className="h-4 w-4" />
                  {t.quiz.failedMessage}
                </span>
              )}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="gap-2 text-xs font-bold shrink-0"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              {t.quiz.retryQuiz}
            </Button>
          </>
        ) : (
          <>
            <div className="text-xs font-bold text-[#555555] dark:font-normal dark:text-muted-foreground">
              {isAllAnswered
                ? "Seluruh pertanyaan telah dijawab. Klik periksa untuk evaluasi skor."
                : `Dijawab: ${Object.keys(answers).length} dari ${quizzes.length} soal`}
            </div>

            <Button
              onClick={handleSubmit}
              disabled={!isAllAnswered}
              className="gap-2 text-xs font-bold shrink-0"
            >
              {t.quiz.checkAnswers}
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

