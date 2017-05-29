import { createSelector } from 'reselect';
import { getFavoritesMap } from './favorites';

export const getTablesMap = ({ tables }) => tables.byId;
export const getTablesByIds = ({ tables }) => tables.allIds;

export const getTables = createSelector(
  [getTablesByIds, getTablesMap],
  (ids, map) => ids.map(id => map[id]),
);

export const getCurrentFavoriteId = ({ favorites }) => favorites.meta.currentFavoriteId;

export const getTablesQuantity = createSelector(
  [getCurrentFavoriteId, getFavoritesMap],
  (id, map) => Object.values(map).filter(item => item.id === id)[0].tablesQuantity,
);

export const getCurrentTableId = ({ tables }) => tables.meta.currentTableId;
export const getCurrentTableFieldsIds = ({ tables }) =>
  tables.byId[tables.meta.currentTableId].fieldsIds;
export const getCurrentTableFieldsNames = ({ tables }) =>
  tables.byId[tables.meta.currentTableId].fieldsNames;

export const getTableFieldsNames = createSelector(
  [getCurrentTableFieldsIds, getCurrentTableFieldsNames],
  // (ids, map) => ids ? ids.map(id => map[id]) : [],
  (ids, map) => {
    console.log('selector', ids, map);
    return ids ? [ids.map(id => map[id].fieldName)] : []
  },
);

export const getCurrentTableRowsIds = ({ tables }) =>
  tables.byId[tables.meta.currentTableId].rowsIds;
export const getCurrentTableRows = ({ tables }) =>
  tables.byId[tables.meta.currentTableId].rows;

export const getTableRows = createSelector(
  [getCurrentTableRowsIds, getCurrentTableRows],
  // (ids, map) => ids ? ids.map(id => map[id]) : [],
  (ids, map) => ids ? ids.map(id => Object.values(map[id])) : [],
);

export const getIsFetched = createSelector(
  [getCurrentTableId, getTablesMap],
  (id, map) => id ? Object.values(map).filter(item => item.id === id)[0].isFetched : false,
);
