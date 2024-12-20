import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import * as drawerActions from '../../../redux/actions-v2/drawer-actions';

// utilities
import { useTranslation } from 'react-i18next';
import _ from 'lodash';

// components
import { useTheme } from '@mui/material/styles';

import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { Box, Chip } from '@mui/material';
import GeneralText from '../../../stories/general-components/GeneralText';

const ListItemCard = ({ activeModule, list, element }) => {
  const { t, i18n } = useTranslation();
  const currentLangCode = i18n.language;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { structureId, moduleName } = useParams();

  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  const handleClick = (item, index) => {
    {
      activeModule?.list?.preferences?.onClick !== 'open'
        ? navigate(
            `/app/element/cards/${item?.structureId}/${
              item?.id || item?.objectID
            }?tab=0`
          )
        : handleQuickview(item);
    }
  };

  const handleClose = () => {
    dispatch(drawerActions.viewElement({ isDrawerOpen: false }));
  };

  const handleQuickview = (item) => {
    dispatch(
      drawerActions.viewElement({
        isDrawerOpen: true,
        item: item,
        handleDrawerClose: handleClose,
        type:
          activeModule?.list?.preferences?.onClick === 'edit' ? 'edit' : 'view',
      })
    );
  };

  const businessStructures = useSelector(
    (state) => state.core.businessStructure
  )?.structures;

  const structure = businessStructures?.find(
    (structure) => structure.id === structureId
  );

  return (
    <ListItem divider disableRipple disableTouchRipple button>
      <Box
        sx={{
          width: '30%',
        }}
      >
        <ListItemText
          primary={
            <GeneralText
              primary={true}
              size="medium"
              fontSize="12px"
              structureId={structure?.id}
              text={element?.targetDetails?.name}
              type={'string'}
            />
          }
          onClick={() => handleClick(element)}
          secondary={
            <GeneralText
              primary={true}
              size="regular"
              fontSize="11px"
              structureId={structure?.id}
              text={`${element?.name || ''} - ${
                element?.targetProfileDetails?.attribute1 || ''
              } ${element?.targetProfileDetails?.attribute2 || ''} ${
                element?.targetProfileDetails?.attribute3 || ''
              }`}
              type={'string'}
            />
          }
        />
      </Box>
      <Box
        sx={{
          width: '15%',
        }}
      >
        <ListItemText
          primary={
            <GeneralText
              primary={true}
              size="regular"
              fontSize="12px"
              structureId={structure?.id}
              text={element?.targetDate}
              type={'date-time'}
            />
          }
          onClick={() => handleClick(element)}
          secondary={
            <GeneralText
              primary={true}
              size="regular"
              fontSize="11px"
              structureId={structure?.id}
              text={`#${element?.searchId?.toUpperCase()}`}
              type={'string'}
            />
          }
        />
      </Box>
      <Box
        sx={{
          width: '15%',
        }}
      >
        <GeneralText
          primary={true}
          size="regular"
          fontSize="12px"
          structureId={structure?.id}
          text={element?.status}
          type={'status'}
        />
      </Box>
      <Box
        sx={{
          width: '15%',
        }}
      >
        <GeneralText
          primary={true}
          size="regular"
          fontSize="12px"
          structureId={structure?.id}
          text={element?.tags}
          type={'tags'}
        />
      </Box>
      <Box
        sx={{
          width: '15%',
        }}
      >
        <GeneralText
          primary={true}
          size="regular"
          fontSize="12px"
          structureId={structure?.id}
          text={element?.assignedToId}
          type={'assigned'}
        />
      </Box>
      <Box
        sx={{
          width: '10%',
        }}
      >
        <ListItemText
          primary={
            <GeneralText
              primary={true}
              size="regular"
              fontSize="12px"
              structureId={structure?.id}
              text={element?.finances?.total}
              type={'money'}
            />
          }
          secondary={
            <GeneralText
              primary={true}
              size="regular"
              fontSize="11px"
              structureId={structure?.id}
              text={`${moment
                .unix(
                  element?.lastUpdate?.seconds ||
                    element?.lastUpdate?._seconds ||
                    element?.lastUpdate / 1000 ||
                    null
                )
                .fromNow()}`}
              type={'string'}
            />
          }
        />
      </Box>
    </ListItem>
  );
};

export default ListItemCard;
