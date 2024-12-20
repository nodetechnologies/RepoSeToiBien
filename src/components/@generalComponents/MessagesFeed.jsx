// Libraries
import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import { Divider } from '@mui/material';
import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  query,
  where,
  collectionGroup,
  onSnapshot,
  orderBy,
} from 'firebase/firestore';

// Utilities
import { db } from '../../firebase';

// Components
import TextField from '../../stories/general-components/TextField';
import HistoryMessage from './HistoryMessage';
import { setGeneralStatus } from '../../redux/actions-v2/coreAction';

const MessagesFeed = ({
  userId,
  elementId,
  elementType,
  heightPercentage,
  fromList,
  elementPath,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [logMessage, setLogMessage] = useState('');
  const [logMessageServer, setLogMessageServer] = useState('');
  const [groupedLogs, setGroupedLogs] = useState({});
  const { moduleName, structureId } = useParams();
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const logsContainerRef = useRef(null);
  const [logs, setLogs] = useState([]);
  const [toReset, setToReset] = useState(false);
  const currentUser = useSelector((state) => state.core.user);
  const businessFirebaseID = localStorage.getItem('businessId');

  useEffect(() => {
    let unsubscribe;
    if (elementId && elementType) {
      const getLogs = async () => {
        const businessRef = doc(db, 'businessesOnNode', businessFirebaseID);

        let q;
        try {
          if (elementType !== 'contacts') {
            q = query(
              collection(db, elementPath, 'logs'),
              where('isDone', '==', false),
              where('ownerId', '==', businessRef),
              orderBy('timeStamp', 'asc')
            );
          } else {
            const userRef = doc(db, 'users', userId);
            q = query(
              collectionGroup(db, 'logs'),
              where('targetId', '==', userRef),
              where('isDone', '==', false),
              where('ownerId', '==', businessRef),
              orderBy('timeStamp', 'asc')
            );
          }
          unsubscribe = onSnapshot(
            q,
            (querySnapshot) => {
              const logs = [];
              querySnapshot.forEach((doc) => {
                logs?.push({ ...doc.data(), id: doc.id });
              });
              setLogs(logs);
            },
            (error) => {
              console.error('Error fetching logs: ', error);
            }
          );
        } catch (error) {
          console.error('Error fetching logs');
          dispatch(setGeneralStatus({ status: 'error', error: error }));
        }
      };

      getLogs();

      return () => {
        if (unsubscribe) {
          unsubscribe();
        }
      };
    }
  }, [elementId, elementType, userId]);

  const handleNewMessageChangeServer = (value) => {
    setLogMessageServer(value);
  };

  const groupLogsByDateAndType = (logs) => {
    const groupedLogs = {};

    logs.forEach((log) => {
      const date = moment
        .unix(log?.timeStamp?.seconds || log?.timeStamp?._seconds || '')
        .format('YYYY-MM-DD-HH:mm:ss');
      const type = log?.type;

      if (!groupedLogs[date]) {
        groupedLogs[date] = {};
      }

      if (!groupedLogs[date][type]) {
        groupedLogs[date][type] = { count: 0, logs: [] };
      }

      groupedLogs[date][type].count += 1;
      groupedLogs[date][type].logs.push(log);
    });

    return groupedLogs;
  };

  useEffect(() => {
    if (logs?.length > 0) {
      const groupedLogs = groupLogsByDateAndType(logs);
      setGroupedLogs(groupedLogs);
    }
  }, [logs]);

  const handleLogCreation = async () => {
    if (logMessage.trim() === '' || !elementId) return;
    const businessRef = doc(db, 'businessesOnNode', businessFirebaseID);
    let elementFinalType = elementType;
    let userRef;
    if (userId) {
      userRef = doc(db, 'users', userId);
    }
    if (
      elementType === 'cardsuninvoiced' ||
      elementType === 'cardsinvoiced' ||
      elementType === 'cardsexpense'
    ) {
      elementFinalType = 'cards';
    }
    try {
      await addDoc(collection(db, elementPath, 'logs'), {
        elementId: elementId,
        description: logMessageServer,
        timeStamp: serverTimestamp(),
        name: currentUser?.displayName || '-',
        type: elementFinalType + ':message',
        ownerId: businessRef,
        targetId: userRef || null,
        assignedToId: currentUser?.uid || null,
        isDone: false,
        documentPath:
          '/app/element/' +
          elementFinalType +
          '/' +
          structureId +
          '/' +
          elementId,
      });
      setToReset(true);
      setLogMessage('');
      setLogMessageServer('');
    } catch (error) {
      console.error('Error creating log:', error);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleLogCreation();
    }
  };

  useEffect(() => {
    const observer = new MutationObserver(() => {
      if (logsContainerRef.current) {
        logsContainerRef.current.scrollTop =
          logsContainerRef.current.scrollHeight;
      }
    });

    if (logsContainerRef.current) {
      observer.observe(logsContainerRef.current, {
        childList: true,
      });
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (logsContainerRef.current && logs.length > 0) {
      setTimeout(() => {
        logsContainerRef.current.scrollTop =
          logsContainerRef.current.scrollHeight;
      }, 0);
    }
  }, [logs]);

  useEffect(() => {
    if (logsContainerRef.current && logs.length > 0) {
      setTimeout(() => {
        logsContainerRef.current.scrollTop =
          logsContainerRef.current.scrollHeight;
      }, 0);
    }
  }, [logs]);

  const vhTopx = (vh) => {
    return (window.innerHeight * vh) / 100;
  };

  const realHeight = vhTopx(heightPercentage - 5.5);

  return (
    <div style={{ position: 'relative' }}>
      <div
        style={{
          paddingLeft: '22px',
          overflowY: 'auto',
          overflowX: 'hidden',
          height: heightPercentage
            ? moduleName !== 'contacts'
              ? `${realHeight}px`
              : `${heightPercentage + 10}vh`
            : '50vh',
          paddingBottom: '0px',
        }}
        ref={logsContainerRef}
      >
        {Object.keys(groupedLogs).map((date) =>
          Object.keys(groupedLogs[date]).map((type) => (
            <div key={`${date}-${type}`}>
              <HistoryMessage
                userId={groupedLogs[date][type].logs[0]?.assignedToId}
                messageId={groupedLogs[date][type].logs[0]?.id}
                type={groupedLogs[date][type].logs[0]?.type}
                text={`${groupedLogs[date][type].logs[0]?.description || ''}`}
                badge={
                  // Number(groupedLogs[date][type].count) > 1 &&
                  groupedLogs[date][type].count
                }
                others={groupedLogs[date][type]?.logs?.slice(1)}
                name={groupedLogs[date][type].logs[0]?.name}
                avatar={groupedLogs[date][type].logs[0]?.avatar}
                timestamp={moment
                  .unix(
                    groupedLogs[date][type].logs[0]?.timeStamp?.seconds ||
                      groupedLogs[date][type].logs[0]?.timeStamp?._seconds ||
                      ''
                  )
                  .fromNow()}
              />
            </div>
          ))
        )}
      </div>
      {!fromList && (
        <div
          style={{
            position: 'fixed',
            width: '100%',
            marginLeft: '-10px',
            paddingLeft: '20px',
            paddingRight: '20px',
            paddingBottom: '5px',
            overflow: 'hidden',
            bottom: 0,
            backgroundColor: isDarkMode ? '#333' : '#FFFFFF',
          }}
        >
          <Divider component="div" />

          <div className="mt-2">
            <TextField
              fullWidth
              label={t('message')}
              variant="outlined"
              toReset={toReset}
              size="small"
              type="message"
              allowMention="page"
              onChangeServer={(value) => handleNewMessageChangeServer(value)}
              value={logMessage}
              onChange={(e) => setLogMessage(e.target.value)}
              handleKeyPress={(e) => handleKeyDown(e)}
              sx={{
                '.MuiOutlinedInput-root': {
                  borderRadius: '10px',
                },
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MessagesFeed;
