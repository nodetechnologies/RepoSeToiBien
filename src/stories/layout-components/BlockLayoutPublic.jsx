import React, { useState, useEffect } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import ErrorBoundary from '../../components/@generalComponents/ErrorBoundary';
import * as modalActions from '../../redux/actions/modal-actions';
import Paper from '@mui/material/Paper';
import chroma from 'chroma-js';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Divider, Typography, Menu, MenuItem, Tooltip } from '@mui/material';
import ListLayout from '../children-components/ListLayout';
import ContentLayout from '../children-components/ContentLayout';
import ActionLayout from '../children-components/ActionLayout';
import IconButton from '@mui/material/IconButton';

import {
  MoreVert,
  FitScreenOutlined,
  FilterListOutlined,
  PodcastsOutlined,
  InfoOutlined,
  LockOutlined,
  ArrowDownward,
  ArrowUpward,
} from '@mui/icons-material';
import 'react-perfect-scrollbar/dist/css/styles.css';

import Lottie from 'react-lottie';
import animationData from '../../lotties/empty-box';
import GeneralText from '../general-components/GeneralText';

import { useParams } from 'react-router';

const BlockLayoutScroll = ({
  fontColor,
  elementDetails,
  childrenComponent,
  heightPercentage,
  setUpdatedPrimaryData,
  fromList,
  structure,
  componentData,
  layout,
  handleAddItem,
  blockWith,
}) => {
  return (
    <ErrorBoundary>
      {childrenComponent === 'list' ? (
        <ListLayout elementDetails={elementDetails} layout={layout} />
      ) : childrenComponent === 'content' ? (
        <ContentLayout
          fontColor={fontColor}
          elementDetails={elementDetails}
          layout={layout}
          blockWith={blockWith}
          setUpdatedPrimaryData={setUpdatedPrimaryData}
        />
      ) : childrenComponent === 'action' ? (
        <ActionLayout
          elementDetails={elementDetails}
          fromList={fromList}
          layout={layout}
          componentData={componentData}
          structureData={structure}
          heightPercentage={heightPercentage}
          handleAddItem={handleAddItem}
        />
      ) : null}
    </ErrorBoundary>
  );
};

