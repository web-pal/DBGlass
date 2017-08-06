import { all, fork } from 'redux-saga/effects';

import {
  fetchFavorites, selectLastSelectedFavorite,
  fetchFavoritesRequest, selectFavorite,
  saveFavorite, removeFavorite,
  saveFavouriteTablesQuantity,
} from './favorites';
import {
  fetchTablesRequest,
  fetchTableDataRequest,
  dropTableRequest,
  truncateTableRequest,
  fetchTableSchemaRequest,
} from './tables';
import { connectRequest, appQuit, onDisconnect } from './connect';


export default function* root() {
  yield fork(fetchFavorites);
  yield fork(selectLastSelectedFavorite);
  yield all([
    fork(fetchFavoritesRequest),
    fork(saveFavorite),
    fork(removeFavorite),
    fork(selectFavorite),
    fork(saveFavouriteTablesQuantity),

    fork(connectRequest),
    fork(onDisconnect),
    fork(appQuit),

    fork(fetchTablesRequest),
    fork(fetchTableDataRequest),
    fork(dropTableRequest),
    fork(truncateTableRequest),
    fork(fetchTableSchemaRequest),
  ]);
}
