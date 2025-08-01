import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const FavoritesContext = createContext();

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch favorites on mount and normalize shape
  useEffect(() => {
    axios
      .get('/api/favorites', { withCredentials: true })
      .then((res) =>
        setFavorites(
          res.data.map((fav) => ({
            type: fav.favorite_type,
            key: fav.favorite_id,
            label: fav.label,
            route: fav.route,
            id: fav.id, // backend id for removal/reorder
          })),
        ),
      )
      .catch(() => setFavorites([]))
      .finally(() => setLoading(false));
  }, []);

  // Add favorite (prevents duplicates, persists to backend, uses backend id)
  const addFavorite = async (type, key, label, route) => {
    console.log({ type, key, label, route }); // Add this line
    // Prevent duplicates
    if (favorites.some((fav) => fav.type === type && fav.key === key)) return;

    const res = await axios.post(
      '/api/favorites',
      { favoriteType: type, favoriteId: key, label, route },
      { withCredentials: true },
    );
    setFavorites((prev) => [
      ...prev,
      {
        type,
        key,
        label,
        route,
        id: res.data.id, // backend id for removal/reorder
      },
    ]);
  };

  // Remove favorite by backend id
  const removeFavorite = async (favoriteType, favoriteId) => {
    const favToRemove = favorites.find(
      (fav) => fav.type === favoriteType && fav.key === favoriteId,
    );
    if (!favToRemove) return;
    await axios.delete('/api/favorites', {
      data: { id: favToRemove.id },
      withCredentials: true,
    });
    setFavorites((prev) => prev.filter((fav) => fav.id !== favToRemove.id));
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
