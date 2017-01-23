import { createSelector } from 'reselect';

const getFavoritesIds = (state) => state.favoritesIds;
const getFavoritesMap = (state) => state.favoritesById;

export default createSelector(
  [getFavoritesIds, getFavoritesMap],
  (ids, byId) => (ids.map(item => byId.get(item.toString())))
);
