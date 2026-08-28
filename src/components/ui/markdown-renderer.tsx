"use client";

import React, { ReactNode } from "react";
import { CodeBlock } from "@/components/ui/code-block";
import { AlertTriangle, Info, CheckCircle2, ShieldAlert, Lightbulb } from "lucide-react";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

interface InlineProps {
  text: string;
  className?: string;
}

/**
 * Parses inline markdown:
 * - `code` -> inline code badge
 * - **bold** or *bold* -> strong element
 * - [label](url) -> link element
 * - __underline/bold__ -> strong element
 */
export function InlineFormattedText({ text, className = "" }: InlineProps) {
  if (!text) return null;

  // Regex to match inline code (`...`), bold (**...** or *...*), markdown links ([...](...))
  // Group 1: code `...`
  // Group 2: bold double **...**
  // Group 3: bold single *...*
  // Group 4: link [...](...)
  const tokenRegex = /(`[^`]+`|\*\*[^*]+\*\*|\*[^*\n]+\*|\[[^\]]+\]\([^)]+\))/g;
  const parts = text.split(tokenRegex);

  const rendered: ReactNode[] = parts.map((part, index) => {
    if (!part) return null;

    // Inline code: `code`
    if (part.startsWith("`") && part.endsWith("`") && part.length >= 2) {
      const codeContent = part.slice(1, -1);
      return (
        <code
          key={index}
          className="px-1.5 py-0.5 mx-0.5 rounded-md bg-muted/90 text-primary font-mono text-[13px] border border-border/60 select-all"
        >
          {codeContent}
        </code>
      );
    }

    // Bold text: **text**
    if (part.startsWith("**") && part.endsWith("**") && part.length >= 4) {
      const boldContent = part.slice(2, -2);
      return (
        <strong key={index} className="font-semibold text-foreground">
          {boldContent}
        </strong>
      );
    }

    // Single asterisk bold / italic: *text*
    if (part.startsWith("*") && part.endsWith("*") && part.length >= 2) {
      const boldContent = part.slice(1, -1);
      return (
        <strong key={index} className="font-semibold text-foreground">
          {boldContent}
        </strong>
      );
    }

    // Markdown links: [title](url)
    if (part.startsWith("[") && part.includes("](") && part.endsWith(")")) {
      const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (linkMatch) {
        return (
          <a
            key={index}
            href={linkMatch[2]}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline underline-offset-2 hover:text-primary/80 transition-colors font-medium"
          >
            {linkMatch[1]}
          </a>
        );
      }
    }

    // Plain text
    return <span key={index}>{part}</span>;
  });

  return <span className={className}>{rendered}</span>;
}

type BlockItem =
  | { type: "code"; language: string; code: string }
  | { type: "h1"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "h4"; text: string }
  | { type: "hr" }
  | { type: "callout"; variant: "info" | "warning" | "security" | "tip"; title?: string; text: string }
  | { type: "quote"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: { num: string; text: string }[] }
  | { type: "p"; text: string };

function parseMarkdownBlocks(content: string): BlockItem[] {
  if (!content) return [];

  // Split by code blocks first
  const rawParts = content.split("```");
  const blocks: BlockItem[] = [];

  for (let i = 0; i < rawParts.length; i++) {
    const part = rawParts[i];

    if (i % 2 === 1) {
      // Inside code block
      const firstLineEnd = part.indexOf("\n");
      const language =
        firstLineEnd !== -1 ? part.slice(0, firstLineEnd).trim() : "javascript";
      const codeText =
        firstLineEnd !== -1 ? part.slice(firstLineEnd + 1) : part;

      blocks.push({
        type: "code",
        language: language || "javascript",
        code: codeText.replace(/\n+$/, ""),
      });
    } else {
      // Normal Markdown text
      const lines = part.split("\n");
      let currentList: { type: "ul"; items: string[] } | { type: "ol"; items: { num: string; text: string }[] } | null = null;
      let currentQuote: string[] = [];

      const flushList = () => {
        if (currentList) {
          blocks.push(currentList);
          currentList = null;
        }
      };

      const flushQuote = () => {
        if (currentQuote.length > 0) {
          blocks.push({
            type: "quote",
            text: currentQuote.join(" "),
          });
          currentQuote = [];
        }
      };

      for (let j = 0; j < lines.length; j++) {
        const line = lines[j];
        const trimmed = line.trim();

        if (!trimmed) {
          flushList();
          flushQuote();
          continue;
        }

        // Horizontal Rule
        if (trimmed === "---" || trimmed === "***" || trimmed === "___") {
          flushList();
          flushQuote();
          blocks.push({ type: "hr" });
          continue;
        }

        // Headings (H1 - H4)
        if (/^#\s+/.test(trimmed)) {
          flushList();
          flushQuote();
          blocks.push({ type: "h1", text: trimmed.replace(/^#\s+/, "") });
          continue;
        }
        if (/^##\s+/.test(trimmed)) {
          flushList();
          flushQuote();
          blocks.push({ type: "h2", text: trimmed.replace(/^##\s+/, "") });
          continue;
        }
        if (/^###\s+/.test(trimmed)) {
          flushList();
          flushQuote();
          blocks.push({ type: "h3", text: trimmed.replace(/^###\s+/, "") });
          continue;
        }
        if (/^####\s+/.test(trimmed)) {
          flushList();
          flushQuote();
          blocks.push({ type: "h4", text: trimmed.replace(/^####\s+/, "") });
          continue;
        }

        // Blockquotes (> Quote)
        if (trimmed.startsWith(">")) {
          flushList();
          currentQuote.push(trimmed.replace(/^>\s*/, ""));
          continue;
        } else {
          flushQuote();
        }

        // Ordered List Item (1. Item, 2. Item)
        const olMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
        if (olMatch) {
          if (!currentList || currentList.type !== "ol") {
            flushList();
            currentList = { type: "ol", items: [] };
          }
          (currentList as { type: "ol"; items: { num: string; text: string }[] }).items.push({
            num: olMatch[1],
            text: olMatch[2],
          });
          continue;
        }

        // Unordered List Item (- Item, * Item, • Item)
        const ulMatch = trimmed.match(/^[-*•]\s+(.*)$/);
        if (ulMatch) {
          if (!currentList || currentList.type !== "ul") {
            flushList();
            currentList = { type: "ul", items: [] };
          }
          (currentList as { type: "ul"; items: string[] }).items.push(ulMatch[1]);
          continue;
        }

        // Security / Warning Alert Callouts (e.g. **Catatan Keamanan:** or **PERINGATAN:**)
        if (/^\*\*(Catatan Keamanan|Keamanan|Security)[^:]*:\*\*/i.test(trimmed)) {
          flushList();
          blocks.push({
            type: "callout",
            variant: "security",
            title: "Catatan Keamanan",
            text: trimmed.replace(/^\*\*(Catatan Keamanan|Keamanan|Security)[^:]*:\*\*\s*/i, ""),
          });
          continue;
        }

        if (/^\*\*(PERINGATAN|Warning|Caution)[^:]*:\*\*/i.test(trimmed)) {
          flushList();
          blocks.push({
            type: "callout",
            variant: "warning",
            title: "Peringatan",
            text: trimmed.replace(/^\*\*(PERINGATAN|Warning|Caution)[^:]*:\*\*\s*/i, ""),
          });
          continue;
        }

        if (/^\*\*(Catatan|Note|Info|Tips|Tip)[^:]*:\*\*/i.test(trimmed)) {
          flushList();
          blocks.push({
            type: "callout",
            variant: "info",
            title: "Catatan Pembelajaran",
            text: trimmed.replace(/^\*\*(Catatan|Note|Info|Tips|Tip)[^:]*:\*\*\s*/i, ""),
          });
          continue;
        }

        // Regular paragraph
        flushList();
        blocks.push({ type: "p", text: trimmed });
      }

      flushList();
      flushQuote();
    }
  }

  return blocks;
}

export function MarkdownRenderer({ content, className = "" }: MarkdownRendererProps) {
  const blocks = parseMarkdownBlocks(content);

  return (
    <div className={`space-y-4 text-foreground/90 ${className}`}>
      {blocks.map((block, index) => {
        switch (block.type) {
          case "code":
            return (
              <div key={index} className="my-4">
                <CodeBlock
                  code={block.code}
                  language={block.language}
                  filename={`snippet.${block.language === "javascript" ? "js" : block.language === "typescript" ? "ts" : block.language}`}
                />
              </div>
            );

          case "h1":
            return (
              <h2
                key={index}
                className="text-xl sm:text-2xl font-bold tracking-tight text-foreground mt-8 mb-4 pb-2 border-b border-border/60 first:mt-0"
              >
                <InlineFormattedText text={block.text} />
              </h2>
            );

          case "h2":
            return (
              <div key={index} className="pt-4 pb-1 mt-6 first:mt-0">
                <h3 className="text-lg sm:text-xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
                  <span className="w-1.5 h-5 rounded-full bg-primary inline-block shrink-0" />
                  <InlineFormattedText text={block.text} />
                </h3>
              </div>
            );

          case "h3":
            return (
              <h4
                key={index}
                className="text-base sm:text-lg font-semibold tracking-tight text-foreground/95 mt-5 mb-2 flex items-center gap-2"
              >
                <InlineFormattedText text={block.text} />
              </h4>
            );

          case "h4":
            return (
              <h5
                key={index}
                className="text-sm sm:text-base font-semibold text-foreground/90 mt-4 mb-1"
              >
                <InlineFormattedText text={block.text} />
              </h5>
            );

          case "hr":
            return <hr key={index} className="my-6 border-border/60" />;

          case "callout": {
            const isSec = block.variant === "security";
            const isWarn = block.variant === "warning";
            const bgBorder = isSec
              ? "bg-rose-500/10 border-rose-500/30 text-rose-200"
              : isWarn
              ? "bg-amber-500/10 border-amber-500/30 text-amber-200"
              : "bg-primary/10 border-primary/30 text-foreground/90";
            const IconComp = isSec
              ? ShieldAlert
              : isWarn
              ? AlertTriangle
              : block.variant === "tip"
              ? Lightbulb
              : Info;
            const iconColor = isSec
              ? "text-rose-400"
              : isWarn
              ? "text-amber-400"
              : "text-primary";

            return (
              <div
                key={index}
                className={`p-4 rounded-xl border flex items-start gap-3 my-4 ${bgBorder}`}
              >
                <IconComp className={`h-5 w-5 shrink-0 mt-0.5 ${iconColor}`} />
                <div className="space-y-1 text-xs sm:text-sm leading-relaxed">
                  {block.title && (
                    <div className={`font-semibold ${iconColor}`}>
                      {block.title}
                    </div>
                  )}
                  <div>
                    <InlineFormattedText text={block.text} />
                  </div>
                </div>
              </div>
            );
          }

          case "quote":
            return (
              <blockquote
                key={index}
                className="p-4 my-4 rounded-xl border border-primary/20 bg-primary/5 text-foreground/90 flex gap-3 italic text-xs sm:text-sm leading-relaxed"
              >
                <Info className="h-5 w-5 text-primary shrink-0 mt-0.5 not-italic" />
                <div className="not-italic">
                  <InlineFormattedText text={block.text} />
                </div>
              </blockquote>
            );

          case "ul":
            return (
              <ul key={index} className="space-y-2.5 my-3 pl-1">
                {block.items.map((item, itemIdx) => (
                  <li
                    key={itemIdx}
                    className="flex items-start gap-2.5 text-xs sm:text-sm leading-relaxed text-foreground/90"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 shrink-0 shadow-[0_0_8px_rgba(99,102,241,0.6)]" />
                    <div className="flex-1">
                      <InlineFormattedText text={item} />
                    </div>
                  </li>
                ))}
              </ul>
            );

          case "ol":
            return (
              <ol key={index} className="space-y-3 my-3 pl-1">
                {block.items.map((item, itemIdx) => (
                  <li
                    key={itemIdx}
                    className="flex items-start gap-3 text-xs sm:text-sm leading-relaxed text-foreground/90"
                  >
                    <span className="flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-md bg-primary/10 text-primary text-[11px] font-bold font-mono border border-primary/20 mt-0.5">
                      {item.num}
                    </span>
                    <div className="flex-1 pt-0.5">
                      <InlineFormattedText text={item.text} />
                    </div>
                  </li>
                ))}
              </ol>
            );

          case "p":
          default:
            return (
              <p
                key={index}
                className="leading-relaxed text-xs sm:text-sm text-foreground/90 mb-3"
              >
                <InlineFormattedText text={block.text} />
              </p>
            );
        }
      })}
    </div>
  );
}
