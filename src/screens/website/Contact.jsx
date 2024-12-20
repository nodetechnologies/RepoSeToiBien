import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Button,
  TextField,
  Container,
  Typography,
  Box,
  InputAdornment,
} from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import WebsiteLayout from '../../layouts/WebsiteLayout';
import { Email, Person, TypeSpecimenRounded } from '@mui/icons-material';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [message, setMessage] = useState('');
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // useEffect(() => {
  //   const script = document.createElement('script');

  //   script.src = 'https://usenode.com/embedStructure.js';
  //   script.async = true;

  //   script.setAttribute('businessId', 'jFpIP0UQPD6ZmEvbLatN');
  //   script.setAttribute('structureId', 'LFFYW6Q6dGWkRaCyiS14');
  //   script.setAttribute('width', '100%');
  //   script.setAttribute('height', '600px');
  //   script.setAttribute('typeForm', 'chat');
  //   script.setAttribute('Ide_string26', '759771000000553003');

  //   document.body.appendChild(script);

  //   return () => {
  //     document.body.removeChild(script);
  //   };
  // }, []);

  return (
    <WebsiteLayout>
      <Container>
        <div className="row py-5 mt-5">
          <div
            style={{
              padding: '20px',
            }}
            className="col-md-5 col-12 mt-4"
          >
            <img
              src="/assets/website/2.0/coofeeshop.jpeg"
              alt="arrow"
              style={{
                width: isMobile ? '250px' : '400px',
                borderRadius: '10px',
                zIndex: 3,
              }}
              className="mt-3"
            />
          </div>
          <div className="col-md-7 col-12 mt-4 align-left">
            <div>
              <Typography fontSize={32} fontWeight={600}>
                {t('contactUs')}
              </Typography>
            </div>
            <div>
              <Typography fontSize={14} fontWeight={500} gutterBottom>
                {t('contactUsText')}
              </Typography>
            </div>

            {message && (
              <Typography
                color="primary"
                fontWeight={600}
                marginBottom="20px"
                marginTop="40px"
              >
                {message}
              </Typography>
            )}
            <div id="embed-container-node-form"></div>
          </div>
        </div>
      </Container>
    </WebsiteLayout>
  );
};

export default Contact;
