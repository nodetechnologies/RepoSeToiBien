import React, { useEffect, useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';

const Typo = ({ variant, color, text, className, bold, mainColor }) => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const currentLangCode = i18n.language;
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const main = theme.palette.primary.main;

  const typoVariantResolver = (variant) => {
    switch (variant) {
      case 'h1':
        return {
          variant: 'h1',
          fontSize: 38,
          lineHeight: 1.1,
          fontWeight: 700,
          color: mainColor ? main : color || isDarkMode ? '#FFF' : '#000',
        };
      case 'h2':
        return {
          variant: 'h2',
          fontSize: 32,
          lineHeight: 1.05,
          fontWeight: 700,
          color: mainColor ? main : color || isDarkMode ? '#FFF' : '#000',
        };
      case 'h3':
        return {
          variant: 'h3',
          fontSize: 26,
          fontWeight: 600,
          lineHeight: 1.05,
          color: mainColor ? main : color || isDarkMode ? '#FFF' : '#000',
        };
      case 'h3-light':
        return {
          variant: 'h3',
          fontSize: 22,
          fontWeight: 600,
          lineHeight: 1.05,
          color: mainColor ? main : color || isDarkMode ? '#FFF' : '#000',
        };
      case 'h4':
        return {
          variant: 'h4',
          fontSize: 20,
          fontWeight: 600,
          lineHeight: 1.05,
          color: mainColor ? main : color || isDarkMode ? '#FFF' : '#000',
        };
      case 'subTitle':
        return {
          variant: 'subtitle1',
          fontSize: 18,
          fontWeight: 500,
          lineHeight: 1.05,
          color: mainColor ? main : color || isDarkMode ? '#FFF' : '#000',
        };
      case 'smallTitle':
        return {
          variant: 'subtitle2',
          fontSize: 15,
          fontWeight: 600,
          lineHeight: 1.05,
          color: mainColor ? main : color || isDarkMode ? '#FFF' : '#000',
        };
      case 'p':
        return {
          variant: 'body1',
          fontSize: 13,
          fontWeight: bold ? 500 : 400,
          lineHeight: 1.1,
          color: color || isDarkMode ? '#FFF' : '#000',
        };
      case 'p-light':
        return {
          variant: 'body2',
          fontSize: 12,
          fontWeight: bold ? 500 : 400,
          lineHeight: 1.1,
          color: mainColor ? main : color || isDarkMode ? '#FFF' : '#000',
        };
      default:
        return {
          variant: 'body1',
          fontSize: 12,
          fontWeight: 400,
          lineHeight: 1.05,
          color: mainColor ? main : color || isDarkMode ? '#FFF' : '#000',
        };
    }
  };

  return (
    <Typography className={className || ''} sx={typoVariantResolver(variant)}>
      {text}
    </Typography>
  );
};

export default Typo;
