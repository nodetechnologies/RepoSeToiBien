import React from 'react';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import { Typography, List, ListItem, ListItemText } from '@mui/material';

const CardNodies = ({ items }) => {
  const { t } = useTranslation();
  const orderedItems = items?.sort((a, b) => {
    return (
      (a.dueDate?.seconds || a?.dueDate?._seconds) -
      (b.dueDate?.seconds || b?.dueDate?._seconds)
    );
  });

  return (
    <div className="mb-4">
      {orderedItems?.length === 0 && (
        <Typography
          variant="h6"
          sx={{ fontSize: '12px', marginLeft: '15px', fontWeight: 500, mb: 2 }}
        >
          {t('noData')}
        </Typography>
      )}
      <List>
        {orderedItems?.map((item, index) => (
          <ListItem dense divider key={index}>
            <ListItemText
              sx={{ width: '60%' }}
              primary={item?.name}
              secondary={item?.description}
              primaryTypographyProps={{
                fontSize: '11px',
                fontWeight: 400,
              }}
              secondaryTypographyProps={{
                fontSize: '10px',
                fontWeight: 200,
              }}
            />
            <ListItemText
              sx={{ width: '25%' }}
              primary={item?.status}
              secondary={moment
                .unix(item?.dueDate?.seconds || item?.dueDate?._seconds)
                .format('DD MMM YYYY HH:mm')}
              primaryTypographyProps={{
                fontSize: '11px',
                fontWeight: 300,
              }}
              secondaryTypographyProps={{
                fontSize: '10px',
                fontWeight: 200,
              }}
            />
            <ListItemText
              sx={{ width: '15%' }}
              primary={'#' + item?.id}
              secondary={item?.type}
              primaryTypographyProps={{
                fontSize: '10px',
                fontWeight: 300,
              }}
              secondaryTypographyProps={{
                fontSize: '10px',
                fontWeight: 200,
              }}
            />
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default CardNodies;
