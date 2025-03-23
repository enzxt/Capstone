export default function PWBackground() {
    return (
      <div className="fixed w-full h-full -z-10">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-screen h-screen">
          <defs>
            <linearGradient id="green-purple-gradient-a" gradientUnits="objectBoundingBox" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#004d00"> 
                <animate attributeName="stop-color"
                  values="#004d00;#2e8b57;#004d00;#006400;"
                  dur="15s" repeatCount="indefinite" />
              </stop>
              <stop offset=".5" stopColor="#2e8b57">
                <animate attributeName="stop-color"
                  values="#2e8b57;#6a0dad;#2e8b57;#560bad;"
                  dur="15s" repeatCount="indefinite" />
              </stop>
              <stop offset="1" stopColor="#6a0dad">
                <animate attributeName="stop-color"
                  values="#6a0dad;#560bad;#004d00;#6a0dad;"
                  dur="15s" repeatCount="indefinite" />
              </stop>
              <animateTransform attributeName="gradientTransform" type="rotate"
                from="0 .5 .5" to="360 .5 .5" dur="30s" repeatCount="indefinite" />
            </linearGradient>
  
            <linearGradient id="green-purple-gradient-b" gradientUnits="objectBoundingBox" x1="0" y1="1" x2="1" y2="1">
              <stop offset="0" stopColor="#004d00">
                <animate attributeName="stop-color"
                  values="#004d00;#560bad;#6a0dad;#004d00;"
                  dur="15s" repeatCount="indefinite" />
              </stop>
              <stop offset="1" stopColor="#560bad" stopOpacity="0.8">
                <animate attributeName="stop-color"
                  values="#560bad;#3b0764;#2e8b57;#560bad;"
                  dur="15s" repeatCount="indefinite" />
              </stop>
              <animateTransform attributeName="gradientTransform" type="rotate"
                values="360 .5 .5;0 .5 .5" dur="20s" repeatCount="indefinite" />
            </linearGradient>
          </defs>
  
          <rect fill="url(#green-purple-gradient-a)" width="100%" height="100%" />
          <rect fill="url(#green-purple-gradient-b)" width="100%" height="100%" />
        </svg>
      </div>
    );
  }
  