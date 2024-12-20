const Files = ({
  backgroundColor = '#efefef', // Default background color
  secondaryColor = '#fff', // Default secondary color
  strokeColor = '#d3d3d3', // Default stroke color
  fillColor = '#d3d3d3', // Default fill color
  color = '#e21e1e', // Default primary color
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 128.69 118.63"
    id="Calque_2"
  >
    <g id="Calque_1-2">
      {/* Background Rectangle */}
      <rect
        fill={backgroundColor}
        width="128.69"
        height="118.63"
        rx="7.75"
        ry="7.75"
      />
      {/* Gray Rectangle */}
      <rect
        fill={fillColor}
        x="39.69"
        y="76.63"
        width="50"
        height="6"
        rx=".54"
        ry=".54"
      />
      {/* Stroked Rectangle */}
      <rect
        fill="none"
        stroke={strokeColor}
        strokeMiterlimit="10"
        x="9.67"
        y="8.5"
        width="110.52"
        height="102.63"
        rx="7.75"
        ry="7.75"
      />
      {/* Gray Rectangle */}
      <rect
        fill={fillColor}
        x="46.25"
        y="85.37"
        width="38.44"
        height="4.61"
        rx=".54"
        ry=".54"
      />
      {/* White Path */}
      <path
        fill={secondaryColor}
        d="M37.08,42.94h-13.95c-1.26,0-2.29-1.03-2.29-2.29v-18.29c0-1.26,1.03-2.29,2.29-2.29h13.95c1.26,0,2.29,1.03,2.29,2.29v18.29c0,1.26-1.03,2.29-2.29,2.29Z"
      />
      {/* Red Path */}
      <path
        fill={color}
        d="M23.13,22.36h13.95v3.43h-13.95v-3.43ZM35.7,30.36h-11.66c-.39,0-.69-.3-.69-.69s.3-.69.69-.69h11.66c.39,0,.69.3.69.69s-.3.69-.69.69ZM35.7,33.79h-11.66c-.39,0-.69-.3-.69-.69s.3-.69.69-.69h11.66c.39,0,.69.3.69.69s-.3.69-.69.69ZM30.1,37.22h-6.06c-.39,0-.69-.3-.69-.69s.3-.69.69-.69h6.06c.39,0,.69.3.69.69s-.3.69-.69.69Z"
      />
      {/* White Path */}
      <path
        fill={secondaryColor}
        d="M64.93,43.25h-13.95c-1.26,0-2.29-1.03-2.29-2.29v-18.29c0-1.26,1.03-2.29,2.29-2.29h13.95c1.26,0,2.29,1.03,2.29,2.29v18.29c0,1.26-1.03,2.29-2.29,2.29Z"
      />
      {/* Gray Path */}
      <path
        fill={fillColor}
        d="M50.98,22.67h13.95v3.43h-13.95v-3.43ZM63.56,30.67h-11.66c-.39,0-.69-.3-.69-.69s.3-.69.69-.69h11.66c.39,0,.69.3.69.69s-.3.69-.69.69ZM63.56,34.1h-11.66c-.39,0-.69-.3-.69-.69s.3-.69.69-.69h11.66c.39,0,.69.3.69.69s-.3.69-.69.69ZM57.96,37.53h-6.06c-.39,0-.69-.3-.69-.69s.3-.69.69-.69h6.06c.39,0,.69.3.69.69s-.3.69-.69.69Z"
      />
      {/* White Path */}
      <path
        fill={secondaryColor}
        d="M91.4,43.33h-13.95c-1.26,0-2.29-1.03-2.29-2.29v-18.29c0-1.26,1.03-2.29,2.29-2.29h13.95c1.26,0,2.29,1.03,2.29,2.29v18.29c0,1.26-1.03,2.29-2.29,2.29Z"
      />
      {/* Gray Path */}
      <path
        fill={fillColor}
        d="M77.45,22.75h13.95v3.43h-13.95v-3.43ZM90.02,30.76h-11.66c-.39,0-.69-.3-.69-.69s.3-.69.69-.69h11.66c.39,0,.69.3.69.69s-.3.69-.69.69ZM90.02,34.19h-11.66c-.39,0-.69-.3-.69-.69s.3-.69.69-.69h11.66c.39,0,.69.3.69.69s-.3.69-.69.69ZM84.42,37.62h-6.06c-.39,0-.69-.3-.69-.69s.3-.69.69-.69h6.06c.39,0,.69.3.69.69s-.3.69-.69.69Z"
      />
    </g>
  </svg>
);

export default Files;
