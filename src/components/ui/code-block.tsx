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
    const lower = (language || "").toLowerCase();
    return (
      lower.includes("html") ||
      lower.includes("xml") ||
      lower.includes("jsx") ||
      lower.includes("tsx") ||
      /<[a-z][\s\S]*>/i.test(code) ||
      code.includes("<div") ||
      code.includes("<style") ||
      code.includes("<span") ||
      code.includes("<button") ||
      code.includes("<p") ||
      code.includes("<section") ||
      code.includes("<article") ||
      code.includes("<form") ||
      code.includes("<input") ||
      code.includes("<table")
    );
  }, [code, language]);

  const isPureCss = useMemo(() => {
    const lower = (language || "").toLowerCase();
    return (
      !isHtml &&
      (lower === "css" ||
        (!code.includes("<") && code.includes("{") && code.includes("}")))
    );
  }, [code, isHtml, language]);

  const isJsConsole = useMemo(() => {
    const lower = (language || "").toLowerCase();
    return (
      !isHtml &&
      (lower.includes("javascript") || lower.includes("js") || lower.includes("ts")) &&
      code.includes("console.log")
    );
  }, [code, isHtml, language]);

  const canPreview = isHtml || isPureCss || isJsConsole;

  // View modes: "split" (desktop only), "code", "preview"
  const [viewMode, setViewMode] = useState<"split" | "code" | "preview">(
    canPreview ? "split" : "code"
  );

  // Mobile active tab: "code" | "preview"
  const [mobileTab, setMobileTab] = useState<"code" | "preview">("code");

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = code.trim().split("\n");

  // Generate accurate, sandboxed HTML for visual preview
  const previewDoc = useMemo(() => {
    if (!canPreview) return "";

    // 1. JavaScript Console Output Runner
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
      font-size: 12px;
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

    // 2. Pure CSS Output with Smart Elements
    let renderedHtml = code;
    if (isPureCss) {
      const classMatches = Array.from(code.matchAll(/\.([a-zA-Z0-9_-]+)\s*\{/g)).map(
        (m) => m[1]
      );
      const uniqueClasses = Array.from(new Set(classMatches));

      let demoElements = "";
      if (uniqueClasses.length > 0) {
        const hasContainer = uniqueClasses.some(
          (c) => c.includes("container") || c.includes("wrapper") || c.includes("grid") || c.includes("flex")
        );
        const itemClasses = uniqueClasses.filter(
          (c) => !c.includes("container") && !c.includes("wrapper")
        );

        if (hasContainer && itemClasses.length > 0) {
          const containerClass = uniqueClasses.find(
            (c) => c.includes("container") || c.includes("wrapper") || c.includes("grid") || c.includes("flex")
          )!;
          const itemClass = itemClasses[0];
          demoElements = `
            <div class="${containerClass}">
              <div class="${itemClass}">Item 1</div>
              <div class="${itemClass}">Item 2</div>
              <div class="${itemClass}">Item 3</div>
            </div>
          `;
        } else {
          demoElements = uniqueClasses
            .map(
              (cls) => `
            <div class="${cls}">
              <span>Contoh .${cls}</span>
            </div>
          `
            )
            .join("\n");
        }
      } else {
        demoElements = `<div style="padding: 16px; background: #0284c7; color: white; border-radius: 8px; font-weight: bold;">Elemen Contoh CSS</div>`;
      }

      renderedHtml = `
        <style>
          ${code}
        </style>
        <div style="display: flex; flex-direction: column; gap: 12px; width: 100%;">
          ${demoElements}
        </div>
      `;
    }

    // 3. HTML & CSS Component Preview
    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    html, body {
      width: 100%;
      min-height: 100%;
      background: ${isDark ? "#111114" : "#ffffff"};
      color: ${isDark ? "#f3f4f6" : "#0f172a"};
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      line-height: 1.5;
      font-size: 14px;
      padding: 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    /* Natural image sizing & fallback */
    img {
      max-width: 100%;
      display: inline-block;
      vertical-align: middle;
      object-fit: cover;
      border-radius: 6px;
    }
    /* Smart avatar support for avatar examples */
    .avatar-img, .avatar {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      object-fit: cover;
    }
  </style>
  <script>
    // Graceful image fallback so mock photos like /avatar.jpg render neatly
    window.addEventListener('DOMContentLoaded', () => {
      document.querySelectorAll('img').forEach(img => {
        const src = img.getAttribute('src') || '';
        if (!src || src.startsWith('/') || src.includes('avatar') || src.includes('placeholder')) {
          img.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop';
        }
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
        "rounded-2xl border border-neutral-800 bg-[#121215] overflow-hidden my-5 shadow-sm dark:border dark:border-[#222222] dark:bg-[#050505] w-full max-w-full",
        className
      )}
    >
      {/* Top Header Bar (Ultra clean & responsive) */}
      <div className="flex items-center justify-between px-3 sm:px-4 py-2 bg-[#19191d] border-b border-neutral-800 dark:bg-[#0A0A0A] dark:border-[#1c1c1c] text-xs gap-1.5 overflow-x-hidden">
        {/* Left: Terminal File/Language Badge */}
        <div className="flex items-center gap-1.5 min-w-0">
          <Terminal className="h-3.5 w-3.5 text-primary shrink-0" />
          <span className="font-bold text-white dark:text-[#FFFFFF] text-[11px] sm:text-xs font-mono truncate max-w-[90px] sm:max-w-[140px]">
            {filename || `${language}`}
          </span>
        </div>

        {/* Center / Right: View Mode Segmented Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {canPreview && (
            <div className="flex items-center bg-[#101012] dark:bg-[#070707] border border-neutral-800 rounded-lg p-0.5 text-[10px] sm:text-[11px] font-semibold">
              {/* Desktop Split View Button */}
              <button
                type="button"
                onClick={() => setViewMode("split")}
                className={`hidden lg:flex px-2 py-1 rounded-md transition-all items-center gap-1 cursor-pointer ${
                  viewMode === "split"
                    ? "bg-primary text-primary-foreground font-bold shadow-xs"
                    : "text-neutral-400 hover:text-white"
                }`}
                title="Tampilan Split Bersebelahan"
              >
                <Columns2 className="h-3 w-3" />
                <span>Split</span>
              </button>

              {/* Code Tab (Used on both desktop & mobile) */}
              <button
                type="button"
                onClick={() => {
                  setViewMode("code");
                  setMobileTab("code");
                }}
                className={`px-2 py-1 rounded-md transition-all flex items-center gap-1 cursor-pointer ${
                  viewMode === "code" || (mobileTab === "code" && viewMode === "split")
                    ? "bg-primary text-primary-foreground font-bold shadow-xs"
                    : "text-neutral-400 hover:text-white"
                }`}
                title="Tampilkan Kode"
              >
                <Code2 className="h-3 w-3" />
                <span>Kode</span>
              </button>

              {/* Output Tab (Used on both desktop & mobile) */}
              <button
                type="button"
                onClick={() => {
                  setViewMode("preview");
                  setMobileTab("preview");
                }}
                className={`px-2 py-1 rounded-md transition-all flex items-center gap-1 cursor-pointer ${
                  viewMode === "preview" || (mobileTab === "preview" && viewMode === "split")
                    ? "bg-primary text-primary-foreground font-bold shadow-xs"
                    : "text-neutral-400 hover:text-white"
                }`}
                title="Tampilkan Hasil Output"
              >
                <Eye className="h-3 w-3" />
                <span>Hasil</span>
              </button>
            </div>
          )}

          {/* Copy Button */}
          <Button
            size="sm"
            variant="ghost"
            onClick={handleCopy}
            className="h-7 px-2 text-[10px] sm:text-[11px] font-bold border border-neutral-700 bg-neutral-800/80 text-neutral-200 hover:bg-neutral-700 active:scale-95 rounded-lg cursor-pointer shrink-0"
          >
            {copied ? (
              <>
                <Check className="h-3 w-3 text-emerald-400" />
                <span className="text-emerald-400 font-mono text-[9px] sm:text-[10px]">COPIED</span>
              </>
            ) : (
              <>
                <Copy className="h-3 w-3 text-neutral-300" />
                <span className="font-mono text-[9px] sm:text-[10px]">COPY</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* =========================================================================
          DESKTOP SPLIT VIEW (Visible on lg: screens when viewMode === "split")
         ========================================================================= */}
      {viewMode === "split" && canPreview && (
        <div className="hidden lg:grid lg:grid-cols-2 divide-x divide-neutral-800 dark:divide-[#1c1c1c]">
          {/* Left: Code Terminal */}
          <div className="flex flex-col min-w-0 bg-[#0d0d10] dark:bg-[#070707]">
            <div className="px-4 py-2 bg-[#141418] dark:bg-[#0c0c0e] border-b border-neutral-800/80 dark:border-[#1a1a1a] flex items-center justify-between text-[11px] font-mono text-neutral-400">
              <span>TERMINAL CODE</span>
              <span>{lines.length} Baris</span>
            </div>

            <div className="p-4 overflow-x-auto font-mono text-xs leading-relaxed max-h-[420px] overflow-y-auto">
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

          {/* Right: Live Output Preview */}
          <div className="flex flex-col min-w-0 bg-[#0c0c0f] dark:bg-[#050505]">
            <div className="px-4 py-2 bg-[#141418] dark:bg-[#0c0c0e] border-b border-neutral-800/80 dark:border-[#1a1a1a] flex items-center justify-between text-[11px] font-mono">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500/80" />
                <span className="w-2 h-2 rounded-full bg-amber-500/80" />
                <span className="w-2 h-2 rounded-full bg-emerald-500/80" />
                <span className="font-bold text-neutral-200 ml-1">
                  {isJsConsole ? "Output Console" : "Hasil Output Browser"}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[9.5px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  LIVE
                </span>
                <button
                  type="button"
                  onClick={() => setRefreshKey((k) => k + 1)}
                  className="p-1 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                  title="Refresh Output"
                >
                  <RotateCw className="h-3 w-3" />
                </button>
              </div>
            </div>

            <div className="p-4 flex-1 flex items-center justify-center min-h-[260px] max-h-[420px] overflow-auto bg-white dark:bg-[#0c0c0e] relative">
              <iframe
                key={refreshKey}
                srcDoc={previewDoc}
                title="Live Code Output Preview"
                sandbox="allow-scripts"
                className="w-full h-full min-h-[240px] border-0 rounded-lg bg-transparent"
              />
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MOBILE VIEW (Single tabbed view for mobile screens to keep it pristine)
          OR FULL VIEW when explicitly selected on desktop
         ========================================================================= */}
      <div className={cn(viewMode === "split" && canPreview ? "block lg:hidden" : "block")}>
        {(viewMode === "preview" || (viewMode === "split" && mobileTab === "preview")) && canPreview ? (
          /* Output Preview Card */
          <div className="flex flex-col min-w-0 bg-[#0c0c0f] dark:bg-[#050505]">
            <div className="px-3.5 py-1.5 bg-[#141418] dark:bg-[#0c0c0e] border-b border-neutral-800/80 dark:border-[#1a1a1a] flex items-center justify-between text-[11px] font-mono">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="font-bold text-neutral-200 ml-1">
                  {isJsConsole ? "Output Console" : "Hasil Output Browser"}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[9px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  LIVE
                </span>
                <button
                  type="button"
                  onClick={() => setRefreshKey((k) => k + 1)}
                  className="p-1 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                  title="Refresh Output"
                >
                  <RotateCw className="h-3 w-3" />
                </button>
              </div>
            </div>

            <div className="p-3 sm:p-4 flex items-center justify-center min-h-[220px] max-h-[360px] bg-white dark:bg-[#0c0c0e]">
              <iframe
                key={refreshKey}
                srcDoc={previewDoc}
                title="Live Code Output Preview"
                sandbox="allow-scripts"
                className="w-full h-full min-h-[200px] border-0 rounded-lg bg-transparent"
              />
            </div>
          </div>
        ) : (
          /* Code Terminal View */
          <div className="p-3 sm:p-4 overflow-x-auto font-mono text-xs leading-relaxed text-foreground dark:text-[#CCCCCC]">
            <pre className="flex">
              {showLineNumbers && (
                <div
                  className="select-none pr-3 text-right text-neutral-600 dark:text-[#444444] border-r border-neutral-800 mr-3 shrink-0 font-mono text-xs"
                  aria-hidden="true"
                >
                  {lines.map((_, i) => (
                    <div key={i}>{i + 1}</div>
                  ))}
                </div>
              )}
              <code className="text-emerald-400 dark:text-[#FFFFFF] flex-1 whitespace-pre overflow-x-auto">
                {code.trim()}
              </code>
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
