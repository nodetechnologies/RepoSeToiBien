import React, { useState, useEffect } from 'react';
import {
  Container,
  Button,
  TextField,
  Typography,
  Box,
  IconButton,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import nodeAxiosFirebase from '../../utils/nodeAxiosFirebase';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    fontFamily: 'Montserrat, sans-serif',
    fontWeightMedium: 600,
    allVariants: {
      fontWeight: 600,
      fontSize: '16px',
    },
  },
  components: {
    MuiInputBase: {
      styleOverrides: {
        input: {
          fontSize: '16px',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiInputLabel-root': {
            fontSize: '16px',
          },
        },
      },
    },
  },
});

const Event = () => {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(1);
  const [email, setEmail] = useState('');
  const [eventCode, setEventCode] = useState('');
  const [message, setMessage] = useState('');
  const [platform, setPlatform] = useState('web');

  // Detect user platform
  useEffect(() => {
    const userAgent =
      navigator?.userAgentData?.platform || navigator?.vendor || window?.opera;
    if (/android/i.test(userAgent)) {
      setPlatform('android');
    } else if (userAgent === 'macOS') {
      setPlatform('ios');
    } else {
      setPlatform('web');
    }
  }, []);

  // Read email from query parameters on page load
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const emailParam = params.get('email');
    if (emailParam) {
      setEmail(emailParam);
    }
  }, []);

  const handleEmailSubmit = () => {
    // Add email as a query parameter to the URL
    const emailEncoded = encodeURIComponent(email);
    const url = `https://usenode.com/welcome/akFBFU3bEVbnCRdA68eB?email=${emailEncoded}`;
    window.open(url, '_blank');
    setCurrentStep(2);
  };

  const handleAppDownload = (selectedPlatform) => {
    let appUrl = '';

    if (selectedPlatform === 'ios') {
      appUrl = 'https://apps.apple.com/ca/app/node-dots/id6479820061?l=fr-CA';
    } else if (selectedPlatform === 'android') {
      appUrl = 'https://dots.usenode.com/'; // Replace with your app's Google Play URL
    } else {
      appUrl = 'https://usenode.com'; // Default URL
    }

    window.open(appUrl, '_blank');
    setCurrentStep(3);
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleRegistration = async () => {
    try {
      const register = await nodeAxiosFirebase({
        t,
        noAuth: true,
        method: 'POST',
        url: `registerGame`,
        body: {
          userEmail: email,
          eventCode: eventCode,
        },
      });

      setMessage('play');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      {/* Main container with animated blurry circles */}
      <Box
        sx={{
          minHeight: '100vh',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 2,
          boxSizing: 'border-box',
        }}
      >
        {/* Animated Blurry Circles */}
        <div
          className="move-circle-1"
          style={{
            width: '500px',
            height: '500px',
            overflow: 'hidden',
            backgroundColor: '#ADD83640',
            borderRadius: '50%',
            filter: 'blur(120px)',
            position: 'absolute',
            zIndex: 0,
            bottom: '120px',
            left: '-310px',
          }}
        ></div>
        <div
          className="move-circle-2"
          style={{
            width: '400px',
            height: '400px',
            overflow: 'hidden',
            backgroundColor: '#E5262640',
            borderRadius: '50%',
            filter: 'blur(120px)',
            position: 'absolute',
            zIndex: 0,
            top: '200px',
            right: '-310px',
          }}
        ></div>
        <div
          className="move-circle-3"
          style={{
            width: '500px',
            height: '500px',
            overflow: 'hidden',
            backgroundColor: '#340CF540',
            borderRadius: '50%',
            filter: 'blur(120px)',
            position: 'absolute',
            zIndex: 0,
            top: '50px',
            right: '100px',
          }}
        ></div>

        {message === 'play' ? (
          <div
            style={{
              fontFamily: 'Montserrat',
              fontWeight: 600,
              fontSize: '24px',
              color: 'black',
              textAlign: 'center', // Pour centrer le texte
              padding: '10px', // Un peu d'espace autour du texte
              wordWrap: 'break-word', // Pour les mots longs
              margin: '0 auto', // Centrer le conteneur sur la page
              maxWidth: '90%', // Limite la largeur maximale pour mobile
            }}
          >
            Tout est prêt ! Vous pouvez maintenant revenir sur l'interface et
            commencer à jouer !
            <span style={{ color: 'green', fontSize: '24px' }}>✔️</span>
          </div>
        ) : (
          <Container
            maxWidth="sm"
            sx={{
              position: 'relative',
              zIndex: 1,
              width: '100%',
              boxSizing: 'border-box',
              paddingY: 5,
              height: '90vh',
              minHeight: '90vh',
              maxHeight: '90vh',
              overflowY: 'scroll',
            }}
          >
            {/* Back Button */}
            {currentStep > 1 && (
              <IconButton
                onClick={handleBack}
                aria-label="Revenir à l'étape précédente"
                sx={{ position: 'absolute', top: 16, left: 16, color: '#000' }}
              >
                <ArrowBackIcon />
              </IconButton>
            )}
            <Box sx={{ marginBottom: '50px' }}>
              <Grid
                container
                spacing={2}
                justifyContent="center"
                alignItems="center"
                direction="column"
              >
                <Grid item xs={12} sx={{ textAlign: 'center' }}>
                  {/* Insert your logo here */}
                  <img
                    src="https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/36/ba/83/36ba8387-4f06-0064-9d89-ed4d965025f8/AppIcon-0-0-1x_U007emarketing-0-7-0-85-220.png/460x0w.webp"
                    alt="Node Dots Logo"
                    style={{
                      maxWidth: '80px',
                      marginBottom: '10px',
                      borderRadius: '20px',
                    }}
                  />
                  <Typography variant="h5" gutterBottom>
                    Bienvenue sur Node Dots
                  </Typography>
                </Grid>
              </Grid>
              {/* Accordions for Steps */}
              <Accordion
                elevation={0}
                sx={{
                  backgroundColor: '#FFFFFF80',
                  borderRadius: '10px',
                  width: '100%',
                  boxSizing: 'border-box',
                  paddingX: 2,
                  marginBottom: 2,
                }}
                expanded={currentStep >= 1}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="step1-content"
                  id="step1-header"
                >
                  <Typography>Étape 1 : Entrez votre courriel</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <TextField
                    label="courriel"
                    variant="outlined"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    fullWidth
                    inputProps={{
                      style: { fontWeight: 'normal', fontSize: '16px' },
                    }}
                    sx={{ mb: 2 }}
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleEmailSubmit}
                    disabled={!email}
                    sx={{ fontWeight: 600, width: '100%' }}
                  >
                    Enregistrer mon courriel
                  </Button>
                </AccordionDetails>
              </Accordion>

              <Accordion
                expanded={currentStep >= 2}
                disabled={currentStep < 2}
                elevation={0}
                sx={{
                  backgroundColor: '#FFFFFF80',
                  borderRadius: '10px',
                  width: '100%',
                  boxSizing: 'border-box',
                  paddingX: 2,
                  marginBottom: 2,
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="step2-content"
                  id="step2-header"
                >
                  <Typography>Étape 2 : Téléchargez Node Dots</Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ textAlign: 'center', padding: 2 }}>
                  <Typography variant="body1" gutterBottom>
                    Cliquez sur l'image ci-dessous pour télécharger
                    l'application depuis le store.
                  </Typography>
                  <div className="d-flex middle-content align-c">
                    <div style={{ marginTop: '15px' }}>
                      <img
                        src="./assets/website/img/ios.png"
                        alt="Télécharger sur l'App Store"
                        style={{
                          cursor: 'pointer',
                          height: '53px',
                          maxWidth: '100%',
                        }}
                        onClick={() => handleAppDownload('ios')}
                      />
                    </div>
                    <div style={{ marginTop: '15px' }}>
                      <img
                        src="/assets/website/img/android-play.png"
                        alt="Télécharger sur Google Play"
                        style={{
                          cursor: 'pointer',
                          height: '60px',
                          maxWidth: '100%',
                          borderRadius: '10px',
                        }}
                        onClick={() => handleAppDownload('android')}
                      />
                    </div>
                  </div>
                </AccordionDetails>
              </Accordion>

              <Accordion
                expanded={currentStep >= 3}
                disabled={currentStep < 3}
                elevation={0}
                sx={{
                  backgroundColor: '#FFFFFF80',
                  borderRadius: '10px',
                  border: 'none',
                  width: '100%',
                  boxSizing: 'border-box',
                  paddingX: 2,
                  marginBottom: 2,
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="step3-content"
                  id="step3-header"
                >
                  <Typography>
                    Étape 3 : Entrez le code de l'événement
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <TextField
                    label="Code de l'événement"
                    variant="outlined"
                    value={eventCode}
                    onChange={(e) => setEventCode(e.target.value.toUpperCase())}
                    fullWidth
                    inputProps={{
                      maxLength: 8,
                      style: { fontWeight: 'normal', fontSize: '16px' },
                    }}
                    sx={{ mb: 2 }}
                  />

                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleRegistration}
                    disabled={!eventCode}
                    sx={{ fontWeight: 600, width: '100%' }}
                  >
                    Soumettre le code
                  </Button>
                </AccordionDetails>
              </Accordion>
            </Box>
          </Container>
        )}
      </Box>
    </ThemeProvider>
  );
};

export default Event;
