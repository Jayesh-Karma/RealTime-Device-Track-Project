import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useGeolocated } from 'react-geolocated';

const ComponentMap = () => {
  const [location, setLocation] = useState([20.5937, 78.9629]); // Default to India coordinates
  const [permission, setPermission] = useState(false);

  const { coords, isGeolocationAvailable, isGeolocationEnabled, getCurrentPosition } = useGeolocated({
    positionOptions: {
      enableHighAccuracy: true,
    },
    userDecisionTimeout: 5000,
  });

  // Use useEffect to handle location updates
  useEffect(() => {
    if (coords) {
      setLocation([coords.latitude, coords.longitude]);
      setPermission(true);
    }
  }, [coords]);

  if (!isGeolocationAvailable) {
    return <div>Geolocation is not available in your browser.</div>;
  }

  if (!isGeolocationEnabled) {
    return <div>Geolocation is not enabled. Please enable it in your browser settings.</div>;
  }
  console.log(location)

  return (
    <div className='mapContain'>
      {permission ? (
        <MapContainer
          center={location}
          zoom={13}
          scrollWheelZoom={false}
          style={{ height: "80vh", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={location}>
            <Popup>
              You are here. <br /> Easily customizable.
            </Popup>
          </Marker>
        </MapContainer>
      ) : (
        <div>Requesting permission or location...</div>
      )}
    </div>
  );
}

export default ComponentMap;
