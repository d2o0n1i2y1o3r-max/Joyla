import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { usePlacesStore } from '../store/usePlacesStore';
import { useLocationStore } from '../store/useLocationStore';

const AiRecommendModal = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const { places } = usePlacesStore();
  const { location } = useLocationStore();
  const [step, setStep] = useState('initial'); // 'initial' | 'loading' | 'result'
  const [recommendation, setRecommendation] = useState(null);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleGetRecommendation = async () => {
    setStep('loading');
    setError(null);

    try {
      // Get user's coordinates
      const userLat = location?.lat || 41.2995; // Default to Tashkent
      const userLng = location?.lng || 69.2401;

      // Call backend API for AI recommendation
      const response = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lat: userLat,
          lng: userLng,
          places: places.map(p => ({
            id: p.id,
            name: p.name,
            category: p.category,
            city: p.city,
            rating: p.rating,
            bestSeason: p.bestSeason,
            isOpen: p.isOpen,
            lat: p.lat,
            lng: p.lng,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get recommendation');
      }

      const data = await response.json();
      setRecommendation(data);
      setStep('result');
    } catch (err) {
      setError(err.message);
      setStep('initial');
    }
  };

  const handleGetAnother = () => {
    setStep('initial');
    setRecommendation(null);
  };

  const getDirectionsUrl = () => {
    if (!recommendation || !recommendation.place) return '#';
    const userLocation = location;
    const origin = userLocation ? `${userLocation.lat},${userLocation.lng}` : '';
    const destination = `${recommendation.place.lat},${recommendation.place.lng}`;
    return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}`;
  };

  return (
    <dialog className="modal modal-open">
      <div className="modal-box max-w-2xl">
        {/* Close button */}
        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={onClose}>
          ✕
        </button>

        {/* Initial state: only one button */}
        {step === 'initial' && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="text-6xl mb-4">🤔</div>
            <h3 className="text-2xl font-bold mb-2">{t('suggest.title')}</h3>
            <p className="text-base-content/70 mb-8 text-center">
              Bugun qayerga borishni bilasizmi? Ob-havo va faslni hisobga olgan holda sizga eng yaxshi joyni tavsiya qilamiz.
            </p>
            <button
              onClick={handleGetRecommendation}
              className="btn btn-primary btn-lg btn-wide"
            >
              Qayerga borsam bo'ladi?
            </button>
            {error && (
              <div className="alert alert-error mt-4">
                <span>{error}</span>
              </div>
            )}
          </div>
        )}

        {/* Loading state */}
        {step === 'loading' && (
          <div className="flex flex-col items-center justify-center py-12">
            <span className="loading loading-spinner loading-lg text-primary"></span>
            <p className="mt-4 text-base-content/70">Ob-havo va ma'lumotlarni tekshiryapmiz...</p>
          </div>
        )}

        {/* Result state */}
        {step === 'result' && recommendation && (
          <div className="flex flex-col">
            {/* AI Reasoning */}
            <div className="alert alert-info mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span>{recommendation.reason}</span>
            </div>

            {/* Place Detail */}
            <div className="card bg-base-200 shadow-xl">
              <figure className="h-64 overflow-hidden">
                <img
                  src={recommendation.place.photo || 'https://via.placeholder.com/400x300?text=No+Photo'}
                  alt={recommendation.place.name}
                  className="w-full h-full object-cover"
                />
              </figure>
              <div className="card-body">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="card-title text-2xl">{recommendation.place.name}</h2>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="badge badge-primary">{t(`categories.${recommendation.place.category}`)}</span>
                      <div className="flex items-center gap-1 text-yellow-500">
                        <span>★</span>
                        <span className="font-bold">{recommendation.place.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 mt-4">
                  <p className="flex items-center gap-2">
                    <span className="text-xl">📍</span>
                    <span>{recommendation.place.city}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="text-xl">🕒</span>
                    <span>{recommendation.place.isOpen ? 'Ochiq' : 'Yopiq'}</span>
                  </p>
                </div>

                <div className="card-actions justify-end mt-6">
                  <button
                    onClick={handleGetAnother}
                    className="btn btn-outline"
                  >
                    Yana taklif ber
                  </button>
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
          </div>
        )}
      </div>
    </dialog>
  );
};

export default AiRecommendModal;
