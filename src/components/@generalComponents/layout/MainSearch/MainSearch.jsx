import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useSearchParams, useParams } from 'react-router-dom';

//utils
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { debounce } from 'lodash';
import { FormControl, InputAdornment, Input } from '@mui/material';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import getSearchResults from '../../../../utils/getSearchResults';
import ResultsComponent from './ResultsComponent';

export const MainSearch = ({
  structureCollection,
  setClicked,
  clicked,
  fromExternal,
  structureIden,
  onSelectReturn,
  isDarkMode,
}) => {
  const { t } = useTranslation();
  const { moduleId, structureId } = useParams();
  const dispatch = useDispatch();
  const [inputSearchValue, setInputSearchValue] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchResults, setSearchResults] = useState([]);

  const businessPreference = useSelector((state) => state.core.businessData);

  const debouncedSearch = useCallback(
    debounce((searchValue) => onSearch(searchValue), 350),
    [structureId, searchParams]
  );

  const handleInputChange = (event) => {
    setInputSearchValue(event.target.value);
    debouncedSearch(event.target.value);
  };

  const handleClickInput = () => {
    setInputSearchValue('');
    setTimeout(() => {
      setClicked(!clicked);
    }, 200);
  };

  useEffect(() => {
    setInputSearchValue('');
  }, [moduleId]);

  useEffect(() => {
    onSearch();
  }, [structureId]);

  useEffect(() => {
    if (searchParams.get('search')) {
      setInputSearchValue(searchParams.get('search'));
    }
  }, [searchParams]);

  const onSearch = async (searchValue) => {
    if (fromExternal) {
      if (structureCollection === 'employees') {
        const employees = businessPreference?.employees || [];
        if (searchValue !== '' && searchValue !== undefined) {
          const filteredEmployees = employees?.filter((employee) => {
            const nameToSearch =
              employee?.publicDisplay?.name ||
              employee?.name ||
              employee?.displayName;
            return (
              nameToSearch &&
              nameToSearch?.toLowerCase().includes(searchValue.toLowerCase())
            );
          });

          setSearchResults(filteredEmployees);
        } else {
          setSearchResults(employees);
        }
      } else {
        const searchResults = await getSearchResults({
          searchValue,
          t,
          currentLang: 'fr',
          structureId: structureIden,
          dispatch,
        });

        setSearchResults(searchResults);
      }
    } else {
      const newSearchParams = new URLSearchParams(searchParams.toString());
      if (searchValue) {
        newSearchParams.set('search', searchValue);
      } else {
        newSearchParams.delete('search');
      }

      window.history.pushState({}, '', `?${newSearchParams.toString()}`);
      setSearchParams(newSearchParams);
    }
  };

  return (
    <div className="middle-content">
      <div className="col-12">
        <motion.div
          initial={{ width: '15vh' }}
          animate={{ width: clicked ? '20vh' : '15vh' }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        >
          <FormControl
            sx={{
              backgroundColor: '#FFF',
              borderRadius: '30px',
              minWidth: '100%',
              border: 'none',
              '.MuiInputBase-input': {
                border: 'none',
              },
              '& .MuiFormLabel-root': {
                border: 'none',
              },
              '& .MuiInput-underline:before': {
                border: 'none',
              },
              '& .MuiInput-underline:after': {
                border: 'none',
              },
              '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
                border: 'none',
              },
              '& .MuiInput-underline:hover:not(.Mui-disabled):after': {
                border: 'none',
              },
            }}
            fullWidth
          >
            <Input
              value={inputSearchValue}
              onChange={handleInputChange}
              placeholder={t('search')}
              sx={{
                borderRadius: '30px',
                height: '45px',
                padding: '10px',
                fontSize: '13px',
                backgroundColor: isDarkMode ? '#000' : '#FFF',
              }}
              onFocus={handleClickInput}
              onBlur={handleClickInput}
              color="primary"
              margin="none"
              startAdornment={
                <InputAdornment sx={{ marginLeft: '5px' }} position="start">
                  <SearchOutlinedIcon
                    color={isDarkMode ? 'white' : 'black'}
                    sx={{
                      fontSize: '21px',
                    }}
                  />
                </InputAdornment>
              }
            />
          </FormControl>
        </motion.div>
      </div>
      {searchResults.length > 0 && (
        <div>
          <ResultsComponent
            results={searchResults}
            onSelectReturn={onSelectReturn}
            clicked={clicked}
            setClicked={setClicked}
            fromVariable
            selectedType={structureCollection}
            isDarkMode={isDarkMode}
          />
        </div>
      )}
    </div>
  );
};

export default MainSearch;
