import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import PlaceCard from '../components/PlaceCard';
import { useFavoritesStore } from '../store/useFavoritesStore';

const Favorites = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { favorites } = useFavoritesStore();
  const [isDarkMode, setIsDarkMode] = useState(false);

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

  return (
    <div className="min-h-screen bg-base-100">
      {/* Header */}
      <header className="navbar bg-base-200 shadow-lg sticky top-0 z-50">
        <div className="navbar-start">
          <button
            onClick={() => navigate('/')}
            className="btn btn-ghost"
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
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
          </button>
          <a className="btn btn-ghost text-xl">
            <span className="text-2xl">⭐</span>
            <span className="font-bold">{t('nav.favorites')}</span>
          </a>
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

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">{t('nav.favorites')}</h1>
          <p className="text-base-content/70">
            Your saved places
          </p>
        </div>

        {favorites.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">⭐</div>
            <h3 className="text-xl font-semibold mb-2">{t('favorites.empty')}</h3>
            <p className="text-base-content/70 mb-4">{t('favorites.emptyMessage')}</p>
            <button
              onClick={() => navigate('/')}
              className="btn btn-primary"
            >
              Explore Places
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favorites.map((place) => (
              <PlaceCard key={place.id} place={place} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Favorites;
