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
  apiPlaces: [], // Places from external API
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
    set({ selectedCategory: category, filteredPlaces: filtered, apiPlaces: [] });
  },
  searchPlaces: async (query) => {
    const { places, selectedCategory } = get();
    console.log('[Store] searchPlaces called with query:', query);
    console.log('[Store] selectedCategory:', selectedCategory);
    console.log('[Store] places count:', places.length);
    
    // First filter local places
    const filtered = applyFilters(places, selectedCategory, query);
    set({ searchQuery: query, filteredPlaces: filtered, apiPlaces: [] });
    
    // If local results are few (less than 3), fetch from API
    if (query.trim() && filtered.length < 3) {
      set({ isLoading: true });
      try {
        // Get user location for location bias
        const userLat = 41.2995; // Default to Tashkent
        const userLng = 69.2401;
        
        const response = await fetch(
          `/api/search/places?query=${encodeURIComponent(query)}&lat=${userLat}&lng=${userLng}`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch API results');
        }
        
        const data = await response.json();
        const apiPlaces = data.places || [];
        
        console.log('[Store] API places fetched:', apiPlaces.length);
        
        // Filter API places by category if needed
        let filteredApiPlaces = apiPlaces;
        if (selectedCategory !== 'all') {
          filteredApiPlaces = apiPlaces.filter(p => p.category === selectedCategory);
        }
        
        set({ apiPlaces: filteredApiPlaces, isLoading: false });
      } catch (error) {
        console.error('[Store] Error fetching API places:', error);
        set({ error: 'Failed to fetch additional results', isLoading: false });
      }
    }
  },
}));
