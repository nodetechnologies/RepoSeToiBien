import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import {
  Button,
  TextField,
  Container,
  Typography,
  Box,
  InputAdornment,
} from '@mui/material';
import WebsiteLayout from '../../layouts/WebsiteLayout';
import {
  Business,
  CalendarMonthOutlined,
  Email,
  Notes,
  Person,
} from '@mui/icons-material';

const PlanDemo = () => {
  const [demoData, setDemoData] = useState({
    name: '',
    email: '',
    company: '',
    date: '',
    notes: '',
  });
  const [message, setMessage] = useState('');
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setDemoData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      // Replace with your API endpoint
      const response = await fetch(
        'https://hook.us1.make.com/f8cauj288mle844gttmo69cv8uozs01b',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(demoData),
        }
      );

      if (response.ok) {
        setMessage(t('sent'));
        setDemoData({
          name: '',
          email: '',
          company: '',
          date: '',
          notes: '',
        });
      } else {
        setMessage('Error sending demo request. Please try again.');
      }
    } catch (error) {
      setMessage(
        'There was an error sending the demo request. Please try again.'
      );
    }
  };

  return (
    <WebsiteLayout>
      <Container>
        <div className="row py-5 mt-5">
          <div
            style={{
              padding: '20px',
            }}
            className="col-md-5 col-12 mt-4"
          >
            <img
              src="/assets/website/2.0/shop-node.jpg"
              alt="arrow"
              style={{
                borderRadius: '20px',
                padding: '20px',
                width: isMobile ? '250px' : '400px',
                marginLeft: isMobile ? '5%' : '10%',
                marginRight: isMobile ? '5%' : '10%',
                zIndex: 3,
              }}
              className="mt-3"
            />
          </div>
          <div className="col-md-6 col-12 mt-4 align-left">
            <div>
              <Typography fontSize={32} fontWeight={600}>
                {t('planDemo')}
              </Typography>
            </div>
            <div>
              <Typography fontSize={14} fontWeight={500} gutterBottom>
                {t('planDemoText')}
              </Typography>
            </div>
            {message && (
              <Typography color="primary" marginBottom="20px">
                {message}
              </Typography>
            )}
            <Box component="form" onSubmit={handleSubmit} marginBottom="100px">
              <TextField
                label={t('name')}
                variant="outlined"
                name="name"
                value={demoData.name}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Person />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  marginTop: '20px',
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '10px',
                  },
                }}
              />
              <TextField
                label={t('email')}
                variant="outlined"
                name="email"
                value={demoData.email}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Email />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  marginTop: '20px',
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '10px',
                  },
                }}
              />
              <TextField
                label={t('company')}
                variant="outlined"
                name="company"
                value={demoData.company}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Business />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  marginTop: '20px',
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '10px',
                  },
                }}
              />
              <TextField
                label={t('preferredDate')}
                variant="outlined"
                name="date"
                type="date"
                value={demoData.date}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
                sx={{
                  marginTop: '20px',
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '10px',
                  },
                }}
              />
              <TextField
                label={t('additionalNotes')}
                variant="outlined"
                name="notes"
                value={demoData.notes}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                multiline
                rows={4}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Notes />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  marginTop: '20px',
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '10px',
                  },
                }}
              />
              <Button
                sx={{ marginTop: '20px' }}
                type="submit"
                variant="contained"
                color="primary"
                size="large"
              >
                {t('send')}
              </Button>
            </Box>
          </div>
        </div>
      </Container>
    </WebsiteLayout>
  );
};

export default PlanDemo;
