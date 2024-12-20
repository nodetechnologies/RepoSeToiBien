//utilities
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material/styles';
import { setGeneralStatus } from '../redux/actions-v2/coreAction';
import Loading from '../stories/general-components/Loading';
//components
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.bubble.css';
import Button from '../stories/general-components/Button';
import TextField from '../stories/general-components/TextField';
import EmailVisual from './EmailVisual';
import nodeAxiosFirebase from '../utils/nodeAxiosFirebase';
import Blocks from '../stories/layout-components/Block';

import { FormControl, InputLabel } from '@mui/material';
import { useParams } from 'react-router';

const SendEmail = ({ modalCloseHandler }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [subject, setSubject] = useState('');
  const [email, setEmail] = useState();
  const [visualBody, setVisualBody] = useState('');
  const { moduleName } = useParams();
  const [name, setName] = useState('');
  const theme = useTheme();

  const isDarkmode = theme.palette.mode === 'dark';
  const currentUser = useSelector((state) => state.core.user);
  const businessPreference = useSelector((state) => state.core.businessData);
  const currentStatus = useSelector((state) => state.core.status);
  const elementData = useSelector(
    (state) => state.element.singleElementDetails
  );

  function handleBodyChange(value) {
    setVisualBody(value);
  }

  useEffect(() => {
    if (elementData?.targetEmail) {
      setEmail(elementData?.targetEmail);
    }
    if (elementData?.email) {
      setEmail(elementData?.email);
    }
    if (elementData?.targetDetails?.email) {
      setEmail(elementData?.targetDetails?.email);
    }
    if (elementData?.name) {
      setName(elementData?.name);
    }
  }, [elementData]);

  const currentEmployee = businessPreference?.employees?.find(
    (employee) => employee?.id === currentUser?.uid
  );

  const userName = currentEmployee?.publicDisplay?.name;
  const userPhone = currentEmployee?.publicDisplay?.phone;
  const userEmail = currentEmployee?.publicDisplay?.email;
  const userTitle = currentEmployee?.publicDisplay?.title;

  const sendEmail = async () => {
    try {
      const receivers = [
        {
          email: email,
          name: name || '',
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
          receivers: receivers,
          subject: subject,
          body: visualBody,
          dependencyId: elementData?.documentIdentifiant,
          dependencyCollection: moduleName,
          bodyMessage: visualBody,
        },
      });
      dispatch(
        setGeneralStatus({
          status: 'success',
          position: 'modal',
          type: 'pulse',
        })
      );
      modalCloseHandler();
    } catch (error) {
      console.error('Failed to send email');
      dispatch(setGeneralStatus({ status: 'error', error: error }));
    }
  };

  return (
    <div className="hei-10 p-2 d-flex">
      {currentStatus?.status === 'loading' &&
      currentStatus?.position === 'modal' ? (
        <div className={'col-5 mt-2'}>
          <Loading type={'logo'} size="medium" />
        </div>
      ) : (
        <div className={'col-5 mt-5'}>
          <TextField
            label={t('email')}
            primary={true}
            name="email"
            fullWidth
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label={t('subject')}
            primary={true}
            name="subject"
            fullWidth
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
          {/* <Select
          value={selectedTemplate}
          onChange={(e, id) => handleTemplateChange(e, id)}
          name="templates"
          selections={emailChoices}
          label={t('templates')}
        /> */}
          <FormControl
            fullWidth
            margin="normal"
            sx={{
              border: '1px solid lightgray',
              borderRadius: '10px',
              padding: '10px',
              minHeight: '50px',
            }}
          >
            <InputLabel
              shrink={true}
              sx={{
                backgroundColor: isDarkmode ? 'rgb(51,51,51)' : '#FFF',
                padding: '2px 10px 2px 10px',
                borderRadius: '10px',
              }}
            >
              {'Message'}
            </InputLabel>{' '}
            <ReactQuill
              theme="bubble"
              value={visualBody}
              onChange={handleBodyChange}
              modules={{
                history: {
                  delay: 2000,
                  maxStack: 500,
                  userOnly: true,
                },
              }}
            />
          </FormControl>
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
      <div className={'col-7  px-5'}>
        <Blocks heightPercentage={55} height={1}>
          <EmailVisual
            business_entity={businessPreference?.id}
            business_name={businessPreference?.name}
            body={visualBody}
            email={email}
            subject={subject}
            user_name={userName}
            user_phone={userPhone}
            user_title={userTitle}
            website={businessPreference?.website}
          />
        </Blocks>
      </div>
    </div>
  );
};

export default SendEmail;
