// @flow
import type { Store as ReduxStore, Dispatch as ReduxDispatch } from 'redux';
import type {
  IdString, Favorite, FavoritesIndexedMap,
  FavoriteNormalizePayload, FavoritesIds, FavoritesMetaState,
} from './favorites';
import type { uiState } from './ui';

export * from './favorites';
export * from './ui';

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
