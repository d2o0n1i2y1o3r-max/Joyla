import { create } from 'zustand';

export const usePlacesStore = create((set, get) => ({
  places: [],
  filteredPlaces: [],
  selectedCategory: 'all',
  isLoading: false,
  error: null,
  
  setPlaces: (places) => set({ places, filteredPlaces: places }),
  setFilteredPlaces: (filteredPlaces) => set({ filteredPlaces }),
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  filterByCategory: (category) => {
    const { places } = get();
    if (category === 'all') {
      set({ filteredPlaces: places, selectedCategory: category });
    } else {
      set({ 
        filteredPlaces: places.filter(place => place.category === category),
        selectedCategory: category 
      });
    }
  },
  searchPlaces: (query) => {
    const { places } = get();
    console.log('[Store] searchPlaces called with query:', query);
    console.log('[Store] places count:', places.length);
    
    if (!query.trim()) {
      set({ filteredPlaces: places });
      return;
    }
    
    const filtered = places.filter(place =>
      place.name.toLowerCase().includes(query.toLowerCase()) ||
      place.city.toLowerCase().includes(query.toLowerCase())
    );
    console.log('[Store] filtered count:', filtered.length);
    set({ filteredPlaces });
  },
}));
