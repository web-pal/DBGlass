// @flow
import type { Action } from '../types';

export const toggleContextMenu = (elementType: string, elementSerialNumber: number): Action =>
  ({
    type: 'contextMenu/TOGGLE_CONTEXT_MENU',
    payload: {
      elementType,
      elementSerialNumber,
    },
  });
