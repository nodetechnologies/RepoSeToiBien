import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.bubble.css';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import * as modalActions from '../../redux/actions/modal-actions.js';
import { EmojiButton } from '@joeattardi/emoji-button';
import { Autocomplete } from '@mui/material';
// utilities
import { useTranslation } from 'react-i18next';
import { db } from '../../firebase.js';
import {
  query,
  updateDoc,
  Timestamp,
  addDoc,
  runTransaction,
  arrayUnion,
  collection,
  getDoc,
  where,
  limit,
  orderBy,
  onSnapshot,
  doc,
} from 'firebase/firestore';

// components
import { useTheme } from '@mui/material/styles';
import { Menu, MenuItem, FormControl, InputLabel } from '@mui/material';
import TextField from '../../stories/general-components/TextField.jsx';
import TextFieldMUI from '@mui/material/TextField';
import Blocks from '../../stories/layout-components/Block.jsx';
import MainLayoutV2 from '../../layouts/MainLayoutV2.jsx';
import MessageGeneral from '../../components/@generalComponents/MessageGeneral.jsx';
import {
  setGeneralStatus,
  setRoom,
} from '../../redux/actions-v2/coreAction.js';
import nodeAxiosFirebase from '../../utils/nodeAxiosFirebase.js';
import { Divider } from '@material-ui/core';
import ModalLarge from '../../modals/Base/ModalLarge.jsx';
import Button from '../../stories/general-components/Button.jsx';
import IconUploader from '../../components/@generalComponents/IconUploader.jsx';
import NodiesElements from './components/NodiesElements.jsx';
import NodiesPoints from './components/NodiesPoints.jsx';

