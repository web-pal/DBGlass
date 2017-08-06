// @flow
import type { IdString } from './';

export type FavoritesIds = Array<IdString>;

export type Favorite = {
  id: ?IdString,
  connectionName: ?string,
  user: ?string,
  password: ?string,
  address: ?string,
  database: ?string,
  port: number,
  ssl: boolean,
  sshUsername: ?string,
  sshHost: ?string,
  sshPort: number,
  sshAuthType: string,
  sshPassword: ?string,
  sshKeyPassword: ?string,
  privateKey: ?string,
  useSSH: boolean,
  tablesQuantity: ?number
};
export type Favorites = Array<Favorite>;

export type FavoritesIndexedMap = {
  [number]: Favorite
};

export type FavoriteNormalizePayload = {
  ids: FavoritesIds,
  map: FavoritesIndexedMap
};

export type FavoritesMetaState = {
  currentFavoriteId: ?string
};

export type FavoriteTablesQuantity = {
  currentFavoriteId: string,
  quantity: number
};

export type FavoriteAction =
  { type: 'favorites/FETCH_REQUEST' }
| { type: 'favorites/ADD_REQUEST', +payload: Favorite }
| { type: 'favorites/REMOVE_REQUEST', +payload: IdString }
| { type: 'favorites/SELECT_REQUEST', +payload: IdString }
| { type: 'favorites/FILL', +payload: FavoriteNormalizePayload }
| { type: 'favorites/SELECT', +payload: ?IdString }
| { type: 'favorites/REMOVE', +payload: IdString }
| { type: 'favorites/ADD_FAVORITE_TABLES_QUANTITY', +payload: FavoriteTablesQuantity }
;
