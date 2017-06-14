import { fork } from 'redux-saga/effects';

import {
  fetchFavorites, selectFavorite,
  saveFavorite, removeFavorite,
  saveFavouriteTablesQuantity,
} from './favorites';
import {
  fetchTables,
  fetchTableDataRequest,
  dropTableRequest,
  truncateTableRequest,
  getTableSchemaWatch,
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

    fork(fetchTables),
    fork(fetchTableDataRequest),
    fork(dropTableRequest),
    fork(truncateTableRequest),
    fork(getTableSchemaWatch),
  ];
}
