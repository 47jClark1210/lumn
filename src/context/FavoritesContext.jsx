import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const FavoritesContext = createContext();

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch favorites on mount
  useEffect(() => {
    axios
      .get('/api/favorites', { withCredentials: true })
      .then((res) => setFavorites(res.data))
      .catch(() => setFavorites([]))
      .finally(() => setLoading(false));
  }, []);

  const addFavorite = async (favoriteType, favoriteId) => {
    const res = await axios.post(
      '/api/favorites',
      { favoriteType, favoriteId },
      { withCredentials: true },
    );
    if (res.data) {
      setFavorites((prev) =>
        prev.some(
          (fav) =>
            fav.favorite_type === favoriteType &&
            fav.favorite_id === favoriteId,
        )
          ? prev
          : [...prev, res.data],
      );
    }
  };

  const removeFavorite = async (favoriteType, favoriteId) => {
    await axios.delete('/api/favorites', {
      data: { favoriteType, favoriteId },
      withCredentials: true,
    });
    setFavorites((prev) =>
      prev.filter(
        (fav) =>
          !(
            fav.favorite_type === favoriteType && fav.favorite_id === favoriteId
          ),
      ),
    );
  };

  // Reorder favorites (frontend and backend)
  const reorderFavorites = async (fromIndex, toIndex) => {
    if (fromIndex === toIndex) return;
    const updated = Array.from(favorites);
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);
    setFavorites(updated);

    // Send new order to backend (array of {id, order})
    await axios.post(
      '/api/favorites/reorder',
      {
        orderList: updated.map((fav, idx) => ({
          id: fav.id,
          order: idx,
        })),
      },
      { withCredentials: true },
    );
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        addFavorite,
        removeFavorite,
        reorderFavorites,
        loading,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  return useContext(FavoritesContext);
}
