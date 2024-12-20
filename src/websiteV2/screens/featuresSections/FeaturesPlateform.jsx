import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Typo from '../../components/Typo';

const FeaturesPlateformSections = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const currentLangCode = i18n.language;

  const websiteData = useSelector((state) => state.website.data);

  return (
    <div className="block-separator">
      <div className="row mb-5">
        <div className="col-md-6 col-12 mt-5">
          <img
            src={'./assets/website/v2/features_' + currentLangCode + '.png'}
            width="100%"
            alt="placeholder"
          />
        </div>

        <div className="col-md-6 col-12 mt-5">
          <div className="mt-5">
            <div>
              <Typo
                variant="h3"
                text={websiteData?.features?.titleSec3 || t('titleSec3')}
              />
            </div>
            <div>
              {' '}
              <Typo
                className="mt-4"
                variant="p"
                text={websiteData?.features?.textSec3 || t('textSec3')}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturesPlateformSections;
