import React from "react";

interface HelpGuideCharacterProps {
  className?: string;
  speechBubbleText?: string;
}

export function HelpGuideCharacter({
  className = "w-32 h-32",
  speechBubbleText,
}: HelpGuideCharacterProps) {
  return (
    <div className="relative inline-flex flex-col items-center">
      {speechBubbleText && (
        <div className="mb-2 relative px-3 py-1.5 bg-white border-2 border-[#5CC8FF] text-[#243447] text-xs font-black rounded-2xl shadow-[0_4px_12px_rgba(92,200,255,0.25)] animate-bounce text-center max-w-[220px]">
          {speechBubbleText}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-white" />
        </div>
      )}

      <svg
        viewBox="0 0 180 180"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-label="Help Guide Astronaut Character"
        role="img"
      >
        {/* Astronaut Helmet Bubble */}
        <circle cx="85" cy="56" r="32" fill="#EBF8FF" stroke="#243447" strokeWidth="3.5" />
        {/* Reflection glare on helmet */}
        <path d="M 64 42 A 24 24 0 0 1 106 42" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" fill="none" />

        {/* Head inside helmet */}
        <circle cx="85" cy="58" r="22" fill="#FFE2C6" />

        {/* Big Curious Friendly Eyes */}
        <circle cx="76" cy="58" r="5" fill="#243447" />
        <circle cx="78" cy="56" r="2" fill="#FFFFFF" />
        <circle cx="94" cy="58" r="5" fill="#243447" />
        <circle cx="96" cy="56" r="2" fill="#FFFFFF" />

        {/* Gentle reassuring smile */}
        <path d="M 80 67 Q 85 71 90 67" stroke="#243447" strokeWidth="2.5" strokeLinecap="round" fill="none" />

        {/* Rosy cheeks */}
        <circle cx="70" cy="65" r="3" fill="#FF6B6B" opacity="0.6" />
        <circle cx="100" cy="65" r="3" fill="#FF6B6B" opacity="0.6" />

        {/* Spacesuit Body */}
        <path
          d="M 56 88 C 56 80 68 78 85 78 C 102 78 114 80 114 88 L 122 134 L 48 134 Z"
          fill="#FFFFFF"
          stroke="#243447"
          strokeWidth="3.5"
        />

        {/* Spacesuit Chest Patch & Life Support */}
        <rect x="72" y="92" width="26" height="20" rx="5" fill="#FFF8E7" stroke="#243447" strokeWidth="2" />
        <circle cx="78" cy="98" r="2.5" fill="#5EDC81" />
        <circle cx="85" cy="98" r="2.5" fill="#5CC8FF" />
        <circle cx="92" cy="98" r="2.5" fill="#FFD84D" />
        <line x1="76" y1="106" x2="94" y2="106" stroke="#243447" strokeWidth="2" strokeLinecap="round" />

        {/* Guide Lantern / Beacon held in hand */}
        <g className="animate-pulse">
          <line x1="126" y1="90" x2="140" y2="100" stroke="#243447" strokeWidth="3" strokeLinecap="round" />
          <rect x="132" y="100" width="16" height="24" rx="4" fill="#FFD84D" stroke="#243447" strokeWidth="2.5" />
          <circle cx="140" cy="112" r="4" fill="#FFFFFF" />
          {/* Lantern Light Rays */}
          <line x1="140" y1="94" x2="140" y2="90" stroke="#FFD84D" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="154" y1="112" x2="158" y2="112" stroke="#FFD84D" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="126" y1="112" x2="122" y2="112" stroke="#FFD84D" strokeWidth="2.5" strokeLinecap="round" />
        </g>

        {/* Left Arm Waving Welcome */}
        <path d="M 56 94 C 44 88 38 74 40 62" stroke="#243447" strokeWidth="4" strokeLinecap="round" fill="none" />
        <circle cx="40" cy="62" r="6" fill="#5CC8FF" stroke="#243447" strokeWidth="2" />

        {/* Shadow base */}
        <ellipse cx="85" cy="156" rx="44" ry="6" fill="#FED7AA" opacity="0.6" />
      </svg>
    </div>
  );
}
