import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { usePlacesStore } from '../store/usePlacesStore';
import { useLocationStore } from '../store/useLocationStore';

const SuggestButton = () => {
  const { t } = useTranslation();
  const { places } = usePlacesStore();
  const { location, manualCity } = useLocationStore();
  const [suggestedPlace, setSuggestedPlace] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleSuggest = () => {
    if (places.length === 0) return;

    setIsAnimating(true);
    
    setTimeout(() => {
      const highlyRatedPlaces = places.filter(place => place.rating >= 4.0);
      const placesToChooseFrom = highlyRatedPlaces.length > 0 ? highlyRatedPlaces : places;
      const randomIndex = Math.floor(Math.random() * placesToChooseFrom.length);
      setSuggestedPlace(placesToChooseFrom[randomIndex]);
      setIsAnimating(false);
    }, 500);
  };

  const getDirectionsUrl = () => {
    if (!suggestedPlace) return '#';
    const userLocation = location || manualCity;
    const origin = userLocation ? `${userLocation.lat},${userLocation.lng}` : '';
    const destination = `${suggestedPlace.lat},${suggestedPlace.lng}`;
    return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}`;
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <button
        onClick={handleSuggest}
        disabled={places.length === 0}
        className={`btn btn-lg btn-primary btn-wide gap-2 ${isAnimating ? 'animate-pulse' : ''}`}
      >
        <span className="text-2xl">🎯</span>
        {t('suggest.button')}
      </button>

      {suggestedPlace && (
        <div className="card bg-base-200 shadow-xl w-full max-w-md animate-fade-in">
          <div className="card-body">
            <h3 className="card-title text-lg">
              <span className="text-2xl">✨</span>
              {t('suggest.randomSuggestion')}
            </h3>
            
            <div className="flex gap-4 items-center">
              <img
                src={suggestedPlace.photo || 'https://via.placeholder.com/100x100?text=No+Photo'}
                alt={suggestedPlace.name}
                className="w-24 h-24 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h4 className="font-bold text-xl">{suggestedPlace.name}</h4>
                <div className="flex items-center gap-1 text-sm text-yellow-500">
                  <span>★</span>
                  <span>{suggestedPlace.rating}</span>
                </div>
                <p className="text-sm text-base-content/70">{suggestedPlace.city}</p>
              </div>
            </div>

            <div className="card-actions justify-end">
              <a
                href={getDirectionsUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                {t('place.getDirections')}
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuggestButton;
