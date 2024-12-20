import React, { useState } from 'react';
import { useTheme, styled } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useSearchParams, useParams } from 'react-router-dom';
import FormControl from '@mui/material/FormControl';
import { Autocomplete, TextField } from '@mui/material';
import InputBase from '@mui/material/InputBase';
import ErrorBoundary from '../../components/@generalComponents/ErrorBoundary';
import nodeAxiosFirebase from '../../utils/nodeAxiosFirebase';
import { useEffect } from 'react';

const CustomInput = styled(InputBase)(({ borderColor }) => ({
  '& .MuiInputBase-input': {
    borderRadius: 14,
    display: 'flex',
    width: '100%',
    alignItems: 'center',
    border: 'transparent',
    height: '30px',
    padding: '2px 10px 2px 10px',
    '&:focus': {
      borderRadius: 14,
      boxShadow: `0 0 0 0.2rem ${borderColor + '20'}`,
    },
  },
}));

export default function TagSelectorMenu({
  field,
  currentLangCode,
  label,
  value,
  onChange,
  defaultValue,
  ...props
}) {
  const { t } = useTranslation();
  const theme = useTheme();
  const { structureId } = useParams();
  const [availableTags, setAvailableTags] = useState([]);
  const isDarkmode = theme.palette.mode === 'dark';

  const businessStructure = useSelector(
    (state) => state.core.businessStructure
  );

  const activeStructureTags = businessStructure?.structures?.find(
    (s) => s.id === structureId
  )?.tags;

  useEffect(() => {
    setAvailableTags(activeStructureTags || []);
  }, [activeStructureTags]);

  const handleAddNewTag = async (newTag) => {
    const availableTagsTransit = [...availableTags, newTag];
    setAvailableTags(availableTagsTransit);
    await nodeAxiosFirebase({
      t,
      method: 'POST',
      url: `business/structure`,
      body: {
        type: 'tags',
        data: availableTagsTransit,
        structureId: structureId,
      },
    });
  };

  const handleTagChange = (event, newValue) => {
    const lastValue = newValue[newValue.length - 1];

    // Check if the last value is not in the availableTags
    if (lastValue && !availableTags.includes(lastValue)) {
      handleAddNewTag(lastValue);
    }
    onChange(event, newValue);
  };

  return (
    <ErrorBoundary>
      <FormControl fullWidth margin="normal">
        <Autocomplete
          multiple
          freeSolo
          error={props?.error}
          filterSelectedOptions
          noOptionsText={t('noOption')}
          fullWidth
          value={value || []}
          onChange={handleTagChange}
          options={availableTags}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              error={props.error}
              sx={{
                mt: '-20px',
                ml: '12px',
                height: '42px',
                maxHeight: '42px',
                minHeight: '42px',
                '& .MuiOutlinedInput-root': {
                  borderRadius: '30px 30px 30px 30px',
                  backgroundColor: isDarkmode ? '#000' : '#FFF',
                  borderColor: 'transparent',
                  width: '100%',
                  '&.Mui-focused fieldset': {
                    borderColor: 'transparent',
                  },
                  '& fieldset': {
                    border: 'none',
                  },
                },
              }}
              input={<CustomInput />}
            />
          )}
          {...props}
        />
      </FormControl>
    </ErrorBoundary>
  );
}
