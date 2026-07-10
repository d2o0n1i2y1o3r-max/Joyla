import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTiltEffect } from '../hooks/useTiltEffect';
import { useFavoritesStore } from '../store/useFavoritesStore';
import { useLocationStore } from '../store/useLocationStore';
import VehicleAccessBadge from './VehicleAccessBadge';
import SeasonalBadge from './SeasonalBadge';

const FamilyCard = ({ place }) => {
  const { t } = useTranslation();
  const { cardRef, transform } = useTiltEffect(15);
  const { addFavorite, removeFavorite, isFavorite } = useFavoritesStore();
  const { location, manualCity } = useLocationStore();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const userLocation = location || manualCity;
  const distance = (
    userLocation
      ? calculateDistance(userLocation.lat, userLocation.lng, place.location.lat, place.location.lng)
      : null
  );

  const handleFavoriteToggle = (e) => {
    e.stopPropagation();
    const favoriteData = {
      id: place.id,
      name: place.name,
      type: 'family',
      photo: place.photos[0],
      city: place.city,
      location: place.location,
    };
    if (isFavorite(place.id)) {
      removeFavorite(place.id);
    } else {
      addFavorite(favoriteData);
    }
  };

  const getDirectionsUrl = () => {
    const origin = userLocation ? `${userLocation.lat},${userLocation.lng}` : '';
    const destination = `${place.location.lat},${place.location.lng}`;
    return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}`;
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span className="text-sm">{place.name}</span>
              </div>
            </div>
          ) : (
            <img
              src={place.photos[0]}
              alt={place.name}
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
            {isFavorite(place.id) ? (
              <svg className="w-5 h-5 fill-red-500" viewBox="0 0 20 20">
                <path d="M10 3.22l-.61-.6a5.5 5.5 0 00-7.78 7.77l1.06 1.06L10 18.78l7.33-7.33 1.06-1.06a5.5 5.5 0 00-7.78-7.77l-.61.61z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 fill-gray-400" viewBox="0 0 20 20">
                <path d="M10 3.22l-.61-.6a5.5 5.5 0 00-7.78 7.77l1.06 1.06L10 18.78l7.33-7.33 1.06-1.06a5.5 5.5 0 00-7.78-7.77l-.61.61z" />
              </svg>
            )}
          </button>
          <div className="absolute bottom-2 left-2 flex flex-col gap-1">
            {place.picnicSpot && (
              <div className="badge badge-success badge-sm gap-1">
                <span>🧺</span>
                <span>Piknik joyi</span>
              </div>
            )}
            <SeasonalBadge bestSeason={place.bestSeason} />
          </div>
        </figure>

        <div className="card-body p-4">
          <h3 className="card-title text-lg font-bold">{place.name}</h3>
          
          <div className="flex items-center gap-1 text-sm text-base-content/70">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            </svg>
            <span>{place.city}</span>
          </div>

          {distance && (
            <div className="flex items-center gap-1 text-sm text-base-content/70">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
              <span>{distance.toFixed(1)} km</span>
            </div>
          )}

          <div className="mt-2">
            <VehicleAccessBadge vehicleAccess={place.vehicleAccess} />
          </div>

          <p className="text-sm text-base-content/70 line-clamp-2">{place.description}</p>

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

export default FamilyCard;
