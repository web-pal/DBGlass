// @flow
import type { uiState, Action } from '../types';

const initialState: uiState = {
  isConnected: false,
  isMenuOpen: false,
  isLoading: false,
  connectionError: '',
  isTablesFetched: false,
  dataForMeasure: {},
};

export default function ui(state: uiState = initialState, action: Action) {
  switch (action.type) {
    case 'ui/SET_CONNECTED_STATE':
      return {
        ...state,
        isConnected: action.payload,
      };
    case 'ui/SET_CONNECTION_ERROR':
      return {
        ...state,
        connectionError: action.payload,
      };
    case 'ui/TOGGLE_MENU':
      return {
        ...state,
        isMenuOpen: action.payload,
      };
    case 'ui/TOGGLE_CONNECTING_LADDA':
      return {
        ...state,
        isLoading: action.payload,
      };
    case 'ui/TOGGLE_IS_FETCH_TABLES':
      return {
        ...state,
        isTablesFetched: action.payload,
      };
    case 'ui/SET_DATA_FOR_MEASURE':
      return {
        ...state,
        dataForMeasure: {
          ...state.dataForMeasure,
          ...action.payload,
        },
      };
    case 'ui/SET_MEASURE_WIDTH': {
      const measure = state.dataForMeasure[action.payload.key];
      return {
        ...state,
        dataForMeasure: {
          ...state.dataForMeasure,
          [action.payload.key]: {
            ...measure,
            width: action.payload.width,
          },
        },
      };
    }
    default:
      return state;
  }
}
