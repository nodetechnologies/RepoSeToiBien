import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import chroma from 'chroma-js';

// utilities
import { useTranslation } from 'react-i18next';

import Avatar from '../../../stories/general-components/Avatar';

import { ListItemAvatar, ListItemText, Box } from '@mui/material';
import GeneralText from '../../../stories/general-components/GeneralText';

const ItemRender = ({ col, element, isSelected }) => {
  const { t } = useTranslation();

  const { structureId } = useParams();

  const businessPreference = useSelector((state) => state.core.businessData);
  const businessStructures = useSelector(
    (state) => state.core.structure
  )?.structures;

  const mainColor = businessPreference?.mainColor || '#000000';

  const getStatusColor = (count) => {
    const intensity = count / 10;
    return chroma.mix('grey', mainColor, intensity).hex();
  };

  const structure = businessStructures?.find(
    (structure) => structure.id === structureId
  );

  return (
    <Box
      sx={{
        // width: `100%`,
        overflow: 'hidden',
        height: '100%',
        backgroundColor: isSelected && businessPreference?.secColor + '05',
        border: isSelected && `1px solid ${businessPreference?.secColor}10`,
        padding: '5px',
        borderRadius: '6px',
      }}
    >
      {(col?.typeValue === 'text' ||
        col?.typeValue === 'string' ||
        col?.typeValue === 'money' ||
        col?.typeValue === 'date' ||
        col?.typeValue === 'date-time' ||
        col?.typeValue === 'tags' ||
        col?.typeValue === 'status') && (
        <ListItemText
          primary={
            <GeneralText
              primary={col?.valueColor === 'primary' ? true : false}
              size={col?.weight || 'medium'}
              fontSize="11px"
              color={col?.valueColor}
              structureId={structure?.id}
              text={
                col?.selections?.length > 0
                  ? col?.selections?.find(
                      (selection) =>
                        selection?.value === element?.[col?.structureValue]
                    )?.label
                  : element?.[col?.structureValue] ?? '-'
              }
              type={col?.typeValue || 'string'}
              ui={col?.fieldType}
            />
          }
          secondary={
            <>
              {col?.sub?.value && (
                <GeneralText
                  primary={true}
                  size="regular"
                  fontSize="9px"
                  structureId={structure?.id}
                  text={element?.[col?.sub?.value] ?? ''}
                  type={col?.sub?.typeValue || 'text'}
                />
              )}
            </>
          }
        />
      )}
      {col?.typeValue === 'custom:statuses' && (
        <div className="d-flex-3d">
          {[0, 1, 2, 3].map((status) => {
            const statusCount =
              element?.targetStatuses?.[`status${status}`] ?? 0;
            return (
              <div
                key={status}
                style={{
                  backgroundColor: getStatusColor(statusCount),
                  width: '25px',
                }}
                className="status-square"
              >
                {statusCount}
              </div>
            );
          })}
        </div>
      )}

      {(col?.typeValue === 'avatar' || col?.fieldType === 'media') && (
        <ListItemAvatar>
          <Avatar
            img={element?.[col?.structureValue] ?? ''}
            name={element?.name ?? ''}
            alt={element?.[col?.structureValue] ?? ''}
            sx={{
              maxWidth: `${'40px !important'}`,
              maxHeight: `${'40px !important'}`,
              borderRadius: '6px !important',
              padding: '4px',
            }}
          />
        </ListItemAvatar>
      )}
    </Box>
  );
};

export default ItemRender;
