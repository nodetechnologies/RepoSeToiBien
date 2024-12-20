const StatusesEvolution = ({
  backgroundColor = '#d3d3d3', // Default background color for rectangles and circles
  color = '#e21e1e', // Default primary color
  secondaryColor = '#fff', // Default secondary color
}) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 239 38" id="Calque_2">
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
      <rect className="cls-2" x="19" y="18" width="205" height="3" />
      <rect
        className="cls-2"
        x="0"
        y="0"
        width="38"
        height="38"
        rx="19"
        ry="19"
      />
      <rect
        className="cls-2"
        x="65"
        y="0"
        width="38"
        height="38"
        rx="19"
        ry="19"
      />
      <rect
        className="cls-2"
        x="133"
        y="0"
        width="38"
        height="38"
        rx="19"
        ry="19"
      />
      <rect
        className="cls-3"
        x="201"
        y="0"
        width="38"
        height="38"
        rx="19"
        ry="19"
      />
      <rect
        className="cls-1"
        x="214"
        y="13"
        width="12"
        height="12"
        rx="1.99"
        ry="1.99"
      />
    </g>
  </svg>
);

export default StatusesEvolution;
