import { createSelector } from 'reselect';

export const getFavoritesMap = ({ favorites }) => favorites.byId;
export const getFavoritesIds = ({ favorites }) => favorites.allIds;

export const getFavorites = createSelector(
  [getFavoritesIds, getFavoritesMap],
  (ids, map) => ids.map(id => map[id]),
);

