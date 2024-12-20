import React from 'react';
import { useSelector } from 'react-redux';
import { darken, lighten } from '@mui/system';

function CardsManagement({ selected, theme }) {
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
      id="CardsManagementIcon"
      xmlns="https://www.w3.org/2000/svg"
      viewBox="0 0 69.17 68.84"
    >
      <defs>
        <style>
          {`.cls-1-cards{fill:none;stroke:${fillColor};stroke-width:10px;}`}
          {`.cls-2-cards{fill:url(#Dégradé_sans_nom_732);}`}
        </style>
        <linearGradient
          id="Dégradé_sans_nom_732"
          x1="-14.95"
          y1="83.95"
          x2="-13.95"
          y2="83.95"
          gradientTransform="translate(-4395.88 806.91) rotate(90) scale(52.87 -52.87)"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor={color} />
          <stop offset="1" stopColor={darkColor} />
        </linearGradient>
      </defs>
      <g id="Calque_1-CardsManagement">
        <circle className="cls-2-cards" cx="42.67" cy="42.34" r="26.5" />
        <rect className="cls-1-cards" x="5" y="5" width="37" height="37" />
      </g>
    </svg>
  );
}

export default CardsManagement;
