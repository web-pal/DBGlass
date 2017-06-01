// @flow
import type { ContextMenuState, Action } from '../types';

const initialState: ContextMenuState = {
  elementSerialNumber: 0,
  elementType: '',
  elementName: '',
};

export default function contextMenu(state: ContextMenuState = initialState, action: Action) {
  switch (action.type) {
    case 'contextMenu/TOGGLE_CONTEXT_MENU': {
      const { elementType, elementSerialNumber, elementName } = action.payload;
      return {
        ...state,
        elementSerialNumber,
        elementType,
        elementName,
      };
    }
    default:
      return state;
  }
}
