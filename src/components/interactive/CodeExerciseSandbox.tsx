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
      <div className="p-6 rounded-xl border-2 border-black bg-white shadow-[5px_5px_0px_#121212] space-y-3 dark:border dark:border-[#1C242D] dark:bg-[#090D12] dark:shadow-none dark:rounded-lg">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-black text-[#121212] bg-[#FFD84D] px-2 py-0.5 rounded border border-black dark:border dark:border-cyan-500/30 dark:bg-cyan-500/10 dark:text-cyan-300 uppercase tracking-wider">
            Latihan Kode Interaktif
          </span>
          <Badge variant="outline" className="text-[10px] font-bold dark:border-[#1C242D] dark:bg-[#0F141A] dark:text-[#94A3B8]">
            In-Browser JavaScript Sandbox
          </Badge>
        </div>

        <h3 className="text-base font-black text-foreground">
          <InlineFormattedText text={exercise.prompt} />
        </h3>

        <div className="p-3 rounded-lg bg-[#EAE4D5] border-2 border-black text-xs text-[#121212] font-mono shadow-[2px_2px_0px_#121212] dark:border dark:border-[#1C242D] dark:bg-[#05070A] dark:text-[#94A3B8] dark:shadow-none">
          <strong className="text-foreground font-bold">Output yang Diharapkan:</strong>
          <pre className="mt-1 text-emerald-800 dark:text-emerald-400 font-bold dark:font-normal whitespace-pre-wrap">
            {exercise.expectedOutput}
          </pre>
        </div>
      </div>

      {/* Code Editor Frame */}
      <div className="rounded-xl border-2 border-black overflow-hidden bg-[#121212] shadow-[5px_5px_0px_#121212] dark:border dark:border-[#1C242D] dark:bg-[#05070A] dark:shadow-none dark:rounded-lg">
        {/* Editor Toolbar */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-[#1c1c1f] border-b-2 border-black text-xs text-neutral-200 font-mono dark:bg-[#090D12] dark:border-b dark:border-[#1C242D] dark:text-[#94A3B8]">
          <div className="flex items-center gap-2.5">
            {/* Control dots in dark mode */}
            <div className="hidden dark:flex items-center gap-1.5 opacity-70">
              <span className="h-2 w-2 rounded-full bg-red-500/80 inline-block" />
              <span className="h-2 w-2 rounded-full bg-amber-500/80 inline-block" />
              <span className="h-2 w-2 rounded-full bg-emerald-500/80 inline-block" />
            </div>
            <div className="flex items-center gap-1.5">
              <Terminal className="h-3.5 w-3.5 text-[#FFD84D] dark:text-cyan-400" />
              <span className="font-bold text-white dark:text-[#CBD5E1]">exercise.js</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowSolution(!showSolution)}
              className="h-7 px-2.5 text-[11px] font-bold border-2 border-black bg-white text-[#121212] shadow-[2px_2px_0px_#000000] hover:bg-[#EAE4D5] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none dark:border dark:border-[#1C242D] dark:bg-[#0F141A] dark:text-[#94A3B8] dark:hover:text-cyan-300 dark:hover:border-cyan-500/40 dark:hover:bg-[#151B22] dark:shadow-none"
            >
              <Eye className="h-3 w-3" />
              <span>{showSolution ? "Sembunyikan Solusi" : "Lihat Solusi"}</span>
            </Button>

            <Button
              size="sm"
              variant="ghost"
              onClick={handleReset}
              className="h-7 px-2.5 text-[11px] font-bold border-2 border-black bg-[#FFD84D] text-[#121212] shadow-[2px_2px_0px_#000000] hover:bg-[#F5CB32] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none dark:border dark:border-[#1C242D] dark:bg-[#0F141A] dark:text-[#94A3B8] dark:hover:text-cyan-300 dark:hover:border-cyan-500/40 dark:hover:bg-[#151B22] dark:shadow-none"
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
          className="w-full h-44 p-4 bg-transparent font-mono text-xs text-emerald-400 dark:text-cyan-300 focus:outline-none resize-none leading-relaxed selection:bg-primary/30"
          spellCheck={false}
          placeholder="// Tulis kode solusi Anda di sini..."
        />

        {/* Solution Hint Box if toggled */}
        {showSolution && (
          <div className="p-3 bg-[#1e1e24] border-t-2 border-black text-xs font-mono text-amber-300 dark:bg-[#090D12] dark:border-t dark:border-[#1C242D] dark:text-cyan-300">
            <span className="text-neutral-400 dark:text-[#8292A6] block mb-1 font-bold">
              Contoh Solusi:
            </span>
            <pre className="whitespace-pre-wrap font-bold dark:font-normal">{exercise.solutionCode}</pre>
          </div>
        )}

        {/* Bottom Run Action */}
        <div className="p-3 bg-[#1c1c1f] border-t-2 border-black flex items-center justify-between dark:bg-[#090D12] dark:border-t dark:border-[#1C242D]">
          <span className="text-[11px] text-neutral-300 dark:text-[#8292A6] font-mono font-medium dark:font-normal">
            Evaluasi aman di dalam browser
          </span>

          <Button
            size="sm"
            onClick={handleRun}
            className="gap-2 text-xs font-bold border-2 border-black bg-[#FFD84D] text-[#121212] shadow-[2px_2px_0px_#000000] hover:bg-[#F5CB32] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none dark:border dark:border-cyan-500/40 dark:bg-cyan-500/15 dark:text-cyan-300 dark:hover:bg-cyan-400 dark:hover:text-[#05070A] dark:shadow-none dark:font-semibold"
          >
            <Play className="h-3.5 w-3.5" />
            Jalankan Kode
          </Button>
        </div>
      </div>

      {/* Output Console Box */}
      {output !== null && (
        <div className="p-5 rounded-xl border-2 border-black bg-white shadow-[5px_5px_0px_#121212] space-y-2 dark:border dark:border-[#1C242D] dark:bg-[#090D12] dark:shadow-none dark:rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-foreground flex items-center gap-1.5">
              <Terminal className="h-3.5 w-3.5 text-primary dark:text-cyan-400" />
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
                ? "bg-[#7BE495]/20 text-emerald-950 dark:bg-[#05070A] dark:border dark:border-emerald-500/40 dark:text-emerald-400 dark:shadow-none"
                : "bg-[#FF6B6B]/20 text-rose-950 dark:bg-[#05070A] dark:border dark:border-red-500/40 dark:text-red-400 dark:shadow-none"
            }`}
          >
            {output}
          </div>
        </div>
      )}
    </div>
  );
}
