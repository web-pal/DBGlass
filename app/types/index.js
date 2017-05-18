// @flow
import type { Store as ReduxStore, Dispatch as ReduxDispatch } from 'redux';
import type {
  Favorite, FavoritesIndexedMap,
  FavoriteNormalizePayload, FavoritesIds, FavoritesMetaState,
} from './favorites';
import type { TableNormalizePayload } from './tables';
import type { uiState } from './ui';

export * from './favorites';
export * from './tables';
export * from './ui';

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
| { type: 'ui/SET_CONNECTED_STATE', +payload: boolean }
| { type: 'tables/FETCH_REQUEST' }
| { type: 'tables/FILL', +payload: TableNormalizePayload }
| Object
;


export type State = {
  +ui: uiState,
  +favorites: {
    +byId: FavoritesIndexedMap,
    +allIds: FavoritesIds,
    +meta: FavoritesMetaState
  }
};


export type Store = ReduxStore<State, Action>;
export type Dispatch = ReduxDispatch<Action>;
