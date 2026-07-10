import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import DachaCard from '../components/DachaCard';
import DachaFilters from '../components/DachaFilters';
import MapView from '../components/MapView';
import useDachasStore from '../store/useDachasStore';
import dachasData from '../../server/dachas.json';

const Dachas = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { dachas, filteredDachas, setDachas } = useDachasStore();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [viewMode, setViewMode] = useState('list');

  useEffect(() => {
    setDachas(dachasData);
  }, [setDachas]);

  useEffect(() => {
    if (localStorage.getItem('theme') === 'dark') {
      setIsDarkMode(true);
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    const newTheme = isDarkMode ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const toggleLanguage = () => {
    const languages = ['uz', 'ru', 'en'];
    const currentIndex = languages.indexOf(i18n.language);
    const nextIndex = (currentIndex + 1) % languages.length;
    i18n.changeLanguage(languages[nextIndex]);
  };

  const displayDachas = filteredDachas.length > 0 ? filteredDachas : dachas;

  return (
    <div className="min-h-screen bg-base-100">
      <header className="navbar bg-base-200 shadow-lg sticky top-0 z-50">
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li><a onClick={() => navigate('/')}>{t('nav.home')}</a></li>
              <li><a onClick={() => navigate('/dachas')}>{t('nav.dachas')}</a></li>
              <li><a onClick={() => navigate('/family')}>{t('nav.family')}</a></li>
              <li><a onClick={() => navigate('/favorites')}>{t('nav.favorites')}</a></li>
              <li><a onClick={() => navigate('/about')}>{t('nav.about')}</a></li>
            </ul>
          </div>
          <a className="btn btn-ghost text-xl gap-2">
            <img src="/logo.svg" alt="Joylar Logo" className="w-8 h-8" />
            <span className="font-bold">{t('app.name')}</span>
          </a>
        </div>

        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">
            <li><a onClick={() => navigate('/')} className="font-medium">{t('nav.home')}</a></li>
            <li><a onClick={() => navigate('/dachas')} className="font-medium">{t('nav.dachas')}</a></li>
            <li><a onClick={() => navigate('/family')} className="font-medium">{t('nav.family')}</a></li>
            <li><a onClick={() => navigate('/favorites')} className="font-medium">{t('nav.favorites')}</a></li>
            <li><a onClick={() => navigate('/about')} className="font-medium">{t('nav.about')}</a></li>
          </ul>
        </div>

        <div className="navbar-end gap-2">
          <button onClick={toggleLanguage} className="btn btn-ghost btn-sm">
            {i18n.language === 'uz' ? '🇺🇿 UZ' : i18n.language === 'ru' ? '🇷🇺 RU' : '🇬🇧 EN'}
          </button>
          <button onClick={toggleTheme} className="btn btn-ghost btn-sm">
            {isDarkMode ? '☀️' : '🌙'}
          </button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">{t('nav.dachas')}</h1>
          <p className="text-base-content/70">O'zbekiston bo'ylab eng yaxshi dachalar</p>
        </div>

        <DachaFilters />

        <div className="flex justify-center mb-6">
          <div className="join">
            <button
              onClick={() => setViewMode('list')}
              className={`btn join-item ${viewMode === 'list' ? 'btn-active' : ''}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 10h16M4 14h16M4 18h16"
                />
              </svg>
              Ro'yxat
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`btn join-item ${viewMode === 'map' ? 'btn-active' : ''}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                />
              </svg>
              Xarita
            </button>
          </div>
        </div>

        {viewMode === 'list' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayDachas.map((dacha) => (
              <DachaCard key={dacha.id} dacha={dacha} />
            ))}
          </div>
        ) : (
          <MapView places={displayDachas.map(d => ({
            id: d.id,
            name: d.name,
            lat: d.location.lat,
            lng: d.location.lng,
            photo: d.photos[0],
            category: 'dacha',
            rating: 4.5,
            isOpen: true,
          }))} />
        )}

        {displayDachas.length === 0 && (
          <div className="text-center py-12">
            <p className="text-base-content/70 text-lg">Dachalar topilmadi</p>
            <p className="text-base-content/50 text-sm mt-2">Filterlarni o'zgartiring</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dachas;
