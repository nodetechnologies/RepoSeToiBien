import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Typo from '../../components/Typo';

const IndustrySection = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const currentLangCode = i18n.language;

  const websiteData = useSelector((state) => state.website.data);

  return (
    <div className="block-separator mb-5">
      <div className="align-c mt-5">
        <Typo
          variant="h2"
          text={websiteData?.home?.titleSec10 || t('titleSec10')}
        />
      </div>

      <div className="row mt-5 align-c">
        <div className="col-md-3 col-6">
          {' '}
          <img
            src="./assets/website/img/garage.png"
            width="100%"
            alt="placeholder"
            style={{
              borderRadius: '10px',
            }}
          />{' '}
          <Typo
            variant="p"
            text={websiteData?.home?.industry1}
            className="mt-3"
          />
        </div>
        <div className="col-md-3 col-6">
          {' '}
          <img
            src="./assets/website/img/immo.png"
            width="100%"
            alt="placeholder"
            style={{
              borderRadius: '10px',
            }}
          />{' '}
          <Typo
            variant="p"
            text={websiteData?.home?.industry2}
            className="mt-3"
          />
        </div>
        <div className="col-md-3 col-6">
          {' '}
          <img
            src="./assets/website/img/manufactures.png"
            width="100%"
            alt="placeholder"
            style={{
              borderRadius: '10px',
            }}
          />{' '}
          <Typo
            variant="p"
            text={websiteData?.home?.industry3}
            className="mt-3"
          />
        </div>
        <div className="col-md-3 col-6">
          {' '}
          <img
            src="./assets/website/img/services-business.png"
            width="100%"
            alt="placeholder"
            style={{
              borderRadius: '10px',
            }}
          />{' '}
          <Typo
            variant="p"
            text={websiteData?.home?.industry4}
            className="mt-3"
          />
        </div>
      </div>
    </div>
  );
};

export default IndustrySection;
