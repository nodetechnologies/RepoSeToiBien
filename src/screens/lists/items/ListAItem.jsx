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

const ListAItem = ({
  activeModule,
  element,
  customizations,
  handleDisplaySide,
  isDeleted,
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
          height: '55px',
          m: 0,
          p: 0,
          flexWrap: 'nowrap',
          paddingLeft: '4px',
          paddingRight: '4px',
          filter: isDeleted ? 'blur(3px)' : 'none',
          opacity: isDeleted ? 0.5 : 1,
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
                col?.typeValue === 'dropdown' ||
                col?.typeValue === 'selection' ||
                col?.typeValue === 'slider' ||
                col?.typeValue === 'boolean' ||
                col?.typeValue === 'assignedTo' ||
                col?.typeValue === 'assignedToId') && (
                <>
                  {col?.fieldType === 'chip' ? (
                    <div style={{ paddingRight: '40px' }}>
                      <Chip
                        color={col?.valueColor || 'primary'}
                        label={col?.transformedValue ?? col?.value ?? ''}
                        size="small"
                        fontWeight={600}
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
                          primary={
                            element?.isActive === false
                              ? false
                              : col?.valueColor === 'primary'
                              ? true
                              : false
                          }
                          size={idx === 0 ? 'bold' : col?.weight || 'regular'}
                          fontSize="11px"
                          keyStructure={col?.structureValue}
                          maxCharacters={54}
                          lineHeight={'1em'}
                          fromMain
                          color={
                            element?.isActive === false
                              ? '#a8a8a8'
                              : col?.valueColor ?? 'primary'
                          }
                          restrictContent
                          text={col?.transformedValue ?? col?.value ?? ''}
                          type={col?.typeValue || 'string'}
                        />
                      }
                      secondary={
                        <>
                          {col?.sub?.value !== undefined &&
                            col?.sub?.value !== null && (
                              <GeneralText
                                primary={
                                  col?.sub?.valueColor === 'primary'
                                    ? true
                                    : false
                                }
                                size="regular"
                                fontSize="10px"
                                keyStructure={col?.sub?.structureValue}
                                structureId={col}
                                key={col?.structureValue}
                                color={col?.sub?.valueColor ?? 'primary'}
                                text={
                                  typeof (
                                    col?.sub?.transformedValue ??
                                    col?.sub?.value ??
                                    ''
                                  ) === 'string'
                                    ? String(
                                        col?.sub?.transformedValue ||
                                          col?.sub?.value ||
                                          '-'
                                      ).substring(0, 150)
                                    : col?.sub?.transformedValue ||
                                      col?.sub?.value ||
                                      '-'
                                }
                                type={col?.sub?.typeValue ?? 'text'}
                              />
                            )}
                        </>
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
                      maxWidth: `${'36px !important'}`,
                      maxHeight: `${'36px !important'}`,
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
      {isDeleted && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            textAlign: 'center',
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            color: '#000000',
            fontWeight: 600,
            fontSize: '12px',
            pointerEvents: 'none',
          }}
        >
          {t('deletionInProgress') + '...'}
        </Box>
      )}
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

export default ListAItem;
