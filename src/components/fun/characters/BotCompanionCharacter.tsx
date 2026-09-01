import React from "react";

interface BotCompanionCharacterProps {
  className?: string;
  expression?: "happy" | "waving" | "thinking" | "excited";
  speechBubbleText?: string;
}

export function BotCompanionCharacter({
  className = "w-24 h-24",
  expression = "happy",
  speechBubbleText,
}: BotCompanionCharacterProps) {
  return (
    <div className="relative inline-flex flex-col items-center">
      {speechBubbleText && (
        <div className="mb-2 relative px-3 py-1.5 bg-white border-2 border-[#FED7AA] text-[#243447] text-xs font-black rounded-2xl shadow-[0_4px_12px_rgba(255,155,84,0.15)] animate-bounce text-center max-w-[200px]">
          {speechBubbleText}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-white" />
        </div>
      )}

      <svg
        viewBox="0 0 160 180"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-label="EduBot Learning Companion"
        role="img"
      >
        {/* Antenna */}
        <line x1="80" y1="36" x2="80" y2="18" stroke="#243447" strokeWidth="4" strokeLinecap="round" />
        <circle cx="80" cy="14" r="8" fill="#FFD84D" stroke="#243447" strokeWidth="3" />
        <circle cx="82" cy="12" r="2.5" fill="#FFFFFF" />

        {/* Head/Body Outer Pill (Compact Oval Robot) */}
        <rect
          x="35"
          y="34"
          width="90"
          height="100"
          rx="45"
          fill="#FFFFFF"
          stroke="#243447"
          strokeWidth="4"
        />

        {/* Floating Ear Pods */}
        <rect x="24" y="65" width="12" height="24" rx="6" fill="#5CC8FF" stroke="#243447" strokeWidth="3" />
        <rect x="124" y="65" width="12" height="24" rx="6" fill="#5CC8FF" stroke="#243447" strokeWidth="3" />

        {/* Visor Screen */}
        <rect
          x="47"
          y="52"
          width="66"
          height="40"
          rx="18"
          fill="#17202A"
          stroke="#243447"
          strokeWidth="3"
        />

        {/* Visor Eyes (Cyan/Sky Glow) */}
        {expression === "happy" || expression === "waving" ? (
          <>
            <path
              d="M 58 72 Q 65 62 72 72"
              stroke="#5CC8FF"
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M 88 72 Q 95 62 102 72"
              stroke="#5CC8FF"
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
            />
            {/* Blushing cheeks */}
            <circle cx="56" cy="80" r="3" fill="#FF6B6B" opacity="0.8" />
            <circle cx="104" cy="80" r="3" fill="#FF6B6B" opacity="0.8" />
          </>
        ) : expression === "excited" ? (
          <>
            <circle cx="65" cy="70" r="6" fill="#45E0C0" />
            <circle cx="67" cy="68" r="2" fill="#FFFFFF" />
            <circle cx="95" cy="70" r="6" fill="#45E0C0" />
            <circle cx="97" cy="68" r="2" fill="#FFFFFF" />
            <path
              d="M 74 80 Q 80 84 86 80"
              stroke="#45E0C0"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            />
          </>
        ) : (
          <>
            <circle cx="65" cy="70" r="5" fill="#5CC8FF" />
            <circle cx="95" cy="70" r="5" fill="#5CC8FF" />
            <line x1="75" y1="80" x2="85" y2="80" stroke="#5CC8FF" strokeWidth="2.5" strokeLinecap="round" />
          </>
        )}

        {/* Belly Screen / Core Badge */}
        <rect
          x="62"
          y="104"
          width="36"
          height="18"
          rx="9"
          fill="#FFF8E7"
          stroke="#FED7AA"
          strokeWidth="2"
        />
        {/* Heart / Spark Icon on Chest */}
        <circle cx="74" cy="113" r="3" fill="#FF9F43" />
        <circle cx="86" cy="113" r="3" fill="#45E0C0" />

        {/* Left Arm (Waving or Resting) */}
        {expression === "waving" ? (
          <path
            d="M 35 85 C 20 75 14 55 24 45"
            stroke="#243447"
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
          />
        ) : (
          <path
            d="M 35 90 C 26 100 24 112 32 120"
            stroke="#243447"
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
          />
        )}
        {expression === "waving" && (
          <circle cx="24" cy="45" r="5" fill="#FFD84D" stroke="#243447" strokeWidth="2.5" />
        )}

        {/* Right Arm */}
        <path
          d="M 125 90 C 134 100 136 112 128 120"
          stroke="#243447"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
        />

        {/* Feet / Hover Thrusters */}
        <rect x="52" y="132" width="22" height="12" rx="6" fill="#5CC8FF" stroke="#243447" strokeWidth="3" />
        <rect x="86" y="132" width="22" height="12" rx="6" fill="#5CC8FF" stroke="#243447" strokeWidth="3" />

        {/* Soft shadow base */}
        <ellipse cx="80" cy="162" rx="36" ry="6" fill="#FED7AA" opacity="0.6" />
      </svg>
    </div>
  );
}
