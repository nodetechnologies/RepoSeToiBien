import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useSearchParams } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import moment from 'moment';
import Autocomplete from '@mui/material/Autocomplete';

//components
import MainLayoutV2 from '../../layouts/MainLayoutV2';
import DrawerSide from '../../stories/layout-components/DrawerSide';
import Block from '../../stories/layout-components/Block';
import GeneralText from '../../stories/general-components/GeneralText';
import TextFieldMUI from '@mui/material/TextField';
import nodeAxiosFirebase from '../../utils/nodeAxiosFirebase';
import { Box, Divider, List, ListItem, ListItemText } from '@mui/material';
import Checkbox from '../../stories/general-components/Checkbox';
import Select from '../../stories/general-components/Select';
import TextField from '../../stories/general-components/TextField';
import Button from '../../stories/general-components/Button';
import { setGeneralStatus } from '../../redux/actions-v2/coreAction';

const Settings = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  const [tags, setTags] = useState([]);
  const [groupData, setGroupData] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [formData, setFormData] = useState(null);
  const [formula, setFormula] = useState('flash');
  const location = useLocation();

  const [searchParams] = useSearchParams();
  const activeIndex = parseInt(searchParams.get('tab')) || 0;
  const businessPreference = useSelector((state) => state.core.businessData);

  useEffect(() => {
    const formatedTags = businessPreference?.tags?.map((tag) => ({
      label: tag,
      value: tag,
      id: tag,
    }));
    setTags(formatedTags || []);
    setSelectedGroup(businessPreference?.groups?.[0] || null);
    setFormData(businessPreference?.preferences || {});
    setFormula(businessPreference?.formula || 'flash');
  }, [businessPreference?.id, businessPreference?.internalVersion]);

  const handleSaveTags = async () => {
    let listTags = [];
    try {
      if (tags?.length > 0) {
        listTags = tags.map((tag) => tag.value);
      }
      await nodeAxiosFirebase({
        t,
        method: 'PATCH',
        url: `business/general`,
        body: {
          tags: listTags,
        },
      });
    } catch (error) {
      console.error('Error saving tags');
      dispatch(setGeneralStatus({ status: 'error', error: error }));
    }
  };

  const handleSavePreferences = async () => {
    try {
      await nodeAxiosFirebase({
        t,
        method: 'PATCH',
        url: `business/general`,
        body: {
          businessData: {
            ...businessPreference,
            formula: formData?.formula || businessPreference?.formula,
            preferences: {
              fieldsView:
                formData?.fieldsView ??
                businessPreference?.preferences?.fieldsView,
              allowNodeAccess:
                formData?.allowNodeAccess ??
                businessPreference?.preferences?.allowNodeAccess ??
                false,
              backNav:
                formData?.backNav ??
                businessPreference?.preferences?.backNav ??
                true,
              teamMember:
                formData?.teamMember ??
                businessPreference?.preferences?.teamMember ??
                true,
              scan:
                formData?.scan ?? businessPreference?.preferences?.scan ?? true,
              inbox:
                formData?.inbox ??
                businessPreference?.preferences?.inbox ??
                true,
            },
          },
        },
      });
      handleSaveGroups();
      handleSaveTags();
      toast.success(t('saved'));
    } catch (error) {
      console.error('Error saving tags', error);
    }
  };

  const handleSaveGroups = async () => {
    try {
      await nodeAxiosFirebase({
        t,
        method: 'PATCH',
        url: `business/general`,
        body: {
          groupData: selectedGroup,
        },
      });
    } catch (error) {
      console.error('Error saving groups');
      dispatch(setGeneralStatus({ status: 'error', error: error }));
    }
  };

  useEffect(() => {
    const currentHistoryToAdd = {
      pathname: location.pathname,
      url: location.pathname + location.search,
      name: t('settings'),
      moduleName: t('settings'),
      structureId: '',
      businessId: businessPreference?.id,
      timeStamp: moment().format('HH:mm:ss'),
    };

    let existingHistory = JSON.parse(localStorage.getItem('history'));

    if (!Array.isArray(existingHistory)) {
      existingHistory = [];
    }

    // Remove any existing history with the same pathname
    existingHistory = existingHistory.filter(
      (history) => history.pathname !== location.pathname
    );

    const newHistory = [...existingHistory, currentHistoryToAdd];
    if (newHistory.length > 15) {
      newHistory.shift();
    }

    localStorage.setItem('history', JSON.stringify(newHistory));
  }, [location.pathname]);

  const handleCopyLinkEmployee = () => {
    const link = `https://usenode.com/welcome/${businessPreference?.id}`;
    navigator.clipboard.writeText(link);
    toast.success(t('copied'));
  };

  const handleCopyEntity = () => {
    const link = `${businessPreference?.id}`;
    navigator.clipboard.writeText(link);
    toast.success(t('copied'));
  };

  const handleAddTag = (event) => {
    if (event.key === 'Enter' && event.target.value) {
      const newTag = {
        label: event.target.value,
        value: event.target.value,
        id: event.target.value,
      };
      setTags([...tags, newTag]);
      event.target.value = '';
    }
  };

  const handleSaveField = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleSelectGroup = (group) => {
    setSelectedGroup(group);
  };

  const handleAddGroup = () => {
    handleSaveGroups();
    setIsOpen(false);
  };

  const handleCloseDrawer = () => {
    setIsOpen(false);
    setSelectedGroup(businessPreference?.groups?.[0]);
  };

  return (
    <MainLayoutV2
      pageTitle={t('settings')}
      actions={{
        save: () => {
          handleSavePreferences();
        },
        add: () => {
          setSelectedGroup({
            name: '',
            description: '',
            identifiant: '',
          });
          setIsOpen(true);
        },
      }}
      selectedTab={activeIndex}
    >
      <DrawerSide
        title={t('addGroup')}
        size="small"
        isDrawerOpen={isOpen}
        handleDrawerClose={handleCloseDrawer}
        noAction
      >
        <div>
          <TextField
            fullWidth
            label={t('name')}
            value={selectedGroup?.name}
            onChange={(e) =>
              setSelectedGroup({ ...selectedGroup, name: e.target.value })
            }
          />
          <TextField
            fullWidth
            label={t('description')}
            value={selectedGroup?.description}
            onChange={(e) =>
              setSelectedGroup({
                ...selectedGroup,
                description: e.target.value,
              })
            }
          />
          <TextField
            fullWidth
            label={t('identifiant')}
            value={selectedGroup?.identifiant}
            onChange={(e) =>
              setSelectedGroup({
                ...selectedGroup,
                identifiant: e.target.value?.toUpperCase()?.trim(),
              })
            }
          />
          <Button
            buttonSx={{ mt: 2 }}
            variant="contained"
            color="primary"
            label={t('add')}
            onClick={() => {
              handleAddGroup();
            }}
            fullWidth
          />
        </div>
      </DrawerSide>
      <Block height={1} heightPercentage={100} noBorder>
        <Box display="flex" p={2}>
          <Box width="30%">
            <GeneralText
              primary={true}
              size="bold"
              fontSize="12px"
              text={t('groups')}
              classNameComponent="mb-3"
            />
            <List>
              {businessPreference?.groups?.map((group) => (
                <ListItem
                  key={group?.identifiant}
                  button
                  dense
                  divider
                  sx={{
                    backgroundColor:
                      selectedGroup?.identifiant === group?.identifiant
                        ? '#F5F5F5'
                        : 'transparent',
                  }}
                  onClick={() => handleSelectGroup(group)}
                >
                  <ListItemText
                    primary={group?.name}
                    secondary={group?.description}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
          <Box width="70%">
            {!isOpen && (
              <div className="px-4">
                <TextField
                  fullWidth
                  label={t('name')}
                  value={selectedGroup?.name}
                  onChange={(e) =>
                    setSelectedGroup({
                      ...selectedGroup,
                      name: e.target.value,
                    })
                  }
                />
                <TextField
                  fullWidth
                  rows={2}
                  label={t('description')}
                  value={selectedGroup?.description}
                  onChange={(e) =>
                    setSelectedGroup({
                      ...selectedGroup,
                      description: e.target.value,
                    })
                  }
                />
                <GeneralText
                  primary={true}
                  size="regular"
                  fontSize="12px"
                  text={
                    t('identifiant') + ': ' + selectedGroup?.identifiant || ''
                  }
                  classNameComponent="mb-2 mt-4 grey-text"
                />
              </div>
            )}
          </Box>
        </Box>
        <Divider component="div" sx={{ mt: 3 }} />
        <Box display="flex" p={2}>
          <Box width="100%">
            <GeneralText
              primary={true}
              size="bold"
              fontSize="12px"
              text={t('tags')}
              classNameComponent="mb-3 mt-5"
            />
            <Autocomplete
              multiple
              sx={{ marginTop: '20px' }}
              key={'tags'}
              options={tags || []}
              getOptionLabel={(option) => option?.label || ''}
              value={tags}
              onChange={(event, newValue) => {
                setTags(newValue);
              }}
              renderInput={(params) => (
                <TextFieldMUI
                  {...params}
                  onKeyPress={handleAddTag}
                  label={t('manageTags')}
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
                      backgroundColor: isDarkMode && 'rgb(51,51,51)',
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
          </Box>
        </Box>

        <Divider component="div" sx={{ mt: 3 }} />
        <Box display="flex" p={2}>
          <Box width="100%">
            <GeneralText
              primary={true}
              size="bold"
              fontSize="12px"
              text={t('preferences')}
              classNameComponent="mb-3 mt-5"
            />
            <div className="row">
              <div className="col-4 mt-1">
                <Checkbox
                  fieldType={'boolean'}
                  staticField={false}
                  defaultValue={false}
                  required={false}
                  label={t('allowNodeAccess')}
                  value={formData?.allowNodeAccess}
                  fullWidth
                  onBlur={(event, value) =>
                    handleSaveField('allowNodeAccess', event.target.checked)
                  }
                  onChange={(event, value) =>
                    handleSaveField('allowNodeAccess', event.target.checked)
                  }
                />
              </div>
              <div className="col-4 mt-1">
                <Checkbox
                  fieldType={'boolean'}
                  staticField={false}
                  defaultValue={false}
                  required={false}
                  label={t('backNav')}
                  value={formData?.backNav}
                  fullWidth
                  onBlur={(event, value) =>
                    handleSaveField('backNav', event.target.checked)
                  }
                  onChange={(event, value) =>
                    handleSaveField('backNav', event.target.checked)
                  }
                />
              </div>
              <div className="col-4">
                <Select
                  select
                  staticView
                  noEmpty
                  key={'fieldsView'}
                  label={t('fieldsView')}
                  value={formData?.fieldsView || 'normal'}
                  selections={[
                    {
                      value: 'normal',
                      id: 'normal',
                      label: t('normal'),
                    },
                    {
                      value: 'reverse',
                      id: 'reverse',
                      label: t('reverse'),
                    },
                  ]}
                  onChange={(e, value) => handleSaveField('fieldsView', value)}
                  fullWidth
                />
              </div>
              <div className="col-4 mt-1">
                <Checkbox
                  fieldType={'boolean'}
                  staticField={false}
                  defaultValue={false}
                  required={false}
                  label={t('teamMemberBtn')}
                  value={formData?.teamMember}
                  fullWidth
                  onBlur={(event, value) =>
                    handleSaveField('teamMember', event.target.checked)
                  }
                  onChange={(event, value) =>
                    handleSaveField('teamMember', event.target.checked)
                  }
                />
              </div>
              <div className="col-4 mt-1">
                <Checkbox
                  fieldType={'boolean'}
                  staticField={false}
                  defaultValue={false}
                  required={false}
                  label={t('scanBtn')}
                  value={formData?.scan}
                  fullWidth
                  onBlur={(event, value) =>
                    handleSaveField('scan', event.target.checked)
                  }
                  onChange={(event, value) =>
                    handleSaveField('scan', event.target.checked)
                  }
                />
              </div>
              <div className="col-4 mt-1">
                <Checkbox
                  fieldType={'boolean'}
                  staticField={false}
                  defaultValue={false}
                  required={false}
                  label={t('inbox')}
                  value={formData?.inbox}
                  fullWidth
                  onBlur={(event, value) =>
                    handleSaveField('inbox', event.target.checked)
                  }
                  onChange={(event, value) =>
                    handleSaveField('inbox', event.target.checked)
                  }
                />
              </div>
            </div>
          </Box>
        </Box>
        <Divider component="div" sx={{ mt: 3 }} />
        <Box display="flex" p={2} mt={3}>
          <Box width="30%">
            <GeneralText
              primary={true}
              size="bold"
              fontSize="12px"
              text={t('links')}
              classNameComponent="mb-3 mt-5"
            />
          </Box>
          <Box width="35%">
            <div className="mt-2">
              <GeneralText
                primary={true}
                size="bold"
                fontSize="13px"
                text={t('entityIdCopy')}
                onClick={() => {
                  handleCopyEntity();
                }}
              />
            </div>
            <GeneralText
              primary={true}
              size="regular"
              fontSize="12px"
              text={t('entityIdCopyMsg')}
            />
          </Box>
          <Box width="35%">
            <div className="mt-2">
              <GeneralText
                primary={true}
                size="bold"
                fontSize="13px"
                text={t('dynamicEmployeeLink')}
                onClick={() => {
                  handleCopyLinkEmployee();
                }}
              />
            </div>
            <GeneralText
              primary={true}
              size="regular"
              fontSize="12px"
              text={t('dynamicEmployeeLinkMsg')}
            />
          </Box>
        </Box>
      </Block>
    </MainLayoutV2>
  );
};

export default Settings;
