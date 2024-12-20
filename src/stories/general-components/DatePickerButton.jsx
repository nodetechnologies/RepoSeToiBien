import React, { useState } from 'react';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import moment from 'moment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import EventOutlinedIcon from '@mui/icons-material/EventOutlined';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { Button } from '@mui/material';

export const DatePickerButton = ({
  label,
  name,
  value,
  onChange,
  disabled,
}) => {
  const [selectedDate, setSelectedDate] = useState(
    value ? moment(value) : null
  );
  const [open, setOpen] = useState(false);
  const mode = localStorage.getItem('mode') || 'light';

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    onChange({
      target: { name, value: date ? moment(date).format('YYYY-MM-DD') : null },
    });
  };

  return (
    <div className="middle-content">
      <LocalizationProvider adapterLocale="fr" dateAdapter={AdapterMoment}>
        {open && (
          <MobileDatePicker
            label={label}
            disabled={disabled}
            sx={{
              color: mode === 'dark' ? 'white' : 'black',
            }}
            closeOnSelect
            value={selectedDate}
            onChange={handleDateChange}
            open={open}
            onClose={handleClose}
            TextFieldComponent={() => null}
          />
        )}

        {!open && (
          <>
            <Button
              startIcon={
                <EventOutlinedIcon
                  color={mode === 'dark' ? 'white' : 'black'}
                />
              }
              sx={{
                marginTop: '0px',
                width: '130px',
                color: mode === 'dark' ? 'white' : 'black',
              }}
              onClick={handleOpen}
            >
              <span style={{ color: mode === 'dark' ? 'white' : 'black' }}>
                {value}
              </span>
            </Button>
          </>
        )}
      </LocalizationProvider>
    </div>
  );
};

export default DatePickerButton;
