import React, { useState, useEffect } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import ErrorBoundary from '../../components/@generalComponents/ErrorBoundary';
import * as modalActions from '../../redux/actions/modal-actions';
import * as drawerActions from '../../redux/actions-v2/drawer-actions';
import * as Icons from '@mui/icons-material';
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
  EditOutlined,
  LockOutlined,
  ArrowDownward,
  ArrowUpward,
  HourglassBottom,
} from '@mui/icons-material';
import 'react-perfect-scrollbar/dist/css/styles.css';

import Lottie from 'react-lottie';
import animationData from '../../lotties/empty-box';
import nodeAxiosFirebase from '../../utils/nodeAxiosFirebase';
import GeneralText from '../general-components/GeneralText';

import { useParams } from 'react-router';

import { setGeneralStatus } from '../../redux/actions-v2/coreAction';

import DrawerSide from './DrawerSide';
import RequestChanges from './RequestChanges';
import Loading from '../general-components/Loading';

const BlockLayoutScroll = ({
  fontColor,
  elementDetails,
  childrenComponent,
  heightPercentage,
  setUpdatedPrimaryData,
  fromList,
  structure,
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
          structureData={structure}
          heightPercentage={heightPercentage}
          handleAddItem={handleAddItem}
        />
      ) : null}
    </ErrorBoundary>
  );
};

