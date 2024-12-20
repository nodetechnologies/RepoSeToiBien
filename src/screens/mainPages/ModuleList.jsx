import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  useParams,
  useLocation,
  useSearchParams,
  useNavigate,
} from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
import { useReactToPrint } from 'react-to-print';
import { makeStyles } from '@material-ui/core/styles';

//utilities
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import {
  searchDataSuccess,
  handleListData,
} from '../../redux/actions-v2/listAction';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';
import { getDatabase, ref, onValue } from 'firebase/database';
import { realtimeDb } from '../../firebase';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { motion } from 'framer-motion';
import * as drawerActions from '../../redux/actions-v2/drawer-actions';

//components
import MainLayoutV2 from '../../layouts/MainLayoutV2';
import DragDropV2 from './DragDropV2';
import ListA from '../lists/ListA';
import ListF from '../lists/ListF';
import { Box, IconButton, Tooltip, Typography } from '@mui/material';
import ManufyQuotes from '../lists/Grids';
import AppointmentScheduler from './AppointmentsScheduler';
import Grid from '../lists/Grid';
import Blocks from '../../stories/layout-components/Block';
import Facets from '../lists/components/Facets';
import { Drawer } from '@mui/material';
import ListItemEdit from './ListItemEdit';
import DrawerSide from '../../stories/layout-components/DrawerSide';
import ModuleSettings from './ModuleSettings';
import nodeAxiosFirebase from '../../utils/nodeAxiosFirebase';
import {
  fetchBusinessData,
  setGeneralStatus,
} from '../../redux/actions-v2/coreAction';
import ModalImportCSV from '../../modals/ModalImportCSV';
import GeneralText from '../../stories/general-components/GeneralText';
import ElementDetailsContent from './ElementDetailsContent';
import { Close, OpenInNewOutlined } from '@mui/icons-material';
import ListS from '../lists/ListS';
import { setSingleElementDetails } from '../../redux/actions-v2/elementAction';

