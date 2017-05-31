import { createSelector } from 'reselect';
import { getFavoritesMap } from './favorites';

export const getTablesMap = ({ tables }) => tables.byId;
export const getTablesByIds = ({ tables }) => tables.allIds;
export const getTableNameSearchKey = ({ tables }) => tables.meta.tableNameSearchKey;

export const getTables = createSelector(
  [getTablesByIds, getTablesMap],
  (ids, map) => ids.map(id => map[id]),
);

export const getCurrentFavoriteId = ({ favorites }) => favorites.meta.currentFavoriteId;

export const getTablesQuantity = createSelector(
  [getCurrentFavoriteId, getFavoritesMap],
  (id, map) => {
    const tablesQuantity = id ?
      Object.values(map).filter(item => item.id === id)[0].tablesQuantity : 10;
    return [...Array(tablesQuantity).keys()];
  },
);

export const getFiltredTables = createSelector(
  [getTablesByIds, getTablesMap, getTableNameSearchKey],
  (ids, map, searchKey) => {
    const tablesList = ids.map(id => map[id]);
    const filtredTables = tablesList.filter(item => item.tableName.includes(searchKey));
    return searchKey
      ? filtredTables
      : tablesList;
    },
  );

export const getCurrentTableId = ({ tables }) => tables.meta.currentTableId;
export const getCurrentTableFieldsIds = ({ tables }) =>
  tables.byId[tables.meta.currentTableId].fieldsIds;
export const getCurrentTableFields = ({ tables }) =>
  tables.byId[tables.meta.currentTableId].fields;

export const getTableFields = createSelector(
  [getCurrentTableFieldsIds, getCurrentTableFields],
  (ids, map) => ids ? ids.map(id => map[id].fieldName) : [],
);

export const getCurrentTableRowsIds = ({ tables }) =>
  tables.byId[tables.meta.currentTableId].rowsIds;
export const getCurrentTableRows = ({ tables }) =>
  tables.byId[tables.meta.currentTableId].rows;

export const getTableRows = createSelector(
  [getCurrentTableRowsIds, getCurrentTableRows],
  (ids, map) => ids ? ids.map(id => Object.values(map[id])) : [],
);
