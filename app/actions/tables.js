// @flow
import type { Action, TableNormalizePayload, IdString } from '../types';

export const fetchTablesRequest = (): Action =>
  ({ type: 'tables/FETCH_REQUEST' });

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

