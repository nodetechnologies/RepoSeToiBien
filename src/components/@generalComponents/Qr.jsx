import React, { useState } from 'react';
import { QrReader } from 'react-qr-reader';
import { useTranslation } from 'react-i18next';

const Qr = ({ data, setData, show }) => {
  const [facingMode, setFacingMode] = useState('environment'); // Default to rear camera
  const { t } = useTranslation();

  const handleResult = (result) => {
    try {
      if (result?.text) {
        const parsedResult = JSON.parse(result.text);
        if (parsedResult?.type) {
          setData(parsedResult);
        } else {
          setData({ type: 'INVALID_QR' });
        }
      }
    } catch {
      setData({ type: 'INVALID_QR' });
    }
  };

  const handleCameraChange = (event) => {
    setFacingMode(event.target.value);
  };

  return show && !data ? (
    <div>
      <select onChange={handleCameraChange} value={facingMode}>
        <option value="environment">{t('rearCamera')}</option>
        <option value="user">{t('frontCamera')}</option>
      </select>
      <QrReader onResult={handleResult} constraints={{ facingMode }} />
    </div>
  ) : null;
};

export default Qr;
