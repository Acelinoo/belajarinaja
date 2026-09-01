import React from "react";

interface VictoryAchievementCharacterProps {
  className?: string;
  speechBubbleText?: string;
}

export function VictoryAchievementCharacter({
  className = "w-32 h-32",
  speechBubbleText,
}: VictoryAchievementCharacterProps) {
  return (
    <div className="relative inline-flex flex-col items-center">
      {speechBubbleText && (
        <div className="mb-2 relative px-3 py-1.5 bg-white border-2 border-[#5EDC81] text-[#243447] text-xs font-black rounded-2xl shadow-[0_4px_12px_rgba(94,220,129,0.3)] animate-bounce text-center max-w-[220px]">
          {speechBubbleText}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-white" />
        </div>
      )}

      <svg
        viewBox="0 0 180 180"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-label="Victory Achievement Character"
        role="img"
      >
        {/* Celebration Stars */}
        <g className="animate-pulse">
          <polygon points="30,35 34,45 45,45 36,52 40,62 30,55 20,62 24,52 15,45 26,45" fill="#FFD84D" />
          <polygon points="150,30 153,38 162,38 155,44 158,52 150,47 142,52 145,44 138,38 147,38" fill="#FFD84D" />
          <circle cx="25" cy="80" r="4" fill="#FF6B6B" />
          <circle cx="160" cy="75" r="4" fill="#5CC8FF" />
        </g>

        {/* Champion Trophy in Hands */}
        <path d="M 125 45 L 145 45 C 145 60 135 70 120 70 L 115 70" stroke="#243447" strokeWidth="3" fill="none" />
        <path d="M 105 35 L 135 35 C 135 55 125 65 115 70 L 115 78 L 125 78 L 125 84 L 95 84 L 95 78 L 105 78 L 105 70 C 95 65 85 55 85 35 Z" fill="#FFD84D" stroke="#243447" strokeWidth="3" />
        <circle cx="110" cy="50" r="8" fill="#FFF8E7" stroke="#243447" strokeWidth="1.5" />
        <text x="107" y="55" fill="#243447" fontSize="12" fontWeight="900">★</text>

        {/* Head */}
        <circle cx="70" cy="65" r="26" fill="#FFE2C6" stroke="#243447" strokeWidth="3.5" />

        {/* Winner's Laurel Headband */}
        <path d="M 46 60 Q 70 42 94 60" stroke="#5EDC81" strokeWidth="5" strokeLinecap="round" fill="none" />
        <circle cx="48" cy="58" r="4" fill="#5EDC81" />
        <circle cx="92" cy="58" r="4" fill="#5EDC81" />

        {/* Joyful Closed Eyes (^_^) */}
        <path d="M 58 64 Q 63 58 68 64" stroke="#243447" strokeWidth="3" strokeLinecap="round" fill="none" />
        <path d="M 74 64 Q 79 58 84 64" stroke="#243447" strokeWidth="3" strokeLinecap="round" fill="none" />

        {/* Big Happy Open Mouth */}
        <path d="M 64 74 Q 71 85 78 74 Z" fill="#FF6B6B" stroke="#243447" strokeWidth="2.5" />

        {/* Rosy Cheeks */}
        <circle cx="56" cy="72" r="3.5" fill="#FF9F43" opacity="0.8" />
        <circle cx="86" cy="72" r="3.5" fill="#FF9F43" opacity="0.8" />

        {/* Body / Winner T-Shirt */}
        <path
          d="M 48 94 C 48 88 56 86 70 86 C 84 86 92 88 92 94 L 98 136 L 42 136 Z"
          fill="#FFD84D"
          stroke="#243447"
          strokeWidth="3.5"
        />

        {/* Left Arm Raised High */}
        <path d="M 48 96 C 36 85 30 70 32 55" stroke="#243447" strokeWidth="4" strokeLinecap="round" fill="none" />
        <circle cx="32" cy="55" r="6" fill="#FFE2C6" stroke="#243447" strokeWidth="2.5" />

        {/* Right Arm Holding Trophy Base */}
        <path d="M 92 96 C 98 88 104 84 110 82" stroke="#243447" strokeWidth="4" strokeLinecap="round" fill="none" />
        <circle cx="110" cy="82" r="6" fill="#FFE2C6" stroke="#243447" strokeWidth="2.5" />

        {/* Shadow base */}
        <ellipse cx="75" cy="158" rx="44" ry="6" fill="#FED7AA" opacity="0.6" />
      </svg>
    </div>
  );
}
