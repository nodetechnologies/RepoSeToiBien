import React from 'react';
import { useSelector } from 'react-redux';
import { darken, lighten } from '@mui/system';

function LocationsManagement({ selected, theme }) {
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
      id="LocationsManagementIcon"
      xmlns="https://www.w3.org/2000/svg"
      viewBox="0 0 67 55.03"
    >
      <defs>
        <style>
          {`.cls-1-locations{fill:url(#Dégradé_sans_nom_152);}`}
          {`.cls-2-locations{fill:url(#Dégradé_sans_nom_128);}`}
          {`.cls-3-locations{fill:none;stroke:${fillColor};stroke-width:10px;}`}
          {`.cls-4-locations{fill:url(#Dégradé_sans_nom_1592);}`}
        </style>
        <linearGradient
          id="Dégradé_sans_nom_152"
          x1="-17.53"
          y1="81.06"
          x2="-16.53"
          y2="81.06"
          gradientTransform="translate(-1993.93 438.22) rotate(90) scale(25 -25)"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor={color} />
          <stop offset="1" stopColor={darkColor} />
        </linearGradient>
        <linearGradient
          id="Dégradé_sans_nom_128"
          x1="-17.53"
          y1="81.06"
          x2="-16.53"
          y2="81.06"
          gradientTransform="translate(-1993.93 458.22) rotate(90) scale(25 -25)"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#ff3c00" />
          <stop offset="0" stopColor={color} />
          <stop offset=".04" stopColor={color} />
          <stop offset="1" stopColor="#fff7f1" />
        </linearGradient>
        <linearGradient
          id="Dégradé_sans_nom_1592"
          x1="-17.53"
          x2="-16.53"
          gradientTransform="translate(-1993.93 477.22) rotate(90) scale(25 -25)"
        ></linearGradient>
      </defs>
      <g id="Calque_1-LocationsManagement">
        <path
          className="cls-3-locations"
          d="m32.07,50c-12.01,0-22.29-7.24-26.64-17.5,4.35-10.26,14.63-17.5,26.64-17.5s22.29,7.24,26.64,17.5c-4.35,10.26-14.63,17.5-26.64,17.5Z"
        />
        <circle className="cls-1-locations" cx="32.57" cy="12.5" r="12.5" />
        <circle className="cls-2-locations" cx="32.57" cy="32.5" r="12.5" />
        <circle className="cls-4-locations" cx="32.57" cy="51.5" r="12.5" />
      </g>
    </svg>
  );
}

export default LocationsManagement;
