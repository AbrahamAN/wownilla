/** Preserves the original illustrated login scene behind the interactive queue. */
export function QueueScene() {
  return (
    <div id="queueScene" aria-hidden="true">
      <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="qSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#14071C"></stop>
            <stop offset="0.28" stopColor="#3E0B1C"></stop>
            <stop offset="0.5" stopColor="#8E1D17"></stop>
            <stop offset="0.66" stopColor="#E0561A"></stop>
            <stop offset="0.76" stopColor="#FFA23F"></stop>
            <stop offset="1" stopColor="#5A1A0E"></stop>
          </linearGradient>
          <linearGradient id="qStone" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#1C1519"></stop>
            <stop offset="0.6" stopColor="#3A2D30"></stop>
            <stop offset="1" stopColor="#8A461E"></stop>
          </linearGradient>
          <linearGradient id="qStoneR" x1="1" y1="0" x2="0" y2="0">
            <stop offset="0" stopColor="#1C1519"></stop>
            <stop offset="0.6" stopColor="#3A2D30"></stop>
            <stop offset="1" stopColor="#8A461E"></stop>
          </linearGradient>
          <linearGradient id="qLintel" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#231A1F"></stop>
            <stop offset="0.7" stopColor="#3B2C2E"></stop>
            <stop offset="1" stopColor="#9A5220"></stop>
          </linearGradient>
          <linearGradient id="qPortalSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#FFE9B8"></stop>
            <stop offset="0.45" stopColor="#F9D08A"></stop>
            <stop offset="1" stopColor="#D9A45A"></stop>
          </linearGradient>
          <linearGradient id="qFloor" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#4A2A20"></stop>
            <stop offset="1" stopColor="#140C0E"></stop>
          </linearGradient>
          <radialGradient id="qGlow" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#FFC266" stopOpacity="0.75"></stop>
            <stop offset="0.5" stopColor="#FF7A1A" stopOpacity="0.25"></stop>
            <stop offset="1" stopColor="#FF5A00" stopOpacity="0"></stop>
          </radialGradient>
          <radialGradient id="qFire" cx="0.5" cy="0.8" r="0.6">
            <stop offset="0" stopColor="#FFF7D6"></stop>
            <stop offset="0.35" stopColor="#FFC14A"></stop>
            <stop offset="0.75" stopColor="#FF6A12"></stop>
            <stop offset="1" stopColor="#C62A05" stopOpacity="0"></stop>
          </radialGradient>
          <filter id="qBlur" x="-20%" y="-50%" width="140%" height="200%">
            <feGaussianBlur stdDeviation="10"></feGaussianBlur>
          </filter>
          <filter id="qEyeBlur" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="3"></feGaussianBlur>
          </filter>
          <clipPath id="qPortalClip">
            <rect x="628" y="330" width="344" height="500"></rect>
          </clipPath>

          <g id="qGuardian">
            <path
              fill="url(#qStone)"
              d="M0 -565 C-45 -562 -78 -525 -82 -470 C-85 -440 -95 -420 -120 -400 C-142 -385 -136 -300 -128 -200 L-124 -22 L-142 0 L142 0 L124 -22 L128 -200 C136 -300 142 -385 120 -400 C95 -420 85 -440 82 -470 C78 -525 45 -562 0 -565 Z"
            ></path>
            <path
              d="M-92 -380 C-80 -300 -60 -250 -40 -200 M92 -380 C80 -300 60 -250 40 -200 M-70 -180 L-78 -20 M70 -180 L78 -20 M-35 -150 L-40 -20 M35 -150 L40 -20"
              stroke="#120C0F"
              strokeWidth="5"
              fill="none"
              opacity="0.7"
            ></path>
            <ellipse cx="0" cy="-462" rx="40" ry="50" fill="#070405"></ellipse>
            <circle cx="0" cy="-398" r="11" fill="#2A2124"></circle>
            <rect x="-7" y="-390" width="14" height="52" fill="#1E181B"></rect>
            <path
              d="M-58 -338 L58 -338 L50 -324 L-50 -324 Z"
              fill="#2A2124"
            ></path>
            <path
              d="M-10 -324 L10 -324 L10 -40 L0 -12 L-10 -40 Z"
              fill="#332829"
            ></path>
            <path
              d="M2 -324 L10 -324 L10 -40 L2 -22 Z"
              fill="#8A461E"
              opacity="0.35"
            ></path>
            <ellipse
              cx="-16"
              cy="-362"
              rx="24"
              ry="18"
              fill="#2E2427"
            ></ellipse>
            <ellipse cx="16" cy="-360" rx="24" ry="18" fill="#3A2D30"></ellipse>
            <g className="eyes">
              <ellipse
                cx="-15"
                cy="-470"
                rx="9"
                ry="4"
                fill="#FF2A12"
                filter="url(#qEyeBlur)"
              ></ellipse>
              <ellipse
                cx="15"
                cy="-470"
                rx="9"
                ry="4"
                fill="#FF2A12"
                filter="url(#qEyeBlur)"
              ></ellipse>
              <ellipse
                cx="-15"
                cy="-470"
                rx="5"
                ry="2.2"
                fill="#FFB199"
              ></ellipse>
              <ellipse
                cx="15"
                cy="-470"
                rx="5"
                ry="2.2"
                fill="#FFB199"
              ></ellipse>
            </g>
            <path
              d="M-160 0 L160 0 L170 20 L170 70 L-170 70 L-170 20 Z"
              fill="#241A1D"
            ></path>
            <path
              d="M-160 0 L160 0 L170 20 L-170 20 Z"
              fill="#6A3A22"
              opacity="0.8"
            ></path>
          </g>

          <g id="qBrazier">
            <ellipse
              cx="0"
              cy="-10"
              rx="150"
              ry="120"
              fill="url(#qGlow)"
            ></ellipse>
            <path
              className="flame"
              d="M-52 -60 C-60 -110 -30 -130 -20 -175 C-8 -140 10 -150 8 -200 C40 -160 60 -120 52 -60 Z"
              fill="url(#qFire)"
            ></path>
            <path
              className="flame b"
              d="M-30 -60 C-34 -95 -12 -110 -4 -140 C8 -112 30 -105 28 -60 Z"
              fill="#FFF3C4"
              opacity="0.8"
            ></path>
            <path d="M-80 -62 L80 -62 L66 -10 L-66 -10 Z" fill="#2B2023"></path>
            <path d="M-80 -62 L80 -62 L78 -52 L-78 -52 Z" fill="#B0602A"></path>
            <rect x="-40" y="-10" width="80" height="60" fill="#1E171A"></rect>
            <rect x="-60" y="44" width="120" height="16" fill="#2B2023"></rect>
          </g>
        </defs>
        <rect width="1600" height="900" fill="url(#qSky)"></rect>
        <g className="clouds" filter="url(#qBlur)" opacity="0.8">
          <ellipse cx="260" cy="210" rx="360" ry="34" fill="#2A0712"></ellipse>
          <ellipse cx="1300" cy="170" rx="420" ry="40" fill="#2A0712"></ellipse>
          <ellipse cx="420" cy="360" rx="330" ry="22" fill="#6A1410"></ellipse>
          <ellipse cx="1250" cy="330" rx="360" ry="26" fill="#6A1410"></ellipse>
          <ellipse
            cx="200"
            cy="470"
            rx="260"
            ry="16"
            fill="#B63A14"
            opacity="0.7"
          ></ellipse>
          <ellipse
            cx="1420"
            cy="450"
            rx="280"
            ry="18"
            fill="#B63A14"
            opacity="0.7"
          ></ellipse>
        </g>
        <path
          fill="#2A0F12"
          d="M0 900 L0 540 L70 470 L110 520 L170 380 L230 470 L280 430 L330 560 L420 600 L420 900 Z"
        ></path>
        <path
          fill="#2A0F12"
          d="M1600 900 L1600 520 L1540 460 L1500 500 L1440 360 L1390 450 L1330 420 L1290 560 L1200 610 L1200 900 Z"
        ></path>
        <path
          fill="none"
          stroke="#E0561A"
          strokeWidth="2"
          opacity="0.5"
          d="M70 470 L110 520 L170 380 L230 470 M1540 460 L1500 500 L1440 360 L1390 450"
        ></path>
        <g clipPath="url(#qPortalClip)">
          <rect
            x="620"
            y="320"
            width="360"
            height="520"
            fill="url(#qPortalSky)"
          ></rect>
          <circle
            cx="800"
            cy="520"
            r="90"
            fill="#FFF6DA"
            opacity="0.8"
          ></circle>
          <path
            fill="#B7A06A"
            d="M620 600 C690 560 740 590 800 570 C870 548 920 580 980 560 L980 840 L620 840 Z"
          ></path>
          <path
            fill="#7E8A4C"
            d="M620 650 C700 630 760 660 820 640 C890 620 940 650 980 640 L980 840 L620 840 Z"
          ></path>
          <path
            fill="#5A6A38"
            d="M620 720 C680 700 720 730 780 715 C860 695 930 730 980 710 L980 840 L620 840 Z"
          ></path>
          <path
            fill="#EAD29A"
            opacity="0.9"
            d="M790 640 C780 680 820 700 800 740 C780 780 760 800 770 840 L830 840 C820 800 850 770 845 730 C840 690 815 670 808 640 Z"
          ></path>
          <rect
            className="portal-shimmer"
            x="620"
            y="320"
            width="360"
            height="520"
            fill="#FFE0A0"
          ></rect>
        </g>
        <path
          fill="url(#qStone)"
          d="M470 860 L480 330 L628 330 L628 860 Z"
        ></path>
        <path
          fill="url(#qStoneR)"
          d="M972 860 L972 330 L1120 330 L1130 860 Z"
        ></path>
        <path
          fill="url(#qLintel)"
          d="M420 330 L430 230 L520 205 L700 190 L900 192 L1080 205 L1170 228 L1180 330 Z"
        ></path>
        <path
          fill="none"
          stroke="#120C0F"
          strokeWidth="4"
          opacity="0.6"
          d="M480 460 L628 470 M480 610 L628 600 M972 480 L1120 470 M972 640 L1120 630 M560 205 L560 330 M1040 205 L1040 330"
        ></path>
        <g opacity="0.85" style={{ mixBlendMode: "luminosity" }}>
          <use href="#coin-art" x="740" y="200" width="120" height="120"></use>
        </g>
        <ellipse
          cx="800"
          cy="600"
          rx="330"
          ry="340"
          fill="url(#qGlow)"
          opacity="0.8"
        ></ellipse>
        <path
          fill="url(#qFloor)"
          d="M0 840 L1600 840 L1600 900 L0 900 Z"
        ></path>
        <path
          fill="#FF9A3A"
          opacity="0.25"
          d="M620 840 L980 840 L1180 900 L420 900 Z"
        ></path>
        <use
          className="g-left"
          href="#qGuardian"
          transform="translate(440 780)"
        ></use>
        <use
          className="g-right"
          href="#qGuardian"
          transform="translate(1160 780) scale(-1 1)"
        ></use>
        <use
          className="brazier"
          href="#qBrazier"
          transform="translate(190 820)"
        ></use>
        <use
          className="brazier"
          href="#qBrazier"
          transform="translate(1410 820)"
        ></use>
      </svg>
      <div id="qEmbers" className="absolute inset-0 pointer-events-none"></div>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 75% at 50% 50%, transparent 55%, rgba(0,0,0,0.6) 100%)",
        }}
      ></div>
    </div>
  );
}
