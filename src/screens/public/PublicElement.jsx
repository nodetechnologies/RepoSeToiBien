import React, { useState, useRef } from 'react';
import PublicLayout from '../../layouts/PublicLayout';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';

//components
import Button from '../../stories/general-components/Button';
import { AppBar, Divider, Drawer } from '@mui/material';
import PublicElementDetails from './PublicElementDetails';
import GeneralText from '../../stories/general-components/GeneralText';

const PublicElement = () => {
  const componentRef = useRef(null);
  const { search } = useLocation();
  const dispatch = useDispatch();

  const [reload, setReload] = useState(false);
  const [data, setData] = useState(null);

  const accessToken = new URLSearchParams(search).get('accessToken');
  const accessCode = new URLSearchParams(search).get('accessCode');
  const { structureId, elementId, businessId } = useParams();

  const { t, i18n } = useTranslation();
  const language = i18n.language;

  function updateLanguageToEnglish() {
    i18n.changeLanguage('en');
    setTimeout(() => {
      setReload(true);
    }, 1000);
  }

  function updateLanguageToFrench() {
    i18n.changeLanguage('fr');
    setTimeout(() => {
      setReload(true);
    }, 1000);
  }

  return (
    <PublicLayout>
      <div
        style={{
          paddingTop: '16px',
        }}
      >
        <AppBar
          sx={{ backgroundColor: '#FFF', height: '60px' }}
          position="static"
          elevation={0}
        >
          <div className="d-flex align-left mt-2 justify-content-between">
            <div className="col-7 col-md-3">
              <div className="row">
                <div className="col-3 align-right py-1">
                  <img
                    src={`https://storage.googleapis.com/node-business-logos/${businessId}.png`}
                    height={'40px'}
                    width={'40px'}
                    style={{
                      borderRadius: '50%',
                    }}
                  />
                </div>
                <div className="col-9 py-2 mt-1 align-left">
                  <GeneralText
                    text={data?.name || t('elementDetails')}
                    fontSize="14px"
                    size="bold"
                    primary={true}
                  />
                  <div style={{ marginTop: '-2px' }}>
                    <GeneralText
                      text={data?.businessName || t('business')}
                      fontSize="10px"
                      size="regular"
                      primary={true}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-1 col-md-5 align-right mt-1"></div>

            <div className="col-2 align-c mt-1">
              {language === 'fr' ? (
                <Button
                  label={t('en')}
                  primary={true}
                  variant="text"
                  size="sm"
                  onClick={updateLanguageToEnglish}
                />
              ) : (
                <Button
                  label={t('fr')}
                  primary={true}
                  size="sm"
                  variant="text"
                  onClick={updateLanguageToFrench}
                />
              )}
            </div>
          </div>
        </AppBar>
      </div>
      <Divider component="div" />
      <div
        style={{
          overflowY: 'auto',
          overflowX: 'hidden',
          width: '100%',
        }}
        ref={componentRef}
      >
        <PublicElementDetails
          fromBusiness={false}
          reload={reload}
          setData={setData}
          setReload={setReload}
          accessCode={accessCode || accessToken}
        />
      </div>
    </PublicLayout>
  );
};

export default PublicElement;
