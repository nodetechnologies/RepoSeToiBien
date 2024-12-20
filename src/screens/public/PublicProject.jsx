import React, { useEffect, useState, useRef } from 'react';
import PublicLayout from '../../layouts/PublicLayout';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';

import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { getGeocode, getLatLng } from 'use-places-autocomplete';

//components
import CardInformationTag from '../../components/@generalComponents/CardInformationTag';
import Button from '../../stories/general-components/Button';
import GeneralText from '../../stories/general-components/GeneralText';
import BusinessInformationTag from '../../components/@generalComponents/BusinessInformationTag';
import { Divider } from '@mui/material';
import nodeAxiosFirebase from '../../utils/nodeAxiosFirebase';

const libraries = ['places'];

const PublicProject = () => {
  const componentRef = useRef(null);
  const { domain, elementId } = useParams();
  const { search } = useLocation();

  const accessToken = new URLSearchParams(search).get('accessToken');
  const accessCode = new URLSearchParams(search).get('accessCode');

  const [error, setError] = useState(false);

  const { t, i18n } = useTranslation();

  const handleAction = async () => {
    try {
      await nodeAxiosFirebase({
        t,
        method: 'PATCH',
        url: `public/element`,
        noAuth: true,
        body: {
          field: 'status',
          value: parseInt(1),
          elementId: elementId,
          accessCode: accessCode || accessToken,
        },
      });
      let redirectURL = `https://usenode.com/doc/moEZdGEs0ImtMzmwgkoT/cardsuninvoiced/lTk5BpWztIOXvymzCERd/${elementId}?accessCode=${
        accessToken || accessCode
      }&shared=true`;

      setTimeout(() => {
        window.location.href = redirectURL;
      }, 1000);
    } catch (error) {
      console.error('Error updating data:', error);
    }
  };

  useEffect(() => {
    handleAction();
  }, []);

  return (
    <PublicLayout>
      <div
        style={{
          height: '100vh',
          overflow: 'scroll',
          maxWidth: '1200px',
          margin: '0 auto',
        }}
        className="row align-c mt-3"
      ></div>
    </PublicLayout>
  );
};

export default PublicProject;
