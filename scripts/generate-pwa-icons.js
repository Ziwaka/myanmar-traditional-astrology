import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <radialGradient id="pwaBgGrad" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#292524" />
      <stop offset="70%" stop-color="#1c1917" />
      <stop offset="100%" stop-color="#0c0a09" />
    </radialGradient>
    <linearGradient id="pwaGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fde047" />
      <stop offset="50%" stop-color="#f59e0b" />
      <stop offset="100%" stop-color="#b45309" />
    </linearGradient>
    <linearGradient id="pwaSlateGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#292524" stop-opacity="0.9" />
      <stop offset="100%" stop-color="#1c1917" stop-opacity="0.98" />
    </linearGradient>
    <filter id="pwaGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="8" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <!-- Background Base -->
  <rect width="512" height="512" rx="110" fill="url(#pwaBgGrad)" />

  <!-- Outer Sacred Astrology Circle Ring -->
  <circle cx="256" cy="256" r="236" fill="none" stroke="url(#pwaGoldGrad)" stroke-width="4" stroke-opacity="0.4" stroke-dasharray="6 4" />
  <circle cx="256" cy="256" r="226" fill="none" stroke="#ca8a04" stroke-width="1.5" stroke-opacity="0.6" />

  <!-- Inner Artwork Scaled & Centered (400x400 scaled to fit 380x380 in 512 center) -->
  <g transform="translate(56, 56) scale(1)">
    
    <!-- 9-Grid Astrological Slate Board (မဟာဘုတ်/ဗေဒင်ဇာတာခွင်) -->
    <g transform="translate(45, 175) rotate(-10)">
      <rect
        x="20"
        y="20"
        width="260"
        height="180"
        rx="20"
        fill="url(#pwaSlateGrad)"
        stroke="url(#pwaGoldGrad)"
        stroke-width="6"
      />

      <!-- 3x3 Astrological Grid Lines -->
      <line x1="106" y1="20" x2="106" y2="200" stroke="url(#pwaGoldGrad)" stroke-width="4" stroke-linecap="round" />
      <line x1="193" y1="20" x2="193" y2="200" stroke="url(#pwaGoldGrad)" stroke-width="4" stroke-linecap="round" />
      
      <line x1="20" y1="80" x2="280" y2="80" stroke="url(#pwaGoldGrad)" stroke-width="4" stroke-linecap="round" />
      <line x1="20" y1="140" x2="280" y2="140" stroke="url(#pwaGoldGrad)" stroke-width="4" stroke-linecap="round" />

      <!-- Astrological Center Glyphs -->
      <ellipse cx="150" cy="110" rx="22" ry="16" stroke="#fde047" stroke-width="5" fill="none" transform="rotate(-15 150 110)" />
      <circle cx="150" cy="110" r="5" fill="#fde047" />
      <path d="M 168 104 Q 190 95 198 88" stroke="#fde047" stroke-width="4" stroke-linecap="round" fill="none" />
      
      <!-- Corner Marks -->
      <circle cx="63" cy="50" r="5" fill="#fbbf24" opacity="0.9" />
      <circle cx="236" cy="50" r="5" fill="#fbbf24" opacity="0.9" />
      <circle cx="63" cy="170" r="5" fill="#fbbf24" opacity="0.9" />
      <circle cx="236" cy="170" r="5" fill="#fbbf24" opacity="0.9" />
    </g>

    <!-- Artistic Hand Holding Feather Quill Pen -->
    <g>
      <!-- Quill Feather Spine -->
      <path
        d="M 125 45 C 145 90, 160 145, 178 220"
        stroke="url(#pwaGoldGrad)"
        stroke-width="6"
        stroke-linecap="round"
        fill="none"
      />
      
      <!-- Feather Vanes -->
      <path
        d="M 125 45 C 95 90, 105 150, 140 185 C 130 155, 125 115, 125 45 Z"
        fill="url(#pwaGoldGrad)"
        opacity="0.98"
      />
      <path
        d="M 125 45 C 150 85, 165 130, 168 175 C 155 140, 140 95, 125 45 Z"
        fill="#fde047"
        opacity="0.95"
      />

      <!-- Calligraphy Curves -->
      <path
        d="M 115 110 C 85 100, 60 130, 80 160 C 95 175, 115 170, 128 158"
        stroke="url(#pwaGoldGrad)"
        stroke-width="5"
        stroke-linecap="round"
        fill="none"
      />

      <!-- Hand Wrist & Palm -->
      <path
        d="M 85 170 C 110 160, 135 175, 160 200"
        stroke="url(#pwaGoldGrad)"
        stroke-width="5"
        stroke-linecap="round"
        fill="none"
      />

      <!-- Thumb -->
      <path
        d="M 150 185 C 168 190, 185 200, 188 215 C 188 225, 172 230, 160 225 C 145 220, 138 205, 150 185 Z"
        stroke="url(#pwaGoldGrad)"
        stroke-width="4.5"
        fill="#1c1917"
      />

      <!-- Index & Middle Fingers -->
      <path
        d="M 175 220 C 185 240, 195 270, 195 295 C 190 305, 178 305, 172 290 C 165 265, 158 240, 155 225"
        stroke="url(#pwaGoldGrad)"
        stroke-width="4.5"
        stroke-linecap="round"
        fill="#1c1917"
      />

      <!-- Ring Finger -->
      <path
        d="M 158 235 C 152 260, 145 285, 140 300 C 132 305, 125 298, 128 285 C 133 265, 140 240, 145 225"
        stroke="url(#pwaGoldGrad)"
        stroke-width="4"
        stroke-linecap="round"
        fill="#1c1917"
      />

      <!-- Little Finger -->
      <path
        d="M 138 235 C 130 255, 122 275, 116 288 C 110 292, 104 286, 108 275 C 114 258, 120 238, 126 220"
        stroke="url(#pwaGoldGrad)"
        stroke-width="3.5"
        stroke-linecap="round"
        fill="#1c1917"
      />

      <!-- Nib -->
      <path
        d="M 178 220 L 195 265 L 202 278 L 198 280 L 188 268 L 175 228 Z"
        fill="url(#pwaGoldGrad)"
        stroke="#fde047"
        stroke-width="2.5"
      />
      
      <!-- Sparkle -->
      <circle cx="204" cy="282" r="5" fill="#fde047" filter="url(#pwaGlow)" />
      <path d="M 204 273 L 204 291 M 195 282 L 213 282" stroke="#fde047" stroke-width="2.5" stroke-linecap="round" />
    </g>
  </g>
