// Libraries
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Box,
} from '@mui/material';

// Components
import TextField from '../../stories/general-components/TextField';

const FormStructure = ({ structureId, data, handleSave, setData }) => {
  const { t, i18n } = useTranslation();

  const businessStructure = useSelector(
    (state) => state.core.businessStructure
  );

  const currentLangCode = i18n.language;

  const businessStructures = businessStructure?.structures || [];
  const structure = businessStructures.find((s) => s.id === structureId);
  const fields = structure?.fields || [];

  const handleFieldChange = (field, value) => {
    // Check if the field should be stored under `data`
    if (field.type === 'data') {
      setData((prevFormData) => ({
        ...prevFormData,
        data: {
          ...prevFormData.data,
          [field.value]: value,
        },
      }));
    } else {
      // For non-data fields, store/update the value at the top level
      setData((prevFormData) => ({
        ...prevFormData,
        [field.value]: value,
      }));
    }
  };

  const renderField = (field) => {
    const fieldValue =
      field?.type === 'data' ? data?.data[field?.value] : data[field?.value];

    switch (field?.typeData) {
      case 'string':
      case 'number':
        return (
          <TextField
            key={field?.id}
            fullWidth
            margin="normal"
            label={field[`name_${currentLangCode}`] || field?.name_en}
            value={fieldValue || ''}
            onChange={(e) => handleFieldChange(field, e.target.value)}
            type={field?.typeData === 'number' ? 'number' : 'text'}
          />
        );

      case 'selection':
        return (
          <Box>
            <FormControl fullWidth key={field.id}>
              <InputLabel id={`${field.id}-label`}>
                {field[`name_${currentLangCode}`] || field?.name_en}
              </InputLabel>
              {field?.selections?.map((selection) => (
                <Button
                  key={selection.id}
                  variant="contained"
                  onClick={(e) => handleFieldChange(field, e.target.value)}
                >
                  {selection.label}
                </Button>
              ))}
            </FormControl>
          </Box>
        );
      case 'dropdown':
        return (
          <FormControl fullWidth key={field.id}>
            <InputLabel id={`${field.id}-label`}>
              {field[`name_${currentLangCode}`] || field.name_en}
            </InputLabel>
            <Select
              labelId={`${field.id}-label`}
              value={fieldValue || ''}
              margin="normal"
              label={field[`name_${currentLangCode}`] || field?.name_en}
              onChange={(e) => handleFieldChange(field, e.target.value)}
            >
              {field?.selections?.map((selection) => (
                <MenuItem key={selection.id} value={selection?.value}>
                  {selection?.['label_' + currentLangCode]}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );
      case 'file':
        return (
          <Button key={field.id} variant="contained" component="label">
            {field[`name_${currentLangCode}`] || field?.name_en}
            <input
              type="file"
              hidden
              onChange={(e) =>
                handleFieldChange(field?.value, e.target.files[0])
              }
            />
          </Button>
        );
      default:
        return null;
    }
  };

  return <div>{data && fields?.map(renderField)}</div>;
};

export default FormStructure;
