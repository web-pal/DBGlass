// @flow
import type { Action } from '../types';

export const toggleModal = (component: string, values: ?Object, error: ?Object): Action =>
  ({
    type: 'modal/TOGGLE_MODAL',
    payload: {
      component,
      values,
      error,
    },
  });

export const hideModal = (): Action =>
  ({ type: 'modal/HIDE_MODAL' });
