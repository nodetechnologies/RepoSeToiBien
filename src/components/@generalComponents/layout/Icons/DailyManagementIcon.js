import React from 'react';
import { useSelector } from 'react-redux';
import { darken, lighten } from '@mui/system';
import { motion } from 'framer-motion';

function DailyManagementIcon({ selected, theme }) {
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
      id="DailyManagementIcon"
      xmlns="https://www.w3.org/2000/svg"
      viewBox="0 0 63.17 54.2"
    >
      <defs>
        <style>
          {`.cls-1-dailymanagement{fill:url(#Dégradé_sans_nom_673);}`}
          {`.cls-2-dailymanagement{fill:none;stroke:${fillColor};stroke-miterlimit:4;stroke-width:10px;}`}
        </style>
        <linearGradient
          id="Dégradé_sans_nom_673"
          x1="-18.82"
          y1="73.99"
          x2="-17.82"
          y2="73.99"
          gradientTransform="translate(-3983.9 5764.78) rotate(43.06) scale(53.99 -93.67) skewX(-.03)"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor={color} />
          <stop offset="1" stopColor={darkColor} />
        </linearGradient>
      </defs>
      <g id="Calque_1-DailyManagementIcon">
        <motion.path
          className="cls-1-dailymanagement"
          variants={icon}
          whileHover={{ scale: 1.1 }}
          initial="hidden"
          animate="visible"
          d="m4.77,27.54c-6.3-6.2-6.37-16.32-.17-22.62h0c6.2-6.29,16.34-6.37,22.64-.17l7.84,7.72c10.63,10.46,10.76,27.55.29,38.16l-3.51,3.56L4.77,27.54Z"
        />
        <motion.path
          className="cls-2-dailymanagement"
          variants={icon}
          whileHover={{ scale: 1.1 }}
          initial="hidden"
          animate="visible"
          d="m39.38,8.22l-7.78,7.77c-8.6,8.59-8.6,22.51,0,31.1l23.35-23.32c4.3-4.29,4.3-11.25,0-15.55s-11.27-4.29-15.56,0Z"
        />
      </g>
    </svg>
  );
}

export default DailyManagementIcon;
