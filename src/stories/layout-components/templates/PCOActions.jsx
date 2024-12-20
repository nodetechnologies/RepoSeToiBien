import React from 'react';
import { useSelector } from 'react-redux';

//utilities
import { useTranslation } from 'react-i18next';
import { db } from '../../../firebase';
import { collection, addDoc, serverTimestamp, doc } from 'firebase/firestore';

//components
import Button from '../../general-components/Button';

const PCOActions = ({ _ }) => {
  const { t } = useTranslation();

  const elementData = useSelector(
    (state) => state.element.singleElementDetails
  );

  const currentUser = useSelector((state) => state.core.user);
  const businessFirebaseID = localStorage.getItem('businessId');

  const businessPreference = useSelector((state) => state.core.businessData);

  const handleActionSec = async () => {};
  const formattedPhone = elementData?.targetPhone?.replace(/\s/g, '');

  const handleActionThird = async () => {
    const businessRef = doc(db, 'businessesOnNode', businessFirebaseID);
    window.location.href = `tel:${elementData?.targetPhone}`;
    await addDoc(collection(db, 'grids', elementData?.id, 'logs'), {
      elementId: elementData?.id,
      description: t('callInitiated') + ': ' + elementData?.targetPhone,
      timeStamp: serverTimestamp(),
      reference: formattedPhone,
      name: currentUser?.displayName || '-',
      type: 'action:call',
      ownerId: businessRef,
      targetId: null,
      assignedToId: currentUser?.uid || null,
      isDone: false,
    });
  };

  return (
    <div>
      <div>
        <Button
          fullWidth
          label={t('convert')}
          onClick={handleActionSec}
          endIcon="SwitchAccessShortcutOutlined"
          buttonSx={{
            backgroundColor: '#000',
          }}
          classNameComponent="capitalize hover"
        />
      </div>
      <div className="mt-3 mb-3">
        <Button
          fullWidth
          label={t('makeCall')}
          onClick={handleActionThird}
          endIcon="Call"
          buttonSx={{
            backgroundColor: businessPreference?.mainColor || '#000',
          }}
          classNameComponent="capitalize hover"
        />
      </div>
      <div className="mt-3 mb-3">
        <Button
          fullWidth
          label={t('sendSignature')}
          onClick={handleActionThird}
          endIcon="DrawOutlined"
          buttonSx={{
            backgroundColor: businessPreference?.secColor || '#000',
          }}
          classNameComponent="capitalize hover"
        />
      </div>
    </div>
  );
};
export default PCOActions;
