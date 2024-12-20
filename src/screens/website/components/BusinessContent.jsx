import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import {
  Button,
  Typography,
  Container,
  Paper,
  Grid,
  Box,
  Tabs,
  Tab,
  List,
  ListItem,
} from '@mui/material';
import { db } from '../../../firebase';
import ServiceTile from './ServiceTile';
import {
  BusinessCenterOutlined,
  LinkSharp,
  LocalOfferOutlined,
  RoomServiceOutlined,
} from '@mui/icons-material';
import { collection, getDocs, where, query, doc } from '@firebase/firestore';
import ArticleTile from './ArticleTile';

const BusinessContent = ({ data, isMobile }) => {
  const [value, setValue] = useState(0);
  const { t } = useTranslation();
  const { businessId } = useParams();
  const [services, setServices] = useState([]);
  const [articles, setArticles] = useState([]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  let tabs = [];

  if (data?.displayServices) {
    tabs.push(
      <Tab
        sx={{ textAlign: 'left', width: '22vh' }}
        value={0}
        label={
          <div>
            <RoomServiceOutlined fontSize="12px" />
            <div>{t('services')}</div>
            <div
              style={{
                fontSize: '0.65em',
                color: 'gray',
                fontWeight: 300,
              }}
            >
              {t('detailsServices')}
            </div>
          </div>
        }
      />
    );
  }

  if (data?.displayArticles) {
    tabs.push(
      <Tab
        sx={{ textAlign: 'left', width: '22vh' }}
        value={1}
        label={
          <div>
            <LocalOfferOutlined fontSize="12px" />
            <div>{t('articles')}</div>
            <div
              style={{
                fontSize: '0.65em',
                color: 'gray',
                fontWeight: 300,
              }}
            >
              {t('detailsArticles')}
            </div>
          </div>
        }
      />
    );
  }

  if (data?.isActive && data?.links?.length > 0) {
    tabs.push(
      <Tab
        sx={{ textAlign: 'left', width: '22vh' }}
        value={2}
        label={
          <div>
            <LinkSharp fontSize="12px" />
            <div>{t('links')}</div>
            <div
              style={{
                fontSize: '0.65em',
                color: 'gray',
                fontWeight: 300,
              }}
            >
              {t('detailsLinks')}
            </div>
          </div>
        }
      />
    );
  }

  if (data?.isActive) {
    tabs.push(
      <Tab
        sx={{ textAlign: 'left', width: '22vh' }}
        value={3}
        label={
          <div>
            <BusinessCenterOutlined fontSize="12px" />
            <div>{t('details')}</div>
            <div
              style={{
                fontSize: '0.65em',
                color: 'gray',
                fontWeight: 300,
              }}
            >
              {t('detailsContact')}
            </div>
          </div>
        }
      />
    );
  }

  useEffect(() => {
    if (data?.displayServices) {
      const fetchServices = async () => {
        try {
          const marketplaceRef = collection(db, 'marketplace');
          const businessRef = doc(db, 'businessesOnNode', businessId);
          const q = query(
            marketplaceRef,
            where('ownerId', '==', businessRef),
            where('type', '==', 0)
          );
          const servicesSnap = await getDocs(q);
          if (!servicesSnap.empty) {
            setServices(servicesSnap.docs.map((doc) => doc.data()));
          }
        } catch (error) {
          console.error(error);
        }
      };

      fetchServices();
    }
  }, [data?.displayServices, businessId]);

  useEffect(() => {
    if (data?.displayArticles) {
      const fetchArticles = async () => {
        try {
          const marketplaceRef = collection(db, 'marketplace');
          const businessRef = doc(db, 'businessesOnNode', businessId);
          const q = query(
            marketplaceRef,
            where('ownerId', '==', businessRef),
            where('type', '==', 1)
          );
          const articlesSnap = await getDocs(q);
          if (!articlesSnap.empty) {
            setArticles(articlesSnap.docs.map((doc) => doc.data()));
          }
        } catch (error) {}
      };

      fetchArticles();
    }
  }, [data?.displayArticles, businessId]);

  return (
    <Container sx={{ mt: 5 }}>
      <div>
        <Grid container spacing={2}>
          <Grid item xs={3}>
            <Tabs
              orientation="vertical"
              variant="scrollable"
              value={value}
              sx={{ borderRight: 1, borderColor: 'divider', width: '22vh' }}
              onChange={handleChange}
            >
              {tabs}
            </Tabs>
          </Grid>
          <Grid item xs={9}>
            <Box>
              {value === 0 && data?.displayServices && (
                <div>
                  <div className="row">
                    {services?.map((service) => (
                      <div className="col-3 g-3 hover">
                        <ServiceTile service={service} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {value === 1 && data?.displayArticles && (
                <div>
                  <div className="row ">
                    {articles?.map((article) => (
                      <div className="col-3 g-3 hover">
                        <ArticleTile article={article} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {value === 2 && (
                <div>
                  <div>
                    {data?.links?.map((link) => (
                      <div className="col-12">
                        <List>
                          <ListItem
                            button
                            component="a"
                            href={link?.url}
                            target="_blank"
                          >
                            {link?.name}
                          </ListItem>
                        </List>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {value === 3 && (
                <div>
                  <div className="row"></div>
                </div>
              )}
            </Box>
          </Grid>
        </Grid>
      </div>
    </Container>
  );
};

export default BusinessContent;
