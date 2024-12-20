import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

//utilities
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

//components
import Button from '../../general-components/Button';
import nodeAxiosFirebase from '../../../utils/nodeAxiosFirebase';
import Confetti from 'react-confetti';
import { setGeneralStatus } from '../../../redux/actions-v2/coreAction';

const ActionBtnDone = ({ elementDetails }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showConfetti, setShowConfetti] = useState(false);

  const elementData = useSelector(
    (state) => state.element.singleElementDetails
  );
  const navigateBack = () => {
    const history = localStorage.getItem('history')
      ? JSON.parse(localStorage.getItem('history'))
      : [];
    const lastElementMinusOne = history[history?.length - 2];
    navigate(lastElementMinusOne?.url || lastElementMinusOne?.pathname);
  };

  const handleAction = async () => {
    const pathWithoutId = elementData?.documentPath.split('/');
    pathWithoutId.pop();
    const path = pathWithoutId.join('/');

    try {
      setShowConfetti(true);
      await nodeAxiosFirebase({
        t,
        method: 'PATCH',
        url: `coreSeqV2`,
        body: {
          documentId: elementData?.id,
          elementPath: path,
          key: 'isDone',
          value: true,
        },
      });

      setTimeout(() => {
        navigateBack();
        setShowConfetti(false);
      }, 2000);
    } catch (error) {
      console.error('Error fetching data');
      dispatch(setGeneralStatus({ status: 'error', error: error }));
    }
  };

  return (
    <div>
      <Button
        fullWidth
        label={elementDetails?.data[0]?.field || t('action')}
        onClick={handleAction}
        buttonSx={{
          backgroundColor: '#000',
        }}
        classNameComponent="capitalize hover"
      />
      {showConfetti && <Confetti />}
    </div>
  );
};
export default ActionBtnDone;
