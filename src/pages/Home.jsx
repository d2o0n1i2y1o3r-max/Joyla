import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import LocationDetector from '../components/LocationDetector';
import CategoryFilter from '../components/CategoryFilter';
import PlaceList from '../components/PlaceList';
import MapView from '../components/MapView';
import SearchBar from '../components/SearchBar';
import SuggestButton from '../components/SuggestButton';
import OnboardingTour from '../components/OnboardingTour';
import TelegramLoginButton from '../components/TelegramLoginButton';
import { usePlacesStore } from '../store/usePlacesStore';
import { useAuthStore } from '../store/useAuthStore';
import { mockPlaces } from '../data/mockPlaces';
import '../i18n';

const Home = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { setPlaces, filteredPlaces } = usePlacesStore();
  const { isAuthenticated, user, logout } = useAuthStore();
  const [viewMode, setViewMode] = useState('list');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    setPlaces(mockPlaces);
  }, [setPlaces]);

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

  const handleLogout = () => {
    logout();
    setShowLoginModal(false);
  };

  return (
    <div className="min-h-screen bg-base-100">
      <OnboardingTour />
      
      {/* Header */}
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
              <li>
                <a onClick={() => navigate('/')}>{t('nav.home')}</a>
              </li>
              <li>
                <a onClick={() => navigate('/dachas')}>{t('nav.dachas')}</a>
              </li>
              <li>
                <a onClick={() => navigate('/family')}>{t('nav.family')}</a>
              </li>
              <li>
                <a onClick={() => navigate('/favorites')}>{t('nav.favorites')}</a>
              </li>
              <li>
                <a onClick={() => navigate('/about')}>{t('nav.about')}</a>
              </li>
            </ul>
          </div>
          <a className="btn btn-ghost text-xl gap-2">
            <img src="/logo.svg" alt="Joyla Logo" className="w-8 h-8" />
            <span className="font-bold">{t('app.name')}</span>
          </a>
        </div>

        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">
            <li>
              <a onClick={() => navigate('/')} className="font-medium">
                {t('nav.home')}
              </a>
            </li>
            <li>
              <a onClick={() => navigate('/dachas')} className="font-medium">
                {t('nav.dachas')}
              </a>
            </li>
            <li>
              <a onClick={() => navigate('/family')} className="font-medium">
                {t('nav.family')}
              </a>
            </li>
            <li>
              <a onClick={() => navigate('/favorites')} className="font-medium">
                {t('nav.favorites')}
              </a>
            </li>
            <li>
              <a onClick={() => navigate('/about')} className="font-medium">
                {t('nav.about')}
              </a>
            </li>
          </ul>
        </div>

        <div className="navbar-end gap-2">
          <button
            onClick={toggleLanguage}
            className="btn btn-ghost btn-sm"
            title="Toggle Language"
          >
            {i18n.language === 'uz' ? '🇺🇿 UZ' : i18n.language === 'ru' ? '🇷🇺 RU' : '🇬🇧 EN'}
          </button>

          <button
            onClick={toggleTheme}
            className="btn btn-ghost btn-sm"
            title="Toggle Theme"
          >
            {isDarkMode ? '☀️' : '🌙'}
          </button>

          {isAuthenticated ? (
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar"
              >
                <div className="w-10 rounded-full">
                  {user?.photoUrl ? (
                    <img alt="User" src={user.photoUrl} />
                  ) : (
                    <div className="flex items-center justify-center h-full bg-primary text-primary-content">
                      {user?.firstName?.[0] || 'U'}
                    </div>
                  )}
                </div>
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
              >
                <li className="menu-title">{user?.firstName || 'User'}</li>
                <li>
                  <a onClick={handleLogout}>{t('auth.logout')}</a>
                </li>
              </ul>
            </div>
          ) : (
            <button
              onClick={() => setShowLoginModal(true)}
              className="btn btn-primary btn-sm"
            >
              {t('auth.loginWithTelegram')}
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">{t('app.name')}</h1>
          <p className="text-base-content/70">{t('app.tagline')}</p>
        </div>

        {/* Location Detector */}
        <LocationDetector />

        {/* Search Bar */}
        <SearchBar />

        {/* Category Filter */}
        <div className="category-filter">
          <CategoryFilter />
        </div>

        {/* View Toggle */}
        <div className="flex justify-center mb-6">
          <div className="join" id="view-toggle">
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
              List
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
              Map
            </button>
          </div>
        </div>

        {/* Content Area */}
        {viewMode === 'list' ? (
          <div className="place-card">
            <PlaceList />
          </div>
        ) : (
          <MapView />
        )}

        {/* Suggest Button */}
        <div className="mt-8">
          <SuggestButton />
        </div>
      </main>

      {/* Login Modal */}
      {showLoginModal && (
        <dialog className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">{t('auth.loginWithTelegram')}</h3>
            <TelegramLoginButton
              botUsername="your_bot_username"
              onAuthSuccess={() => setShowLoginModal(false)}
            />
            <div className="modal-action">
              <button
                onClick={() => setShowLoginModal(false)}
                className="btn"
              >
                Close
              </button>
            </div>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button onClick={() => setShowLoginModal(false)}>close</button>
          </form>
        </dialog>
      )}

      {/* Footer */}
      <footer className="footer footer-center p-4 bg-base-200 text-base-content">
        <aside>
          <p className="font-medium">
            {t('app.name')} © 2024 - Made with ❤️ for Uzbekistan
          </p>
        </aside>
      </footer>
    </div>
  );
};

export default Home;
