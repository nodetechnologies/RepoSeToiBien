import React, { useEffect, useState } from 'react';
import moment from 'moment';

import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';

import DrawerSide from '../stories/layout-components/DrawerSide';
import AddAppointment from './AddAppointment';
import AppointmentScheduler from '../screens/mainPages/AppointmentsScheduler';

const Appointment = ({
  isDrawerOpen,
  handleDrawerClose,
  defaultLocationId,
  selectedDate,
  currentCard,
  toSelect,
  userId,
}) => {
  const { t, i18n } = useTranslation();
  const currentLangCode = i18n.language;
  const dispatch = useDispatch();
  const startDate = moment(selectedDate?.startTime).format('YYYY-MM-DD');

  return (
    <DrawerSide
      title={t('createAppointment')}
      subtitle={''}
      handleDrawerClose={handleDrawerClose}
      isDrawerOpen={isDrawerOpen}
      elementName={''}
      width={toSelect ? '2000px' : '650px'}
      noAction
    >
      <div className="d-flex mb-4">
        <div className={toSelect ? 'col-3' : 'col-12'}>
          <AddAppointment
            startDate={moment(selectedDate?.startTime)}
            HandleCloseSidebar={handleDrawerClose}
            defaultLocationId={defaultLocationId}
            currentCard={currentCard}
            userId={userId}
            toSelect={toSelect}
          />
        </div>
        <div className={toSelect ? 'col-8 mx-5' : 'hide'}>
          <AppointmentScheduler date={startDate} />
        </div>
      </div>
    </DrawerSide>
  );
};

export default Appointment;
