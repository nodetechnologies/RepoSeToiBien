import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useTheme } from '@mui/material/styles';
import { Tabs, Tab, Typography, Box } from '@mui/material';
import Typo from '../../components/Typo';
import colorGenerator from '../../../utils/colorGenerator';

const TabPanel = ({ children, value, index }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
};

const ProbsFixSection = () => {
  const { t } = useTranslation();
  const websiteData = useSelector((state) => state.website.data);
  const theme = useTheme();
  const mainColor = theme.palette.primary.main || '#1604DD';
  const isDarkMode = theme.palette.mode === 'dark';

  const [tabIndex, setTabIndex] = useState(0);

  const handleChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  const gradientBackground = `linear-gradient(190deg, ${colorGenerator(
    mainColor,
    isDarkMode ? 4 : 0,
    isDarkMode ? 1 : 0.15,
    isDarkMode ? 0 : 2,
    false
  )} 20%, ${isDarkMode ? '#0d0d0d' : '#FFF'} 70%)`;

  return (
    <div className="block-separator">
      <div className="align-c mt-5">
        <Typo
          variant="h2"
          text={websiteData?.home?.titleSec9 || t('titleSec9')}
        />
      </div>
      <Box sx={{ width: '100%', mt: 4 }}>
        <Tabs
          value={tabIndex}
          onChange={handleChange}
          aria-label="Problem Fixing Tabs"
          centered
        >
          <Tab
            sx={{ textTransform: 'none', fontSize: 14 }}
            label={websiteData?.home?.tab1Sec9 || t('tab1Sec9')}
          />
          <Tab
            sx={{ textTransform: 'none', fontSize: 14 }}
            label={websiteData?.home?.tab2Sec9 || t('tab2Sec9')}
          />
          <Tab
            sx={{ textTransform: 'none', fontSize: 14 }}
            label={websiteData?.home?.tab3Sec9 || t('tab3Sec9')}
          />
          <Tab
            sx={{ textTransform: 'none', fontSize: 14 }}
            label={websiteData?.home?.tab4Sec9 || t('tab4Sec9')}
          />
          <Tab
            sx={{ textTransform: 'none', fontSize: 14 }}
            label={websiteData?.home?.tab5Sec9 || t('tab5Sec9')}
          />
        </Tabs>
        <TabPanel value={tabIndex} index={0}>
          <div className="row align-c">
            <div
              className="col-md-3 col-12 mx-3 align-left"
              style={{
                background: gradientBackground,
                height: '190px',
                borderRadius: '10px',
                padding: '30px',
              }}
            >
              <Typo
                variant="smallTitle"
                mainColor
                text={websiteData?.home?.tab1Sec9Text1 || t('tab1Sec9Text1')}
              />
              <Typo
                variant="p-light"
                className="mt-2"
                text={
                  websiteData?.home?.tab1Sec9SubText1 || t('tab1Sec9SubText1')
                }
              />
            </div>
            <div
              className="col-md-3 col-12 mx-3 align-left"
              style={{
                background: gradientBackground,
                height: '190px',
                borderRadius: '10px',
                padding: '30px',
              }}
            >
              <Typo
                variant="smallTitle"
                mainColor
                text={websiteData?.home?.tab1Sec9Text2 || t('tab1Sec9Text2')}
              />
              <Typo
                variant="p-light"
                className="mt-2"
                text={
                  websiteData?.home?.tab1Sec9SubText2 || t('tab1Sec9SubText2')
                }
              />
            </div>
            <div
              className="col-md-3 col-12 mx-3 align-left"
              style={{
                background: gradientBackground,
                height: '190px',
                borderRadius: '10px',
                padding: '30px',
              }}
            >
              <Typo
                variant="smallTitle"
                mainColor
                text={websiteData?.home?.tab1Sec9Text3 || t('tab1Sec9Text3')}
              />
              <Typo
                variant="p-light"
                className="mt-2"
                text={
                  websiteData?.home?.tab1Sec9SubText3 || t('tab1Sec9SubText3')
                }
              />
            </div>
          </div>
        </TabPanel>
        <TabPanel value={tabIndex} index={1}>
          <div className="row align-c">
            <div
              className="col-md-3 col-12 mx-3 align-left"
              style={{
                background: gradientBackground,
                height: '190px',
                borderRadius: '10px',
                padding: '30px',
              }}
            >
              <Typo
                variant="smallTitle"
                mainColor
                text={websiteData?.home?.tab2Sec9Text1 || t('tab2Sec9Text1')}
              />
              <Typo
                variant="p-light"
                className="mt-2"
                text={
                  websiteData?.home?.tab2Sec9SubText1 || t('tab2Sec9SubText1')
                }
              />
            </div>
            <div
              className="col-md-3 col-12 mx-3 align-left"
              style={{
                background: gradientBackground,
                height: '190px',
                borderRadius: '10px',
                padding: '30px',
              }}
            >
              <Typo
                variant="smallTitle"
                mainColor
                text={websiteData?.home?.tab2Sec9Text2 || t('tab2Sec9Text2')}
              />
              <Typo
                variant="p-light"
                className="mt-2"
                text={
                  websiteData?.home?.tab2Sec9SubText2 || t('tab2Sec9SubText2')
                }
              />
            </div>
            <div
              className="col-md-3 col-12 mx-3 align-left"
              style={{
                background: gradientBackground,
                height: '190px',
                borderRadius: '10px',
                padding: '30px',
              }}
            >
              <Typo
                variant="smallTitle"
                mainColor
                text={websiteData?.home?.tab2Sec9Text3 || t('tab2Sec9Text3')}
              />
              <Typo
                variant="p-light"
                className="mt-2"
                text={
                  websiteData?.home?.tab2Sec9SubText3 || t('tab2Sec9SubText3')
                }
              />
            </div>
          </div>
        </TabPanel>
        <TabPanel value={tabIndex} index={2}>
          <div className="row align-c">
            <div
              className="col-md-3 col-12 mx-3 align-left"
              style={{
                background: gradientBackground,
                height: '190px',
                borderRadius: '10px',
                padding: '30px',
              }}
            >
              <Typo
                variant="smallTitle"
                mainColor
                text={websiteData?.home?.tab3Sec9Text1 || t('tab3Sec9Text1')}
              />
              <Typo
                variant="p-light"
                className="mt-2"
                text={
                  websiteData?.home?.tab3Sec9SubText1 || t('tab3Sec9SubText1')
                }
              />
            </div>
            <div
              className="col-md-3 col-12 mx-3 align-left"
              style={{
                background: gradientBackground,
                height: '190px',
                borderRadius: '10px',
                padding: '30px',
              }}
            >
              <Typo
                variant="smallTitle"
                mainColor
                text={websiteData?.home?.tab3Sec9Text2 || t('tab3Sec9Text2')}
              />
              <Typo
                variant="p-light"
                className="mt-2"
                text={
                  websiteData?.home?.tab3Sec9SubText2 || t('tab3Sec9SubText2')
                }
              />
            </div>
            <div
              className="col-md-3 col-12 mx-3 align-left"
              style={{
                background: gradientBackground,
                height: '190px',
                borderRadius: '10px',
                padding: '30px',
              }}
            >
              <Typo
                variant="smallTitle"
                mainColor
                text={websiteData?.home?.tab3Sec9Text3 || t('tab3Sec9Text3')}
              />
              <Typo
                variant="p-light"
                className="mt-2"
                text={
                  websiteData?.home?.tab3Sec9SubText3 || t('tab3Sec9SubText3')
                }
              />
            </div>
          </div>
        </TabPanel>
        <TabPanel value={tabIndex} index={3}>
          <div className="row align-c">
            <div
              className="col-md-3 col-12 mx-3 align-left"
              style={{
                background: gradientBackground,
                height: '190px',
                borderRadius: '10px',
                padding: '30px',
              }}
            >
              <Typo
                variant="smallTitle"
                mainColor
                text={websiteData?.home?.tab4Sec9Text1 || t('tab4Sec9Text1')}
              />
              <Typo
                variant="p-light"
                className="mt-2"
                text={
                  websiteData?.home?.tab4Sec9SubText1 || t('tab4Sec9SubText1')
                }
              />
            </div>
            <div
              className="col-md-3 col-12 mx-3 align-left"
              style={{
                background: gradientBackground,
                height: '190px',
                borderRadius: '10px',
                padding: '30px',
              }}
            >
              <Typo
                variant="smallTitle"
                mainColor
                text={websiteData?.home?.tab4Sec9Text2 || t('tab4Sec9Text2')}
              />
              <Typo
                variant="p-light"
                className="mt-2"
                text={
                  websiteData?.home?.tab4Sec9SubText2 || t('tab4Sec9SubText2')
                }
              />
            </div>
            <div
              className="col-md-3 col-12 mx-3 align-left"
              style={{
                background: gradientBackground,
                height: '190px',
                borderRadius: '10px',
                padding: '30px',
              }}
            >
              <Typo
                variant="smallTitle"
                mainColor
                text={websiteData?.home?.tab4Sec9Text3 || t('tab4Sec9Text3')}
              />
              <Typo
                variant="p-light"
                className="mt-2"
                text={
                  websiteData?.home?.tab4Sec9SubText3 || t('tab4Sec9SubText3')
                }
              />
            </div>
          </div>
        </TabPanel>
        <TabPanel value={tabIndex} index={4}>
          <div className="row align-c">
            <div
              className="col-md-3 col-12 mx-3 align-left"
              style={{
                background: gradientBackground,
                height: '190px',
                borderRadius: '10px',
                padding: '30px',
              }}
            >
              <Typo
                variant="smallTitle"
                mainColor
                text={websiteData?.home?.tab5Sec9Text1 || t('tab5Sec9Text1')}
              />
              <Typo
                variant="p-light"
                className="mt-2"
                text={
                  websiteData?.home?.tab5Sec9SubText1 || t('tab5Sec9SubText1')
                }
              />
            </div>
            <div
              className="col-md-3 col-12 mx-3 align-left"
              style={{
                background: gradientBackground,
                height: '190px',
                borderRadius: '10px',
                padding: '30px',
              }}
            >
              <Typo
                variant="smallTitle"
                mainColor
                text={websiteData?.home?.tab5Sec9Text2 || t('tab5Sec9Text2')}
              />
              <Typo
                variant="p-light"
                className="mt-2"
                text={
                  websiteData?.home?.tab5Sec9SubText2 || t('tab5Sec9SubText2')
                }
              />
            </div>
            <div
              className="col-md-3 col-12 mx-3 align-left"
              style={{
                background: gradientBackground,
                height: '190px',
                borderRadius: '10px',
                padding: '30px',
              }}
            >
              <Typo
                variant="smallTitle"
                mainColor
                text={websiteData?.home?.tab5Sec9Text3 || t('tab5Sec9Text3')}
              />
              <Typo
                variant="p-light"
                className="mt-2"
                text={
                  websiteData?.home?.tab5Sec9SubText3 || t('tab5Sec9SubText3')
                }
              />
            </div>
          </div>
        </TabPanel>
      </Box>
    </div>
  );
};

export default ProbsFixSection;
