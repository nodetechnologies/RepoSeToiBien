import React from 'react';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  Divider,
  ListItemText,
  Box,
} from '@mui/material';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import ForwardToInboxOutlinedIcon from '@mui/icons-material/ForwardToInboxOutlined';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import SubdirectoryArrowRightOutlinedIcon from '@mui/icons-material/SubdirectoryArrowRightOutlined';
import PreviewOutlinedIcon from '@mui/icons-material/PreviewOutlined';
import QuestionMarkOutlinedIcon from '@mui/icons-material/QuestionMarkOutlined';
import MessageOutlinedIcon from '@mui/icons-material/MessageOutlined';
import EngineeringOutlinedIcon from '@mui/icons-material/EngineeringOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import { MoreVert } from '@mui/icons-material';

const CardLogs = ({ items }) => {
  const { t } = useTranslation();
  const orderedItems = items?.sort((a, b) => {
    return (
      (a.timeStamp?.seconds || a?.timeStamp?._seconds) -
      (b.timeStamp?.seconds || b?.timeStamp?._seconds)
    );
  });

  const getIconOfLog = (log) => {
    switch (log?.type) {
      case 'cards:confirmed' || 'card:action:confirmed':
        return {
          icon: <CheckCircleOutlineOutlinedIcon fontSize="10px" />,
          label: t('statusConfimed'),
        };
      case 'cards:email' || 'card:email':
        return {
          icon: <ForwardToInboxOutlinedIcon fontSize="10px" />,
          label: t('emailSent'),
        };
      case 'cards:view':
        return {
          icon: <PreviewOutlinedIcon fontSize="10px" />,
          label: t('cardOpened'),
        };
      case 'card:view':
        return {
          icon: <PreviewOutlinedIcon fontSize="10px" />,
          label: t('cardOpened'),
        };
      case 'cards:message':
        return {
          icon: <MessageOutlinedIcon fontSize="10px" />,
          label: t('message'),
        };
      case 'opened:email':
        return {
          icon: <MessageOutlinedIcon fontSize="10px" />,
          label: t('openedEmail'),
        };
      case 'clicked:email':
        return {
          icon: <MessageOutlinedIcon fontSize="10px" />,
          label: t('clickedEmail'),
        };
      case 'profile:maintenance':
        return {
          icon: <EngineeringOutlinedIcon fontSize="10px" />,
          label: log?.data?.profileName,
        };

      default:
        return {
          label: log?.name || log?.type,
          icon: <QuestionMarkOutlinedIcon fontSize="10px" />,
        };
    }
  };

  return (
    <div className="mb-4">
      <List>
        {orderedItems?.length === 0 && (
          <Typography
            variant="h6"
            sx={{
              fontSize: '12px',
              marginLeft: '15px',
              fontWeight: 500,
              mb: 2,
            }}
          >
            {t('noData')}
          </Typography>
        )}
        {orderedItems?.map((item, index) => (
          <ListItem dense divider key={index}>
            <ListItemText
              sx={{ width: '50%' }}
              primary={item?.name}
              primaryTypographyProps={{
                fontSize: '11px',
                fontWeight: 400,
              }}
            />
            <ListItemText
              sx={{ width: '25%' }}
              primary={
                <div className="d-flex">
                  <div className="icon-bg-log">{getIconOfLog(item).icon} </div>
                  <div className="fs-11"> {getIconOfLog(item)?.label}</div>
                </div>
              }
              primaryTypographyProps={{
                fontSize: '11px',
                fontWeight: 300,
              }}
            />
            <ListItemText
              sx={{ width: '25%' }}
              primary={moment
                .unix(item?.timeStamp?.seconds || item?.timeStamp?._seconds)
                .format('DD MMM YYYY HH:mm:ss')}
              primaryTypographyProps={{
                fontSize: '11px',
                fontWeight: 300,
              }}
            />
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default CardLogs;
