import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material/styles';
import { FormControl, InputLabel, MenuItem } from '@mui/material';
import Brakes from './specific-components/Brakes';
import Battery from './specific-components/Battery';
import Tires from './specific-components/Tires';

const Specific = ({ variant = 'outlined', label, value, field, ...props }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isDarkmode = theme.palette.mode === 'dark';
  const [data, setData] = useState({});

  const onChange = useCallback(
    (fieldId, value) => {
      setData((prevState) => ({ ...prevState, [field?.value]: value }));
    },
    [field]
  );

  return (
    <div>
      <FormControl
        sx={{
          border: '1px solid lightgray',
          borderRadius: '10px',
          padding: '10px',
          minHeight: '50px',
          '& .MuiOutlinedInput-root': {
            backgroundColor: isDarkmode ? 'rgb(51,51,51)' : '#FFFFFF',
          },
        }}
        fullWidth
        margin="normal"
      >
        <InputLabel
          shrink={true}
          required={props?.required || false}
          error={props?.error}
          sx={{
            backgroundColor: isDarkmode ? 'rgb(51,51,51)' : '',
            padding: '2px 10px 2px 10px',
            borderRadius: '10px',
          }}
        >
          {label}
        </InputLabel>
        {field?.value === 'brakes' && (
          <Brakes onChange={onChange} data={data} />
        )}
        {field?.value === 'tires' && <Tires onChange={onChange} data={data} />}
        {field?.value === 'battery' && (
          <Battery onChange={onChange} data={data} />
        )}
      </FormControl>
    </div>
  );
};

export default Specific;
