// @flow
import type { Action, ModalState } from '../types';

export const toggleModal = (payload: ModalState): Action =>
  ({
    type: 'modal/TOGGLE_MODAL',
    payload,
  });

export const hideModal = (): Action =>
  ({ type: 'modal/HIDE_MODAL' });
