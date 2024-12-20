import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import SiteLayout from '../SiteLayout';
import FeaturesTopSection from './featuresSections/FeaturesTop';
import FeaturesCardsSections from './featuresSections/FeaturesCards';
import FeaturesPlateformSections from './featuresSections/FeaturesPlateform';
import { Container } from '@mui/material';
import BottomFeaturesSection from './featuresSections/BottomFeatures';
import FaqFeaturesSections from './featuresSections/FaqFeatures';
import BlocksLayout from './featuresSections/BlocksLayout';

const Features = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const currentLangCode = i18n.language;

  const websiteData = useSelector((state) => state.website.data);

  return (
    <SiteLayout
      helmetData={{
        name: t('features'),
        description: t('featuresDesc'),
      }}
    >
      <FeaturesTopSection />
      <FeaturesCardsSections />
      <FeaturesPlateformSections />
      <BlocksLayout />
      <BottomFeaturesSection />
      <FaqFeaturesSections />
    </SiteLayout>
  );
};

export default Features;
