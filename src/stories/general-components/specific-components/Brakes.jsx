//utilities
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const Brakes = ({ onBlur, onChange, value }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [maintenanceData] = useState({
    tires: [],
    brakes: {},
  });

  const [brakeConditions, setBrakeConditions] = useState({
    FLB: 0,
    RRB: 0,
  });

  useEffect(() => {
    setBrakeConditions({
      FLB: parseInt(maintenanceData?.brakes?.FLB) || 0,
      RRB: parseInt(maintenanceData?.brakes?.RRB) || 0,
    });
  }, [maintenanceData]);

  const BrakeConditionIndicator = ({
    position,
    brakeCondition,
    setBrakeCondition,
  }) => {
    const getColor = (dbValues) => {
      if (dbValues.includes(brakeCondition[position])) {
        if (dbValues.some((val) => [1].includes(val))) return '#E72B5780'; // Red
        if (dbValues.some((val) => [3, 5].includes(val))) return '#edbe0280'; // Yellow
        if (dbValues.some((val) => [6, 7, 8, 9, 10].includes(val)))
          return '#BDDC1180'; // Green
      }
      return '#f5f5f5';
    };

    const segments = [
      { label: '-1mm', value: 1, dbValues: [1], color: getColor([1]) },
      { label: '2-3mm', value: 3, dbValues: [3], color: getColor([3]) },
      { label: '4-5mm', value: 5, dbValues: [4, 5], color: getColor([4, 5]) },
      { label: '6-7mm', value: 7, dbValues: [6, 7], color: getColor([6, 7]) },
      {
        label: '8-10mm',
        value: 10,
        dbValues: [8, 9, 10],
        color: getColor([8, 9, 10]),
      },
    ];

    const pourcentage = ((brakeCondition[position] - 1) / 10) * 110;

    const handleSegmentClick = (value) => {
      setBrakeCondition((prevState) => ({
        ...prevState,
        [position]: value,
      }));

      const updatedValue = {
        ...brakeCondition,
        [position]: value,
      };

      onChange('brakes', updatedValue);
    };

    return (
      <div className="brake-indicator middle-content">
        {segments.map((segment) => (
          <button
            key={segment.value}
            className={`segment ${
              segment.dbValues.includes(brakeCondition[position])
                ? 'active'
                : ''
            }`}
            style={{ backgroundColor: segment.color, color: 'black' }}
            onClick={() => handleSegmentClick(segment.value)}
          >
            {segment.label}
          </button>
        ))}
        {pourcentage.toFixed(0) + '%'}
      </div>
    );
  };

  return (
    <div
      style={{
        position: 'relative',
      }}
    >
      <div className="d-flex middle-content">
        <div className="d-flex mx-1">
          <div>
            <div className="mt-2 mx-1 d-flex middle-content">
              <div className="icon-container mx-2">
                <ExpandLessIcon fontSize="large" className="icon-bottom-top" />
              </div>
              <BrakeConditionIndicator
                position="FLB"
                brakeCondition={brakeConditions}
                setBrakeCondition={setBrakeConditions}
              />
            </div>

            <div className="mt-2 mx-1 d-flex middle-content">
              <div className="icon-container mx-2">
                <ExpandMoreIcon fontSize="large" className="icon-bottom-top" />
              </div>
              <BrakeConditionIndicator
                position="RRB"
                brakeCondition={brakeConditions}
                setBrakeCondition={setBrakeConditions}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Brakes;
