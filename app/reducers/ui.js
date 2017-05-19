// @flow
import type { uiState, Action } from '../types';

const initialState: uiState = {
  isConnected: false,
  isMenuOpen: false,
};

export default function ui(state: uiState = initialState, action: Action) {
  switch (action.type) {
    case 'ui/SET_CONNECTED_STATE':
      return {
        ...state,
        isConnected: action.payload,
      };
    case 'ui/TOGGLE_MENU':
      return {
        ...state,
        isMenuOpen: action.payload,
      };
    default:
      return state;
  }
}
