/** Shares the original coin, crest, and ornament artwork across the page. */
export function Artwork() {
  return (
    <svg
      width="0"
      height="0"
      style={{ position: "absolute" }}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <radialGradient id="coinFace" cx="0.38" cy="0.32" r="0.8">
          <stop offset="0" stopColor="#F6E6A8"></stop>
          <stop offset="0.35" stopColor="#D4AF37"></stop>
          <stop offset="0.7" stopColor="#B88632"></stop>
          <stop offset="1" stopColor="#6B4A25"></stop>
        </radialGradient>
        <linearGradient id="coinRim" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#F0DC9A"></stop>
          <stop offset="0.5" stopColor="#9A6E2C"></stop>
          <stop offset="1" stopColor="#4A3218"></stop>
        </linearGradient>
        <linearGradient id="emblem" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8E6524" stopOpacity="0.9"></stop>
          <stop offset="1" stopColor="#4A3218" stopOpacity="0.9"></stop>
        </linearGradient>
        <linearGradient id="goldStroke" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#E8C766"></stop>
          <stop offset="1" stopColor="#8E6524"></stop>
        </linearGradient>
      </defs>

      <symbol id="logo-w" viewBox="0 0 24 24">
        <path fill="currentColor" d="M12 1l1.6 2.2L12 5.4 10.4 3.2z"></path>
        <path
          fill="currentColor"
          d="M1.5 5h4.6l3.6 10.6L12 9v5.6L10 20H8.1z"
        ></path>
        <path
          fill="currentColor"
          d="M22.5 5h-4.6l-3.6 10.6L12 9v5.6l2 5.4h1.9z"
        ></path>
      </symbol>

      <symbol id="coin-art" viewBox="0 0 200 200">
        <circle cx="100" cy="100" r="97" fill="url(#coinRim)"></circle>
        <circle
          cx="100"
          cy="100"
          r="97"
          fill="none"
          stroke="#F0DC9A"
          strokeWidth="3"
          strokeDasharray="2 4.35"
          opacity="0.5"
        ></circle>
        <circle cx="100" cy="100" r="86" fill="url(#coinFace)"></circle>
        <circle
          cx="100"
          cy="100"
          r="86"
          fill="none"
          stroke="#4A3218"
          strokeWidth="1.2"
          opacity="0.5"
        ></circle>
        <circle
          cx="100"
          cy="100"
          r="76"
          fill="none"
          stroke="#6B4A25"
          strokeWidth="0.8"
          opacity="0.55"
        ></circle>
        <circle
          cx="100"
          cy="100"
          r="68"
          fill="none"
          stroke="#6B4A25"
          strokeWidth="0.8"
          opacity="0.55"
        ></circle>
        <circle
          cx="100"
          cy="100"
          r="72"
          fill="none"
          stroke="#4A3218"
          strokeWidth="4"
          strokeDasharray="1.5 6 4 4 1 9"
          opacity="0.45"
        ></circle>
        <g
          transform="translate(100 104) scale(4.2) translate(-12 -12)"
          fill="url(#emblem)"
        >
          <path d="M12 1l1.6 2.2L12 5.4 10.4 3.2z"></path>
          <path d="M1.5 5h4.6l3.6 10.6L12 9v5.6L10 20H8.1z"></path>
          <path d="M22.5 5h-4.6l-3.6 10.6L12 9v5.6l2 5.4h1.9z"></path>
        </g>
        <g
          transform="translate(100.6 103.4) scale(4.2) translate(-12 -12)"
          fill="none"
          stroke="#FFF1C4"
          strokeWidth="0.18"
          opacity="0.6"
        >
          <path d="M1.5 5h4.6l3.6 10.6L12 9v5.6L10 20H8.1z"></path>
          <path d="M22.5 5h-4.6l-3.6 10.6L12 9v5.6l2 5.4h1.9z"></path>
        </g>
        <path
          d="M150 58 L138 70 L141 76 L130 88"
          fill="none"
          stroke="#3A2718"
          strokeWidth="0.9"
          opacity="0.5"
        ></path>
        <ellipse
          cx="70"
          cy="60"
          rx="34"
          ry="18"
          fill="#FFF8E1"
          opacity="0.2"
          transform="rotate(-30 70 60)"
        ></ellipse>
      </symbol>

      <symbol id="ornament" viewBox="0 0 220 16">
        <path d="M0 8 H88" stroke="url(#goldStroke)" strokeWidth="1"></path>
        <path d="M132 8 H220" stroke="url(#goldStroke)" strokeWidth="1"></path>
        <path
          d="M92 8 L98 4 L104 8 L98 12 Z M116 8 L122 4 L128 8 L122 12 Z"
          fill="#B88632"
          opacity="0.8"
        ></path>
        <path d="M110 0 L116 8 L110 16 L104 8 Z" fill="#D4AF37"></path>
        <path d="M110 4 L113 8 L110 12 L107 8 Z" fill="#0B0A08"></path>
      </symbol>

      <symbol id="quest-mark" viewBox="0 0 24 24">
        <path
          d="M9.5 2h5l-1 13h-3z"
          fill="#E8C24A"
          stroke="#3A2718"
          strokeWidth="1.2"
          strokeLinejoin="round"
        ></path>
        <circle
          cx="12"
          cy="19.5"
          r="2.4"
          fill="#E8C24A"
          stroke="#3A2718"
          strokeWidth="1.2"
        ></circle>
      </symbol>

      <symbol id="swords" viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M3 2l7.5 7.5-1.4 1.4L1.6 3.4 1.5 2zM21 2h1.5l-.1 1.4-11.8 11.8 1.4 1.4-1.4 1.4-1.8-1.8-3.3 3.3.4 1.6-1.4 1.4-2.8-2.8 1.4-1.4 1.6.4 3.3-3.3-1.8-1.8 1.4-1.4 1.4 1.4zM14.3 13.5l1.4-1.4 1.4 1.4 1.4-1.4 1.4 1.4-1.8 1.8 3.3 3.3 1.6-.4 1.4 1.4-2.8 2.8-1.4-1.4.4-1.6-3.3-3.3-1.8 1.8-1.4-1.4 1.4-1.4z"
        ></path>
      </symbol>
    </svg>
  );
}
