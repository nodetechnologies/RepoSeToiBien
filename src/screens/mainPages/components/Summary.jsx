import React from 'react';

const Summary = ({ color }) => {
  return (
    <svg
      id="Calque_2"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 204.5 75.7"
    >
      <defs>
        <style>
          {`
            .cls-1 { fill: #efefef; }
            .cls-2 { fill: #d3d3d3; }
            .cls-3 { fill: ${color} }
          `}
        </style>
      </defs>
      <g id="Calque_1-2">
        <rect
          className="cls-2"
          width="204.5"
          height="75.7"
          rx="8.55"
          ry="8.55"
        />
        <rect
          className="cls-1"
          x="10.49"
          y="14.07"
          width="49.97"
          height="48.63"
          rx="5.29"
          ry="5.29"
        />
        <rect
          className="cls-1"
          x="68.73"
          y="14.01"
          width="65.73"
          height="48.69"
          rx="6.04"
          ry="6.04"
        />
        <rect
          className="cls-3"
          x="143.45"
          y="14.01"
          width="48.32"
          height="48.69"
          rx="6.63"
          ry="6.63"
        />
      </g>
    </svg>
  );
};

export default Summary;
