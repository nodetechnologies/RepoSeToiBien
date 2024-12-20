import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { useParams } from 'react-router-dom';
import WebsiteLayout from '../../layouts/WebsiteLayout';
import { Button, Typography, Container, Grid, Box } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { contentFr, seoContent } from './contentFr.js';
import { contentEn } from './contentEn.js';
import { Helmet } from 'react-helmet';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import GroupsIcon from '@mui/icons-material/Groups';
import InterestsIcon from '@mui/icons-material/Interests';
import { useTranslation } from 'react-i18next';
import BannerLeft from '../../components/website/BannerLeft';
import BothActions from '../../components/website/BothActions';
import MarkChatReadOutlinedIcon from '@mui/icons-material/MarkChatReadOutlined';

const ModuleContent = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { contentName } = useParams();
  const lang = localStorage.getItem('i18nextLng');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const pageData =
    lang === 'fr' ? contentFr[contentName] : contentEn[contentName];
  const seoData = seoContent[contentName];

  const icons = [
    <AutoGraphIcon color="error" fontSize={'large'} />,
    <GroupsIcon color="primary" fontSize={'large'} marginBottom="10px" />,
    <InterestsIcon color="success" fontSize={'large'} marginBottom="15px" />,
  ];

  const currentUser = useSelector((state) => state.clientReducer.currentUser);

  const handlePlatform = () => {
    navigate('/app/dashboard');
  };

  const navigateDemo = () => {
    navigate('/contact/demo');
  };

  return (
    <WebsiteLayout>
      <Helmet>
        <title>{seoData?.title}</title>
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
                    onClick={currentUser ? handlePlatform : navigateDemo}
                    endIcon={<ArrowForwardIcon />}
                    variant="text"
                    style={{ borderRadius: '50px' }}
                  >
                    {currentUser ? t('openPortal') : t('bookADemo')}
                  </Button>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box my={4} textAlign="center">
                <img
                  src={`/assets/website/img/headers/${contentName}.jpeg`}
                  width="550px"
                />
              </Box>
            </Grid>
          </Grid>
        </div>

        <BannerLeft
          title={t('fromWhatIf')}
          subText={t('fromWhatIfText')}
          tile1={'Search-bar-Natation-scolaire'}
          mainImg="/assets/website/img/technology-node.png"
          alignement="right"
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

export default ModuleContent;
