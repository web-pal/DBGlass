// @flow
import type { Action } from '../types';

export const fetchTableData = (payload: string): Action =>
  ({
    type: 'currentTable/FETCH_TABLE_DATA_REQUEST',
    payload,
  });
