"use client";

import { useState, useMemo } from "react";
import {
  Check,
  Copy,
  Terminal,
  Columns2,
  Code2,
  Eye,
  RotateCw,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useThemeLanguageStore } from "@/store/useThemeLanguageStore";

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  showLineNumbers?: boolean;
  className?: string;
}

export function CodeBlock({
  code,
  language = "typescript",
  filename,
  showLineNumbers = true,
  className,
}: CodeBlockProps) {
  const { theme } = useThemeLanguageStore();
  const isDark = theme === "dark";

  const [copied, setCopied] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Check if code has visual HTML/CSS or JS console preview
  const isHtml = useMemo(() => {
    return (
      language.toLowerCase().includes("html") ||
      /<[a-z][\s\S]*>/i.test(code) ||
      code.includes("<div") ||
      code.includes("<style") ||
      code.includes("<span") ||
      code.includes("<button") ||
      code.includes("<p")
    );
  }, [code, language]);

  const isPureCss = useMemo(() => {
    return (
      !isHtml &&
      (language.toLowerCase() === "css" ||
        (!code.includes("<") && code.includes("{") && code.includes("}")))
    );
  }, [code, isHtml, language]);

  const isJsConsole = useMemo(() => {
    const lang = language.toLowerCase();
    return (
      (lang.includes("javascript") || lang.includes("js") || lang.includes("ts")) &&
      code.includes("console.log")
    );
  }, [code, language]);

  const canPreview = isHtml || isPureCss || isJsConsole;

  // View modes: "split" | "code" | "preview"
  const [viewMode, setViewMode] = useState<"split" | "code" | "preview">(
    canPreview ? "split" : "code"
  );

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = code.trim().split("\n");

  // Generate safe sandboxed HTML srcDoc for iframe
  const previewDoc = useMemo(() => {
    if (!canPreview) return "";

    if (isJsConsole) {
      return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace;
      padding: 16px;
      background: ${isDark ? "#0c0c0e" : "#18181b"};
      color: #38bdf8;
      font-size: 12.5px;
      line-height: 1.6;
    }
    .log-line {
      display: flex;
      align-items: flex-start;
      gap: 8px;
      margin-bottom: 6px;
      word-break: break-all;
    }
    .log-prefix { color: #a3e635; user-select: none; font-weight: bold; }
    .log-error { color: #f87171; }
    .log-warn { color: #facc15; }
    .log-content { color: #f4f4f5; }
  </style>
</head>
<body>
  <div id="console-output"></div>
  <script>
    const output = document.getElementById('console-output');
    function addLog(msg, type = 'info') {
      const line = document.createElement('div');
      line.className = 'log-line';
      const prefix = document.createElement('span');
      prefix.className = 'log-prefix';
      prefix.textContent = '> ';
      const content = document.createElement('span');
      content.className = 'log-content' + (type === 'error' ? ' log-error' : type === 'warn' ? ' log-warn' : '');
      content.textContent = typeof msg === 'object' ? JSON.stringify(msg, null, 2) : String(msg);
      line.appendChild(prefix);
      line.appendChild(content);
      output.appendChild(line);
    }
    console.log = (...args) => args.forEach(a => addLog(a, 'info'));
    console.warn = (...args) => args.forEach(a => addLog(a, 'warn'));
    console.error = (...args) => args.forEach(a => addLog(a, 'error'));
    try {
      ${code}
    } catch (err) {
      addLog(err.message, 'error');
    }
  </script>
</body>
</html>`;
    }

    let renderedHtml = code;
    if (isPureCss) {
      const classMatch = code.match(/\.([a-zA-Z0-9_-]+)/);
      const demoClass = classMatch ? classMatch[1] : "box-demo";
      renderedHtml = `
        <style>
          ${code}
          .box-demo {
            padding: 16px 24px;
            background: #0284c7;
            color: white;
            border-radius: 8px;
            font-weight: bold;
            display: inline-block;
          }
        </style>
        <div class="${demoClass}">Contoh Elemen (${demoClass})</div>
      `;
    }

    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      padding: 24px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      background: ${isDark ? "#121214" : "#f8fafc"};
      color: ${isDark ? "#f3f4f6" : "#0f172a"};
    }
    /* Fallback image helper so missing demo images look beautiful */
    img {
      max-width: 100%;
      height: auto;
      object-fit: cover;
      background: #cbd5e1;
      border-radius: 8px;
      display: inline-block;
    }
  </style>
  <script>
    // Smart fallback image for broken demo photos like /avatar.jpg
    window.addEventListener('DOMContentLoaded', () => {
      document.querySelectorAll('img').forEach(img => {
        img.onerror = () => {
          img.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop';
        };
      });
    });
  </script>
</head>
<body>
  ${renderedHtml}
</body>
</html>`;
  }, [code, canPreview, isHtml, isPureCss, isJsConsole, isDark, refreshKey]);

  return (
    <div
      className={cn(
        "rounded-2xl border border-neutral-800 bg-[#121215] overflow-hidden my-6 shadow-md dark:border dark:border-[#222222] dark:bg-[#050505]",
        className
      )}
    >
      {/* Top Global Navigation Bar (Tabs & Actions) */}
      <div className="flex flex-wrap items-center justify-between px-3.5 sm:px-4 py-2 bg-[#19191d] border-b border-neutral-800 dark:bg-[#0A0A0A] dark:border-[#1c1c1c] text-xs gap-2">
        {/* Left: File/Language Badge */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <Terminal className="h-3.5 w-3.5 text-primary" />
            <span className="font-bold text-white dark:text-[#FFFFFF] text-xs font-mono">
              {filename || `${language}`}
            </span>
          </div>
        </div>

        {/* Center/Right: View Mode Toggles if Previewable */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {canPreview && (
            <div className="flex items-center bg-[#121214] border border-neutral-800 rounded-lg p-0.5 text-[11px] font-semibold">
              <button
                type="button"
                onClick={() => setViewMode("split")}
                className={`px-2 py-1 rounded-md transition-all flex items-center gap-1 cursor-pointer ${
                  viewMode === "split"
                    ? "bg-primary text-primary-foreground font-bold shadow-xs"
                    : "text-neutral-400 hover:text-white"
                }`}
                title="Tampilan Split: Kode dan Hasil Output Bersebelahan"
              >
                <Columns2 className="h-3 w-3" />
                <span className="hidden sm:inline">Split (Kode & Hasil)</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode("code")}
                className={`px-2 py-1 rounded-md transition-all flex items-center gap-1 cursor-pointer ${
                  viewMode === "code"
                    ? "bg-primary text-primary-foreground font-bold shadow-xs"
                    : "text-neutral-400 hover:text-white"
                }`}
                title="Hanya Tampilkan Kode"
              >
                <Code2 className="h-3 w-3" />
                <span className="hidden sm:inline">Hanya Kode</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode("preview")}
                className={`px-2 py-1 rounded-md transition-all flex items-center gap-1 cursor-pointer ${
                  viewMode === "preview"
                    ? "bg-primary text-primary-foreground font-bold shadow-xs"
                    : "text-neutral-400 hover:text-white"
                }`}
                title="Hanya Tampilkan Hasil Output"
              >
                <Eye className="h-3 w-3" />
                <span className="hidden sm:inline">Hasil Output</span>
              </button>
            </div>
          )}

          {/* Copy Button */}
          <Button
            size="sm"
            variant="ghost"
            onClick={handleCopy}
            className="h-7 px-2.5 text-[11px] font-bold border border-neutral-700 bg-neutral-800/80 text-neutral-200 hover:bg-neutral-700 active:scale-95 rounded-lg cursor-pointer dark:border dark:border-[#262626] dark:bg-[#121212] dark:text-[#AAAAAA] dark:hover:text-white"
          >
            {copied ? (
              <>
                <Check className="h-3 w-3 text-emerald-400" />
                <span className="text-emerald-400 font-mono text-[10px]">COPIED</span>
              </>
            ) : (
              <>
                <Copy className="h-3 w-3 text-neutral-300" />
                <span className="font-mono text-[10px]">COPY</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Main Content Area */}
      {viewMode === "split" && canPreview ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-neutral-800 dark:divide-[#1c1c1c]">
          {/* Left Column: Code Terminal */}
          <div className="flex flex-col min-w-0 bg-[#0d0d10] dark:bg-[#070707]">
            <div className="px-4 py-2 bg-[#141418] dark:bg-[#0c0c0e] border-b border-neutral-800/80 dark:border-[#1a1a1a] flex items-center justify-between text-[11px] font-mono text-neutral-400">
              <span>TERMINAL CODE</span>
              <span>{lines.length} Baris</span>
            </div>

            <div className="p-4 overflow-x-auto font-mono text-xs leading-relaxed max-h-[460px] overflow-y-auto">
              <pre className="flex">
                {showLineNumbers && (
                  <div
                    className="select-none pr-3.5 text-right text-neutral-600 dark:text-[#444444] border-r border-neutral-800 mr-3.5 shrink-0 font-mono text-xs"
                    aria-hidden="true"
                  >
                    {lines.map((_, i) => (
                      <div key={i}>{i + 1}</div>
                    ))}
                  </div>
                )}
                <code className="text-emerald-400 dark:text-[#E0E0E0] flex-1 whitespace-pre">
                  {code.trim()}
                </code>
              </pre>
            </div>
          </div>

          {/* Right Column: Live Output Preview */}
          <div className="flex flex-col min-w-0 bg-[#0c0c0f] dark:bg-[#050505]">
            {/* Browser Preview Header */}
            <div className="px-4 py-2 bg-[#141418] dark:bg-[#0c0c0e] border-b border-neutral-800/80 dark:border-[#1a1a1a] flex items-center justify-between text-[11px] font-mono">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-rose-500/80" />
                  <span className="w-2 h-2 rounded-full bg-amber-500/80" />
                  <span className="w-2 h-2 rounded-full bg-emerald-500/80" />
                </div>
                <span className="font-bold text-neutral-200 dark:text-neutral-300 ml-1">
                  {isJsConsole ? "Output Console JS" : "Output Hasil Browser"}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[9.5px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  LIVE OUTPUT
                </span>
                <button
                  type="button"
                  onClick={() => setRefreshKey((k) => k + 1)}
                  className="p-1 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                  title="Refresh Tampilan Output"
                >
                  <RotateCw className="h-3 w-3" />
                </button>
              </div>
            </div>

            {/* Sandbox Canvas */}
            <div className="p-4 flex-1 flex items-center justify-center min-h-[280px] max-h-[460px] overflow-auto bg-white/95 dark:bg-[#0c0c0e] relative">
              <iframe
                key={refreshKey}
                srcDoc={previewDoc}
                title="Live Code Output Preview"
                sandbox="allow-scripts"
                className="w-full h-full min-h-[260px] border-0 rounded-lg bg-transparent"
              />
            </div>
          </div>
        </div>
      ) : viewMode === "preview" && canPreview ? (
        /* Full Preview Mode */
        <div className="flex flex-col min-w-0 bg-[#0c0c0f] dark:bg-[#050505]">
          <div className="px-4 py-2 bg-[#141418] dark:bg-[#0c0c0e] border-b border-neutral-800/80 dark:border-[#1a1a1a] flex items-center justify-between text-[11px] font-mono">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              </div>
              <span className="font-bold text-neutral-200">
                {isJsConsole ? "Output Console JS" : "Output Hasil Browser (Layar Penuh)"}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                LIVE
              </span>
              <button
                type="button"
                onClick={() => setRefreshKey((k) => k + 1)}
                className="p-1 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                title="Refresh Tampilan Output"
              >
                <RotateCw className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          <div className="p-6 flex items-center justify-center min-h-[340px] bg-white/95 dark:bg-[#0c0c0e]">
            <iframe
              key={refreshKey}
              srcDoc={previewDoc}
              title="Live Code Output Preview"
              sandbox="allow-scripts"
              className="w-full h-full min-h-[320px] border-0 rounded-lg bg-transparent"
            />
          </div>
        </div>
      ) : (
        /* Full Code Mode (or Non-previewable code) */
        <div className="p-4 overflow-x-auto font-mono text-xs leading-relaxed text-foreground dark:text-[#CCCCCC]">
          <pre className="flex">
            {showLineNumbers && (
              <div
                className="select-none pr-4 text-right text-neutral-600 dark:text-[#444444] border-r border-neutral-800 mr-4 shrink-0 font-mono"
                aria-hidden="true"
              >
                {lines.map((_, i) => (
                  <div key={i}>{i + 1}</div>
                ))}
              </div>
            )}
            <code className="text-emerald-400 dark:text-[#FFFFFF] flex-1 whitespace-pre">
              {code.trim()}
            </code>
          </pre>
        </div>
      )}
    </div>
  );
}
