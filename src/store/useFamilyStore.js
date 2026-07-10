import { create } from 'zustand';

export const useFamilyStore = create((set) => ({
  familyPlaces: [],
  filteredFamilyPlaces: [],
  filters: {
    city: '',
    picnicSpotOnly: false,
    springOnly: false,
    vehicleAccess: '',
  },

  setFamilyPlaces: (familyPlaces) => set({ familyPlaces, filteredFamilyPlaces: familyPlaces }),

  setFilters: (newFilters) =>
    set((state) => {
      const updatedFilters = { ...state.filters, ...newFilters };
      const filtered = state.familyPlaces.filter((place) => {
        const matchesCity = !updatedFilters.city || place.city === updatedFilters.city;
        const matchesPicnic = !updatedFilters.picnicSpotOnly || place.picnicSpot;
        const matchesSpring = !updatedFilters.springOnly || place.bestSeason === 'spring';
        const matchesVehicle =
          !updatedFilters.vehicleAccess || place.vehicleAccess === updatedFilters.vehicleAccess;

        return matchesCity && matchesPicnic && matchesSpring && matchesVehicle;
      });
      return { filters: updatedFilters, filteredFamilyPlaces: filtered };
    }),

  resetFilters: () =>
    set({
      filters: {
        city: '',
        picnicSpotOnly: false,
        springOnly: false,
        vehicleAccess: '',
      },
      filteredFamilyPlaces: [],
    }),
}));
