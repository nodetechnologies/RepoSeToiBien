import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Helmet } from 'react-helmet';
import WebsiteLayout from '../../layouts/WebsiteLayout';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import BusinessHeader from './components/BusinessHeader';
import BusinessContent from './components/BusinessContent';
import nodeAxiosFirebase from '../../utils/nodeAxiosFirebase';

const BusinessPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { businessId } = useParams();

  const colors = ['error', 'primary', '#BDDC11'];
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const lang = localStorage.getItem('i18nextLng');
  const [businessData, setBusinessData] = useState({});

  const fetchData = async () => {
    try {
      const formattedData = await nodeAxiosFirebase({
        t,
        method: 'POST',
        url: `businessData?businessId=${businessId}&internal=false`,
        noAuth: true,
      });
      setBusinessData(formattedData?.businessData);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (businessId) {
      fetchData();
    }
  }, [businessId]);

  return (
    <WebsiteLayout>
      <Helmet>
        <script type="application/ld+json">
          {`
           {
             "@context": "https://schema.org",
             "@type": ${businessData?.type},
             "name": "${businessData?.name}",
        "image": "${businessData?.backgroundImage}", 
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "${businessData?.address}",
          "addressLocality": "${businessData?.city}",
          "addressRegion": "${businessData?.state}",
          "postalCode": "${businessData?.postalCode}"
        },
        "telephone": "${businessData?.phone}",
             
             "aggregateRating": {
"@type": "AggregateRating",
"ratingValue": "${businessData?.rating}",
"reviewCount": "${businessData?.reviewCount}"
}}`}
        </script>
        <title>{businessData?.name + ' - ' + 'Node'}</title>
        <meta name="description" content={businessData?.description || '-'} />

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
          href={`https://storage.googleapis.com/node-business-logos/${
            businessId || 'nodetechnologies'
          }.png`}
          sizes="16x16"
        />

        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charset="UTF-8" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta
          property="og:title"
          content={businessData?.name + ' - ' + 'Node'}
        />
        <meta
          property="og:description"
          content={businessData?.name + ': ' + businessData?.description}
        />
        <meta
          name="twitter:title"
          content={businessData?.name + ' - ' + 'Node'}
        />
        <link rel="canonical" href={businessData?.website} />
        <meta property="og:url" content={businessData?.website} />
        <meta name="address" content={businessData?.address} />
        <meta name="geo.region" content={businessData?.region || 'CA-QC'} />
        <meta name="geo.placename" content={businessData?.city} />
        <meta name="telephone" content={businessData?.phone} />
        <meta name="email" content={businessData?.email} />
        <meta property="og:image" content={businessData?.backgroundImage} />
        <meta
          property="og:image:secure_url"
          content={businessData?.backgroundImage}
        />
        <meta
          property="og:image:alt"
          content={businessData?.name + ' - ' + 'Node'}
        />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:locale" content={lang} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Node" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>
      <div>
        <BusinessHeader data={businessData} isMobile={isMobile} />
        <BusinessContent data={businessData} isMobile={isMobile} />
      </div>
    </WebsiteLayout>
  );
};

export default BusinessPage;
