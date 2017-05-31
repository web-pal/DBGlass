// @flow
import type {
  Action, IdString,
  Table, TableNormalizePayload, TableDataNormalizedPayload,
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
