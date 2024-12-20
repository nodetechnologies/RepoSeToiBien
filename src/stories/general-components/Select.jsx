import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material/styles';
import { useSelector } from 'react-redux';
import {
  Box,
  FormControl,
  InputAdornment,
  InputLabel,
  Popper,
  Typography,
} from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import ErrorBoundary from '../../components/@generalComponents/ErrorBoundary';

export const Select = ({
  variant = 'outlined',
  selections = [],
  label,
  value,
  defaultValue,
  filterValue,
  onChange,
  fieldKey,
  staticView,
  noEmpty,
  ...props
}) => {
  const businessPreference = useSelector((state) => state.core.businessData);
  const { t, i18n } = useTranslation();
  const currentLangCode = i18n.language;
  const [staticViewSelected, setStaticViewSelected] = useState(staticView);
  const theme = useTheme();
  const isDarkmode = theme.palette.mode === 'dark';
  let data;

  if (!data) {
    data = [];
  }

  data = noEmpty
    ? selections
    : [...selections, { label: t('empty'), value: '' }];

  const selectedValue = data?.find((option) => option?.value === value);

  if (filterValue) {
    data = data?.filter((option) => option?.filter?.includes(filterValue));
  }

  return (
    <ErrorBoundary>
      <div>
        {staticViewSelected ? (
          <div className="hover" onClick={() => setStaticViewSelected(false)}>
            <FormControl
              fullWidth
              margin="normal"
              sx={{
                border: '1px solid lightgray',
                borderRadius: '10px',
                padding: '10px',
                minHeight: '50px',
                '& .MuiOutlinedInput-root': {
                  backgroundColor: isDarkmode ? 'rgb(51,51,51)' : '#FFFFFF',
                },
              }}
            >
              <InputLabel
                shrink={true}
                required={props.required}
                error={props.error}
                sx={{
                  backgroundColor: isDarkmode ? 'rgb(51,51,51)' : '#FFF',
                  padding: '2px 10px 2px 10px',
                  borderRadius: '10px',
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: isDarkmode ? 'rgb(51,51,51)' : '#FFFFFF',
                  },
                }}
              >
                {label + ' _'}
              </InputLabel>{' '}
              <div>
                <Typography fontWeight={500} fontSize="13px">
                  {selectedValue?.['label_' + currentLangCode] ||
                    selectedValue?.label}
                </Typography>
              </div>{' '}
            </FormControl>
          </div>
        ) : (
          <>
            {data?.length > 0 && (
              <FormControl fullWidth margin="normal">
                <InputLabel
                  shrink={true}
                  error={props.error}
                  required={props.required}
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
                  error={props.error}
                  PopperComponent={({ children, ...props }) => (
                    <Popper {...props}>{children}</Popper>
                  )}
                  options={data}
                  noOptionsText={t('noOption')}
                  getOptionLabel={(option) =>
                    option?.[`label_${currentLangCode}`] ||
                    option?.label ||
                    'N/A'
                  }
                  value={selectedValue}
                  onChange={(event, newValue) => {
                    if (newValue) {
                      onChange(
                        fieldKey,
                        newValue?.value ??
                          newValue?.id ??
                          newValue?.[`label_${currentLangCode}`] ??
                          newValue?.label ??
                          ''
                      );
                    }
                  }}
                  renderOption={(props, option) => (
                    <Box component="li" {...props}>
                      {option.media_url && (
                        <img
                          src={option.media_url}
                          alt=""
                          style={{ width: 30, height: 30, marginRight: 10 }}
                        />
                      )}
                      {option?.[`label_${currentLangCode}`] || option.label}
                    </Box>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      error={props.error}
                      defaultValue={defaultValue}
                      variant="outlined"
                      InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                          <>
                            {selectedValue?.media_url && (
                              <InputAdornment position="start">
                                <Box
                                  component="img"
                                  src={selectedValue.media_url}
                                  alt={
                                    selectedValue?.[
                                      `label_${currentLangCode}`
                                    ] || selectedValue?.label
                                  }
                                  style={{
                                    width: 30,
                                    height: 30,
                                    marginRight: 10,
                                  }}
                                />
                              </InputAdornment>
                            )}
                            {params.InputProps.startAdornment}
                          </>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '10px',

                          backgroundColor: isDarkmode
                            ? 'rgb(51,51,51)'
                            : '#FFFFFF !important',

                          '&.Mui-focused fieldset': {
                            borderColor:
                              businessPreference?.mainColor || '#000',
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
            )}
          </>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default Select;
