// @flow
import type { uiState, Action } from '../types';

const initialState: uiState = {
  isConnected: false,
};

export default function ui(state: uiState = initialState, action: Action) {
  switch (action.type) {
    case 'ui/SET_CONNECTED_STATE':
      return {
        ...state,
        isConnected: action.payload,
      };
    default:
      return state;
  }
}
