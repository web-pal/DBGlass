// @flow
import type { ContextMenuState, Action } from '../types';

const initialState: ContextMenuState = {
  elementId: null,
  elementType: '',
  elementName: '',
};

export default function contextMenu(state: ContextMenuState = initialState, action: Action) {
  switch (action.type) {
    case 'contextMenu/TOGGLE_CONTEXT_MENU': {
      const { elementType, elementId, elementName } = action.payload;
      return {
        ...state,
        elementId,
        elementType,
        elementName,
      };
    }
    default:
      return state;
  }
}
