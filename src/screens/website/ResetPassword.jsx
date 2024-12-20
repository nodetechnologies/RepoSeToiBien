import React, { useState, useEffect } from 'react';
import { verifyPasswordResetCode, confirmPasswordReset } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../firebase';
import { TextField, Button, Container, Typography, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import nodeAxiosFirebase from '../../utils/nodeAxiosFirebase';

const ResetPassword = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [message, setMessage] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    const passwordCriteria =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (password && !passwordCriteria.test(password)) {
      setPasswordError(t('passwordMsg'));
    } else {
      setPasswordError('');
    }
  }, [password]);

  useEffect(() => {
    // Parse the URL query parameters
    const urlParams = new URLSearchParams(window.location.search);
    const oobCode = urlParams.get('oobCode');
    const apiKey = urlParams.get('apiKey');

    // Save the code to state
    setCode(oobCode);
    setApiKey(apiKey);
  }, []);

  const handleSubmit = async () => {
    if (!code) {
      setMessage('Invalid or expired code');
      return;
    }
    try {
      await verifyPasswordResetCode(auth, code);
      await confirmPasswordReset(auth, code, password);
      navigate('/signin');
    } catch (error) {
      console.error(error);
      setMessage('Failed to reset password: ' + error.message);
    }
  };

  const handleStartReset = async () => {
    // Validate email or add additional logic as needed
    if (!email) {
      setMessage(t('provideEmailMsg'));
      return;
    }
    try {
      const response = await nodeAxiosFirebase({
        t,
        method: 'POST',
        url: 'verifyEmail',
        noAuth: true,
        body: {
          email: email,
          name: '',
        },
      });

      setMessage(t('emailSentMsg'));
    } catch (error) {
      console.error(error);
      setMessage(t('resetFailedMsg'));
    }
  };

  return (
    <Container>
      <div className="align-c row mt-5 mb-5">
        <div className="mt-2">
          <img
            src={`https://storage.googleapis.com/node-business-logos/${'nodeBos'}.png`}
            height="55px"
            width="55px"
          />
        </div>
        <Typography marginTop="20px" variant="h5" fontSize="22px" gutterBottom>
          {t('resetPassword')}
        </Typography>

        {!code ? (
          <>
            {!message ? (
              <>
                <TextField
                  label={t('email')}
                  variant="outlined"
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  fullWidth
                  margin="normal"
                />
                <Button
                  sx={{ marginTop: '30px' }}
                  onClick={handleStartReset}
                  variant="contained"
                  disableElevation
                  color="primary"
                >
                  {t('startReset')}
                </Button>
              </>
            ) : (
              <div>
                <Typography
                  marginTop="10px"
                  variant="p"
                  fontSize="14px"
                  gutterBottom
                >
                  {message}
                </Typography>
              </div>
            )}
          </>
        ) : (
          <Box
            sx={{
              alignContent: 'center',
              alignItems: 'center',
              maxWidth: '350px',
              marginTop: '50px',
              marginBottom: '110px',
            }}
            component="form"
            marginBottom="100px"
          >
            <Typography
              marginTop="10px"
              variant="p"
              fontSize="14px"
              gutterBottom
            >
              {t('resetPasswordDesc')}
            </Typography>
            <>
              <Typography
                marginTop="10px"
                variant="p"
                fontSize="14px"
                gutterBottom
              >
                {message}
              </Typography>
              <TextField
                label={t('newPassword')}
                variant="outlined"
                type="password"
                error={!!passwordError}
                helperText={passwordError}
                name="newPassword"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
                margin="normal"
              />
              <Button
                sx={{ marginTop: '30px' }}
                onClick={handleSubmit}
                variant="contained"
                disabled={!!passwordError}
                disableElevation
                color="primary"
              >
                {t('reset')}
              </Button>
            </>
          </Box>
        )}
      </div>
    </Container>
  );
};

export default ResetPassword;
