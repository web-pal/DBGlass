// @flow
export type UiState = {
  isConnected: boolean,
  isMenuOpen: boolean,
  isLoading: boolean,
  connectionError: string,
  isTablesFetched: boolean,
  isTablesDataFetched: boolean
};

export type UiAction =
  { type: 'ui/SET_CONNECTED_STATE', +payload: boolean }
| { type: 'ui/SET_CONNECTION_ERROR', +payload: string }
| { type: 'ui/TOGGLE_IS_FETCH_TABLES_DATA', +payload: string }
| { type: 'ui/TOGGLE_MENU', +payload: boolean }
| { type: 'ui/TOGGLE_CONNECTING_LADDA', +payload: boolean }
| { type: 'ui/TOGGLE_IS_FETCH_TABLES', +payload: boolean }
| { type: 'ui/APP_QUIT_REQUEST' }
;
