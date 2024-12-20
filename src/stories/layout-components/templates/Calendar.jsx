import React, { useState } from 'react';
import { useSelector } from 'react-redux';

//utilities
import PriceCheckOutlinedIcon from '@mui/icons-material/PriceCheckOutlined';

//components
import moment from 'moment';
import {
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';


  const Calendar = ({ _ }) => {
    const [selectedDate, setSelectedDate] = useState(moment().format('Do'));

    const businessPreference = useSelector((state) => state.core.businessData);

    const nextSevenDays = Array?.from({ length: 7 }, (_, i) =>
    moment().add(i, 'days').format('Do')
    );

    const handleDateChange = (date) => {
    setSelectedDate(date);
    };

  return (
    <div>
      <div className="d-flex">
        {nextSevenDays?.map((day, index) => (
          <div
            className="hover"
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: '14px',
              margin: '6px',
              fontWeight: 600,
              color: selectedDate === day ? '#FFF' : '#696969',
              padding: '5px',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              backgroundColor:
              selectedDate === day ? businessPreference?.mainColor : '#FFF',
            }}
            onClick={() => handleDateChange(day)}
            key={index}
          >
            <p>{day}</p>
          </div>
        ))}
      </div>
      <ListItem button divider>
        <ListItemText primary="Ajustement positif" secondary="+23.05$" />
        <ListItemIcon>
          <PriceCheckOutlinedIcon />
        </ListItemIcon>
      </ListItem>
    </div>
  );
};
export default Calendar;
