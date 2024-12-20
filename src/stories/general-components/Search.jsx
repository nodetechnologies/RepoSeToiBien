import React, {
  useCallback,
  useState,
  useEffect,
  useRef,
  createPortal,
} from 'react';
import { debounce } from 'lodash';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';
import MUITextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchOutlined from '@mui/icons-material/SearchOutlined';
import { CircularProgress, MenuItem, Select, Typography } from '@mui/material';
import ResultsComponent from '../../components/@generalComponents/layout/MainSearch/ResultsComponent';
import getSearchResults from '../../utils/getSearchResults';
import Avatar from './Avatar';

export const Search = ({
  variant = 'outlined',
  onChange,
  type,
  fieldKey,
  fieldType,
  key,
  value,
  selections,
  label,
  selected,
  size,
  setSelected,
  setParentElementPath,
  setParentElementCollection,
  allowReset,
  fromMainInput,
  businessStructures,
  ...props
}) => {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const dispatch = useDispatch();

  const isDarkmode = theme.palette.mode === 'dark';
  const businessPreference = useSelector((state) => state.core.businessData);

  const dropdownOptions = selections?.map((option) => {
    //check if two : are present in the option
    const firstPart = option?.split(':')[0];
    const secondPart = option?.split(':')[1];
    const thirdPart = option?.split(':')[2];

    return {
      label: secondPart,
      value: option,
      id: thirdPart || firstPart,
    };
  });

  const [selectedType, setSelectedType] = useState(
    dropdownOptions[0]?.label || null
  );

  const [selectedOption, setSelectedOption] = useState(
    dropdownOptions[0] || null
  );

  const resultsRef = useRef(null);

  const [searchResults, setSearchResults] = useState();
  const [loading, setLoading] = useState(false);
  const [currentSelection, setCurrentSelection] = useState(null);
  const [updatedSelection, setUpdatedSelection] = useState(null);

  const updateSelection = (selected) => {
    const selectedIden = selected?.id || selected?.objectID;
    const selectedPath = selected?.documentPath || null;
    const targetId = selected?.targetId || null;
    const newSelection = {
      [`${fieldKey}Details`]: {
        [`name`]: selected?.name,
        [`attribute1`]: selected?.attribute1,
        [`attribute2`]: selected?.attribute2,
        [`attribute3`]: selected?.attribute3,
        [`identifiant`]: selected?.identifiant,
        [`id`]: selectedIden,
      },
    };

    setCurrentSelection(newSelection);
    updateAllSelection(selectedIden, selectedType, targetId, selectedPath);
  };

  useEffect(() => {
    if (currentSelection !== null) {
      setUpdatedSelection(currentSelection);
    }
  }, [currentSelection]);

  const handleReset = () => {
    setCurrentSelection(null);
    updateAllSelection(null, selectedType);
    setParentElementPath(null);
    setParentElementCollection(null);
  };

  const updateAllSelection = (
    selectedId,
    currentSelectedType,
    targetId,
    selectedPath
  ) => {
    onChange(selectedId, targetId);
    setParentElementPath(selectedId, fieldKey);
    setParentElementCollection(currentSelectedType);
  };

  const debouncedSearch = useCallback(
    debounce((searchValue) => onSearch(searchValue), 400),
    [selectedType]
  );

  const handleInputChange = (event) => {
    debouncedSearch(event.target.value);
  };

  const handleChange = (value, id) => {
    setSelectedType(value);
    setSelected(value);
    setSelectedOption(dropdownOptions.find((option) => option.id === id));
  };

  function findStructure(type) {
    switch (type) {
      case 'services':
        return businessStructures?.find(
          (structure) => structure?.collectionField === 'services'
        )?.id;
      case 'cardsinvoiced':
        return businessStructures?.find(
          (structure) => structure?.collectionField === 'cardsinvoiced'
        )?.id;
      case 'cardsexpense':
        return businessStructures?.find(
          (structure) => structure?.collectionField === 'cardsexpense'
        )?.id;
      case 'cardsuninvoiced':
        return businessStructures?.find(
          (structure) => structure?.collectionField === 'cardsuninvoiced'
        )?.id;
      case 'contacts':
        return businessStructures?.find(
          (structure) => structure?.collectionField === 'contacts'
        )?.id;
      case 'articles':
        return businessStructures?.find(
          (structure) => structure?.collectionField === 'articles'
        )?.id;
      case 'nodies':
        return businessStructures?.find(
          (structure) => structure?.collectionField === 'nodies'
        )?.id;
      case 'grids':
        return businessStructures?.find(
          (structure) => structure?.collectionField === 'grids'
        )?.id;
      default:
        return null;
    }
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (resultsRef.current && !resultsRef.current.contains(event.target)) {
        setSearchResults([]);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const onSearch = async (searchValue) => {
    let selectedStructure;
    if (selectedOption?.value?.split(':')[2]) {
      selectedStructure = selectedOption?.value?.split(':')[2];
    } else {
      selectedStructure = findStructure(selectedType?.toLowerCase());
    }
    setLoading(true);
    if (selectedStructure) {
      const searchResults = await getSearchResults({
        type: selectedType?.toLowerCase(),
        searchValue,
        t,
        currentLang: i18n.language,
        structureId: selectedStructure,
        dispatch,
      });

      let results;
      switch (selectedType?.toLowerCase()) {
        case 'services':
          results = searchResults;
          break;
        case 'cardsinvoiced':
          results = searchResults;
          break;
        case 'cardsexpense':
          results = searchResults;
          break;
        case 'cardsuninvoiced':
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
        case 'grids':
          results = searchResults;
          break;
        default:
          results = searchResults;
      }
      setSearchResults(results);
      setLoading(false);
    }
  };

  return (
    <div style={{ paddingRight: '1px' }}>
      {/* FIXME it display ID */}
      {currentSelection || allowReset ? (
        <div
          style={{ height: '50px' }}
          className="hover mb-3"
          onClick={handleReset}
        >
          <div
            style={{
              border: `1px solid lightgray`,
              borderRadius: '10px',
              margin: '12px 1px',
              padding: '8px',
            }}
            className="row"
          >
            {!allowReset && (
              <div className="col-1">
                <Avatar
                  name={updatedSelection?.[`${fieldKey}Details`]?.[`name`]}
                  img="103120"
                />
              </div>
            )}
            <div className="col-11 px-4">
              <Typography fontWeight={500}>
                {allowReset
                  ? allowReset
                  : updatedSelection?.[`${fieldKey}Details`]?.[`name`] &&
                    updatedSelection?.[`${fieldKey}Details`]?.[`name`]}
              </Typography>
              <Typography color="#696969" fontWeight={400} fontSize="11px">
                {allowReset
                  ? t('clickToReset')
                  : updatedSelection?.[`${fieldKey}Details`]?.[`attribute1`]
                  ? updatedSelection?.[`${fieldKey}Details`]?.[`attribute1`]
                  : t('noData')}
              </Typography>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <MUITextField
            variant={variant}
            {...props}
            onChange={handleInputChange}
            margin="normal"
            type={type}
            value={value}
            error={props.error}
            label={label}
            InputProps={{
              startAdornment: (
                <InputAdornment>
                  {dropdownOptions?.length > 1 && (
                    <Select
                      disableUnderline={true}
                      variant="standard"
                      onChange={(e) =>
                        handleChange(e.target.value, e.target.id)
                      }
                      value={selectedType}
                      sx={{
                        paddingTop: '0px',
                        border: 'none',
                        '& .MuiInput-input': {
                          border: 'none',
                        },
                      }}
                    >
                      {dropdownOptions?.map((option, index) => (
                        <MenuItem key={index} value={option?.label}>
                          {option?.label}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment sx={{ marginRight: '-4px' }} position="end">
                  {loading ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : (
                    <SearchOutlined />
                  )}
                </InputAdornment>
              ),
            }}
            sx={{
              'MuiFormControl-root': {
                width: '100%',
              },
              '.MuiInputBase-input': {
                height: '42px',
                padding: '2px 10px 2px 10px',
                fontSize: size === 'small' ? '11px' : '13px',
              },
              '& .MuiFormLabel-root': {
                backgroundColor: isDarkmode ? 'rgb(51,51,51)' : '#FFF',
                padding: '2px 10px 2px 10px',
                borderRadius: '10px',
              },
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
          />
          {searchResults && searchResults?.length > 0 && (
            <div ref={resultsRef}>
              <ResultsComponent
                fromMain
                fromMainInput
                onSelectReturn={updateSelection}
                results={searchResults}
                selectedType={selectedType?.toLowerCase()}
              />
            </div>
          )}
        </div>
      )}{' '}
    </div>
  );
};

export default Search;
