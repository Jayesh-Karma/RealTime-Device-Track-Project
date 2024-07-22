import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useGeolocated } from 'react-geolocated';
import io from 'socket.io-client';

const socket = io('http://localhost:4000/');

const ComponentMap = () => {
  const [location, setLocation] = useState();
  const [permission, setPermission] = useState(false);
  const [userLocations, setUserLocations] = useState([]);

  const { coords, isGeolocationAvailable, isGeolocationEnabled } = useGeolocated({
    positionOptions: {
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout: 5000,
    },
    userDecisionTimeout: null,
    geolocationProvider: navigator.geolocation,
    isOptimisticGeolocationEnabled: true,
    watchLocationPermissionChange: false,
  });

  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation([latitude, longitude]);
        setPermission(true);
        socket.emit('send-location', {
          latitude,
          longitude,
        });
      },
      (error) => {
        console.error(error);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 5000,
      }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  useEffect(() => {
    socket.on('receive-location', (data) => {
      setUserLocations((prevLocations) => {
        const updatedLocations = prevLocations.filter((loc) => loc.id !== data.id);
        updatedLocations.push(data);
        return updatedLocations;
      });
    });

    socket.on('user-disconnected', (data) => {
      setUserLocations((prevLocations) => prevLocations.filter((loc) => loc.id !== data.id));
    });

    return () => {
      socket.off('receive-location');
      socket.off('user-disconnected');
    };
  }, []);

  if (!isGeolocationAvailable) {
    return <div>Geolocation is not available in your browser.</div>;
  }

  if (!isGeolocationEnabled) {
    return <div>Geolocation is not enabled.</div>;
  }

  return (
    <div className='mapContain'>
      {permission ? (
        <MapContainer
          center={location}
          zoom={13}
          maxZoom={20}
          scrollWheelZoom={true}
          style={{ height: '80vh', width: '80%' }}
        >
          <TileLayer
            attribution='Device Tracker Dummy'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={location}>
            <Popup>
              You are here. <br /> Easily customizable.
            </Popup>
          </Marker>
          {userLocations.map((userLocation) => (
            <Marker key={userLocation.id} position={[userLocation.latitude, userLocation.longitude]}>
              <Popup>
                User {userLocation.id.substring(0,2)} is here.
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      ) : (
        <div>Requesting location...</div>
      )}
    </div>
  );
};

export default ComponentMap;
