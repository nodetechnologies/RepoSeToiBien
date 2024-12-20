import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import Typo from '../../components/Typo';
import { Avatar, Checkbox, FormControlLabel, FormGroup } from '@mui/material';

const MapSection = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const currentLangCode = i18n.language;
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  const [nameSec3, setNameSec3] = useState({
    name: 'Thomas D. de Node',
    title: 'COO',
    avatar: '/assets/website/img/thomas-demarais.jpg',
  });
  const [currentSelect, setCurrentSelect] = useState('display1');
  const [inView, setInView] = useState(false);

  const [currentSelections, setCurrentSelections] = useState({
    internal: false,
    tech: false,
    manual: false,
  });

  const handleChangeCheck = (name) => {
    setCurrentSelections((prev) => ({
      ...prev,
      manual: true,
      [name]: !prev[name],
    }));
  };

  useEffect(() => {
    if (currentSelections.manual === false && !inView) {
      const interval = setInterval(() => {
        setCurrentSelect((prev) => {
          switch (prev) {
            case 'display1':
              return 'display2';
            case 'display2':
              return 'display3';
            case 'display3':
              return 'display4';
            default:
              return 'display1';
          }
        });
        setCurrentSelections((prev) => {
          switch (currentSelect) {
            case 'display1':
              return { internal: true, tech: true, manual: false };
            case 'display2':
              return { internal: true, tech: false, manual: false };
            case 'display3':
              return { internal: false, tech: true, manual: false };
            default:
              return { internal: false, tech: false, manual: false };
          }
        });
      }, 5000);
      return () => clearInterval(interval);
    } else {
      // Handle manual selections for display logic
      if (currentSelections.internal && currentSelections.tech) {
        setCurrentSelect('display1');
      } else if (!currentSelections.internal && currentSelections.tech) {
        setCurrentSelect('display3');
      } else if (currentSelections.internal && !currentSelections.tech) {
        setCurrentSelect('display4');
      } else {
        setCurrentSelect('display1');
      }
    }
  }, [currentSelections, inView]);

  const employeesList = [
    {
      name: 'Lou M. de Node',
      title: 'CEO',
      avatar: '/assets/website/img/lou-mainguy.jpg',
    },
    {
      name: 'Antoine G. de Node',
      title: 'Stratégies et Développement',
      avatar: '/assets/website/img/antoine-g.jpg',
    },
    {
      name: 'Thomas D. de Node',
      title: 'COO - Opérations',
      avatar: '/assets/website/img/thomas-demarais.jpg',
    },
    {
      name: 'Caroline D. de Node',
      title: 'Marketing et Affiliations',
      avatar: '/assets/website/img/caroline.png',
    },
  ];

  //every 10 sec pick a random employee and set it
  useEffect(() => {
    const interval = setInterval(() => {
      const randomEmployee =
        employeesList[Math.floor(Math.random() * employeesList.length)];
      setNameSec3(randomEmployee);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const websiteData = useSelector((state) => state.website.data);

  return (
    <div
      className="block-separator"
      style={{ position: 'relative', minHeight: '500px' }}
    >
      <div
        className="align-c"
        style={{ marginTop: '100px', marginBottom: '30px' }}
      >
        <div className="align-c mt-5">
          {' '}
          <Typo
            text={websiteData?.home?.titleSec3 || t('titleSec3')}
            variant={'h2'}
          />{' '}
        </div>
        <div className="mt-4">
          <FormGroup row className="mt-4 align-c">
            <FormControlLabel
              sx={{
                color: isDarkMode ? '#FFFFFF' : '#000000',
              }}
              control={
                <Checkbox
                  sx={{
                    '& .MuiSvgIcon-root': {
                      color: isDarkMode ? '#FFFFFF' : '#000000',
                    },
                    color: isDarkMode ? '#FFFFFF' : '#000000',
                  }}
                  key={currentSelections.internal + 'internal'}
                  checked={currentSelections?.internal}
                  onChange={() => handleChangeCheck('internal')}
                />
              }
              label={t('haveInternal')}
            />
            <FormControlLabel
              sx={{
                color: isDarkMode ? '#FFFFFF' : '#000000',
              }}
              control={
                <Checkbox
                  sx={{
                    '& .MuiSvgIcon-root': {
                      color: isDarkMode ? '#FFFFFF' : '#000000',
                    },
                    color: isDarkMode ? '#FFFFFF' : '#000000',
                  }}
                  key={currentSelections.tech + 'tech'}
                  checked={currentSelections?.tech}
                  onChange={() => handleChangeCheck('tech')}
                />
              }
              label={t('haveTech')}
            />
          </FormGroup>
        </div>
        <img
          src="./assets/website/img/blue-circle.png"
          width="120px"
          alt="Circle Node"
          style={{
            position: 'absolute',
            top: 200,
            left: 35,
          }}
        />
      </div>
      {currentSelect === 'display1' && (
        <div className="row mt-3 middle-content px-4">
          <div className="col-md-6 col-12">
            <div className="d-flex">
              <div>
                <img
                  src="./assets/website/img/card-4.png"
                  width="100%"
                  alt="Mapping Numeric"
                />
              </div>
            </div>
          </div>
          <div className="col-md-6 col-12 px-5">
            <div>
              {' '}
              <Typo
                text={websiteData?.home?.subTitleSec3 || t('subTitleSec3')}
                variant={'h3'}
              />{' '}
            </div>
            <div className="mt-4">
              <Typo
                text={websiteData?.home?.texteSec3 || t('texteSec3')}
                variant={'p'}
              />
            </div>
            <div className="mt-5 d-flex middle-content">
              <Avatar src={nameSec3?.avatar} />
              <div className="px-3">
                <Typo text={nameSec3?.name} variant={'p-light'} bold />
                <Typo text={nameSec3?.title} variant={'p-light'} />
              </div>
            </div>
          </div>
        </div>
      )}
      {currentSelect === 'display2' && (
        <div className="row mt-3 middle-content px-4">
          <div className="col-md-6 col-12">
            <div className="d-flex">
              <div>
                {' '}
                <img
                  src="./assets/website/img/card-3.png"
                  width="100%"
                  alt="Node expertise"
                />
              </div>
            </div>
          </div>
          <div className="col-md-6 col-12 px-5">
            <div>
              {' '}
              <Typo
                text={websiteData?.home?.subTitleSec4 || t('subTitleSec4')}
                variant={'h3'}
              />{' '}
            </div>
            <div className="mt-4">
              <Typo
                text={websiteData?.home?.texteSec4 || t('texteSec4')}
                variant={'p'}
              />
            </div>
            <div className="mt-5 d-flex middle-content">
              <Avatar src={nameSec3?.avatar} />
              <div className="px-3">
                <Typo text={nameSec3?.name} variant={'p-light'} bold />
                <Typo text={nameSec3?.title} variant={'p-light'} />
              </div>
            </div>
          </div>
        </div>
      )}
      {currentSelect === 'display3' && (
        <div className="row mt-3 middle-content px-4">
          <div className="col-md-6 col-12">
            <div className="d-flex">
              <div>
                {' '}
                <img
                  src="./assets/website/img/card-2.png"
                  width="100%"
                  alt="Node Platform"
                />
              </div>
            </div>
          </div>
          <div className="col-md-6 col-12 px-5">
            <div>
              {' '}
              <Typo
                text={websiteData?.home?.subTitleSec5 || t('subTitleSec5')}
                variant={'h3'}
              />{' '}
            </div>
            <div className="mt-4">
              <Typo
                text={websiteData?.home?.texteSec5 || t('texteSec5')}
                variant={'p'}
              />
            </div>
            <div className="mt-5 d-flex middle-content">
              <Avatar src={nameSec3?.avatar} />
              <div className="px-3">
                <Typo text={nameSec3?.name} variant={'p-light'} bold />
                <Typo text={nameSec3?.title} variant={'p-light'} />
              </div>
            </div>
          </div>
        </div>
      )}
      {currentSelect === 'display4' && (
        <div className="row mt-3 middle-content px-4">
          <div className="col-md-6 col-12">
            <div className="d-flex">
              <div>
                {' '}
                <img
                  src="./assets/website/img/card-1.png"
                  width="100%"
                  alt="Node Softwares"
                />
              </div>
            </div>
          </div>
          <div className="col-md-6 col-12 px-5">
            <div>
              {' '}
              <Typo
                text={websiteData?.home?.subTitleSec6 || t('subTitleSec6')}
                variant={'h3'}
              />{' '}
            </div>
            <div className="mt-4">
              <Typo
                text={websiteData?.home?.texteSec6 || t('texteSec6')}
                variant={'p'}
              />
            </div>
            <div className="mt-5 d-flex middle-content">
              <Avatar src={nameSec3?.avatar} />
              <div className="px-3">
                <Typo text={nameSec3?.name} variant={'p-light'} bold />
                <Typo text={nameSec3?.title} variant={'p-light'} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapSection;
