// @flow
import type { Action, dataForMeasure } from '../types';

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

export const setDataForMeasure = (payload: dataForMeasure): Action =>
  ({
    type: 'ui/SET_DATA_FOR_MEASURE',
    payload,
  });

export const setMeasureWidth = (payload: { width: number, key: string }): Action =>
  ({
    type: 'ui/SET_MEASURE_WIDTH',
    payload,
  });
