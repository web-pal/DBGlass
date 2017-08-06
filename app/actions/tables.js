// @flow
import type {
  Action, IdString,
  TableNormalizePayload, TableDataNormalizedPayload,
  DataForMeasure, ForeignKey, RowsCount, ColumnSchema,
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

export const fetchTableDataRequest = (payload: {
  tableName: string,
  startIndex: number,
  stopIndex: number,
  resolve?: Function
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
  tableName: string,
  isCascade: boolean
}): Action =>
  ({
    type: 'tables/DROP_TABLE_REQUEST',
    payload,
  });

export const dropTable = (payload: { tableName: string }): Action =>
  ({
    type: 'tables/DROP_TABLE',
    payload,
  });

export const truncateTableRequest = (payload: {
  tableName: string,
  isCascade: boolean,
  restartIdentity: boolean
}): Action =>
  ({
    type: 'tables/TRUNCATE_TABLE_REQUEST',
    payload,
  });

export const truncateTable = (payload: { tableName: string }): Action =>
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

export const fetchTableSchemaRequest = (payload: { tableName: IdString }): Action =>
  ({
    type: 'tables/GET_TABLE_SCHEMA_REQUEST',
    payload,
  });

export const setTableSchema = (payload: {
  tableName: IdString,
  schema: Array<ColumnSchema>
}): Action =>
  ({
    type: 'tables/SET_TABLE_SCHEMA',
    payload,
  });

export const setTablesForeignKeys = (payload: Array<ForeignKey>): Action =>
  ({
    type: 'tables/SET_TABLES_FOREIGN_KEYS',
    payload,
  });

export const setRowsCount = (payload: RowsCount): Action =>
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
