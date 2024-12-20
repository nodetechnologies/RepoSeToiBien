import React, { useState } from 'react';
import { useSelector } from 'react-redux';

//utilities
import { useTranslation } from 'react-i18next';
import { GoogleMap, Marker, LoadScript } from '@react-google-maps/api';

//components
import _ from 'lodash';

const MapGeo = ({ elementDetails }) => {
  const { t, i18n } = useTranslation();
  const businessPreference = useSelector((state) => state.core.businessData);
  const apiKey = process.env.REACT_APP_GOOGLE_MAP_API_KEY;

  // Extract and validate coordinates
  const geoCoord = elementDetails?.elementData?.geo || {};
  const lat = parseFloat(geoCoord._lat);
  const lng = parseFloat(geoCoord._long);

  const isValidLatLng = !isNaN(lat) && !isNaN(lng);

  // Default marker style
  const svgMarker = {
    path: 'M-1.547 12l6.563-6.609-1.406-1.406-5.156 5.203-2.063-2.109-1.406 1.406zM0 0q2.906 0 4.945 2.039t2.039 4.945q0 1.453-0.727 3.328t-1.758 3.516-2.039 3.070-1.711 2.273l-0.75 0.797q-0.281-0.328-0.75-0.867t-1.688-2.156-2.133-3.141-1.664-3.445-0.75-3.375q0-2.906 2.039-4.945t4.945-2.039z',
    fillColor: businessPreference?.mainColor,
    fillOpacity: 1,
    strokeWeight: 0,
    rotation: 0,
    scale: 2,
  };

  return (
    <div className="p-2">
      <LoadScript googleMapsApiKey={apiKey}>
        <GoogleMap
          options={{
            mapTypeControl: false,
            styles: [
              {
                stylers: [{ saturation: -100 }],
              },
            ],
          }}
          mapContainerStyle={{
            width: '100%',
            height: '15vh',
            borderRadius: '6px',
            boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.10)',
          }}
          center={isValidLatLng ? { lat, lng } : { lat: 0, lng: 0 }}
          zoom={16}
        >
          {isValidLatLng && <Marker position={{ lat, lng }} icon={svgMarker} />}
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default MapGeo;
