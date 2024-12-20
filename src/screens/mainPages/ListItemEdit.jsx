import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setGeneralStatus } from '../../redux/actions-v2/coreAction';
import Loading from '../../stories/general-components/Loading';
//utilities
import { useTranslation } from 'react-i18next';
import {
  ButtonBase,
  Chip,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Tooltip,
  Typography,
} from '@mui/material';
import GeneralText from '../../stories/general-components/GeneralText';
import {
  CheckCircleOutlined,
  ColorLensOutlined,
  DeleteForeverOutlined,
  LineWeightOutlined,
  NotesOutlined,
  Save,
  ShortTextOutlined,
  SubdirectoryArrowRightOutlined,
  TextDecreaseOutlined,
  TextIncreaseOutlined,
} from '@mui/icons-material';
import nodeAxiosFirebase from '../../utils/nodeAxiosFirebase';
import Close from '@mui/icons-material/Close';
import Avatar from '../../stories/general-components/Avatar';
import FieldComponent from '../../components/@generalComponents/FieldComponent';
import Button from '../../stories/general-components/Button';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import ListView from './components/ListView';

import Select from '../../stories/general-components/Select';
import TextField from '../../stories/general-components/TextField';
import Blocks from '../../stories/layout-components/Block';
import ActionBtn from './components/ActionBtn';
import CardDetails from './components/CardDetails';
import ContentForm from './components/ContentForm';
import Files from './components/Files';
import LogFeed from './components/LogFeed';
import MainCardItems from './components/MainCardItems';
import QuickNote from './components/QuickNote';
import SecCardItems from './components/SecCardItems';
import StatusesEvolution from './components/StatusesEvolution';
import Variants from './components/Variants';
import Map from './components/Map';
import Summary from './components/Summary';