const ModuleList = () => {
  const { t, i18n } = useTranslation();
  const currentLangCode = i18n.language;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const location = useLocation();
  const { moduleName, moduleId, structureId, segmentId } = useParams();
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const [searchParams, setSearchParams] = useSearchParams();
  const activeIndex = parseInt(searchParams.get('tab')) || 0;
  const startTimeStamp = searchParams.get('start')
    ? parseInt(searchParams.get('start'))
    : null;
  const endTimeStamp = searchParams.get('end')
    ? parseInt(searchParams.get('end'))
    : null;
  const page = searchParams.get('page')
    ? parseInt(searchParams.get('page'))
    : 1;

  const businessStructure = useSelector(
    (state) => state.core.businessStructure
  );
  const businessModules = businessStructure?.modules;
  const activeModule = businessModules?.find((m) => m.id === moduleId);

  const order =
    searchParams.get('order') ||
    activeModule?.list?.tabs?.[activeIndex]?.sort ||
    'desc';

  const orderBy =
    searchParams.get('orderBy') ||
    activeModule?.list?.tabs?.[activeIndex]?.sortField;

  const facetKey = searchParams.get('facetKey') || null;
  const facet =
    facetKey === 'status'
      ? parseInt(searchParams.get('facet'))
      : searchParams.get('facet') === 'true'
      ? true
      : searchParams.get('facet') === 'false'
      ? false
      : searchParams.get('facet') || null;

  const [showFilters, setShowFilters] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
  const [openModalImport, setOpenModalImport] = useState(false);

  const manufyQuotesRef = useRef();

  const useStyles = makeStyles({
    paper: {
      background: theme.palette.mode === 'dark' ? '#696969' : '#FFFFFF',
      color: theme.palette.mode === 'dark' ? '#fff' : '#000',
      marginTop: '20px',
      borderRadius: '10px',
      marginLeft: '15%',
      transform: openDrawer ? 'translateY(0)' : `translateY(100%)`,
      transition: theme.transitions.create('transform', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      height: '95vh',
      maxHeight: '100%',
      position: 'fixed',
      bottom: 0,
      width: '35%',
      minWidth: '80%',
      boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.5)',
    },
    backdrop: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      zIndex: 1200,
      display: openDrawer ? 'block' : 'none',
    },
  });
  const classes = useStyles();

  const businessPreference = useSelector((state) => state.core.businessData);
  const listReducer = useSelector((state) => state.list.data);
  const searchReducer = useSelector((state) => state.list.searchData);

  const [list, setList] = useState(listReducer);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [displaySide, setDisplaySide] = useState(null);
  const [layout, setLayout] = useState([]);
  const [statusFiltersByModule, setStatusFiltersByModule] = useState({});

  const activeStructure = businessStructure?.structures?.find(
    (s) => s.id === structureId
  );
  const currentCollection = useSelector(
    (state) => state.list.currentCollection
  );

  const lastModuleNameRef = useRef(moduleName);

  const activeSegment = activeModule?.segments?.find((s) => s.id === segmentId);
  const customizations = activeModule?.list?.preferences?.customizations || {};
  const pageSize =
    customizations?.limit ?? activeModule?.list?.preferences?.limit ?? 20;

  const totalDocuments = currentCollection?.[moduleName]?.totalDocuments || '';
  const statusesToHide = customizations?.statusesToHide || {};

  const previousModuleAndPage = useRef({
    moduleId: null,
    page: null,
    searchParams: null,
    segmentId: null,
  });

  const getData = useCallback(
    async (lastDocData) => {
      if (
        (activeModule?.list?.preferences?.rangeDates === 'single' ||
          activeModule?.list?.preferences?.rangeDates === 'week' ||
          activeModule?.list?.preferences?.rangeDates === 'tenDays') &&
        !startTimeStamp
      ) {
        return;
      }
      const query = searchParams.get('search');
      dispatch(
        handleListData(
          query || '',
          structureId,
          moduleId,
          page === 1 ? null : lastDocData,
          page,
          pageSize,
          facetKey,
          facet,
          t,
          order,
          orderBy,
          i18n.language || 'en',
          startTimeStamp,
          endTimeStamp,
          activeModule?.list?.preferences?.dateField || null,
          segmentId,
          activeIndex
        )
      );
      localStorage.setItem('lastStamp', startTimeStamp);
    },
    [
      dispatch,
      structureId,
      moduleId,
      page,
      pageSize,
      segmentId,
      facetKey,
      facet,
      t,
      order,
      orderBy,
      i18n.language,
      startTimeStamp,
      endTimeStamp,
      searchParams,
    ]
  );

  useEffect(() => {
    if (moduleName === currentCollection?.[moduleName]?.name) {
      const currentHistoryToAdd = {
        pathname: location.pathname,
        url: location.pathname + location.search,
        name: activeModule?.name || '',
        moduleName: activeStructure?.name || '',
        structureId: structureId,
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
    }
  }, [currentCollection, moduleName]);

  useEffect(() => {
    const query = searchParams.get('search');
    if (query !== null) {
      getData();
    }
  }, [searchParams]);

  const filterList = (list) => {
    const statusesToHide = customizations?.statusesToHide || {};
    return list?.filter((item) => !statusesToHide[item?.status]);
  };

  const handleDateSelected = (newDateRange, field) => {
    let start = newDateRange[0];
    let end = newDateRange[1];
    let orderByReset =
      activeModule?.list?.tabs?.[activeIndex]?.sortField || 'lastUpdate';

    if (start) {
      start = start.startOf('day').unix();
    }
    if (end) {
      end = end.endOf('day').unix();
    }

    // Ensure to update the state properly here
    setSearchParams((prevParams) => {
      prevParams.set('start', start);
      prevParams.set('end', end);
      prevParams.set('orderBy', orderByReset);
      prevParams.set('order', 'desc');
      return prevParams;
    });

    localStorage.setItem(activeModule?.id + 'start', start);
    localStorage.setItem(activeModule?.id + 'end', end);
  };

  useEffect(() => {
    const newSearchParams = new URLSearchParams(searchParams);
    const localStorageStart = activeModule?.list?.preferences?.customizations
      ?.backToToday
      ? moment().startOf('day').unix()
      : localStorage.getItem(activeModule?.id + 'start');
    const localStorageEnd = activeModule?.list?.preferences?.customizations
      ?.backToToday
      ? moment()?.endOf('day').unix()
      : localStorage.getItem(activeModule?.id + 'end');
    if (
      activeModule?.list?.preferences?.rangeDates &&
      activeModule?.list?.preferences?.rangeDates !== 'none' &&
      !startTimeStamp
    ) {
      if (activeModule.list.preferences.rangeDates === 'single') {
        newSearchParams.set(
          'start',
          localStorageStart,
          moment().startOf('day').unix()
        );
        newSearchParams.set(
          'end',
          localStorageEnd,
          moment().endOf('day').unix()
        );
      } else if (activeModule.list.preferences.rangeDates === 'week') {
        newSearchParams.set(
          'start',
          localStorageStart,
          moment().startOf('week').unix()
        );
        newSearchParams.set(
          'end',
          localStorageEnd,
          moment().endOf('week').unix()
        );
      } else if (activeModule.list.preferences.rangeDates === 'tenDays') {
        newSearchParams.set('start', moment().unix());
        newSearchParams.set('end', moment().add(10, 'days').unix());
      }
      setSearchParams(newSearchParams);
    }

    if (
      previousModuleAndPage.current.moduleId !== moduleId ||
      previousModuleAndPage.current.page !== page ||
      previousModuleAndPage.current.searchParams !== searchParams.toString() ||
      (previousModuleAndPage.current.segmentId !== segmentId && segmentId)
    ) {
      getData(listReducer?.[moduleName]?.[pageSize - 1]?.path);
      previousModuleAndPage.current = {
        moduleId,
        page,
        searchParams: searchParams.toString(),
        segmentId,
      };
    }

    setIsLoading(moduleName !== currentCollection?.[moduleName]?.name);
  }, [
    moduleId,
    structureId,
    moduleName,
    searchParams,
    segmentId,
    page,
    currentCollection,
    listReducer,
  ]);

  const handleDisplaySide = (element) => {
    setDisplaySide(element);
  };

  useEffect(() => {
    setDisplaySide(null);
  }, [moduleId]);

  const handleNext = () => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('page', Number(page) + 1);
    setSearchParams(newSearchParams);
  };

  const handlePrev = () => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('page', Number(page) - 1);
    setSearchParams(newSearchParams);
  };

  const handleImport = () => {
    setOpenModalImport(!openModalImport);
  };

  useEffect(() => {
    if (moduleName !== currentCollection?.[moduleName]?.name) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [moduleName, currentCollection]);

  const handleClick = async (item, fromSide, toEdit) => {
    //validate if a layout exist in the structure
    if (structureId) {
      const layoutExist = businessStructure?.structures?.find(
        (s) => s.id === structureId
      )?.tabs;

      if (layoutExist || businessPreference?.isDev === true) {
        {
          displaySide && !fromSide
            ? handleDisplaySide(item)
            : toEdit
            ? handleQuickview(item, true)
            : activeModule?.list?.preferences?.onClick !== 'quick'
            ? navigate(
                `/app/element/${moduleName}/${structureId}/${
                  item?.documentIdentifiant || item?.id
                }?tab=0`
              )
            : handleQuickview(item, false);
        }
      } else {
        toast.error(t('noLayout'));
      }
    }
  };

  const handleClose = () => {
    dispatch(drawerActions.viewElement({ isDrawerOpen: false }));
  };

  const handleQuickview = (item, editing) => {
    dispatch(
      drawerActions.viewElement({
        isDrawerOpen: true,
        item: item,
        handleDrawerClose: handleClose,
        editing: editing || false,
        type:
          activeModule?.list?.preferences?.onClick === 'edit' ? 'edit' : 'view',
      })
    );
  };

  useEffect(() => {
    if (businessPreference?.id && structureId && moduleName) {
      const businessId = businessPreference?.id;
      const structureRef = ref(
        realtimeDb,
        `businessesOnNode/${businessId}/structures/${structureId}`
      );

      const unsubscribe = onValue(
        structureRef,
        (snapshot) => {
          const data = snapshot.val();

          let isListed = false;

          isListed = list?.[moduleName]?.find(
            (item) => item?.documentIdentifiant === data?.documentId
          );

          if (data?.type === 'onCreate') {
            isListed = true;
          }

          if (isListed) {
            getData();
          }
        },
        (error) => {
          console.error('Error reading Realtime Database:', error);
        }
      );

      return () => unsubscribe();
    }
  }, []);

  function componentResolver(listType) {
    switch (listType) {
      case 'listA':
      case 'listB':
      case 'listC':
      case 'listD':
      case 'listE':
      case 'listG':
        return {
          component: (
            <ListA
              isTablet={isTablet}
              activeModule={activeModule}
              list={filterList(list?.[moduleName] || [])}
              activeIndex={activeIndex}
              isLoading={isLoading}
              customizations={customizations}
              handleDisplaySide={handleDisplaySide}
              displaySide={displaySide}
              handleClick={handleClick}
            />
          ),
        };
      case 'listF':
        return {
          component: (
            <ListF
              isTablet={isTablet}
              activeModule={activeModule}
              isLoading={isLoading}
              activeIndex={activeIndex}
              list={filterList(list?.[moduleName] || [])}
              setList={setList}
              handleClick={handleClick}
            />
          ),
        };
      case 'listS':
        return {
          component: (
            <ListS
              isTablet={isTablet}
              activeModule={activeModule}
              isLoading={isLoading}
              activeIndex={activeIndex}
              list={filterList(list?.[moduleName] || [])}
              setList={setList}
              handleClick={handleClick}
            />
          ),
        };

      case 'kanban':
        return {
          component: (
            <DragDropV2
              isTablet={isTablet}
              customizations={customizations}
              isLoading={isLoading}
              activeModule={activeModule}
              list={filterList(list?.[moduleName] || [])}
              activeIndex={activeIndex}
            />
          ),
        };
      case 'calendar':
        return {
          component: (
            <AppointmentScheduler
              isTablet={isTablet}
              isLoading={isLoading}
              activeModule={activeModule}
              list={filterList(list?.[moduleName] || [])}
              handleDisplaySide={handleDisplaySide}
              refreshData={getData}
            />
          ),
        };
      case 'grid':
        return {
          component: (
            <ManufyQuotes
              activeModule={activeModule}
              showFilters={showFilters}
              isLoading={isLoading}
              tab={0}
              activeIndex={activeIndex}
              list={filterList(list?.[moduleName] || [])}
            />
          ),
        };
      case 'table':
        return {
          component: (
            <Grid
              activeModule={activeModule}
              showFilters={showFilters}
              isLoading={isLoading}
              tab={0}
              activeIndex={activeIndex}
              list={filterList(list?.[moduleName] || [])}
            />
          ),
        };

      case 'stats_cards':
        return {
          component: (
            <ManufyQuotes
              activeModule={activeModule}
              showFilters={showFilters}
              setRefresh={setRefresh}
              tab={1}
              isLoading={isLoading}
              refresh={refresh}
              activeIndex={activeIndex}
              list={filterList(list?.[moduleName] || [])}
            />
          ),
        };

      default:
        return null;
    }
  }

  const handlePrint = useReactToPrint({
    content: () => manufyQuotesRef.current,
  });

  useEffect(() => {
    let copyList = { ...listReducer };
    if (searchReducer?.[moduleName]?.length > 0) {
      dispatch(searchDataSuccess([], moduleName));
    }
    let newMergedList = { ...copyList, ...list };
    setList(newMergedList);
  }, [moduleName]);

  useEffect(() => {
    setList(listReducer);
  }, [listReducer]);

  useEffect(() => {
    if (searchReducer?.[moduleName]?.length > 0) {
      setList(searchReducer);
    }
  }, [searchReducer]);

  const handleCloseDrawer = () => {
    setOpenDrawer(false);
    setEditMode(false);
    getData();
  };

  const handleEditLayout = () => {
    setOpenDrawer(true);
    setEditMode(true);
  };

  const handleEditSettings = () => {
    setSettingsOpen(!settingsOpen);
  };

  const setSelectedFacet = (facetData) => {
    const newSearchParams = new URLSearchParams(searchParams);

    if (facetData?.value === 'all' && facetData?.key === 'targetDate') {
      searchParams.set('facetKey', 'isDone');
      searchParams.set('facet', false);

      searchParams.set(
        'orderBy',
        activeModule?.list?.tabs?.[activeIndex]?.sortField || 'lastUpdate'
      );
      searchParams.set(
        'order',
        activeModule?.list?.tabs?.[activeIndex]?.sort || 'desc'
      );

      newSearchParams.set('facetKey', 'isDone');
      newSearchParams.set('facet', false);
    } else {
      if (facetData?.key === 'targetDate') {
        // handleDateSelected([facetData?.value, facetData?.value], 'isDone');
      } else {
        searchParams.set(
          'order',
          activeModule?.list?.tabs?.[activeIndex]?.sort || 'desc'
        );
        searchParams.set(
          'orderBy',
          activeModule?.list?.tabs?.[activeIndex]?.sortField || 'lastUpdate'
        );
        searchParams.set('facetKey', facetData?.key);
        searchParams.set('facet', facetData?.value);
        searchParams.set('page', 1);

        searchParams.set(
          'orderBy',
          activeModule?.list?.tabs?.[activeIndex]?.sortField || 'lastUpdate'
        );
        searchParams.set(
          'order',
          activeModule?.list?.tabs?.[activeIndex]?.sort || 'desc'
        );

        setSearchParams({
          ...searchParams,
          page: 1,
          order: activeModule?.list?.tabs?.[activeIndex]?.sort || 'desc',
          orderBy:
            activeModule?.list?.tabs?.[activeIndex]?.sortField || 'lastUpdate',
          facetKey: facetData?.key,
          facet: facetData?.value,
        });
      }
    }
  };

  const applyStatusFilter = (value) => {
    const key = 'status';

    if (facetKey === key && facet === value) {
      setSelectedFacet({});
    } else {
      setSelectedFacet({ key, value });
    }
  };

  const saveModuleSettings = async () => {
    setIsLoadingUpdate(true);
    try {
      await nodeAxiosFirebase({
        t,
        method: 'POST',
        url: `business/structure`,
        body: {
          type: 'general',
          moduleId: moduleId,
          data: {
            customizations: formData,
          },
          lang: currentLangCode,
        },
      });
      setIsLoadingUpdate(false);
      setSettingsOpen(false);
      dispatch(fetchBusinessData(businessPreference?.id, t));
    } catch (error) {
      console.error('Error saving module settings:');
      dispatch(setGeneralStatus({ status: 'error', error: error }));
    }
  };

  const getColClass = (length) => {
    if (length === 1) {
      return 'col-12';
    } else if (length === 2) {
      return 'col-6';
    } else if (length === 3) {
      return 'col-4';
    } else if (length === 4) {
      return 'col-3';
    } else if (length === 5) {
      return 'col-2';
    } else if (length === 6) {
      return 'col-2';
    } else {
      return 'col-1';
    }
  };

  useEffect(() => {
    if (lastModuleNameRef.current !== moduleId) {
      lastModuleNameRef.current = moduleId;
      const dataStatus = currentCollection?.[moduleName]?.summary?.filter(
        (summary) => !statusesToHide?.[summary?.value]
      );
      setStatusFiltersByModule((prevFilters) => ({
        ...prevFilters,
        [moduleName]: dataStatus || [],
      }));
    } else {
      const dataStatus = currentCollection?.[moduleName]?.summary?.filter(
        (summary) => !statusesToHide?.[summary?.value]
      );
      setStatusFiltersByModule((prevFilters) => ({
        ...prevFilters,
        [moduleName]: dataStatus || [],
      }));
    }
  }, [moduleId, currentCollection]);

  const statusFilter = statusFiltersByModule[moduleName] || [];

  const getDocument = async () => {
    try {
      const pageData = await nodeAxiosFirebase({
        t,
        method: 'POST',
        url: `coreMulti/single`,
        errorToast: t('errorLoadingDocument'),
        body: {
          documentPath: displaySide?.documentPath,
          structureId: displaySide?.structureId || structureId,
          lang: currentLangCode,
          document: displaySide,
          height: window.innerHeight,
          device: 'desktop',
        },
      });
      setLayout(pageData?.[0]?.blocks || []);
    } catch (error) {
      console.error('Error fetching document');
      dispatch(setGeneralStatus({ status: 'error', error: error }));
    }
  };

  useEffect(() => {
    if (displaySide?.id && structureId && businessPreference?.id) {
      let elementPath = null;

      if (!displaySide?.id) {
        setLayout([]);
        setIsLoading(true);
      }

      if (moduleName === 'contacts') {
        const targetId = displaySide?.id?.split(businessPreference?.id)[0];
        elementPath = `users/${targetId}/connections/${displaySide?.id}`;
      } else if (
        moduleName === 'cardsinvoiced' ||
        moduleName === 'cardsexpense' ||
        moduleName === 'cardsuninvoiced'
      ) {
        elementPath = `cards/${displaySide?.id}`;
      } else {
        elementPath = `${moduleName}/${displaySide?.id}`;
      }
      const elementRef = doc(db, elementPath);

      const unsubscribe = onSnapshot(
        elementRef,
        (docSnapshot) => {
          if (docSnapshot.exists()) {
            const elementDataDoc = docSnapshot.data();

            const filteredData = elementDataDoc;

            setDisplaySide({
              ...displaySide,
              note: filteredData?.note,
              status: filteredData?.status,
            });
            dispatch(
              setSingleElementDetails({
                id: docSnapshot.id,
                documentPath:
                  filteredData?.documentPath || docSnapshot?.ref?.path,
                documentId: docSnapshot.id,
                ...filteredData?.data,
                ...filteredData,
                categoryId: filteredData?.categoryId?.id || null,
                businessId: businessPreference?.id,
                ownerId: filteredData?.ownerId?.id,
                targetProfileId: filteredData?.targetProfileId?.id || null,
                finances: {
                  ...filteredData?.finances,
                  total: filteredData?.finances?.total || null,
                  subtotal: filteredData?.finances?.subtotal || null,
                  incomeLine: filteredData?.finances?.incomeLine?.path || null,
                  expenseLine:
                    filteredData?.finances?.expenseLine?.path || null,
                },
                targetProfilePath: filteredData?.targetProfileId?.path || null,
                targetId: filteredData?.targetId?.id || null,
                assignedToId: filteredData?.assignedToId?.id || null,
                targetPath: filteredData?.targetId?.path || null,
                dependencyId: filteredData?.dependencyId?.id || null,
                dependencyPath: filteredData?.dependencyId?.path || null,
                structureId: filteredData?.structureId?.id,
                structurePath: filteredData?.structureId?.path || null,
                locationId: filteredData?.locationId?.id || null,
                assignedToId: filteredData?.assignedToId?.id || null,
                userARef: null,
                userBRef: null,
              })
            );
          }
        },

        (error) => {
          console.error('Error in real-time data fetching');
          dispatch(setGeneralStatus({ status: 'error', error: error }));
        }
      );

      return unsubscribe;
    }
  }, [displaySide?.documentPath, structureId, businessPreference?.id]);

  useEffect(() => {
    if (displaySide?.documentPath && displaySide?.structureId) {
      getDocument();
    }
  }, [displaySide?.documentPath, structureId]);

  return (
    <MainLayoutV2
      actions={{
        settings: handleEditSettings,
        editLayout: {
          action: handleEditLayout,
          display: editMode,
        },
        next:
          activeModule?.list?.tabs?.[activeIndex]?.listType === 'calendar' ||
          activeModule?.list?.tabs?.[activeIndex]?.listType === 'kanban'
            ? null
            : activeModule?.list?.preferences?.limit !== 0
            ? pageSize <= currentCollection?.[moduleName]?.nbDocuments || 0
              ? handleNext
              : 'disabled'
            : null,
        previous:
          activeModule?.list?.tabs?.[activeIndex]?.listType === 'calendar' ||
          activeModule?.list?.tabs?.[activeIndex]?.listType === 'kanban'
            ? null
            : activeModule?.list?.preferences?.limit !== 0
            ? handlePrev
            : null,

        print: activeModule?.list?.preferences?.print && handlePrint,
        filters: customizations?.displayFilter || false,
        onChangeDateRange: activeModule?.list?.preferences?.rangeDates !==
          'none' && {
          action: handleDateSelected,
          dateField: activeModule?.list?.preferences?.dateField,
          rangeDates: activeModule?.list?.preferences?.rangeDates,
        },

        importCSV: customizations?.displayImport && handleImport,
        currentPage: activeModule?.list?.preferences?.limit !== 0 ? page : null,
        setFilters: () => setShowFilters(!showFilters),
        refresh: customizations?.displayRefresh && getData,
      }}
      pageTitle={
        activeModule?.name +
          (activeSegment?.name ? ' - ' + activeSegment?.name : '') || ''
      }
      searchActivated={moduleName === 'passes' ? false : true}
      selectedTab={activeIndex}
      tabs={activeModule?.list?.tabs || []}
      sectionTitle={totalDocuments ? totalDocuments + ' ' + t('elements') : ''}
    >
      {openDrawer && (
        <div className={classes.backdrop} onClick={handleCloseDrawer}></div>
      )}
      {openModalImport && (
        <ModalImportCSV
          isOpen={openModalImport}
          modalCloseHandler={handleImport}
          fieldsStructure={activeStructure?.fields}
        />
      )}
      <div style={{ height: '92vh', overflow: 'hidden' }} className="d-flex">
        {openDrawer && (
          <Drawer
            classes={{ paper: classes.paper }}
            variant="persistent"
            anchor="bottom"
            open={openDrawer}
            onClose={handleCloseDrawer}
          >
            <Box sx={{ height: '90vh' }}>
              <div className="p-3">
                {openDrawer && (
                  <ListItemEdit
                    moduleId={moduleId}
                    handleClose={handleCloseDrawer}
                    type={
                      activeModule?.list?.tabs?.[activeIndex]?.listType ===
                        'listA' ||
                      activeModule?.list?.tabs?.[activeIndex]?.listType ===
                        'listG'
                        ? 'list'
                        : activeModule?.list?.tabs?.[activeIndex]?.listType
                    }
                    structureId={structureId}
                    tabIndex={activeIndex}
                    data={{
                      list: list?.[currentCollection?.[moduleName]?.name],
                      onClick: activeModule?.list?.tabs?.[activeIndex]?.action,
                      config: activeModule?.list?.tabs?.[activeIndex],
                      params: currentCollection?.[moduleName]?.header?.map(
                        (col) => {
                          return {
                            ...col,
                            typeValue: col?.type,
                            structureValue: col?.value,
                            valueColor: col?.valueColor || 'primary',
                          };
                        }
                      ),
                    }}
                  />
                )}
              </div>
            </Box>
          </Drawer>
        )}
        {settingsOpen && (
          <DrawerSide
            isDrawerOpen={settingsOpen}
            handleDrawerClose={() => setSettingsOpen(false)}
            title={t('settings')}
            handleSave={saveModuleSettings}
            isLoading={isLoadingUpdate}
          >
            <ModuleSettings
              preferences={customizations}
              pageModel={activeModule?.list?.tabs?.[activeIndex]?.listType}
              setFormData={setFormData}
              formData={formData}
              collection={activeStructure?.collectionField}
              statuses={
                activeStructure?.fields?.find(
                  (field) => field.value === 'status'
                )?.selections
              }
            />
          </DrawerSide>
        )}
        <div className={showFilters ? 'col-3' : 'hide'}>
          <Blocks height={1} h heightPercentage={95}>
            <Facets
              activeModule={activeModule}
              businessPreference={businessPreference}
              moduleName={moduleName}
              activeStructure={activeStructure}
              setRefresh={setRefresh}
            />
          </Blocks>
        </div>
        <div
          style={{ overflowY: 'hidden', overflowX: 'hidden' }}
          ref={manufyQuotesRef}
          className={showFilters ? 'col-9' : displaySide ? 'col-6' : 'col-12'}
        >
          {activeModule?.list?.tabs?.[activeIndex]?.displayTop ===
            'statuses' && (
            <>
              <div style={{ marginBottom: '-20px' }} className="col-12 d-flex">
                {statusFilter?.map((summary, idx) => {
                  return (
                    <div
                      className={getColClass(statusFilter?.length || 0)}
                      key={idx}
                    >
                      <div
                        className="hover"
                        onClick={() => applyStatusFilter(summary?.value)}
                      >
                        <Blocks
                          noScroll
                          noBorder
                          height={2}
                          heightPercentage={8}
                          isLoading={isLoading}
                        >
                          <div
                            className="p-1"
                            style={{
                              borderBottom:
                                facet === summary?.value
                                  ? `3px solid ${summary?.color}`
                                  : '',
                            }}
                          >
                            <GeneralText
                              text={summary?.count}
                              primary={false}
                              fontSize="24px"
                              size="bold"
                              color={summary?.color}
                            />
                            <GeneralText
                              text={summary?.label}
                              primary={true}
                              fontSize="12px"
                              size="medium"
                            />
                          </div>
                        </Blocks>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {
            componentResolver(activeModule?.list?.tabs?.[activeIndex]?.listType)
              ?.component
          }
        </div>
        <div
          style={{
            position: 'relative',
            height: '87vh',
            paddingBottom: '10px',
            overflowY: 'scroll',
          }}
          className={displaySide && !showFilters ? 'col-6' : 'hide'}
        >
          {displaySide?.structureId && (
            <div className="mt-4">
              <div className="mb-1 px-4 d-flex middle-content justify-content-between">
                <div>
                  <Typography
                    sx={{
                      maxWidth: '32vh',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      color: '#000',
                      whiteSpace: 'nowrap',
                      marginLeft: '5px',
                    }}
                    fontSize={isTablet ? '16px' : '20px'}
                    fontWeight={700}
                  >
                    {displaySide?.name || ''}
                  </Typography>
                  <div>
                    <Typography
                      sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        color: 'grey',

                        whiteSpace: 'nowrap',
                        marginLeft: '5px',
                      }}
                      fontSize={isTablet ? '10px' : '11px'}
                      fontWeight={300}
                    >
                      {'#' + displaySide?.id?.slice(0, 6)}
                    </Typography>
                  </div>
                </div>
                <div>
                  <IconButton
                    size="large"
                    edge="start"
                    color="black"
                    onClick={() => handleClick(displaySide, true)}
                    sx={{
                      ml: 1,
                      backgroundColor: '#FFF',
                      padding: '0px',
                      height: '42px',
                      minHeight: '42px',
                      width: '42px',
                      maxHeight: '42px',
                      position: 'relative',
                      '& svg': {
                        position: 'relative',
                        zIndex: 2,
                      },
                    }}
                  >
                    <motion.div whileHover={{ scale: 1.2 }}>
                      <Tooltip title={t('open')}>
                        <span>
                          <OpenInNewOutlined />
                        </span>
                      </Tooltip>
                    </motion.div>
                  </IconButton>
                  <IconButton
                    size="large"
                    edge="start"
                    color="black"
                    onClick={() => handleDisplaySide(null)}
                    sx={{
                      ml: 1,
                      backgroundColor: '#FFF',
                      padding: '0px',
                      height: '42px',
                      minHeight: '42px',
                      width: '42px',
                      maxHeight: '42px',
                      position: 'relative',
                      '& svg': {
                        position: 'relative',
                        zIndex: 2,
                      },
                    }}
                  >
                    <motion.div whileHover={{ scale: 1.2 }}>
                      <Tooltip title={t('close')}>
                        <span>
                          <Close />
                        </span>
                      </Tooltip>
                    </motion.div>
                  </IconButton>
                </div>
              </div>
              <ElementDetailsContent
                elementData={displaySide}
                elementId={displaySide?.id}
                layout={layout}
                activeIndex={0}
                fromList={true}
                setLayout={setLayout}
              />
            </div>
          )}
        </div>
      </div>
    </MainLayoutV2>
  );
};

export default ModuleList;
