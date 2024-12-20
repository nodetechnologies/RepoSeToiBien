import React, { useState, useRef } from 'react';
import PublicLayout from '../../layouts/PublicLayout';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';

import { useReactToPrint } from 'react-to-print';

//components
import Button from '../../stories/general-components/Button';
import { AppBar, Divider, Drawer } from '@mui/material';
import PublicInvoiceComponent from './PublicInvoiceComponent';

const PublicInvoice = () => {
  const componentRef = useRef(null);
  const { search } = useLocation();
  const dispatch = useDispatch();

  const [reload, setReload] = useState(false);

  const accessCode = new URLSearchParams(search).get('accessCode');
  const accessToken = new URLSearchParams(search).get('accessToken');

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const { t, i18n } = useTranslation();
  const language = i18n.language;

  // Function to handle print
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  function updateLanguageToEnglish() {
    i18n.changeLanguage('en');
  }

  function updateLanguageToFrench() {
    i18n.changeLanguage('fr');
  }

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }

    setIsDrawerOpen(open);
  };

  return (
    <PublicLayout>
      {isDrawerOpen && (
        <Drawer
          anchor="bottom"
          open={isDrawerOpen}
          onClose={toggleDrawer(false)}
        >
          <div
            style={{ padding: 20, width: 'auto' }}
            role="presentation"
            onKeyDown={toggleDrawer(false)}
          ></div>
        </Drawer>
      )}
      <div>
        <AppBar
          sx={{ backgroundColor: '#FFF', height: '60px' }}
          position="static"
          elevation={0}
        >
          <div className="d-flex align-c mt-3">
            <div className="col-3 align-c">
              <Button
                label={t('print')}
                primary={false}
                size="sm"
                variant="text"
                endIcon="PrintOutlined"
                onClick={handlePrint}
              />
            </div>

            <div className="col-3 align-c">
              {language === 'fr' ? (
                <Button
                  label={t('english')}
                  primary={true}
                  variant="text"
                  size="sm"
                  onClick={updateLanguageToEnglish}
                />
              ) : (
                <Button
                  label={t('french')}
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
          justifyContent: 'center',
          alignContent: 'center',
          alignItems: 'center',
          display: 'flex',
          maxWidth: '1200px',
          margin: 'auto',
        }}
        id="report-pdf"
        ref={componentRef}
      >
        <PublicInvoiceComponent
          fromBusiness={false}
          reload={reload}
          printRef={componentRef}
          setReload={setReload}
          accessCode={accessCode || accessToken}
        />
      </div>
    </PublicLayout>
  );
};

export default PublicInvoice;
