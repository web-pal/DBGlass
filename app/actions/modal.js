// @flow
import type { Action, ModalState } from '../types';

export const toggleModal = (payload: ModalState): Action =>
  ({
    type: 'modal/TOGGLE_MODAL',
    payload,
  });

export const hideModal = (): Action =>
  ({ type: 'modal/HIDE_MODAL' });


export const showDropTableModal = (payload: { tableName: string }): Action =>
  ({
    type: 'modal/SHOW_DROP_TABLE_MODAL',
    payload,
  });

export const hideDropTableModal = (): Action =>
  ({
    type: 'modal/HIDE_DROP_TABLE_MODAL',
  });

