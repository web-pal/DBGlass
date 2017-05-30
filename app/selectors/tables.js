import { createSelector } from 'reselect';
import { getFavoritesMap } from './favorites';

export const getTablesMap = ({ tables }) => tables.byId;
export const getTablesByIds = ({ tables }) => tables.allIds;
export const getTablesFound = ({ tables }) => tables.meta.found;

export const getTables = createSelector(
  [getTablesByIds, getTablesMap],
  (ids, map) => ids.map(id => map[id]),
);

export const getCurrentFavoriteId = ({ favorites }) => favorites.meta.currentFavoriteId;

export const getTablesQuantity = createSelector(
  [getCurrentFavoriteId, getFavoritesMap],
  (id, map) => Object.values(map).filter(item => item.id === id)[0].tablesQuantity,
);

export const getFiltredTables = createSelector(
  [getTablesByIds, getTablesMap, getTablesFound],
  (ids, map, found) => {
    const tablesList = ids.map(id => map[id]);
    const filtredTables = found && tablesList.filter(item => item.tableName.includes(found));
    return found
      ? filtredTables
      : tablesList;
  },
);