</svg>`;

async function run() {
  const publicDir = path.resolve('public');
  
  // 1. Write public/icon.svg
  fs.writeFileSync(path.join(publicDir, 'icon.svg'), svgContent, 'utf-8');
  console.log('Written icon.svg');

  const svgBuffer = Buffer.from(svgContent);

  // 2. Generate 512x512 PNG
  await sharp(svgBuffer)
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'pwa-512x512.png'));
  console.log('Generated pwa-512x512.png');

  // 3. Generate 192x192 PNG
  await sharp(svgBuffer)
    .resize(192, 192)
    .png()
    .toFile(path.join(publicDir, 'pwa-192x192.png'));
  console.log('Generated pwa-192x192.png');

  // 4. Generate Maskable 512x512 PNG (with safe-zone padding)
  await sharp(svgBuffer)
    .resize(440, 440)
    .extend({
      top: 36,
      bottom: 36,
      left: 36,
      right: 36,
      background: '#1c1917'
    })
    .png()
    .toFile(path.join(publicDir, 'pwa-maskable-512x512.png'));
  console.log('Generated pwa-maskable-512x512.png');

  // 5. Generate apple-touch-icon.png (180x180)
  await sharp(svgBuffer)
    .resize(180, 180)
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));
  console.log('Generated apple-touch-icon.png');
}

run().catch(console.error);
