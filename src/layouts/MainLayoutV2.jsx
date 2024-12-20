import React, { useState, useCallback, useEffect } from 'react';
import chroma from 'chroma-js';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import * as modalActions from '../redux/actions/modal-actions';
import { useTranslation } from 'react-i18next';
import { I18nextProvider } from 'react-i18next';
import useMediaQuery from '@mui/material/useMediaQuery';
import { getAuth, signOut } from 'firebase/auth';
import { useTheme } from '@mui/material/styles';
import moment from 'moment';
import Lottie from 'react-lottie';
import animationData from '../lotties/empty-box';
import animationDataLights from '../lotties/lights.json';
import { DndProvider } from 'react-dnd';
import { setCurrentUser } from '../redux/actions-v2/coreAction';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Helmet } from 'react-helmet';
import NodeAIIcon from '../components/@generalComponents/layout/NodeAIIcon.jsx';
import * as sidebarActions from '../redux/actions/sidebar-actions';
import {
  Divider,
  ListItemText,
  Menu,
  MenuItem,
  SpeedDial,
  SpeedDialAction,
} from '@mui/material';
import AllModalsRoot from '../modals';
import AllSidebarsRoot from '../sidebars';
import AllDrawersRoot from '../drawers';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { Paper } from '@mui/material';
import PagesNav from '../components/@generalComponents/layout/PagesNav.jsx';

import '../components/@generalComponents/layout/layout.css';
import {
  clearBusinessData,
  fetchBusinessData,
  pageLoaded,
  setCurrentSection,
  setOnCall,
} from '../redux/actions-v2/coreAction.js';
import { clearAllLists } from '../redux/actions-v2/listAction.js';
import DialogWindow from '../stories/general-components/DialogWindow.jsx';
import LogRocket from 'logrocket';
import TopNavBar from './components/TopNavBar.jsx';
import {
  LogoutOutlined,
  Person2Outlined,
  QrCodeScannerOutlined,
  Widgets,
} from '@mui/icons-material';
import UserSecMenu from '../components/@generalComponents/layout/UserSecMenu.jsx';
import Blocks from '../stories/layout-components/Block.jsx';
import Button from '../stories/general-components/Button.jsx';

