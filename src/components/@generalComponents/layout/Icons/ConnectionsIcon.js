import { useSelector } from 'react-redux';
import { darken, lighten } from '@mui/system';

function ConnectionsIcon({ selected, theme }) {
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
      id="connectionsIcon"
      xmlns="https://www.w3.org/2000/svg"
      viewBox="0 0 63.73 64"
    >
      <defs>
        <style>
          {`.cls-1-connections{fill:none;stroke:${fillColor};stroke-width:10px;}`}
          {`.cls-2-connections{fill:url(#Dégradé_sans_nom_6);}`}
        </style>
        <linearGradient
          id="Dégradé_sans_nom_6"
          x1="-18.24"
          y1="81.84"
          x2="-17.24"
          y2="81.84"
          gradientTransform="translate(3367.8 769.59) rotate(90) scale(40.9)"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor={color} />
          <stop offset="1" stopColor={darkColor} />
        </linearGradient>
      </defs>
      <g id="Calque_1-Connections">
        <path
          className="cls-2-connections"
          d="m20.5,64c-11.32,0-20.5-9.18-20.5-20.5s9.18-20.5,20.5-20.5h20.5v20.5c0,11.32-9.18,20.5-20.5,20.5Z"
          rx="10" // Set the horizontal radius for rounded corners
          ry="10" // Set the vertical radius for rounded corners
        />
        <path
          className="cls-1-connections"
          d="m21.29,11.78c-3.15,4.25-4.64,10.08-6.32,17.11l-.04.17c-.4,1.69-.79,3.45-1.12,5.06h6.32v14.99c0,.43.45,1.19,1.48,1.19h.64c3.99,0,7.6,3.15,7.6,7.49v1.22h28.89V24.75c0-10.67-9.17-19.75-20.92-19.75-9.2,0-13.71,2.98-16.51,6.78Z"
          rx="10" // Set the horizontal radius for rounded corners
          ry="10" // Set the vertical radius for rounded corners
        />
      </g>
    </svg>
  );
}

export default ConnectionsIcon;
