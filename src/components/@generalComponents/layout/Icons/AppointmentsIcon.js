import React from 'react';
import { useSelector } from 'react-redux';
import { darken, lighten } from '@mui/system';
import { motion } from 'framer-motion';

function AppointmentsIcon({ selected, theme }) {
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

  const icon = {
    hidden: {
      pathLength: 0,
      fill: 'rgba(255, 255, 255, 0)',
    },
    visible: {
      pathLength: 1,
      fill: 'rgba(255, 255, 255, 1)',
    },
  };

  return (
    <svg
      id="AppointmentsIcon"
      xmlns="https://www.w3.org/2000/svg"
      viewBox="0 0 69.25 74.1"
    >
      <defs>
        <style>
          {`.cls-1-appointments{fill:none;stroke:${fillColor};stroke-width:10px;}`}
          {`.cls-2-appointments{fill:url(#Dégradé_sans_nom_5692);}`}
        </style>
        <linearGradient
          id="Dégradé_sans_nom_5692"
          x1="-12.94"
          y1="84.3"
          x2="-11.94"
          y2="84.3"
          gradientTransform="translate(-4469.51 773.31) rotate(89.21) scale(53.39 -53.39)"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor={color} />
          <stop offset="1" stopColor={darkColor} />
        </linearGradient>
      </defs>
      <g id="Calque_1-Appointments">
        <motion.path
          className="cls-1-appointments"
          variants={icon}
          whileHover={{ scale: 1.1 }}
          initial="hidden"
          animate="visible"
          d="m46.25,6.86l18,16.89v22.26H28.25v-22.26L46.25,6.86Z"
        />
        <motion.path
          className="cls-2-appointments"
          variants={icon}
          whileHover={{ scale: 1.1 }}
          initial="hidden"
          animate="visible"
          d="m6.44,27.43c8.59-8.59,22.52-8.59,31.11,0h0c8.59,8.59,8.59,22.52,0,31.11l-15.56,15.56-15.56-15.56c-8.59-8.59-8.59-22.52,0-31.11h0Z"
        />
      </g>
    </svg>
  );
}

export default AppointmentsIcon;
