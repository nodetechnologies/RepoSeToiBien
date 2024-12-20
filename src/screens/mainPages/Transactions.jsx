import React, { useEffect, useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import moment from 'moment';

//utilities
import { useTranslation } from 'react-i18next';
import ErrorBoundary from '../../components/@generalComponents/ErrorBoundary';

//components
import MainLayoutV2 from '../../layouts/MainLayoutV2';
import FinancesTransactionsGrid from '../../components/Grids/FinancesTransactionsGrid';
import Block from '../../stories/layout-components/Block';

const Transactions = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const componentRef = useRef();
  const [updateValues, setUpdateValues] = useState(true);

  const [searchParams] = useSearchParams();
  const activeIndex = parseInt(searchParams.get('tab')) || 0;
  const startDate =
    searchParams.get('startDate') ||
    moment().subtract(1, 'days').format('YYYY-MM-DD');
  const endDate = searchParams.get('endDate') || moment().format('YYYY-MM-DD');

  useEffect(() => {
    setUpdateValues(true);
  }, [startDate, endDate]);

  const tabs = [];

  const originalTitle = document.title;

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    onBeforeGetContent: () => {
      document.title = `${t('finances')} ${moment(startDate).format(
        'DD MMM YYYY'
      )} ${t('to')}
      ${moment(endDate).format('DD MMM YYYY')}`;
      return Promise.resolve();
    },
    onAfterPrint: () => {
      document.title = originalTitle;
    },
  });

  return (
    <MainLayoutV2
      pageTitle={t('transactions')}
      selectedTab={activeIndex}
      tabs={tabs}
      onChangeDateRange
      print={activeIndex === 3 ? handlePrint : null}
    >
      <ErrorBoundary>
        <Block mode="primary" size="large">
          <FinancesTransactionsGrid
            startDate={startDate}
            endDate={moment(endDate).add(1, 'days').format('YYYY-MM-DD')}
          />
        </Block>
      </ErrorBoundary>
    </MainLayoutV2>
  );
};

export default Transactions;
