// @flow
import type { Action } from '../types';

export const toggleContextMenu = (elementType: string, elementName: string): Action =>
  ({
    type: 'contextMenu/TOGGLE_CONTEXT_MENU',
    payload: {
      elementType,
      elementName,
    },
  });
