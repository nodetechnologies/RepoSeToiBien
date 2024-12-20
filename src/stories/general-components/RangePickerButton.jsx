import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import moment from 'moment';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useParams, useSearchParams } from 'react-router-dom';
import EventOutlinedIcon from '@mui/icons-material/EventOutlined';
import chroma from 'chroma-js';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';
import { Dialog, Button, Box, useTheme } from '@mui/material';
import { StaticDateRangePicker } from '@mui/x-date-pickers-pro/StaticDateRangePicker';
import { LocalizationProvider } from '@mui/x-date-pickers-pro';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import nodeAxiosFirebase from '../../utils/nodeAxiosFirebase';

function ServerDay(props) {
  const {
    countsLevel = {},
    day,
    outsideCurrentMonth,
    selectedDates,
    ...other
  } = props;
  const businessPreference = useSelector((state) => state.core.businessData);
  const secColor = businessPreference?.secColor || '#000000';
  const dayString = day.format('YYYY-MM-DD');
  const dayCount = countsLevel[dayString] || 0;
  const [searchParams, setSearchParams] = useSearchParams();
  const currentView = searchParams.get('view');

  const minCount = Math.min(...Object.values(countsLevel), 0);
  const maxCount = Math.max(...Object.values(countsLevel), 1);
  const scale = chroma.scale(['white', secColor]).domain([minCount, maxCount]);
  const backgroundColor = dayCount > 0 ? scale(dayCount).hex() : undefined;

  // Determine if the day is the start, end, or in the range
  const isStartDate = selectedDates[0]?.isSame(day, 'day');
  const isEndDate = selectedDates[1]?.isSame(day, 'day');
  const isInRange =
    selectedDates[0] &&
    selectedDates[1] &&
    day.isBetween(selectedDates[0], selectedDates[1], 'day', '[]');

  return (
    <PickersDay
      {...other}
      outsideCurrentMonth={outsideCurrentMonth}
      day={day}
      disabled={currentView === 'timeGridWeek' && day.day() !== 1}
      sx={{
        cursor:
          currentView === 'timeGridWeek' && day.day() !== 1
            ? 'not-allowed'
            : 'pointer',
        backgroundColor: dayCount > 0 ? backgroundColor : undefined,
        color: dayCount > 0 ? 'white' : undefined,
        borderRadius: '8px',
        border: isStartDate || isEndDate || isInRange ? '2px solid' : undefined,
        borderColor:
          isInRange && !isStartDate && !isEndDate
            ? secColor
            : businessPreference?.mainColor || '#000000',
        boxShadow:
          isStartDate || isEndDate
            ? `0 0 5px ${
                isInRange && !isStartDate && !isEndDate
                  ? secColor
                  : businessPreference?.mainColor || '#000000'
              }`
            : undefined,
        '&:hover': {
          backgroundColor:
            dayCount > 0
              ? chroma(backgroundColor).darken(1.2).hex()
              : undefined,
        },
      }}
    />
  );
}

