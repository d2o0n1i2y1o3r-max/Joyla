import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useLocationStore = create(
  persist(
    (set) => ({
      location: null,
      manualCity: null,
      isLoading: false,
      error: null,
      
      setLocation: (location) => set({ location, error: null }),
      setManualCity: (city) => set({ manualCity: city }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      clearLocation: () => set({ location: null, manualCity: null, error: null }),
    }),
    {
      name: 'joylar-location',
    }
  )
);
