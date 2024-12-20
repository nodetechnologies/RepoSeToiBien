// Libraries
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { v4 as uuidv4 } from 'uuid';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import {
  IconButton,
  Button,
  Typography,
  Box,
  MenuItem,
  Tooltip,
  InputAdornment,
  Menu,
  List,
  ListItem,
  Checkbox,
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import DragHandleOutlinedIcon from '@mui/icons-material/DragHandleOutlined';
import CancelIcon from '@mui/icons-material/Cancel';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import WarningIcon from '@mui/icons-material/Warning';
import InfoIcon from '@mui/icons-material/Info';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import CategoryIcon from '@mui/icons-material/Category';
import ContactSupportIcon from '@mui/icons-material/ContactSupport';
import EventNoteIcon from '@mui/icons-material/EventNote';
import HourglassFullIcon from '@mui/icons-material/HourglassFull';
import InventoryIcon from '@mui/icons-material/Inventory';
import LockIcon from '@mui/icons-material/Lock';
import PersonIcon from '@mui/icons-material/Person';
import TaskIcon from '@mui/icons-material/Task';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import {
  RemoveCircleOutline,
  SettingsSuggest,
  VisibilityOff,
} from '@mui/icons-material';
import ConditionsIcon from '@mui/icons-material/Settings';

// Components
import TextField from '../../stories/general-components/TextField';
import TextFieldMUI from '@mui/material/TextField';
import DrawerSide from '../../stories/layout-components/DrawerSide';
import Select from '../../stories/general-components/Select';
import GeneralText from '../../stories/general-components/GeneralText';
import IconUploader from './IconUploader';
import Selection from '../../stories/general-components/Selection';

const FieldEditor = ({ fields, setFields }) => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language;
  const [displayRegexMenu, setDisplayRegexMenu] = useState(false);
  const [currentRegexIndex, setCurrentRegexIndex] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedFieldIndex, setSelectedFieldIndex] = useState(null);

  const handleFieldChange = (index, key, value) => {
    setFields(
      fields?.map((field, idx) =>
        idx === index ? { ...field, [key]: value } : field
      )
    );
  };

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  const openConditionsDrawer = (index) => {
    setSelectedFieldIndex(index);
    setDrawerOpen(true);
  };

  const handleConditionsChange = (index, conditions) => {
    setFields(
      fields?.map((field, idx) =>
        idx === index ? { ...field, conditional: conditions } : field
      )
    );
  };

  const renderConditionsDrawer = () => (
    <DrawerSide
      title={t('conditions')}
      handleDrawerClose={toggleDrawer(false)}
      isDrawerOpen={drawerOpen}
      isCreation={true}
    >
      <List>
        {(fields[selectedFieldIndex]?.conditional || []).map(
          (condition, idx) => (
            <React.Fragment key={idx}>
              <ListItem>
                <div className="col-4">
                  <Select
                    label={t('field')}
                    staticView
                    key={idx + 'field-cond'}
                    selections={fields?.map((field) => ({
                      value: field?.value,
                      id: field?.value,
                      label: field?.name,
                    }))}
                    value={condition?.field}
                    onChange={(e, value) =>
                      handleConditionChange(idx, 'field', value)
                    }
                    fullWidth
                  />
                </div>
                <div className="col-3 px-2">
                  <Select
                    variant="outlined"
                    label={t('operator')}
                    selections={[
                      {
                        label: t('equal'),
                        value: '==',
                        id: '==',
                      },
                      {
                        label: t('notEqual'),
                        value: '!=',
                        id: '!=',
                      },
                      {
                        label: t('greaterThan'),
                        value: '>',
                        id: '>',
                      },
                      {
                        label: t('lessThan'),
                        value: '<',
                        id: '<',
                      },
                    ]}
                    value={condition?.operator || ''}
                    onChange={(e, value) =>
                      handleConditionChange(idx, 'operator', value)
                    }
                    fullWidth
                  />
                </div>
                <div className="col-4 mt-2">
                  <TextFieldMUI
                    sx={{
                      'MuiFormControl-root': {
                        width: '100%',
                      },
                      '.MuiInputBase-input': {
                        height: '48px',
                        padding: '2px 10px 2px 10px',
                      },
                      '& .MuiFormLabel-root': {
                        padding: '2px 10px 2px 10px',
                        borderRadius: '10px',
                      },
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '10px',
                      },
                    }}
                    variant="outlined"
                    label={t('value')}
                    value={condition.value || ''}
                    onChange={(e) =>
                      handleConditionChange(idx, 'value', e.target.value)
                    }
                    fullWidth
                  />
                </div>
                <div className="col-1">
                  <IconButton onClick={() => removeCondition(idx)}>
                    <DeleteIcon />
                  </IconButton>
                </div>
              </ListItem>
              {idx < fields[selectedFieldIndex]?.conditional.length - 1 && (
                <ListItem>
                  <div
                    className="row"
                    style={{
                      marginTop: '-15px',
                      marginBottom: '-15px',
                      marginLeft: '100px',
                    }}
                  >
                    <Selection
                      label={t('logic')}
                      value={condition.logic}
                      onChange={(valueF, value) =>
                        handleConditionChange(idx, 'logic', value)
                      }
                      field={{
                        typeData: 'selectionNode',
                      }}
                      selections={[
                        {
                          label: t('AND'),
                          value: 'AND',
                          id: 'AND',
                          color: '#000000',
                        },
                        {
                          label: t('OR'),
                          value: 'OR',
                          id: 'OR',
                          color: '#000000',
                        },
                      ]}
                      noForm
                    />
                  </div>
                </ListItem>
              )}
            </React.Fragment>
          )
        )}
        <Button sx={{ marginLeft: '20px' }} onClick={addCondition}>
          {t('add')}
        </Button>
      </List>
    </DrawerSide>
  );

  const handleConditionChange = (index, key, value) => {
    const updatedConditions = fields[selectedFieldIndex]?.conditional.map(
      (condition, idx) =>
        idx === index ? { ...condition, [key]: value } : condition
    );
    handleConditionsChange(selectedFieldIndex, updatedConditions);
  };

  const addCondition = () => {
    const updatedConditions = [
      ...(fields[selectedFieldIndex]?.conditional || []),
      { field: '', operator: '', value: '', logic: 'AND' },
    ];
    handleConditionsChange(selectedFieldIndex, updatedConditions);
  };

  const removeCondition = (index) => {
    const updatedConditions = fields[selectedFieldIndex]?.conditional.filter(
      (_, idx) => idx !== index
    );
    handleConditionsChange(selectedFieldIndex, updatedConditions);
  };

  const addField = () => {
    setFields([
      ...fields,
      {
        id: uuidv4(),
        name: '',
        label: '',
        value: '',
        validation: '',
        typeData: 'string',
        defaultValue: '',
        type: 'data',
        selections: [],
        conditional: [],
        public: false,
      },
    ]);
  };

  const removeField = (index) => {
    setFields(fields.filter((_, idx) => idx !== index));
  };

  const publicField = (index) => {
    setFields(
      fields?.map((field, idx) =>
        idx === index ? { ...field, public: !field?.public } : field
      )
    );
  };

  const setRequired = (index, value) => {
    setFields(
      fields?.map((field, idx) =>
        idx === index ? { ...field, required: value } : field
      )
    );
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(fields);
    const [reorderedItem] = items?.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setFields(items);
  };

  const addSelectionToField = (fieldIndex) => {
    const updatedFields = fields?.map((field, idx) => {
      if (idx === fieldIndex) {
        const newSelection = {
          id: uuidv4(),
          label_fr: '',
          label_en: '',
          value: field?.selections?.length,
          color: '#696969',
          icon: 'Info',
          media_url: '',
        };
        const updatedSelections = [...(field.selections || []), newSelection];
        return { ...field, selections: updatedSelections };
      }
      return field;
    });

    setFields(updatedFields);
  };

  const removeSelectionField = (fieldIndex) => {
    const updatedFields = fields?.map((field, idx) => {
      if (idx === fieldIndex) {
        const updatedSelections = field.selections.slice(0, -1);
        return { ...field, selections: updatedSelections };
      }
      return field;
    });
    setFields(updatedFields);
  };

  // Function to handle selection change within a field
  const handleSelectionChange = (fieldIndex, selectionIndex, key, value) => {
    const updatedFields = fields?.map((field, idx) => {
      if (idx === fieldIndex) {
        if (field?.typeData === 'selection' || field?.typeData === 'dropdown') {
          if (key === 'label_fr' || key === 'label_en') {
            const updatedSelections = field?.selections?.map((sel, selIdx) => {
              return selIdx === selectionIndex ? { ...sel, [key]: value } : sel;
            });
            return { ...field, selections: updatedSelections };
          } else {
            const updatedSelections = field?.selections?.map((sel, selIdx) => {
              return selIdx === selectionIndex ? { ...sel, [key]: value } : sel;
            });
            return { ...field, selections: updatedSelections };
          }
        } else {
          const updatedSelections = field?.selections?.map((sel, selIdx) => {
            return selIdx === selectionIndex ? { ...sel, [key]: value } : sel;
          });
          return { ...field, selections: updatedSelections };
        }
      }
      return field;
    });
    setFields(updatedFields);
  };

  const addMedia = (mediaUrl, fieldIndex, selectionIndex) => {
    const updatedFields = fields?.map((field, idx) => {
      if (idx === fieldIndex) {
        const updatedSelections = field?.selections?.map((sel, selIdx) => {
          return selIdx === selectionIndex
            ? { ...sel, media_url: mediaUrl?.[0]?.fileUrl }
            : sel;
        });
        return { ...field, selections: updatedSelections };
      }
      return field;
    });
    setFields(updatedFields);
  };

  // Function to render selection management UI within a field
  const renderSelectionManagement = (field, fieldIndex) => {
    const selections = Array.isArray(field?.selections)
      ? field?.selections
      : [];

    return (
      <>
        {selections?.map((selection, selectionIndex) => {
          if (typeof selection === 'string') {
            // Render UI for string selection
            return null;
          } else {
            // Render UI for object selection
            return (
              <ListItem dense key={selectionIndex + 'select'}>
                <div
                  style={{ width: '100%' }}
                  className="d-flex middle-content"
                >
                  <div className={'col-4'}>
                    <TextFieldMUI
                      variant="standard"
                      sx={{
                        mt: 0.8,
                      }}
                      value={selection?.['label_' + currentLang]}
                      onChange={(e) =>
                        handleSelectionChange(
                          fieldIndex,
                          selectionIndex,
                          'label_' + currentLang,
                          e.target.value
                        )
                      }
                      fullWidth
                    />
                  </div>
                  <div className={'col-2'}>
                    <TextFieldMUI
                      type="color"
                      variant="standard"
                      sx={{
                        mt: 0.8,
                      }}
                      value={selection?.color}
                      onChange={(e) =>
                        handleSelectionChange(
                          fieldIndex,
                          selectionIndex,
                          'color',
                          e.target.value
                        )
                      }
                      fullWidth
                    />
                  </div>
                  {(field?.typeData === 'select' ||
                    field?.typeData === 'selection' ||
                    field?.typeData === 'status') && (
                    <div className={'col-3'}>
                      <TextFieldMUI
                        select
                        sx={{
                          px: 3,
                        }}
                        variant="standard"
                        value={selection?.icon}
                        onChange={(e) =>
                          handleSelectionChange(
                            fieldIndex,
                            selectionIndex,
                            'icon',
                            e.target.value
                          )
                        }
                        fullWidth
                      >
                        <MenuItem value="AssignmentInd">
                          <AssignmentIndIcon
                            htmlColor={selection?.color}
                            sx={{ mr: 1 }}
                          />
                          {t('assignment')}
                        </MenuItem>
                        <MenuItem value="Task">
                          <TaskIcon
                            htmlColor={selection?.color}
                            sx={{ mr: 1 }}
                          />
                          {t('task')}
                        </MenuItem>
                        <MenuItem value="Category">
                          <CategoryIcon
                            htmlColor={selection?.color}
                            sx={{ mr: 1 }}
                          />
                          {t('objects')}
                        </MenuItem>
                        <MenuItem value="Cancel">
                          <CancelIcon
                            htmlColor={selection?.color}
                            sx={{ mr: 1 }}
                          />
                          {t('cancelled')}
                        </MenuItem>
                        <MenuItem value="Inventory">
                          <InventoryIcon
                            htmlColor={selection?.color}
                            sx={{ mr: 1 }}
                          />
                          {t('box')}
                        </MenuItem>
                        <MenuItem value="ContactSupport">
                          <ContactSupportIcon
                            htmlColor={selection?.color}
                            sx={{ mr: 1 }}
                          />
                          {t('support')}
                        </MenuItem>
                        <MenuItem value="EventNote">
                          <EventNoteIcon
                            htmlColor={selection?.color}
                            sx={{ mr: 1 }}
                          />
                          {t('calendar')}
                        </MenuItem>
                        <MenuItem value="ThumbUp">
                          <ThumbUpIcon
                            htmlColor={selection?.color}
                            sx={{ mr: 1 }}
                          />
                          {t('approved')}
                        </MenuItem>
                        <MenuItem value="ThumbDown">
                          <ThumbDownIcon
                            htmlColor={selection?.color}
                            sx={{ mr: 1 }}
                          />
                          {t('rejected')}
                        </MenuItem>
                        <MenuItem value="HourglassFull">
                          <HourglassFullIcon
                            htmlColor={selection?.color}
                            sx={{ mr: 1 }}
                          />
                          {t('pending')}
                        </MenuItem>
                        <MenuItem value="Lock">
                          <LockIcon
                            htmlColor={selection?.color}
                            sx={{ mr: 1 }}
                          />
                          {t('lock')}
                        </MenuItem>
                        <MenuItem value="Warning">
                          <WarningIcon
                            htmlColor={selection?.color}
                            sx={{ mr: 1 }}
                          />
                          {t('priority')}
                        </MenuItem>
                        <MenuItem value="Info">
                          <InfoIcon
                            htmlColor={selection?.color}
                            sx={{ mr: 1 }}
                          />
                          {t('Info')}
                        </MenuItem>
                        <MenuItem value="Visibility">
                          <VisibilityIcon
                            htmlColor={selection?.color}
                            sx={{ mr: 1 }}
                          />
                          {t('Visible')}
                        </MenuItem>
                        <MenuItem value="Person">
                          <PersonIcon
                            htmlColor={selection?.color}
                            sx={{ mr: 1 }}
                          />
                          {t('user')}
                        </MenuItem>
                      </TextFieldMUI>
                    </div>
                  )}
                  {field?.typeData === 'status' && (
                    <div className={'col-3'}>
                      <Tooltip title={t('considerIsDone')}>
                        <span>
                          <Checkbox
                            key={selectionIndex + 'isDone'}
                            checked={selection?.isDone}
                            onClick={(e) =>
                              handleSelectionChange(
                                fieldIndex,
                                selectionIndex,
                                'isDone',
                                !selection?.isDone
                              )
                            }
                          />
                        </span>
                      </Tooltip>
                    </div>
                  )}
                  {field?.typeData === 'dropdown' && (
                    <div className={'col-1 px-5 align-c'}>
                      <IconUploader
                        size="small"
                        value={selection?.media_url}
                        onComplete={(e) =>
                          addMedia(e, fieldIndex, selectionIndex)
                        }
                      />
                    </div>
                  )}
                  <div className={'col-1 px-4 align-c'}>
                    {' '}
                    <IconButton
                      onClick={() => removeSelectionField(fieldIndex)}
                    >
                      <RemoveCircleOutline />
                    </IconButton>
                  </div>
                </div>
              </ListItem>
            );
          }
        })}
        <div className="mt-3">
          <Button
            variant="text"
            size="small"
            color="black"
            onClick={() => addSelectionToField(fieldIndex)}
          >
            <Typography fontSize="12px" fontWeight={500}>
              {t('addSelection')}
            </Typography>
          </Button>
        </div>
      </>
    );
  };

  const handleDisplayRegex = (index) => {
    setDisplayRegexMenu(!displayRegexMenu);
    setCurrentRegexIndex(index);
  };

  const handleSelectRegex = (index, value) => {
    handleFieldChange(index, 'validation', value);
    setDisplayRegexMenu(false);
  };

  return (
    <Box>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="fields">
          {(provided) => (
            <Box {...provided.droppableProps} ref={provided.innerRef}>
              {fields?.map((field, index) => (
                <Draggable
                  key={index + 'field-drop'}
                  draggableId={field?.id ? field.id + index : `field-${index}`}
                  index={index}
                >
                  {(provided) => (
                    <Box
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      key={index + 'field'}
                    >
                      <Box key={index + 'fieldSec'}>
                        <div className="row middle-content">
                          <div
                            style={{ paddingTop: '14px' }}
                            className={'col-4'}
                          >
                            <TextField
                              label={t('name')}
                              value={field?.name}
                              help={'ID: ' + field?.value}
                              size="small"
                              key={index + 'name'}
                              onChange={(e) =>
                                handleFieldChange(index, 'name', e.target.value)
                              }
                              fullWidth
                            />
                          </div>

                          <div className="col-2">
                            <Select
                              disabled={field?.type === 'default'}
                              label={t('type')}
                              size="small"
                              noEmpty
                              key={index + 'type'}
                              value={field.typeData}
                              selections={[
                                {
                                  label: t('text'),
                                  value: 'string',
                                  id: 'string',
                                },
                                {
                                  label: t('number'),
                                  value: 'number',
                                  id: 'number',
                                },
                                {
                                  label: t('boolean'),
                                  value: 'boolean',
                                  id: 'boolean',
                                },
                                { label: t('date'), value: 'date', id: 'date' },
                                {
                                  label: t('dateTime'),
                                  value: 'date-time',
                                  id: 'date-time',
                                },
                                {
                                  label: t('file'),
                                  value: 'media',
                                  id: 'media',
                                },
                                {
                                  label: t('fileSingle'),
                                  value: 'media-single',
                                  id: 'media-single',
                                },
                                {
                                  label: t('fileSinglePrivate'),
                                  value: 'media-single-private',
                                  id: 'media-single-private',
                                },
                                {
                                  label: t('location'),
                                  value: 'geo',
                                  id: 'geo',
                                },
                                {
                                  label: t('selection'),
                                  value: 'selection',
                                  id: 'selection',
                                },
                                {
                                  label: t('dropdown'),
                                  value: 'dropdown',
                                  id: 'dropdown',
                                },
                                {
                                  label: t('status'),
                                  value: 'status',
                                  id: 'status',
                                },
                                {
                                  label: t('slider'),
                                  value: 'slider',
                                  id: 'slider',
                                },
                                {
                                  label: t('signature'),
                                  value: 'signature',
                                  id: 'signature',
                                },
                                {
                                  label: t('page'),
                                  value: 'page',
                                  id: 'page',
                                },
                                {
                                  label: t('section'),
                                  value: 'section',
                                  id: 'section',
                                },
                                // { label: t('tags'), value: 'tags', id: 'tags' },
                                // {
                                //   label: t('search'),
                                //   value: 'search',
                                //   id: 'search',
                                // },
                                // {
                                //   label: t('hookField'),
                                //   value: 'hook',
                                //   id: 'hook',
                                // },
                              ]}
                              onChange={(e, value) =>
                                handleFieldChange(index, 'typeData', value)
                              }
                              fullWidth
                            />
                          </div>

                          <div className="col-2">
                            {field?.typeData !== 'page' &&
                              field?.typeData !== 'section' && (
                                <Select
                                  disabled={field?.typeData !== 'string'}
                                  label={t('transform')}
                                  size="small"
                                  noEmpty
                                  key={index + 'transform'}
                                  value={field?.transform || 'none'}
                                  selections={[
                                    {
                                      label: t('uppercase'),
                                      value: 'uppercase',
                                      id: 'uppercase',
                                    },
                                    {
                                      label: t('lowercase'),
                                      value: 'lowercase',
                                      id: 'lowercase',
                                    },
                                    {
                                      label: t('capitalize'),
                                      value: 'capitalize',
                                      id: 'string',
                                    },
                                    {
                                      label: t('trim'),
                                      value: 'trim',
                                      id: 'trim',
                                    },
                                    {
                                      label: t('none'),
                                      value: 'none',
                                      id: 'none',
                                    },
                                  ]}
                                  onChange={(e, value) =>
                                    handleFieldChange(index, 'transform', value)
                                  }
                                  fullWidth
                                />
                              )}
                          </div>

                          <div className="col-2">
                            {field?.typeData !== 'page' &&
                              field?.typeData !== 'section' && (
                                <div>
                                  <TextFieldMUI
                                    label={t('regex')}
                                    value={field?.validation || ''}
                                    size="small"
                                    key={index + 'regex' + field?.name}
                                    onChange={(e) =>
                                      handleFieldChange(
                                        index,
                                        'validation',
                                        e.target.value
                                      )
                                    }
                                    fullWidth
                                    InputProps={{
                                      endAdornment: (
                                        <InputAdornment position="end">
                                          <IconButton
                                            onClick={() => {
                                              handleDisplayRegex(index);
                                            }}
                                          >
                                            <SettingsSuggest />
                                          </IconButton>
                                        </InputAdornment>
                                      ),
                                    }}
                                    sx={{
                                      'MuiFormControl-root': {
                                        width: '100%',
                                      },
                                      '.MuiInputBase-input': {
                                        height: '34px',
                                        padding: '2px 10px 2px 10px',
                                      },
                                      '& .MuiFormLabel-root': {
                                        padding: '2px 10px 2px 10px',
                                        borderRadius: '10px',
                                      },
                                      '& .MuiOutlinedInput-root': {
                                        borderRadius: '10px',
                                      },
                                    }}
                                  />
                                  <Menu
                                    anchorEl={displayRegexMenu}
                                    open={Boolean(displayRegexMenu)}
                                    onClose={() => setDisplayRegexMenu(false)}
                                    MenuListProps={{
                                      'aria-labelledby': 'basic-button',
                                    }}
                                    sx={{
                                      '.MuiMenu-paper': {
                                        width: '300px',
                                      },
                                    }}
                                    PaperProps={{
                                      sx: {
                                        width: '300px',
                                        elevation: 1,
                                        boxShadow: '0px 0px 0px 0px',
                                      },
                                    }}
                                  >
                                    <GeneralText
                                      text={t('regex')}
                                      fontSize="14px"
                                      size="bold"
                                      primary={true}
                                      classNameComponent="p-4"
                                      beta
                                    />
                                    <div className="row px-3">
                                      <MenuItem
                                        key={currentRegexIndex + 'regex-email'}
                                        onClick={() => {
                                          handleSelectRegex(
                                            currentRegexIndex,
                                            '/^(([^<>()[]\\.,;:s@"]+(.[^<>()[]\\.,;:s@"]+)*)|(".+"))@(([[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}])|(([a-zA-Z-0-9]+.)+[a-zA-Z]{2,}))$/'
                                          );
                                        }}
                                      >
                                        {t('email')}
                                      </MenuItem>
                                      <MenuItem
                                        key={currentRegexIndex + 'regex-phone'}
                                        onClick={() => {
                                          handleSelectRegex(
                                            currentRegexIndex,
                                            '/^+?d{1,4}?[-. ]?(?(?:d{1,3}?)?[-. ]?)?(?:d{1,4}[-. ]?){2}d{1,9}$/'
                                          );
                                        }}
                                      >
                                        {t('phone')}
                                      </MenuItem>
                                      <MenuItem
                                        key={currentRegexIndex + 'regex-url'}
                                        onClick={() => {
                                          handleSelectRegex(
                                            currentRegexIndex,
                                            '/^(http|https)://[^ "]+$'
                                          );
                                        }}
                                      >
                                        {t('url')}
                                      </MenuItem>
                                      <MenuItem
                                        key={currentRegexIndex + 'regex-number'}
                                        onClick={() => {
                                          handleSelectRegex(
                                            currentRegexIndex,
                                            '/^[0-9]*$/'
                                          );
                                        }}
                                      >
                                        {t('numberOnly')}
                                      </MenuItem>
                                      <MenuItem
                                        key={
                                          currentRegexIndex +
                                          'regex-alphanumeric'
                                        }
                                        onClick={() => {
                                          handleSelectRegex(
                                            currentRegexIndex,
                                            '/^[a-zA-Z0-9]*$/'
                                          );
                                        }}
                                      >
                                        {t('alphanumeric')}
                                      </MenuItem>
                                      <MenuItem
                                        key={
                                          currentRegexIndex + 'regex-tiresize'
                                        }
                                        onClick={() => {
                                          handleSelectRegex(
                                            currentRegexIndex,
                                            '^d{3}/d{2}Rd{2}$'
                                          );
                                        }}
                                      >
                                        {t('tireSize')}
                                      </MenuItem>
                                      <MenuItem
                                        key={currentRegexIndex + 'regex-VIN'}
                                        onClick={() => {
                                          handleSelectRegex(
                                            currentRegexIndex,
                                            '/^[A-HJ-NPR-Z0-9]{17}$/'
                                          );
                                        }}
                                      >
                                        {t('VIN')}
                                      </MenuItem>
                                      <MenuItem
                                        key={
                                          currentRegexIndex + 'regex-address'
                                        }
                                        onClick={() => {
                                          handleSelectRegex(
                                            currentRegexIndex,
                                            '/^[a-zA-Z0-9 .,]*$/'
                                          );
                                        }}
                                      >
                                        {t('address')}
                                      </MenuItem>
                                      <MenuItem
                                        key={
                                          currentRegexIndex +
                                          'regex-oneLetter-oneNumber'
                                        }
                                        onClick={() => {
                                          handleSelectRegex(
                                            currentRegexIndex,
                                            '/^(?=.*[A-Za-z])(?=.*d)[A-Za-zd]{8,}$/'
                                          );
                                        }}
                                      >
                                        {t('oneLetter-oneNumber')}
                                      </MenuItem>
                                    </div>
                                  </Menu>
                                </div>
                              )}
                          </div>

                          <div className="col-2 d-flex align-right middle-content">
                            {field?.typeData !== 'page' &&
                              field?.typeData !== 'section' && (
                                <Tooltip title={t('required')}>
                                  <span>
                                    {field?.required ? (
                                      <IconButton
                                        sx={{ mt: 1 }}
                                        onClick={() =>
                                          setRequired(index, false)
                                        }
                                      >
                                        <CheckBoxIcon />
                                      </IconButton>
                                    ) : (
                                      <IconButton
                                        sx={{ mt: 1 }}
                                        onClick={() => setRequired(index, true)}
                                      >
                                        <CheckBoxOutlineBlankIcon />
                                      </IconButton>
                                    )}
                                  </span>
                                </Tooltip>
                              )}
                            {field?.typeData !== 'page' &&
                              field?.typeData !== 'section' && (
                                <Tooltip title={t('manageConditions')}>
                                  <span>
                                    <IconButton
                                      sx={{ mt: 1 }}
                                      onClick={() =>
                                        openConditionsDrawer(index)
                                      }
                                    >
                                      <ConditionsIcon />
                                    </IconButton>
                                  </span>
                                </Tooltip>
                              )}
                            <Tooltip title={t('publicVisibility')}>
                              <span>
                                {field?.public ? (
                                  <IconButton
                                    sx={{ mt: 1 }}
                                    onClick={() => publicField(index)}
                                  >
                                    <VisibilityIcon />
                                  </IconButton>
                                ) : (
                                  <IconButton
                                    sx={{ mt: 1 }}
                                    onClick={() => publicField(index)}
                                  >
                                    <VisibilityOff />
                                  </IconButton>
                                )}
                              </span>
                            </Tooltip>
                            <Tooltip title={t('delete')}>
                              <span>
                                <IconButton
                                  sx={{ mt: 1 }}
                                  onClick={() => removeField(index)}
                                  disabled={field?.type === 'default'}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </span>
                            </Tooltip>
                            <Tooltip title={t('move')}>
                              <span style={{ marginTop: '10px' }}>
                                <DragHandleOutlinedIcon
                                  htmlColor="#696969"
                                  sx={{ mt: 1 }}
                                />
                              </span>
                            </Tooltip>
                          </div>

                          <div className="col-12">
                            {(field?.typeData === 'selection' ||
                              field?.typeData === 'dropdown' ||
                              field?.typeData === 'slider' ||
                              field?.typeData === 'status') &&
                              renderSelectionManagement(field, index)}
                          </div>
                        </div>
                      </Box>
                    </Box>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </Box>
          )}
        </Droppable>
      </DragDropContext>
      <Button startIcon={<AddCircleOutlineIcon />} onClick={addField}>
        {t('addField')}
      </Button>
      {renderConditionsDrawer()}
    </Box>
  );
};

export default FieldEditor;
