// @flow
import type { Action, ContextMenuState } from '../types';

export const toggleContextMenu = (payload: ContextMenuState): Action =>
  ({
    type: 'contextMenu/TOGGLE_CONTEXT_MENU',
    payload,
  });
