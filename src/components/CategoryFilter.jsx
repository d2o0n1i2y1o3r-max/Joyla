import { useTranslation } from 'react-i18next';
import { usePlacesStore } from '../store/usePlacesStore';

const CATEGORIES = [
  { id: 'all', icon: '🌍', color: 'neutral' },
  { id: 'nature', icon: '🌳', color: 'success' },
  { id: 'wellness', icon: '♨️', color: 'secondary' },
  { id: 'historical', icon: '🏛️', color: 'warning' },
  { id: 'restaurants', icon: '🍽️', color: 'error' },
  { id: 'entertainment', icon: '🎭', color: 'info' },
];

const CategoryFilter = () => {
  const { t } = useTranslation();
  const { selectedCategory, filterByCategory, places } = usePlacesStore();

  const handleCategoryChange = (category) => {
    filterByCategory(category);
  };

  return (
    <div className="flex flex-wrap gap-2 justify-center p-4">
      {CATEGORIES.map((category) => (
        <button
          key={category.id}
          onClick={() => handleCategoryChange(category.id)}
          className={`badge badge-lg gap-2 cursor-pointer transition-all hover:scale-105 ${
            selectedCategory === category.id
              ? `badge-${category.color} badge-outline`
              : 'badge-ghost'
          }`}
        >
          <span className="text-xl">{category.icon}</span>
          <span>{t(`categories.${category.id}`)}</span>
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;
