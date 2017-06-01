// @flow
import type { ModalState, Action } from '../types';

const initialState: ModalState = {
  component: null,
  show: false,
  values: {},
  payload: {},
};

export default function modal(state: ModalState = initialState, action: Action) {
  switch (action.type) {
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
