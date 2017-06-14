// @flow
import type { ContextMenuState, Action } from '../types';

const initialState: ContextMenuState = {
  selectedElementType: null,
  selectedElementName: null,
};

export default function contextMenu(state: ContextMenuState = initialState, action: Action) {
  switch (action.type) {

    case 'contextMenu/TOGGLE_CONTEXT_MENU': {
      const { selectedElementType, selectedElementName } = action.payload;
      return {
        ...state,
        selectedElementType,
        selectedElementName,
      };
    }
    default:
      return state;
  }
}
