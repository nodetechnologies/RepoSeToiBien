import React from 'react';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import { Typography, List, ListItem, ListItemText, Box } from '@mui/material';

const CardStorages = ({ items }) => {
  const { t } = useTranslation();
  const orderedItems = items?.sort((a, b) => {
    return (
      (a.timeStamp?.seconds || a?.timeStamp?._seconds) -
      (b.timeStamp?.seconds || b?.timeStamp?._seconds)
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
              secondary={item?.attribute3}
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
              primary={item?.attribute1}
              secondary={item?.attribute2 + ' ' + item?.attribute4}
              primaryTypographyProps={{
                fontSize: '11px',
                fontWeight: 300,
              }}
              secondaryTypographyProps={{
                fontSize: '10px',
                fontWeight: 200,
              }}
            />
            <Box sx={{ width: '15%' }}>
              <div className="d-flex hover">
                {item?.photos?.map((photo, index) => (
                  <img
                    key={index}
                    src={photo}
                    alt={item?.name}
                    style={{
                      width: '35px',
                      height: '35px',
                      borderRadius: '50%',
                      marginRight: '5px',
                    }}
                  />
                ))}
              </div>
            </Box>
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default CardStorages;
