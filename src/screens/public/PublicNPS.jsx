import React, { useState, useEffect } from 'react';
import PublicLayout from '../../layouts/PublicLayout';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';
import {
  AppBar,
  Divider,
  TextField,
  Button as MuiButton,
  Typography,
  Box,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@mui/material';
import nodeAxiosFirebase from '../../utils/nodeAxiosFirebase';

const PublicNPS = () => {
  const { t, i18n } = useTranslation();
  const language = i18n.language;
  const { search } = useLocation();
  const { elementId, elementType } = useParams();
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [data, setData] = useState({});
  const [value, setValue] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [sent, setSent] = useState(false);

  const accessCode = new URLSearchParams(search).get('accessCode');
  const accessToken = new URLSearchParams(search).get('accessToken');

  const updateLanguageToEnglish = () => i18n.changeLanguage('en');
  const updateLanguageToFrench = () => i18n.changeLanguage('fr');

  const getNPSDetails = async () => {
    setIsLoading(true);
    try {
      const details = await nodeAxiosFirebase({
        t,
        method: 'POST',
        url: `public/nps`,
        noAuth: true,
        body: {
          type: 'initiate',
          elementId: elementId,
          elementType: elementType,
          lang: language,
          accessCode: accessCode || accessToken,
        },
        reduxDispatcher: dispatch,
        loadingMessage: `${t('gettingNPS')}`,
      });
      setData(details);
      setIsLoading(false);
    } catch (error) {
      setError(true);
      setIsLoading(false);
    }
  };

  const sendNPS = async () => {
    setIsLoading(true);
    try {
      await nodeAxiosFirebase({
        t,
        method: 'POST',
        url: `public/nps`,
        noAuth: true,
        body: {
          type: 'submit',
          elementId: elementId,
          elementType: elementType,
          accessCode: accessCode || accessToken,
          value: value,
          feedback: feedback,
        },
        reduxDispatcher: dispatch,
        loadingMessage: `${t('sendingNPS')}`,
      });
      setIsLoading(false);
      setSent(true);
    } catch (error) {
      setError(true);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getNPSDetails();
  }, [elementId, language]);

  return (
    <PublicLayout>
      <AppBar
        sx={{ backgroundColor: '#FFF', height: '60px' }}
        position="static"
        elevation={0}
      >
        <Box display="flex" justifyContent="flex-end" p={2}>
          {language === 'fr' ? (
            <MuiButton onClick={updateLanguageToEnglish}>
              {t('english')}
            </MuiButton>
          ) : (
            <MuiButton onClick={updateLanguageToFrench}>
              {t('french')}
            </MuiButton>
          )}
        </Box>
      </AppBar>
      <Divider />
      <Box justifyContent="center" mt={4} mb={2}>
        <div style={{ marginBottom: '10px' }}>
          <img
            style={{ width: '30px', height: '30px' }}
            src={`https://storage.googleapis.com/node-business-logos/${data?.businessId}.png`}
          />
          <Typography variant="h6" align="center" fontWeight={600}>
            {data?.businessName}
          </Typography>
          <div className="mt-5">
            <Typography variant="h6" align="center">
              {data?.documentName}
            </Typography>
            <Typography variant="h6" fontSize={'13px'} align="center">
              {data?.targetName || ''}
            </Typography>
          </div>
        </div>
        <div>
          <Typography variant="h5" fontSize={'17px'} align="center">
            {data?.question
              ? data?.question
              : t('npsQuestionFirst') +
                ' ' +
                data?.targetName +
                ' ' +
                t('npsQuestionSec')}
          </Typography>
        </div>
      </Box>
      <Box display="flex" justifyContent="center">
        <RadioGroup
          row
          value={value}
          onChange={(e) => setValue(parseInt(e.target.value))}
        >
          {[...Array(11).keys()].map((number) => (
            <FormControlLabel
              key={number}
              value={number}
              control={<Radio />}
              label={number}
              labelPlacement="top"
            />
          ))}
        </RadioGroup>
      </Box>
      <Box display="flex" justifyContent="center" mt={2}>
        <TextField
          label={data?.comment || t('comments')}
          multiline
          rows={4}
          variant="outlined"
          fullWidth
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          sx={{ maxWidth: '600px', borderRadius: '10px' }}
        />
      </Box>
      <Box display="flex" justifyContent="center" mt={4}>
        <MuiButton
          variant="contained"
          color="primary"
          onClick={sendNPS}
          disabled={sent || isLoading}
        >
          {sent ? t('thankYou') : t('submit')}
        </MuiButton>
      </Box>
    </PublicLayout>
  );
};

export default PublicNPS;
