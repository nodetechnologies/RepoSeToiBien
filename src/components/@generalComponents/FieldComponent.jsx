// Libraries
import React, { useEffect, useCallback, useMemo } from 'react';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

// Components
import TextField from '../../stories/general-components/TextField';
import DatePickerUTC from '../../stories/general-components/DatePickerUTC';
import TagSelector from '../../stories/general-components/TagSelector';
import IconUploader from './IconUploader';
import Select from '../../stories/general-components/Select';
import Specific from '../../stories/general-components/Specific';
import Checkbox from '../../stories/general-components/Checkbox';
import SelectAutoComplete from '../../stories/general-components/SelectAutoComplete';
import Selection from '../../stories/general-components/Selection';
import NodeDropdown from '../../stories/general-components/NodeDropdown';
import Search from '../../stories/general-components/Search';
import Slider from '../../stories/general-components/Slider';
import Geo from '../../stories/general-components/Geo';
import SelectAutoMulti from '../../stories/general-components/SelectAutoMulti';
import Signature from '../../stories/general-components/Signature';
import QuickNote from './QuickNote';
import Section from '../../stories/general-components/Section';

const FieldComponent = ({
  field,
  value,
  key,
  staticField,
  onChange,
  defaultValue,
  parentElementCollection,
  parentElementPath,
  error,
  setParentElementCollection,
  setParentElementPath,
  fromCreation,
  handleSave,
  setCreationTargetId,
  creationTargetId,
  handleKeyPress,
  ref,
  fieldIndex,
  parentData,
  setParentData,
  formData,
  allowReset,
  businessId,
  activeStructures,
  size,
}) => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language;
  // Function to evaluate a single condition
  const evalCondition = useCallback((condition, fieldValue) => {
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
  }, []);

  const businessStructures =
    useSelector((state) => state.core.businessStructure)?.structures ||
    activeStructures ||
    [];

  // Function to evaluate all conditions for an option
  const evaluateConditions = useCallback(
    (conditions) => {
      if (!conditions || conditions.length === 0) return true;

      let result = true;

      for (let i = 0; i < conditions.length; i++) {
        const condition = conditions[i];
        const fieldValue = formData?.[condition?.field];
        const conditionResult = evalCondition(condition, fieldValue);

        const logic = condition.logic || 'AND';

        if (i === 0) {
          result = conditionResult;
        } else {
          if (logic === 'AND') {
            result = result && conditionResult;
          } else if (logic === 'OR') {
            result = result || conditionResult;
          } else {
            result = result && conditionResult;
          }
        }
      }

      return result;
    },
    [formData, evalCondition]
  );

  // Before rendering, filter the selections based on conditions
  let options = field?.selections || [];

  if (field.typeData === 'dropdown') {
    options = options.filter((option) => {
      if (option?.conditional && option?.conditional?.length > 0) {
        return evaluateConditions(option.conditional);
      }
      return true;
    });
  }

  const handleFieldChange = useCallback(
    (event, fieldType, id, element) => {
      let value;

      switch (fieldType) {
        case 'number':
          value = Number(event.target.value);
          break;
        case 'boolean':
          value = event.target.checked;
          break;
        case 'date':
        case 'date-time':
          value = id;
          break;
        case 'node':
          value = element === 'users' ? `users/${id}` : id;
          break;
        case 'hook':
          value = element === 'profiles' ? `profiles/${id}` : id;
          break;
        case 'signature':
          value = event;
          break;
        case 'html':
          value = event;
          break;
        default:
          value = event.target.value;
      }
      onChange(field?.value, value, fieldType, fieldIndex);
    },
    [field, fieldIndex, onChange]
  );

  const handleSearchChange = useCallback(
    (value, targetId) => {
      onChange(field.value, value);
      const valueId = targetId?.split('/')[1] || value?.split('/')[1];
      if (field.value === 'targetId' || field.value === 'dependencyId') {
        setCreationTargetId(valueId);
      }
    },
    [field.value, onChange, setCreationTargetId]
  );

  const handleSearchChangeMulti = useCallback(
    (selectedIds, selectedTargets) => {
      const validTargets = selectedTargets.filter(
        (target) => target !== 'users/undefined' && target !== null
      );

      let finalValue = value || [];

      onChange(field.value, selectedTargets);
    },
    [field.value, onChange, setCreationTargetId, value]
  );

  const addToParent = field?.value === 'georadius' ? true : false;

  const handleSelectChange = useCallback(
    (fieldId, value) => {
      onChange(fieldId, value);
      if (handleSave) {
        handleSave(fieldId, value);
      }
    },
    [handleSave, onChange]
  );

  useEffect(() => {
    if (ref?.current) {
      ref?.current?.focus();
    }
  }, [ref]);

  const handleFieldBlur = useCallback(
    (event, fieldType, id, element) => {
      if (handleSave) {
        let value;

        switch (fieldType) {
          case 'number':
            value = Number(event.target.value);
            break;
          case 'boolean':
            value = event.target.checked;
            break;
          case 'node':
            value =
              element === 'users'
                ? id?.startsWith('users')
                  ? id
                  : `users/${id}`
                : id;
            break;
          case 'signature':
            value = event;
            break;
          case 'date':
          case 'geo':
          case 'date-time':
            value = id;
            break;
          default:
            value = event.target.value;
        }
        handleSave(field?.value, value, fieldType);
      }
    },
    [field, handleSave]
  );

  const handleSelectBlur = useCallback(
    (fieldId, value) => {
      if (handleSave) {
        handleSave(fieldId, value);
      }
    },
    [handleSave]
  );

  const handleUploadComplete = useCallback(
    (files) => {
      const fileUrls =
        files?.length > 0
          ? files?.map((file) => file.fileUrl)
          : files && files !== null
          ? [files]
          : '';
      onChange(
        field.value,
        field?.typeData === 'media-single' ||
          field?.typeData === 'media-single-private'
          ? fileUrls[0]?.fileUrl
          : fileUrls
      );
      if (handleSave) {
        handleSave(
          field?.value,
          field?.typeData === 'media-single' ||
            field?.typeData === 'media-single-private'
            ? fileUrls[0]?.fileUrl
            : fileUrls
        );
      }
    },
    [field, onChange]
  );

  useEffect(() => {
    if (field?.typeData === 'date' && !value) {
      handleFieldChange(null, 'date', moment());
    }
  }, [field?.typeData, value, handleFieldChange]);

  useEffect(() => {
    if (field?.typeData === 'date-time' && !value) {
      handleFieldChange(null, 'date-time', moment());
    }
  }, [field?.typeData]);

  useEffect(() => {
    if (field?.typeData === 'selection' && !value && value !== 0) {
      handleSelectChange(
        field?.value,
        field?.selections[0]?.['label_' + currentLang]
      );
    }

    if (field?.typeData === 'status' && !value && value !== 0) {
      handleSelectChange(field?.value, field?.selections[0]?.value);
    }
  }, [field?.typeData]);

  const renderField = useMemo(() => {
    const commonProps = {
      key: field?.value || key,
      error,
      required: field?.required || false,
      label: field?.name,
      mask: field?.mask,
      value,
      staticField,
      defaultValue,
      onBlur: handleFieldBlur,
      onChange: handleFieldChange,
      fieldType: field?.typeData,
      ref,
    };

    switch (field?.typeData) {
      case 'string':
      case 'text':
        return (
          <TextField
            {...commonProps}
            fullWidth
            validation={field?.validation || null}
            transform={field?.transform || null}
            handleKeyPress={handleKeyPress}
          />
        );
      case 'number':
      case 'money':
        return (
          <TextField
            {...commonProps}
            fullWidth
            type="number"
            handleKeyPress={handleKeyPress}
          />
        );
      case 'date':
      case 'date-time':
        return (
          <DatePickerUTC
            {...commonProps}
            fullWidth
            InputLabelProps={{ shrink: true }}
            timePicker={field?.typeData === 'date-time'}
          />
        );
      case 'boolean':
        return <Checkbox {...commonProps} fullWidth />;
      case 'media':
      case 'media-single':
      case 'media-single-private':
        return (
          <IconUploader
            {...commonProps}
            elementType={field?.name}
            fieldType={field?.typeData}
            onComplete={handleUploadComplete}
            fieldKey={field.value}
            businessId={businessId}
            size={size}
            value={value}
          />
        );
      case 'status':
      case 'selection':
        return (
          <Selection
            {...commonProps}
            selections={field?.selections}
            onChange={handleSelectChange}
            onBlur={handleSelectBlur}
            field={field}
          />
        );
      case 'tags':
        return (
          <TagSelector
            {...commonProps}
            fullWidth
            onChange={handleSelectChange}
            onBlur={handleSelectBlur}
          />
        );
      case 'html':
        return (
          <QuickNote
            elementDetails={value}
            fieldKey={field.value}
            handleSave={handleSelectChange}
          />
        );
      case 'slider':
        return (
          <Slider
            {...commonProps}
            selections={field?.selections}
            onChange={handleSelectChange}
            onBlur={handleSelectBlur}
            field={field}
          />
        );
      case 'geo':
        return (
          <Geo
            {...commonProps}
            onChange={handleSelectChange}
            onBlur={handleSelectBlur}
            field={field}
            addToParent={addToParent}
            setParentData={setParentData}
          />
        );
      case 'search':
        return (
          <Search
            {...commonProps}
            fieldKey={field.value}
            fullWidth
            allowReset={allowReset}
            selections={field?.selections}
            onChange={handleSearchChange}
            setParentElementPath={setParentElementPath}
            setParentElementCollection={setParentElementCollection}
            businessStructures={businessStructures}
          />
        );
      case 'signature':
        return (
          <Signature
            {...commonProps}
            fieldKey={field.value}
            fullWidth
            onChange={handleFieldChange}
            onBlur={handleFieldBlur}
          />
        );
      case 'hook':
        return (
          <SelectAutoComplete
            {...commonProps}
            moreDetails={field?.moreDetails || []}
            fieldKey={field?.value}
            creationTargetId={creationTargetId}
            selections={field?.selections}
            parentElementCollection={parentElementCollection}
            parentElementPath={parentElementPath}
            noEmpty
          />
        );
      case 'hook-multi':
        return (
          <SelectAutoMulti
            {...commonProps}
            fieldKey={field?.value}
            creationTargetId={creationTargetId}
            selections={field?.selections}
            field={field}
            onChange={(selectedIds, selectedTargets) =>
              handleSearchChangeMulti(selectedIds, selectedTargets)
            }
            parentData={parentData}
          />
        );
      case 'dropdown':
        return (
          <Select
            {...commonProps}
            fieldKey={field?.value}
            defaultValue={value}
            selections={options}
            onChange={handleSelectChange}
            noEmpty
          />
        );
      case 'node':
        return (
          <NodeDropdown
            {...commonProps}
            fromCreation={fromCreation}
            defaultValue={defaultValue}
            selections={field?.selections}
            noEmpty
          />
        );
      case 'specific':
        return (
          <Specific
            {...commonProps}
            field={field}
            fromCreation={fromCreation}
            defaultValue={defaultValue}
            onChange={handleSelectChange}
            onBlur={handleSelectBlur}
            selections={field?.selections}
            noEmpty
          />
        );
      case 'section':
        return <Section field={field} />;
      default:
        console.warn(`Unsupported field type: ${field?.typeData}`);
        return null;
    }
  }, [
    field,
    value,
    key,
    error,
    staticField,
    defaultValue,
    handleFieldBlur,
    handleFieldChange,
    handleSelectChange,
    handleSelectBlur,
    handleUploadComplete,
    handleSearchChange,
    setParentElementPath,
    setParentElementCollection,
    creationTargetId,
    parentElementCollection,
    parentElementPath,
    handleKeyPress,
    ref,
    options,
  ]);

  return renderField;
};

export default FieldComponent;
