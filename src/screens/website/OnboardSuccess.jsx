import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Helmet } from 'react-helmet';

import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import WebsiteLayout from '../../layouts/WebsiteLayout';
import GeneralText from '../../stories/general-components/GeneralText';
import Lottie from 'react-lottie';
import animationData from '../../lotties/doneNode_fr.json';
import Button from '../../stories/general-components/Button';

const OnboardSuccess = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const theme = useTheme();

  const defaultOptions = {
    loop: false,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  return (
    <WebsiteLayout full>
      <div>
        <div>
          <Helmet>
            <title>{t('onboard')}</title>
          </Helmet>
        </div>
        <div className="row mt-5 mb-5">
          <div className="mt-3 mb-4">
            {' '}
            <Lottie options={defaultOptions} height={120} width={250} />
          </div>
          <GeneralText
            text={t('onboard-success')}
            primary={true}
            fontSize="20px"
            size="bold"
          />
          <div className="mt-2 mb-5">
            <GeneralText
              text={t('onboard-success-desc')}
              primary={true}
              fontSize="14px"
              size="medium"
            />
          </div>
          <div>
            <Button
              label={t('website')}
              size="small"
              onClick={() => {
                navigate('/');
              }}
            />
          </div>
        </div>
      </div>
    </WebsiteLayout>
  );
};

export default OnboardSuccess;
