import React, { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import {
  collection,
  doc,
  updateDoc,
  Timestamp,
  onSnapshot,
  query,
  orderBy,
  where,
  limit,
  addDoc,
  runTransaction,
  arrayUnion,
  serverTimestamp,
} from 'firebase/firestore';
import { db, auth } from '../firebase';
import moment from 'moment';
import Drawer from '@mui/material/Drawer';
import Block from '../stories/layout-components/Block';
import GeneralText from '../stories/general-components/GeneralText';
import MessageGeneral from '../components/@generalComponents/MessageGeneral';
import TextField from '../stories/general-components/TextField';
import Button from '../stories/general-components/Button';
import { setGeneralStatus } from '../redux/actions-v2/coreAction';

const EntityChannelSidebar = ({ closeSidebar, mainChannelId, mainChannel }) => {
  const { t } = useTranslation();
  const messagesEndRef = useRef(null);
  const dispatch = useDispatch();

  const [allMessages, setAllMessages] = useState([]);

  const [inputKey, setInputKey] = useState(0);
  const [newMessage, setNewMessage] = useState('');
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [newMessageServer, setNewMessageServer] = useState('');

  const currentUser = useSelector((state) => state.core.user);
  const currentUserFirebase = auth.currentUser;

  const businessPreference = useSelector((state) => state.core.businessData);

  const scrollToBottomSmooth = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView();
  };

  const reactionTypes = ['like', 'unlike', 'seen', 'funny', 'heart'];
  const reactionEmojiMap = {
    like: '👍',
    unlike: '👎',
    seen: '👁️',
    funny: '😂',
    heart: '❤️',
  };

  // Function to get emoji by reaction type
  const getEmojiForReaction = (reactionType) => {
    return reactionEmojiMap[reactionType] || reactionType;
  };

  useEffect(() => {
    scrollToBottom();
  }, [allMessages]);

  const businessDocId = businessPreference?.id;

  useEffect(() => {
    if (allMessages?.length > 0) {
      const lastMessage = allMessages[allMessages.length - 1];
      const lastMessageRef = doc(
        db,
        'businessesOnNode',
        businessDocId,
        'channels',
        'main'
      );

      // Update the seenLast array to include the current user
      updateDoc(lastMessageRef, {
        seenLast: arrayUnion(currentUserFirebase.uid),
      });
    }
  }, [allMessages, currentUserFirebase?.uid, businessDocId, mainChannelId]);

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
        'main'
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
          setTimeout(() => {
            scrollToBottomSmooth();
          }, 1000);
        });

        return () => unsubscribe();
      } catch (error) {
        console.error('Error fetching messages:');
        dispatch(setGeneralStatus({ status: 'error', error: error }));
      }
    }
  }, [mainChannel, businessDocId]);

  const sendMessage = async () => {
    if (newMessage.trim() === '') return;
    // Add message to Firestore
    const channelRef = doc(
      db,
      'businessesOnNode',
      businessDocId,
      'channels',
      'main'
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
      'main'
    );
    await updateDoc(mainChannelRef, {
      lastMessageId: docRef.id,
      seenLast: [currentUser?.uid],
      lastMessageContent: newMessageData.content,
      lastMessageAuthor: currentUser?.displayName,
    });

    setNewMessage('');
    setNewMessageServer('');
    setInputKey((prevKey) => prevKey + 1);
    setTimeout(() => {
      scrollToBottomSmooth();
    }, 1000);
  };

  const handleNewMessageChange = (event, type) => {
    setNewMessage(event.target.value);
  };

  const handleNewMessageChangeServer = (value) => {
    setNewMessageServer(value);
  };

  const handleSelectMessage = (message) => {
    setSelectedMessage(message);
  };

  const handleClose = () => {
    localStorage.setItem('channel', false);
    setSelectedMessage(null);
    closeSidebar();
  };

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
        !currentReactionUsers.some(
          (user) => user.userId === currentUserFirebase.uid
        )
      ) {
        // Add the user's reaction with both userId and name
        currentReactionUsers.push({
          userId: currentUserFirebase.uid,
          name: currentUser?.displayName,
        });
        currentReactions[reactionType] = currentReactionUsers;

        transaction.update(messageRef, { reactions: currentReactions });
      }
    });
  };

  const handlePinMessage = async (messageId, currentPinStatus) => {
    const messageRef = doc(
      db,
      'businessesOnNode',
      businessDocId,
      'logs',
      messageId
    );

    // Toggle the pin status
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

  return (
    <Drawer
      anchor="right"
      open={true}
      onClose={handleClose}
      sx={{
        height: '100vh',
        position: 'relative',
        overflow: 'hidden',
        zIndex: 10000,
      }}
    >
      <div style={{ width: selectedMessage ? 1000 : 750 }} className="p-2 row">
        <div className="col-12 px-4 mt-3">
          {' '}
          <GeneralText
            text={t('channelBusiness')}
            fontSize="18px"
            size="bold"
            primary={true}
          />
          <GeneralText
            text={t('channelBusinessMsg')}
            fontSize="11px"
            size="regular"
            primary={true}
          />
        </div>
        <div className={selectedMessage ? 'col-3 p-3' : 'hide'}>
          {' '}
          {selectedMessage && (
            <div className="mx-3">
              {Object.entries(selectedMessage?.reactions || {}).map(
                ([reactionType, userReactions]) => (
                  <div className="mt-3" key={reactionType}>
                    <div>{getEmojiForReaction(reactionType)}</div>
                    {userReactions.map((user, index) => (
                      <div key={index}>{user?.authorName}</div>
                    ))}
                  </div>
                )
              )}
            </div>
          )}
        </div>
        <div className={selectedMessage ? 'col-9' : 'col-12'}>
          <Block
            height={1}
            heightPercentage={75}
            noBorder
            noShadow
            mode="primary"
            className="hei-9"
          >
            {allMessages?.map((message, index) => (
              <div key={index}>
                <MessageGeneral
                  message={message}
                  userId={message?.authorId?.id}
                  messageId={message?.id}
                  type="message"
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
            <div ref={messagesEndRef} />
          </Block>

          <div className="message-input">
            <TextField
              value={newMessage}
              key={inputKey}
              type="message"
              multiline
              allowMention="channel"
              onChangeServer={(value) => handleNewMessageChangeServer(value)}
              rows={3}
              fullWidth
              onChange={(e) => handleNewMessageChange(e)}
              placeholder={t('startTyping')}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage(newMessage);
                }
              }}
            />
          </div>
        </div>
      </div>
    </Drawer>
  );
};

export default EntityChannelSidebar;
