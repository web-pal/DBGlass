// @flow
import type {
  Action, IdString,
  Table, TableNormalizePayload, TableDataNormalizedPayload,
  DataForMeasure,
} from '../types';

export const fetchTablesRequest = (payload: ?IdString): Action =>
  ({
    type: 'tables/FETCH_REQUEST',
    payload,
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

export const fetchTableData = (
  table: Table, startIndex: ?number, resolve: ?Function,
): Action =>
  ({
    type: 'tables/FETCH_TABLE_DATA_REQUEST',
    payload: {
      table,
      startIndex,
      resolve,
    },
  });

export const selectTable = (payload: string): Action =>
  ({
    type: 'tables/SELECT_TABLE',
    payload,
  });

export const setTableData = (payload: TableDataNormalizedPayload): Action =>
  ({
    type: 'tables/SET_TABLE_DATA',
    payload,
  });

export const resetSelectTable = (): Action =>
  ({
    type: 'tables/RESET_SELECT_TABLE',
  });

export const dropTableRequest = (
  tableName: IdString,
  parameters: ?Object,
  selectedTableId: IdString,
  currentTableId: ?IdString,
  ): Action =>
  ({
    type: 'tables/DROP_TABLE_REQUEST',
    payload: {
      tableName,
      parameters,
      selectedTableId,
      currentTableId,
    },
  });

export const dropTable = (payload: IdString): Action =>
  ({
    type: 'tables/DROP_TABLE',
    payload,
  });

export const truncateTableRequest = (
  tableName: IdString,
  parameters: ?Object,
  selectedTableId: IdString,
  ): Action =>
  ({
    type: 'tables/TRUNCATE_TABLE_REQUEST',
    payload: {
      tableName,
      parameters,
      selectedTableId,
    },
  });

export const truncateTable = (payload: IdString): Action =>
  ({
    type: 'tables/TRUNCATE_TABLE',
    payload,
  });

export const setDataForMeasure = (payload: {
  dataForMeasure: DataForMeasure, id: IdString
}): Action =>
  ({
    type: 'tables/SET_DATA_FOR_MEASURE',
    payload,
  });

export const setMeasureWidth = (payload: {
  tableId: IdString, width: number, key: string
}): Action =>
  ({
    type: 'tables/SET_MEASURE_WIDTH',
    payload,
  });

export const getTableSchema = (payload: Table): Action =>
  ({
    type: 'tables/GET_TABLE_SCHEMA',
    payload,
  });

export const setTableSchema = (payload: {id: IdString, structureTable: {}}): Action =>
  ({
    type: 'tables/SET_TABLE_SCHEMA',
    payload,
  });

export const setTablesConstraints = (payload: any): Action =>
  ({
    type: 'tables/SET_TABLES_CONSTRAINTS',
    payload,
  });

export const changeViewMode = (payload: boolean): Action =>
  ({
    type: 'tables/CHANGE_VIEW_MODE',
    payload,
  });
