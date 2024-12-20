const Map = ({
  backgroundColor = '#efefef', // Default background color
  strokeColor = '#e2e2e2', // Default stroke color
  color = '#e21e1e', // Default primary fill color
  highlightColor = '#fff', // Default highlight color
}) => (
  <svg
    id="Calque_2"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 204.57 108.93"
  >
    <g id="Calque_1-2">
      {/* Background Rectangle */}
      <rect
        fill={backgroundColor}
        x=".04"
        y=".17"
        width="204.5"
        height="108.68"
        rx="8.55"
        ry="8.55"
      />
      {/* Primary Path (Circle) */}
      <path
        fill={color}
        d="M54.23,44.53c0,3.31-2.69,6-6,6-2.83,0-5.21-1.96-5.84-4.6-.11-.45-.16-.92-.16-1.4,0-3.31,2.69-6,6-6s6,2.69,6,6Z"
      />
      {/* Primary Polygon */}
      <polygon
        fill={color}
        points="48.23 56.8 54.23 45.53 42.23 45.53 48.23 56.8"
      />
      {/* Stroked Path */}
      <path
        fill="none"
        stroke={strokeColor}
        strokeMiterlimit="10"
        strokeWidth="2"
        d="M40.36,1.17s14.87-3.64,22.87,23.36,24,56,24,56l117.3,4"
      />
      {/* Horizontal Stroked Line */}
      <line
        fill="none"
        stroke={strokeColor}
        strokeMiterlimit="10"
        strokeWidth="2"
        x1="87.23"
        y1="80.53"
        x2=".04"
        y2="77.43"
      />
      {/* Curved Path with Stroke */}
      <path
        fill="none"
        stroke={strokeColor}
        strokeMiterlimit="10"
        strokeWidth="2"
        d="M127.82,81.91s10.41.62,11.41,10.62,1.57,16.32,1.57,16.32"
      />
      {/* Another Horizontal Line */}
      <line
        fill="none"
        stroke={strokeColor}
        strokeMiterlimit="10"
        strokeWidth="2"
        x1="75.54"
        y1="56.8"
        x2="1.06"
        y2="56.8"
      />
      {/* Polyline */}
      <polyline
        fill="none"
        stroke={strokeColor}
        strokeMiterlimit="10"
        strokeWidth="2"
        points="67.16 36.35 126.13 37.69 163.15 38.53 163.15 83.12"
      />
      {/* Another Curved Path */}
      <path
        fill="none"
        stroke={strokeColor}
        strokeMiterlimit="10"
        strokeWidth="2"
        d="M126.13,37.69s1.1-9.16-5.9-23.16-12.78-13.53-12.78-13.53"
      />
      {/* Highlight Rectangles */}
      <rect fill={highlightColor} x="182.23" y="73.53" width="12" height="12" />
      <rect fill={highlightColor} x="182.23" y="88.53" width="12" height="12" />
    </g>
  </svg>
);

export default Map;
