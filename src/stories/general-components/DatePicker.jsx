import React, { useEffect, useState } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TextField } from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import moment from 'moment';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';

export const CustomDatePicker = ({
  label,
  name,
  size,
  openTo,
  timePicker,
  views,
  value,
  isRequired,
  onChange,
  disabled,
}) => {
  const [selectedDate, setSelectedDate] = useState(
    value ? moment(value) : null
  );

  useEffect(() => {
    setSelectedDate(value ? moment(value) : null);
  }, [value]);

  const dateOnChange = (date) => {
    try {
      // Validate the date
      if (date && moment(date).isValid()) {
        const formattedDate = moment(date).format('YYYY-MM-DD');
        setSelectedDate(formattedDate);
        onChange({ target: { name, value: formattedDate } });
      } else {
        // Handle invalid date
        setSelectedDate(null);
        onChange({ target: { name, value: null } });
      }
    } catch (error) {}
  };

  const dateTimeOnChange = (date) => {
    try {
      // Validate the date
      if (date && moment(date).isValid()) {
        const formattedDate = moment(date);
        setSelectedDate(formattedDate);
        onChange({ target: { name, value: formattedDate } });
      } else {
        setSelectedDate(null);
        onChange({ target: { name, value: null } });
      }
    } catch (error) {}
  };

  return (
    <div className="mt-3">
      <LocalizationProvider adapterLocale="fr" dateAdapter={AdapterMoment}>
        {timePicker ? (
          <DateTimePicker
            label={label}
            disabled={disabled}
            fullWidth
            variant={'standard'}
            closeOnSelect={true}
            timeSteps={5}
            formatDensity="dense"
            value={selectedDate}
            onChange={dateTimeOnChange}
            renderInput={(props) => (
              <TextField
                fullWidth
                required={isRequired}
                InputProps={{
                  style: { border: 'none', borderWidth: '0px' },
                  disableOutline: true,
                }}
                size={size || 'medium'}
                {...props}
              />
            )}
          />
        ) : (
          <DatePicker
            label={label}
            openTo={openTo || 'day'}
            disabled={disabled}
            closeOnSelect={true}
            variant={'standard'}
            required={isRequired}
            views={views || ['year', 'month', 'day']}
            value={selectedDate}
            onChange={dateOnChange}
            renderInput={(props) => (
              <TextField
                fullWidth
                variant={'standard'}
                required={isRequired}
                InputProps={{
                  style: { border: 'none', borderWidth: '0px' },
                  disableOutline: true,
                }}
                size={size || 'medium'}
                {...props}
              />
            )}
          />
        )}
      </LocalizationProvider>
    </div>
  );
};

export default CustomDatePicker;
