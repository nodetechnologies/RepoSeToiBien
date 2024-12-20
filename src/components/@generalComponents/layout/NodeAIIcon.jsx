import { Box } from '@mui/material';

const NodeAIIcon = ({ svgPath, size = 14, ...props }) => {
  const svgIcon = `<svg width="100px" height="100px" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">

      <stop offset="30%" style="stop-color:rgb(227, 216, 14);"/>
      <stop offset="55%" style="stop-color:rgb(128,255,255,0.4);"/>
      <stop offset="80%" style="stop-color:rgb(14,21,227);"/>
    </linearGradient>
  </defs>
  <path fill="url(#grad1)" d="M50,10 L10,50 L20,90 L50,70 L80,90 L90,50 Z" />
  <path fill="none" stroke="rgb(255,255,255)" stroke-width="4" d="M25,25 L50,50 L75,25 M50,50 L50,75" />
  
</svg>`;
  const dataUrl = `data:image/svg+xml;base64,${btoa(svgIcon)}`;

  return (
    <Box
      {...props}
      sx={{
        width: size,
        height: size,
        display: 'inline-block',
        backgroundImage: `url("${dataUrl}")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    />
  );
};

export default NodeAIIcon;
