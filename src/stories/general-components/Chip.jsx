import React from 'react';
import { useSelector } from 'react-redux';
import ChipMUI from '@mui/material/Chip';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import chroma from 'chroma-js';

export const Chip = ({
  size,
  label,
  status,
  showIcon,
  sx,
  noDecoration,
  icon,
  color,
  onClick,
  variant,
  type,
  ...props
}) => {
  let backgroundColor, textColor;
  const theme = useTheme();

  const businessPreference = useSelector((state) => state.core.businessData);

  const lightColor = (color) => {
    return chroma(color || '#FFF')
      .luminance(0.85)
      .hex();
  };

  const darkColor = (color) => {
    let finalColor = '#000000';
    if (color) {
      finalColor = color;
    }
    return chroma(finalColor).darken(0.7).hex();
  };

  switch (status) {
    case 0:
      backgroundColor = '#dedede80';
      textColor = '#000000';
      break;
    case 5:
      backgroundColor = '#FFEAED';
      textColor = theme.palette.error.main;
      break;
    case 2:
      backgroundColor = '#edfffd';
      textColor = '#000000';
      break;
    case 6:
      backgroundColor = '#FFEAED';
      textColor = theme.palette.error.main;
      break;
    case 1:
      backgroundColor = '#f7fee9';
      textColor = darkColor(theme.palette.success.main);
      break;
    case 4:
      backgroundColor = '#f7fee9';
      textColor = theme.palette.success.main;
      break;
    case 97:
      backgroundColor = '#f7fee9';
      textColor = theme.palette.success.main;
      break;
    case 98:
      backgroundColor = '#FFEAED';
      textColor = theme.palette.error.main;
      break;
    case 99:
      backgroundColor = lightColor(businessPreference?.secColor);
      textColor = businessPreference?.secColor;
      break;
    case 120:
      backgroundColor = '#f9f9f900';
      textColor = '#00000070';
      break;

    case 130:
      backgroundColor = '#f9f9f9';
      textColor = '#000000';
      break;

    default:
      backgroundColor = lightColor(businessPreference?.mainColor);
      textColor = businessPreference?.mainColor;
  }

  const SmallLabel = styled(Typography)({
    fontSize: '10px',
    lineHeight: '1.1',
    color: color,
  });

  return (
    <div>
      <ChipMUI
        label={
          <SmallLabel
            sx={{ ...sx }}
            style={{ color: textColor, fontWeight: noDecoration ? 600 : 500 }}
            className="middle-content d-flex"
          >
            {icon}
            {label}
          </SmallLabel>
        }
        onClick={onClick}
        variant={noDecoration ? 'standard' : variant || 'standard'}
        sx={{
          ...sx,

          padding: '4px 8px',
          maxHeight: size === 'small' ? '22px' : '30px',
          boxSizing: 'border-box',
          backgroundColor: noDecoration ? 'transparent' : backgroundColor,
          textTransform: 'capitalize',
        }}
        {...props}
      />
    </div>
  );
};

export default Chip;
