import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

//components
import MainLayoutV2 from '../../layouts/MainLayoutV2';
import Block from '../../stories/layout-components/Block';
import nodeAxiosFirebase from '../../utils/nodeAxiosFirebase';

const Oauth = () => {
  const { t, i18n } = useTranslation();
  const { search } = useLocation();

  const code = new URLSearchParams(search).get('code');

  const startAuth = async () => {
    try {
      const response = await nodeAxiosFirebase({
        t,
        method: 'POST',
        url: `connectors-nylasAuthed?code=${code}`,
      });
    } catch (error) {
      console.error('Error getting business data:', error);
    }
  };

  useEffect(() => {
    startAuth();
  }, []);

  return (
    <MainLayoutV2 pageTitle={t('master')} elementId="node">
      <Block height={1} heightPercentage={82}>
        <p> Connect...</p>
      </Block>
    </MainLayoutV2>
  );
};

export default Oauth;
