// @flow
import type { Store as ReduxStore, Dispatch as ReduxDispatch } from 'redux';
import type {
  Favorite, FavoritesIndexedMap,
  FavoriteNormalizePayload, FavoritesIds, FavoritesMetaState,
  FavoriteTablesQuantity,
} from './favorites';
import type { ContextMenuState } from './contextMenu';
import type { ModalState } from './modal';

import type { TableNormalizePayload, TablesIndexedMap, TablesNames, TablesMetaState, Table, DataForMeasure } from './tables';
import type { TableDataNormalizedPayload } from './currentTable';
import type { uiState } from './ui';

export * from './favorites';
export * from './tables';
export * from './ui';
export * from './contextMenu';
export * from './modal';
export * from './currentTable';

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
| { type: 'tables/FETCH_REQUEST', +payload: ?IdString }
| { type: 'tables/FILL', +payload: TableNormalizePayload }
| { type: 'tables/CLEAR_TABLES' }
| { type: 'tables/SET_TABLENAME_SEARCH_KEY', +payload: ?IdString }
| { type: 'tables/FETCH_TABLE_DATA_REQUEST', +table: Table, +startIndex: ?number, +resolve: ?Function }
| { type: 'tables/SELECT_TABLE', +payload: string }
| { type: 'tables/SET_TABLE_DATA', +payload: TableDataNormalizedPayload }
| { type: 'tables/RESET_SELECT_TABLE' }
| { type: 'tables/DROP_TABLE_REQUEST', +payload: Object }
| { type: 'tables/DROP_TABLE', +payload: IdString }
| { type: 'tables/TRUNCATE_TABLE_REQUEST', +payload: Object }
| { type: 'tables/TRUNCATE_TABLE', +payload: IdString }
| { type: 'tables/SET_DATA_FOR_MEASURE', +payload: { dataForMeasure: DataForMeasure, name: IdString } }
| { type: 'tables/SET_MEASURE_WIDTH', +payload: { tableName: IdString, width: number, key: string } }
| { type: 'tables/GET_TABLE_SCHEMA', +payload: Table }
| { type: 'tables/SET_TABLE_SCHEMA', +payload: {id: IdString, structureTable: {} } }
| { type: 'ui/SET_CONNECTED_STATE', +payload: boolean }
| { type: 'ui/SET_CONNECTION_ERROR', +payload: string }
| { type: 'ui/TOGGLE_MENU', +payload: boolean }
| { type: 'ui/TOGGLE_CONNECTING_LADDA', +payload: boolean }
| { type: 'ui/TOGGLE_IS_FETCH_TABLES', +payload: boolean }
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
    +byName: TablesIndexedMap,
    +allNames: TablesNames,
    +meta: TablesMetaState
  }
};

export type Store = ReduxStore<State, Action>;
export type Dispatch = ReduxDispatch<Action>;