const BlockLayout = ({
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
    createBtn: false,
    editBtn: false,
    refreshBtn: false,
    icon: '',
    infos: {},
    selectedColor: 'white',
    bgPattern: '',
    changesInProgress: [],
  });

  const [anchorEl, setAnchorEl] = useState(null);
  const [formData, setFormData] = useState({});
  const [menuOpen, setMenuOpen] = useState(false);
  const [elementDetailsTransit, setElementDetailsTransit] = useState({});
  const [isLoadingChanges, setIsLoadingChanges] = useState(false);
  const [openDrawerChanges, setOpenDrawerChanges] = useState(false);
  const [blockTransit, setBlockTransit] = useState({});
  const businessPreference = useSelector((state) => state.core.businessData);
  const businessStructure = useSelector(
    (state) => state.core.businessStructure
  );
  const currentUser = useSelector((state) => state.core.user);
  const currentStatus = useSelector((state) => state.core.status);
  const activeUser = businessPreference?.employees?.find(
    (employee) => employee.id === currentUser?.uid
  );

  const businessStructures = businessStructure?.structures;
  const structureFields = businessStructures?.find(
    (s) => s.id === layout?.structureId
  )?.fields;

  const structure = businessStructures?.find(
    (s) => s.id === layout?.structureId
  );

  const currentIconStructure = businessStructures?.find(
    (s) => s.id === layout?.structureId
  )?.icon;

  const CurrentIcon = Icons[currentIconStructure] || Icons.FolderOutlined;
  const currentNameStructure = businessStructures?.find(
    (s) => s.id === layout?.structureId
  )?.name;

  const singleElement = useSelector(
    (state) => state.element.singleElementDetails
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
  const lightColor = chroma(mainColor).alpha(0.09).css();
  const lightSecColor = chroma(secColor).alpha(0.09).css();
  const ultraLightColor = chroma(mainColor).alpha(0.014).css();
  const ultraLightSecColor = chroma(secColor).alpha(0.014).css();
  const ultraDarkColor = chroma(mainColor).darken(4).hex();
  const ultraDarkSecColor = chroma(secColor).darken(4).hex();

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
      setElementDetailsTransit(elementDetails?.data);
    }
  }, [elementDetails]);

  const handleSaveChanges = async () => {
    setIsLoadingChanges(true);
    try {
      await nodeAxiosFirebase({
        t,
        method: 'POST',
        url: `business/request`,
        body: {
          structureId: structureId,
          lang: currentLangCode,
          path: window.location.pathname,
          data: {
            tabIndex: activeIndex,
            blockIdentifiant: layout?.i,
            changes: formData,
            blockData: {
              ...blockData,
            },
          },
        },
      });
      setIsLoadingChanges(false);
      handleCloseChanges();
      setBlockData({
        ...blockData,
        changesInProgress: [
          {
            status: 'in-progress',
            tab: activeIndex,
            block: layout?.i,
          },
          ...blockData?.changesInProgress,
        ],
      });
    } catch (error) {
      console.error('Error set block');
      dispatch(setGeneralStatus({ status: 'error', error: error }));
    }
  };

  const handleAddItem = async (item, option, group, type, quantity) => {
    dispatch(
      setGeneralStatus({
        status: 'loading',
        position: group ? group : 'add-item',
        type: 'skeleton',
      })
    );
    await nodeAxiosFirebase({
      t,
      method: 'POST',
      url: `coreSeqV2`,
      body: {
        name: t('item'),
        tags: [],
        elementPath: layout?.mainElement?.documentPath + '/items',
        structureId: layout?.structureId,
        blockStructure: structureId,
        tabIndex: activeIndex,
        blockIdentifiant: layout?.i,
        lang: currentLangCode,
        data: {
          status: 0,
          targetId: 'users/' + layout?.mainElement?.targetId,
          dependencyId: layout?.mainElement?.documentPath,
          targetProfileId: layout?.mainElement?.targetProfileId
            ? 'profiles/' + layout?.mainElement?.targetProfileId
            : null,
          hookedWith: item?.hookedId
            ? item?.hookedId
            : type === 0
            ? 'services/' + item?.id || item?.objectID
            : 'articles/' + item?.id || item?.objectID,
          quantity: quantity || 1,
          group: group || '',
          options: option
            ? [
                {
                  name: option?.name,
                  price: option?.price,
                  tax1: option?.tax1 || true,
                  tax2: option?.tax2 || true,
                },
              ]
            : [],
        },
      },
    });
    dispatch(setGeneralStatus({ status: 'success' }));
  };

  const handleUpdateRefresh = async () => {
    dispatch(setGeneralStatus({ status: 'loading' }));
    handleCloseMenu();

    const pathWithoutId = layout?.mainElement?.documentPath?.split('/');
    pathWithoutId.pop();
    await nodeAxiosFirebase({
      t,
      method: 'POST',
      url: `coreSeqV2/refresh`,
      body: {
        elementPath: layout?.mainElement?.documentPath,
      },
    });
    dispatch(setGeneralStatus({ status: 'success' }));
  };

  const openCreateModal = () => {
    if (layout?.type === 'mainCardItems' || layout?.type === 'secCardItems') {
      dispatch(
        modalActions.modalAddItem({
          isOpen: true,
          group: null,
          defaultTab: 0,
          onSelect: handleAddItem,
        })
      );
    } else {
      const match = layout?.match?.split(':')[0];

      dispatch(
        modalActions.modalElementCreation({
          isOpen: true,
          fromElement: true,
          structureId: layout?.structureId,
          elementPath: layout?.mainElement?.documentPath || null,
          dependencyHook: layout?.match || '',
          dependencyId: singleElement?.documentPath,
          targetProfileId:
            match === 'targetProfileId'
              ? layout?.mainElement?.targetProfileId
              : null,
          targetId: layout?.mainElement?.targetId,
          blockLayoutDetails: {
            blockIdentifiant: layout?.i,
            blockStructure: structureId,
            tabIndex: activeIndex,
          },
          handleDone: (data) => handleUpdateElement(data),
        })
      );
    }
  };

  const handleBlock = () => {
    dispatch(
      modalActions.modalEditBlock({
        isOpen: true,
        activeIndex: activeIndex,
        layout: layout,
        childrenComponent: childrenComponent,
        initialData: blockData,
      })
    );
  };
  const handleUpdateElement = (data) => {
    const newElement = elementDetailsTransit;
    newElement.push([...data]);
    setBlockTransit({ ...blockTransit, data: newElement });
  };

  const handleUpdateElementDrawer = (key, value) => {
    const indexToUpdate = layout?.data?.findIndex(
      (element) => element?.structureValue === key
    );

    const newElement = elementDetailsTransit;
    newElement[indexToUpdate]['value'] = value;
    newElement[indexToUpdate]['transformedValue'] = value;

    setBlockTransit({ ...blockTransit, data: newElement });
  };

  const handleRemove = () => {
    handleRemoveBlock(layout?.i);
  };

  const openDrawerEdit = () => {
    if (layout?.data[0]?.primaryData?.elementPath) {
      dispatch(
        drawerActions.viewElement({
          isDrawerOpen: true,
          item: {
            id: layout?.data[0]?.primaryData?.elementId,
            documentPath: layout?.data[0]?.primaryData?.elementPath,
            name: layout?.data[0]?.primaryData?.name,
            targetId: layout?.data[0]?.primaryData?.targetId,
            lastUpdate: layout?.data[0]?.primaryData?.lastUpdate,
          },
          handleDrawerClose: handleClose,
          type: 'edit',
          handleUpdate: (key, value) => handleUpdateElementDrawer(key, value),
        })
      );
    }
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

  const handleRequestChanges = () => {
    setOpenDrawerChanges(true);
  };

  const handleCloseChanges = () => {
    setOpenDrawerChanges(false);
    setFormData({});
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
      (selection) =>
        selection?.['label_' + currentLangCode]?.toString() ===
        statusLabel?.toString()
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
        return isDarkMode ? '#171717' : '#ffffff';
      } else if (blockData?.color === 'mainColor') {
        return mainColor;
      } else if (blockData?.color === 'secColor') {
        return secColor;
      } else {
        return isDarkMode ? '#171717' : '#f6f6f6';
      }
    } else {
      if (blockData?.color === 'transparent') {
        return 'transparent';
      } else if (blockData?.color === 'white') {
        return isDarkMode ? '#171717' : '#ffffff';
      } else if (blockData?.color === 'mainColor') {
        return isDarkMode
          ? `#171717`
          : `linear-gradient(20deg, ${ultraLightColor} 30%, ${'#FFFFFF'} 70%)`;
      } else if (blockData?.color === 'secColor') {
        return isDarkMode
          ? `#171717`
          : `linear-gradient(20deg, ${ultraLightColor} 30%, ${'#FFFFFF'} 70%)`;
      } else {
        return isDarkMode ? '#171717' : '#f6f6f6';
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
      <DrawerSide
        isDrawerOpen={openDrawerChanges}
        isCreation={true}
        title={t('requestChanges') + ' - ' + blockData?.name}
        handleDrawerClose={handleCloseChanges}
        isLoading={isLoadingChanges}
      >
        <RequestChanges
          formData={formData}
          setFormData={setFormData}
          handleSend={handleSaveChanges}
          structureId={structureId}
          existingFields={layout?.data?.map(
            (element) => element?.structureValue
          )}
        />
      </DrawerSide>
      <Paper
        elevation={0}
        sx={{
          backdropFilter:
            activeUser?.preferences?.blur === 0 ? '' : 'blur(5.8px)',
          background: backgroundResolver(),
          borderRadius: '8px',
          border: '0.2px solid',
          borderColor:
            blockData?.color === 'transparent'
              ? '#69696930'
              : blockData?.color === 'white'
              ? '#69696930'
              : blockData?.color === 'mainColor'
              ? darkColor + '30'
              : blockData?.color === 'secColor'
              ? darkSecColor + '30'
              : '#69696930',
          overflowY: 'hidden',
          overflowX: 'hidden',
          width: '100%',
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
                background:
                  blockData?.color === 'transparent'
                    ? 'transparent'
                    : blockData?.color === 'white'
                    ? isDarkMode
                      ? `linear-gradient(178deg, ${'#0f0f0f'} 25%, ${'#1c1c1c'} 52%, #1c1c1c 75%)`
                      : `linear-gradient(178deg, ${'#dedede70'} 25%, ${'#f5f5f5'} 52%, #FFFFFF 75%)`
                    : blockData?.color === 'mainColor'
                    ? isDarkMode
                      ? `linear-gradient(178deg, ${
                          ultraDarkColor + '70'
                        } 25%, ${'#0f0f0f'} 52%, #1c1c1c 75%)`
                      : `linear-gradient(178deg, ${lightColor} 25%, ${ultraLightColor} 52%, #FFFFFF 75%)`
                    : blockData?.color === 'secColor'
                    ? isDarkMode
                      ? `linear-gradient(178deg, ${
                          ultraDarkSecColor + '70'
                        } 25%, ${'#0f0f0f'} 52%, #1c1c1c 75%)`
                      : `linear-gradient(178deg, ${lightSecColor} 25%, ${ultraLightSecColor} 52%, #FFFFFF 75%)`
                    : '#dedede',
                width: '100%',
                borderBottom: '0.2px solid',
                borderColor:
                  blockData?.color === 'transparent'
                    ? '#69696930'
                    : blockData?.color === 'white'
                    ? '#69696930'
                    : blockData?.color === 'mainColor'
                    ? darkColor + '30'
                    : blockData?.color === 'secColor'
                    ? darkSecColor + '30'
                    : '#69696930',
                minHeight: isTablet ? '25px' : '35px',
              }}
              id="header-content"
            >
              {blockData && childrenComponent !== 'node' && (
                <div>
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="d-flex">
                      {blockData?.realtime ? (
                        <Tooltip title={t('realtime')}>
                          <PodcastsOutlined
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
                              marginTop: '3px',
                            }}
                          />
                        </Tooltip>
                      ) : (
                        <Tooltip title={currentNameStructure}>
                          {currentStatus?.status === 'loading' &&
                          currentStatus?.position ===
                            'edit-block' + layout?.i ? (
                            <Loading size={'small'} type={'circle'} />
                          ) : (
                            <CurrentIcon
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
                                marginTop: '4px',
                              }}
                            />
                          )}
                        </Tooltip>
                      )}
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
                        {blockData?.name}
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
                      {blockData?.createBtn && !fromList && (
                        <Tooltip title={t('createNewElement')}>
                          <IconButton color="primary" onClick={openCreateModal}>
                            <Icons.AddCircleOutlineOutlined
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
                                borderRadius: '50%',
                                padding: '1.5px',

                                fontSize: '18px',
                              }}
                              fontSize={isTablet ? '10px' : 'small'}
                            />
                          </IconButton>
                        </Tooltip>
                      )}

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
                      {blockData?.editBtn && !fromList && (
                        <Tooltip title={t('edit')}>
                          <IconButton color="primary" onClick={openDrawerEdit}>
                            <EditOutlined
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
                      {blockData?.changesInProgress?.some(
                        (change) =>
                          change.tab === activeIndex &&
                          change.block === layout?.i
                      ) && (
                        <Tooltip title={t('changesInProgress')}>
                          <HourglassBottom
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
                            style={{ paddingTop: '4px', marginBottom: '-2px' }}
                          />
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
                        {(currentUser?.activeBusiness?.role === 'SUPER-ADMIN' ||
                          currentUser?.activeBusiness?.role === 'ADMIN') && (
                          <MenuItem onClick={handleRequestChanges}>
                            {t('requestChanges')}
                          </MenuItem>
                        )}
                        {currentUser?.activeBusiness?.role !== 'EMPLOYEE' &&
                          currentUser?.activeBusiness?.role !== 'VIEWER' && (
                            <MenuItem onClick={handleUpdateRefresh}>
                              {t('refreshData')}
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
                        {(currentUser?.activeBusiness?.role === 'SUPER-ADMIN' ||
                          currentUser?.activeBusiness?.role === 'ADMIN') && (
                          <MenuItem onClick={handleRequestChanges}>
                            {t('requestChanges')}
                          </MenuItem>
                        )}
                        {currentUser?.activeBusiness?.role !== 'EMPLOYEE' &&
                          currentUser?.activeBusiness?.role !== 'VIEWER' && (
                            <MenuItem onClick={handleUpdateRefresh}>
                              {t('refreshData')}
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
                            structure={structure}
                            fromList={fromList}
                            childrenComponent={childrenComponent}
                            heightPercentage={heightPercentage}
                            handleClose={handleClose}
                            handleAddItem={handleAddItem}
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

export default BlockLayout;
