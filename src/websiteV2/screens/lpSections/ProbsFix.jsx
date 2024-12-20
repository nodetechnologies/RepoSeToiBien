import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Typo from '../../components/Typo';
import Testimonial from '../featuresSections/Testimonial';

const ProbsFixSection = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const currentLangCode = i18n.language;

  const websiteData = useSelector((state) => state.website.data);

  return (
    <div className="block-separator">
      <div className="align-c mt-5">
        <Typo
          variant="h2"
          text={websiteData?.home?.titleSec8 || t('titleSec8')}
        />
      </div>
      <div className="row mt-5">
        <div className="col-md-3 col-6 mt-3">
          <Testimonial
            img="/assets/website/img/samuel.png"
            variant="A"
            title={websiteData?.home?.titleSec8Tes1 || t('titleSec8Tes1')}
            text={
              websiteData?.home?.titleSec8Tes1Text || t('titleSec8Tes1Text')
            }
          />
        </div>
        <div className="col-md-3 col-6 mt-3">
          <Testimonial
            border
            variant="B"
            img="/assets/website/img/nathalie.png"
            title={websiteData?.home?.titleSec8Tes2 || t('titleSec8Tes2')}
            text={
              websiteData?.home?.titleSec8Tes2Text || t('titleSec8Tes2Text')
            }
          />
        </div>
        <div className="col-md-3 col-6 mt-3">
          <Testimonial
            variant="C"
            img="/assets/website/img/paul.png"
            title={websiteData?.home?.titleSec8Tes3 || t('titleSec8Tes3')}
            text={
              websiteData?.home?.titleSec8Tes3Text || t('titleSec8Tes3Text')
            }
          />
        </div>
        <div className="col-md-3 col-6 mt-3">
          <Testimonial
            border
            variant="D"
            img="/assets/website/img/anna.png"
            title={websiteData?.home?.titleSec8Tes4 || t('titleSec8Tes4')}
            text={
              websiteData?.home?.titleSec8Tes4Text || t('titleSec8Tes4Text')
            }
          />
        </div>
      </div>
    </div>
  );
};

export default ProbsFixSection;
