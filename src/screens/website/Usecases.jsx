import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Helmet } from 'react-helmet';
import WebsiteLayout from '../../layouts/WebsiteLayout';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardHeader,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

const Usecases = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const lang = localStorage.getItem('i18nextLng');

  const cards = [
    {
      title: t('automotiveCase'),
      text: t('automotiveCaseText'),
      image: '/assets/website/2.0/case1.png',
    },
    {
      title: t('manufacturerCase'),
      text: t('manufacturerCaseText'),
      image: '/assets/website/2.0/case2.png',
    },
    {
      title: t('leasingCase'),
      text: t('leasingCaseText'),
      image: '/assets/website/2.0/case3.png',
    },
    {
      title: t('constructionCase'),
      text: t('constructionCaseText'),
      image: '/assets/website/2.0/case4.png',
    },
    {
      title: t('restaurantCase'),
      text: t('restaurantCaseText'),
      image: '/assets/website/2.0/case5.png',
    },
  ];

  const CardGrid = () => (
    <Grid container spacing={3}>
      {cards?.map((card, index) => (
        <Grid item xs={12} sm={12} md={6} key={index}>
          <Card elevation={0}>
            <div
              style={{
                border: '0.6px solid #000',
                height: '200px',
                borderRadius: '20px',
              }}
              className="align-c"
            >
              <img
                component="img"
                alt={card.title}
                height="90px"
                src={card.image}
              />
              <CardContent>
                <Typography fontSize="14px">{card.title}</Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  {card.text}
                </Typography>
              </CardContent>
            </div>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  return (
    <WebsiteLayout full={true}>
      <Helmet>
        <title>{t('nodeTitleSEO')}</title>
        <meta name="description" content={t('nodeDescriptionSEO')} />
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
          href={`https://storage.googleapis.com/avatars_node/nodetechnologies.png`}
          sizes="16x16"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charset="UTF-8" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:title" content={t('nodeTitleSEO')} />
        <meta property="og:description" content={t('nodeDescriptionSEO')} />
        <meta name="twitter:title" content={t('nodeTitleSEO')} />
        <link rel="canonical" href={`https://usenode.com/`} />
        <meta property="og:url" content={`https://usenode.com/`} />
      </Helmet>
      <div className="mt-5 align-c">
        <Typography fontSize={34} fontWeight={600} lineHeight={1} mt={5} py={5}>
          {t('usecasesTitle')}
        </Typography>
        <Typography fontSize={20} mb={5} fontWeight={500}>
          {t('usecasesText')}
        </Typography>
        <div style={{ maxWidth: '70%', marginLeft: '15%' }} className="mt-5">
          <CardGrid />
        </div>
      </div>
    </WebsiteLayout>
  );
};

export default Usecases;
