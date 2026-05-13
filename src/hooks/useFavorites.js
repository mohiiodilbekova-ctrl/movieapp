import { useState, useEffect } from 'react';

export function useFavorites() {
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('kinoqidir_favorites');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('kinoqidir_favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (id) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const isFavorite = (id) => favorites.includes(id);

  return { favorites, toggleFavorite, isFavorite };
}
