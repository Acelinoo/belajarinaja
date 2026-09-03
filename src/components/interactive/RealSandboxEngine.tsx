"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Play,
  RotateCcw,
  Eye,
  CheckCircle2,
  XCircle,
  Terminal,
  HelpCircle,
  Code2,
  Layout,
  Copy,
  Check,
  Lightbulb,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCurriculumProgressStore } from "@/store/useCurriculumProgressStore";
import { useThemeLanguageStore } from "@/store/useThemeLanguageStore";
import { getTranslations } from "@/lib/translations";
import { SandboxExercise, SandboxExecutionResult } from "@/lib/sandbox/sandboxTypes";
import { NovaCharacter } from "@/components/fun/characters/NovaCharacter";

interface RealSandboxEngineProps {
  lessonId: string;
  exercise: SandboxExercise;
  onExercisePassed?: () => void;
}

export function RealSandboxEngine({
  lessonId,
  exercise,
  onExercisePassed,
}: RealSandboxEngineProps) {
  const { theme, language } = useThemeLanguageStore();
  const t = getTranslations(language);
  const { saveCodeAttempt } = useCurriculumProgressStore();

  const [code, setCode] = useState(exercise.starterCode);
  const [activeTab, setActiveTab] = useState<"preview" | "console">("console");
  const [executionResult, setExecutionResult] = useState<SandboxExecutionResult | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [hintIndex, setHintIndex] = useState(0);
  const [showSolution, setShowSolution] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Set default view based on exercise type
  useEffect(() => {
    if (exercise.type !== "javascript") {
      setActiveTab("preview");
    } else {
      setActiveTab("console");
    }
  }, [exercise.type]);

  const handleRun = () => {
    setIsRunning(true);
    saveCodeAttempt(lessonId, code);

    setTimeout(() => {
      if (exercise.type === "javascript") {
        executeJavaScript();
      } else {
        executeHtmlCss();
      }
      setIsRunning(false);
    }, 150);
  };

  const executeJavaScript = () => {
    const logs: string[] = [];
    const customConsole = {
      log: (...args: unknown[]) => {
        logs.push(
          args
            .map((arg) => (typeof arg === "object" ? JSON.stringify(arg, null, 2) : String(arg)))
            .join(" ")
        );
      },
      error: (...args: unknown[]) => {
        logs.push("[ERROR] " + args.map((a) => String(a)).join(" "));
      },
      warn: (...args: unknown[]) => {
        logs.push("[WARN] " + args.map((a) => String(a)).join(" "));
      },
    };

    try {
      // Safe sandboxed evaluation
      const runner = new Function("console", `"use strict";\n${code}`);
      const returnValue = runner(customConsole);

      if (returnValue !== undefined) {
        logs.push(
          typeof returnValue === "object"
            ? JSON.stringify(returnValue, null, 2)
            : String(returnValue)
        );
      }

      // Evaluation check
      const logsCombined = logs.join("\n").trim();
      let isSuccess = false;
      let feedback = "";
      let feedbackEn = "";

      if (exercise.validationRegex) {
        const regex =
          typeof exercise.validationRegex === "string"
            ? new RegExp(exercise.validationRegex, "i")
            : exercise.validationRegex;
        isSuccess = regex.test(code) || regex.test(logsCombined);
        feedback = isSuccess
          ? "Bagus sekali! Logika JavaScript berhasil memvalidasi kriteria tantangan."
          : "Sintaks belum sepenuhnya memenuhi target tantangan. Coba periksa petunjuk.";
        feedbackEn = isSuccess
          ? "Great job! JavaScript logic satisfied the challenge criteria."
          : "Syntax didn't fully match the target challenge. Try checking the hint.";
      } else if (exercise.expectedOutput) {
        isSuccess = logsCombined.includes(exercise.expectedOutput.trim());
        feedback = isSuccess
          ? "Bagus sekali! Logika JavaScript menghasilkan output yang tepat."
          : `Output konsol belum sesuai. Diharapkan: "${exercise.expectedOutput}".`;
        feedbackEn = isSuccess
          ? "Great job! Your JavaScript logic produced the correct output."
          : `Console output didn't match. Expected: "${exercise.expectedOutput}".`;
      } else {
        isSuccess = logs.length > 0 || code.trim().length > 10;
        feedback = isSuccess
          ? "Kode berhasil dieksekusi tanpa error!"
          : "Kode berjalan lancar, namun belum ada output di konsol.";
        feedbackEn = isSuccess
          ? "Code executed cleanly without errors!"
          : "Code ran successfully, but produced no console logs.";
      }

      setExecutionResult({
        success: isSuccess,
        logs,
        feedback,
        feedbackEn,
        expected: exercise.expectedOutput,
        received: logsCombined,
      });

      if (isSuccess && onExercisePassed) {
        onExercisePassed();
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      setExecutionResult({
        success: false,
        logs: [`[RUNTIME ERROR] ${errorMsg}`],
        feedback: `Terjadi kesalahan eksekusi runtime: ${errorMsg}. Periksa kembali sintaks JavaScript kamu.`,
        feedbackEn: `Runtime execution error: ${errorMsg}. Please check your JavaScript syntax.`,
      });
    }
  };

  const executeHtmlCss = () => {
    if (!iframeRef.current) return;

    const iframeDoc =
      iframeRef.current.contentDocument || iframeRef.current.contentWindow?.document;
    if (!iframeDoc) return;

    let fullDoc = "";
    if (exercise.type === "flexbox" || exercise.type === "grid" || exercise.type === "box-model") {
      fullDoc = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8" />
            <style>
              body { font-family: system-ui, -apple-system, sans-serif; padding: 16px; margin: 0; color: #0f172a; background: #ffffff; }
              ${code}
            </style>
          </head>
          <body>
            ${exercise.initialHtml || "<div class='container'><div class='item'>Item 1</div><div class='item'>Item 2</div></div>"}
          </body>
        </html>
      `;
    } else {
      fullDoc = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8" />
            <style>
              body { font-family: system-ui, -apple-system, sans-serif; padding: 16px; margin: 0; color: #0f172a; background: #ffffff; }
            </style>
          </head>
          <body>
            ${code}
          </body>
        </html>
      `;
    }

    iframeDoc.open();
    iframeDoc.write(fullDoc);
    iframeDoc.close();

    // Validate DOM / CSS
    let isSuccess = false;
    let feedback = "";
    let feedbackEn = "";

    const cleanCode = code.replace(/\s+/g, " ").toLowerCase();
    if (exercise.validationRegex) {
      const regex =
        typeof exercise.validationRegex === "string"
          ? new RegExp(exercise.validationRegex, "i")
          : exercise.validationRegex;
      isSuccess = regex.test(code);
    } else if (exercise.expectedOutput) {
      const expectedClean = exercise.expectedOutput.replace(/\s+/g, " ").toLowerCase();
      isSuccess = cleanCode.includes(expectedClean);
    } else {
      isSuccess = code.trim().length > 10;
    }

    feedback = isSuccess
      ? "Bagus sekali! Tampilan HTML/CSS berhasil dirender sesuai instruksi."
      : "Periksa kembali aturan selektor CSS atau tag HTML yang kamu gunakan.";
    feedbackEn = isSuccess
      ? "Excellent! HTML/CSS preview rendered correctly according to instructions."
      : "Please double check your CSS selector rules or HTML tags.";

    setExecutionResult({
      success: isSuccess,
      feedback,
      feedbackEn,
      logs: [],
    });

    if (isSuccess && onExercisePassed) {
      onExercisePassed();
    }
  };

  const handleReset = () => {
    setCode(exercise.starterCode);
    setExecutionResult(null);
    setShowHint(false);
    setShowSolution(false);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const title = language === "en" && exercise.titleEn ? exercise.titleEn : exercise.title;
  const instructions =
    language === "en" && exercise.instructionsEn ? exercise.instructionsEn : exercise.instructions;
  const taskGoal = language === "en" && exercise.taskGoalEn ? exercise.taskGoalEn : exercise.taskGoal;
  const hints = language === "en" && exercise.hintsEn ? exercise.hintsEn : exercise.hints;

  return (
    <div className="rounded-xl border border-border bg-card shadow-xs overflow-hidden space-y-0">
      {/* 1. Header Bar with Challenge Description */}
      <div className="p-4 sm:p-5 border-b border-border bg-secondary/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-primary" />
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground">
              INTERACTIVE CODING SANDBOX
            </span>
            <Badge variant="outline" className="text-[10px] font-mono">
              {exercise.type.toUpperCase()}
            </Badge>
          </div>
          <h3 className="text-sm font-bold text-foreground">{title}</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">{instructions}</p>
        </div>

        {theme === "fun" && (
          <div className="hidden sm:flex items-center gap-2 bg-secondary px-3 py-1.5 rounded-lg border border-border">
            <NovaCharacter
              state={
                isRunning
                  ? "thinking"
                  : executionResult?.success
                  ? "celebrating"
                  : executionResult?.success === false
                  ? "encouraging"
                  : "idle"
              }
              className="w-7 h-7 shrink-0"
            />
            <span className="text-[11px] font-bold text-foreground">
              {executionResult?.success
                ? "Hebat, kamu berhasil!"
                : executionResult?.success === false
                ? "Coba periksa lagi kodenya!"
                : "Tulis kode & jalankan!"}
            </span>
          </div>
        )}
      </div>

      {/* 2. Editor Workspace (Code Editor + Tabs) */}
      <div className="p-4 bg-[#0B0F17] text-[#F8FAFC] space-y-2">
        <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2 text-slate-400 font-mono text-[11px]">
            <Code2 className="h-3.5 w-3.5 text-sky-400" />
            <span>
              {exercise.type === "javascript"
                ? "main.js (JavaScript Editor)"
                : exercise.type === "html-css" || exercise.type === "flexbox" || exercise.type === "grid" || exercise.type === "box-model"
                ? "styles.css (CSS & Layout Editor)"
                : "index.html (HTML Editor)"}
            </span>
          </div>

          <button
            type="button"
            onClick={handleCopyCode}
            className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
          >
            {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
            <span>{copied ? "Tersalin" : "Salin Kode"}</span>
          </button>
        </div>

        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          rows={8}
          spellCheck={false}
          className="w-full bg-transparent text-sky-300 font-mono text-xs leading-relaxed focus:outline-none resize-y selection:bg-sky-900"
          placeholder="Tulis kode kamu di sini..."
        />
      </div>

      {/* 3. Action Controls Toolbar */}
      <div className="p-3 bg-secondary/60 border-t border-b border-border flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={handleRun}
            disabled={isRunning}
            className="h-8 text-xs font-bold rounded-md px-3.5 gap-1.5 shadow-xs"
          >
            <Play className="h-3.5 w-3.5 fill-current" />
            <span>{isRunning ? "Mengeksekusi..." : "Jalankan Kode (Run)"}</span>
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={handleReset}
            className="h-8 text-xs font-semibold rounded-md px-2.5 gap-1"
          >
            <RotateCcw className="h-3.5 w-3.5 text-muted-foreground" />
            <span>Reset</span>
          </Button>
        </div>

        <div className="flex items-center gap-1.5">
          {hints && hints.length > 0 && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowHint(!showHint)}
              className="h-8 text-xs font-semibold rounded-md px-2.5 gap-1"
            >
              <Lightbulb className="h-3.5 w-3.5 text-amber-500" />
              <span>{showHint ? "Tutup Petunjuk" : "Petunjuk (Hint)"}</span>
            </Button>
          )}

          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowSolution(!showSolution)}
            className="h-8 text-xs font-semibold rounded-md px-2.5 gap-1"
          >
            <Eye className="h-3.5 w-3.5 text-muted-foreground" />
            <span>{showSolution ? "Tutup Solusi" : "Lihat Solusi"}</span>
          </Button>
        </div>
      </div>

      {/* 4. Hints Drawer */}
      {showHint && hints && hints.length > 0 && (
        <div className="p-4 bg-amber-500/10 border-b border-amber-500/20 text-xs space-y-1">
          <span className="font-bold text-amber-700 dark:text-amber-400 block flex items-center gap-1">
            <Lightbulb className="h-3.5 w-3.5" />
            Petunjuk Penyelesaian:
          </span>
          <p className="text-foreground leading-relaxed">{hints[hintIndex]}</p>
        </div>
      )}

      {/* 5. Solution Drawer */}
      {showSolution && (
        <div className="p-4 bg-secondary/80 border-b border-border text-xs space-y-2">
          <span className="font-bold text-foreground block">Contoh Kode Solusi:</span>
          <pre className="p-3 rounded-md bg-[#0B0F17] text-[#F8FAFC] font-mono text-xs overflow-x-auto border border-border">
            <code>{exercise.solutionCode}</code>
          </pre>
        </div>
      )}

      {/* 6. Live Output / Preview / Console Panel */}
      <div className="p-4 bg-card space-y-3">
        {exercise.type !== "javascript" ? (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Layout className="h-3.5 w-3.5 text-primary" />
                Live Preview Output
              </span>
              <span className="text-[10px] text-muted-foreground font-mono">Rendered HTML/CSS</span>
            </div>
            <div className="rounded-lg border border-border overflow-hidden bg-white">
              <iframe
                ref={iframeRef}
                title="Live Sandbox Preview"
                sandbox="allow-scripts"
                className="w-full h-44 bg-white"
              />
            </div>
          </div>
        ) : null}

        {/* Evaluation Feedback Alert */}
        {executionResult && (
          <div
            className={`p-4 rounded-lg border text-xs space-y-2 ${
              executionResult.success
                ? "border-emerald-500/40 bg-emerald-500/10 text-foreground"
                : "border-red-500/40 bg-red-500/10 text-foreground"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold flex items-center gap-1.5">
                {executionResult.success ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    <span>Latihan Berhasil Diselesaikan!</span>
                  </>
                ) : (
                  <>
                    <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                    <span>Belum Sesuai Target Latihan</span>
                  </>
                )}
              </span>
              <span className="text-[10px] font-mono font-bold">
                {executionResult.success ? "PASSED" : "FAILED"}
              </span>
            </div>

            <p className="leading-relaxed">
              {language === "en" ? executionResult.feedbackEn : executionResult.feedback}
            </p>

            {executionResult.logs && executionResult.logs.length > 0 && (
              <div className="p-2.5 rounded-md bg-[#0B0F17] text-[#F8FAFC] font-mono text-xs space-y-1 border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-bold">Console Output:</span>
                <pre className="whitespace-pre-wrap text-sky-300">
                  {executionResult.logs.join("\n")}
                </pre>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}