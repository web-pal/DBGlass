import { createSelector } from 'reselect';

const getFavoritesIds = (state) => state.favoritesIds;
const getFavoritesMap = (state) => state.favoritesById;

export const getFavorites = createSelector(
  [getFavoritesIds, getFavoritesMap],
  (ids, byId) => (ids.map(item => byId.get(item.toString())))
);
