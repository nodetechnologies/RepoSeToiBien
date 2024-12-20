import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import * as modalActions from '../../../redux/actions/modal-actions';
import { db } from '../../../firebase';
import { onSnapshot, collection } from 'firebase/firestore';
import ErrorBoundary from '../../../components/@generalComponents/ErrorBoundary';

// Components
import CardServiceItem from './CardServiceItem';
import { setGeneralStatus } from '../../../redux/actions-v2/coreAction';

const CardMainPanel = ({ handleAddItem, cardIden, fromDrawer }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const singleCardDetails = useSelector(
    (state) => state.element.singleElementDetails
  );

  const isProject = singleCardDetails?.isProject;

  //get items from the card in firebase
  const [items, setItems] = useState([]);
  const cardId = cardIden || singleCardDetails?.id;

  useEffect(() => {
    let unsubscribe = () => {};

    if (cardIden || singleCardDetails?.id) {
      const itemsRef = collection(db, 'cards', cardId, 'items');

      // Listen for real-time updates with onSnapshot
      unsubscribe = onSnapshot(
        itemsRef,
        (querySnapshot) => {
          const updatedItems = [];
          querySnapshot.forEach((doc) => {
            updatedItems.push({
              ...doc.data(),
              id: doc.id,
              finances: {
                ...doc.data().finances,
                incomeLine: doc.data().finances?.incomeLine?.path,
                expenseLine: doc.data().finances?.expenseLine?.path,
              },
              targetId: doc.data().targetId?.id || '',
              ownerId: doc.data().ownerId?.id || '',
              dependencyId: doc.data().dependencyId?.id || '',
              targetProfileId: doc.data().targetProfileId?.id || '',
              structureId: doc.data().structureId?.id || '',
              itemRef: doc.data()?.itemRef?.path || '',
              hookedId: doc.data()?.hookedId?.path || '',
            });
          });
          setItems(updatedItems);
        },
        (error) => {
          console.error('Failed to subscribe to changes in items');
          dispatch(setGeneralStatus({ status: 'error', error: error }));
        }
      );
    }

    return () => unsubscribe();
  }, [cardId]);

  const addItemOnCard = (group, tab) => {
    if (cardId) {
      dispatch(
        modalActions.modalAddItem({
          isOpen: true,
          group: group,
          defaultTab: tab,
          onSelect: handleAddItem,
        })
      );
    } else {
      toast.error(t('error'));
    }
  };

  return (
    <ErrorBoundary>
      <div
        style={{
          marginLeft: fromDrawer ? '0px' : '10px',
          width: '100%',
          minWidth: fromDrawer ? '50vh' : '60vh',
        }}
      >
        <CardServiceItem
          fromDrawer={fromDrawer}
          isProject={isProject}
          addItemOnCard={addItemOnCard}
          showArticles={false}
          items={items}
        />
      </div>
    </ErrorBoundary>
  );
};

export default CardMainPanel;
