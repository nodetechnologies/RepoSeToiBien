import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n.js';
import { getFirestore, doc, updateDoc } from 'firebase/firestore';
import {
  AppBar,
  Toolbar,
  Button,
  Menu,
  MenuItem,
  Paper,
  Box,
  Stack,
  Grid,
  Typography,
  Divider,
} from '@mui/material';
import { auth } from '../firebase';
import { CloseOutlined } from '@mui/icons-material';

const WebsiteLayout = ({
  children,
  businessData,
  value,
  handleChange,
  full,
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [searchParams, setSearchParams] = useSearchParams();
  const authToken = searchParams.get('token');
  const firebase = searchParams.get('firebase');
  const [anchorEl, setAnchorEl] = useState(null);
  const [langMenuAnchorEl, setLangMenuAnchorEl] = useState(null);
  const [displayBrand, setDisplayBrand] = useState(true);
  const [typeMenuAnchorEl, setTypeMenuAnchorEl] = useState(null);
  const [customerDrawerOpen, setCustomerDrawerOpen] = useState(false);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const currentType = localStorage.getItem('type');
  const tokens = localStorage.getItem('tokens');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  // Open language menu
  const handleLangMenuOpen = (event) => {
    setLangMenuAnchorEl(event.currentTarget);
  };

  // Close language menu
  const handleLangMenuClose = () => {
    setLangMenuAnchorEl(null);
  };

  // Open type menu
  const handleTypeMenuOpen = (event) => {
    setTypeMenuAnchorEl(event.currentTarget);
  };

  // Close type menu
  const handleTypeMenuClose = () => {
    setTypeMenuAnchorEl(null);
  };

  const handleLoginDrawer = (event) => {
    setCustomerDrawerOpen(event.currentTarget);
  };

  const handleCloseDrawer = () => {
    setCustomerDrawerOpen(null);
  };

  const navigateToContent = (contentKey) => {
    const url = '/functions/' + contentKey;
    if (url) {
      navigate(url);
      setLangMenuAnchorEl(null);
      setAnchorEl(null);
      setMenuOpen(false);
    } else {
    }
  };

  const navigateTips = (contentKey) => {
    const url = '/tips/' + contentKey;
    if (url) {
      navigate(url);
      setLangMenuAnchorEl(null);
      setAnchorEl(null);
      setMenuOpen(false);
    } else {
    }
  };

  const navigateTools = (contentKey) => {
    const url = '/tools/' + contentKey;
    if (url) {
      navigate(url);
      setLangMenuAnchorEl(null);
      setAnchorEl(null);
      setMenuOpen(false);
    } else {
    }
  };

  const navigateModule = (contentKey) => {
    const url = '/modules/';
    if (url) {
      navigate(url);
      setLangMenuAnchorEl(null);
      setAnchorEl(null);
      setMenuOpen(false);
    } else {
    }
  };

  const handleCloseOverlay = () => {
    menuOpen(false);
  };

  // Change language function
  const changeLanguage = async (lang) => {
    const user = auth.currentUser;

    if (user) {
      // User is authenticated, update the 'lang' field in the database
      const db = getFirestore();
      const userRef = doc(db, 'users', user.uid);

      try {
        await updateDoc(userRef, {
          lang: lang,
        });
      } catch (error) {
        console.error('Error updating language preference:', error);
      }
    }
    localStorage.setItem('i18nextLng', lang);
    window.location.reload();
  };

  const navigateHome = () => {
    navigate('/');
    setMenuOpen(false);
  };

  const navigateContact = () => {
    navigate('/contact');
    setMenuOpen(false);
  };

  const navigatePolicy = () => {
    navigate('/informations/mentions-legales');
  };

  const navigateHelpApp = () => {
    navigate('/help/app');
  };

  const navigateOnboard = () => {
    navigate('/onboard');
  };

  const handleLogin = () => {
    if (currentType === 'customer') {
      window.open('https://portal.usenode.com', '_blank');
    } else {
      navigate('/signin');
    }
  };

  const handleMobileMenuOpen = () => {
    setMobileMenuOpen(true);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuOpen(false);
  };

  const renderMobileMenu = (
    <Drawer
      anchor="left"
      open={Boolean(mobileMenuOpen)}
      onClose={handleMobileMenuClose}
    >
      <div style={{ width: 250, padding: 15 }}>
        {currentType !== 'customer' && (
          <>
            <Paper elevation={0}>
              <Typography
                fontSize="12px"
                fontWeight={600}
                variant="h6"
                sx={{
                  textTransform: 'uppercase',
                  marginLeft: '8px',
                }}
              >
                {t('toToDay')}
              </Typography>
              <MenuItem sx={{ borderRadius: '5px' }}>
                <Typography onClick={() => navigateTips('collaborate')}>
                  {t('shareCollaborate')}
                </Typography>
              </MenuItem>
              <MenuItem sx={{ borderRadius: '5px' }}>
                <Typography onClick={() => navigateTips('ai')}>
                  {t('drivenAI')}
                </Typography>
              </MenuItem>
              <MenuItem sx={{ borderRadius: '5px' }}>
                <Typography
                  onClick={() => navigateTips('connectorsautomations')}
                >
                  {t('connectorsautomations')}
                </Typography>
              </MenuItem>
              <MenuItem sx={{ borderRadius: '5px' }}>
                <Typography onClick={() => navigateTips('structure')}>
                  {t('flexibleStructure')}
                </Typography>
              </MenuItem>
            </Paper>
            <Paper elevation={0}>
              <Typography
                fontSize="12px"
                fontWeight={600}
                variant="h6"
                sx={{
                  textTransform: 'uppercase',
                  marginLeft: '8px',
                }}
              >
                {t('operations')}
              </Typography>
              <MenuItem sx={{ borderRadius: '5px' }}>
                <Typography onClick={() => navigateToContent('crm')}>
                  {t('crmClient')}
                </Typography>
              </MenuItem>
              <MenuItem sx={{ borderRadius: '5px' }}>
                <Typography onClick={() => navigateToContent('inventory')}>
                  {t('inventory')}
                </Typography>
              </MenuItem>
              <MenuItem sx={{ borderRadius: '5px' }}>
                <Typography onClick={() => navigateToContent('tasksNodies')}>
                  {t('nodiesTasks')}
                </Typography>
              </MenuItem>
              <MenuItem sx={{ borderRadius: '5px' }}>
                <Typography onClick={() => navigateToContent('dynamicData')}>
                  {t('forms')}
                </Typography>
              </MenuItem>
              <MenuItem sx={{ borderRadius: '5px' }}>
                <Typography onClick={() => navigateToContent('finances')}>
                  {t('finances')}
                </Typography>
              </MenuItem>
              <MenuItem sx={{ borderRadius: '5px' }}>
                <Typography onClick={() => navigateToContent('team')}>
                  {t('teamEmployees')}
                </Typography>
              </MenuItem>
            </Paper>
            {/* <Button
              sx={{
                fontSize: '1em !important',
                color:
                  theme?.palette?.mode === 'dark'
                    ? '#FFF !important'
                    : '#000 !important',
              }}
              color="inherit"
              onClick={navigateBusinessPage}
            >
              {' '}
              {t('businessNodePage')}
            </Button> */}
            {/* <Button
              sx={{
                fontSize: '1em !important',
                color:
                  theme?.palette?.mode === 'dark'
                    ? '#FFF !important'
                    : '#000 !important',
              }}
              color="inherit"
              onClick={navigatePricing}
            >
              {' '}
              {t('pricing')}
            </Button> */}
          </>
        )}

        <div style={{ marginLeft: '16px' }} className="row">
          <Button
            fullWidth
            onClick={navigateContact}
            sx={{
              flexDirection: 'column',
              alignItems: 'flex-start',
              textAlign: 'left',
            }}
            color="inherit"
          >
            {' '}
            {t('contact')}
            <Typography variant="caption" display="block" fontSize="9px">
              {t('writeMessage')}
            </Typography>
          </Button>
        </div>
      </div>
    </Drawer>
  );

  return (
    <div
      style={{
        backgroundColor: theme?.palette?.mode === 'dark' ? '#1a1a1a' : '#FFF',
        height: '100vh',
        overflow: 'auto',
        paddingTop: '12px',

        width: '100%',
      }}
      className="full-width"
    >
      <AppBar
        sx={{ zIndex: 200, backgroundColor: '#FFFFFF98' }}
        elevation={0}
        position="fixed"
      >
        <Toolbar className="justify-content-between">
          {/* {isMobile && (
            <div className="d-flex">
              <IconButton
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={handleMobileMenuOpen}
              >
                <MenuIcon />
              </IconButton>

              {!authToken && (
                <div onClick={navigateHome} className="hover">
                  <img
                    src="/assets/website/softwares/node-logo.png"
                    alt="logo"
                    className="mt-2"
                    style={{
                      height: '22.5px',
                      marginLeft: '8px',
                    }}
                  />
                </div>
              )}
            </div>
          )} */}

          <div onClick={navigateHome} className="hover">
            <img
              src="/assets/website/softwares/node-logo.png"
              alt="logo"
              className="mt-1"
              style={{
                height: '26px',
                marginRight: '13px',
              }}
            />
          </div>
          <div>
            <Button
              sx={{
                fontWeight: 600,
                marginLeft: '7px',
                fontSize: '0.9em',
                marginRight: '7px',
                color:
                  theme?.palette?.mode === 'dark'
                    ? '#FFF !important'
                    : '#000 !important',
              }}
              onClick={() => navigate('/platform')}
              color="inherit"
            >
              {t('platform')}
            </Button>

            {!isMobile && (
              <Button
                sx={{
                  fontWeight: 600,
                  marginLeft: '7px',
                  fontSize: '0.9em',
                  marginRight: '7px',
                  color:
                    theme?.palette?.mode === 'dark'
                      ? '#FFF !important'
                      : '#000 !important',
                }}
                onClick={() => navigate('/approch')}
                color="inherit"
              >
                {t('approch')}
              </Button>
            )}

            {isMobile && (
              <Button
                sx={{
                  fontWeight: 600,
                  marginLeft: '7px',
                  fontSize: '0.9em',
                  marginRight: '7px',
                  color:
                    theme?.palette?.mode === 'dark'
                      ? '#FFF !important'
                      : '#000 !important',
                }}
                onClick={() => navigate('/contact')}
                color="inherit"
              >
                {t('contact')}
              </Button>
            )}
            {/* {!isMobile && (
              <Button
                sx={{
                  fontWeight: 600,
                  marginLeft: '7px',
                  fontSize: '0.9em',
                  marginRight: '7px',
                  color:
                    theme?.palette?.mode === 'dark'
                      ? '#FFF !important'
                      : '#000 !important',
                }}
                onClick={() => navigate('/pricing')}
                color="inherit"
              >
                {t('pricing')}
              </Button>
            )} */}
            {!isMobile && (
              <Button
                sx={{
                  fontWeight: 600,
                  marginLeft: '7px',
                  fontSize: '0.9em',
                  marginRight: '7px',
                  color:
                    theme?.palette?.mode === 'dark'
                      ? '#FFF !important'
                      : '#000 !important',
                }}
                onClick={() => navigate('/use-cases')}
                color="inherit"
              >
                {t('useCases')}
              </Button>
            )}
            {!isMobile && (
              <Button
                sx={{
                  fontWeight: 500,
                  marginLeft: '45px',
                  marginRight: '7px',
                  fontSize: '0.9em',
                  color:
                    theme?.palette?.mode === 'dark'
                      ? '#FFF !important'
                      : '#000 !important',
                }}
                onClick={() => navigate('/meet-node')}
                color="inherit"
              >
                {t('planDemo')}
              </Button>
            )}
          </div>
          <div>
            <Button
              aria-controls="language-menu"
              aria-haspopup="true"
              onClick={handleLangMenuOpen}
              color="inherit"
              sx={{
                fontSize: '0.9em',
                color:
                  theme?.palette?.mode === 'dark'
                    ? '#FFF !important'
                    : '#000 !important',
              }}
            >
              {localStorage.getItem('i18nextLng') || 'fr'}
            </Button>
            <Menu
              id="language-menu"
              anchorEl={langMenuAnchorEl}
              keepMounted
              open={Boolean(langMenuAnchorEl)}
              onClose={handleLangMenuClose}
            >
              <MenuItem onClick={() => changeLanguage('en')}>EN</MenuItem>
              <MenuItem onClick={() => changeLanguage('fr')}>FR</MenuItem>
            </Menu>
            {!isMobile && (
              <Button
                sx={{
                  fontSize: '0.9em',
                  color:
                    theme?.palette?.mode === 'dark'
                      ? '#FFF !important'
                      : '#000 !important',
                }}
                onClick={navigateOnboard}
                color="inherit"
              >
                {t('signup')}
              </Button>
            )}
            {!isMobile && (
              <Button
                sx={{
                  fontSize: '0.9em',
                  marginLeft: '7px',
                  borderRadius: '40px',
                  color:
                    theme?.palette?.mode === 'dark'
                      ? '#FFF !important'
                      : '#000 !important',
                }}
                onClick={handleLogin}
                variant="outlined"
                elevation={0}
                color="primary"
              >
                {t('login')}
              </Button>
            )}
          </div>
        </Toolbar>
      </AppBar>
      {isMobile && renderMobileMenu}
      <div
        style={{
          width: '100%',
          justifyContent: 'center',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            maxWidth: full ? '100%' : '1300px',
            margin: '0 auto',
            paddingTop: '50px',
            overflowX: 'hidden',
            paddingBottom: '70px',
          }}
        >
          {children}
        </div>
      </div>
      {!authToken && (
        <footer
          style={{
            backgroundColor:
              theme?.palette?.mode === 'dark' ? '#696969' : '#F7F7F7',
            padding: isMobile ? '15px 0' : '30px 0',
            minHeight: '280px',
          }}
        >
          <Grid
            container
            justifyContent="center"
            paddingBottom="70px"
            alignContent="center"
            marginLeft={isMobile ? '5%' : '7.5%'}
            maxWidth={isMobile ? '90%' : '85%'}
            marginRight={isMobile ? '5%' : '7.5%'}
          >
            <Grid item xs={12} sm={6} md={3} align="left">
              <img
                src="/assets/website/softwares/node.png"
                alt="logo"
                className="mt-2"
                style={{
                  height: '50px',
                  width: '50px',
                  marginRight: '15px',
                  borderRadius: '8px',
                }}
              />
              <Typography
                variant="body1"
                fontWeight={500}
                color="textSecondary"
              >
                Intelligence Node Canada, Inc. © 2023
              </Typography>
              {currentType !== 'customer' && (
                <Box>
                  <Typography variant="body1" color="textSecondary">
                    1-888-343-0310
                  </Typography>
                </Box>
              )}
              <Box>
                <Typography variant="body1" color="textSecondary">
                  support@usenode.com
                </Typography>
              </Box>
              <Box>
                <Typography variant="body1" color="textSecondary">
                  Canada
                </Typography>
              </Box>
            </Grid>
            {currentType === 'business' && (
              <Grid item xs={12} sm={6} md={3}>
                <Typography
                  variant="h6"
                  marginBottom="8px"
                  fontWeight={600}
                  color="textPrimary"
                >
                  {t('functionnalities')}
                </Typography>
                <Box>
                  <Typography
                    component="a"
                    href="https://usenode.com"
                    variant="body1"
                    color="textSecondary"
                    style={{ textDecoration: 'none', cursor: 'pointer' }}
                  >
                    {t('allInOneSowftware')}
                  </Typography>
                </Box>
                <Box>
                  <Typography
                    component="a"
                    href="https://usenode.com"
                    variant="body1"
                    color="textSecondary"
                    style={{ textDecoration: 'none', cursor: 'pointer' }}
                  >
                    {t('variants')}
                  </Typography>
                </Box>
                <Box>
                  <Typography
                    component="a"
                    href="https://usenode.com"
                    variant="body1"
                    color="textSecondary"
                    style={{ textDecoration: 'none', cursor: 'pointer' }}
                  >
                    {t('automatedWaitingProcess')}
                  </Typography>
                </Box>
                <Box>
                  <Typography
                    component="a"
                    href="https://usenode.com"
                    variant="body1"
                    color="textSecondary"
                    style={{ textDecoration: 'none', cursor: 'pointer' }}
                  >
                    {t('tasksManagement')}
                  </Typography>
                </Box>
                <Box>
                  <Typography
                    component="a"
                    href="https://usenode.com"
                    variant="body1"
                    color="textSecondary"
                    style={{ textDecoration: 'none', cursor: 'pointer' }}
                  >
                    {t('aIPowered')}
                  </Typography>
                </Box>
                <Box>
                  <Typography
                    component="a"
                    href="https://usenode.com"
                    variant="body1"
                    color="textSecondary"
                    style={{ textDecoration: 'none', cursor: 'pointer' }}
                  >
                    {t('builtInEntrepreneur')}
                  </Typography>
                </Box>
                <Box>
                  <Typography
                    component="a"
                    href="https://usenode.com"
                    variant="body1"
                    color="textSecondary"
                    style={{ textDecoration: 'none', cursor: 'pointer' }}
                  >
                    {t('multiPrices')}
                  </Typography>
                </Box>
                <Box>
                  <Typography
                    component="a"
                    href="https://usenode.com"
                    variant="body1"
                    color="textSecondary"
                    style={{ textDecoration: 'none', cursor: 'pointer' }}
                  >
                    {t('flexibleReporting')}
                  </Typography>
                </Box>
              </Grid>
            )}

            <Grid item xs={12} sm={6} md={3}>
              <Typography
                variant="h6"
                marginBottom="8px"
                fontWeight={600}
                color="textPrimary"
              >
                {t('usefulLinks')}
              </Typography>

              <Box>
                <Typography
                  component="a"
                  onClick={navigateHelpApp}
                  variant="body1"
                  color="textSecondary"
                  style={{ textDecoration: 'none', cursor: 'pointer' }}
                >
                  {t('helpCustomer')}
                </Typography>
              </Box>
              <Box>
                <Typography
                  component="a"
                  href="https://usenode.com"
                  variant="body1"
                  color="textSecondary"
                  style={{ textDecoration: 'none', cursor: 'pointer' }}
                >
                  {t('agencyProgram')}
                </Typography>
              </Box>
              <Box>
                <Typography
                  component="a"
                  href="https://usenode.com"
                  variant="body1"
                  color="textSecondary"
                  style={{ textDecoration: 'none', cursor: 'pointer' }}
                >
                  {t('nodeForCommunity')}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Typography
                variant="h6"
                marginBottom="8px"
                fontWeight={600}
                color="textPrimary"
              >
                {t('aboutNode')}
              </Typography>
              <Box>
                <Typography
                  component="a"
                  href="https://usenode.com"
                  variant="body1"
                  color="textSecondary"
                  style={{ textDecoration: 'none', cursor: 'pointer' }}
                >
                  {t('aboutUs')}
                </Typography>
              </Box>
              <Box>
                <Typography
                  component="a"
                  onClick={navigatePolicy}
                  variant="body1"
                  color="textSecondary"
                  style={{ textDecoration: 'none', cursor: 'pointer' }}
                >
                  {t('privacyPolicy')}
                </Typography>
              </Box>
              <Box>
                <Typography
                  component="a"
                  onClick={navigateContact}
                  variant="body1"
                  color="textSecondary"
                  style={{ textDecoration: 'none', cursor: 'pointer' }}
                >
                  {t('contact')}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </footer>
      )}
    </div>
  );
};

export default WebsiteLayout;
