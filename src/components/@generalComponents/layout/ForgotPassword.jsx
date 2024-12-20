import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Redux
import { useTranslation } from 'react-i18next';

import GeneralText from '../../../stories/general-components/GeneralText';
import TextField from '../../../stories/general-components/TextField';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Button from '../../../stories/general-components/Button';
import nodeAxiosFirebase from '../../../utils/nodeAxiosFirebase';

const ForgotPassword = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [completeMessage, setCompleteMessage] = useState('');

  const businessResetPassword = async () => {
    try {
      const emailSent = await nodeAxiosFirebase({
        t,
        method: 'POST',
        url: `sendPasswordReset`,
        noAuth: true,
        body: {
          email: email,
        },
      });
      if (emailSent) {
        setCompleteMessage(t('emailSentMsgReset'));
      }
    } catch (error) {}
  };

  return (
    <div>
      <div className="mt-5 align-c">
        <LockOutlinedIcon sx={{ fontSize: '25px' }} />
        <GeneralText
          text={t('resetPasswordInst')}
          fontSize="14px"
          size="regular"
          primary={true}
          classNameComponent="mt-2"
        />
        {completeMessage ? (
          <div className="row align-c">
            <GeneralText
              text={completeMessage}
              fontSize="12px"
              size="regular"
              primary={true}
            />
          </div>
        ) : (
          <div>
            <div className="mt-3">
              <TextField
                autoComplete="username"
                id="email"
                name="email"
                fullWidth
                label={t('email')}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="align-c row mb-4">
              <div className="mt-2">
                <Button
                  label={t('resetPassword')}
                  onClick={businessResetPassword}
                  disableElevation
                />
              </div>
            </div>
          </div>
        )}
        <div className="align-c mt-3 row">
          <GeneralText
            text={t('backToLogin')}
            fontSize="11px"
            size="regular"
            color={'#696969'}
            primary={false}
            onClick={() => navigate('/signin')}
          />
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
