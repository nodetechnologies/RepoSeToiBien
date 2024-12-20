//utilities
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import LightModeIcon from '@mui/icons-material/LightMode';
import AcUnitIcon from '@mui/icons-material/AcUnit';

import BorderLeftIcon from '@mui/icons-material/BorderLeft';
import BorderRightIcon from '@mui/icons-material/BorderRight';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { Divider, Tooltip } from '@mui/material';

const Tires = ({ onBlur, onChange, value }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [maintenanceData] = useState({
    tires: [],
    brakes: {},
  });

  const [toBeUpdate, setToBeUpdate] = useState({
    brakes: false,
    tires: false,
  });
  const [tabValue, setTabValue] = useState(0);

  const getTiresValue = (type) => {
    const found = maintenanceData?.tires?.find(
      (tireObj) => tireObj.type === type
    );
    return found || {};
  };

  const initialTireWearSummer = getTiresValue('SUMMER');
  const initialTireWearWinter = getTiresValue('WINTER');

  const [tireWearSummer, setTireWearSummer] = useState({
    FLT: parseInt(initialTireWearSummer.FLT) || 0,
    FRT: parseInt(initialTireWearSummer.FRT) || 0,
    RLT: parseInt(initialTireWearSummer.RLT) || 0,
    RRT: parseInt(initialTireWearSummer.RRT) || 0,
    type: 'SUMMER',
  });

  const [tireWearWinter, setTireWearWinter] = useState({
    FLT: parseInt(initialTireWearWinter.FLT) || 0,
    FRT: parseInt(initialTireWearWinter.FRT) || 0,
    RLT: parseInt(initialTireWearWinter.RLT) || 0,
    RRT: parseInt(initialTireWearWinter.RRT) || 0,
    type: 'WINTER',
  });

  useEffect(() => {
    const initialTireWearSummer = getTiresValue('SUMMER');
    const initialTireWearWinter = getTiresValue('WINTER');

    setTireWearSummer({
      FLT: parseInt(initialTireWearSummer.FLT) || 0,
      FRT: parseInt(initialTireWearSummer.FRT) || 0,
      RLT: parseInt(initialTireWearSummer.RLT) || 0,
      RRT: parseInt(initialTireWearSummer.RRT) || 0,
      type: 'SUMMER',
    });

    setTireWearWinter({
      FLT: parseInt(initialTireWearWinter.FLT) || 0,
      FRT: parseInt(initialTireWearWinter.FRT) || 0,
      RLT: parseInt(initialTireWearWinter.RLT) || 0,
      RRT: parseInt(initialTireWearWinter.RRT) || 0,
      type: 'WINTER',
    });
  }, [maintenanceData]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const TireWearIndicator = ({ wear, setWear, season }) => {
    let startSegment, endSegment, minusWear;
    if (season === 'summer') {
      startSegment = 3;
      endSegment = 10;
      minusWear = 0;
    } else if (season === 'winter') {
      startSegment = 3;
      endSegment = 12;
      minusWear = -2;
    } else {
      throw new Error('Invalid season provided');
    }

    const segments = endSegment - startSegment + 1;

    const getColor = (value) => {
      if (value !== wear) return '#f5f5f5';
      if (value >= 7) return '#BDDC1180';
      if (value >= 5) return '#edbe0280';
      return '#E72B5780';
    };

    const getColorWinter = (value) => {
      if (value !== wear) return '#f5f5f5';
      if (value >= 9) return '#BDDC1180';
      if (value >= 7) return '#edbe0280';
      if (value <= 4) return '#80000080';
      return '#E72B5780';
    };

    const pourcentage =
      ((wear - startSegment + minusWear) /
        (endSegment - startSegment + minusWear)) *
      100;

    const handleSegmentClick = (value) => {
      setToBeUpdate({
        ...toBeUpdate,
        tires: true,
      });
      setWear(value);
    };

    return (
      <div className="tire-indicator middle-content">
        {Array.from({ length: segments }).map((_, index) => {
          const segmentValue = index + startSegment;
          return (
            <div
              key={index}
              className="segment"
              style={{
                backgroundColor:
                  season === 'winter'
                    ? getColorWinter(segmentValue)
                    : getColor(segmentValue),
              }}
              onClick={() => handleSegmentClick(segmentValue)}
            >
              {segmentValue}
            </div>
          );
        })}
        {pourcentage.toFixed(0) + '%'}
      </div>
    );
  };

  return (
    <div className="d-flex mt-3 middle-content">
      <div className="d-flex">
        <Tabs
          orientation="vertical"
          value={tabValue}
          onChange={handleTabChange}
          sx={{
            borderRight: 1,
            borderColor: 'divider',
            marginRight: '0.7rem',
            maxWidth: '100px',
          }}
        >
          <Tab
            label={t('summer')}
            iconPosition="start"
            icon={<LightModeIcon />}
          />
          <Tab label={t('winter')} iconPosition="start" icon={<AcUnitIcon />} />
        </Tabs>

        {tabValue === 0 && (
          <div className="mt-2">
            <div className="mx-1 d-flex middle-content">
              <div className="icon-container mx-2">
                <Tooltip title={t('FLT')}>
                  <div>
                    <BorderLeftIcon className="icon-bottom" />
                    <ExpandLessIcon fontSize="large" className="icon-top" />
                  </div>
                </Tooltip>
              </div>
              <TireWearIndicator
                season="summer"
                wear={tireWearSummer.FLT}
                setWear={(value) =>
                  setTireWearSummer((prev) => ({
                    ...prev,
                    FLT: value,
                  }))
                }
              />{' '}
            </div>
            <div className="mt-2 mx-1 d-flex middle-content">
              <div className="icon-container mx-2">
                <Tooltip title={t('FRT')}>
                  <div>
                    <BorderRightIcon className="icon-bottom" />
                    <ExpandLessIcon
                      fontSize="large"
                      className="icon-bottom-top"
                    />
                  </div>
                </Tooltip>
              </div>

              <TireWearIndicator
                season="summer"
                wear={tireWearSummer.FRT}
                setWear={(value) =>
                  setTireWearSummer((prev) => ({
                    ...prev,
                    FRT: value,
                  }))
                }
              />
            </div>
            <div className="mt-2 mx-1 d-flex middle-content">
              <div className="icon-container mx-2">
                <Tooltip title={t('RRT')}>
                  <div>
                    <BorderRightIcon className="icon-bottom" />
                    <ExpandMoreIcon
                      fontSize="large"
                      className="icon-bottom-top"
                    />
                  </div>
                </Tooltip>
              </div>

              <TireWearIndicator
                season="summer"
                wear={tireWearSummer.RRT}
                setWear={(value) =>
                  setTireWearSummer((prev) => ({
                    ...prev,
                    RRT: value,
                  }))
                }
              />
            </div>
            <div className="mt-2 mx-1 d-flex middle-content">
              <div className="icon-container mx-2">
                <Tooltip title={t('RLT')}>
                  <div>
                    <BorderLeftIcon className="icon-bottom" />
                    <ExpandMoreIcon fontSize="large" className="icon-top" />
                  </div>
                </Tooltip>
              </div>

              <TireWearIndicator
                season="summer"
                wear={tireWearSummer.RLT}
                setWear={(value) =>
                  setTireWearSummer((prev) => ({
                    ...prev,
                    RLT: value,
                  }))
                }
              />
            </div>
          </div>
        )}

        {tabValue === 1 && (
          <div className="mt-2">
            <div className="mx-1 d-flex middle-content">
              <div className="icon-container mx-2">
                <Tooltip title={t('FLT')}>
                  <div>
                    <BorderLeftIcon className="icon-bottom" />
                    <ExpandLessIcon fontSize="large" className="icon-top" />
                  </div>
                </Tooltip>
              </div>
              <TireWearIndicator
                season="winter"
                wear={tireWearWinter.FLT}
                setWear={(value) =>
                  setTireWearWinter((prev) => ({
                    ...prev,
                    FLT: value,
                  }))
                }
              />
            </div>{' '}
            <div className="mt-2 mx-1 d-flex middle-content">
              <div className="icon-container mx-2">
                <Tooltip title={t('FRT')}>
                  <div>
                    <BorderRightIcon className="icon-bottom" />
                    <ExpandLessIcon
                      fontSize="large"
                      className="icon-bottom-top"
                    />
                  </div>
                </Tooltip>
              </div>
              <TireWearIndicator
                season="winter"
                wear={tireWearWinter.FRT}
                setWear={(value) =>
                  setTireWearWinter((prev) => ({
                    ...prev,
                    FRT: value,
                  }))
                }
              />
            </div>
            <div className="mt-2 mx-1 d-flex middle-content">
              <div className="icon-container mx-2">
                <Tooltip title={t('RRT')}>
                  <div>
                    <BorderRightIcon className="icon-bottom" />
                    <ExpandMoreIcon
                      fontSize="large"
                      className="icon-bottom-top"
                    />
                  </div>
                </Tooltip>
              </div>
              <TireWearIndicator
                season="winter"
                wear={tireWearWinter.RRT}
                setWear={(value) =>
                  setTireWearWinter((prev) => ({
                    ...prev,
                    RRT: value,
                  }))
                }
              />
            </div>
            <div className="mt-2 mx-1 d-flex middle-content">
              <div className="icon-container mx-2">
                <Tooltip title={t('RLT')}>
                  <div>
                    <BorderLeftIcon className="icon-bottom" />
                    <ExpandMoreIcon fontSize="large" className="icon-top" />
                  </div>
                </Tooltip>
              </div>

              <TireWearIndicator
                season="winter"
                wear={tireWearWinter.RLT}
                setWear={(value) =>
                  setTireWearWinter((prev) => ({
                    ...prev,
                    RLT: value,
                  }))
                }
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tires;
