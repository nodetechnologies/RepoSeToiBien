// Libraries
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import AddReactionOutlinedIcon from '@mui/icons-material/AddReactionOutlined';
import {
  EditNoteOutlined,
  PreviewOutlined,
  ForwardToInboxOutlined,
  CheckCircleOutlineOutlined,
  MessageOutlined,
  EngineeringOutlined,
  PhoneAndroidOutlined,
  TaskAlt,
} from '@mui/icons-material';

// Components
import ButtonCircle from '../../stories/general-components/ButtonCircle';
import GeneralText from '../../stories/general-components/GeneralText';
import Avatar from '../../stories/general-components/Avatar';

const MessageGeneral = ({
  text,
  timestamp,
  userId,
  type,
  name,
  reactions,
  isPinned,
  message,
  messageId,
  withReactions,
  handleAddReaction,
  handleSelectMessage,
  handlePinMessage,
  reactionTypes,
  getEmojiForReaction,
  selectedMessage,
}) => {
  const numberReactions = Object.keys(reactions || {})?.length;
  const { t } = useTranslation();
  const theme = useTheme();
  const [showReactions, setShowReactions] = useState(
    numberReactions > 0 ? true : false
  );
  const isDarkMode = theme.palette.mode === 'dark';

  const businessPreference = useSelector((state) => state.core.businessData);
  const employees = businessPreference?.employees;

  const handleIntAddReaction = (messageId, type) => {
    handleAddReaction(messageId, type);
    setShowReactions(false);
  };

  const currentUser = useSelector((state) => state.core.user);

  const isCurrentUser = userId === currentUser?.uid;

  function getEmployeeAvatar(employee) {
    const employeeData = employees?.find((emp) => emp.id === employee);
    return employeeData?.avatar;
  }

  const getIconOfLog = (type) => {
    switch (type) {
      case 'cards:confirmed' || 'card:action:confirmed':
        return {
          icon: (
            <CheckCircleOutlineOutlined
              sx={{ marginTop: '6px' }}
              fontSize="10px"
            />
          ),
          label: t('statusConfimed'),
        };
      case 'cards:email' || 'card:email':
        return {
          icon: (
            <ForwardToInboxOutlined sx={{ marginTop: '6px' }} fontSize="10px" />
          ),
          label: t('emailSent'),
        };
      case 'cards:view':
        return {
          icon: <PreviewOutlined sx={{ marginTop: '6px' }} fontSize="10px" />,
          label: t('cardOpened'),
        };
      case 'card:view':
        return {
          icon: <PreviewOutlined sx={{ marginTop: '6px' }} fontSize="10px" />,
          label: t('cardOpened'),
        };
      case 'grids:email':
        return {
          icon: (
            <ForwardToInboxOutlined sx={{ marginTop: '6px' }} fontSize="10px" />
          ),
          label: t('emailSent'),
        };
      case 'delivered:email':
        return {
          icon: (
            <ForwardToInboxOutlined sx={{ marginTop: '6px' }} fontSize="10px" />
          ),
          label: t('emailDelivered'),
        };
      case 'grids:view':
        return {
          icon: <PreviewOutlined sx={{ marginTop: '6px' }} fontSize="10px" />,
          label: t('gridOpened'),
        };
      case 'cards:message':
        return {
          icon: <MessageOutlined sx={{ marginTop: '6px' }} fontSize="10px" />,
          label: t('message'),
        };
      case 'cards:messagePublic':
        return {
          icon: <MessageOutlined sx={{ marginTop: '6px' }} fontSize="10px" />,
          label: t('messageContact'),
        };
      case 'opened:email':
        return {
          icon: <MessageOutlined sx={{ marginTop: '6px' }} fontSize="10px" />,
          label: t('openedEmail'),
        };
      case 'clicked:email':
        return {
          icon: <MessageOutlined sx={{ marginTop: '6px' }} fontSize="10px" />,
          label: t('clickedEmail'),
        };
      case 'profile:maintenance':
        return {
          icon: (
            <EngineeringOutlined sx={{ marginTop: '6px' }} fontSize="10px" />
          ),
          label: '',
        };
      case 'action:call':
        return {
          icon: (
            <PhoneAndroidOutlined sx={{ marginTop: '6px' }} fontSize="10px" />
          ),
          label: t('call'),
        };
      case 'nodies:created':
        return {
          icon: <TaskAlt sx={{ marginTop: '6px' }} fontSize="10px" />,
          label: t('newTask'),
        };
      case 'note':
        return {
          icon: <EditNoteOutlined sx={{ marginTop: '6px' }} fontSize="10px" />,
          label: t('note'),
        };

      default:
        return {
          label: 'Note',
          icon: <EditNoteOutlined sx={{ marginTop: '6px' }} fontSize="10px" />,
        };
    }
  };

  return (
    <div
      className="mb-2"
      style={{
        width: '100%',
      }}
    >
      {message?.type === 'update' ? (
        <div
          style={{
            backgroundColor: '#69696908',
            padding: '3px',
            borderRadius: '10px',
          }}
          className={'align-c col-12  d-flex '}
        >
          <div className="d-flex px-3">
            <div className="align-left mx-3">
              <GeneralText
                text={name}
                fontSize="8px"
                size="bold"
                primary={true}
              />
              <div style={{ marginTop: '-7px' }}>
                {timestamp && (
                  <GeneralText
                    text={timestamp}
                    fontSize="7px"
                    size="regular"
                    primary={true}
                  />
                )}
              </div>
            </div>
            <div className="align-right mx-3 mt-1">
              <GeneralText
                text={t(text)}
                fontSize="11px"
                size="regular"
                primary={true}
              />
            </div>
          </div>
        </div>
      ) : (
        <div
          style={{
            padding: '4px',
            marginLeft: '4px',
          }}
          className={`row`}
        >
          <div
            className={
              reactions
                ? 'align-left col-11  d-flex'
                : 'align-left col-12  d-flex '
            }
          >
            {!isCurrentUser &&
            (type === 'cards:message' ||
              type === 'note' ||
              type === 'message') ? (
              <Avatar
                alt={name}
                img={getEmployeeAvatar(userId)}
                userId={userId}
                sx={{ width: 32, height: 32 }}
              />
            ) : (
              <div style={{ width: 32, height: 32 }}>
                {!userId && getIconOfLog(type).icon}
              </div>
            )}
            <div className="row px-3">
              <div
                className={
                  isCurrentUser ? 'row align-right' : 'd-flex middle-content'
                }
              >
                {!isCurrentUser && (
                  <GeneralText
                    text={name}
                    fontSize="11px"
                    size="bold"
                    primary={true}
                  />
                )}
                {timestamp && (
                  <GeneralText
                    text={timestamp}
                    fontSize="9px"
                    classNameComponent="px-2"
                    size="regular"
                    primary={true}
                  />
                )}
              </div>
              <div
                className={
                  isCurrentUser ? 'message-chat-current' : 'message-chat'
                }
                style={{
                  backgroundColor: !isCurrentUser
                    ? '#69696910'
                    : businessPreference?.secColor + '16',
                  width: '100%',
                }}
              >
                <GeneralText
                  text={text || getIconOfLog(type).label}
                  fontSize="12px"
                  size="regular"
                  primary={true}
                  markdown
                />
              </div>
              {withReactions && (
                <div
                  style={{
                    marginTop: '-10px',
                  }}
                  className="d-flex"
                >
                  {numberReactions === 0 && (
                    <div
                      className="hover mt-1"
                      onClick={() => setShowReactions(!showReactions)}
                    >
                      <AddReactionOutlinedIcon htmlColor="#c9c9c9" />
                    </div>
                  )}
                  {showReactions && (
                    <div
                      style={{ boxShadow: '0px 0px 5px 0px #0000001a' }}
                      className="reactions-display d-flex align-items-center"
                    >
                      {reactionTypes?.map((type) => (
                        <button
                          key={type}
                          className="reaction-button d-flex"
                          onClick={() => handleIntAddReaction(messageId, type)}
                        >
                          <p>{getEmojiForReaction(type)}</p>
                          <p
                            className={
                              reactions?.[type]?.length > 0
                                ? 'fw-600 fs-14 px-1'
                                : 'fw-400 fs-12 px-1'
                            }
                          >
                            {reactions?.[type]?.length || 0}
                          </p>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          {reactions && (
            <div className="col-1 mt-2">
              <ButtonCircle
                icon="PushPinOutlined"
                primary={false}
                backgroundColor={isPinned ? '#eb4f4f' : ''}
                color={
                  isDarkMode
                    ? isPinned
                      ? 'red'
                      : 'white'
                    : isPinned
                    ? 'red'
                    : 'black'
                }
                size="small"
                onClick={() => handlePinMessage(messageId, isPinned)}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MessageGeneral;
