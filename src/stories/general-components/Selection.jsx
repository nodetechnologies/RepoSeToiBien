import React from 'react';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import * as Icons from '@mui/icons-material';
import {
  FormControl,
  InputLabel,
  Grid,
  Button,
  Typography,
} from '@mui/material';

export const Selection = ({
  variant = 'outlined',
  selections,
  label,
  value,
  onChange,
  field,
  noForm,
  ...props
}) => {
  const { i18n } = useTranslation();
  const currentlangCode = i18n.language;
  const theme = useTheme();
  const isDarkmode = theme.palette.mode === 'dark';

  const handleButtonClick = (option) => {
    if (field?.typeData === 'status') {
      const index = selections?.findIndex(
        (statusOption) =>
          (statusOption?.['label_' + currentlangCode] ||
            statusOption?.label) ===
          (option?.['label_' + currentlangCode] || option?.label)
      );

      onChange(field.value, index);
    } else if (field?.typeData === 'selectionNode') {
      onChange(field?.value, option?.value);
    } else {
      onChange(
        field?.value,
        option?.['label_' + currentlangCode] || option?.label
      );
    }
  };

  return (
    <div>
      <FormControl
        fullWidth
        margin="normal"
        sx={{
          border: noForm ? '' : '1px solid lightgray',
          borderRadius: noForm ? '' : '14px',
          padding: noForm ? '' : '10px',
        }}
      >
        <InputLabel
          shrink
          required={props.required}
          error={props.error}
          sx={{
            backgroundColor: isDarkmode ? 'rgb(51,51,51)' : '#FFF',
            padding: '2px 10px 2px 10px',
            borderRadius: '10px',
          }}
        >
          {noForm ? '' : label}
        </InputLabel>
        {field?.typeData === 'status' ? (
          <Grid container spacing={2}>
            {selections?.map((option, index) => (
              <Grid item xs={4} key={option?.id}>
                <Button
                  key={option?.value}
                  fullWidth
                  disableElevation
                  value={option?.value}
                  variant={value === index ? 'contained' : 'outlined'}
                  sx={{
                    borderRadius: '10px',
                    borderColor: option?.color || '#000',
                    backgroundColor: value === index ? option?.color : '#FFF',
                    color: value === index ? '#FFF' : option?.color,
                    padding: '2px',
                  }}
                  onClick={() => {
                    handleButtonClick(option);
                  }}
                >
                  <Typography
                    className="middle-content d-flex"
                    fontSize="11px"
                    variant="body2"
                  >
                    <div className="mt-1 mx-1">
                      {React.createElement(
                        Icons[option?.icon || 'Visibility'],
                        {
                          fontSize: 'small',
                        }
                      )}
                    </div>
                    {option?.['label_' + currentlangCode] || option?.label}
                  </Typography>
                </Button>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Grid container spacing={2}>
            {selections?.map((option) => (
              <Grid item xs={4} key={option.id}>
                <Button
                  key={option?.value}
                  disableElevation
                  startIcon={
                    option?.icon &&
                    React.createElement(Icons[option?.icon || 'Visibility'])
                  }
                  fullWidth
                  value={option?.value}
                  variant={
                    value ===
                    (option?.['label_' + currentlangCode] || option?.label)
                      ? 'contained'
                      : 'outlined'
                  }
                  sx={{
                    borderRadius: '10px',
                    borderColor: option?.color || '#000',
                    backgroundColor:
                      field?.typeData === 'selectionNode'
                        ? value === option?.value
                          ? option?.color
                          : '#FFF'
                        : value ===
                          (option?.['label_' + currentlangCode] ||
                            option?.label)
                        ? option?.color
                        : '#FFF',
                    color:
                      field?.typeData === 'selectionNode'
                        ? value === option?.value
                          ? '#FFF'
                          : option?.color
                        : value ===
                          (option?.['label_' + currentlangCode] ||
                            option?.label)
                        ? '#FFF'
                        : option?.color,
                  }}
                  onClick={() => {
                    handleButtonClick(option);
                  }}
                >
                  {option?.['label_' + currentlangCode] || option?.label}
                </Button>
              </Grid>
            ))}
          </Grid>
        )}
      </FormControl>
    </div>
  );
};

export default Selection;
