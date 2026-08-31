import React from "react";

export function QuizLightbulbIllustration({ className = "w-44 h-44" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Playful 2D Thinking Quiz Lightbulb Illustration"
    >
      {/* Background Soft Circle */}
      <circle cx="100" cy="100" r="82" fill="#FEF9E7" />

      {/* Radiant Glow Rays */}
      <path d="M100 22 L100 12" stroke="#FFD84D" strokeWidth="4" strokeLinecap="round" />
      <path d="M42 45 L35 38" stroke="#FFD84D" strokeWidth="4" strokeLinecap="round" />
      <path d="M158 45 L165 38" stroke="#FFD84D" strokeWidth="4" strokeLinecap="round" />
      <path d="M22 100 L12 100" stroke="#FFD84D" strokeWidth="4" strokeLinecap="round" />
      <path d="M178 100 L188 100" stroke="#FFD84D" strokeWidth="4" strokeLinecap="round" />

      {/* Floating Sparkle Stars */}
      <path d="M38 128L40 133L45 135L40 137L38 142L36 137L31 135L36 133L38 128Z" fill="#5CC8FF" />
      <path d="M162 128L164 133L169 135L164 137L162 142L160 137L155 135L160 133L162 128Z" fill="#FF9F43" />

      {/* Lightbulb Glass Dome */}
      <path
        d="M100 35 C68 35 55 60 55 85 C55 105 70 118 74 135 L126 135 C130 118 145 105 145 85 C145 60 132 35 100 35 Z"
        fill="#FFD84D"
        stroke="#243447"
        strokeWidth="4"
        strokeLinejoin="round"
      />

      {/* Cute Character Face on Lightbulb */}
      {/* Left Eye */}
      <circle cx="85" cy="85" r="4" fill="#243447" />
      {/* Right Eye */}
      <circle cx="115" cy="85" r="4" fill="#243447" />
      {/* Rosy Cheeks */}
      <circle cx="78" cy="92" r="5" fill="#FF6B6B" opacity="0.6" />
      <circle cx="122" cy="92" r="5" fill="#FF6B6B" opacity="0.6" />
      {/* Happy Smile */}
      <path d="M93 94 Q100 102 107 94" stroke="#243447" strokeWidth="3" strokeLinecap="round" />

      {/* Filament Question Mark / Coil */}
      <path
        d="M90 60 Q100 50 110 60 Q105 72 100 75"
        stroke="#FF9F43"
        strokeWidth="3.5"
        strokeLinecap="round"
      />

      {/* Lightbulb Base Screw Threads */}
      <rect x="76" y="135" width="48" height="8" rx="3" fill="#DFE7EF" stroke="#243447" strokeWidth="3.5" />
      <rect x="80" y="143" width="40" height="8" rx="3" fill="#C5D3E0" stroke="#243447" strokeWidth="3.5" />
      
      {/* Contact Point Base */}
      <path d="M86 151 Q100 160 114 151 Z" fill="#243447" />
    </svg>
  );
}
