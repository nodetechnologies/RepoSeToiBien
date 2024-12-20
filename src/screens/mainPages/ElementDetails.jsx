import React, { useEffect, useState } from 'react';
import {
  useParams,
  useSearchParams,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
import * as drawerActions from '../../redux/actions-v2/drawer-actions';

//utilities
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material/styles';

//components
import MainLayoutV2 from '../../layouts/MainLayoutV2';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';
import * as modalActions from '../../redux/actions/modal-actions';

import nodeAxiosFirebase from '../../utils/nodeAxiosFirebase';
import ElementDetailsContent from './ElementDetailsContent';
import TextField from '../../stories/general-components/TextField';
import { Autocomplete, Skeleton } from '@mui/material';
import TextFieldMUI from '@mui/material/TextField';
import { setSingleElementDetails } from '../../redux/actions-v2/elementAction';
import { setGeneralStatus } from '../../redux/actions-v2/coreAction';
import { toast } from 'react-toastify';
import Loading from '../../stories/general-components/Loading';

const ElementDetails = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const { structureId, elementId, moduleName } = useParams();
  const pathname = location.pathname;
  const [searchParams] = useSearchParams();
  const theme = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [pageOpen, setPageOpen] = useState(false);
  const [accTabs, setAccTabs] = useState([]);
  const [isPublicMode, setIsPublicMode] = useState(false);
  const [accTabsPublic, setAccTabsPublic] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [tabDetailsOpen, setTabDetailsOpen] = useState(false);
  const [errorDoc, setErrorDoc] = useState(false);
  const [elementData, setElementData] = useState({
    name: '-',
  });

  const [newIndexToCreate, setNewIndexToCreate] = useState(false);
  const [newIndexToCreatePublic, setNewIndexToCreatePublic] = useState(false);

  const [tabData, setTabData] = useState({
    groups: [],
    name_en: 'Details',
    name_fr: 'Détails',
  });

  const [tabDataPublic, setTabDataPublic] = useState({
    name_en: 'Details',
    name_fr: 'Détails',
  });

  const isDarkMode = theme.palette.mode === 'dark';
  const currentlangCode = i18n.language;
  const activeIndex = parseInt(searchParams.get('tab')) || 0;
  const businessPreference = useSelector((state) => state.core.businessData);
  const editBlockModal = useSelector(
    (state) => state.modalReducer.modalEditBlock
  );

  const formattedGroups = businessPreference?.groups?.map((group) => ({
    label: group?.name,
    value: group?.identifiant,
    id: group?.identifiant,
  }));
  const businessStructure = useSelector(
    (state) => state.core.businessStructure
  );
  const businessStructures = businessStructure?.structures;
  const structure = businessStructures?.find((s) => s.id === structureId);

  const singleElement = useSelector(
    (state) => state.element.singleElementDetails
  );

  const currentStatus = useSelector((state) => state.core.status);

  const currentCollection = useSelector(
    (state) => state.list.currentCollection
  );

  const structureIdInvoiced = businessStructures?.find(
    (s) => s.collectionField === 'cardsinvoiced'
  )?.id;

  const [layout, setLayout] = useState(structure?.tabs || []);
  const [layoutPublic, setLayoutPublic] = useState(structure?.tabsPublic || []);

  const getDocument = async (from) => {
    try {
      setIsLoading(pageOpen ? false : true);
      let elementPath = null;
      if (moduleName === 'contacts') {
        const targetId = elementId?.split(businessPreference?.id)[0];
        elementPath = `users/${targetId}/connections/${elementId}`;
      } else if (
        moduleName === 'cardsinvoiced' ||
        moduleName === 'cardsuninvoiced' ||
        moduleName === 'cardsexpense'
      ) {
        elementPath = `cards/${elementId}`;
      } else {
        elementPath = `${moduleName}/${elementId}`;
      }
      const pageData = await nodeAxiosFirebase({
        t,
        method: 'POST',
        url: `coreMulti/single`,
        errorToast: t('errorLoadingDocument'),
        body: {
          type: isPublicMode
            ? 'public'
            : from === 'public'
            ? 'public'
            : 'business',
          documentPath: elementPath,
          structureId: structureId,
          lang: currentlangCode,
          document: elementData,
          height: window.innerHeight,
          device: 'desktop',
          eventData: {
            queryID: currentCollection?.[moduleName]?.queryID
              ? currentCollection?.[moduleName]?.queryID
              : null,
            type: 'click',
            objectIDs: currentCollection?.[moduleName]?.queryID
              ? currentCollection?.[moduleName]?.objectIDs
              : null,
          },
        },
      });
      if (isPublicMode || from === 'public') {
        setAccTabsPublic(pageData || []);
      } else {
        setAccTabs(pageData || []);
      }
      setIsLoading(false);
      setPageOpen(true);
      dispatch(
        setGeneralStatus({
          status: 'success',
          position: 'edit-block' + editBlockModal?.layout?.i,
          type: 'skeleton',
        })
      );
    } catch (error) {
      setErrorDoc(true);
      console.error(error);
    }
  };

  useEffect(() => {
    if (elementId && structureId && elementData?.id === elementId) {
      let updatedBlockLayout = accTabs[activeIndex];
      updatedBlockLayout?.blocks?.forEach((block) => {
        if (block.match === 'id:id') {
          const correspondingData = block?.data;

          correspondingData.forEach((dataItem) => {
            dataItem.value = singleElement[dataItem.structureValue];
          });
        }
      });
      setAccTabs([
        ...accTabs.slice(0, activeIndex),
        updatedBlockLayout,
        ...accTabs.slice(activeIndex + 1),
      ]);
    }
  }, [singleElement?.lastUpdate]);

  const updateData = async (from) => {
    setEditMode(false);
    setTabDetailsOpen(false);

    try {
      dispatch(
        setGeneralStatus({
          status: 'loading',
          position: 'updateBlock-Info',
          type: 'pulse',
        })
      );
      await nodeAxiosFirebase({
        t,
        method: 'POST',
        showLoading: true,
        url: `business/structure`,
        body: {
          from: from,
          lang: currentlangCode,
          structureId: structureId,
          type: 'blocks-position',
          data: {
            tabIndex: activeIndex || 0,
            blocksData: from === 'public' ? layoutPublic : layout,
          },
        },
      });
      dispatch(
        setGeneralStatus({
          status: 'success',
          position: 'updateBlock-Info',
          type: 'pulse',
        })
      );
      if (
        (accTabs[activeIndex]?.groups !== tabData?.groups ||
          accTabs[activeIndex]?.name_en !== tabData?.name_en ||
          accTabs[activeIndex]?.name_fr !== tabData?.name_fr) &&
        !isPublicMode
      ) {
        dispatch(
          setGeneralStatus({
            status: 'loading',
            position: 'addTab',
            type: 'pulse',
          })
        );

        await nodeAxiosFirebase({
          t,
          method: 'POST',
          showLoading: true,
          url: `business/structure`,
          body: {
            structureId: structureId,
            lang: currentlangCode,
            type: 'tab',
            data: {
              from: 'business',
              tabIndex: activeIndex || 0,
              tabData: {
                name_en: tabData?.name_en,
                name_fr: tabData?.name_fr,
                groups: tabData?.groups?.map((group) => group.value),
              },
            },
          },
        });
        dispatch(
          setGeneralStatus({
            status: 'success',
            position: 'addTab',
            type: 'pulse',
          })
        );
      }

      if (
        (accTabsPublic[activeIndex]?.name_en !== tabDataPublic?.name_en ||
          accTabsPublic[activeIndex]?.name_fr !== tabDataPublic?.name_fr) &&
        isPublicMode
      ) {
        dispatch(
          setGeneralStatus({
            status: 'loading',
            position: 'addTab',
            type: 'pulse',
          })
        );

        await nodeAxiosFirebase({
          t,
          method: 'POST',
          showLoading: true,
          url: `business/structure`,
          body: {
            structureId: structureId,
            lang: currentlangCode,
            type: 'tab',
            data: {
              from: 'public',
              tabIndex: activeIndex || 0,
              tabData: {
                name_en: tabDataPublic?.name_en,
                name_fr: tabDataPublic?.name_fr,
              },
            },
          },
        });
        dispatch(
          setGeneralStatus({
            status: 'success',
            position: 'addTab',
            type: 'pulse',
          })
        );
      }
      setTabData(null);
      setTabDataPublic(null);
      setTimeout(() => {
        getDocument();
      }, 700);
    } catch (error) {
      console.error('Error update module data', error);
    }
  };

  const handleAddBlockPublic = async () => {
    const newBlock = {
      i: layoutPublic?.length.toString(),
      x: 0,
      y: 0,
      w: 2,
      h: 4,
      contentType: 'content',
      height: 200,
    };
    setLayoutPublic([...layoutPublic, newBlock]);
  };

  const handleAddBlock = async () => {
    const newBlock = {
      i: layout?.length.toString(),
      x: 0,
      y: 0,
      w: 2,
      h: 4,
      contentType: 'content',
      height: 200,
    };
    setLayout([...layout, newBlock]);
  };

  const updateTabIndexInURL = (index) => {
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set('tab', index);
    navigate(`${pathname}?${searchParams.toString()}`);
  };

  const handleAddTab = async () => {
    setAccTabs([
      ...accTabs,
      {
        name: tabData?.[`name_${currentlangCode}`] || 'New Tab',
        blocks: [
          {
            i: '0',
            x: 0,
            y: 0,
            w: 5,
            h: 8,
            contentType: 'content',
            height: 200,
          },
        ],
      },
    ]);
    setNewIndexToCreate(true);
    updateTabIndexInURL(accTabs?.length);
    setTabDetailsOpen(true);
  };

  const handleAddTabPublic = async () => {
    setAccTabsPublic([
      ...accTabsPublic,
      {
        name: tabDataPublic?.[`name_${currentlangCode}`] || 'Details',
        blocks: [
          {
            i: '0',
            x: 0,
            y: 0,
            w: 5,
            h: 8,
            contentType: 'content',
            height: 200,
          },
        ],
      },
    ]);
    setNewIndexToCreatePublic(true);
    updateTabIndexInURL(accTabsPublic?.length);
    setTabDetailsOpen(true);
  };

  const handleSaveAddTab = async (from) => {
    try {
      dispatch(
        setGeneralStatus({
          status: 'loading',
          position: 'updateLayout',
          type: 'backdrop',
        })
      );
      if (from === 'business') {
        await nodeAxiosFirebase({
          t,
          method: 'POST',
          showLoading: true,
          url: `business/structure`,
          body: {
            structureId: structureId,
            type: 'addTab',
            lang: currentlangCode,
            data: {
              from: 'business',
              tabData: {
                name_en: tabData?.name_en,
                name_fr: tabData?.name_fr,
                groups: tabData?.groups?.map((group) => group.value),
              },
              tabBlocks: layout,
            },
          },
        });
      } else if (from === 'public') {
        await nodeAxiosFirebase({
          t,
          method: 'POST',
          showLoading: true,
          url: `business/structure`,
          body: {
            structureId: structureId,
            type: 'addTab',
            lang: currentlangCode,
            data: {
              from: 'public',
              tabData: {
                name_en: tabDataPublic?.name_en,
                name_fr: tabDataPublic?.name_fr,
              },
              tabBlocks: layoutPublic,
            },
          },
        });
      }
      dispatch(
        setGeneralStatus({
          status: 'success',
          position: 'updateLayout',
          type: 'backdrop',
        })
      );
      setNewIndexToCreate(false);
      setNewIndexToCreatePublic(false);
      setEditMode(false);
      setTabDetailsOpen(false);
      setTimeout(() => {
        getDocument();
      }, 700);
    } catch (error) {
      console.error('Error update module data', error);
    }
  };

  useEffect(() => {
    if (
      elementId &&
      structureId &&
      elementData?.id === elementId &&
      !isPublicMode
    ) {
      getDocument();
    }
  }, [singleElement, elementId, structureId, elementData?.id]);

  const layoutInit = accTabs[activeIndex]?.blocks || [];
  const layoutInitPublic = accTabsPublic[activeIndex]?.blocks || [];

  useEffect(() => {
    if (layoutInit?.length > 0) {
      setLayout(layoutInit);
    }
  }, [layoutInit]);

  useEffect(() => {
    if (layoutInitPublic?.length > 0) {
      setLayoutPublic(layoutInitPublic);
    }
  }, [layoutInitPublic]);

  useEffect(() => {
    if (elementId && structureId && businessPreference?.id) {
      let elementPath = null;

      if (elementData?.id !== elementId) {
        setLayout([]);
        setIsLoading(true);
      }

      if (moduleName === 'contacts') {
        const targetId = elementId?.split(businessPreference?.id)[0];
        elementPath = `users/${targetId}/connections/${elementId}`;
      } else if (
        moduleName === 'cardsinvoiced' ||
        moduleName === 'cardsexpense' ||
        moduleName === 'cardsuninvoiced'
      ) {
        elementPath = `cards/${elementId}`;
      } else {
        elementPath = `${moduleName}/${elementId}`;
      }
      const elementRef = doc(db, elementPath);

      const unsubscribe = onSnapshot(
        elementRef,
        (docSnapshot) => {
          if (docSnapshot.exists()) {
            const elementDataDoc = docSnapshot.data();

            const filteredData = elementDataDoc;
            setElementData({
              id: docSnapshot.id,
              documentPath:
                filteredData?.documentPath || docSnapshot?.ref?.path,
              documentId: docSnapshot.id,
              ...filteredData?.data,
              ...filteredData,
              categoryId: filteredData?.categoryId?.id || null,
              finances: {
                ...filteredData?.finances,
                total: filteredData?.finances?.total || null,
                subtotal: filteredData?.finances?.subtotal || null,
                incomeLine: filteredData?.finances?.incomeLine?.path || null,
                expenseLine: filteredData?.finances?.expenseLine?.path || null,
              },
              ownerId: filteredData?.ownerId?.id,
              targetProfileId: filteredData?.targetProfileId?.id || null,
              targetProfilePath: filteredData?.targetProfileId?.path || null,
              targetId: filteredData?.targetId?.id || null,
              assignedToId: filteredData?.assignedToId?.id || '',
              targetPath: filteredData?.targetId?.path || null,
              dependencyId: filteredData?.dependencyId?.id || null,
              dependencyPath: filteredData?.dependencyId?.path || null,
              structureId: filteredData?.structureId?.id,
              structurePath: filteredData?.structureId?.path || null,
              locationId: filteredData?.locationId?.id || null,
              assignedToId: filteredData?.assignedToId?.id || null,
              financesTotal: filteredData?.finances?.total || null,
              financesSubtotal: filteredData?.finances?.subtotal || null,
              financesAmount: filteredData?.finances?.amount || null,
              targetProfileName:
                filteredData?.targetProfileDetails?.name ||
                filteredData?.targetProfileName ||
                null,
              targetName:
                filteredData?.targetDetails?.name ||
                filteredData?.targetName ||
                null,
              targetPhone: filteredData?.targetDetails?.phone || null,
              targetEmail:
                filteredData?.targetDetails?.email ||
                filteredData?.targetEmail ||
                null,
              targetAddress:
                filteredData?.targetDetails?.address ||
                filteredData?.targetAddress ||
                null,
              dependencyName:
                filteredData?.dependencyDetails?.name ||
                filteredData?.dependencyName ||
                null,
              assignedToName:
                filteredData?.assignedToDetails?.name ||
                filteredData?.assignedToName ||
                null,
              userARef: null,
              userBRef: null,
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
                structureId: filteredData?.structureId?.id || null,
                structurePath: filteredData?.structureId?.path || null,
                locationId: filteredData?.locationId?.id || null,
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
  }, [elementId, structureId, businessPreference?.id]);

  useEffect(() => {
    if (elementData?.id === elementId) {
      const currentHistoryToAdd = {
        pathname: location.pathname,
        url: location.pathname + location.search,
        name: elementData?.name || elementData?.targetName,
        moduleName: structure?.name || '',
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
  }, [elementData]);

  const handleConfirmDelete = async () => {
    dispatch(
      modalActions.modalConfirmation({
        isOpen: true,
        title: t('deleteElement'),
        handleConfirm: () => handleElementDelete('delete'),
        handleConfirmSub:
          moduleName === 'articles' ||
          moduleName === 'services' ||
          moduleName === 'grids' ||
          moduleName === 'profiles' ||
          moduleName === 'passes' ||
          moduleName === 'contacts'
            ? () => handleElementDelete('desactivate')
            : null,
      })
    );
  };

  const handleClose = () => {
    dispatch(drawerActions.viewElement({ isDrawerOpen: false }));
  };

  const handleOpenDrawer = () => {
    dispatch(
      drawerActions.viewElement({
        isDrawerOpen: true,
        item: elementData,
        handleDrawerClose: handleClose,
        type: 'edit',
      })
    );
  };

  const handlePublicAccess = async () => {
    setIsPublicMode(!isPublicMode);
    setIsLoading(true);
    setTimeout(() => {
      getDocument('public');
    }, 700);
  };

  //delete card
  const handleElementDelete = async (type) => {
    let formattedPath = '';
    try {
      if (moduleName === 'contacts') {
        const targetId = elementId?.split(businessPreference?.id)[0];
        dispatch(
          setGeneralStatus({
            status: 'loading',
            position: 'deletesub-element',
            type: 'pulse',
          })
        );
        await nodeAxiosFirebase({
          t,
          method: 'POST',
          url: 'deleteUser',
          showLoading: true,
          errorToast: t('makesureUserDelete'),
          body: {
            type: type,
            userId: targetId,
          },
        });
        dispatch(
          setGeneralStatus({
            status: 'success',
            position: 'deletesub-element',
            type: 'pulse',
          })
        );
      } else {
        if (elementData?.documentPath) {
          const parts = elementData?.documentPath?.split('/');
          parts.pop();
          formattedPath = parts.join('/');
        }
        if (formattedPath) {
          dispatch(
            setGeneralStatus({
              status: 'loading',
              position: 'deletesub-element',
              type: 'pulse',
            })
          );
          await nodeAxiosFirebase({
            t,
            method: 'DELETE',
            url: 'coreSeqV2',
            errorToast: t('makesureElementsDelete'),
            showLoading: true,
            body: {
              type: type,
              elementPath: formattedPath,
              elementId: elementId,
            },
          });
          dispatch(
            setGeneralStatus({
              status: 'success',
              position: 'deletesub-element',
              type: 'pulse',
            })
          );

          const deletedElements =
            JSON.parse(sessionStorage.getItem('deletedElements')) || [];

          if (deletedElements.length >= 10) {
            deletedElements.shift();
          }

          deletedElements.push(elementId);

          sessionStorage.setItem(
            'deletedElements',
            JSON.stringify(deletedElements)
          );
        }
      }
      navigateBack();
      dispatch(setGeneralStatus({ status: 'success' }));
    } catch (error) {
      dispatch(setGeneralStatus({ status: 'error', error: error }));
      console.error('Error deleting element');
    }
  };

  const navigateBack = () => {
    const history = localStorage.getItem('history')
      ? JSON.parse(localStorage.getItem('history'))
      : [];
    const lastElementMinusOne = history[history?.length - 2];
    navigate(lastElementMinusOne?.url || lastElementMinusOne?.pathname);
  };

  const openEmailModal = () => {
    dispatch(
      modalActions.modalEmail({
        isOpen: true,
        type: pathname?.startsWith('/app/element/card') ? 'card' : '',
      })
    );
  };

  const tabs =
    (accTabs?.length > 0 &&
      accTabs?.map((tab, index) => ({
        label: tab?.name || 'tab' + index,
        value: index,
      }))) ||
    [];

  const tabsPublic =
    (accTabsPublic?.length > 0 &&
      accTabsPublic?.map((tab, index) => ({
        label: tab?.name || 'tab' + index,
        value: index,
      }))) ||
    [];

  const handleEditLayout = () => {
    if (editMode && !isPublicMode) {
      if (!newIndexToCreate) {
        updateData('business');
      } else {
        handleSaveAddTab('business');
      }
    } else {
      setEditMode(true);
      const formattedGroups = accTabs[activeIndex]?.groups?.map((group) => ({
        label:
          businessPreference?.groups?.find((g) => g?.identifiant === group)
            ?.name || '',
        value: group,
        id: group,
      }));
      setTabData({
        groups: formattedGroups || [],
        name_en: accTabs[activeIndex]?.name_en || '',
        name_fr: accTabs[activeIndex]?.name_fr || '',
      });
      setTabDetailsOpen(true);
    }
  };

  const handleEditLayoutPublic = () => {
    if (editMode && isPublicMode) {
      if (!newIndexToCreatePublic) {
        updateData('public');
      } else {
        handleSaveAddTab('public');
      }
    } else {
      setEditMode(true);
      setTabDataPublic({
        name_en: accTabsPublic[activeIndex]?.name_en || '',
        name_fr: accTabsPublic[activeIndex]?.name_fr || '',
      });
      setTabDetailsOpen(true);
    }
  };

  const handleChangeDate = async (date) => {
    dispatch(
      setGeneralStatus({
        status: 'loading',
        position: 'updateDate',
        type: 'pulse',
      })
    );
    await nodeAxiosFirebase({
      t,
      method: 'PATCH',
      url: `coreSeqV2`,
      showLoading: true,
      body: {
        documentId: elementId,
        elementPath: 'cards/',
        key: elementData?.invoiceDate === null ? 'targetDate' : 'invoiceDate',
        value: date,
      },
    });
    dispatch(
      setGeneralStatus({
        status: 'success',
        position: 'updateDate',
        type: 'pulse',
      })
    );
  };

  const openModalPrint = () => {
    if (moduleName === 'contacts') {
      dispatch(
        modalActions.modalContact({
          isOpen: true,
        })
      );
    } else {
      dispatch(
        modalActions.modalInvoice({
          isOpen: true,
        })
      );
    }
  };

  const copyLink = () => {
    if (!elementData?.accessCode) {
      return;
    }
    const link = `${window.location.origin}/redirect/${businessPreference?.id}/${moduleName}/${structureId}/${elementId}?accessCode=${elementData?.accessCode}&shared=true`;
    navigator.clipboard.writeText(link);
    toast.success(t('copied'));
  };

  const handleConvert = async () => {
    setIsLoading(true);
    dispatch(
      setGeneralStatus({
        status: 'loading',
        position: 'updateElement',
        type: 'pulse',
      })
    );
    await nodeAxiosFirebase({
      t,
      method: 'PATCH',
      url: `coreSeqV2`,
      showLoading: true,
      body: {
        documentId: elementId,
        elementPath: 'cards/',
        key: 'isInvoiced',
        value: true,
      },
    });
    dispatch(
      setGeneralStatus({
        status: 'success',
        position: 'updateElement',
        type: 'pulse',
      })
    );

    setTimeout(() => {
      setIsLoading(false);
      navigate(
        `/app/element/cardsinvoiced/${structureIdInvoiced}/${elementId}`
      );
    }, 3200);
  };

  return (
    <MainLayoutV2
      actions={{
        email: structure?.element?.preferences?.email
          ? () => openEmailModal()
          : null,
        cells:
          layout?.[0]?.mainElement?.cellData?.length > 0 &&
          layout?.[0]?.mainElement?.cellData,
        tags: structure?.element?.preferences?.tags
          ? elementData?.tags || []
          : null,
        share: structure?.element?.preferences?.share ? () => copyLink() : null,
        onChangeDate: (e) => handleChangeDate(e.target.value),
        print: structure?.element?.preferences?.print
          ? () => openModalPrint()
          : null,
        date:
          (elementData?.invoiceDate?.seconds ||
            elementData?.invoiceDate?._seconds ||
            elementData?.targetDate?.seconds ||
            elementData?.targetDate?._seconds) &&
          moment
            .unix(
              elementData?.invoiceDate?.seconds ||
                elementData?.invoiceDate?._seconds ||
                elementData?.targetDate?.seconds ||
                elementData?.targetDate?._seconds ||
                moment().unix()
            )
            .format('YYYY-MM-DD'),
        deleteItem: structure?.element?.preferences?.delete
          ? elementData?.documentPath && handleConfirmDelete
          : null,
        editLayout: {
          action: handleEditLayout,
          display: editMode,
          addBlock: tabs?.length > 0 && handleAddBlock,
          addTab: handleAddTab,
          actionPublic: handleEditLayoutPublic,
          displayPublic: editMode && isPublicMode,
          publicAccess: isPublicMode,
          addBlockPublic: tabsPublic?.length > 0 && handleAddBlockPublic,
          addTabPublic: handleAddTabPublic,
          publicAccessAction:
            structure?.element?.isPublic && handlePublicAccess,
        },
        edit: structure?.element?.preferences?.edit ? handleOpenDrawer : null,
        isFeatured: structure?.element?.preferences?.favorite
          ? elementData?.isFeatured || false
          : null,
        convert: structure?.element?.preferences?.convert
          ? {
              action:
                !elementData?.isInvoiced &&
                elementData?.finances &&
                handleConvert,
              tooltip: t('convertToInvoice'),
            }
          : null,
      }}
      error404={errorDoc}
      pageTitle={elementData?.name || elementData?.targetName || ''}
      elementId={elementId}
      formatedPath={elementData?.documentPath?.split('/' + elementId).join('')}
      sectionTitle={
        elementData?.isInvoiced
          ? ((elementData?.finances?.balance || 0) / 10000)?.toFixed(2) + ' $'
          : elementData?.searchId?.toUpperCase() ||
            elementData?.targetReference ||
            ''
      }
      selectedTab={elementData?.id === elementId && activeIndex}
      tabs={isPublicMode ? tabsPublic : tabs}
      manualIndex={activeIndex}
    >
      {currentStatus?.position === 'deletesub-element' &&
        currentStatus?.status === 'loading' && <Loading type="backdrop" />}
      {elementData?.id === elementId && isLoading === false ? (
        <div
          style={{
            position: 'relative',
            width: '100%',
          }}
        >
          <ElementDetailsContent
            elementData={elementData}
            editMode={editMode}
            currentElementId={elementId}
            elementId={elementId}
            layout={layout}
            displayBorder={accTabsPublic[activeIndex]?.displayBorder}
            layoutPublic={layoutPublic}
            publicMode={isPublicMode}
            activeIndex={activeIndex}
            refreshDoc={getDocument}
            setLayout={setLayout}
            setLayoutPublic={setLayoutPublic}
          />
          {tabDetailsOpen && (
            <div
              style={{
                position: 'fixed',
                bottom: 30,
                zIndex: 999999,
                width: '760px',
                alignContent: 'center',
                justifyContent: 'center',
                display: 'flex',
                backgroundColor: isDarkMode ? '#000' : '#FFF',
                borderRadius: '60px',
                marginLeft: '-60px',
                marginBottom: '-20px',
                paddingRight: '15px',
                paddingTop: '3px',
                paddingBottom: '8px',
                boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.1)',
              }}
            >
              <div className="d-flex middle-content">
                <TextField
                  label={t('nameEn')}
                  fullWidth
                  value={tabData?.name_en}
                  onChange={(e) =>
                    setTabData({ ...tabData, name_en: e.target.value })
                  }
                  style={{ paddingRight: '10px' }}
                />
                <TextField
                  label={t('nameFr')}
                  fullWidth
                  value={tabData?.name_fr}
                  onChange={(e) =>
                    setTabData({ ...tabData, name_fr: e.target.value })
                  }
                  style={{ paddingRight: '10px' }}
                />
                <Autocomplete
                  multiple
                  fullWidth
                  options={formattedGroups || []}
                  getOptionLabel={(option) => option?.label || ''}
                  value={tabData?.groups}
                  onChange={(event, newValue) => {
                    setTabData({ ...tabData, groups: newValue });
                  }}
                  sx={{ maxWidth: '210px', marginTop: '5px' }}
                  renderInput={(params) => (
                    <TextFieldMUI
                      {...params}
                      sx={{
                        'MuiFormControl-root': {
                          width: '100%',
                          height: '55px',
                        },
                        '.MuiInputBase-input': {
                          padding: '2px 10px 2px 10px',
                          height: '55px',
                        },
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '10px',
                          height: '55px',
                          '&.Mui-focused fieldset': {
                            borderColor:
                              businessPreference?.mainColor || '#000',
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
                  isOptionEqualToValue={(option, value) =>
                    option.id === value.id
                  }
                />
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="d-flex p-3">
          <div className="col-4">
            <Skeleton
              variant="rect"
              width="100%"
              height={'35vh'}
              sx={{ borderRadius: '12px' }}
            />
            <div className="mt-2">
              <Skeleton
                variant="rect"
                width="100%"
                height={'47vh'}
                sx={{ borderRadius: '12px' }}
              />
            </div>
          </div>
          <div className="col-5" style={{ paddingLeft: '10px' }}>
            <Skeleton
              variant="rect"
              width="100%"
              height={'40vh'}
              sx={{ borderRadius: '12px' }}
            />
            <div className="mt-2">
              <Skeleton
                variant="rect"
                width="100%"
                height={'42vh'}
                sx={{ borderRadius: '12px' }}
              />
            </div>
          </div>
          <div className="col-3" style={{ paddingLeft: '10px' }}>
            <Skeleton
              variant="rect"
              width="100%"
              height={'15vh'}
              sx={{ borderRadius: '12px' }}
            />{' '}
            <div className="mt-2">
              <Skeleton
                variant="rect"
                width="100%"
                height={'67vh'}
                sx={{ borderRadius: '12px' }}
              />
            </div>
          </div>
        </div>
      )}
    </MainLayoutV2>
  );
};

export default ElementDetails;
