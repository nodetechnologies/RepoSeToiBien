import React, { useState, useEffect, useRef } from 'react';
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  IconButton,
  Popper,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  Typography,
} from '@mui/material';
import {
  Menu as MenuIcon,
  ColorLensOutlined,
  DarkModeOutlined,
  LightModeOutlined,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { useThemeCont } from '../../contexts/ThemeContext';
import { SketchPicker } from 'react-color';
import chroma from 'chroma-js';
import { fetchBusinessData } from '../../redux/actions-v2/coreAction';

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const currentLangCode = i18n.language;

  const theme = useTheme();
  const { toggleTheme } = useThemeCont();
  const isDarkMode = theme.palette.mode === 'dark';
  const storedcolor = '#1604DD';
  const businessPreference = useSelector((state) => state.core.businessData);

  const [primaryColor, setPrimaryColor] = useState(
    businessPreference?.mainColor
  );
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [devMode, setDevMode] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const colorPickerRef = useRef(null);

  const handleColorChange = (color) => {
    const selectedColor = color.hex;
    const luminance = chroma(selectedColor).luminance();
    const [hue, saturation, lightness] = chroma(selectedColor).hsl();

    if (luminance < 0.6 && saturation > 0.2) {
      setPrimaryColor(selectedColor);
      dispatch(
        fetchBusinessData(null, t, currentLangCode, {
          mainColor: selectedColor,
          secColor: '#000000',
          name: '',
          devMode: devMode,
        })
      );
    } else {
      alert(t('selectDarkerColor'));
    }
  };

  useEffect(() => {
    setTimeout(() => {
      handleColorChange({ hex: businessPreference?.mainColor || storedcolor });
    }, 1000);
  }, [currentLangCode]);

  const handleColorPickerToggle = (event) => {
    setAnchorEl(event.currentTarget);
    setShowColorPicker((prev) => !prev);
  };

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
  };

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      // Close Popper only if the click is outside both anchor and color picker container
      if (
        anchorEl &&
        !anchorEl.contains(event.target) &&
        colorPickerRef.current &&
        !colorPickerRef.current.contains(event.target)
      ) {
        setShowColorPicker(false);
      }
    }

    if (showColorPicker) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showColorPicker, anchorEl]);

  return (
    <AppBar
      elevation={0}
      sx={{ background: 'transparent !important' }}
      position="static"
    >
      <Toolbar>
        <Box
          sx={{ flexGrow: 1, cursor: 'pointer' }}
          onClick={() => navigate('/')}
        >
          <img
            src="/assets/website/softwares/node-logo.png"
            height={28}
            alt="Node"
          />
        </Box>

        {/* Mobile Menu Icon */}
        <IconButton
          edge="start"
          color="inherit"
          onClick={toggleDrawer(true)}
          sx={{ display: { xs: 'block', md: 'none' } }}
        >
          <MenuIcon
            sx={{
              fontSize: '2rem',
              mt: 0.7,
              mr: 1,
              color: isDarkMode ? 'white !important' : 'black !important',
            }}
          />
        </IconButton>

        <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
          <div style={{ width: '400px' }}>
            <Typography
              variant="h5"
              fontWeight={700}
              sx={{ mt: 4, mb: 2, textAlign: 'left', pl: 2 }}
            >
              MENU
            </Typography>
            <List>
              {['home', 'features', 'integrations', 'pricing', 'contact'].map(
                (page) => (
                  <ListItem
                    button
                    key={page}
                    onClick={() => {
                      navigate(`/${page === 'home' ? '' : page}`);
                      setDrawerOpen(false);
                    }}
                  >
                    <ListItemText primary={t(page)} />
                  </ListItem>
                )
              )}
              <Divider component="div" sx={{ mt: 2, mb: 2 }} />
              <ListItem button onClick={() => navigate('/onboard')}>
                <ListItemText primary={t('signup')} />
              </ListItem>
              <ListItem button onClick={() => navigate('/signin')}>
                <ListItemText primary={t('login')} />
              </ListItem>
            </List>
          </div>
        </Drawer>

        {/* Desktop Menu */}
        <Box sx={{ flexGrow: 5, display: { xs: 'none', md: 'flex' } }}>
          {['home', 'features', 'integrations', 'pricing', 'contact'].map(
            (page) => (
              <Button
                key={page}
                sx={{
                  fontSize: '1.05rem',
                  marginRight: '10px',
                  fontWeight:
                    window.location.pathname ===
                    `/${page === 'home' ? '' : page}`
                      ? 600
                      : 500,
                  color: isDarkMode ? 'white !important' : 'black !important',
                }}
                onClick={() => navigate(`/${page === 'home' ? '' : page}`)}
              >
                {t(page)}
              </Button>
            )
          )}
        </Box>

        <Box
          flexGrow={1}
          sx={{
            display: 'flex',
            alignContent: 'right',
            justifyContent: 'right',
          }}
        >
          <IconButton
            onClick={toggleTheme}
            color={isDarkMode ? 'white' : 'black'}
          >
            {isDarkMode ? <LightModeOutlined /> : <DarkModeOutlined />}
          </IconButton>
          <IconButton
            onClick={handleColorPickerToggle}
            color={isDarkMode ? 'white' : 'black'}
          >
            <ColorLensOutlined />
          </IconButton>
          <Popper
            open={showColorPicker}
            anchorEl={anchorEl}
            placement="bottom"
            style={{ zIndex: 1000 }}
          >
            <Box
              ref={colorPickerRef}
              sx={{
                p: 2,
                backgroundColor: isDarkMode ? '#333' : '#FFF',
                borderRadius: '8px',
                boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)',
              }}
            >
              <SketchPicker
                color={primaryColor}
                onChangeComplete={handleColorChange}
                styles={{
                  default: {
                    picker: { boxShadow: 'none' },
                    saturation: { borderRadius: '8px' },
                    hue: { borderRadius: '8px' },
                  },
                }}
              />
            </Box>
          </Popper>
        </Box>
        <Box
          flexGrow={1}
          sx={{
            display: 'flex',
            alignContent: 'right',
            justifyContent: 'right',
          }}
        >
          <Button
            sx={{
              fontSize: '1.05rem',
              marginRight: '20px',
              color: isDarkMode ? 'white !important' : 'black !important',
            }}
            onClick={() =>
              changeLanguage(currentLangCode === 'en' ? 'fr' : 'en')
            }
          >
            {currentLangCode === 'en' ? 'FR' : 'EN'}
          </Button>
          <Button
            sx={{
              fontSize: '1.05rem',
              marginRight: '20px',
              display: { xs: 'none', md: 'block' },
              color: isDarkMode ? 'white !important' : 'black !important',
            }}
            onClick={() => navigate('/onboard')}
          >
            {t('signup')}
          </Button>

          <Button
            onClick={() => navigate('/signin')}
            variant="contained"
            disableElevation
            sx={{
              fontSize: '1.05rem',
              marginRight: '20px',
              display: { xs: 'none', md: 'block' },
              paddingLeft: '30px',
              paddingRight: '30px',
              borderRadius: '50px',
              color: isDarkMode ? 'black' : 'white',
              '&:hover': {
                backgroundColor: theme.palette.primary.dark,
              },
            }}
          >
            {t('login')}
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
