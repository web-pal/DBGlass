// @flow
import type { ModalState, Action } from '../types';

const initialState: ModalState = {
  dropTableName: null,
  dropTableErrorMessage: null,

  truncateTableName: null,
  truncateTableErrorMessage: null,

  errorMessage: null,

  showDropTableModal: false,
  showTruncateTableModal: false,
  showErrorModal: false,
};

export default function modal(state: ModalState = initialState, action: Action) {
  switch (action.type) {
    case 'modal/SHOW_DROP_TABLE_MODAL':
      return {
        ...state,
        showDropTableModal: true,
        dropTableName: action.payload.tableName,
      };
    case 'modal/HIDE_DROP_TABLE_MODAL':
      return {
        ...state,
        showDropTableModal: false,
        dropTableErrorMessage: null,
        dropTableName: null,
      };
    case 'modal/SET_DROP_TABLE_MODAL_ERROR':
      return {
        ...state,
        dropTableErrorMessage: action.payload.errorMessage,
      };
    case 'modal/SHOW_TRUNCATE_TABLE_MODAL':
      return {
        ...state,
        showTruncateTableModal: true,
        truncateTableName: action.payload.tableName,
      };
    case 'modal/HIDE_TRUNCATE_TABLE_MODAL':
      return {
        ...state,
        showTruncateTableModal: false,
        truncateTableErrorMessage: null,
        truncateTableName: null,
      };
    case 'modal/SET_TRUNCATE_TABLE_MODAL_ERROR':
      return {
        ...state,
        truncateTableErrorMessage: action.payload.errorMessage,
      };
    case 'modal/SHOW_ERROR_MODAL':
      return {
        ...state,
        showErrorModal: true,
        errorMessage: action.payload.errorMessage,
      };
    case 'modal/HIDE_ERROR_MODAL':
      return {
        ...state,
        showErrorModal: false,
      };
    default:
      return state;
  }
}