const BlockLayoutPublic = ({
  className,
  noPadding,
  heightPercentage,
  layout,
  noScroll,
  handleClose,
  activeIndex,
  setDrag,
  fromList,
  handleEditBlockContent,
  handleRemoveBlock,
  componentData,
  childrenComponent,
  editMode,
  elementDetails,
  blockWith,
}) => {
  const theme = useTheme();
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const { structureId } = useParams();
  const currentLangCode = i18n.language;
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const [blockData, setBlockData] = useState({
    name: '',
    filter: {},
    labels: true,
    icon: '',
    infos: {},
    selectedColor: 'white',
    bgPattern: '',
    changesInProgress: [],
  });

  const [anchorEl, setAnchorEl] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [blockTransit, setBlockTransit] = useState({});
  const businessPreference = useSelector((state) => state.core.businessData);
  const businessStructure = useSelector(
    (state) => state.core.businessStructure
  );
  const currentUser = useSelector((state) => state.core.user);

  const businessStructures = businessStructure?.structures;
  const structureFields = businessStructures?.find(
    (s) => s.id === layout?.structureId
  )?.fields;

  const structure = businessStructures?.find(
    (s) => s.id === layout?.structureId
  );

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  const orderName = structureFields?.find(
    (f) => f?.value === blockData?.order?.field
  )?.name;

  const isDarkMode = theme.palette.mode === 'dark';
  const mainColor = theme.palette.primary.main;
  const secColor = theme.palette.secondary.main;

  //darker
  const darkColor = chroma(mainColor).darken(0.99).hex();
  const darkSecColor = chroma(secColor).darken(0.99).hex();
  const ultraLightColor = chroma(mainColor).alpha(0.014).css();

  useEffect(() => {
    if (elementDetails?.header) {
      setBlockData({
        ...elementDetails?.header,
        color: layout.color,
        bgPattern: layout?.bgPattern,
        infos: elementDetails?.block?.infos?.display
          ? elementDetails?.block?.infos
          : null,
        changesInProgress: elementDetails?.header?.changesInProgress,
        groups:
          elementDetails?.groups?.length > 0
            ? elementDetails?.groups?.map((group) => ({
                label: businessPreference?.groups?.find(
                  (g) => g.identifiant === group
                )?.name,
                value: group,
                id: group,
              }))
            : null,
      });
    }

    if (elementDetails?.data) {
      setBlockTransit(elementDetails);
    }
  }, [elementDetails]);

  const handleBlock = () => {
    dispatch(
      modalActions.modalEditBlock({
        isOpen: true,
        activeIndex: activeIndex,
        layout: layout,
        childrenComponent: childrenComponent,
        initialData: blockData,
        from: 'public',
      })
    );
  };

  const handleRemove = () => {
    handleRemoveBlock(layout?.i);
  };

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
    setMenuOpen(true);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setMenuOpen(false);
  };

  const handleEditBlock = () => {
    handleCloseMenu();
    if (childrenComponent === 'list') {
      handleEditBlockContent({
        ...layout,
        data: layout?.data?.[0]?.map((element) => {
          return {
            action: element?.action,
            fieldType: element?.fieldType,
            weight: element?.weight,
            label: element?.label,
            typeValue: element?.typeValue,
            selections: element?.selections || [],
            sub: element?.sub || {},
            type: element?.typeValue,
            structureValue: element?.structureValue,
            value: element?.value,
            width: element?.width || 30,
            valueColor: element?.valueColor || 'primary',
          };
        }),
      });
    } else {
      handleEditBlockContent(layout);
    }
  };

  function displayResolver() {
    if (layout?.contentType === 'content') {
      if (layout?.data?.length === 1) {
        return false;
      } else {
        return true;
      }
    } else {
      return true;
    }
  }

  function getColorFromPreferences(statusLabel) {
    const fields = structure?.fields;
    //find the field where the dataType is 'status'
    const statusField = fields?.find((field) => field.typeData === 'status');

    //find the status in the preferences with the field 'selections' under the status
    const status = statusField?.selections?.find(
      (selection) => selection?.label?.toString() === statusLabel?.toString()
    );

    const colorValue = status?.color || theme.palette.primary.main;

    return colorValue;
  }

  function backgroundResolver() {
    if (layout?.data?.length === 1 && layout?.contentType === 'content') {
      if (layout?.data?.[0]?.typeValue === 'status') {
        return getColorFromPreferences(layout?.data?.[0]?.transformedValue);
      }
      if (blockData?.color === 'transparent') {
        return 'transparent';
      } else if (blockData?.color === 'white') {
        return 'transparent';
      } else if (blockData?.color === 'mainColor') {
        return mainColor;
      } else if (blockData?.color === 'secColor') {
        return secColor;
      } else {
        return 'transparent';
      }
    } else {
      if (blockData?.color === 'transparent') {
        return 'transparent';
      } else if (blockData?.color === 'white') {
        return 'transparent';
      } else if (blockData?.color === 'mainColor') {
        return isDarkMode
          ? `#171717`
          : `linear-gradient(20deg, ${ultraLightColor} 30%, ${'#FFFFFF'} 70%)`;
      } else if (blockData?.color === 'secColor') {
        return isDarkMode
          ? `#171717`
          : `linear-gradient(20deg, ${ultraLightColor} 30%, ${'#FFFFFF'} 70%)`;
      } else {
        return 'transparent';
      }
    }
  }

  function fontColorResolver() {
    if (layout?.data?.length === 1 && layout?.contentType === 'content') {
      return blockData?.color === 'white' || blockData?.color === 'transparent'
        ? 'black'
        : 'white';
    } else {
      return 'black';
    }
  }

  return (
    <ErrorBoundary>
      <Paper
        elevation={0}
        sx={{
          backdropFilter: '',
          background: 'transparent',
          borderRadius: '0px',
          border: '0.2px solid',
          borderColor:
            elementDetails?.displayBorder || editMode
              ? '#69696935'
              : 'transparent',
          overflowY: 'hidden',
          overflowX: 'hidden',
          width: '100%',
          padding: '4px',
          minHeight: '100%',
          height: '100%',
        }}
      >
        <div style={{ height: '100%', overflow: 'hidden' }} id="content">
          {displayResolver() ? (
            <div
              style={{
                position: 'sticky',
                top: 0,
                zIndex: 100,
                padding: '4px',
                borderRadius: '8px 8px 0 0',
                background: 'transparent',
                width: '100%',
                borderColor: 'transparent',
                minHeight: isTablet ? '25px' : '35px',
              }}
              id="header-content"
            >
              {blockData && childrenComponent !== 'node' && (
                <div>
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="d-flex">
                      <Typography
                        sx={{ marginLeft: '10px' }}
                        fontSize={isTablet ? '13px' : '15px'}
                        fontWeight={600}
                        color={
                          blockData?.color === 'transparent'
                            ? isDarkMode
                              ? 'white'
                              : 'black'
                            : blockData?.color === 'white'
                            ? isDarkMode
                              ? 'white'
                              : 'black'
                            : blockData?.color === 'mainColor'
                            ? darkColor
                            : blockData?.color === 'secColor'
                            ? darkSecColor
                            : isDarkMode
                            ? 'white'
                            : 'black'
                        }
                        variant="h6"
                      >
                        {blockData?.name ||
                          t('block') + ' ' + elementDetails?.i}
                      </Typography>

                      {blockData?.infos?.display && (
                        <Tooltip title={blockData?.infos?.text}>
                          <InfoOutlined
                            fontSize={isTablet ? '10px' : 'small'}
                            htmlColor={
                              blockData?.color === 'transparent'
                                ? isDarkMode
                                  ? 'white'
                                  : 'black'
                                : blockData?.color === 'white'
                                ? isDarkMode
                                  ? 'white'
                                  : 'black'
                                : blockData?.color === 'mainColor'
                                ? darkColor
                                : blockData?.color === 'secColor'
                                ? darkSecColor
                                : isDarkMode
                                ? 'white'
                                : 'black'
                            }
                            sx={{
                              marginLeft: '8px',
                              marginTop: '2px',
                            }}
                          />
                        </Tooltip>
                      )}
                    </div>

                    <div className="align-right">
                      {blockData?.filter?.operator && (
                        <Tooltip title={t(blockData?.filter?.field)}>
                          <IconButton disabled color="primary">
                            <FilterListOutlined
                              htmlColor={
                                blockData?.color === 'transparent'
                                  ? isDarkMode
                                    ? 'white'
                                    : 'black'
                                  : blockData?.color === 'white'
                                  ? isDarkMode
                                    ? 'white'
                                    : 'black'
                                  : blockData?.color === 'mainColor'
                                  ? darkColor
                                  : blockData?.color === 'secColor'
                                  ? darkSecColor
                                  : isDarkMode
                                  ? 'white'
                                  : 'black'
                              }
                              fontSize={isTablet ? '10px' : 'small'}
                            />
                          </IconButton>
                        </Tooltip>
                      )}
                      {blockData?.order?.direction && (
                        <Tooltip
                          title={
                            t(blockData?.order?.direction + 'order') +
                            ' - ' +
                            (orderName || t(blockData?.order?.field))
                          }
                        >
                          <span>
                            <IconButton color="primary" disabled>
                              {blockData?.order?.direction === 'asc' ? (
                                <ArrowUpward
                                  htmlColor={
                                    blockData?.color === 'transparent'
                                      ? isDarkMode
                                        ? 'white'
                                        : 'black'
                                      : blockData?.color === 'white'
                                      ? isDarkMode
                                        ? 'white'
                                        : 'black'
                                      : blockData?.color === 'mainColor'
                                      ? darkColor
                                      : blockData?.color === 'secColor'
                                      ? darkSecColor
                                      : isDarkMode
                                      ? 'white'
                                      : 'black'
                                  }
                                  fontSize={isTablet ? '10px' : 'small'}
                                />
                              ) : (
                                <ArrowDownward
                                  htmlColor={
                                    blockData?.color === 'transparent'
                                      ? isDarkMode
                                        ? 'white'
                                        : 'black'
                                      : blockData?.color === 'white'
                                      ? isDarkMode
                                        ? 'white'
                                        : 'black'
                                      : blockData?.color === 'mainColor'
                                      ? darkColor
                                      : blockData?.color === 'secColor'
                                      ? darkSecColor
                                      : isDarkMode
                                      ? 'white'
                                      : 'black'
                                  }
                                  fontSize={isTablet ? '10px' : 'small'}
                                />
                              )}
                            </IconButton>
                          </span>
                        </Tooltip>
                      )}

                      {!fromList && (
                        <IconButton color="primary" onClick={handleOpenMenu}>
                          <MoreVert
                            htmlColor={
                              blockData?.color === 'transparent'
                                ? isDarkMode
                                  ? 'white'
                                  : 'black'
                                : blockData?.color === 'white'
                                ? isDarkMode
                                  ? 'white'
                                  : 'black'
                                : blockData?.color === 'mainColor'
                                ? darkColor
                                : blockData?.color === 'secColor'
                                ? darkSecColor
                                : isDarkMode
                                ? 'white'
                                : 'black'
                            }
                            fontSize={isTablet ? '10px' : 'small'}
                          />
                        </IconButton>
                      )}

                      <Menu
                        anchorEl={anchorEl}
                        keepMounted
                        open={menuOpen}
                        onClose={handleCloseMenu}
                      >
                        {' '}
                        {(currentUser?.activeBusiness?.role === 'SUPER-ADMIN' ||
                          currentUser?.activeBusiness?.role === 'ADMIN') && (
                          <MenuItem onClick={handleBlock}>
                            {t('updateBlock')}
                          </MenuItem>
                        )}
                        {currentUser?.activeBusiness?.role ===
                          'SUPER-ADMIN' && (
                          <MenuItem onClick={handleEditBlock}>
                            {t('updateContent')}
                          </MenuItem>
                        )}
                      </Menu>
                    </div>
                  </div>
                  {!editMode && (
                    <div className="px-2">
                      <Divider
                        component="div"
                        sx={{
                          borderColor: '#69696915',
                        }}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div
              style={{
                position: 'absolute',
                top: 0,
                zIndex: 100,
                padding: '4px',
                borderRadius: '8px 8px 0 0',
                background: 'transparent',

                width: '100%',
              }}
              id="header-content"
            >
              {blockData && childrenComponent !== 'node' && (
                <div>
                  <div className="d-flex justify-content-end align-items-center">
                    <div className="align-right">
                      {!fromList && (
                        <IconButton color="primary" onClick={handleOpenMenu}>
                          <MoreVert
                            htmlColor={
                              blockData?.color === 'white' ||
                              blockData?.color === 'transparent'
                                ? 'black'
                                : 'white'
                            }
                            fontSize={isTablet ? '10px' : 'small'}
                          />
                        </IconButton>
                      )}

                      <Menu
                        anchorEl={anchorEl}
                        keepMounted
                        open={menuOpen}
                        onClose={handleCloseMenu}
                      >
                        {' '}
                        {(currentUser?.activeBusiness?.role === 'SUPER-ADMIN' ||
                          currentUser?.activeBusiness?.role === 'ADMIN') && (
                          <MenuItem onClick={handleBlock}>
                            {t('updateBlock')}
                          </MenuItem>
                        )}
                        {currentUser?.activeBusiness?.role ===
                          'SUPER-ADMIN' && (
                          <MenuItem onClick={handleEditBlock}>
                            {t('updateContent')}
                          </MenuItem>
                        )}
                      </Menu>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          <div
            style={{
              overflowY: 'auto',
              padding: '6px',
              height: 'calc(100% - 0px)',
              display: !displayResolver() ? 'flex' : 'block', // Flex layout only for single item
              justifyContent: !displayResolver() ? 'center' : '', // Center horizontally
              alignItems: !displayResolver() ? 'center' : '',
            }}
            id="main-content"
          >
            {editMode ? (
              <div
                className="align-c row mt-4"
                style={{ position: 'relative' }}
              >
                <div className="mb-4">
                  <FitScreenOutlined fontSize="medium" />
                  <GeneralText
                    text={t('editMode')}
                    fontSize="12px"
                    size="medium"
                    primary={true}
                  />
                  <GeneralText
                    text={
                      'ID:' +
                      layout?.i +
                      ' - ' +
                      t('witdh') +
                      ': ' +
                      layout?.w +
                      ' - ' +
                      t('height') +
                      ': ' +
                      layout?.h
                    }
                    fontSize="11px"
                    size="regular"
                    primary={true}
                  />
                  <GeneralText
                    text={t('position') + ': ' + layout?.x + '.' + layout?.y}
                    fontSize="11px"
                    size="regular"
                    primary={true}
                  />{' '}
                </div>
                <div
                  className="hover"
                  onMouseEnter={() => setDrag(false)}
                  onMouseLeave={() => setDrag(true)}
                  style={{ position: 'absolute', bottom: 0, zIndex: 20000 }}
                  onClick={handleRemove}
                >
                  <Typography
                    variant="body1"
                    color="error"
                    sx={{
                      fontSize: '10px',
                      fontWeight: 300,
                      marginTop: '18px',
                    }}
                  >
                    {t('removeBlock')}
                  </Typography>
                </div>
              </div>
            ) : (
              <>
                {layout?.data?.length === 0 &&
                childrenComponent !== 'action' ? (
                  <div className={className + ' row'}>
                    <div
                      className={
                        isTablet
                          ? 'align-center mt-1'
                          : heightPercentage < 30
                          ? ''
                          : 'mt-5'
                      }
                    >
                      <div className="align-c">
                        <Lottie
                          options={defaultOptions}
                          height={40}
                          width={60}
                        />
                      </div>
                      <div
                        className={heightPercentage < 30 ? 'mt-1' : 'mb-2 mb-2'}
                      >
                        <Typography
                          variant="h6"
                          fontSize={isTablet ? '11px' : '13px'}
                          component="div"
                          textAlign={'center'}
                        >
                          {t('empty' + 'empty')}
                        </Typography>
                      </div>
                      <div className={heightPercentage < 30 ? 'mb-1' : 'mb-2'}>
                        <Typography
                          variant="body2"
                          fontSize={isTablet ? '9px' : '10px'}
                          component="div"
                          textAlign={'center'}
                        >
                          {t('theseNoElement')}
                        </Typography>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    className=""
                    style={{
                      padding:
                        blockData?.color === 'transparent'
                          ? '12px'
                          : noPadding
                          ? '3px'
                          : childrenComponent === 'node'
                          ? '0px'
                          : '12px',
                      height: 'auto',
                      overflowX: 'hidden',
                      overflowY:
                        childrenComponent === 'node'
                          ? 'scroll'
                          : noScroll
                          ? 'hidden'
                          : 'auto',
                    }}
                  >
                    {layout?.isRestricted && (
                      <div
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          zIndex: 1000,
                          width: '100%',
                          height: '100%',
                          backdropFilter: 'blur(2px)',
                          backgroundColor: isDarkMode
                            ? '#1c1c1c95'
                            : '#FFFFFF95',
                        }}
                      >
                        <div className="align-c">
                          <div className="mt-5">
                            <LockOutlined
                              fontSize="large"
                              color="error"
                              sx={{ color: 'error' }}
                            />
                          </div>
                          <GeneralText
                            text={t('restricted')}
                            fontSize="14px"
                            size="medium"
                            primary={true}
                          />
                          <GeneralText
                            text={t('restrictedMsg')}
                            fontSize="12px"
                            size="regular"
                            primary={true}
                          />
                        </div>
                      </div>
                    )}
                    {blockTransit?.i === layout?.i &&
                      activeIndex === elementDetails?.index && (
                        <PerfectScrollbar>
                          <BlockLayoutScroll
                            fontColor={fontColorResolver()}
                            elementDetails={blockTransit}
                            layout={layout}
                            blockWith={blockWith}
                            componentData={componentData}
                            structure={structure}
                            fromList={fromList}
                            childrenComponent={childrenComponent}
                            heightPercentage={heightPercentage}
                            handleClose={handleClose}
                          />
                        </PerfectScrollbar>
                      )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </Paper>
    </ErrorBoundary>
  );
};

export default BlockLayoutPublic;
