// @flow
import type { Action } from '../types';
import PGDB from '../utils/pgDB';

export const setConnectedState = (payload: boolean): Action => {
  PGDB.disconnectDB();
  return {
    type: 'ui/SET_CONNECTED_STATE',
    payload,
  };
};
