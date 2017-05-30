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
