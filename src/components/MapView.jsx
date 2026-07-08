import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { usePlacesStore } from '../store/usePlacesStore';
import { useLocationStore } from '../store/useLocationStore';

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const createCustomIcon = (emoji, isNearest = false) => {
  const size = isNearest ? 36 : 30;
  const fontSize = isNearest ? 32 : 24;
  const pulseAnimation = isNearest ? `
    @keyframes pulse {
      0% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.2); opacity: 0.7; }
      100% { transform: scale(1); opacity: 1; }
    }
    animation: pulse 2s ease-in-out infinite;
  ` : '';
  
  const backgroundColor = isNearest ? '#6D28D9' : 'transparent';
  const borderRadius = isNearest ? '50%' : '0';
  const padding = isNearest ? '4px' : '0';

  return L.divIcon({
    html: `<div style="
      font-size: ${fontSize}px;
      ${pulseAnimation}
      background-color: ${backgroundColor};
      border-radius: ${borderRadius};
      padding: ${padding};
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: ${isNearest ? '0 0 20px rgba(109, 40, 217, 0.6)' : 'none'};
    ">${emoji}</div>`,
    className: 'custom-marker',
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
  });
};

const categoryIcons = {
  nature: '🌳',
  historical: '🏛️',
  restaurants: '🍽️',
  entertainment: '🎭',
};

const MapView = () => {
  const { filteredPlaces } = usePlacesStore();
  const { location, manualCity } = useLocationStore();
  const [mapCenter, setMapCenter] = useState([41.2995, 69.2401]);
  const mapRef = useRef(null);

  useEffect(() => {
    if (location) {
      setMapCenter([location.lat, location.lng]);
    } else if (manualCity) {
      setMapCenter([manualCity.lat, manualCity.lng]);
    }
  }, [location, manualCity]);

  useEffect(() => {
    if (mapRef.current && filteredPlaces.length > 0) {
      const bounds = L.latLngBounds(
        filteredPlaces.map(place => [place.lat, place.lng])
      );
      mapRef.current.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [filteredPlaces]);

  const MapController = () => {
    const map = useMap();
    
    useEffect(() => {
      if (location || manualCity) {
        const center = location || manualCity;
        map.setView([center.lat, center.lng], 13);
      }
    }, [location, manualCity, map]);

    return null;
  };

  const userLocation = location || manualCity;
  
  // Calculate distances and find nearest place
  const placesWithDistance = filteredPlaces.map(place => ({
    ...place,
    distance: userLocation 
      ? calculateDistance(userLocation.lat, userLocation.lng, place.lat, place.lng)
      : Infinity
  }));

  const sortedPlaces = [...placesWithDistance].sort((a, b) => a.distance - b.distance);
  const nearestPlaceId = sortedPlaces[0]?.id;

  return (
    <div className="w-full h-[600px] rounded-lg overflow-hidden shadow-lg">
      <MapContainer
        center={mapCenter}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapController />

        {location && (
          <Marker
            position={[location.lat, location.lng]}
            icon={createCustomIcon('📍')}
          >
            <Popup>
              <div className="text-sm font-medium">Your Location</div>
            </Popup>
          </Marker>
        )}

        {manualCity && !location && (
          <Marker
            position={[manualCity.lat, manualCity.lng]}
            icon={createCustomIcon('📍')}
          >
            <Popup>
              <div className="text-sm font-medium">{manualCity.name}</div>
            </Popup>
          </Marker>
        )}

        {sortedPlaces.map((place) => (
          <Marker
            key={place.id}
            position={[place.lat, place.lng]}
            icon={createCustomIcon(categoryIcons[place.category] || '📍', place.id === nearestPlaceId)}
          >
            <Popup>
              <div className="p-2 min-w-[200px]">
                {place.id === nearestPlaceId && (
                  <div className="badge badge-primary badge-sm mb-2">Nearest</div>
                )}
                <img
                  src={place.photo || 'https://via.placeholder.com/200x150?text=No+Photo'}
                  alt={place.name}
                  className="w-full h-32 object-cover rounded mb-2"
                />
                <h3 className="font-bold text-lg">{place.name}</h3>
                <div className="flex items-center gap-1 text-sm">
                  <span className="text-yellow-500">★</span>
                  <span>{place.rating}</span>
                </div>
                {place.distance < Infinity && (
                  <div className="text-sm text-base-content/70 mt-1">
                    {place.distance < 1 
                      ? `${(place.distance * 1000).toFixed(0)} m away`
                      : `${place.distance.toFixed(1)} km away`}
                  </div>
                )}
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-sm btn-primary mt-2 w-full"
                >
                  Get Directions
                </a>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapView;
