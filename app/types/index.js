// @flow
import type { Store as ReduxStore, Dispatch as ReduxDispatch } from 'redux';
import type {
  Favorite, FavoritesIndexedMap,
  FavoriteNormalizePayload, FavoritesIds, FavoritesMetaState,
  FavoriteTablesQuantity,
} from './favorites';

import type { TableNormalizePayload, TablesIndexedMap, TablesIds, TablesMetaState, Table } from './tables';
import type { TableDataNormalizedPayload } from './currentTable';

import type { uiState, dataForMeasure } from './ui';

export * from './favorites';
export * from './tables';
export * from './ui';
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
| { type: 'tables/FETCH_TABLE_DATA_REQUEST', +payload: Table }
| { type: 'tables/SELECT_TABLE', +payload: string }
| { type: 'tables/SET_TABLE_DATA', +payload: TableDataNormalizedPayload }
| { type: 'tables/RESET_SELECT_TABLE' }
| { type: 'ui/SET_CONNECTED_STATE', +payload: boolean }
| { type: 'ui/SET_CONNECTION_ERROR', +payload: string }
| { type: 'ui/TOGGLE_MENU', +payload: boolean }
| { type: 'ui/TOGGLE_CONNECTING_LADDA', +payload: boolean }
| { type: 'ui/TOGGLE_IS_FETCH_TABLES', +payload: boolean }
| { type: 'ui/SET_DATA_FOR_MEASURE', +payload: dataForMeasure }
| { type: 'ui/SET_MEASURE_WIDTH', +payload: { width: number, key: string } }
| Object
;


export type State = {
  +ui: uiState,
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
