import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTiltEffect } from '../hooks/useTiltEffect';
import { useFavoritesStore } from '../store/useFavoritesStore';
import { useLocationStore } from '../store/useLocationStore';

const DachaCard = ({ dacha }) => {
  const { t } = useTranslation();
  const { cardRef, transform } = useTiltEffect(15);
  const { addFavorite, removeFavorite, isFavorite } = useFavoritesStore();
  const { location, manualCity } = useLocationStore();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const userLocation = location || manualCity;
  const distance = (
    userLocation
      ? calculateDistance(userLocation.lat, userLocation.lng, dacha.location.lat, dacha.location.lng)
      : null
  );

  const handleFavoriteToggle = (e) => {
    e.stopPropagation();
    const favoriteData = {
      id: dacha.id,
      name: dacha.name,
      type: 'dacha',
      photo: dacha.photos[0],
      region: dacha.region,
      pricePerNight: dacha.pricePerNight,
      capacity: dacha.capacity,
      location: dacha.location,
    };
    if (isFavorite(dacha.id)) {
      removeFavorite(dacha.id);
    } else {
      addFavorite(favoriteData);
    }
  };

  const getDirectionsUrl = () => {
    const origin = userLocation ? `${userLocation.lat},${userLocation.lng}` : '';
    const destination = `${dacha.location.lat},${dacha.location.lng}`;
    return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}`;
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('uz-UZ').format(price);
  };

  const getAmenityIcon = (amenity) => {
    const icons = {
      pool: '🏊',
      sauna: '♨️',
      barbecue: '🍖',
      wifi: '📶',
      parking: '🅿️',
      garden: '🌳',
      kitchen: '🍳',
      terrace: '🌅',
      mountain_view: '⛰️',
      farm: '🚜',
    };
    return icons[amenity] || '✨';
  };

  return (
    <div
      ref={cardRef}
      className="tilt-card w-full"
      style={{
        transform: `perspective(1000px) rotateX(${transform.rotateX}deg) rotateY(${transform.rotateY}deg) scale(${transform.scale})`,
      }}
    >
      <div className="tilt-card-inner card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300">
        <figure className="relative h-48 overflow-hidden">
          {!imageLoaded && !imageError && (
            <div className="absolute inset-0 bg-base-300 animate-pulse" />
          )}
          {imageError ? (
            <div className="w-full h-full flex items-center justify-center bg-base-300 text-base-content/50">
              <div className="text-center">
                <svg className="w-12 h-12 mx-auto mb-2 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span className="text-sm">{dacha.name}</span>
              </div>
            </div>
          ) : (
            <img
              src={dacha.photos[0]}
              alt={dacha.name}
              className={`w-full h-full object-cover transition-transform duration-300 hover:scale-110 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
              loading="lazy"
            />
          )}
          <button
            onClick={handleFavoriteToggle}
            className="absolute top-2 right-2 btn btn-circle btn-sm btn-ghost bg-base-100/80 backdrop-blur-sm hover:bg-base-100"
          >
            {isFavorite(dacha.id) ? (
              <svg className="w-5 h-5 fill-red-500" viewBox="0 0 20 20">
                <path d="M10 3.22l-.61-.6a5.5 5.5 0 00-7.78 7.77l1.06 1.06L10 18.78l7.33-7.33 1.06-1.06a5.5 5.5 0 00-7.78-7.77l-.61.61z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 fill-gray-400" viewBox="0 0 20 20">
                <path d="M10 3.22l-.61-.6a5.5 5.5 0 00-7.78 7.77l1.06 1.06L10 18.78l7.33-7.33 1.06-1.06a5.5 5.5 0 00-7.78-7.77l-.61.61z" />
              </svg>
            )}
          </button>
          <div className="absolute bottom-2 left-2">
            <div className="badge badge-primary badge-sm">{dacha.region}</div>
          </div>
        </figure>

        <div className="card-body p-4">
          <h3 className="card-title text-lg font-bold">{dacha.name}</h3>
          
          <div className="flex items-center gap-2 text-sm">
            <span className="font-semibold text-primary">
              {formatPrice(dacha.pricePerNight)} so'm/kecha
            </span>
          </div>

          <div className="flex items-center gap-1 text-sm text-base-content/70">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span>{dacha.capacity} kishi</span>
          </div>

          {distance && (
            <div className="flex items-center gap-1 text-sm text-base-content/70">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
              <span>{distance.toFixed(1)} km</span>
            </div>
          )}

          <div className="flex flex-wrap gap-1 mt-2">
            {dacha.amenities.slice(0, 3).map((amenity) => (
              <div key={amenity} className="badge badge-outline badge-sm gap-1">
                <span>{getAmenityIcon(amenity)}</span>
                <span className="capitalize">{amenity}</span>
              </div>
            ))}
            {dacha.amenities.length > 3 && (
              <div className="badge badge-ghost badge-sm">+{dacha.amenities.length - 3}</div>
            )}
          </div>

          <div className="card-actions justify-end mt-2">
            <a
              href={getDirectionsUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-sm btn-primary"
            >
              {t('place.getDirections')}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

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

export default DachaCard;
