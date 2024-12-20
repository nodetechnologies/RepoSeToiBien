import React from 'react';
import Lottie from 'react-lottie';
import animationData from '../../lotties/404-error';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Button from '../../stories/general-components/Button';

const NotFound = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  return (
    <div className="align-c">
      <Lottie options={defaultOptions} height={410} width={420} />
      <h1 className="fw-600 fs-30 mb-3">{t('404error')}</h1>
      <p className="mb-5">{t('404message')}</p>
      <Button
        label={t('findHome')}
        size="lg"
        icon="/assets/vectors/r-arrow-btn.svg"
        onClick={() => navigate(`/app/dashboard`)}
      />
    </div>
  );
};

export default NotFound;
