// @flow
import type { Action } from '../types';

export const showDropTableModal = (payload: { tableName: string }): Action =>
  ({
    type: 'modal/SHOW_DROP_TABLE_MODAL',
    payload,
  });

export const hideDropTableModal = (): Action =>
  ({
    type: 'modal/HIDE_DROP_TABLE_MODAL',
  });

export const setDropTableModalError = (payload: { errorMessage: string }): Action =>
  ({
    type: 'modal/SET_DROP_TABLE_MODAL_ERROR',
    payload,
  });

export const showTruncateTableModal = (payload: { tableName: string }): Action =>
  ({
    type: 'modal/SHOW_TRUNCATE_TABLE_MODAL',
    payload,
  });

export const hideTruncateTableModal = (): Action =>
  ({
    type: 'modal/HIDE_TRUNCATE_TABLE_MODAL',
  });

export const setTruncateTableModalError = (payload: { errorMessage: string }): Action =>
  ({
    type: 'modal/SET_TRUNCATE_TABLE_MODAL_ERROR',
    payload,
  });

export const showErrorModal = (payload: { errorMessage: string }): Action =>
  ({
    type: 'modal/SHOW_ERROR_MODAL',
    payload,
  });

export const hideErrorModal = (): Action =>
  ({
    type: 'modal/HIDE_ERROR_MODAL',
  });

