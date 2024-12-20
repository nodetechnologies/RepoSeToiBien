import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import * as modalActions from '../../../redux/actions/modal-actions';
import chroma from 'chroma-js';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import * as Icons from '@mui/icons-material';
import {
  Button,
  Divider,
  Menu,
  MenuItem,
  Autocomplete,
  Typography,
  Badge,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  doc,
  collectionGroup,
  getCountFromServer,
  where,
  query,
} from 'firebase/firestore';
import { db } from '../../../firebase';
import { TextField as TextFieldMUI } from '@mui/material';
import { useDrop } from 'react-dnd';
import nodeAxiosFirebase from '../../../utils/nodeAxiosFirebase';
import TextField from '../../../stories/general-components/TextField';
import getRandomString from '../../../utils/getRandomString';
import EditModule from './EditModule';
import GeneralText from '../../../stories/general-components/GeneralText';
import {
  setCurrentSection,
  setGeneralStatus,
} from '../../../redux/actions-v2/coreAction';
import DrawerSide from '../../../stories/layout-components/DrawerSide';
import Loading from '../../../stories/general-components/Loading';
import moment from 'moment';
import Modules from './Modules';
import AppointmentsIcon from '../../../components/@generalComponents/layout/Icons/AppointmentsIcon';
import DailyManagementIcon from '../../../components/@generalComponents/layout/Icons/DailyManagementIcon';
import TicketIcon from '../../../components/@generalComponents/layout/Icons/TicketIcon';
import FormsIcon from '../../../components/@generalComponents/layout/Icons/FormsIcon';
import ArticleIcon from '../../../components/@generalComponents/layout/Icons/ArticleIcon.js';
import LocationsManagementIcon from '../../../components/@generalComponents/layout/Icons/LocationsManagement.js';

