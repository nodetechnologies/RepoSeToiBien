import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

import MainLayoutV2 from '../../layouts/MainLayoutV2';
import { useTheme } from '@mui/material/styles';
import * as modalActions from '../../redux/actions/modal-actions';
import Block from '../../stories/layout-components/Block';
import {
  Autocomplete,
  Avatar,
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from '@mui/material';
import TextFieldMUI from '@mui/material/TextField';
import TextField from '../../stories/general-components/TextField';
import Select from '../../stories/general-components/Select';
import nodeAxiosFirebase from '../../utils/nodeAxiosFirebase';
import ModalSmallHoriz from '../../modals/Base/ModalSmallHoriz';
import GeneralText from '../../stories/general-components/GeneralText';
import { CheckBox, ThumbDown } from '@mui/icons-material';
import {
  fetchBusinessData,
  setGeneralStatus,
} from '../../redux/actions-v2/coreAction';

const SettingsTeam = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const theme = useTheme();
  const isDarkmode = theme.palette.mode === 'dark';
  const [openModal, setOpenModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [formData, setFormData] = useState({});
  const [userDetails, setUserDetails] = useState({});
  const [isValidated, setIsValidated] = useState(false);

  const handleSave = async () => {
    if (!selectedGroups?.length) return;

    try {
      const updatedGroups = [...selectedGroups?.map((group) => group.id)];

      await nodeAxiosFirebase({
        t,
        method: 'POST',
        url: `business/employee`,
        body: {
          userId: selectedEmployee?.uid,
          role: selectedEmployee?.role,
          groups: updatedGroups,
          displayEmail:
            selectedEmployee?.displayEmail ||
            selectedEmployee?.publicDisplay?.email ||
            selectedEmployee?.email ||
            '',
          displayNameBusiness:
            selectedEmployee?.displayNameBusiness ||
            selectedEmployee?.displayName ||
            selectedEmployee?.publicDisplay?.name ||
            '',
          displayPhone:
            selectedEmployee?.displayPhone ||
            selectedEmployee?.publicDisplay?.phone ||
            '',
          displayTitle:
            selectedEmployee?.displayTitle ||
            selectedEmployee?.publicDisplay?.title ||
            '',
          displayLinkedin:
            selectedEmployee?.displayLinkedin ||
            selectedEmployee?.publicDisplay?.linkedin ||
            '',
        },
      });
      setSelectedEmployee({ ...selectedEmployee, groups: updatedGroups });
      dispatch(fetchBusinessData(businessPreference.id, t));
      toast.success(t('updated'));
    } catch (error) {
      console.error('Error updating groups');
      dispatch(setGeneralStatus({ status: 'error', error: error }));
    }
  };

  const handleRevoke = async () => {
    dispatch(
      modalActions.modalConfirmation({
        isOpen: true,
        title: t('deleteEmployee'),
        message: t('deleteEmployeeMessage'),
        handleConfirm: () => handleRevokeConfirmed(),
      })
    );
  };

  const handleRevokeConfirmed = async () => {
    try {
      await nodeAxiosFirebase({
        t,
        method: 'DELETE',
        url: `business/employee`,
        body: {
          userId: selectedEmployee?.uid,
        },
      });
      setSelectedEmployee(null);
      toast.success(t('removed'));
      dispatch(fetchBusinessData(businessPreference.id, t));
    } catch (error) {
      console.error('Error delete');
      dispatch(setGeneralStatus({ status: 'error', error: error }));
    }
  };

  const businessPreference = useSelector((state) => state.core.businessData);

  const formatedGroups = businessPreference?.groups?.map((group) => ({
    label: group?.name,
    value: group?.identifiant,
    id: group?.identifiant,
  }));

  const handleSelectEmployee = (employee) => {
    setSelectedEmployee(employee);
    setSelectedGroups(
      employee?.groups?.map((group) => ({
        id: group,
        value: group,
        label: formatedGroups?.find((g) => g.id === group)?.label,
      })) || []
    );
  };

  const handleAdd = () => {
    setSelectedEmployee();
    setUserDetails({});
    setFormData({});
    setIsValidated(false);
    setOpenModal(true);
  };

  const handleAddNewEmployee = async () => {
    try {
      const response = await nodeAxiosFirebase({
        t,
        method: 'POST',
        url: `business/employee`,
        body: {
          role: formData?.role,
          groups: formData?.groups?.map((group) => group.id),
          email: formData?.email,
        },
      });
      if (response?.status === 'success') {
        setOpenModal(false);
        setSelectedEmployee();
        dispatch(fetchBusinessData(businessPreference.id, t));
      }
    } catch (error) {
      console.error('Error adding employee');
      dispatch(setGeneralStatus({ status: 'error', error: error }));
    }
  };

  const validateExistingEmail = async (email) => {
    setIsValidated(false);
    setUserDetails({});
    try {
      const response = await nodeAxiosFirebase({
        t,
        method: 'POST',
        url: `users/email`,
        body: {
          email: email,
        },
      });
      if (response?.isValidated) {
        setIsValidated(response?.isValidated);
        setUserDetails({
          displayName: t('existingUser') + ' ' + response?.details?.displayName,
        });
      } else if (!response?.isValidated) {
        setIsValidated(false);
        setUserDetails({
          displayName: t('notFound'),
        });
      }
    } catch (error) {
      console.error('Error employee');
      dispatch(setGeneralStatus({ status: 'error', error: error }));
    }
  };

  return (
    <MainLayoutV2
      pageTitle={t('team')}
      actions={{
        add: handleAdd,
        deleteItem: selectedEmployee && handleRevoke,
        save: selectedEmployee && handleSave,
      }}
    >
      <ModalSmallHoriz
        isOpen={openModal}
        modalCloseHandler={() => setOpenModal(false)}
        btnOnClick={handleAddNewEmployee}
        btnLabel={isValidated && t('add')}
        title={t('addEmployee')}
        subTitle={t('addEmployeeSubTitle')}
      >
        <div
          style={{ minWidth: '600px' }}
          className=" align-c align-items-center p-1"
        >
          <TextField
            label={t('email')}
            value={formData?.email || ''}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            variant="outlined"
            type="email"
            fullWidth
            onBlur={() => validateExistingEmail(formData?.email)}
          />
          <div
            className="px-3"
            style={{ marginTop: '-10px', marginBottom: '10px' }}
          >
            {userDetails?.displayName && (
              <div className="d-flex middle-content">
                {isValidated && (
                  <CheckBox
                    sx={{ color: 'green' }}
                    fontSize="small"
                    style={{ color: 'green' }}
                  />
                )}
                {!isValidated && (
                  <ThumbDown
                    sx={{ color: 'red' }}
                    fontSize="small"
                    style={{ color: 'red' }}
                  />
                )}
                <GeneralText
                  text={userDetails?.displayName}
                  primary={true}
                  size={'regular'}
                  fontSize={'10px'}
                  classNameComponent="px-1"
                />
              </div>
            )}
          </div>
          <Select
            label={t('access')}
            fullWidth
            value={formData?.role}
            onChange={(e, value) =>
              setFormData({
                ...formData,
                role: value,
              })
            }
            selections={[
              { id: 'ADMIN', value: 'ADMIN', label: t('admin') },
              {
                id: 'EMPLOYEE',
                value: 'EMPLOYEE',
                label: t('employee'),
              },
              {
                id: 'VIEWER',
                value: 'VIEWER',
                label: t('viewer'),
              },
            ]}
          />
          <Autocomplete
            multiple
            sx={{ marginTop: '20px' }}
            key={'newEmployee'}
            options={formatedGroups || []}
            getOptionLabel={(option) => option?.label || ''}
            value={formData?.groups || []}
            onChange={(event, newValue) => {
              setFormData({ ...formData, groups: newValue });
            }}
            renderInput={(params) => (
              <TextFieldMUI
                {...params}
                label={t('selectGroup')}
                variant="outlined"
                sx={{
                  'MuiFormControl-root': {
                    width: '100%',
                  },
                  '.MuiInputBase-input': {
                    height: '50px',
                    padding: '2px 10px 2px 10px',
                  },
                  '& .MuiFormLabel-root': {
                    backgroundColor: isDarkmode && 'rgb(51,51,51)',
                    padding: '2px 10px 2px 10px',
                    borderRadius: '10px',
                  },
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
      </ModalSmallHoriz>
      <Block height={1} heightPercentage={100} noBorder>
        <Box display="flex" p={2}>
          <Box width="30%">
            <List>
              {businessPreference?.employees?.map((employee) => (
                <ListItem
                  key={employee?.uid}
                  button
                  dense
                  sx={{
                    backgroundColor:
                      selectedEmployee?.uid === employee?.uid
                        ? '#F5F5F5'
                        : 'transparent',
                  }}
                  divider
                  onClick={() => handleSelectEmployee(employee)}
                >
                  <ListItemAvatar>
                    <Avatar
                      alt={
                        employee?.publicDisplay?.name || employee.displayName
                      }
                      src={employee.avatar}
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      employee?.publicDisplay?.name || employee.displayName
                    }
                    secondary={t(employee?.role?.toLowerCase())}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
          <Box width="70%" pl={2}>
            {selectedEmployee && (
              <>
                <Typography fontWeight={600} variant="h6">
                  {selectedEmployee?.displayName}
                </Typography>
                <Typography variant="body2">
                  {t('access') + ' ' + selectedEmployee?.role}
                </Typography>

                <Box alignItems="center">
                  <div className="mb-4">
                    <TextField
                      label={t('name')}
                      fullWidth
                      value={
                        selectedEmployee?.displayNameBusiness ||
                        selectedEmployee?.publicDisplay?.name ||
                        ''
                      }
                      onChange={(e) =>
                        setSelectedEmployee({
                          ...selectedEmployee,
                          displayNameBusiness: e.target.value,
                        })
                      }
                      sx={{ marginBottom: '20px' }}
                    />
                    <TextField
                      label={t('email')}
                      fullWidth
                      value={
                        selectedEmployee?.displayEmail ||
                        selectedEmployee?.publicDisplay?.email ||
                        ''
                      }
                      onChange={(e) =>
                        setSelectedEmployee({
                          ...selectedEmployee,
                          displayEmail: e.target.value,
                        })
                      }
                      sx={{ marginBottom: '20px' }}
                    />
                    <TextField
                      label={t('phone')}
                      fullWidth
                      value={
                        selectedEmployee?.displayPhone ||
                        selectedEmployee?.publicDisplay?.phone ||
                        ''
                      }
                      onChange={(e) =>
                        setSelectedEmployee({
                          ...selectedEmployee,
                          displayPhone: e.target.value,
                        })
                      }
                      sx={{ marginBottom: '20px' }}
                    />
                    <TextField
                      label={t('title')}
                      fullWidth
                      value={
                        selectedEmployee?.displayTitle ||
                        selectedEmployee?.publicDisplay?.title ||
                        ''
                      }
                      onChange={(e) =>
                        setSelectedEmployee({
                          ...selectedEmployee,
                          displayTitle: e.target.value,
                        })
                      }
                      sx={{ marginBottom: '20px' }}
                    />
                    <TextField
                      label={t('linkedin')}
                      fullWidth
                      value={
                        selectedEmployee?.displayLinkedin ||
                        selectedEmployee?.publicDisplay?.linkedin ||
                        ''
                      }
                      onChange={(e) =>
                        setSelectedEmployee({
                          ...selectedEmployee,
                          displayLinkedin: e.target.value,
                        })
                      }
                      sx={{ marginBottom: '20px' }}
                    />
                    <Select
                      label={t('access')}
                      fullWidth
                      value={selectedEmployee?.role}
                      onChange={(e, value) =>
                        setSelectedEmployee({
                          ...selectedEmployee,
                          role: value,
                        })
                      }
                      selections={[
                        { id: 'ADMIN', value: 'ADMIN', label: t('admin') },
                        {
                          id: 'EMPLOYEE',
                          value: 'EMPLOYEE',
                          label: t('employee'),
                        },
                        {
                          id: 'VIEWER',
                          value: 'VIEWER',
                          label: t('viewer'),
                        },
                      ]}
                    />
                    <Autocomplete
                      multiple
                      sx={{ marginTop: '20px' }}
                      key={selectedEmployee?.uid}
                      options={formatedGroups || []}
                      getOptionLabel={(option) => option?.label || ''}
                      value={selectedGroups}
                      onChange={(event, newValue) => {
                        setSelectedGroups(newValue);
                      }}
                      renderInput={(params) => (
                        <TextFieldMUI
                          {...params}
                          label={t('selectGroup')}
                          variant="outlined"
                          sx={{
                            'MuiFormControl-root': {
                              width: '100%',
                            },
                            '.MuiInputBase-input': {
                              height: '50px',
                              padding: '2px 10px 2px 10px',
                            },
                            '& .MuiFormLabel-root': {
                              backgroundColor: isDarkmode && 'rgb(51,51,51)',
                              padding: '2px 10px 2px 10px',
                              borderRadius: '10px',
                            },
                            '& .MuiOutlinedInput-root': {
                              borderRadius: '10px',
                              '&.Mui-focused fieldset': {
                                borderColor:
                                  businessPreference?.mainColor || '#000',
                                boxShadow: `0 0 0 0.2rem ${
                                  businessPreference?.mainColor + '20'
                                }`,
                              },
                            },
                          }}
                        />
                      )}
                      isOptionEqualToValue={(option, value) =>
                        option.id === value.id
                      }
                    />
                  </div>
                </Box>
              </>
            )}
          </Box>
        </Box>
      </Block>
    </MainLayoutV2>
  );
};

export default SettingsTeam;
