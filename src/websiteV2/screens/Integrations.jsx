import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import SiteLayout from '../SiteLayout';
import { useTheme } from '@mui/material/styles';
import HeaderSection from './integrationsSections/Header';
import ListSection from './integrationsSections/List';

const Integrations = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const currentLangCode = i18n.language;
  const theme = useTheme();
  const mainColor = theme.palette.primary.main || '#1604DD';
  const isDarkMode = theme.palette.mode === 'dark';

  const [inputSearchValue, setInputSearchValue] = useState('');

  const websiteData = useSelector((state) => state.website.data);

  const handleSearch = (e) => {
    setInputSearchValue(e.target.value);
  };

  return (
    <SiteLayout
      helmetData={{
        name: t('integrations'),
        description: t('integrationsDesc'),
      }}
    >
      <div>
        <HeaderSection
          isDarkMode={isDarkMode}
          inputSearchValue={inputSearchValue}
          handleSearch={handleSearch}
        />
        <ListSection
          isDarkMode={isDarkMode}
          handleSearch={handleSearch}
          inputSearchValue={inputSearchValue}
        />
      </div>
    </SiteLayout>
  );
};

export default Integrations;
