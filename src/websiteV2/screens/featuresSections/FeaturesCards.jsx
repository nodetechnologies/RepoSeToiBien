import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Typo from '../../components/Typo';

const FeaturesCardsSections = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const currentLangCode = i18n.language;

  const websiteData = useSelector((state) => state.website.data);

  return (
    <div className="align-c block-separator">
      <div>
        <div className="mt-5">
          <Typo
            variant="h2"
            text={
              websiteData?.features?.headerSec1Title || t('headerSec1Title')
            }
          />
        </div>
        <div className="mt-2 mb-5">
          <Typo
            variant="p"
            className="mt-4"
            text={websiteData?.features?.headerSec1Text || t('headerSec1Text')}
          />
          <Typo
            className="mt-4"
            variant="p"
            text={websiteData?.features?.headerSec1Text2 || t('headerSec1Text')}
          />
        </div>
        <div className="mt-5">
          <img
            src={'./assets/website/v2/features_gen_' + currentLangCode + '.png'}
            width="60%"
            alt="placeholder"
          />
        </div>
      </div>
    </div>
  );
};

export default FeaturesCardsSections;
