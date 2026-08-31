"use client";

import { useState } from "react";
import { Play, RotateCcw, Eye, CheckCircle2, XCircle, Terminal, HelpCircle, Code2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { InlineFormattedText } from "@/components/ui/markdown-renderer";
import { useGuestProgressStore } from "@/store/useGuestProgressStore";
import { useThemeLanguageStore } from "@/store/useThemeLanguageStore";
import { getTranslations } from "@/lib/translations";
import { CodeLaptopIllustration } from "@/components/fun/illustrations/CodeLaptopIllustration";

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
  const { theme, language } = useThemeLanguageStore();
  const t = getTranslations(language);

  const handleRun = () => {
    saveCodeAttempt(lessonId, code);

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
            (language === "en"
              ? "Code executed without console.log output. Make sure to print the required value."
              : "Kode dijalankan tanpa output console.log. Pastikan mencetak output yang diminta.")
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

  // FUN MODE SANDBOX
  if (theme === "fun") {
    return (
      <div className="space-y-6">
        {/* Fun Challenge Prompt */}
        <div className="flex flex-col sm:flex-row items-center gap-4 p-6 rounded-3xl border-2 border-[#E2E8F0] bg-white shadow-[0_10px_30px_rgba(255,155,84,0.08)]">
          <CodeLaptopIllustration className="w-16 h-16 shrink-0" />
          <div className="space-y-2 flex-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <Badge className="bg-[#FFF8E7] text-[#FF9F43] border border-[#FED7AA] text-[10px] font-black rounded-full">
                {t.sandbox.funTitle}
              </Badge>
            </div>
            <h3 className="text-sm sm:text-base font-black text-[#243447]">
              <InlineFormattedText text={exercise.prompt} />
            </h3>
            <div className="p-3 rounded-2xl bg-[#FFF8E7] border border-[#FED7AA] text-xs font-mono text-[#243447]">
              <strong className="text-[#D97706] font-black block mb-0.5">Target Output:</strong>
              <pre className="text-[#16A34A] font-bold whitespace-pre-wrap">{exercise.expectedOutput}</pre>
            </div>
          </div>
        </div>

        {/* Fun Editor Box */}
        <div className="rounded-3xl border-2 border-[#E2E8F0] overflow-hidden bg-[#243447] shadow-[0_10px_30px_rgba(0,0,0,0.05)]">
          <div className="flex items-center justify-between px-5 py-3 bg-[#1E293B] border-b border-[#334155] text-xs text-white font-mono">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-[#FF6B6B] inline-block" />
              <span className="h-3 w-3 rounded-full bg-[#FFD84D] inline-block" />
              <span className="h-3 w-3 rounded-full bg-[#5EDC81] inline-block" />
              <span className="font-black text-white ml-2">sandbox.js</span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowSolution(!showSolution)}
                className="h-7 px-3 text-[11px] font-black rounded-full bg-white/10 hover:bg-white/20 text-white"
              >
                <Eye className="h-3 w-3 mr-1" />
                <span>{showSolution ? "Tutup Solusi" : "Solusi"}</span>
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleReset}
                className="h-7 px-3 text-[11px] font-black rounded-full bg-white/10 hover:bg-white/20 text-white"
              >
                <RotateCcw className="h-3 w-3 mr-1" />
                <span>Reset</span>
              </Button>
            </div>
          </div>

          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full h-44 p-4 bg-transparent font-mono text-xs text-[#5CC8FF] focus:outline-none resize-none leading-relaxed"
            spellCheck={false}
            placeholder="// Tulis kode kamu di sini..."
          />

          {showSolution && (
            <div className="p-4 bg-[#1E293B] border-t border-[#334155] text-xs font-mono text-[#FFD84D]">
              <span className="text-[#94A3B8] block mb-1 font-bold">Contoh Solusi:</span>
              <pre className="whitespace-pre-wrap">{exercise.solutionCode}</pre>
            </div>
          )}

          <div className="p-4 bg-[#1E293B] border-t border-[#334155] flex items-center justify-between">
            <span className="text-xs text-[#94A3B8] font-medium">Browser Sandbox Engine</span>
            <Button
              size="sm"
              onClick={handleRun}
              className="gap-2 text-xs font-black rounded-full px-5 bg-[#FFD84D] hover:bg-[#FFC933] text-[#243447]"
            >
              <Play className="h-3.5 w-3.5" />
              {t.sandbox.runCode}
            </Button>
          </div>
        </div>

        {/* Fun Output */}
        {output !== null && (
          <div className="p-5 rounded-3xl border-2 border-[#E2E8F0] bg-white shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-[#243447] flex items-center gap-1.5">
                <Terminal className="h-3.5 w-3.5 text-[#5CC8FF]" />
                {t.sandbox.consoleOutput}
              </span>
              <Badge className={`text-[11px] font-black rounded-full ${isSuccess ? "bg-[#DCFCE7] text-[#166534]" : "bg-[#FFE4E6] text-[#9F1239]"}`}>
                {isSuccess ? t.sandbox.resultPassed : t.sandbox.resultFailed}
              </Badge>
            </div>
            <div className={`p-4 rounded-2xl font-mono text-xs whitespace-pre-wrap ${isSuccess ? "bg-[#F0FDF4] text-[#166534]" : "bg-[#FFF1F2] text-[#9F1239]"}`}>
              {output}
            </div>
          </div>
        )}
      </div>
    );
  }

  // STANDARD LIGHT & DARK CODE SANDBOX
  return (
    <div className="space-y-6">
      {/* Prompt Card */}
      <div className="p-6 rounded-xl border-2 border-black bg-white shadow-[5px_5px_0px_#121212] space-y-3 dark:border dark:border-[#1C242D] dark:bg-[#090D12] dark:shadow-none dark:rounded-lg">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-black text-[#121212] bg-[#FFD84D] px-2 py-0.5 rounded border border-black dark:border dark:border-cyan-500/30 dark:bg-cyan-500/10 dark:text-cyan-300 uppercase tracking-wider">
            {t.sandbox.title}
          </span>
          <Badge variant="outline" className="text-[10px] font-bold dark:border-[#1C242D] dark:bg-[#0F141A] dark:text-[#94A3B8]">
            In-Browser JavaScript Sandbox
          </Badge>
        </div>

        <h3 className="text-base font-black text-foreground">
          <InlineFormattedText text={exercise.prompt} />
        </h3>

        <div className="p-3 rounded-lg bg-[#EAE4D5] border-2 border-black text-xs text-[#121212] font-mono shadow-[2px_2px_0px_#121212] dark:border dark:border-[#1C242D] dark:bg-[#05070A] dark:text-[#94A3B8] dark:shadow-none">
          <strong className="text-foreground font-bold">{t.sandbox.instructions}:</strong>
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
            <div className="hidden dark:flex items-center gap-1.5 opacity-70">
              <span className="h-2 w-2 rounded-full bg-red-500/80 inline-block" />
              <span className="h-2 w-2 rounded-full bg-amber-500/80 inline-block" />
              <span className="h-2 w-2 rounded-full bg-emerald-500/80 inline-block" />
            </div>
            <div className="flex items-center gap-1.5">
              <Code2 className="h-3.5 w-3.5 text-[#FFD84D] dark:text-cyan-400" />
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
              <span>{showSolution ? "Tutup Solusi" : "Lihat Solusi"}</span>
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
            {t.sandbox.runCode}
          </Button>
        </div>
      </div>

      {/* Output Console Box */}
      {output !== null && (
        <div className="p-5 rounded-xl border-2 border-black bg-white shadow-[5px_5px_0px_#121212] space-y-2 dark:border dark:border-[#1C242D] dark:bg-[#090D12] dark:shadow-none dark:rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-foreground flex items-center gap-1.5">
              <Terminal className="h-3.5 w-3.5 text-primary dark:text-cyan-400" />
              {t.sandbox.consoleOutput}
            </span>

            {isSuccess !== null && (
              <Badge
                variant={isSuccess ? "success" : "destructive"}
                className="text-[11px] font-mono gap-1 font-bold"
              >
                {isSuccess ? (
                  <>
                    <CheckCircle2 className="h-3 w-3" />
                    {t.sandbox.resultPassed}
                  </>
                ) : (
                  <>
                    <XCircle className="h-3 w-3" />
                    {t.sandbox.resultFailed}
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

