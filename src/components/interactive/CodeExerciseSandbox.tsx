"use client";

import { useState } from "react";
import { Play, RotateCcw, Eye, CheckCircle2, XCircle, Terminal, HelpCircle, Code2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { InlineFormattedText } from "@/components/ui/markdown-renderer";
import { useCurriculumProgressStore } from "@/store/useCurriculumProgressStore";
import { useThemeLanguageStore } from "@/store/useThemeLanguageStore";
import { getTranslations } from "@/lib/translations";
import { CodingCharacter } from "@/components/fun/characters/CodingCharacter";

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

  const { saveCodeAttempt } = useCurriculumProgressStore();
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
      setOutput(`Runtime Error: ${errorMsg}`);
      setIsSuccess(false);
    }
  };

  const handleReset = () => {
    setCode(exercise.starterCode);
    setOutput(null);
    setIsSuccess(null);
  };

  // =========================================================================
  // 1. FUN MODE: Playful Code Sandbox Lab
  // =========================================================================
  if (theme === "fun") {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-center gap-4 p-6 rounded-[28px] border-2 border-[#FED7AA] bg-white shadow-[0_10px_30px_rgba(255,155,84,0.08)]">
          <CodingCharacter className="w-16 h-16 shrink-0" />
          <div className="space-y-1 flex-1 text-center sm:text-left">
            <span className="text-[10px] font-black text-[#D97706] bg-[#FFF8E7] px-3 py-1 rounded-full border border-[#FED7AA] inline-block">
              🧪 {t.sandbox.funTitle}
            </span>
            <p className="text-xs font-bold text-[#243447] leading-relaxed">
              <InlineFormattedText text={exercise.prompt} />
            </p>
          </div>
        </div>

        {/* Code Editor */}
        <div className="rounded-[28px] border-2 border-[#FED7AA] bg-[#1E293B] overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.05)]">
          <div className="flex items-center justify-between px-5 py-3 bg-[#0F172A] border-b border-[#334155]">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-[#FF6B6B]" />
              <div className="h-3 w-3 rounded-full bg-[#FFD84D]" />
              <div className="h-3 w-3 rounded-full bg-[#45E0C0]" />
              <span className="text-xs font-mono font-bold text-[#94A3B8] ml-2">sandbox_runner.js</span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleReset}
                className="h-7 text-xs font-bold text-[#94A3B8] hover:text-white rounded-full"
              >
                <RotateCcw className="h-3 w-3 mr-1" />
                <span>{t.sandbox.resetCode}</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSolution(!showSolution)}
                className="h-7 text-xs font-bold text-[#94A3B8] hover:text-white rounded-full"
              >
                <Eye className="h-3 w-3 mr-1" />
                <span>{showSolution ? t.sandbox.hideSolution : t.sandbox.showSolution}</span>
              </Button>
            </div>
          </div>

          <div className="p-4">
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              rows={8}
              className="w-full font-mono text-xs text-[#F8FAFC] bg-transparent border-0 resize-none focus:outline-none leading-relaxed"
              spellCheck={false}
            />
          </div>

          <div className="p-3 bg-[#0F172A] border-t border-[#334155] flex items-center justify-between">
            <span className="text-[11px] font-mono text-[#64748B]">JavaScript (Node.js ES6)</span>
            <Button
              size="sm"
              onClick={handleRun}
              className="rounded-full bg-[#FFD84D] hover:bg-[#FFC933] text-[#243447] font-black text-xs h-8 px-5 shadow-[0_2px_10px_rgba(255,216,77,0.4)]"
            >
              <Play className="h-3.5 w-3.5 mr-1 fill-current" />
              <span>{t.sandbox.runCode}</span>
            </Button>
          </div>
        </div>

        {/* Output */}
        {output !== null && (
          <div className={`p-5 rounded-[24px] border-2 text-xs font-mono space-y-2 ${
            isSuccess
              ? "bg-[#F0FDF4] border-[#86EFAC] text-[#166534]"
              : "bg-[#FFF1F2] border-[#FECDD3] text-[#9F1239]"
          }`}>
            <div className="flex items-center gap-2 font-black">
              {isSuccess ? <CheckCircle2 className="h-4 w-4 text-[#16A34A]" /> : <XCircle className="h-4 w-4 text-[#E11D48]" />}
              <span>{isSuccess ? t.sandbox.successTitle : t.sandbox.outputMismatch}</span>
            </div>
            <pre className="whitespace-pre-wrap text-[11px] leading-relaxed">{output}</pre>
          </div>
        )}
      </div>
    );
  }

  // =========================================================================
  // 2. DARK MODE: Strict Monochrome Terminal Runner (100% Monochrome)
  // =========================================================================
  if (theme === "dark") {
    return (
      <div className="space-y-4 font-mono">
        <div className="p-4 rounded border border-[#222222] bg-[#0A0A0A] space-y-1">
          <div className="flex items-center justify-between text-xs text-[#888888]">
            <span className="text-[#FFFFFF] font-bold">[SANDBOX_SPECIFICATION]</span>
            <span>JS_ES2024</span>
          </div>
          <p className="text-xs text-[#CCCCCC]">
            <InlineFormattedText text={exercise.prompt} />
          </p>
        </div>

        {/* Code Editor Console */}
        <div className="rounded border border-[#222222] bg-[#050505] overflow-hidden">
          <div className="flex items-center justify-between px-3 py-2 border-b border-[#1A1A1A] bg-[#0A0A0A] text-xs">
            <span className="text-[#888888]">RUNTIME_BUFFER</span>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleReset}
                className="h-6 text-[10px] font-mono text-[#888888] hover:text-[#FFFFFF] px-2"
              >
                RESET
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSolution(!showSolution)}
                className="h-6 text-[10px] font-mono text-[#888888] hover:text-[#FFFFFF] px-2"
              >
                {showSolution ? "HIDE_KEY" : "SHOW_KEY"}
              </Button>
            </div>
          </div>

          <div className="p-3">
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              rows={8}
              className="w-full font-mono text-xs text-[#FFFFFF] bg-transparent border-0 resize-none focus:outline-none leading-relaxed"
              spellCheck={false}
            />
          </div>

          <div className="p-2 border-t border-[#1A1A1A] bg-[#0A0A0A] flex items-center justify-between">
            <span className="text-[10px] text-[#666666]">STDOUT_CAPTURE: ENABLED</span>
            <Button
              size="sm"
              onClick={handleRun}
              className="h-7 text-xs font-mono bg-[#FFFFFF] hover:bg-[#E5E5E5] text-[#000000] font-bold px-4 rounded"
            >
              <Play className="h-3 w-3 mr-1 fill-current" />
              <span>RUN_CODE</span>
            </Button>
          </div>
        </div>

        {/* Console Log Stream */}
        {output !== null && (
          <div className="p-3 rounded border border-[#222222] bg-[#0A0A0A] text-xs space-y-1">
            <div className="flex items-center justify-between text-[10px]">
              <span className={isSuccess ? "text-[#FFFFFF] font-bold" : "text-[#888888]"}>
                {isSuccess ? "[STATUS: 0_ERRORS // EXECUTION_PASS]" : "[STATUS: OUTPUT_MISMATCH]"}
              </span>
            </div>
            <pre className="text-xs text-[#CCCCCC] whitespace-pre-wrap">{output}</pre>
          </div>
        )}
      </div>
    );
  }

  // =========================================================================
  // 3. LIGHT MODE: Modern Neo-Brutalist Code Sandbox
  // =========================================================================
  return (
    <div className="space-y-6">
      <div className="p-6 rounded-xl border-2 border-black bg-white shadow-[4px_4px_0px_#121212] space-y-2">
        <span className="text-xs font-mono font-black text-[#121212] bg-[#FFD84D] px-2 py-0.5 rounded border border-black shadow-[1.5px_1.5px_0px_#121212] uppercase">
          {t.sandbox.title}
        </span>
        <p className="text-xs font-bold text-[#121212] leading-relaxed">
          <InlineFormattedText text={exercise.prompt} />
        </p>
      </div>

      <div className="rounded-xl border-2 border-black bg-[#121212] overflow-hidden shadow-[5px_5px_0px_#121212]">
        <div className="flex items-center justify-between px-4 py-2.5 bg-black border-b-2 border-black">
          <span className="text-xs font-mono font-black text-white">editor.js</span>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="h-7 text-xs font-bold text-[#CCCCCC] hover:text-white"
            >
              <RotateCcw className="h-3 w-3 mr-1" />
              <span>{t.sandbox.resetCode}</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSolution(!showSolution)}
              className="h-7 text-xs font-bold text-[#CCCCCC] hover:text-white"
            >
              <Eye className="h-3 w-3 mr-1" />
              <span>{showSolution ? t.sandbox.hideSolution : t.sandbox.showSolution}</span>
            </Button>
          </div>
        </div>

        <div className="p-4">
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            rows={8}
            className="w-full font-mono text-xs text-white bg-transparent border-0 resize-none focus:outline-none leading-relaxed"
            spellCheck={false}
          />
        </div>

        <div className="p-3 bg-black border-t-2 border-black flex items-center justify-between">
          <span className="text-xs font-mono text-[#888888]">ES6 Sandbox</span>
          <Button
            size="sm"
            onClick={handleRun}
            className="rounded-lg border-2 border-black bg-[#FFD84D] hover:bg-[#F5CB32] text-[#121212] font-black text-xs h-8 px-4 shadow-[2px_2px_0px_#FFFFFF]"
          >
            <Play className="h-3.5 w-3.5 mr-1 fill-current" />
            <span>{t.sandbox.runCode}</span>
          </Button>
        </div>
      </div>

      {output !== null && (
        <div className={`p-4 rounded-xl border-2 border-black text-xs font-mono space-y-1.5 shadow-[3px_3px_0px_#121212] ${
          isSuccess ? "bg-[#7BE495]/40 text-[#121212]" : "bg-[#FF6B6B]/20 text-[#121212]"
        }`}>
          <div className="flex items-center gap-2 font-black">
            {isSuccess ? <CheckCircle2 className="h-4 w-4 text-[#15803D]" /> : <XCircle className="h-4 w-4 text-[#E11D48]" />}
            <span>{isSuccess ? t.sandbox.successTitle : t.sandbox.outputMismatch}</span>
          </div>
          <pre className="whitespace-pre-wrap text-[11px]">{output}</pre>
        </div>
      )}
    </div>
  );
}
