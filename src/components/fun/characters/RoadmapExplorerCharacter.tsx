import React from "react";

interface RoadmapExplorerCharacterProps {
  className?: string;
  speechBubbleText?: string;
}

export function RoadmapExplorerCharacter({
  className = "w-32 h-32",
  speechBubbleText,
}: RoadmapExplorerCharacterProps) {
  return (
    <div className="relative inline-flex flex-col items-center">
      {speechBubbleText && (
        <div className="mb-2 relative px-3 py-1.5 bg-white border-2 border-[#FF9F43] text-[#243447] text-xs font-black rounded-2xl shadow-[0_4px_12px_rgba(255,159,67,0.25)] animate-bounce text-center max-w-[220px]">
          {speechBubbleText}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-white" />
        </div>
      )}

      <svg
        viewBox="0 0 180 180"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-label="Roadmap Explorer Character"
        role="img"
      >
        {/* Explorer Backpack behind body */}
        <rect x="36" y="70" width="22" height="42" rx="8" fill="#FF9F43" stroke="#243447" strokeWidth="3.5" />
        <rect x="34" y="80" width="6" height="14" rx="3" fill="#FFD84D" />

        {/* Head */}
        <circle cx="85" cy="55" r="26" fill="#FFE2C6" stroke="#243447" strokeWidth="3.5" />

        {/* Explorer Safari/Adventure Hat */}
        <path d="M 52 48 C 52 32 66 22 85 22 C 104 22 118 32 118 48 Z" fill="#FED7AA" stroke="#243447" strokeWidth="3.5" />
        <ellipse cx="85" cy="48" rx="42" ry="8" fill="#FED7AA" stroke="#243447" strokeWidth="3.5" />
        <path d="M 64 42 Q 85 36 106 42" stroke="#FF9F43" strokeWidth="4" fill="none" />

        {/* Enthusiastic Adventurer Eyes */}
        <circle cx="76" cy="56" r="4.5" fill="#243447" />
        <circle cx="78" cy="54" r="1.5" fill="#FFFFFF" />
        <circle cx="96" cy="56" r="4.5" fill="#243447" />
        <circle cx="98" cy="54" r="1.5" fill="#FFFFFF" />

        {/* Confident smile */}
        <path d="M 80 66 Q 86 72 92 66" stroke="#243447" strokeWidth="3" strokeLinecap="round" fill="none" />

        {/* Body / Outdoor Explorer Jacket */}
        <path
          d="M 60 84 C 60 78 70 76 85 76 C 100 76 110 78 110 84 L 116 128 L 54 128 Z"
          fill="#45E0C0"
          stroke="#243447"
          strokeWidth="3.5"
        />

        {/* Rolled Map in Hand */}
        <g transform="rotate(-20 130 90)">
          <rect x="120" y="70" width="14" height="42" rx="4" fill="#FFF8E7" stroke="#243447" strokeWidth="3" />
          <line x1="120" y1="84" x2="134" y2="84" stroke="#FF6B6B" strokeWidth="2" />
          <circle cx="127" cy="94" r="6" fill="#FFE2C6" stroke="#243447" strokeWidth="2" />
        </g>

        {/* Left Arm with Compass */}
        <path d="M 60 88 C 50 96 46 108 52 116" stroke="#243447" strokeWidth="3.5" strokeLinecap="round" fill="none" />
        <circle cx="52" cy="116" r="8" fill="#5CC8FF" stroke="#243447" strokeWidth="2.5" />
        <polygon points="52,112 55,116 52,120 49,116" fill="#FF6B6B" />

        {/* Binoculars strapped to chest */}
        <rect x="78" y="90" width="8" height="12" rx="3" fill="#243447" />
        <rect x="88" y="90" width="8" height="12" rx="3" fill="#243447" />
        <line x1="84" y1="94" x2="88" y2="94" stroke="#243447" strokeWidth="2" />

        {/* Shadow base */}
        <ellipse cx="85" cy="154" rx="46" ry="6" fill="#FED7AA" opacity="0.6" />
      </svg>
    </div>
  );
}
