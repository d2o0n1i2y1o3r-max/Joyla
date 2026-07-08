import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTiltEffect } from '../hooks/useTiltEffect';
import { useFavoritesStore } from '../store/useFavoritesStore';
import { useLocationStore } from '../store/useLocationStore';

const PlaceCard = ({ place, isNearest = false }) => {
  const { t } = useTranslation();
  const { cardRef, transform } = useTiltEffect(15);
  const { addFavorite, removeFavorite, isFavorite } = useFavoritesStore();
  const { location, manualCity } = useLocationStore();
  const [imageLoaded, setImageLoaded] = useState(false);

  const userLocation = location || manualCity;
  const distance = place.distance !== undefined ? place.distance : (
    userLocation
      ? calculateDistance(userLocation.lat, userLocation.lng, place.lat, place.lng)
      : null
  );

  const handleFavoriteToggle = (e) => {
    e.stopPropagation();
    if (isFavorite(place.id)) {
      removeFavorite(place.id);
    } else {
      addFavorite(place);
    }
  };

  const getDirectionsUrl = () => {
    const origin = userLocation ? `${userLocation.lat},${userLocation.lng}` : '';
    const destination = `${place.lat},${place.lng}`;
    return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}`;
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <svg key={i} className="w-4 h-4 fill-yellow-400" viewBox="0 0 20 20">
          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
        </svg>
      );
    }

    if (hasHalfStar) {
      stars.push(
        <svg key="half" className="w-4 h-4 fill-yellow-400" viewBox="0 0 20 20">
          <defs>
            <linearGradient id="half">
              <stop offset="50%" stopColor="currentColor" />
              <stop offset="50%" stopColor="#e5e7eb" />
            </linearGradient>
          </defs>
          <path fill="url(#half)" d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
        </svg>
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <svg key={`empty-${i}`} className="w-4 h-4 fill-gray-300" viewBox="0 0 20 20">
          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
        </svg>
      );
    }

    return stars;
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
          {!imageLoaded && (
            <div className="absolute inset-0 bg-base-300 animate-pulse" />
          )}
          <img
            src={place.photo || 'https://via.placeholder.com/400x300?text=No+Photo'}
            alt={place.name}
            className={`w-full h-full object-cover transition-transform duration-300 hover:scale-110 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
            loading="lazy"
          />
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
            {isNearest && (
              <div className="badge badge-primary badge-sm">Nearest</div>
            )}
            <div className="badge badge-neutral gap-1">
              {place.category === 'nature' && '🌳'}
              {place.category === 'historical' && '🏛️'}
              {place.category === 'restaurants' && '🍽️'}
              {place.category === 'entertainment' && '🎭'}
            </div>
          </div>
        </figure>

        <div className="card-body p-4">
          <h3 className="card-title text-lg font-bold">{place.name}</h3>
          
          <div className="flex items-center gap-2 text-sm">
            <div className="flex gap-0.5">{renderStars(place.rating)}</div>
            <span className="text-base-content/70">({place.rating})</span>
          </div>

          {distance && (
            <div className="flex items-center gap-1 text-sm text-base-content/70">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
              <span>{distance.toFixed(1)} km</span>
            </div>
          )}

          <div className="flex items-center gap-1 text-sm">
            {place.isOpen ? (
              <span className="badge badge-success badge-sm">{t('place.open')}</span>
            ) : (
              <span className="badge badge-error badge-sm">{t('place.closed')}</span>
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

export default PlaceCard;
