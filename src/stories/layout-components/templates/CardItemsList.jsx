import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../../../firebase';
import { useTheme } from '@mui/material/styles';
import ErrorBoundary from '../../../components/@generalComponents/ErrorBoundary';
import nodeAxiosFirebase from '../../../utils/nodeAxiosFirebase';
import Input from '@mui/material/Input';
import { Divider } from '@mui/material';
import { setGeneralStatus } from '../../../redux/actions-v2/coreAction';

const CardItemsList = ({ heightPercentage, cardIden, layout }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const theme = useTheme();
  const darkMode = theme?.palette?.mode === 'dark' || false;

  const [groupedItems, setGroupedItems] = useState([]);
  const singleCardDetails = useSelector(
    (state) => state.element.singleElementDetails
  );

  //get items from the card in firebase
  const [items, setItems] = useState([]);
  const [itemsList, setItemsList] = useState([]);
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
              finances: {
                ...doc.data().finances,
                incomeLine: doc.data().finances?.incomeLine?.path,
                expenseLine: doc.data().finances?.expenseLine?.path,
              },
              categoryId: doc.data().categoryId?.id || null,
              id: doc.id,
              targetId: doc.data().targetId?.id || '',
              ownerId: doc.data().ownerId?.id || '',
              structureId: doc.data().structureId?.id || '',
              dependencyId: doc.data().dependencyId?.id || '',
              targetProfileId: doc.data().targetProfileId?.id || '',
              hookedId: doc.data()?.hookedId.path || '',
              itemRef: doc.data()?.itemRef?.path || '',
            });
          });
          setItems(updatedItems);
        },
        (error) => {
          // Handle any errors
          console.error('Failed to subscribe to changes in items');
          dispatch(setGeneralStatus({ status: 'error', error: error }));
        }
      );
    }

    // Cleanup subscription on component unmount
    return () => unsubscribe();
  }, [cardId]);

  useEffect(() => {
    if (itemsList) {
      // Group and sort items
      const grouped = itemsList?.reduce((acc, item) => {
        const groupKey = item?.group || 'other'; // Default group if not specified
        if (!acc[groupKey]) {
          acc[groupKey] = { services: [], others: [] };
        }
        // Assuming each item has an itemId property
        const itemWithId = { ...item, itemId: item?.id };

        // Categorize into 'services' or 'others' based on hookedId
        if (
          item?.hookedId?.startsWith('services') ||
          item?.hookedId?.startsWith('/services')
        ) {
          acc[groupKey].services.push(itemWithId);
        } else {
          acc[groupKey].others.push(itemWithId);
        }
        return acc;
      }, {});

      // Sort each group internally (optional)
      Object.values(grouped).forEach((group) => {
        group.services.sort((a, b) =>
          (a.order?.toString() || a.name).localeCompare(
            b.order?.toString() || b.name
          )
        );
        group.others.sort((a, b) =>
          (a.order?.toString() || a.name).localeCompare(
            b.order?.toString() || b.name
          )
        );
      });

      // Combine the 'others' first, followed by 'services'
      const sortedItems = Object.entries(grouped)
        .sort(([groupKeyA], [groupKeyB]) => groupKeyA.localeCompare(groupKeyB))
        .map(([groupKey, group]) => ({
          groupKey,
          items: [...group.others, ...group.services],
        }));

      setGroupedItems(sortedItems);
    }
  }, [itemsList]);

  useEffect(() => {
    if (items) {
      setItemsList(items);
    }
  }, [items]);

  const handleFieldChange = (event, type, itemId) => {
    setItemsList((prevState) =>
      prevState.map((item) => {
        if (item.id === itemId) {
          return {
            ...item,
            note: event.target.value,
          };
        }
        return item;
      })
    );
  };

  const updateItem = async (event, type, itemId) => {
    const newValue =
      type === 'unity' || type === 'quantity'
        ? parseFloat(event.target.value)
        : event.target.value;
    if (type && itemId) {
      dispatch(setGeneralStatus({ status: 'loading' }));
      await nodeAxiosFirebase({
        t,
        method: 'PATCH',
        url: `coreSeqV2`,
        body: {
          documentId: itemId,
          elementPath: 'cards/' + singleCardDetails?.id + '/' + 'items',
          key: type,
          value: newValue === '' ? '-' : newValue,
        },
      });
      dispatch(setGeneralStatus({ status: 'success' }));
    }
  };

  return (
    <ErrorBoundary>
      {cardId === singleCardDetails?.id && (
        <div style={{ height: heightPercentage + 'vh' }}>
          <div
            style={{
              color: '#69696970',
              fontSize: '11px',
              textAlign: 'center',
              marginBottom: '6px',
              paddingTop: '-6px',
            }}
          >
            {layout?.header?.displayTotal !== null
              ? t('totalItems') + ': ' + groupedItems?.length
              : ''}
          </div>
          {groupedItems?.map(({ groupKey, items }, groupIndex) => (
            <div
              key={groupKey + groupIndex}
              style={{
                border: darkMode ? '1px solid #2d2d2d' : '1px solid #f2f2f2',
                borderRadius: '10px 0px 10px 10px',
                padding: '12px',
              }}
              className="mb-4"
            >
              {items
                ?.sort((a, b) => {
                  if (
                    a.hookedWith?.startsWith('services') &&
                    b.hookedWith?.startsWith('articles')
                  ) {
                    return -1;
                  } else if (
                    a.hookedWith?.startsWith('articles') &&
                    b.hookedWith?.startsWith('services')
                  ) {
                    return 1;
                  } else {
                    return 0;
                  }
                })
                ?.map((item, itemIndex) => (
                  <div key={item?.id + itemIndex}>
                    <div className="d-flex">
                      {item?.hookedId.startsWith('services') && (
                        <div
                          className="mt-1"
                          style={{
                            fontWeight: 600,
                            fontSize: '16px',
                            marginRight: '10px',
                          }}
                        >
                          {groupIndex + 1 + '. '}
                        </div>
                      )}
                      <div className={item?.sku ? 'col-8' : 'col-11'}>
                        <Input
                          value={item?.name}
                          variant="standard"
                          key={item?.id + 'name'}
                          margin="none"
                          bold={item?.isService ? true : false}
                          name="name"
                          disableUnderline
                          placeholder={t('name')}
                          fullWidth
                        />
                      </div>

                      <div className={item?.sku ? 'col-3' : 'hide'}>
                        <Input
                          value={item?.sku}
                          variant="standard"
                          key={item?.id + 'sku'}
                          margin="none"
                          disableUnderline
                          name="unitPrice"
                          fullWidth
                          disabled
                        />
                      </div>
                    </div>

                    {item?.hookedId.startsWith('services') && (
                      <>
                        <div className="mb-3">
                          <div className="col-11">
                            <Input
                              value={item?.note}
                              variant="standard"
                              maxLength={350}
                              onChange={(event) =>
                                handleFieldChange(event, 'note', item?.id)
                              }
                              key={item?.id + 'intnotes'}
                              type="search"
                              multiline={true}
                              startRows={1}
                              fullWidth
                              iconStart="EditNote"
                              placeholder={t('internalNotes')}
                              margin="none"
                              size="small"
                              onBlur={(event) =>
                                updateItem(event, 'note', item?.id)
                              }
                            />
                          </div>
                        </div>
                      </>
                    )}
                    <Divider component="div" />
                  </div>
                ))}
            </div>
          ))}
        </div>
      )}
    </ErrorBoundary>
  );
};

export default CardItemsList;
