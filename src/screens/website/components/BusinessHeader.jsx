import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import {
  Button,
  Typography,
  Container,
  Paper,
  Grid,
  Box,
  Avatar,
  Stack,
  IconButton,
} from '@mui/material';
import {
  Directions,
  Map,
  MessageOutlined,
  PhoneAndroidOutlined,
} from '@mui/icons-material';

const BusinessHeader = ({ data, isMobile }) => {
  return (
    <Container sx={{ mt: 5 }}>
      <div>
        <img
          src={data?.backgroundImage}
          alt="background"
          style={{
            width: '100%',
            height: '300px',
            objectFit: 'cover',
            borderRadius: '25px',
          }}
        />
        <div className="d-flex justify-content-between">
          <div
            style={{ width: '100%', marginLeft: '10%', marginTop: '-30px' }}
            className="align-left"
          >
            <div>
              <img
                src={`https://storage.googleapis.com/node-business-logos/${
                  data?.id || 'nodetechnologies'
                }.png`}
                alt="logo"
                style={{
                  width: isMobile ? '80px' : '100px',
                  height: isMobile ? '80px' : '100px',
                  objectFit: 'cover',
                  borderRadius: '50%',
                  border: '3px solid white',
                  top: '-50px',
                  left: '20%',
                  transform: 'translateX(-50%)',
                }}
              />
            </div>
            <div
              style={{
                marginLeft: isMobile ? '20%' : '8%',
                marginTop: '-50px',
              }}
            >
              <Typography
                variant="h4"
                sx={{ fontWeight: 600, fontSize: '24px' }}
              >
                {data?.name}
              </Typography>
              <Typography
                variant="caption"
                sx={{ fontWeight: 400, fontSize: '12px' }}
              >
                {data?.city}
              </Typography>
            </div>
          </div>
          <div
            className={!isMobile && 'd-flex'}
            style={{
              marginTop: '20px',
              paddingRight: '3%',
              textAlign: 'right',
            }}
          >
            <div
              style={{
                width: '175px',
              }}
              className="mb-3 px-3 mt-2"
            >
              <IconButton
                size="medium"
                color="primary"
                onClick={() => {
                  window.location.href = `tel:${data?.phone}`;
                }}
                aria-label="upload picture"
                component="span"
              >
                <PhoneAndroidOutlined />
              </IconButton>
              <IconButton
                size="medium"
                color="primary"
                aria-label="upload picture"
                component="span"
              >
                <MessageOutlined />
              </IconButton>
              <IconButton
                size="medium"
                color="primary"
                onClick={() => {
                  window.open(
                    `https://www.google.com/maps/search/?api=1&query=${
                      data?.address +
                      ', ' +
                      data?.city +
                      ', ' +
                      data?.region +
                      ', ' +
                      data?.country
                    }`
                  );
                }}
                aria-label="upload picture"
                component="span"
              >
                <Directions />
              </IconButton>
            </div>
            {!isMobile && (
              <div
                style={{
                  boxShadow: '10px 0px 11px 8px #00000003',
                  padding: '10px',
                  borderRadius: '10px',
                  width: '200px',
                  textAlign: 'center',
                }}
              >
                Rate
              </div>
            )}
          </div>
        </div>
      </div>
    </Container>
  );
};

export default BusinessHeader;
