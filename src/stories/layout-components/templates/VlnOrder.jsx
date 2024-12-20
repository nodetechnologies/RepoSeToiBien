import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

//utilities
import { useTranslation } from 'react-i18next';
import { db } from '../../../firebase';
import { collection, addDoc, serverTimestamp, doc } from 'firebase/firestore';
import { setGeneralStatus } from '../../../redux/actions-v2/coreAction';
import nodeAxiosFirebase from '../../../utils/nodeAxiosFirebase';

const VlnOrder = ({ _ }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const elementData = useSelector(
    (state) => state.element.singleElementDetails
  );

  const getData = async () => {
    dispatch(setGeneralStatus({ status: 'loading' }));
    await nodeAxiosFirebase({
      t,
      method: 'POST',
      url: `externalData`,
      collection: 'grids',
      body: {
        type: 'initiate',
        connector: 'vln',
        collection: 'grids',
        data: {
          query: '235/55R17',
          type: '1',
          e: '',
        },
      },
    });
    dispatch(setGeneralStatus({ status: 'success' }));
  };

  useEffect(() => {
    getData();
  }, [elementData]);

  return <div></div>;
};
export default VlnOrder;
