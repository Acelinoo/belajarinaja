import React from "react";

export function RocketAdventureIllustration({ className = "w-48 h-48" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Playful 2D Rocket Illustration"
    >
      {/* Background Soft Glow & Stars */}
      <circle cx="100" cy="100" r="85" fill="#FFF3D6" />
      
      {/* Stars */}
      <path d="M40 50L43 57L50 60L43 63L40 70L37 63L30 60L37 57L40 50Z" fill="#FFD84D" />
      <path d="M160 40L162 45L167 47L162 49L160 54L158 49L153 47L158 45L160 40Z" fill="#5CC8FF" />
      <path d="M170 120L172 125L177 127L172 129L170 134L168 129L163 127L168 125L170 120Z" fill="#FF9F43" />
      <path d="M30 130L32 134L36 136L32 138L30 142L28 138L24 136L28 134L30 130Z" fill="#45E0C0" />

      {/* Fluffy Clouds */}
      <ellipse cx="60" cy="165" rx="35" ry="18" fill="#FFFFFF" />
      <ellipse cx="90" cy="160" rx="30" ry="20" fill="#FFFFFF" />
      <ellipse cx="140" cy="165" rx="40" ry="18" fill="#FFFFFF" />

      {/* Rocket Exhaust Smoke & Fire */}
      <path
        d="M85 140 Q100 185 100 190 Q100 185 115 140 Z"
        fill="#FF9F43"
      />
      <path
        d="M92 140 Q100 170 100 175 Q100 170 108 140 Z"
        fill="#FFD84D"
      />

      {/* Rocket Thruster Base */}
      <rect x="88" y="132" width="24" height="10" rx="3" fill="#243447" />

      {/* Left Fin */}
      <path
        d="M75 115 L52 135 Q50 140 56 138 L75 130 Z"
        fill="#FF6B6B"
        stroke="#243447"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      {/* Right Fin */}
      <path
        d="M125 115 L148 135 Q150 140 144 138 L125 130 Z"
        fill="#FF6B6B"
        stroke="#243447"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />

      {/* Rocket Body */}
      <path
        d="M100 25 C80 55 72 95 72 132 L128 132 C128 95 120 55 100 25 Z"
        fill="#FFFFFF"
        stroke="#243447"
        strokeWidth="4"
        strokeLinejoin="round"
      />

      {/* Rocket Nosecone */}
      <path
        d="M100 25 C88 45 83 65 80 75 L120 75 C117 65 112 45 100 25 Z"
        fill="#5CC8FF"
        stroke="#243447"
        strokeWidth="4"
        strokeLinejoin="round"
      />

      {/* Porthole Outer Window */}
      <circle cx="100" cy="95" r="16" fill="#FFD84D" stroke="#243447" strokeWidth="3.5" />
      {/* Porthole Glass Inner */}
      <circle cx="100" cy="95" r="10" fill="#45E0C0" />
      {/* Glass Glint */}
      <path d="M96 90 Q102 88 104 93" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}