const PagesNav = ({ isTablet, tasksOpen }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { pathname: currentPath } = useLocation();
  const { moduleName, moduleId } = useParams();
  const { t, i18n } = useTranslation();
  const currentlangCode = i18n.language;
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  const [drawerOpenModules, setDrawerOpenModules] = useState(false);
  const [drawerType, setDrawerType] = useState('');
  const [moduleSelected, setModuleSelected] = useState({});
  const [anchorElSec, setAnchorElSec] = useState(null);

  const [anchorEl, setAnchorEl] = useState(null);
  const [finalMenu, setFinalMenu] = useState([
    'OPERATIONS',
    'FINANCES',
    'MYNODE',
    'SETTINGS',
  ]);

  const [dropName, setDropName] = useState('');
  const [groups, setGroups] = useState([]);
  const [displayLoading, setDisplayLoading] = useState(false);
  const [countSlots, setCountSlots] = useState(0);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setAnchorElSec(null);
  };

  const businessPreference = useSelector((state) => state.core.businessData);
  const businessStructure = useSelector(
    (state) => state.core.businessStructure
  );

  const businessStructures = businessStructure?.structures || [];
  const modules = businessPreference?.menu || [];
  const currentSectionState = useSelector((state) => state.core.currentSection);
  const notifs = useSelector((state) => state.core.notifs);
  const activeModule = modules?.find((m) => m.id === moduleId);

  const nodes = useSelector((state) => state.core.nodes);
  const currentUser = useSelector((state) => state.core.user);

  const currentUserGroups = currentUser?.activeBusiness?.groups || [];

  const formatedGroups = businessPreference?.groups?.map((group) => ({
    label: group?.name,
    value: group?.identifiant,
    id: group?.identifiant,
  }));

  useEffect(() => {
    if (modules) {
      const sections = modules?.map((module) => module.section);
      const finalSections = [...new Set(sections)];

      const finalOrdered =
        finalSections?.sort((a, b) => {
          const orderA = [
            'OPERATIONS',
            'FINANCES',
            'MYNODE',
            'SETTINGS',
          ].indexOf(a);
          const orderB = [
            'OPERATIONS',
            'FINANCES',
            'MYNODE',
            'SETTINGS',
          ].indexOf(b);
          return orderA - orderB;
        }) || [];

      setFinalMenu(finalOrdered);
    }
  }, [modules]);

  const handleSectionChange = useCallback((section) => {
    setAnchorElSec(null);
    setAnchorEl(null);
    dispatch(setCurrentSection(section));
  }, []);

  const openModalScan = () => {
    dispatch(
      modalActions.modalScan({
        isOpen: true,
      })
    );
  };

  useEffect(() => {
    if (businessPreference?.id && currentUser?.uid) {
      const getCount = async () => {
        const userRef = doc(db, 'users', currentUser?.uid);
        const businessRef = doc(db, 'businessesOnNode', businessPreference?.id);
        try {
          const coll = query(
            collectionGroup(db, 'slots'),
            where('isDone', '==', false),
            where('userId', '==', userRef),
            where('ownerId', '==', businessRef),
            where('targetDate', '==', moment().format('YYYY-MM-DD'))
          );
          const snapshot = await getCountFromServer(coll);
          setCountSlots(snapshot.data().count);
        } catch (error) {
          console.error(error);
        }
      };
      getCount();
    }
  }, [businessPreference?.id, currentUser?.uid]);

  const financesCollection =
    currentPath === '/app/finances/cards' ? 'cardsuninvoiced' : 'cardsinvoiced';

  const handleCloseDrawer = () => {
    setDrawerOpenModules(false);
  };

  const addToDrop = async (item, node) => {
    try {
      dispatch(
        setGeneralStatus({
          status: 'loading',
          position: 'addElement-kanban',
          type: 'pulse',
        })
      );
      setDisplayLoading(true);
      await nodeAxiosFirebase({
        t,
        method: 'POST',
        url: `coreSeqV2/node-element`,
        body: {
          name: item?.name,
          status: item?.status || 0,
          structureId: item?.structureIdentifiant,
          dropId: node?.dropId,
          elementPath: item?.documentPath,
          collectionField: moduleName || financesCollection,
        },
      });
      dispatch(
        setGeneralStatus({
          status: 'success',
          position: 'addElement-kanban',
          type: 'pulse',
        })
      );
      setDisplayLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  function DroppableNode({ node, navigateWS, isDarkMode, index }) {
    const [, drop] = useDrop(() => ({
      accept: 'item',
      drop: (item, monitor) => {
        addToDrop(item?.element, node);
      },
    }));

    return (
      <div
        className="d-flex justify-content-between py-2 hover"
        style={{
          backgroundColor: 'transparent',
        }}
        key={index + 'node'}
        ref={drop}
        onClick={() => navigateWS(node?.path)}
      >
        {isTablet ? (
          <div className="align-c" style={{ width: '100%' }}>
            <div style={{ fontSize: '18px' }}>{node?.emoji || '😀'}</div>
          </div>
        ) : (
          <div className="d-flex">
            <div style={{ fontSize: '18px' }}>{node?.emoji || '😀'}</div>
            <div className="d-flex">
              <Typography
                fontWeight={500}
                fontSize="13.5px"
                color={isDarkMode ? '#FFF' : '#000'}
                variant="body2"
                sx={{
                  marginLeft: '12px',
                  marginTop: '3px',
                  marginRight: '5px',
                  cursor: 'pointer',
                  '&:hover': {
                    fontWeight: 500,
                  },
                }}
              >
                {node?.name || ''}
              </Typography>
            </div>
          </div>
        )}
        {!isTablet && (
          <div
            style={{
              color: businessPreference?.mainColor,
              display: 'flex',
              justifyContent: 'right',
              alignItems: 'center',
              fontWeight: 600,
              fontSize: '14px',
              width: '20px',
              marginTop: '3px',
              marginRight: '25px',
              height: '15px',
              borderRadius: '50%',
            }}
          >
            {node?.count}
          </div>
        )}
        {node?.seenLast &&
          node?.seenLast?.length !== 0 &&
          currentUser?.uid &&
          !node?.seenLast?.includes(currentUser?.uid) && (
            <Badge
              color="error"
              variant="dot"
              sx={{
                position: 'absolute',
                marginTop: '11px',
                right: '0',
                marginRight: '4px',
                zIndex: 10000,
              }}
            ></Badge>
          )}
      </div>
    );
  }

  const businessModules = businessPreference?.menu
    ?.filter((module) => module?.section === currentSectionState)
    .sort((a, b) => a.order - b.order);

  const openAddElementModal = (structureId) => {
    dispatch(
      modalActions.modalElementCreation({
        isOpen: true,
        structureId: structureId,
      })
    );
    handleMenuClose();
  };

  const navigateWS = (node) => {
    navigate('/app/nodes/' + node?.dropId + '?tab=0');
  };

  const handleEditModule = (module) => {
    setDrawerType('module');
    setDrawerOpenModules(true);

    const selectedModule = modules?.find((m) => m?.id === module?.id);
    setModuleSelected(selectedModule);
  };

  const darkColor = () => {
    let finalColor = businessPreference?.mainColor || '#000000';

    return chroma(finalColor).darken(0.9).hex();
  };

  const handleDeleteModule = async () => {
    try {
      dispatch(
        setGeneralStatus({
          status: 'loading',
          position: 'deleteModule',
          type: 'pulse',
        })
      );
      if (moduleSelected?.id) {
        await nodeAxiosFirebase({
          t,
          method: 'POST',
          url: `business/structure`,
          body: {
            type: 'deleteModule',
            moduleId: moduleSelected?.id,
          },
        });
      }
      dispatch(
        setGeneralStatus({
          status: 'success',
          position: 'deleteModule',
          type: 'pulse',
        })
      );
      setModuleSelected({});
      setDrawerOpenModules(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteDrop = async () => {};

  const resolveMenuIcon = (menuName) => {
    switch (menuName) {
      case 'OPERATIONS':
        return <TicketIcon />;
      case 'FINANCES':
        return <FormsIcon />;
      case 'MYNODE':
        return <DailyManagementIcon />;
      case 'WEB':
        return <ArticleIcon />;
      case 'SETTINGS':
        return <AppointmentsIcon />;
      default:
        return;
    }
  };

  const handleSaveModule = async () => {
    dispatch(setGeneralStatus('loading'));
    setDisplayLoading(true);
    try {
      dispatch(
        setGeneralStatus({
          status: 'loading',
          position: 'menu-editModule',
          type: 'pulse',
        })
      );
      if (moduleSelected?.id) {
        await nodeAxiosFirebase({
          t,
          method: 'POST',
          url: `business/structure`,
          body: {
            moduleId: moduleSelected?.id,
            lang: currentlangCode,
            structureId: moduleSelected?.structureId,
            type: 'general',
            data: {
              icon: moduleSelected?.icon,
              name: moduleSelected?.name,
              groups: moduleSelected?.groups,
              section: moduleSelected?.section,
              order: moduleSelected?.order,
              segments: moduleSelected?.segments,
              refresh: moduleSelected?.list?.preferences?.refresh,
              limit: moduleSelected?.list?.preferences?.limit,
            },
          },
        });
      } else {
        await nodeAxiosFirebase({
          t,
          method: 'POST',
          url: `business/structure`,
          body: {
            lang: currentlangCode,
            structureId: moduleSelected?.structureId,
            type: 'addModule',
            data: {
              icon: moduleSelected?.icon,
              name: moduleSelected?.name,
              groups: moduleSelected?.groups,
              section: moduleSelected?.section,
              order: moduleSelected?.order,
              segments: moduleSelected?.segments,
              refresh: moduleSelected?.list?.preferences?.refresh,
              limit: moduleSelected?.list?.preferences?.limit,
            },
          },
        });
      }
      setModuleSelected({});
      dispatch(
        setGeneralStatus({
          status: 'success',
          position: 'menu-editModule',
          type: 'pulse',
        })
      );
      setDisplayLoading(false);
      setDrawerOpenModules(false);
    } catch (error) {
      console.error(error);
    }
  };

  const RestrictedModule = ({ children }) => {
    if (
      currentSectionState === 'SETTINGS' ||
      currentSectionState === 'TOOLS' ||
      currentSectionState === 'NODE'
    ) {
      return null;
    }
    return children;
  };

  const handleNewModule = () => {
    setDrawerType('module');
    setDrawerOpenModules(true);
    setModuleSelected({ isNew: true });
    setDropName('');
    setGroups([]);
  };

  const handleOpenDrop = () => {
    setDrawerType('drop');
    setDropName('');
    setGroups([]);
    setDrawerOpenModules(true);
  };

  const saveDrop = async () => {
    setDrawerOpenModules(false);
    try {
      dispatch(
        setGeneralStatus({
          status: 'loading',
          position: 'menu-saveDrop',
          type: 'pulse',
        })
      );
      await nodeAxiosFirebase({
        t,
        method: 'POST',
        showLoading: true,
        url: `coreSeqV2/node`,
        body: {
          name: dropName,
          emoji: '📚',
          groups: groups?.map((group) => group.id),
        },
      });
      setDropName('');
      setGroups([]);
      dispatch(
        setGeneralStatus({
          status: 'success',
          position: 'menu-saveDrop',
          type: 'pulse',
        })
      );
    } catch (error) {
      console.error(error);
    }
  };

  const notifsCountFiltred =
    notifs?.notifs?.length > 0 &&
    notifs?.notifs?.filter((notif) => {
      return notif?.isClicked !== true;
    })?.length;

  return (
    <div>
      <DrawerSide
        isLoading={displayLoading}
        position="right"
        isDrawerOpen={drawerOpenModules}
        isCreation={
          (drawerType === 'module' && moduleSelected?.isNew) ||
          drawerType !== 'module'
        }
        title={
          drawerType === 'module'
            ? moduleSelected?.isNew
              ? t('addModule')
              : moduleSelected?.name
            : t('addDrop')
        }
        handleRemove={
          drawerType === 'module' ? handleDeleteModule : handleDeleteDrop
        }
        handleSave={drawerType === 'module' ? handleSaveModule : saveDrop}
        subtitle={
          drawerType === 'module'
            ? moduleSelected?.isNew
              ? t('newModule')
              : t('editModule')
            : t('newDrop')
        }
        handleDrawerClose={handleCloseDrawer}
      >
        {drawerType === 'module' ? (
          <div>
            <EditModule
              module={moduleSelected}
              setModuleSelected={setModuleSelected}
            />
          </div>
        ) : (
          <div>
            <div className="mb-3">
              <TextField
                label={t('name')}
                value={dropName}
                onChange={(e) => setDropName(e.target.value)}
                fullWidth
              />
            </div>
            <Autocomplete
              multiple
              key={getRandomString(5)}
              options={formatedGroups || []}
              getOptionLabel={(option) => option?.label || ''}
              value={groups}
              onChange={(event, newValue) => {
                setGroups(newValue);
              }}
              renderInput={(params) => (
                <TextFieldMUI
                  {...params}
                  label={t('selectGroup')}
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '10px',
                      '&.Mui-focused fieldset': {
                        borderColor: businessPreference?.mainColor || '#000',
                        boxShadow: `0 0 0 0.2rem ${
                          businessPreference?.mainColor + '20'
                        }`,
                      },
                    },
                  }}
                />
              )}
              isOptionEqualToValue={(option, value) => option.id === value.id}
            />
          </div>
        )}
      </DrawerSide>
      {(currentUser?.activeBusiness?.role === 'SUPER-ADMIN' ||
        currentUser?.activeBusiness?.role === 'ADMIN' ||
        currentUser?.activeBusiness?.role === 'EMPLOYEE') && (
        <div
          style={{
            paddingRight: isTablet ? '' : '16px',
            marginRight: '20px',
            paddingLeft: isTablet ? '' : '16px',
            marginLeft: isTablet ? '-10px' : '',
            marginTop: isTablet ? '8px' : '16px',
          }}
          className={isTablet ? 'mb-3 align-c' : 'mb-4 px-1 d-flex align-c'}
        >
          <Button
            onClick={handleMenuOpen}
            className="middle-content"
            fullWidth={isTablet ? false : true}
            sx={{
              marginLeft: '10px',
              width: isTablet ? '32px' : '100%',
              maxWidth: isTablet ? '32px !important' : '100%',
              minWidth: isTablet ? '32px !important' : '100%',
              height: isTablet ? '32px' : '38px',
              backgroundColor: isDarkMode
                ? businessPreference?.mainColor + '20'
                : businessPreference?.mainColor + '20',
              border: '1px solid ' + businessPreference?.mainColor,
              borderRadius: '10px',
              padding: isTablet ? '0.4rem' : '0.6rem',
              '&:hover': {
                backgroundColor: businessPreference?.mainColor + '40',
                boxShadow: '0px 2px 6px 0px rgba(0,0,0,0.1)',
              },
            }}
          >
            <Icons.AddOutlined
              fontSize="medium"
              htmlColor={isDarkMode ? '#FFF' : '#000'}
              sx={{
                marginRight: isTablet ? '0px' : '10px',
              }}
            />
            {!isTablet && (
              <Typography
                fontWeight={600}
                fontSize="13px"
                color={isDarkMode ? '#FFF' : '#000'}
                variant="body2"
              >
                {t('new')}
              </Typography>
            )}
          </Button>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            elevation={3}
            sx={{
              '& .MuiPaper-root': {
                borderRadius: '12px',
              },
            }}
          >
            {businessStructures
              ?.slice()
              .sort((a, b) => a[`name`]?.localeCompare(b[`name`]))
              ?.filter(
                (structure) =>
                  structure?.element?.preferences?.creation !== false
              )
              ?.map((structure) => {
                const IconComponent =
                  Icons[structure?.icon] || Icons.HelpOutline;
                return (
                  <MenuItem
                    divider
                    dense
                    key={structure?.id + 'structure'}
                    onClick={() => openAddElementModal(structure?.id)}
                  >
                    <div className="middle-content d-flex">
                      <IconComponent color="secondary" fontSize="small" />
                      <div className="px-3">{structure?.name}</div>
                    </div>
                  </MenuItem>
                );
              })}
          </Menu>
        </div>
      )}

      <div className="mt-4" style={{ paddingLeft: isTablet ? '' : '16px' }}>
        <div className="mt-1 mb-1" key={module.id + 'modulelist'}>
          <div
            onClick={() => navigate('/app/dashboard')}
            style={{ marginLeft: isTablet ? '-8px' : '' }}
            className={`${
              isTablet ? 'd-flex align-c' : 'd-flex'
            } middle-content hover`}
          >
            <div className="align-c">
              <Icons.DashboardCustomizeOutlined
                fontSize="medium"
                htmlColor={
                  currentPath === '/app/dashboard'
                    ? isDarkMode
                      ? '#FFF'
                      : `${businessPreference?.mainColor}`
                    : isDarkMode
                    ? '#FFF'
                    : '#000'
                }
                sx={{
                  fontSize: '21px',
                  paddingRight: isTablet ? '1px' : '3px',
                }}
              />
            </div>
            {!isTablet && (
              <div className="row justify-content-between">
                <div className="col-10 align-left px-4">
                  <Typography
                    fontWeight={currentPath === '/app/dashboard' ? 600 : 500}
                    fontSize="14px"
                    sx={{
                      '&:hover': {
                        fontWeight: 600,
                      },
                      marginTop: '-4px',
                    }}
                    color={
                      currentPath === '/app/dashboard'
                        ? isDarkMode
                          ? '#FFF'
                          : `${businessPreference?.mainColor}`
                        : isDarkMode
                        ? '#FFF'
                        : '#000'
                    }
                    variant="body2"
                  >
                    {t('dashboards')}
                  </Typography>
                </div>
              </div>
            )}
          </div>
        </div>

        {(businessPreference?.formula === 'rise' ||
          businessPreference?.formula === 'trial') && (
          <>
            <div
              style={{
                paddingTop: '0.21rem',
                paddingBottom: '0.2rem',
                marginLeft: isTablet ? '-8px' : '',
              }}
              key={module.id + 'module'}
              className="mt-1 mb-1"
            >
              <div
                onClick={() => navigate('/app/inbox')}
                className={`${
                  isTablet ? 'd-flex align-c' : 'd-flex'
                } middle-content hover`}
              >
                <div className="align-c">
                  <Icons.EventAvailableOutlined
                    fontSize="medium"
                    htmlColor={
                      currentPath === '/app/inbox'
                        ? isDarkMode
                          ? '#FFF'
                          : `${businessPreference?.mainColor}`
                        : isDarkMode
                        ? '#FFF'
                        : '#000'
                    }
                    sx={{
                      fontSize: '21px',
                      paddingRight: isTablet ? '1px' : '3px',
                      marginTop: '3px',
                    }}
                  />
                </div>
                {!isTablet && (
                  <div className="row d-flex justify-content-between">
                    <div className="align-left px-4">
                      <Typography
                        fontWeight={currentPath === '/app/inbox' ? 600 : 500}
                        fontSize="14px"
                        sx={{
                          '&:hover': {
                            fontWeight: 600,
                          },
                        }}
                        color={
                          currentPath === '/app/inbox'
                            ? isDarkMode
                              ? '#FFF'
                              : `${businessPreference?.mainColor}`
                            : isDarkMode
                            ? '#FFF'
                            : '#000'
                        }
                        variant="body2"
                      >
                        {t('myToDo')}
                      </Typography>
                    </div>
                  </div>
                )}
                <div className="align-right">
                  {notifsCountFiltred > 0 && !isTablet && (
                    <div
                      style={{
                        color: businessPreference?.mainColor,
                        display: 'flex',
                        justifyContent: 'right',
                        alignItems: 'center',
                        fontWeight: 600,
                        fontSize: '12px',
                        width: '20px',
                        marginTop: '3px',
                        marginRight: '6px',
                        height: '15px',
                        borderRadius: '50%',
                      }}
                    >
                      {notifsCountFiltred || ''}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
        {(businessPreference?.formula === 'rise' ||
          businessPreference?.formula === 'trial') &&
          isTablet && (
            <>
              <div
                style={{
                  paddingTop: '0.21rem',
                  paddingBottom: '0.2rem',
                  marginLeft: isTablet ? '-8px' : '',
                }}
                key={module.id + 'module'}
                className="mt-1 mb-1"
              >
                <div
                  onClick={openModalScan}
                  className={`${
                    isTablet ? 'd-flex align-c' : 'd-flex'
                  } middle-content hover`}
                >
                  <div className="align-c">
                    <Icons.QrCodeScannerOutlined
                      fontSize="medium"
                      htmlColor={isDarkMode ? '#FFF' : '#000'}
                      sx={{
                        fontSize: '21px',
                        paddingRight: isTablet ? '1px' : '3px',
                        marginTop: '3px',
                      }}
                    />
                  </div>
                  {!isTablet && (
                    <div className="row d-flex justify-content-between">
                      <div className="align-left px-4">
                        <Typography
                          fontWeight={tasksOpen ? 600 : 500}
                          fontSize="14px"
                          sx={{
                            '&:hover': {
                              fontWeight: 600,
                            },
                          }}
                          color={isDarkMode ? '#FFF' : '#000'}
                          variant="body2"
                        >
                          {t('scan')}
                        </Typography>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
      </div>
      <Divider component="div" className="mt-3 mb-3" />
      <div
        className="align-c"
        style={{
          paddingLeft: isTablet ? '' : '10px',
        }}
      >
        <div className="row py-2 align-c">
          <div
            className={
              isTablet ? 'col-12 px-4 align-c' : 'col-9 align-left px-2'
            }
          >
            <div
              className={
                isTablet ? 'd-flex align-c hover' : 'd-flex align-left hover'
              }
              onClick={(e) => setAnchorElSec(e.currentTarget)}
            >
              <div
                style={{
                  width: '21px',
                  height: '21px',
                  marginLeft: isTablet ? '12px' : '-4px',
                }}
              >
                {resolveMenuIcon(currentSectionState)}
              </div>{' '}
              {!isTablet && (
                <div
                  className="hover"
                  style={{ marginLeft: '13px', marginTop: '-2px' }}
                >
                  <Typography
                    fontWeight={600}
                    fontSize="15px"
                    color={darkColor()}
                    variant="body2"
                  >
                    {t(currentSectionState)}
                  </Typography>
                </div>
              )}
              <div style={{ marginTop: '-2px' }}>
                <Icons.ArrowDropDown sx={{ color: darkColor() }} />
              </div>
            </div>
            <Menu
              anchorEl={anchorElSec}
              open={Boolean(anchorElSec)}
              onClose={handleMenuClose}
              elevation={3}
              sx={{
                '& .MuiPaper-root': {
                  borderRadius: '12px',
                },
              }}
            >
              {finalMenu
                ?.sort((a, b) => finalMenu.indexOf(b) - finalMenu.indexOf(a))
                ?.map((section) => (
                  <MenuItem
                    key={section}
                    value={section}
                    sx={{
                      width: isTablet ? '90px' : '220px',
                    }}
                    onClick={() => handleSectionChange(section)}
                  >
                    <div className="d-flex middle-content">
                      <div style={{ width: '20px', height: '20px' }}>
                        {resolveMenuIcon(section)}
                      </div>

                      <div className="mx-3">
                        <GeneralText
                          text={isTablet ? t(section)?.slice(0, 1) : t(section)}
                          fontSize="16px"
                          size="bold"
                          primary={true}
                        />
                      </div>
                    </div>
                  </MenuItem>
                ))}
            </Menu>
          </div>
          {!isTablet && (
            <div className="col-2 align-right">
              {currentUser?.activeBusiness?.role !== 'EMPLOYEE' && (
                <RestrictedModule>
                  <Icons.AddOutlined
                    className="hover mt-1"
                    fontSize="10px"
                    onClick={handleNewModule}
                  />
                </RestrictedModule>
              )}
            </div>
          )}
        </div>

        <Modules
          businessModules={businessModules}
          isTablet={isTablet}
          isDarkMode={isDarkMode}
          activeModule={activeModule}
          businessPreference={businessPreference}
          navigate={navigate}
          handleEditModule={handleEditModule}
          currentSectionState={currentSectionState}
        />
        <Divider component="div" className="mt-2 mb-2" />
        {(businessPreference?.formula === 'rise' ||
          businessPreference?.formula === 'trial') && (
          <div
            style={{ marginLeft: isTablet ? '-8px' : '' }}
            className={isTablet ? 'align-left mt-2' : 'align-left mt-4'}
          >
            <div className="row py-2 align-c">
              <div
                className={
                  isTablet ? 'col-12 px-4 align-c' : 'col-9 align-left px-2'
                }
              >
                <div
                  className={isTablet ? 'd-flex align-c' : 'd-flex align-left'}
                >
                  <div
                    style={{
                      width: '21px',
                      height: '21px',
                      marginLeft: isTablet ? '12px' : '-4px',
                    }}
                  >
                    <LocationsManagementIcon />
                  </div>{' '}
                  {!isTablet && (
                    <div
                      className="hover"
                      style={{ marginLeft: '13px', marginTop: '-2px' }}
                    >
                      <Typography
                        fontWeight={600}
                        fontSize="15px"
                        color={darkColor()}
                        variant="body2"
                      >
                        {t('workspaces')}
                      </Typography>
                    </div>
                  )}
                </div>
              </div>
              {!isTablet && (
                <div className="col-2 align-right">
                  {currentUser?.activeBusiness?.role !== 'EMPLOYEE' && (
                    <RestrictedModule>
                      <Icons.AddOutlined
                        className="hover mt-1"
                        fontSize="10px"
                        onClick={handleOpenDrop}
                      />
                    </RestrictedModule>
                  )}
                </div>
              )}
            </div>
            <div className="px-2">
              {displayLoading && !drawerOpenModules ? (
                <Loading size="small" type="logo" />
              ) : (
                <div>
                  {nodes
                    ?.filter((node) =>
                      node?.groups?.some((group) =>
                        currentUserGroups?.includes(group)
                      )
                    )
                    ?.map((node, index) => (
                      <DroppableNode
                        key={index}
                        index={index}
                        node={node}
                        navigateWS={() => navigateWS(node)}
                        isDarkMode={isDarkMode}
                      />
                    ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PagesNav;
