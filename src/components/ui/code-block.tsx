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
        "rounded-lg border-2 border-black bg-[#121212] overflow-hidden my-4 shadow-[4px_4px_0px_#121212] dark:border-border dark:bg-[#060708] dark:shadow-none",
        className
      )}
    >
      {/* Top Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#1c1c1f] border-b-2 border-black dark:bg-[#0E0F12] dark:border-border/80 text-xs text-neutral-200 dark:text-muted-foreground font-mono">
        <div className="flex items-center gap-2">
          <Terminal className="h-3.5 w-3.5 text-[#FFD84D] dark:text-primary" />
          <span className="font-bold text-white dark:text-foreground">{filename || `${language}`}</span>
        </div>

        <Button
          size="sm"
          variant="ghost"
          onClick={handleCopy}
          className="h-7 px-2.5 text-[11px] font-bold border-2 border-black bg-[#FFD84D] text-[#121212] shadow-[2px_2px_0px_#000000] hover:bg-[#F5CB32] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none dark:border-transparent dark:bg-transparent dark:shadow-none dark:text-muted-foreground dark:hover:text-foreground dark:hover:bg-accent"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-700 dark:text-emerald-400" />
              <span className="text-emerald-900 dark:text-emerald-400">Tersalin!</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5 text-[#121212] dark:text-muted-foreground" />
              <span>Salin</span>
            </>
          )}
        </Button>
      </div>

      {/* Code Body */}
      <div className="p-4 overflow-x-auto font-mono text-xs leading-relaxed text-foreground">
        <pre className="flex">
          {showLineNumbers && (
            <div
              className="select-none pr-4 text-right text-muted-foreground/40 border-r border-border/40 mr-4 shrink-0"
              aria-hidden="true"
            >
              {lines.map((_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
            </div>
          )}
          <code className="text-emerald-400 flex-1 whitespace-pre">
            {code.trim()}
          </code>
        </pre>
      </div>
    </div>
  );
}
