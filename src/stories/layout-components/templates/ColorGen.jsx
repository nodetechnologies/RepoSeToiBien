import React, { useState } from 'react';
import ErrorBoundary from '../../../components/@generalComponents/ErrorBoundary';
import { useTranslation } from 'react-i18next';
import { TextField, Slider, Typography } from '@mui/material';
import chroma from 'chroma-js';

const ColorGen = () => {
  const { t } = useTranslation();

  // State for each color and its adjustments
  const [mainColor, setMainColor] = useState('#000000');
  const [darken, setDarken] = useState(0);
  const [alpha, setAlpha] = useState(1);
  const [brightness, setBrightness] = useState(1);

  // Function to generate modified color based on parameters
  const generateModifiedColor = () => {
    let color = chroma(mainColor)
      .darken(darken)
      .alpha(alpha)
      .brighten(brightness);
    return color.hex();
  };

  return (
    <ErrorBoundary>
      <div style={{ padding: '20px' }}>
        <Typography variant="h5">{t('Color Generator')}</Typography>

        <input
          type="color"
          value={mainColor}
          onChange={(e) => setMainColor(e.target.value)}
          style={{
            width: '100%',
            height: '50px',
            marginTop: '20px',
            marginBottom: '20px',
          }}
        />

        <Typography>Darken {darken}</Typography>
        <Slider
          value={darken}
          onChange={(e, value) => setDarken(value)}
          step={0.1}
          min={0}
          max={2}
          style={{ width: '100%', marginBottom: '20px' }}
        />

        <Typography>Alpha {alpha}</Typography>
        <Slider
          value={alpha}
          onChange={(e, value) => setAlpha(value)}
          step={0.1}
          min={0}
          max={1}
          style={{ width: '100%', marginBottom: '20px' }}
        />

        <Typography>Brightness {brightness}</Typography>
        <Slider
          value={brightness}
          onChange={(e, value) => setBrightness(value)}
          step={0.1}
          min={-1}
          max={1}
          style={{ width: '100%', marginBottom: '20px' }}
        />

        <div
          style={{
            width: '100%',
            height: '100px',
            backgroundColor: generateModifiedColor(),
            marginTop: '20px',
            border: '1px solid #ddd',
          }}
        ></div>
      </div>
    </ErrorBoundary>
  );
};

export default ColorGen;
