import { useNavigate } from 'react-router';
import { useParams } from 'react-router-dom';
import WebsiteLayout from '../../layouts/WebsiteLayout';
import { Button, Typography, Container, Paper, Grid, Box } from '@mui/material';
import { contentFr, seoContent } from './contentFr.js';
import { contentEn } from './contentEn.js';
import { Helmet } from 'react-helmet';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useTranslation } from 'react-i18next';
import BannerLeft from '../../components/website/BannerLeft';
import BothActions from '../../components/website/BothActions';
import MarkChatReadOutlinedIcon from '@mui/icons-material/MarkChatReadOutlined';
import ButtonCircle from '../../stories/general-components/ButtonCircle';

const PageContent = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { contentName } = useParams();
  const lang = localStorage.getItem('i18nextLng');

  const pageData =
    lang === 'fr' ? contentFr[contentName] : contentEn[contentName];
  const seoData = seoContent[contentName];

  const navigateDemo = () => {
    navigate('/contact/demo');
  };

  return (
    <WebsiteLayout>
      <Helmet>
        <title>{seoData?.title} - Node</title>
        <meta lang="fr" name="description" content={seoData?.description} />
        <meta lang="fr" name="keywords" content={seoData?.tags} />
      </Helmet>
      <Container>
        <div
          style={{ position: 'relative', marginBottom: '140px' }}
          className="d-flex mt-5"
        >
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Box
                sx={{ marginTop: '135px', paddingRight: '50px' }}
                textAlign="left"
                marginTop="30%"
              >
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
            <Grid my={5} item xs={12} md={6}>
              <Grid xs={12} md={12}>
                <img
                  src={`/assets/website/img/headers/${contentName}.jpeg`}
                  height="260px"
                  width="100%"
                  style={{
                    objectFit: 'cover',
                    borderRadius: '12px',
                    marginTop: '110px',
                    objectPosition: 'center',
                  }}
                />
              </Grid>
              <Grid container spacing={3}>
                <Grid mt={2} item xs={12} md={6}>
                  <Paper
                    elevation={0}
                    sx={{
                      backgroundColor: '#001752',
                      height: '180px',
                      borderRadius: '12px',
                      padding: '20px',
                      textAlign: 'left',
                    }}
                  >
                    <Typography
                      variant="h4"
                      gutterBottom
                      color="#FFFFFF"
                      fontWeight={600}
                      textAlign="left"
                      fontSize={38}
                    >
                      {pageData?.stats}
                    </Typography>
                    <div>
                      <Typography
                        variant="p"
                        gutterBottom
                        color="#FFFFFF"
                        fontWeight={500}
                        textAlign="left"
                        fontSize={15}
                      >
                        {pageData?.bottomStats}
                      </Typography>
                    </div>
                  </Paper>
                </Grid>
                <Grid mt={2} item xs={12} md={6}>
                  <Box textAlign="center">
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
                      <img
                        src={`/assets/website/img/testimonial/${contentName}.jpeg`}
                        height="30px"
                        style={{ borderRadius: '50%', marginLeft: '10px' }}
                        className="mb-2"
                      />
                      <Typography
                        variant="h4"
                        gutterBottom
                        fontWeight={500}
                        textAlign="left"
                        fontSize={15}
                      >
                        {pageData?.testimonial}
                      </Typography>
                      <div className="row align-right mt-2">
                        <Typography
                          variant="p"
                          gutterBottom
                          fontWeight={400}
                          textAlign="right"
                          fontSize={13}
                        >
                          -{pageData?.testimonialAuthor}
                        </Typography>
                      </div>
                    </Paper>
                  </Box>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </div>
        <div className="row mt-5">
          <div className="col-md-6 col-12">
            {' '}
            <img
              src={`/assets/website/platform/${contentName}.png`}
              height="250px"
              className="mt-4"
              style={{
                borderRadius: '12px',
                objectPosition: 'left',
                objectFit: 'cover',
                maxWidth: '500px',
              }}
            />
          </div>
          <div className="col-md-6 col-12 mt-2">
            <Typography
              variant="h3"
              gutterBottom
              sx={{ marginTop: '15px', paddingRight: '140px' }}
              fontWeight={600}
              textAlign="left"
              fontSize={24}
            >
              {pageData?.titleSection}
            </Typography>
            <div
              style={{
                backgroundColor: '#1501F3',
                width: '28px',
                height: '4px',
                marginBottom: '10px',
              }}
            ></div>
            <div>
              <Typography
                variant="h3"
                gutterBottom
                sx={{ marginTop: '25px' }}
                fontWeight={400}
                textAlign="left"
                fontSize={14}
              >
                {pageData?.descriptionSection}
              </Typography>
            </div>
            <div>
              <Typography
                variant="h3"
                gutterBottom
                sx={{ marginTop: '10px' }}
                fontWeight={400}
                textAlign="left"
                fontSize={14}
              >
                {pageData?.descriptionSecondSection}
              </Typography>
            </div>
          </div>
        </div>
        <div
          style={{ marginTop: '120px', marginBottom: '200px' }}
          className="row"
        >
          {pageData?.features.map((feature, index) => (
            <div className="col-md-3 col-6 mt-5">
              <div>
                <div>
                  <ButtonCircle
                    icon={feature?.icon}
                    primary={false}
                    size="large"
                  />
                </div>
                <Typography
                  variant="p"
                  gutterBottom
                  fontWeight={600}
                  textAlign="left"
                  fontSize={13}
                >
                  {feature?.title}
                </Typography>
                <div>
                  <Typography
                    variant="p"
                    gutterBottom
                    sx={{ paddingLeft: '18px', paddingRight: '18px' }}
                    fontWeight={400}
                    textAlign="left"
                    fontSize={11}
                  >
                    {feature?.description}
                  </Typography>
                </div>
              </div>
            </div>
          ))}
        </div>

        <BannerLeft
          title={t('fromWhatIf')}
          subText={t('fromWhatIfText')}
          tile1={'Search-bar-Porte'}
          mainImg="/assets/website/img/manufacturer-node.png"
          alignement="left"
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

export default PageContent;
