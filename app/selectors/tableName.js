import { createSelector } from 'reselect';
import { getFavoritesMap } from './favorites';

export const getCurrentFavoriteId = ({ favorites }) => favorites.meta.currentFavoriteId;

export const getCurrentDBName = createSelector(
  [getCurrentFavoriteId, getFavoritesMap],
  (id, favoritesMap) => id ? Object.values(favoritesMap).filter(db => db.id === id)[0].database : '',
);
