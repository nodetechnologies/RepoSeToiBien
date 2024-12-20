import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { useParams } from 'react-router-dom';

//components
import { Container, Divider, Typography } from '@mui/material';
import SignInRegister from '../website/SignInRegister';
import WebsiteLayout from '../../layouts/WebsiteLayout';
import { CheckCircleOutlined } from '@mui/icons-material';
import nodeAxiosFirebase from '../../utils/nodeAxiosFirebase';

const Welcome = () => {
  const { t, i18n } = useTranslation();
  const { businessId } = useParams();
  const navigate = useNavigate();
  const [businessData, setBusinessData] = useState({});
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchBusinessData = async () => {
      if (businessId) {
        try {
          const data = await nodeAxiosFirebase({
            t,
            method: 'POST',
            url: `business-publicInfos?businessId=${businessId}`,
            noAuth: true,
            body: {},
          });

          setBusinessData(data);
          localStorage.setItem('businessId', data?.id);
          localStorage.setItem('businessName', data?.name);
          if (data?.mainColor !== undefined) {
            localStorage.setItem('mainColor', data?.mainColor);
            localStorage.setItem('secColor', data?.secColor);
          }
        } catch (error) {
          console.error('Error fetching business data:', error);
        }
      }
    };

    fetchBusinessData();
  }, [businessId]);

  const onCreation = () => {
    setSuccess(true);
  };

  return (
    <WebsiteLayout>
      <div>
        {success ? (
          <Container style={{ marginTop: '200px' }}>
            <div>
              <CheckCircleOutlined
                style={{ fontSize: '100px', marginBottom: '25px' }}
                color="success"
              />
            </div>
            <Typography variant="h6" fontSize="14px" gutterBottom>
              {t('successEmployee')}
            </Typography>
            <div style={{ maxWidth: '200px', marginTop: '200px' }}>
              {/* <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={() => {
                  navigate('/signIn');
                }}
                label={t('login')}
              /> */}
            </div>
          </Container>
        ) : (
          <Container>
            <div className="row mt-4">
              <div
                style={{ paddingRight: '80px', paddingLeft: '15px' }}
                className="col-md-6 col-12 mt-1 mb-1 align-left"
              >
                {' '}
                <div>
                  <div className="mt-5">
                    <img
                      src={`https://storage.googleapis.com/node-business-logos/${businessData?.id}.png`}
                      height="50"
                      width="50"
                      alt="logo"
                      style={{
                        borderRadius: '50%',
                        marginTop: '30px',
                        marginBottom: '15px',
                      }}
                    />
                    <Typography
                      variant="h2"
                      fontSize="36px"
                      fontWeight={600}
                      color="textPrimary"
                    >
                      {businessData?.name}
                    </Typography>
                    <Typography
                      variant="h5"
                      fontSize="26px"
                      fontWeight={600}
                      color="textPrimary"
                    >
                      {t('welcomeEmployee')}
                    </Typography>

                    <Typography
                      variant="h5"
                      fontSize="13px"
                      fontWeight={400}
                      sx={{
                        marginTop: '10px',
                      }}
                      color="textPrimary"
                    >
                      {t('welcomeEmployeeText')}
                    </Typography>
                  </div>
                  <div className="mt-2">
                    <Divider component="div" />
                  </div>

                  <div>
                    <div
                      className="align-left"
                      style={{
                        marginTop: '30px',
                        display: 'flex',
                      }}
                    >
                      {businessData?.fb && (
                        <a
                          href={businessData?.fb}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <img
                            src="/assets/website/social/icon-fb-logonode.png"
                            alt="Facebook"
                            style={{
                              width: '28px',
                              height: '28px',
                              marginRight: '10px',
                            }}
                          />
                        </a>
                      )}
                      {businessData?.tk && (
                        <a
                          href={businessData?.tk}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <img
                            src="/assets/website/social/icon-tiktok-logonode.png"
                            alt="Twitter"
                            style={{
                              width: '28px',
                              height: '28px',
                              marginRight: '10px',
                            }}
                          />
                        </a>
                      )}
                      {businessData?.ig && (
                        <a
                          href={businessData?.ig}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <img
                            src="/assets/website/social/icon-instagram-logonode.png"
                            alt="Instagram"
                            style={{
                              width: '28px',
                              height: '28px',
                              marginRight: '10px',
                            }}
                          />
                        </a>
                      )}
                      {businessData?.lk && (
                        <a
                          href={businessData?.lk}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <img
                            src="/assets/website/social/icon-linkedin-logonode.png"
                            alt="LinkedIn"
                            style={{
                              width: '28px',
                              height: '28px',
                              marginRight: '10px',
                            }}
                          />
                        </a>
                      )}
                      {businessData?.yt && (
                        <a
                          href={businessData?.yt}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <img
                            src="/assets/website/social/icon-youtube-logonode.png"
                            alt="Youtube"
                            style={{
                              width: '28px',
                              height: '28px',
                              marginRight: '10px',
                            }}
                          />
                        </a>
                      )}
                      {businessData?.website && (
                        <a
                          href={'https://' + businessData?.website}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <img
                            src="/assets/website/social/icon-website-logonode.png"
                            alt="Website"
                            style={{
                              width: '28px',
                              height: '28px',
                              marginRight: '10px',
                            }}
                          />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
                <div className="mb-5">
                  <SignInRegister fromWelcome onCreation={onCreation} />
                </div>
              </div>
              <div className="col-md-6 col-12 hide-on-mobile mt-1 mb-1">
                <img
                  src={businessData?.backgroundImage}
                  height="390"
                  width="650"
                  alt="banner"
                  style={{
                    borderRadius: '10px',
                    marginTop: '30px',
                    objectFit: 'cover',
                  }}
                />
              </div>
            </div>
          </Container>
        )}
      </div>
    </WebsiteLayout>
  );
};

export default Welcome;
