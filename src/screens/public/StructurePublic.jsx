/* global gtag */
import React, { useState, useEffect, useRef } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import moment from 'moment';
import nodeAxiosFirebase from '../../utils/nodeAxiosFirebase';
import FieldComponent from '../../components/@generalComponents/FieldComponent';
import Button from '../../stories/general-components/Button';
import Loading from '../../stories/general-components/Loading';
import PublicLayout from '../../layouts/PublicLayout';
import { Divider, IconButton, useTheme } from '@mui/material';
import ChecklistRtlOutlinedIcon from '@mui/icons-material/ChecklistRtlOutlined';
import Lottie from 'react-lottie';
import animationData from '../../lotties/chatloading.json';
import useMediaQuery from '@mui/material/useMediaQuery';
import { ArrowForward, CheckBoxOutlined } from '@mui/icons-material';
import SideExtra from '../../components/@generalComponents/SideExtra';

const StructurePublic = () => {
  const { search } = useLocation();
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const chatContainerRef = useRef(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [structureData, setStructureData] = useState(null);
  const [chatFields, setChatFields] = useState([]);
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [errorSubmission, setErrorSubmission] = useState(false);
  const [displayMessage, setDisplayMessage] = useState(false);
  const [currentFieldIndex, setCurrentFieldIndex] = useState(0);
  const [displayLogo, setDisplayLogo] = useState(false);
  const [formStyle, setFormStyle] = useState('default');
  const [submissionLoading, setSubmissionLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const [layout, setLayout] = useState('fw');
  const [intro, setIntro] = useState('');
  const [startQuestions, setStartQuestions] = useState(false);
  const [invalidFields, setInvalidFields] = useState([]);
  const [parentData, setParentData] = useState(null);

  const structureId = new URLSearchParams(search).get('structureId');
  const businessId = new URLSearchParams(search).get('businessId');
  const langCode = new URLSearchParams(search).get('lang');
  const urlParams = new URLSearchParams(search);

  const fieldRefs = useRef([]);

  useEffect(() => {
    i18n.changeLanguage(langCode);
    localStorage.setItem('i18nextLng', langCode);
    moment.locale(langCode);
  }, [langCode, i18n.language]);

  const getStructureData = async () => {
    setIsLoading(true);
    try {
      const data = await nodeAxiosFirebase({
        t,
        method: 'POST',
        url: `getDocumentPublic`,
        noAuth: true,
        body: {
          structureId: structureId,
          language: langCode || i18n.language,
          businessId: businessId,
        },
      });
      setStructureData(data);
      setFormStyle(data?.view);
      setLayout(data?.layout);
      setDisplayLogo(data?.displayLogo);
      setIntro(data?.intro);
      setIsLoading(false);

      const initialFormData = {};
      data?.fields?.forEach((field) => {
        const paramName = field.defaultValue
          ? field.defaultValue?.slice(9, -2)
          : null;
        if (paramName && urlParams.has(paramName)) {
          initialFormData[field?.value] = urlParams.get(paramName);
          setFormData(initialFormData);
        } else {
          setChatFields((prev) => [...prev, field]);
        }
      });
      setFormData(initialFormData);
      fieldRefs.current = data?.fields?.map(() => React.createRef());
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  const handleFieldChange = (fieldId, value, type, fieldIndex) => {
    setFormData((prevState) => ({ ...prevState, [fieldId]: value }));
    if (fieldRefs.current[fieldIndex + 1]) {
      fieldRefs.current[fieldIndex + 1].current?.focus();
    }
  };

  const handleNext = () => {
    setLoadingChat(true);

    if (currentFieldIndex < chatFields.length - 1) {
      setCurrentFieldIndex(currentFieldIndex + 1);
      setTimeout(() => {
        setLoadingChat(false);
      }, 1300);
    } else {
      sendData();
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleNext();
    }
  };

  const validateRequiredFields = () => {
    const invalids = [];

    chatFields.forEach((field) => {
      if (field?.required) {
        const value = formData[field?.value];

        if (
          value == null ||
          (typeof value === 'string' && value.trim() === '')
        ) {
          invalids.push(field.value);
        } else {
          switch (field?.typeData) {
            case 'date':
            case 'date-time':
              const date = new Date(value);
              if (isNaN(date.getTime())) invalids.push(field.value);
              break;
            case 'number':
              if (typeof value !== 'number' || isNaN(value))
                invalids.push(field.value);
              break;
            default:
              break;
          }
        }
      }
    });

    setInvalidFields(invalids);
    return invalids.length === 0;
  };

  const sendData = async () => {
    if (!validateRequiredFields()) {
      alert(t('allRequiredFields'));
      return;
    }

    try {
      setSubmissionLoading(true);
      const responseSubmit = await nodeAxiosFirebase({
        t,
        method: 'POST',
        url: `sendDocumentPublic`,
        noAuth: true,
        body: {
          structureId: structureId,
          businessId: businessId,
          formData: formData,
          fromURL: window.location.href,
          lang: i18n.language,
        },
      });

      if (responseSubmit?.message === 'Document sent successfully') {
        setSubmissionLoading(false);
        setDisplayMessage(true);
        console.log(typeof gtag);
        // Track the form submission if gtag is defined
        if (typeof gtag === 'function') {
          gtag('event', 'form_submission', {
            event_category: 'Form',
            event_label: structureId,
            value: 1,
          });
        }
      } else {
        setSubmissionLoading(false);
        setErrorSubmission(true);
      }
    } catch (error) {
      console.error(error);
      setSubmissionLoading(false);
    }
  };

  useEffect(() => {
    getStructureData();
  }, [businessId, structureId]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [currentFieldIndex, formData]);

  const handleStart = () => {
    setStartQuestions(true);
  };

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  const safeTrackingId = `${structureData?.trackingId || ''}`;

  return (
    <PublicLayout>
      <HelmetProvider>
        <Helmet>
          <title>
            {`${structureData?.businessName || 'Node'} - ${
              structureData?.name || 'Default Name'
            }`}
          </title>
          {safeTrackingId && (
            <>
              <script
                async
                src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(
                  safeTrackingId
                )}`}
              ></script>
              <script
                dangerouslySetInnerHTML={{
                  __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag() {
                dataLayer.push(arguments);
              }
              gtag('js', new Date());
              gtag('config', '${safeTrackingId}');
            `,
                }}
              ></script>
            </>
          )}
        </Helmet>
      </HelmetProvider>
      <div
        style={{
          backgroundImage: `url(${structureData?.img})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
        className="p-3"
      >
        {displayLogo && (
          <div style={{ position: 'fixed', bottom: 35, left: 35 }}>
            <img
              src={`https://storage.googleapis.com/node-business-logos/${businessId}.png`}
              height="50"
              width="50"
              style={{ borderRadius: '50%' }}
              alt="logo"
            />
            <div style={{ fontSize: '10px', color: '#FFF', marginTop: '10px' }}>
              {t('byNodeLicence')}
            </div>
          </div>
        )}
        {isLoading && (
          <div className="align-c">
            <Loading />
          </div>
        )}
        {!displayMessage && structureData && (
          <div
            style={{
              overflow: structureData?.view !== 'chat' ? 'scroll' : 'hidden',
              height: structureData?.layout === 'fw' ? '100vh' : '80vh',
              padding: '10px',
            }}
          >
            {formStyle === 'default' && (
              <div style={{ position: 'relative' }} className="d-flex">
                <div
                  style={{
                    position: 'relative',
                    overflow: 'scroll',
                    height: '90vh',
                  }}
                  id="submission-form"
                  className={
                    structureData?.sideExtra ? 'col-md-7 col-12' : 'col-12'
                  }
                >
                  {chatFields?.map((field, index) =>
                    !field?.defaultValue ||
                    !urlParams.has(field?.defaultValue) ? (
                      <FieldComponent
                        key={field.value}
                        mask={field?.mask}
                        id={`field-${field.value}`}
                        error={invalidFields?.includes(field?.value)}
                        field={field}
                        value={formData[field?.value]}
                        onChange={handleFieldChange}
                        ref={fieldRefs[index]}
                        handleKeyPress={handleKeyPress}
                        fieldIndex={index}
                        parentData={parentData}
                        activeStructures={[structureData?.structureDetails]}
                        setParentData={setParentData}
                      />
                    ) : null
                  )}
                  <div className="mt-4 align-c">
                    {errorSubmission && (
                      <div className="mt-2 mb-2" style={{ color: 'red' }}>
                        {t('errorSubmission')}
                      </div>
                    )}
                    <Button
                      variant="contained"
                      fullWidth
                      color="primary"
                      label={t('send')}
                      onClick={sendData}
                      success={!submissionLoading}
                      delay={5000}
                    />
                  </div>
                </div>
                {structureData?.sideExtra && (
                  <div
                    style={{ position: 'sticky', top: '0px' }}
                    className="col-md-5 col-12"
                  >
                    <SideExtra
                      structure={structureData}
                      data={formData}
                      secColor={structureData?.secColor}
                      color={structureData?.mainColor}
                    />
                  </div>
                )}
              </div>
            )}
            {formStyle === 'chat' && (
              <div
                id="submission-form"
                style={{ height: '100%', paddingLeft: isMobile ? '5%' : '50%' }}
              >
                <div className="chat-container-frame">
                  {startQuestions && !submissionLoading ? (
                    <div className="chat-container" ref={chatContainerRef}>
                      {chatFields
                        .slice(0, currentFieldIndex + 1)
                        .map((field, index) =>
                          !field.defaultValue ||
                          !urlParams.has(field.defaultValue) ? (
                            <div key={field.value} className="chat-message">
                              <div className="question">
                                {loadingChat && index === currentFieldIndex ? (
                                  <Lottie
                                    options={defaultOptions}
                                    height={20}
                                    width={80}
                                  />
                                ) : (
                                  <>{field.name}</>
                                )}
                              </div>
                              {index < currentFieldIndex && (
                                <div
                                  style={{
                                    backgroundColor:
                                      structureData?.mainColor || '#000',
                                  }}
                                  className="answer"
                                >
                                  {field?.typeData === 'dropdown' ? (
                                    field?.selections?.[formData[field?.value]]
                                      ?.label
                                  ) : field?.typeData === 'media' ||
                                    field?.typeData === 'media-single' ? (
                                    <img />
                                  ) : (
                                    formData[field.value]
                                  )}
                                </div>
                              )}

                              {!loadingChat && (
                                <div className="chat-input-container d-flex middle-content">
                                  <div className="col-11">
                                    {index === currentFieldIndex && (
                                      <FieldComponent
                                        key={field.value}
                                        id={`field-${field.value}`}
                                        field={chatFields[currentFieldIndex]}
                                        value={formData[field?.value]}
                                        onChange={handleFieldChange}
                                        ref={fieldRefs.current[index]}
                                        handleKeyPress={handleKeyPress}
                                        fieldIndex={index}
                                        businessId={businessId}
                                      />
                                    )}
                                  </div>
                                  <div className="col-1">
                                    <IconButton
                                      onClick={handleNext}
                                      style={{
                                        marginLeft: 'auto',
                                        backgroundColor: '#f9f9f9',
                                        marginLeft: isMobile ? '5px' : '10px',
                                        marginTop: '2px',
                                      }}
                                    >
                                      <ArrowForward />
                                    </IconButton>
                                  </div>
                                </div>
                              )}
                            </div>
                          ) : null
                        )}
                    </div>
                  ) : (
                    <>
                      {submissionLoading ? (
                        <div>
                          {' '}
                          <div className="chat-container">
                            <div
                              style={{
                                marginTop: '30px',
                                textAlign: 'center',
                              }}
                            >
                              <CheckBoxOutlined fontSize="large" />
                            </div>
                            <div
                              style={{
                                marginTop: '6px',
                                width: '90%',
                                marginLeft: '5%',
                                color: '#000',
                                borderRadius: '10px',
                                fontSize: '20px',
                                fontWeight: 500,
                                textAlign: 'center',
                              }}
                            >
                              {structureData?.name || ''}
                            </div>
                            <div
                              style={{
                                width: '90%',
                                marginTop: '4px',
                                marginLeft: '5%',
                                color: '#000',
                                borderRadius: '10px',
                                fontSize: '12px',
                                fontWeight: 400,
                                textAlign: 'center',
                              }}
                            >
                              {structureData?.businessName || ''}
                            </div>
                            <div
                              style={{
                                marginTop: '35px',
                                marginBottom: '20px',
                                width: '90%',
                                marginLeft: '5%',
                                padding: '15px',
                                borderRadius: '10px',
                                fontWeight: 500,
                                fontSize: '20px',
                                textAlign: 'center',
                              }}
                            >
                              {t('loading')}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="chat-container">
                          <div
                            style={{
                              marginTop: '30px',
                              textAlign: 'center',
                            }}
                          >
                            <ChecklistRtlOutlinedIcon fontSize="large" />
                          </div>
                          <div
                            style={{
                              marginTop: '6px',
                              width: '90%',
                              marginLeft: '5%',
                              color: '#000',
                              borderRadius: '10px',
                              fontSize: '20px',
                              fontWeight: 500,
                              textAlign: 'center',
                            }}
                          >
                            {structureData?.name || ''}
                          </div>
                          <div
                            style={{
                              width: '90%',
                              marginTop: '4px',
                              marginLeft: '5%',
                              color: '#000',
                              borderRadius: '10px',
                              fontSize: '12px',
                              fontWeight: 400,
                              textAlign: 'center',
                            }}
                          >
                            {structureData?.businessName || ''}
                          </div>
                          <div
                            style={{
                              marginTop: '35px',
                              marginBottom: '20px',
                              width: '90%',
                              marginLeft: '5%',
                              // color: '#FFF',
                              padding: '15px',
                              borderRadius: '10px',
                              fontWeight: 400,
                              textAlign: 'center',
                            }}
                          >
                            {intro}
                          </div>
                          <div style={{ textAlign: 'center' }} className="mt-5">
                            <Divider component="div" />
                            <Button
                              variant="text"
                              endIcon="ArrowForwardOutlined"
                              disableRipple
                              fullWidth
                              color="primary"
                              label={structureData?.btn || t('start')}
                              onClick={handleStart}
                              buttonSx={{
                                marginTop: '35px',
                                backgroundColor:
                                  structureData?.secColor || '#000',
                                color: '#FFF',
                                maxWidth: '80%',
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
        {displayMessage && (
          <div style={{ height: '100vh' }} className="align-c">
            <div
              style={{
                backgroundColor: '#FFF',
                padding: '15px',
                marginLeft: '15%',
                borderRadius: '20px',
                width: '70%',
                fontSize: '20px',
                fontWeight: 600,
              }}
            >
              {t('sentDone')}
              {layout === 'fw' && (
                <div
                  style={{
                    fontSize: '11px',
                    fontWeight: 400,
                  }}
                >
                  {t('closeWindow')}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </PublicLayout>
  );
};

export default StructurePublic;
