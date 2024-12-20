import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTheme } from '@mui/material/styles';
import { useThemeCont } from '../../../contexts/ThemeContext';

//utilities
import { useTranslation } from 'react-i18next';
import {
  Avatar,
  Box,
  FormControl,
  Grid,
  InputLabel,
  Typography,
} from '@mui/material';
import ButtonMUI from '@mui/material/Button';
import Button from '../../../stories/general-components/Button';
import DrawerSide from '../../../stories/layout-components/DrawerSide';
import { setGeneralStatus } from '../../../redux/actions-v2/coreAction';
import nodeAxiosFirebase from '../../../utils/nodeAxiosFirebase';
import TextField from '../../../stories/general-components/TextField';
import Slider from '../../../stories/general-components/Slider';
import { fetchBusinessData } from '../../../redux/actions-v2/coreAction.js';

const UserSecMenu = ({ drawerOpen, setDrawerOpen, handleMenuOpenSec }) => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const { mode, toggleTheme } = useThemeCont();
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const [formData, setFormData] = useState({});
  const [currentStep, setCurrentStep] = useState(0);
  const [gender, setGender] = useState(0);
  const [newAvatar, setNewAvatar] = useState(false);
  const [skinColor, setSkinColor] = useState(0);
  const [hairColor, setHairColor] = useState(0);
  const [hairStyle, setHairStyle] = useState(0);
  const steps = ['Gender', 'SkinColor', 'HairColor', 'HairStyle'];

  const currentUser = useSelector((state) => state.core.user);

  const businessPreference = useSelector((state) => state.core.businessData);

  const activeUser = businessPreference?.employees?.find(
    (employee) => employee.id === currentUser?.uid
  );

  useEffect(() => {
    if (activeUser) {
      setFormData({
        avatar: activeUser.avatar,
        theme: activeUser.theme,
        lang: activeUser.lang,
        preferences: activeUser?.preferences,
        linkedin: activeUser?.publicDisplay?.linkedin,
        title: activeUser?.publicDisplay?.title,
        name: activeUser?.publicDisplay?.name || activeUser?.displayName,
        phone: activeUser?.publicDisplay?.phone,
        email: activeUser?.publicDisplay?.email,
      });
    }
  }, [activeUser]);

  const handleSave = async () => {
    try {
      dispatch(
        setGeneralStatus({
          status: 'loading',
          position: 'top-rightProfile',
          type: 'pulse',
        })
      );
      await nodeAxiosFirebase({
        t,
        method: 'POST',
        showLoading: true,
        url: `users/manage`,
        body: {
          avatar: formData?.avatar || currentUser?.photoURL,
          lang: formData?.lang || 'fr',
          preferences: {
            blur: formData?.blur ?? 5,
            color:
              formData?.color || businessPreference?.mainColor || '#000000',
            theme: formData?.theme || isDarkMode ? 'dark' : 'light',
          },
          businessData: {
            linkedin: formData?.linkedin || '',
            title: formData?.title || '',
            name: formData?.name || currentUser?.displayName,
            phone: formData?.phone || '',
            email: formData?.email || '',
          },
        },
      });
      setDrawerOpen(false);
      dispatch(
        setGeneralStatus({
          status: 'success',
          position: 'top-rightProfile',
          type: 'pulse',
        })
      );
      dispatch(fetchBusinessData(businessPreference?.id, t, i18n.language));
    } catch (error) {
      console.error('Failed to update user');
      dispatch(setGeneralStatus({ status: 'error', error: error }));
    }
  };

  const handleAvatarSelection = async (avatar) => {
    setFormData({
      ...formData,
      avatar: 'https://storage.googleapis.com/avatars_node/' + avatar + '.png',
    });
    setCurrentStep(0);
    setGender(0);
    setSkinColor(0);
    setHairColor(0);
    setHairStyle(0);
    setNewAvatar(false);
  };

  const handleNextStep = (selection) => {
    let newAvatarId = '';
    switch (currentStep) {
      case 0:
        setGender(selection);
        newAvatarId = `${selection}000`;
        break;
      case 1:
        setSkinColor(selection);
        newAvatarId = `${gender}${selection}00`;
        break;
      case 2:
        setHairColor(selection);
        newAvatarId = `${gender}${skinColor}${selection}0`;
        break;
      case 3:
        setHairStyle(selection);
        newAvatarId = `${gender}${skinColor}${hairColor}${selection}`;
        break;
      default:
        break;
    }

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Final step: handle avatar selection
      handleAvatarSelection(newAvatarId);
    }
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
  };

  const handleBlurUpdate = (field, value) => {
    setFormData({ ...formData, blur: value });
  };

  const renderSelectionOptions = () => {
    // Define options for each step
    const options = [
      [
        { label: '', value: 0 },
        { label: '', value: 1 },
      ],
      [
        { label: '', value: 0 },
        { label: '', value: 1 },
        { label: '', value: 2 },
      ],
      [
        { label: '', value: 0 },
        { label: '', value: 1 },
        { label: '', value: 2 },
        { label: '', value: 3 },
        { label: '', value: 4 },
      ],
      [
        { label: '', value: 0 },
        { label: '', value: 1 },
        { label: '', value: 2 },
        { label: '', value: 3 },
        { label: '', value: 4 },
        { label: '', value: 5 },
        { label: '', value: 6 },
      ],
    ];

    const currentAvatarId = `${gender}${skinColor}${hairColor}${hairStyle}`;

    return options[currentStep].map((option) => (
      <ButtonMUI
        key={option.value}
        onClick={() => handleNextStep(option.value)}
      >
        <img
          src={`https://storage.googleapis.com/avatars_node/${
            currentAvatarId.slice(0, currentStep) +
            option.value +
            '0'.repeat(3 - currentStep)
          }.png`}
          alt={`${steps[currentStep]}`}
          width="65px"
        />
      </ButtonMUI>
    ));
  };

  const handleUpdateLang = () => {
    localStorage.setItem('i18nextLng', i18n.language === 'fr' ? 'en' : 'fr');
    window.location.reload();
  };

  const handleOpenLink = () => {
    const link = '/profile/' + currentUser?.uid + '/' + businessPreference?.id;
    window.open(link, '_blank');
  };

  return (
    <>
      <DrawerSide
        isDrawerOpen={drawerOpen}
        isCreation={true}
        title={t('publicProfile')}
        handleSave={handleSave}
        subtitle={t('editProfile')}
        handleDrawerClose={handleCloseDrawer}
      >
        <div>
          {!newAvatar && (
            <div
              onClick={() => setNewAvatar(true)}
              className="d-flex middle-content hover"
            >
              <Box>
                <Avatar
                  alt="User"
                  src={formData?.avatar || currentUser?.photoURL}
                  sx={{ width: 52, height: 52 }}
                />
              </Box>
            </div>
          )}
          {newAvatar && (
            <div>
              <Typography>{t(`selectAvatar`)}</Typography>
              <Box>{renderSelectionOptions()}</Box>
            </div>
          )}
          <div className="mt-3">
            <TextField
              label={t('name')}
              value={
                formData?.name || currentUser?.displayName || currentUser?.name
              }
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              variant="outlined"
              fullWidth
            />
          </div>
          <div className="mt-1">
            <TextField
              label={t('phone')}
              value={formData?.phone || currentUser?.phoneNumber || ''}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              variant="outlined"
              type="phone"
              fullWidth
            />
          </div>
          <div className="mt-1">
            <TextField
              label={t('email')}
              value={formData?.email || currentUser?.email || ''}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              variant="outlined"
              fullWidth
              type="email"
            />
          </div>
          <div className="mt-1">
            <TextField
              label={t('title')}
              value={formData?.title || currentUser?.address || ''}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              variant="outlined"
              fullWidth
            />
          </div>
          <div className="mt-1">
            <TextField
              label={t('linkedin')}
              value={formData?.linkedin || ''}
              onChange={(e) =>
                setFormData({ ...formData, linkedin: e.target.value })
              }
              variant="outlined"
              fullWidth
            />
          </div>
          <div className="d-flex">
            <div className="mt-1 col-6">
              <FormControl
                fullWidth
                margin="normal"
                sx={{
                  border: '1px solid lightgray',
                  borderRadius: '10px',
                  padding: '10px',
                }}
              >
                <InputLabel
                  shrink
                  required={true}
                  sx={{
                    backgroundColor: isDarkMode ? 'rgb(51,51,51)' : '#FFF',
                    padding: '2px 10px 2px 10px',
                    borderRadius: '10px',
                  }}
                >
                  {t('language')}
                </InputLabel>{' '}
                <div onClick={handleUpdateLang}>
                  <Grid container spacing={2}>
                    <Typography
                      className="hover"
                      fontWeight={500}
                      sx={{ mt: 3, mb: 1, mx: 5 }}
                    >
                      {i18n.language === 'fr' ? t('switchEn') : t('switchFr')}
                    </Typography>
                  </Grid>
                </div>
              </FormControl>
            </div>
            <div className="mt-1 col-6" style={{ paddingLeft: '20px' }}>
              <FormControl
                fullWidth
                margin="normal"
                sx={{
                  border: '1px solid lightgray',
                  borderRadius: '10px',
                  padding: '10px',
                }}
              >
                <InputLabel
                  shrink
                  required={true}
                  sx={{
                    backgroundColor: isDarkMode ? 'rgb(51,51,51)' : '#FFF',

                    padding: '2px 10px 2px 10px',
                    borderRadius: '10px',
                  }}
                >
                  {t('theme')}
                </InputLabel>{' '}
                <div onClick={toggleTheme}>
                  <Grid container spacing={2}>
                    <Typography
                      className="hover"
                      fontWeight={500}
                      sx={{ mt: 3, mb: 1, mx: 5 }}
                    >
                      {isDarkMode ? t('switchLight') : t('switchDark')}
                    </Typography>
                  </Grid>
                </div>
              </FormControl>
            </div>
          </div>
          <div className="mt-1 col-12">
            <Slider
              value={formData?.blur ?? 5}
              selections={[
                { value: 0, label: '0' },
                { value: 1, label: '1' },
                { value: 2, label: '2' },
                { value: 3, label: '3' },
                { value: 4, label: '4' },
                { value: 5, label: '5' },
                { value: 6, label: '6' },
                { value: 7, label: '7' },
                { value: 8, label: '8' },
                { value: 9, label: '9' },
                { value: 10, label: '10' },
              ]}
              onChange={handleBlurUpdate}
              label={t('blur')}
            />
          </div>
          <div className="mt-4">
            <Button
              endIcon="OpenInNew"
              onClick={handleOpenLink}
              variant="outlined"
              color="primary"
              fullWidth
              label={t('publicLink')}
            />
          </div>
        </div>
      </DrawerSide>
      <div className="d-flex middle-content hover">
        <div
          className="middle-content d-flex mt-1"
          style={{
            borderRadius: '50px',
            marginBottom: '5px',
            marginTop: '5px',
            height: '35px',
            maxHeight: '35px',
          }}
        >
          <div className="px-3 align-right" onClick={handleMenuOpenSec}>
            <Avatar
              alt="User"
              src={currentUser?.photoURL}
              sx={{ width: 24, height: 24 }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default UserSecMenu;
