import { useNavigate } from 'react-router-dom';
import {
  Typography,
  Card,
  CardContent,
  CardHeader,
  Container,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import SiteLayout from '../SiteLayout';
import { useSelector } from 'react-redux';
import Typo from '../components/Typo';
import { useTheme } from '@mui/material/styles';
import colorGenerator from '../../utils/colorGenerator';
import PriceSimulator from '../components/PriceSimulator';
import Btn from '../components/Btn';

const Pricing = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const currentLangCode = i18n.language;
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const mainColor = theme.palette.primary.main || '#1604DD';

  const websiteData = useSelector((state) => state.website.data);
  const darkMainColor = colorGenerator(mainColor, 2, 0.9, 0, false);

  const tiers = [
    {
      title: 'Node Flash™',
      subheader: t('startWithNode'),
      freq: '/mo',
      price: '79,95$',
      description: [
        t('yourBusinessNodePage'),
        t('creditCardRates'),
        t('createInvoicesQuotes'),
        t('accessGeneralModules'),
      ],
      buttonText: t('getStartedNow'),
      buttonVariant: 'contained',
    },
    {
      title: 'Node Rise™',
      subheader: t('allInclusiveNode'),
      freq: '/mo',
      price: '199,95$',
      description: [
        t('everythingStarter'),
        t('upTo3Modules'),
        t('accessNodeAI'),
        t('creationLimit'),
        t('onlineRegistrationBooking'),
        t('crossDataSummary'),
      ],
      buttonText: t('getStartedNow'),
      buttonVariant: 'contained',
    },
    {
      title: 'Node Entreprise™',
      freq: ' ',
      price: t('contactUs'),
      subheader: t('limitlessFlexibility'),
      description: [
        t('allNoLimit'),
        t('pricingUsage'),
        t('noLimitUsage'),
        t('noLimitUsers'),
        t('automationsEmails'),
      ],
      buttonText: t('getStartedNow'),
      buttonVariant: 'contained',
    },
  ];

  return (
    <SiteLayout
      helmetData={{
        name: t('pricing'),
        description: t('pricingDesc'),
      }}
    >
      <div className="block-separator row">
        <div className="mt-5 col-md-6 col-12">
          <Typo
            variant="h1"
            text={websiteData?.pricing?.headerTitle || t('headerTitle')}
          />
          <Typo
            variant="p"
            text={
              websiteData?.pricing?.headerSubTextTitle ||
              t('headerSubTextTitle')
            }
            className="mt-5"
          />
          <Typo
            variant="p"
            className="mt-3"
            text={
              websiteData?.pricing?.headerSubTextTitle2 ||
              t('headerSubTextTitle2')
            }
          />
          <div className="mt-5">
            <Btn
              text={websiteData?.pricing?.headerBtnTitle || t('headerBtnTitle')}
              onClick={() => navigate('/onboard')}
            />
          </div>
        </div>
        <div className="col-md-6 col-12 align-c">
          <img
            src="./assets/website/img/pricing-wallet.png"
            alt="pricing"
            width="100%"
          />
        </div>
      </div>
      <div className="align-c block-separator px-4">
        <Typo
          variant="h2"
          className="mt-5 px-5"
          text={websiteData?.pricing?.headerSec2Title || t('headerSec2Title')}
        />
        <Typo
          className="mt-3"
          variant="smallTitle"
          text={
            websiteData?.pricing?.headerSec2SubTitle || t('headerSec2SubTitle')
          }
        />
      </div>
      <Grid container spacing={5} alignItems="flex-end" sx={{ mt: 3 }}>
        {tiers.map((tier) => (
          <Grid item key={tier.title} xs={12} sm={12} md={4}>
            <Card elevation={0} sx={{ borderRadius: '10px' }}>
              <CardHeader
                title={<Typo variant="h4" text={tier?.title} color="#FFF" />}
                subheader={
                  <Typo
                    variant="p"
                    text={tier?.subheader}
                    className="mt-2"
                    color="#FFF"
                  />
                }
                titleTypographyProps={{ align: 'center' }}
                subheaderTypographyProps={{ align: 'center' }}
                sx={{
                  backgroundColor: darkMainColor,
                }}
              />
              <CardContent>
                <div className="mt-2 align-c d-flex">
                  <Typo variant="h3" text={tier?.price} />
                  <Typo
                    variant="p-light"
                    text={tier?.freq}
                    className="mt-2 px-2"
                  />
                </div>
                <div className="mt-4 mb-5">
                  {tier.description.map((line) => (
                    <div className="mt-1">
                      <Typography variant="subtitle1" align="center" key={line}>
                        {line}
                      </Typography>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <div className="align-c block-separator">
        <Typo
          variant="h2"
          text={websiteData?.pricing?.headerSec4Title || t('headerSec4Title')}
        />
        <div>
          <PriceSimulator />
        </div>
      </div>
      <div className="align-c block-separator mb-5">
        <Typo
          variant="h3"
          className="mb-3"
          text={websiteData?.pricing?.headerSec5Title || t('headerSec5Title')}
        />
        <div className="align-left">
          <Accordion elevation={0} sx={{ backgroundColor: 'transparent' }}>
            <AccordionSummary>
              <Typo
                variant="smallTitle"
                text={websiteData?.pricing?.titleSec6 || t('titleSec6')}
              />
            </AccordionSummary>
            <AccordionDetails>
              <Typo
                variant="p"
                text={websiteData?.pricing?.textSec6 || t('textSec6')}
              />
            </AccordionDetails>
          </Accordion>
          <Accordion elevation={0} sx={{ backgroundColor: 'transparent' }}>
            <AccordionSummary>
              <Typo
                variant="smallTitle"
                text={websiteData?.pricing?.titleSec62 || t('titleSec62')}
              />
            </AccordionSummary>
            <AccordionDetails>
              <Typo
                variant="p"
                text={websiteData?.pricing?.textSec62 || t('textSec62')}
              />
            </AccordionDetails>
          </Accordion>
          <Accordion elevation={0} sx={{ backgroundColor: 'transparent' }}>
            <AccordionSummary>
              <Typo
                variant="smallTitle"
                text={websiteData?.pricing?.titleSec63 || t('titleSec63')}
              />
            </AccordionSummary>
            <AccordionDetails>
              <Typo
                variant="p"
                text={websiteData?.pricing?.textSec63 || t('textSec63')}
              />
            </AccordionDetails>
          </Accordion>
          <Accordion elevation={0} sx={{ backgroundColor: 'transparent' }}>
            <AccordionSummary>
              <Typo
                variant="smallTitle"
                text={websiteData?.pricing?.titleSec64 || t('titleSec64')}
              />
            </AccordionSummary>
            <AccordionDetails>
              <Typo
                variant="p"
                text={websiteData?.pricing?.textSec64 || t('textSec64')}
              />
            </AccordionDetails>
          </Accordion>
          <Accordion elevation={0} sx={{ backgroundColor: 'transparent' }}>
            <AccordionSummary>
              <Typo
                variant="smallTitle"
                text={websiteData?.pricing?.titleSec65 || t('titleSec65')}
              />
            </AccordionSummary>
            <AccordionDetails>
              <Typo
                variant="p"
                text={websiteData?.pricing?.textSec65 || t('textSec65')}
              />
            </AccordionDetails>
          </Accordion>
        </div>
      </div>
    </SiteLayout>
  );
};

export default Pricing;
