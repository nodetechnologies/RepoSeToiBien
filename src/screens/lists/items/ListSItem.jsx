import React, { useEffect, useState } from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import chroma from 'chroma-js';

// utilities
import { useTranslation } from 'react-i18next';
import _ from 'lodash';

import ListItem from '@mui/material/ListItem';
import Avatar from '../../../stories/general-components/Avatar';

import {
  ListItemAvatar,
  ListItemText,
  Box,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import GeneralText from '../../../stories/general-components/GeneralText';
import Chip from '../../../stories/general-components/Chip';
import { BoltOutlined } from '@mui/icons-material';
import { toast } from 'react-toastify';

const ListSItem = ({
  activeModule,
  element,
  customizations,
  handleDisplaySide,
  displaySide,
  handleClick,
}) => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { structureId, moduleName } = useParams();

  const businessPreference = useSelector((state) => state.core.businessData);
  const mainColor = businessPreference?.mainColor || '#000000';

  const [menuAnchor, setMenuAnchor] = useState(null);

  const handleContextMenu = (event) => {
    event.preventDefault();
    setMenuAnchor({
      mouseX: event.clientX - 2,
      mouseY: event.clientY - 4,
    });
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const getStatusColor = (count) => {
    const intensity = count / 10;
    return chroma.mix('grey', mainColor, intensity).hex();
  };

  const columns = displaySide?.structureId
    ? element?.values.slice(0, 4)
    : element?.values;

  return (
    <>
      <ListItem
        key={element?.id}
        dense
        disableRipple
        disableTouchRipple
        divider
        button
        onContextMenu={handleContextMenu}
        sx={{
          overflow: 'hidden',
          cursor: 'pointer',
          height: '35px',
          m: 0,
          p: 0,
          flexWrap: 'nowrap',
          paddingLeft: '4px',
          paddingRight: '4px',
        }}
      >
        {columns?.map((col, idx) => {
          const columnWidth = `${col?.width}%`;
          return (
            <Box
              sx={{
                width: columnWidth,
                paddingLeft: '10px',
                paddingRight: '10px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'normal',
                position: 'relative',
              }}
              key={idx + 'item'}
            >
              {(col?.typeValue === 'text' ||
                col?.typeValue === 'string' ||
                col?.typeValue === 'money' ||
                col?.typeValue === 'number' ||
                col?.typeValue === 'date' ||
                col?.typeValue === 'date-time' ||
                col?.typeValue === 'tags' ||
                col?.typeValue === 'status' ||
                col?.typeValue === 'selection' ||
                col?.typeValue === 'slider' ||
                col?.typeValue === 'boolean' ||
                col?.typeValue === 'assignedTo' ||
                col?.typeValue === 'assignedToId') && (
                <>
                  {col?.fieldType === 'chip' ? (
                    <div style={{ paddingRight: '40px' }}>
                      <Chip
                        primary={
                          element?.isActive === false
                            ? false
                            : col?.valueColor === 'primary'
                            ? true
                            : false
                        }
                        color={
                          element?.isActive === false
                            ? '#a8a8a8'
                            : col?.valueColor ?? 'primary'
                        }
                        label={col?.transformedValue ?? col?.value ?? ''}
                        size="small"
                        fontWeight={600}
                        lineHeight={'1em'}
                        sx={{
                          fontWeight: 600,
                          width: '100%',
                        }}
                        onClick={() => handleClick(element)}
                      />
                    </div>
                  ) : (
                    <ListItemText
                      primary={
                        <GeneralText
                          primary={col?.valueColor === 'primary' ? true : false}
                          size={idx === 0 ? 'bold' : col?.weight || 'regular'}
                          fontSize="11px"
                          keyStructure={col?.structureValue}
                          maxCharacters={54}
                          restrictContent
                          text={col?.transformedValue ?? col?.value ?? ''}
                          type={col?.typeValue || 'string'}
                          color={col?.valueColor ?? 'primary'}
                        />
                      }
                      onClick={() => handleClick(element)}
                    />
                  )}
                </>
              )}
              {col?.typeValue === 'custom:statuses' && (
                <div className="d-flex-3d">
                  {[0, 1, 2, 3].map((status) => {
                    const statusCount = col?.value?.[`status${status}`] ?? 0;
                    return (
                      <div
                        key={status}
                        style={{
                          backgroundColor: getStatusColor(statusCount),
                          width: '25px',
                        }}
                        className="status-square"
                      >
                        {statusCount}
                      </div>
                    );
                  })}
                </div>
              )}

              {(col?.typeValue === 'avatar' ||
                col?.typeValue === 'media' ||
                col?.typeValue === 'media-single') && (
                <ListItemAvatar>
                  <Avatar
                    onClick={() => handleClick(element)}
                    img={
                      col?.value ||
                      `https://storage.googleapis.com/node-business-logos/${element?.businessId}.png` ||
                      ''
                    }
                    name={element?.name ?? ''}
                    alt={col?.value ?? ''}
                    sx={{
                      maxWidth: `${'30px !important'}`,
                      maxHeight: `${'30px !important'}`,
                      borderRadius: '6px !important',
                      padding: '3px',
                    }}
                  />
                </ListItemAvatar>
              )}
            </Box>
          );
        })}
        {customizations?.displayQuickView && !displaySide && (
          <Box sx={{ width: '5%', position: 'absolute', right: 10 }}>
            <IconButton onClick={() => handleDisplaySide(element)}>
              <BoltOutlined
                sx={{
                  fontSize: '20px',
                  '&:hover': {
                    color: mainColor,
                  },
                }}
              />
            </IconButton>
          </Box>
        )}
      </ListItem>
      <Menu
        open={menuAnchor !== null}
        onClose={handleMenuClose}
        anchorReference="anchorPosition"
        anchorPosition={
          menuAnchor !== null
            ? { top: menuAnchor.mouseY, left: menuAnchor.mouseX }
            : undefined
        }
      >
        <MenuItem
          onClick={() => {
            handleMenuClose();
            try {
              window.focus();
              window.navigator.clipboard
                .writeText(element?.id)
                .then(() => {
                  toast.info(t('copied'));
                })
                .catch((err) => {
                  console.error('Clipboard copy failed:', err);
                  toast.error(t('clipboardError'));
                });
            } catch (error) {
              console.error('Clipboard operation failed:', error);
              toast.error(t('clipboardError'));
            }
          }}
        >
          {t('copyId')}
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleMenuClose();
            try {
              window.focus();
              window.navigator.clipboard
                .writeText(element?.name)
                .then(() => {
                  toast.info(t('copied'));
                })
                .catch((err) => {
                  console.error('Clipboard copy failed:', err);
                  toast.error(t('clipboardError'));
                });
            } catch (error) {
              console.error('Clipboard operation failed:', error);
              toast.error(t('clipboardError'));
            }
          }}
        >
          {t('copyName')}
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleMenuClose();
            handleDisplaySide(element);
          }}
        >
          {t('quickView')}
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleMenuClose();
            window.open(
              `/app/element/${activeModule?.collectionField}/${structureId}/${element?.id}`,
              '_blank'
            );
          }}
        >
          {t('openNewTab')}
        </MenuItem>

        <MenuItem
          onClick={() => {
            handleMenuClose();
            handleClick(element, false, true);
          }}
        >
          {t('editElement')}
        </MenuItem>
      </Menu>
    </>
  );
};

export default ListSItem;
