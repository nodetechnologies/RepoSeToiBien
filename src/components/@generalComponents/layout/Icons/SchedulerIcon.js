import React from 'react';
import { useSelector } from 'react-redux';
import { darken, lighten } from '@mui/system';

function SchedulerIcon({ selected, theme }) {
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
      id="SchedulerIcon"
      xmlns="https://www.w3.org/2000/svg"
      viewBox="0 0 75.21 57.35"
    >
      <defs>
        <style>
          {`.cls-1-scheduler{fill:none;stroke:${fillColor};stroke-width:10px;}`}
          {`.cls-2-scheduler{fill:url(#Dégradé_sans_nom_103);}`}
          {`.cls-3-scheduler{fill:url(#Dégradé_sans_nom_72);}`}
        </style>
        <linearGradient
          id="Dégradé_sans_nom_103"
          x1="-20.46"
          y1="77.73"
          x2="-19.77"
          y2="77.73"
          gradientTransform="translate(-2355.83 730.8) rotate(90) scale(34.74 -30.73)"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor={color} />
          <stop offset="1" stopColor={darkColor} />
        </linearGradient>
        <linearGradient
          id="Dégradé_sans_nom_72"
          x1="-20.08"
          y1="78.04"
          x2="-19.39"
          y2="78.04"
        ></linearGradient>
      </defs>
      <g id="Calque_1-Scheduler">
        <rect
          className="cls-1-scheduler"
          x="9.34"
          y="5"
          width="46.4"
          height="46.4"
        />
        <path
          className="cls-2-scheduler"
          d="m26.84,17.71l13.42,13.14,6-5.88,19.42,19.02H0s26.84-26.27,26.84-26.27Z"
        />

        <path
          className="cls-3-scheduler"
          d="m36.37,31.07l13.42,13.14,6-5.88,19.42,19.02H9.53s26.84-26.27,26.84-26.27Z"
        />
      </g>
    </svg>
  );
}

export default SchedulerIcon;
