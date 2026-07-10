import { create } from 'zustand';

const applyFilters = (places, category, query) => {
  let filtered = places;
  
  // Apply category filter
  if (category !== 'all') {
    filtered = filtered.filter(place => place.category === category);
  }
  
  // Apply search filter
  if (query.trim()) {
    const q = query.toLowerCase();
    filtered = filtered.filter(place =>
      place.name.toLowerCase().includes(q) ||
      place.city.toLowerCase().includes(q)
    );
  }
  
  console.log('[Store] applyFilters - category:', category, 'query:', query, 'result count:', filtered.length);
  return filtered;
};

export const usePlacesStore = create((set, get) => ({
  places: [],
  filteredPlaces: [],
  selectedCategory: 'all',
  searchQuery: '',
  isLoading: false,
  error: null,
  
  setPlaces: (places) => set({ places, filteredPlaces: places }),
  setFilteredPlaces: (filteredPlaces) => set({ filteredPlaces }),
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  filterByCategory: (category) => {
    const { places, searchQuery } = get();
    const filtered = applyFilters(places, category, searchQuery);
    set({ selectedCategory: category, filteredPlaces: filtered });
  },
  searchPlaces: (query) => {
    const { places, selectedCategory } = get();
    console.log('[Store] searchPlaces called with query:', query);
    console.log('[Store] selectedCategory:', selectedCategory);
    console.log('[Store] places count:', places.length);
    
    const filtered = applyFilters(places, selectedCategory, query);
    set({ searchQuery: query, filteredPlaces: filtered });
  },
}));
