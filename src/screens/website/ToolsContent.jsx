import { useNavigate } from 'react-router';
import { useParams } from 'react-router-dom';
import WebsiteLayout from '../../layouts/WebsiteLayout';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { Typography, Container, Grid, Box } from '@mui/material';
import { contentFr, seoContent } from './contentFr.js';
import { contentEn } from './contentEn.js';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';

const ToolsContent = () => {
  const { contentName } = useParams();
  const lang = localStorage.getItem('i18nextLng');
  const theme = useTheme();

  const pageData =
    lang === 'fr' ? contentFr[contentName] : contentEn[contentName];
  const seoData = seoContent[contentName];

  return (
    <WebsiteLayout>
      <Helmet>
        <title>{seoData?.title} - Node</title>
        <meta name="description" content={seoData?.description} />
        <meta name="keywords" content={seoData?.tags} />
      </Helmet>
      <Container>
        <div style={{ position: 'relative' }} className="d-flex mt-5 mb-5">
          <Grid container spacing={2}>
            <Grid item xs={12} md={3}>
              <Box
                sx={{ marginTop: '65px', paddingRight: '50px' }}
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
              </Box>
            </Grid>
            <Grid my={5} item xs={12} md={9}>
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
          </Grid>
        </div>
        <div>
          <Box
            mt={3}
            sx={{
              marginTop: '100px',
              marginBottom: '80px',
              marginLeft: '15%',
              marginRight: '15%',
            }}
            alignItems="center"
          >
            <Typography
              variant="h4"
              gutterBottom
              fontWeight={400}
              textAlign="center"
              align="center"
              fontSize={24}
              sx={{ transition: 'color 1s' }}
            >
              {pageData?.middleText}
            </Typography>
          </Box>
        </div>
        <div>
          <Box sx={{ marginTop: '55px' }}>
            <div className="row mb-5">
              {pageData?.features?.map((item, index) => (
                <div className="col-6 px-5 mt-5" key={index}>
                  <img
                    src={`/assets/website/platform/${
                      index + contentName
                    }-tools.png`}
                    height="120px"
                    alt={item?.title}
                    className="mt-5"
                  />
                  <div>
                    <Typography
                      variant="h6"
                      gutterBottom
                      fontWeight={500}
                      fontSize={16}
                      sx={{ transition: 'color 1s', marginTop: '20px' }}
                    >
                      {item?.title}
                    </Typography>
                  </div>
                  <div>
                    <Typography
                      variant="h6"
                      gutterBottom
                      fontWeight={400}
                      fontSize={12}
                      sx={{ marginTop: '4px' }}
                    >
                      {item?.description}
                    </Typography>
                  </div>
                </div>
              ))}
            </div>
          </Box>
        </div>
      </Container>
    </WebsiteLayout>
  );
};

export default ToolsContent;
