// Libraries
import React, { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import { ListItem } from '@mui/material';
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
import GeneralText from '../../stories/general-components/GeneralText';
import Chip from '../../stories/general-components/Chip';
const HistoryMessage = ({
  text,
  timestamp,
  userId,
  type,
  name,
  badge,
  others,
}) => {
  const { t, i18n } = useTranslation();
  const currentLangCode = i18n.language;
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  const getIconOfLog = (type) => {
    switch (type) {
      case 'cards:confirmed' || 'card:action:confirmed':
        return {
          icon: (
            <CheckCircleOutlineOutlined
              sx={{ marginTop: '1px', marginRight: '4px' }}
              fontSize="10px"
            />
          ),
          label: t('statusConfimed'),
          status: 99,
          type: t('action'),
        };
      case 'cards:email' || 'card:email':
        return {
          icon: (
            <ForwardToInboxOutlined
              sx={{ marginTop: '1px', marginRight: '4px' }}
              fontSize="10px"
            />
          ),
          label: t('emailSent'),
          status: 99,
          type: t('action'),
        };

      case 'card:view':
      case 'cards:view':
        return {
          icon: (
            <PreviewOutlined
              sx={{ marginTop: '1px', marginRight: '4px' }}
              fontSize="10px"
            />
          ),
          label: t('cardOpened'),
          status: 1,
          type: t('public'),
        };
      case 'grids:email':
        return {
          icon: (
            <ForwardToInboxOutlined
              sx={{ marginTop: '1px', marginRight: '4px' }}
              fontSize="10px"
            />
          ),
          label: t('emailSent'),
          status: 99,
          type: t('action'),
        };
      case 'delivered:email':
        return {
          icon: (
            <ForwardToInboxOutlined
              sx={{ marginTop: '1px', marginRight: '4px' }}
              fontSize="10px"
            />
          ),
          label: t('emailDelivered'),
          status: 6,
          type: t('email'),
        };
      case 'grids:view':
        return {
          icon: (
            <PreviewOutlined
              sx={{ marginTop: '1px', marginRight: '4px' }}
              fontSize="10px"
            />
          ),
          label: t('gridOpened'),
          type: t('public'),
          status: 1,
        };
      case 'cards:message':
        return {
          icon: (
            <MessageOutlined
              sx={{ marginTop: '1px', marginRight: '4px' }}
              fontSize="10px"
            />
          ),
          label: t('message'),
          status: 0,
          type: t('manual'),
        };
      case 'cards:messagePublic':
        return {
          status: '',
          icon: (
            <MessageOutlined
              sx={{ marginTop: '1px', marginRight: '4px' }}
              fontSize="10px"
            />
          ),
          status: 1,
          label: t('messageContact'),
          type: t('public'),
        };
      case 'opened:email':
        return {
          icon: (
            <MessageOutlined
              sx={{ marginTop: '1px', marginRight: '4px' }}
              fontSize="10px"
            />
          ),
          status: 6,
          label: t('openedEmail'),
          type: t('email'),
        };
      case 'clicked:email':
        return {
          icon: (
            <MessageOutlined
              sx={{ marginTop: '1px', marginRight: '4px' }}
              fontSize="10px"
            />
          ),
          status: 6,
          label: t('clickedEmail'),
          type: t('email'),
        };
      case 'profile:maintenance':
        return {
          icon: (
            <EngineeringOutlined
              sx={{ marginTop: '1px', marginRight: '4px' }}
              fontSize="10px"
            />
          ),
          label: '',
          status: 0,
          type: t('manual'),
        };
      case 'action:call':
        return {
          icon: (
            <PhoneAndroidOutlined
              sx={{ marginTop: '1px', marginRight: '4px' }}
              fontSize="10px"
            />
          ),
          label: t('call'),
          status: 99,
          type: t('action'),
        };
      case 'nodies:created':
        return {
          icon: (
            <TaskAlt
              sx={{ marginTop: '1px', marginRight: '4px' }}
              fontSize="10px"
            />
          ),
          status: 99,
          label: t('newTask'),
          type: t('action'),
        };
      case 'note':
        return {
          icon: (
            <EditNoteOutlined
              sx={{ marginTop: '1px', marginRight: '4px' }}
              fontSize="10px"
            />
          ),
          label: t('note'),
          type: t('manual'),
          status: 0,
        };

      default:
        return {
          label: 'Note',
          status: 0,
          type: t('manual'),
          icon: (
            <EditNoteOutlined
              sx={{ marginTop: '1px', marginRight: '4px' }}
              fontSize="10px"
            />
          ),
        };
    }
  };
  const truncatedText = text?.length > 185 ? `${text.slice(0, 185)}...` : text;

  return (
    <ListItem sx={{ paddingLeft: 0, paddingRight: 0 }} divider>
      <div className={`row mb-1 mt-1`}>
        <div className={'align-left col-9 d-flex '}>
          <div className="row">
            <GeneralText
              text={name}
              fontSize="12px"
              size="bold"
              primary={true}
            />
          </div>
        </div>
        <div className={'align-right col-3'}>
          {timestamp && (
            <GeneralText
              text={timestamp}
              fontSize="9px"
              size="regular"
              primary={true}
              classNameComponent="grey-text"
            />
          )}
        </div>
        <div className="col-12">
          <GeneralText
            text={text}
            fontSize="12px"
            size="regular"
            primary={true}
            markdown
          />
          {/* {text?.length > 185 && (
            <GeneralText
              text={!isExpanded ? t('readMore') : t('close')}
              fontSize="10px"
              size="medium"
              primary={true}
              onClick={toggleExpansion}
              classNameComponent="mb-2"
            />
          )} */}
          {(type === 'cards:message' || type === 'cards:messagePublic') && (
            <div>
              {others?.map((other, index) => (
                <GeneralText
                  key={index}
                  text={other?.description || ''}
                  fontSize="12px"
                  size="regular"
                  primary={true}
                  markdown
                />
              ))}
            </div>
          )}
          <div className="d-flex mt-1 justify-content-between">
            <div className="d-flex">
              <Chip
                size="small"
                label={
                  getIconOfLog(type)?.['label_' + currentLangCode] ||
                  getIconOfLog(type)?.['label']
                }
                icon={getIconOfLog(type).icon}
                status={getIconOfLog(type).status}
                sx={{ fontWeight: 500, fontSize: '10px' }}
              />{' '}
              <Chip
                size="small"
                variant="outlined"
                label={getIconOfLog(type).type}
                status={120}
                sx={{ mx: 1, textAlign: 'center' }}
              />
            </div>
            <div>
              <Chip
                size="small"
                variant="outlined"
                noDecoration
                label={badge || 0}
                status={getIconOfLog(type).status}
                sx={{ textAlign: 'center', width: '40px' }}
              />{' '}
            </div>
          </div>
        </div>
      </div>
    </ListItem>
  );
};

export default HistoryMessage;
