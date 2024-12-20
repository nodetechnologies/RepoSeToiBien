import React from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../../stories/general-components/Button';

const InvalidQR = ({ retry }) => {
  const { t } = useTranslation();
  return (
    <div>
      <p className='mb-3'>{t('impossibleToValidate')}</p>
      <Button label={t('tryAgain')} primary={true} onClick={retry} />
    </div>
  );
};

export default InvalidQR;
