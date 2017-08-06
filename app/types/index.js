// @flow
import type { Store as ReduxStore, Dispatch as ReduxDispatch } from 'redux';

import type {
  FavoriteAction, FavoritesIndexedMap,
  FavoritesIds, FavoritesMetaState,
} from './favorites';
import type {
  ContextMenuState, ContextMenuAction,
} from './contextMenu';
import type {
  ModalState, ModalAction,
} from './modal';
import type {
  TableAction, TablesIndexedMap,
  TablesNames, TablesMetaState,
} from './tables';
import type {
  UiState, UiAction,
} from './ui';

export * from './favorites';
export * from './tables';
export * from './ui';
export * from './contextMenu';
export * from './modal';
export * from './currentTable';

export type IdString = string;

export type Action =
  { type: 'CLEAR_ALL_REDUCERS' }
| FavoriteAction
| TableAction
| UiAction
| ModalAction
| ContextMenuAction
| any
;

export type State = {
  +ui: UiState,
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
