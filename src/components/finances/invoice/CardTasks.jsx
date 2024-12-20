import React from 'react';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  Divider,
  ListItemText,
  Box,
} from '@mui/material';

const CardTasks = ({ items }) => {
  const { t } = useTranslation();
  const orderedItems = items?.sort((a, b) => {
    return (
      (a.targetDate?.seconds || a?.targetDate?._seconds) -
      (b.targetDate?.seconds || b?.targetDate?._seconds)
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
              secondary={item?.description || item?.data?.description}
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
              primary={moment
                .unix(item?.targetDate?.seconds || item?.targetDate?._seconds)
                .format('DD MMM YYYY')}
              secondary={item?.type}
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
                {/* {item?.photos?.map((photo, index) => (
                  <img
                    key={index}
                    src={photo}
                    onClick={() => {
                      window.open(photo, '_blank');
                    }}
                    alt={item?.name}
                    style={{
                      width: '35px',
                      height: '35px',
                      borderRadius: '50%',
                      marginRight: '5px',
                    }}
                  />
                ))} */}
              </div>
            </Box>
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default CardTasks;