const ListDrop = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { nodeId } = useParams();
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  const tabs = [
    { label: t('elements'), icon: 'PortraitOutlined', id: 0 },
    { label: t('points'), icon: 'ListAlt', id: 1 },
  ];

  const [list, setList] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();

  const [allMessages, setAllMessages] = useState([]);
  const [newMessageServer, setNewMessageServer] = useState('');
  const [nodeData, setNodeData] = useState(null);
  const [selectedEmoji, setSelectedEmoji] = useState(null);
  const [newDropData, setNewDropData] = useState(null);
  const [insideFolder, setInsideFolder] = useState(false);
  const [activeFolder, setActiveFolder] = useState(null);
  const buttonRef = useRef(null);

  const businessPreference = useSelector((state) => state.core.businessData);
  const currentStatus = useSelector((state) => state.core.status);
  const room = useSelector((state) => state.core.room);
  const businessStructure = useSelector(
    (state) => state.core.businessStructure
  );
  const businessStructures = businessStructure?.structures || [];

  const [inputKey, setInputKey] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [currentAddType, setCurrentAddType] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const activeIndex = parseInt(searchParams.get('tab')) || 0;
  const [availableTags, setAvailableTags] = useState([]);

  const handleTagsChange = (event, value) => {
    setNewDropData({ ...newDropData, tags: value });
  };

  useEffect(() => {
    if (list?.length > 0) {
      const tags = list
        .filter((element) => element?.data?.tags)
        .map((element) => element?.data?.tags)
        .flat()
        .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));

      setAvailableTags([...new Set(tags)]);
    }
  }, [list]);

  const currentUser = useSelector((state) => state.core.user);

  const messagesContainerRef = useRef(null);

  useEffect(() => {
    // Ensure only messagesContainerRef handles the scroll behavior
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [allMessages]);

  const fetchMetadata = async () => {
    if (!newDropData?.url) return;
    dispatch(
      setGeneralStatus({
        status: 'loading',
        position: 'nodies-link',
        type: 'pulse',
      })
    );
    setNewDropData({ url: newDropData?.url });
    try {
      const linkData = await nodeAxiosFirebase({
        t,
        method: 'POST',
        url: `oreMulti/metadata`,
        body: {
          url: newDropData?.url,
        },
      });
      setNewDropData({ ...newDropData, ...linkData });
      dispatch(
        setGeneralStatus({
          status: 'success',
          position: 'nodies-link',
          type: 'pulse',
        })
      );
    } catch (error) {
      console.error('Error fetching metadata:', error);
    }
  };

  const reactionTypes = ['like', 'unlike', 'seen', 'funny', 'heart'];
  const reactionEmojiMap = {
    like: '👍',
    unlike: '👎',
    seen: '👁️',
    funny: '😂',
    heart: '❤️',
  };

  const getEmojiForReaction = (reactionType) => {
    return reactionEmojiMap[reactionType] || reactionType;
  };

  const businessDocId = businessPreference?.id;
  useEffect(() => {
    if (businessDocId && nodeId) {
      const lastMessageRef = doc(
        db,
        'businessesOnNode',
        businessDocId,
        'channels',
        nodeId
      );

      // Update the seenLast array to include the current user
      updateDoc(lastMessageRef, {
        seenLast: arrayUnion(currentUser?.uid),
      });
    }
  }, [currentUser?.uid, businessDocId, nodeId]);

  useEffect(() => {
    if (businessDocId) {
      const messagesRef = collection(
        db,
        'businessesOnNode',
        businessDocId,
        'logs'
      );
      const channelRef = doc(
        db,
        'businessesOnNode',
        businessDocId,
        'channels',
        nodeId
      );
      try {
        const q = query(
          messagesRef,
          orderBy('timeStamp', 'desc'),
          where('channelId', '==', channelRef),
          limit(40)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
          const newMessages = snapshot.docs
            .map((doc) => ({
              id: doc?.id,
              ...doc.data(),
            }))
            .sort((a, b) => {
              // First, sort by pin status
              if (a.isPinned && !b.isPinned) {
                return 1;
              } else if (!a.isPinned && b.isPinned) {
                return -1;
              }
              // Then, sort by creation time
              return a.timeStamp.toMillis() - b.timeStamp.toMillis();
            });
          setAllMessages(newMessages);
        });

        return () => unsubscribe();
      } catch (error) {
        console.error(error);
      }
    }
  }, [nodeId, businessDocId]);

  const sendMessage = async () => {
    if (newMessage.trim() === '') return;
    // Add message to Firestore
    const channelRef = doc(
      db,
      'businessesOnNode',
      businessDocId,
      'channels',
      nodeId
    );
    const messagesRef = collection(
      db,
      'businessesOnNode',
      businessDocId,
      'logs'
    );

    const currentUserRef = doc(db, 'users', currentUser?.uid);
    const businessRef = doc(db, 'businessesOnNode', businessDocId);

    const newMessageData = {
      content: newMessageServer,
      type: 'text',
      timeStamp: Timestamp.fromDate(new Date()),
      channelId: channelRef,
      authorAvatar: currentUser?.photoURL,
      authorId: currentUserRef,
      authorName: currentUser?.displayName,
      ownerId: businessRef,
      reactions: {},
    };

    const docRef = await addDoc(messagesRef, newMessageData);

    const mainChannelRef = doc(
      db,
      'businessesOnNode',
      businessDocId,
      'channels',
      nodeId
    );
    await updateDoc(mainChannelRef, {
      lastMessageId: docRef.id,
      seenLast: [currentUser?.uid],
      lastMessageContent: newMessage,
      lastMessageAuthor: currentUser?.displayName,
    });

    setNewMessage('');
    setInputKey((prevKey) => prevKey + 1);
  };

  const handleNewMessageChange = (event) => {
    setNewMessage(event.target.value);
  };

  const handleNewMessageChangeServer = (value) => {
    setNewMessageServer(value);
  };

  const handleSelectMessage = (message) => {
    setSelectedMessage(message);
  };

  function handleBodyChange(value) {
    setNewDropData({ ...newDropData, description: value });
  }

  const handleAddReaction = async (messageId, reactionType) => {
    const messageRef = doc(
      db,
      'businessesOnNode',
      businessDocId,
      'logs',
      messageId
    );

    await runTransaction(db, async (transaction) => {
      const messageDoc = await transaction.get(messageRef);
      if (!messageDoc.exists()) {
        throw 'Document does not exist!';
      }

      const currentReactions = messageDoc.data().reactions || {};
      const currentReactionUsers = currentReactions[reactionType] || [];

      // Check if the current user has already reacted
      if (
        !currentReactionUsers.some((user) => user.userId === currentUser.uid)
      ) {
        // Add the user's reaction with both userId and name
        currentReactionUsers.push({
          userId: currentUser.uid,
          name: currentUser?.displayName,
        });
        currentReactions[reactionType] = currentReactionUsers;

        transaction.update(messageRef, { reactions: currentReactions });
      }
    });
  };

  const handleAddElement = async () => {
    dispatch(
      setGeneralStatus({
        status: 'loading',
        position: 'nodies-addNewElement',
        type: 'pulse',
      })
    );
    try {
      await nodeAxiosFirebase({
        t,
        method: 'POST',
        url: `coreSeqV2/node-element`,
        body: {
          name: newDropData?.title,
          structureId: '',
          type: currentAddType,
          dropId: nodeId,
          elementPath: newDropData?.url,
          data: newDropData,
          moduleId: '',
          collectionField: '',
        },
      });
      fetchRoomData();
      dispatch(
        setGeneralStatus({
          status: 'success',
          position: 'nodies-addNewElement',
          type: 'pulse',
        })
      );
      handleModalClose();
    } catch (error) {
      console.error(error);
    }
  };

  const fetchRoomData = async () => {
    try {
      const docRef = doc(collection(db, 'rooms'), nodeId);
      const docSnapshot = await getDoc(docRef);
      const roomData = docSnapshot.data();
      setNodeData(roomData);
      setSelectedEmoji(null);
      dispatch(
        setRoom({
          sessionId: docSnapshot.data().sessionId,
          apiKey: docSnapshot.data().apiKey,
          id: nodeId,
          name: docSnapshot.data().roomName,
          groups: docSnapshot.data().groups,
          notes: docSnapshot.data().notes,
        })
      );
      setSelectedEmoji(roomData?.emoji);
    } catch (error) {
      console.error('Error fetching room data:', error);
    }
  };

  const handlePinMessage = async (messageId, currentPinStatus) => {
    const messageRef = doc(
      db,
      'businessesOnNode',
      businessDocId,
      'logs',
      messageId
    );

    const newPinStatus = !currentPinStatus;

    await updateDoc(messageRef, {
      isPinned: newPinStatus,
    });

    // Update the local state to reflect the change immediately
    setAllMessages((prevMessages) =>
      prevMessages.map((msg) =>
        msg.id === messageId ? { ...msg, isPinned: newPinStatus } : msg
      )
    );
  };

  useEffect(() => {
    const picker = new EmojiButton();
    picker.on('emoji', (selection) => {
      setSelectedEmoji(selection.emoji);
    });

    if (buttonRef.current) {
      buttonRef.current.addEventListener('click', () => {
        picker.pickerVisible
          ? picker.hidePicker()
          : picker.showPicker(buttonRef.current);
      });
    }
  }, []);

  useEffect(() => {
    setTimeout(() => {
      if (selectedEmoji !== nodeData?.emoji && selectedEmoji) {
        updateDrop(room, selectedEmoji);
      }
    }, 1000);
  }, [selectedEmoji]);

  useEffect(() => {
    if (nodeData) {
      const elements = nodeData?.elements || [];
      setList(elements);
    }
  }, [nodeData]);

  const handleElementDelete = async () => {
    try {
      dispatch(
        setGeneralStatus({
          status: 'loading',
          position: 'nodies-remove',
          type: 'pulse',
        })
      );
      await nodeAxiosFirebase({
        t,
        method: 'DELETE',
        url: `coreSeqV2/node`,
        body: {
          dropId: nodeId,
        },
      });
      dispatch(
        setGeneralStatus({
          status: 'success',
          position: 'nodies-remove',
          type: 'pulse',
        })
      );
      navigate('/app/dashboard');
    } catch (error) {
      console.error(error);
      dispatch(
        setGeneralStatus({
          status: 'error',
          position: 'nodies-remove',
          type: 'pulse',
        })
      );
    }
  };

  const handleConfirmDelete = async () => {
    dispatch(
      modalActions.modalConfirmation({
        isOpen: true,
        title: t('deleteElement'),
        handleConfirm: () => handleElementDelete(),
      })
    );
  };

  const updateDrop = async (roomDoc, emoji) => {
    try {
      dispatch(
        setGeneralStatus({
          status: 'loading',
          position: 'nodies-update',
          type: 'backdrop',
        })
      );
      await nodeAxiosFirebase({
        t,
        method: 'POST',
        url: `coreSeqV2/node`,
        body: {
          name: roomDoc?.name,
          dropId: roomDoc?.id || nodeId,
          emoji: emoji || selectedEmoji,
          groups: roomDoc?.groups,
        },
      });
      dispatch(
        setGeneralStatus({
          status: 'success',
          position: 'nodies-update',
          type: 'backdrop',
        })
      );
      fetchRoomData();
    } catch (error) {
      dispatch(
        setGeneralStatus({
          status: 'error',
          position: 'nodies-update',
          type: 'backdrop',
        })
      );
      console.error(error);
    }
  };

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const addElement = (structureId, type) => {
    setNewDropData(null);
    if (type === 'structure') {
      dispatch(
        modalActions.modalElementCreation({
          isOpen: true,
          structureId: structureId,
          roomId: nodeId,
        })
      );
    } else {
      setCurrentAddType(type);
      setModalOpen(true);
    }
    handleMenuClose();
  };

  const modalAddElementState = useSelector(
    (state) => state.modalReducer.modalElementCreation.isOpen
  );

  useEffect(() => {
    if (modalAddElementState === false) {
      fetchRoomData();
      setActiveFolder(null);
      setInsideFolder(false);
    }
  }, [modalAddElementState, nodeId]);

  const handleModalClose = () => {
    setModalOpen(false);
    setNewDropData({
      title: newDropData?.title || '',
      tags: [],
    });
  };

  const handleUploadComplete = async (filesData) => {
    const fileUrls = filesData?.map((file) => file) || [];
    const newFiles = [...(newDropData?.file || []), ...fileUrls];
    setNewDropData({
      ...newDropData,
      fileUrl: newFiles[0]?.fileUrl,
      title: newFiles[0]?.originalFile?.originalFileName,
      mime: newFiles[0]?.originalFile?.mime,
      metadata: newFiles[0]?.originalFile?.metadata,
    });
  };

  return (
    <MainLayoutV2
      pageTitle={(selectedEmoji || '') + '  ' + room?.name || ''}
      roomData={true}
      deleteItem={handleConfirmDelete}
      tabs={tabs}
      roomId={nodeId}
      selectedTab={activeIndex || 0}
    >
      <ModalLarge
        isOpen={isModalOpen}
        modalCloseHandler={handleModalClose}
        title={t('add') + ' ' + t(currentAddType)}
      >
        <div className="row px-2">
          {currentAddType === 'link' && (
            <div>
              <TextField
                label={t('link')}
                fullWidth
                isLoading={
                  currentStatus?.status === 'loading' &&
                  currentStatus?.position === 'nodies-link'
                }
                value={newDropData?.url}
                type="link"
                onBlur={fetchMetadata}
                onChange={(e) =>
                  setNewDropData({ ...newDropData, url: e.target.value })
                }
              />
              {newDropData?.title && (
                <TextField
                  label={t('title')}
                  fullWidth
                  value={newDropData?.title}
                  type="title"
                  onBlur={fetchMetadata}
                  onChange={(e) =>
                    setNewDropData({ ...newDropData, title: e.target.value })
                  }
                />
              )}
            </div>
          )}
          {currentAddType === 'media' && (
            <div>
              <IconUploader
                key={'media'}
                value={newDropData?.file}
                fieldType={'media-single'}
                required={false}
                elementId={'files'}
                label={t('files')}
                elementType={t('files')}
                onComplete={handleUploadComplete}
              />
            </div>
          )}
          {currentAddType === 'note' && (
            <div>
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
                    backgroundColor: '#FFF',
                    padding: '2px 10px 2px 10px',
                    borderRadius: '10px',
                  }}
                >
                  {'Note'}
                </InputLabel>{' '}
                <ReactQuill
                  theme="bubble"
                  value={newDropData?.body}
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
              <TextField
                label={t('title')}
                fullWidth
                value={newDropData?.title}
                type="title"
                onChange={(e) =>
                  setNewDropData({ ...newDropData, title: e.target.value })
                }
              />
            </div>
          )}
          <div className="mt-1">
            <Autocomplete
              multiple
              options={availableTags}
              value={newDropData?.tags || []}
              freeSolo
              onChange={handleTagsChange}
              renderInput={(params) => (
                <TextFieldMUI
                  {...params}
                  variant="outlined"
                  label={t('folders')}
                  placeholder={t('addFolders')}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '10px',
                      '&.Mui-focused fieldset': {
                        borderColor: businessPreference?.mainColor || '#000',
                        boxShadow: `0 0 0 0.2rem ${
                          businessPreference?.mainColor + '20'
                        }`,
                      },
                    },
                  }}
                />
              )}
            />
          </div>
          {newDropData?.title && (
            <div className="align-left px-2 mt-4">
              <Button
                fullWidth
                onClick={() => {
                  handleAddElement();
                }}
                label={t('add')}
              />
            </div>
          )}
        </div>
      </ModalLarge>
      <div className="d-flex mt-1">
        <div className="col-8">
          <Blocks
            height={1}
            noBorder
            heightPercentage={92}
            noScroll
            onClickAdd={handleOpenMenu}
            title={
              activeIndex === 0
                ? t('elements')
                : activeIndex === 1
                ? t('points')
                : t('notes')
            }
          >
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              elevation={0}
              sx={{
                marginLeft: '0.5rem',
              }}
            >
              <MenuItem key={'link'} onClick={() => addElement(null, 'link')}>
                {t('link')}
              </MenuItem>
              <MenuItem key={'media'} onClick={() => addElement(null, 'media')}>
                {t('media')}
              </MenuItem>
              <MenuItem key={'note'} onClick={() => addElement(null, 'note')}>
                {t('note')}
              </MenuItem>
              <Divider component="li" />
              {businessStructures
                ?.slice()
                .sort((a, b) => a[`name`]?.localeCompare(b[`name`]))
                ?.map((structure) => (
                  <MenuItem
                    key={structure?.id}
                    onClick={() => addElement(structure?.id, 'structure')}
                  >
                    {structure?.[`name`]}
                  </MenuItem>
                ))}
            </Menu>
            {activeIndex === 0 && (
              <NodiesElements
                list={list}
                availableTags={availableTags}
                fetchRoomData={fetchRoomData}
                mainColor={businessPreference?.mainColor || '#000000'}
                insideFolder={insideFolder}
                setInsideFolder={setInsideFolder}
                activeFolder={activeFolder}
                setActiveFolder={setActiveFolder}
              />
            )}
            {activeIndex === 1 && <NodiesPoints />}
          </Blocks>
        </div>

        <div
          style={{
            position: 'relative',
          }}
          className="col-4"
        >
          <Blocks
            title={t('messages')}
            height={1}
            heightPercentage={92}
            noBorder
            className="mt-1"
          >
            <div
              ref={messagesContainerRef}
              style={{
                maxHeight: 'calc(100% - 100px)',
                overflowY: 'auto',
                paddingBottom: '10px',
              }}
            >
              {allMessages?.map((message, index) => (
                <div key={index}>
                  <MessageGeneral
                    message={message}
                    userId={message?.authorId?.id}
                    messageId={message?.id}
                    text={message?.content}
                    name={message?.authorName}
                    avatar={message?.authorAvatar}
                    timestamp={moment
                      .unix(
                        message?.timeStamp?.seconds ||
                          message?.timeStamp?._seconds
                      )
                      .fromNow()}
                    isPinned={message?.isPinned}
                    reactions={message?.reactions}
                    reactionEmojiMap={reactionEmojiMap}
                    reactionTypes={reactionTypes}
                    getEmojiForReaction={getEmojiForReaction}
                    selectedMessage={selectedMessage?.id}
                    handleAddReaction={handleAddReaction}
                    handlePinMessage={handlePinMessage}
                    handleSelectMessage={handleSelectMessage}
                    withReactions
                  />
                </div>
              ))}
            </div>

            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                width: 'auto',
                backgroundColor: isDarkMode ? '#333' : '#fff',
                padding: '10px',
              }}
              className="message-input-list"
            >
              <TextField
                value={newMessage}
                key={inputKey}
                allowMention="node"
                multiline
                type="message"
                rows={2}
                onChangeServer={(value) => handleNewMessageChangeServer(value)}
                fullWidth
                onChange={handleNewMessageChange}
                placeholder={t('startTyping')}
                handleKeyPress={(e) => {
                  sendMessage(e.target.value);
                }}
              />
            </div>
          </Blocks>
        </div>
      </div>
    </MainLayoutV2>
  );
};

export default ListDrop;
