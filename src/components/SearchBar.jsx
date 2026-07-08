import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { usePlacesStore } from '../store/usePlacesStore';

const SearchBar = () => {
  const { t } = useTranslation();
  const { searchPlaces } = usePlacesStore();
  const [query, setQuery] = useState('');

  const handleSearch = (e) => {
    const value = e.target.value;
    setQuery(value);
    searchPlaces(value);
  };

  const handleClear = () => {
    setQuery('');
    searchPlaces('');
  };

  const handleSearchSubmit = () => {
    searchPlaces(query);
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <div className="join w-full">
        <input
          type="text"
          placeholder={t('search.placeholder')}
          value={query}
          onChange={handleSearch}
          className="input input-bordered join-item w-full"
          id="search-input"
        />
        {query && (
          <button
            onClick={handleClear}
            className="btn btn-neutral join-item"
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
        <button onClick={handleSearchSubmit} className="btn btn-primary join-item">
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
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
