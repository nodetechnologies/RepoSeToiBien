import React from 'react';
import { useSelector } from 'react-redux';
import { FormControlLabel } from '@mui/material';
import CheckboxMUI from '@mui/material/Checkbox';

export const Checkbox = ({
  variant = 'outlined',
  selections,
  label,
  large,
  value,
  size,
  onChange,
  onBlur,
  required,
  field,
  ...props
}) => {
  const businessPreference = useSelector((state) => state.core.businessData);
  return (
    <div>
      <FormControlLabel
        required={required}
        error={props.error}
        control={
          <CheckboxMUI
            checked={value || false}
            onChange={(event) => onChange && onChange(event, 'boolean')}
            onClick={(event) => onBlur && onBlur(event, 'boolean')}
            sx={{
              '&.MuiCheckbox-root': {
                color: businessPreference?.mainColor || '#000',
              },
              '&.MuiCheckbox-checked': {
                color: businessPreference?.mainColor || '#000',
              },
            }}
          />
        }
        label={label}
        sx={{
          marginLeft: '1px',
          border: '1px solid lightgray',
          borderRadius: '10px',
          width: '99.8%',
          fontSize: size === 'small' ? '11px' : '13px',
          minHeight: '42px',
          padding: '3px',
          marginTop: '12px',
          marginBottom: '10px',
        }}
      />
    </div>
  );
};

export default Checkbox;
