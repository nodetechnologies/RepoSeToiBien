import React from 'react';
import {
  Typography,
  Container,
  Grid,
  Box,
  useTheme,
  Button,
} from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import SimpleFAQ from '../../screens/website/SimpleSAQ';

const BannerLeft = ({
  title,
  subText,
  buttonAction,
  buttonLabel,
  tile1,
  faqType,
  mainImg,
  mainImgSub,
  lang,
  alignement,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const type1 = [
    {
      question: t('howModules'),
      answer: t('howModulesAnswer'),
    },
    {
      question: t('whatTypeBusiness'),
      answer: t('whatTypeBusinessAnswer'),
    },
    {
      question: t('intergrationSoftwares'),
      answer: t('intergrationSoftwaresAnswer'),
    },
  ];

  const type2 = [
    {
      question: t('howPricing'),
      answer: t('howPricingAnswer'),
    },
    {
      question: t('mobileApp'),
      answer: t('mobileAppAnswer'),
    },
    {
      question: t('limitsNode'),
      answer: t('limitsNodeAnswer'),
    },
  ];

  return (
    <Container
      sx={{ marginTop: '120px', marginBottom: '120px', minHeight: '250px' }}
    >
      <div style={{ position: 'relative' }} className="d-flex">
        {alignement === 'left' ? (
          <Grid container spacing={2}>
            <Grid item xs={4} md={6}>
              <img
                src={`/assets/website/platform/${tile1}.gif`}
                width={isMobile ? '200px' : '345px'}
                className="float-bottom-header hide-on-mobile"
              />

              <Box my={4} textAlign="center">
                <img src={mainImg} height={isMobile ? '220px' : '450px'} />
              </Box>
            </Grid>
            <Grid item xs={8} md={6}>
              <Box textAlign="left" marginTop="42px">
                <Typography
                  variant="h3"
                  gutterBottom
                  lang={lang}
                  sx={{ marginTop: '15px' }}
                  fontWeight={600}
                  fontSize={isMobile ? 26 : 32}
                >
                  {title}
                </Typography>
                <div className="mb-3">
                  <Typography
                    variant="h4"
                    gutterBottom
                    lang={lang}
                    sx={{ marginTop: '15px' }}
                    fontWeight={400}
                    fontSize={isMobile ? 16 : 18}
                  >
                    {subText}
                  </Typography>
                </div>
                <div className="mb-4">
                  {/* <SimpleFAQ
                    questions={faqType === 'general' ? type1 : type2}
                  /> */}
                </div>
              </Box>
            </Grid>
          </Grid>
        ) : (
          <Grid container spacing={2}>
            <Grid item xs={8} md={6}>
              <Box textAlign="left" marginTop="72px">
                <Typography
                  variant="h3"
                  gutterBottom
                  lang={lang}
                  sx={{ marginTop: '15px' }}
                  fontWeight={600}
                  fontSize={isMobile ? 26 : 32}
                >
                  {title}
                </Typography>
                <div className="mb-3">
                  <Typography
                    variant="h5"
                    gutterBottom
                    sx={{ marginTop: '15px' }}
                    fontWeight={400}
                    fontSize={isMobile ? 16 : 18}
                  >
                    {subText}
                  </Typography>
                </div>
                <div className="mb-4">
                  {/* <SimpleFAQ
                    questions={faqType === 'general' ? type1 : type2}
                  /> */}
                </div>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <div className=" float-animation  mt-5">
                <img
                  src={`/assets/website/platform/${tile1}.gif`}
                  width="345px"
                  className="mt-5"
                />
              </div>

              <Box my={4} textAlign="center">
                <img
                  src={mainImgSub}
                  height="165px"
                  className="float-bottom-header-2"
                />
                <img src={mainImg} height="450px" />
              </Box>
            </Grid>
          </Grid>
        )}
      </div>
    </Container>
  );
};

export default BannerLeft;
