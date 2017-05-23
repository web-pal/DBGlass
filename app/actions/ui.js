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

export const toggleLadda = (payload: boolean): Action =>
  ({
    type: 'ui/TOGGLE_LADDA',
    payload,
  });
