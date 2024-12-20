// react
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

// redux actions
import moment from 'moment';
import { useParams } from 'react-router';

// components
import * as drawerActions from '../redux/actions-v2/drawer-actions';
import nodeAxiosFirebase from '../utils/nodeAxiosFirebase';
import Button from '../stories/general-components/Button';
import FieldComponent from '../components/@generalComponents/FieldComponent';
import MultiSelect from '../stories/general-components/MultiSelect';
import Select from '../stories/general-components/Select';
import { ListItem } from '@mui/material';
import { fetchDataSuccess } from '../redux/actions-v2/listAction';
import { setGeneralStatus } from '../redux/actions-v2/coreAction';
import TextField from '../stories/general-components/TextField';
import GeneralText from '../stories/general-components/GeneralText';

const AddAppointment = ({
  startDate,
  defaultLocationId,
  currentCard,
  userId,
  structureChildren,
  toSelect,
  setIsLoading,
}) => {
  const { t, i18n } = useTranslation();
  const { structureId } = useParams();
  const dispatch = useDispatch();

  //Component data states
  const [selectedItems, setSelectedItems] = useState([]);
  const [data, setData] = useState({
    locationId: defaultLocationId,
    startDate: startDate,
  });
  const currentLangCode = i18n.language;
  const [parentElementCollection, setParentElementCollection] = useState('');
  const [structureIden, setStructureIden] = useState(
    toSelect ? null : structureId
  );
  const [fields, setFields] = useState([]);
  const [parentElementPath, setParentElementPath] = useState('');
  const [creationTargetId, setCreationTargetId] = useState('');
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [serviceNotes, setServiceNotes] = useState({});

  const businessStructure = useSelector(
    (state) => state.core.businessStructure
  );

  const businessPreference = useSelector((state) => state.core.businessData);

  const [allSubOptions, setAllSubOptions] = useState([]);

  const structure = businessStructure?.structures?.find(
    (structure) => structure.id === structureIden
  );

  const handleSelectedOption = (subOption) => {
    // Check if the option is already selected
    const existingIndex = selectedOptions.findIndex(
      (option) => option.value === subOption.value
    );

    if (existingIndex > -1) {
      // If the option is found, remove it from the array
      setSelectedOptions(
        selectedOptions?.filter((_, index) => index !== existingIndex)
      );
    } else {
      // If the option is not found, add it to the array
      setSelectedOptions((prev) => [
        ...prev,
        {
          label: subOption?.label,
          value: subOption?.value,
          tax1: subOption?.tax1,
          tax2: subOption?.tax2,
          name: subOption?.name,
          itemId: subOption.itemId,
          price: subOption.price,
        },
      ]);
    }
  };

  useEffect(() => {
    const fields = structure?.fields?.filter(
      (field) => field?.value !== 'dependencyId' && field?.value !== 'status'
    );
    let updatedFields = fields;
    if (currentCard?.id || userId) {
      const fieldsToRemove = ['targetProfileId', 'targetId'];
      updatedFields = fields?.filter(
        (field) => !fieldsToRemove.includes(field?.value)
      );
    }

    setFields(updatedFields);
  }, [structureIden]);

  const handleClose = () => {
    dispatch(drawerActions.createAppointment({ isDrawerOpen: false }));
  };

  const structureUninvoicedCard = businessStructure?.structures?.find(
    (structure) => structure?.collectionField === 'cardsuninvoiced'
  );

  const handleCreateCardAndItems = async () => {
    try {
      const {
        name,
        note,
        assignedToId,
        tags,
        targetProfileId,
        targetId,
        ...restOfData
      } = data;
      handleClose();

      const newPassDataStart = {
        startDate: {
          seconds: moment(data?.startDate).unix(),
          _seconds: moment(data?.startDate).unix(),
          nanoseconds: 0,
        },
        endDate: {
          seconds: moment(data?.endDate).unix(),
          _seconds: moment(data?.endDate).unix(),
          nanoseconds: 0,
        },
        name: data?.name || '',

        locationId: data?.locationId,

        status: 0,
      };

      let mergedPassesStart = [...(passesList || []), newPassDataStart];
      dispatch(fetchDataSuccess(mergedPassesStart, 'passes'));
      const cardResponse = await nodeAxiosFirebase({
        t,
        method: 'POST',
        url: `coreSeqV2`,
        showLoading: true,
        body: {
          name: data?.name || '',
          tags: data?.tags || [],
          elementPath: '/cards',
          structureId: structureUninvoicedCard?.id,
          data: {
            targetDate: moment(data?.startDate)?.toISOString(),
            status: toSelect ? 0 : 4,
            note: data?.note || '',
            assignedToId: toSelect ? data?.assignedToId || null : null,
            targetProfileId: toSelect ? null : data?.targetProfileId || '',
            targetId: data?.targetId || 'users/' + userId,
            date: moment(data?.startDate)?.toISOString(),
          },
        },
      });
      //wait 2 sec
      await new Promise((resolve) => setTimeout(resolve, 2500));
      if (cardResponse?.elementId) {
        await savePass(cardResponse?.elementId);
        await addServicesToCard(cardResponse?.elementId);
      }
    } catch (error) {
      console.error('Error fetching data');
      dispatch(setGeneralStatus({ status: 'error', error: error }));
    }
  };

  const listReducer = useSelector((state) => state.list.data);
  const passesList = listReducer?.passes;
  const targetId =
    data?.targetId ||
    (currentCard?.targetId
      ? 'users/' + currentCard?.targetId
      : 'users/' + userId);

  const savePass = async (cardId) => {
    try {
      dispatch(setGeneralStatus({ status: 'loading' }));
      const sendCard = currentCard?.id || cardId;
      const targetProfile =
        data?.targetProfileId || 'profiles/' + currentCard?.targetProfileId;

      const newPass = await nodeAxiosFirebase({
        t,
        method: 'POST',
        url: `coreSeqV2`,
        showLoading: true,
        body: {
          name: data?.name || '',
          tags: data?.tags || [],
          elementPath: '/cards/' + sendCard + '/passes',
          structureId: structureIden || structureId,
          data: {
            ...data,
            locationId: data?.locationId,
            assignedToId: data?.assignedToId || null,
            targetProfileId: toSelect ? null : targetProfile || '',
            dependencyId: 'cards/' + sendCard,
            status: 0,
            startDate: moment(data?.startDate)?.toISOString(),
            endDate: moment(data?.endDate)?.toISOString(),
            targetId: targetId,
          },
        },
      });

      const newPassData = {
        startDate: {
          seconds: moment(data?.startDate).unix(),
          _seconds: moment(data?.startDate).unix(),
          nanoseconds: 0,
        },
        endDate: {
          seconds: moment(data?.endDate).unix(),
          _seconds: moment(data?.endDate).unix(),
          nanoseconds: 0,
        },
        name: data?.name || '',
        note: newPass?.data?.note || '',
        tags: newPass?.data?.tags || [],
        dependencyName: newPass?.data?.dependencyName || '',
        locationId: newPass?.data?.locationDetails?.id,
        locationName: newPass?.data?.locationDetails?.name,
        documentIdentifiant: newPass?.data?.documentIdentifiant,
        documentPath: newPass?.data?.documentPath,
        dependencyDetails: {
          structureIdentifiant:
            newPass?.data?.dependencyDetails?.structureIdentifiant,
          id: newPass?.data?.dependencyDetails?.id || '',
          name: newPass?.data?.dependencyDetails?.name,
        },
        targetDetails: newPass?.data?.targetDetails,
        targetProfileDetails: newPass?.data?.targetProfileDetails,
        targetName: newPass?.data?.targetDetails?.name,
        targetProfileName: newPass?.data?.targetProfileDetails?.name,
        assignedToName: newPass?.data?.assignedToDetails?.name,
        attribute1: newPass?.data?.attribute1,
        attribute2: newPass?.data?.attribute2 || '',
        attribute3: newPass?.data?.attribute3 || '',
        attribute4: newPass?.data?.attribute4 || '',
        status: 0,
        structureIdentifiant: newPass?.data?.structureDetails?.id,
      };

      let mergedPasses = [...(passesList || []), newPassData];
      dispatch(fetchDataSuccess(mergedPasses, 'passes'));
      dispatch(setGeneralStatus({ status: 'success' }));
    } catch (error) {
      console.error('Error fetching data');
      dispatch(setGeneralStatus({ status: 'error', error: error }));
    }
  };

  const addServicesToCard = async (cardId) => {
    for (let service of selectedItems) {
      //find all options for the service
      const matchedOption = selectedOptions?.find(
        (subOption) => subOption?.itemId === service?.id
      );

      const matchedFormattedOption = {
        name: matchedOption?.name,
        price: matchedOption?.price,
        tax1: matchedOption?.tax1 || true,
        tax2: matchedOption?.tax2 || true,
      };

      await new Promise((resolve) => setTimeout(resolve, 200));
      await addServiceToCard({
        service: service?.id,
        cardId: cardId,
        options: matchedFormattedOption ? [matchedFormattedOption] : [],
      });
    }
  };

  const handleFieldChange = (fieldId, value) => {
    let convertedValue;
    convertedValue = value;
    setData((prevState) => ({ ...prevState, [fieldId]: convertedValue }));
  };

  const handleNoteChange = (serviceId, note) => {
    setServiceNotes((prevNotes) => ({
      ...prevNotes,
      [serviceId]: note,
    }));
  };

  const firstItemStructureId = businessStructure?.structures?.find(
    (structure) => structure?.collectionField === 'items'
  )?.id;

  const addServiceToCard = async (serviceDataToAdd) => {
    await nodeAxiosFirebase({
      t,
      method: 'POST',
      url: `coreSeqV2`,
      body: {
        name: t('item'),
        tags: [],
        elementPath: 'cards/' + serviceDataToAdd?.cardId + '/items',
        structureId: firstItemStructureId,
        lang: currentLangCode,
        data: {
          note: serviceNotes[serviceDataToAdd?.service] || '',
          status: 0,
          targetId: targetId,
          dependencyId: 'cards/' + serviceDataToAdd?.cardId,
          targetProfileId: data?.targetProfileId?.split('/')[1]
            ? 'profiles/' + data?.targetProfileId?.split('/')[1]
            : null,
          hookedWith: 'services/' + serviceDataToAdd?.service,
          quantity: 1,
          group: null,
          options: serviceDataToAdd?.options || [],
        },
      },
    });
  };

  useEffect(() => {
    let temp = '';
    let totalDuration = 0;
    selectedItems?.map((service, index) => {
      totalDuration += service?.duration;
      if (service?.name?.match(/\(([^)]+)\)/)?.[1]) {
        temp += service?.name?.match(/\(([^)]+)\)/)?.[1];
        if (index != selectedItems?.length - 1) temp += ' - ';
      }
    });

    setData({
      ...data,
      name: temp,
      endDate: moment(data?.startDate).add(totalDuration, 'm'),
    });
    localStorage.setItem('slotDurationInMinutes', totalDuration);
  }, [selectedItems]);

  useEffect(() => {
    if (selectedItems.length === 0) {
      setAllSubOptions([]); // Clear options if no services are selected
      return;
    }

    const newlyAddedService = selectedItems[selectedItems.length - 1];
    const newOptions =
      newlyAddedService.options?.map((subOption) => ({
        label: subOption?.name,
        value: subOption?.id,
        tax1: subOption?.tax1,
        tax2: subOption?.tax2,
        name: subOption?.name,
        itemId: newlyAddedService?.id || newlyAddedService?.objectID,
        price: subOption?.price,
      })) || [];

    setAllSubOptions((prevOptions) => [
      ...prevOptions.filter((option) => option.itemId !== newlyAddedService.id),
      ...newOptions,
    ]);
  }, [selectedItems]);

  return (
    <React.Fragment>
      <div className="col-12 mb-2">
        {(!structureId || toSelect) && (
          <Select
            label={t('structure')}
            options={businessStructure?.structures
              ?.filter((structure) => structure?.collectionField === 'passes')
              ?.map((structure) => ({
                label: structure[`name`],
                value: structure?.id,
                id: structure?.id,
              }))}
            value={structureIden}
            onChange={(value, id) => {
              setStructureIden(id);
            }}
          />
        )}
        {!currentCard?.cardId && (
          <MultiSelect
            selectionType="services"
            label={t('services')}
            selectedItems={selectedItems}
            setSelectedItems={setSelectedItems}
          />
        )}
        {allSubOptions?.length > 0 && (
          <div>
            {allSubOptions?.map((subOption) => (
              <ListItem
                divider
                onClick={() => handleSelectedOption(subOption)}
                dense
                button
                sx={{
                  height: '30px',
                  fontSize: '12px',
                  backgroundColor: selectedOptions?.find(
                    (option) => option?.value === subOption?.value
                  )
                    ? businessPreference?.mainColor + '10'
                    : 'transparent',
                }}
              >
                <div className="col-6">
                  <p>{subOption?.label}</p>
                </div>
                <div className="col-6">
                  <p>{(subOption?.price / 10000)?.toFixed(2) + ' $'}</p>
                </div>
              </ListItem>
            ))}
          </div>
        )}
        <div>
          {selectedItems?.map((service) => (
            <div className="mt-2" key={service?.id}>
              <TextField
                type="text"
                fullWidth
                label={'Notes' + ' - ' + service?.name}
                placeholder={t('internalNotes')}
                value={serviceNotes[service.id] || ''}
                onChange={(e) => handleNoteChange(service.id, e.target.value)}
              />
            </div>
          ))}
        </div>
        {fields?.map((field) => (
          <FieldComponent
            key={field?.value}
            field={field}
            value={data[field?.value]}
            onChange={handleFieldChange}
            setCreationTargetId={setCreationTargetId}
            creationTargetId={creationTargetId}
            parentElementCollection={parentElementCollection}
            parentElementPath={parentElementPath}
            setParentElementCollection={setParentElementCollection}
            setParentElementPath={setParentElementPath}
          />
        ))}
      </div>
      <Button
        label={t('save')}
        size="small"
        fullWidth
        onClick={currentCard?.cardId ? savePass : handleCreateCardAndItems}
      />
    </React.Fragment>
  );
};

export default AddAppointment;
