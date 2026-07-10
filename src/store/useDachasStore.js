import { create } from 'zustand';

const useDachasStore = create((set) => ({
  dachas: [],
  filteredDachas: [],
  filters: {
    region: '',
    minPrice: 0,
    maxPrice: 10000000,
    minCapacity: 0,
    amenities: [],
  },

  setDachas: (dachas) => set({ dachas, filteredDachas: dachas }),

  setFilters: (newFilters) =>
    set((state) => {
      const updatedFilters = { ...state.filters, ...newFilters };
      const filtered = state.dachas.filter((dacha) => {
        const matchesRegion =
          !updatedFilters.region || dacha.region === updatedFilters.region;
        const matchesPrice =
          dacha.pricePerNight >= updatedFilters.minPrice &&
          dacha.pricePerNight <= updatedFilters.maxPrice;
        const matchesCapacity =
          dacha.capacity >= updatedFilters.minCapacity;
        const matchesAmenities =
          updatedFilters.amenities.length === 0 ||
          updatedFilters.amenities.every((amenity) =>
            dacha.amenities.includes(amenity)
          );

        return (
          matchesRegion && matchesPrice && matchesCapacity && matchesAmenities
        );
      });
      return { filters: updatedFilters, filteredDachas: filtered };
    }),

  resetFilters: () =>
    set({
      filters: {
        region: '',
        minPrice: 0,
        maxPrice: 10000000,
        minCapacity: 0,
        amenities: [],
      },
      filteredDachas: [],
    }),
}));

export default useDachasStore;
