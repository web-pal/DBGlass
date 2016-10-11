import DB from '../db';

import * as types from '../constants/tablesConstants';

export function setCurrentTable(tableName) {
  return {
    type: types.SET_CURRENT_TABLE,
    tableName
  };
}

export function changeTableName(newTableName) {
  return {
    type: types.CHANGE_TABLE_NAME,
    newTableName
  };
}

export function createTable(tableName, i = -1) {
  return dispatch => new Promise((resolve, reject) => {
    // eslint-disable-next-line no-param-reassign
    DB.createTable(tableName)
      .then(
        () => {
          dispatch({
            type: types.CREATE_TABLE,
            tableName
          });
          resolve(tableName);
        },
        (error) => {
          // if tableName is occupied it sends reject with
          // incremented counter to pick new table name
          // recursively
          if (error.search('already exists')) {
            const j = i + 1;
            reject(j);
          }
        }
      );
  });
}

export function dropTable(tableName) {
  return (dispatch) => {
    dispatch({
      type: 'tables/DROP_TABLE'
    });
    DB.dropTable(tableName);
  };
}

export function truncateTable(tableName, restartIdentity) {
  return (dispatch) => {
    dispatch({
      type: 'tables/TRUNCATE_TABLE'
    });
    DB.truncateTable(tableName, restartIdentity);
  };
}

export function getTables(clear = undefined) {
  return dispatch => new Promise((resolve, reject) => {
    if (clear) {
      dispatch({ type: types.GET_TABLES, tables: [] });
    }
    DB.getTables()
      .then(
        tables => DB.getTableOid(tables),
        (error) => {
          reject(error);
        }
      )
      .then(
        tables => DB.getForeignKeys(tables)
      )
      .then(
        (tables) => {
          dispatch({
            type: types.GET_TABLES,
            tables
          });
          resolve(tables[0].table_name);
        }
      );
  });
}
