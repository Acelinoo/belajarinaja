import React from "react";

interface QuizThinkingCharacterProps {
  className?: string;
  speechBubbleText?: string;
}

export function QuizThinkingCharacter({
  className = "w-28 h-28",
  speechBubbleText,
}: QuizThinkingCharacterProps) {
  return (
    <div className="relative inline-flex flex-col items-center">
      {speechBubbleText && (
        <div className="mb-2 relative px-3 py-1.5 bg-white border-2 border-[#FFD84D] text-[#243447] text-xs font-black rounded-2xl shadow-[0_4px_12px_rgba(255,216,77,0.25)] animate-bounce text-center max-w-[200px]">
          {speechBubbleText}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-white" />
        </div>
      )}

      <svg
        viewBox="0 0 160 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-label="Quiz Thinking Character"
        role="img"
      >
        {/* Floating Idea / Question Card */}
        <g className="animate-bounce">
          <rect x="110" y="20" width="36" height="46" rx="8" fill="#FFD84D" stroke="#243447" strokeWidth="3" transform="rotate(12 110 20)" />
          <text x="120" y="52" fill="#243447" fontSize="22" fontWeight="900" fontFamily="sans-serif" transform="rotate(12 110 20)">?</text>
        </g>

        {/* Head */}
        <circle cx="70" cy="55" r="28" fill="#FFE2C6" stroke="#243447" strokeWidth="3.5" />

        {/* Hair with cute tuft */}
        <path
          d="M 44 52 C 44 32 56 25 72 25 C 88 25 98 32 98 52 C 90 40 82 38 70 38 C 58 38 50 42 44 52 Z"
          fill="#FF9F43"
        />
        {/* Cute hair strand */}
        <path d="M 72 25 C 72 16 80 14 84 18" stroke="#FF9F43" strokeWidth="4" strokeLinecap="round" fill="none" />

        {/* Inquisitive Eyes (one slightly raised eyebrow) */}
        <circle cx="60" cy="54" r="4.5" fill="#243447" />
        <circle cx="62" cy="52" r="1.5" fill="#FFFFFF" />
        <circle cx="80" cy="54" r="4.5" fill="#243447" />
        <circle cx="82" cy="52" r="1.5" fill="#FFFFFF" />

        {/* Eyebrows */}
        <path d="M 54 45 Q 60 42 66 46" stroke="#243447" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <path d="M 74 43 Q 80 39 86 43" stroke="#243447" strokeWidth="2.5" strokeLinecap="round" fill="none" />

        {/* Curious small mouth */}
        <circle cx="70" cy="67" r="3.5" fill="#FF6B6B" stroke="#243447" strokeWidth="1.5" />

        {/* Hand touching chin in thought */}
        <path d="M 58 92 C 58 84 62 76 68 76" stroke="#243447" strokeWidth="3.5" strokeLinecap="round" fill="none" />
        <circle cx="68" cy="74" r="6" fill="#FFE2C6" stroke="#243447" strokeWidth="2.5" />

        {/* Body / Sweater */}
        <path
          d="M 46 86 C 46 78 54 76 70 76 C 86 76 96 78 98 86 L 104 126 L 36 126 Z"
          fill="#45E0C0"
          stroke="#243447"
          strokeWidth="3.5"
        />

        {/* Sweater pattern stripes */}
        <line x1="44" y1="98" x2="96" y2="98" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
        <line x1="40" y1="112" x2="100" y2="112" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />

        {/* Right arm pointing up to question card */}
        <path d="M 96 86 C 104 80 110 65 116 54" stroke="#243447" strokeWidth="3.5" strokeLinecap="round" fill="none" />
        <circle cx="116" cy="54" r="5" fill="#FFE2C6" stroke="#243447" strokeWidth="2.5" />

        {/* Shadow base */}
        <ellipse cx="70" cy="145" rx="38" ry="5" fill="#FED7AA" opacity="0.6" />
      </svg>
    </div>
  );
}
