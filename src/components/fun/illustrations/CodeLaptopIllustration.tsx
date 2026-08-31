import React from "react";

export function CodeLaptopIllustration({ className = "w-44 h-44" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Playful 2D Code Laptop Illustration"
    >
      {/* Background Circle */}
      <circle cx="100" cy="100" r="82" fill="#EBF8FF" />

      {/* Floating Sparkles & Code Tags */}
      <text x="25" y="60" fill="#5CC8FF" fontSize="20" fontWeight="900" fontFamily="monospace">&lt;/&gt;</text>
      <text x="148" y="55" fill="#FF9F43" fontSize="18" fontWeight="900" fontFamily="monospace">&#123; &#125;</text>
      <path d="M165 110L168 115L174 117L168 119L165 125L163 119L157 117L163 115L165 110Z" fill="#FFD84D" />

      {/* Laptop Screen Bezel */}
      <rect
        x="42"
        y="50"
        width="116"
        height="80"
        rx="10"
        fill="#243447"
        stroke="#243447"
        strokeWidth="3"
      />

      {/* Laptop Inner Display Screen */}
      <rect
        x="48"
        y="56"
        width="104"
        height="68"
        rx="6"
        fill="#FFFFFF"
      />

      {/* Code Window Header Dot Buttons */}
      <circle cx="56" cy="64" r="3" fill="#FF6B6B" />
      <circle cx="64" cy="64" r="3" fill="#FFD84D" />
      <circle cx="72" cy="64" r="3" fill="#5EDC81" />

      {/* Code Editor Lines */}
      {/* Line 1 */}
      <rect x="56" y="74" width="30" height="4" rx="2" fill="#5CC8FF" />
      <rect x="90" y="74" width="45" height="4" rx="2" fill="#FF9F43" />
      
      {/* Line 2 (Indented) */}
      <rect x="64" y="84" width="22" height="4" rx="2" fill="#45E0C0" />
      <rect x="90" y="84" width="38" height="4" rx="2" fill="#5CC8FF" />

      {/* Line 3 (Indented) */}
      <rect x="64" y="94" width="48" height="4" rx="2" fill="#FFD84D" />
      <rect x="116" y="94" width="18" height="4" rx="2" fill="#5EDC81" />

      {/* Line 4 */}
      <rect x="56" y="104" width="26" height="4" rx="2" fill="#FF6B6B" />

      {/* Laptop Bottom Base Keyboard */}
      <path
        d="M26 130 L174 130 L164 146 Q162 148 156 148 L44 148 Q38 148 36 146 L26 130 Z"
        fill="#DFE7EF"
        stroke="#243447"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />

      {/* Laptop Trackpad */}
      <rect x="86" y="136" width="28" height="8" rx="2" fill="#FFFFFF" stroke="#243447" strokeWidth="1.5" />
    </svg>
  );
}
