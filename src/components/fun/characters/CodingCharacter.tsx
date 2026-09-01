import React from "react";

interface CodingCharacterProps {
  className?: string;
  speechBubbleText?: string;
}

export function CodingCharacter({
  className = "w-28 h-28",
  speechBubbleText,
}: CodingCharacterProps) {
  return (
    <div className="relative inline-flex flex-col items-center">
      {speechBubbleText && (
        <div className="mb-2 relative px-3 py-1.5 bg-white border-2 border-[#5CC8FF] text-[#243447] text-xs font-black rounded-2xl shadow-[0_4px_12px_rgba(92,200,255,0.2)] animate-bounce text-center max-w-[200px]">
          {speechBubbleText}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-white" />
        </div>
      )}

      <svg
        viewBox="0 0 160 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-label="Coding Character"
        role="img"
      >
        {/* Floating code brackets */}
        <g className="animate-pulse">
          <text x="14" y="45" fill="#5CC8FF" fontSize="16" fontWeight="bold" fontFamily="monospace">&lt;/&gt;</text>
          <text x="122" y="48" fill="#FF9F43" fontSize="16" fontWeight="bold" fontFamily="monospace">&#123; &#125;</text>
        </g>

        {/* Head */}
        <circle cx="80" cy="50" r="28" fill="#FFE2C6" stroke="#243447" strokeWidth="3.5" />

        {/* Hair */}
        <path
          d="M 52 50 C 52 28 65 20 80 20 C 95 20 108 28 108 50 C 102 38 92 34 80 34 C 68 34 58 38 52 50 Z"
          fill="#243447"
        />

        {/* Round Glasses */}
        <circle cx="70" cy="50" r="9" fill="none" stroke="#243447" strokeWidth="3" />
        <circle cx="90" cy="50" r="9" fill="none" stroke="#243447" strokeWidth="3" />
        <line x1="79" y1="50" x2="81" y2="50" stroke="#243447" strokeWidth="3" />

        {/* Focused happy eyes inside glasses */}
        <path d="M 66 50 Q 70 46 74 50" stroke="#243447" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <path d="M 86 50 Q 90 46 94 50" stroke="#243447" strokeWidth="2.5" strokeLinecap="round" fill="none" />

        {/* Smile */}
        <path d="M 75 62 Q 80 67 85 62" stroke="#243447" strokeWidth="2.5" strokeLinecap="round" fill="none" />

        {/* Body / Hoodie */}
        <path
          d="M 52 82 C 52 74 62 72 80 72 C 98 72 108 74 108 82 L 118 120 L 42 120 Z"
          fill="#5CC8FF"
          stroke="#243447"
          strokeWidth="3.5"
        />

        {/* Hoodie pocket / strings */}
        <line x1="76" y1="78" x2="76" y2="92" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
        <line x1="84" y1="78" x2="84" y2="92" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />

        {/* Laptop Base */}
        <rect x="44" y="112" width="72" height="26" rx="6" fill="#FFFFFF" stroke="#243447" strokeWidth="3.5" />
        {/* Laptop Screen glow */}
        <rect x="50" y="116" width="60" height="18" rx="3" fill="#FFF8E7" stroke="#FED7AA" strokeWidth="1.5" />
        {/* Lines on screen */}
        <line x1="56" y1="122" x2="78" y2="122" stroke="#5CC8FF" strokeWidth="2" strokeLinecap="round" />
        <line x1="56" y1="128" x2="96" y2="128" stroke="#45E0C0" strokeWidth="2" strokeLinecap="round" />

        {/* Hands typing */}
        <circle cx="58" cy="116" r="6" fill="#FFE2C6" stroke="#243447" strokeWidth="2.5" />
        <circle cx="102" cy="116" r="6" fill="#FFE2C6" stroke="#243447" strokeWidth="2.5" />

        {/* Shadow base */}
        <ellipse cx="80" cy="148" rx="42" ry="5" fill="#FED7AA" opacity="0.6" />
      </svg>
    </div>
  );
}
