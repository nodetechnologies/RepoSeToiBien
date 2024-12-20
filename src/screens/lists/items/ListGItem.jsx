import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import * as drawerActions from '../../../redux/actions-v2/drawer-actions';

// utilities
import { useTranslation } from 'react-i18next';
import mapItemDetails from '../../../utils/mapItemDetails';
import _ from 'lodash';

// components
import { useTheme } from '@mui/material/styles';

import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import {
  Box,
  Typography,
  Tooltip,
  List,
  Checkbox,
  TextField,
  ListItemAvatar,
  Divider,
} from '@mui/material';
import Avatar from '../../../stories/general-components/Avatar';
import GeneralText from '../../../stories/general-components/GeneralText';

const ListGItem = ({ activeModule, list, element }) => {
  const { t, i18n } = useTranslation();
  const currentLangCode = i18n.language;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { structureId, moduleName } = useParams();

  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  const handleClick = (item, index) => {
    {
      activeModule?.list?.preferences?.onClick === 'open'
        ? navigate(
            `/app/element/${moduleName}/${structureId}/${
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

  const elementDetails = {
    data: {
      elements: activeModule?.list?.fields,
    },
  };

  const { mappedDetails, mappedDetailsLabel } = mapItemDetails(
    element,
    elementDetails,
    structure,
    t,
    currentLangCode
  );

  return (
    <ListItem
      key={element?.id}
      button
      disableRipple
      disableTouchRipple
      divider
      onClick={() => handleClick(element)}
    >
      <Box sx={{ width: '5%' }}>
        <ListItemAvatar>
          <Avatar
            onClick={() => handleClick(element)}
            img={_.get(mappedDetails, 'image.value')}
            name={_.get(mappedDetails, 'title.value')}
            alt={_.get(mappedDetails, 'title.value')}
            sx={{
              maxWidth: `${'40px !important'}`,
              maxHeight: `${'40px !important'}`,
              borderRadius: '6px !important',
              padding: '4px',
            }}
          />
        </ListItemAvatar>
      </Box>
      <Box sx={{ width: '30%' }}>
        <ListItemText
          primary={
            <GeneralText
              primary={true}
              size="medium"
              fontSize="12px"
              structureId={structure?.id}
              text={_.get(mappedDetails, 'title.value') ?? ''}
              type={_.get(mappedDetailsLabel, 'title.type')}
            />
          }
          secondary={
            <GeneralText
              primary={true}
              size="regular"
              fontSize="11px"
              maxCharacters={60}
              structureId={structure?.id}
              text={_.get(mappedDetails, 'subTitle.value') ?? ''}
              type={_.get(mappedDetailsLabel, 'subTitle.type')}
            />
          }
        />
      </Box>
      <Box sx={{ width: '15%' }}>
        <ListItemText
          primary={
            <GeneralText
              primary={true}
              size="medium"
              fontSize="12px"
              structureId={structure?.id}
              text={_.get(mappedDetails, 'value1.value') ?? ''}
              type={_.get(mappedDetailsLabel, 'value1.type')}
            />
          }
          secondary={
            <GeneralText
              primary={true}
              size="regular"
              fontSize="11px"
              structureId={structure?.id}
              text={_.get(mappedDetails, 'value1sub.value') ?? ''}
              type={_.get(mappedDetailsLabel, 'value1sub.type')}
            />
          }
        />
      </Box>

      <Box sx={{ width: '15%' }}>
        <ListItemText
          primary={
            <GeneralText
              primary={true}
              size="medium"
              fontSize="12px"
              structureId={structure?.id}
              text={_.get(mappedDetails, 'value2.value') ?? ''}
              type={_.get(mappedDetailsLabel, 'value2.type')}
            />
          }
          secondary={
            <GeneralText
              primary={true}
              size="regular"
              fontSize="11px"
              structureId={structure?.id}
              text={_.get(mappedDetails, 'value2sub.value') ?? ''}
              type={_.get(mappedDetailsLabel, 'value2sub.type')}
            />
          }
        />
      </Box>
      <Box sx={{ width: '20%' }}>
        <ListItemText
          primary={
            <GeneralText
              primary={true}
              size="medium"
              fontSize="12px"
              structureId={structure?.id}
              text={_.get(mappedDetails, 'value3.value') ?? ''}
              type={_.get(mappedDetailsLabel, 'value3.type')}
            />
          }
          secondary={
            <GeneralText
              primary={true}
              size="regular"
              fontSize="11px"
              structureId={structure?.id}
              text={_.get(mappedDetails, 'value3sub.value') ?? ''}
              type={_.get(mappedDetailsLabel, 'value3sub.type')}
            />
          }
        />
      </Box>

      <Box sx={{ width: '10%' }}>
        <ListItemText
          primary={
            <GeneralText
              primary={true}
              size="medium"
              fontSize="12px"
              structureId={structure?.id}
              text={_.get(mappedDetails, 'value4.value') ?? ''}
              type={_.get(mappedDetailsLabel, 'value4.type')}
            />
          }
        />
      </Box>
    </ListItem>
  );
};

export default ListGItem;
