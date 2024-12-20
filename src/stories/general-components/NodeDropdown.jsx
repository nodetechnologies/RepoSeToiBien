import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useTheme } from '@mui/material/styles';
import { FormControl, InputLabel } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Avatar from './Avatar';

export const NodeDropdown = ({
  variant = 'outlined',
  selections,
  label,
  value,
  onChange,
  onBlur,
  defaultValue,
  fieldType,
  size,
  fromCreation,
  required,
  ...props
}) => {
  const businessPreference = useSelector((state) => state.core.businessData);
  const employees = useSelector((state) => state.core.businessData.employees);
  const categories = useSelector((state) => state.core.businessData.categories);
  const currentUser = useSelector((state) => state.core.user);
  const locations = businessPreference?.locations?.filter(
    (location) => location?.isActive
  );
  const [selectedOption, setSelectedOption] = useState(null);
  const theme = useTheme();
  const isDarkmode = theme.palette.mode === 'dark';

  let data = [];
  let type = '';
  const element = selections[0]?.split(':')[1];
  //if type is employees use employees else use categories
  if (element === 'employees') {
    data =
      currentUser?.activeBusiness?.role === 'SUPER-ADMIN' ||
      currentUser?.activeBusiness?.role === 'ADMIN'
        ? employees
        : fromCreation
        ? [
            {
              id: currentUser?.id,
              uid: currentUser?.uid,
              displayName:
                currentUser?.activeBusiness?.publicDisplay?.name ||
                currentUser?.displayName ||
                '',
            },
          ]
        : employees;
    type = 'users';
  } else if (element === 'locations') {
    data = locations;
    type = 'locations';
  } else {
    data = categories;
    type = null;
  }

  const formatedData = data?.map((item) => {
    return {
      id:
        type === 'users'
          ? 'users/' + item?.id
          : type === 'locations'
          ? item?.id
          : item?.uid || item?.name,
      label:
        item?.publicDisplay?.name ||
        item?.displayName ||
        item?.name ||
        item?.label,
      value:
        type === 'users'
          ? item?.id
          : type === 'locations'
          ? item?.id
          : item?.value || item?.name,
      subTitle: type === 'users' ? item?.publicDisplay?.title || '' : '',
      image: item?.avatar || '',
    };
  });

  const formattedNewValue = formatedData?.find(
    (item) => item?.id === value || item?.value === value
  );

  return (
    <div>
      <FormControl fullWidth margin="normal">
        <InputLabel
          shrink={true}
          required={required}
          error={props.error}
          sx={{
            backgroundColor: isDarkmode
              ? 'rgb(51,51,51)'
              : '#FFFFFF !important',
            padding: '2px 10px 2px 10px',
            borderRadius: '10px',
            '& .MuiOutlinedInput-root': {
              backgroundColor: isDarkmode
                ? 'rgb(51,51,51)'
                : '#FFFFFF !important',
            },
          }}
        >
          {label}
        </InputLabel>
        <Autocomplete
          options={formatedData}
          getOptionLabel={(option) => option?.label || ''}
          value={formattedNewValue}
          onChange={(event, newValue) => {
            setSelectedOption(newValue);
            if (newValue) {
              onChange(event, fieldType, newValue.value, type);
            }
          }}
          onBlur={(event) => {
            onBlur(event, 'node', selectedOption?.id, type);
          }}
          renderOption={(props, option) => (
            <li style={{ maxHeight: '40px' }} {...props}>
              <div className="row">
                {option?.image && (
                  <div className="col-1">
                    <Avatar
                      size="xsm"
                      img={option?.image}
                      name={option?.label}
                    />
                  </div>
                )}
                <div className="col-11 fw-500 py-2">
                  {option?.label}
                  {option?.subTitle && (
                    <div
                      style={{
                        fontSize: '10px',
                        color: 'gray',
                        marginTop: '-3px',
                      }}
                    >
                      {option?.subTitle}
                    </div>
                  )}
                </div>
              </div>
            </li>
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              required={required}
              variant="outlined"
              sx={{
                'MuiFormControl-root': {
                  width: '100%',
                },
                '.MuiInputBase-input': {
                  height: '10px',
                  fontSize: size === 'small' ? '11px' : '13px',
                },
                '& .MuiFormLabel-root': {
                  backgroundColor: isDarkmode ? 'rgb(51,51,51)' : '#FFF',
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
          )}
          {...props}
        />
      </FormControl>
    </div>
  );
};

export default NodeDropdown;
