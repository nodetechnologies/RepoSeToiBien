import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { debounce } from 'lodash';
import { FormControl, MenuItem } from '@mui/material';
import TextField from './TextField';
import nodeAxiosFirebase from '../../utils/nodeAxiosFirebase';

const Geo = ({
  variant = 'outlined',
  label,
  value,
  onChange,
  field,
  addToParent,
  setParentData,
  ...props
}) => {
  const { t } = useTranslation();
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  const debouncedSearch = useCallback(
    debounce((searchValue) => onSearch(searchValue), 500),
    [field?.value]
  );

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleInputChange = (event) => {
    debouncedSearch(event.target.value);
    setInputValue(event.target.value);
    onChange(field?.value, event.target.value);
  };

  const onSearch = async (inputValue) => {
    try {
      setLoading(true);
      const response = await nodeAxiosFirebase({
        t,
        method: 'POST',
        noAuth: true,
        url: 'public/address',
        body: {
          query: inputValue,
          geoCode: addToParent ? true : false,
        },
      });
      setLoading(false);
      setSuggestions(response?.data);
    } catch (error) {
      console.error('error', error);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    value = suggestion?.description;
    setInputValue(suggestion?.description);
    setSuggestions([]);
    onChange(field?.value, suggestion?.description);
    if (addToParent) {
      setParentData(suggestion?.geo);
    }
  };

  return (
    <div>
      <FormControl fullWidth>
        <TextField
          variant={variant}
          label={label + (field?.required ? ' *' : '')}
          fullWidth
          type="geo"
          isLoading={loading}
          value={inputValue}
          onChange={handleInputChange}
        />

        {suggestions?.map((suggestion, index) => (
          <MenuItem
            key={index}
            onClick={() => handleSuggestionClick(suggestion)}
          >
            {suggestion?.description}
          </MenuItem>
        ))}
      </FormControl>
    </div>
  );
};

export default Geo;
