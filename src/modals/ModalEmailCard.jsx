import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import EmailVisualCard from './EmailVisualCard';
import Button from '../stories/general-components/Button';
import nodeAxiosFirebase from '../utils/nodeAxiosFirebase';
import TextField from '../stories/general-components/TextField';
import Select from '../stories/general-components/Select';
import Selection from '../stories/general-components/Selection';
import Blocks from '../stories/layout-components/Block';
import { setGeneralStatus } from '../redux/actions-v2/coreAction';
import Loading from '../stories/general-components/Loading';

const ModalEmailCard = ({ modalCloseHandler, type }) => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const currentLangCode = i18n.language;
  const [visualBody, setVisualBody] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState();
  const [selectedLang, setSelectedLang] = useState(currentLangCode || 'fr');

  const businessPreference = useSelector((state) => state.core.businessData);
  const singleCardDetails = useSelector(
    (state) => state.element.singleElementDetails
  );
  const currentStatus = useSelector((state) => state.core.status);
  const [email, setEmail] = useState(
    singleCardDetails?.targetDetails?.email || ''
  );

  const emailTemplates = businessPreference?.emails?.map((template) => {
    return {
      subject: template?.subject,
      body: template?.body,
      label: template?.name,
      value: template?.id,
      id: template?.id,
      isInvoiced: template?.isInvoiced,
      isProject: template?.isProject,
      isDefault: template?.isDefault || false,
    };
  });

  const emailChoices = emailTemplates?.filter(
    (template) => template?.isDefault === false
  );

  const formatItems = (items) => {
    const itemsArray = Object.values(items);
    // Map over the filtered items
    return itemsArray?.map((item) => {
      const hasPasses =
        Array.isArray(item?.service?.passes) &&
        item?.service?.passes.length > 0;
      const firstPass = hasPasses ? item?.service?.passes[0] : null;

      return {
        name: item?.name?.replace(/\s*\([^)]*\)/g, '').trim(),
        variable: item?.profileDetails?.profileName || '',
        second: firstPass?.isWaiting
          ? t('waiting')
          : firstPass
          ? t('confirmed')
          : '',
      };
    });
  };

  const handleTemplateChange = (event, id) => {
    const selectedTemplate = emailTemplates?.find(
      (template) => template?.value === id
    );

    if (selectedTemplate) {
      setSelectedTemplate(selectedTemplate?.value);
      setVisualBody(selectedTemplate?.isDefault ? '' : selectedTemplate?.body);
    }
  };

  const matchedTemplate = emailTemplates?.find(
    (template) =>
      template?.isDefault === true &&
      singleCardDetails?.isProject === template?.isProject &&
      singleCardDetails?.isInvoiced === template?.isInvoiced
  );

  const formattedItems = formatItems(singleCardDetails?.items || []);
  const sendEmail = async () => {
    try {
      const receivers = [
        {
          email: email,
          name: singleCardDetails?.targetDetails?.name || '',
          variable4: singleCardDetails?.isInvoiced
            ? 'Total ' +
              (singleCardDetails?.finances?.total / 10000)?.toFixed(2) +
              ' $'
            : '',
          action_url: `https://usenode.com/redirect/${businessPreference?.id}/${singleCardDetails?.structureDetails?.name}/${singleCardDetails?.structureDetails?.id}/${singleCardDetails?.id}?accessCode=${singleCardDetails?.accessCode}&shared=true`,
          items: formattedItems,
        },
      ];
      dispatch(
        setGeneralStatus({
          status: 'loading',
          position: 'modal',
          type: 'pulse',
        })
      );
      await nodeAxiosFirebase({
        method: 'POST',
        url: 'emails-send',
        body: {
          templateId: selectedTemplate,
          dependencyId: singleCardDetails?.id,
          receivers: receivers,
          bodyMessage: visualBody,
          lang: selectedLang,
          dependencyCollection: 'cards',
        },
      });
      dispatch(
        setGeneralStatus({
          status: 'success',
          position: 'modal',
          type: 'pulse',
        })
      );
    } catch (error) {
      console.error('Failed to send email');
      dispatch(setGeneralStatus({ status: 'error', error: error }));
    }

    setVisualBody('');
    setEmail('');
    modalCloseHandler();
  };

  const handleBodyChange = (e) => {
    setVisualBody(e);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  return (
    <div className="hei-10 p-2 d-flex">
      {currentStatus?.status === 'loading' &&
      currentStatus?.position === 'modal' ? (
        <div className={'col-5 mt-5'}>
          <Loading type={'logo'} size="medium" />
        </div>
      ) : (
        <div className={'col-5 mt-5'}>
          <TextField
            label={t('email')}
            primary={true}
            name="subject"
            fullWidth
            type="text"
            value={email}
            onChange={(event) => handleEmailChange(event)}
          />
          <Select
            value={selectedTemplate}
            onChange={(e, id) => handleTemplateChange(e, id)}
            name="templates"
            selections={emailChoices}
            label={t('templates')}
          />
          <Selection
            value={selectedLang}
            onChange={(e, value) => setSelectedLang(value)}
            field={{
              typeData: 'selectionNode',
              required: false,
            }}
            selections={[
              {
                label: 'English',
                value: 'en',
                id: 'en',
                color: businessPreference?.mainColor,
              },
              {
                label: 'Français',
                value: 'fr',
                id: 'fr',
                color: businessPreference?.secColor,
              },
            ]}
            label={t('language')}
          />

          <TextField
            label={t('message')}
            primary={true}
            name="subject"
            fullWidth
            type="text"
            multiline
            rows={6}
            value={visualBody}
            onChange={(event) => handleBodyChange(event.target.value)}
          />
          <div className="mt-3">
            <Button
              label={t('send')}
              size="md"
              fullWidth
              onClick={sendEmail}
              primary={true}
              restrict={['STANDARD', 'VIEWER']}
            />
          </div>
        </div>
      )}
      <div className={'col-7 px-5'}>
        <Blocks heightPercentage={75} height={1}>
          <EmailVisualCard
            business_entity={businessPreference?.entityId}
            business_name={
              businessPreference?.publicName || businessPreference?.name
            }
            selectLang={selectedLang}
            variable2={visualBody}
            name={singleCardDetails?.targetDetails?.name || ''}
            variable1={singleCardDetails?.searchId}
            variable3={singleCardDetails?.name}
            variable4={
              singleCardDetails?.isInvoiced
                ? 'Total ' +
                  singleCardDetails?.finances?.total?.toFixed(2) +
                  ' $'
                : singleCardDetails?.isProject
                ? t('project')
                : t('quote')
            }
            items={formattedItems}
            body={matchedTemplate?.body}
            subject={matchedTemplate?.subject}
            isInvoiced={singleCardDetails?.isInvoiced}
          />
        </Blocks>
      </div>
    </div>
  );
};

export default ModalEmailCard;
