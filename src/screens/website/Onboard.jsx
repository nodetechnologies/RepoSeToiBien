import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Helmet } from 'react-helmet';
import {
  collection,
  updateDoc,
  addDoc,
  doc,
  getDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../../firebase';
import { keyframes } from '@emotion/react';
import { styled } from '@mui/system';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  ListItemText,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from '@mui/material';
import TextField from '../../stories/general-components/TextField';
import DynamicOnboardGeo from './components/DynamicOnboardGeo';
import Select from '../../stories/general-components/Select';
import axios from 'axios';
import Geo from '../../stories/general-components/Geo';
import { ArrowForward, CheckCircleOutlineOutlined } from '@mui/icons-material';
import WebsiteLayout from '../../layouts/WebsiteLayout';
import nodeAxiosFirebase from '../../utils/nodeAxiosFirebase';
import PublicLayout from '../../layouts/PublicLayout';
import SiteLayout from '../../websiteV2/SiteLayout';

const Onboard = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const theme = useTheme();
  const [loaded, setLoaded] = useState(false);
  const [nameUser, setNameUser] = useState('');
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [currentOnboardId, setCurrentOnboardId] = useState('');
  const [ipAddress, setIpAddress] = useState('');
  const [errorStep, setErrorStep] = useState(null);

  const currentLang = i18n.language;

  //get businessId from params url
  const useSearchParams = () => {
    const [searchParams, setSearchParams] = useState(
      new URLSearchParams(window.location.search)
    );

    const getParam = (name) => searchParams.get(name);

    const setParam = (name, value) => {
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set(name, value);
      setSearchParams(newSearchParams);
    };

    return [getParam, setParam];
  };

  const [getParam, setParam] = useSearchParams();

  const businessId = getParam('businessId');

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [businessData, setBusinessData] = useState({
    name: '',
  });
  const [partnerData, setPartnerData] = useState({
    name: '',
  });

  const userAgent = window.navigator.userAgent;
  const screen = window.screen.width + 'x' + window.screen.height;
  const lang = window.navigator.language;
  const network = window.navigator.connection.effectiveType;
  const os = window.navigator.platform;
  const browser = window.navigator.userAgent;

  const useStyles = makeStyles((theme) => ({
    avatar: {
      animation: '$fadeIn 1s ease-in-out',
      '&:nth-of-type(n)': {
        animationDelay: (n) => `${0.5 * n}s`,
      },
    },
    '@keyframes fadeIn': {
      '0%': {
        opacity: 0,
      },
      '100%': {
        opacity: 1,
      },
    },
  }));

  const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

  const gradientAnimationName = keyframes`
0% { background-position: 0% 50%; }
50% { background-position: 100% 50%; }
100% { background-position: 0% 50%; }
`;

  const GradientTypography = styled(Typography)(({ theme }) => ({
    background: `linear-gradient(45deg, ${
      businessData?.mainColor || '#FF4848'
    } 30%, ${businessData?.secColor || '#200EF0'} 60%)`,
    backgroundSize: '200% 200%',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    animation: `${gradientAnimation} 10s ease infinite`,
  }));

  const GradientTypographyName = styled(Typography)(({ theme }) => ({
    background: `linear-gradient(45deg, ${
      businessData?.secColor || '#200EF0'
    } 30%, ${businessData?.mainColor || '#C2EE13'} 60%)`,
    backgroundSize: '200% 200%',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    animation: `${gradientAnimationName} 10s ease infinite`,
  }));

  const classes = useStyles();

  useEffect(() => {
    setLoaded(true);
  }, []);

  const onboardId = localStorage.getItem('onboardId');

  useEffect(() => {
    if (!onboardId) {
      console.error('onboardId is undefined or empty');
      return;
    }

    async function fetchDoc() {
      const docRef = doc(db, 'onboard', onboardId);

      try {
        const res = await axios.get('https://api.ipify.org/?format=json');
        const ip = res.data.ip;

        setIpAddress(ip);
        const docSnapshot = await getDoc(docRef);

        if (docSnapshot.exists()) {
          setFormData({
            businessName: docSnapshot.data()?.businessName || '',
            firstName: docSnapshot.data()?.firstName || '',
            lastName: docSnapshot.data()?.lastName || '',
            email: docSnapshot.data()?.email || '',
            businessType: docSnapshot.data()?.businessType || '',
            mainColor: docSnapshot.data()?.mainColor || '',
            secColor: docSnapshot.data()?.secColor || '',
            address: docSnapshot.data()?.address || '',
            formula: docSnapshot.data()?.formula || '',
            city: docSnapshot.data()?.city || '',
            state: docSnapshot.data()?.state || '',
            zip: docSnapshot.data()?.zip || '',
            phone: docSnapshot.data()?.phone || '',
            website: docSnapshot.data()?.website || '',
            description: docSnapshot.data()?.description || '',
            annualRevenue: docSnapshot.data()?.annualRevenue || '',
            employees: docSnapshot.data()?.employees || 0,
            fromPartner: docSnapshot.data()?.fromPartner || false,
            parterId: docSnapshot.data()?.parterId || '',
            userId: docSnapshot.data()?.userId || '',
            geo: docSnapshot.data()?.geo || null,
            businessId: docSnapshot.data()?.businessId || '',
            timeStamp: docSnapshot.data()?.timeStamp || '',
            lastUpdate: docSnapshot.data()?.lastUpdate || '',
            ip: docSnapshot.data()?.ip || '',
            userAgent: docSnapshot.data()?.userAgent || '',
            onboardId: docSnapshot.data()?.onboardId || '',
          });
          setStep(docSnapshot.data()?.step || 0);
          setCurrentOnboardId(onboardId);
        } else {
          console.error('No such document!');
        }
      } catch (error) {
        console.error('Error getting document:', error);
      }
    }

    fetchDoc();
  }, [onboardId]);

  const getPartnerDetails = async () => {
    try {
      const docData = await nodeAxiosFirebase({
        t,
        method: 'POST',
        url: `publicBusiness?businessId=${businessId}&marketplace=partner`,
        noAuth: true,
        body: {},
      });
      setBusinessData({
        name: docData?.name || '',
        mainColor: docData?.mainColor || '',
        secColor: docData?.secColor || '',
        city: docData?.city || '',
        partner: docData?.partner || '',
      });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getPartnerDetails();
  }, [businessId]);

  const handleSaveLocal = () => {
    setFormData({
      ...formData,
      firstName: nameUser,
    });
    setStep(0);
  };

  const handleSaveValue = async () => {
    try {
      if (!currentOnboardId) {
        const docRef = await addDoc(collection(db, 'onboard'), {
          businessName: formData?.businessName || '',
          firstName: formData?.firstName || '',
          lastName: formData?.lastName || '',
          email: formData?.email || '',
          businessType: formData?.businessType || '',
          mainColor: formData?.mainColor || '',
          secColor: formData?.secColor || '',
          address: formData?.address || '',
          city: formData?.city || '',
          state: formData?.state || '',
          step: step + 1,
          zip: formData?.zip || '',
          formula: formData?.formula || 'trial',
          phone: formData?.phone || '',
          website: formData?.website || '',
          description: formData?.description || '',
          annualRevenue: formData?.annualRevenue || '',
          employees: formData?.employees || 0,
          fromPartner: formData?.fromPartner || false,
          parterId: formData?.parterId || '',
          userId: formData?.userId || '',
          geo: formData?.geo || null,
          timeStamp: serverTimestamp(),
          lastUpdate: serverTimestamp(),
          session: {
            ipAddress: ipAddress || null,
            network: network || null,
            screen: screen || null,
            userAgent: userAgent || null,
            time: new Date().getTime(),
            lang: lang || null,
            browser: browser || null,
            os: os || null,
          },
          onboardId: formData?.onboardId || '',
        });
        localStorage.setItem('onboardId', docRef.id);
        setCurrentOnboardId(docRef.id);
      } else {
        await updateDoc(doc(db, 'onboard', currentOnboardId), {
          businessName: formData?.businessName,
          firstName: formData?.firstName,
          lastName: formData?.lastName,
          email: formData?.email,
          businessType: formData?.businessType,
          mainColor: formData?.mainColor || '',
          secColor: formData?.secColor || '',
          address: formData?.address || '',
          city: formData?.city || '',
          state: formData?.state || '',
          step: step + 1,
          geo: formData?.geo || null,
          formula: formData?.formula || 'trial',
          zip: formData?.zip || '',
          phone: formData?.phone || '',
          website: formData?.website || '',
          description: formData?.description || '',
          annualRevenue: formData?.annualRevenue || '',
          employees: formData?.employees || 0,
          fromPartner: formData?.fromPartner || false,
          parterId: formData?.parterId || '',
          userId: formData?.userId || '',
          lastUpdate: serverTimestamp(),
        });
      }
      setStep(step + 1);
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  };

  const businessTypes = [
    {
      value: 'accounting',
      label: t('accounting'),
      id: 'accounting',
    },
    {
      value: 'advertising',
      label: t('advertising'),
      id: 'advertising',
    },
    {
      value: 'agriculture',
      label: t('agriculture'),
      id: 'agriculture',
    },
    {
      value: 'automotive',
      label: t('automotive'),
      id: 'automotive',
    },
    {
      value: 'beauty',
      label: t('beauty'),
      id: 'beauty',
    },
    {
      value: 'businessServices',
      label: t('businessServices'),
      id: 'businessServices',
    },
    {
      value: 'construction',
      label: t('construction'),
      id: 'construction',
    },
    {
      value: 'consulting',
      label: t('consulting'),
      id: 'consulting',
    },
    {
      value: 'education',
      label: t('education'),
      id: 'education',
    },
    {
      value: 'energy',
      label: t('energy'),
      id: 'energy',
    },
    {
      value: 'engineering',
      label: t('engineering'),
      id: 'engineering',
    },
    {
      value: 'entertainment',
      label: t('entertainment'),
      id: 'entertainment',
    },
    {
      value: 'fashion',
      label: t('fashion'),
      id: 'fashion',
    },
    {
      value: 'finance',
      label: t('finance'),
      id: 'finance',
    },
    {
      value: 'food',
      label: t('food'),
      id: 'food',
    },
    {
      value: 'government',
      label: t('government'),
      id: 'government',
    },
    {
      value: 'healthcare',
      label: t('healthcare'),
      id: 'healthcare',
    },
    {
      value: 'hospitality',
      label: t('hospitality'),
      id: 'hospitality',
    },
    {
      value: 'humanResources',
      label: t('humanResources'),
      id: 'humanResources',
    },
    {
      value: 'informationTechnology',
      label: t('informationTechnology'),
      id: 'informationTechnology',
    },
    {
      value: 'insurance',
      label: t('insurance'),
      id: 'insurance',
    },
    {
      value: 'legal',
      label: t('legal'),
      id: 'legal',
    },
    {
      value: 'logistics',
      label: t('logistics'),
      id: 'logistics',
    },
    {
      value: 'manufacturing',
      label: t('manufacturing'),
      id: 'manufacturing',
    },
    {
      value: 'marketing',
      label: t('marketing'),
      id: 'marketing',
    },
    {
      value: 'media',
      label: t('media'),
      id: 'media',
    },
    {
      value: 'nonProfit',
      label: t('nonProfit'),
      id: 'nonProfit',
    },
    {
      value: 'other',
      label: t('other'),
      id: 'other',
    },
    {
      value: 'personalServices',
      label: t('personalServices'),
      id: 'personalServices',
    },
    {
      value: 'professionalServices',
      label: t('professionalServices'),
      id: 'professionalServices',
    },
    {
      value: 'realEstate',
      label: t('realEstate'),
      id: 'realEstate',
    },
    {
      value: 'retail',
      label: t('retail'),
      id: 'retail',
    },
    {
      value: 'science',
      label: t('science'),
      id: 'science',
    },
    {
      value: 'sports',
      label: t('sports'),
      id: 'sports',
    },
    {
      value: 'technology',
      label: t('technology'),
      id: 'technology',
    },
    {
      value: 'telecommunications',
      label: t('telecommunications'),
      id: 'telecommunications',
    },
    {
      value: 'transportation',
      label: t('transportation'),
      id: 'transportation',
    },
    {
      value: 'travel',
      label: t('travel'),
      id: 'travel',
    },
    {
      value: 'utilities',
      label: t('utilities'),
      id: 'utilities',
    },
    {
      value: 'wholesale',
      label: t('wholesale'),
      id: 'wholesale',
    },
  ];

  const handlePrev = () => {
    setStep(0);
  };

  const saveOnboard = async () => {
    try {
      await nodeAxiosFirebase({
        t,
        method: 'POST',
        url: `business/onboard`,
        noAuth: true,
        body: {
          onboardId: currentOnboardId,
          partnerId: businessId,
          partnerData: partnerData || {},
          lang: currentLang,
        },
      });
      localStorage.removeItem('onboardId');
      navigate('/onboard-success');
    } catch (error) {
      console.error(error);
    }
  };

  const handleNext = () => {
    handleSaveValue();
    if ((step === 3 && businessId) || (step === 2 && !businessId)) {
      saveOnboard();
    } else {
      setStep(step + 1);
    }
  };

  const steps = [t('welcome'), t('details'), t('preferences'), t('connectors')];
  const screenW = window.innerWidth;
  const screenH = window.innerHeight;
  const svgW = screenW * 0.75;
  const svgH = screenH * 0.9;

  if (businessId) {
    setTimeout(() => {
      steps.push(businessData?.name);
    }, 1200);
  }

  const HorizontalStepperWithError = () => {
    const isStepFailed = (step) => {
      return step === errorStep;
    };

    return (
      <Box sx={{ width: '95%', marginTop: '10px', padding: '5px' }}>
        <Stepper activeStep={step}>
          {steps?.map((label, index) => {
            const labelProps = {};
            if (isStepFailed(index)) {
              labelProps.optional = (
                <Typography variant="caption" color="error">
                  {t('error')}
                </Typography>
              );

              labelProps.error = true;
            }

            return (
              <Step key={label}>
                <StepLabel onClick={() => setStep(index)} {...labelProps}>
                  {label}
                </StepLabel>
              </Step>
            );
          })}
        </Stepper>
      </Box>
    );
  };

  return (
    <SiteLayout full>
      <div>
        <div>
          <Helmet>
            <title>{t('onboard')}</title>
          </Helmet>
        </div>
        <div className="row">
          <div
            style={{ position: 'relative', overflow: 'hidden' }}
            className={isMobile ? 'hide' : 'col-md-5 col-12'}
          >
            <DynamicOnboardGeo
              color1={businessData?.mainColor || '#C2EE13'}
              color2={businessData?.secColor || '#FF4848'}
              width={svgW}
              height={svgH}
            />
            <img
              src="/assets/website/2.0/onboard1.svg"
              alt="onboarding"
              width={'500px'}
              style={{
                marginBottom: '-40px',
                objectFit: 'contain',
                bottom: 0,
                position: 'absolute',
                left: 0,
              }}
            />
          </div>

          <div
            className="col-md-7 col-12 mt-2"
            style={{
              background: '#FFF',
              borderRadius: '10px',
              padding: '20px',
            }}
          >
            <div
              style={{ minHeight: '50px' }}
              className="bouncingSquare-fixed mt-4"
            >
              {businessId && (
                <img
                  src={`https://storage.googleapis.com/node-business-logos/${businessId}.png`}
                  height="60"
                  width="60"
                  style={{ borderRadius: '50%' }}
                  alt="logo"
                />
              )}
            </div>

            {step !== null ? (
              <>
                {step >= 1 ? (
                  <div>
                    {' '}
                    <div>
                      <GradientTypographyName
                        fontWeight={600}
                        fontSize={50}
                        variant="h4"
                      >
                        {formData?.businessName}
                      </GradientTypographyName>
                      <Typography
                        fontWeight={600}
                        fontSize={28}
                        variant="h6"
                        color="grey"
                      >
                        {t('discoverYouBusiness')}
                      </Typography>
                    </div>
                    <div className="mt-4 mb-4">
                      <HorizontalStepperWithError />
                    </div>
                    <div>
                      {step === 1 && (
                        <div>
                          <div>
                            <Geo
                              label={t('address')}
                              type="text"
                              onChange={(e, value) =>
                                setFormData({
                                  ...formData,
                                  address: value,
                                })
                              }
                              value={formData?.address}
                              fullWidth
                            />
                          </div>
                          <div>
                            <TextField
                              label={t('descriptionDescribe')}
                              type="text"
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  description: e.target.value,
                                })
                              }
                              value={formData?.description}
                              fullWidth
                            />
                          </div>
                          <div>
                            <TextField
                              label={t('phone')}
                              type="phone"
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  phone: e.target.value,
                                })
                              }
                              value={formData?.phone}
                              fullWidth
                            />
                          </div>
                          <div>
                            <TextField
                              label={t('email')}
                              type="email"
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  email: e.target.value,
                                })
                              }
                              value={formData?.email}
                              fullWidth
                            />
                          </div>
                          <div>
                            <TextField
                              label={t('website')}
                              type="url"
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  website: e.target.value,
                                })
                              }
                              value={formData?.website}
                              fullWidth
                            />
                          </div>
                          <div className="mb-4">
                            <TextField
                              label={t('mainColorBusiness')}
                              type="color"
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  mainColor: e.target.value,
                                })
                              }
                              value={formData?.mainColor}
                              fullWidth
                            />
                          </div>

                          <Button
                            variant="text"
                            type="submit"
                            size="large"
                            endIcon={<ArrowForward />}
                            onClick={handleNext}
                            style={{ marginTop: '10px' }}
                          >
                            {t('next')}
                          </Button>
                        </div>
                      )}
                      {step === 2 && (
                        <div>
                          {' '}
                          <div className="row mb-4">
                            <div className="col-12 fs-14 fw-600 mt-5">
                              {t('selectFormulaNode')}
                            </div>
                            <div className="row d-flex">
                              <div
                                className="col-12 price-selector hover"
                                style={{
                                  backgroundColor:
                                    formData?.formula === 'flash'
                                      ? '#69696920'
                                      : '#fff',
                                }}
                                onClick={() =>
                                  setFormData({ ...formData, formula: 'flash' })
                                }
                              >
                                <div>Flash</div>
                                <div className="fs-10">{t('flashDesc')}</div>
                                <div className="fs-12 fw-500 mt-2">
                                  {t('startForm79')}
                                </div>
                                <div className="d-flex middle-content px-3 mt-3 mb-2">
                                  <CheckCircleOutlineOutlined color="success" />{' '}
                                  <ListItemText
                                    primary={t('flashDetailsMain1')}
                                    primaryTypographyProps={{
                                      fontSize: '11px',
                                      textAlign: 'left',
                                      paddingLeft: '8px',
                                    }}
                                  />
                                  <CheckCircleOutlineOutlined color="success" />{' '}
                                  <ListItemText
                                    primary={t('flashDetailsMain2')}
                                    primaryTypographyProps={{
                                      fontSize: '11px',
                                      textAlign: 'left',
                                      paddingLeft: '8px',
                                    }}
                                  />
                                  <CheckCircleOutlineOutlined color="success" />{' '}
                                  <ListItemText
                                    primary={t('flashDetailsMain3')}
                                    primaryTypographyProps={{
                                      fontSize: '11px',
                                      textAlign: 'left',
                                      paddingLeft: '8px',
                                    }}
                                  />
                                </div>
                              </div>
                              <div
                                className="col-12 price-selector hover"
                                style={{
                                  backgroundColor:
                                    formData?.formula === 'rise'
                                      ? '#69696920'
                                      : '#fff',
                                }}
                                onClick={() =>
                                  setFormData({ ...formData, formula: 'rise' })
                                }
                              >
                                <div>Rise</div>
                                <div className="fs-10">{t('riseDesc')}</div>
                                <div className="fs-12 fw-500 mt-2">
                                  {t('startForm199')}
                                </div>
                                <div className="d-flex middle-content px-3 mt-3 mb-2">
                                  <CheckCircleOutlineOutlined color="success" />{' '}
                                  <ListItemText
                                    primary={t('riseDetailsMain1')}
                                    primaryTypographyProps={{
                                      fontSize: '11px',
                                      textAlign: 'left',
                                      paddingLeft: '8px',
                                    }}
                                  />
                                  <CheckCircleOutlineOutlined color="success" />{' '}
                                  <ListItemText
                                    primary={t('riseDetailsMain2')}
                                    primaryTypographyProps={{
                                      fontSize: '11px',
                                      textAlign: 'left',
                                      paddingLeft: '8px',
                                    }}
                                  />
                                  <CheckCircleOutlineOutlined color="success" />{' '}
                                  <ListItemText
                                    primary={t('riseDetailsMain3')}
                                    primaryTypographyProps={{
                                      fontSize: '11px',
                                      textAlign: 'left',
                                      paddingLeft: '8px',
                                    }}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="mt-4">
                            <Button
                              variant="text"
                              type="submit"
                              size="large"
                              endIcon={<ArrowForward />}
                              onClick={handleNext}
                              style={{ marginTop: '10px' }}
                            >
                              {t('next')}
                            </Button>
                          </div>
                        </div>
                      )}
                      {step === 3 && (
                        <div>
                          <div className="mt-5 mb-4 fs-12 align-c">
                            {businessData?.name +
                              ' ' +
                              t('needsDetails') +
                              '. ' +
                              businessData?.partner?.intro}
                          </div>
                          {businessData?.partner?.fields?.map(
                            (field, index) => (
                              <div key={index} className="col-12">
                                {(field?.typeData === 'string' ||
                                  field?.typeData === 'number') && (
                                  <TextField
                                    label={field?.['name_' + currentLang]}
                                    type={field?.typeData}
                                    onChange={(e) =>
                                      setPartnerData({
                                        ...partnerData,
                                        [field.value]: e.target.value,
                                      })
                                    }
                                    value={partnerData[field.value]}
                                    fullWidth
                                  />
                                )}
                              </div>
                            )
                          )}
                          <div className="col-12 fs-14 fw-600 mt-5">
                            {t('selectFormulaPartner')}
                          </div>
                          <div className="row mt-3">
                            {businessData?.partner?.plans?.map(
                              (plan, index) => (
                                <div
                                  key={index}
                                  className="col-4 hover"
                                  onClick={() =>
                                    setPartnerData({
                                      ...partnerData,
                                      formula: plan?.['name_' + currentLang],
                                    })
                                  }
                                >
                                  <div
                                    className="plan-card fs-12 fw-600"
                                    style={{
                                      backgroundColor:
                                        partnerData?.formula ===
                                        plan?.['name_' + currentLang]
                                          ? businessData?.mainColor + '20'
                                          : '#fff',
                                    }}
                                  >
                                    {plan?.['name_' + currentLang]}
                                    <div className="fs-11 fw-400">
                                      {' '}
                                      {plan?.['desc_' + currentLang]}
                                    </div>
                                    <div className="fw-14 fw-500 mt-3">
                                      {' '}
                                      {plan?.price?.toFixed(2) + ' $'}
                                    </div>
                                  </div>
                                </div>
                              )
                            )}
                          </div>

                          <div className="mt-4">
                            <Button
                              variant="text"
                              type="submit"
                              size="large"
                              endIcon={<CheckCircleOutlineOutlined />}
                              onClick={handleNext}
                              ouais
                              style={{ marginTop: '10px' }}
                            >
                              {t('submitData')}
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div
                    style={{
                      backgroundColor: '#FFFFFF',
                      width: '100%',
                      height: '75vh',
                      textAlign: 'left',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                    }}
                  >
                    <div>
                      <GradientTypography
                        fontWeight={600}
                        fontSize={50}
                        variant="h4"
                      >
                        {t('hi') + ' ' + (formData?.firstName || '') + '!'}
                      </GradientTypography>
                      <Typography
                        fontWeight={600}
                        fontSize={28}
                        variant="h6"
                        color="grey"
                      >
                        {t('letsStartBusiness')}
                      </Typography>
                    </div>
                    <HorizontalStepperWithError />
                    <div className="mt-5 mb-4">
                      <AvatarGroup>
                        {[
                          '/assets/v3/connectors/node-cos.png',
                          '/assets/v3/connectors/node-strat.png',
                          '/assets/v3/connectors/node-connect.png',
                        ].map((src, index) => (
                          <Avatar
                            key={src}
                            alt="Avatar"
                            src={src}
                            className={loaded ? classes.avatar : ''}
                            sx={{
                              backgroundColor: '#FFFFFF',
                              border: '2px solid #FFFFFF',
                              boxShadow: '0px 0px 0px 2px #00000007',
                            }}
                            style={{ animationDelay: `${index * 0.5}s` }}
                          />
                        ))}
                      </AvatarGroup>
                    </div>
                    <div style={{ width: '100%' }}>
                      <TextField
                        label={t('firstName')}
                        type="text"
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            firstName: e.target.value,
                          })
                        }
                        value={formData?.firstName}
                        fullWidth
                      />
                      <TextField
                        label={t('lastName')}
                        type="text"
                        onChange={(e) =>
                          setFormData({ ...formData, lastName: e.target.value })
                        }
                        value={formData?.lastName}
                        fullWidth
                      />
                      <TextField
                        label={t('email')}
                        type="text"
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        value={formData?.email}
                        fullWidth
                      />
                      <TextField
                        label={t('businessName')}
                        type="text"
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            businessName: e.target.value,
                          })
                        }
                        value={formData?.businessName}
                        fullWidth
                      />
                      <Select
                        label={t('industry')}
                        value={formData?.businessType}
                        onChange={(e, value) =>
                          setFormData({ ...formData, businessType: value })
                        }
                        fullWidth
                        selections={businessTypes}
                      />
                    </div>
                    <div className="mt-4 d-flex justify-content-end">
                      <Button
                        variant="text"
                        type="submit"
                        size="large"
                        endIcon={<ArrowForward />}
                        onClick={handleNext}
                        style={{ marginTop: '10px' }}
                      >
                        {t('start')}
                      </Button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="p-4 align-c">
                <div className="mt-5">
                  <GradientTypographyName
                    fontWeight={600}
                    fontSize={50}
                    variant="h4"
                  >
                    {t('letsStartProject')}
                  </GradientTypographyName>
                  <Typography
                    fontWeight={600}
                    fontSize={28}
                    variant="h6"
                    color="grey"
                  >
                    {t('openAccount')}
                  </Typography>
                </div>
                <div className="mt-5">
                  <TextField
                    label={t('whatIsName')}
                    type="text"
                    onChange={(e) => setNameUser(e.target.value)}
                    value={nameUser}
                    variant="standard"
                    fullWidth
                  />
                  <Button
                    variant="text"
                    type="submit"
                    size="large"
                    endIcon={<ArrowForward />}
                    onClick={handleSaveLocal}
                    style={{ marginTop: '10px' }}
                  >
                    {t('start')}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </SiteLayout>
  );
};

export default Onboard;
