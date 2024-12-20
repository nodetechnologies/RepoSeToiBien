import React, { useState, useEffect } from 'react';
import WebsiteLayout from '../../layouts/WebsiteLayout';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router';
import useMediaQuery from '@mui/material/useMediaQuery';
import moment from 'moment/moment';
import { db } from '../../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import {
  Typography,
  Container,
  Box,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Modal,
  Paper,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import ButtonCircle from '../../stories/general-components/ButtonCircle';
import GeneralText from '../../stories/general-components/GeneralText';

const HelpApp = ({ internal }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const navigate = useNavigate();
  const currentLan = localStorage.getItem('i18nextLng');
  const [sent, setSent] = useState(false);
  const [articles, setArticles] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [subcollectionDocs, setSubcollectionDocs] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const fetchHelp = async () => {
      try {
        const q = query(
          collection(db, 'support'),
          where('isActive', '==', true)
        );
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const articlesDocs = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setArticles(articlesDocs);
        }
      } catch (error) {
        // Handle error
      }
    };

    fetchHelp();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        'https://hook.us1.make.com/53jpohkotulkqurivrcg2jvtggxeewd1',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        // Handle successful submission here
        setSent(true);
      } else {
        // Handle errors here
      }
    } catch (error) {
      // Handle network errors here
    }
  };

  const handleOpenModal = async (articleId) => {
    try {
      navigate('/app/mynode/helpcenter/' + articleId);
    } catch (error) {
      // Handle error
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const DataHelp = () => {
    return (
      <Container>
        <Grid container spacing={2} sx={{ mb: 5, mt: 5 }}>
          {articles?.map((supportData) => {
            const formattedDate = moment
              .unix(
                supportData?.lastUpdate?.seconds ||
                  supportData?.lastUpdate?._seconds
              )
              .format('D MMMM YYYY');
            return (
              <Grid item xs={12} sm={4} key={supportData?.id}>
                <Card
                  elevation={0}
                  onClick={() => handleOpenModal(supportData?.id)}
                  sx={{
                    borderRadius: '10px',
                    height: '170px',
                    border: '0.5px solid #00000020',
                    cursor: 'pointer',
                  }}
                >
                  <CardHeader
                    titleTypographyProps={{
                      fontWeight: 600,
                      fontSize: '1.05rem',
                    }}
                    subheaderTypographyProps={{
                      fontWeight: 300,
                      fontSize: '0.7rem',
                    }}
                    title={
                      (currentLan === 'fr'
                        ? supportData?.translatedTitle?.fr
                        : supportData?.translatedTitle?.en) ||
                      supportData?.title
                    }
                    subheader={t('lastUpdate') + ' ' + formattedDate}
                  />
                  <CardContent>
                    <Typography variant="body2">
                      {(currentLan === 'fr'
                        ? supportData?.translatedDescription?.fr
                        : supportData?.translatedDescription?.en) ||
                        supportData?.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>

        <Divider component="div" />
        {!internal && (
          <Box
            component="form"
            sx={{
              mt: 5,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '0 20px',
            }}
            onSubmit={handleSubmit}
          >
            <Typography variant="h5" fontWeight={600} sx={{ mt: 2 }}>
              {t('nodeHelpcustomer')}
            </Typography>
            <Typography variant="body1" sx={{ mb: 4 }}>
              {t('nodeHelpMsg')}
            </Typography>
            {sent ? (
              <div className="">
                Le message est envoyé. Vous recevrez une réponse par courriel
                sous peu!
              </div>
            ) : (
              <>
                <TextField
                  label={t('name')}
                  variant="outlined"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  sx={{ mb: 2, width: '100%' }}
                />
                <TextField
                  label={t('email')}
                  variant="outlined"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  sx={{ mb: 2, width: '100%' }}
                />
                <TextField
                  label={t('message')}
                  variant="outlined"
                  name="message"
                  multiline
                  rows={4}
                  value={formData.message}
                  onChange={handleInputChange}
                  sx={{ mb: 2, width: '100%' }}
                />
                <Button type="submit" variant="contained" color="primary">
                  {t('submit')}
                </Button>
              </>
            )}
          </Box>
        )}
      </Container>
    );
  };

  return (
    <div>
      {internal ? (
        <DataHelp />
      ) : (
        <div>
          <WebsiteLayout>
            <DataHelp />
          </WebsiteLayout>
        </div>
      )}
    </div>
  );
};

export default HelpApp;
