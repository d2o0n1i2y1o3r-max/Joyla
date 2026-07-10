import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useFavoritesStore = create(
  persist(
    (set, get) => ({
      favorites: [],
      isLoading: false,
      error: null,
      
      setFavorites: (favorites) => set({ favorites }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      addFavorite: (place) => {
        const { favorites } = get();
        if (!favorites.find(fav => fav.id === place.id)) {
          set({ favorites: [...favorites, place] });
        }
      },
      removeFavorite: (placeId) => {
        const { favorites } = get();
        set({ favorites: favorites.filter(fav => fav.id !== placeId) });
      },
      isFavorite: (placeId) => {
        const { favorites } = get();
        return favorites.some(fav => fav.id === placeId);
      },
    }),
    {
      name: 'joylar-favorites',
    }
  )
);
