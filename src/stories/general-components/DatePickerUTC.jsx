import { useSelector } from 'react-redux';
import { useTheme } from '@mui/material/styles';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import moment from 'moment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

export const CustomDatePicker = ({
  label,
  name,
  timePicker,
  value,
  onChange,
  fieldType,
  size,
  onBlur,
  staticField,
  disabled,
  error,
}) => {
  const businessPreference = useSelector((state) => state.core.businessData);
  const theme = useTheme();
  const isDarkmode = theme.palette.mode === 'dark';

  const dateOnChange = (e, date) => {
    onChange(e, fieldType, date);
    onBlur && onBlur(e, fieldType, date);
  };

  const dateTimeOnChange = (e, date) => {
    onChange(e, fieldType, date);
    onBlur && onBlur(e, fieldType, date);
  };

  // Ensure dateValue is either a moment object or null
  let dateValue = null;
  if (value && moment.unix(value?.seconds || value?._seconds).isValid()) {
    dateValue = moment.unix(value?.seconds || value?._seconds);
  } else if (moment(value).isValid()) {
    dateValue = moment(value);
  }

  return (
    <div
      style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <LocalizationProvider adapterLocale="fr" dateAdapter={AdapterMoment}>
        {timePicker ? (
          <DateTimePicker
            label={label}
            value={staticField ? '' : dateValue}
            error={error}
            sx={{
              width: '100%',
              marginTop: '16px',
              marginBottom: '10px',
              '.MuiTextField-root': {
                backgroundColor: 'white',
                borderRadius: '4px',
                width: '100%',
                fontSize: size === 'small' ? '11px' : '13px',
              },
              '& .MuiFormLabel-root': {
                backgroundColor: isDarkmode ? 'rgb(51,51,51)' : '#FFF',
                padding: '2px 10px',
                borderRadius: '10px',
              },
              '& .MuiOutlinedInput-root': {
                borderRadius: '10px',
                width: '100%',
                height: staticField ? '35px' : '42px',
                '&.Mui-focused fieldset': {
                  borderColor: businessPreference?.mainColor || '#000',
                  boxShadow: `0 0 0 0.2rem ${
                    businessPreference?.mainColor + '20'
                  }`,
                },
              },
            }}
            onChange={(e) => dateTimeOnChange(e, e)}
            onBlur={(e) => dateTimeOnChange(e, e)}
          />
        ) : (
          <DatePicker
            label={label}
            value={staticField ? '' : dateValue}
            error={error}
            sx={{
              width: '100%',
              marginTop: '16px',
              marginBottom: '10px',
              '.MuiTextField-root': {
                backgroundColor: 'white',
                borderRadius: '4px',
                width: '100%',
                fontSize: size === 'small' ? '11px' : '13px',
              },
              '& .MuiFormLabel-root': {
                backgroundColor: isDarkmode ? 'rgb(51,51,51)' : '#FFF',
                padding: '2px 10px',
                borderRadius: '10px',
              },
              '& .MuiOutlinedInput-root': {
                borderRadius: '10px',
                width: '100%',
                height: staticField ? '35px' : '42px',
                '&.Mui-focused fieldset': {
                  borderColor: businessPreference?.mainColor || '#000',
                  boxShadow: `0 0 0 0.2rem ${
                    businessPreference?.mainColor + '20'
                  }`,
                },
              },
            }}
            onChange={(e) => dateOnChange(e, e)}
            onBlur={(e) => dateOnChange(e, e)}
            format="DD MMM YYYY"
          />
        )}
      </LocalizationProvider>
    </div>
  );
};

export default CustomDatePicker;
