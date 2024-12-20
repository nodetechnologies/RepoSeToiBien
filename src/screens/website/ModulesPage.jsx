import { useNavigate } from 'react-router';
import WebsiteLayout from '../../layouts/WebsiteLayout';
import {
  Typography,
  Container,
  Paper,
  Box,
  Grid,
  Card,
  CardContent,
  Avatar,
} from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { modulesFr } from './modules';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import BannerLeft from '../../components/website/BannerLeft';

const ModuleCard = ({ module }) => {
  return (
    <Card
      sx={{
        minWidth: 275,
        marginTop: 2,
        borderRadius: '12px',
        minHeight: '140px',
        textAlign: 'left',
      }}
    >
      <CardContent>
        <Avatar src={`/path/to/logo/${module.key}.png`} />
        <Typography
          variant="h5"
          component="div"
          fontSize="13px"
          fontWeight={600}
          marginTop="10px"
        >
          {module.name}
        </Typography>
        <Typography variant="body2">{module?.shortDesc}</Typography>
        <Typography
          fontSize="11px"
          variant="caption"
          lineHeight="12px"
          marginTop="6px"
        >
          {module?.description}
        </Typography>
      </CardContent>
    </Card>
  );
};

const ModulesPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const currentLang = localStorage.getItem('i18nextLng');
  const currentType = localStorage.getItem('type');

  return (
    <WebsiteLayout>
      <Container>
        {currentType === 'business' && (
          <>
            <Box justifyContent="center" textAlign="center">
              <Box
                sx={{
                  maxWidth: '700px',
                  marginLeft: isMobile ? 0 : 45,
                  marginRight: isMobile ? 0 : 45,
                  marginTop: '100px',
                }}
              >
                <Typography
                  variant="h4"
                  fontWeight={600}
                  gutterBottom
                  sx={{ paddingTop: '40px' }}
                >
                  {t('nodeModulesHead')}
                </Typography>
                <Typography
                  variant="p"
                  fontWeight={400}
                  gutterBottom
                  fontSize="17px"
                >
                  {t('nodeModulesDesc')}
                </Typography>
              </Box>
              <Paper
                elevation={0}
                sx={{
                  padding: '25px',
                  marginTop: '10px',
                  minHeight: '380px',
                }}
              >
                <img
                  src={
                    currentLang === 'fr'
                      ? '/assets/website/platform/modules-fr.gif'
                      : '/assets/website/platform/modules-en.gif'
                  }
                  alt="overview"
                  width={isMobile ? '400px' : '740px'}
                />
              </Paper>
              <Paper
                elevation={0}
                sx={{
                  width: '100%',
                  backgroundColor: '#f9f9f995',
                  borderRadius: '12px',
                  padding: '25px',
                  marginTop: '40px',
                  minHeight: '580px',
                }}
              >
                <Typography
                  variant="h5"
                  fontWeight={600}
                  gutterBottom
                  fontSize="24px"
                  sx={{ paddingTop: '40px' }}
                >
                  {t('nodeModulesBlock')}
                </Typography>
                <Typography
                  variant="p"
                  fontWeight={400}
                  gutterBottom
                  fontSize="13px"
                >
                  {t('nodeModulesShort')}
                </Typography>
                <Grid container spacing={3} marginTop={4}>
                  {Object.keys(modulesFr).map((key) => (
                    <Grid item xs={12} sm={6} md={4} key={key}>
                      <ModuleCard module={{ key, ...modulesFr[key] }} />
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            </Box>
            <BannerLeft
              title={t('eachModulesTitle')}
              subText={t('eachModulesText')}
              tile1={'Search-bar-services'}
              mainImg="/assets/website/img/office-node.png"
              alignement="right"
              faqType="general"
              mainImgSub="/assets/website/img/shop-node.png"
            />
          </>
        )}
      </Container>
    </WebsiteLayout>
  );
};

export default ModulesPage;
