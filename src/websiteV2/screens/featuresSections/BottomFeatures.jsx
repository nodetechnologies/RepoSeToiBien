import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Typo from '../../components/Typo';

const BottomFeaturesSection = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const currentLangCode = i18n.language;

  const websiteData = useSelector((state) => state.website.data);

  return (
    <div className="block-separator">
      <div className="row">
        <div className="col-md-6 col-12 d-flex justify-content-center">
          <img
            src={'./assets/website/v2/node_ai_' + currentLangCode + '.png'}
            width="100%"
            alt="placeholder"
            style={{ marginTop: '-40px' }}
          />
        </div>
        <div className="col-md-6 col-12 d-flex align-left text-center mt-3 px-5">
          <div className="mt-5 align-left">
            <div>
              <Typo
                variant="h3"
                text={websiteData?.features?.titleSec5 || t('titleSec5')}
              />
            </div>
            <div>
              {' '}
              <Typo
                className="mt-4"
                variant="smallTitle"
                text={websiteData?.features?.textSec5 || t('textSec5')}
              />
            </div>
            <div>
              {' '}
              <Typo
                className="mt-4"
                variant="p"
                text={websiteData?.features?.textSec5Sub1 || t('textSec5Sub1')}
              />
            </div>
            <div>
              {' '}
              <Typo
                className="mt-3"
                variant="p"
                text={websiteData?.features?.textSec5Sub2 || t('extSec5Sub2')}
              />
            </div>
            <div>
              {' '}
              <Typo
                className="mt-3"
                variant="p"
                text={websiteData?.features?.textSec5Sub3 || t('extSec5Sub3')}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BottomFeaturesSection;
