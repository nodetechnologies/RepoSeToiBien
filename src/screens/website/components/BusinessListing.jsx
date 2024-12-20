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
} from '@mui/material';

// Simuler un tableau d'entreprises
const companies = [
  { name: 'Entreprise A', location: { lat: 45.5088, lng: -73.554 } },
  { name: 'Entreprise B', location: { lat: 45.45, lng: -73.65 } },
  // ... d'autres entreprises
];

const BusinessListing = () => {
  return (
    <Container>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}></Grid>
      </Grid>
    </Container>
  );
};

export default BusinessListing;
