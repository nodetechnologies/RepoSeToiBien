import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';

//utilities
import { useTranslation } from 'react-i18next';
import {
  collection,
  addDoc,
  query,
  orderBy,
  where,
  Timestamp,
  limit,
  onSnapshot,
} from 'firebase/firestore';
import { db } from '../firebase';
import { motion } from 'framer-motion';

import Block from '../stories/layout-components/Block';
import TextField from '../stories/general-components/TextField';
import { Box, Avatar } from '@mui/material';
import GeneralText from '../stories/general-components/GeneralText';
import { toast } from 'react-toastify';
import DrawerSide from '../stories/layout-components/DrawerSide';
import { setGeneralStatus } from '../redux/actions-v2/coreAction';

const GradientIconWrapper = ({ svgPath, size = 14, ...props }) => {
  const svgIcon = `<svg width="100px" height="100px" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">

      <stop offset="30%" style="stop-color:rgb(227, 216, 14);"/>
      <stop offset="55%" style="stop-color:rgb(128,255,255,0.4);"/>
      <stop offset="80%" style="stop-color:rgb(14,21,227);"/>
    </linearGradient>
  </defs>
  <path fill="url(#grad1)" d="M50,10 L10,50 L20,90 L50,70 L80,90 L90,50 Z" />
  <path fill="none" stroke="rgb(255,255,255)" stroke-width="4" d="M25,25 L50,50 L75,25 M50,50 L50,75" />
  
</svg>`;
  const dataUrl = `data:image/svg+xml;base64,${btoa(svgIcon)}`;

  return (
    <Box
      {...props}
      sx={{
        width: size,
        height: size,
        display: 'inline-block',
        backgroundImage: `url("${dataUrl}")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    />
  );
};

const NodeAI = ({ closeSidebar }) => {
  const { t } = useTranslation();
  const [prompt, setPrompt] = useState('');
  const dispatch = useDispatch();
  const messagesEndRef = useRef(null);
  const mode = localStorage.getItem('mode') || 'light';
  const [isLoading, setIsLoading] = useState(false);
  const [inputKey, setInputKey] = useState(0);
  const [messages, setMessages] = useState([]);
  const [lastSentMessage, setLastSentMessage] = useState(null);
  const currentUser = useSelector((state) => state.core.user);

  const businessPreference = useSelector((state) => state.core.businessData);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView();
  };

  const scrollToBottomSmooth = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleAddLog = async () => {
    setIsLoading(true);
    const currentPrompt = prompt;
    setPrompt('');

    // Assuming 'chatAI' is the correct path in your Firestore
    const messagesCollectionRef = collection(
      db,
      'users',
      currentUser?.uid,
      'discussions',
      'chatAI',
      'messages'
    );

    try {
      // Add a new message to Firestore
      await addDoc(messagesCollectionRef, {
        prompt: currentPrompt,
        response: null,
        from: businessPreference?.id,
        createTime: Timestamp.now(),
      });

      setInputKey(inputKey + 1);
      scrollToBottomSmooth();
    } catch (error) {
      console.error('Error');
      dispatch(setGeneralStatus({ status: 'error', error: error }));
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrompt = async (event) => {
    event.preventDefault();
    if (prompt.trim()) {
      await handleAddLog();
    }
  };

  useEffect(() => {
    const fetchMessages = async () => {
      const messagesQuery = query(
        collection(
          db,
          'users',
          currentUser?.uid,
          'discussions',
          'chatAI',
          'messages'
        ),
        where('from', '==', businessPreference?.id),
        orderBy('createTime', 'desc'),
        limit(20)
      );

      const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
        const newMessages = [];
        snapshot.forEach((doc) => {
          const messageData = { id: doc.id, ...doc.data() };
          // Check if this message is the same as the last sent message
          if (
            !lastSentMessage ||
            messageData.prompt !== lastSentMessage.prompt ||
            messageData.response !== lastSentMessage.response
          ) {
            newMessages.push(messageData);
          }
        });
        setMessages(newMessages.reverse());
        scrollToBottomSmooth();
      });

      return () => unsubscribe();
    };
    fetchMessages();
  }, [currentUser, lastSentMessage, businessPreference?.id]);

  useEffect(() => {
    if (messages?.length > 0) {
      scrollToBottom();
    }
  }, [messages]);

  const handleCopy = (e) => {
    navigator.clipboard.writeText(e.target.innerText);
    e.target.focus();
    toast.success(t('copied'));
  };

  return (
    <DrawerSide
      position="right"
      handleDrawerClose={closeSidebar}
      isDrawerOpen={true}
      noAction
      title={t('nodeAI')}
    >
      <div className="p-1">
        <div
          style={{
            paddingLeft: 7,
          }}
        >
          <Block
            noBorder
            height={1}
            heightPercentage={62}
            mode="primary"
            noShadow
            empty={messages?.length === 0}
            emptyType="empty"
          >
            <div className="row mb-5">
              {messages &&
                messages?.map((message, index) => {
                  return (
                    <div key={index + message?.id}>
                      <div className=" d-flex">
                        <div className="mt-3">
                          <Avatar
                            src={currentUser?.photoURL}
                            sx={{ width: 32, height: 32 }}
                          />
                        </div>
                        <div className="p-3">
                          <GeneralText
                            fontSize="12px"
                            primary={true}
                            size="regular"
                            markdown
                            text={message?.prompt}
                          />
                        </div>
                      </div>
                      <div
                        style={{
                          backgroudColor: mode === 'dark' ? '#333' : '#f7f7f7',
                        }}
                        className="d-flex"
                      >
                        <div className="mt-3">
                          {message?.response ? (
                            <GradientIconWrapper size={34} />
                          ) : (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 1.5 }}
                              className={!message?.response && 'spin-ai'}
                            >
                              <GradientIconWrapper size={34} />
                            </motion.div>
                          )}
                        </div>
                        <div className="p-3">
                          <GeneralText
                            fontSize="12px"
                            onClick={handleCopy}
                            primary={true}
                            size="regular"
                            markdown
                            text={message?.response}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}

              <div ref={messagesEndRef} />
            </div>
          </Block>
        </div>
      </div>
      <div className="row mt-3 middle-content fixed-bottom">
        {isLoading ? (
          <div className="message mx-3">
            <div class="typing typing-1"></div>
            <div class="typing typing-2"></div>
            <div class="typing typing-3"></div>
          </div>
        ) : (
          <div className="col-12">
            <TextField
              key={inputKey}
              label={t('askGPT')}
              primary={true}
              multiline
              rows={3}
              type="message"
              fullWidth
              name="prompt"
              value={prompt || ''}
              onChange={(e) => setPrompt(e.target.value)}
              handleKeyPress={(e) => handleAddLog(e)}
            />
          </div>
        )}
      </div>
    </DrawerSide>
  );
};

export default NodeAI;
