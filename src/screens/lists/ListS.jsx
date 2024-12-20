import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { useParams, useSearchParams } from 'react-router-dom';

// utilities
import { useTranslation } from 'react-i18next';
import { ArrowDownward, ArrowUpward } from '@mui/icons-material';

// components
import List from '@mui/material/List';
import { useDrag } from 'react-dnd';

import { Box, Typography, Divider } from '@mui/material';
import Blocks from '../../stories/layout-components/Block';
import ListSItem from './items/ListSItem';

const ListS = ({
  activeModule,
  list,
  isLoading,
  activeIndex,
  customizations,
  handleDisplaySide,
  displaySide,
  handleClick,
}) => {
  const { t } = useTranslation();

  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { moduleName } = useParams();

  const order = searchParams.get('order') || 'desc';
  const orderBy = searchParams.get('orderBy') || 'lastUpdate';
  const facetKey = searchParams.get('facetKey') || null;
  const facet =
    facetKey === 'status'
      ? parseInt(searchParams.get('facet'))
      : searchParams.get('facet') || null;

  const setSelectedFacet = (facetData) => {
    const newSearchParams = new URLSearchParams(searchParams);

    if (facetData?.value === 'all' && facetData?.key === 'targetDate') {
      searchParams.set('facetKey', 'isDone');
      searchParams.set('facet', false);

      searchParams.set(
        'orderBy',
        activeModule?.list?.tabs?.[activeIndex]?.sortField || 'lastUpdate'
      );
      searchParams.set(
        'order',
        activeModule?.list?.tabs?.[activeIndex]?.sort || 'desc'
      );

      newSearchParams.set('facetKey', 'isDone');
      newSearchParams.set('facet', false);
    } else {
      if (facetData?.key === 'targetDate') {
        // handleDateSelected([facetData?.value, facetData?.value], 'isDone');
      } else {
        searchParams.set(
          'order',
          activeModule?.list?.tabs?.[activeIndex]?.sort || 'desc'
        );
        searchParams.set(
          'orderBy',
          activeModule?.list?.tabs?.[activeIndex]?.sortField || 'lastUpdate'
        );
        searchParams.set('facetKey', facetData?.key);
        searchParams.set('facet', facetData?.value);
        searchParams.set('page', 1);

        searchParams.set(
          'orderBy',
          activeModule?.list?.tabs?.[activeIndex]?.sortField || 'lastUpdate'
        );
        searchParams.set(
          'order',
          activeModule?.list?.tabs?.[activeIndex]?.sort || 'desc'
        );

        setSearchParams({
          ...searchParams,
          page: 1,
          order: activeModule?.list?.tabs?.[activeIndex]?.sort || 'desc',
          orderBy:
            activeModule?.list?.tabs?.[activeIndex]?.sortField || 'lastUpdate',
          facetKey: facetData?.key,
          facet: facetData?.value,
        });
      }
    }
  };

  const allowedProperties = [
    'targetDate',
    'by',
    'status',
    'assignedToId',
    'decison-maker',
    'invoiceDate',
    'lastUpdate',
    'finances.balance',
    'finances.total',
    'financesTotal',
    'financesBalance',
    'financesAmount',
    'financesSubtotal',
    'bestcallback',
    'categoryName',
    'price',
    'locationId',
    'targetInvoicedBalance',
    'sku',
    'duration',
    'startDate',
    'timeStamp',
    'attribute1',
    'attribute2',
    'attribute3',
    'attribute4',
    'priority',
  ];

  const createSortHandler = (property) => () => {
    if (!allowedProperties?.includes(property)) {
      return;
    } else {
      const newSearchParams = new URLSearchParams(searchParams);
      const isAsc = orderBy === property && order === 'asc';
      newSearchParams.set('orderBy', property);
      newSearchParams.set('order', isAsc ? 'desc' : 'asc');
      newSearchParams.set('page', 1);
      setSearchParams(newSearchParams);
    }
  };

  const currentCollection = useSelector(
    (state) => state.list.currentCollection
  );

  const DraggableListItem = React.memo(
    ({ id, children, handleMoveItem, element }) => {
      const [{ isDragging }, drag] = useDrag(
        () => ({
          type: 'item',
          item: { id, element },
          collect: (monitor) => ({
            isDragging: monitor.isDragging(),
          }),
          end: (item, monitor) => {
            const dropResult = monitor.getDropResult();
            if (item && dropResult) {
              handleMoveItem(item.id, dropResult.id);
            }
          },
        }),
        [id]
      );

      return (
        <div ref={drag} style={{ opacity: isDragging ? 0 : 1 }}>
          {children}
        </div>
      );
    }
  );

  const handleMoveItem = useCallback(
    (dragIndex, dropIndex) => {
      const newList = [...list];
      const draggingItem = newList[dragIndex];
      newList.splice(dragIndex, 1);
      newList.splice(dropIndex, 0, draggingItem);
    },
    [list]
  );

  const header = displaySide
    ? currentCollection?.[moduleName]?.header?.slice(0, 4)
    : currentCollection?.[moduleName]?.header;

  return (
    <div style={{ paddingRight: '10px ', overflow: 'hidden' }}>
      <Blocks
        height={
          activeModule?.list?.tabs?.[activeIndex]?.displayStatuses ||
          activeModule?.list?.tabs?.[activeIndex]?.displayTop === 'statuses'
            ? 2
            : 1
        }
        heightPercentage={
          activeModule?.list?.tabs?.[activeIndex]?.displayTop === 'statuses'
            ? 85
            : 95
        }
        noScroll
        noBorder
        isLoading={isLoading}
        blockType="list"
      >
        <List
          dense
          sx={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            pl: 2,
          }}
        >
          {header?.map((col, idx) => {
            return (
              <Box
                key={idx}
                sx={{
                  width: col?.width + '%',
                  marginLeft: '7px',
                  display: 'flex',
                  alignItems: 'center',
                  cursor: allowedProperties?.includes(col?.value)
                    ? 'pointer'
                    : 'default',
                }}
                onClick={createSortHandler(col?.value)}
              >
                <Typography variant="body2" fontSize="11.5px" fontWeight={700}>
                  {col.label ?? ''}
                </Typography>
                {orderBy === col?.value && (
                  <div>
                    {order === 'asc' ? (
                      <ArrowUpward fontSize="10px" sx={{ marginTop: '3px' }} />
                    ) : (
                      <ArrowDownward
                        fontSize="10px"
                        sx={{ marginTop: '3px' }}
                      />
                    )}
                  </div>
                )}
              </Box>
            );
          })}
        </List>
        <Divider component="div" color="#f2f2f2" />

        <PerfectScrollbar>
          <List dense sx={{ width: '100%' }}>
            {list?.length > 0 &&
              list?.map((element, idx) => {
                return (
                  <React.Fragment key={element?.id}>
                    <DraggableListItem
                      id={element?.documentPath}
                      key={element?.id}
                      handleMoveItem={handleMoveItem}
                      element={element}
                    >
                      <ListSItem
                        currentCollection={currentCollection?.[moduleName]}
                        element={element}
                        list={list}
                        activeModule={activeModule}
                        customizations={customizations}
                        handleDisplaySide={handleDisplaySide}
                        displaySide={displaySide}
                        handleClick={handleClick}
                      />
                    </DraggableListItem>
                  </React.Fragment>
                );
              })}
          </List>
        </PerfectScrollbar>
      </Blocks>
    </div>
  );
};

export default ListS;
