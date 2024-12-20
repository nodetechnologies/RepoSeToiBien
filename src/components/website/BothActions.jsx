import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import {
  Button,
  Typography,
  Container,
  Grid,
  Box,
  TextField,
  IconButton,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useTranslation } from 'react-i18next';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { ArrowForward, Send } from '@mui/icons-material';
import axios from 'axios';

const BothActions = ({
  title1,
  title2,
  subText1,
  subText2,
  icon1,
  icon2,
  lang,
  titleComponent,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleSendEmail = async () => {
    try {
      await axios.post(
        'https://hook.us1.make.com/sf0a3hr47plt62877k13999geesiq63z',
        { email }
      );
      setIsSubmitted(true);
      setEmail('');
    } catch (error) {
      setIsSubmitted(false);
    }
  };

  return (
    <Container
      sx={{ marginTop: '120px', marginBottom: '120px', minHeight: '250px' }}
    >
      {' '}
      <Typography
        variant="h3"
        gutterBottom
        sx={{ marginTop: '15px' }}
        color="black"
        fontWeight={600}
        lang={lang}
        fontSize={isMobile ? 30 : 36}
      >
        {titleComponent}
      </Typography>
      <Typography
        variant="h6"
        gutterBottom
        lang={lang}
        fontWeight={400}
        fontSize={14}
      >
        {t('bothActionsMsg')}
      </Typography>
      <Box textAlign="center" sx={{ marginTop: '20px', marginBottom: '70px' }}>
        {isSubmitted ? (
          <Typography
            variant="p"
            gutterBottom
            sx={{ marginTop: '25px' }}
            color="black"
            lang={lang}
            fontWeight={500}
            fontSize={18}
          >
            {t('yourEmailAdded')}
          </Typography>
        ) : (
          <TextField
            label={t('stayTurned')}
            placeholder={t('enterEmail')}
            variant="outlined"
            size="small"
            lang={lang}
            value={email}
            onChange={handleEmailChange}
            sx={{ width: '60%', maxWidth: '480px', minWidth: '290px' }}
          />
        )}
        <IconButton
          color={isSubmitted ? 'success' : 'primary'}
          onClick={handleSendEmail}
          sx={{ marginLeft: '10px', marginTop: isSubmitted ? '-5px' : '0px' }}
        >
          {isSubmitted ? <CheckCircleIcon /> : <Send />}
        </IconButton>
      </Box>
      <div style={{ position: 'relative' }} className="d-flex">
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Box
              textAlign="left"
              marginTop="20px"
              sx={{
                backgroundColor: '#001752',
                borderRadius: '10px 10px 0px 10px',
                minHeight: '280px',
                paddingTop: '30px',
                paddingBottom: '30px',
                paddingLeft: '30px',
                paddingRight: '120px',
              }}
            >
              {icon1}
              <Typography
                variant="h4"
                gutterBottom
                sx={{ marginTop: '15px' }}
                color="#3d2bff"
                fontWeight={600}
                lang={lang}
                fontSize={28}
              >
                {title1}
              </Typography>
              <div>
                <Typography
                  variant="body1"
                  gutterBottom
                  lang={lang}
                  sx={{ marginTop: '15px' }}
                  color="#FFFFFF"
                  fontWeight={400}
                  fontSize={14}
                >
                  {subText1}
                </Typography>
              </div>
              <Button
                elevation={0}
                size="large"
                disableFocusRipple
                disableRipple
                disableTouchRipple
                sx={{ marginTop: '15px', color: '#FFFFFF !important' }}
                endIcon={<ArrowForward />}
                onClick={() => {
                  navigate('/contact');
                }}
                variant="text"
              >
                {t('contactUs')}
              </Button>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box
              textAlign="left"
              marginTop="50px"
              sx={{
                backgroundColor: '#001752',
                borderRadius: '10px 10px 0px 10px',
                minHeight: '250px',
                paddingTop: '30px',
                paddingBottom: '30px',
                paddingLeft: '30px',
                paddingRight: '120px',
              }}
            >
              <Typography
                variant="h4"
                gutterBottom
                sx={{ marginTop: '15px' }}
                color="#3d2bff"
                lang={lang}
                fontWeight={600}
                fontSize={28}
              >
                {title2}
              </Typography>
              <div>
                <Typography
                  variant="body1"
                  gutterBottom
                  lang={lang}
                  sx={{ marginTop: '15px' }}
                  color="#FFFFFF"
                  fontWeight={400}
                  fontSize={14}
                >
                  {subText2}
                </Typography>
              </div>
              <Button
                elevation={0}
                size="large"
                disableFocusRipple
                disableRipple
                disableTouchRipple
                sx={{ marginTop: '15px', color: '#FFFFFF !important' }}
                endIcon={<ArrowForward />}
                onClick={() => {
                  navigate('/modules');
                }}
                variant="text"
              >
                {t('modules')}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </div>
    </Container>
  );
};

export default BothActions;