export const RangePickerButton = ({ value = [null, null], onChange, type }) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const { structureId, moduleName } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const startTimeStamp = searchParams.get('start')
    ? parseInt(searchParams.get('start'))
    : null;

  const endTimeStamp = searchParams.get('end')
    ? parseInt(searchParams.get('end'))
    : null;

  const [selectedDates, setSelectedDates] = useState([
    startTimeStamp
      ? moment.unix(startTimeStamp)
      : value[0]
      ? moment(value[0])
      : null,
    endTimeStamp
      ? moment.unix(endTimeStamp)
      : value[1]
      ? moment(value[1])
      : null,
  ]);

  useEffect(() => {
    setSelectedDates([
      startTimeStamp
        ? moment.unix(startTimeStamp)
        : value[0]
        ? moment(value[0])
        : null,
      endTimeStamp
        ? moment.unix(endTimeStamp)
        : value[1]
        ? moment(value[1])
        : null,
    ]);
  }, [open]);

  const currentView = searchParams.get('view');
  const mode = localStorage.getItem('mode') || 'light';

  const [countsLevel, setCountsLevel] = useState({});

  const shortcutsItems = [
    {
      label: t('yesterday'),
      getValue: () => [
        moment().subtract(1, 'days'),
        moment().subtract(1, 'days'),
      ],
    },
    {
      label: t('today'),
      getValue: () => [moment(), moment()],
    },
    {
      label: t('tomorrow'),
      getValue: () => [moment().add(1, 'days'), moment().add(1, 'days')],
    },
    {
      label: t('currentWeek'),
      getValue: () => [moment().startOf('week'), moment().endOf('week')],
    },
    {
      label: t('nextWeek'),
      getValue: () => [
        moment().add(1, 'week').startOf('week'),
        moment().add(1, 'week').endOf('week'),
      ],
    },
    {
      label: t('currentMonth'),
      getValue: () => [moment().startOf('month'), moment().endOf('month')],
    },
    {
      label: t('last30days'),
      getValue: () => [
        moment().subtract(30, 'days'),
        moment().subtract(1, 'days'),
      ],
    },
  ];

  const getCounts = async () => {
    if (!selectedDates[0] || !selectedDates[1]) return;

    // Generate a list of dates between the selected start and end dates
    const startDate = moment(selectedDates[0]);
    let endDate = moment(selectedDates[1]);

    // Ensure the range covers at least 8 days
    const daysDifference = endDate.diff(startDate, 'days') + 1;
    // if (daysDifference < 30) {
    //   endDate = startDate.clone().add(29, 'days');
    // }

    const dateList = [];
    const tempStartDate = startDate.clone();
    while (tempStartDate.isSameOrBefore(endDate)) {
      dateList.push(tempStartDate.format('YYYY-MM-DD'));
      tempStartDate.add(1, 'day');
    }

    const dateFields = dateList.reduce((acc, date, index) => {
      acc[`day${index + 1}`] = date;
      return acc;
    }, {});

    try {
      if (moduleName && structureId) {
        const countsData = await nodeAxiosFirebase({
          t,
          method: 'POST',
          url: `coreMulti/count`,
          body: {
            structureId,
            collectionField: moduleName,
            ...dateFields,
          },
        });
        setCountsLevel(countsData);
      }
    } catch (error) {
      console.error('Error fetching counts:', error);
    }
  };

  useEffect(() => {
    if (open) {
      getCounts();
    }
  }, [open]);

  useEffect(() => {
    if (value && value.length === 2) {
      const [start, end] = value;
      setSelectedDates([
        start ? moment(start) : null,
        end ? moment(end) : null,
      ]);
    }
  }, [value]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleDateChange = (newValue) => {
    if (!newValue || newValue.length !== 2) {
      console.error('Invalid newValue:', newValue);
      return;
    }

    let [startDate, endDate] = newValue.map((date) =>
      date ? moment(date) : null
    );

    // Ensure the dates are in the correct order
    if (startDate && endDate && endDate.isBefore(startDate)) {
      const temp = startDate;
      startDate = endDate;
      endDate = temp;
    }

    // If the start date changes, reset the end date logic
    if (
      !startDate ||
      moment(newValue[0]).format('DD-MM-YYYY') !==
        moment(selectedDates[0]).format('DD-MM-YYYY')
    ) {
      if (type !== 'multi') {
        if (currentView === 'timeGridWeek') {
          endDate = startDate?.clone().add(6, 'days');
        } else {
          endDate = startDate;
        }
      } else {
        endDate = null;
      }
    } else {
      endDate = newValue[1] ? moment(newValue[1]) : endDate;
    }

    // Update selected dates
    setSelectedDates([startDate, endDate]);
    onChange([startDate, endDate]);

    // Handle closing logic for the date picker
    if (endDate) {
      handleClose();
    }
  };

  const displayStartDates = () => {
    if (!selectedDates[0]) return t('selectDate');
    return startTimeStamp
      ? moment.unix(startTimeStamp).format('YYYY-MM-DD')
      : selectedDates[0].format('YYYY-MM-DD');
  };

  const displayEndDates = () => {
    if (!selectedDates[1]) return t('selectDate');
    return endTimeStamp
      ? moment.unix(endTimeStamp).format('YYYY-MM-DD')
      : selectedDates[1].format('YYYY-MM-DD');
  };

  return (
    <div className="middle-content align-c">
      {selectedDates[0] && (
        <Dialog
          sx={{
            '& .MuiDialog-paper': {
              width: isTablet ? '350px' : '850px',
              minWidth: isTablet ? '350px' : '850px',
              height: '350px',
              padding: '15px',
            },
          }}
          fullWidth
          open={open}
          onClose={handleClose}
        >
          <LocalizationProvider dateAdapter={AdapterMoment}>
            <div className="align-c">
              {isTablet ? (
                <StaticDateRangePicker
                  value={selectedDates}
                  format="YYYY-MM-DD"
                  label={t('select')}
                  startText={t('start')}
                  endText={t('end')}
                  onChange={handleDateChange}
                />
              ) : (
                <StaticDateRangePicker
                  value={selectedDates}
                  showDaysOutsideCurrentMonth={false}
                  calendars={2}
                  onChange={handleDateChange}
                  slots={{
                    day: ServerDay,
                  }}
                  slotProps={{
                    shortcuts: {
                      items: shortcutsItems,
                    },
                    actionBar: { actions: [] },
                    day: {
                      countsLevel,
                      selectedDates,
                    },
                  }}
                  startText={t('start')}
                  endText={t('end')}
                />
              )}
            </div>
          </LocalizationProvider>
        </Dialog>
      )}
      {!open && (
        <Button
          startIcon={<EventOutlinedIcon />}
          sx={{
            marginTop: '-3px',
            width: '250px',
            color: mode === 'dark' ? 'white' : 'black',
          }}
          onClick={handleOpen}
        >
          <span style={{ color: mode === 'dark' ? 'white' : 'black' }}>
            {displayStartDates()}{' '}
            {type !== 'single' && ` - ${displayEndDates()}`}
          </span>
        </Button>
      )}
    </div>
  );
};

export default RangePickerButton;
