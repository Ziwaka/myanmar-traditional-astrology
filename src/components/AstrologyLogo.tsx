import React from 'react';

interface AstrologyLogoProps {
  className?: string;
  size?: number | string;
  variant?: 'gold' | 'monochrome' | 'full';
  showBadge?: boolean;
}

export const AstrologyLogo: React.FC<AstrologyLogoProps> = ({
  className = 'w-10 h-10',
  size,
  variant = 'gold',
  showBadge = false,
}) => {
  const style = size ? { width: size, height: size } : undefined;

  return (
    <div className={`relative inline-flex items-center justify-center shrink-0 ${className}`} style={style}>
      <svg
        viewBox="0 0 400 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-md"
      >
        <defs>
          <linearGradient id="goldFeatherGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fde047" />
            <stop offset="50%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#b45309" />
          </linearGradient>
          <linearGradient id="slateGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#292524" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#1c1917" stopOpacity="0.9" />
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* 9-Grid Astrological Slate Board (မဟာဘုတ်/ဗေဒင်ဇာတာခွင်) */}
        <g transform="translate(45, 175) rotate(-10)">
          {/* Slate Board Base with rounded corners and transparent background */}
          <rect
            x="20"
            y="20"
            width="260"
            height="180"
            rx="20"
            fill="url(#slateGrad)"
            stroke="url(#goldFeatherGrad)"
            strokeWidth="5"
          />

          {/* 3x3 Astrological Grid Lines */}
          {/* Vertical Lines */}
          <line x1="106" y1="20" x2="106" y2="200" stroke="url(#goldFeatherGrad)" strokeWidth="3.5" strokeLinecap="round" />
          <line x1="193" y1="20" x2="193" y2="200" stroke="url(#goldFeatherGrad)" strokeWidth="3.5" strokeLinecap="round" />
          
          {/* Horizontal Lines */}
          <line x1="20" y1="80" x2="280" y2="80" stroke="url(#goldFeatherGrad)" strokeWidth="3.5" strokeLinecap="round" />
          <line x1="20" y1="140" x2="280" y2="140" stroke="url(#goldFeatherGrad)" strokeWidth="3.5" strokeLinecap="round" />

          {/* Astrological Center Glyphs (Burmese numeral/sacred planetary orb) */}
          <ellipse cx="150" cy="110" rx="22" ry="16" stroke="#fde047" strokeWidth="4" fill="none" transform="rotate(-15 150 110)" />
          <circle cx="150" cy="110" r="4" fill="#fde047" />
          <path d="M 168 104 Q 190 95 198 88" stroke="#fde047" strokeWidth="3.5" strokeLinecap="round" fill="none" />
          
          {/* Corner Planetary Marks */}
          <circle cx="63" cy="50" r="4" fill="#fbbf24" opacity="0.8" />
          <circle cx="236" cy="50" r="4" fill="#fbbf24" opacity="0.8" />
          <circle cx="63" cy="170" r="4" fill="#fbbf24" opacity="0.8" />
          <circle cx="236" cy="170" r="4" fill="#fbbf24" opacity="0.8" />
        </g>

        {/* The Artistic Hand Holding Feather Quill Pen */}
        <g>
          {/* Large Elegant Feather / Quill */}
          {/* Feather Spine */}
          <path
            d="M 125 45 C 145 90, 160 145, 178 220"
            stroke="url(#goldFeatherGrad)"
            strokeWidth="5"
            strokeLinecap="round"
            fill="none"
          />
          
          {/* Feather Vanes / Barbs (Artistic Wing Fluff) */}
          <path
            d="M 125 45 C 95 90, 105 150, 140 185 C 130 155, 125 115, 125 45 Z"
            fill="url(#goldFeatherGrad)"
            opacity="0.95"
          />
          <path
            d="M 125 45 C 150 85, 165 130, 168 175 C 155 140, 140 95, 125 45 Z"
            fill="#fbbf24"
            opacity="0.9"
          />

          {/* Decorative Calligraphy Quill Curves */}
          <path
            d="M 115 110 C 85 100, 60 130, 80 160 C 95 175, 115 170, 128 158"
            stroke="url(#goldFeatherGrad)"
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
          />

          {/* Hand Palm & Wrist Lines (Flowing Line Art) */}
          <path
            d="M 85 170 C 110 160, 135 175, 160 200"
            stroke="url(#goldFeatherGrad)"
            strokeWidth="4.5"
            strokeLinecap="round"
            fill="none"
          />

          {/* Fingers Gripping the Quill (Thumb, Index, Middle, Ring fingers) */}
          {/* Thumb Curving over Quill */}
          <path
            d="M 150 185 C 168 190, 185 200, 188 215 C 188 225, 172 230, 160 225 C 145 220, 138 205, 150 185 Z"
            stroke="url(#goldFeatherGrad)"
            strokeWidth="4"
            fill="#1c1917"
          />

          {/* Index & Middle Fingers extended toward slate */}
          <path
            d="M 175 220 C 185 240, 195 270, 195 295 C 190 305, 178 305, 172 290 C 165 265, 158 240, 155 225"
            stroke="url(#goldFeatherGrad)"
            strokeWidth="4"
            strokeLinecap="round"
            fill="#1c1917"
          />

          {/* Ring Finger */}
          <path
            d="M 158 235 C 152 260, 145 285, 140 300 C 132 305, 125 298, 128 285 C 133 265, 140 240, 145 225"
            stroke="url(#goldFeatherGrad)"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="#1c1917"
          />

          {/* Little Finger */}
          <path
            d="M 138 235 C 130 255, 122 275, 116 288 C 110 292, 104 286, 108 275 C 114 258, 120 238, 126 220"
            stroke="url(#goldFeatherGrad)"
            strokeWidth="3"
            strokeLinecap="round"
            fill="#1c1917"
          />

          {/* Quill Pen Nib writing on slate */}
          <path
            d="M 178 220 L 195 265 L 202 278 L 198 280 L 188 268 L 175 228 Z"
            fill="url(#goldFeatherGrad)"
            stroke="#fde047"
            strokeWidth="2"
          />
          
          {/* Nib Tip Touch Point & Ink Sparkle */}
          <circle cx="204" cy="282" r="3.5" fill="#fde047" filter="url(#glow)" />
          <path d="M 204 275 L 204 289 M 197 282 L 211 282" stroke="#fde047" strokeWidth="2" strokeLinecap="round" />
        </g>
      </svg>
    </div>
  );
};
