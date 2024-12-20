import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { useParams } from 'react-router-dom';
import WebsiteLayout from '../../layouts/WebsiteLayout';
import {
  Button,
  Typography,
  Container,
  Grid,
  Box,
  Paper,
  Tabs,
  Tab,
  Divider,
  Badge,
  Chip,
} from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import {
  Home,
  Message,
  Assignment,
  BarChart,
  Build,
  Speed,
  GroupWork,
  SwapHoriz,
  CheckCircleOutline,
  HorizontalRuleOutlined,
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { contentFr, seoContent } from './contentFr.js';
import { contentEn } from './contentEn.js';
import Lottie from 'react-lottie';
import loadingAnimation from '../../lotties/ai.json';
import { Helmet } from 'react-helmet';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import GroupsIcon from '@mui/icons-material/Groups';
import InterestsIcon from '@mui/icons-material/Interests';
import { useTranslation } from 'react-i18next';
import BannerLeft from '../../components/website/BannerLeft';
import BothActions from '../../components/website/BothActions';
import MarkChatReadOutlinedIcon from '@mui/icons-material/MarkChatReadOutlined';

const TabPanel = ({ children, value, index, ...other }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
};

const TipsContent = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { contentName } = useParams();
  const lang = localStorage.getItem('i18nextLng');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [showBottomImage, setShowBottomImage] = useState(true);
  const [showLeftImage, setShowLeftImage] = useState(true);
  const [value, setValue] = useState(0);
  const [img, setImg] = useState(false);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const pageData =
    lang === 'fr' ? contentFr[contentName] : contentEn[contentName];
  const seoData = seoContent[contentName];

  const icons = [
    <AutoGraphIcon color="error" fontSize={'large'} />,
    <GroupsIcon color="primary" fontSize={'large'} marginBottom="10px" />,
    <InterestsIcon color="success" fontSize={'large'} marginBottom="15px" />,
  ];

  const lottieOptions = {
    loop: true,
    autoplay: true,
    animationData: loadingAnimation,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  const handlePlatform = () => {
    navigate('/app/dashboard');
  };

  const navigateDemo = () => {
    navigate('/contact/demo');
  };

  useEffect(() => {
    if (contentName === 'ai') {
      setImg(false);
      setShowLeftImage(true);
      setShowBottomImage(true);
      const timer = setTimeout(() => {
        setImg(true);
      }, 3650);

      return () => clearTimeout(timer);
    } else {
      setImg(true);
      setShowLeftImage(true);
      setShowBottomImage(true);
    }
  }, [contentName]);

  const iconMapping = {
    room: <Home />,
    chat: <Message />,
    tasks: <Assignment htmlColor="#FFFFFF" />,
    analytics: <BarChart />,
    automation: <Build />,
    optimization: <Speed htmlColor="#FFFFFF" />,
    connect: <GroupWork />,
    flow: <SwapHoriz />,
    easy: <CheckCircleOutline htmlColor="#FFFFFF" />,
  };

  const IconComponent0 = iconMapping[pageData?.features[0]?.icon];
  const IconComponent1 = iconMapping[pageData?.features[1]?.icon];
  const IconComponent2 = iconMapping[pageData?.features[2]?.icon];

  return (
    <WebsiteLayout>
      <Helmet>
        <title>{seoData?.title} - Node</title>
        <meta name="description" content={seoData?.description} />
        <meta name="keywords" content={seoData?.tags} />
      </Helmet>
      <Container>
        <div style={{ position: 'relative' }} className="d-flex">
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Box sx={{ marginTop: '195px' }} textAlign="left" marginTop="30%">
                <Typography
                  variant="h1"
                  gutterBottom
                  sx={{ marginTop: '15px' }}
                  fontWeight={600}
                  fontSize={64}
                >
                  {pageData?.headerTitle}
                </Typography>
                <Box
                  mt={3}
                  sx={{ marginBottom: '-20px', paddingBottom: '0px' }}
                  display="flex"
                  alignItems="center"
                  justifyContent="left"
                >
                  <Typography
                    variant="h6"
                    gutterBottom
                    fontWeight={500}
                    fontSize={28}
                    sx={{ transition: 'color 1s' }}
                  >
                    {pageData?.subTitle}
                  </Typography>
                </Box>

                <Box mt={4}>
                  <Button
                    elevation={0}
                    size="large"
                    onClick={navigateDemo}
                    endIcon={<ArrowForwardIcon />}
                    variant="text"
                    style={{ borderRadius: '50px' }}
                  >
                    {t('bookADemo')}
                  </Button>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box my={4} textAlign="center">
                <div style={{ position: 'relative' }}>
                  {img ? (
                    <img
                      src={`/assets/website/img/headers/${contentName}.jpeg`}
                      width="550px"
                      alt={contentName}
                    />
                  ) : (
                    <img
                      src={`/assets/website/platform/${contentName}-loading.gif`}
                      width="550px"
                      alt={contentName}
                    />
                  )}

                  {showBottomImage ? (
                    <img
                      src={
                        contentName === 'connectorsautomations'
                          ? `/assets/website/platform/${contentName}-bottom.png`
                          : `/assets/website/platform/${contentName}-bottom.svg`
                      }
                      width="450px"
                      className="float-animation-2"
                      style={{
                        position: 'absolute',
                        marginBottom: '60px',
                        marginLeft: '220px',
                        bottom: 0,
                        left: 0,
                        zIndex: 1000,
                      }}
                      onError={() => setShowBottomImage(false)}
                    />
                  ) : (
                    <img
                      src={`/assets/website/platform/${contentName}-bottom.gif`}
                      width="230px"
                      className="float-animation-2"
                      style={{
                        position: 'absolute',
                        marginBottom: '80px',
                        marginLeft: '280px',
                        bottom: 0,
                        left: 0,
                        zIndex: 1000,
                      }}
                    />
                  )}

                  {showLeftImage && (
                    <img
                      src={`/assets/website/platform/${contentName}-left.png`}
                      width="320px"
                      className="float-animation"
                      style={{
                        position: 'absolute',
                        marginBottom: '190px',
                        marginLeft: '-100px',
                        bottom: 0,
                        left: 0,
                        zIndex: 1000,
                      }}
                      onError={() => setShowLeftImage(false)} // Hide image if error
                    />
                  )}
                </div>
              </Box>
            </Grid>
          </Grid>
        </div>
        <div>
          <Grid container spacing={2} mt={12}>
            <Grid item xs={12} md={4}>
              <Paper
                elevation={0}
                sx={{
                  backgroundColor: '#F5F5F5',
                  height: '180px',
                  borderRadius: '12px',
                  padding: '20px',
                  textAlign: 'left',
                }}
              >
                {' '}
                {IconComponent0}
                <Typography
                  variant="h6"
                  gutterBottom
                  fontWeight={600}
                  fontSize={22}
                  sx={{ transition: 'color 1s' }}
                >
                  {pageData?.features[0]?.title}
                </Typography>
                <Typography
                  variant="p"
                  gutterBottom
                  fontWeight={400}
                  fontSize={14}
                  sx={{ transition: 'color 1s' }}
                >
                  {pageData?.features[0]?.description}
                </Typography>
                <div>
                  {pageData?.features[0]?.badge && (
                    <Chip
                      label={t(pageData?.features[0]?.badge)}
                      color="primary"
                      sx={{
                        backgroundColor: '#ffffff',
                        border: 'none',
                        marginRight: '5px',
                        marginTop: '10px',
                        height: '24px',
                        '& .MuiChipLabel': {
                          fontSize: '10px',
                          color: '#000000',
                        },
                      }}
                    />
                  )}
                </div>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              {' '}
              <Paper
                elevation={0}
                sx={{
                  backgroundColor: '#F5F5F5',
                  height: '180px',
                  borderRadius: '12px',
                  padding: '20px',
                  textAlign: 'left',
                }}
              >
                {IconComponent1}
                <Typography
                  variant="h6"
                  gutterBottom
                  fontWeight={600}
                  fontSize={22}
                  sx={{ transition: 'color 1s' }}
                >
                  {pageData?.features[1]?.title}
                </Typography>
                <Typography
                  variant="p"
                  gutterBottom
                  fontWeight={400}
                  fontSize={14}
                  sx={{ transition: 'color 1s' }}
                >
                  {pageData?.features[1]?.description}
                </Typography>
                <div>
                  {pageData?.features[1]?.badge && (
                    <Chip
                      label={t(pageData?.features[1]?.badge)}
                      color="primary"
                      sx={{
                        backgroundColor: '#ffffff',
                        border: 'none',
                        marginRight: '5px',
                        marginTop: '10px',
                        height: '24px',
                        '& .MuiChipLabel': {
                          fontSize: '10px',
                          color: '#000000',
                        },
                      }}
                    />
                  )}
                </div>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              {' '}
              <Paper
                elevation={0}
                sx={{
                  backgroundColor: 'primary.main',
                  height: '180px',
                  borderRadius: '12px',
                  padding: '20px',
                  textAlign: 'left',
                }}
              >
                {IconComponent2}
                <Typography
                  variant="h6"
                  gutterBottom
                  fontWeight={600}
                  fontSize={22}
                  color="#FFFFFF"
                  sx={{ transition: 'color 1s' }}
                >
                  {pageData?.features[2]?.title}
                </Typography>
                <Typography
                  variant="p"
                  color="#FFFFFF"
                  gutterBottom
                  fontWeight={400}
                  fontSize={14}
                  sx={{ transition: 'color 1s' }}
                >
                  {pageData?.features[2]?.description}
                </Typography>
                <div>
                  {pageData?.features[2]?.badge && (
                    <Chip
                      label={t(pageData?.features[2]?.badge)}
                      color="primary"
                      sx={{
                        backgroundColor: '#ADBBFF',
                        border: 'none',
                        marginRight: '5px',
                        marginTop: '10px',
                        height: '24px',
                        '& .MuiChipLabel': {
                          fontSize: '10px',
                          color: 'primary.main',
                        },
                      }}
                    />
                  )}
                </div>
              </Paper>
            </Grid>
          </Grid>
        </div>
        <div className="mt-5">
          <Box justifyContent="center" textAlign="center">
            <Box
              sx={{
                maxWidth: '700px',
                marginLeft: isMobile ? 0 : 45,
                marginRight: isMobile ? 0 : 45,
                marginTop: '180px',
              }}
            >
              <Typography
                variant="h4"
                fontWeight={600}
                gutterBottom
                sx={{ paddingTop: '40px' }}
              >
                {pageData?.titleSection}
              </Typography>
              <Typography
                variant="p"
                fontWeight={400}
                gutterBottom
                fontSize="17px"
              >
                {pageData?.descriptionSection}
              </Typography>
              <div className="mt-3">
                <Button
                  elevation={0}
                  size="large"
                  onClick={navigateDemo}
                  endIcon={<ArrowForwardIcon />}
                  variant="text"
                  style={{ borderRadius: '12px', boxShadow: 'none' }}
                >
                  {pageData?.CTAsectionLabel}
                </Button>
              </div>
            </Box>

            <Paper
              elevation={0}
              sx={{
                padding: '25px',
                marginTop: '50px',
                minHeight: '380px',
                display: 'flex', // Add flex display
                justifyContent: 'center', // Center content horizontally
                alignItems: 'center',
              }}
            >
              {contentName === 'ai' ? (
                <div
                  style={{
                    borderRadius: '20px',
                    overflow: 'hidden',
                    width: '600px',
                    height: '380px',
                  }}
                >
                  <Lottie
                    options={lottieOptions}
                    height={isMobile ? 270 : 380}
                    width={isMobile ? 440 : 600}
                  />
                </div>
              ) : (
                <img
                  src={`/assets/website/${contentName}.gif`}
                  alt={contentName}
                  width={isMobile ? '400px' : '540px'}
                />
              )}
            </Paper>
          </Box>
        </div>
        <div className="mt-5">
          <Box justifyContent="center" textAlign="left" marginTop="120px">
            <div className="row">
              <div className="col-6">
                <Typography fontSize={28} fontWeight={600} marginLeft="40px">
                  {t('featuresTips')}{' '}
                  <span
                    style={{
                      fontSize: '28px',
                      fontWeight: 600,
                      color: '#1501F3',
                    }}
                  >
                    {t('wordsTips' + contentName)}
                  </span>
                </Typography>
              </div>
              <div className="col-6 mt-2">
                <Typography
                  variant="subtitle2"
                  fontSize={17}
                  fontWeight={400}
                  marginLeft="40px"
                >
                  {t('featuresTipsSec')}
                </Typography>
              </div>
            </div>
            <Paper
              elevation={0}
              sx={{
                padding: '25px',
                minHeight: '620px',

                borderRadius: '12px',
                width: '100%',
                display: 'flex',
              }}
            >
              <Tabs
                orientation="vertical"
                value={value}
                onChange={handleChange}
                sx={{
                  borderRight: 1,
                  marginTop: '50px',
                  borderColor: 'divider',
                  width: '50%',
                  height: '100%',
                }}
              >
                <Tab
                  sx={{
                    height: '150px',
                  }}
                  icon={<HorizontalRuleOutlined />}
                  iconPosition="bottom"
                  active={value == 0}
                  label={
                    <Box sx={{ textAlign: 'left', alignItems: 'flex-start' }}>
                      <Typography
                        fontSize={18}
                        fontWeight={value === 0 ? 700 : 600}
                        sx={{ color: value !== 0 && '#000000' }}
                      >
                        {t(contentName + 'tab0')}
                      </Typography>
                      <Typography
                        variant="caption"
                        fontSize={12}
                        sx={{
                          color: value !== 0 && '#000000',
                          textTransform: 'none',
                        }}
                        component="div"
                      >
                        {t(contentName + 'tab0Desc')}
                      </Typography>
                    </Box>
                  }
                />

                <Tab
                  active={value == 1}
                  sx={{
                    height: '150px',
                  }}
                  icon={<HorizontalRuleOutlined />}
                  iconPosition="bottom"
                  label={
                    <Box sx={{ textAlign: 'left', alignItems: 'flex-start' }}>
                      <Typography
                        sx={{ color: value !== 1 && '#000000' }}
                        fontSize={18}
                        fontWeight={value === 1 ? 700 : 600}
                      >
                        {t(contentName + 'tab1')}
                      </Typography>
                      <Typography
                        variant="caption"
                        component="div"
                        fontSize={12}
                        sx={{
                          color: value !== 1 && '#000000',
                          textTransform: 'none',
                        }}
                      >
                        {t(contentName + 'tab1Desc')}
                      </Typography>
                    </Box>
                  }
                />
                <Tab
                  active={value == 2}
                  sx={{
                    height: '150px',
                  }}
                  icon={<HorizontalRuleOutlined />}
                  iconPosition="bottom"
                  label={
                    <Box sx={{ textAlign: 'left', alignItems: 'flex-start' }}>
                      <Typography
                        sx={{ color: value !== 2 && '#000000' }}
                        fontSize={18}
                        fontWeight={value === 2 ? 700 : 600}
                      >
                        {t(contentName + 'tab2')}
                      </Typography>
                      <Typography
                        variant="caption"
                        component="div"
                        fontSize={12}
                        sx={{
                          color: value !== 2 && '#000000',
                          textTransform: 'none',
                        }}
                      >
                        {t(contentName + 'tab2Desc')}
                      </Typography>
                    </Box>
                  }
                />
              </Tabs>
              <Divider orientation="vertical" flexItem />
              <Box sx={{ width: '50%' }}>
                <TabPanel value={value} index={value}>
                  <div className="mt-3 p-3 mx-5">
                    <img
                      src={`/assets/website/platform/${contentName}-tabs${value}.png`}
                      width="250px"
                      alt={contentName}
                      className="mt-5 mx-3"
                    />
                    <Typography
                      component="div"
                      fontSize={12}
                      sx={{
                        textTransform: 'none',
                        marginTop: '20px',
                        width: '330px',
                      }}
                    >
                      {t(contentName + value + 'content')}
                    </Typography>
                  </div>
                </TabPanel>
              </Box>
            </Paper>
          </Box>
        </div>
        <BannerLeft
          title={t('handsFreeMobile')}
          subText={t('handsFreeMobileText')}
          mainImg="/assets/website/img/workshopgarage-node.png"
          alignement="right"
          tile1={'Search-bar-ID'}
          faqType="mobile"
          mainImgSub="/assets/website/img/payment-node.png"
        />
        <BothActions
          title1={t('discussAboutBusiness')}
          title2={t('discoverModules')}
          subText1={t('discussAboutBusinessText')}
          subText2={t('discoverModulesText')}
          titleComponent={t('alwaysHereToHelp')}
          icon1={
            <MarkChatReadOutlinedIcon htmlColor="#FFFFFF" fontSize="large" />
          }
        />
      </Container>
    </WebsiteLayout>
  );
};

export default TipsContent;
