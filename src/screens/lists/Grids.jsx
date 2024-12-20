// Utilities
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useParams, useSearchParams } from 'react-router-dom';
import * as drawerActions from '../../redux/actions-v2/drawer-actions';
// Components
import Block from '../../stories/layout-components/Block';
import { Typography } from '@mui/material';
import Manufacturers from '../../components/Grids/Manufacturers';
import Stats from '../../components/@generalComponents/manufacturer/Stats';

const ManufyQuotes = ({ activeIndex, list, tab }) => {
  // Initialize hooks and states
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language;
  const dispatch = useDispatch();

  const [cardsPerStatus, setCardsPerStatus] = useState([]);
  const [value, setValue] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();
  const { structureId } = useParams();

  const startTimestamp = searchParams.get('start')
    ? parseInt(searchParams.get('start'))
    : null;
  const endTimestamp = searchParams.get('end')
    ? parseInt(searchParams.get('end'))
    : null;
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
  const projects = list;

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
    if (projects?.length > 0) {
      const statusCounts = projects?.reduce((acc, card) => {
        const statusKey = `status${card?.status}`;
        if (!acc[statusKey]) {
          acc[statusKey] = {
            name: statusKey,
            value: 1,
          };
        } else {
          acc[statusKey].value += 1;
        }
        return acc;
      }, {});

      setCardsPerStatus(statusCounts);
    }
  }, [projects]);

  useEffect(() => {
    if (projects?.length > 0) {
      const totalValue = projects?.reduce((acc, card) => {
        return acc + card?.finances?.total;
      }, 0);

      setValue(totalValue);
    }
  }, [projects]);

  const applyStatusFilter = (value) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('facetKey', 'status');
    newSearchParams.set('facet', value);

    setSearchParams(newSearchParams);
  };

  const resetSelectedFacet = () => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.delete('facetKey');
    newSearchParams.delete('facet');

    setSearchParams(newSearchParams);
  };

  const formatCanadianDollar = (amount) => {
    return new Intl.NumberFormat('fr-CA', {
      style: 'currency',
      currency: 'CAD',
    }).format(amount);
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
    <div>
      {tab === 0 && (
        <div className={'col-12'}>
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
                    {cardsPerStatus?.status0?.value}
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
                    {cardsPerStatus?.status1?.value}
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
                    {cardsPerStatus?.status2?.value}
                  </Typography>
                  <Typography variant="body2" fontSize="12px" fontWeight={500}>
                    {nameStatus2}
                  </Typography>
                </Block>
              </div>
            </div>
            <div className="col-3 hover" onClick={() => resetSelectedFacet()}>
              <Block noScroll height={2} heightPercentage={9}>
                {' '}
                <Typography variant="h3" fontSize="24px" fontWeight={600}>
                  {(cardsPerStatus?.status0?.value || 0) +
                    (cardsPerStatus?.status1?.value || 0)}
                </Typography>
                <Typography variant="body2" fontSize="12px" fontWeight={500}>
                  {t('totalRequests')}
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
                  color="#ab0f0f"
                >
                  {formatCanadianDollar(value / 10000 || 0)}
                </Typography>
                <Typography
                  variant="body2"
                  fontSize="12px"
                  fontWeight={500}
                  color="#ab0f0f"
                >
                  {t('totalValueUnRequests')}
                </Typography>
              </Block>
            </div>
          </div>
          <div>
            <Block height={2} heightPercentage={82} className="col-12">
              <Manufacturers list={list} onRowSelected={handleCardClick} />
            </Block>
          </div>
        </div>
      )}
      {tab === 1 && (
        <div>
          <Stats
            list={list}
            activeIndex={activeIndex}
            startDate={startTimestamp}
            endDate={endTimestamp}
          />
        </div>
      )}
    </div>
  );
};

export default ManufyQuotes;
