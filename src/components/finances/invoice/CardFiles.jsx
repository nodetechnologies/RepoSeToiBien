//Libraries
import React from 'react';
import { useTranslation } from 'react-i18next';
//Components
import { Typography, Box } from '@mui/material';
import Avatar from '../../../stories/general-components/Avatar';

const CardFiles = ({ items }) => {
  const { t } = useTranslation();

  return (
    <div className="mb-4">
      {items?.length === 0 && (
        <Typography
          variant="h6"
          sx={{ fontSize: '12px', marginLeft: '15px', fontWeight: 500, mb: 2 }}
        >
          {t('noData')}
        </Typography>
      )}

      <Box sx={{ width: '100%' }}>
        <div className="d-flex hover">
          <Avatar
            img={items ?? ''}
            name={items ?? ''}
            alt={''}
            type={'media'}
            label={''}
            size={'large'}
            sx={{
              maxWidth: `${'50px !important'}`,
              maxHeight: `${'50px !important'}`,
              borderRadius: '6px !important',
              padding: '4px',
            }}
          />
        </div>
      </Box>
    </div>
  );
};

export default CardFiles;
