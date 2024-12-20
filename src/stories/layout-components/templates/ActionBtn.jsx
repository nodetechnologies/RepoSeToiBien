import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

//utilities
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

//components
import Button from '../../general-components/Button';
import nodeAxiosFirebase from '../../../utils/nodeAxiosFirebase';
import { setGeneralStatus } from '../../../redux/actions-v2/coreAction';

const ActionBtn = ({ elementDetails }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { search } = useLocation();

  const accessToken = new URLSearchParams(search).get('accessToken');
  const accessCode = new URLSearchParams(search).get('accessCode');

  const handleAction = async () => {
    try {
      await nodeAxiosFirebase({
        t,
        method: 'POST',
        url: `cards-confirm`,
        noAuth: true,
        body: {
          elementId: elementDetails?.elementData?.id,
          accessCode: accessToken || accessCode,
          field: 'status',
          value: parseInt(1),
        },
      });
      window.location.reload();
    } catch (error) {
      console.error('Error fetching data');
      dispatch(setGeneralStatus({ status: 'error', error: error }));
    }
  };

  return (
    <div>
      <div>
        <Button
          fullWidth
          label={'Marquer comme traitée'}
          onClick={handleAction}
          endIcon="SwitchAccessShortcutOutlined"
          buttonSx={{
            backgroundColor: '#000',
          }}
          classNameComponent="capitalize hover"
        />
      </div>
    </div>
  );
};
export default ActionBtn;
