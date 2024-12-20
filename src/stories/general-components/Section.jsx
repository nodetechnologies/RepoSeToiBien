import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material/styles';
import GeneralText from './GeneralText';
import { Divider } from '@mui/material';

const Section = ({ variant = 'outlined', label, value, field }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isDarkmode = theme.palette.mode === 'dark';

  return (
    <div className="px-3 mt-3 mb-3">
      <GeneralText
        text={field?.name}
        fontSize="14px"
        size="bold"
        primary={true}
      />
      <Divider component="div" />
    </div>
  );
};

export default Section;
