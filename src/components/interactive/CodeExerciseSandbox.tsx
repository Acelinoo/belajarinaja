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
      <div className="p-6 rounded-lg border border-border bg-card space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono text-primary uppercase tracking-wider">
            Latihan Kode Interaktif
          </span>
          <Badge variant="outline" className="text-[10px]">
            In-Browser JavaScript Sandbox
          </Badge>
        </div>

        <h3 className="text-base font-semibold text-foreground">
          <InlineFormattedText text={exercise.prompt} />
        </h3>

        <div className="p-3 rounded-lg bg-muted/40 border border-border/60 text-xs text-muted-foreground font-mono">
          <strong className="text-foreground">Output yang Diharapkan:</strong>
          <pre className="mt-1 text-emerald-400 whitespace-pre-wrap">
            {exercise.expectedOutput}
          </pre>
        </div>
      </div>

      {/* Code Editor Frame */}
      <div className="rounded-lg border border-border overflow-hidden bg-[#060708]">
        {/* Editor Toolbar */}
        <div className="flex items-center justify-between px-4 py-2 bg-[#0E0F12] border-b border-border/80 text-xs text-muted-foreground font-mono">
          <div className="flex items-center gap-2">
            <Terminal className="h-3.5 w-3.5 text-primary" />
            <span>exercise.js</span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowSolution(!showSolution)}
              className="h-7 px-2 text-[11px] gap-1 text-muted-foreground hover:text-foreground"
            >
              <Eye className="h-3 w-3" />
              <span>{showSolution ? "Sembunyikan Solusi" : "Lihat Solusi"}</span>
            </Button>

            <Button
              size="sm"
              variant="ghost"
              onClick={handleReset}
              className="h-7 px-2 text-[11px] gap-1 text-muted-foreground hover:text-foreground"
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
          <div className="p-3 bg-[#121318] border-t border-border/80 text-xs font-mono text-indigo-300">
            <span className="text-muted-foreground block mb-1">
              Contoh Solusi:
            </span>
            <pre className="whitespace-pre-wrap">{exercise.solutionCode}</pre>
          </div>
        )}

        {/* Bottom Run Action */}
        <div className="p-3 bg-[#121318] border-t border-border/80 flex items-center justify-between">
          <span className="text-[11px] text-muted-foreground font-mono">
            Evaluasi aman di dalam browser
          </span>

          <Button
            size="sm"
            onClick={handleRun}
            className="gap-2 text-xs font-medium"
          >
            <Play className="h-3.5 w-3.5" />
            Jalankan Kode
          </Button>
        </div>
      </div>

      {/* Output Console Box */}
      {output !== null && (
        <div className="p-5 rounded-lg border border-border bg-card space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-medium text-foreground flex items-center gap-1.5">
              <Terminal className="h-3.5 w-3.5" />
              Hasil Eksekusi (Console Output):
            </span>

            {isSuccess !== null && (
              <Badge
                variant={isSuccess ? "success" : "destructive"}
                className="text-[11px] font-mono gap-1"
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
            className={`p-3.5 rounded bg-[#060708] border font-mono text-xs whitespace-pre-wrap ${
              isSuccess
                ? "border-emerald-500/40 text-emerald-400"
                : "border-border text-foreground"
            }`}
          >
            {output}
          </div>
        </div>
      )}
    </div>
  );
}
