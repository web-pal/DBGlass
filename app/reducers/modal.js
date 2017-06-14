// @flow
import type { ModalState, Action } from '../types';

const initialState: ModalState = {
  dropTableName: null,
  showDropTableModal: false,
  component: null,
  show: false,
  values: {},
  payload: {},
  error: {},
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
        dropTableName: null,
      };
    case 'modal/TOGGLE_MODAL': {
      return {
        ...state,
        ...action.payload,
        show: true,
      };
    }
    case 'modal/HIDE_MODAL':
      return initialState;
    default:
      return state;
  }
}
