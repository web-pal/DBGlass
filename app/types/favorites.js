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
