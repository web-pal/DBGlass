import _ from 'lodash';
import { createSelector } from 'reselect';
import { getFavoritesMap } from './favorites';

export const getTablesMap = ({ tables }) => tables.byName;
export const getTablesbyNames = ({ tables }) => tables.allNames;
export const getTableNameSearchKey = ({ tables }) => tables.meta.tableNameSearchKey;

export const getTables = createSelector(
  [getTablesbyNames, getTablesMap],
  (names, map) => names.map(name => map[name]),
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
  [getTablesbyNames, getTablesMap, getTableNameSearchKey],
  (names, map, searchKey) => {
    const tablesList = names.map(name => map[name]);
    const filtredTables = tablesList.filter(item => item.tableName.includes(searchKey));
    return searchKey
      ? filtredTables
      : tablesList;
  },
);

export const getTableName = ({ tables }) => tables.meta.currentTableName;
export const getCurrentTableFieldsIds = ({ tables }) =>
  tables.byName[tables.meta.currentTableName].fieldsIds;
export const getCurrentTableFields = ({ tables }) =>
  tables.byName[tables.meta.currentTableName].fields;

export const getTableFields = createSelector(
  [getCurrentTableFieldsIds, getCurrentTableFields],
  (ids, map) => ids ? ids.map(id => map[id].fieldName) : [],
);

export const getCurrentTableRowsIds = ({ tables }) =>
  tables.byName[tables.meta.currentTableName].rowsIds;
export const getCurrentTableRows = ({ tables }) =>
  tables.byName[tables.meta.currentTableName].rows;
export const getCurrentTableRowsCount = ({ tables }) =>
  tables.byName[tables.meta.currentTableName].rowsCount;

export const getDataForMeasure = createSelector(
  [getTableName, getTablesMap],
  (name, map) => {
    if (name) {
      const data = map[name].dataForMeasure;
      return data;
    }
    return {};
  },
);

export const getDataForMeasureCells = createSelector(
  [getTablesbyNames, getTablesMap],
  (names, map) => {
    const arr = [];
    names.forEach(name => {
      if (Object.keys(map[name].dataForMeasure).length) {
        const data = Object.values(map[name].dataForMeasure).filter(item => !item.isMeasured);
        data.forEach(item => _.assign(item, { tableName: name }));
        arr.push(...data);
      }
    });
    return arr;
  },
);

export const getCurrentTable = createSelector(
  [getTablesbyNames, getTablesMap, getTableName],
  (names, map, currentName) =>
  names.map(name => map[name]).filter(item => item.tableName === currentName)[0],
);

export const getCurrentTableSchema = createSelector(
  [getTableId, getTablesMap],
  (id, map) => {
    const tableStructure = Object.values(map).filter(item => item.id === id)[0].structureTable;
    return tableStructure ? tableStructure['0'].table_schema : '';
  },
);

export const getCurrentTableStructureRows = createSelector(
  [getTableId, getTablesMap],
  (id, map) => {
    const structure = Object.values(map).filter(item => item.id === id)[0].structureTable;
    return structure ? Object.values(structure) : [];
  },
);


export const getTableConstraints = createSelector(
  [getTableId, getTablesMap],
  (id, map) => {
    const constraints = Object.values(map).filter(item => item.id === id)[0].constraints;
    return constraints;
  },
);

export const getCurrentTableSchema = createSelector(
  [getTableId, getTablesMap],
  (id, map) => {
    const tableStructure = Object.values(map).filter(item => item.id === id)[0].structureTable;
    return tableStructure ? tableStructure['0'].table_schema : '';
  },
);

export const getCurrentTableStructureRows = createSelector(
  [getTableId, getTablesMap],
  (id, map) => {
    const structure = Object.values(map).filter(item => item.id === id)[0].structureTable;
    return structure ? Object.values(structure) : [];
  },
);


export const getTableConstraints = createSelector(
  [getTableId, getTablesMap],
  (id, map) => {
    const constraints = Object.values(map).filter(item => item.id === id)[0].constraints;
    return constraints;
  },
);
