const LogFeed = ({
  backgroundColor = '#d3d3d3', // Default background color
  secondaryColor = '#efefef', // Default secondary fill color
  color = '#e21e1e', // Default primary fill color
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 204.5 108.68"
    id="Calque_2"
  >
    <defs>
      <style>
        {`
            .cls-1 { fill: ${secondaryColor}; }
            .cls-2 { fill: ${backgroundColor}; }
            .cls-3 { fill: ${color}; }
          `}
      </style>
    </defs>
    <g id="Calque_1-2">
      <rect
        className="cls-2"
        width="204.5"
        height="108.68"
        rx="8.55"
        ry="8.55"
      />
      <rect
        className="cls-1"
        x="94.49"
        y="13.07"
        width="97.04"
        height="19.61"
        rx="5.29"
        ry="5.29"
      />
      <rect
        className="cls-1"
        x="12.73"
        y="42.01"
        width="122.76"
        height="19.61"
        rx="6.04"
        ry="6.04"
      />
      <rect
        className="cls-3"
        x="67.73"
        y="71.01"
        width="123.04"
        height="25.66"
        rx="6.63"
        ry="6.63"
      />
    </g>
  </svg>
);

export default LogFeed;
