import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useSearchParams } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import MainLayoutV2 from '../../layouts/MainLayoutV2';
import Block from '../../stories/layout-components/Block';
import {
  Tabs,
  Tab,
  Box,
  Typography,
  IconButton,
  Tooltip,
  Badge,
} from '@mui/material';
import TextField from '../../stories/general-components/TextField';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FieldEditor from '../../components/@generalComponents/FieldEditor';
import * as Icons from '@mui/icons-material';
import Select from '../../stories/general-components/Select';
import IconSelector from '../../components/@generalComponents/IconSelector';
import nodeAxiosFirebase from '../../utils/nodeAxiosFirebase';
import Checkbox from '../../stories/general-components/Checkbox';
import GeneralText from '../../stories/general-components/GeneralText';
import TextFieldMui from '@mui/material/TextField';
import Button from '../../stories/general-components/Button';
import { setGeneralStatus } from '../../redux/actions-v2/coreAction';
import Marketplace from '../specific/Marketplace';

const SettingsCollections = () => {
  const { t, i18n } = useTranslation();
  const currentLangCode = i18n.language || 'en';
  const dispatch = useDispatch();
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const [icon, setIcon] = useState('');
  const [generalChanges, setGeneralChanges] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [statusFields, setStatusFields] = useState([]);
  const [reloadIntegration, setReloadIntegration] = useState(false);

  const businessPreference = useSelector((state) => state.core.businessData);
  const businessStructure = useSelector(
    (state) => state.core.businessStructure
  );

  const businessStructures = businessStructure?.structures;

  const [isOpenIcon, setIsOpenIcon] = useState(false);
  const [searchParams] = useSearchParams();
  const activeIndex = parseInt(searchParams.get('tab')) || 0;
  const [value, setValue] = useState(() => {
    const searchParams = new URLSearchParams(window.location.search);
    return parseInt(searchParams.get('value')) || businessStructures?.[0]?.id;
  });

  const [selectedPreference, setSelectedPreference] = useState(null);
  const [fields, setFields] = useState([]);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const tab = parseInt(searchParams.get('value'));
    if (tab && tab !== value) {
      setValue(tab);
    }
  }, []);

  const updateTabIndexInURL = (index) => {
    searchParams.set('value', index);
    window.history.replaceState({}, '', `?${searchParams}`);
  };

  useEffect(() => {
    updateTabIndexInURL(value);
  }, [value]);

  const handleChange = (event, id) => {
    setValue(id);
  };

  const handleCopyLink = (type) => {
    const url = `https://usenode.com/structure-public?structureId=${selectedPreference?.id}&businessId=${businessPreference?.id}&lang=${currentLangCode}&name=${selectedPreference?.name}`;
    const script = ` <script src="https://usenode.com/embedStructure.js" async></script>
    <script>
        const script = document.createElement('script');
        script.setAttribute('businessId', ${businessPreference?.id});
        script.setAttribute('structureId', ${selectedPreference?.id});
        script.setAttribute('width', '100%');
        script.setAttribute('height', '100%');
        script.setAttribute('typeForm', ${selectedPreference?.viewForm});
        document.body.appendChild(script);
    </script>`;

    const iframe = `
    <iframe src="https://usenode.com/structure-public?structureId=${selectedPreference?.id}&businessId=${businessPreference?.id}&lang=${currentLangCode}&name=${selectedPreference?.name}" width="100%" height="100%" frameborder="0" allowfullscreen></iframe>`;
    navigator.clipboard
      .writeText(type === 'url' ? url : type === 'script' ? script : iframe)
      .then(
        () => {
          toast.success(t('copied'));
        },
        () => {
          toast.error(t('failed'));
        }
      );
  };

  const handleCloseEmpty = () => {
    setIsOpenIcon(false);
  };

  const handleCloseIcon = (iconName) => {
    setIsOpenIcon(false);
    setGeneralChanges(true);
    setIcon(iconName);
    handleUpdateIcon(iconName);
  };

  const IconStructure = Icons[selectedPreference?.icon || 'HelpOutline'];

  const handleUpdateIcon = async (iconName) => {
    const updatedPreference = { ...selectedPreference, icon: iconName || icon };
    setSelectedPreference(updatedPreference);
  };

  const tabsSettings = (businessStructures || [])
    ?.map((structure, index) => ({
      id: index + 1,
      label: structure?.name,
      section: structure?.collectionField,
      name: structure?.name,
      module: structure?.id,
      structureId: structure?.id,
      icon: structure?.icon,
    }))
    ?.filter((tab) => tab !== undefined);

  useEffect(() => {
    if (value) {
      setReloadIntegration(false);
      const detailedStruc = businessStructures?.find(
        (structure) => structure?.id === value
      );

      if (detailedStruc) {
        setFields(detailedStruc?.fields);
        setSelectedPreference({
          ...detailedStruc,
          isPublic: detailedStruc?.element?.isPublic,
          matchedAttributes: detailedStruc?.crossPreferences?.matchedAttributes,
          matchedCollection: detailedStruc?.crossPreferences?.matchedCollection,
          matchedValue: detailedStruc?.crossPreferences?.matchedValue,
          print: detailedStruc?.element?.preferences?.print,
          email: detailedStruc?.element?.preferences?.email,
          edit: detailedStruc?.element?.preferences?.edit,
          delete: detailedStruc?.element?.preferences?.delete,
          creation: detailedStruc?.element?.preferences?.creation,
          favorite: detailedStruc?.element?.preferences?.favorite,
          tags: detailedStruc?.element?.preferences?.tags,
          approvalMethod: detailedStruc?.element?.preferences?.approvalMethod,
          convert: detailedStruc?.element?.preferences?.convert,
          reference: detailedStruc?.element?.preferences?.reference,
          referenceField: detailedStruc?.element?.preferences?.referenceField,
          flowOnApprove: detailedStruc?.element?.preferences?.flowOnApprove,
          approvalTerm: detailedStruc?.element?.preferences?.approvalTerm,
          statusDone: detailedStruc?.element?.preferences?.statusDone,
          statusPending: detailedStruc?.element?.preferences?.statusPending,
          flow: detailedStruc?.element?.preferences?.flow,
          share: detailedStruc?.element?.preferences?.share,
          billField: detailedStruc?.element?.preferences?.billField,
          shipField: detailedStruc?.element?.preferences?.shipField,
          trackActivity: detailedStruc?.element?.publicPage?.trackActivity,
          accessCodeRequired:
            detailedStruc?.element?.publicPage?.accessCodeRequired,
          view: detailedStruc?.element?.publicPage?.view || 'default',
          viewForm: detailedStruc?.element?.publicForm?.view || 'default',
          layout: detailedStruc?.element?.publicForm?.layout,
          displayLogo: detailedStruc?.element?.publicForm?.displayLogo ?? true,
          bgImage: detailedStruc?.element?.publicForm?.bgImage,
          btnStart:
            detailedStruc?.element?.publicForm?.['btnStart_' + currentLangCode],
          intro:
            detailedStruc?.element?.publicForm?.['intro_' + currentLangCode],
          bottomText:
            detailedStruc?.element?.publicPage?.[
              'bottomText_' + currentLangCode
            ],
          nps: detailedStruc?.element?.preferences?.nps,
          npsField: detailedStruc?.element?.preferences?.npsField,
          npsDays: detailedStruc?.element?.preferences?.npsDays,
          npsEmail:
            detailedStruc?.element?.preferences?.[
              'npsEmail_' + currentLangCode
            ],
          npsTemplate:
            detailedStruc?.element?.preferences?.[
              'npsTemplate_' + currentLangCode
            ],
          npsCommentMsg:
            detailedStruc?.element?.preferences?.[
              'npsCommentMsg_' + currentLangCode
            ],
        });

        //find the field with value 'status'
        const statusField = detailedStruc?.fields?.find(
          (field) => field?.value === 'status'
        );

        if (statusField) {
          setStatusFields(statusField?.selections || []);
        }
      }
      setTimeout(() => {
        setReloadIntegration(true);
      }, 2000);
    }
  }, [value, businessStructure]);

  const CustomTabLabel = ({ text, subtext, icon }) => (
    <div
      style={{ textAlign: 'left', width: '100%' }}
      className="d-flex middle-content"
    >
      <div className="mx-2">{icon}</div>
      <div>
        <div style={{ textAlign: 'left', fontSize: '13px' }}>{text}</div>
        <div style={{ textAlign: 'left', fontSize: '8px', fontWeight: '300' }}>
          {subtext}
        </div>
      </div>
    </div>
  );

  const saveStructure = async () => {
    try {
      setIsLoading(true);
      await nodeAxiosFirebase({
        t,
        method: 'POST',
        url: `business/structure`,
        showLoading: true,
        body: {
          type: 'fields',
          lang: currentLangCode,
          structureId: selectedPreference?.id,
          data: {
            fieldsData: fields,
          },
        },
      });

      if (generalChanges) {
        await nodeAxiosFirebase({
          t,
          method: 'POST',
          url: `business/structure`,
          body: {
            type: 'general',
            lang: currentLangCode,
            structureId: selectedPreference?.id,
            data: {
              name: selectedPreference?.name,
              icon: selectedPreference?.icon,
              attribute1: selectedPreference?.attribute1,
              attribute2: selectedPreference?.attribute2,
              attribute3: selectedPreference?.attribute3,
              attribute4: selectedPreference?.attribute4,
              isPublic: selectedPreference?.isPublic,
              print: selectedPreference?.print,
              email: selectedPreference?.email,
              edit: selectedPreference?.edit,
              delete: selectedPreference?.delete,
              creation: selectedPreference?.creation,
              favorite: selectedPreference?.favorite,
              tags: selectedPreference?.tags,
              convert: selectedPreference?.convert,
              reference: selectedPreference?.reference,
              referenceField: selectedPreference?.referenceField,
              flowOnApprove: selectedPreference?.flowOnApprove,
              approvalTerm: selectedPreference?.approvalTerm,
              statusDone: selectedPreference?.statusDone,
              statusPending: selectedPreference?.statusPending,
              flow: selectedPreference?.flow,
              share: selectedPreference?.share,
              trackActivity: selectedPreference?.trackActivity,
              accessCodeRequired: selectedPreference?.accessCodeRequired,
              view: selectedPreference?.view,
              displayLogo: selectedPreference?.displayLogo ?? true,
              viewForm: selectedPreference?.viewForm || 'default',
              layout: selectedPreference?.layout || 'fw',
              bgImage: selectedPreference?.bgImage,
              approvalMethod: selectedPreference?.approvalMethod,
              btnStart: selectedPreference?.btnStart,
              intro: selectedPreference?.intro,
              bottomText: selectedPreference?.bottomText,
              nps: selectedPreference?.nps,
              npsField: selectedPreference?.npsField,
              npsDays: selectedPreference?.npsDays,
              npsEmail: selectedPreference?.npsEmail,
              npsCommentMsg: selectedPreference?.npsCommentMsg,
              npsTemplate: selectedPreference?.npsTemplate,
              matchedAttributes: selectedPreference?.matchedAttributes,
              matchedCollection: selectedPreference?.matchedCollection,
              matchedValue: selectedPreference?.matchedValue,
            },
          },
        });
      }
      setGeneralChanges(false);
      setIsLoading(false);
    } catch (error) {
      console.error('Error updating structure');
      dispatch(setGeneralStatus({ status: 'error', error: error }));
    }
  };

  const handleSaveField = (field, value) => {
    setGeneralChanges(true);
    setSelectedPreference((currentPreference) => ({
      ...currentPreference,
      [field]: value,
    }));
  };

  return (
    <MainLayoutV2
      pageTitle={t('structures')}
      actions={{
        save: saveStructure,
      }}
      selectedTab={activeIndex}
    >
      {isOpenIcon && (
        <IconSelector
          handleCloseIcon={handleCloseIcon}
          isOpen={isOpenIcon}
          handleClose={handleCloseEmpty}
        />
      )}

      <Block
        height={1}
        heightPercentage={100}
        noScroll
        noShadow
        noBorder
        isLoading={isLoading}
      >
        <Box sx={{ flexGrow: 1, display: 'flex' }}>
          <>
            <Tabs
              orientation="vertical"
              value={value || tabsSettings?.[0]?.structureId}
              variant="scrollable"
              onChange={handleChange}
              sx={{
                borderRight: 1,
                marginLeft: '-10px',
                borderColor: 'divider',
                minWidth: '300px',
                height: '77vh',
              }}
            >
              {tabsSettings?.map((struc, index) => {
                const IconComponent = Icons[struc?.icon] || Icons.HelpOutline;
                return (
                  <Tab
                    label={
                      <CustomTabLabel
                        text={struc?.name || ''}
                        subtext={t(struc?.section?.toLowerCase())}
                        icon={
                          <IconComponent
                            fontSize="medium"
                            htmlColor={isDarkMode ? '#FFF' : '#000'}
                            sx={{ paddingRight: '3px' }}
                          />
                        }
                      />
                    }
                    id={struc?.structureId}
                    value={struc?.structureId}
                    key={struc?.structureId}
                    sx={{
                      justifyContent: 'flex-start',
                      pl: 4,
                    }}
                  />
                );
              })}
            </Tabs>
            <Box sx={{ flexGrow: 1, p: 1 }}>
              <Block
                height={1}
                heightPercentage={100}
                noShadow
                noBorder
                empty={!selectedPreference}
                emptyType={'select'}
              >
                {selectedPreference && (
                  <div className="mb-4">
                    <Typography
                      variant="h6"
                      fontSize="15px"
                      sx={{ fontWeight: 600 }}
                    >
                      {selectedPreference?.name || ''}
                    </Typography>
                    <Typography
                      variant="body2"
                      fontSize="12px"
                      sx={{ fontWeight: 400 }}
                    >
                      {t('type') +
                        ': ' +
                        t(selectedPreference?.collectionField)}
                    </Typography>
                  </div>
                )}

                {selectedPreference && (
                  <>
                    <Accordion elevation={0}>
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel0a-content"
                        id="panel0a-header"
                      >
                        <div className="row justify-content-between">
                          <div className="col-11">
                            <Typography fontSize="14px" fontWeight={500}>
                              {t('attributes')}
                            </Typography>
                          </div>
                          <div className="col-1"></div>
                        </div>
                      </AccordionSummary>
                      <AccordionDetails>
                        {selectedPreference && (
                          <div className="row middle-content">
                            <div className="col-3">
                              <Select
                                label={t('attribute1')}
                                staticView
                                key={selectedPreference?.id + 'attribute1'}
                                selections={fields?.map((field) => {
                                  return {
                                    value: field?.value,
                                    id: field?.value,
                                    label: field?.name,
                                  };
                                })}
                                value={selectedPreference?.attribute1}
                                onChange={(e, value) =>
                                  handleSaveField('attribute1', value)
                                }
                                fullWidth
                              />
                            </div>
                            <div className="col-3">
                              <Select
                                select
                                staticView
                                key={selectedPreference?.id + 'attribute2'}
                                label={t('attribute2')}
                                value={selectedPreference?.attribute2}
                                selections={selectedPreference?.fields?.map(
                                  (field) => {
                                    return {
                                      value: field?.value,
                                      id: field?.value,
                                      label: field?.name,
                                    };
                                  }
                                )}
                                onChange={(e, value) =>
                                  handleSaveField('attribute2', value)
                                }
                                fullWidth
                              />
                            </div>
                            <div className="col-3">
                              <Select
                                select
                                staticView
                                key={selectedPreference?.id + 'attribute3'}
                                label={t('attribute3')}
                                value={selectedPreference?.attribute3}
                                selections={selectedPreference?.fields?.map(
                                  (field) => {
                                    return {
                                      value: field?.value,
                                      id: field?.value,
                                      label: field?.name,
                                    };
                                  }
                                )}
                                onChange={(e, value) =>
                                  handleSaveField('attribute3', value)
                                }
                                fullWidth
                              />
                            </div>
                            <div className="col-3">
                              <Select
                                select
                                staticView
                                key={selectedPreference?.id + 'attribute4'}
                                label={t('attribute4')}
                                value={selectedPreference?.attribute4}
                                selections={selectedPreference?.fields?.map(
                                  (field) => {
                                    return {
                                      value: field?.value,
                                      id: field?.value,
                                      label: field?.name,
                                    };
                                  }
                                )}
                                onChange={(e, value) =>
                                  handleSaveField('attribute4', value)
                                }
                                fullWidth
                              />
                            </div>
                          </div>
                        )}
                      </AccordionDetails>
                    </Accordion>

                    <Accordion elevation={0}>
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                      >
                        <Typography fontSize="14px" fontWeight={500}>
                          {' '}
                          {t('settings')}
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <div className="row">
                          <div className="col-5">
                            <TextField
                              label={t('name')}
                              value={selectedPreference?.name || ''}
                              onChange={(e) =>
                                handleSaveField('name', e.target.value)
                              }
                              fullWidth
                              key={selectedPreference?.id + 'name'}
                              margin="dense"
                            />
                          </div>
                          <div className="col-4" style={{ marginTop: '7px' }}>
                            <Checkbox
                              fieldType={'boolean'}
                              staticField={false}
                              defaultValue={false}
                              required={false}
                              label={t('isPublic')}
                              value={selectedPreference?.isPublic || false}
                              fullWidth
                              onBlur={(event, value) =>
                                handleSaveField(
                                  'isPublic',
                                  event.target.checked
                                )
                              }
                              onChange={(event, value) =>
                                handleSaveField(
                                  'isPublic',
                                  event.target.checked
                                )
                              }
                            />
                          </div>
                          <div className="col-1 mt-4">
                            <Tooltip title={t('updateIcon')}>
                              <IconButton
                                onClick={() => setIsOpenIcon(true)}
                                size="large"
                              >
                                <IconStructure />
                              </IconButton>
                            </Tooltip>
                          </div>
                          <div className="col-6"></div>
                          <div className="col-12">
                            <GeneralText
                              text={t('actions')}
                              primary={true}
                              fontSize="12px"
                              classNameComponent="mt-3 px-2"
                              size="medium"
                            />
                          </div>
                          {(selectedPreference?.collectionField ===
                            'cardsuninvoiced' ||
                            selectedPreference?.collectionField ===
                              'cardsinvoiced' ||
                            selectedPreference?.collectionField ===
                              'contacts') && (
                            <div className="col-2">
                              <Checkbox
                                fieldType={'boolean'}
                                staticField={false}
                                defaultValue={false}
                                required={false}
                                label={t('print')}
                                value={selectedPreference?.print || false}
                                fullWidth
                                onBlur={(event, value) =>
                                  handleSaveField('print', event.target.checked)
                                }
                                onChange={(event, value) =>
                                  handleSaveField('print', event.target.checked)
                                }
                              />
                            </div>
                          )}
                          {(selectedPreference?.collectionField ===
                            'cardsuninvoiced' ||
                            selectedPreference?.collectionField ===
                              'cardsinvoiced' ||
                            selectedPreference?.collectionField === 'grids' ||
                            selectedPreference?.collectionField ===
                              'contacts') && (
                            <div className="col-2">
                              <Checkbox
                                fieldType={'boolean'}
                                staticField={false}
                                defaultValue={false}
                                required={false}
                                label={t('email')}
                                value={selectedPreference?.email || false}
                                fullWidth
                                onBlur={(event, value) =>
                                  handleSaveField('email', event.target.checked)
                                }
                                onChange={(event, value) =>
                                  handleSaveField('email', event.target.checked)
                                }
                              />
                            </div>
                          )}
                          {(selectedPreference?.collectionField !== 'items' ||
                            selectedPreference?.collectionField !==
                              'payments') && (
                            <div className="col-2">
                              <Checkbox
                                fieldType={'boolean'}
                                staticField={false}
                                defaultValue={false}
                                required={false}
                                label={t('create')}
                                value={selectedPreference?.creation || false}
                                fullWidth
                                onBlur={(event, value) =>
                                  handleSaveField(
                                    'creation',
                                    event.target.checked
                                  )
                                }
                                onChange={(event, value) =>
                                  handleSaveField(
                                    'creation',
                                    event.target.checked
                                  )
                                }
                              />
                            </div>
                          )}
                          <div className="col-2">
                            <Checkbox
                              fieldType={'boolean'}
                              staticField={false}
                              defaultValue={false}
                              required={false}
                              label={t('edit')}
                              value={selectedPreference?.edit || false}
                              fullWidth
                              onBlur={(event, value) =>
                                handleSaveField('edit', event.target.checked)
                              }
                              onChange={(event, value) =>
                                handleSaveField('edit', event.target.checked)
                              }
                            />
                          </div>
                          {selectedPreference?.collectionField !==
                            'payments' && (
                            <div className="col-2">
                              <Checkbox
                                fieldType={'boolean'}
                                staticField={false}
                                defaultValue={false}
                                required={false}
                                label={t('delete')}
                                value={selectedPreference?.delete || false}
                                fullWidth
                                onBlur={(event, value) =>
                                  handleSaveField(
                                    'delete',
                                    event.target.checked
                                  )
                                }
                                onChange={(event, value) =>
                                  handleSaveField(
                                    'delete',
                                    event.target.checked
                                  )
                                }
                              />
                            </div>
                          )}
                          {(selectedPreference?.collectionField !== 'items' ||
                            selectedPreference?.collectionField !==
                              'payments') && (
                            <div className="col-2">
                              <Checkbox
                                fieldType={'boolean'}
                                staticField={false}
                                defaultValue={false}
                                required={false}
                                label={t('favorite')}
                                value={selectedPreference?.favorite || false}
                                fullWidth
                                onBlur={(event, value) =>
                                  handleSaveField(
                                    'favorite',
                                    event.target.checked
                                  )
                                }
                                onChange={(event, value) =>
                                  handleSaveField(
                                    'favorite',
                                    event.target.checked
                                  )
                                }
                              />
                            </div>
                          )}
                          <div className="col-2">
                            <Checkbox
                              fieldType={'boolean'}
                              staticField={false}
                              defaultValue={false}
                              required={false}
                              label={t('tags')}
                              value={selectedPreference?.tags || false}
                              fullWidth
                              onBlur={(event, value) =>
                                handleSaveField('tags', event.target.checked)
                              }
                              onChange={(event, value) =>
                                handleSaveField('tags', event.target.checked)
                              }
                            />
                          </div>
                          {(selectedPreference?.collectionField !== 'items' ||
                            selectedPreference?.collectionField !==
                              'payments' ||
                            selectedPreference?.collectionField !==
                              'contacts' ||
                            selectedPreference?.collectionField !==
                              'profiles') && (
                            <div className="col-2">
                              <Checkbox
                                fieldType={'boolean'}
                                staticField={false}
                                defaultValue={false}
                                required={false}
                                label={t('convert')}
                                value={selectedPreference?.convert || false}
                                fullWidth
                                onBlur={(event, value) =>
                                  handleSaveField(
                                    'convert',
                                    event.target.checked
                                  )
                                }
                                onChange={(event, value) =>
                                  handleSaveField(
                                    'convert',
                                    event.target.checked
                                  )
                                }
                              />
                            </div>
                          )}
                          <div className="col-2">
                            <Checkbox
                              fieldType={'boolean'}
                              staticField={false}
                              defaultValue={false}
                              required={false}
                              label={t('reference')}
                              value={selectedPreference?.reference || false}
                              fullWidth
                              onBlur={(event, value) =>
                                handleSaveField(
                                  'reference',
                                  event.target.checked
                                )
                              }
                              onChange={(event, value) =>
                                handleSaveField(
                                  'reference',
                                  event.target.checked
                                )
                              }
                            />
                          </div>
                          {(selectedPreference?.collectionField ===
                            'cardsuninvoiced' ||
                            selectedPreference?.collectionField ===
                              'cardsinvoiced') && (
                            <div className="col-2">
                              <Checkbox
                                fieldType={'boolean'}
                                staticField={false}
                                defaultValue={false}
                                required={false}
                                label={t('share')}
                                value={selectedPreference?.share || false}
                                fullWidth
                                onBlur={(event, value) =>
                                  handleSaveField('share', event.target.checked)
                                }
                                onChange={(event, value) =>
                                  handleSaveField('share', event.target.checked)
                                }
                              />
                            </div>
                          )}
                          {(selectedPreference?.collectionField ===
                            'cardsuninvoiced' ||
                            selectedPreference?.collectionField ===
                              'cardsinvoiced') && (
                            <div className="col-2">
                              <Checkbox
                                fieldType={'boolean'}
                                staticField={false}
                                defaultValue={false}
                                required={false}
                                label={t('npsActivated')}
                                value={selectedPreference?.nps || false}
                                fullWidth
                                onBlur={(event, value) =>
                                  handleSaveField('nps', event.target.checked)
                                }
                                onChange={(event, value) =>
                                  handleSaveField('nps', event.target.checked)
                                }
                              />
                            </div>
                          )}
                          <div className="col-4"></div>
                          <div className="col-12">
                            <GeneralText
                              text={t('parameters')}
                              primary={true}
                              fontSize="12px"
                              classNameComponent="mt-3 px-2"
                              size="medium"
                            />
                          </div>
                          {(selectedPreference?.collectionField ===
                            'cardsuninvoiced' ||
                            selectedPreference?.collectionField ===
                              'cardsinvoiced') && (
                            <div className="col-4">
                              <TextField
                                label={t('approvalTerm')}
                                value={selectedPreference?.approvalTerm || ''}
                                onChange={(e) =>
                                  handleSaveField(
                                    'approvalTerm',
                                    e.target.value
                                  )
                                }
                                fullWidth
                                key={selectedPreference?.id + 'approvalTerm'}
                                variant="outlined"
                              />
                            </div>
                          )}
                          {(selectedPreference?.collectionField !== 'items' ||
                            selectedPreference?.collectionField !==
                              'payments' ||
                            selectedPreference?.collectionField !==
                              'contacts' ||
                            selectedPreference?.collectionField !==
                              'services' ||
                            selectedPreference?.collectionField !==
                              'articles') && (
                            <div className="col-3">
                              <Select
                                select
                                staticView
                                noEmpty
                                key={selectedPreference?.id + 'statusDone'}
                                label={t('statusDone')}
                                value={selectedPreference?.statusDone}
                                selections={statusFields?.map((field) => {
                                  return {
                                    value: field?.value,
                                    id: field?.value,
                                    label: field?.label,
                                  };
                                })}
                                onChange={(e, value) =>
                                  handleSaveField('statusDone', value)
                                }
                                fullWidth
                              />
                            </div>
                          )}
                          {(selectedPreference?.collectionField !== 'items' ||
                            selectedPreference?.collectionField !==
                              'payments' ||
                            selectedPreference?.collectionField !==
                              'contacts' ||
                            selectedPreference?.collectionField !==
                              'services' ||
                            selectedPreference?.collectionField !==
                              'articles') && (
                            <div className="col-3">
                              <Select
                                select
                                staticView
                                key={selectedPreference?.id + 'statusPending'}
                                label={t('statusPending')}
                                value={selectedPreference?.statusPending}
                                selections={statusFields?.map((field) => {
                                  return {
                                    value: field?.value,
                                    id: field?.value,
                                    label: field?.label,
                                  };
                                })}
                                onChange={(e, value) =>
                                  handleSaveField('statusPending', value)
                                }
                                fullWidth
                              />
                            </div>
                          )}
                          {(selectedPreference?.collectionField ===
                            'cardsuninvoiced' ||
                            selectedPreference?.collectionField ===
                              'cardsinvoiced') && (
                            <div className="col-2">
                              <Select
                                select
                                staticView
                                key={selectedPreference?.id + 'approvalMethod'}
                                label={t('approvalMethod')}
                                value={selectedPreference?.approvalMethod}
                                selections={[
                                  {
                                    value: 'all',
                                    id: 'all',
                                    label: t('allTog'),
                                  },
                                  {
                                    value: 'selection',
                                    id: 'selection',
                                    label: t('selection'),
                                  },
                                ]}
                                onChange={(e, value) =>
                                  handleSaveField('approvalMethod', value)
                                }
                                fullWidth
                              />
                            </div>
                          )}
                          {(selectedPreference?.collectionField ===
                            'cardsinvoiced' ||
                            selectedPreference?.collectionField ===
                              'cardsuninvoiced' ||
                            selectedPreference?.collectionField ===
                              'cardsexpense') &&
                            fields?.filter((field) => field?.typeData === 'geo')
                              ?.length > 0 && (
                              <div className="col-3">
                                <Select
                                  select
                                  staticView
                                  noEmpty
                                  key={selectedPreference?.id + 'billField'}
                                  label={t('billField')}
                                  value={selectedPreference?.billField}
                                  selections={fields
                                    ?.filter(
                                      (field) => field?.typeData === 'geo'
                                    )
                                    ?.map((field) => {
                                      return {
                                        value: field?.value,
                                        id: field?.value,
                                        label: field?.name,
                                      };
                                    })}
                                  onChange={(e, value) =>
                                    handleSaveField('billField', value)
                                  }
                                  fullWidth
                                />
                              </div>
                            )}
                          {(selectedPreference?.collectionField ===
                            'cardsinvoiced' ||
                            selectedPreference?.collectionField ===
                              'cardsuninvoiced' ||
                            selectedPreference?.collectionField ===
                              'cardsexpense') &&
                            fields?.filter((field) => field?.typeData === 'geo')
                              ?.length > 0 && (
                              <div className="col-3">
                                <Select
                                  select
                                  staticView
                                  noEmpty
                                  key={selectedPreference?.id + 'shipField'}
                                  label={t('shipField')}
                                  value={selectedPreference?.shipField}
                                  selections={fields
                                    ?.filter(
                                      (field) => field?.typeData === 'geo'
                                    )
                                    ?.map((field) => {
                                      return {
                                        value: field?.value,
                                        id: field?.value,
                                        label: field?.name,
                                      };
                                    })}
                                  onChange={(e, value) =>
                                    handleSaveField('shipField', value)
                                  }
                                  fullWidth
                                />
                              </div>
                            )}
                          {(selectedPreference?.collectionField ===
                            'cardsinvoiced' ||
                            selectedPreference?.collectionField ===
                              'cardsuninvoiced' ||
                            selectedPreference?.collectionField ===
                              'cardsexpense') && (
                            <div className="col-2">
                              <Select
                                select
                                staticView
                                noEmpty
                                key={
                                  selectedPreference?.id + 'matchedAttributes'
                                }
                                label={t('matchedAttributes')}
                                value={selectedPreference?.matchedAttributes}
                                selections={[
                                  {
                                    value: [1, 2, 3, 4],
                                    id: 'all4',
                                    label: t('1234'),
                                  },
                                  {
                                    value: [1, 2, 3],
                                    id: 'all3',
                                    label: t('123'),
                                  },
                                  {
                                    value: [1, 2],
                                    id: 'all2',
                                    label: t('12'),
                                  },
                                  {
                                    value: [1],
                                    id: 'all1',
                                    label: t('1'),
                                  },
                                ]}
                                onChange={(e, value) =>
                                  handleSaveField('matchedAttributes', value)
                                }
                                fullWidth
                              />
                            </div>
                          )}
                          {(selectedPreference?.collectionField ===
                            'cardsinvoiced' ||
                            selectedPreference?.collectionField ===
                              'cardsuninvoiced' ||
                            selectedPreference?.collectionField ===
                              'cardsexpense') && (
                            <div className="col-4">
                              <Select
                                select
                                staticView
                                noEmpty
                                key={selectedPreference?.id + 'matchedValue'}
                                label={t('matchedValue')}
                                value={selectedPreference?.matchedValue}
                                selections={[
                                  {
                                    value: 'targetProfileDetails',
                                    id: 'targetProfileDetails',
                                    label: t('targetProfileDetails'),
                                  },
                                  {
                                    value: 'targetDetails',
                                    id: 'targetDetails',
                                    label: t('targetDetails'),
                                  },
                                ]}
                                onChange={(e, value) =>
                                  handleSaveField('matchedValue', value)
                                }
                                fullWidth
                              />
                            </div>
                          )}
                        </div>
                      </AccordionDetails>
                    </Accordion>
                    <Accordion elevation={0}>
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel2a-content"
                        id="panel2a-header"
                      >
                        <Typography
                          fontSize="14px"
                          fontWeight={500}
                          sx={{ marginRight: '30px' }}
                        >
                          {' '}
                          {t('fields')}
                        </Typography>
                        <Badge
                          sx={{ marginTop: '10px' }}
                          badgeContent={fields?.length}
                          color="secondary"
                        />
                      </AccordionSummary>
                      <AccordionDetails>
                        <FieldEditor fields={fields} setFields={setFields} />
                      </AccordionDetails>
                    </Accordion>
                    {selectedPreference?.isPublic && (
                      <Accordion elevation={0}>
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          aria-controls="panel2a-content"
                          id="panel2a-header"
                        >
                          <Typography
                            fontSize="14px"
                            fontWeight={500}
                            sx={{ marginRight: '30px' }}
                          >
                            {' '}
                            {t('publicElement')}
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <div className="row">
                            <div className="col-3 mt-1">
                              <Checkbox
                                fieldType={'boolean'}
                                staticField={false}
                                defaultValue={false}
                                required={false}
                                label={t('trackActivity')}
                                value={
                                  selectedPreference?.trackActivity || false
                                }
                                fullWidth
                                onBlur={(event, value) =>
                                  handleSaveField(
                                    'trackActivity',
                                    event.target.checked
                                  )
                                }
                                onChange={(event, value) =>
                                  handleSaveField(
                                    'trackActivity',
                                    event.target.checked
                                  )
                                }
                              />
                            </div>
                            <div className="col-3 mt-1">
                              <Checkbox
                                fieldType={'boolean'}
                                staticField={false}
                                defaultValue={false}
                                required={false}
                                label={t('accessCodeRequired')}
                                value={
                                  selectedPreference?.accessCodeRequired ||
                                  false
                                }
                                fullWidth
                                onBlur={(event, value) =>
                                  handleSaveField(
                                    'accessCodeRequired',
                                    event.target.checked
                                  )
                                }
                                onChange={(event, value) =>
                                  handleSaveField(
                                    'accessCodeRequired',
                                    event.target.checked
                                  )
                                }
                              />
                            </div>
                            <div className="col-3">
                              <Select
                                select
                                noEmpty
                                staticView
                                key={selectedPreference?.id + 'view'}
                                label={t('view')}
                                value={selectedPreference?.view}
                                selections={[
                                  {
                                    value: 'default',
                                    id: 'default',
                                    label: t('default'),
                                  },
                                  {
                                    value: 'tabs-default',
                                    id: 'tabs-default',
                                    label: t('tabs-default'),
                                  },
                                  {
                                    value: 'custom',
                                    id: 'custom',
                                    label: t('custom'),
                                  },
                                ]}
                                onChange={(e, value) =>
                                  handleSaveField('view', value)
                                }
                                fullWidth
                              />
                            </div>
                            <div className="col-12 mt-2">
                              <TextFieldMui
                                multiline
                                label={t('bottomText')}
                                value={selectedPreference?.bottomText || ''}
                                onChange={(e) =>
                                  handleSaveField('bottomText', e.target.value)
                                }
                                fullWidth
                                key={selectedPreference?.id + 'bottomText'}
                                variant="outlined"
                                sx={{
                                  'MuiFormControl-root': {
                                    width: '100%',
                                  },
                                  '.MuiInputBase-input': {
                                    padding: '2px 10px 2px 10px',
                                    boxSizing: 'border-box',
                                  },
                                  '& .MuiFormLabel-root': {
                                    backgroundColor:
                                      isDarkMode && 'rgb(51,51,51)',
                                    padding: '2px 10px 2px 10px',

                                    borderRadius: '10px',
                                  },
                                  '& .MuiOutlinedInput-root': {
                                    borderRadius: '10px',
                                  },
                                }}
                              />
                            </div>
                          </div>
                        </AccordionDetails>
                      </Accordion>
                    )}
                    {selectedPreference?.isPublic && (
                      <Accordion elevation={0}>
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          aria-controls="panel2a-content"
                          id="panel2a-header"
                        >
                          <Typography
                            fontSize="14px"
                            fontWeight={500}
                            sx={{ marginRight: '30px' }}
                          >
                            {' '}
                            {t('publicForm')}
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <div className="row">
                            <div className="col-3">
                              <Select
                                select
                                noEmpty
                                staticView
                                key={selectedPreference?.id + 'viewForm'}
                                label={t('viewForm')}
                                value={selectedPreference?.viewForm}
                                selections={[
                                  {
                                    value: 'default',
                                    id: 'default',
                                    label: t('default'),
                                  },
                                  {
                                    value: 'chat',
                                    id: 'chat',
                                    label: t('chat'),
                                  },
                                  {
                                    value: 'onebyone',
                                    id: 'onebyone',
                                    label: t('onebyone'),
                                  },
                                ]}
                                onChange={(e, value) =>
                                  handleSaveField('viewForm', value)
                                }
                                fullWidth
                              />
                            </div>
                            <div className="col-2">
                              <Checkbox
                                fieldType={'boolean'}
                                staticField={false}
                                defaultValue={false}
                                required={false}
                                label={t('displayLogo')}
                                value={selectedPreference?.displayLogo ?? false}
                                fullWidth
                                onBlur={(event, value) =>
                                  handleSaveField(
                                    'displayLogo',
                                    event.target.checked
                                  )
                                }
                                onChange={(event, value) =>
                                  handleSaveField(
                                    'displayLogo',
                                    event.target.checked
                                  )
                                }
                              />
                            </div>

                            <div className="col-4">
                              <TextField
                                label={t('bgImage')}
                                value={selectedPreference?.bgImage || ''}
                                onChange={(e) =>
                                  handleSaveField('bgImage', e.target.value)
                                }
                                fullWidth
                                key={selectedPreference?.id + 'bgImage'}
                                variant="outlined"
                              />
                            </div>
                            <div className="col-3">
                              <TextField
                                label={t('btnStart')}
                                value={selectedPreference?.btnStart || ''}
                                onChange={(e) =>
                                  handleSaveField('btnStart', e.target.value)
                                }
                                fullWidth
                                key={selectedPreference?.id + 'btnStart'}
                                variant="outlined"
                              />
                            </div>
                            <div className="col-12 mt-3">
                              <TextFieldMui
                                multiline
                                label={t('intro')}
                                value={selectedPreference?.intro || ''}
                                onChange={(e) =>
                                  handleSaveField('intro', e.target.value)
                                }
                                fullWidth
                                key={selectedPreference?.id + 'intro'}
                                variant="outlined"
                                sx={{
                                  'MuiFormControl-root': {
                                    width: '100%',
                                  },
                                  '.MuiInputBase-input': {
                                    padding: '2px 10px 2px 10px',
                                    boxSizing: 'border-box',
                                  },
                                  '& .MuiFormLabel-root': {
                                    backgroundColor:
                                      isDarkMode && 'rgb(51,51,51)',
                                    padding: '2px 10px 2px 10px',

                                    borderRadius: '10px',
                                  },
                                  '& .MuiOutlinedInput-root': {
                                    borderRadius: '10px',
                                  },
                                }}
                              />
                            </div>
                            <div className="col-12 mt-4">
                              <GeneralText
                                text={t('integrations')}
                                primary={true}
                                fontSize="12px"
                                classNameComponent="mt-3 px-2"
                                size="medium"
                              />
                            </div>
                            <div className="mt-3 d-flex">
                              <Button
                                variant="text"
                                onClick={() => handleCopyLink('url')}
                                fullWidth
                                label={t('copyLink')}
                                endIcon="InsertLinkOutlined"
                              />
                              <Button
                                variant="text"
                                onClick={() => handleCopyLink('script')}
                                fullWidth
                                label={t('copyScript')}
                                endIcon="DescriptionOutlined"
                              />
                              <Button
                                variant="text"
                                onClick={() => handleCopyLink('iframe')}
                                fullWidth
                                label={t('copyiFrame')}
                                endIcon="LaptopOutlined"
                              />
                            </div>
                          </div>
                        </AccordionDetails>
                      </Accordion>
                    )}
                    {selectedPreference?.nps && (
                      <Accordion elevation={0}>
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          aria-controls="panel5a-content"
                          id="panel5a-header"
                        >
                          <Typography
                            fontSize="14px"
                            fontWeight={500}
                            sx={{ marginRight: '30px' }}
                          >
                            {' '}
                            {t('nps')}
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <div className="row">
                            <div className="col-8">
                              <Select
                                select
                                noEmpty
                                staticView
                                key={selectedPreference?.id + 'npsField'}
                                label={t('npsField')}
                                value={selectedPreference?.npsField}
                                selections={selectedPreference?.fields?.map(
                                  (field) => {
                                    return {
                                      value: field?.value,
                                      id: field?.value,
                                      label: field?.name,
                                    };
                                  }
                                )}
                                onChange={(e, value) =>
                                  handleSaveField('npsField', value)
                                }
                                fullWidth
                              />
                            </div>
                            <div className="col-4">
                              <TextField
                                label={t('npsDays')}
                                value={selectedPreference?.npsDays || 30}
                                onChange={(e) =>
                                  handleSaveField('npsDays', e.target.value)
                                }
                                type="number"
                                fullWidth
                                key={selectedPreference?.id + 'npsDays'}
                                variant="outlined"
                              />
                            </div>

                            <div className="col-8 mt-3">
                              <TextFieldMui
                                multiline
                                label={t('npsEmail')}
                                value={selectedPreference?.npsEmail || ''}
                                onChange={(e) =>
                                  handleSaveField('npsEmail', e.target.value)
                                }
                                fullWidth
                                key={selectedPreference?.id + 'npsEmail'}
                                variant="outlined"
                                sx={{
                                  'MuiFormControl-root': {
                                    width: '100%',
                                  },
                                  '.MuiInputBase-input': {
                                    padding: '2px 10px 2px 10px',
                                    boxSizing: 'border-box',
                                  },
                                  '& .MuiFormLabel-root': {
                                    backgroundColor:
                                      isDarkMode && 'rgb(51,51,51)',
                                    padding: '2px 10px 2px 10px',

                                    borderRadius: '10px',
                                  },
                                  '& .MuiOutlinedInput-root': {
                                    borderRadius: '10px',
                                  },
                                }}
                              />
                            </div>
                            <div className="col-4">
                              <Select
                                select
                                noEmpty
                                staticView
                                fullWidth
                                label={t('npsTemplate')}
                                value={selectedPreference?.npsTemplate || ''}
                                onChange={(e, value) =>
                                  handleSaveField('npsTemplate', value)
                                }
                                key={selectedPreference?.id + 'npsTemplate'}
                                selections={businessPreference?.emails?.map(
                                  (field) => {
                                    return {
                                      value: field?.id,
                                      id: field?.id,
                                      label: field?.name,
                                    };
                                  }
                                )}
                              />
                            </div>
                            <div className="col-12 mt-3">
                              <TextFieldMui
                                multiline
                                label={t('npsCommentMsg')}
                                value={selectedPreference?.npsCommentMsg || ''}
                                onChange={(e) =>
                                  handleSaveField(
                                    'npsCommentMsg',
                                    e.target.value
                                  )
                                }
                                fullWidth
                                key={selectedPreference?.id + 'npsCommentMsg'}
                                variant="outlined"
                                sx={{
                                  'MuiFormControl-root': {
                                    width: '100%',
                                  },
                                  '.MuiInputBase-input': {
                                    padding: '2px 10px 2px 10px',
                                    boxSizing: 'border-box',
                                  },
                                  '& .MuiFormLabel-root': {
                                    backgroundColor:
                                      isDarkMode && 'rgb(51,51,51)',
                                    padding: '2px 10px 2px 10px',

                                    borderRadius: '10px',
                                  },
                                  '& .MuiOutlinedInput-root': {
                                    borderRadius: '10px',
                                  },
                                }}
                              />
                            </div>
                          </div>
                        </AccordionDetails>
                      </Accordion>
                    )}
                    {reloadIntegration && (
                      <Accordion elevation={0}>
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          aria-controls="panel6a-content"
                          id="panel6a-header"
                        >
                          <Typography
                            fontSize="14px"
                            fontWeight={500}
                            sx={{ marginRight: '30px' }}
                          >
                            {' '}
                            {t('integrations')}
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <div className="row">
                            <Marketplace
                              currentCollection={
                                selectedPreference?.collectionField
                              }
                            />
                          </div>
                        </AccordionDetails>
                      </Accordion>
                    )}
                  </>
                )}
              </Block>
            </Box>
          </>
        </Box>
      </Block>
    </MainLayoutV2>
  );
};

export default SettingsCollections;