const ListItemEdit = ({
  type,
  data,
  structureId,
  handleClose,
  tabIndex,
  blockIdentifiant,
  currentElementId,
  from,
}) => {
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const currentlangCode = i18n.language;
  const [columns, setColumns] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuType, setMenuType] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [moduleData, setModuleData] = useState({});
  const [selectedMatch, setSelectedMatch] = useState();
  const [selectedType, setSelectedType] = useState('primary');
  const [structureIden, setStructureIden] = useState(
    structureId || data?.structureId
  );
  const [selectedModuleData, setSelectedModuleData] = useState({});

  const [selectedTypeContent, setSelectedTypeContent] = useState(type);
  const [selectedTypeAction, setSelectedTypeAction] = useState('');
  const { elementId, moduleId } = useParams();
  const [onClickAction, setOnClickAction] = useState();
  const [statusesChip, setStatusesChip] = useState([]);
  const [sideOpen, setSideOpen] = useState(false);
  const businessPreference = useSelector((state) => state.core.businessData);
  const currentStatus = useSelector((state) => state.core.status);
  const businessStructure = useSelector(
    (state) => state.core.businessStructure
  );
  const structures = businessStructure?.structures;
  const activeStructure = structures?.find((s) => s.id === structureIden);
  const structureFields = activeStructure?.fields;
  const statusesSelection = structureFields?.find(
    (field) => field?.typeData === 'status'
  )?.selections;

  const getData = async () => {
    try {
      const data = await nodeAxiosFirebase({
        t,
        method: 'POST',
        url: `business/layout`,
        body: {
          moduleId: moduleId,
          type: type,
          lang: currentlangCode,
          structureId: structureId,
          currentElementId: null,
        },
      });
      setModuleData(data);
      setStatusesChip(
        data?.module?.tabs?.[tabIndex || 0]?.statuses || { 0: 'timeStamp' }
      );
    } catch (error) {
      console.error('Error get example');
      dispatch(setGeneralStatus({ status: 'error', error: error }));
    }
  };

  const onDragEnd = (result) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const newColumns = Array.from(columns);
    const [reorderedItem] = newColumns.splice(result.source.index, 1);
    newColumns.splice(result.destination.index, 0, reorderedItem);

    setColumns(newColumns);
  };

  const updateData = async () => {
    try {
      dispatch(
        setGeneralStatus({
          status: 'loading',
          position: 'listLayout-edit',
          type: 'pulse',
        })
      );
      if (moduleId) {
        await nodeAxiosFirebase({
          t,
          method: 'POST',
          url: `business/structure`,
          body: {
            moduleId: moduleId,
            lang: currentlangCode,
            type: 'fields',
            data: {
              tabIndex: tabIndex || 0,
              fieldsData: columns,
            },
          },
        });

        await nodeAxiosFirebase({
          t,
          method: 'POST',
          url: `business/structure`,
          body: {
            moduleId: moduleId,
            lang: currentlangCode,
            type: 'editTab',
            data: {
              tabIndex: tabIndex || 0,
              name: selectedModuleData?.name,
              description: selectedModuleData?.description || '',
              listType: selectedModuleData?.listType || 'listA',
              sort: selectedModuleData?.sort || 'desc',
              sortField: selectedModuleData?.sortField || 'lastUpdate',
              displayTop: selectedModuleData?.displayTop || 'none',
              statuses: statusesChip,
            },
          },
        });
      } else if (structureIden) {
        await nodeAxiosFirebase({
          t,
          method: 'POST',
          url: `business/structure`,
          body: {
            structureId: data?.structureId || structureId,
            type: 'components',
            lang: currentlangCode,
            data: {
              from: from || 'business',
              tabIndex: tabIndex,
              blockIdentifiant: blockIdentifiant,
              componentsData: columns?.map((col) => {
                return {
                  ...col,
                  action: onClickAction,
                };
              }),
            },
          },
        });

        await nodeAxiosFirebase({
          t,
          method: 'POST',
          url: `business/structure`,
          body: {
            type: 'block',
            structureId: data?.structureId || structureId,
            lang: currentlangCode,
            data: {
              from: from || 'business',
              tabIndex: tabIndex,
              blockIdentifiant: blockIdentifiant,
              blockData: {
                type: selectedTypeAction || '',
                structure: structureIden,
                match: selectedMatch,
                contentType: selectedTypeContent,
                action: onClickAction,
              },
            },
          },
        });
      }
      dispatch(
        setGeneralStatus({
          status: 'success',
          position: 'listLayout-edit',
          type: 'pulse',
        })
      );
      handleClose();
    } catch (error) {
      console.error('Error update module data');
      dispatch(setGeneralStatus({ status: 'error', error: error }));
    }
  };

  useEffect(() => {
    setColumns(data?.params || []);
    setSelectedTypeContent(data?.contentType || type);
    setStructureIden(structureId || data?.structureId);
    setOnClickAction(data?.onClick || 'none');
    setSelectedMatch(data?.match || 'id:id');
    setSelectedModuleData(data?.config);
    setSelectedTypeAction(data?.type);
    getData();
  }, [moduleId, structureId, tabIndex, blockIdentifiant]);

  const handleAddColumn = () => {
    setSideOpen(true);
    setMenuOpen(false);
  };

  const handleChangeStructure = (value) => {
    setStructureIden(value);
    setColumns([]);
  };

  const handleOpenMenu = (event, index) => {
    setSelectedIndex(index);
    setMenuType('sub');
    setSideOpen(false);
    setMenuOpen(true);
  };

  const firstElement = moduleData?.item?.reduce((result, field) => {
    result[field?.key] = field?.value;
    return result;
  }, {});

  const handleSelectComponent = (component) => {
    setSelectedTypeAction(component);
  };

  const handleSelectedElement = (element) => {
    setSideOpen(true);
    setSelectedIndex(columns.findIndex((col) => col?.value === element?.value));
    setSelectedType('primary');
  };

  const handleEditElement = (field, element, index, value, type) => {
    if (field === 'remove') {
      setColumns(columns.filter((col, i) => i !== index));
      return;
    }

    const newColumns = columns?.map((col, i) => {
      if (i === index) {
        if (field === 'label') {
          return {
            ...col,
            showLabel: !col?.showLabel,
          };
        } else if (field === 'lessfont') {
          return {
            ...col,
            size: (col?.size || 12) - 1,
          };
        } else if (field === 'morefont') {
          return {
            ...col,
            size: (col?.size || 12) + 1,
          };
        } else if (field === 'weight') {
          return {
            ...col,
            weight: col?.weight === 'regular' ? 'bold' : 'regular',
          };
        } else if (field === 'width') {
          return {
            ...col,
            width:
              col?.width === 10
                ? 20
                : col?.width === 20
                ? 30
                : col?.width === 30
                ? 40
                : col?.width === 40
                ? 10
                : 10,
          };
        } else if (field === 'type') {
          return {
            ...col,
            fieldType: value,
          };
        } else if (field === 'sub') {
          return {
            ...col,
            sub: {
              value: value,
              fieldType: 'text',
              typeValue: type,
            },
          };
        } else if (field === 'action') {
          return {
            ...col,
            action: col?.action === 'edit' ? 'view' : 'edit',
          };
        } else if (field === 'color') {
          return {
            ...col,
            valueColor:
              col?.valueColor === businessPreference?.mainColor
                ? 'primary'
                : col?.valueColor === 'primary'
                ? businessPreference?.secColor
                : businessPreference?.mainColor,
          };
        }
      }
      return col;
    });
    setColumns(newColumns);
    setMenuType('');
  };

  const handleNewColSelected = (selectedField, fieldType) => {
    if (type === 'list') {
      setColumns([
        ...columns,
        {
          action: 'none',
          fieldType: fieldType,
          weight: 'regular',
          sub: {},
          size: 12,
          type: selectedField?.field?.typeData,
          typeValue: selectedField?.field?.typeData,
          value:
            selectedField?.value === 'targetId'
              ? 'targetName'
              : selectedField?.value === 'targetProfileId'
              ? 'targetProfileName'
              : selectedField?.value === 'dependencyId'
              ? 'dependencyName'
              : selectedField?.value,
          structureValue: selectedField?.key,
          showLabel: true,
          width: 30,
          markdown: false,
          valueColor: 'primary',
        },
      ]);
    } else {
      setColumns([
        ...columns,
        {
          value:
            selectedField?.value === 'targetId'
              ? 'targetName'
              : selectedField?.value === 'targetProfileId'
              ? 'targetProfileName'
              : selectedField?.value === 'dependencyId'
              ? 'dependencyName'
              : selectedField?.value,
          showLabel: true,
          action: 'none',
          markdown: false,
          size: 12,
          sub: {},
          type: selectedField?.field?.typeData,
          typeValue: selectedField?.field?.typeData,
          structureId: structureId,
          weight: 'regular',
          structureValue: selectedField?.key,
          valueColor: 'primary',
          fieldType: fieldType,
        },
      ]);
    }
    setSideOpen(false);
  };

  const componentResolver = (component) => {
    switch (component) {
      case 'actionBtn':
        return <ActionBtn color={businessPreference?.mainColor} />;
      case 'cardDetails':
        return <CardDetails color={businessPreference?.mainColor} />;
      case 'contentForm':
        return <ContentForm color={businessPreference?.mainColor} />;
      case 'files':
        return <Files color={businessPreference?.mainColor} />;
      case 'logFeed':
        return <LogFeed color={businessPreference?.mainColor} />;
      case 'map':
        return <Map color={businessPreference?.mainColor} />;
      case 'mainCardItems':
        return <MainCardItems color={businessPreference?.mainColor} />;
      case 'quickNote':
        return <QuickNote color={businessPreference?.mainColor} />;
      case 'secCardItems':
        return <SecCardItems color={businessPreference?.mainColor} />;
      case 'statusesEvolution':
        return <StatusesEvolution color={businessPreference?.mainColor} />;
      case 'variants':
        return <Variants color={businessPreference?.mainColor} />;
      case 'summary':
        return <Summary color={businessPreference?.mainColor} />;
      default:
        return '';
    }
  };

  const connectResolver = () => {
    const allElements = [
      {
        label: t('currentElement'),
        id: 'id:id',
        value: 'id:id',
        type: ['content', 'action'],
      },
      {
        label: t('targetBoth'),
        id: 'targetId:targetId',
        value: 'targetId:targetId',
        type: ['list', 'content'],
      },
      {
        label: t('dependencyBoth'),
        id: 'dependencyId:dependencyId',
        value: 'dependencyId:dependencyId',
        type: [],
      },
      {
        label: t('profileBoth'),
        id: 'targetProfileId:targetProfileId',
        value: 'targetProfileId:targetProfileId',
        type: [],
      },
      {
        label: t('currentProfileDepElement'),
        id: 'targetProfileId:dependencyId',
        value: 'targetProfileId:dependencyId',
        type: [],
      },
      {
        label: t('currentTargetDepElement'),
        id: 'targetId:dependencyId',
        value: 'targetId:dependencyId',
        type: [],
      },
      {
        label: t('dependencyTargetProfile'),
        id: 'dependencyId:targetProfileId',
        value: 'dependencyId:targetProfileId',
        type: [],
      },
      {
        label: t('dependencyTarget'),
        id: 'dependencyId:targetId',
        value: 'dependencyId:targetId',
        type: [],
      },
      {
        label: t('currentIdDepElement'),
        id: 'id:dependencyId',
        value: 'id:dependencyId',
        type: [],
      },
      {
        label: t('currentIdTargetProfile'),
        id: 'id:targetProfileId',
        value: 'id:targetProfileId',
        type: [],
      },
      {
        label: t('currentIdTarget'),
        id: 'id:targetId',
        value: 'id:targetId',
        type: [],
      },
    ];

    return allElements?.filter((element) => {
      return element?.type?.includes(selectedTypeContent);
    });
  };

  const components = [
    {
      label: t('logFeed'),
      id: 'logFeed',
      value: 'logFeed',
    },
    {
      label: t('quickNote'),
      id: 'quickNote',
      value: 'quickNote',
    },
    {
      label: t('variants'),
      id: 'variants',
      value: 'variants',
    },
    {
      label: t('itemsCard'),
      id: 'mainCardItems',
      value: 'mainCardItems',
    },
    {
      label: t('secItemsCard'),
      id: 'secCardItems',
      value: 'secCardItems',
    },
    {
      label: t('contentForm'),
      id: 'contentForm',
      value: 'contentForm',
    },
    {
      label: t('files'),
      id: 'files',
      value: 'files',
    },
    {
      label: t('map'),
      id: 'map',
      value: 'map',
    },
    {
      label: t('actionBtn'),
      id: 'actionBtn',
      value: 'actionBtn',
    },
    {
      label: t('cardDetails'),
      id: 'cardDetails',
      value: 'cardDetails',
    },
    {
      label: t('statusesEvolution'),
      id: 'statusesEvolution',
      value: 'statusesEvolution',
    },
    {
      label: t('summary'),
      id: 'summary',
      value: 'summary',
    },
  ];

  return (
    <div
      style={{
        height: '85vh',
        marginTop: '4px',
        borderRadius: '10px',
      }}
      className="p-3"
    >
      {currentStatus?.status === 'loading' &&
      currentStatus?.position === 'listLayout-edit' ? (
        <div>
          <Loading type={'logo'} size="medium" />
        </div>
      ) : (
        <div>
          <div className="d-flex justify-content-between">
            <div className="align-left mt-2">
              <GeneralText
                primary={true}
                size="bold"
                fontSize="16px"
                text={type === 'list' ? t('editList') : t('editBlock')}
              />
            </div>
            <div className="align-right">
              <IconButton onClick={updateData}>
                <Save />
              </IconButton>
              <IconButton onClick={handleClose}>
                <Close />
              </IconButton>
            </div>
          </div>
          <div className="row mt-3">
            <div
              style={{
                minHeight: '240px',
              }}
              className={
                menuOpen || sideOpen ? 'col-10 px-4 mt-4' : 'col-12 px-4 mt-4'
              }
            >
              <div
                className="row p-3"
                style={{
                  height: '100%',
                  alignContent: 'flex-start',
                  alignItems: 'flex-start',
                  justifyContent: 'flex-start',
                  flexDirection: 'column',
                  borderRadius: '6px',
                  border: '1px solid #f1f3f4',
                }}
              >
                <div className="mb-3 row">
                  {moduleId && (
                    <div className="col-3">
                      <TextField
                        value={selectedModuleData?.name || ''}
                        size="small"
                        fullWidth
                        onChange={(e, value) =>
                          setSelectedModuleData({
                            ...selectedModuleData,
                            name: e.target.value,
                          })
                        }
                        label={t('name')}
                      />
                    </div>
                  )}
                  {moduleId && (
                    <div className="col-3">
                      <Select
                        value={selectedModuleData?.listType || 'listA'}
                        size="small"
                        noEmpty
                        fullWidth
                        onChange={(e, value) =>
                          setSelectedModuleData({
                            ...selectedModuleData,
                            listType: value,
                          })
                        }
                        label={t('type')}
                        selections={[
                          {
                            label: t('list'),
                            id: 'listA',
                            value: 'listA',
                          },
                          {
                            label: t('listSimple'),
                            id: 'listS',
                            value: 'listS',
                          },
                          {
                            label: t('listGroup'),
                            id: 'listF',
                            value: 'listF',
                          },
                          {
                            label: t('grid'),
                            id: 'grid',
                            value: 'grid',
                          },
                          {
                            label: t('table'),
                            id: 'table',
                            value: 'table',
                          },

                          {
                            label: t('kanban'),
                            id: 'kanban',
                            value: 'kanban',
                          },
                          {
                            label: t('calendar'),
                            id: 'calendar',
                            value: 'calendar',
                          },
                        ]}
                      />
                    </div>
                  )}
                  {moduleId && (
                    <div className="col-2">
                      <Select
                        value={selectedModuleData?.sort || 'desc'}
                        size="small"
                        fullWidth
                        noEmpty
                        onChange={(e, value) =>
                          setSelectedModuleData({
                            ...selectedModuleData,
                            sort: value,
                          })
                        }
                        label={t('sort')}
                        selections={[
                          {
                            label: t('descen'),
                            id: 'desc',
                            value: 'desc',
                          },
                          {
                            label: t('asc'),
                            id: 'asc',
                            value: 'asc',
                          },
                        ]}
                      />
                    </div>
                  )}
                  {moduleId && (
                    <div className="col-2">
                      <Select
                        value={selectedModuleData?.sortField || 'lastUpdate'}
                        size="small"
                        fullWidth
                        noEmpty
                        onChange={(e, value) =>
                          setSelectedModuleData({
                            ...selectedModuleData,
                            sortField: value,
                          })
                        }
                        label={t('sortField')}
                        selections={[
                          {
                            label: t('status'),
                            id: 'status',
                            value: 'status',
                          },
                          {
                            label: t('name'),
                            id: 'name',
                            value: 'name',
                          },
                          {
                            label: t('date'),
                            id: 'date',
                            value: 'date',
                          },
                          {
                            label: t('lastUpdate'),
                            id: 'lastUpdate',
                            value: 'lastUpdate',
                          },
                          {
                            label: t('lastRead'),
                            id: 'lastRead',
                            value: 'lastRead',
                          },
                          {
                            label: t('timeStamp'),
                            id: 'timeStamp',
                            value: 'timeStamp',
                          },
                        ]}
                      />
                    </div>
                  )}
                  {moduleId && (
                    <div className="col-2">
                      <Select
                        value={selectedModuleData?.displayTop || 'none'}
                        size="small"
                        noEmpty
                        fullWidth
                        onChange={(e, value) =>
                          setSelectedModuleData({
                            ...selectedModuleData,
                            displayTop: value,
                          })
                        }
                        label={t('display')}
                        selections={[
                          {
                            label: t('statuses'),
                            id: 'statuses',
                            value: 'statuses',
                          },
                          {
                            label: t('none'),
                            id: 'none',
                            value: 'none',
                          },
                        ]}
                      />
                    </div>
                  )}
                  {elementId && selectedMatch && (
                    <div className="col-3">
                      <Select
                        value={selectedMatch}
                        size="small"
                        fullWidth
                        noEmpty
                        onChange={(e, value) => setSelectedMatch(value)}
                        label={t('match')}
                        selections={connectResolver()}
                      />
                    </div>
                  )}
                  {elementId && selectedTypeContent && (
                    <div className="col-2">
                      <Select
                        value={selectedTypeContent || 'content'}
                        size="small"
                        noEmpty
                        fullWidth
                        onChange={(e, value) => setSelectedTypeContent(value)}
                        label={t('type')}
                        selections={[
                          {
                            label: t('content'),
                            id: 'content',
                            value: 'content',
                          },
                          {
                            label: t('list'),
                            id: 'list',
                            value: 'list',
                          },
                          {
                            label: t('component'),
                            id: 'action',
                            value: 'action',
                          },
                        ]}
                      />
                    </div>
                  )}
                  {elementId && structureIden && (
                    <div className="col-3">
                      <Select
                        value={structureIden}
                        size="small"
                        noEmpty
                        fullWidth
                        onChange={(e, value) => handleChangeStructure(value)}
                        label={t('structure')}
                        selections={structures?.map((structure) => {
                          return {
                            label: structure?.name,
                            id: structure?.id,
                            value: structure?.id,
                          };
                        })}
                      />
                    </div>
                  )}
                  {elementId && onClickAction && (
                    <div className="col-2">
                      <Select
                        value={onClickAction || 'none'}
                        size="small"
                        noEmpty
                        fullWidth
                        onChange={(e, value) => setOnClickAction(value)}
                        label={t('onClick')}
                        selections={[
                          {
                            label: t('none'),
                            id: 'none',
                            value: 'none',
                          },
                          {
                            label: t('edit'),
                            id: 'edit',
                            value: 'edit',
                          },
                          {
                            label: t('openParent'),
                            id: 'openParent',
                            value: 'openParent',
                          },
                          {
                            label:
                              selectedTypeContent === 'list'
                                ? t('quickview')
                                : t('copy'),
                            id:
                              selectedTypeContent === 'list'
                                ? 'quickview'
                                : 'copy',
                            value:
                              selectedTypeContent === 'list'
                                ? 'quickview'
                                : 'copy',
                          },
                          {
                            label: t('navigate'),
                            id: 'navigate',
                            value: 'navigate',
                          },
                        ]}
                      />
                    </div>
                  )}
                </div>
                {elementId && <Divider component="div" />}
                <DragDropContext onDragEnd={onDragEnd}>
                  {(selectedTypeContent === 'list' ||
                    selectedTypeContent === 'listF' ||
                    selectedTypeContent === 'listS') && (
                    <div>
                      <ListView
                        columns={columns}
                        firstElement={firstElement}
                        handleEditElement={handleEditElement}
                        handleSelectedElement={handleSelectedElement}
                        selectedIndex={selectedIndex}
                        handleOpenMenu={handleOpenMenu}
                        handleAddColumn={handleAddColumn}
                        onDragEnd={onDragEnd}
                        selectedModuleData={selectedModuleData}
                      />
                    </div>
                  )}
                  {moduleId && selectedTypeContent === 'kanban' && (
                    <>
                      <div className="row mb-4">
                        <div className="col-5 justify-content-between middle-content">
                          <Blocks heightPercentage={26} height={1}>
                            <div className="row">
                              <div
                                onClick={() =>
                                  handleSelectedElement(columns[0])
                                }
                                className="col-9"
                              >
                                <GeneralText
                                  primary={
                                    columns?.[0]?.valueColor === 'primary'
                                      ? true
                                      : false
                                  }
                                  size={columns?.[0]?.weight || 'medium'}
                                  fontSize={columns?.[0]?.size + 'px' || '14px'}
                                  label={''}
                                  structureId={columns?.[0]?.structureId}
                                  text={
                                    firstElement?.[columns?.[0]?.value] || '-'
                                  }
                                  color={columns?.[0]?.valueColor}
                                  type={columns?.[0]?.typeValue || 'string'}
                                  onClick={() =>
                                    handleSelectedElement(columns[0])
                                  }
                                />
                                {selectedModuleData?.listType !== 'listS' && (
                                  <div>
                                    <GeneralText
                                      primary={true}
                                      size={'regular'}
                                      fontSize={'12px'}
                                      label={''}
                                      structureId={columns?.[0]?.structureId}
                                      text={
                                        firstElement?.[
                                          columns[0]?.sub?.value
                                        ] || '-'
                                      }
                                      color={columns?.[0]?.sub?.valueColor}
                                      type={
                                        columns[0]?.sub?.typeValue || 'string'
                                      }
                                      onClick={() =>
                                        handleSelectedElement(columns[0])
                                      }
                                    />
                                  </div>
                                )}
                              </div>
                              <div className="col-3"></div>
                              <div
                                onClick={() =>
                                  handleSelectedElement(columns[1])
                                }
                                className="col-7 mt-4"
                              >
                                <GeneralText
                                  primary={
                                    columns?.[1]?.valueColor === 'primary'
                                      ? true
                                      : false
                                  }
                                  size={columns?.[1]?.weight || 'medium'}
                                  fontSize={columns?.[1]?.size + 'px' || '14px'}
                                  label={''}
                                  structureId={columns?.[1]?.structureId}
                                  text={
                                    firstElement?.[columns?.[1]?.value] || '-'
                                  }
                                  color={columns?.[1]?.valueColor}
                                  type={columns?.[1]?.typeValue || 'string'}
                                  onClick={() =>
                                    handleSelectedElement(columns[1])
                                  }
                                />
                                {selectedModuleData?.listType !== 'listS' && (
                                  <div>
                                    <GeneralText
                                      primary={true}
                                      size={'regular'}
                                      fontSize={'10px'}
                                      label={''}
                                      structureId={columns?.[1]?.structureId}
                                      text={
                                        firstElement?.[
                                          columns[1]?.sub?.value
                                        ] || '-'
                                      }
                                      color={columns?.[1]?.sub?.valueColor}
                                      type={
                                        columns[1]?.sub?.typeValue || 'string'
                                      }
                                      onClick={() =>
                                        handleSelectedElement(columns[1])
                                      }
                                    />
                                  </div>
                                )}
                              </div>
                              <div className="col-5 mt-4">
                                <div
                                  style={{
                                    borderRadius: '10px',
                                    height: '30px',
                                    padding: '4px',
                                    backgroundColor:
                                      businessPreference?.mainColor,
                                  }}
                                ></div>
                              </div>
                            </div>
                          </Blocks>
                        </div>
                        <div className="col-7">
                          <div className="mt-3 px-4 ">
                            <div className="row">
                              <div className="col-1">
                                <Tooltip title={t('reduce')}>
                                  <IconButton
                                    onClick={() =>
                                      handleEditElement(
                                        'lessfont',
                                        columns[0],
                                        0
                                      )
                                    }
                                  >
                                    <TextDecreaseOutlined />
                                  </IconButton>
                                </Tooltip>
                              </div>
                              <div className="col-1">
                                <Tooltip title={t('more')}>
                                  <IconButton
                                    onClick={() =>
                                      handleEditElement(
                                        'morefont',
                                        columns[0],
                                        0
                                      )
                                    }
                                  >
                                    <TextIncreaseOutlined />
                                  </IconButton>
                                </Tooltip>
                              </div>
                              {selectedModuleData?.listType !== 'listS' && (
                                <div className="col-1">
                                  <Tooltip title={t('subData')}>
                                    <IconButton
                                      onClick={(event) =>
                                        handleOpenMenu(event, 0)
                                      }
                                    >
                                      <SubdirectoryArrowRightOutlined />
                                    </IconButton>
                                  </Tooltip>
                                </div>
                              )}
                              <div className="col-1">
                                <Tooltip title={t('weight')}>
                                  <IconButton
                                    onClick={() =>
                                      handleEditElement('weight', columns[0], 0)
                                    }
                                  >
                                    <LineWeightOutlined />
                                  </IconButton>
                                </Tooltip>
                              </div>

                              <div className="col-1">
                                <Tooltip title={t('color')}>
                                  <IconButton
                                    onClick={() =>
                                      handleEditElement('color', columns[0], 0)
                                    }
                                  >
                                    <ColorLensOutlined />
                                  </IconButton>
                                </Tooltip>
                              </div>
                            </div>
                            <Divider component="div" />
                          </div>

                          <div className="mt-3 px-4 ">
                            <div className="row">
                              <div className="col-1">
                                <Tooltip title={t('reduce')}>
                                  <IconButton
                                    onClick={() =>
                                      handleEditElement(
                                        'lessfont',
                                        columns[1],
                                        1
                                      )
                                    }
                                  >
                                    <TextDecreaseOutlined />
                                  </IconButton>
                                </Tooltip>
                              </div>
                              <div className="col-1">
                                <Tooltip title={t('more')}>
                                  <IconButton
                                    onClick={() =>
                                      handleEditElement(
                                        'morefont',
                                        columns[1],
                                        1
                                      )
                                    }
                                  >
                                    <TextIncreaseOutlined />
                                  </IconButton>
                                </Tooltip>
                              </div>
                              {selectedModuleData?.listType !== 'listS' && (
                                <div className="col-1">
                                  <Tooltip title={t('subData')}>
                                    <IconButton
                                      onClick={(event) =>
                                        handleOpenMenu(event, 1)
                                      }
                                    >
                                      <SubdirectoryArrowRightOutlined />
                                    </IconButton>
                                  </Tooltip>
                                </div>
                              )}
                              <div className="col-1">
                                <Tooltip title={t('weight')}>
                                  <IconButton
                                    onClick={() =>
                                      handleEditElement('weight', columns[1], 1)
                                    }
                                  >
                                    <LineWeightOutlined />
                                  </IconButton>
                                </Tooltip>
                              </div>

                              <div className="col-1">
                                <Tooltip title={t('color')}>
                                  <IconButton
                                    onClick={() =>
                                      handleEditElement('color', columns[1], 1)
                                    }
                                  >
                                    <ColorLensOutlined />
                                  </IconButton>
                                </Tooltip>
                              </div>
                            </div>
                            <Divider component="div" />
                          </div>
                        </div>
                      </div>
                      <Divider component="div" />
                      {statusesChip?.['0'] && (
                        <div className="row mt-4">
                          {statusesSelection?.map((status, index) => (
                            <div className="col-2" key={index}>
                              <Select
                                value={statusesChip?.[index] || 'none'}
                                size="small"
                                noEmpty
                                key={index + moduleId}
                                fullWidth
                                onChange={(e, value) =>
                                  setStatusesChip({
                                    ...statusesChip,
                                    [status?.value]: value,
                                  })
                                }
                                label={status?.label}
                                selections={[
                                  {
                                    label: t('relativeTargetDate'),
                                    id: 'relativeTargetDate',
                                    value: 'relativeTargetDate',
                                  },
                                  {
                                    label: t('relativeTimeStamp'),
                                    id: 'relativeTimeStamp',
                                    value: 'relativeTimeStamp',
                                  },
                                  {
                                    label: t('relativeLastUpdate'),
                                    id: 'relativeLastUpdate',
                                    value: 'relativeLastUpdate',
                                  },
                                  {
                                    label: t('relativeStartDate'),
                                    id: 'relativeStartDate',
                                    value: 'relativeStartDate',
                                  },
                                  {
                                    label: t('relativeEndDate'),
                                    id: 'relativeEndDate',
                                    value: 'relativeEndDate',
                                  },
                                  {
                                    label: t('targetDate'),
                                    id: 'targetDate',
                                    value: 'targetDate',
                                  },
                                  {
                                    label: t('timeStamp'),
                                    id: 'timeStamp',
                                    value: 'timeStamp',
                                  },
                                  {
                                    label: t('lastUpdate'),
                                    id: 'lastUpdate',
                                    value: 'lastUpdate',
                                  },
                                  {
                                    label: t('startDate'),
                                    id: 'startDate',
                                    value: 'startDate',
                                  },
                                  {
                                    label: t('startDateTime'),
                                    id: 'startDateTime',
                                    value: 'startDateTime',
                                  },
                                  {
                                    label: t('endDate'),
                                    id: 'endDate',
                                    value: 'endDate',
                                  },
                                  {
                                    label: t('endDateTime'),
                                    id: 'endDateTime',
                                    value: 'endDateTime',
                                  },
                                  {
                                    label: t('targetTime'),
                                    id: 'targetTime',
                                    value: 'targetTime',
                                  },
                                  {
                                    label: t('updatedTime'),
                                    id: 'updatedTime',
                                    value: 'updatedTime',
                                  },
                                  {
                                    label: t('realStartTime'),
                                    id: 'realStartTime',
                                    value: 'realStartTime',
                                  },
                                  {
                                    label: t('realEndTime'),
                                    id: 'realEndTime',
                                    value: 'realEndTime',
                                  },
                                  {
                                    label: t('duration'),
                                    id: 'duration',
                                    value: 'duration',
                                  },
                                  {
                                    label: t('durationReal'),
                                    id: 'durationReal',
                                    value: 'durationReal',
                                  },
                                ]}
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                  {selectedTypeContent === 'content' && (
                    <div>
                      <Droppable droppableId="content">
                        {(provided) => (
                          <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                          >
                            {columns?.map((element, index) => (
                              <Draggable
                                key={index}
                                draggableId={index.toString()}
                                index={index}
                              >
                                {(provided) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                  >
                                    <div key={index} className="mt-3 px-4 ">
                                      <div className="row">
                                        <div
                                          style={{
                                            overflow: 'hidden',
                                            height: '40px',
                                          }}
                                          className="col-5"
                                        >
                                          {element?.type === 'field' ? (
                                            <FieldComponent
                                              key={element?.structureValue}
                                              field={{
                                                typeData: element?.typeValue,
                                                label: element?.label,
                                                name: element?.label,
                                                selections: element?.selections,
                                                value: element?.structureValue,
                                              }}
                                              defaultValue={
                                                element?.structureValue
                                              }
                                              value={element?.value || ''}
                                              onClick={() =>
                                                handleSelectedElement(element)
                                              }
                                            />
                                          ) : (
                                            <GeneralText
                                              primary={
                                                element?.valueColor ===
                                                'primary'
                                                  ? true
                                                  : false
                                              }
                                              size={
                                                element?.weight || 'regular'
                                              }
                                              fontSize={
                                                element?.size + 'px' || '12px'
                                              }
                                              label={
                                                (element?.showLabel &&
                                                  element?.label) ||
                                                ''
                                              }
                                              structureId={element?.structureId}
                                              text={element?.value || ''}
                                              color={element?.valueColor}
                                              type={
                                                element?.typeValue || 'string'
                                              }
                                              onClick={() =>
                                                handleSelectedElement(element)
                                              }
                                            />
                                          )}
                                        </div>
                                        <div className="col-7 d-flex">
                                          <div className="col-2">
                                            <ButtonBase
                                              onClick={() =>
                                                handleEditElement(
                                                  'label',
                                                  element,
                                                  index
                                                )
                                              }
                                              style={{ paddingLeft: '3px' }}
                                            >
                                              {element?.showLabel ? (
                                                <NotesOutlined color="black" />
                                              ) : (
                                                <ShortTextOutlined color="black" />
                                              )}
                                              <Typography
                                                color="black"
                                                variant="caption"
                                                style={{
                                                  fontSize: '10px',
                                                  marginLeft: '2px',
                                                }}
                                              >
                                                {t('label')}
                                              </Typography>
                                            </ButtonBase>
                                          </div>

                                          <div className="col-2">
                                            <ButtonBase
                                              onClick={() =>
                                                handleEditElement(
                                                  'lessfont',
                                                  element,
                                                  index
                                                )
                                              }
                                              style={{ paddingLeft: '3px' }}
                                            >
                                              <TextDecreaseOutlined color="black" />
                                              <Typography
                                                color="black"
                                                variant="caption"
                                                style={{
                                                  fontSize: '10px',
                                                  marginLeft: '2px',
                                                }}
                                              >
                                                {t('reduce')}
                                              </Typography>
                                            </ButtonBase>
                                          </div>
                                          <div className="col-2">
                                            <ButtonBase
                                              onClick={() =>
                                                handleEditElement(
                                                  'morefont',
                                                  element,
                                                  index
                                                )
                                              }
                                              style={{ paddingLeft: '3px' }}
                                            >
                                              <TextIncreaseOutlined color="black" />
                                              <Typography
                                                color="black"
                                                variant="caption"
                                                style={{
                                                  fontSize: '10px',
                                                  marginLeft: '2px',
                                                }}
                                              >
                                                {t('more')}
                                              </Typography>
                                            </ButtonBase>
                                          </div>

                                          <div className="col-2">
                                            <ButtonBase
                                              onClick={() =>
                                                handleEditElement(
                                                  'weight',
                                                  element,
                                                  index
                                                )
                                              }
                                              style={{ paddingLeft: '3px' }}
                                            >
                                              <LineWeightOutlined color="black" />
                                              <Typography
                                                color="black"
                                                variant="caption"
                                                style={{
                                                  fontSize: '10px',
                                                  marginLeft: '2px',
                                                }}
                                              >
                                                {t('weight')}
                                              </Typography>
                                            </ButtonBase>
                                          </div>

                                          <div className="col-2">
                                            <ButtonBase
                                              onClick={() =>
                                                handleEditElement(
                                                  'color',
                                                  element,
                                                  index
                                                )
                                              }
                                              style={{ paddingLeft: '3px' }}
                                            >
                                              <ColorLensOutlined color="black" />
                                              <Typography
                                                color="black"
                                                variant="caption"
                                                style={{
                                                  fontSize: '10px',
                                                  marginLeft: '2px',
                                                }}
                                              >
                                                {t('color')}
                                              </Typography>
                                            </ButtonBase>
                                          </div>
                                          <div className="col-2">
                                            <ButtonBase
                                              onClick={() =>
                                                handleEditElement(
                                                  'remove',
                                                  element,
                                                  index
                                                )
                                              }
                                              style={{ paddingLeft: '3px' }}
                                            >
                                              <DeleteForeverOutlined color="black" />
                                              <Typography
                                                color="black"
                                                variant="caption"
                                                style={{
                                                  fontSize: '10px',
                                                  marginLeft: '2px',
                                                }}
                                              >
                                                {t('delete')}
                                              </Typography>
                                            </ButtonBase>
                                          </div>
                                        </div>
                                      </div>
                                      <Divider component="div" />
                                    </div>
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>

                      <div className="mt-3 mx-3">
                        <Button
                          label={t('addNew')}
                          variant={'text'}
                          onClick={handleAddColumn}
                          primary={true}
                          endIcon="Add"
                          size="small"
                        />{' '}
                      </div>
                    </div>
                  )}
                  {selectedTypeContent === 'action' && selectedTypeAction && (
                    <div className="row mt-3">
                      {components?.map((component) => (
                        <div
                          key={component?.id}
                          className="col-2 align-c"
                          style={{
                            cursor: 'pointer',
                          }}
                          onClick={() =>
                            handleSelectComponent(component?.value)
                          }
                        >
                          <div
                            style={{
                              border: '1px solid #69696950',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              position: 'relative',
                              textAlign: 'center',
                              height: '110px',
                              backgroundColor:
                                businessPreference?.mainColor + '03',
                              overflow: 'hidden',
                              maxWidth: '120px',
                              flexDirection: 'column',
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}
                            className="p-2 mb-3 align-c"
                          >
                            {selectedTypeAction === component?.value && (
                              <div>
                                <CheckCircleOutlined
                                  style={{
                                    position: 'absolute',
                                    top: '0',
                                    right: '0',
                                    padding: '3px',
                                    color: 'green',
                                  }}
                                />
                              </div>
                            )}
                            <div
                              style={{
                                height: '70px',
                                maxWidth: '120px',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                padding: '12px',
                              }}
                            >
                              {componentResolver(component?.value)}
                            </div>
                            <div className="mt-2" style={{ height: '20px' }}>
                              <GeneralText
                                primary={true}
                                size="medium"
                                fontSize="11px"
                                text={component?.label}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </DragDropContext>
              </div>
            </div>
            <div className={sideOpen ? 'col-2 mt-4' : 'hide'}>
              {sideOpen && selectedType !== 'width' && (
                <div
                  className="row p-3"
                  style={{
                    height: '55vh',
                    overflowX: 'scroll',
                    zIndex: 100000,
                    position: 'relative',
                    backgroundColor: '#f9f9f9',
                    borderRadius: '6px',
                    border: '1px solid #f1f3f4',
                  }}
                >
                  {moduleData?.item?.map((field, index) => (
                    <div className="col-12">
                      <div
                        key={index}
                        style={{
                          border: '1px solid #69696950',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          height: '70px',
                          backgroundColor: businessPreference?.mainColor + '03',
                          overflow: 'hidden',
                        }}
                        className="p-2 align-left mb-3"
                        onClick={() => handleNewColSelected(field)}
                      >
                        <div>
                          <div>
                            {(field?.field?.typeData === 'text' ||
                              field?.field?.typeData === 'string' ||
                              field?.field?.typeData === 'money' ||
                              field?.field?.typeData === 'selection' ||
                              field?.field?.typeData === 'date' ||
                              field?.field?.typeData === 'date-time' ||
                              field?.field?.typeData === 'tags' ||
                              field?.field?.typeData === 'status') && (
                              <GeneralText
                                primary={true}
                                size="medium"
                                fontSize="11px"
                                structureId={structureId}
                                text={
                                  field?.field?.selections?.length > 0
                                    ? field?.field?.selections?.find(
                                        (selection) =>
                                          selection?.value === field?.value
                                      )?.['label_' + currentlangCode]
                                    : field?.value ?? '-'
                                }
                                type={field?.field?.typeData}
                              />
                            )}
                            {field?.field?.typeData === 'custom:statuses' && (
                              <div className="d-flex-3d">
                                {[0, 1, 2, 3].map((status) => {
                                  const statusCount =
                                    field?.value?.[`status${status}`] ?? 0;
                                  return (
                                    <div
                                      key={status}
                                      style={{
                                        backgroundColor:
                                          businessPreference?.mainColor,
                                        width: '25px',
                                      }}
                                      className="status-square"
                                    >
                                      {statusCount}
                                    </div>
                                  );
                                })}
                              </div>
                            )}

                            {field?.field?.typeData === 'avatar' ||
                              (field?.field?.typeData === 'media' && (
                                <Avatar
                                  img={field?.value ?? ''}
                                  name={firstElement?.name ?? ''}
                                  alt={field?.value ?? ''}
                                  sx={{
                                    maxWidth: `${'40px !important'}`,
                                    maxHeight: `${'40px !important'}`,
                                    borderRadius: '6px !important',
                                    padding: '4px',
                                  }}
                                />
                              ))}
                          </div>
                          <div>
                            <GeneralText
                              primary={true}
                              size="regular"
                              fontSize="9px"
                              structureId={''}
                              text={field?.label}
                              type={'string'}
                              classNameComponent="grey-text"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className={menuOpen ? 'col-2 mt-4' : 'hide'}>
              {menuOpen && (
                <div
                  className="row p-3"
                  style={{
                    height: '55vh',
                    overflow: 'scroll',
                    zIndex: 100000,
                    borderRadius: '6px',
                    border: '1px solid #f1f3f4',
                  }}
                >
                  {menuType === 'sub' && (
                    <List>
                      <div className="col-12">
                        <div
                          style={{
                            border: '1px solid #f1f3f4',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            height: '70px',
                            backgroundColor:
                              businessPreference?.mainColor + '03',
                          }}
                          className="p-2 align-left mb-3"
                          onClick={() =>
                            handleEditElement(
                              'sub',
                              columns[selectedIndex],
                              selectedIndex,
                              ''
                            )
                          }
                        >
                          <div>
                            <div>
                              <GeneralText
                                primary={true}
                                size="medium"
                                fontSize="11px"
                                text={t('noData')}
                                type={'text'}
                                label={t('empty')}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      {moduleData?.item?.map((field, index) => (
                        <div className="col-12">
                          {(field?.field?.typeData === 'text' ||
                            field?.field?.typeData === 'string' ||
                            field?.field?.typeData === 'money' ||
                            field?.field?.typeData === 'date') && (
                            <div
                              key={index}
                              style={{
                                border: '1px solid #f1f3f4',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                height: '70px',
                                backgroundColor:
                                  businessPreference?.mainColor + '03',
                              }}
                              className="p-2 align-left mb-3"
                              onClick={() =>
                                handleEditElement(
                                  'sub',
                                  columns[selectedIndex],
                                  selectedIndex,
                                  field?.key,
                                  field?.field?.typeData
                                )
                              }
                            >
                              <div>
                                <div>
                                  <GeneralText
                                    primary={true}
                                    size="medium"
                                    fontSize="11px"
                                    structureId={structureId}
                                    text={
                                      field?.field?.selections?.length > 0
                                        ? field?.field?.selections?.find(
                                            (selection) =>
                                              selection?.value === field?.value
                                          )?.['label_' + currentlangCode]
                                        : field?.value ?? '-'
                                    }
                                    type={field?.field?.typeData}
                                    label={field?.['label_' + currentlangCode]}
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </List>
                  )}
                  {menuType === 'type' && (
                    <List>
                      <ListItem
                        button
                        style={{
                          border: '1px solid #f1f3f4',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          height: '70px',
                          backgroundColor: businessPreference?.mainColor + '03',
                        }}
                        className="mb-3"
                        onClick={() =>
                          handleEditElement(
                            'type',
                            columns[selectedIndex],
                            selectedIndex,
                            'field'
                          )
                        }
                      >
                        {' '}
                        {(columns[selectedIndex]?.type === 'text' ||
                          columns[selectedIndex]?.type === 'string' ||
                          columns[selectedIndex]?.type === 'number') && (
                          <FieldComponent
                            key={columns[selectedIndex]?.structureValue}
                            field={{
                              typeData: columns[selectedIndex]?.type,
                              label: columns[selectedIndex]?.label,
                              name: columns[selectedIndex]?.label,
                              selections: columns[selectedIndex]?.selections,
                              value: columns[selectedIndex]?.structureValue,
                            }}
                            staticField
                            defaultValue={
                              columns[selectedIndex]?.structureValue
                            }
                            value={columns[selectedIndex]?.value || ''}
                          />
                        )}
                      </ListItem>
                      <ListItem
                        button
                        style={{
                          border: '1px solid #f1f3f4',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          height: '70px',
                          backgroundColor: businessPreference?.mainColor + '03',
                        }}
                        className="mb-3"
                        onClick={() =>
                          handleEditElement(
                            'type',
                            columns[selectedIndex],
                            selectedIndex,
                            'text'
                          )
                        }
                      >
                        <ListItemText
                          primary={t('value')}
                          secondary={t('text')}
                          secondaryTypographyProps={{
                            variant: 'caption',
                          }}
                        />
                      </ListItem>
                      {(columns[selectedIndex]?.type === 'money' ||
                        columns[selectedIndex]?.type === 'number') && (
                        <ListItem
                          style={{
                            marginBottom: '15px',
                            border: '1px solid #f1f3f4',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            height: '70px',
                            backgroundColor:
                              businessPreference?.mainColor + '03',
                          }}
                          button
                          onClick={() =>
                            handleEditElement(
                              'type',
                              columns[selectedIndex],
                              selectedIndex,
                              'money'
                            )
                          }
                        >
                          <ListItemText
                            primary={'0,00$'}
                            secondary={t('money')}
                            secondaryTypographyProps={{
                              variant: 'caption',
                            }}
                          />
                        </ListItem>
                      )}
                      {(columns[selectedIndex]?.type === 'text' ||
                        columns[selectedIndex]?.type === 'string' ||
                        columns[selectedIndex]?.type === 'number') && (
                        <ListItem
                          style={{
                            marginBottom: '15px',
                            border: '1px solid #f1f3f4',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            height: '70px',
                            backgroundColor:
                              businessPreference?.mainColor + '03',
                          }}
                          button
                          onClick={() =>
                            handleEditElement(
                              'type',
                              columns[selectedIndex],
                              selectedIndex,
                              'chip'
                            )
                          }
                        >
                          <ListItemText
                            primary={
                              <Chip
                                className="smallChipText"
                                label={t('value')}
                                color="primary"
                                sx={{
                                  marginBottom: '5px',
                                }}
                                variant="contained"
                                size="small"
                              />
                            }
                            secondary={t('chip')}
                            secondaryTypographyProps={{
                              variant: 'caption',
                            }}
                          />
                        </ListItem>
                      )}
                    </List>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListItemEdit;
