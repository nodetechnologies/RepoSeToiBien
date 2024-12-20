import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useTheme } from '@mui/material/styles';
import { useMediaQuery } from '@mui/material';
import SiteLayout from '../SiteLayout';
import Typo from '../components/Typo';

const Contact = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const currentLangCode = i18n.language;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isDarkMode = theme.palette.mode === 'dark';

  const [message, setMessage] = useState('');

  const websiteData = useSelector((state) => state.website.data);

  return (
    <SiteLayout
      helmetData={{
        name: t('contact'),
        description: t('contactDesc'),
      }}
    >
      <div className="row py-5 mt-5">
        <div className="col-md-5 col-12 mt-4">
          <img
            src="/assets/website/img/contact-us.png"
            alt="arrow"
            style={{
              width: isMobile ? '250px' : '400px',
              borderRadius: '10px',
              zIndex: 3,
            }}
            className="mt-3"
          />
        </div>
        <div className="col-md-7 col-12 py-5 mt-5 px-5 align-left">
          <div>
            <Typo
              text={
                websiteData?.contact?.headerTitle || t('contactHeaderTitle')
              }
              variant="h1"
            />
          </div>
          <div>
            <Typo
              text={
                websiteData?.contact?.contactHeaderSubTitle ||
                t('contactHeaderSubTitle')
              }
              className="mt-4"
              variant="h3"
            />
          </div>
          <div>
            <Typo
              text={
                websiteData?.contact?.contactHeaderText ||
                t('contactHeaderText')
              }
              className="mt-5"
              variant="p"
            />
          </div>

          {message && (
            <Typo
              text={websiteData?.contact?.textMessage || t('textMessage')}
              variant="p"
            />
          )}
        </div>
        {/* <div
          id="embed-container-node-form"
          style={{
            borderRadius: '20px',
            backgroundColor: isDarkMode ? '#1a1a1a' : '#FFF',
            padding: '10px',
          }}
        /> */}
        <iframe
          src="https://usenode.com/structure-public?businessId=6jyRhYMJ45SObIlg89EK&structureId=MDiwAr6iUbru3OQlp1ab&width=100%&height=400px&typeForm=default"
          frameBorder="0"
          style={{
            borderRadius: '20px',
            backgroundColor: isDarkMode ? '#1a1a1a' : '#FFF',
            padding: '10px',
            width: '100%',
            height: '400px',
          }}
        ></iframe>
      </div>
    </SiteLayout>
  );
};

export default Contact;
