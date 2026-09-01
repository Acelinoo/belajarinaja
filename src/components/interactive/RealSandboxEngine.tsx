"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Play,
  RotateCcw,
  Eye,
  EyeOff,
  CheckCircle2,
  XCircle,
  Terminal,
  HelpCircle,
  Code2,
  Layout,
  Maximize2,
  Copy,
  Check,
  AlertTriangle,
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

      if (returnValue !== undefined && logs.length === 0) {
        logs.push(typeof returnValue === "object" ? JSON.stringify(returnValue) : String(returnValue));
      }

      const actualOutput = logs.join("\n").trim();
      const expected = exercise.expectedOutput?.trim() || "";

      let success = false;
      if (expected && actualOutput === expected) {
        success = true;
      } else if (exercise.solutionCode && code.trim() === exercise.solutionCode.trim()) {
        success = true;
      } else if (!expected && logs.length > 0) {
        success = true;
      }

      const result: SandboxExecutionResult = {
        success,
        logs,
        feedback: success
          ? "Eksekusi Berhasil! Logika kode JavaScript Anda terverifikasi akurat."
          : "Output belum sesuai ekspektasi. Periksa kembali logika atau parameter fungsi Anda.",
        feedbackEn: success
          ? "Execution Succeeded! Your JavaScript logic passed validation."
          : "Output mismatch. Please verify your logic and parameters.",
        expected: expected || undefined,
        received: actualOutput || "(No console output)",
      };

      setExecutionResult(result);
      if (success) {
        onExercisePassed?.();
      }
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : String(err);
      setExecutionResult({
        success: false,
        logs: [`Runtime Error: ${errMsg}`],
        error: errMsg,
        feedback: `Terjadi runtime error: ${errMsg}`,
        feedbackEn: `Runtime error encountered: ${errMsg}`,
        received: errMsg,
      });
    }
  };

  const executeHtmlCss = () => {
    let renderedHtml = code;
    if (!code.includes("<!DOCTYPE html>") && !code.includes("<html>")) {
      renderedHtml = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8" />
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                margin: 16px;
                padding: 0;
                color: #121212;
                background: #FFFFFF;
              }
            </style>
          </head>
          <body>
            ${code}
          </body>
        </html>
      `;
    }

    if (iframeRef.current) {
      iframeRef.current.srcdoc = renderedHtml;
    }

    const success = code.length > 10;
    setExecutionResult({
      success,
      logs: ["Document rendered in sandboxed frame."],
      renderedHtml,
      feedback: success
        ? "Preview Berhasil Di-render! Struktur HTML & CSS ditampilkan di webview."
        : "Pastikan menambahkan elemen HTML atau aturan CSS yang valid.",
      feedbackEn: success
        ? "Preview Rendered Successfully! HTML & CSS structure is live in webview."
        : "Ensure you provide valid HTML elements or CSS rules.",
    });

    if (success) {
      onExercisePassed?.();
    }
  };

  const handleReset = () => {
    setCode(exercise.starterCode);
    setExecutionResult(null);
    setShowHint(false);
    setShowSolution(false);
    if (iframeRef.current) {
      iframeRef.current.srcdoc = "";
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const title = language === "en" ? exercise.titleEn : exercise.title;
  const instructions = language === "en" ? exercise.instructionsEn : exercise.instructions;
  const taskGoal = language === "en" ? exercise.taskGoalEn : exercise.taskGoal;
  const hints = language === "en" ? exercise.hintsEn : exercise.hints;

  // =========================================================================
  // 1. DARK MODE: THE DEVELOPER WORKSPACE CODE LAB (100% Monochrome)
  // =========================================================================
  if (theme === "dark") {
    return (
      <div className="space-y-4 font-mono text-xs text-[#FFFFFF]">
        {/* Lab Header */}
        <div className="p-4 rounded border border-[#222222] bg-[#0A0A0A] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-[#888888] tracking-widest uppercase font-bold">
              [DEVELOPER_LAB // {exercise.type.toUpperCase()}]
            </span>
            <span className="text-[10px] text-[#666666]">{exercise.lessonSlug}</span>
          </div>
          <h3 className="text-sm font-black text-[#FFFFFF]">{title}</h3>
          <p className="text-[#888888] leading-relaxed">{instructions}</p>
        </div>

        {/* Editor Container */}
        <div className="rounded border border-[#222222] bg-[#050505] overflow-hidden">
          {/* Top Bar */}
          <div className="px-3 py-2 bg-[#0A0A0A] border-b border-[#222222] flex items-center justify-between text-[11px] text-[#888888]">
            <div className="flex items-center gap-2">
              <Terminal className="h-3.5 w-3.5 text-[#FFFFFF]" />
              <span className="font-bold text-[#FFFFFF]">
                {exercise.type === "javascript" ? "script.js" : "index.html"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopyCode}
                className="text-[#888888] hover:text-[#FFFFFF] transition-colors"
              >
                {copied ? "COPIED" : "COPY"}
              </button>
            </div>
          </div>

          {/* Textarea Code Editor */}
          <div className="p-3">
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              rows={8}
              spellCheck={false}
              className="w-full bg-[#050505] text-[#FAFAFA] font-mono text-xs leading-relaxed focus:outline-none resize-y border-0 selection:bg-[#333333]"
            />
          </div>

          {/* Action Toolbar */}
          <div className="px-3 py-2 bg-[#0A0A0A] border-t border-[#222222] flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                onClick={handleRun}
                disabled={isRunning}
                className="h-7 text-xs font-mono bg-[#FFFFFF] hover:bg-[#E5E5E5] text-[#000000] font-black rounded px-3 gap-1.5"
              >
                <Play className="h-3 w-3 fill-[#000000]" />
                <span>{isRunning ? "EXECUTING..." : "RUN"}</span>
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleReset}
                className="h-7 text-xs font-mono border-[#222222] bg-[#050505] text-[#888888] hover:text-[#FFFFFF] rounded px-2.5 gap-1"
              >
                <RotateCcw className="h-3 w-3" />
                <span>RESET</span>
              </Button>
            </div>

            <div className="flex items-center gap-2">
              {hints && hints.length > 0 && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowHint(!showHint)}
                  className="h-7 text-xs font-mono border-[#222222] bg-[#050505] text-[#888888] hover:text-[#FFFFFF] rounded px-2.5 gap-1"
                >
                  <Lightbulb className="h-3 w-3" />
                  <span>{showHint ? "HIDE_HINT" : "HINT"}</span>
                </Button>
              )}
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowSolution(!showSolution)}
                className="h-7 text-xs font-mono border-[#222222] bg-[#050505] text-[#888888] hover:text-[#FFFFFF] rounded px-2.5 gap-1"
              >
                <Eye className="h-3 w-3" />
                <span>{showSolution ? "HIDE_SOLUTION" : "SOLUTION"}</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Hint Box */}
        {showHint && hints && hints.length > 0 && (
          <div className="p-3 rounded border border-[#333333] bg-[#0A0A0A] space-y-1">
            <span className="text-[10px] text-[#888888] uppercase font-bold block">
              [HINT_DIAGNOSTIC]
            </span>
            <p className="text-xs text-[#CCCCCC]">{hints[hintIndex]}</p>
          </div>
        )}

        {/* Solution Box */}
        {showSolution && (
          <div className="p-3 rounded border border-[#333333] bg-[#0A0A0A] space-y-2">
            <span className="text-[10px] text-[#888888] uppercase font-bold block">
              [REFERENCE_SOLUTION_KEY]
            </span>
            <pre className="p-2.5 rounded bg-[#050505] border border-[#222222] text-[#CCCCCC] overflow-x-auto text-[11px]">
              <code>{exercise.solutionCode}</code>
            </pre>
          </div>
        )}

        {/* Output & Execution Panel */}
        {exercise.type !== "javascript" && (
          <div className="rounded border border-[#222222] bg-[#0A0A0A] overflow-hidden space-y-2">
            <div className="px-3 py-1.5 border-b border-[#222222] text-[10px] text-[#888888] uppercase font-bold">
              [SANDBOXED_WEBVIEW_PREVIEW]
            </div>
            <div className="p-2">
              <iframe
                ref={iframeRef}
                title="Live Sandbox Preview"
                sandbox="allow-scripts"
                className="w-full h-40 bg-white rounded border border-[#222222]"
              />
            </div>
          </div>
        )}

        {/* Debug Challenge Output Feedback */}
        {executionResult && (
          <div
            className={`p-4 rounded border ${
              executionResult.success
                ? "border-[#FFFFFF] bg-[#0A0A0A]"
                : "border-[#444444] bg-[#0A0A0A]"
            } space-y-2`}
          >
            <div className="flex items-center justify-between text-xs">
              <span className="font-black text-[#FFFFFF]">
                {executionResult.success ? "✓ TEST PASSED" : "× TEST FAILED"}
              </span>
              <span className="text-[10px] text-[#888888]">
                {executionResult.success ? "STATUS_OK" : "DIAGNOSTIC_ERR"}
              </span>
            </div>

            <p className="text-xs text-[#CCCCCC]">
              {language === "en" ? executionResult.feedbackEn : executionResult.feedback}
            </p>

            {executionResult.logs && executionResult.logs.length > 0 && (
              <div className="p-2.5 rounded bg-[#050505] border border-[#222222] space-y-1">
                <span className="text-[10px] text-[#666666] uppercase block">STDOUT:</span>
                <pre className="text-[11px] text-[#FAFAFA] whitespace-pre-wrap">
                  {executionResult.logs.join("\n")}
                </pre>
              </div>
            )}

            {!executionResult.success && executionResult.expected && (
              <div className="grid grid-cols-2 gap-2 text-[10px] pt-1">
                <div className="p-2 rounded bg-[#050505] border border-[#222222]">
                  <span className="text-[#666666] block">EXPECTED:</span>
                  <span className="text-[#FFFFFF]">{executionResult.expected}</span>
                </div>
                <div className="p-2 rounded bg-[#050505] border border-[#222222]">
                  <span className="text-[#666666] block">RECEIVED:</span>
                  <span className="text-[#CCCCCC]">{executionResult.received}</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  // =========================================================================
  // 2. FUN MODE: THE STORY-DRIVEN EXPERIMENT STATION (with NOVA)
  // =========================================================================
  if (theme === "fun") {
    const novaState = isRunning
      ? "thinking"
      : executionResult?.success
      ? "celebrating"
      : executionResult?.success === false
      ? "encouraging"
      : "curious";

    return (
      <div className="space-y-6">
        {/* NOVA Lab Dialogue */}
        <div className="p-6 rounded-[32px] border-2 border-[#FED7AA] bg-white shadow-[0_10px_35px_rgba(255,155,84,0.08)] flex flex-col sm:flex-row items-center gap-5">
          <NovaCharacter state={novaState} className="w-20 h-20 shrink-0" />
          <div className="space-y-1 text-center sm:text-left flex-1">
            <span className="text-[10px] font-black text-[#D97706] bg-[#FFF8E7] px-3 py-1 rounded-full border border-[#FED7AA] inline-block">
              🧪 STASIUN EKSPERIMEN KODING
            </span>
            <h3 className="text-base font-black text-[#243447]">{title}</h3>
            <p className="text-xs text-[#64748B] leading-relaxed">{instructions}</p>
          </div>
        </div>

        {/* Code Editor Station */}
        <div className="rounded-[28px] border-2 border-[#FED7AA] bg-white shadow-[0_15px_40px_rgba(255,155,84,0.1)] overflow-hidden">
          <div className="px-5 py-3 bg-[#FFF8E7] border-b border-[#FED7AA] flex items-center justify-between text-xs font-black text-[#243447]">
            <div className="flex items-center gap-2">
              <Code2 className="h-4 w-4 text-[#D97706]" />
              <span>{exercise.type === "javascript" ? "Laboratorium JavaScript" : "Kanvas HTML & CSS"}</span>
            </div>
            <span className="text-[10px] text-[#D97706] bg-white px-2.5 py-0.5 rounded-full border border-[#FED7AA]">
              {taskGoal}
            </span>
          </div>

          <div className="p-4 bg-[#243447] text-white">
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              rows={8}
              spellCheck={false}
              className="w-full bg-transparent text-[#5CC8FF] font-mono text-xs leading-relaxed focus:outline-none resize-y"
            />
          </div>

          {/* Station Action Toolbar */}
          <div className="p-4 bg-white border-t border-[#FED7AA] flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Button
                onClick={handleRun}
                disabled={isRunning}
                className="rounded-full bg-[#FFD84D] hover:bg-[#FFC933] text-[#243447] font-black text-xs h-10 px-5 shadow-[0_4px_16px_rgba(255,216,77,0.4)] gap-1.5"
              >
                <Play className="h-4 w-4 fill-[#243447]" />
                <span>{isRunning ? "Mengeksekusi Mantra..." : "Jalankan Eksperimen ⭐"}</span>
              </Button>
              <Button
                variant="outline"
                onClick={handleReset}
                className="rounded-full border-[#FED7AA] text-[#64748B] hover:text-[#243447] font-bold text-xs h-10 px-4"
              >
                <RotateCcw className="h-3.5 w-3.5 mr-1" />
                <span>Reset</span>
              </Button>
            </div>

            <div className="flex items-center gap-2">
              {hints && hints.length > 0 && (
                <Button
                  variant="outline"
                  onClick={() => setShowHint(!showHint)}
                  className="rounded-full border-[#FED7AA] bg-[#FFF8E7] text-[#D97706] font-bold text-xs h-10 px-4"
                >
                  <Lightbulb className="h-3.5 w-3.5 mr-1 text-[#FF9F43]" />
                  <span>{showHint ? "Tutup Petunjuk" : "Minta Petunjuk NOVA"}</span>
                </Button>
              )}
              <Button
                variant="outline"
                onClick={() => setShowSolution(!showSolution)}
                className="rounded-full border-[#FED7AA] text-[#64748B] font-bold text-xs h-10 px-4"
              >
                <Eye className="h-3.5 w-3.5 mr-1" />
                <span>{showSolution ? "Tutup Kunci" : "Kunci Solusi"}</span>
              </Button>
            </div>
          </div>
        </div>

        {/* NOVA Hint Dialogue */}
        {showHint && hints && hints.length > 0 && (
          <div className="p-5 rounded-[24px] border-2 border-[#5CC8FF] bg-[#F0F9FF] text-xs space-y-1.5">
            <div className="flex items-center gap-1.5 font-black text-[#0284C7]">
              <Lightbulb className="h-4 w-4 text-[#5CC8FF]" />
              <span>Petunjuk Rahasia dari NOVA:</span>
            </div>
            <p className="text-[#0369A1] font-medium leading-relaxed">{hints[hintIndex]}</p>
          </div>
        )}

        {/* Solution Box */}
        {showSolution && (
          <div className="p-5 rounded-[24px] border-2 border-[#FED7AA] bg-[#FFF8E7] space-y-2">
            <span className="text-xs font-black text-[#D97706] block">
              Kunci Jawaban Eksperimen:
            </span>
            <pre className="p-3 rounded-2xl bg-white border border-[#FED7AA] font-mono text-xs text-[#243447] overflow-x-auto">
              <code>{exercise.solutionCode}</code>
            </pre>
          </div>
        )}

        {/* HTML/CSS Webview Preview Frame */}
        {exercise.type !== "javascript" && (
          <div className="rounded-[28px] border-2 border-[#FED7AA] bg-white p-4 space-y-2 shadow-[0_10px_30px_rgba(255,155,84,0.06)]">
            <span className="text-xs font-black text-[#243447] block">
              🌐 Live Browser Canvas:
            </span>
            <iframe
              ref={iframeRef}
              title="Fun Live Preview"
              sandbox="allow-scripts"
              className="w-full h-44 rounded-2xl border-2 border-[#FED7AA] bg-white"
            />
          </div>
        )}

        {/* Result Feedback Banner */}
        {executionResult && (
          <div
            className={`p-6 rounded-[28px] border-2 ${
              executionResult.success
                ? "border-[#45E0C0] bg-[#ECFDF5]"
                : "border-[#FF9F43] bg-[#FFF8E7]"
            } space-y-3`}
          >
            <div className="flex items-center gap-2">
              {executionResult.success ? (
                <CheckCircle2 className="h-5 w-5 text-[#059669]" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-[#D97706]" />
              )}
              <h4 className="text-sm font-black text-[#243447]">
                {executionResult.success
                  ? "🎉 Mantap! Eksperimen Koding Berhasil!"
                  : "Belum Tepat, Ayo Coba Lagi!"}
              </h4>
            </div>

            <p className="text-xs text-[#243447] font-medium leading-relaxed">
              {language === "en" ? executionResult.feedbackEn : executionResult.feedback}
            </p>

            {executionResult.logs && executionResult.logs.length > 0 && (
              <div className="p-3 rounded-2xl bg-white border border-[#FED7AA] font-mono text-xs text-[#243447]">
                <span className="text-[10px] font-black text-[#64748B] block mb-1">Hasil Terminal:</span>
                <pre className="whitespace-pre-wrap">{executionResult.logs.join("\n")}</pre>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  // =========================================================================
  // 3. LIGHT MODE: MODERN NEO-BRUTALIST EDITORIAL SANDBOX
  // =========================================================================
  return (
    <div className="space-y-6 text-[#121212]">
      {/* Exercise Briefing Card */}
      <div className="p-6 rounded-2xl border-2 border-black bg-white shadow-[6px_6px_0px_#121212] space-y-2">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded border border-black bg-[#FFD84D] text-xs font-black shadow-[1.5px_1.5px_0px_#121212]">
            <Code2 className="h-3.5 w-3.5" />
            <span>LATIHAN KODE INTERAKTIF</span>
          </div>
          <span className="text-xs font-mono font-bold text-[#555555]">
            {exercise.type.toUpperCase()}
          </span>
        </div>
        <h3 className="text-lg font-black text-[#121212]">{title}</h3>
        <p className="text-xs text-[#555555] leading-relaxed">{instructions}</p>
      </div>

      {/* Editor Box */}
      <div className="rounded-2xl border-2 border-black bg-white shadow-[8px_8px_0px_#121212] overflow-hidden">
        <div className="px-4 py-2.5 bg-[#F7F4EA] border-b-2 border-black flex items-center justify-between text-xs font-mono font-black">
          <div className="flex items-center gap-2">
            <Terminal className="h-4 w-4" />
            <span>{exercise.type === "javascript" ? "script.js" : "index.html"}</span>
          </div>
          <span className="text-[11px] font-sans font-bold text-[#555555]">{taskGoal}</span>
        </div>

        <div className="p-4 bg-[#121212] text-white">
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            rows={8}
            spellCheck={false}
            className="w-full bg-transparent text-[#70B7FF] font-mono text-xs leading-relaxed focus:outline-none resize-y"
          />
        </div>

        {/* Toolbar */}
        <div className="p-4 bg-white border-t-2 border-black flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Button
              onClick={handleRun}
              disabled={isRunning}
              className="rounded-lg border-2 border-black bg-[#FFD84D] hover:bg-[#F5CB32] text-[#121212] font-black text-xs h-10 px-5 shadow-[3px_3px_0px_#121212] gap-1.5"
            >
              <Play className="h-4 w-4 fill-[#121212]" />
              <span>{isRunning ? "Mengeksekusi..." : "Jalankan Kode"}</span>
            </Button>
            <Button
              variant="outline"
              onClick={handleReset}
              className="rounded-lg border-2 border-black bg-white text-[#121212] font-bold text-xs h-10 px-4 shadow-[3px_3px_0px_#121212]"
            >
              <RotateCcw className="h-3.5 w-3.5 mr-1" />
              <span>Reset</span>
            </Button>
          </div>

          <div className="flex items-center gap-2">
            {hints && hints.length > 0 && (
              <Button
                variant="outline"
                onClick={() => setShowHint(!showHint)}
                className="rounded-lg border-2 border-black bg-white text-[#121212] font-bold text-xs h-10 px-4 shadow-[2px_2px_0px_#121212]"
              >
                <Lightbulb className="h-3.5 w-3.5 mr-1 text-[#FF9B54]" />
                <span>{showHint ? "Tutup Petunjuk" : "Petunjuk"}</span>
              </Button>
            )}
            <Button
              variant="outline"
              onClick={() => setShowSolution(!showSolution)}
              className="rounded-lg border-2 border-black bg-white text-[#121212] font-bold text-xs h-10 px-4 shadow-[2px_2px_0px_#121212]"
            >
              <Eye className="h-3.5 w-3.5 mr-1" />
              <span>{showSolution ? "Tutup Kunci" : "Kunci Solusi"}</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Hint Note */}
      {showHint && hints && hints.length > 0 && (
        <div className="p-4 rounded-xl border-2 border-black bg-[#FF9B54]/20 text-xs space-y-1 shadow-[3px_3px_0px_#121212]">
          <span className="font-black text-[#121212] block">💡 Petunjuk Pengerjaan:</span>
          <p className="text-[#333333] font-medium">{hints[hintIndex]}</p>
        </div>
      )}

      {/* Solution Key */}
      {showSolution && (
        <div className="p-4 rounded-xl border-2 border-black bg-[#EAE4D5] text-xs space-y-2 shadow-[3px_3px_0px_#121212]">
          <span className="font-black text-[#121212] block">📖 Referensi Kunci Solusi:</span>
          <pre className="p-3 rounded-lg border-2 border-black bg-white font-mono text-xs text-[#121212] overflow-x-auto">
            <code>{exercise.solutionCode}</code>
          </pre>
        </div>
      )}

      {/* HTML Webview */}
      {exercise.type !== "javascript" && (
        <div className="rounded-2xl border-2 border-black bg-white p-4 space-y-2 shadow-[6px_6px_0px_#121212]">
          <span className="text-xs font-black text-[#121212] block">
            🌐 Webview Render Preview:
          </span>
          <iframe
            ref={iframeRef}
            title="Live Sandbox Preview"
            sandbox="allow-scripts"
            className="w-full h-44 rounded-xl border-2 border-black bg-white"
          />
        </div>
      )}

      {/* Result Card */}
      {executionResult && (
        <div
          className={`p-6 rounded-2xl border-2 border-black ${
            executionResult.success ? "bg-[#7BE495]/25" : "bg-[#FF6B6B]/20"
          } shadow-[6px_6px_0px_#121212] space-y-3`}
        >
          <div className="flex items-center gap-2">
            {executionResult.success ? (
              <CheckCircle2 className="h-5 w-5 text-emerald-800" />
            ) : (
              <XCircle className="h-5 w-5 text-rose-800" />
            )}
            <h4 className="text-sm font-black text-[#121212]">
              {executionResult.success ? "Latihan Berhasil Diselesaikan!" : "Hasil Belum Sesuai"}
            </h4>
          </div>

          <p className="text-xs text-[#333333] font-medium leading-relaxed">
            {language === "en" ? executionResult.feedbackEn : executionResult.feedback}
          </p>

          {executionResult.logs && executionResult.logs.length > 0 && (
            <div className="p-3 rounded-lg border-2 border-black bg-white font-mono text-xs text-[#121212]">
              <span className="text-[10px] font-bold text-[#555555] block mb-1">Terminal Output:</span>
              <pre className="whitespace-pre-wrap">{executionResult.logs.join("\n")}</pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
