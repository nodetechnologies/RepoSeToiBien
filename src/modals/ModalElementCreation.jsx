// react
import React, { useEffect, useState } from 'react';

// redux
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import Lottie from 'react-lottie';
import animationData from '../lotties/doneNode_fr.json';

// utils
import { useTranslation } from 'react-i18next';
import ModalLarge from './Base/ModalLarge';
import nodeAxiosFirebase from '../utils/nodeAxiosFirebase';
import FieldComponent from '../components/@generalComponents/FieldComponent';
import Button from '../stories/general-components/Button';
import { Typography } from '@mui/material';
import { setGeneralStatus, setRefresh } from '../redux/actions-v2/coreAction';
import Loading from '../stories/general-components/Loading';
import SideExtra from '../components/@generalComponents/SideExtra';

const ModalElementCreation = ({
  isOpen,
  modalCloseHandler,
  fromElement,
  structureId,
  targetId,
  targetProfileId,
  elementPath,
  dependencyId,
  dependencyHook,
  roomId,
  roomComplete,
  handleDone,
  blockLayoutDetails,
}) => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const defaultOptions = {
    loop: false,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
      progressiveLoad: false,
    },
  };

  const businessStructure = useSelector(
    (state) => state.core.businessStructure
  );

  const businessPreference = useSelector((state) => state.core.businessData);
  const businessStructures = businessStructure?.structures;
  const structure = businessStructures.find((s) => s.id === structureId);
  const currentLangCode = i18n.language;

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [done, setDone] = useState(false);
  const [section, setSection] = useState(null);
  const [formData, setFormData] = useState({});
  const [currentPage, setCurrentPage] = useState(0);
  const [creationTargetId, setCreationTargetId] = useState(targetId || '');
  const [creationDependencyId, setCreationDependencyId] = useState(
    dependencyId || ''
  );

  const [creationProfileId, setCreationProfileId] = useState(
    targetProfileId || ''
  );
  const [parentElementCollection, setParentElementCollection] = useState('');
  const [parentElementPath, setParentElementPath] = useState(elementPath || '');
  const [parentData, setParentData] = useState(null);
  const [cleanedFields, setCleanedFields] = useState([]);

  useEffect(() => {
    if (isOpen && structure?.fields) {
      const initialFormData = structure.fields.reduce((acc, field) => {
        acc[field.value] = field.typeData === 'search' ? null : '';
        return acc;
      }, {});
      setFormData(initialFormData);
    }
  }, [structure?.fields]);

  useEffect(() => {
    if (isOpen) {
      let cleanedFields = structure?.fields;

      if (creationTargetId) {
        cleanedFields = cleanedFields.filter(
          (field) => field.value !== 'targetId'
        );
      }

      if (creationProfileId) {
        cleanedFields = cleanedFields.filter(
          (field) => field.value !== 'targetProfileId'
        );
      }

      if (creationDependencyId) {
        cleanedFields = cleanedFields.filter(
          (field) => field.value !== 'dependencyId'
        );
      }

      // Filter fields based on their conditions
      cleanedFields = cleanedFields.filter((field) => {
        if (field?.conditional && field?.conditional?.length > 0) {
          return field?.conditional.every((condition) => {
            const fieldValue = formData[condition.field];
            switch (condition.operator) {
              case '==':
                return fieldValue === condition.value;
              case '!=':
                return fieldValue !== condition.value;
              case '>':
                return fieldValue > condition.value;
              case '<':
                return fieldValue < condition.value;
              case 'AND':
                return (
                  field?.conditional.every((cond) =>
                    evalCondition(cond, formData[cond.field])
                  ) && true
                );
              case 'OR':
                return (
                  field?.conditional.some((cond) =>
                    evalCondition(cond, formData[cond.field])
                  ) || false
                );
              default:
                return true;
            }
          });
        }
        return true;
      });

      setCleanedFields(cleanedFields);
    }
  }, [
    structureId,
    formData,
    creationTargetId,
    creationProfileId,
    creationDependencyId,
    isOpen,
  ]);

  const pages = [];
  let currentSection = [];

  cleanedFields.forEach((field) => {
    if (field.typeData === 'page') {
      if (currentSection.length > 0) {
        pages.push(currentSection); // Push the accumulated section as a "page"
      }
      currentSection = []; // Start a new section
    }
    currentSection.push(field);
  });

  // Push any remaining fields as the last page
  if (currentSection.length > 0) {
    pages.push(currentSection);
  }

  // Page navigation functions
  const handleNextPage = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Get fields for the current page
  const fieldsOnCurrentPage = pages[currentPage] || [];

  // Helper function to evaluate conditions
  const evalCondition = (condition, fieldValue) => {
    switch (condition.operator) {
      case '==':
        return fieldValue === condition.value;
      case '!=':
        return fieldValue !== condition.value;
      case '>':
        return fieldValue > condition.value;
      case '<':
        return fieldValue < condition.value;
      default:
        return true;
    }
  };

  // Create a function to handle changes to the fields
  const handleFieldChange = (fieldId, value) => {
    let convertedValue = value;

    setFormData((prevState) => ({ ...prevState, [fieldId]: convertedValue }));
  };

  function resolvePath(structure) {
    if (structure?.collectionField === 'services') {
      return '/services';
    } else if (structure?.collectionField === 'cardsinvoiced') {
      return '/cards';
    } else if (structure?.collectionField === 'cardsexpense') {
      return '/cards';
    } else if (structure?.collectionField === 'contacts') {
      return '/users';
    } else if (structure?.collectionField === 'cardsuninvoiced') {
      return '/cards';
    } else if (structure?.collectionField === 'passes') {
      return '/passes';
    } else if (structure?.collectionField === 'payments') {
      return '/payments';
    } else if (structure?.collectionField === 'articles') {
      return '/articles';
    } else if (structure?.collectionField === 'profiles') {
      return '/profiles';
    } else if (structure?.collectionField === 'storages') {
      return '/storages';
    } else if (structure?.collectionField === 'tasks') {
      return '/tasks';
    } else if (structure?.collectionField === 'grids') {
      return '/grids';
    } else if (structure?.collectionField === 'nodies') {
      return '/nodies';
    }
  }

  const finalDep =
    dependencyHook !== '' && dependencyHook?.startsWith('targetId')
      ? 'users/' + targetId
      : dependencyHook?.startsWith('targetProfileId')
      ? 'profiles/' + targetProfileId
      : dependencyHook?.startsWith('id')
      ? elementPath
      : !formData?.dependencyId
      ? structure?.collectionField === 'storages' ||
        structure?.collectionField === 'tasks' ||
        structure?.collectionField === 'nodies' ||
        structure?.collectionField === 'passes'
        ? creationProfileId
          ? 'profiles/' + creationProfileId
          : creationTargetId
          ? 'users/' + creationTargetId
          : ''
        : ''
      : formData?.dependencyId || '';

  const finalElementPath = finalDep + resolvePath(structure);
  const finalPath = finalElementPath?.startsWith('profiles')
    ? 'users/' +
      targetId +
      '/connections/' +
      targetId +
      businessPreference?.id +
      '/' +
      finalElementPath
    : finalElementPath;

  const handleCreate = async () => {
    const formatDatesInObject = (obj) => {
      for (let key in obj) {
        if (moment.isMoment(obj[key])) {
          obj[key] = obj[key].utc().format();
        }
      }
      return obj;
    };

    const formatedData = {
      name: formData?.name || '-',
      tags: formData?.tags || [],
      elementPath: finalPath,
      structureId: structure?.id,
      blockStructure: blockLayoutDetails?.blockStructure,
      tabIndex: blockLayoutDetails?.tabIndex,
      blockIdentifiant: blockLayoutDetails?.blockIdentifiant,
      lang: currentLangCode,
      data: formatDatesInObject({
        ...formData,
        targetProfileId:
          formData?.targetProfileId ||
          (creationProfileId ? 'profiles/' + creationProfileId : null),
        dependencyId: formData?.dependencyId || finalDep,
        targetId: creationTargetId ? 'users/' + creationTargetId : null,
      }),
    };

    let newErrors = {};
    cleanedFields.forEach((field) => {
      if (
        field.required &&
        (formData[field.value] === undefined || formData[field.value] === null)
      ) {
        newErrors[field.value] = 'This field is required';
      }
    });

    // If there are any errors, don't submit the form
    if (Object.keys(newErrors)?.length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      const response = await nodeAxiosFirebase({
        t,
        method: 'POST',
        url: `coreSeqV2`,
        body: formatedData,
      });
      const newElementId = response.elementId;

      if (roomId) {
        try {
          dispatch(
            setGeneralStatus({
              status: 'loading',
              position: 'modal',
              type: 'pulse',
            })
          );
          await nodeAxiosFirebase({
            t,
            method: 'POST',
            url: `coreSeqV2/node-element`,
            body: {
              name: formData?.name,
              structureId: structure?.id,
              dropId: roomId,
              elementPath: resolvePath(structure) + '/' + newElementId,
              moduleId: '',
              collectionField: structure?.collectionField,
            },
          });
          dispatch(
            setGeneralStatus({
              status: 'success',
              position: 'modal',
              type: 'pulse',
            })
          );
          handleClose();

          roomComplete();
          handleDone(response?.data);
        } catch (error) {
          console.error('Failed to add element to room');
          dispatch(setGeneralStatus({ status: 'error', error: error }));
        }
      } else if (newElementId) {
        if (
          structure?.collectionField === 'cardsinvoiced' ||
          structure?.collectionField === 'cardsuninvoiced' ||
          structure?.collectionField === 'contacts' ||
          structure?.collectionField === 'services' ||
          structure?.collectionField === 'articles'
        ) {
          setLoading(false);
          setDone(true);
          setSection(
            structure?.collectionField === 'cardsinvoiced' ||
              structure?.collectionField === 'cardsuninvoiced'
              ? 'cards'
              : structure?.collectionField === 'contacts'
              ? 'user'
              : 'operations'
          );
          setMessage(newElementId);
          if (fromElement) {
            dispatch(setRefresh({ status: true, structureId: structure?.id }));
          }
          handleDone && handleDone(response?.data);
        } else {
          handleClose();
          if (fromElement) {
            dispatch(setRefresh({ status: true, structureId: structure?.id }));
          }
          handleDone && handleDone(response?.data);
        }
      } else {
        setLoading(false);
        setMessage('An error occurred while creating the element');
        console.error('Element ID not returned from creation API');
      }
    } catch (error) {
      console.error('Failed to create element', error);
      dispatch(setGeneralStatus({ status: 'error', error: error }));
    }
  };

  const handleClose = () => {
    modalCloseHandler();
    setDone(false);
  };

  const handleOpenElement = () => {
    if (section === 'cards') {
      navigate(
        `/app/element/${structure?.collectionField}/${structure?.id}/${message}`
      );
    } else if (section === 'user') {
      navigate(
        `/app/element/${structure?.collectionField}/${structure?.id}/${
          message + businessPreference?.id
        }`
      );
    } else if (section === 'operations') {
      navigate(
        `/app/element/${structure?.collectionField}/${structure?.id}/${message}`
      );
    }
    modalCloseHandler();
    setDone(false);
  };

  const listedValues = cleanedFields?.map((field) => field?.value);

  return (
    <ModalLarge
      isOpen={isOpen}
      modalCloseHandler={modalCloseHandler}
      title={t('create') + ' ' + (structure?.name || '')}
      btnLabel={t('create')}
    >
      <div style={{ position: 'relative' }} className="d-flex">
        <div
          style={{
            position: 'relative',
            overflow: 'scroll',
            maxHeight: '62vh',
            height: '100%',
          }}
          className={
            structure?.element?.preferences?.sideExtra ? 'col-7' : 'col-12'
          }
        >
          {loading && <Loading type="pulse" size="small" />}
          {!loading && !done && (
            <div>
              <div>
                <>
                  {fieldsOnCurrentPage?.map((field) => (
                    <FieldComponent
                      key={field?.value}
                      field={field}
                      value={formData[field?.value]}
                      values={listedValues}
                      fromCreation={true}
                      creationTargetId={creationTargetId}
                      error={errors[field.value]}
                      setCreationTargetId={setCreationTargetId}
                      onChange={handleFieldChange}
                      setCreationProfileId={setCreationProfileId}
                      parentElementCollection={parentElementCollection}
                      parentElementPath={parentElementPath}
                      setParentElementPath={setParentElementPath}
                      setParentElementCollection={setParentElementCollection}
                      parentData={parentData}
                      setParentData={setParentData}
                      formData={formData}
                    />
                  ))}
                </>
              </div>
              {pages?.length > 1 && (
                <div className="d-flex align-c middle-content">
                  <Button
                    onClick={handlePrevPage}
                    label={t('previous')}
                    variant="text"
                    disabled={currentPage === 0}
                    buttonSx={{ mt: 1, mx: 2 }}
                  />
                  <Typography sx={{ mt: 0.6 }}>
                    Page {currentPage + 1} {t('of')} {pages?.length}
                  </Typography>
                  <Button
                    onClick={handleNextPage}
                    label={t('next')}
                    variant="text"
                    buttonSx={{ mt: 1, mx: 2 }}
                    disabled={currentPage === pages?.length - 1}
                  />
                </div>
              )}
              {currentPage === pages?.length - 1 && (
                <div className="mt-3">
                  <Button
                    onClick={handleCreate}
                    label={t('create')}
                    fullWidth
                  />
                </div>
              )}
            </div>
          )}
          {!loading && message && !done && (
            <div>
              {' '}
              <Typography
                variant="body1"
                color="error"
                fontSize="14px"
                fontWeight={400}
                textAlign="center"
              >
                {message}
              </Typography>
            </div>
          )}

          {!loading && done && (
            <div>
              <div className="align-c">
                <Lottie options={defaultOptions} height={120} width={250} />
              </div>
              <div className="mb-5 mt-2">
                <Typography
                  variant="body1"
                  fontSize="14px"
                  fontWeight={400}
                  textAlign="center"
                >
                  {t('elementCreated')}
                </Typography>
              </div>
              {message && (
                <div className="d-flex align-c">
                  <Button
                    onClick={handleOpenElement}
                    label={t('open')}
                    fullWidth
                    buttonSx={{ marginRight: 2, marginLeft: 2 }}
                  />
                  <Button
                    onClick={handleClose}
                    label={t('close')}
                    fullWidth
                    variant="outlined"
                    buttonSx={{ marginRight: 2, marginLeft: 2 }}
                  />
                </div>
              )}
            </div>
          )}
        </div>
        {structure?.element?.preferences?.sideExtra && (
          <div style={{ position: 'sticky', top: '0px' }} className="col-5">
            <SideExtra
              structure={structure}
              data={formData}
              secColor={businessPreference?.secColor}
              color={businessPreference?.mainColor}
            />
          </div>
        )}
      </div>
    </ModalLarge>
  );
};
export default ModalElementCreation;
