"use client";

import { ReactNode } from "react";
import { CodeBlock } from "@/components/ui/code-block";
import { AlertTriangle, Info, ShieldAlert, Lightbulb } from "lucide-react";

interface InlineProps {
  text: string;
  className?: string;
}

export function InlineFormattedText({ text, className = "" }: InlineProps) {
  if (!text) return null;

  // Inline token parser
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
          className="px-1.5 py-0.5 mx-0.5 rounded-md border-2 border-black bg-[#FFD84D] text-[#121212] font-mono text-[12.5px] font-bold shadow-[2px_2px_0px_#121212] select-all dark:border dark:border-[#222222] dark:bg-[#0A0A0A] dark:text-[#FFFFFF] dark:shadow-none dark:font-mono"
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
            className="text-primary underline underline-offset-2 hover:text-primary/80 transition-colors font-medium dark:text-[#FFFFFF] dark:hover:text-[#CCCCCC]"
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
  | {
      type: "callout";
      variant: "info" | "warning" | "security" | "tip";
      title?: string;
      text: string;
    }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: { num: string; text: string }[] }
  | { type: "quote"; text: string }
  | { type: "p"; text: string };

function parseMarkdownBlocks(rawMarkdown: string): BlockItem[] {
  if (!rawMarkdown) return [];

  const normalized = rawMarkdown.replace(/\r\n/g, "\n");
  const rawBlocks = normalized.split("\n\n");
  const parsed: BlockItem[] = [];

  let inFencedCode = false;
  let codeLang = "typescript";
  let codeBuffer: string[] = [];

  const lines = normalized.split("\n");
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    // Code block start/end
    if (trimmed.startsWith("```")) {
      if (!inFencedCode) {
        inFencedCode = true;
        codeLang = trimmed.slice(3).trim() || "typescript";
        codeBuffer = [];
        i++;
        continue;
      } else {
        inFencedCode = false;
        parsed.push({
          type: "code",
          language: codeLang,
          code: codeBuffer.join("\n"),
        });
        codeBuffer = [];
        i++;
        continue;
      }
    }

    if (inFencedCode) {
      codeBuffer.push(line);
      i++;
      continue;
    }

    // Empty line skip
    if (!trimmed) {
      i++;
      continue;
    }

    // Headings
    if (trimmed.startsWith("# ")) {
      parsed.push({ type: "h1", text: trimmed.slice(2) });
      i++;
      continue;
    }
    if (trimmed.startsWith("## ")) {
      parsed.push({ type: "h2", text: trimmed.slice(3) });
      i++;
      continue;
    }
    if (trimmed.startsWith("### ")) {
      parsed.push({ type: "h3", text: trimmed.slice(4) });
      i++;
      continue;
    }

    // Callouts: > [!NOTE], > [!WARNING], > [!SECURITY], > [!TIP]
    if (trimmed.startsWith("> [!")) {
      const calloutTypeMatch = trimmed.match(/^>\s*\[!(NOTE|WARNING|SECURITY|TIP|IMPORTANT|CAUTION)\]\s*(.*)$/i);
      if (calloutTypeMatch) {
        const rawType = calloutTypeMatch[1].toUpperCase();
        let variant: "info" | "warning" | "security" | "tip" = "info";
        if (rawType === "WARNING" || rawType === "CAUTION") variant = "warning";
        else if (rawType === "SECURITY") variant = "security";
        else if (rawType === "TIP") variant = "tip";

        const title = calloutTypeMatch[2].trim() || rawType;
        const calloutLines: string[] = [];
        i++;
        while (i < lines.length && lines[i].trim().startsWith(">")) {
          calloutLines.push(lines[i].trim().replace(/^>\s?/, ""));
          i++;
        }
        parsed.push({
          type: "callout",
          variant,
          title,
          text: calloutLines.join(" "),
        });
        continue;
      }
    }

    // Standard blockquote: > ...
    if (trimmed.startsWith(">")) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith(">")) {
        quoteLines.push(lines[i].trim().replace(/^>\s?/, ""));
        i++;
      }
      parsed.push({ type: "quote", text: quoteLines.join(" ") });
      continue;
    }

    // Unordered list: - item or * item
    if (/^[-*]\s+/.test(trimmed)) {
      const listItems: string[] = [];
      while (i < lines.length && /^[-*]\s+/.test(lines[i].trim())) {
        listItems.push(lines[i].trim().replace(/^[-*]\s+/, ""));
        i++;
      }
      parsed.push({ type: "ul", items: listItems });
      continue;
    }

    // Ordered list: 1. item
    if (/^\d+\.\s+/.test(trimmed)) {
      const listItems: { num: string; text: string }[] = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i].trim())) {
        const match = lines[i].trim().match(/^(\d+)\.\s+(.*)$/);
        if (match) {
          listItems.push({ num: match[1], text: match[2] });
        }
        i++;
      }
      parsed.push({ type: "ol", items: listItems });
      continue;
    }

    // Paragraph
    const paragraphLines: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() &&
      !lines[i].trim().startsWith("#") &&
      !lines[i].trim().startsWith("```") &&
      !lines[i].trim().startsWith(">") &&
      !/^[-*]\s+/.test(lines[i].trim()) &&
      !/^\d+\.\s+/.test(lines[i].trim())
    ) {
      paragraphLines.push(lines[i].trim());
      i++;
    }
    if (paragraphLines.length > 0) {
      parsed.push({ type: "p", text: paragraphLines.join(" ") });
    }
  }

  return parsed;
}

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({ content, className = "" }: MarkdownRendererProps) {
  const blocks = parseMarkdownBlocks(content);

  return (
    <div className={`space-y-4 text-xs sm:text-sm leading-relaxed ${className}`}>
      {blocks.map((block, index) => {
        switch (block.type) {
          case "code":
            return (
              <CodeBlock
                key={index}
                code={block.code}
                language={block.language}
                filename={`${block.language}_example`}
              />
            );

          case "h1":
            return (
              <h1
                key={index}
                className="text-xl sm:text-2xl font-black tracking-tight text-foreground mt-6 mb-3 pb-2 border-b-2 border-black dark:border-b dark:border-[#222222]"
              >
                <InlineFormattedText text={block.text} />
              </h1>
            );

          case "h2":
            return (
              <h2
                key={index}
                className="text-base sm:text-lg font-black tracking-tight text-foreground mt-5 mb-2 flex items-center gap-2"
              >
                <span className="inline-block w-2.5 h-2.5 bg-[#FFD84D] border border-black dark:bg-[#FFFFFF] dark:border-0 rounded-none shadow-[1px_1px_0px_#121212] dark:shadow-none" />
                <InlineFormattedText text={block.text} />
              </h2>
            );

          case "h3":
            return (
              <h3
                key={index}
                className="text-sm sm:text-base font-bold text-foreground mt-4 mb-1.5"
              >
                <InlineFormattedText text={block.text} />
              </h3>
            );

          case "callout": {
            const isSec = block.variant === "security";
            const isWarn = block.variant === "warning";
            const isTip = block.variant === "tip";
            const bgBorder = isSec
              ? "bg-[#FF6B6B]/15 border-2 border-black shadow-[4px_4px_0px_#121212] text-[#121212] dark:bg-[#111111] dark:border dark:border-[#333333] dark:text-[#CCCCCC] dark:shadow-none"
              : isWarn
              ? "bg-[#FF9B54]/20 border-2 border-black shadow-[4px_4px_0px_#121212] text-[#121212] dark:bg-[#111111] dark:border dark:border-[#333333] dark:text-[#CCCCCC] dark:shadow-none"
              : isTip
              ? "bg-[#FFD84D]/25 border-2 border-black shadow-[4px_4px_0px_#121212] text-[#121212] dark:bg-[#111111] dark:border dark:border-[#333333] dark:text-[#CCCCCC] dark:shadow-none"
              : "bg-[#70B7FF]/20 border-2 border-black shadow-[4px_4px_0px_#121212] text-[#121212] dark:bg-[#0A0A0A] dark:border dark:border-[#222222] dark:text-[#CCCCCC] dark:shadow-none";
            const IconComp = isSec
              ? ShieldAlert
              : isWarn
              ? AlertTriangle
              : isTip
              ? Lightbulb
              : Info;
            const iconColor = isSec
              ? "text-rose-700 dark:text-[#FFFFFF]"
              : isWarn
              ? "text-amber-800 dark:text-[#FFFFFF]"
              : isTip
              ? "text-amber-900 dark:text-[#FFFFFF]"
              : "text-blue-800 dark:text-[#FFFFFF]";

            return (
              <div
                key={index}
                className={`p-4 rounded-lg flex items-start gap-3 my-4 ${bgBorder}`}
              >
                <IconComp className={`h-5 w-5 shrink-0 mt-0.5 ${iconColor}`} />
                <div className="space-y-1 text-xs sm:text-sm leading-relaxed">
                  {block.title && (
                    <div className={`font-black uppercase tracking-wide text-xs font-mono ${iconColor}`}>
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
                className="p-4 my-4 rounded-lg border-2 border-black bg-[#EAE4D5] shadow-[4px_4px_0px_#121212] text-[#121212] flex gap-3 italic text-xs sm:text-sm leading-relaxed dark:border dark:border-[#222222] dark:bg-[#0A0A0A] dark:text-[#CCCCCC] dark:shadow-none"
              >
                <Info className="h-5 w-5 text-black dark:text-[#FFFFFF] shrink-0 mt-0.5 not-italic" />
                <div className="not-italic font-medium">
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
                    className="flex items-start gap-2.5 text-xs sm:text-sm leading-relaxed text-foreground/90 font-medium dark:font-normal"
                  >
                    <span className="h-2 w-2 rounded-none bg-[#FFD84D] border border-black shrink-0 mt-1.5 dark:rounded-none dark:border-0 dark:h-1.5 dark:w-1.5 dark:bg-[#FFFFFF]" />
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
                    className="flex items-start gap-3 text-xs sm:text-sm leading-relaxed text-foreground/90 font-medium dark:font-normal"
                  >
                    <span className="flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-md border-2 border-black bg-[#FFD84D] text-[#121212] text-[11px] font-black font-mono shadow-[1.5px_1.5px_0px_#121212] mt-0.5 dark:border dark:border-[#222222] dark:bg-[#111111] dark:text-[#FFFFFF] dark:shadow-none dark:font-mono">
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
