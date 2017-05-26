// @flow
import type { Action, Table, TableDataNormalizedPayload } from '../types';

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
