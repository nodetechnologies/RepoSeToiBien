import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { db } from '../firebase';
import { getDoc, doc } from 'firebase/firestore';
import DrawerSide from '../stories/layout-components/DrawerSide';
import { toast } from 'react-toastify';
import moment from 'moment';
import nodeAxiosFirebase from '../utils/nodeAxiosFirebase';
import FieldComponent from '../components/@generalComponents/FieldComponent';
import { Skeleton } from '@mui/material';
import { setGeneralStatus } from '../redux/actions-v2/coreAction';
import Loading from '../stories/general-components/Loading';
import { Responsive, WidthProvider } from 'react-grid-layout';
import BlockLayout from '../stories/layout-components/BlockLayout';
import GeneralText from '../stories/general-components/GeneralText';

const ResponsiveGridLayout = WidthProvider(Responsive);

const Quickview = ({
  item,
  type,
  isDrawerOpen,
  handleDrawerClose,
  handleUpdate,
  handleDelete,
  editing,
}) => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const [toEdit, setToEdit] = useState(editing || false);
  const { elementId } = useParams();
  const currentlangCode = i18n.language;
  const [isLoading, setIsLoading] = useState(true);
  const [structureId, setStructureId] = useState(
    item?.structureIdentifiant || item?.structureId || null
  );
  const [data, setData] = useState({});
  const [layout, setLayout] = useState([]);
  const [accTabs, setAccTabs] = useState([]);
  const [cleanedFields, setCleanedFields] = useState([]);
  const [allowReset, setAllowReset] = useState(true);

  const [activeIndex, setActiveIndex] = useState(0);

  const elementIden = item?.documentPath?.split('/').pop();

  const businessStructure = useSelector(
    (state) => state.core.businessStructure
  );

  const businessStructures = businessStructure?.structures;

  const structure = React.useMemo(() => {
    return businessStructures?.find((s) => s.id === structureId);
  }, [businessStructures, structureId]);

  const handleFieldChange = (fieldId, value) => {
    let convertedValue;
    convertedValue = value;
    setData((prevState) => ({ ...prevState, [fieldId]: convertedValue }));
    if (fieldId === 'targetProfileId') {
      handleSaveMain(value, fieldId);
    }
  };

  const layoutInit = accTabs[0]?.blocks || [];

  const singleElement = useSelector(
    (state) => state.element.singleElementDetails
  );

  useEffect(() => {
    if (!layoutInit) return;
    setLayout(layoutInit);
  }, [structureId, data, layoutInit]);

  useEffect(() => {
    const fetchDoc = async () => {
      if (data?.id !== elementIden) {
        setIsLoading(true);
      }

      if (!item?.documentPath) {
        return;
      }
      const docRef = doc(db, item?.documentPath);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const itemData = docSnap.data();

        setData({
          id: docSnap.id,
          ...itemData,
          ...itemData?.data,
          dependencyId: itemData?.dependencyId?.id,
          price: itemData?.finances?.price / 10000 || 0,
          tax1: itemData?.finances?.tax1 ?? false,
          tax2: itemData?.finances?.tax2 ?? false,
          tax3: itemData?.finances?.tax3 ?? false,
          fees: itemData?.finances?.fees / 10000 || 0,
          cost: itemData?.finances?.cost / 10000 || 0,
          finances: {
            ...itemData?.finances,
            incomeLine: itemData?.finances?.incomeLine?.path || null,
          },
          dependencyPath: itemData?.dependencyId?.path,
          categoryId: itemData?.categoryId?.id || null,
          assignedTo: itemData?.assignedTo?.id || null,
          targetId: itemData?.targetId?.id,
          ownerId: itemData?.ownerId?.id,
          targetProfileId: itemData?.targetProfileId?.id || null,
          structureId: itemData?.structureId?.id,
          name: itemData?.name,
        });
        setStructureId(itemData?.structureId?.id);
        if (type === 'edit') {
          setToEdit(true);
        }
      } else {
        toast.error(t('error'));
      }
    };
    fetchDoc();
  }, [item?.documentPath]);

  const getDocument = async () => {
    try {
      dispatch(setGeneralStatus({ status: 'loading' }));
      const pageData = await nodeAxiosFirebase({
        t,
        method: 'POST',
        url: `coreMulti/single`,
        errorToast: t('errorLoadingDocument'),
        body: {
          documentPath: item?.documentPath,
          structureId: data?.structureId,
          lang: currentlangCode,
          document: data,
          height: window.innerHeight,
          device: 'desktop',
        },
      });
      setAccTabs(pageData || []);
      setIsLoading(false);
      dispatch(setGeneralStatus({ status: 'success' }));
    } catch (error) {
      console.error('Error fetching data');
      dispatch(setGeneralStatus({ status: 'error', error: error }));
    }
  };

  useEffect(() => {
    if (data?.documentPath && data?.structureId) {
      getDocument();
    }
  }, [data?.documentPath, data?.structureId]);

  const handleSaveMain = async (value, key) => {
    if (key === 'targetId' || key === 'targetProfileId') {
      if (value !== null && value !== undefined) {
        let formatedPathId = value?.split('/');

        //keep only last part of path
        formatedPathId = formatedPathId.pop();
        dispatch(
          setGeneralStatus({ status: 'loading', position: 'update-main' })
        );

        const handleUpdateData = async () => {
          await nodeAxiosFirebase({
            t,
            method: 'POST',
            url: `coreSeqV2/refresh`,
            body: {
              elementPath: data?.documentPath,
              newId: formatedPathId,
              type: key,
            },
          });
        };
        setAllowReset(true);
        setData((prevState) => ({
          ...prevState,
          targetDetails: { ...data?.targetDetails, name: t('targetUpdated') },
        }));
        dispatch(
          setGeneralStatus({ status: 'loading', position: 'update-main' })
        );
        handleUpdateData();
      }
    }
  };

  const handleSave = async (key, value) => {
    if (key === 'targetId' || key === 'targetProfileId') {
      return;
    }

    let finalKey = key;
    let finalValue = value;

    if (key === 'startDate') {
      const actualStart = moment.unix(
        data?.startDate?.seconds || data?.startDate?._seconds
      );
      const actualEnd = moment.unix(
        data?.endDate?.seconds || data?.endDate?._seconds
      );
      const actualDuration = moment.duration(actualEnd.diff(actualStart));
      const newStart = moment(value);
      const newEnd = moment(value).add(actualDuration);

      finalKey = 'datesPass';
      finalValue = {
        startDate: newStart,
        endDate: newEnd,
      };

      setData((prevState) => ({
        ...prevState,
        startDate: {
          seconds: newStart.unix(),
          _seconds: newStart.unix(),
        },
        endDate: {
          seconds: newEnd.unix(),
          _seconds: newEnd.unix(),
        },
      }));
    }

    if (key === 'endDate') {
      const newStart = moment.unix(
        data?.startDate?.seconds || data?.startDate?._seconds
      );
      const newEnd = moment(value);

      finalKey = 'datesPass';
      finalValue = {
        startDate: newStart,
        endDate: newEnd,
      };

      setData((prevState) => ({
        ...prevState,
        startDate: {
          seconds: newStart.unix(),
          _seconds: newStart.unix(),
        },
        endDate: {
          seconds: newEnd.unix(),
          _seconds: newEnd.unix(),
        },
      }));
    }

    let formatedPath = data?.documentPath.split('/');
    dispatch(setGeneralStatus({ status: 'loading' }));

    if (value !== null && value !== undefined) {
      formatedPath = formatedPath
        .filter((part) => part !== elementIden)
        .join('/');

      await nodeAxiosFirebase({
        t,
        method: 'PATCH',
        url: `coreSeqV2`,
        body: {
          documentId: elementIden,
          elementPath: formatedPath,
          key: finalKey,
          value: finalValue,
        },
      });
      if (key && value && handleUpdate) {
        handleUpdate(key, value);
      }
      dispatch(setGeneralStatus({ status: 'success' }));
    }
  };

  const setCreationTargetId = (value) => {
    setAllowReset(false);
    setData((prevState) => ({ ...prevState, targetId: value }));
  };

  const setParentElementPath = (value, key) => {
    handleSaveMain(value, key);
  };

  const setParentElementCollection = (value) => {};

  useEffect(() => {
    const filteredFields = structure?.fields?.filter((field) => {
      if (field?.value === 'dependencyId') {
        return false;
      }

      if (elementId !== elementIden || data?.dependencyDetails?.id) {
        if (field?.value === 'targetId') {
          return false;
        }
        if (field?.value === 'targetProfileId') {
          return false;
        }
      }

      // Conditional filtering
      if (field?.conditional && field?.conditional?.length > 0) {
        return field?.conditional?.every((condition) => {
          const fieldValue = data[condition.field];
          switch (condition.operator) {
            case '==':
              return fieldValue == condition.value;
            case '!=':
              return fieldValue != condition.value;
            case '>':
              return fieldValue > condition.value;
            case '<':
              return fieldValue < condition.value;
            case 'AND':
              return (
                field?.conditional.every((cond) =>
                  evalCondition(cond, data[cond.field])
                ) && true
              );
            case 'OR':
              return (
                field?.conditional.some((cond) =>
                  evalCondition(cond, data[cond.field])
                ) || false
              );
            default:
              return true;
          }
        });
      }

      return true;
    });

    setCleanedFields(filteredFields || []);
  }, [structure, elementIden]);

  // Helper function to evaluate conditions
  const evalCondition = (condition, fieldValue) => {
    switch (condition.operator) {
      case '==':
        return fieldValue == condition.value;
      case '!=':
        return fieldValue != condition.value;
      case '>':
        return fieldValue > condition.value;
      case '<':
        return fieldValue < condition.value;
      default:
        return true;
    }
  };

  const formatAttribute = (title, attribute) => {
    if (typeof title === 'object') {
      if (title?.seconds) {
        return moment
          .unix(title?.seconds || moment().unix())
          .format('DD MMM YYYY');
      } else if (title?._seconds || moment().unix()) {
        return moment
          .unix(title?._seconds || moment().unix())
          .format('DD MMM YYYY');
      }
    } else if (typeof title === 'number') {
      const fieldValue = structure?.[attribute];
      const field = cleanedFields?.find((field) => field?.value === fieldValue);
      if (field?.typeData === 'status') {
        const selection = field?.selections?.find(
          (selection) => selection?.value === title
        );
        return selection?.['label_' + currentlangCode];
      } else {
        return title;
      }
    } else if (typeof title === 'string') {
      return title;
    }
  };

  return (
    <DrawerSide
      title={
        formatAttribute(data?.attribute1, 'attribute1') +
        ' ' +
        formatAttribute(data?.attribute2, 'attribute2')
      }
      subtitle={formatAttribute(data?.attribute3, 'attribute3')}
      handleDrawerClose={handleDrawerClose}
      isDrawerOpen={isDrawerOpen}
      elementName={data?.name}
      setToEdit={setToEdit}
      toEdit={toEdit}
      lastUpdate={data?.lastUpdate}
      elementPath={data?.documentPath}
      elementIden={elementIden}
      handleSave={handleSave}
      item={data}
      structure={structure}
      handleRemove={handleDelete}
    >
      {isLoading ? (
        <div>
          <Skeleton variant="rectangular" width="100%" height="60px" />
          <div className="mt-2" />
          <Skeleton variant="rectangular" width="100%" height="20px" />
          <div className="mt-2" />
          <Skeleton variant="rectangular" width="100%" height="20px" />
          <div className="mt-2" />
          <Skeleton variant="rectangular" width="100%" height="140px" />
          <div className="mt-2" />
          <Skeleton variant="rectangular" width="100%" height="40px" />
          <div className="mt-2" />
          <Skeleton variant="rectangular" width="100%" height="40px" />
          <div className="mt-2" />
          <Skeleton variant="rectangular" width="100%" height="120px" />
        </div>
      ) : (
        <div>
          {toEdit ? (
            <div>
              {singleElement?.isLocked ? (
                <div className="align-c row mt-3">
                  <Loading />
                  <div>
                    <GeneralText
                      text={t('updatingMainData') + '...'}
                      primary={true}
                      fontSize={'14px'}
                      size={'medium'}
                    />
                  </div>
                  <div className="mt-2">{t('updatingMainWarning')}</div>
                </div>
              ) : (
                <div>
                  {cleanedFields?.map((field) => (
                    <FieldComponent
                      key={field?.value}
                      field={{
                        typeData: field?.typeData,
                        label: field?.name,
                        name: field?.name,
                        selections: field?.selections,
                        value: field?.value,
                        validation: field?.validation,
                        typeData: field?.typeData,
                        required: field?.required,
                        conditional: field?.conditional,
                      }}
                      value={data?.[field?.value]}
                      allowReset={
                        elementId === elementIden
                          ? !data?.dependencyDetails?.id
                            ? allowReset === true
                              ? field?.value === 'targetId'
                                ? data?.targetDetails?.name
                                : t('clickToSelect')
                              : allowReset
                            : false
                          : false
                      }
                      setCreationTargetId={setCreationTargetId}
                      setParentElementCollection={setParentElementCollection}
                      setParentElementPath={setParentElementPath}
                      creationTargetId={data?.targetId}
                      parentElementPath={data?.targetId}
                      onChange={handleFieldChange}
                      handleSave={handleSave}
                    />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div>
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                }}
              >
                {elementIden && layout && !isLoading && (
                  <ResponsiveGridLayout
                    className="layout"
                    style={{ width: '100%', height: '100%' }}
                    layouts={{ lg: layout }}
                    rowHeight={10}
                    margin={[8, 8]}
                    isDraggable={false}
                    allowOverlap={false}
                    cols={{ lg: 12, md: 12, sm: 6, xs: 1, xxs: 1 }}
                  >
                    {layout &&
                      layout?.map((blockLayout) => {
                        return (
                          <div
                            key={blockLayout.i}
                            style={{
                              width: '100%',
                            }}
                          >
                            {blockLayout?.index === 0 && (
                              <BlockLayout
                                key={`${blockLayout.i + activeIndex}`}
                                childrenComponent={blockLayout?.contentType}
                                editMode={false}
                                fromList={false}
                                activeIndex={activeIndex}
                                blockWidth={(blockLayout.w * 20) / 12}
                                heightPercentage={
                                  blockLayout?.height ||
                                  (blockLayout.h * 10) / 12
                                }
                                layout={blockLayout}
                                elementDetails={{
                                  data: blockLayout?.data,
                                  header: blockLayout?.header,
                                  type: blockLayout?.type,
                                  elementData: data,
                                  groups: blockLayout?.groups,
                                  i: blockLayout?.i,
                                  index: blockLayout?.index,
                                }}
                              />
                            )}
                          </div>
                        );
                      })}
                  </ResponsiveGridLayout>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </DrawerSide>
  );
};

export default Quickview;
