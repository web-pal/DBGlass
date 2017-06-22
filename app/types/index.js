// @flow
import type { Store as ReduxStore, Dispatch as ReduxDispatch } from 'redux';
import type {
  Favorite, FavoritesIndexedMap,
  FavoriteNormalizePayload, FavoritesIds, FavoritesMetaState,
  FavoriteTablesQuantity,
} from './favorites';
import type { ContextMenuState } from './contextMenu';
import type { ModalState } from './modal';

import type {
  TableNormalizePayload, TablesIndexedMap,
  TablesNames, TablesMetaState,
  Table, DataForMeasure,
  RowsCount, ForeignKey,
} from './tables';
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
| { type: 'tables/FETCH_REQUEST' }
| { type: 'tables/FILL', +payload: TableNormalizePayload }
| { type: 'tables/CLEAR_TABLES' }
| { type: 'tables/SET_TABLENAME_SEARCH_KEY', +payload: ?IdString }
| { type: 'tables/FETCH_TABLE_DATA_REQUEST', +payload: { table: Table, startIndex: ?number, resolve: ?Function } }
| { type: 'tables/SELECT_TABLE', +payload: string }
| { type: 'tables/SET_TABLE_DATA', +payload: { data: TableDataNormalizedPayload, tableName: IdString } }
| { type: 'tables/RESET_SELECT_TABLE' }
| { type: 'tables/DROP_TABLE_REQUEST', +payload: { tableName: string, isCascade: boolean } }
| { type: 'tables/DROP_TABLE', +payload: { tableName: IdString } }
| { type: 'tables/TRUNCATE_TABLE_REQUEST', +payload: Object }
| { type: 'tables/TRUNCATE_TABLE', +payload: IdString }
| { type: 'tables/SET_DATA_FOR_MEASURE', +payload: { dataForMeasure: DataForMeasure, tableName: string } }
| { type: 'tables/SET_MEASURE_WIDTH', +payload: { tableName: IdString, width: number, key: string } }
| { type: 'tables/GET_TABLE_SCHEMA', +payload: Table }
| { type: 'tables/SET_TABLE_SCHEMA', +payload: { tableName: IdString, structureTable: Object } }
| { type: 'tables/SET_TABLES_FOREIGN_KEYS', +payload: Array<ForeignKey> }
| { type: 'tables/SET_ROWS_COUNT', +payload: RowsCount }
| { type: 'tables/CLEAR_CURRENT_TABLE', +payload: string }
| { type: 'tables/CHANGE_VIEW_MODE', +payload: boolean }
| { type: 'ui/SET_CONNECTED_STATE', +payload: boolean }
| { type: 'ui/SET_CONNECTION_ERROR', +payload: string }
| { type: 'ui/TOGGLE_IS_FETCH_TABLES_DATA', +payload: string }
| { type: 'ui/TOGGLE_MENU', +payload: boolean }
| { type: 'ui/TOGGLE_CONNECTING_LADDA', +payload: boolean }
| { type: 'ui/TOGGLE_IS_FETCH_TABLES', +payload: boolean }
| { type: 'ui/APP_QUIT_REQUEST' }
| { type: 'contextMenu/TOGGLE_CONTEXT_MENU', +payload: ContextMenuState}
| { type: 'modal/SHOW_DROP_TABLE_MODAL', +payload: { tableName: string } }
| { type: 'modal/HIDE_DROP_TABLE_MODAL' }
| { type: 'modal/SET_DROP_TABLE_MODAL_ERROR', +payload: { errorMessage: string } }
| { type: 'modal/SHOW_TRUNCATE_TABLE_MODAL', +payload: { tableName: string } }
| { type: 'modal/HIDE_TRUNCATE_TABLE_MODAL' }
| { type: 'modal/SET_TRUNCATE_TABLE_MODAL_ERROR', +payload: { errorMessage: string } }
| { type: 'modal/SHOW_ERROR_MODAL', +payload: { errorMessage: string } }
| { type: 'modal/HIDE_ERROR_MODAL' }
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
