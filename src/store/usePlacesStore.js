import { create } from 'zustand';

export const usePlacesStore = create((set) => ({
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
  filterByCategory: (category, places) => {
    if (category === 'all') {
      set({ filteredPlaces: places, selectedCategory: category });
    } else {
      set({ 
        filteredPlaces: places.filter(place => place.category === category),
        selectedCategory: category 
      });
    }
  },
  searchPlaces: (query, places) => {
    const filtered = places.filter(place =>
      place.name.toLowerCase().includes(query.toLowerCase()) ||
      place.city.toLowerCase().includes(query.toLowerCase())
    );
    set({ filteredPlaces });
  },
}));
