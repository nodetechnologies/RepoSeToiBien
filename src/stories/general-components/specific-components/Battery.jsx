//utilities
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

const Battery = ({ onBlur, onChange, value }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [maintenanceData] = useState({
    tires: [],
    brakes: {},
  });

  const [selectedHealth, setSelectedHealth] = useState(null);

  useEffect(() => {
    setSelectedHealth(maintenanceData?.battery);
  }, [maintenanceData]);

  const handleButtonClick = (health) => {
    saveData(health);
    setSelectedHealth(health);
  };

  const saveData = async () => {};

  const BatteryHealthSelector = () => {
    return (
      <div className="battery-health-container middle-content mx-3">
        <button
          className={`battery-button ${
            selectedHealth === 'peak' ? 'selected' : ''
          }`}
          style={
            selectedHealth === 'peak'
              ? { backgroundColor: '#BDDC1180', color: 'black' }
              : { color: 'black' }
          }
          onClick={() => handleButtonClick('peak')}
        >
          {t('peakPerformance')}
        </button>
        <button
          className={`battery-button ${
            selectedHealth === 'degrading' ? 'selected' : ''
          }`}
          style={
            selectedHealth === 'degrading'
              ? { backgroundColor: '#edbe0280', color: 'black' }
              : { color: 'black' }
          }
          onClick={() => handleButtonClick('degrading')}
        >
          {' '}
          {t('degrading')}
        </button>
        <button
          className={`battery-button ${
            selectedHealth === 'replace' ? 'selected' : ''
          }`}
          style={
            selectedHealth === 'replace'
              ? { backgroundColor: '#E72B5780', color: 'black' }
              : { color: 'black' }
          }
          onClick={() => handleButtonClick('replace')}
        >
          {' '}
          {t('replaceSoon')}
        </button>
      </div>
    );
  };

  return (
    <div
      style={{
        position: 'relative',
      }}
    >
      <div>
        <BatteryHealthSelector />
      </div>
    </div>
  );
};

export default Battery;
