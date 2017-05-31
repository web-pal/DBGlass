// @flow
import type { ContextMenuMetaState, Action } from '../types';

const initialMeta: ContextMenuMetaState = {
  elementSerialNumber: 0,
  elementType: '',
};

export default function contextMenu(state: ContextMenuMetaState = initialMeta, action: Action) {
  switch (action.type) {
    case 'contextMenu/TOGGLE_CONTEXT_MENU': {
      const { elementType, elementSerialNumber } = action.payload;
      return {
        ...state,
        elementSerialNumber,
        elementType,
      };
    }
    default:
      return state;
  }
}
