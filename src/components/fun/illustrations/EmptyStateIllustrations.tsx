import React from "react";

export function EmptyBookmarksIllustration({ className = "w-36 h-36" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 160 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Empty Bookmarks Illustration"
    >
      <circle cx="80" cy="80" r="65" fill="#FFF8E7" />
      {/* Little floating stars */}
      <path d="M35 45L37 50L42 52L37 54L35 59L33 54L28 52L33 50L35 45Z" fill="#5CC8FF" />
      <path d="M125 40L127 45L132 47L127 49L125 54L123 49L118 47L123 45L125 40Z" fill="#FFD84D" />
      {/* Book Pouch / Bag */}
      <path
        d="M50 50 L110 50 L110 115 L80 98 L50 115 Z"
        fill="#FF9F43"
        stroke="#243447"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      {/* Cute sleeping face on bookmark */}
      <path d="M68 75 Q73 70 78 75" stroke="#243447" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M82 75 Q87 70 92 75" stroke="#243447" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="65" cy="80" r="3" fill="#FF6B6B" opacity="0.6" />
      <circle cx="95" cy="80" r="3" fill="#FF6B6B" opacity="0.6" />
      <circle cx="80" cy="85" r="2" fill="#243447" />
    </svg>
  );
}

export function LostAstronaut404Illustration({ className = "w-48 h-48" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="404 Lost Astronaut Illustration"
    >
      <circle cx="100" cy="100" r="85" fill="#EBF8FF" />
      {/* Moon / Planet Surface */}
      <ellipse cx="100" cy="170" rx="90" ry="30" fill="#DFE7EF" stroke="#243447" strokeWidth="3.5" />
      <circle cx="60" cy="165" r="8" fill="#C5D3E0" />
      <circle cx="140" cy="160" r="10" fill="#C5D3E0" />

      {/* Floating Stars */}
      <path d="M35 45L37 50L42 52L37 54L35 59L33 54L28 52L33 50L35 45Z" fill="#FFD84D" />
      <path d="M165 40L167 45L172 47L167 49L165 54L163 49L158 47L163 45L165 40Z" fill="#FF9F43" />
      <circle cx="45" cy="90" r="3" fill="#45E0C0" />
      <circle cx="160" cy="95" r="4" fill="#FF6B6B" />

      {/* Floating 404 Planet / Sign */}
      <rect x="70" y="30" width="60" height="28" rx="8" fill="#FFD84D" stroke="#243447" strokeWidth="3" />
      <text x="100" y="50" fill="#243447" fontSize="16" fontWeight="900" textAnchor="middle" fontFamily="monospace">404</text>

      {/* Astronaut Body */}
      {/* Backpack */}
      <rect x="74" y="80" width="52" height="42" rx="10" fill="#C5D3E0" stroke="#243447" strokeWidth="3" />
      {/* Suit */}
      <rect x="80" y="86" width="40" height="45" rx="12" fill="#FFFFFF" stroke="#243447" strokeWidth="3.5" />
      
      {/* Helmet Dome */}
      <circle cx="100" cy="78" r="22" fill="#FFFFFF" stroke="#243447" strokeWidth="3.5" />
      {/* Helmet Visor */}
      <ellipse cx="100" cy="78" rx="15" ry="11" fill="#5CC8FF" stroke="#243447" strokeWidth="2.5" />
      <path d="M92 73 Q98 70 102 75" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />

      {/* Cute waving arms */}
      <path d="M80 95 Q68 90 62 78" stroke="#243447" strokeWidth="3.5" strokeLinecap="round" />
      <circle cx="62" cy="78" r="4" fill="#FF9F43" stroke="#243447" strokeWidth="2" />
      <path d="M120 95 Q132 100 138 90" stroke="#243447" strokeWidth="3.5" strokeLinecap="round" />
      <circle cx="138" cy="90" r="4" fill="#FF9F43" stroke="#243447" strokeWidth="2" />
    </svg>
  );
}
