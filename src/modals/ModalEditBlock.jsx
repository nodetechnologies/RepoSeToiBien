import React, { useEffect, useMemo, useState } from 'react';

import { useTranslation } from 'react-i18next';
import * as modalActions from '../redux/actions/modal-actions';
import { useSelector, useDispatch } from 'react-redux';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Typography, Button, FormControl, DialogActions } from '@mui/material';

import {
  Edit,
  ReplayOutlined,
  FilterListOutlined,
  InfoOutlined,
  Add,
  GroupOutlined,
  CheckCircle,
  ArrowDownward,
  TitleOutlined,
  EditCalendarOutlined,
  ListAltOutlined,
} from '@mui/icons-material';
import 'react-perfect-scrollbar/dist/css/styles.css';
import { Autocomplete } from '@mui/material';
import TextFieldMUI from '@mui/material/TextField';

import nodeAxiosFirebase from '../utils/nodeAxiosFirebase';

import { InputLabel } from '@material-ui/core';
import TextField from '../stories/general-components/TextField';
import { useParams } from 'react-router';

import { setGeneralStatus } from '../redux/actions-v2/coreAction';

import Select from '../stories/general-components/Select';
import ModalLarge from './Base/ModalLarge';

const ModalEditBlock = ({
  layout,
  activeIndex,
  childrenComponent,
  isOpen,
  initialData,
  from,
}) => {
  const theme = useTheme();
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const { structureId } = useParams();
  const currentLangCode = i18n.language;
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  const [blockData, setBlockData] = useState(
    initialData || {
      name: '',
      filter: {},
      createBtn: false,
      editBtn: false,
      refreshBtn: false,
      icon: '',
      displayTotal: false,
      infos: {},
      selectedColor: 'white',
      bgPattern: '',
      changesInProgress: [],
    }
  );

  const businessPreference = useSelector((state) => state.core.businessData);
  const handleCloseBlockDialog = () => {
    dispatch(
      modalActions.modalEditBlock({
        isOpen: false,
      })
    );
  };
  const businessStructure = useSelector(
    (state) => state.core.businessStructure
  );

  const structureFields =
    businessStructure?.structures?.find((s) => s.id === layout?.structureId)
      ?.fields || [];

  const mergedFields = [
    ...(structureFields || []),
    {
      name: t('timeStamp'),
      value: 'timeStamp',
    },
    {
      name: t('lastUpdate'),
      value: 'lastUpdate',
    },
  ];

  // Memoize formattedGroups to avoid recomputing on every render
  const formattedGroups = useMemo(() => {
    return businessPreference?.groups?.map((group) => ({
      label: group?.name,
      value: group?.identifiant,
      id: group?.identifiant,
    }));
  }, [businessPreference?.groups]);

  const isDarkMode = theme.palette.mode === 'dark';

  // Memoize transformedGroups to avoid recomputation on every save
  const transformedGroups = useMemo(() => {
    return blockData?.groups?.map((group) => group.value);
  }, [blockData?.groups]);

  const handleSaveBlock = async () => {
    try {
      handleCloseBlockDialog();
      dispatch(
        setGeneralStatus({
          status: 'loading',
          position: 'edit-block' + layout?.i,
          type: 'skeleton',
        })
      );
      await nodeAxiosFirebase({
        t,
        method: 'POST',
        url: `business/structure`,
        body: {
          type: 'block',
          structureId: structureId,
          lang: currentLangCode,
          data: {
            from: from || 'business',
            tabIndex: activeIndex,
            blockIdentifiant: layout?.i,
            blockData: {
              ...blockData,
              filter: blockData?.filter?.operator ? blockData?.filter : null,
              infos: blockData?.infos?.display ? blockData?.infos : null,
              groups: transformedGroups?.length > 0 ? transformedGroups : [],
              color: blockData?.color,
              bgPattern: blockData?.bgPattern,
            },
          },
        },
      });
    } catch (error) {
      console.error('Error set block');
      dispatch(setGeneralStatus({ status: 'error', error: error }));
    }
  };

  return (
    <ModalLarge
      title={t('updateBlock')}
      isOpen={isOpen}
      modalCloseHandler={handleCloseBlockDialog}
      fullWidth
      maxWidth="sm"
    >
      <div style={{ minHeight: '100px', width: '100%' }}>
        <div className="align-c d-flex">
          {childrenComponent !== 'content' && (
            <Button
              sx={{ width: '90px', margin: '8px' }}
              onClick={() =>
                setBlockData({
                  ...blockData,
                  createBtn: !blockData?.createBtn,
                })
              }
            >
              {blockData?.createBtn && (
                <div style={{ top: 0, right: 0, position: 'absolute' }}>
                  <CheckCircle color="success" />
                </div>
              )}
              <div>
                <Add />
                <Typography fontSize="8px" fontWeight={400}>
                  {t('create')}
                </Typography>
              </div>
            </Button>
          )}
          {childrenComponent === 'content' && from !== 'public' && (
            <Button
              sx={{ width: '90px', margin: '8px' }}
              onClick={() =>
                setBlockData({
                  ...blockData,
                  editBtn: !blockData?.editBtn,
                })
              }
            >
              {blockData?.editBtn && (
                <div style={{ top: 0, right: 0, position: 'absolute' }}>
                  <CheckCircle color="success" />
                </div>
              )}
              <div>
                <Edit />
                <Typography fontSize="8px" fontWeight={400}>
                  {t('edit')}
                </Typography>
              </div>
            </Button>
          )}
          {childrenComponent === 'content' && from !== 'public' && (
            <Button
              sx={{ width: '90px', margin: '8px' }}
              onClick={() =>
                setBlockData({
                  ...blockData,
                  refreshBtn:
                    blockData?.refreshBtn === 'user' ? 'none' : 'user',
                })
              }
            >
              {blockData?.refreshBtn !== 'none' && (
                <div style={{ top: 0, right: 0, position: 'absolute' }}>
                  <CheckCircle color="success" />
                </div>
              )}
              <div>
                <ReplayOutlined />
                <Typography fontSize="8px" fontWeight={400}>
                  {t('refresh')}
                </Typography>
              </div>
            </Button>
          )}
          {childrenComponent === 'list' && (
            <Button
              sx={{ width: '90px', margin: '8px' }}
              onClick={() =>
                blockData?.filter?.operator
                  ? setBlockData({
                      ...blockData,
                      filter: null,
                    })
                  : setBlockData({
                      ...blockData,
                      filter: { operator: '==' },
                    })
              }
            >
              {blockData?.filter?.operator && (
                <div style={{ top: 0, right: 0, position: 'absolute' }}>
                  <CheckCircle color="success" />
                </div>
              )}
              <div>
                <FilterListOutlined />
                <Typography fontSize="8px" fontWeight={400}>
                  {t('filter')}
                </Typography>
              </div>
            </Button>
          )}

          <Button
            sx={{ width: '90px', margin: '8px' }}
            onClick={() =>
              blockData?.displayTotal
                ? setBlockData({
                    ...blockData,
                    displayTotal: false,
                  })
                : setBlockData({
                    ...blockData,
                    displayTotal: true,
                  })
            }
          >
            {blockData?.displayTotal && (
              <div style={{ top: 0, right: 0, position: 'absolute' }}>
                <CheckCircle color="success" />
              </div>
            )}
            <div>
              <ListAltOutlined />
              <Typography fontSize="8px" fontWeight={400}>
                {t('total')}
              </Typography>
            </div>
          </Button>

          {childrenComponent === 'list' && (
            <Button
              sx={{ width: '90px', margin: '8px' }}
              onClick={() =>
                setBlockData({
                  ...blockData,
                  order: blockData?.order?.direction
                    ? {}
                    : { direction: 'desc' },
                })
              }
            >
              {blockData?.order?.direction && (
                <div style={{ top: 0, right: 0, position: 'absolute' }}>
                  <CheckCircle color="success" />
                </div>
              )}
              <div>
                <ArrowDownward />
                <Typography fontSize="8px" fontWeight={400}>
                  {t('order')}
                </Typography>
              </div>
            </Button>
          )}

          {(childrenComponent === 'list' ||
            childrenComponent === 'content') && (
            <Button
              sx={{ width: '90px', margin: '8px' }}
              onClick={() =>
                setBlockData({
                  ...blockData,
                  labels: blockData?.labels ? false : true,
                })
              }
            >
              {blockData?.labels && (
                <div style={{ top: 0, right: 0, position: 'absolute' }}>
                  <CheckCircle color="success" />
                </div>
              )}
              <div>
                <TitleOutlined />
                <Typography fontSize="8px" fontWeight={400}>
                  {t('labels')}
                </Typography>
              </div>
            </Button>
          )}
          {from !== 'public' && (
            <Button
              sx={{ width: '90px', margin: '8px' }}
              onClick={() =>
                setBlockData({
                  ...blockData,
                  groups: [],
                })
              }
            >
              {blockData?.groups && (
                <div style={{ top: 0, right: 0, position: 'absolute' }}>
                  <CheckCircle color="success" />
                </div>
              )}
              <div>
                <GroupOutlined />
                <Typography fontSize="8px" fontWeight={400}>
                  {t('groups')}
                </Typography>
              </div>
            </Button>
          )}
          <Button
            sx={{ width: '90px', margin: '8px' }}
            onClick={() =>
              setBlockData({
                ...blockData,
                infos: { display: !blockData?.infos?.display },
              })
            }
          >
            {blockData?.infos?.display && (
              <div style={{ top: 0, right: 0, position: 'absolute' }}>
                <CheckCircle color="success" />
              </div>
            )}

            <div>
              <InfoOutlined />
              <Typography fontSize="8px" fontWeight={400}>
                {t('infos')}
              </Typography>
            </div>
          </Button>
        </div>

        <div className="col-12">
          <TextField
            label={t('name')}
            value={blockData?.name}
            onChange={(e) =>
              setBlockData({ ...blockData, name: e.target.value })
            }
            fullWidth
          />
        </div>
        <div className="d-flex">
          <div className="col-5 mt-1">
            <FormControl
              fullWidth
              margin="normal"
              sx={{
                border: '1px solid lightgray',
                borderRadius: '10px',
                padding: '10px',
                minHeight: '50px',
              }}
            >
              <InputLabel
                shrink={true}
                sx={{
                  backgroundColor: isDarkMode ? 'rgb(51,51,51)' : '#FFF',
                  padding: '2px 10px 2px 10px',
                  borderRadius: '10px',
                }}
              >
                {t('color')}
              </InputLabel>{' '}
              <div className="row mt-2">
                <div
                  onClick={() => {
                    setBlockData({
                      ...blockData,
                      color: 'transparent',
                    });
                  }}
                  className="col-2 color-picker"
                  style={{
                    borderRadius: blockData?.color === 'transparent' && '50%',
                    background: '#FFFFFF30',
                    backgroundImage: 'url(/assets/v3/img/transparent.png)',
                  }}
                />
                <div
                  onClick={() => {
                    setBlockData({
                      ...blockData,
                      color: 'white',
                    });
                  }}
                  className="col-2 color-picker"
                  style={{
                    borderRadius: blockData?.color === 'white' && '50%',
                    background: '#FFF',
                  }}
                />

                <div
                  onClick={() => {
                    setBlockData({
                      ...blockData,
                      color: 'grey',
                    });
                  }}
                  className="col-2 color-picker"
                  style={{
                    borderRadius: blockData?.color === 'grey' && '50%',
                    background: '#F4f4f4',
                  }}
                />
                <div
                  onClick={() => {
                    setBlockData({
                      ...blockData,
                      color: 'mainColor',
                    });
                  }}
                  className="col-2 color-picker"
                  style={{
                    borderRadius: blockData?.color === 'mainColor' && '50%',
                    background: businessPreference?.mainColor || '#000',
                  }}
                />
                <div
                  onClick={() => {
                    setBlockData({
                      ...blockData,
                      color: 'secColor',
                    });
                  }}
                  className="col-2 color-picker"
                  style={{
                    borderRadius: blockData?.color === 'secColor' && '50%',
                    background: businessPreference?.secColor || '#000',
                  }}
                />
              </div>
            </FormControl>
          </div>
          <div style={{ paddingLeft: '20px' }} className="col-7 mt-1">
            <FormControl
              fullWidth
              margin="normal"
              sx={{
                border: '1px solid lightgray',
                borderRadius: '10px',
                padding: '10px',
                minHeight: '50px',
              }}
            >
              <InputLabel
                shrink={true}
                sx={{
                  backgroundColor: isDarkMode ? 'rgb(51,51,51)' : '#FFF',
                  padding: '2px 10px 2px 10px',
                  borderRadius: '10px',
                }}
              >
                {t('pattern')}
              </InputLabel>{' '}
              <div className="row mt-2">
                <div
                  onClick={() => {
                    setBlockData({
                      ...blockData,
                      bgPattern: '',
                    });
                  }}
                  className="col-2 color-picker "
                  style={{
                    borderRadius: blockData?.bgPattern === '' && '50%',
                    background: '#FFF',
                  }}
                />
                <div
                  onClick={() => {
                    setBlockData({
                      ...blockData,
                      bgPattern: 'wavy',
                    });
                  }}
                  className="col-2 color-picker"
                  style={{
                    borderRadius: blockData?.bgPattern === 'wavy' && '50%',
                    background: '#F4f4f450',
                    backgroundImage: 'url(/assets/v3/img/wavy.png)',
                  }}
                />
                <div
                  onClick={() => {
                    setBlockData({
                      ...blockData,
                      bgPattern: 'moon',
                    });
                  }}
                  className="col-2 color-picker"
                  style={{
                    borderRadius: blockData?.bgPattern === 'moon' && '50%',
                    background: '#F4f4f450',
                    backgroundImage: 'url(/assets/v3/img/moon.png)',
                  }}
                />
                <div
                  onClick={() => {
                    setBlockData({
                      ...blockData,
                      bgPattern: 'paper',
                    });
                  }}
                  className="col-2 color-picker"
                  style={{
                    borderRadius: blockData?.bgPattern === 'paper' && '50%',
                    background: '#F4f4f450',
                    backgroundImage: 'url(/assets/v3/img/paper.png)',
                  }}
                />
                <div
                  onClick={() => {
                    setBlockData({
                      ...blockData,
                      bgPattern: 'polka',
                    });
                  }}
                  className="col-2 color-picker"
                  style={{
                    borderRadius: blockData?.bgPattern === 'polka' && '50%',
                    background: '#F4f4f450',
                    backgroundImage: 'url(/assets/v3/img/polka.png)',
                  }}
                />
              </div>
            </FormControl>
          </div>
        </div>

        {blockData?.infos?.display && (
          <div className="col-12">
            <TextField
              label={t('notes')}
              value={blockData?.infos?.text}
              onChange={(e) =>
                setBlockData({
                  ...blockData,
                  infos: { ...blockData?.infos, text: e.target.value },
                })
              }
              fullWidth
            />
          </div>
        )}
        {blockData?.filter?.operator && (
          <div className="row">
            <div className="col-4">
              <Select
                label={t('field')}
                value={blockData?.filter?.field}
                selections={[
                  { label: t('isDone'), value: 'isDone', id: 'isDone' },
                  {
                    label: t('isFeatured'),
                    value: 'isFeatured',
                    id: 'isFeatured',
                  },
                ]}
                onChange={(e, value) =>
                  setBlockData({
                    ...blockData,
                    filter: {
                      ...blockData?.filter,
                      field: value,
                    },
                  })
                }
                fullWidth
              />
            </div>
            <div className="col-4">
              <Select
                label={t('operator')}
                value={blockData?.filter?.operator}
                selections={[
                  { label: '==', value: '==', id: '==' },
                  { label: '!=', value: '!=', id: '!=' },
                  { label: '>', value: '>', id: '>' },
                  { label: '>=', value: '>=', id: '>=' },
                  { label: '<', value: '<', id: '<' },
                  { label: '<=', value: '<=', id: '<=' },
                ]}
                onChange={(e, value) =>
                  setBlockData({
                    ...blockData,
                    filter: {
                      ...blockData?.filter,
                      operator: value,
                    },
                  })
                }
                fullWidth
              />
            </div>
            <div className="col-4">
              {blockData?.filter?.field === 'isDone' ||
              blockData?.filter?.field === 'isFeatured' ? (
                <Select
                  label={t('value')}
                  value={blockData?.filter?.value}
                  selections={[
                    { label: t('yes'), value: true, id: true },
                    { label: t('no'), value: false, id: false },
                  ]}
                  onChange={(e, value) =>
                    setBlockData({
                      ...blockData,
                      filter: {
                        ...blockData?.filter,
                        value: value,
                      },
                    })
                  }
                  fullWidth
                />
              ) : (
                <TextField
                  label={t('value')}
                  value={blockData?.filter?.value}
                  onChange={(e) =>
                    setBlockData({
                      ...blockData,
                      filter: {
                        ...blockData?.filter,
                        value: e.target.value,
                      },
                    })
                  }
                  fullWidth
                />
              )}
            </div>
          </div>
        )}
        {blockData?.order?.direction && (
          <div className="row">
            <div className="col-6">
              <Select
                label={t('fields')}
                value={blockData?.order?.field}
                selections={mergedFields?.map((field) => ({
                  label: field?.name,
                  value: field?.value,
                  id: field?.value,
                }))}
                onChange={(e, value) =>
                  setBlockData({
                    ...blockData,
                    order: {
                      ...blockData?.order,
                      field: value,
                    },
                  })
                }
                fullWidth
              />
            </div>
            <div className="col-6">
              <Select
                label={t('direction')}
                value={blockData?.order?.direction}
                selections={[
                  { label: t('asc'), value: 'asc', id: 'asc' },
                  {
                    label: t('descen'),
                    value: 'desc',
                    id: 'desc',
                  },
                ]}
                onChange={(e, value) =>
                  setBlockData({
                    ...blockData,
                    order: {
                      ...blockData?.order,
                      direction: value,
                    },
                  })
                }
                fullWidth
              />
            </div>
          </div>
        )}
        {blockData?.groups && from !== 'public' && (
          <div className="col-12 mt-3">
            <Autocomplete
              multiple
              fullWidth
              options={formattedGroups || []}
              getOptionLabel={(option) => option?.label || ''}
              value={blockData?.groups}
              onChange={(event, newValue) => {
                setBlockData({ ...blockData, groups: newValue });
              }}
              sx={{ maxWidth: '100%' }}
              renderInput={(params) => (
                <TextFieldMUI
                  {...params}
                  sx={{
                    'MuiFormControl-root': {
                      width: '100%',
                      height: '55px',
                    },
                    '.MuiInputBase-input': {
                      padding: '2px 0px 2px 10px',
                      height: '55px',
                      width: '100%',
                    },
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '10px',
                      width: '100%',
                      height: '55px',
                      '&.Mui-focused fieldset': {
                        width: '100%',
                        borderColor: businessPreference?.mainColor || '#000',
                        boxShadow: `0 0 0 0.2rem ${
                          businessPreference?.mainColor + '20'
                        }`,
                      },
                    },
                  }}
                  label={t('selectGroup')}
                  variant="outlined"
                />
              )}
              isOptionEqualToValue={(option, value) => option.id === value.id}
            />
          </div>
        )}
      </div>
      <DialogActions sx={{ padding: '30px' }}>
        <Button
          label={t('cancel')}
          onClick={handleCloseBlockDialog}
          variant="text"
        />
        <Button onClick={handleSaveBlock}>{t('save')}</Button>
      </DialogActions>
    </ModalLarge>
  );
};

export default ModalEditBlock;
