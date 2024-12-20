import { Box, Divider } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import Typo from './Typo';

const Footer = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const currentLangCode = i18n.language;
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  return (
    <>
      <Divider component="div" />
      <div
        className="row align-c"
        style={{
          minHeight: '200px',
          padding: '30px',
          backgroundColor: isDarkMode ? '#000000' : '#ffffff',
        }}
      >
        <div className="row" style={{ maxWidth: '1050px' }}>
          <div className="col-4 align-left">
            {' '}
            <Box
              sx={{ flexGrow: 1, cursor: 'pointer' }}
              onClick={() => navigate('/')}
            >
              <img
                src="/assets/website/softwares/node-logo.png"
                height={28}
                alt="Node"
              />
              <div>
                <Typo
                  text={'Intelligence Node Canada  ©' + moment().format('YYYY')}
                  variant="p-light"
                  className="mt-3"
                  bold
                />
                <Typo
                  text="1-888-343-0310"
                  variant="p-light"
                  className="mt-2"
                />
                <Typo
                  text="support@usenode.com"
                  variant="p-light"
                  className="mt-1"
                />
                <Typo text="Canada" variant="p-light" className="mt-1" />
              </div>
            </Box>
          </div>
          <div className="col-6 align-left d-flex">
            <div className="col-6">
              {' '}
              <Typo text={t('links')} variant="p" />
            </div>
            <div className="col-6">
              {' '}
              <Typo text={t('legal')} variant="p" />
            </div>
          </div>
          <div className="col-2 align-left"></div>
        </div>
      </div>
    </>
  );
};

export default Footer;
