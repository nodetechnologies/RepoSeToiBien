import React from 'react';

const DynamicSvg = ({ color1, color2, width, height }) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clip-path="url(#clip0_1_4576)">
        <circle
          cx="285.63"
          cy="492.63"
          r="64.4482"
          transform="rotate(9.28246 285.63 492.63)"
          stroke="black"
          stroke-width="22"
        />
        <path
          d="M731.593 143.097C742.367 149.235 742.367 164.765 731.593 170.903L621.919 233.375C611.253 239.451 598 231.748 598 219.472L598 94.5276C598 82.2521 611.253 74.5491 621.919 80.6249L731.593 143.097Z"
          fill={color1}
        />
        <path
          d="M70 207C70 195.954 78.9543 187 90 187L197 187C208.046 187 217 195.954 217 207L217 314C217 325.046 208.046 334 197 334L90 334C78.9543 334 70 325.046 70 314L70 207Z"
          fill={color2}
        />
        <rect x="452" y="627" width="146" height="146" rx="73" fill="#200EF0" />
      </g>
      <defs>
        <linearGradient
          id="paint0_linear_1_4576"
          x1="408.962"
          y1="773.183"
          x2="408.797"
          y2="818.256"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#200EF0" />
          <stop offset="1" stop-color="#5030E5" stop-opacity="0" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_1_4576"
          x1="74"
          y1="711"
          x2="74"
          y2="729"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#5CD331" />
          <stop offset="1" stop-color="#078C04" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default DynamicSvg;
