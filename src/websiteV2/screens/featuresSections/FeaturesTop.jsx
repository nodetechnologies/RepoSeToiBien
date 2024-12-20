import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Typo from '../../components/Typo';

const FeaturesTopSection = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const currentLangCode = i18n.language;

  const websiteData = useSelector((state) => state.website.data);

  return (
    <div>
      <div className="row">
        <div className="col-md-5 col-12 align-c justify-content-center ">
          <div className="align-left">
            <Typo
              variant="h1"
              text={websiteData?.features?.headerTitle || t('headerTitle')}
            />
            <div className="mt-4">
              <Typo
                variant="subTitle"
                text={websiteData?.features?.headerSub || t('headerSub')}
              />
            </div>
            <div className="mt-4">
              <Typo
                variant="p"
                text={websiteData?.features?.headerText || t('headerText')}
              />
            </div>
          </div>
        </div>
        <div className="col-md-7 col-12 mt-4 align-c">
          <img
            src="./assets/website/img/header_top_features.png"
            width="90%"
            alt="placeholder"
          />
        </div>
      </div>
    </div>
  );
};

export default FeaturesTopSection;
