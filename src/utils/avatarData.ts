/**
 * Shikha ji embedded 256x256 avatar base64 data URL
 * Embedded directly in code without external links or local file path dependencies
 */

const RAW_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="256" height="256">
  <defs>
    <radialGradient id="bgGlow" cx="50%" cy="45%" r="65%">
      <stop offset="0%" stop-color="#3f2712" />
      <stop offset="60%" stop-color="#1c1611" />
      <stop offset="100%" stop-color="#0c0a09" />
    </radialGradient>
    <linearGradient id="skin" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#f8d3b3" />
      <stop offset="100%" stop-color="#e2ab86" />
    </linearGradient>
    <linearGradient id="hair" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#2a2221" />
      <stop offset="50%" stop-color="#171212" />
      <stop offset="100%" stop-color="#0a0808" />
    </linearGradient>
    <linearGradient id="kurta" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ea580c" />
      <stop offset="60%" stop-color="#c2410c" />
      <stop offset="100%" stop-color="#9a3412" />
    </linearGradient>
    <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fde047" />
      <stop offset="100%" stop-color="#d97706" />
    </linearGradient>
    <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="3" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <!-- Background circular canvas -->
  <rect width="256" height="256" fill="url(#bgGlow)" />
  <circle cx="128" cy="128" r="124" fill="none" stroke="#ea580c" stroke-opacity="0.35" stroke-width="2.5" />
  <circle cx="128" cy="115" r="75" fill="#f59e0b" fill-opacity="0.12" filter="url(#softGlow)" />

  <!-- Back Hair Volume -->
  <path d="M 52 140 C 44 95 62 40 128 40 C 194 40 212 95 204 140 C 198 175 192 205 186 230 C 170 238 86 238 70 230 C 64 205 58 175 52 140 Z" fill="url(#hair)" />

  <!-- Neck & Collarbone -->
  <path d="M 112 148 L 112 178 C 112 186 144 186 144 178 L 144 148 Z" fill="#d99b77" />
  <path d="M 116 150 L 116 174 C 116 181 140 181 140 174 L 140 150 Z" fill="url(#skin)" />

  <!-- Kurta & Dress -->
  <path d="M 70 230 C 82 195 106 182 128 182 C 150 182 174 195 186 230 C 188 238 186 256 186 256 L 70 256 Z" fill="url(#kurta)" />
  <!-- Kurta Embroidered Neckline -->
  <path d="M 108 184 Q 128 208 148 184 Q 154 188 152 196 Q 128 226 104 196 Q 102 188 108 184 Z" fill="url(#gold)" />
  <circle cx="128" cy="216" r="3.5" fill="url(#gold)" />
  <circle cx="128" cy="232" r="3.5" fill="url(#gold)" />
  <circle cx="128" cy="248" r="3.5" fill="url(#gold)" />

  <!-- Face Shape -->
  <path d="M 86 106 C 86 70 102 54 128 54 C 154 54 170 70 170 106 C 170 138 152 165 128 165 C 104 165 86 138 86 106 Z" fill="url(#skin)" />

  <!-- Cheeks Blush -->
  <ellipse cx="98" cy="124" rx="14" ry="7" fill="#ea580c" fill-opacity="0.12" />
  <ellipse cx="158" cy="124" rx="14" ry="7" fill="#ea580c" fill-opacity="0.12" />

  <!-- Front Hair Style with center parting -->
  <path d="M 128 58 Q 98 62 82 92 Q 80 120 78 142 Q 90 125 94 98 Q 110 74 128 72 Q 146 74 162 98 Q 166 125 178 142 Q 176 120 174 92 Q 158 62 128 58 Z" fill="url(#hair)" />
  <!-- Hair Gloss Highlights -->
  <path d="M 96 74 Q 108 66 124 64" stroke="#4a3f3d" stroke-width="2.5" stroke-linecap="round" fill="none" opacity="0.6" />
  <path d="M 160 74 Q 148 66 132 64" stroke="#4a3f3d" stroke-width="2.5" stroke-linecap="round" fill="none" opacity="0.6" />

  <!-- Eyebrows (Arched, elegant) -->
  <path d="M 96 95 Q 107 90 117 93" stroke="#261c1a" stroke-width="2.4" stroke-linecap="round" fill="none" />
  <path d="M 160 95 Q 149 90 139 93" stroke="#261c1a" stroke-width="2.4" stroke-linecap="round" fill="none" />

  <!-- Traditional Red Bindi -->
  <circle cx="128" cy="94" r="3.2" fill="#dc2626" />
  <circle cx="128" cy="94" r="1.2" fill="#f87171" />

  <!-- Eyes (Almond warm Indian eyes with gentle smile) -->
  <!-- Left Eye -->
  <path d="M 97 107 Q 107 101 117 107 Q 107 114 97 107 Z" fill="#ffffff" />
  <circle cx="107" cy="107" r="4.2" fill="#3a2318" />
  <circle cx="107" cy="107" r="2.2" fill="#140d09" />
  <circle cx="108.5" cy="105.5" r="1.3" fill="#ffffff" />
  <path d="M 96 107 Q 107 99 118 106" stroke="#2a1810" stroke-width="2" stroke-linecap="round" fill="none" />

  <!-- Right Eye -->
  <path d="M 139 107 Q 149 101 159 107 Q 149 114 139 107 Z" fill="#ffffff" />
  <circle cx="149" cy="107" r="4.2" fill="#3a2318" />
  <circle cx="149" cy="107" r="2.2" fill="#140d09" />
  <circle cx="150.5" cy="105.5" r="1.3" fill="#ffffff" />
  <path d="M 138 106 Q 149 99 160 107" stroke="#2a1810" stroke-width="2" stroke-linecap="round" fill="none" />

  <!-- Nose -->
  <path d="M 128 105 L 126 122 Q 128 126 131 123" stroke="#be7f5b" stroke-width="1.8" stroke-linecap="round" fill="none" />
  <circle cx="124" cy="122.5" r="1.2" fill="#be7f5b" />
  <circle cx="132" cy="122.5" r="1.2" fill="#be7f5b" />
  <circle cx="123" cy="121" r="1" fill="url(#gold)" />

  <!-- Warm Gracious Smile -->
  <path d="M 115 138 Q 128 149 141 138" stroke="#a33a3a" stroke-width="2.2" stroke-linecap="round" fill="none" />
  <path d="M 116 138 Q 128 143 140 138 Q 128 147 116 138 Z" fill="#b94a48" />
  <path d="M 122 143 Q 128 145 134 143" stroke="#fca5a5" stroke-width="1" stroke-linecap="round" fill="none" opacity="0.6" />

  <!-- Gold Earrings (Jhumkas) -->
  <circle cx="82" cy="124" r="2.5" fill="url(#gold)" />
  <path d="M 79 127 L 85 127 L 83 134 L 81 134 Z" fill="url(#gold)" />
  <circle cx="174" cy="124" r="2.5" fill="url(#gold)" />
  <path d="M 171 127 L 177 127 L 175 134 L 173 134 Z" fill="url(#gold)" />
</svg>`;

export const SHIKHA_AVATAR_BASE64 = `data:image/svg+xml;base64,${
  typeof window !== 'undefined'
    ? window.btoa(unescape(encodeURIComponent(RAW_SVG)))
    : Buffer.from(RAW_SVG).toString('base64')
}`;
