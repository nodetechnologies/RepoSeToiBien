import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Typo from '../../components/Typo';
import Btn from '../../components/Btn';

const HeaderSection = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const currentLangCode = i18n.language;

  const websiteData = useSelector((state) => state.website.data);

  const [expanded, setExpanded] = useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <div>
      <div className="row" style={{ minHeight: '250px', paddingTop: '75px' }}>
        <div className="col-12 col-md-6 mt-3 d-flex flex-column justify-content-between">
          <div className="mb-5">
            <div className="mt-3">
              <Typo
                variant="h1"
                text={websiteData?.home?.headerTitle || t('headerTitle')}
              />
            </div>
            <div className="mt-4">
              <Typo
                variant="subTitle"
                text={websiteData?.home?.subTitle || t('subTitle')}
              />
            </div>
          </div>

          <Accordion
            expanded={expanded === 'panel1'}
            onChange={handleChange('panel1')}
            elevation={0}
            sx={{ m: 0, p: 0, backgroundColor: 'transparent' }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typo
                variant="smallTitle"
                text={websiteData?.home?.block1Title || t('block1Title')}
              />
            </AccordionSummary>
            <AccordionDetails>
              <Typo
                variant="p"
                text={websiteData?.home?.block1Text || t('block1Text')}
              />
            </AccordionDetails>
          </Accordion>

          <Accordion
            expanded={expanded === 'panel2'}
            onChange={handleChange('panel2')}
            elevation={0}
            sx={{ m: 0, p: 0, backgroundColor: 'transparent' }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typo
                variant="smallTitle"
                text={websiteData?.home?.block2Title || t('block2Title')}
              />
            </AccordionSummary>
            <AccordionDetails>
              <Typo
                variant="p"
                text={websiteData?.home?.block2Text || t('block2Text')}
              />
            </AccordionDetails>
          </Accordion>

          <Accordion
            expanded={expanded === 'panel3'}
            onChange={handleChange('panel3')}
            elevation={0}
            sx={{ m: 0, p: 0, backgroundColor: 'transparent' }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typo
                variant="smallTitle"
                text={websiteData?.home?.block3Title || t('block3Title')}
              />
            </AccordionSummary>
            <AccordionDetails>
              <Typo
                variant="p"
                text={websiteData?.home?.block3Text || t('block3Text')}
              />
            </AccordionDetails>
          </Accordion>
          <Accordion
            expanded={expanded === 'panel4'}
            onChange={handleChange('panel4')}
            elevation={0}
            sx={{ m: 0, p: 0, backgroundColor: 'transparent' }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typo
                variant="smallTitle"
                text={websiteData?.home?.block4Title || t('block4Title')}
              />
            </AccordionSummary>
            <AccordionDetails>
              <Typo
                variant="p"
                text={websiteData?.home?.block4Text || t('block4Text')}
              />
            </AccordionDetails>
          </Accordion>
        </div>
        <div className="col-12 col-md-6 mt-4 align-c">
          <img
            src={'./assets/website/v2/home_banner_' + currentLangCode + '.png'}
            width="90%"
            alt="Features Node"
          />
        </div>
      </div>
      <div style={{ marginTop: '100px' }}>
        <div className="row align-c mb-5 mt-5">
          <Btn text={t('letsTalk')} onClick={() => navigate('/contact')} />
        </div>
      </div>
      <div className="row align-c mt-5" style={{ minHeight: '80px' }}>
        <div className="col-md-2 col-12">
          {' '}
          <img
            src="https://uploads-ssl.webflow.com/641cd341bb64d84ffad595f1/64eb9bc49f92b72fe49da039_GoogleStartUp.png"
            alt="google"
            style={{ height: '25px', margin: '0 auto' }}
          />
        </div>
        <div className="col-md-2 col-12">
          <img
            src="https://uploads-ssl.webflow.com/641cd341bb64d84ffad595f1/64eb9bc49f92b72fe49da045_PCINode.png"
            alt="PCI"
            style={{ height: '27px', margin: '0 auto' }}
          />
        </div>
        <div className="col-md-2 col-12">
          <img
            src="https://uploads-ssl.webflow.com/641cd341bb64d84ffad595f1/64eb9bc49f92b72fe49da035_makeNode.png"
            alt="make integromat"
            style={{ height: '25px', margin: '0 auto' }}
            className="hide-on-mobile"
          />
        </div>
        <div className="col-md-2 col-12">
          {' '}
          <img
            src="https://uploads-ssl.webflow.com/641cd341bb64d84ffad595f1/64eb9bc49f92b72fe49da03e_ProductHuntNode.png"
            alt="product hunt"
            style={{ height: '26px', margin: '0 auto' }}
            className="hide-on-mobile"
          />
        </div>
        <div className="col-md-2 col-12">
          <img
            src="https://uploads-ssl.webflow.com/641cd341bb64d84ffad595f1/64eb9bc49f92b72fe49da04a_RQNode.png"
            alt="revenu quebec"
            style={{ height: '55px', margin: '0 auto' }}
            className="hide-on-mobile"
          />
        </div>
      </div>
    </div>
  );
};

export default HeaderSection;
