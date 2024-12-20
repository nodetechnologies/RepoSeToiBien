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
import ListAItem from './items/ListAItem';

const ListA = ({
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
  const deletedElements = sessionStorage.getItem('deletedElements');

  const order =
    searchParams.get('order') ||
    activeModule?.list?.tabs?.[activeIndex]?.sort ||
    'desc';

  const currentCollection = useSelector(
    (state) => state.list.currentCollection
  );
  const orderBy =
    searchParams.get('orderBy') ||
    activeModule?.list?.tabs?.[activeIndex]?.sortField;

  const facetKey = searchParams.get('facetKey') || null;

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
    'financesAmount',
    'financesBalance',
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
            : 98
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
                  marginLeft: '2px',
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
                      <ListAItem
                        currentCollection={currentCollection?.[moduleName]}
                        element={element}
                        isDeleted={deletedElements?.includes(element?.id)}
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

export default ListA;
