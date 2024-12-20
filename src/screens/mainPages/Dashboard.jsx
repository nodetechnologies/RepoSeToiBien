import React, { useEffect, useState } from 'react';

// utils
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useParams, useLocation, useSearchParams } from 'react-router-dom';

// components
import MainLayoutV2 from '../../layouts/MainLayoutV2';
import DashboardOperations from './DashboardOperations';
import DashboardFinances from './DashboardFinances';
import DashboardEmails from './DashboardEmails';

const Dashboard = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeIndex = parseInt(searchParams.get('tab')) || 0;

  const [updateValues, setUpdateValues] = useState(true);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [activeTabs, setActiveTabs] = useState([]);

  const businessStructure = useSelector(
    (state) => state.core.businessStructure
  );

  const businessStructures = businessStructure?.structures;

  const tabs = [
    {
      label: t('operations'),
      value: 'operations',
    },
    {
      label: t('finances'),
      value: 'finances',
    },
  ];

  const tab = [
    {
      label: t('operations'),
      value: 'operations',
    },
  ];

  useEffect(() => {
    //check if structures have a structure with collectionField 'cardsinvoiced'
    const hasBilling = businessStructures?.find(
      (s) => s.collectionField === 'cardsinvoiced'
    );

    if (hasBilling !== undefined) {
      setActiveTabs(tabs);
    } else {
      setActiveTabs(tab);
    }
  }, [businessStructures]);

  const handleDateSelected = (newDateRange, field) => {
    let start = newDateRange[0];
    let end = newDateRange[1];

    if (start) {
      start = start?.startOf('day').unix();
    }
    if (end) {
      end = end?.endOf('day').unix();
    }
    setStartDate(start);
    setEndDate(end);
  };

  return (
    <MainLayoutV2
      pageTitle={t('dashboard')}
      subTitle={t('dashboardSubTitle')}
      tabs={activeTabs}
      actions={{
        onChangeDateRange: activeIndex === 1 && {
          action: handleDateSelected,
          dateField: 'billingDate',
          rangeDates: 'multi',
        },
      }}
    >
      <div className="px-4">
        {activeIndex === 0 && (
          <DashboardOperations
            updateValues={updateValues}
            setUpdateValues={setUpdateValues}
          />
        )}
        {activeIndex === 1 && (
          <DashboardFinances startDate={startDate} endDate={endDate} />
        )}
      </div>
    </MainLayoutV2>
  );
};

export default Dashboard;
