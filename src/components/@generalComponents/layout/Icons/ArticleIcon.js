import React from 'react';
import { useSelector } from 'react-redux';
import { darken, lighten } from '@mui/system';

function ArticleIcon({ selected, theme }) {
  const businessPreference = useSelector((state) => state.core.businessData);
  const mainColor = businessPreference?.mainColor || '#000000';
  const secColor = businessPreference?.secColor || '#696969';
  const color = selected ? secColor : mainColor;
  const darkSecColor = darken(secColor, 0.26);
  const darkColor = selected ? darkSecColor : darken(color, 0.46);
  const lightColor = lighten(color, 0.46);
  const fillColor = selected
    ? theme?.palette?.mode === 'dark'
      ? '#FFF'
      : '#000'
    : lightColor;

  return (
    <svg
      id="ArticleIcon"
      xmlns="https://www.w3.org/2000/svg"
      viewBox="0 0 65 65.45"
    >
      <defs>
        <style>
          {`.cls-1-article{fill:url(#Dégradé_sans_nom_4);}`}
          {`.cls-2-article{fill:none;stroke:${fillColor};stroke-miterlimit:3.53;stroke-width:8.84px;}`}
        </style>
        <linearGradient
          id="Dégradé_sans_nom_4"
          x1="-13.79"
          y1="79.52"
          x2="-12.79"
          y2="79.52"
          gradientTransform="translate(-1695.01 -898.93) rotate(135) scale(41.21 -23.78)"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor={color} />
          <stop offset="1" stopColor={darkColor} />
        </linearGradient>
      </defs>
      <g id="Calque_1-Article">
        <path
          className="cls-2-article"
          d="m6.25,30.41L32.06,4.6l22.18-.15-.15,22.18-25.81,25.81L6.25,30.41Z"
          rx="10" // Set the horizontal radius for rounded corners
          ry="10" // Set the vertical radius for rounded corners
        />
        <path
          className="cls-1-article"
          d="m33.91,25.57l21.21,21.21-28.28,28.28L5.62,53.85l28.28-28.28Z"
          rx="10" // Set the horizontal radius for rounded corners
          ry="10" // Set the vertical radius for rounded corners
        />
      </g>
    </svg>
  );
}

export default ArticleIcon;
