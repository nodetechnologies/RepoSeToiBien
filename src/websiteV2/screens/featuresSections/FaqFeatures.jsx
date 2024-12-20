import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Typo from '../../components/Typo';
import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material';

const FaqFeaturesSections = ({}) => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const currentLangCode = i18n.language;

  const websiteData = useSelector((state) => state.website.data);

  return (
    <div className="block-separator" style={{ minHeight: '500px' }}>
      <div className="align-c mb-5">
        <Typo
          variant="h3"
          text={websiteData?.features?.title6 || t('title6')}
        />
      </div>
      <Accordion elevation={0} sx={{ backgroundColor: 'transparent' }}>
        <AccordionSummary>
          <Typo
            variant="smallTitle"
            text={websiteData?.features?.titleSec6 || t('titleSec6')}
          />
        </AccordionSummary>
        <AccordionDetails>
          <Typo
            variant="p"
            text={websiteData?.features?.textSec6 || t('textSec6')}
          />
        </AccordionDetails>
      </Accordion>
      <Accordion elevation={0} sx={{ backgroundColor: 'transparent' }}>
        <AccordionSummary>
          <Typo
            variant="smallTitle"
            text={websiteData?.features?.titleSec62 || t('titleSec62')}
          />
        </AccordionSummary>
        <AccordionDetails>
          <Typo
            variant="p"
            text={websiteData?.features?.textSec62 || t('textSec62')}
          />
        </AccordionDetails>
      </Accordion>
      <Accordion elevation={0} sx={{ backgroundColor: 'transparent' }}>
        <AccordionSummary>
          <Typo
            variant="smallTitle"
            text={websiteData?.features?.titleSec63 || t('titleSec63')}
          />
        </AccordionSummary>
        <AccordionDetails>
          <Typo
            variant="p"
            text={websiteData?.features?.textSec63 || t('textSec63')}
          />
        </AccordionDetails>
      </Accordion>
      <Accordion elevation={0} sx={{ backgroundColor: 'transparent' }}>
        <AccordionSummary>
          <Typo
            variant="smallTitle"
            text={websiteData?.features?.titleSec64 || t('titleSec64')}
          />
        </AccordionSummary>
        <AccordionDetails>
          <Typo
            variant="p"
            text={websiteData?.features?.textSec64 || t('textSec64')}
          />
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

export default FaqFeaturesSections;
