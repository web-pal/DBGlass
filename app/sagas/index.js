import { fork } from 'redux-saga/effects';

import {
  fetchFavorites, selectFavorite,
  saveFavorite, removeFavorite,
  saveFavouriteTablesQuantity,
} from './favorites';
import {
  fetchTablesRequest,
  fetchTableDataRequest,
  dropTableRequest,
  truncateTableRequest,
  getTableSchemaRequest,
} from './tables';
import { startConnect, appQuit, onDisconnect } from './connect';

export default function* root() {
  yield [
    fork(fetchFavorites),
    fork(saveFavorite),
    fork(removeFavorite),
    fork(selectFavorite),
    fork(saveFavouriteTablesQuantity),

    fork(startConnect),
    fork(onDisconnect),
    fork(appQuit),

    fork(fetchTablesRequest),
    fork(fetchTableDataRequest),
    fork(dropTableRequest),
    fork(truncateTableRequest),
    fork(getTableSchemaRequest),
  ];
}
