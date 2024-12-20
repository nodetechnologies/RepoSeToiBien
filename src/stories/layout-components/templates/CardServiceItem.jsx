// Utilities
import React, { useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { IconButton, Skeleton, Tooltip } from '@mui/material';
import * as modalActions from '../../../redux/actions/modal-actions';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import GeneralText from '../../general-components/GeneralText';
import { useTheme } from '@mui/material/styles';
import Input from '@mui/material/Input';
import nodeAxiosFirebase from '../../../utils/nodeAxiosFirebase';
import {
  AddShoppingCartOutlined,
  DeleteForeverOutlined,
  DragIndicator,
  DriveFileMoveOutlined,
  MenuOutlined,
} from '@mui/icons-material';
import { setGeneralStatus } from '../../../redux/actions-v2/coreAction';
import CardInput from './CardInput';
import NodeAIIcon from '../../../components/@generalComponents/layout/NodeAIIcon';
import Loading from '../../general-components/Loading';

const CardServiceItem = ({ items, addItemOnCard }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const theme = useTheme();
  const darkMode = theme?.palette?.mode === 'dark' || false;

  const singleCardDetails = useSelector(
    (state) => state.element.singleElementDetails
  );

  const currentStatus = useSelector((state) => state.core.status);

  const [groupedItems, setGroupedItems] = useState([]);
  const [itemsList, setItemsList] = useState([]);

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

  const handleDragEnd = useCallback(
    async (result) => {
      const { source, destination } = result;

      if (!destination) return;

      const reorderedGroups = Array.from(groupedItems);
      const [movedGroup] = reorderedGroups.splice(source.index, 1);
      reorderedGroups.splice(destination.index, 0, movedGroup);

      setGroupedItems(reorderedGroups);

      // Dispatch loading state and make API call
      try {
        dispatch(setGeneralStatus({ status: 'loading' }));

        await nodeAxiosFirebase({
          t,
          method: 'PATCH',
          url: `coreSeqV2/order`,
          body: {
            elementPath: 'cards/' + singleCardDetails?.id + '/' + 'items',
            items: reorderedGroups,
          },
        });

        dispatch(setGeneralStatus({ status: 'success' }));
      } catch (error) {
        console.error('Error updating order:', error);
        dispatch(setGeneralStatus({ status: 'error' }));
      }
    },
    [groupedItems, t, singleCardDetails, dispatch]
  );

  //opens modal to confirm deletion of service
  const deleteItemConfirmation = (itemId, type) => {
    dispatch(
      modalActions.modalConfirmation({
        isOpen: true,
        title: t('deleteItem'),
        message: t('deleteItemConfirmation'),
        handleConfirm: () => deleteItem(itemId, type),
      })
    );
  };

  const deleteItem = async (itemId, type) => {
    try {
      dispatch(
        setGeneralStatus({
          status: 'loading',
          position: 'delete-item' + itemId,
          type: 'circle',
        })
      );
      await nodeAxiosFirebase({
        t,
        method: 'DELETE',
        url: 'coreSeqV2',
        errorToast: t('makesureElementsDelete'),
        showLoading: true,
        body: {
          elementPath: 'cards/' + singleCardDetails?.id + '/items',
          elementId: itemId,
          type: type,
        },
      });
      dispatch(setGeneralStatus({ status: 'success' }));
    } catch (error) {
      console.error('Error deleting item');
    }
  };

  const updateItem = async (event, type, itemId) => {
    const newValue =
      type === 'unity' || type === 'quantity'
        ? parseFloat(event.target.value)
        : event?.target?.value || event;
    if (singleCardDetails?.id && type && itemId) {
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

  const calculateSubtotal = (groupKey) => {
    const items = groupedItems?.find(
      (group) => group?.groupKey === groupKey
    )?.items;

    if (!items) return 0;

    const subtotal = items.reduce((acc, item) => {
      const itemSubtotal = parseFloat(item?.finances?.subtotal);
      return acc + (isNaN(itemSubtotal) ? 0 : itemSubtotal);
    }, 0);

    return subtotal / 10000;
  };

  const calculateQuantity = (groupKey) => {
    const items = groupedItems?.find(
      (group) => group?.groupKey === groupKey
    )?.items;

    if (!items) return 0;

    const quantity = items.reduce((acc, item) => {
      const itemQuantity = parseFloat(item?.quantity);
      return acc + (isNaN(itemQuantity) ? 0 : itemQuantity);
    }, 0);

    return quantity;
  };

  const geminiOpen = (item) => {
    dispatch(
      modalActions.modalGemini({
        isOpen: true,
        item: {
          rephrase: item?.note,
          addData: item?.description,
          name: item?.name,
          profileDetails: singleCardDetails?.targetProfileId
            ? singleCardDetails?.targetProfileDetails?.name +
              ' ' +
              singleCardDetails?.targetProfileDetails?.attribute1 +
              ' ' +
              singleCardDetails?.targetProfileDetails?.attribute2 +
              ' ' +
              singleCardDetails?.targetProfileDetails?.attribute3
            : null,
          type: 'item',
        },
        handleConfirm: (suggestion) => {
          updateItem(suggestion, 'description', item?.id);
        },
      })
    );
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="all-groups" type="GROUPS">
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            style={{
              paddingRight: '35px',
              overflowY: 'auto',
              height: '100%',
            }}
            className="mt-1"
          >
            {groupedItems.map(({ groupKey, items }, groupIndex) => (
              <Draggable
                key={groupKey}
                draggableId={groupKey}
                index={groupIndex}
              >
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    style={{
                      ...provided.draggableProps.style,

                      position: 'relative',
                      border: darkMode
                        ? '1px solid #2d2d2d2'
                        : '1px solid #f2f2f2',
                      borderRadius: '6px 0px 6px 6px',
                      transform:
                        provided.draggableProps.style?.transform || 'none',
                      boxShadow: snapshot.isDragging
                        ? '0 2px 8px rgba(0, 0, 0, 0.2)'
                        : 'none',
                      backgroundColor: snapshot.isDragging
                        ? '#fafafa60'
                        : darkMode
                        ? '#33333360'
                        : '#fff',
                    }}
                    className="mb-3"
                  >
                    <div
                      style={{
                        right: 0,
                        top: 0,
                        position: 'absolute',
                        flexDirection: 'column',
                        display: 'flex',
                        marginRight: '-27px',
                        marginTop: '-1px',
                        backgroundColor: darkMode ? '#2d2d2d80' : '#f2f2f280',
                        borderRadius: '0px 15px 15px 0px',
                        paddingTop: '5px',
                        paddingBottom: '5px',
                      }}
                    >
                      <IconButton
                        color="primary"
                        size="small"
                        onClick={() => {
                          addItemOnCard(groupKey, 1);
                        }}
                      >
                        <Tooltip title={t('addArticle')}>
                          <AddShoppingCartOutlined fontSize="small" />
                        </Tooltip>
                      </IconButton>

                      <IconButton
                        size="small"
                        color="secondary"
                        onClick={() =>
                          deleteItemConfirmation(items[0]?.itemId, 'move')
                        }
                      >
                        <Tooltip title={t('moveToClient')}>
                          <DriveFileMoveOutlined fontSize="small" />
                        </Tooltip>
                      </IconButton>

                      <IconButton
                        disabled={
                          currentStatus?.status === 'loading' &&
                          currentStatus?.position?.startsWith('delete-item')
                        }
                        size="small"
                        color="error"
                        onClick={() =>
                          deleteItemConfirmation(items[0]?.itemId, 'group')
                        }
                      >
                        <Tooltip title={t('deleteGroup')}>
                          <DeleteForeverOutlined fontSize="small" />
                        </Tooltip>
                      </IconButton>
                    </div>

                    <div style={{ padding: '3px' }} className="d-flex">
                      <div
                        {...provided.dragHandleProps}
                        style={{
                          display: 'flex',
                          alignItems: 'left',
                          cursor: 'grab',
                          padding: '2px',
                          marginTop: '3px',
                        }}
                      >
                        <Tooltip title={t('drag')}>
                          <DragIndicator fontSize="small" />
                        </Tooltip>
                      </div>
                      <div>
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
                          ?.map((item, itemIndex) => {
                            return (
                              <div key={item?.id + itemIndex}>
                                {!singleCardDetails?.isProject && (
                                  <>
                                    <div
                                      style={{
                                        borderBottom: '0.85px solid black',
                                      }}
                                      className="d-flex"
                                    >
                                      <div className="col-5">
                                        <CardInput
                                          itemId={item?.id}
                                          updateItem={updateItem}
                                          value={item?.name}
                                          itemKey={'name'}
                                          isDarkMode={darkMode}
                                        />
                                      </div>
                                      <div className="col-2">
                                        <Input
                                          value={item?.sku}
                                          variant="standard"
                                          margin="none"
                                          sx={{
                                            fontSize: '12px',
                                            borderBottom:
                                              darkMode && '1px solid #FFFFFF40',
                                            marginTop: '1.5px',
                                          }}
                                          key={item?.id + 'sku'}
                                          disableUnderline
                                          name="unitPrice"
                                          fullWidth
                                          disabled
                                        />
                                      </div>
                                      <div className="col-1">
                                        <CardInput
                                          itemId={item?.id}
                                          updateItem={updateItem}
                                          value={item?.finances?.unity / 10000}
                                          itemKey={'unity'}
                                          type="number"
                                          isDarkMode={darkMode}
                                        />
                                      </div>
                                      <div className="col-1">
                                        <CardInput
                                          itemId={item?.id}
                                          updateItem={updateItem}
                                          value={item?.quantity}
                                          itemKey={'quantity'}
                                          type="number"
                                          isDarkMode={darkMode}
                                        />
                                      </div>
                                      <div className="col-2">
                                        <Input
                                          value={
                                            (
                                              item?.finances?.subtotal / 10000
                                            ).toFixed(2) ||
                                            (
                                              item?.finances?.unitPrice / 10000
                                            ).toFixed(2)
                                          }
                                          variant="standard"
                                          margin="none"
                                          sx={{
                                            fontSize: '12px',
                                          }}
                                          placeholder={t('subtotal')}
                                          type="number"
                                          name="unity"
                                          disableUnderline
                                          disabled
                                        />
                                      </div>
                                      <div
                                        style={{ marginTop: '3px' }}
                                        className="col-1"
                                      >
                                        <Input
                                          value={''}
                                          disabled
                                          variant="standard"
                                          size="small"
                                          margin="none"
                                          sx={{
                                            fontSize: '12px',
                                          }}
                                          disableUnderline
                                          endAdornment={
                                            <IconButton
                                              size="small"
                                              disabled={
                                                currentStatus?.status ===
                                                  'loading' &&
                                                currentStatus?.position?.startsWith(
                                                  'delete-item'
                                                )
                                              }
                                              onClick={() =>
                                                deleteItemConfirmation(
                                                  item?.id,
                                                  'single'
                                                )
                                              }
                                            >
                                              {currentStatus?.status ===
                                                'loading' &&
                                              currentStatus?.position ===
                                                'delete-item' + item?.id ? (
                                                <Loading
                                                  size="small"
                                                  type="circle"
                                                />
                                              ) : (
                                                <DeleteForeverOutlined />
                                              )}
                                            </IconButton>
                                          }
                                        />
                                      </div>
                                    </div>

                                    <div>
                                      {item?.finances?.options?.map(
                                        (option, index) => (
                                          <div key={option?.id + index}>
                                            {' '}
                                            {option?.price !== undefined && (
                                              <div
                                                style={{
                                                  fontSize: '11px',
                                                  marginTop: '5px',
                                                }}
                                              >
                                                {(option?.name || '') +
                                                  ' +' +
                                                  (option?.price / 10000 ||
                                                    '') +
                                                  ' $'}
                                              </div>
                                            )}
                                          </div>
                                        )
                                      )}
                                    </div>
                                  </>
                                )}
                                {(item?.hookedId.startsWith('services') ||
                                  singleCardDetails?.isProject) && (
                                  <>
                                    <div
                                      style={{
                                        borderBottom: '0.85px solid black',
                                      }}
                                      className="d-flex mb-1 mt-2 "
                                    >
                                      <div className="col-11">
                                        <CardInput
                                          itemId={item?.id}
                                          updateItem={updateItem}
                                          value={item?.description}
                                          isDarkMode={darkMode}
                                          itemKey={'description'}
                                        />
                                      </div>{' '}
                                      <div className="col-1">
                                        <Input
                                          value={''}
                                          disabled
                                          variant="standard"
                                          size="small"
                                          disableUnderline
                                          margin="none"
                                          endAdornment={
                                            <IconButton
                                              size="small"
                                              onClick={() => geminiOpen(item)}
                                            >
                                              <NodeAIIcon size={17} />
                                            </IconButton>
                                          }
                                        />
                                      </div>
                                    </div>
                                    <div
                                      style={{
                                        borderBottom: '0.85px solid black',
                                      }}
                                      className="mb-3"
                                    >
                                      <div className="col-11">
                                        <CardInput
                                          itemId={item?.id}
                                          updateItem={updateItem}
                                          value={item?.note}
                                          itemKey={'note'}
                                          isDarkMode={darkMode}
                                        />
                                      </div>
                                    </div>
                                  </>
                                )}
                              </div>
                            );
                          })}

                        {currentStatus?.status === 'loading' &&
                          currentStatus?.position === groupKey && (
                            <div>
                              <Loading type="skeleton" size="medium" />
                            </div>
                          )}
                        {!singleCardDetails?.isProject && (
                          <div className="row middle-content">
                            <div className="col-8">
                              <GeneralText
                                fontSize="10px"
                                text={
                                  items[0]?.targetProfileDetails?.name || ''
                                }
                                primary={true}
                                size="regular"
                              />
                            </div>

                            <div className="col-1">
                              <GeneralText
                                fontSize="10px"
                                text={calculateQuantity(groupKey)?.toFixed(1)}
                                primary={true}
                                size="regular"
                              />
                            </div>
                            <div className="col-1 align-right">
                              <GeneralText
                                fontSize="10px"
                                text={
                                  calculateSubtotal(groupKey)?.toFixed(2) + '$'
                                }
                                primary={true}
                                size="regular"
                              />
                            </div>
                            <div className="col-2 align-right"></div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
            {currentStatus?.status === 'loading' &&
              currentStatus?.position === 'add-item' && (
                <div>
                  <Loading type="skeleton" size="medium" />
                </div>
              )}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default CardServiceItem;
