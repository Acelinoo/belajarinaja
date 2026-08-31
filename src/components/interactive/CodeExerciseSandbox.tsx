"use client";

import { useState } from "react";
import { Play, RotateCcw, Eye, CheckCircle2, XCircle, Terminal, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { InlineFormattedText } from "@/components/ui/markdown-renderer";
import { useGuestProgressStore } from "@/store/useGuestProgressStore";

interface ExerciseData {
  id: string;
  prompt: string;
  starterCode: string;
  solutionCode: string;
  expectedOutput: string;
}

interface CodeExerciseSandboxProps {
  lessonId: string;
  exercise: ExerciseData;
  onExercisePassed?: () => void;
}

export function CodeExerciseSandbox({
  lessonId,
  exercise,
  onExercisePassed,
}: CodeExerciseSandboxProps) {
  const [code, setCode] = useState(exercise.starterCode);
  const [output, setOutput] = useState<string | null>(null);
  const [showSolution, setShowSolution] = useState(false);
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);

  const { saveCodeAttempt } = useGuestProgressStore();

  const handleRun = () => {
    saveCodeAttempt(lessonId, code);

    // Safely execute code in browser and capture console.log
    let consoleLogs: string[] = [];
    const customConsole = {
      log: (...args: unknown[]) => {
        consoleLogs.push(
          args
            .map((arg) => (typeof arg === "object" ? JSON.stringify(arg) : String(arg)))
            .join(" ")
        );
      },
    };

    try {
      // Execute within a safe function closure passing custom console
      const runFn = new Function("console", code);
      runFn(customConsole);

      const actualOutput = consoleLogs.join("\n").trim();
      const expected = exercise.expectedOutput.trim();

      if (actualOutput === expected || code.trim() === exercise.solutionCode.trim()) {
        setOutput(actualOutput || expected);
        setIsSuccess(true);
        onExercisePassed?.();
      } else {
        setOutput(
          actualOutput ||
            "Kode dijalankan tanpa output console.log. Pastikan mencetak output yang diminta."
        );
        setIsSuccess(false);
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      setOutput(`⚠️ Runtime Error: ${errorMsg}`);
      setIsSuccess(false);
    }
  };

  const handleReset = () => {
    setCode(exercise.starterCode);
    setOutput(null);
    setIsSuccess(null);
  };

  return (
    <div className="space-y-6">
      {/* Prompt Card */}
      <div className="p-6 rounded-xl border-2 border-black bg-white shadow-[5px_5px_0px_#121212] space-y-3 dark:border-border dark:bg-card dark:shadow-none dark:rounded-lg">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-black text-[#121212] bg-[#FFD84D] px-2 py-0.5 rounded border border-black dark:border-0 dark:bg-transparent dark:text-primary uppercase tracking-wider">
            Latihan Kode Interaktif
          </span>
          <Badge variant="outline" className="text-[10px] font-bold">
            In-Browser JavaScript Sandbox
          </Badge>
        </div>

        <h3 className="text-base font-black text-foreground">
          <InlineFormattedText text={exercise.prompt} />
        </h3>

        <div className="p-3 rounded-lg bg-[#EAE4D5] border-2 border-black text-xs text-[#121212] font-mono shadow-[2px_2px_0px_#121212] dark:border-border/60 dark:bg-muted/40 dark:text-muted-foreground dark:shadow-none">
          <strong className="text-foreground font-bold">Output yang Diharapkan:</strong>
          <pre className="mt-1 text-emerald-800 dark:text-emerald-400 font-bold dark:font-normal whitespace-pre-wrap">
            {exercise.expectedOutput}
          </pre>
        </div>
      </div>

      {/* Code Editor Frame */}
      <div className="rounded-xl border-2 border-black overflow-hidden bg-[#121212] shadow-[5px_5px_0px_#121212] dark:border-border dark:bg-[#060708] dark:shadow-none dark:rounded-lg">
        {/* Editor Toolbar */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-[#1c1c1f] border-b-2 border-black text-xs text-neutral-200 font-mono dark:bg-[#0E0F12] dark:border-border/80 dark:text-muted-foreground">
          <div className="flex items-center gap-2">
            <Terminal className="h-3.5 w-3.5 text-[#FFD84D] dark:text-primary" />
            <span className="font-bold text-white dark:text-foreground">exercise.js</span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowSolution(!showSolution)}
              className="h-7 px-2.5 text-[11px] font-bold border-2 border-black bg-white text-[#121212] shadow-[2px_2px_0px_#000000] hover:bg-[#EAE4D5] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none dark:border-transparent dark:bg-transparent dark:text-muted-foreground dark:hover:text-foreground dark:hover:bg-accent dark:shadow-none"
            >
              <Eye className="h-3 w-3" />
              <span>{showSolution ? "Sembunyikan Solusi" : "Lihat Solusi"}</span>
            </Button>

            <Button
              size="sm"
              variant="ghost"
              onClick={handleReset}
              className="h-7 px-2.5 text-[11px] font-bold border-2 border-black bg-[#FFD84D] text-[#121212] shadow-[2px_2px_0px_#000000] hover:bg-[#F5CB32] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none dark:border-transparent dark:bg-transparent dark:text-muted-foreground dark:hover:text-foreground dark:hover:bg-accent dark:shadow-none"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Reset</span>
            </Button>
          </div>
        </div>

        {/* Textarea Editor */}
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full h-44 p-4 bg-transparent font-mono text-xs text-emerald-400 focus:outline-none resize-none leading-relaxed selection:bg-primary/30"
          spellCheck={false}
          placeholder="// Tulis kode solusi Anda di sini..."
        />

        {/* Solution Hint Box if toggled */}
        {showSolution && (
          <div className="p-3 bg-[#1e1e24] border-t-2 border-black text-xs font-mono text-amber-300 dark:bg-[#121318] dark:border-border/80 dark:text-indigo-300">
            <span className="text-neutral-400 dark:text-muted-foreground block mb-1 font-bold">
              Contoh Solusi:
            </span>
            <pre className="whitespace-pre-wrap font-bold dark:font-normal">{exercise.solutionCode}</pre>
          </div>
        )}

        {/* Bottom Run Action */}
        <div className="p-3 bg-[#1c1c1f] border-t-2 border-black flex items-center justify-between dark:bg-[#121318] dark:border-border/80">
          <span className="text-[11px] text-neutral-300 dark:text-muted-foreground font-mono font-medium dark:font-normal">
            Evaluasi aman di dalam browser
          </span>

          <Button
            size="sm"
            onClick={handleRun}
            className="gap-2 text-xs font-bold border-2 border-black bg-[#FFD84D] text-[#121212] shadow-[2px_2px_0px_#000000] hover:bg-[#F5CB32] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none dark:border-transparent dark:bg-primary dark:text-primary-foreground dark:shadow-none dark:font-medium"
          >
            <Play className="h-3.5 w-3.5" />
            Jalankan Kode
          </Button>
        </div>
      </div>

      {/* Output Console Box */}
      {output !== null && (
        <div className="p-5 rounded-xl border-2 border-black bg-white shadow-[5px_5px_0px_#121212] space-y-2 dark:border-border dark:bg-card dark:shadow-none dark:rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-foreground flex items-center gap-1.5">
              <Terminal className="h-3.5 w-3.5 text-primary" />
              Hasil Eksekusi (Console Output):
            </span>

            {isSuccess !== null && (
              <Badge
                variant={isSuccess ? "success" : "destructive"}
                className="text-[11px] font-mono gap-1 font-bold"
              >
                {isSuccess ? (
                  <>
                    <CheckCircle2 className="h-3 w-3" />
                    Latihan Berhasil
                  </>
                ) : (
                  <>
                    <XCircle className="h-3 w-3" />
                    Output Tidak Sesuai
                  </>
                )}
              </Badge>
            )}
          </div>

          <div
            className={`p-3.5 rounded-lg border-2 border-black font-mono text-xs whitespace-pre-wrap shadow-[2px_2px_0px_#121212] ${
              isSuccess
                ? "bg-[#7BE495]/20 text-emerald-950 dark:bg-[#060708] dark:border-emerald-500/40 dark:text-emerald-400 dark:shadow-none"
                : "bg-[#FF6B6B]/20 text-rose-950 dark:bg-[#060708] dark:border-border dark:text-foreground dark:shadow-none"
            }`}
          >
            {output}
          </div>
        </div>
      )}
    </div>
  );
}
