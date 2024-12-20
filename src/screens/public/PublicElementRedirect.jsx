import React, { useState, useRef, useEffect } from 'react';
import PublicLayout from '../../layouts/PublicLayout';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';

const PublicElementRedirect = () => {
  const { search } = useLocation();
  const dispatch = useDispatch();

  const accessToken = new URLSearchParams(search).get('accessToken');
  const accessCode = new URLSearchParams(search).get('accessCode');
  const { structureId, elementId, moduleName, businessId } = useParams();

  const { t, i18n } = useTranslation();

  useEffect(() => {
    let newUrl = `${
      window.location.origin
    }/doc/${businessId}/${moduleName}/${structureId}/${elementId}?accessCode=${
      accessToken || accessCode
    }&shared=true`;

    window
      .fetch(newUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then((response) => {
        if (response.status === 200) {
          window.location.href = newUrl;
        }
      });
  }, []);

  return (
    <PublicLayout>
      <div className="middle-content">{t('redirection')}</div>
    </PublicLayout>
  );
};

export default PublicElementRedirect;
