import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { setGeneralStatus } from '../../redux/actions-v2/coreAction';

// utilities
import { useTranslation } from 'react-i18next';

import { List } from '@mui/material';
import Blocks from '../../stories/layout-components/Block';

import StatusDropZone from './items/StatusDropZone';
import nodeAxiosFirebase from '../../utils/nodeAxiosFirebase';

const ListF = ({ activeModule, isLoading, list, handleClick, activeIndex }) => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [itemsByStatus, setItemsByStatus] = useState({});
  const [openStatus, setOpenStatus] = useState('all');
  const [updatedList, setUpdatedList] = useState([]);
  const { structureId, moduleName } = useParams();

  const businessStructure = useSelector(
    (state) => state.core.businessStructure
  );

  const currentCollection = useSelector(
    (state) => state.list.currentCollection
  );

  const businessStructures = businessStructure?.structures;

  const structure = businessStructures?.find((s) => s.id === structureId);
  const fields = structure?.fields;
  const statusField = fields?.find((field) => field.typeData === 'status');

  function getStatusFromPreferences(statusLabel, structureIden) {
    const status = statusField?.selections?.find(
      (selection) => selection?.value === statusLabel
    );

    return {
      label: status?.['label_' + currentLang] || t('notAvailable'),
      color: status?.color,
    };
  }

  // Format list items by status
  const formatListByStatus = (listItem) => {
    const formattedList = listItem?.map((item) => {
      const statusLabel = getStatusFromPreferences(
        item?.status,
        item?.structureIdentifiant || item?.structureId
      )?.label;
      const statusColor = getStatusFromPreferences(
        item?.status,
        item?.structureIdentifiant || item?.structureId
      )?.color;

      return {
        ...item,
        statusLabel: statusLabel,
        statusColor: statusColor,
      };
    });

    return formattedList;
  };

  const handleMoveToSetItems = async (listData, item) => {
    const formattedList = formatListByStatus(listData);
    const subListsByStatus = formattedList?.reduce((acc, item) => {
      const status = item.status;
      if (!acc[status]) {
        acc[status] = [];
      }
      acc[status].push(item);
      return acc;
    }, {});

    const statuses = statusField?.selections?.map((status) => status.value);
    statuses?.forEach((status) => {
      if (!subListsByStatus[status]) {
        subListsByStatus[status] = [
          {
            id: 'empty',
            status: status,
            statusLabel: getStatusFromPreferences(status, structureId)?.label,
            statusColor: getStatusFromPreferences(status, structureId)?.color,
          },
        ];
      }
    });
    setItemsByStatus(subListsByStatus);
    setUpdatedList(listData);
    if (item) {
      try {
        const documentPathFormatted = item?.documentPath.replace(item?.id, '');
        dispatch(
          setGeneralStatus({
            status: 'loading',
            position: 'taskStatus-list',
            type: 'pulse',
          })
        );
        await nodeAxiosFirebase({
          t,
          method: 'PATCH',
          url: `coreSeqV2`,
          body: {
            documentId: item.id,
            elementPath: documentPathFormatted,
            key: 'status',
            value: parseInt(item?.status),
          },
        });
        dispatch(
          setGeneralStatus({
            status: 'success',
            position: 'taskStatus-list',
            type: 'pulse',
          })
        );
      } catch (error) {
        console.error('Error updating status:', error);
      }
    }
  };

  useEffect(() => {
    if (list?.length > 0) {
      handleMoveToSetItems(list, null);
    }
  }, [activeModule, list]);

  return (
    <div>
      <Blocks
        height={1}
        isLoading={isLoading}
        heightPercentage={
          activeModule?.list?.tabs?.[activeIndex]?.displayTop === 'statuses'
            ? 85
            : 98
        }
        noBorder
        className="mt-1"
        empty={list?.length === 0}
        emptyType="empty"
      >
        <PerfectScrollbar>
          {list?.length > 0 && (
            <List dense>
              {Object.keys(itemsByStatus).map((status) => (
                <StatusDropZone
                  key={status}
                  status={status}
                  structureId={structureId}
                  itemsByStatus={itemsByStatus}
                  openStatus={openStatus}
                  currentCollection={currentCollection?.[moduleName]}
                  setOpenStatus={setOpenStatus}
                  list={updatedList || list}
                  moduleName={moduleName}
                  activeModule={activeModule}
                  handleMoveToSetItems={handleMoveToSetItems}
                  handleClick={handleClick}
                />
              ))}
            </List>
          )}
        </PerfectScrollbar>
      </Blocks>
    </div>
  );
};

export default ListF;
