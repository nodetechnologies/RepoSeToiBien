import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useTheme } from '@mui/material/styles';

//components
import MainLayoutV2 from '../../layouts/MainLayoutV2';
import Block from '../../stories/layout-components/Block';
import HelpApp from '../website/HelpApp';
import { useParams } from 'react-router';
import SupportContent from '../website/SupportContent';

const HelpCenter = () => {
  const { t, i18n } = useTranslation();
  const { contentId } = useParams();
  const currentLangCode = i18n.language;
  const dispatch = useDispatch();
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  return (
    <MainLayoutV2 pageTitle={t('help')}>
      <Block height={1} heightPercentage={97}>
        {contentId ? <SupportContent internal /> : <HelpApp internal />}
      </Block>
    </MainLayoutV2>
  );
};

export default HelpCenter;
