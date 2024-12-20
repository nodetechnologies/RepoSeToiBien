import React from 'react';
import { useSelector } from 'react-redux';
import { darken, lighten } from '@mui/system';
import { motion } from 'framer-motion';

function TicketIcon({ selected, theme }) {
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
      id="TicketIcon"
      xmlns="https://www.w3.org/2000/svg"
      viewBox="0 0 67.67 54"
    >
      <defs>
        <style>
          {`.cls-2-ticket{fill:url(#Dégradé_sans_nom_11);}`}
          {`.cls-1-ticket{fill:none;stroke:${fillColor};stroke-width:10px;}`}
        </style>
        <linearGradient
          id="Dégradé_sans_nom_11"
          x1="-15.45"
          y1="76.71"
          x2="-14.45"
          y2="76.71"
          gradientTransform="translate(3108.68 623.73) rotate(90) scale(39.9)"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor={color} />
          <stop offset="1" stopColor={darkColor} />
        </linearGradient>
      </defs>
      <g id="Calque_1-Ticket">
        <motion.path
          className="cls-1-ticket"
          variants={icon}
          whileHover={{ scale: 1.1 }}
          initial="hidden"
          animate="visible"
          d="m27.27,49h-.13s-22.13,0-22.13,0v-16.67h.06l-.06-5.06c0-.09,0-.18,0-.27C5,14.85,14.85,5,27,5s22,9.85,22,22-9.71,21.86-21.73,22Z"
        />
        <circle className="cls-2-ticket" cx="47.67" cy="26.82" r="20" />
      </g>
    </svg>
  );
}

export default TicketIcon;
