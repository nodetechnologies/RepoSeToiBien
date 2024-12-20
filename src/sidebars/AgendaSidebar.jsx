import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import '../i18n'; // Ensure i18n is initialized
import moment from 'moment';
import { Typography } from '@mui/material';
import * as Icons from '@mui/icons-material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import {
  doc,
  collection,
  query,
  where,
  getDocs,
  onSnapshot,
  setDoc,
  orderBy,
  updateDoc,
  serverTimestamp,
  deleteDoc,
  collectionGroup,
} from 'firebase/firestore';
import { db } from '../firebase';
import { Button as ButtonMUI, ListItemIcon } from '@mui/material';
import Confetti from 'react-confetti';
import GeneralText from '../stories/general-components/GeneralText';
import { IconButton, List, ListItem, Tooltip } from '@mui/material';
import { AddTaskOutlined } from '@mui/icons-material';
import Blocks from '../stories/layout-components/Block';
import SingleElement from '../screens/lists/components/SingleElement';
import ModalLarge from '../modals/Base/ModalLarge';
import TextField from '../stories/general-components/TextField';
import Button from '../stories/general-components/Button';
import nodeAxiosFirebase from '../utils/nodeAxiosFirebase';
import Chip from '../stories/general-components/Chip';
import Loading from '../stories/general-components/Loading';
import { setGeneralStatus } from '../redux/actions-v2/coreAction';

