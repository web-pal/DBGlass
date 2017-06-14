// @flow
import type { Action } from '../types';

export const setConnectedState = (payload: boolean): Action =>
  ({
    type: 'ui/SET_CONNECTED_STATE',
    payload,
  });

export const toggleMenu = (payload: boolean): Action =>
  ({
    type: 'ui/TOGGLE_MENU',
    payload,
  });

export const toggleConnectingLadda = (payload: boolean): Action =>
  ({
    type: 'ui/TOGGLE_CONNECTING_LADDA',
    payload,
  });

export const setConnectionError = (payload: string): Action =>
  ({
    type: 'ui/SET_CONNECTION_ERROR',
    payload,
  });

export const toggleIsFetchedTables = (payload: boolean): Action =>
  ({
    type: 'ui/TOGGLE_IS_FETCH_TABLES',
    payload,
  });

export const toggleIsFetchedTablesData = (payload: boolean): Action =>
  ({
    type: 'ui/TOGGLE_IS_FETCH_TABLES_DATA',
    payload,
  });

export const appQuitRequest = (): Action =>
  ({
    type: 'ui/APP_QUIT_REQUEST',
  });
