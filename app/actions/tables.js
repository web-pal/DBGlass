// @flow
import type {
  Action, IdString,
  Table, TableNormalizePayload, TableDataNormalizedPayload,
  dataForMeasure,
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

export const fetchTableData = (payload: Table): Action =>
  ({
    type: 'tables/FETCH_TABLE_DATA_REQUEST',
    payload,
  });

export const fetchTableData1 = (payload: { table: Table, resolve: ?Function }): Action =>
({
  type: 'tables/FETCH_TABLE_DATA_REQUEST1',
  payload,
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
  dataForMeasure: dataForMeasure, id: IdString
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
