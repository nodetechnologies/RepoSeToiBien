import React, { useRef, useCallback } from 'react';
import { useDrop, useDrag } from 'react-dnd';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import {
  Box,
  Typography,
  List,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ListAItem from '../items/ListAItem';
import GeneralText from '../../../stories/general-components/GeneralText';

const StatusDropZone = ({
  status,
  itemsByStatus,
  openStatus,
  setOpenStatus,
  currentCollection,
  list,
  moduleName,
  handleClick,
  activeModule,
  handleMoveToSetItems,
  structureId,
}) => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language;
  const itemsRef = useRef(list);

  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: 'item',
      drop: (item) => ({ status }),
      collect: (monitor) => ({
        isOver: monitor.isOver(),
      }),
    }),
    [status]
  );

  const businessStructure = useSelector(
    (state) => state.core.businessStructure
  );
  const businessStructures = businessStructure?.structures;

  const structure = businessStructures?.find((s) => s.id === structureId);
  const fields = structure?.fields;
  const statusField = fields?.find((field) => field.typeData === 'status');

  function getStatusFromPreferences(statusLabel) {
    const status = statusField?.selections?.find(
      (selection) => selection?.value === statusLabel
    );

    return {
      label: status?.['label_' + currentLang] || t('notAvailable'),
      color: status?.color,
    };
  }

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
              handleMoveItem(item.element, dropResult.status);
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
    (draggedItem, newStatus) => {
      const updatedValues = draggedItem?.values?.map((value) =>
        value?.structureValue === 'status'
          ? {
              ...value,
              value: parseInt(newStatus),
              color: getStatusFromPreferences(parseInt(newStatus))?.color,
              transformedValue: getStatusFromPreferences(parseInt(newStatus))
                ?.label,
            }
          : value
      );

      const updatedItem = {
        ...draggedItem,
        status: parseInt(newStatus),
        statusLabel: getStatusFromPreferences(parseInt(newStatus))?.label,
        statusColor: getStatusFromPreferences(parseInt(newStatus))?.color,
        values: updatedValues,
      };

      const updatedList = itemsRef.current.map((item) =>
        item.id === draggedItem.id
          ? { ...updatedItem, status: parseInt(newStatus) }
          : item
      );

      if (newStatus !== undefined && newStatus !== null && newStatus !== '') {
        handleMoveToSetItems(updatedList, updatedItem);
      }
    },
    [list]
  );

  return (
    <Accordion
      sx={{
        backgroundColor: 'transparent',
        margin: 0,
        padding: 0,
      }}
      defaultExpanded={true}
      expanded={
        openStatus === 'all' ? true : openStatus === status ? true : false
      }
      elevation={0}
      ref={drop}
    >
      <AccordionSummary
        sx={{
          backgroundColor: 'transparent',
          margin: 0,
          padding: 0,
        }}
        expandIcon={<ArrowDownwardIcon fontSize="10px" />}
      >
        <ListItem
          dense
          className="hover"
          onClick={() => setOpenStatus(openStatus === status ? null : status)}
        >
          <ListItemText
            sx={{
              width: '95%',
            }}
          >
            <Typography
              fontSize="14px"
              fontWeight={600}
              color={itemsByStatus[status][0]?.statusColor}
            >
              {itemsByStatus[status][0]?.statusLabel || status}
            </Typography>
          </ListItemText>
          <ListItemText
            sx={{
              justifyContent: 'flex-end',
              alignContent: 'end',
              width: '5%',
            }}
          >
            <Typography
              fontSize="15px"
              textAlign="center"
              fontWeight={600}
              color="#FFF"
              sx={{
                backgroundColor: itemsByStatus[status][0]?.statusColor,
                width: '100%',
                borderRadius: '10px',
              }}
            >
              {itemsByStatus[status][0]?.id === 'empty'
                ? 0
                : itemsByStatus[status]?.length || 0}
            </Typography>
          </ListItemText>
        </ListItem>
      </AccordionSummary>
      <AccordionDetails
        sx={{
          backgroundColor: 'transparent',
          margin: 0,
          padding: 0,
        }}
      >
        {itemsByStatus[status]?.map((item, index) => (
          <React.Fragment key={item?.id}>
            {item?.id === 'empty' ? (
              <div>
                <GeneralText
                  text={t('noElement')}
                  size="regular"
                  fontSize="10px"
                  primary={true}
                  classNameComponent="px-4 mb-3"
                />
                <Divider component="div" />
              </div>
            ) : (
              <DraggableListItem
                id={item?.documentPath}
                key={item?.id}
                handleMoveItem={handleMoveItem}
                element={item}
              >
                <ListAItem
                  currentCollection={currentCollection?.[moduleName]}
                  element={item}
                  list={list}
                  activeModule={activeModule}
                  handleClick={handleClick}
                />
              </DraggableListItem>
            )}
          </React.Fragment>
        ))}
      </AccordionDetails>
    </Accordion>
  );
};

export default StatusDropZone;
