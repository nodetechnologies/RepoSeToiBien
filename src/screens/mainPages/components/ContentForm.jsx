const ContentForm = ({
  backgroundColor = '#efefef', // Default background color
  strokeColor = '#d3d3d3', // Default stroke color
  fillColor = '#d3d3d3', // Default fill color for secondary rectangles
  color = '#e21e1e', // Default primary color
}) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 113 142" id="Calque_2">
    <g id="Calque_1-2">
      {/* Background Rectangle */}
      <rect
        fill={backgroundColor}
        width="113"
        height="142"
        rx="7.75"
        ry="7.75"
      />
      {/* Stroked Rectangles */}
      <rect
        fill="none"
        stroke={strokeColor}
        strokeMiterlimit="10"
        x="9.9"
        y="13.32"
        width="93.6"
        height="16.18"
        rx="7.75"
        ry="7.75"
      />
      <rect
        fill="none"
        stroke={strokeColor}
        strokeMiterlimit="10"
        x="10.37"
        y="36.54"
        width="93.6"
        height="16.18"
        rx="7.75"
        ry="7.75"
      />
      <rect
        fill="none"
        stroke={strokeColor}
        strokeMiterlimit="10"
        x="10.14"
        y="59.93"
        width="93.6"
        height="16.18"
        rx="7.75"
        ry="7.75"
      />
      <rect
        fill="none"
        stroke={strokeColor}
        strokeMiterlimit="10"
        x="10.6"
        y="83.15"
        width="93.6"
        height="16.18"
        rx="7.75"
        ry="7.75"
      />
      {/* Filled Rectangle */}
      <rect
        fill={fillColor}
        x="16.92"
        y="113.87"
        width="80.08"
        height="14.29"
        rx="7.15"
        ry="7.15"
      />
      {/* Primary Rectangle */}
      <rect
        fill={color}
        x="30.96"
        y="118.58"
        width="52.7"
        height="4.89"
        rx="2.44"
        ry="2.44"
      />
    </g>
  </svg>
);

export default ContentForm;
