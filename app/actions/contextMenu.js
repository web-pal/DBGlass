// @flow
import type { Action, IdString } from '../types';

export const toggleContextMenu = (
  elementType: string,
  elementId: ?IdString,
  elementName: string): Action =>
  ({
    type: 'contextMenu/TOGGLE_CONTEXT_MENU',
    payload: {
      elementType,
      elementId,
      elementName,
    },
  });
