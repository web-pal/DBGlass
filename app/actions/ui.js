// @flow
import type { Action } from '../types';

export const setConnectedState = (payload: boolean): Action =>
  ({
    type: 'ui/SET_CONNECTED_STATE',
    payload,
  });