const MainLayoutV2 = ({
  children,
  pageTitle,
  tabs,
  actions,
  sectionTitle,
  formatedPath,
  elementId,
  searchActivated,
  manualIndex,
  error404,
  subTitle,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();

  const { moduleId } = useParams();

  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const [dialogOpen, setDialogOpen] = useState(false);
  const businessesStorage = sessionStorage.getItem('businesses');
  const businesses = JSON.parse(businessesStorage);

  const [taskOpen, setTaskOpen] = useState(false);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorElSec, setAnchorElSec] = useState(null);
  const [currentStatusMain, setCurrentStatusMain] = useState({
    status: '',
  });

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  const defaultOptionsLights = {
    loop: true,
    autoplay: true,
    animationData: animationDataLights,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  const isDarkMode = theme.palette.mode === 'dark';

  const softwareVersion = process.env.REACT_APP_VERSION;

  const businessPreference = useSelector((state) => state.core.businessData);
  const businessStructure = useSelector(
    (state) => state.core.businessStructure
  );
  const currentUser = useSelector((state) => state.core.user);
  const activeUser = businessPreference?.employees?.find(
    (employee) => employee.id === currentUser?.uid
  );
  const businessModules = businessStructure?.modules;
  const currentStatus = useSelector((state) => state.core.status);

  const mainColor = businessPreference?.mainColor || '#000000';
  const secColor = businessPreference?.secColor || '#000000';
  const lightGreyScale = chroma
    .scale([mainColor, '#f2f2f2'])
    .mode('lab')
    .colors(10)
    .map((color) => chroma(color).brighten(1.5));
  const lightGreyScaleSec = chroma
    .scale([secColor, '#f2f2f2'])
    .mode('lab')
    .colors(10)
    .map((color) => chroma(color).brighten(1.5));

  const openAIModal = () => {
    dispatch(
      sidebarActions.nodeAiSidebar({
        show: true,
        isOpen: true,
      })
    );
  };

  useEffect(() => {
    if (currentStatus?.status === 'loading') {
      setCurrentStatusMain('loading');
      setTimeout(() => {
        setCurrentStatusMain('');
      }, 2200);
    } else if (currentStatus?.status === 'error') {
      setCurrentStatusMain('error');
      setTimeout(() => {
        setCurrentStatusMain('');
      }, 1000);
    } else if (currentStatus?.status === 'success') {
      setCurrentStatusMain('success');
      setTimeout(() => {
        setCurrentStatusMain('');
      }, 2800);
    } else {
      setCurrentStatusMain('');
    }
  }, [currentStatus?.status]);

  const handleMenuOpenSec = (event) => {
    setAnchorElSec(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorElSec(null);
  };

  const handleLogout = async () => {
    try {
      dispatch(setCurrentUser(null, ''));
      sessionStorage.removeItem('businesses');
      sessionStorage.removeItem('businessToken');
      sessionStorage.removeItem('unseenMessages');
      const auth = getAuth();
      await signOut(auth);
      navigate('/signin');
    } catch (error) {
      console.error(error);
    }
  };

  if (
    window.location.hostname !== 'localhost' &&
    window.location.port !== '3000'
  ) {
    LogRocket.init('hpp7xp/node');

    if (currentUser) {
      LogRocket.identify(currentUser?.uid, {
        name: currentUser?.displayName,
        email: currentUser?.email,
        subscriptionType: businessPreference?.formula,
      });
    }
  }

  const openModalScan = () => {
    dispatch(
      modalActions.modalScan({
        isOpen: true,
      })
    );
  };

  const actionsSpeed = [
    {
      name: t('scan'),
      icon: <QrCodeScannerOutlined />,
      onClick: openModalScan,
    },
  ];

  if (businessPreference?.formula?.toUpperCase() === 'RISE') {
    actionsSpeed.push({
      name: t('nodeAI'),
      icon: <NodeAIIcon size={26} />,
      onClick: openAIModal,
    });
  }

  const handleBusinessSelect = (business) => {
    localStorage.setItem('section', 'OPERATIONS');
    dispatch(setOnCall(false));
    dispatch(setCurrentSection('OPERATIONS'));
    dispatch(clearAllLists());
    const userData = {
      uid: currentUser?.uid,
      email: currentUser?.email || '',
      displayName: currentUser?.displayName || '',
      photoURL: currentUser?.photoURL || '',
    };
    dispatch(setCurrentUser(userData, business?.businessId));
    dispatch(clearBusinessData());
    sessionStorage.setItem('businessToken', business?.token);
    localStorage.setItem('businessId', business?.businessId);
    localStorage.setItem('businessName', business?.name);
    dispatch(fetchBusinessData(business?.businessId, t, currentLanguage));
    setDialogOpen(false);
    navigate('/app/dashboard');
  };

  const handleNavigateBack = () => {
    navigate(-1);
  };

  const handleChangeBusiness = () => {
    setDialogOpen(true);
  };

  const windowHeight = window.innerHeight;
  const contentHeight = windowHeight - 76;

  const openSideTasksAgenda = () => {
    setTaskOpen(!taskOpen);
  };

  const getModuleName = () => {
    const module = businessModules?.find((m) => m.id === moduleId);

    if (pageTitle) {
      return pageTitle;
    }

    return module?.name;
  };

  useEffect(() => {
    if (businessModules) {
      setTimeout(() => {
        dispatch(pageLoaded(true));
      }, 3000);
    }
  }, [businessModules]);

  return (
    <div>
      <DndProvider backend={HTML5Backend}>
        <DialogWindow
          title={t('switchAccount')}
          open={dialogOpen}
          size={'medium'}
          width={'medium'}
          onClose={() => setDialogOpen(false)}
        >
          <div>
            <div className="row">
              {businesses &&
                businesses?.map((business, idx) => (
                  <div
                    key={idx}
                    className="col-3 hover align-c p-1"
                    onClick={() => handleBusinessSelect(business)}
                  >
                    <div>
                      <img
                        style={{ width: '30px', height: '30px' }}
                        src={`https://storage.googleapis.com/node-business-logos/${business?.businessId}.png`}
                      />
                    </div>
                    <ListItemText
                      primary={business?.name}
                      primaryTypographyProps={{
                        fontWeight: 500,
                        color: isDarkMode ? '#FFF' : '#000',
                        fontSize: '10px',
                      }}
                      secondary={business?.city || '-'}
                      secondaryTypographyProps={{
                        variant: 'caption',
                      }}
                    />
                  </div>
                ))}
            </div>
          </div>
        </DialogWindow>

        <I18nextProvider i18n={i18n}>
          <Helmet>
            <title>
              {`Node -  ${getModuleName(pageTitle, currentLanguage)}` || 'Node'}
            </title>
            <meta name="robots" content="noindex" />
          </Helmet>
          <AllModalsRoot />
          <div
            style={{
              backgroundColor: isDarkMode
                ? 'rgba(0, 0, 0, 0.82)'
                : 'rgba(242, 242, 242, 0.52)',
              height: '100vh',
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            <div
              style={{
                backgroundColor: businessPreference?.secColor,
                width: '10px',
                height: '100%',
                zIndex: 1000,
                position: 'absolute',
                left: 0,
              }}
            />
            <div
              style={{
                width: '500px',
                height: '500px',
                overflow: 'hidden',
                backgroundColor: lightGreyScale[0] + '50',
                borderRadius: '50%',
                filter:
                  activeUser?.preferences?.blur !== null
                    ? 'blur(' + activeUser?.preferences?.blur * 15 + 'px)'
                    : 'blur(120px)',
                position: 'absolute',
                zIndex: 0,
                bottom: '-220px',
                left: '-120px',
              }}
            ></div>
            <div
              style={{
                width: '500px',
                height: '500px',
                overflow: 'hidden',
                backgroundColor: lightGreyScaleSec[2] + '50',
                borderRadius: '50%',
                filter:
                  activeUser?.preferences?.blur !== null
                    ? 'blur(' + activeUser?.preferences?.blur * 15 + 'px)'
                    : 'blur(120px)',
                position: 'absolute',
                zIndex: 0,
                bottom: '120px',
                left: '-310px',
              }}
            ></div>
            <div
              style={{
                width: '700px',
                height: '200px',
                overflow: 'hidden',
                backgroundColor: isDarkMode ? '#00000040' : '#FFFFFF',
                rotate: '325deg',
                borderRadius: '80px',
                filter:
                  activeUser?.preferences?.blur !== null
                    ? 'blur(' + activeUser?.preferences?.blur * 9 + 'px)'
                    : 'blur(120px)',
                position: 'absolute',
                zIndex: 0,
                bottom: '370px',
                left: '-220px',
              }}
            ></div>
            <div
              style={{
                width: '200px',
                height: '200px',
                overflow: 'hidden',
                backgroundColor: lightGreyScale[0] + '90',
                borderRadius: '50%',
                filter:
                  activeUser?.preferences?.blur !== null
                    ? 'blur(' + activeUser?.preferences?.blur * 15 + 'px)'
                    : 'blur(120px)',
                position: 'absolute',
                zIndex: 10,
                bottom: '-80px',
                left: '-80px',
              }}
            ></div>
            <div
              style={{
                width: '900px',
                height: '900px',
                overflow: 'hidden',
                backgroundColor: '#696969' + '15',
                borderRadius: '50%',
                filter:
                  activeUser?.preferences?.blur !== null
                    ? 'blur(' + activeUser?.preferences?.blur * 15 + 'px)'
                    : 'blur(120px)',
                position: 'absolute',
                zIndex: 0,
                top: '-220px',
                left: '-120px',
              }}
            ></div>
            <Grid container sx={{ paddingLeft: '8px' }}>
              <Grid
                sx={{
                  height: '100vh',
                  overflow: 'hidden',
                }}
                container
              >
                <SpeedDial
                  ariaLabel="Sections"
                  sx={{
                    position: 'absolute',
                    bottom: 16,
                    right: 16,
                  }}
                  icon={<Widgets />}
                >
                  {actionsSpeed?.map((action) => (
                    <SpeedDialAction
                      key={action?.name}
                      icon={action?.icon}
                      tooltipTitle={action.name}
                      onClick={action.onClick}
                    />
                  ))}
                </SpeedDial>

                <Grid
                  sx={{
                    height: '100vh',
                    borderRadius: '10px',
                    position: 'relative',
                  }}
                  xs={2.2}
                  sm={1}
                  md={2.2}
                  lg={2.2}
                  xl={2.2}
                  item
                >
                  <Paper
                    sx={{
                      backgroundColor: businessPreference?.mainColor + '14',
                      border: isDarkMode
                        ? `1px solid ${'#22222250'}`
                        : `1px solid ${'#FFFFFF57'}`,
                      boxShadow: '10px 10px 10px 0px rgba(0,0,0,0.05)',
                    }}
                    elevation={0}
                  >
                    <div
                      style={{
                        backgroundColor: isDarkMode ? '#00000020' : '#FFFFFF20',
                        paddingLeft: '16px',
                      }}
                    >
                      <div>
                        <div className="d-flex py-3">
                          {businessPreference?.id && (
                            <div
                              className="mb-1 mt-2 mx-4"
                              style={{
                                height: '6vh',
                                zIndex: 1000,
                                minHeight: isTablet ? '55px' : '65px',
                                position: 'relative',
                              }}
                            >
                              <div
                                className="middle-content"
                                style={{
                                  position: 'relative',
                                  height: isTablet
                                    ? currentStatusMain === 'loading' ||
                                      currentStatusMain === 'success' ||
                                      currentStatusMain === 'error'
                                      ? '40px'
                                      : '35px'
                                    : currentStatusMain === 'loading' ||
                                      currentStatusMain === 'success' ||
                                      currentStatusMain === 'error'
                                    ? '50px'
                                    : '45px',
                                  width: isTablet
                                    ? currentStatusMain === 'loading' ||
                                      currentStatusMain === 'success' ||
                                      currentStatusMain === 'error'
                                      ? '40px'
                                      : '35px'
                                    : currentStatusMain === 'loading' ||
                                      currentStatusMain === 'success' ||
                                      currentStatusMain === 'error'
                                    ? '50px'
                                    : '45px',
                                }}
                              >
                                <img
                                  src={`https://storage.googleapis.com/node-business-logos/${businessPreference?.id}.png`}
                                  height={isTablet ? '35px' : '45px'}
                                  width={isTablet ? '35px' : '45px'}
                                  style={{
                                    borderRadius: '50%',
                                    position: 'absolute',
                                    zIndex: 100,
                                    marginLeft: '2.8px',
                                    marginTop: '2.8px',
                                  }}
                                  className="hover"
                                  onClick={handleChangeBusiness}
                                />
                                <div
                                  style={{
                                    borderRadius: '50%',
                                    position: 'absolute',
                                    zIndex: 90,
                                    backgroundColor:
                                      currentStatusMain === 'loading'
                                        ? businessPreference?.mainColor + '70'
                                        : currentStatusMain === 'error'
                                        ? '#e3292970'
                                        : currentStatusMain === 'success'
                                        ? '#c2de2370'
                                        : 'transparent',
                                    height: isTablet
                                      ? currentStatusMain === 'loading' ||
                                        currentStatusMain === 'success' ||
                                        currentStatusMain === 'error'
                                        ? '40px'
                                        : '35px'
                                      : currentStatusMain === 'loading' ||
                                        currentStatusMain === 'success' ||
                                        currentStatusMain === 'error'
                                      ? '50px'
                                      : '45px',
                                    width: isTablet
                                      ? currentStatusMain === 'loading' ||
                                        currentStatusMain === 'success' ||
                                        currentStatusMain === 'error'
                                        ? '40px'
                                        : '35px'
                                      : currentStatusMain === 'loading' ||
                                        currentStatusMain === 'success' ||
                                        currentStatusMain === 'error'
                                      ? '50px'
                                      : '45px',
                                  }}
                                  className={
                                    currentStatusMain === 'loading'
                                      ? 'pulse-loading'
                                      : ''
                                  }
                                ></div>
                                <div
                                  style={{
                                    marginLeft: '-10px',
                                  }}
                                  className="py-5"
                                >
                                  <Lottie
                                    options={defaultOptionsLights}
                                    height={60}
                                    width={60}
                                  />
                                </div>
                              </div>

                              <div
                                style={{
                                  position: 'absolute',
                                  zIndex: 1000,
                                  top: '24px',
                                  left: '8%',
                                  marginLeft: '10px',
                                }}
                              >
                                <UserSecMenu
                                  drawerOpen={drawerOpen}
                                  setDrawerOpen={setDrawerOpen}
                                  handleMenuOpenSec={handleMenuOpenSec}
                                />
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
                                  <MenuItem
                                    divider
                                    dense
                                    key={'profile'}
                                    onClick={() => setDrawerOpen(true)}
                                  >
                                    <div className="middle-content d-flex">
                                      <Person2Outlined
                                        color="secondary"
                                        fontSize="small"
                                      />
                                      <div className="px-3">
                                        {t('myProfile')}
                                      </div>
                                    </div>
                                  </MenuItem>
                                  <MenuItem
                                    divider
                                    dense
                                    key={'logout'}
                                    onClick={handleLogout}
                                  >
                                    <div className="middle-content d-flex">
                                      <LogoutOutlined
                                        color="secondary"
                                        fontSize="small"
                                      />
                                      <div className="px-3">{t('logout')}</div>
                                    </div>
                                  </MenuItem>
                                </Menu>
                              </div>
                            </div>
                          )}
                          {!isTablet && (
                            <div className="mt-3 mx-3">
                              <Typography
                                variant="caption"
                                fontSize={'14px'}
                                lineHeight="0.9"
                                display="block"
                                fontWeight={600}
                                sx={{
                                  mt: 0.5,
                                }}
                                gutterBottom
                              >
                                {businessPreference?.name}
                              </Typography>
                              <Typography
                                variant="caption"
                                fontSize={'10px'}
                                lineHeight="0.8"
                                display="block"
                                fontWeight={400}
                                gutterBottom
                              >
                                {t('welcome') +
                                  ' ' +
                                  (currentUser?.activeBusiness?.publicDisplay
                                    ? currentUser?.activeBusiness?.publicDisplay
                                        ?.name
                                    : currentUser?.displayName || '')}
                              </Typography>
                              <Typography
                                variant="caption"
                                fontSize={'8px'}
                                lineHeight="1.7"
                                color={'#00000065'}
                                display="block"
                                fontWeight={400}
                                gutterBottom
                              >
                                {moment().format('DD MMMM YYYY')}
                              </Typography>
                            </div>
                          )}
                        </div>
                        <Divider component="div" />
                        <div
                          style={{
                            height: '84vh',
                            overflowY: 'scroll',
                            overflowX: 'hidden',
                            position: 'relative',
                            marginRight: '-5px',
                            zIndex: 1000,
                          }}
                        >
                          <PagesNav
                            isTablet={isTablet}
                            tasksOpen={taskOpen}
                            openSideTasksAgenda={openSideTasksAgenda}
                            drawerOpen={drawerOpen}
                            setDrawerOpen={setDrawerOpen}
                          />
                        </div>
                        <div
                          style={{
                            position: 'relative',
                            marginTop: '12px',
                            paddingBottom: '10vh',
                            paddingLeft: '20px',
                          }}
                        >
                          <Typography
                            variant="caption"
                            fontSize={isTablet ? '8px' : '10px'}
                            color="#00000085"
                            lineHeight="1"
                            display="block"
                            fontWeight={600}
                            gutterBottom
                          >
                            {isTablet ? 'Node™' : 'Intelligence Node Canada™'}
                          </Typography>
                          <Typography
                            variant="caption"
                            fontSize={isTablet ? '6.5px' : '7px'}
                            color="#00000085"
                            lineHeight="1"
                            display="block"
                            gutterBottom
                          >
                            Version {softwareVersion} - Tous droits réservés.
                          </Typography>
                        </div>
                      </div>
                    </div>
                  </Paper>
                </Grid>

                <Grid
                  xs={9.8}
                  sm={taskOpen ? 7 : 11}
                  md={taskOpen ? 7 : 9.8}
                  lg={taskOpen ? 7 : 9.8}
                  xl={taskOpen ? 7 : 9.8}
                  item
                  id="main-content"
                >
                  <Paper
                    elevation={0}
                    id="main-content-paper"
                    sx={{
                      zIndex: 1000,
                      height: '100vh',
                      backgroundColor: 'transparent',
                      padding: isTablet ? '8px' : '12px',
                    }}
                  >
                    <div>
                      <Paper
                        elevation={0}
                        sx={{
                          backgroundColor: 'transparent',
                        }}
                      >
                        <TopNavBar
                          isTablet={isTablet}
                          isMobile={isMobile}
                          pageTitle={pageTitle}
                          searchActivated={searchActivated}
                          actions={actions}
                          elementId={elementId}
                          formatedPath={formatedPath}
                          manualIndex={manualIndex}
                          tabs={tabs}
                          sectionTitle={sectionTitle}
                          subTitle={subTitle}
                        />

                        <AllSidebarsRoot />
                        <AllDrawersRoot />

                        <div
                          style={{
                            height: contentHeight + 'px',
                            overflowY: 'scroll',
                          }}
                        >
                          {!error404 ? (
                            children
                          ) : (
                            <div>
                              <Blocks heightPercentage={97}>
                                <div className="middle-content align-c mt-5">
                                  <div className="mt-5">
                                    <Lottie
                                      options={defaultOptions}
                                      height={80}
                                      width={100}
                                    />
                                    <div className="middle-content mt-3">
                                      <Typography
                                        variant="h5"
                                        fontSize={'24px'}
                                        lineHeight="1.2"
                                        display="block"
                                        fontWeight={600}
                                        gutterBottom
                                      >
                                        {t('error404')}
                                      </Typography>
                                      <Typography
                                        variant="caption"
                                        fontSize={'14px'}
                                        lineHeight="1.2"
                                        display="block"
                                        fontWeight={400}
                                        gutterBottom
                                      >
                                        {t('error404Desc')}
                                      </Typography>
                                    </div>
                                  </div>
                                  <div className="mt-4">
                                    <Button
                                      variant="contained"
                                      color="primary"
                                      label={t('navigateBack')}
                                      onClick={handleNavigateBack}
                                    />
                                  </div>
                                </div>
                              </Blocks>
                            </div>
                          )}
                        </div>
                      </Paper>
                    </div>
                  </Paper>
                </Grid>
              </Grid>
            </Grid>
          </div>
        </I18nextProvider>
      </DndProvider>
    </div>
  );
};

export default MainLayoutV2;
