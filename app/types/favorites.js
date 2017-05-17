// @flow
export type IdString = string;
export type FavoritesIds = Array<IdString>;

export type Favorite = {
  id: ?string,
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
  useSSH: boolean
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
