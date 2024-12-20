//utilities
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import ButtonCircle from '../../stories/general-components/ButtonCircle';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import LightModeIcon from '@mui/icons-material/LightMode';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import Block from '../../stories/layout-components/Block';

import BorderLeftIcon from '@mui/icons-material/BorderLeft';
import BorderRightIcon from '@mui/icons-material/BorderRight';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { Divider, Tooltip } from '@mui/material';

const MaintenanceVehiculeData = ({ print }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [maintenanceData] = useState({
    tires: [],
    brakes: {},
  });

  const [selectedHealth, setSelectedHealth] = useState(null);
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

  const [brakeConditions, setBrakeConditions] = useState({
    FLB: 0,
    RRB: 0,
  });

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

    setBrakeConditions({
      FLB: parseInt(maintenanceData?.brakes?.FLB) || 0,
      RRB: parseInt(maintenanceData?.brakes?.RRB) || 0,
    });

    setSelectedHealth(maintenanceData?.battery);
  }, [maintenanceData]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleButtonClick = (health) => {
    saveData(health);
    setSelectedHealth(health);
  };

  const saveData = async () => {};

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
      setToBeUpdate({
        ...toBeUpdate,
        brakes: true,
      });
      setBrakeCondition((prevState) => ({
        ...prevState,
        [position]: value,
      }));
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
      <Block noPadding noBorder>
        <div className="d-flex">
          <div style={{ marginLeft: '-20px' }}>
            <img
              src="/assets/v3/img/batteryDeco.jpg"
              height={print ? 45 : 65}
            />
          </div>
          <div>
            <BatteryHealthSelector />
          </div>
        </div>
      </Block>

      <Divider component={'div'} />

      <Block noPadding noBorder>
        <div className="d-flex mt-3 middle-content">
          <div className="mt-4">
            <img src="/assets/v3/img/tireDeco.png" height={print ? 70 : 90} />
          </div>
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
                label={toBeUpdate?.tires === true ? '' : t('summer')}
                iconPosition="start"
                icon={<LightModeIcon />}
              />
              <Tab
                label={toBeUpdate?.tires === true ? '' : t('winter')}
                iconPosition="start"
                icon={<AcUnitIcon />}
              />
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
          <div className="mx-1">
            {toBeUpdate?.tires === true && (
              <ButtonCircle
                onClick={() => {
                  saveData();
                }}
                icon="Save"
                primary={true}
                color="white"
              />
            )}
          </div>
        </div>
      </Block>

      <Divider component={'div'} />

      <Block noPadding noBorder noScroll>
        <div className="d-flex middle-content">
          <div className="mt-4">
            <img src="/assets/v3/img/brakeDeco.png" height={print ? 70 : 90} />
          </div>
          <div className="d-flex mx-1">
            <div>
              <div className="mt-2 mx-1 d-flex middle-content">
                <div className="icon-container mx-2">
                  <ExpandLessIcon
                    fontSize="large"
                    className="icon-bottom-top"
                  />
                </div>
                <BrakeConditionIndicator
                  position="FLB"
                  brakeCondition={brakeConditions}
                  setBrakeCondition={setBrakeConditions}
                />
              </div>

              <div className="mt-2 mx-1 d-flex middle-content">
                <div className="icon-container mx-2">
                  <ExpandMoreIcon
                    fontSize="large"
                    className="icon-bottom-top"
                  />
                </div>
                <BrakeConditionIndicator
                  position="RRB"
                  brakeCondition={brakeConditions}
                  setBrakeCondition={setBrakeConditions}
                />
              </div>
            </div>
          </div>
          <div className="mx-1">
            {toBeUpdate?.brakes === true && (
              <ButtonCircle
                onClick={() => {
                  saveData();
                }}
                icon="Save"
                primary={true}
                color="white"
              />
            )}
          </div>
        </div>
      </Block>
    </div>
  );
};

export default MaintenanceVehiculeData;
