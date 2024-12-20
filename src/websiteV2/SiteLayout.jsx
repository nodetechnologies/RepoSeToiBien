import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useTheme } from '@mui/material/styles';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { Helmet } from 'react-helmet';
import Header from './components/Header';
import Footer from './components/Footer';
import { mainData } from '../redux/actions-v2/websiteAction';
import colorGenerator from '../utils/colorGenerator';
import { Container } from '@mui/material';
import Loading from '../stories/general-components/Loading';

const SiteLayout = ({ children, helmetData }) => {
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const [isLoading, setIsLoading] = React.useState(true);
  const theme = useTheme();
  const currentLangCode = i18n.language;
  const isDarkMode = theme.palette.mode === 'dark';
  const localStorageColor = localStorage.getItem('mainColor');

  const mainColor =
    theme.palette.primary.main || localStorageColor || '#1604DD';

  const gradientBackground = `linear-gradient(170deg, ${colorGenerator(
    mainColor,
    0,
    0.1,
    1,
    isDarkMode
  )} 30%, ${isDarkMode ? '#0d0d0d' : '#FFF'} 68%)`;

  useEffect(() => {
    const documentId = 'website_' + currentLangCode;
    const documentRef = doc(db, 'public', documentId);

    const unsubscribe = onSnapshot(
      documentRef,
      (doc) => {
        if (doc.exists()) {
          dispatch(mainData({ ...doc.data() }));
          setIsLoading(false);
        } else {
          console.error('No such document found:', documentId);
        }
      },
      (error) => {
        console.error('Error fetching document:', error);
      }
    );

    return () => unsubscribe();
  }, [currentLangCode, dispatch]);

  return (
    <div
      style={{
        backgroundImage: gradientBackground,
        height: '100vh',
        overflowY: 'auto',
      }}
    >
      <Helmet>
        <title>{helmetData?.name + ' - ' + 'Node'}</title>
        <meta name="description" content={helmetData?.description || '-'} />

        <meta
          name="keywords"
          content={[
            t('businessManagement'),
            'Node',
            'usenode',
            'SaaS',
            t('software'),
            'ERP',
            'CRM',
          ]}
        />
        <link
          rel="icon"
          type="image/png"
          href={`https://storage.googleapis.com/node-business-logos/${'nodetechnologies'}.png`}
          sizes="16x16"
        />

        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charset="UTF-8" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:title" content={helmetData?.name + ' - ' + 'Node'} />
        <meta
          property="og:description"
          content={helmetData?.name + ': ' + helmetData?.description}
        />
        <meta
          name="twitter:title"
          content={helmetData?.name + ' - ' + 'Node'}
        />
        <link rel="canonical" href={'https://usenode.com'} />
        <meta property="og:url" content={'https://usenode.com'} />
        <meta name="geo.region" content={'CA-QC'} />

        <meta name="telephone" content={'1-888-343-0310'} />
        <meta name="email" content={'i@usenode.com'} />

        <meta
          property="og:image:alt"
          content={helmetData?.name + ' - ' + 'Node'}
        />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:locale" content={currentLangCode} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Node" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>
      <div style={{ position: 'sticky', top: 0 }}>
        <Header />
      </div>
      <Container
        style={{
          flex: 1,
          maxWidth: '1050px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          overflowX: 'hidden',
          padding: '1rem',
        }}
      >
        <div style={{ width: '100%' }}>
          {isLoading ? (
            <div>
              <Loading type="backdrop" />
            </div>
          ) : (
            <div style={{ textAlign: 'left' }}>{children}</div>
          )}
        </div>
      </Container>
      <Footer />
    </div>
  );
};

export default SiteLayout;
