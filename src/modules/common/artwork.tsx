/** Shares the mug coin logo and ornament artwork across the page. */
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
        <linearGradient id="goldStroke" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#E8C766"></stop>
          <stop offset="1" stopColor="#8E6524"></stop>
        </linearGradient>
      </defs>

      {/* The mug alone is the coin: no rim or coin face, at icon and medallion sizes alike. */}
      <symbol id="logo-mug" viewBox="0 0 24 24">
        <image href="/assets/wownilla-mug.webp" width="24" height="24"></image>
      </symbol>

      <symbol id="coin-art" viewBox="0 0 200 200">
        <image
          href="/assets/wownilla-mug.webp"
          width="200"
          height="200"
        ></image>
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
