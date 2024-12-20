import React from 'react';
import { useSelector } from 'react-redux';
import { darken, lighten } from '@mui/system';

function RegistrationIcon({ selected, theme }) {
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
      id="RegistrationIcon"
      xmlns="https://www.w3.org/2000/svg"
      viewBox="0 0 67 55.03"
    >
      <defs>
        <style>
          {`.cls-1-registration{fill:url(#Dégradé_sans_nom_101);}`}
          {`.cls-2-registration{fill:none;stroke:${fillColor};stroke-width:10px;}`}
          {`.cls-3-registration{fill:url(#Dégradé_sans_nom_71);}`}
        </style>
        <linearGradient
          id="Dégradé_sans_nom_101"
          x1="-16.14"
          y1="76.68"
          x2="-15.14"
          y2="76.68"
          gradientTransform="translate(-1531.84 372.65) rotate(91.11) scale(23.47 -20.33)"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor={color} />
          <stop offset="1" stopColor={darkColor} />
        </linearGradient>
        <linearGradient
          id="Dégradé_sans_nom_71"
          x1="-16.14"
          y1="76.68"
          x2="-15.14"
          y2="76.68"
          gradientTransform="translate(-1531.84 349.19) rotate(91.11) scale(23.47 -20.33)"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor={color} />
          <stop offset="1" stopColor="#fff" />
        </linearGradient>
      </defs>
      <g id="Calque_1-Registration">
        <path
          className="cls-2-registration"
          d="m13.04,41.35l-6.41-22.31h53.73l-6.41,22.31c-1.48,5.14-6.18,8.69-11.53,8.69h-17.85c-5.35,0-10.06-3.54-11.53-8.69Z"
        />
        <path
          className="cls-1-registration"
          d="m45.58,36.04c0,6.63-5.37,12-12,12s-12-5.37-12-12,5.37-12,12-12,12,5.37,12,12Z"
        />
        <circle className="cls-3-registration" cx="33.61" cy="12" r="12" />
      </g>
    </svg>
  );
}

export default RegistrationIcon;
