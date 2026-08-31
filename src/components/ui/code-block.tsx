"use client";

import { useState } from "react";
import { Check, Copy, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  showLineNumbers?: boolean;
  className?: string;
}

export function CodeBlock({
  code,
  language = "javascript",
  filename,
  showLineNumbers = true,
  className,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const lines = code.trim().split("\n");

  return (
    <div
      className={cn(
        "rounded-lg border-2 border-black bg-[#121212] overflow-hidden my-4 shadow-[4px_4px_0px_#121212] dark:border dark:border-[#1C242D] dark:bg-[#05070A] dark:shadow-none",
        className
      )}
    >
      {/* Top Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#1c1c1f] border-b-2 border-black dark:bg-[#090D12] dark:border-b dark:border-[#1C242D] text-xs text-neutral-200 dark:text-[#94A3B8] font-mono">
        <div className="flex items-center gap-2.5">
          {/* Telemetry Dots for Dark Mode */}
          <div className="hidden dark:flex items-center gap-1.5 opacity-70">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500/80 inline-block" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80 inline-block" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80 inline-block" />
          </div>
          <div className="flex items-center gap-1.5">
            <Terminal className="h-3.5 w-3.5 text-[#FFD84D] dark:text-cyan-400" />
            <span className="font-bold text-white dark:text-[#CBD5E1] dark:font-mono text-xs">{filename || `${language}`}</span>
          </div>
        </div>

        <Button
          size="sm"
          variant="ghost"
          onClick={handleCopy}
          className="h-7 px-2.5 text-[11px] font-bold border-2 border-black bg-[#FFD84D] text-[#121212] shadow-[2px_2px_0px_#000000] hover:bg-[#F5CB32] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none dark:border dark:border-[#1C242D] dark:bg-[#0F141A] dark:shadow-none dark:text-[#94A3B8] dark:hover:text-cyan-300 dark:hover:border-cyan-500/40 dark:hover:bg-[#151B22]"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-700 dark:text-emerald-400" />
              <span className="text-emerald-900 dark:text-emerald-400">Tersalin!</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5 text-[#121212] dark:text-[#94A3B8]" />
              <span>Salin</span>
            </>
          )}
        </Button>
      </div>

      {/* Code Body */}
      <div className="p-4 overflow-x-auto font-mono text-xs leading-relaxed text-foreground dark:text-[#CBD5E1]">
        <pre className="flex">
          {showLineNumbers && (
            <div
              className="select-none pr-4 text-right text-muted-foreground/40 dark:text-[#475569] border-r border-border/40 dark:border-[#1C242D] mr-4 shrink-0 font-mono"
              aria-hidden="true"
            >
              {lines.map((_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
            </div>
          )}
          <code className="text-emerald-400 dark:text-cyan-300 flex-1 whitespace-pre">
            {code.trim()}
          </code>
        </pre>
      </div>
    </div>
  );
}
