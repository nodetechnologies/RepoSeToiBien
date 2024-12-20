const CardDetails = ({
  color = '#e21e1e', // Default primary color
  secondaryColor = '#d3d3d3', // Default secondary color
  backgroundColor = '#efefef', // Default background color
}) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 133 142" id="Calque_2">
    <g id="Calque_1-2">
      {/* Background Rectangle */}
      <rect
        fill={backgroundColor}
        width="133"
        height="142"
        rx="7.75"
        ry="7.75"
      />
      {/* Primary Rectangles */}
      <rect
        fill={color}
        x="15"
        y="60"
        width="40"
        height="4"
        rx=".54"
        ry=".54"
      />
      <rect
        fill={color}
        x="57"
        y="60"
        width="25"
        height="4"
        rx=".54"
        ry=".54"
      />
      <rect
        fill={color}
        x="84"
        y="60"
        width="14"
        height="4"
        rx=".54"
        ry=".54"
      />
      <rect
        fill={color}
        x="100"
        y="60"
        width="20"
        height="4"
        rx=".54"
        ry=".54"
      />

      {/* Secondary Rectangles */}
      {[69, 78, 87].map((y) => (
        <>
          <rect
            key={`sec-15-${y}`}
            fill={secondaryColor}
            x="15"
            y={y}
            width="40"
            height="4"
            rx=".54"
            ry=".54"
          />
          <rect
            key={`sec-57-${y}`}
            fill={secondaryColor}
            x="57"
            y={y}
            width="25"
            height="4"
            rx=".54"
            ry=".54"
          />
          <rect
            key={`sec-84-${y}`}
            fill={secondaryColor}
            x="84"
            y={y}
            width="14"
            height="4"
            rx=".54"
            ry=".54"
          />
          <rect
            key={`sec-100-${y}`}
            fill={secondaryColor}
            x="100"
            y={y}
            width="20"
            height="4"
            rx=".54"
            ry=".54"
          />
        </>
      ))}

      {/* Additional Rectangles */}
      {[100, 105.5, 111].map((y) => (
        <>
          <rect
            key={`add-84-${y}`}
            fill={secondaryColor}
            x="84"
            y={y}
            width="14"
            height="3"
            rx=".54"
            ry=".54"
          />
          <rect
            key={`add-100-${y}`}
            fill={secondaryColor}
            x="100"
            y={y}
            width="20"
            height="3"
            rx=".54"
            ry=".54"
          />
        </>
      ))}

      {/* Secondary Circle */}
      <circle fill={secondaryColor} cx="20" cy="25" r="5" />

      {/* More Secondary Rectangles */}
      <rect
        fill={secondaryColor}
        x="29"
        y="20"
        width="27"
        height="3"
        rx=".54"
        ry=".54"
      />
      <rect
        fill={secondaryColor}
        x="29"
        y="24"
        width="18"
        height="3"
        rx=".54"
        ry=".54"
      />
      <rect
        fill={secondaryColor}
        x="29"
        y="28"
        width="23"
        height="3"
        rx=".54"
        ry=".54"
      />

      {/* Transformed Secondary Rectangles */}
      <rect
        fill={secondaryColor}
        x="79"
        y="32.25"
        width="40.93"
        height="3"
        rx=".54"
        ry=".54"
        transform="translate(198.93 67.5) rotate(180)"
      />
      <rect
        fill={secondaryColor}
        x="92.64"
        y="36.25"
        width="27.28"
        height="3"
        rx=".54"
        ry=".54"
        transform="translate(212.57 75.5) rotate(180)"
      />
      <rect
        fill={secondaryColor}
        x="85.06"
        y="40.25"
        width="34.86"
        height="3"
        rx=".54"
        ry=".54"
        transform="translate(204.99 83.5) rotate(180)"
      />

      {/* Primary Small Rectangle */}
      <rect
        fill={color}
        x="103.93"
        y="20.25"
        width="16.07"
        height="4.75"
        rx="2.38"
        ry="2.38"
      />
    </g>
  </svg>
);

export default CardDetails;
