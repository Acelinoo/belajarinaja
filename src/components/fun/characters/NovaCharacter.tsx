"use client";

import React from "react";

export type NovaState =
  | "idle"
  | "curious"
  | "thinking"
  | "confused"
  | "encouraging"
  | "excited"
  | "celebrating";

interface NovaCharacterProps {
  state?: NovaState;
  className?: string;
  speechText?: string;
}

export function NovaCharacter({
  state = "idle",
  className = "w-20 h-20",
  speechText,
}: NovaCharacterProps) {
  // Dynamic eye & visor SVG expressions based on state
  const renderVisorEyes = () => {
    switch (state) {
      case "curious":
        return (
          <g>
            {/* Big curious eyes with sparkles */}
            <circle cx="44" cy="50" r="5" fill="#5CC8FF" />
            <circle cx="56" cy="48" r="6" fill="#5CC8FF" />
            <circle cx="46" cy="48" r="1.5" fill="#FFFFFF" />
            <circle cx="58" cy="46" r="2" fill="#FFFFFF" />
          </g>
        );

      case "thinking":
        return (
          <g>
            {/* Pondering brow lines */}
            <path
              d="M 40 48 Q 45 44 50 47"
              stroke="#5CC8FF"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            />
            <circle cx="45" cy="52" r="3.5" fill="#5CC8FF" />
            <circle cx="56" cy="50" r="4.5" fill="#5CC8FF" />
          </g>
        );

      case "confused":
        return (
          <g>
            {/* Uneven eyes and tilted mouth */}
            <circle cx="43" cy="48" r="5" fill="#FF9F43" />
            <circle cx="57" cy="52" r="3.5" fill="#FF9F43" />
            <path
              d="M 44 58 Q 50 54 56 58"
              stroke="#FF9F43"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
            />
          </g>
        );

      case "encouraging":
        return (
          <g>
            {/* Gentle smile arcs */}
            <path
              d="M 40 48 Q 45 43 50 48"
              stroke="#45E0C0"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M 52 48 Q 57 43 62 48"
              stroke="#45E0C0"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M 46 54 Q 51 58 56 54"
              stroke="#45E0C0"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            />
          </g>
        );

      case "excited":
        return (
          <g>
            {/* Starry anime happy eyes */}
            <path
              d="M 40 50 Q 45 42 50 50"
              stroke="#FFD84D"
              strokeWidth="3.5"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M 52 50 Q 57 42 62 50"
              stroke="#FFD84D"
              strokeWidth="3.5"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M 44 55 Q 51 63 58 55"
              stroke="#FFD84D"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
            />
          </g>
        );

      case "celebrating":
        return (
          <g>
            {/* Golden victory eyes with star bursts */}
            <path
              d="M 40 48 Q 45 40 50 48"
              stroke="#FFD84D"
              strokeWidth="3.5"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M 52 48 Q 57 40 62 48"
              stroke="#FFD84D"
              strokeWidth="3.5"
              strokeLinecap="round"
              fill="none"
            />
            <polygon points="51,36 53,40 57,41 54,44 55,48 51,46 47,48 48,44 45,41 49,40" fill="#FFD84D" />
          </g>
        );

      case "idle":
      default:
        return (
          <g>
            {/* Friendly round visor lights */}
            <circle cx="44" cy="49" r="4.5" fill="#5CC8FF" />
            <circle cx="56" cy="49" r="4.5" fill="#5CC8FF" />
            <circle cx="46" cy="47" r="1.5" fill="#FFFFFF" />
            <circle cx="58" cy="47" r="1.5" fill="#FFFFFF" />
            <path
              d="M 46 56 Q 50 59 54 56"
              stroke="#5CC8FF"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
            />
          </g>
        );
    }
  };

  return (
    <div className="relative inline-flex flex-col items-center">
      {/* Speech Balloon if provided */}
      {speechText && (
        <div className="mb-2 max-w-[200px] p-2.5 rounded-2xl bg-white border-2 border-[#FED7AA] shadow-[0_6px_20px_rgba(255,155,84,0.15)] text-[11px] font-bold text-[#243447] text-center leading-snug animate-in fade-in zoom-in-95">
          {speechText}
          <div className="w-2.5 h-2.5 bg-white border-r-2 border-b-2 border-[#FED7AA] transform rotate-45 mx-auto -mb-3.5 mt-1" />
        </div>
      )}

      <svg
        viewBox="0 0 100 100"
        className={`${className} drop-shadow-[0_8px_16px_rgba(36,52,71,0.1)] transition-transform duration-300 hover:scale-105`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Soft Glow Ambient */}
        <circle cx="50" cy="50" r="42" fill="#5CC8FF" fillOpacity="0.08" />

        {/* Antenna */}
        <rect x="48" y="10" width="4" height="14" rx="2" fill="#17202A" />
        <circle
          cx="50"
          cy="9"
          r="5.5"
          fill={state === "celebrating" ? "#FFD84D" : state === "excited" ? "#FF9F43" : "#5CC8FF"}
          stroke="#17202A"
          strokeWidth="2"
        />

        {/* Ear Audio Sensors */}
        <rect x="18" y="42" width="7" height="16" rx="3.5" fill="#FFD84D" stroke="#17202A" strokeWidth="2.5" />
        <rect x="75" y="42" width="7" height="16" rx="3.5" fill="#FFD84D" stroke="#17202A" strokeWidth="2.5" />

        {/* Head Shell */}
        <rect
          x="23"
          y="22"
          width="54"
          height="52"
          rx="22"
          fill="#FFFFFF"
          stroke="#17202A"
          strokeWidth="3.5"
        />

        {/* Glossy Visor Screen */}
        <rect
          x="29"
          y="32"
          width="42"
          height="34"
          rx="14"
          fill="#17202A"
          stroke="#243447"
          strokeWidth="2"
        />

        {/* Visor Glare Accent */}
        <path
          d="M 33 36 Q 42 34 51 36"
          stroke="#FFFFFF"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.35"
        />

        {/* Dynamic Eyes & Face State */}
        {renderVisorEyes()}

        {/* Body Mini Chassis */}
        <path
          d="M 35 74 L 65 74 L 60 88 L 40 88 Z"
          fill="#FFF8E7"
          stroke="#17202A"
          strokeWidth="3"
        />

        {/* Energy Core Heart Badge */}
        <circle
          cx="50"
          cy="81"
          r="3"
          fill={state === "celebrating" ? "#FFD84D" : "#45E0C0"}
          stroke="#17202A"
          strokeWidth="1.5"
        />
      </svg>
    </div>
  );
}
