export default function AppBackground() {
    return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" className="absolute inset-0">
            <defs>
              <linearGradient id="dark-gradient-a" gradientUnits="objectBoundingBox" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#1a1a2e">
                  <animate attributeName="stop-color"
                    values="#1a1a2e;#282846;#0f0f1f;#1a1a2e;" dur="20s" repeatCount="indefinite">
                  </animate>
                </stop>
                <stop offset=".5" stopColor="#0f0f1f">
                  <animate attributeName="stop-color"
                    values="#0f0f1f;#282846;#3a3a5a;#0f0f1f;" dur="20s" repeatCount="indefinite">
                  </animate>
                </stop>
                <stop offset="1" stopColor="#282846">
                  <animate attributeName="stop-color"
                    values="#282846;#1a1a2e;#3a3a5a;#282846;" dur="20s" repeatCount="indefinite">
                  </animate>
                </stop>
                <animateTransform attributeName="gradientTransform" type="rotate" from="0 .5 .5" to="360 .5 .5"
                  dur="20s" repeatCount="indefinite" />
              </linearGradient>
      
              <linearGradient id="dark-gradient-b" gradientUnits="objectBoundingBox" x1="0" y1="1" x2="1" y2="1">
                <stop offset="0" stopColor="#0c0c24">
                  <animate attributeName="stop-color"
                    values="#0c0c24;#1a1a2e;#282846;#0c0c24;" dur="20s" repeatCount="indefinite">
                  </animate>
                </stop>
                <stop offset="1" stopColor="#1a1a2e" stopOpacity="0">
                  <animate attributeName="stop-color"
                    values="#1a1a2e;#0f0f1f;#282846;#1a1a2e;" dur="20s" repeatCount="indefinite">
                  </animate>
                </stop>
                <animateTransform attributeName="gradientTransform" type="rotate" values="360 .5 .5;0 .5 .5"
                  dur="10s" repeatCount="indefinite" />
              </linearGradient>
            </defs>
      
            <rect fill="url(#dark-gradient-a)" width="100%" height="100%" />
            <rect fill="url(#dark-gradient-b)" width="100%" height="100%" />
          </svg>
    )
}   