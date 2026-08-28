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
        "rounded-lg border border-border bg-[#060708] overflow-hidden my-4",
        className
      )}
    >
      {/* Top Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#0E0F12] border-b border-border/80 text-xs text-muted-foreground font-mono">
        <div className="flex items-center gap-2">
          <Terminal className="h-3.5 w-3.5 text-primary" />
          <span>{filename || `${language}`}</span>
        </div>

        <Button
          size="sm"
          variant="ghost"
          onClick={handleCopy}
          className="h-7 px-2 text-[11px] gap-1 text-muted-foreground hover:text-foreground"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-400" />
              <span className="text-emerald-400">Tersalin!</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
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
