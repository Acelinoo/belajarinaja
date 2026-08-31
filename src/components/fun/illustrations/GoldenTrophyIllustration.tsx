import React from "react";

export function GoldenTrophyIllustration({ className = "w-48 h-48" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Playful 2D Golden Trophy Illustration"
    >
      {/* Background Glow */}
      <circle cx="100" cy="100" r="85" fill="#FEF3C7" />

      {/* Confetti & Streamers */}
      <path d="M35 50L45 54L38 60Z" fill="#5CC8FF" />
      <path d="M165 50L155 54L162 60Z" fill="#FF6B6B" />
      <circle cx="45" cy="80" r="4" fill="#45E0C0" />
      <circle cx="155" cy="80" r="4" fill="#FF9F43" />
      <path d="M50 120L56 123L52 128Z" fill="#FFD84D" />
      <path d="M150 120L144 123L148 128Z" fill="#5EDC81" />

      {/* Trophy Left Handle */}
      <path
        d="M62 65 C40 65 40 105 66 105"
        stroke="#243447"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M62 70 C46 70 46 100 66 100"
        stroke="#FF9F43"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />

      {/* Trophy Right Handle */}
      <path
        d="M138 65 C160 65 160 105 134 105"
        stroke="#243447"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M138 70 C154 70 154 100 134 100"
        stroke="#FF9F43"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />

      {/* Trophy Cup Body */}
      <path
        d="M62 50 L138 50 L134 95 C134 118 118 128 100 128 C82 128 66 118 66 95 L62 50 Z"
        fill="#FFD84D"
        stroke="#243447"
        strokeWidth="4"
        strokeLinejoin="round"
      />

      {/* Trophy Inner Rim */}
      <ellipse cx="100" cy="50" rx="38" ry="8" fill="#FFC933" stroke="#243447" strokeWidth="4" />

      {/* Star Emblem on Trophy Cup */}
      <path
        d="M100 70 L103 79 L112 79 L105 85 L108 94 L100 89 L92 94 L95 85 L88 79 L97 79 Z"
        fill="#FFFFFF"
        stroke="#243447"
        strokeWidth="2"
      />

      {/* Trophy Stem */}
      <path d="M92 128 L92 145 L108 145 L108 128 Z" fill="#FF9F43" stroke="#243447" strokeWidth="4" strokeLinejoin="round" />

      {/* Trophy Pedestal Base */}
      <path
        d="M70 145 L130 145 L136 168 L64 168 Z"
        fill="#243447"
        stroke="#243447"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />

      {/* Plaque on Pedestal */}
      <rect x="78" y="150" width="44" height="12" rx="3" fill="#45E0C0" stroke="#243447" strokeWidth="1.5" />
      <rect x="85" y="154" width="30" height="3" rx="1.5" fill="#FFFFFF" />
    </svg>
  );
}
