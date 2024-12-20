const QuickNote = ({
  backgroundColor = '#d3d3d3',
  innerBackgroundColor = '#efefef',
  color = '#e21e1e',
  secondaryColor = '#fff',
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 204.5 108.68"
    id="Calque_2"
  >
    <g id="Calque_1-2">
      <rect
        fill={backgroundColor}
        width="204.5"
        height="108.68"
        rx="8.55"
        ry="8.55"
      />
      <rect
        fill={innerBackgroundColor}
        x="7.49"
        y="8.07"
        width="188.9"
        height="92.85"
        rx="5.29"
        ry="5.29"
      />
      <rect
        fill={color}
        x="16.31"
        y="17.82"
        width="139.08"
        height="8.87"
        rx="4.44"
        ry="4.44"
      />
      <rect
        fill={secondaryColor}
        x="160.75"
        y="17.36"
        width="26.64"
        height="8.87"
        rx="4.44"
        ry="4.44"
      />
      <rect
        fill={secondaryColor}
        x="16.49"
        y="33.21"
        width="170.91"
        height="8.87"
        rx="4.44"
        ry="4.44"
      />
      <rect
        fill={secondaryColor}
        x="16.36"
        y="48.21"
        width="170.91"
        height="8.87"
        rx="4.44"
        ry="4.44"
      />
      <rect
        fill={secondaryColor}
        x="17.36"
        y="63.21"
        width="93.04"
        height="8.87"
        rx="4.44"
        ry="4.44"
      />
    </g>
  </svg>
);

export default QuickNote;
