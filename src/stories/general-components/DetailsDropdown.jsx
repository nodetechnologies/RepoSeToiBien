import React from 'react';
import MenuItem from '@mui/material/MenuItem';
import TextField from './TextField';
import ButtonCircle from './ButtonCircle';

export const DetailsDropdown = ({
  onChange,
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
        variant={variant || 'outlined'}
        onChange={onChange}
        margin={margin || 'normal'}
        size={size || 'medium'}
        label={label}
        required={isRequired}
        value={value}
      >
        {options &&
          options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              <div className="d-flex">
                {option?.icon && (
                  <ButtonCircle
                    icon={option?.icon}
                    primary={false}
                    size="small"
                    color="black"
                  />
                )}
                {option?.img && (
                  <img src={option?.img} alt="avatar" width="20" height="20" />
                )}
                <div>
                  {' '}
                  <p className="fs-12 fw-500 mx-3">{option?.label}</p>
                  <div>
                    <p className="fs-10 fw-300 mx-3">{option?.def}</p>
                  </div>
                </div>
              </div>
            </MenuItem>
          ))}
      </TextField>
    </div>
  );
};

export default React.memo(DetailsDropdown);
