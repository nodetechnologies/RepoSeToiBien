import React from 'react';
import { useSelector } from 'react-redux';
import { darken, lighten } from '@mui/system';

function FormsIcon({ selected, theme }) {
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
      id="FormsIcon"
      xmlns="https://www.w3.org/2000/svg"
      viewBox="0 0 65 65.45"
    >
      <defs>
        <style>
          {`.cls-1-forms{fill:none;stroke:${fillColor};stroke-width:10px;}`}
          {`.cls-2-forms{fill:url(#Dégradé_sans_nom_2);}`}
        </style>
        <linearGradient
          id="Dégradé_sans_nom_2"
          x1="-24.54"
          y1="81.99"
          x2="-23.54"
          y2="81.99"
          gradientTransform="translate(-1793.65 1237.13) rotate(90.48) scale(51.05 -22.2)"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor={color} />
          <stop offset="1" stopColor={darkColor} />
        </linearGradient>
      </defs>
      <g id="Calque_1-2-Forms">
        <path className="cls-1-forms" d="m5,19.05h32v41H5V19.05Z" />
        <path
          className="cls-2-forms"
          d="m50.11,45.93l-12.97-13.31-13.03,13.37V0h26v45.93Z"
        />
      </g>
    </svg>
  );
}

export default FormsIcon;
