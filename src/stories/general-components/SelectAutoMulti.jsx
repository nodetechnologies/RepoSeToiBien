import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import {
  Box,
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  Checkbox,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import nodeAxiosFirebase from '../../utils/nodeAxiosFirebase';
import { setGeneralStatus } from '../../redux/actions-v2/coreAction';
import { searchResults } from '../../redux/actions-v2/listAction';

export const SelectAutoMultiList = ({
  label,
  selections,
  field,
  value = [],
  onChange,
  error,
  required,
  parentData,
}) => {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const { search } = useLocation();
  const dispatch = useDispatch();
  const isDarkmode = theme.palette.mode === 'dark';
  const businessId = new URLSearchParams(search).get('businessId');

  const [selectionsOptions, setSelectionsOptions] = useState([]);
  const type = selections?.[0];
  const fieldFromType = type?.split(':')?.[0];
  const queryFromType = type?.split(':')?.[1];

  const lat = parentData?.lat?.toFixed(2);
  const lng = parentData?.lng?.toFixed(2);

  const currentPath = window.location.pathname;

  const getDocuments = async () => {
    try {
      const response = await nodeAxiosFirebase({
        t,
        method: 'POST',
        url: `coreMulti/list`,
        noAuth: currentPath === '/structure-public' ? true : false,
        body: {
          lang: i18n.language,
          structureId: field?.structureId || '',
          querySearch: '',
          publicBusinessId:
            currentPath === '/structure-public' ? businessId : null,
          aroundLat: Number(lat),
          aroundLng: Number(lng),
          limit: 10,
        },
      });
      dispatch(searchResults(response?.hits));
      setSelectionsOptions(
        response?.hits?.map((option) => ({
          id: option?.id,
          label: option?.attribute1 || '',
          subLabel: option?.targetAddress || '',
          value: option?.targetId,
        }))
      );
    } catch (error) {
      console.error('Error fetching data');
      dispatch(setGeneralStatus({ status: 'error', error: error }));
    }
  };

  useEffect(() => {
    if (fieldFromType === 'geo' && queryFromType === 'radius') {
      getDocuments();
    }
  }, [parentData]);

  const handleToggle = (option) => {
    const currentValue = Array.isArray(value) ? [...value] : [];

    const targetValue = `users/${option?.value}`;
    const currentIndex = currentValue.findIndex((item) => item === targetValue);

    if (currentIndex === -1) {
      currentValue.push(targetValue);
    } else {
      currentValue.splice(currentIndex, 1);
    }
    onChange(currentValue, currentValue);
  };

  return (
    <div
      style={{
        zIndex: 1000001,
      }}
      className="d-flex middle-content"
    >
      <div className={'col-12'}>
        <FormControl fullWidth margin="normal">
          <InputLabel
            shrink={true}
            required={required || false}
            error={error}
            sx={{
              backgroundColor: isDarkmode ? 'rgb(51,51,51)' : '',
              padding: '2px 10px 2px 10px',
              borderRadius: '10px',
            }}
          >
            {label}
          </InputLabel>
          <List
            sx={{
              width: '100%',
              maxHeight: 300,
              overflowY: 'auto',
              border: '1px solid',
              borderColor: isDarkmode ? '#666' : '#ccc',
              borderRadius: '10px',
              backgroundColor: isDarkmode ? 'rgb(51,51,51)' : '#FFF',
            }}
            dense
          >
            {selectionsOptions?.map((option) => (
              <ListItem
                key={option.id}
                button
                dense
                onClick={() => handleToggle(option)}
                sx={{ padding: '10px 15px' }}
              >
                <Checkbox
                  edge="start"
                  checked={
                    Array.isArray(value) &&
                    value.some((item) => item === 'users/' + option?.value)
                  }
                  tabIndex={-1}
                  disableRipple
                />
                <ListItemText
                  primary={option?.label}
                  secondary={option.subLabel || ''}
                  sx={{ marginLeft: 1 }}
                />
              </ListItem>
            ))}
          </List>
        </FormControl>
      </div>
    </div>
  );
};

export default SelectAutoMultiList;
