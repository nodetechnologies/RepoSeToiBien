import React, { useState, useEffect } from 'react';
import Avatar from '../general-components/Avatar';
import { PermMediaOutlined } from '@mui/icons-material';
import ErrorBoundary from '../../components/@generalComponents/ErrorBoundary';
import * as drawerActions from '../../redux/actions-v2/drawer-actions';
import { useTheme } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import {
  List,
  ListItem,
  ListItemText,
  Box,
  ListItemAvatar,
  ListItemButton,
  Typography,
} from '@mui/material';
import GeneralText from '../general-components/GeneralText';

const ListLayout = ({ elementDetails, layout }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [openDialogImg, setOpenDialogImg] = useState(false);
  const [images, setImages] = useState([]);
  const [list, setList] = useState([]);
  const isDarkMode = theme.palette.mode === 'dark';

  const structure = elementDetails?.structure;

  const container = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.8,
      },
    },
  };

  const itemLine = {
    hidden: { x: -50, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: 'easeOut',
      },
    },
  };

  const filterBy = (list, condition) => {
    if (!condition) return list;

    const { field, operator, value } = condition;
    return list.filter((item) => {
      const itemIndex = item?.findIndex(
        (entry) => entry.structureValue === field
      );

      if (itemIndex === -1) return false;

      const itemValue = item[itemIndex].value;
      switch (operator) {
        case '==':
          return itemValue === value;
        case '!=':
          return itemValue !== value;
        case '<':
          return itemValue < value;
        case '>':
          return itemValue > value;
        case '<=':
          return itemValue <= value;
        case '>=':
          return itemValue >= value;
        default:
          return true;
      }
    });
  };

  const orderBy = (list, field, direction) => {
    let valueIndex = -1;
    const structureValues = list?.[0]?.map((item) => item?.structureValue);

    if (structureValues?.includes(field)) {
      valueIndex =
        list?.length > 0 &&
        list?.[0]?.findIndex((item) => item?.structureValue === field);
    }

    if (valueIndex === -1) {
      console.warn('Field not found in the data');
      return list;
    }

    return list?.sort((a, b) => {
      const aValue =
        a[valueIndex]?.value?.seconds ||
        a[valueIndex]?.value?._seconds ||
        a[valueIndex]?.value;
      const bValue =
        b[valueIndex]?.value?.seconds ||
        b[valueIndex]?.value?._seconds ||
        b[valueIndex]?.value;

      // Handle string sorting
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return direction === 'desc'
          ? bValue.localeCompare(aValue)
          : aValue.localeCompare(bValue);
      }

      // Handle number sorting
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return direction === 'desc' ? bValue - aValue : aValue - bValue;
      }

      // Handle cases where one is a string and the other is a number
      if (typeof aValue === 'string' && typeof bValue === 'number') {
        return direction === 'desc' ? 1 : -1;
      }

      if (typeof aValue === 'number' && typeof bValue === 'string') {
        return direction === 'desc' ? -1 : 1;
      }

      return 0;
    });
  };

  const handleQuickview = (item, index) => {
    if (item[0]?.action === 'navigate') {
      navigateItem(item, 'item');
    } else if (item[0]?.action === 'openParent') {
      navigateItem(item, 'parent');
    } else if (item[0]?.action === 'quickview') {
      dispatch(
        drawerActions.viewElement({
          isDrawerOpen: true,
          item: {
            id: item[0]?.primaryData?.elementId,
            documentPath: item[0]?.primaryData?.elementPath,
            name: item[0]?.primaryData?.name,
            targetId: item[0]?.primaryData?.targetId,
            lastUpdate: item[0]?.primaryData?.lastUpdate,
          },
          handleDrawerClose: handleClose,
          handleUpdate: (key, value) =>
            handleUpdateElementDrawer(key, value, index),
          handleDelete: () => handleDeleteElementDrawer(index),
          type: 'view',
        })
      );
    } else if (item[0]?.action === 'edit') {
      dispatch(
        drawerActions.viewElement({
          isDrawerOpen: true,
          item: {
            id: item[0]?.primaryData?.elementId,
            documentPath: item[0]?.primaryData?.elementPath,
            name: item[0]?.primaryData?.name,
            targetId: item[0]?.primaryData?.targetId,
            lastUpdate: item[0]?.primaryData?.lastUpdate,
          },
          handleDrawerClose: handleClose,
          handleUpdate: (key, value) =>
            handleUpdateElementDrawer(key, value, index),
          handleDelete: () => handleDeleteElementDrawer(index),
          type: 'edit',
        })
      );
    } else if (item[0]?.action === 'none') {
      return;
    }
  };

  const handleUpdateElementDrawer = (key, value, index) => {
    const newList = list?.map((item, i) => {
      if (i === index) {
        const elementIndexToUpdate = item?.findIndex(
          (entry) => entry.structureValue === key
        );

        if (elementIndexToUpdate === -1) return item;

        return item?.map((element, j) => {
          if (j === elementIndexToUpdate) {
            return {
              ...element,
              value:
                element?.typeValue === 'date' ||
                element?.typeValue === 'date-time'
                  ? { _seconds: value?.unix(), seconds: value?.unix() }
                  : value,
              transformedValue:
                element?.typeValue === 'status'
                  ? element?.transformedValue
                  : element?.typeValue === 'date' ||
                    element?.typeValue === 'date-time'
                  ? { _seconds: value?.unix(), seconds: value?.unix() }
                  : value,
            };
          }
          return element;
        });
      }
      return item;
    });

    setList(newList);
  };

  const navigateItem = (item, type) => {
    if (type === 'item') {
      navigate(
        '/app/element/' +
          item[0]?.collectionField +
          '/' +
          item[0]?.structureId +
          '/' +
          item[0]?.primaryData?.elementId +
          '?tab=0'
      );
    } else if (type === 'parent') {
      navigate(
        '/app/element/' +
          item[0]?.primaryData?.dependencyDetails?.collectionField +
          '/' +
          item[0]?.primaryData?.dependencyDetails?.structureIdentifiant +
          '/' +
          item[0]?.primaryData?.dependencyDetails?.id +
          '?tab=0'
      );
    }
    handleClose();
  };

  const handleDeleteElementDrawer = (index) => {
    const newList = list?.filter((item, i) => i !== index);
    setList(newList);
    handleClose();
  };

  useEffect(() => {
    let resultData = Array.isArray(elementDetails?.data)
      ? elementDetails?.data
      : [];

    if (layout?.header?.filter?.value !== undefined) {
      resultData = filterBy(resultData, layout?.header?.filter);
    }

    if (
      layout?.header?.order?.direction &&
      resultData?.length > 0 &&
      layout?.header?.order?.field
    ) {
      resultData = orderBy(
        resultData,
        layout?.header?.order?.field,
        layout?.header?.order?.direction
      );
    }

    setList(resultData);
  }, [elementDetails?.data, layout?.header?.order, layout?.filter]);

  const handleClose = () => {
    dispatch(drawerActions.viewElement({ isDrawerOpen: false }));
  };

  const handleOpenDialog = (photos) => {
    setOpenDialogImg(true);
    setImages(photos);
  };

  function resolveComponent() {
    return (
      <motion.ul
        variants={container}
        initial="hidden"
        animate="visible"
        style={{ listStyleType: 'none', padding: 0, margin: 0 }}
      >
        <List dense sx={{ width: '100%', m: 0, p: 0 }}>
          {list?.length > 0 &&
            Array.isArray(list) &&
            list?.map((item, index) => {
              return (
                <motion.li
                  key={index}
                  style={{ margin: 0, padding: 0, width: '100%' }}
                  variants={itemLine}
                >
                  <ListItem
                    sx={{
                      overflow: 'hidden',
                      cursor: 'pointer',
                      height: '46px',
                      m: 0,
                      p: 0,
                      justifyContent: 'space-between',
                      borderBottom:
                        index !== list?.length - 1
                          ? isDarkMode
                            ? '0.3px solid #69696990'
                            : '0.3px solid #00000040'
                          : '',
                    }}
                    button
                    className="middle-content"
                    dense
                    alignItems="flex-start"
                    key={index}
                  >
                    {Array.isArray(item) &&
                      item?.map((col, idx) => {
                        const columnWidth = `${col?.width}%`;
                        return (
                          <Box
                            sx={{
                              width: columnWidth,
                              position: 'relative',
                              overflow: 'hidden',
                              paddingRight: '4px',
                              cursor: 'pointer',
                              padding: '4px',
                              marginLeft: '6px',
                              height: '46px',
                            }}
                            key={idx + col?.structureValue}
                          >
                            {(col?.typeValue === 'text' ||
                              col?.typeValue === 'string' ||
                              col?.typeValue === 'number' ||
                              col?.typeValue === 'money' ||
                              col?.typeValue === 'node' ||
                              col?.typeValue === 'date' ||
                              col?.typeValue === 'date-time' ||
                              col?.typeValue === 'status' ||
                              col?.typeValue === 'selection' ||
                              col?.typeValue === 'boolean' ||
                              col?.typeValue === 'assignedTo') && (
                              <ListItemText
                                onClick={() => handleQuickview(item, index)}
                                primary={
                                  <GeneralText
                                    layout={layout}
                                    primary={
                                      col?.valueColor === 'primary'
                                        ? true
                                        : false
                                    }
                                    size={
                                      idx === 0
                                        ? 'bold'
                                        : col?.weight || 'medium'
                                    }
                                    fontSize="11px"
                                    lineHeight={'1em'}
                                    structureId={col?.structureId}
                                    text={col?.transformedValue ?? ''}
                                    keyStructure={col?.structureValue}
                                    type={col?.typeValue || 'string'}
                                    classNameComponent="clickable"
                                    color={col?.valueColor}
                                  />
                                }
                                secondary={
                                  <>
                                    {col?.sub?.value && (
                                      <GeneralText
                                        primary={true}
                                        size="regular"
                                        fontSize="10px"
                                        classNameComponent="clickable"
                                        structureId={structure?.id}
                                        text={col.sub?.transformedValue ?? ''}
                                        keyStructure={col?.sub?.structureValue}
                                        type={col.sub?.typeValue ?? 'text'}
                                      />
                                    )}
                                  </>
                                }
                              />
                            )}
                            {col?.typeValue === 'media' && (
                              <ListItemButton
                                onClick={() => handleOpenDialog(col?.value)}
                              >
                                <PermMediaOutlined />
                              </ListItemButton>
                            )}
                            {(col?.typeValue === 'avatar' ||
                              col?.typeValue === 'media-single') && (
                              <ListItemAvatar
                                onClick={() => handleQuickview(item, index)}
                              >
                                <Avatar
                                  img={col?.value ?? ''}
                                  name={col?.value ?? ''}
                                  alt={col?.value ?? ''}
                                  sx={{
                                    maxWidth: `${'40px !important'}`,
                                    maxHeight: `${'40px !important'}`,
                                    borderRadius: '6px !important',
                                    padding: '4px',
                                  }}
                                />
                              </ListItemAvatar>
                            )}
                          </Box>
                        );
                      })}
                  </ListItem>
                </motion.li>
              );
            })}
        </List>
      </motion.ul>
    );
  }

  return (
    <ErrorBoundary>
      <div style={{ overflowX: 'hidden', marginTop: '-10px' }}>
        {/* Static Header */}
        {layout?.header?.labels && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              height: '25px',
              borderBottom: isDarkMode
                ? '0.3px solid #69696970'
                : '0.3px solid #00000030',
            }}
          >
            {list?.length > 0 &&
              list?.[0]?.map((col, idx) => {
                const columnWidth = `${col?.width}%`;
                return (
                  <Box
                    sx={{
                      width: columnWidth,
                      position: 'relative',
                      overflow: 'hidden',
                      paddingRight: '4px',
                      cursor: 'pointer',
                      flexWrap: 'nowrap',
                      marginLeft: '6px',
                      paddingLeft: '3px',
                      paddingRight: '3px',
                      height: '28px',
                      alignContent: 'center',
                    }}
                    key={idx + col?.structureValue}
                  >
                    <Typography
                      key={idx + col?.structureValue}
                      variant="subtitle1"
                      title={col?.label}
                      fontWeight={400}
                      color={isDarkMode ? '#F9f9f995' : '#69696995'}
                      fontSize={10.5}
                      lineHeight={1}
                      sx={{
                        display: '-webkit-box',
                        WebkitLineClamp: 1,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {col?.label}
                    </Typography>
                  </Box>
                );
              })}
          </Box>
        )}

        {/* List Content */}
        {resolveComponent()}
      </div>
    </ErrorBoundary>
  );
};

export default ListLayout;
