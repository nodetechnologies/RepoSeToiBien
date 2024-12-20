import React, { useState, useEffect } from 'react';
import WebsiteLayout from '../../layouts/WebsiteLayout';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';

const HomePage = () => {
  const { t } = useTranslation();

  const colors = ['error', 'primary', '#BDDC11'];
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const lang = localStorage.getItem('i18nextLng');

  return <WebsiteLayout full={true}></WebsiteLayout>;
};

export default HomePage;
