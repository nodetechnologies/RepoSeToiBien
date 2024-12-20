import { Typography, Container, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import Button from '../../stories/general-components/Button';
import PublicLayout from '../../layouts/PublicLayout';

const Portal = () => {
  const { t } = useTranslation();

  const handlePortal = () => {
    window.open('https://portal.usenode.com', '_blank');
  };

  return (
    <PublicLayout>
      <Container>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
          }}
        >
          <Typography variant="h4">{t('maintenanceInPorgress')}</Typography>
          <Typography marginTop="15px" variant="h6">
            {t('accessOnline')}
          </Typography>
          <Button
            label={t('openOnline')}
            variant="contained"
            primary={true}
            onClick={handlePortal}
          />
        </Box>
      </Container>
    </PublicLayout>
  );
};

export default Portal;
