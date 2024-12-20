import React, { useState, useEffect } from 'react';

//utils
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material/styles';
import getRandomString from '../../../utils/getRandomString';

//components
import * as Icons from '@mui/icons-material';
import {
  Autocomplete,
  Button,
  FormControl,
  IconButton,
  InputLabel,
} from '@mui/material';
import TextField from '../../../stories/general-components/TextField';
import { TextField as TextFieldMUI } from '@mui/material';
import IconSelector from '../IconSelector';
import Selection from '../../../stories/general-components/Selection';
import Select from '../../../stories/general-components/Select';

const EditModule = ({ module, setModuleSelected }) => {
  const { t } = useTranslation();

  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  const [groups, setGroups] = useState([]);
  const [iconSelectorOpen, setIconSelectorOpen] = useState(false);

  const businessPreference = useSelector((state) => state.core.businessData);
  const businessStructure = useSelector(
    (state) => state.core.businessStructure
  );
  const structures = businessStructure?.structures;

  const formatedGroups = businessPreference?.groups?.map((group) => ({
    label: group?.name,
    value: group?.identifiant,
    id: group?.identifiant,
  }));

  const formatedSections = [
    {
      label: t('operations'),
      value: 'OPERATIONS',
      id: 'OPERATIONS',
      color: businessPreference?.mainColor,
    },
    {
      label: t('finances'),
      value: 'FINANCES',
      id: 'FINANCES',
      color: businessPreference?.mainColor,
    },
    {
      label: t('marketing'),
      value: 'MARETKING',
      id: 'MARETKING',
      color: businessPreference?.mainColor,
    },
  ];

  useEffect(() => {
    const formatGroups = module?.groups?.map((group) => ({
      label: formatedGroups.find((g) => g.id === group)?.label,
      value: group,
      id: group,
    }));

    setGroups(formatGroups);
  }, [module]);

  const openIconSelector = () => {
    setIconSelectorOpen(true);
  };

  const IconComponent = Icons[module?.icon] || Icons.Error;

  const handleAddSegment = () => {
    setModuleSelected({
      ...module,
      segments: [
        ...module?.segments,
        {
          name: '',
          field: '',
          operator: '==',
          value: '',
        },
      ],
    });
  };

  const handleRemoveSegment = (index) => {
    const newSegments = [...module?.segments];
    newSegments.splice(index, 1);
    setModuleSelected({ ...module, segments: newSegments });
  };

  const handleSegmentChange = (e, index, field) => {
    let newSegments = [...module?.segments];
    let segment = { ...newSegments[index] };
    segment[field] = e.target.value;
    newSegments[index] = segment;
    setModuleSelected({ ...module, segments: newSegments });
  };

  return (
    <div>
      {iconSelectorOpen && (
        <IconSelector
          isOpen={iconSelectorOpen}
          handleClose={() => {
            setModuleSelected({ ...module, icon: module?.icon });
            setIconSelectorOpen(false);
          }}
          handleCloseIcon={(icon) => {
            setModuleSelected({ ...module, icon });
            setIconSelectorOpen(false);
          }}
        />
      )}
      <div className="d-flex middle-content">
        <div className="col-8">
          <TextField
            label={t('name')}
            fullWidth
            value={module?.name}
            onChange={(e) => {
              setModuleSelected({ ...module, name: e.target.value });
            }}
          />
        </div>
        <div className="col-2 mx-4">
          <TextField
            label={t('order')}
            fullWidth
            type={'number'}
            value={parseInt(module?.order) + 1}
            onChange={(e) => {
              setModuleSelected({ ...module, order: e.target.value - 1 });
            }}
          />
        </div>
        <div className="col-1 hover align-right" onClick={openIconSelector}>
          <IconComponent
            fontSize="medium"
            color={isDarkMode ? '#fff' : '#000'}
            sx={{ mr: 2, mt: 0.5 }}
          />
        </div>
      </div>
      <div>
        <Select
          label={t('structure')}
          value={module?.structureId}
          onChange={(e, value) => {
            setModuleSelected({ ...module, structureId: value });
          }}
          selections={
            structures?.map((structure) => ({
              label: structure?.name,
              value: structure?.id,
              id: structure?.id,
            })) || []
          }
        />
      </div>
      <div className="mt-2">
        <Autocomplete
          multiple
          key={getRandomString(5)}
          options={formatedGroups || []}
          getOptionLabel={(option) => option?.label || ''}
          value={groups || []}
          onChange={(event, newValue) => {
            setGroups(newValue);
            setModuleSelected({
              ...module,
              groups: newValue?.map((g) => g.id),
            });
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
      <div className="mt-2">
        <Selection
          label={t('section')}
          selections={formatedSections || []}
          field={{
            typeData: 'selectionNode',
            value: 'section',
          }}
          value={module?.section}
          onChange={(newValue, value) => {
            setModuleSelected({
              ...module,
              section: value,
            });
          }}
        />
      </div>
      <div>
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
            {t('segments')}
          </InputLabel>{' '}
          {module?.segments?.map((segment, index) => (
            <div key={index}>
              <div style={{ marginBottom: '-12px' }} className="d-flex">
                <div className="col-11">
                  <TextField
                    label={t('name')}
                    fullWidth
                    value={segment?.name}
                    onChange={(e) => handleSegmentChange(e, index, 'name')}
                  />
                </div>
                <IconButton onClick={() => handleRemoveSegment(index)}>
                  <Icons.RemoveCircleOutline />
                </IconButton>
              </div>
              <div className="d-flex">
                <Select
                  fullWidth
                  style={{ width: '150px' }}
                  noEmpty
                  label={t('field')}
                  value={segment?.field}
                  filterValue={module?.collectionField}
                  selections={[
                    {
                      id: 'targetPrefix',
                      label: t('prefix'),
                      value: 'targetPrefix',
                      filter: ['contacts'],
                    },
                    {
                      id: 'status',
                      label: t('status'),
                      value: 'status',
                      filter: [
                        'passes',
                        'cardsinvoiced',
                        'cardsuninvoiced',
                        'grids',
                        'nodies',
                      ],
                    },
                    {
                      id: 'attribute1',
                      label: t('attribute1'),
                      value: 'attribute1',
                      filter: [
                        'contacts',
                        'services',
                        'articles',
                        'grids',
                        'nodies',
                        'passes',
                        'cardsinvoiced',
                        'cardsuninvoiced',
                        'tasks',
                        'storages',
                      ],
                    },
                    {
                      id: 'attribute2',
                      label: t('attribute2'),
                      value: 'attribute2',
                      filter: [
                        'contacts',
                        'services',
                        'articles',
                        'grids',
                        'nodies',
                        'passes',
                        'cardsinvoiced',
                        'cardsuninvoiced',
                        'tasks',
                        'storages',
                      ],
                    },
                    {
                      id: 'assignedToId',
                      label: t('assignedToId'),
                      value: 'assignedToId',
                      filter: [
                        'grids',
                        'nodies',
                        'passes',
                        'cardsinvoiced',
                        'cardsuninvoiced',
                      ],
                    },
                    {
                      id: 'targetDate',
                      label: t('targetDate'),
                      value: 'targetDate',
                      filter: [
                        'tasks',
                        'nodies',
                        'grids',
                        'cardsinvoiced',
                        'cardsuninvoiced',
                      ],
                    },
                    {
                      id: 'startDate',
                      label: t('startDate'),
                      value: 'startDate',
                      filter: ['passes'],
                    },
                    {
                      id: 'lastUpdate',
                      label: t('lastUpdate'),
                      value: 'lastUpdate',
                      filter: [
                        'contacts',
                        'services',
                        'articles',
                        'grids',
                        'nodies',
                        'passes',
                        'cardsinvoiced',
                        'cardsuninvoiced',
                        'tasks',
                        'storages',
                      ],
                    },
                    {
                      id: 'timeStamp',
                      label: t('timeStamp'),
                      value: 'timeStamp',
                      filter: [
                        'contacts',
                        'services',
                        'articles',
                        'grids',
                        'nodies',
                        'passes',
                        'cardsinvoiced',
                        'cardsuninvoiced',
                        'tasks',
                        'storages',
                      ],
                    },
                  ]}
                  onChange={(e, id) =>
                    handleSegmentChange(
                      { target: { value: id } },
                      index,
                      'field'
                    )
                  }
                />
                <Select
                  fullWidth
                  noEmpty
                  label={''}
                  value={segment?.operator}
                  selections={[
                    {
                      id: '==',
                      label: '==',
                      value: '==',
                    },
                    {
                      id: '!=',
                      label: '!=',
                      value: '!=',
                    },
                    {
                      id: '<=',
                      label: '<=',
                      value: '<=',
                    },
                    {
                      id: '>=',
                      label: '>=',
                      value: '>=',
                    },
                  ]}
                  onChange={(e, id) =>
                    handleSegmentChange(
                      { target: { value: id } },
                      index,
                      'operator'
                    )
                  }
                />
                <TextField
                  label={t('value')}
                  style={{ maxWidth: '165px' }}
                  value={segment?.value}
                  onChange={(e) => handleSegmentChange(e, index, 'value')}
                />
              </div>
            </div>
          ))}
          <Button onClick={() => handleAddSegment()}>{t('newSegment')}</Button>
        </FormControl>
      </div>
    </div>
  );
};

export default EditModule;
