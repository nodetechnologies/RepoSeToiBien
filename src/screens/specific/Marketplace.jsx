import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material/styles';
import nodeAxiosFirebase from '../../utils/nodeAxiosFirebase';

const Marketplace = ({ currentCollection }) => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const theme = useTheme();
  const businessPreference = useSelector((state) => state.core.businessData);

  const processIntegration = async (data) => {
    try {
      await nodeAxiosFirebase({
        t,
        url: 'business/integration',
        errorToast: t('errorLoadingDocument'),
        body: {
          ...data,
          collection: currentCollection,
        },
      });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const appKey = process.env.REACT_APP_INTEGRY_KEY;
    const appSecret = process.env.REACT_APP_INTEGRY_SECRET;
    const userId = businessPreference?.id;
    const apiKey = businessPreference?.internalKey;
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/@integry/sdk/dist/umd/index.umd.js';
    script.async = true;

    script.onload = async () => {
      const hash = await window.IntegryJS.Helpers.getAuthHash(
        userId,
        appSecret
      );

      const integryHandle = new window.IntegryJS({
        appKey,
        hash,
        userId,
        xIntegryConfig: {
          appAuth: {
            apiKey: apiKey,
            extras: {
              name: businessPreference?.name,
            },
          },
        },
        options: {
          title: t('marketplaceNode'),
          tags: [
            businessPreference?.formula +
              '-' +
              currentCollection?.toLowerCase(),
            businessPreference?.id + '-' + currentCollection?.toLowerCase(),
          ],
          objects: {
            Card: {
              id: t('documentId'),
              name: t('name'),
              searchId: t('shortCardId'),
              status: t('status'),
              note: t('note'),
              invoiceDate: t('invoiceDate'),
              invoiceDateFormatted: t('invoiceDateFormatted'),
              dueDate: t('dueDate'),
              dueDateFormatted: t('dueDateFormatted'),
              targetDate: t('targetDate'),
              targetDateFormatted: t('targetDateFormatted'),
              isInvoiced: t('isInvoiced'),
              targetMiddleDetails: {
                name: t('name'),
                email: t('email'),
                address: t('address'),
                lang: t('lang'),
              },
              targetDetails: {
                id: t('documentId'),
                name: t('name'),
                email: t('email'),
                address: t('address'),
                prefix: t('prefix'),
                lang: t('lang'),
              },
              lang: t('lang'),
              isProject: t('isProject'),
              isExpense: t('isExpense'),
              finances: {
                total: t('total'),
                currency: t('currency'),
                subtotal: t('subtotal'),
                tax1: t('tax1'),
                tax2: t('tax2'),
                tax3: t('tax3'),
                balance: t('balance'),
              },
              timeStamp: t('timeStamp'),
            },
            Contact: {
              id: t('documentId'),
              name: t('name'),
              targetEmail: t('email'),
              targetPhone: t('phone'),
              targetAddress: t('address'),
              note: t('note'),
              targetPrefix: t('prefix'),
              targetReference: t('reference'),
              timeStamp: t('timeStamp'),
            },
            Passe: {
              id: t('documentId'),
              name: t('name'),
              note: t('note'),
              startDate: t('startDate'),
              endDate: t('endDate'),
              status: t('status'),
              timeStamp: t('timeStamp'),
            },
            Grid: {
              id: t('documentId'),
              name: t('name'),
              image: t('image'),
              note: t('note'),
              true: true,
              false: false,
              data: {
                Slu_string34: t('slug'),
                Arc_boolean158: t('isArchived'),
                Bro_boolean961: t('isDraft'),
              },
              timeStamp: t('timeStamp'),
            },
          },
        },
      });

      integryHandle.init({
        containerId: 'x-integry-container',
        showApps: true,
        renderMode: window.IntegryJS.RenderModes.INLINE,
        renderAppPageMode: window.IntegryJS.RenderModes.INLINE,
        renderFlowSetupMode: window.IntegryJS.RenderModes.INLINE,
        viewStyle: window.IntegryJS.ViewStyles.COMFORTABLE,
      });

      integryHandle.eventEmitter.on('did-save-integration', (data) => {
        processIntegration(data);
      });
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    const targetNode = document.getElementById('x-integry-container');
    const config = { childList: true, subtree: true };

    const textReplacements = [
      { original: 'No runs as yet', replacement: t('empty') },
      { original: 'Search for apps', replacement: t('search') },
      { original: 'Sorry, no apps found', replacement: t('noApps') },
      {
        original: 'cardsuninvoicedFlow',
        replacement: t('cardsuninvoicedFlow'),
      },
      { original: 'cardsinvoicedFlow', replacement: t('cardsinvoicedFlow') },
      { original: 'cardsexpenseFlow', replacement: t('cardsexpenseFlow') },
      { original: 'contactsFlow', replacement: t('contactsFlow') },
      { original: 'servicesFlow', replacement: t('servicesFlow') },
      { original: 'articlesFlow', replacement: t('articlesFlow') },
      { original: 'nodiesFlow', replacement: t('nodiesFlow') },
      { original: 'onCreation', replacement: t('onCreation') },
      { original: 'onModif', replacement: t('onModification') },
      { original: 'targ', replacement: t('onSelectField') },
      { original: 'sendMailNode', replacement: t('sendEmailNode') },
      { original: 'onNode', replacement: t('onNode') },
      { original: 'tasksFlow', replacement: t('tasksFlow') },
      { original: 'logsFlow', replacement: t('logsFlow') },
      { original: 'storagesFlow', replacement: t('storagesFlow') },
      { original: 'gridsFlow', replacement: t('gridsFlow') },
      { original: 'paymentsFlow', replacement: t('paymentsFlow') },
      { original: 'customFlow', replacement: t('customFlow') },
      { original: 'itemsFlow', replacement: t('itemsFlow') },
      { original: 'passesFlow', replacement: t('passesFlow') },
      { original: 'crFlow', replacement: t('crFlow') },
      { original: 'bothFlow', replacement: t('bothFlow') },
      { original: 'catcWE', replacement: t('catcWE') },
      { original: 'triggerCreateFlow', replacement: t('triggerCreateFlow') },
      { original: 'triggerUpdateFlow', replacement: t('triggerUpdateFlow') },
      { original: 'actionCreateFlow', replacement: t('actionCreateFlow') },
      { original: 'actionUpdateFlow', replacement: t('actionUpdateFlow') },
      { original: 'actionBothFlow', replacement: t('actionBothFlow') },
      { original: 'CAIV', replacement: t('CAIV') },
      { original: 'CAEX', replacement: t('CAEX') },
      { original: 'Not', replacement: t('no') },
      { original: 'Add an account...', replacement: t('add') },
      { original: 'No integrations found', replacement: t('empty') },
      { original: 'Connected', replacement: t('connected') },
      { original: 'Setup and enable', replacement: 'Configuration' },
      { original: 'to continue', replacement: t('toContinue') },
      { original: 'Account', replacement: t('account') },
      { original: 'Last run', replacement: t('lastRun') },
      {
        original: 'Your integration is ready to be updated. Click',
        replacement: t('updateIntegration'),
      },
      { original: 'Edit', replacement: t('edit') },
      { original: 'Delete', replacement: t('delete') },
      { original: 'Next', replacement: t('next') },
      {
        original:
          'Your integration is ready to be enabled. Click “Save” pour continuer.',
        replacement: t('confirmCreation'),
      },
      { original: 'Update', replacement: t('update') },
      { original: 'Confirm and activate', replacement: t('confirmActivate') },
      { original: 'Create', replacement: t('create') },
      { original: 'Continue', replacement: t('continue') },
      { original: ' in ', replacement: t('inSpace') },
      { original: 'Failed to load!', replacement: t('error') },
      {
        original:
          'Your integration is ready to be updated. Click “Update” to continue.',
        replacement: t('integrationConfirmText'),
      },
      { original: 'Flow created successfully', replacement: t('created') },
    ];

    // Function to replace multiple texts
    const replaceText = (node) => {
      node.childNodes.forEach((child) => {
        if (child.nodeType === Node.TEXT_NODE) {
          textReplacements.forEach(({ original, replacement }) => {
            if (child.nodeValue.includes(original)) {
              child.nodeValue = child.nodeValue.replace(original, replacement);
            }
          });
        } else if (child.nodeType === Node.ELEMENT_NODE) {
          replaceText(child);
        }
      });
    };

    // Callback function for the MutationObserver
    const callback = (mutationsList) => {
      for (const mutation of mutationsList) {
        if (mutation.type === 'childList') {
          replaceText(targetNode);
        }
      }
    };

    const observer = new MutationObserver(callback);
    if (targetNode) {
      observer.observe(targetNode, config);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className="p-3">
      <div id="x-integry-container"></div>
    </div>
  );
};

export default Marketplace;
