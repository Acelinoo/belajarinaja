"use client";

import { useState, useEffect } from "react";
import { CheckCircle2, XCircle, RotateCcw, Award, ArrowRight, HelpCircle, AlertCircle } from "lucide-react";
import confetti from "canvas-confetti";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { InlineFormattedText } from "@/components/ui/markdown-renderer";
import { useGuestProgressStore } from "@/store/useGuestProgressStore";

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
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#6366F1", "#10B981", "#38BDF8"],
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
      {/* Quiz Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-card border border-border">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
            <HelpCircle className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              Evaluasi Pemahaman Materi (Mandatory Gate)
            </h3>
            <p className="text-xs text-muted-foreground">
              {quizzes.length} Soal • Minimal Nilai Kelulusan: <span className="font-semibold text-foreground">80%</span> (Syarat Membuka Materi Selanjutnya)
            </p>
          </div>
        </div>

        {submitted && score !== null && (
          <Badge
            variant={isPassed ? "success" : "destructive"}
            className="text-xs font-mono px-3 py-1.5 self-start sm:self-auto"
          >
            Skor: {score}% ({correctCount}/{quizzes.length} Benar) • {isPassed ? "LULUS" : "BELUM LULUS"}
          </Badge>
        )}
      </div>

      {/* Result Alert if Failed */}
      {submitted && score !== null && !isPassed && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-200 text-xs sm:text-sm space-y-2">
          <div className="flex items-center gap-2 font-semibold text-rose-400">
            <AlertCircle className="h-4 w-4" />
            <span>Quiz Belum Lulus</span>
          </div>
          <p className="leading-relaxed text-muted-foreground">
            Nilai Anda: <strong className="text-rose-300 font-mono">{score}%</strong> ({correctCount} dari {quizzes.length} soal benar). Minimal nilai kelulusan adalah <strong className="text-foreground font-mono">80%</strong>. Silakan pelajari kembali materi atau ulangi quiz untuk membuka materi berikutnya.
          </p>
          <div className="pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="gap-2 text-xs border-rose-500/40 hover:bg-rose-500/10 text-rose-300"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Ulangi Quiz Sekarang
            </Button>
          </div>
        </div>
      )}

      {/* Result Alert if Passed */}
      {submitted && score !== null && isPassed && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-200 text-xs sm:text-sm space-y-1.5">
          <div className="flex items-center gap-2 font-semibold text-emerald-400">
            <CheckCircle2 className="h-4 w-4" />
            <span>Selamat! Anda Lulus Quiz ({score}%)</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Materi ini telah ditandai selesai. Materi berikutnya pada roadmap sekarang telah terbuka.
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
              className="p-6 rounded-xl border border-border bg-card space-y-4"
            >
              <div>
                <span className="text-xs font-mono text-primary">
                  Soal {qIdx + 1} dari {quizzes.length}
                </span>
                <h4 className="text-sm sm:text-base font-semibold mt-1 text-foreground">
                  <InlineFormattedText text={quiz.question} />
                </h4>
              </div>

              <div className="space-y-2">
                {quiz.options.map((option, optIdx) => {
                  const isSelected = userAnswer === optIdx;
                  let style =
                    "border-border/70 hover:border-primary/40 bg-background/60 text-foreground";

                  if (submitted) {
                    if (optIdx === quiz.correctIndex) {
                      style =
                        "border-emerald-500/50 bg-emerald-500/10 text-emerald-300 font-medium";
                    } else if (isSelected && !isCorrect) {
                      style =
                        "border-rose-500/50 bg-rose-500/10 text-rose-300";
                    } else {
                      style = "border-border/40 bg-card/40 opacity-60";
                    }
                  } else if (isSelected) {
                    style =
                      "border-primary bg-primary/10 text-foreground font-medium";
                  }

                  return (
                    <button
                      key={optIdx}
                      type="button"
                      disabled={submitted}
                      onClick={() => handleSelect(quiz.id, optIdx)}
                      className={`w-full text-left p-3.5 rounded-lg border text-xs sm:text-sm transition-all flex items-center justify-between ${style}`}
                    >
                      <span>
                        <InlineFormattedText text={option} />
                      </span>
                      {submitted && optIdx === quiz.correctIndex && (
                        <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 ml-2" />
                      )}
                      {submitted && isSelected && !isCorrect && (
                        <XCircle className="h-4 w-4 text-rose-400 shrink-0 ml-2" />
                      )}
                    </button>
                  );
                })}
              </div>

              {submitted && (
                <div className="p-3.5 rounded-lg bg-muted/40 text-xs text-muted-foreground border border-border/40 space-y-1">
                  <div className="flex items-center gap-1.5 font-semibold text-foreground">
                    {isCorrect ? (
                      <span className="text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Jawaban Benar
                      </span>
                    ) : (
                      <span className="text-rose-400 flex items-center gap-1">
                        <XCircle className="h-3.5 w-3.5" /> Jawaban Belum Tepat
                      </span>
                    )}
                  </div>
                  <div>
                    <strong className="text-foreground">Penjelasan:</strong>{" "}
                    <InlineFormattedText text={quiz.explanation} />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Action Footer */}
      <div className="p-4 rounded-xl bg-card border border-border flex flex-col sm:flex-row items-center justify-between gap-4">
        {submitted ? (
          <>
            <div className="text-xs text-muted-foreground">
              {isPassed ? (
                <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4" />
                  Hebat! Anda telah menguasai materi ini dengan skor {score}%.
                </span>
              ) : (
                <span className="text-rose-400 font-semibold flex items-center gap-1.5">
                  <XCircle className="h-4 w-4" />
                  Skor Anda {score}%. Baca ulang materi dan ulangi quiz untuk membuka materi berikutnya.
                </span>
              )}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="gap-2 text-xs shrink-0"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Ulangi Quiz
            </Button>
          </>
        ) : (
          <>
            <div className="text-xs text-muted-foreground">
              {isAllAnswered
                ? "Seluruh pertanyaan telah dijawab. Klik periksa untuk evaluasi skor."
                : `Dijawab: ${Object.keys(answers).length} dari ${quizzes.length} soal`}
            </div>

            <Button
              onClick={handleSubmit}
              disabled={!isAllAnswered}
              className="gap-2 text-xs font-medium shrink-0"
            >
              Periksa Jawaban Quiz
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
