import React, { useCallback, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';

const mapContainerStyle = {
  width: '100%',
  height: '460px',
  borderRadius: '15px',
  overflow: 'hidden',
};

// Generate a custom pin icon with dynamic color
const createCustomPinIcon = (color) => {
  return {
    url:
      `data:image/svg+xml;charset=UTF-8,` +
      encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48" height="48">
          <path fill="${color}" d="M12 2C8.1 2 5 5.1 5 9c0 5.6 7 13 7 13s7-7.4 7-13c0-3.9-3.1-7-7-7zm0 9.5c-1.4 0-2.5-1.1-2.5-2.5S10.6 6.5 12 6.5s2.5 1.1 2.5 2.5S13.4 11.5 12 11.5z"/>
        </svg>
      `),
    scaledSize: new window.google.maps.Size(40, 40),
  };
};

const SideExtra = ({ structure, color, data, secColor }) => {
  const { t } = useTranslation();
  const searchResults = useSelector((state) => state.list.searchResults);

  const [selectedMarker, setSelectedMarker] = useState(null);
  const [mapInstance, setMapInstance] = useState(null);

  const googleMapsApiKey = process.env.REACT_APP_GOOGLE_MAP_API_KEY;

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: googleMapsApiKey,
  });

  const defaultCenter = {
    lat: searchResults?.[0]?._geoloc?.lat || 45.5017,
    lng: searchResults?.[0]?._geoloc?.lng || -73.5673,
  };

  const onLoad = useCallback(
    (map) => {
      setMapInstance(map);
      if (searchResults?.length > 0) {
        const bounds = new window.google.maps.LatLngBounds();
        searchResults.forEach((result) => {
          if (result?._geoloc?.lat && result?._geoloc?.lng) {
            bounds.extend(
              new window.google.maps.LatLng(
                result._geoloc.lat,
                result._geoloc.lng
              )
            );
          }
        });
        map.fitBounds(bounds);
      }
    },
    [searchResults]
  );

  useEffect(() => {
    if (mapInstance && searchResults?.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      searchResults.forEach((result) => {
        if (result?._geoloc?.lat && result?._geoloc?.lng) {
          bounds.extend(
            new window.google.maps.LatLng(
              result._geoloc.lat,
              result._geoloc.lng
            )
          );
        }
      });
      mapInstance.fitBounds(bounds);
    }
  }, [mapInstance, searchResults]);

  const mapOptions = {
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: false,
  };

  if (!isLoaded) return <div>{t('loading')}</div>;

  return (
    <div style={{ paddingLeft: '25px', marginTop: '16px' }}>
      {(structure?.sideExtra === 'map' ||
        structure?.element?.preferences?.sideExtra === 'map') &&
        isLoaded &&
        searchResults?.length > 0 && (
          <div>
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={defaultCenter}
              zoom={10}
              onLoad={onLoad}
              options={mapOptions}
            >
              {searchResults?.map((result, index) => {
                const { _geoloc, targetId } = result;
                if (!_geoloc?.lat || !_geoloc?.lng) return null;

                const isInTargetList = data?.targetId?.includes(
                  'users/' + targetId
                );
                const pinColor = isInTargetList ? secColor : color;

                return (
                  <Marker
                    key={index}
                    position={{
                      lat: _geoloc.lat,
                      lng: _geoloc.lng,
                    }}
                    icon={createCustomPinIcon(pinColor)} // Apply custom-colored pin
                    title={result?.name || `Location ${index + 1}`}
                    onClick={() => setSelectedMarker(result)}
                  />
                );
              })}
            </GoogleMap>
            {selectedMarker && (
              <div
                style={{
                  marginTop: '15px',
                  padding: '10px',
                  border: '1px solid #ccc',
                  borderRadius: '8px',
                  background: '#fff',
                }}
              >
                <h3>{selectedMarker?.name || 'Location'}</h3>
                <p>
                  <strong>{t('address')}:</strong>{' '}
                  {selectedMarker?.targetAddress || '-'}
                </p>
                <p>
                  <strong>{t('phone')}:</strong>{' '}
                  {selectedMarker?.targetPhone || '-'}
                </p>
              </div>
            )}
          </div>
        )}
    </div>
  );
};

export default SideExtra;
