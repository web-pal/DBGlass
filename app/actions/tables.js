// @flow
import type {
  Action, IdString,
  Table, TableNormalizePayload, TableDataNormalizedPayload,
  DataForMeasure,
} from '../types';

export const fetchTablesRequest = (): Action =>
  ({
    type: 'tables/FETCH_REQUEST',
  });

export const fillTables = (payload: TableNormalizePayload): Action =>
  ({
    type: 'tables/FILL',
    payload,
  });

export const clearTables = (): Action =>
  ({ type: 'tables/CLEAR_TABLES' });


export const setTableNameSearchKey = (payload: ?IdString): Action =>
  ({
    type: 'tables/SET_TABLENAME_SEARCH_KEY',
    payload,
  });

export const fetchTableData = (payload: {
  table: Table,
  startIndex: ?number,
  resolve: ?Function
}): Action =>
  ({
    type: 'tables/FETCH_TABLE_DATA_REQUEST',
    payload,
  });

export const selectTable = (payload: IdString): Action =>
  ({
    type: 'tables/SELECT_TABLE',
    payload,
  });

export const setTableData = (payload: {
  data: TableDataNormalizedPayload,
  tableName: IdString
}): Action =>
  ({
    type: 'tables/SET_TABLE_DATA',
    payload,
  });

export const resetSelectTable = (): Action =>
  ({
    type: 'tables/RESET_SELECT_TABLE',
  });

export const dropTableRequest = (payload: {
  selectedElementName: IdString,
  currentValues: ?Object,
  currentTableName: ?IdString
}): Action =>
  ({
    type: 'tables/DROP_TABLE_REQUEST',
    payload,
  });

export const dropTable = (payload: IdString): Action =>
  ({
    type: 'tables/DROP_TABLE',
    payload,
  });

export const truncateTableRequest = (payload: {
  selectedElementName: IdString,
  currentValues: ?Object
  }): Action =>
  ({
    type: 'tables/TRUNCATE_TABLE_REQUEST',
    payload,
  });

export const truncateTable = (payload: IdString): Action =>
  ({
    type: 'tables/TRUNCATE_TABLE',
    payload,
  });

export const setDataForMeasure = (payload: {
  dataForMeasure: DataForMeasure, tableName: IdString
}): Action =>
  ({
    type: 'tables/SET_DATA_FOR_MEASURE',
    payload,
  });

export const setMeasureWidth = (payload: {
  tableName: IdString, width: number, key: string
}): Action =>
  ({
    type: 'tables/SET_MEASURE_WIDTH',
    payload,
  });

export const getTableSchema = (payload: { tableName: IdString }): Action =>
  ({
    type: 'tables/GET_TABLE_SCHEMA_REQUEST',
    payload,
  });

export const setTableSchema = (payload: { tableName: IdString, structureTable: Object }): Action =>
  ({
    type: 'tables/SET_TABLE_SCHEMA',
    payload,
  });

export const setTablesForeignKeys = (payload: any): Action =>
  ({
    type: 'tables/SET_TABLES_FOREIGN_KEYS',
    payload,
  });

export const setRowsCount = (payload: { relname: string, reltuples: number }): Action =>
  ({
    type: 'tables/SET_ROWS_COUNT',
    payload,
  });

export const clearCurrentTable = (payload: IdString): Action =>
  ({
    type: 'tables/CLEAR_CURRENT_TABLE',
    payload,
  });

export const changeViewMode = (payload: boolean): Action =>
  ({
    type: 'tables/CHANGE_VIEW_MODE',
    payload,
  });
