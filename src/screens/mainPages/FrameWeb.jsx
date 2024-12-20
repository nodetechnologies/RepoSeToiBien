import React, { useEffect, useState } from 'react';
import {
  useParams,
  useSearchParams,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
import * as drawerActions from '../../redux/actions-v2/drawer-actions';

//utilities
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material/styles';

//components
import MainLayoutV2 from '../../layouts/MainLayoutV2';
import * as modalActions from '../../redux/actions/modal-actions';
import nodeAxiosFirebase from '../../utils/nodeAxiosFirebase';

const FrameWeb = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { linkIndex } = useParams();
  const [currentUrl, setCurrentUrl] = useState('');

  const businessModuleLinks = useSelector(
    (state) => state.core.businessData
  )?.menu;

  useEffect(() => {
    if (businessModuleLinks?.length > 0) {
      const link = businessModuleLinks[linkIndex];
      setCurrentUrl(link?.link);
    }
  }, [businessModuleLinks, linkIndex]);

  return (
    <MainLayoutV2
      actions={{}}
      pageTitle={'-'}
      sectionTitle={'-'}
      selectedTab={0}
    >
      {currentUrl ? (
        <iframe
          src="https://calendar.google.com/calendar/embed?src=lou%40usenode.ca&ctz=America%2FToronto"
          width="100%"
          height="100%"
          frameborder="0"
          scrolling="no"
        ></iframe>
      ) : (
        <p>{t('No link available')}</p>
      )}
    </MainLayoutV2>
  );
};

export default FrameWeb;
