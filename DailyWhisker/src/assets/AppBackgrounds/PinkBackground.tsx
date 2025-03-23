export default function AppBackground() {
  return (
    <div className="fixed w-full h-full -z-10">
      <svg xmlns="http://www.w3.org/2000/svg" className="w-screen h-screen">
        <defs>
          <linearGradient id="purple-blue-gradient-a" gradientUnits="objectBoundingBox" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#3b0764">
              <animate attributeName="stop-color"
                values="#3b0764;#6a0dad;#3b0764;#240046;"
                dur="15s" repeatCount="indefinite" />
            </stop>
            <stop offset=".5" stopColor="#6a0dad">
              <animate attributeName="stop-color"
                values="#6a0dad;#480ca8;#6a0dad;#560bad;"
                dur="15s" repeatCount="indefinite" />
            </stop>
            <stop offset="1" stopColor="#480ca8">
              <animate attributeName="stop-color"
                values="#480ca8;#560bad;#240046;#480ca8;"
                dur="15s" repeatCount="indefinite" />
            </stop>
            <animateTransform attributeName="gradientTransform" type="rotate"
              from="0 .5 .5" to="360 .5 .5" dur="30s" repeatCount="indefinite" />
          </linearGradient>

          <linearGradient id="purple-blue-gradient-b" gradientUnits="objectBoundingBox" x1="0" y1="1" x2="1" y2="1">
            <stop offset="0" stopColor="#240046">
              <animate attributeName="stop-color"
                values="#240046;#560bad;#480ca8;#240046;"
                dur="15s" repeatCount="indefinite" />
            </stop>
            <stop offset="1" stopColor="#560bad" stopOpacity="0.8">
              <animate attributeName="stop-color"
                values="#560bad;#3b0764;#6a0dad;#560bad;"
                dur="15s" repeatCount="indefinite" />
            </stop>
            <animateTransform attributeName="gradientTransform" type="rotate"
              values="360 .5 .5;0 .5 .5" dur="20s" repeatCount="indefinite" />
          </linearGradient>
        </defs>

        <rect fill="url(#purple-blue-gradient-a)" width="100%" height="100%" />
        <rect fill="url(#purple-blue-gradient-b)" width="100%" height="100%" />
      </svg>
    </div>
  );
}