const AgendaSidebar = ({ slots, setSlots }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.core.user);
  const businessPreference = useSelector((state) => state.core.businessData);
  const [showConfetti, setShowConfetti] = useState(false);
  const [selectedList, setSelectedList] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [listData, setListData] = useState(null);
  const [lists, setLists] = useState([]);
  const [modalUserList, setModalUserList] = useState(false);
  const [slotsTransit, setSlotsTransit] = useState([]);

  const employees = businessPreference?.employees;
  const businessRef = doc(db, 'businessesOnNode', businessPreference?.id);
  const userRef = doc(db, 'users', currentUser?.uid);

  useEffect(() => {
    if (selectedList) {
      if (selectedList === 'today') {
        const filteredSlots = slots?.filter(
          (slot) => moment().format('YYYY-MM-DD') === slot?.targetDate
        );
        setSlotsTransit(filteredSlots);
      } else if (selectedList === 'planned') {
        const filteredSlots = slots?.filter(
          (slot) =>
            moment().format('YYYY-MM-DD') < slot?.targetDate && slot?.targetDate
        );
        setSlotsTransit(filteredSlots);
      } else if (selectedList === 'lateAlert') {
        const filteredSlots = slots?.filter(
          (slot) =>
            moment().format('YYYY-MM-DD') > slot?.targetDate && slot?.targetDate
        );
        setSlotsTransit(filteredSlots);
      } else if (selectedList === 'all') {
        setSlotsTransit(slots);
      } else if (selectedList === 'completed') {
        const q = query(
          collectionGroup(db, 'slots'),
          where('userId', '==', userRef),
          where('isDone', '==', true),
          where('ownerId', '==', businessRef)
        );

        const fetchData = async () => {
          try {
            const querySnapshot = await getDocs(q);
            const data = querySnapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            setSlotsTransit(data);
          } catch (error) {
            console.error('Error fetching data: ', error);
            dispatch(setGeneralStatus({ status: 'error', error: error }));
          }
        };

        fetchData();
      } else {
        const filteredSlots = slots?.filter(
          (slot) => selectedList === slot?.listRef?.id
        );
        setSlotsTransit(filteredSlots);
      }
    }
  }, [selectedList, slots]);

  const handleCreateNewList = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setListData(null);
    setModalUserList(false);
  };

  const addSlot = async (title, duration, description) => {
    try {
      const listRef = doc(db, 'lists', selectedList);

      const newSlot = {
        title: title,
        duration: duration,
        description: description,
        startDate: null,
        endDate: null,
        isDone: false,
        userId: userRef,
        order: slots?.length + 1,
        ownerId: businessRef,
        listRef: listRef,
      };

      const docRef = doc(collection(listRef, 'slots'));

      await setDoc(docRef, newSlot);
    } catch (error) {
      console.error('Error fetching data');
      dispatch(setGeneralStatus({ status: 'error', error: error }));
    }
  };

  const updateSlot = async (slotId, key, value) => {
    try {
      const slotRef = doc(db, 'lists', selectedList, 'slots', slotId);

      if (key === 'isDone' && value === true) {
        setShowConfetti(true);
        await updateDoc(slotRef, {
          endDate: serverTimestamp(),
          isDone: true,
        });
        setTimeout(() => {
          setShowConfetti(false);
        }, 3400);
      } else if (key === 'startDate') {
        await updateDoc(slotRef, {
          startDate: serverTimestamp(),
        });
      } else if (key === 'title') {
        await updateDoc(slotRef, {
          title: value,
          iconAI: null,
          status: null,
        });
      } else {
        await updateDoc(slotRef, {
          [key]: value,
        });
      }
    } catch (error) {
      console.error('Error updating slot');
      dispatch(setGeneralStatus({ status: 'error', error: error }));
    }
  };

  const deleteSlot = async (slotId) => {
    try {
      const slotRef = doc(db, 'lists', selectedList, 'slots', slotId);
      await deleteDoc(slotRef);

      const newSlots = slotsTransit?.filter((slot) => slot.id !== slotId);
      setSlotsTransit(newSlots);
    } catch (error) {
      console.error('Error deleting slot');
      dispatch(setGeneralStatus({ status: 'error', error: error }));
    }
  };

  const Bloc = ({ index, slot, percentage, icon }) => {
    const [title, setTitle] = useState(slot?.title || '');
    const [description, setDescription] = useState(slot?.description || '');
    const [targetDate, setTargetDate] = useState(slot?.targetDate || '');

    return (
      <div
        style={{
          backgroundColor: `#FFF`,
          width: '100%',
          borderRadius: '10px',
          padding: '4px',
          marginTop: '20px',
        }}
      >
        <div
          style={{
            overflow: 'hidden',
            marginTop: '8px',
            position: 'relative',
            padding: '10px',
            borderRadius: '8px',
          }}
        >
          <div>
            <div
              style={{ paddingRight: '20px', borderBottom: '1px solid #ccc' }}
              className="d-flex middle-content"
            >
              {title && <>{icon}</>}
              <input
                type="text"
                value={title}
                onBlur={() => {
                  updateSlot(slot.id, 'title', title);
                }}
                onChange={(e) => {
                  setTitle(e.target.value);
                }}
                key={index + 'title'}
                placeholder={t('title')}
                style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  marginBottom: '5px',

                  background: 'transparent',
                  border: 'none',
                  width: '70%',
                  outline: 'none',
                }}
              />
            </div>
            <div>
              {!slot?.isDone && (
                <Tooltip title={t('done')}>
                  <Icons.Check
                    style={{
                      position: 'absolute',
                      right: '10px',
                      top: '10px',
                      cursor: 'pointer',
                    }}
                    fontSize="small"
                    onClick={() => {
                      updateSlot(slot.id, 'isDone', true);
                    }}
                  />
                </Tooltip>
              )}
              {slot?.isDone && (
                <Tooltip title={t('done')}>
                  <Icons.Delete
                    style={{
                      position: 'absolute',
                      right: '10px',
                      top: '10px',
                      cursor: 'pointer',
                    }}
                    fontSize="small"
                    onClick={() => {
                      deleteSlot(slot?.id);
                    }}
                  />
                </Tooltip>
              )}
            </div>
          </div>{' '}
          <div className="row">
            <input
              type="text"
              placeholder="Description"
              value={description || ''}
              onChange={(e) => {
                setDescription(e.target.value);
              }}
              onBlur={() => {
                updateSlot(slot.id, 'description', description);
              }}
              key={index + 'description'}
              style={{
                fontSize: '11px',
                marginTop: '6px',
                fontWeight: 400,
                width: '100%',
                background: 'transparent',
                border: 'none',
                outline: 'none',
              }}
            />{' '}
          </div>
          <div className="mt-2 d-flex middle-content">
            <input
              type="date"
              placeholder="Date"
              value={targetDate || ''}
              onChange={(e) => {
                setTargetDate(e.target.value);
              }}
              onBlur={() => {
                updateSlot(slot.id, 'targetDate', targetDate);
              }}
              key={index + 'targetDate'}
              style={{
                fontSize: '11px',
                marginTop: '6px',
                fontWeight: 400,
                width: '100%',
                background: 'transparent',
                border: 'none',
                paddingRight: '10px',
                outline: 'none',
              }}
            />{' '}
            {lists?.find((list) => list?.id === slot?.listRef?.id)?.name && (
              <Chip
                label={
                  lists?.find((list) => list?.id === slot?.listRef?.id)?.name
                }
                className="smallChipText mt-1"
                size="small"
              />
            )}
          </div>
        </div>
      </div>
    );
  };

  const handleDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    const items = Array.from(slots);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    //update in database
    items.forEach((item, index) => {
      updateSlot(item.id, 'order', index + 1);
    });

    setSlots(items);
  };

  const handleSelection = (listName) => {
    setSelectedList(listName);
  };

  const handleEmployeeSelection = async (name, uid, avatar) => {
    setModalUserList(false);
    try {
      const mergedUsers = [uid, ...(listData?.sharedWith || [])];

      const newList = {
        ...listData,
        sharedWith: mergedUsers,
      };

      const docRef = doc(db, 'lists', selectedList);
      await updateDoc(docRef, newList);
    } catch (error) {
      console.error('Error sharing list');
      dispatch(setGeneralStatus({ status: 'error', error: error }));
    }
  };

  const handleNewList = async () => {
    try {
      const newList = {
        name: listData?.name,
        userId: userRef,
        ownerId: businessRef,
      };

      const docRef = selectedList
        ? doc(db, 'lists', selectedList)
        : doc(collection(db, 'lists'));

      await setDoc(docRef, newList);
      setIsModalOpen(false);
      setListData(null);
      getLists();
    } catch (error) {
      console.error('Error creating list');
      dispatch(setGeneralStatus({ status: 'error', error: error }));
    }
  };

  useEffect(() => {
    if (businessPreference?.id && userRef && businessRef && lists?.length > 0) {
      const listsRef = lists?.map((list) => doc(db, 'lists', list?.id));
      const q = query(
        collectionGroup(db, 'slots'),
        where('isDone', '==', false),
        where('listRef', 'in', listsRef),
        orderBy('order', 'asc')
      );

      const unsubscribe = onSnapshot(
        q,
        (querySnapshot) => {
          const data = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setSlots(data);
        },
        (error) => {
          console.error('Error fetching data: ');
          dispatch(setGeneralStatus({ status: 'error', error: error }));
        }
      );

      return () => unsubscribe();
    }
  }, [businessPreference?.id, lists]);

  const getLists = async () => {
    try {
      setIsLoading(true);
      const lists = await nodeAxiosFirebase({
        t,
        method: 'POST',
        url: `coreMulti/agenda`,
        body: {},
      });
      setLists(lists);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching data: ');
      dispatch(setGeneralStatus({ status: 'error', error: error }));
    }
  };

  useEffect(() => {
    if (businessPreference?.id) {
      getLists();
    }
  }, [businessPreference?.id]);

  const handleEditList = (list) => {
    setListData(list);
    setIsModalOpen(true);
  };

  const handleDeleteList = async () => {
    try {
      const listRef = doc(db, 'lists', selectedList);
      await deleteDoc(listRef);
      setSelectedList(null);
      getLists();
    } catch (error) {
      console.error('Error deleting list');
      dispatch(setGeneralStatus({ status: 'error', error: error }));
    }
  };

  const handleShare = () => {
    setModalUserList(true);
  };

  return (
    <div className="p-3">
      <ModalLarge
        isOpen={isModalOpen}
        modalCloseHandler={handleModalClose}
        title={listData?.id ? t('update') : t('createNewList')}
      >
        <div className="mt-2">
          <TextField
            value={listData?.name}
            label={t('name')}
            type="text"
            fullWidth
            onChange={(e) =>
              setListData({
                ...listData,
                name: e.target.value,
              })
            }
          />
        </div>
        <div className="mt-2">
          <Button
            label={listData?.id ? t('update') : t('create')}
            fullWidth
            onClick={handleNewList}
          />
        </div>
      </ModalLarge>
      <ModalLarge
        isOpen={modalUserList}
        modalCloseHandler={handleModalClose}
        title={t('shareList')}
      >
        <div>
          {employees?.map((employee) => (
            <ButtonMUI
              key={employee?.uid}
              variant="outlined"
              ful
              color={'primary'}
              sx={{ width: '450px', marginBottom: '10px' }}
              onClick={() =>
                handleEmployeeSelection(
                  employee?.publicDisplay?.name || employee?.displayName,
                  employee?.uid,
                  employee?.avatar
                )
              }
            >
              <div className="row middle-content">
                <div className="col-2 align-left">
                  <img src={employee?.avatar} width={25} />{' '}
                </div>
                <div className="col-10 align-right">
                  {employee?.publicDisplay?.name || employee?.displayName}
                  <div style={{ fontSize: '9px', fontWeight: 400 }}>
                    {t(employee?.role)}
                  </div>
                </div>
              </div>
            </ButtonMUI>
          ))}
        </div>
      </ModalLarge>
      <div className="d-flex middle-content justify-content-between mb-2">
        <div>
          {selectedList && (
            <Tooltip title={t('returnLists')}>
              <span>
                <IconButton onClick={() => handleSelection(null)}>
                  <Icons.ArrowBack fontSize="medium" color="primary" />
                </IconButton>
              </span>
            </Tooltip>
          )}
          {selectedList && slotsTransit?.length === 0 && (
            <Tooltip title={t('deleteList')}>
              <span>
                <IconButton onClick={handleDeleteList}>
                  <Icons.DeleteOutlineOutlined
                    fontSize="medium"
                    color="primary"
                  />
                </IconButton>
              </span>
            </Tooltip>
          )}
          {selectedList !== null &&
            selectedList !== 'all' &&
            selectedList !== 'planned' &&
            selectedList !== 'lateAlert' &&
            selectedList !== 'completed' &&
            selectedList !== 'today' && (
              <Tooltip title={t('share')}>
                <span>
                  <IconButton onClick={handleShare}>
                    <Icons.CoPresentOutlined
                      fontSize="medium"
                      color="primary"
                    />
                  </IconButton>
                </span>
              </Tooltip>
            )}
          {selectedList !== null &&
            selectedList !== 'all' &&
            selectedList !== 'planned' &&
            selectedList !== 'lateAlert' &&
            selectedList !== 'completed' &&
            selectedList !== 'today' && (
              <Tooltip title={t('addElement')}>
                <span>
                  <IconButton onClick={() => addSlot('', 1, '')}>
                    <AddTaskOutlined fontSize="medium" color="primary" />
                  </IconButton>
                </span>
              </Tooltip>
            )}
        </div>
      </div>

      <div className="row">
        {selectedList &&
          lists
            ?.find((list) => list?.id === selectedList)
            ?.sharedWith?.map((shared) => (
              <div className="mt-1 col-4">
                <Chip
                  label={
                    employees?.find((employee) => employee?.uid === shared)
                      ?.displayName
                  }
                  icon={
                    <Icons.CoPresentSharp
                      fontSize="10px"
                      sx={{ marginRight: '4px' }}
                    />
                  }
                  size="small"
                  status={0}
                />
              </div>
            ))}
      </div>
      {!selectedList && (
        <div className="mt-2">
          <div className="d-flex">
            <div className="col-6 px-2 mt-2">
              <SingleElement
                heightPercentage={9}
                noIcons
                lengthNb={
                  slots?.filter(
                    (slot) => moment().format('YYYY-MM-DD') === slot?.targetDate
                  )?.length
                }
                icon={'EventOutlined'}
                handleElement={() => handleSelection('today')}
                element={{ name: t('today') }}
                color={'#1d16db'}
              />
            </div>
            <div className="col-6  px-1 mt-2">
              <SingleElement
                heightPercentage={9}
                noIcons
                lengthNb={
                  slots?.filter(
                    (slot) =>
                      moment().format('YYYY-MM-DD') > slot?.targetDate &&
                      slot?.targetDate
                  )?.length
                }
                icon={'ReportGmailerrorredOutlined'}
                handleElement={() => handleSelection('lateAlert')}
                element={{ name: 'Attention' }}
                color={'#e63737'}
              />
            </div>
          </div>
          <div className="d-flex">
            <div className="col-6 px-2 mt-3">
              <SingleElement
                heightPercentage={9}
                noIcons
                lengthNb={
                  slots?.filter(
                    (slot) =>
                      moment().format('YYYY-MM-DD') < slot?.targetDate &&
                      slot?.targetDate
                  )?.length
                }
                icon={'ScheduleOutlined'}
                handleElement={() => handleSelection('planned')}
                element={{ name: t('planned') }}
                color={'#f2d44b'}
              />
            </div>

            <div className="col-6 px-1 mt-3">
              <SingleElement
                heightPercentage={9}
                noIcons
                icon={'AssignmentTurnedInOutlined'}
                handleElement={() => handleSelection('completed')}
                element={{ name: t('completed') }}
                color={'#aadb21'}
              />
            </div>
          </div>{' '}
          <div className="d-flex">
            <div className="col-6  px-2 mt-3">
              <SingleElement
                heightPercentage={9}
                noIcons
                lengthNb={slots?.length}
                icon={'FolderCopyOutlined'}
                handleElement={() => handleSelection('all')}
                element={{ name: t('all') }}
                color={'#000000'}
              />
            </div>
          </div>
          <div className="row align-left mt-5 px-3">
            <div className="d-flex justify-content-between middle-content">
              {' '}
              <GeneralText
                text={t('myLists')}
                primary={true}
                fontSize="14px"
                size="medium"
              />{' '}
              <div style={{ marginRight: '-14px' }}>
                {lists?.length < 30 ? (
                  <IconButton onClick={handleCreateNewList}>
                    <Icons.AddOutlined fontSize="medium" />
                  </IconButton>
                ) : (
                  <Tooltip title={t('maxLists')}>
                    <Icons.AddOutlined fontSize="medium" />
                  </Tooltip>
                )}
              </div>
            </div>
            {isLoading && (
              <div className="d-flex justify-content-center">
                <Loading />
              </div>
            )}
            {!isLoading && (
              <List>
                {lists?.length > 0 &&
                  lists?.map((list) => (
                    <ListItem
                      divider
                      sx={{
                        paddingLeft: '8px',
                        paddingRight: '0px',
                      }}
                      secondaryAction={
                        <IconButton
                          edge="end"
                          size="small"
                          aria-label="edit"
                          onClick={() => handleEditList(list)}
                        >
                          <Icons.Edit fontSize="12px" />
                        </IconButton>
                      }
                      button={true}
                    >
                      <div
                        style={{ width: '100%' }}
                        className="d-flex"
                        onClick={() => handleSelection(list?.id)}
                      >
                        <div className="col-7">
                          <GeneralText
                            onClick={() => handleSelection(list?.id)}
                            text={list?.name}
                            primary={true}
                            fontSize="12px"
                            size="regular"
                          />
                        </div>
                        <div className="col-5">
                          {list?.sharedWith?.length > 0 && (
                            <Tooltip
                              title={
                                list?.userId !== currentUser?.uid
                                  ? t('sharedToYou')
                                  : t('youShare')
                              }
                            >
                              <span className="mt-1">
                                <ListItemIcon
                                  onClick={() => handleSelection(list?.id)}
                                  sx={{ marginLeft: '20px' }}
                                >
                                  <Icons.CoPresentOutlined
                                    fontSize="10px"
                                    color={
                                      list?.userId !== currentUser?.uid
                                        ? 'primary'
                                        : 'lightgrey'
                                    }
                                  />
                                </ListItemIcon>
                              </span>
                            </Tooltip>
                          )}
                        </div>
                      </div>
                    </ListItem>
                  ))}
              </List>
            )}
          </div>
        </div>
      )}
      {selectedList && (
        <div className="mt-4">
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="droppable">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {slotsTransit?.map((slot, index) => {
                    const IconComponent = Icons[slot?.iconAI] || Icons.Error;
                    return (
                      <Draggable
                        key={slot.id}
                        draggableId={slot.id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <Bloc
                              icon={
                                <IconComponent
                                  sx={{
                                    marginBottom: '5px',
                                    marginRight: '6px',
                                  }}
                                />
                              }
                              slot={slot}
                              index={index}
                            />
                          </div>
                        )}
                      </Draggable>
                    );
                  })}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
          {showConfetti && (
            <Confetti
              run={true}
              recycle={false}
              colors={[
                businessPreference?.mainColor,
                businessPreference?.secColor,
              ]}
              gravity={0.3}
            />
          )}
          {slotsTransit?.length === 0 && (
            <Blocks
              empty={true}
              emptyType="empty"
              height={1}
              heightPercentage={30}
              noBorder
              emptyMessage={t('createNewOne')}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default AgendaSidebar;
