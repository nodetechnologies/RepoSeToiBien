import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Button, Typography, Grid, Box, Avatar } from '@mui/material';
import { db } from '../../firebase';
import { getDoc, doc } from 'firebase/firestore';
import useMediaQuery from '@mui/material/useMediaQuery';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { useTranslation } from 'react-i18next';
import GeneralText from '../../stories/general-components/GeneralText';
import { ArrowForward } from '@mui/icons-material';

const Presentation = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { search } = useLocation();

  const flowId = new URLSearchParams(search).get('flowId');
  const brand = new URLSearchParams(search).get('brand');
  const name = new URLSearchParams(search).get('name');

  const [flow, setFlow] = useState({ slides: [], name: '', brand: '#000000' });
  const [activeTab, setActiveTab] = useState(0);
  const [isIntro, setIsIntro] = useState(true);

  const brandPrimary = '#' + brand || '#000000';
  const brandSecondary = '#' + brand || '#000000';

  const theme = createTheme({
    palette: {
      primary: {
        main: brandPrimary,
      },
      secondary: {
        main: brandSecondary,
      },
    },
  });

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const lang = localStorage.getItem('i18nextLng');

  const handleStart = () => {
    setIsIntro(false);
  };

  const animations = [
    {
      scale: [0.9, 1],
      opacity: [0, 1],
      transition: {
        delay: 0.2,
      },
    },
    {
      x: [-50, 0],
      opacity: [0, 1],
      transition: {
        delay: 0.7,
      },
    },
    {
      y: [-50, 0],
      opacity: [0, 1],
      transition: {
        delay: 0.5,
      },
    },
  ];

  const imageVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        delay: 1.3,
      },
    },
  };

  const handleChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  useEffect(() => {
    const fetchFlow = async () => {
      try {
        const newsRef = doc(db, 'flows', flowId);
        const newsSnap = await getDoc(newsRef);
        if (newsSnap.exists()) {
          setFlow(newsSnap.data());
        }
      } catch (error) {}
    };

    fetchFlow();
  }, [flowId]);

  const handleNext = () => {
    setActiveTab((prevActiveTab) => prevActiveTab + 1);
  };

  const TemplateA = ({ slide }) => {
    return (
      <div
        className="row"
        style={{
          display: 'flex',
          padding: isMobile ? '0px' : '25px',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div className="col-5 px-3">
          <motion.img
            src={slide?.media}
            alt={slide?.title}
            variants={imageVariants}
            initial="hidden"
            animate="show"
            style={{
              height: '100%',
              backgroundSize: 'cover',
              width: '100%',
              borderRadius: '10px',
              maxHeight: '660px',
              maxWidth: '440px',
            }}
          />
        </div>
        <div className="col-7 px-4">
          <Typography
            variant="h5"
            component="h2"
            gutterBottom
            style={{ marginTop: '10px', paddingRight: '15%', fontWeight: 600 }}
          >
            {slide?.title}
          </Typography>
          <GeneralText
            style={{ paddingRight: '35%', fontWeight: 400, color: '#696969' }}
            text={slide?.content?.replace(/{{name}}/g, name)}
            primary
            fontSize={isMobile ? '0.8rem' : '1.1rem'}
            size="regular"
          />
          <GeneralText
            text={slide?.body?.replace(/{{name}}/g, name)}
            markdown
            primary
            style={{ marginTop: '50px' }}
          />
          <div className="mt-5">
            {activeTab !== flow?.slides?.length - 1 && (
              <Button
                variant="text"
                endIcon={<ArrowForward />}
                color="primary"
                onClick={handleNext}
              >
                {t('next')}
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  };

  const TemplateB = ({ slide }) => {
    return (
      <div
        className="row"
        style={{
          display: 'flex',
          padding: isMobile ? '0px' : '25px',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div className="col-6 px-3">
          {' '}
          <Typography
            variant="h5"
            component="h2"
            fontSize="18px"
            sx={{
              maxWidth: '65%',
              marginBottom: '40px',
            }}
            fontWeight={600}
            gutterBottom
          >
            {slide?.title}
          </Typography>
          <GeneralText
            text={slide?.body?.replace(/{{name}}/g, name)}
            markdown
            primary
          />
          <div className="mt-5">
            {activeTab !== flow?.slides?.length - 1 && (
              <Button
                variant="text"
                endIcon={<ArrowForward />}
                color="primary"
                onClick={handleNext}
              >
                {t('next')}
              </Button>
            )}
          </div>
        </div>
        <div className="col-6 px-4">
          <GeneralText
            text={slide?.content?.replace(/{{name}}/g, name)}
            primary
            style={{
              marginTop: '10px',
              maxWidth: '80%',
              paddingRight: '15%',
              fontWeight: 400,
            }}
            fontSize={isMobile ? '0.8rem' : '1.1rem'}
            size="regular"
          />{' '}
          <motion.img
            src={slide?.media}
            alt={slide?.title}
            variants={imageVariants}
            initial="hidden"
            animate="show"
            style={{
              backgroundSize: 'cover',
              height: '100%',
              width: '100%',
              borderRadius: '10px',
              maxHeight: '560px',
              maxWidth: '620px',
              marginTop: '30px',
            }}
          />
        </div>
      </div>
    );
  };

  const TemplateC = ({ slide }) => {
    return (
      <div
        className="row"
        style={{
          display: 'flex',
          padding: isMobile ? '0px' : '25px',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div className="col-5 px-3">
          <Typography
            variant="h5"
            component="h2"
            gutterBottom
            fontWeight={600}
            mb={3}
          >
            {slide?.title}
          </Typography>
          <motion.img
            src={slide?.media}
            alt={slide?.title}
            variants={imageVariants}
            initial="hidden"
            animate="show"
            style={{
              height: '100%',
              backgroundSize: 'cover',
              width: '100%',
              marginBottom: '-85px',
              borderRadius: '10px',
              maxHeight: '280px',
              maxWidth: '280px',
            }}
          />
          <motion.img
            src={slide?.sec}
            alt={slide?.title}
            variants={imageVariants}
            initial="hidden"
            animate="show"
            style={{
              height: '100%',
              width: '100%',
              marginLeft: '190px',
              backgroundSize: 'cover',
              borderRadius: '10px',
              maxHeight: '280px',
              maxWidth: '280px',
            }}
          />
        </div>
        <div className="col-7 px-4">
          <GeneralText
            text={slide?.content?.replace(/{{name}}/g, name)}
            primary
            style={{
              marginTop: '50px',
              maxWidth: '90%',
              paddingRight: '35%',
              fontWeight: 400,
            }}
            fontSize={isMobile ? '0.8rem' : '1.1rem'}
            size="regular"
          />
          <GeneralText
            text={slide?.body?.replace(/{{name}}/g, name)}
            markdown
            style={{
              marginTop: '50px',
            }}
            primary
          />
          <div className="mt-5">
            {activeTab !== flow?.slides?.length - 1 && (
              <Button
                variant="text"
                endIcon={<ArrowForward />}
                color="primary"
                onClick={handleNext}
              >
                {t('next')}
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  };

  const TemplateD = ({ slide }) => {
    return (
      <div
        className="row"
        style={{
          display: 'flex',
          padding: isMobile ? '0px' : '25px',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div className="col-6 px-4">
          {' '}
          <Typography variant="h5" component="h2" gutterBottom>
            {slide?.title}
          </Typography>
          <GeneralText
            text={slide?.content?.replace(/{{name}}/g, name)}
            primary
            style={{
              marginTop: '10px',
              maxWidth: '80%',
              paddingRight: '35%',
              fontWeight: 400,
            }}
            fontSize={isMobile ? '0.8rem' : '1.1rem'}
            size="regular"
          />{' '}
          <GeneralText
            text={slide?.body?.replace(/{{name}}/g, name)}
            primary
            style={{
              marginTop: '40px',
              maxWidth: '80%',
              paddingRight: '35%',
              fontWeight: 400,
            }}
            markdown
            fontSize={'1rem'}
            size="regular"
          />
          <Button
            variant="contained"
            disableElevation
            color="primary"
            sx={{ mt: 4 }}
            onClick={() => {
              const url = slide?.sec?.split('///')[1];
              window.open(url, '_blank');
            }}
          >
            {slide?.sec?.split('///')[0]}
          </Button>
        </div>
        <div className="col-6 px-3">
          <motion.img
            src={slide?.media}
            alt={slide?.title}
            variants={imageVariants}
            initial="hidden"
            animate="show"
            style={{
              height: '100%',
              width: '100%',
              backgroundSize: 'cover',
              borderRadius: '10px',
              maxHeight: '560px',
              maxWidth: '420px',
            }}
          />

          <div className="mt-5">
            {activeTab !== flow?.slides?.length - 1 && (
              <Button
                variant="text"
                disableElevation
                endIcon={<ArrowForward />}
                color="primary"
                onClick={handleNext}
              >
                {t('next')}
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <ThemeProvider theme={theme}>
      <div>
        <Helmet>
          <title>{t('presentation') + ' ' + name}</title>
        </Helmet>
        {isIntro && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              display: 'flex',
              zIndex: 100,
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(9px)',
            }}
          >
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              style={{ marginBottom: '15px' }}
            >
              {flow?.name || '-'}
            </Typography>
            <Typography
              variant="body2"
              component="p"
              gutterBottom
              style={{ marginBottom: '45px' }}
            >
              {flow?.description || '-'}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={handleStart}
              disableElevation
            >
              {t('start')}
            </Button>
          </Box>
        )}
        <div>
          <Grid
            sx={{
              backgroundColor: '#FFF',
              height: '102vh',
              overflow: 'hidden',
            }}
            container
            spacing={2}
          >
            <Grid item xs={12} sm={2}>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '80%',
                }}
              >
                <div style={{ paddingLeft: '35px' }} className="mb-4">
                  <Avatar
                    alt={flow?.name || '-'}
                    sx={{
                      backgroundColor: '#FFFFFF',
                      border: '2px solid #FFFFFF',
                      boxShadow: '0px 0px 0px 2px #00000007',
                    }}
                    src={`https://storage.googleapis.com/node-business-logos/${flow?.ownerId?.id}.png`}
                  />
                  <div className="mt-3">
                    <GeneralText
                      text={flow?.name || '-'}
                      primary
                      fontSize="1.2rem"
                      size="bold"
                    />
                    <GeneralText
                      text={flow?.description || '-'}
                      primary
                      fontSize="0.8rem"
                      size="regular"
                    />
                  </div>
                </div>
                <Tabs
                  value={activeTab}
                  onChange={handleChange}
                  orientation={isMobile ? 'horizontal' : 'vertical'}
                  variant="scrollable"
                  color="primary"
                  sx={{
                    borderRight: isMobile ? 'none' : '1px solid lightgray',
                    width: '100%',
                    textAlign: 'left !important',
                  }}
                >
                  {flow?.slides?.map((slide, index) => (
                    <Tab
                      key={index}
                      label={
                        <div
                          style={{
                            textAlign: 'left',
                            width: '100%',
                            paddingLeft: '20px',
                          }}
                        >
                          <GeneralText
                            text={slide?.tab || '-'}
                            primary
                            fontSize="1rem"
                            size="bold"
                          />
                          <GeneralText
                            text={slide?.title || '-'}
                            primary
                            fontSize="0.7rem"
                            size="regular"
                          />
                        </div>
                      }
                    />
                  ))}
                </Tabs>
              </div>
            </Grid>
            <Grid item xs={12} sm={10}>
              {flow?.slides.map((slide, index) => {
                if (activeTab === index) {
                  const animation =
                    animations[Math.floor(Math.random() * animations?.length)];

                  return (
                    <div
                      key={index}
                      style={{
                        padding: '25px',
                      }}
                    >
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={animation}
                        transition={{ duration: 0.5 }}
                        style={{
                          width: '100%',
                          height: '100vh',
                          paddingLeft: isMobile ? '0px' : '45px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {(() => {
                          switch (slide?.template) {
                            case 'A':
                              return <TemplateA slide={slide} />;
                            case 'B':
                              return <TemplateB slide={slide} />;
                            case 'C':
                              return <TemplateC slide={slide} />;
                            case 'D':
                              return <TemplateD slide={slide} />;
                            default:
                              return null;
                          }
                        })()}
                      </motion.div>
                    </div>
                  );
                }
              })}
            </Grid>
          </Grid>
        </div>
        <div>
          <Box
            sx={{
              backgroundColor: '#FFF',
              width: '100%',
              display: 'flex',
              bottom: 0,
              position: 'fixed',
              justifyContent: 'center',
              alignItems: 'center',
              borderTop: '1px solid #00000007',
            }}
          >
            <Typography
              variant="body2"
              component="p"
              gutterBottom
              color="#696969"
              fontSize="10px"
              style={{ marginBottom: '30px', paddingTop: '15px' }}
            >
              {t('footerPresentationNode')}
            </Typography>
          </Box>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default Presentation;
