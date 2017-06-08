// @flow
import type { ContextMenuState, Action } from '../types';

const initialState: ContextMenuState = {
  elementType: null,
  elementName: null,
};

export default function contextMenu(state: ContextMenuState = initialState, action: Action) {
  switch (action.type) {
    case 'contextMenu/TOGGLE_CONTEXT_MENU':
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
}
