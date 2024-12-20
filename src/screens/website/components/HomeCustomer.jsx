import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
// import GoogleMapReact from 'google-map-react'; // Vous aurez besoin de cette bibliothèque

// Simuler un tableau d'entreprises
const companies = [
  { name: 'Entreprise A', location: { lat: 45.5088, lng: -73.554 } },
  { name: 'Entreprise B', location: { lat: 45.45, lng: -73.65 } },
  // ... d'autres entreprises
];

const googleKey = process.env.REACT_APP_GOOGLE_MAP_API_KEY; // Remplacez par votre clé

const HomeCustomer = () => {
  const { t } = useTranslation();
  const defaultMapCenter = {
    lat: 45.5017,
    lng: -73.5673,
  };

  // const [mapCenter, setMapCenter] = useState(defaultMapCenter);
  // const [searchValue, setSearchValue] = useState('');

  // useEffect(() => {
  //   if (navigator.geolocation) {
  //     navigator.geolocation.getCurrentPosition((position) => {
  //       setMapCenter({
  //         lat: position.coords.latitude,
  //         lng: position.coords.longitude,
  //       });
  //     });
  //   }
  // }, []);

  // const defaultZoom = 11;

  // const renderMarkers = (map, maps) => {
  //   companies.forEach((company) => {
  //     const marker = new maps.Marker({
  //       position: company.location,
  //       map,
  //       title: company.name,
  //     });
  //   });
  // };

  //get businesses from businessesOnNode collection
  const [businesses, setBusinesses] = useState([]);

  // const getBusinesses = async () => {
  //   const response = await nodeAxiosFirebase({
  //     t,
  //     method: 'POST',
  //     url: `search-businesses`,
  //     noAuth: true,
  //     body: {
  //       query: searchValue,
  //     },
  //   });
  //   if (response) {
  //     setBusinesses(response.hits);
  //   }
  // };

  // useEffect(() => {
  //   getBusinesses();
  // }, []);

  return (
    <div className="py-4">
      <Grid container spacing={3}>
        En construction
      </Grid>
    </div>
  );
};

export default HomeCustomer;
