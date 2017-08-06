// @flow
export type ContextMenuState = {
  selectedElementType: ?string,
  selectedElementName: ?string
};

export type ContextMenuAction =
  { type: 'contextMenu/TOGGLE_CONTEXT_MENU', +payload: ContextMenuState }
;

