// Utilities
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useParams, useSearchParams } from 'react-router-dom';
import * as drawerActions from '../../redux/actions-v2/drawer-actions';
// Components
import Block from '../../stories/layout-components/Block';
import { Typography } from '@mui/material';
import FinancesTransactionsGrid from '../../components/Grids/FinancesTransactionsGrid';

const Grid = ({
  activeIndex,
  selectedFacet,
  setSelectedFacet,
  startTimestamp,
  endTimestamp,
  activeModule,
  list,
  tab,
}) => {
  // Initialize hooks and states
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language;
  const dispatch = useDispatch();

  const [itemsPerStatus, setItemsPerStatus] = useState({});
  const [value, setValue] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();
  const { moduleName, structureId } = useParams();

  const facetKey = searchParams.get('facetKey') || null;
  const facet =
    facetKey === 'status'
      ? parseInt(searchParams.get('facet'))
      : searchParams.get('facet') === 'true'
      ? true
      : searchParams.get('facet') === 'false'
      ? false
      : searchParams.get('facet') || null;

  const handleCardClick = (card) => {
    handleQuickview(card);
  };

  const businessStructure = useSelector(
    (state) => state.core.businessStructure
  );
  const businessPreferences = useSelector((state) => state.core.businessData);

  const nameStatus0 = businessStructure?.structures
    ?.find((s) => s.id === structureId)
    ?.fields?.find((f) => f.typeData === 'status')
    ?.selections?.find((s) => s.value === 0)?.['label_' + currentLang];

  const nameStatus1 = businessStructure?.structures
    ?.find((s) => s.id === structureId)
    ?.fields?.find((f) => f.typeData === 'status')
    ?.selections?.find((s) => s.value === 1)?.['label_' + currentLang];

  const nameStatus2 = businessStructure?.structures
    ?.find((s) => s.id === structureId)
    ?.fields?.find((f) => f.typeData === 'status')
    ?.selections?.find((s) => s.value === 2)?.['label_' + currentLang];

  const colorStatus0 = businessStructure?.structures
    ?.find((s) => s.id === structureId)
    ?.fields?.find((f) => f.typeData === 'status')
    ?.selections?.find((s) => s.value === 0)?.color;

  const colorStatus1 = businessStructure?.structures
    ?.find((s) => s.id === structureId)
    ?.fields?.find((f) => f.typeData === 'status')
    ?.selections?.find((s) => s.value === 1)?.color;

  const colorStatus2 = businessStructure?.structures
    ?.find((s) => s.id === structureId)
    ?.fields?.find((f) => f.typeData === 'status')
    ?.selections?.find((s) => s.value === 2)?.color;

  useEffect(() => {
    if (list?.length > 0) {
      const statusCounts = list?.reduce((acc, item) => {
        const transactionType = item?.type || 0;
        const status = Number(item?.status) || 0;
        const statusKey = `status${transactionType || status}`;
        if (!acc[statusKey]) {
          acc[statusKey] = {
            name: statusKey,
            count: 1,
            total: 0,
          };
        } else {
          acc[statusKey].count += 1;
          acc[statusKey].total += Number(
            (item?.finances?.amount ||
              item?.amount ||
              item?.subtotal ||
              item?.finances?.subtotal ||
              item?.finances?.unitPrice ||
              item?.unitPrice ||
              item?.total ||
              item?.finances?.total ||
              0) / 10000
          );
        }
        return acc;
      }, {});

      setItemsPerStatus({ totalLength: list?.length, ...statusCounts });
    }
  }, [list, moduleName]);

  useEffect(() => {
    if (list?.length > 0) {
      const totalValue = list?.reduce((acc, item) => {
        return (
          acc +
          Number(
            (item?.finances?.amount ||
              item?.amount ||
              item?.subtotal ||
              item?.finances?.subtotal ||
              item?.finances?.unitPrice ||
              item?.unitPrice ||
              item?.total ||
              item?.finances?.total ||
              0) / 10000
          )
        );
      }, 0);

      setValue(totalValue);
    }
  }, [list]);

  const applyStatusFilter = (value) => {
    const key = activeModule?.list?.tabs?.[activeIndex]?.filterTop || 'status';

    setSelectedFacet({ key, value });
  };

  const formatCanadianDollar = (amount) => {
    return new Intl.NumberFormat('fr-CA', {
      style: 'currency',
      currency: 'CAD',
    })?.format(amount);
  };

  const handleClose = () => {
    dispatch(drawerActions.viewElement({ isDrawerOpen: false }));
  };

  const handleQuickview = (item) => {
    dispatch(
      drawerActions.viewElement({
        isDrawerOpen: true,
        item: item,
        handleDrawerClose: handleClose,
        type: 'view',
      })
    );
  };

  return (
    <div style={{ paddingRight: '10px' }} className={'col-12'}>
      <div className="col-12 d-flex">
        <div className="col-2 hover" onClick={() => applyStatusFilter(0)}>
          <div
            style={{
              borderBottom: facet === 0 ? `3px solid ${colorStatus0}` : '',
            }}
          >
            <Block noScroll height={2} heightPercentage={9}>
              {' '}
              <Typography variant="h3" fontSize="24px" fontWeight={600}>
                {formatCanadianDollar(itemsPerStatus?.status0?.total || 0)}
              </Typography>
              <Typography variant="body2" fontSize="12px" fontWeight={500}>
                {nameStatus0}
              </Typography>
            </Block>
          </div>
        </div>
        <div className="col-2 hover" onClick={() => applyStatusFilter(1)}>
          <div
            style={{
              borderBottom: facet === 1 ? `3px solid ${colorStatus1}` : '',
            }}
          >
            <Block noScroll height={2} heightPercentage={9}>
              <Typography variant="h3" fontSize="24px" fontWeight={600}>
                {formatCanadianDollar(itemsPerStatus?.status1?.total || 0)}
              </Typography>
              <Typography variant="body2" fontSize="12px" fontWeight={500}>
                {nameStatus1}
              </Typography>
            </Block>
          </div>
        </div>
        <div className="col-2 hover" onClick={() => applyStatusFilter(2)}>
          <div
            style={{
              borderBottom: facet === 2 ? `3px solid ${colorStatus2}` : '',
            }}
          >
            <Block noScroll height={2} heightPercentage={9}>
              {' '}
              <Typography variant="h3" fontSize="24px" fontWeight={600}>
                {formatCanadianDollar(itemsPerStatus?.status2?.total || 0)}
              </Typography>
              <Typography variant="body2" fontSize="12px" fontWeight={500}>
                {nameStatus2}
              </Typography>
            </Block>
          </div>
        </div>
        <div className="col-3 hover" onClick={() => setSelectedFacet(null)}>
          <Block noScroll height={2} heightPercentage={9}>
            {' '}
            <Typography variant="h3" fontSize="24px" fontWeight={600}>
              {itemsPerStatus?.totalLength || 0}
            </Typography>
            <Typography variant="body2" fontSize="12px" fontWeight={500}>
              {t('number')}
            </Typography>
          </Block>
        </div>

        <div className="col-3">
          <Block noScroll height={2} heightPercentage={9}>
            {' '}
            <Typography
              variant="h3"
              fontSize="24px"
              fontWeight={600}
              color={businessPreferences?.secColor}
            >
              {formatCanadianDollar(value || 0)}
            </Typography>
            <Typography
              variant="body2"
              fontSize="12px"
              fontWeight={500}
              color={businessPreferences?.secColor}
            >
              {t('total')}
            </Typography>
          </Block>
        </div>
      </div>
      <div>
        <Block height={2} heightPercentage={82} className="col-12">
          <FinancesTransactionsGrid
            list={list}
            onRowSelected={handleCardClick}
            activeModule={moduleName}
          />
        </Block>
      </div>
    </div>
  );
};

export default Grid;
