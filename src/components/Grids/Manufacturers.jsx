import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { DataGridPro, GridToolbar } from '@mui/x-data-grid-pro';
import { Select, MenuItem } from '@mui/material';
import moment from 'moment/moment';
import nodeAxiosFirebase from '../../utils/nodeAxiosFirebase';
import { setGeneralStatus } from '../../redux/actions-v2/coreAction';

const StatusDropdown = ({
  status,
  onStatusChange,
  activeStructure,
  colValue,
}) => {
  const statusField = activeStructure?.fields?.find(
    (field) => field?.value === colValue
  );
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language;

  const statusColor = statusField?.selections?.find(
    (s) => s?.value === status
  )?.color;

  return (
    <Select
      value={status}
      displayEmpty
      inputProps={{ 'aria-label': 'Without label' }}
      sx={{
        border: 'none',
        fontSize: '0.9rem',
        color: '#FFF',
        fontWeight: 500,
        backgroundColor: statusColor || 'transparent',
        borderRadius: '0px',
        '& .MuiOutlinedInput-notchedOutline': {
          border: 'none',
        },
        '&:hover .MuiOutlinedInput-notchedOutline': {
          border: 'none',
        },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
          border: 'none',
        },
      }}
      onChange={(e) => onStatusChange(e.target.value)}
      size="small"
      fullWidth
    >
      {statusField?.selections?.map((status) => (
        <MenuItem
          elevation={0}
          PaperProps={{
            sx: {
              border: 'none',
              boxShadow: 'none',
              borderRadius: '0px',
            },
          }}
          sx={{
            backgroundColor: status?.color || 'transparent',
            color: '#FFF',
            borderRadius: '0px',
            fontWeight: 500,
            '&.Mui-selected': { color: '#000' },
            '&:hover': { color: '#000' },
          }}
          key={status?.value}
          value={status?.value}
        >
          {status?.['label_' + currentLang] || status.name_en}
        </MenuItem>
      ))}
    </Select>
  );
};

const Manufacturers = ({ onRowSelected, list }) => {
  const [rows, setRows] = useState();
  const { t, i18n } = useTranslation();
  const { structureId } = useParams();
  const dispatch = useDispatch();

  const projects = list;

  const businessPreference = useSelector((state) => state.core.businessData);
  const businessStructure = useSelector(
    (state) => state.core.businessStructure
  );

  const businessStructures = businessStructure?.structures;

  const activeStructure = businessStructures?.find(
    (structure) => structure?.id === structureId
  );

  const propertySuffix = i18n.language === 'en' ? '_en' : '_fr';

  const handleRowClick = (param) => {
    onRowSelected(param.row);
  };

  const handleStatusChange = async (itemId, newStatus, valueField) => {
    const updatedRows = rows?.map((row) => {
      if (row.id === itemId) {
        return {
          ...row,
          status: newStatus,
        };
      }
      return row;
    });

    const elementData = projects?.find((card) => card?.id === itemId);

    setRows(updatedRows);

    let formatedPath = elementData?.documentPath.split('/');
    formatedPath = formatedPath.filter((part) => part !== itemId).join('/');
    try {
      dispatch(
        setGeneralStatus({
          status: 'loading',
          position: 'garex-Manufacturers',
          type: 'pulse',
        })
      );
      await nodeAxiosFirebase({
        t,
        method: 'PATCH',
        url: `coreSeqV2`,
        body: {
          documentId: itemId,
          elementPath: formatedPath,
          key: valueField,
          value: newStatus,
        },
      });
      dispatch(
        setGeneralStatus({
          status: 'success',
          position: 'garex-Manufacturers',
          type: 'pulse',
        })
      );
    } catch (error) {
      console.error(error);
    }
  };

  const cardsColumns = [
    { field: 'name', headerName: t('project'), width: 320 },
    { field: 'assignedTo', headerName: t('distributors'), width: 280 },
    { field: 'clientName', headerName: t('client'), width: 210 },
    { field: 'date', headerName: t('date'), width: 140 },
    {
      field: 'status',
      headerName: t('status'),
      width: 180,
      renderCell: (params) => (
        <StatusDropdown
          propertySuffix={propertySuffix}
          activeStructure={activeStructure}
          colValue="status"
          status={params.value}
          onStatusChange={(newStatus) =>
            handleStatusChange(params.id, newStatus, 'status')
          }
        />
      ),
    },
    { field: 'value', headerName: t('value'), width: 130 },
    { field: 'region', headerName: t('region'), width: 160 },
    { field: 'source', headerName: t('Source'), width: 120 },
    { field: 'views', headerName: t('views'), width: 70 },
  ];

  useEffect(() => {
    if (projects?.length !== 0) {
      let tempData = [];

      projects?.forEach((card) => {
        const formattedTotal = new Intl.NumberFormat(i18n.language, {
          style: 'currency',
          currency: 'CAD',
        }).format(card?.finances?.total / 10000);

        tempData.push({
          id: card?.id,
          name: card?.name,
          clientName: card?.targetMiddleDetails?.name,
          date: moment
            .unix(
              card?.timeStamp?.seconds ||
                card?.timeStamp?._seconds ||
                card?.timeStamp / 1000 ||
                null
            )
            .format('DD MMM YYYY HH:mm'),
          assignedTo: card?.targetDetails?.name,
          value: formattedTotal,
          region: card?.targetDetails?.state,
          status: card?.status,
          views: card?.views,
          structureId: card?.structureId,
          lastUpdate: card?.lastUpdate,
          documentPath: card?.documentPath,
          targetId: card?.targetId,
          ownerId: businessPreference?.id,
        });
      });
      setRows(tempData);
    }
  }, [projects, i18n.language]);

  return (
    <>
      <div style={{ height: '67vh' }} className="m-0 p-1">
        <DataGridPro
          rows={rows ? rows : []}
          columns={cardsColumns}
          rowHeight={35}
          pagination={false}
          disableRowSelectionOnClick
          sx={{ border: 0 }}
          // localeText={
          //   i18n.language === 'fr'
          //     ? frFR.components.MuiDataGrid.defaultProps.localeText
          //     : null
          // }
          components={{ Toolbar: GridToolbar }}
          onRowClick={handleRowClick}
          componentsProps={{
            toolbar: {
              quickFilterProps: { debounceMs: 500 },
            },
          }}
        />
      </div>
    </>
  );
};

export default Manufacturers;
