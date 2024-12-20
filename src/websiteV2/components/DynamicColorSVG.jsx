import React from 'react';

const DynamicColorSVG = ({ color, geo }) => {
  return (
    <div>
      {geo === 'polygon' && (
        <svg
          width="88"
          height="113"
          viewBox="0 0 88 113"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M69.7637 1.10504C82.0716 -0.376728 91.3163 12.097 86.318 23.4415L51.2196 103.103C46.2696 114.338 31.0333 116.042 23.7232 106.179L-27.605 36.9224C-34.9151 27.059 -28.8519 12.9776 -16.663 11.5101L69.7637 1.10504Z"
            fill={color || '#0267FF'}
          />
        </svg>
      )}
      {geo === 'rectangle' && (
        <svg
          width="49"
          height="111"
          viewBox="0 0 49 111"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            x="-32.8994"
            y="114.94"
            width="92"
            height="92"
            rx="16"
            transform="rotate(-111.087 -32.8994 114.94)"
            fill={color || '#7B95DC'}
          />
        </svg>
      )}
      {geo === 'circle' && (
        <svg
          width="60"
          height="119"
          viewBox="0 0 60 119"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="0.5" cy="59.5" r="59.5" fill={color || '#5B73D4'} />
        </svg>
      )}
    </div>
  );
};

export default DynamicColorSVG;
