import React, { useState, useEffect, useRef } from 'react';
import { Paper, IconButton, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { motion } from 'framer-motion';
import Typo from '../../components/Typo';
import colorGenerator from '../../../utils/colorGenerator';
import DynamicColorSVG from '../../components/DynamicColorSVG';

const Testimonial = ({ variant, title, text, img, className, border }) => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const mainColor = theme.palette.primary.main || '#1604DD';

  const lightMainColor = colorGenerator(mainColor, 0.2, 0.1, 1, false);
  const darkMainColor = colorGenerator(mainColor, 1, 0.8, 0.9, false);
  const alternativeColor = colorGenerator(mainColor, 3, 0.4, 0, false);

  return (
    <Paper
      elevation={0}
      className={className || ''}
      style={{
        minHeight: '270px',
        position: 'relative',
        borderColor: border ? (isDarkMode ? '#FFF' : mainColor) : 'transparent',
        borderWidth: border ? '1px' : '0px',
        borderStyle: 'solid',
        borderRadius: '20px',
        backgroundColor:
          variant === 'A' || variant === 'C'
            ? mainColor + '10'
            : isDarkMode
            ? '#1a1a1a80'
            : '#FFFFFF80',
        overflow: 'hidden',
      }}
    >
      {variant === 'A' && (
        <div>
          <div
            style={{
              position: 'absolute',
              top: 74,
              right: -17,
              transform: 'rotate(190deg)',
            }}
          >
            <DynamicColorSVG color={alternativeColor} geo={'rectangle'} />
          </div>
          <div style={{ position: 'absolute', top: 0, left: 0 }}>
            <DynamicColorSVG color={lightMainColor} geo={'circle'} />
          </div>
        </div>
      )}
      {variant === 'B' && (
        <div>
          <div
            style={{
              position: 'absolute',
              top: -40,
              right: 10,
              transform: 'rotate(90deg)',
            }}
          >
            <DynamicColorSVG color={darkMainColor} geo={'circle'} />
          </div>
          <div style={{ position: 'absolute', bottom: 0, left: 0 }}>
            <DynamicColorSVG color={lightMainColor} geo={'rectangle'} />
          </div>
        </div>
      )}
      {variant === 'C' && (
        <div>
          <div
            style={{
              position: 'absolute',
              bottom: -34,
              left: -10,
              transform: 'rotate(0deg)',
            }}
          >
            <DynamicColorSVG color={darkMainColor} geo={'polygon'} />
          </div>
          <div style={{ position: 'absolute', top: -69, right: 0 }}>
            <DynamicColorSVG color={lightMainColor} geo={'polygon'} />
          </div>
        </div>
      )}
      {variant === 'D' && (
        <div>
          <div
            style={{
              position: 'absolute',
              top: -34,
              right: 10,
              transform: 'rotate(90deg)',
            }}
          >
            <DynamicColorSVG color={alternativeColor} geo={'rectangle'} />
          </div>
          <div style={{ position: 'absolute', bottom: 0, left: 0 }}>
            <DynamicColorSVG color={lightMainColor} geo={'circle'} />
          </div>
        </div>
      )}
      <div className="px-5 py-5">
        <Typo text={title} variant="smallTitle" />
        <Typo text={text} variant="p-light" className="mt-4" />
      </div>
      <div>
        <img
          src={img}
          alt="testimonial"
          height={160}
          style={{
            position: 'absolute',
            bottom: '-20px',
            right: 10,
          }}
        />
      </div>
    </Paper>
  );
};

export default Testimonial;
