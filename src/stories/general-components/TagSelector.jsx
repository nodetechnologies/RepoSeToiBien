// TagSelector.jsx
import { useTheme, styled } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import { Autocomplete, TextField } from '@mui/material';
import InputBase from '@mui/material/InputBase';
import ErrorBoundary from '../../components/@generalComponents/ErrorBoundary';

const CustomInput = styled(InputBase)(({ borderColor }) => ({
  '& .MuiInputBase-input': {
    borderRadius: 14,
    display: 'flex',
    width: '100%',
    alignItems: 'center',
    border: '1px solid lightgray',
    height: '49px',
    padding: '2px 10px 2px 10px',
    '&:focus': {
      borderRadius: 14,
      borderColor: borderColor,
      boxShadow: `0 0 0 0.2rem ${borderColor + '20'}`,
    },
  },
}));

export default function TagSelector({
  field,
  currentLangCode,
  label,
  value,
  onChange,
  defaultValue,
  ...props
}) {
  const { t } = useTranslation();
  const theme = useTheme();
  const isDarkmode = theme.palette.mode === 'dark';

  const businessPreference = useSelector((state) => state.core.businessData);

  const formatedSelection = businessPreference?.tags || [];

  return (
    <ErrorBoundary>
      <FormControl fullWidth margin="normal">
        <InputLabel
          required={props.required}
          shrink={true}
          id={`tag-select-label-${field?.id}`}
          sx={{
            backgroundColor: isDarkmode ? 'rgb(51,51,51)' : '#FFF',
            padding: '2px 10px 2px 10px',
            borderRadius: '14px',
          }}
        >
          {label}
        </InputLabel>
        <Autocomplete
          multiple
          error={props?.error}
          filterSelectedOptions
          noOptionsText={t('noOption')}
          fullWidth
          value={value || []}
          onChange={(event, newValue) => {
            onChange(event, newValue);
          }}
          options={formatedSelection}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              error={props.error}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '14px',
                  width: '100%',
                  '&.Mui-focused fieldset': {
                    borderColor: businessPreference?.mainColor || '#000',
                    boxShadow: `0 0 0 0.2rem ${
                      businessPreference?.mainColor + '20'
                    }`,
                  },
                },
              }}
              input={
                <CustomInput
                  borderColor={businessPreference?.mainColor || '#000'}
                />
              }
            />
          )}
          {...props}
        />
      </FormControl>
    </ErrorBoundary>
  );
}
