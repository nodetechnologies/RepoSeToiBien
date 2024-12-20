import React from 'react';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';

export const DropdownInput = ({
  onChange,
  primary,
  options,
  value,
  restrict = [],
  disabled = [],
  isRequired,
  margin,
  name,
  variant,
  size,
  label,
}) => {
  if (!options || options?.length === 0) {
    return null;
  }

  return (
    <div>
      <TextField
        select
        fullWidth
        name={name}
        variant={variant || 'standard'}
        onChange={onChange}
        margin={margin || 'dense'}
        size={size || 'medium'}
        label={label}
        required={isRequired}
        value={value}
      >
        {options &&
          options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
      </TextField>
    </div>
  );
};

export default React.memo(DropdownInput);
