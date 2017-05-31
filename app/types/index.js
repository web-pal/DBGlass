// @flow
import type { Store as ReduxStore, Dispatch as ReduxDispatch } from 'redux';
import type {
  Favorite, FavoritesIndexedMap,
  FavoriteNormalizePayload, FavoritesIds, FavoritesMetaState,
  FavoriteTablesQuantity,
} from './favorites';
import type { TableNormalizePayload, TablesIndexedMap, TablesIds, TablesMetaState } from './tables';
import type { uiState } from './ui';
import type { ContextMenuState } from './contextMenu';
import type { ModalState } from './modal';

export * from './favorites';
export * from './tables';
export * from './ui';
export * from './contextMenu';
export * from './modal';

export type IdString = string;

export type Action =
  { type: 'CLEAR_ALL_REDUCERS' }
| { type: 'favorites/FETCH_REQUEST' }
| { type: 'favorites/ADD_REQUEST', +payload: Favorite }
| { type: 'favorites/REMOVE_REQUEST', +payload: IdString }
| { type: 'favorites/SELECT_REQUEST', +payload: IdString }
| { type: 'favorites/FILL', +payload: FavoriteNormalizePayload }
| { type: 'favorites/SELECT', +payload: ?IdString }
| { type: 'favorites/REMOVE', +payload: IdString }
| { type: 'favorites/ADD_FAVORITE_TABLES_QUANTITY', +payload: FavoriteTablesQuantity }
| { type: 'tables/FETCH_REQUEST' }
| { type: 'tables/FILL', +payload: TableNormalizePayload }
| { type: 'tables/CLEAR_TABLES' }
| { type: 'tables/SET_TABLENAME_SEARCH_KEY', +payload: ?IdString }
| { type: 'currentTable/FETCH_TABLE_DATA_REQUEST', +payload: string }
| { type: 'ui/SET_CONNECTED_STATE', +payload: boolean }
| { type: 'ui/SET_CONNECTION_ERROR', +payload: string }
| { type: 'ui/TOGGLE_MENU', +payload: boolean }
| { type: 'ui/TOGGLE_CONNECTING_LADDA', +payload: boolean }
| { type: 'contextMenu/TOGGLE_CONTEXT_MENU', +payload: ContextMenuState}
| { type: 'modal/TOGGLE_MODAL', +payload: ModalState }
| { type: 'modal/HIDE_MODAL' }
| Object
;


export type State = {
  +ui: uiState,
  +modal: ModalState,
  +contextMenu: ContextMenuState,
  +favorites: {
    +byId: FavoritesIndexedMap,
    +allIds: FavoritesIds,
    +meta: FavoritesMetaState
  },
  +tables: {
    +byId: TablesIndexedMap,
    +allIds: TablesIds,
    +meta: TablesMetaState
  }
};


export type Store = ReduxStore<State, Action>;
export type Dispatch = ReduxDispatch<Action>;
