import React from 'react';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import { Typography, List, ListItem, ListItemText, Box } from '@mui/material';

const CardPasses = ({ items }) => {
  const { t } = useTranslation();
  const orderedItems = items?.sort((a, b) => {
    return (
      (a.startDate?.seconds || a?.startDate?._seconds) -
      (b.startDate?.seconds || b?.startDate?._seconds)
    );
  });

  const totalDuration = (startDate, endDate) => {
    if (!startDate || !endDate) return 'Invalid dates';

    // Extract seconds for Unix conversion, with a fallback if seconds are unavailable
    const startSeconds = startDate?.seconds ?? startDate?._seconds;
    const endSeconds = endDate?.seconds ?? endDate?._seconds;

    if (startSeconds === undefined || endSeconds === undefined)
      return 'Invalid timestamp format';

    // Create moment instances
    const start = moment.unix(startSeconds);
    const end = moment.unix(endSeconds);

    // Calculate duration and format in hours and minutes
    const duration = moment.duration(end.diff(start));
    return `${Math.floor(duration.asHours())} h ${duration?.minutes()} min.`;
  };

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
              sx={{ width: '45%' }}
              primary={item?.name}
              secondary={
                moment
                  .unix(item?.startDate?.seconds || item?.startDate?._seconds)
                  .format('DD MMM YYYY HH:mm') +
                ' - ' +
                moment
                  .unix(item?.endDate?.seconds || item?.endDate?._seconds)
                  .format('DD MMM YYYY HH:mm')
              }
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
              primary={item?.locationDetails?.name}
              secondary={totalDuration(item?.startDate, item?.endDate)}
              primaryTypographyProps={{
                fontSize: '11px',
                fontWeight: 300,
              }}
              secondaryTypographyProps={{
                fontSize: '10px',
                fontWeight: 200,
              }}
            />{' '}
            <ListItemText
              sx={{ width: '20%' }}
              primary={item?.attribute1 || ''}
              secondary={item?.attribute2 || ''}
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

export default CardPasses;
