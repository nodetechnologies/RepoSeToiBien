import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../firebase';
import CircularProgress from '@material-ui/core/CircularProgress';

// Redux
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import TextField from '../../stories/general-components/TextField';
import { fetchBusinessData } from '../../redux/actions-v2/coreAction';
import { onAuthStateChanged } from 'firebase/auth';
import axios from 'axios';
//styles
import AuthLayout from '../../layouts/AuthLayout';
import {
  IconButton,
  Typography,
  Divider,
  Popover,
  Tooltip,
  Badge,
} from '@mui/material';
import {
  ArrowForwardOutlined,
  CheckCircle,
  ArrowDropDownOutlined,
} from '@mui/icons-material';
import GeneralText from '../../stories/general-components/GeneralText';

const SelectBusiness = () => {
  const { t, i18n } = useTranslation();
  const currentLangCode = i18n.language;
  const dispatch = useDispatch();
  const [businesses, setBusinesses] = useState([]);
  const [businessesUnique, setBusinessesUnique] = useState([]);
  const businessId = localStorage.getItem('businessId');
  const [businessLoaded, setBusinessLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [businessCode, setBusinessCode] = useState('');
  const navigate = useNavigate();

  const businessPreference = useSelector((state) => state.core.businessData);

  useEffect(() => {
    if (!businessCode) {
      const fetchBusinesses = async (idToken) => {
        const response = await axios({
          method: 'POST',
          url: 'https://northamerica-northeast1-node-canada.cloudfunctions.net/users/validate',
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST,OPTIONS',
            Authorization: `Bearer ${idToken}`,
          },
        });
        setBusinessLoaded(true);
        setBusinesses(response?.data?.access);

        if (businessId) {
          const selectedBusiness = response.data.access.find(
            (business) => business?.businessId === businessId
          );

          if (selectedBusiness && !businessCode) {
            handleBusinessSelect(selectedBusiness);
          }
        }
      };

      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          let idToken = await user.getIdToken();
          await fetchBusinesses(idToken);
        }
      });

      return () => unsubscribe();
    }
  }, [businessId, dispatch, navigate, t]);

  const fetchBusinessToken = async () => {
    try {
      const idToken = await auth.currentUser.getIdToken();
      setLoading(true);
      const response = await axios({
        method: 'POST',
        url: 'https://northamerica-northeast1-node-canada.cloudfunctions.net/users/validate',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST,OPTIONS',
          Authorization: `Bearer ${idToken}`,
        },
        data: {
          code: businessCode,
        },
      });
      if (response?.data?.access) {
        setBusinessesUnique([response?.data?.access]);
        handleBusinessSelect(response?.data?.access);
      }
    } catch (error) {
      setError(true);
      setLoading(false);
    }
  };

  const handleBusinessSelect = (business) => {
    if (business?.isLocked) {
      return;
    }

    setLoading(true);
    if (businessCode) {
      setBusinessesUnique([business]);
    }
    localStorage.setItem('businessId', business.businessId);
    sessionStorage.setItem('businessToken', business.token);
    sessionStorage.setItem(
      'businesses',
      JSON.stringify(businessCode ? businessesUnique : businesses)
    );

    dispatch(fetchBusinessData(business?.businessId, t))
      .then(() => {
        setTimeout(() => {
          setLoading(false);
        }, 1500);
      })
      .catch((error) => {
        setError(true);
        setLoading(false);
      });
  };

  const handleNavigate = () => {
    navigate('/app/dashboard');
  };

  useEffect(() => {
    if (businessesUnique?.length > 0) {
      sessionStorage.setItem('businesses', JSON.stringify(businessesUnique));
    }
  });

  return (
    <AuthLayout>
      <div>
        {businesses?.length > 0 && !businessId ? (
          <div className="align-c">
            <div className="d-flex align-c middle-content mb-2">
              <Typography fontWeight={500} variant="h6">
                {t('selectBusiness')}
              </Typography>
              <ArrowDropDownOutlined />
            </div>
            <Divider component="div" />

            <div className="row">
              {!businessCode &&
                businesses?.map((business, idx) => (
                  <div
                    className="col-4 hover p-2"
                    key={idx}
                    onClick={() => handleBusinessSelect(business)}
                  >
                    <Tooltip
                      title={
                        business?.isLocked
                          ? business?.name + ' (' + t('noActivePlan') + ')'
                          : business?.name
                      }
                      placement="right"
                    >
                      <Badge
                        badgeContent={business?.isTrial ? t('trial') : null}
                        color="primary"
                      >
                        <img
                          src={`https://storage.googleapis.com/node-business-logos/${business?.businessId}.png`}
                          height={'45px'}
                          width={'45px'}
                          style={{
                            borderRadius: '50%',
                            filter: business?.isLocked
                              ? 'grayscale(100%)'
                              : 'none',
                          }}
                          className="hover mt-2"
                        />
                      </Badge>
                    </Tooltip>
                  </div>
                ))}
              <div
                style={{ marginLeft: '5px' }}
                className="align-c col-12 mt-3"
              >
                <TextField
                  id="businessCode"
                  name="businessCode"
                  handleKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      fetchBusinessToken();
                    }
                  }}
                  fullWidth
                  type={'codeAccess'}
                  help={error && 'No access found'}
                  error={error}
                  label={t('businessCodeAccess')}
                  onChange={(e) => setBusinessCode(e.target.value)}
                />
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div>
              {businessLoaded && businesses?.length === 0 && (
                <div className="row align-c">
                  <GeneralText
                    size="bold"
                    primary={false}
                    color={'black'}
                    fontSize="11px"
                    text={t('noBusiness') + '.'}
                  />
                  <GeneralText
                    size="regular"
                    primary={false}
                    color={'black'}
                    fontSize="11px"
                    text={t('backLogin')}
                    onClick={() => navigate('/signin')}
                  />
                  <img
                    src="./assets/v3/img/nobusinessesLogin.gif"
                    width="100%"
                    alt="placeholder"
                  />
                </div>
              )}
              {loading && (
                <div className="mt-5 align-c">
                  <CircularProgress
                    size={'40px'}
                    variant="indeterminate"
                    style={{ marginTop: '20px', marginBottom: '20px' }}
                  />
                  <div>{t('loading')}</div>
                </div>
              )}
              {!loading && businessId && (
                <div className="mt-5 align-c middle-content">
                  <CheckCircle
                    color="primary"
                    fontSize="large"
                    style={{ marginTop: '20px', marginBottom: '20px' }}
                  />{' '}
                  <div className="middle-content">
                    <GeneralText
                      text={t('readyToGo')}
                      primary={true}
                      fontSize="14px"
                      size="regular"
                    />
                  </div>
                  <div className="middle-content mt-1">
                    <GeneralText
                      text={businessPreference?.name}
                      primary={true}
                      fontSize="16px"
                      size="bold"
                    />
                  </div>
                  <div className="mt-1 hover">
                    <IconButton
                      onClick={handleNavigate}
                      size="large"
                      color="primary"
                    >
                      {' '}
                      <ArrowForwardOutlined
                        fontSize="large"
                        htmlColor="#000000"
                      />
                    </IconButton>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </AuthLayout>
  );
};

export default SelectBusiness;
