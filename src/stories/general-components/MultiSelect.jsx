import React, { useCallback, useState } from 'react';
import { debounce } from 'lodash';
import { useTheme, styled } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { FormControl, InputLabel } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import InputBase from '@mui/material/InputBase';
import getSearchResults from '../../utils/getSearchResults';
import ErrorBoundary from '../../components/@generalComponents/ErrorBoundary';

const CustomInput = styled(InputBase)(({ borderColor }) => ({
  '& .MuiInputBase-input': {
    borderRadius: 14,
    display: 'flex',
    alignItems: 'center',
    border: '1px solid lightgray',
    height: '49px',
    padding: '2px 10px 2px 10px',
    '&:focus': {
      borderRadius: 14,
      borderColor: borderColor,
      boxShadow: `0 0 0 0.2rem ${borderColor + '20'}`,
    },
  },
}));

export const MultiSelect = ({
  variant = 'outlined',
  selectionType,
  label,
  value,
  selectedItems,
  setSelectedItems,
  onChange,
  ...props
}) => {
  const businessPreference = useSelector((state) => state.core.businessData);
  const businessStructure = useSelector(
    (state) => state.core.businessStructure
  );
  const structures = businessStructure?.structures;
  const firstServiceStructure = structures?.find(
    (s) => s.collectionField === 'services'
  )?.id;
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language;
  const theme = useTheme();
  const dispatch = useDispatch();
  const isDarkmode = theme.palette.mode === 'dark';
  const [selections, setSelections] = useState([]);

  const debouncedSearch = useCallback(
    debounce(
      (searchValue) => onSearch(searchValue, firstServiceStructure),
      400
    ),
    [selectionType]
  );

  const handleInputChange = (event) => {
    debouncedSearch(event.target.value);
  };

  const onSearch = async (searchValue, structureId) => {
    if (structureId) {
      const searchResults = await getSearchResults({
        searchValue,
        t,
        currentLang,
        structureId,
        dispatch,
      });

      let results;
      switch (selectionType) {
        case 'services':
          results = searchResults;
          break;
        case 'cardsinvoiced':
          results = searchResults;
          break;
        case 'cardsexpense':
          results = searchResults;
          break;
        case 'cards':
          results = searchResults;
          break;
        case 'contacts':
          results = searchResults;
          break;
        case 'articles':
          results = searchResults;
          break;
        case 'nodies':
          results = searchResults;
          break;
        default:
          results = searchResults;
      }
      setSelections(results);
    }
  };

  const formatedSelection = selections?.map((item) => {
    return {
      id: item?.id || item?.objectID,
      label:
        (item?.publicDisplay?.name || item?.displayName || item?.name) +
        ' (' +
        item?.duration +
        ' min.)',
      name: item?.displayName || item?.name,
      duration: item?.duration,
      options: item?.options || [],
    };
  });

  return (
    <ErrorBoundary>
      <div>
        <FormControl fullWidth margin="normal">
          <InputLabel
            shrink={true}
            required={props.required}
            error={props.error}
            sx={{
              backgroundColor: isDarkmode ? 'rgb(51,51,51)' : '#FFF',
              padding: '2px 5px 2px 5px',
              borderRadius: '10px',
            }}
          >
            {label}
          </InputLabel>
          <Autocomplete
            multiple
            error={props.error}
            filterSelectedOptions
            noOptionsText={t('noOption')}
            value={selectedItems}
            onChange={(event, newValue) => {
              setSelectedItems(newValue);
            }}
            filterOptions={(options, params) => {
              const filtered = options?.filter((option) =>
                option?.label
                  ?.toLowerCase()
                  ?.includes(params?.inputValue?.toLowerCase())
              );
              return filtered;
            }}
            options={formatedSelection}
            getOptionLabel={(option) => option.label}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                error={props.error}
                onChange={handleInputChange}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '10px',
                    '&.Mui-focused fieldset': {
                      borderColor: businessPreference?.mainColor || '#000',
                      boxShadow: `0 0 0 0.2rem ${
                        businessPreference?.mainColor + '20'
                      }`,
                    },
                  },
                }}
                input={
                  <CustomInput
                    borderColor={businessPreference?.mainColor || '#000'}
                  />
                }
              />
            )}
            {...props}
          />
        </FormControl>
      </div>
    </ErrorBoundary>
  );
};

export default MultiSelect;
