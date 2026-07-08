import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocationStore } from '../store/useLocationStore';

const UZBEKISTAN_CITIES = [
  { name: 'Toshkent', lat: 41.2995, lng: 69.2401 },
  { name: 'Samarqand', lat: 39.6542, lng: 66.9597 },
  { name: 'Buxoro', lat: 39.7747, lng: 64.4287 },
  { name: 'Farg\'ona', lat: 40.3777, lng: 71.7845 },
  { name: 'Namangan', lat: 40.9983, lng: 71.6726 },
  { name: 'Andijon', lat: 40.7821, lng: 72.3442 },
  { name: 'Qarshi', lat: 38.8608, lng: 65.7896 },
  { name: 'Nukus', lat: 42.4531, lng: 59.6103 },
  { name: 'Xiva', lat: 41.3783, lng: 60.3636 },
  { name: 'Termiz', lat: 37.2242, lng: 67.2783 },
  { name: 'Jizzax', lat: 40.1156, lng: 67.6422 },
  { name: 'Guliston', lat: 40.4819, lng: 68.7878 },
  { name: 'Navoiy', lat: 40.1194, lng: 65.3739 },
  { name: 'Urganch', lat: 41.5517, lng: 60.6336 },
  { name: 'Marg\'ilon', lat: 40.4189, lng: 71.7281 },
  { name: 'Qo\'qon', lat: 40.5283, lng: 70.9425 },
  { name: 'Chirchiq', lat: 41.5706, lng: 69.5703 },
  { name: 'Angren', lat: 41.0167, lng: 70.1439 },
  { name: 'Bekobod', lat: 40.2167, lng: 69.2667 },
  { name: 'Olmaliq', lat: 40.8333, lng: 69.6167 },
];

const LocationDetector = () => {
  const { t } = useTranslation();
  const { location, manualCity, isLoading, setLocation, setManualCity, setLoading, setError } = useLocationStore();
  const [selectedCity, setSelectedCity] = useState('');

  useEffect(() => {
    if (!location && !manualCity) {
      detectLocation();
    }
  }, []);

  const detectLocation = () => {
    setLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ lat: latitude, lng: longitude });
        setLoading(false);
      },
      (error) => {
        console.error('Geolocation error:', error);
        setError(error.message);
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const handleCityChange = (e) => {
    const cityName = e.target.value;
    setSelectedCity(cityName);
    
    if (cityName) {
      const city = UZBEKISTAN_CITIES.find(c => c.name === cityName);
      if (city) {
        setManualCity({ lat: city.lat, lng: city.lng, name: city.name });
      }
    } else {
      setManualCity(null);
    }
  };

  const currentLocationText = location 
    ? `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`
    : manualCity 
    ? manualCity.name 
    : t('location.detecting');

  return (
    <div className="flex flex-col sm:flex-row gap-3 items-center justify-center p-4 bg-base-200 rounded-lg">
      <div className="flex items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-primary"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
        <span className="text-sm font-medium">{t('location.currentLocation')}:</span>
        <span className="text-sm text-base-content/70">
          {isLoading ? (
            <span className="loading loading-spinner loading-xs"></span>
          ) : (
            currentLocationText
          )}
        </span>
      </div>

      <div className="flex gap-2">
        <button
          onClick={detectLocation}
          className="btn btn-sm btn-primary"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="loading loading-spinner loading-xs"></span>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          )}
        </button>

        <select
          value={selectedCity}
          onChange={handleCityChange}
          className="select select-sm select-bordered"
        >
          <option value="">{t('location.selectCity')}</option>
          {UZBEKISTAN_CITIES.map((city) => (
            <option key={city.name} value={city.name}>
              {city.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default LocationDetector;
