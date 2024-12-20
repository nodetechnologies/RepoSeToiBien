// Libraries
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { v4 as uuidv4 } from 'uuid';
import { Button, Typography, Box } from '@mui/material';

// Utilities
import getComponents from '../../utils/getComponents';
import { db } from '../../firebase';
import { addDoc, collection, doc, updateDoc } from 'firebase/firestore';

// Components
import TextField from '../../stories/general-components/TextField';
import Select from '../../stories/general-components/Select';
import Checkbox from '../../stories/general-components/Checkbox';

const ComponentsCreator = ({
  structureId,
  fields,
  handleClose,
  selectedExistingComponent,
}) => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const currentLangCode = i18n.language;
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [name, setName] = useState(selectedExistingComponent?.name || '');
  const [selectedFields, setSelectedFields] = useState({});
  const [createBtn, setCreateBtn] = useState(false);
  const [items, setItems] = useState([]);

  const businessPreference = useSelector((state) => state.core.businessData);
  const businessStructure = useSelector(
    (state) => state.core.businessStructure
  );

  function getDefaultFields(collectionName) {
    switch (collectionName) {
      case 'contacts':
        return [];
      case 'cardsuninvoiced':
        return [
          { value: 'targetDate', type: 'date' },
          { value: 'finances.total', type: 'money' },
          { value: 'finances.subtotal', type: 'money' },
          { value: 'status', type: 'status' },
          { value: 'targetDetails.name', type: 'string' },
          { value: 'targetProfileName', type: 'string' },
          { value: 'timeStamp', type: 'date' },
          { value: 'lastUpdate', type: 'date' },
        ];
      case 'cardsinvoiced':
        return [
          { value: 'targetDate', type: 'date' },
          { value: 'finances.total', type: 'money' },
          { value: 'finances.subtotal', type: 'money' },
          { value: 'status', type: 'status' },
          { value: 'targetDetails.name', type: 'string' },
          { value: 'targetProfileName', type: 'string' },
          { value: 'timeStamp', type: 'date' },
          { value: 'lastUpdate', type: 'date' },
          { value: 'invoiceDate', type: 'date' },
          { value: 'finances.balance', type: 'money' },
        ];
      case 'tasks':
        return [
          { value: 'name', type: 'string' },
          { value: 'dependencyName', type: 'string' },
          { value: 'attribute1', type: 'string' },
          { value: 'attribute2', type: 'string' },
          { value: 'attribute3', type: 'string' },
          { value: 'targetDate', type: 'date' },
          { value: 'timeStamp', type: 'date' },
          { value: 'lastUpdate', type: 'date' },
          'isDone',
        ];
      case 'storages':
        return [
          { value: 'name', type: 'string' },
          { value: 'dependencyName', type: 'string' },
          { value: 'attribute1', type: 'string' },
          { value: 'attribute2', type: 'string' },
          { value: 'attribute3', type: 'string' },
          { value: 'timeStamp', type: 'date' },
          { value: 'lastUpdate', type: 'date' },
        ];
      case 'profiles':
        return [
          { value: 'name', type: 'string' },
          { value: 'attribute1', type: 'string' },
          { value: 'attribute2', type: 'string' },
          { value: 'attribute3', type: 'string' },
          { value: 'timeStamp', type: 'date' },
          { value: 'lastUpdate', type: 'date' },
        ];
      case 'passes':
        return [
          { value: 'name', type: 'string' },
          { value: 'attribute1', type: 'string' },
          { value: 'attribute2', type: 'string' },
          { value: 'attribute3', type: 'string' },
          { value: 'status', type: 'status' },
          { value: 'startDate', type: 'date' },
          { value: 'timeStamp', type: 'date' },
          { value: 'lastUpdate', type: 'date' },
        ];

      default:
        return [];
    }
  }

  useEffect(() => {
    const components = getComponents();
    const matchedComponent = components.find(
      (component) => component.label === selectedExistingComponent?.component
    );

    //merge selectedExistingComponents?.elements (value) with the matchedComponent
    if (matchedComponent) {
      const newElements = matchedComponent?.elements.map((element) => {
        const matchedElement = selectedExistingComponent?.elements.find(
          (selectedElement) => selectedElement.field === element.field
        );

        return {
          ...element,
          value: matchedElement?.value,
        };
      });

      setSelectedComponent(matchedComponent);
      setCreateBtn(selectedExistingComponent?.createBtn);
      setItems(newElements);
      setSelectedFields(
        selectedExistingComponent?.elements.reduce((acc, element) => {
          acc[element.field] = element?.value;
          return acc;
        }, {})
      );
    }
  }, [selectedExistingComponent]);

  useEffect(() => {
    const newElements = selectedFields;

    //convert to array
    const convertedElements = Object.keys(newElements).map((key) => {
      return {
        field: key,
        type: newElements[key]?.type,
        value: newElements[key]?.id,
      };
    });

    setItems(convertedElements);
  }, [selectedFields]);

  const handleSave = () => {
    const structureRef = doc(
      db,
      'businessesOnNode',
      businessPreference?.id,
      'structure',
      structureId
    );
    const businessRef = doc(db, 'businessesOnNode', businessPreference?.id);
    const component = {
      component: selectedComponent?.label,
      type: selectedComponent?.type,
      structureId: structureRef,
      createBtn: createBtn || false,
      businessId: businessRef,
      name,
      items,
    };

    if (selectedExistingComponent) {
      const componentRef = doc(
        db,
        'businessesOnNode',
        businessPreference?.id,
        'structure',
        structureId,
        'components',
        selectedExistingComponent?.id
      );

      updateDoc(componentRef, component);
    } else {
      addDoc(collection(structureRef, 'components'), component);
    }
    handleClose();
  };

  return (
    <Box sx={{ padding: '25px', marginLeft: '15px' }}>
      {!selectedComponent && (
        <div className="row mt-5" style={{ overflow: 'scroll' }}>
          {getComponents()?.map((component, index) => (
            <div className="col-2 mt-3" key={index}>
              <Button
                key={uuidv4()}
                sx={{
                  width: '100%',
                  height: '100px',
                  borderRadius: '10px',
                  border: '1px solid #E0E0E0',
                  flexDirection: 'column',
                }}
                onClick={() => setSelectedComponent(component)}
              >
                {' '}
                <div>
                  <img
                    src={`/assets/v3/components/${component?.label}.svg`}
                    alt={component?.label}
                    height="50px"
                  />{' '}
                </div>
                <div className="mt-2">
                  <Typography fontSize="12px">{t(component?.label)}</Typography>
                </div>
              </Button>
            </div>
          ))}
        </div>
      )}
      {selectedComponent && (
        <div className="row">
          <div className="col-5 mt-4">
            <Typography>{t(selectedComponent?.label)}</Typography>
            <img
              src={`/assets/v3/components/${selectedComponent?.label}.svg`}
              alt={selectedComponent?.label}
              width="250px"
            />
            <div className="mt-4" style={{ paddingRight: '50px' }}>
              <TextField
                label={t('name')}
                value={name}
                onChange={(e) => setName(e.target.value)}
                fullWidth
                margin="normal"
              />
              <div className="mt-3">
                <Button
                  variant="contained"
                  color="secondary"
                  disableElevation
                  onClick={handleSave}
                  fullWidth
                >
                  {t('save')}
                </Button>
              </div>
            </div>
          </div>
          <div className="col-7">
            {selectedComponent?.elements?.map((element) => {
              const filteredFields = fields?.filter((option) =>
                element?.match?.includes(option?.typeData)
              );

              const componentStructure = businessStructure?.structures?.find(
                (structure) => structure?.id === structureId
              );
              const defaultFields = getDefaultFields(
                componentStructure?.collectionField
              );

              const formatedFields =
                componentStructure?.collectionField === 'storages' ||
                componentStructure?.collectionField === 'tasks' ||
                (componentStructure?.collectionField === 'profiles' &&
                  selectedComponent?.type !== 'content')
                  ? []
                  : filteredFields?.map((option) => ({
                      id: option?.value,
                      value: option?.value,
                      label: option[`name_${currentLangCode}`],
                      type: option?.typeData,
                    }));

              const defaultFieldsFormatted = defaultFields?.map((field) => ({
                id: field?.value,
                value: field?.value,
                type: field?.type,
                label: t(field?.value),
              }));

              const customOptions = [
                {
                  id: 'isDone',
                  value: 'isDone',
                  label: t('markAsDone'),
                  type: 'action',
                },
                {
                  id: 'print',
                  value: 'print',
                  label: t('print'),
                  type: 'action',
                },
              ];

              const mergedFields = element?.match?.length
                ? [...defaultFieldsFormatted, ...formatedFields]
                : customOptions;

              return (
                fields &&
                fields?.length > 0 && (
                  <div>
                    <Select
                      key={element?.field}
                      label={t(element?.field)}
                      fullWidth
                      selections={mergedFields}
                      margin="normal"
                      value={selectedFields[element?.field] || ''}
                      onChange={(e, id) =>
                        setSelectedFields({
                          ...selectedFields,
                          [element?.field]: {
                            id,
                            value: element?.field,
                            type: mergedFields?.find(
                              (field) => field?.id === id
                            )?.type,
                          },
                        })
                      }
                    />

                    {element?.secondary && (
                      <div>
                        <Select
                          key={element?.secondary?.field}
                          label={t(element?.secondary?.field)}
                          fullWidth
                          selections={mergedFields}
                          margin="normal"
                          value={
                            selectedFields[element?.secondary?.field] || ''
                          }
                          onChange={(e, id) =>
                            setSelectedFields({
                              ...selectedFields,
                              [element?.field]: {
                                id,
                                value: element?.field,
                                type: mergedFields?.find(
                                  (field) => field?.id === id
                                )?.type,
                              },
                            })
                          }
                        />
                      </div>
                    )}
                  </div>
                )
              );
            })}
            <Checkbox
              label={t('createBtn')}
              value={createBtn}
              onChange={(e) => setCreateBtn(e.target.checked)}
            />
          </div>
        </div>
      )}
    </Box>
  );
};

export default ComponentsCreator;
