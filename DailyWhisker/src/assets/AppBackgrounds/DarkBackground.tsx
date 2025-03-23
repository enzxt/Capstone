export default function PWBackgroundDark() {
    return (
      <div className="fixed w-full h-full -z-10">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-screen h-screen">
          <defs>
            <linearGradient
              id="dark-gradient-a"
              gradientUnits="objectBoundingBox"
              x1="0"
              y1="0"
              x2="1"
              y2="1"
            >
              <stop offset="0" stopColor="#1a1a1a">
                <animate
                  attributeName="stop-color"
                  values="#1a1a1a;#4b0082;#1a1a1a"
                  dur="15s"
                  repeatCount="indefinite"
                />
              </stop>
              <stop offset="1" stopColor="#4b0082">
                <animate
                  attributeName="stop-color"
                  values="#4b0082;#1a1a1a;#4b0082"
                  dur="15s"
                  repeatCount="indefinite"
                />
              </stop>
              <animateTransform
                attributeName="gradientTransform"
                type="rotate"
                from="0 .5 .5"
                to="360 .5 .5"
                dur="30s"
                repeatCount="indefinite"
              />
            </linearGradient>
  
            <linearGradient
              id="dark-gradient-b"
              gradientUnits="objectBoundingBox"
              x1="0"
              y1="1"
              x2="1"
              y2="1"
            >
              <stop offset="0" stopColor="#1a1a1a">
                <animate
                  attributeName="stop-color"
                  values="#1a1a1a;#4b0082;#1a1a1a"
                  dur="15s"
                  repeatCount="indefinite"
                />
              </stop>
              <stop offset="1" stopColor="#4b0082" stopOpacity="0.8">
                <animate
                  attributeName="stop-color"
                  values="#4b0082;#1a1a1a;#4b0082"
                  dur="15s"
                  repeatCount="indefinite"
                />
              </stop>
              <animateTransform
                attributeName="gradientTransform"
                type="rotate"
                values="360 .5 .5;0 .5 .5"
                dur="20s"
                repeatCount="indefinite"
              />
            </linearGradient>
          </defs>
  
          <rect fill="url(#dark-gradient-a)" width="100%" height="100%" />
          <rect fill="url(#dark-gradient-b)" width="100%" height="100%" />
        </svg>
      </div>
    );
  }
  