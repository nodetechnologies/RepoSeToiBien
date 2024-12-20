import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Typo from '../../components/Typo';
import { useTheme } from '@mui/material/styles';
import Btn from '../../components/Btn';
import DynamicDashboard from '../../components/dashboard_fr';
import colorGenerator from '../../../utils/colorGenerator';

const Intro = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const theme = useTheme();
  const localStorageColor = localStorage.getItem('mainColor');

  const mainColor =
    theme.palette.primary.main || localStorageColor || '#1604DD';

  const websiteData = useSelector((state) => state.website.data);

  const darkColor = colorGenerator(mainColor, 2, 1, 1, false);
  const colorLight = colorGenerator(mainColor, 0, 0.1, 1, false);

  return (
    <div className="block-separator">
      <div>
        <div className="align-c mt-5 mb-3">
          {' '}
          <Typo
            variant="h2"
            text={websiteData?.home?.titleSec2 || t('titleSec2')}
          />
        </div>
        <div className="align-c mb-5 px-5">
          {' '}
          <Typo
            variant="p"
            className="px-5"
            text={websiteData?.home?.subTitleSec2 || t('subTitleSec2')}
          />{' '}
        </div>
      </div>
      <div className="row mt-4">
        <div
          className="col-md-6 col-12 d-flex flex-column "
          style={{ minHeight: '250px' }}
        >
          <div className="mt-3">
            <div>
              {' '}
              <Typo
                variant="smallTitle"
                text={websiteData?.home?.content1Title || t('content1Title')}
              />{' '}
            </div>
            <div>
              <Typo
                variant="p"
                text={websiteData?.home?.content1Text || t('content1Text')}
              />
            </div>
          </div>
          <div className="mt-4">
            <div>
              {' '}
              <Typo
                variant="smallTitle"
                text={websiteData?.home?.content2Title || t('content2Title')}
              />{' '}
            </div>
            <div>
              {' '}
              <Typo
                variant="p"
                text={websiteData?.home?.content2Text || t('content2Text')}
              />{' '}
            </div>
          </div>
          <div className="mt-4">
            <div>
              {' '}
              <Typo
                variant="smallTitle"
                text={websiteData?.home?.content3Title || t('content3Title')}
              />{' '}
            </div>
            <div>
              {' '}
              <Typo
                variant="p"
                text={websiteData?.home?.content3Text || t('content3Text')}
              />{' '}
            </div>
          </div>
        </div>

        <div className="col-md-6 col-12 mb-5 align-c">
          <DynamicDashboard
            color={mainColor}
            colorLight={colorLight}
            darkColor={darkColor}
          />
        </div>
      </div>
      <div className="row align-c mb-5 mt-5">
        <Btn text={t('knowMore')} onClick={() => navigate('/features')} />
      </div>
    </div>
  );
};

export default Intro;
