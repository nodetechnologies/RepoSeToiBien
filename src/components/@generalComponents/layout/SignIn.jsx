import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, signIn } from '../../../firebase';

// Redux
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material/styles';
import { Dialog, DialogActions, DialogContent } from '@mui/material';

//styles
import GeneralText from '../../../stories/general-components/GeneralText';
import TextField from '../../../stories/general-components/TextField';
import Button from '../../../stories/general-components/Button';

const SignIn = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [passwordView, setPasswordView] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const businessId = localStorage.getItem('businessId');

  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  const signInUser = async (email, password) => {
    try {
      await signIn(auth, email, password);
      localStorage.removeItem('businessId');
      sessionStorage.removeItem('businessToken');
      navigate('/select-business');
    } catch (error) {
      console.error('Error signing in: ', error?.code);
      setErrorMessage(error?.code);
    }
  };

  const businessUserLogin = async () => {
    try {
      signInUser(email, password);
    } catch (error) {}
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleReset = () => {
    localStorage.removeItem('businessId');
    window.location.reload();
  };

  return (
    <div>
      <div>
        <Dialog
          open={isOpen}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent>{t('businessChanged')}</DialogContent>
          <DialogActions>
            <Button label={t('reset')} onClick={handleReset} color="primary" />

            <Button
              label={t('cancel')}
              onClick={handleClose}
              color="primary"
              autoFocus
            />
          </DialogActions>
        </Dialog>
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '50%',
            width: '55px',
            height: '55px',
            padding: '7.5px',
            cursor: 'pointer',
          }}
          onClick={() => setIsOpen(true)}
        >
          <img
            src={`https://storage.googleapis.com/node-business-logos/${
              businessId || 'nodeBos'
            }.png`}
            height="40px"
            width="40px"
            style={{ borderRadius: '50%' }}
          />
        </div>

        <div className="mt-3">
          <TextField
            autoComplete="username"
            id="email"
            name="email"
            fullWidth
            label={t('email')}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <TextField
            autoComplete="current-password"
            id="password"
            name="password"
            fullWidth
            iconEndButton2="Visibility"
            iconEndButton1="VisibilityOff"
            endIconAction={() => setPasswordView(!passwordView)}
            endIconButton={passwordView}
            type={passwordView === true ? 'text' : 'password'}
            label={t('password')}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {errorMessage && (
          <div className="row align-c">
            <GeneralText
              text={errorMessage}
              fontSize="12px"
              size="regular"
              primary={true}
              classNameComponent="alertText"
            />
          </div>
        )}
        <div className="remember d-flex justify-content-between align-items-center align-items-sm-center flex-column mb-3 flex-sm-row mb-sm-0 mb-4">
          <div className="mt-2">
            <Button
              label={t('login')}
              onClick={businessUserLogin}
              endIcon={'LockOutlined'}
              variant="text"
              disableElevation
              buttonSx={{
                color: isDarkMode ? '#fff' : '#000',
              }}
            />
          </div>
        </div>
        <div className="align-right row">
          <GeneralText
            text={t('forgotPassword')}
            fontSize="11px"
            size="regular"
            color={'#696969'}
            primary={false}
            onClick={() => navigate('/forgot-password')}
          />
        </div>
      </div>
    </div>
  );
};

export default SignIn;
